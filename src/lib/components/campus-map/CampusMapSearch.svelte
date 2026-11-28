<script lang="ts">
  import type { MapSearchMatch } from '#lib/map-search';
  import { bindSearchShortcut } from '#lib/search-shortcut';

  interface Props {
    query: string;
    matches: readonly MapSearchMatch[];
    onQueryChange: (nextQuery: string) => void;
    onSelectMatch: (match: MapSearchMatch) => void;
    onClear: () => void;
  }

  const { query, matches, onQueryChange, onSelectMatch, onClear }: Props = $props();

  const uid = $props.id();
  const listboxId = `${uid}-listbox`;
  const searchInputId = `${uid}-input`;

  let dropdownOpen = $state(false);
  let activeMatchIndex = $state(-1);
  let wrapperEl: HTMLDivElement | undefined = $state();
  let inputEl: HTMLInputElement | undefined = $state();

  const showDropdown = $derived(dropdownOpen && query.trim().length > 0);
  const activeMatch = $derived(activeMatchIndex >= 0 ? matches[activeMatchIndex] : undefined);
  const activeOptionId = $derived(
    activeMatch ? `map-match-${activeMatch.kind}-${activeMatch.id}` : undefined,
  );

  $effect(() => bindSearchShortcut(() => inputEl?.focus()));

  $effect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (wrapperEl && event.target instanceof Node && !wrapperEl.contains(event.target)) {
        dropdownOpen = false;
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  });

  $effect(() => {
    if (!activeOptionId) return;
    document.getElementById(activeOptionId)?.scrollIntoView({ block: 'nearest' });
  });

  function handleSelect(match: MapSearchMatch) {
    onSelectMatch(match);
    dropdownOpen = false;
    activeMatchIndex = -1;
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (!dropdownOpen || matches.length === 0) {
      if (event.key === 'ArrowDown' && matches.length > 0) {
        event.preventDefault();
        dropdownOpen = true;
        activeMatchIndex = 0;
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      activeMatchIndex = (activeMatchIndex + 1) % matches.length;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      activeMatchIndex = activeMatchIndex <= 0 ? matches.length - 1 : activeMatchIndex - 1;
    } else if (event.key === 'Enter' && activeMatch) {
      event.preventDefault();
      handleSelect(activeMatch);
    } else if (event.key === 'Escape') {
      dropdownOpen = false;
      activeMatchIndex = -1;
    }
  }
</script>

<div
  bind:this={wrapperEl}
  class="relative overflow-visible lg:overflow-hidden lg:rounded-3xl lg:border lg:border-border-subtle lg:bg-surface-card lg:shadow-geary-2"
>
  <div class="relative flex items-center">
    <svg
      class="pointer-events-none absolute left-4 h-4 w-4 text-ink-muted"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
    <input
      bind:this={inputEl}
      id={searchInputId}
      type="search"
      value={query}
      role="combobox"
      aria-label="Search offices, services, or buildings"
      aria-expanded={showDropdown}
      aria-controls={showDropdown && matches.length > 0 ? listboxId : undefined}
      aria-autocomplete="list"
      aria-activedescendant={activeOptionId}
      oninput={(event) => {
        onQueryChange((event.currentTarget as HTMLInputElement).value);
        dropdownOpen = true;
        activeMatchIndex = -1;
      }}
      onfocus={() => {
        if (query.trim()) dropdownOpen = true;
      }}
      onkeydown={handleKeyDown}
      placeholder="Search Map..."
      class="w-full rounded-full font-ui border border-border-subtle bg-surface-card py-3 pr-11 pl-11 text-sm text-ink-primary shadow-md placeholder:text-ink-muted focus:border-brand-crimson focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 lg:rounded-none lg:border-0 lg:bg-transparent lg:py-3.5 lg:shadow-none lg:focus:ring-0 [&::-webkit-search-cancel-button]:hidden"
    />
    {#if query}
      <button
        type="button"
        aria-label="Clear search"
        onclick={() => {
          onClear();
          dropdownOpen = false;
          activeMatchIndex = -1;
        }}
        class="absolute right-2 inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-surface-subtle hover:text-ink-primary focus-visible:outline-2 focus-visible:outline-brand-crimson"
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
    {:else}
      <kbd
        aria-hidden="true"
        class="pointer-events-none absolute right-3.5 hidden sm:inline-flex items-center justify-center rounded border border-border-subtle bg-surface-subtle px-1.5 py-0.5 font-mono text-xs font-medium text-ink-secondary"
      >
        /
      </kbd>
    {/if}
  </div>

  {#if showDropdown}
    <div class="absolute right-0 left-0 z-30 mt-2 max-h-72 overflow-y-auto overscroll-contain rounded-2xl border border-border-subtle bg-surface-card shadow-lg lg:static lg:mt-0 lg:max-h-64 lg:rounded-none lg:border-0 lg:border-t lg:shadow-none">
      {#if matches.length === 0}
        <div class="px-4 py-3 text-sm text-ink-secondary">
          No campus locations matched
          <span class="font-semibold text-ink-primary">"{query}"</span>.
        </div>
      {:else}
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Campus location search results"
          class="divide-y divide-border-subtle"
        >
          {#each matches as match, idx (`${match.kind}-${match.id}`)}
            {@const isActive = idx === activeMatchIndex}
            <li role="none">
              <button
                id={`map-match-${match.kind}-${match.id}`}
                type="button"
                role="option"
                aria-selected={isActive}
                onclick={() => handleSelect(match)}
                class={`flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors ${
                  isActive ? 'bg-brand-crimson-wash' : 'hover:bg-surface-subtle'
                }`}
              >
                <span
                  aria-hidden="true"
                  class="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-ink-secondary"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    class="h-3.5 w-3.5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10Z"
                    />
                    <circle cx="12" cy="11" r="2" />
                  </svg>
                </span>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-semibold text-ink-primary">
                    {match.name}
                  </p>
                  <p class="mt-0.5 truncate text-xs text-ink-secondary">
                    {#if match.kind === 'location'}
                      Inside
                      <span class="font-semibold text-brand-crimson">
                        {match.buildingName}
                      </span>{match.floor ? ` · ${match.floor}` : ''}
                    {:else}
                      Building
                    {/if}
                  </p>
                </div>
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}
</div>
