<script lang="ts">
  import type { CampusBuilding } from '../../../data/campus-map';
  import {
    getCollegeShortLabel,
    getLocationType,
    groupLocationsByFloor,
    partitionBuildingLocations,
  } from '#lib/map-search';

  type SheetSnap = 'collapsed' | 'half' | 'expanded';

  const COLLAPSED_HEIGHT_PX = 104;
  const HALF_HEIGHT_RATIO = 0.48;
  const EXPANDED_HEIGHT_RATIO = 0.82;
  const DESKTOP_MEDIA_QUERY = '(min-width: 1024px)';

  interface Props {
    selectedBuilding: CampusBuilding | null;
    highlightedLocationId: string | null;
    onClearSelection: () => void;
    containerEl: HTMLElement | undefined;
  }

  const { selectedBuilding, highlightedLocationId, onClearSelection, containerEl }: Props =
    $props();

  let openFloors = $state<Record<string, boolean>>({});
  let isDesktop = $state(false);
  let sheetSnap = $state<SheetSnap>('collapsed');
  let dragHeightPx = $state<number | null>(null);
  let locationListEl: HTMLUListElement | undefined = $state();
  let lastScrolledHighlight: string | null = null;

  let sheetDrag: {
    pointerId: number;
    startY: number;
    startHeight: number;
    moved: boolean;
  } | null = null;

  const partitionedLocations = $derived(
    selectedBuilding
      ? partitionBuildingLocations(selectedBuilding.locations)
      : { colleges: [], others: [] },
  );

  const groupedOthers = $derived(groupLocationsByFloor(partitionedLocations.others));
  const isMobileCollapsed = $derived(!isDesktop && sheetSnap === 'collapsed' && dragHeightPx === null);
  const locationCount = $derived(selectedBuilding?.locations.length ?? 0);

  const mobileSheetStyle = $derived(
    isDesktop
      ? undefined
      : `height: ${
          dragHeightPx !== null
            ? `${dragHeightPx}px`
            : sheetSnap === 'collapsed'
              ? `${COLLAPSED_HEIGHT_PX}px`
              : sheetSnap === 'half'
                ? `${HALF_HEIGHT_RATIO * 100}%`
                : `${EXPANDED_HEIGHT_RATIO * 100}%`
        }`,
  );

  $effect(() => {
    const mq = window.matchMedia(DESKTOP_MEDIA_QUERY);
    isDesktop = mq.matches;
    const onChange = (event: MediaQueryListEvent) => {
      isDesktop = event.matches;
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  });

  $effect(() => {
    const _buildingId = selectedBuilding?.id;
    const _highlightId = highlightedLocationId;
    void _highlightId;
    sheetSnap = _buildingId ? 'half' : 'collapsed';
    dragHeightPx = null;
  });

  $effect(() => {
    if (!selectedBuilding || !highlightedLocationId) return;
    const matchGroup = groupedOthers.floorGroups.find((g) =>
      g.locations.some((loc) => loc.id === highlightedLocationId),
    );
    if (!matchGroup) return;
    const key = `${selectedBuilding.id}:${matchGroup.floor}`;
    if (!openFloors[key]) {
      openFloors = { ...openFloors, [key]: true };
    }
  });

  $effect(() => {
    const _open = openFloors;
    const _snap = sheetSnap;
    const _bId = selectedBuilding?.id;
    void _open;
    void _snap;
    void _bId;

    if (!highlightedLocationId) {
      lastScrolledHighlight = null;
      return;
    }
    if (lastScrolledHighlight === highlightedLocationId) return;
    const listEl = locationListEl;
    if (!listEl) return;
    const matchEl = listEl.querySelector<HTMLElement>('[data-search-match="true"]');
    if (!matchEl) return;

    lastScrolledHighlight = highlightedLocationId;
    const rafId = requestAnimationFrame(() => {
      matchEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
    return () => cancelAnimationFrame(rafId);
  });

  function toggleFloor(key: string) {
    openFloors = { ...openFloors, [key]: !openFloors[key] };
  }

  function getContainerHeight(): number {
    return containerEl?.clientHeight ?? 600;
  }

  function getSnapHeightPx(snap: SheetSnap, containerHeight: number): number {
    if (snap === 'collapsed') return COLLAPSED_HEIGHT_PX;
    if (snap === 'half') return Math.round(containerHeight * HALF_HEIGHT_RATIO);
    return Math.round(containerHeight * EXPANDED_HEIGHT_RATIO);
  }

  function handleSheetPointerDown(event: PointerEvent) {
    if (isDesktop) return;
    if ((event.target as HTMLElement).closest('button[data-no-drag="true"]')) return;

    const containerHeight = getContainerHeight();
    const startHeight = getSnapHeightPx(sheetSnap, containerHeight);
    sheetDrag = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startHeight,
      moved: false,
    };
    try {
      (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    } catch {
      // Ignore synthetic events
    }
  }

  function handleSheetPointerMove(event: PointerEvent) {
    if (!sheetDrag || sheetDrag.pointerId !== event.pointerId) return;

    const dy = sheetDrag.startY - event.clientY;
    if (!sheetDrag.moved && Math.abs(dy) < 5) return;
    sheetDrag.moved = true;

    const containerHeight = getContainerHeight();
    const maxHeight = Math.round(containerHeight * 0.86);
    dragHeightPx = Math.min(maxHeight, Math.max(COLLAPSED_HEIGHT_PX, sheetDrag.startHeight + dy));
  }

  function handleSheetPointerEnd(event: PointerEvent) {
    if (!sheetDrag || sheetDrag.pointerId !== event.pointerId) return;

    try {
      const target = event.currentTarget as HTMLElement;
      if (target.hasPointerCapture(event.pointerId)) {
        target.releasePointerCapture(event.pointerId);
      }
    } catch {
      // Ignore synthetic events
    }

    if (sheetDrag.moved && dragHeightPx !== null) {
      const containerHeight = getContainerHeight();
      const collapsedPx = getSnapHeightPx('collapsed', containerHeight);
      const halfPx = getSnapHeightPx('half', containerHeight);
      const expandedPx = getSnapHeightPx('expanded', containerHeight);
      const dy = sheetDrag.startY - event.clientY;

      if (dy > 40) {
        sheetSnap = dragHeightPx > halfPx + 24 ? 'expanded' : 'half';
      } else if (dy < -40) {
        sheetSnap = dragHeightPx < halfPx - 24 ? 'collapsed' : 'half';
      } else {
        const distances: Array<[SheetSnap, number]> = [
          ['collapsed', Math.abs(dragHeightPx - collapsedPx)],
          ['half', Math.abs(dragHeightPx - halfPx)],
          ['expanded', Math.abs(dragHeightPx - expandedPx)],
        ];
        distances.sort((a, b) => a[1] - b[1]);
        sheetSnap = distances[0]?.[0] ?? 'collapsed';
      }
    }

    sheetDrag = null;
    dragHeightPx = null;
  }

  function cycleSheetSnap() {
    if (sheetSnap === 'collapsed') sheetSnap = 'half';
    else if (sheetSnap === 'half') sheetSnap = 'expanded';
    else sheetSnap = 'collapsed';
  }
</script>

<aside
  aria-live="polite"
  aria-label="Selected building locations"
  style={mobileSheetStyle}
  class={`pointer-events-auto absolute inset-x-0 bottom-0 z-20 flex flex-col overflow-hidden rounded-t-2xl border-t border-border-subtle bg-surface-card shadow-[0_-8px_24px_rgba(0,0,0,0.12)] lg:static lg:inset-auto lg:h-auto! lg:min-h-0 lg:max-h-full lg:rounded-2xl lg:border lg:shadow-md ${
    dragHeightPx === null ? 'transition-[height] duration-200 ease-out' : 'transition-none'
  }`}
>
  <div
    role="presentation"
    onpointerdown={handleSheetPointerDown}
    onpointermove={handleSheetPointerMove}
    onpointerup={handleSheetPointerEnd}
    onpointercancel={handleSheetPointerEnd}
    class="shrink-0 touch-none px-4 pt-2.5 pb-3 lg:touch-auto lg:px-4 lg:pt-3.5 lg:pb-3"
  >
    <button
      type="button"
      onclick={cycleSheetSnap}
      aria-label={sheetSnap === 'expanded'
        ? 'Collapse building locations sheet'
        : 'Expand building locations sheet'}
      class="mx-auto mb-2.5 flex h-4 w-16 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-brand-crimson lg:hidden"
    >
      <span class="h-1.5 w-10 rounded-full bg-border-strong" aria-hidden="true"></span>
    </button>

    {#if selectedBuilding}
      <div>
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <h2 class="truncate font-heading text-lg font-bold leading-snug text-ink-primary lg:text-xl">
              {selectedBuilding.name}
            </h2>
            <p class="mt-0.5 text-xs text-ink-secondary">
              {locationCount} {locationCount === 1 ? 'location' : 'locations'}
            </p>
          </div>
          <button
            type="button"
            data-no-drag="true"
            onclick={onClearSelection}
            aria-label="Close building details"
            class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-ink-secondary transition-colors hover:bg-border-subtle hover:text-ink-primary focus-visible:outline-2 focus-visible:outline-brand-crimson"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="h-4 w-4"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {#if selectedBuilding.colleges && selectedBuilding.colleges.length > 0}
          <ul
            aria-label="Colleges in this building"
            class={`mt-2.5 flex-wrap gap-1.5 ${isMobileCollapsed ? 'hidden lg:flex' : 'flex'}`}
          >
            {#each selectedBuilding.colleges as college (college.id)}
              {@const isHighlightedCollege = highlightedLocationId === college.id}
              <li
                title={college.name}
                aria-label={college.name}
                data-search-match={isHighlightedCollege ? 'true' : undefined}
                class={`rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors ${
                  isHighlightedCollege
                    ? 'border-brand-crimson bg-brand-crimson text-white'
                    : 'border-brand-crimson/20 bg-brand-crimson-wash text-brand-crimson'
                }`}
              >
                {getCollegeShortLabel(college)}
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    {:else}
      <div>
        <p class="font-heading text-sm font-bold text-ink-primary lg:text-base">
          Main Campus
        </p>
        <p class="mt-0.5 text-xs text-ink-secondary">
          Select any building on the map to see the locations inside.
        </p>
      </div>
    {/if}
  </div>

  {#if selectedBuilding}
    <div
      class={`min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-border-subtle px-4 py-3 [scrollbar-gutter:stable] ${
        isMobileCollapsed ? 'hidden lg:block' : 'block'
      }`}
    >
      {#if selectedBuilding.locations.length > 0}
        <ul bind:this={locationListEl} class="space-y-2.5 pb-2">
          {#each groupedOthers.floorGroups as group (`${selectedBuilding.id}:${group.floor}`)}
            {@const key = `${selectedBuilding.id}:${group.floor}`}
            {@const isOpen = Boolean(openFloors[key])}
            <li class="overflow-hidden rounded-lg border border-border-subtle bg-canvas-paper">
              <button
                type="button"
                aria-expanded={isOpen}
                onclick={() => toggleFloor(key)}
                class="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-semibold text-ink-primary transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-crimson"
              >
                <span>{group.floor}</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  aria-hidden="true"
                  class={`h-4 w-4 shrink-0 text-ink-secondary transition-transform duration-150 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {#if isOpen}
                <ul class="space-y-2 border-t border-border-subtle bg-surface-card p-2.5">
                  {#each group.locations as loc (loc.id)}
                    {@const isHighlightedLoc = highlightedLocationId === loc.id}
                    <li
                      data-search-match={isHighlightedLoc ? 'true' : undefined}
                      class={`rounded-lg border p-3 transition-colors ${
                        isHighlightedLoc
                          ? 'border-brand-crimson bg-brand-crimson-wash/50 ring-1 ring-brand-crimson'
                          : 'border-border-subtle bg-canvas-paper'
                      }`}
                    >
                      <p class="text-sm font-semibold text-ink-primary">{loc.name}</p>
                      <p class="mt-0.5 text-xs font-medium text-ink-secondary">
                        {getLocationType(loc)}
                      </p>
                    </li>
                  {/each}
                </ul>
              {/if}
            </li>
          {/each}
        </ul>
      {:else}
        <p class="text-sm text-ink-secondary">
          No listed locations for this building yet.
        </p>
      {/if}
    </div>
  {/if}
</aside>
