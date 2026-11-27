<script lang="ts">
  import {
    CAMPUS_2_PATHS,
    CAMPUS_BUILDINGS,
    CAMPUS_GATES,
    CAMPUS_PARKS,
    CAMPUS_PATHS,
    CAMPUS_PERIMETER_PATH,
    SHOW_CAMPUS_2,
    type CampusBuilding,
  } from '../../data/campus-map';
  import {
    DEFAULT_MAP_VIEWBOX,
    searchCampusLocations,
    type MapSearchMatch,
    type ViewBoxRect,
  } from '#lib/map-search';
  import BuildingInspector from './campus-map/BuildingInspector.svelte';
  import CampusMapSearch from './campus-map/CampusMapSearch.svelte';
  import { createMapViewport } from './campus-map/viewport.svelte';

  function formatViewBox(vb: ViewBoxRect): string {
    return `${vb.x} ${vb.y} ${vb.width} ${vb.height}`;
  }

  const buildingById = new Map<string, CampusBuilding>();
  for (const b of CAMPUS_BUILDINGS) {
    buildingById.set(b.id, b);
  }

  let query = $state('');
  let selectedBuildingId = $state<string | null>(null);
  let highlightedLocationId = $state<string | null>(null);
  let hoveredBuildingId = $state<string | null>(null);
  let mapContainerEl: HTMLElement | undefined = $state();

  const viewport = createMapViewport();

  $effect(() => {
    const svg = viewport.svgEl;
    if (!svg) return;
    return viewport.attachWheelAndTouch(svg);
  });

  const selectedBuilding = $derived(
    selectedBuildingId ? (buildingById.get(selectedBuildingId) ?? null) : null,
  );

  const searchMatches = $derived(
    query.trim() ? searchCampusLocations(CAMPUS_BUILDINGS, query).slice(0, 12) : [],
  );

  const matchingBuildingIds = $derived.by(() => {
    const ids = new Set<string>();
    if (query.trim()) {
      for (const m of searchMatches) ids.add(m.buildingId);
    }
    return ids;
  });

  const isAtDefaultView = $derived(
    !viewport.isZoomed &&
      viewport.viewBox.x === DEFAULT_MAP_VIEWBOX.x &&
      viewport.viewBox.y === DEFAULT_MAP_VIEWBOX.y,
  );

  function selectBuilding(
    buildingId: string,
    options?: { locationId?: string | null; centerMap?: boolean },
  ) {
    const building = buildingById.get(buildingId);
    if (!building) return;

    selectedBuildingId = building.id;
    highlightedLocationId = options?.locationId ?? null;

    if (options?.centerMap) {
      viewport.focusBuilding(building);
    }
  }

  function handleSelectMatch(match: MapSearchMatch) {
    query = match.name;
    selectBuilding(match.buildingId, {
      locationId: match.kind === 'location' ? match.id : null,
      centerMap: true,
    });
  }

  function handleQueryChange(nextQuery: string) {
    query = nextQuery;
    if (!nextQuery.trim()) {
      highlightedLocationId = null;
    }
  }

  function handleClearSearch() {
    query = '';
    highlightedLocationId = null;
  }

  function handleClearSelection() {
    selectedBuildingId = null;
    highlightedLocationId = null;
  }

  function handleBuildingClick(buildingId: string) {
    if (viewport.consumeDragClick()) return;
    selectBuilding(buildingId, { locationId: null, centerMap: false });
  }
</script>

<section
  bind:this={mapContainerEl}
  aria-label="Interactive BulSU Malolos Main Campus Map"
  class="relative h-full w-full overflow-hidden bg-surface-subtle select-none"
>
  <svg
    bind:this={viewport.svgEl}
    viewBox={formatViewBox(viewport.viewBox)}
    role="group"
    aria-label="Interactive 2D map of BulSU Malolos Main Campus buildings and pathways"
    onpointerdown={viewport.handlePointerDown}
    onpointermove={viewport.handlePointerMove}
    onpointerup={viewport.handlePointerEnd}
    onpointercancel={viewport.handlePointerEnd}
    onpointerleave={viewport.handlePointerLeave}
    style="touch-action: none"
    class={`block h-full w-full select-none touch-none ${
      viewport.isDragging ? 'cursor-grabbing' : 'cursor-grab'
    }`}
  >
    <path
      d={CAMPUS_PERIMETER_PATH}
      fill="var(--color-canvas-paper)"
      stroke="var(--color-border-strong)"
      stroke-width="2.5"
      style="pointer-events: none"
    />

    {#each CAMPUS_PARKS as park (`${park.name}-fill`)}
      <path
        d={park.svgPath}
        fill="var(--color-map-park-fill)"
        stroke="var(--color-map-park-stroke)"
        stroke-width="1.5"
        style="pointer-events: none"
      />
    {/each}

    <g
      fill="none"
      stroke="var(--color-border-subtle)"
      stroke-width="5"
      stroke-linecap="round"
      stroke-linejoin="round"
      style="pointer-events: none"
    >
      {#each CAMPUS_PATHS as d, index (index)}
        <path {d} />
      {/each}
      {#if SHOW_CAMPUS_2}
        {#each CAMPUS_2_PATHS as d, index (`c2-${index}`)}
          <path {d} />
        {/each}
      {/if}
    </g>

    <g
      fill="none"
      stroke="var(--color-surface-card)"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      style="pointer-events: none"
    >
      {#each CAMPUS_PATHS as d, index (index)}
        <path {d} />
      {/each}
      {#if SHOW_CAMPUS_2}
        {#each CAMPUS_2_PATHS as d, index (`c2-${index}`)}
          <path {d} />
        {/each}
      {/if}
    </g>

    <g aria-hidden="true" style="pointer-events: none">
      {#each CAMPUS_PARKS as park (`${park.name}-label`)}
        <text
          x={park.center.x}
          y={park.center.y}
          text-anchor="middle"
          dominant-baseline="central"
          font-size="9"
          font-weight="600"
          fill="var(--color-map-park-ink)"
          stroke="var(--color-map-park-fill)"
          stroke-width="3"
          style="paint-order: stroke"
        >
          {park.name}
        </text>
      {/each}
      <text
        transform="translate(239.4, 519.2) rotate(-42)"
        text-anchor="middle"
        dominant-baseline="central"
        font-size="8"
        font-weight="600"
        letter-spacing="0.04em"
        fill="var(--color-ink-secondary)"
        stroke="var(--color-canvas-paper)"
        stroke-width="3"
        style="paint-order: stroke"
      >
        Lover's Lane
      </text>
      <text
        transform="translate(225.9, 294.1) rotate(-43.6)"
        text-anchor="middle"
        dominant-baseline="central"
        font-size="8"
        font-weight="600"
        letter-spacing="0.04em"
        fill="var(--color-ink-secondary)"
        stroke="var(--color-canvas-paper)"
        stroke-width="3"
        style="paint-order: stroke"
      >
        Mojon Diversion Road
      </text>
      {#if SHOW_CAMPUS_2}
        <text
          transform="translate(686.3, -135.3) rotate(-43)"
          text-anchor="middle"
          dominant-baseline="central"
          font-size="8"
          font-weight="600"
          letter-spacing="0.04em"
          fill="var(--color-ink-secondary)"
          stroke="var(--color-canvas-paper)"
          stroke-width="3"
          style="paint-order: stroke"
        >
          Mojon Diversion Road
        </text>
      {/if}
    </g>

    {#each CAMPUS_BUILDINGS as building (building.id)}
      {@const isSelected = selectedBuildingId === building.id}
      {@const isHovered = hoveredBuildingId === building.id}
      {@const isHighlighted = matchingBuildingIds.has(building.id)}
      {@const fill = isSelected
        ? 'var(--color-brand-crimson-solid)'
        : isHighlighted
          ? 'var(--color-brand-gold-wash)'
          : isHovered
            ? 'var(--color-brand-crimson-wash)'
            : 'var(--color-surface-card)'}
      {@const stroke = isSelected
        ? 'var(--color-brand-gold)'
        : isHighlighted
          ? 'var(--color-brand-gold)'
          : isHovered
            ? 'var(--color-brand-crimson)'
            : 'var(--color-border-strong)'}
      {@const strokeWidth = isSelected ? 3 : isHighlighted ? 2.6 : isHovered ? 2.2 : 1.6}

      <a
        href={`#${building.id}`}
        data-building-id={building.id}
        aria-label={`${building.name} (${building.shortLabel}), ${building.locations.length} listed ${building.locations.length === 1 ? 'location' : 'locations'}`}
        aria-current={isSelected ? 'true' : undefined}
        onclick={(event) => {
          event.preventDefault();
          handleBuildingClick(building.id);
        }}
        onkeydown={(event) => {
          if (event.key === ' ') {
            event.preventDefault();
            selectBuilding(building.id, { locationId: null, centerMap: false });
          }
        }}
        onmouseenter={() => {
          hoveredBuildingId = building.id;
        }}
        onmouseleave={() => {
          hoveredBuildingId = null;
        }}
        style="touch-action: none"
        class="cursor-pointer focus-visible:outline-2 focus-visible:outline-brand-crimson"
      >
        {#if building.svgPath.includes(' M')}
          <path d={building.svgPath.split(' M')[0]} fill="transparent" />
        {/if}
        <path
          d={building.svgPath}
          {fill}
          fill-rule="evenodd"
          {stroke}
          stroke-width={strokeWidth}
          stroke-linejoin="round"
        />
      </a>
    {/each}

    <g aria-hidden="true" style="pointer-events: none">
      {#each CAMPUS_BUILDINGS as building (`${building.id}-label`)}
        {@const isSelected = selectedBuildingId === building.id}
        {@const isHovered = hoveredBuildingId === building.id}
        {@const isHighlighted = matchingBuildingIds.has(building.id)}
        {@const textFill = isSelected ? '#FFFFFF' : 'var(--color-ink-primary)'}
        {@const textStroke = isSelected
          ? 'var(--color-brand-crimson-solid)'
          : isHighlighted
            ? 'var(--color-brand-gold-wash)'
            : isHovered
              ? 'var(--color-brand-crimson-wash)'
              : 'var(--color-surface-card)'}

        <text
          x={building.center.x}
          y={building.center.y}
          text-anchor="middle"
          dominant-baseline="central"
          font-size="10"
          font-weight="700"
          fill={textFill}
          stroke={textStroke}
          stroke-width="3"
          style="paint-order: stroke"
        >
          {building.shortLabel}
        </text>
      {/each}
    </g>

    {#each CAMPUS_GATES as gate (gate.name)}
      <g transform={`translate(${gate.x}, ${gate.y})`} style="pointer-events: none">
        <circle
          r="6"
          fill="var(--color-brand-crimson-solid)"
          stroke="var(--color-surface-card)"
          stroke-width="2"
        />
        <rect
          x="10"
          y="-10"
          width={gate.name.length * 5.8 + 10}
          height="19"
          rx="4"
          fill="var(--color-ink-primary)"
        />
        <text
          x="15"
          y="0"
          dominant-baseline="central"
          font-size="9.5"
          font-weight="600"
          fill="var(--color-canvas-paper)"
        >
          {gate.name}
        </text>
      </g>
    {/each}

    <g style="pointer-events: none">
      <text
        x="64"
        y="674"
        transform="rotate(52 64 674)"
        font-size="10.5"
        font-weight="700"
        letter-spacing="0.08em"
        fill="var(--color-ink-muted)"
      >
        MACARTHUR HIGHWAY
      </text>
    </g>
  </svg>

  <div class="pointer-events-none absolute inset-0 z-20 flex flex-col lg:right-auto lg:w-[392px] lg:gap-2.5 lg:p-4 xl:w-[412px]">
    <div class="pointer-events-auto shrink-0 p-3 pb-0 lg:p-0">
      <CampusMapSearch
        {query}
        matches={searchMatches}
        onQueryChange={handleQueryChange}
        onSelectMatch={handleSelectMatch}
        onClear={handleClearSearch}
      />
    </div>

    <BuildingInspector
      {selectedBuilding}
      {highlightedLocationId}
      onClearSelection={handleClearSelection}
      containerEl={mapContainerEl}
    />
  </div>

  <div class="pointer-events-none absolute right-3 bottom-20 z-10 flex flex-col items-center gap-2 lg:right-4 lg:bottom-4">
    <div
      role="img"
      aria-label="Compass pointing North"
      title="North"
      class="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle bg-surface-card/95 shadow-md"
    >
      <svg viewBox="-20 -20 40 40" class="h-8 w-8" aria-hidden="true">
        <polygon points="0,-13 4.5,3 0,-0.5 -4.5,3" fill="var(--color-brand-crimson)" />
        <text
          x="0"
          y="12"
          text-anchor="middle"
          font-size="8.5"
          font-weight="700"
          fill="var(--color-ink-primary)"
        >
          N
        </text>
      </svg>
    </div>

    <div
      class="pointer-events-auto flex flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface-card/95 shadow-md divide-y divide-border-subtle"
      role="group"
      aria-label="Map zoom controls"
    >
    <button
      type="button"
      aria-label="Zoom in map"
      onclick={viewport.zoomIn}
      class="inline-flex h-10 w-10 items-center justify-center text-base font-bold text-ink-primary transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-crimson"
    >
      +
    </button>
    <button
      type="button"
      aria-label="Zoom out map"
      onclick={viewport.zoomOut}
      class="inline-flex h-10 w-10 items-center justify-center text-base font-bold text-ink-primary transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-crimson"
    >
      -
    </button>
    <button
      type="button"
      aria-label="Reset map view"
      disabled={isAtDefaultView}
      onclick={viewport.resetView}
      title="Reset map view"
      class="inline-flex h-10 w-10 items-center justify-center text-ink-primary transition-colors hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-crimson"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        class="h-4 w-4"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3 12a9 9 0 1 0 3-6.7L3 8m0-5v5h5"
        />
      </svg>
    </button>
    </div>
  </div>

  <div
    aria-label="Map legend"
    class="pointer-events-auto absolute right-16 bottom-4 z-10 hidden items-center gap-3.5 rounded-full border border-border-subtle bg-surface-card/95 px-4 py-2 text-xs text-ink-secondary shadow-md backdrop-blur-xs lg:flex"
  >
    <span class="inline-flex items-center gap-1.5">
      <span class="h-2.5 w-2.5 rounded-xs border border-brand-gold bg-brand-crimson-solid"></span>
      Selected
    </span>
    <span class="inline-flex items-center gap-1.5">
      <span class="h-2.5 w-2.5 rounded-xs border border-brand-gold bg-brand-gold-wash"></span>
      Search match
    </span>
    <span class="inline-flex items-center gap-1.5">
      <span class="h-2.5 w-2.5 rounded-xs border border-border-strong bg-surface-card"></span>
      Building
    </span>
    <span class="inline-flex items-center gap-1.5">
      <span class="h-2.5 w-2.5 rounded-xs border border-[var(--color-map-park-stroke)] bg-[var(--color-map-park-fill)]"></span>
      Park
    </span>
    <span class="inline-flex items-center gap-1.5">
      <span class="h-2.5 w-2.5 rounded-full bg-brand-crimson-solid"></span>
      Campus Gate
    </span>
  </div>
</section>
