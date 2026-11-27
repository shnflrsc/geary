<script lang="ts">
  import { replaceState } from '$app/navigation';
  import { page } from '$app/state';
  import { tick } from 'svelte';
  import {
    ACADEMIC_CALENDAR_EVENTS,
    CALENDAR_CATEGORIES,
    CALENDAR_CATEGORY_MAP,
    type CalendarCategory,
    type CalendarEvent,
  } from '../../data/academic-calendar';
  import {
    buildMonthGrid,
    CALENDAR_MONTHS,
    countMatchingEventsByMonth,
    filterCalendarEvents,
    formatIsoDateReadable,
    getDefaultCalendarMonth,
    getDefaultSelectedDate,
    getTodayIso,
    isValidCalendarMonth,
    parseEventDateSpans,
  } from '#lib/calendar';
  import { bindSearchShortcut } from '#lib/search-shortcut';

  const WEEKDAYS_UPPER = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;
  const WEEKDAYS_MOBILE = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

  function splitHighlightedParts(
    text: string,
    terms: readonly string[],
  ): Array<{ text: string; match: boolean }> {
    if (terms.length === 0) return [{ text, match: false }];
    const escaped = terms
      .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .sort((a, b) => b.length - a.length);
    const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');
    return text.split(pattern).map((part, index) => ({
      text: part,
      match: index % 2 === 1,
    }));
  }

  function formatEventCardDate(event: CalendarEvent): string {
    const [monthName = '', year = ''] = event.monthLabel.split(' ');
    if (event.dateText.trim().toUpperCase() === 'TBA') {
      return `${monthName} ${year} · TBA`.trim();
    }
    return `${monthName} ${event.dateText}, ${year}`.trim();
  }

  function formatSearchResultDate(event: CalendarEvent): string {
    const [monthName = '', year = ''] = event.monthLabel.split(' ');
    if (event.dateText.trim().toUpperCase() === 'TBA') {
      return `${monthName} ${year} · TBA`.trim();
    }
    const formattedDates = event.dateText.trim().replace(/\s+to\s+/gi, '-');
    return `${monthName} ${formattedDates}, ${year}`.trim();
  }

  const todayIso = getTodayIso();
  const initialParamMonth = page.url.searchParams.get('month');
  const initialMonth = isValidCalendarMonth(initialParamMonth)
    ? initialParamMonth
    : getDefaultCalendarMonth();

  let query = $state('');
  let selectedCategories = $state<CalendarCategory[]>(['all', 'undergraduate', 'holiday']);
  let activeMonth = $state(initialMonth);
  let selectedDate = $state(getDefaultSelectedDate(initialMonth));
  let selectedEventId = $state<string | null>(null);
  let mobileAgendaOpen = $state(false);
  let mobileAgendaEl: HTMLElement | undefined = $state();
  let filtersOpen = $state(false);
  let searchResultsOpen = $state(false);
  let highlightedResultIndex = $state(-1);
  let searchInputEl: HTMLInputElement | undefined = $state();
  let searchContainerEl: HTMLDivElement | undefined = $state();
  let filterMenuEl: HTMLDivElement | undefined = $state();
  let swipeStart: { x: number; y: number } | null = null;
  let swipeAxis: 'horizontal' | 'vertical' | null = null;
  let swipeOffset = $state(0);
  let swipeAnimating = false;
  let mobileGridEl: HTMLDivElement | undefined = $state();
  let mobileGridWidth = $state(0);

  const filteredEvents = $derived(
    filterCalendarEvents(ACADEMIC_CALENDAR_EVENTS, query, selectedCategories),
  );
  const monthMatchCounts = $derived(countMatchingEventsByMonth(filteredEvents));
  const gridModel = $derived(buildMonthGrid(activeMonth, filteredEvents));
  const selectedColumn = $derived(
    gridModel.weeks.flatMap((week) => week.days).findIndex((cell) => cell.date === selectedDate) % 7,
  );
  const pointerX = $derived((selectedColumn + 0.5) * mobileGridWidth / 7 + swipeOffset);
  const searchTerms = $derived(query.trim().split(/\s+/).filter(Boolean));
  const hasActiveFilters = $derived(searchTerms.length > 0 || selectedCategories.length > 0);
  const showSearchResults = $derived(searchResultsOpen && searchTerms.length > 0);

  const activeMonthIndex = $derived(
    CALENDAR_MONTHS.findIndex((item) => item.month === activeMonth),
  );
  const activeMonthMeta = $derived(CALENDAR_MONTHS[activeMonthIndex] ?? CALENDAR_MONTHS[0]!);
  const prevMatchingMonth = $derived.by(() => {
    for (let i = activeMonthIndex - 1; i >= 0; i -= 1) {
      const m = CALENDAR_MONTHS[i]!;
      if (!hasActiveFilters || (monthMatchCounts[m.month] ?? 0) > 0) return m.month;
    }
    return null;
  });
  const nextMatchingMonth = $derived.by(() => {
    for (let i = activeMonthIndex + 1; i < CALENDAR_MONTHS.length; i += 1) {
      const m = CALENDAR_MONTHS[i]!;
      if (!hasActiveFilters || (monthMatchCounts[m.month] ?? 0) > 0) return m.month;
    }
    return null;
  });
  const canGoPrev = $derived(prevMatchingMonth !== null);
  const canGoNext = $derived(nextMatchingMonth !== null);
  const selectedDayEvents = $derived.by(() => {
    const events = buildMonthGrid(selectedDate.slice(0, 7), filteredEvents).eventsByDate[selectedDate] ?? [];
    const selected = filteredEvents.find((event) => event.id === selectedEventId);
    return selected && parseEventDateSpans(selected).tba && !events.some((event) => event.id === selected.id)
      ? [...events, selected]
      : events;
  });

  $effect(() => bindSearchShortcut(() => searchInputEl?.focus()));

  $effect(() => {
    const grid = mobileGridEl;
    if (!grid) return;
    grid.addEventListener('touchmove', moveCalendarSwipe, { passive: false });
    return () => grid.removeEventListener('touchmove', moveCalendarSwipe);
  });

  $effect(() => {
    if (!filtersOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (filterMenuEl && !filterMenuEl.contains(event.target as Node)) {
        filtersOpen = false;
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') filtersOpen = false;
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  });

  // Sync active month to ?month=YYYY-MM without adding browser history entries.
  $effect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (url.searchParams.get('month') !== activeMonth) {
      url.searchParams.set('month', activeMonth);
      replaceState(url, page.state);
    }
  });

  $effect(() => {
    if (!searchResultsOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (searchContainerEl && !searchContainerEl.contains(event.target as Node)) {
        searchResultsOpen = false;
        highlightedResultIndex = -1;
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
    };
  });

  async function selectSearchResult(event: CalendarEvent) {
    const { spans, tba } = parseEventDateSpans(event);
    if (!tba && spans.length > 0) {
      const startDate = spans[0]!.start;
      const targetMonth = startDate.slice(0, 7);
      if (isValidCalendarMonth(targetMonth)) {
        activeMonth = targetMonth;
      }
      selectDay(startDate, event.id);
    } else {
      selectMonth(event.month);
      selectedEventId = event.id;
    }
    searchResultsOpen = false;
    highlightedResultIndex = -1;
    searchInputEl?.blur();
    mobileAgendaOpen = true;
    await tick();
    if (window.matchMedia('(max-width: 767px)').matches) {
      mobileAgendaEl?.scrollIntoView({ block: 'nearest' });
    }
  }

  function handleSearchKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      if (showSearchResults) {
        event.preventDefault();
        searchResultsOpen = false;
        highlightedResultIndex = -1;
      } else {
        searchInputEl?.blur();
      }
      return;
    }

    if (!showSearchResults || filteredEvents.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      highlightedResultIndex = (highlightedResultIndex + 1) % filteredEvents.length;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      highlightedResultIndex =
        highlightedResultIndex <= 0 ? filteredEvents.length - 1 : highlightedResultIndex - 1;
    } else if (event.key === 'Enter' && highlightedResultIndex >= 0) {
      const target = filteredEvents[highlightedResultIndex];
      if (target) {
        event.preventDefault();
        selectSearchResult(target);
      }
    }
  }

  function selectMonth(monthKey: string) {
    if (!isValidCalendarMonth(monthKey)) return;
    activeMonth = monthKey;
    selectedDate = getDefaultSelectedDate(monthKey);
    selectedEventId = null;
  }

  function stepMonth(delta: number) {
    const target = delta < 0 ? prevMatchingMonth : nextMatchingMonth;
    if (target) selectMonth(target);
  }

  function startCalendarSwipe(event: TouchEvent) {
    if (swipeAnimating) return;
    const touch = event.touches.length === 1 ? event.touches[0] : undefined;
    swipeStart = touch ? { x: touch.clientX, y: touch.clientY } : null;
    swipeAxis = null;
  }

  function moveCalendarSwipe(event: TouchEvent) {
    const touch = event.touches[0];
    if (!swipeStart || !touch) return;
    const dx = touch.clientX - swipeStart.x;
    const dy = touch.clientY - swipeStart.y;
    if (!swipeAxis && Math.max(Math.abs(dx), Math.abs(dy)) > 0) {
      swipeAxis = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
    }
    if (swipeAxis === 'horizontal') {
      event.preventDefault();
      swipeOffset = dx * ((dx > 0 && !canGoPrev) || (dx < 0 && !canGoNext) ? 0.2 : 1);
    }
  }

  async function endCalendarSwipe(event: TouchEvent) {
    const touch = event.changedTouches[0];
    if (!swipeStart || !touch) return;
    const dx = touch.clientX - swipeStart.x;
    swipeStart = null;
    const grid = mobileGridEl;
    if (!grid) return;
    const shouldChange = swipeAxis === 'horizontal' && Math.abs(dx) >= 30 &&
      (dx < 0 ? canGoNext : canGoPrev);
    swipeAxis = null;
    if (Math.abs(swipeOffset) > 5) event.preventDefault();
    const offset = swipeOffset;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    swipeAnimating = true;
    if (!reducedMotion) {
      const target = shouldChange ? (dx < 0 ? -grid.clientWidth : grid.clientWidth) : 0;
      await new Promise<void>((resolve) => {
        const start = performance.now();
        const frame = (now: number) => {
          const progress = Math.min((now - start) / 100, 1);
          swipeOffset = offset + (target - offset) * (1 - (1 - progress) ** 3);
          if (progress < 1) requestAnimationFrame(frame);
          else resolve();
        };
        requestAnimationFrame(frame);
      });
    }
    if (shouldChange) activeMonth = (dx < 0 ? nextMatchingMonth : prevMatchingMonth)!;
    swipeOffset = 0;
    swipeAnimating = false;
  }

  function jumpToToday() {
    const targetMonth = getDefaultCalendarMonth();
    activeMonth = targetMonth;
    selectedDate = getDefaultSelectedDate(targetMonth);
    selectedEventId = null;
    mobileAgendaOpen = true;
  }

  async function selectDay(date: string, eventId: string | null = null) {
    selectedDate = date;
    selectedEventId = eventId;
    mobileAgendaOpen = true;
    await tick();
    if (window.matchMedia('(max-width: 767px)').matches) {
      mobileAgendaEl?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        block: 'nearest',
      });
    }
  }

  function toggleCategory(category: CalendarCategory) {
    selectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((item) => item !== category)
      : [...selectedCategories, category];
  }
</script>

<section
  aria-label="BulSU Academic Calendar events"
  class="flex flex-col md:h-full md:min-h-0 md:overflow-hidden"
>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="flex shrink-0 items-center justify-between gap-3 border-b border-border-subtle bg-canvas-paper px-4 py-2.5 md:grid md:grid-cols-[13.5rem_minmax(0,1fr)_auto] md:items-center md:gap-4 md:px-6">
      <h2 class="hidden font-heading text-xl font-bold tracking-tight text-ink-primary md:block md:truncate md:text-2xl">
        {activeMonthMeta.label}
      </h2>

      <div class="flex w-full items-center gap-2 md:mx-auto md:max-w-lg">
        <div bind:this={searchContainerEl} class="relative flex min-w-0 flex-1 items-center">
          <svg
            class="pointer-events-none absolute left-3 h-4 w-4 text-ink-muted"
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
            bind:this={searchInputEl}
            type="search"
            bind:value={query}
            onfocus={() => {
              if (searchTerms.length > 0) searchResultsOpen = true;
            }}
            oninput={() => {
              searchResultsOpen = true;
              highlightedResultIndex = -1;
            }}
            onkeydown={handleSearchKeydown}
            role="combobox"
            aria-expanded={showSearchResults}
            aria-controls="calendar-search-results"
            aria-activedescendant={highlightedResultIndex >= 0 ? `calendar-search-option-${highlightedResultIndex}` : undefined}
            aria-label="Search academic calendar events"
            placeholder="Search Academic Calendar..."
            class="h-9 w-full rounded-lg border border-border-strong bg-surface-card pr-9 pl-9 text-sm text-ink-primary placeholder:text-ink-muted focus:border-brand-crimson focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 [&::-webkit-search-cancel-button]:hidden"
          />
          {#if query}
            <button
              type="button"
              onclick={() => {
                query = '';
                searchResultsOpen = false;
                highlightedResultIndex = -1;
              }}
              aria-label="Clear calendar search"
              class="absolute right-2 inline-flex h-6 w-6 items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-surface-subtle hover:text-ink-primary focus-visible:outline-2 focus-visible:outline-brand-crimson"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="h-3.5 w-3.5"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          {:else}
            <kbd
              aria-hidden="true"
              class="pointer-events-none absolute right-2.5 hidden sm:inline-flex items-center justify-center rounded border border-border-subtle bg-surface-subtle px-1.5 py-0.5 font-mono text-xs font-medium text-ink-secondary"
            >
              /
            </kbd>
          {/if}

          {#if showSearchResults}
            <div
              class="absolute top-full left-0 right-0 z-50 mt-1.5 max-h-80 overflow-y-auto rounded-xl border border-border-subtle bg-surface-card p-1.5 shadow-xl"
            >
              {#if filteredEvents.length === 0}
                <p role="status" class="px-3 py-2.5 text-xs text-ink-secondary">
                  No matching events found.
                </p>
              {:else}
                <ul
                  id="calendar-search-results"
                  role="listbox"
                  aria-label="Calendar search results"
                  class="space-y-0.5"
                >
                  {#each filteredEvents as event, i (event.id)}
                    {@const isHighlighted = i === highlightedResultIndex}
                    <li role="presentation">
                      <button
                        type="button"
                        role="option"
                        id={`calendar-search-option-${i}`}
                        aria-selected={isHighlighted}
                        onclick={() => selectSearchResult(event)}
                        class={`flex w-full cursor-pointer items-baseline gap-3 rounded-lg px-2.5 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-brand-crimson ${
                          isHighlighted
                            ? 'bg-brand-crimson-wash text-ink-primary'
                            : 'hover:bg-surface-subtle'
                        }`}
                      >
                        <span class="min-w-0 flex-1 text-xs font-medium leading-snug text-ink-primary sm:text-sm">
                          {#each splitHighlightedParts(event.title, searchTerms) as part, idx (idx)}
                            {#if part.match}
                              <mark class="rounded-xs bg-brand-crimson/15 px-0.5 font-semibold text-brand-crimson">{part.text}</mark>
                            {:else}
                              {part.text}
                            {/if}
                          {/each}
                        </span>
                        <span class="shrink-0 text-right text-xs font-medium tabular-nums text-ink-secondary">
                          {formatSearchResultDate(event)}
                        </span>
                      </button>
                    </li>
                  {/each}
                </ul>
              {/if}
            </div>
          {/if}
        </div>

        <div bind:this={filterMenuEl} class="relative shrink-0">
          <button
            type="button"
            onclick={() => {
              filtersOpen = !filtersOpen;
            }}
            aria-expanded={filtersOpen}
            aria-haspopup="true"
            aria-label={selectedCategories.length > 0 ? `Filters ${selectedCategories.length} active` : 'Filters'}
            class={`inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-brand-crimson ${
              filtersOpen || selectedCategories.length > 0
                ? 'border-brand-crimson bg-brand-crimson-wash text-brand-crimson'
                : 'border-border-strong bg-surface-card text-ink-primary hover:border-brand-crimson hover:text-brand-crimson'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18M7 12h10m-7 6h4" />
            </svg>
            <span class="hidden sm:inline">Filters</span>
            {#if selectedCategories.length > 0}
              <span class="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-crimson px-1 text-[10px] font-bold text-white">
                {selectedCategories.length}
              </span>
            {/if}
          </button>

          {#if filtersOpen}
            <div
              role="dialog"
              aria-label="Calendar filters"
              class="absolute right-0 z-40 mt-2 w-64 rounded-xl border border-border-subtle bg-surface-card p-2 shadow-xl"
            >
              <p class="px-2.5 pt-1 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-secondary">
                Categories
              </p>

              <div role="group" aria-label="Filter calendar events by category" class="space-y-0.5">
                <button
                  type="button"
                  aria-pressed={selectedCategories.length === 0}
                  onclick={() => {
                    selectedCategories = [];
                  }}
                  class="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-ink-primary transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-brand-crimson"
                >
                  <span
                    aria-hidden="true"
                    class={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors ${
                      selectedCategories.length === 0
                        ? 'border-brand-crimson bg-brand-crimson text-white'
                        : 'border-border-strong bg-transparent'
                    }`}
                  >
                    {#if selectedCategories.length === 0}
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" class="h-3 w-3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.5 8.5 6.5 11.5 12.5 5" />
                      </svg>
                    {/if}
                  </span>
                  <span>All Events</span>
                </button>

                <div class="my-1 border-t border-border-subtle"></div>

                {#each CALENDAR_CATEGORIES as cat (cat.id)}
                  {@const isSelected = selectedCategories.includes(cat.id)}
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onclick={() => toggleCategory(cat.id)}
                    class={`cal-cat-${cat.id} flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-ink-primary transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-brand-crimson`}
                  >
                    <span
                      aria-hidden="true"
                      style={isSelected
                        ? 'background-color: var(--cal-dot); border-color: var(--cal-dot);'
                        : 'border-color: var(--cal-dot);'}
                      class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border-2 text-white transition-colors"
                    >
                      {#if isSelected}
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" class="h-3 w-3 dark:text-canvas-paper">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M3.5 8.5 6.5 11.5 12.5 5" />
                        </svg>
                      {/if}
                    </span>
                    <span class="truncate">{cat.label}</span>
                  </button>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>

      <div class="hidden items-center gap-1.5 md:flex">
        <button
          type="button"
          onclick={jumpToToday}
          class="inline-flex h-9 cursor-pointer items-center rounded-lg border border-border-subtle bg-surface-card px-3 text-xs font-semibold text-ink-primary transition-colors hover:border-brand-crimson hover:text-brand-crimson focus-visible:outline-2 focus-visible:outline-brand-crimson"
        >
          Today
        </button>
        <button
          type="button"
          onclick={() => stepMonth(-1)}
          disabled={!canGoPrev}
          aria-label="Previous month"
          class="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border-subtle bg-surface-card text-ink-primary transition-colors hover:border-brand-crimson hover:text-brand-crimson disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-brand-crimson"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          onclick={() => stepMonth(1)}
          disabled={!canGoNext}
          aria-label="Next month"
          class="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border-subtle bg-surface-card text-ink-primary transition-colors hover:border-brand-crimson hover:text-brand-crimson disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-brand-crimson"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>

      <!-- Desktop 7-column calendar + side detail panel filling remaining viewport -->
      <div class="hidden md:grid md:min-h-0 md:flex-1 md:grid-cols-[minmax(0,1fr)_360px] md:gap-3 md:p-3 lg:grid-cols-[minmax(0,1fr)_400px]">
        <section
          aria-label={`${activeMonthMeta.label} calendar`}
          class="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface-card"
        >
          <div class="grid shrink-0 grid-cols-7 bg-surface-card">
            {#each WEEKDAYS_UPPER as dayName (dayName)}
              <div
                class="border-r border-border-subtle/70 pt-1.5 text-center text-[11px] font-medium tracking-wider text-ink-secondary last:border-r-0"
              >
                {dayName}
              </div>
            {/each}
          </div>

          <div
            class="grid min-h-0 flex-1"
            style={`grid-template-rows: repeat(${gridModel.weeks.length}, minmax(0, 1fr));`}
          >
            {#each gridModel.weeks as week, weekIdx (weekIdx)}
              <div class="relative min-h-0 border-b border-border-subtle/70 last:border-b-0">
                <div class="grid h-full grid-cols-7">
                  {#each week.days as cell, colIdx (cell.date)}
                    {@const isSelected = cell.date === selectedDate}
                    {@const isToday = cell.date === todayIso}
                    {@const isLastRow = weekIdx === gridModel.weeks.length - 1}
                    <div class="relative h-full min-h-0 border-r border-border-subtle/70 last:border-r-0">
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        aria-label={cell.overflowCount > 0
                          ? `${formatIsoDateReadable(cell.date)}, ${cell.overflowCount} more`
                          : formatIsoDateReadable(cell.date)}
                        onclick={() => selectDay(cell.date)}
                        class={`flex h-full w-full min-h-0 cursor-pointer flex-col items-center justify-start px-1.5 pt-1 pb-1 text-center transition-colors focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-brand-crimson ${
                          isLastRow && colIdx === 0 ? 'rounded-bl-2xl' : ''
                        } ${isLastRow && colIdx === 6 ? 'rounded-br-2xl' : ''} ${
                          isSelected
                            ? 'bg-brand-crimson-wash/35 ring-1 ring-inset ring-brand-crimson/70'
                            : cell.inMonth
                              ? 'bg-surface-card hover:bg-surface-subtle/40'
                              : 'bg-surface-card text-ink-muted hover:bg-surface-subtle/40'
                        }`}
                      >
                        <span
                          class={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-medium tabular-nums ${
                            isToday
                              ? 'bg-brand-crimson text-white font-semibold'
                              : isSelected
                                ? 'bg-brand-crimson-wash text-brand-crimson font-semibold'
                                : cell.inMonth
                                  ? 'text-ink-primary'
                                  : 'text-ink-muted'
                          }`}
                        >
                          {cell.day}
                        </span>
                      </button>

                      {#if cell.overflowCount > 0}
                        <span aria-hidden="true" class="pointer-events-none absolute bottom-1 left-1.5 text-[11px] font-semibold leading-normal text-ink-secondary">
                          {cell.overflowCount} more
                        </span>
                      {/if}
                    </div>
                  {/each}
                </div>

                <!-- Google-Calendar-style multi-day solid bars & clean single-day dot rows -->
                <div class="pointer-events-none absolute inset-x-0 top-7.5 grid grid-cols-7 gap-y-0.5">
                  {#each week.visibleSegments as seg (`${seg.event.id}-${seg.startCol}-${seg.lane}`)}
                    {@const isActiveEvent = selectedEventId === seg.event.id}
                    {@const isSolidBar =
                      seg.endCol > seg.startCol ||
                      seg.continuesBefore ||
                      seg.continuesAfter ||
                      seg.event.category === 'holiday'}
                    <button
                      type="button"
                      onclick={(e) => {
                        e.stopPropagation();
                        selectDay(seg.anchorDate, seg.event.id);
                      }}
                      title={seg.event.title}
                      style={`grid-column: ${seg.startCol + 1} / ${seg.endCol + 2}; grid-row: ${seg.lane + 1};`}
                      class={`cal-cat-${seg.event.category} pointer-events-auto flex h-[20px] min-w-0 cursor-pointer items-center gap-1.5 overflow-hidden whitespace-nowrap px-1.5 text-left text-[11px] leading-none transition-all focus-visible:outline-2 focus-visible:outline-brand-crimson ${
                        seg.continuesBefore ? 'ml-0 rounded-l-none' : 'ml-1 rounded-l-[5px]'
                      } ${
                        seg.continuesAfter ? 'mr-0 rounded-r-none' : 'mr-1.5 rounded-r-[5px]'
                      } ${
                        isSolidBar
                          ? 'bg-[var(--cal-dot)] text-white dark:bg-[var(--cal-bg)] dark:text-[var(--cal-ink)] font-medium hover:brightness-95'
                          : 'text-ink-primary font-medium hover:bg-surface-subtle/80'
                      } ${
                        isActiveEvent
                          ? isSolidBar
                            ? 'ring-1 ring-inset ring-white/80 dark:ring-brand-crimson'
                            : 'bg-brand-crimson-wash/60 ring-1 ring-inset ring-brand-crimson'
                          : ''
                      }`}
                    >
                      {#if !isSolidBar}
                        <span aria-hidden="true" class="cal-dot h-2 w-2 shrink-0 rounded-full"></span>
                      {/if}
                      <span class="min-w-0 overflow-hidden whitespace-nowrap">{seg.event.title}</span>
                    </button>
                  {/each}
                </div>
              </div>
            {/each}
          </div>
        </section>

        <aside
          aria-label="Selected day details"
          class="flex h-full min-h-0 flex-col rounded-2xl border border-border-subtle bg-surface-card p-5"
        >
          <div class="shrink-0 border-b border-border-subtle pb-3">
            <h3 class="font-heading text-base font-bold text-ink-primary">
              {formatIsoDateReadable(selectedDate)}
            </h3>
          </div>

          {#if selectedDayEvents.length === 0}
            <p class="pt-4 text-sm text-ink-secondary">
              No events on this date.
            </p>
          {:else}
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <div
              role="region"
              tabindex="0"
              aria-label="Selected day events"
              class="mt-4 min-h-0 flex-1 overflow-y-auto pr-3 [scrollbar-width:thin] focus-visible:outline-2 focus-visible:outline-brand-crimson"
            >
              <ul class="space-y-3">
              {#each selectedDayEvents as event (event.id)}
                {@const isFocused = selectedEventId === event.id}
                <li
                  class={`cal-cat-${event.category} rounded-lg border p-3.5 transition-colors ${
                    isFocused
                      ? 'border-brand-crimson bg-brand-crimson-wash/30'
                      : 'border-border-subtle bg-canvas-paper/60'
                  }`}
                >
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="cal-badge inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium">
                      <span aria-hidden="true" class="cal-dot h-1.5 w-1.5 rounded-full"></span>
                      <span>{CALENDAR_CATEGORY_MAP[event.category].label}</span>
                    </span>
                    <span class="text-[11px] font-medium tabular-nums text-ink-secondary">
                      {formatEventCardDate(event)}
                    </span>
                  </div>
                  <p class="mt-2.5 text-sm font-medium leading-relaxed text-ink-primary">
                    {#if event.subjectToPresidentialChange}
                      <span
                        title="Subject to approval/change by the BulSU University President"
                        class="mr-1 font-bold text-brand-crimson"
                      >
                        *
                      </span>
                    {/if}
                    {#each splitHighlightedParts(event.title, searchTerms) as part, idx (idx)}
                      {#if part.match}
                        <mark class="rounded-xs bg-brand-crimson/15 px-0.5 font-semibold text-brand-crimson">{part.text}</mark>
                      {:else}
                        {part.text}
                      {/if}
                    {/each}
                  </p>
                  {#if event.subjectToPresidentialChange}
                    <p class="mt-1.5 text-xs leading-relaxed text-ink-secondary">
                      The BulSU University President is granted authority to approve changes to this event as necessary.
                    </p>
                  {/if}
                </li>
              {/each}
              </ul>
            </div>
          {/if}
        </aside>
      </div>

      <!-- Mobile Google-Calendar-style near-full-height grid + separate agenda card peeking below -->
      <div class={`md:hidden ${mobileAgendaOpen ? 'space-y-3 pb-4' : ''}`}>
        <section
          aria-label={`${activeMonthMeta.label} calendar`}
          class="flex h-[calc(100svh-7.75rem)] min-h-[380px] flex-col overflow-hidden border-b border-border-subtle bg-surface-card"
        >
          <div class="flex shrink-0 items-center justify-between gap-2 border-b border-border-subtle px-3 py-2">
            <h2 class="font-heading text-base font-bold tracking-tight text-ink-primary">
              {activeMonthMeta.label}
            </h2>

            <div class="flex items-center gap-1">
              <button
                type="button"
                onclick={jumpToToday}
                class="inline-flex h-8 cursor-pointer items-center rounded-lg border border-border-subtle bg-canvas-paper px-2.5 text-xs font-semibold text-ink-primary transition-colors hover:border-brand-crimson hover:text-brand-crimson focus-visible:outline-2 focus-visible:outline-brand-crimson"
              >
                Today
              </button>
              <button
                type="button"
                onclick={() => stepMonth(-1)}
                disabled={!canGoPrev}
                aria-label="Previous month"
                class="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border-subtle bg-canvas-paper text-ink-primary transition-colors hover:border-brand-crimson hover:text-brand-crimson disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-brand-crimson"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onclick={() => stepMonth(1)}
                disabled={!canGoNext}
                aria-label="Next month"
                class="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border-subtle bg-canvas-paper text-ink-primary transition-colors hover:border-brand-crimson hover:text-brand-crimson disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-brand-crimson"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>

          <div
            class="grid shrink-0 grid-cols-7 border-b border-border-subtle/70 bg-surface-card"
          >
            {#each WEEKDAYS_MOBILE as dayName, idx (idx)}
              <div
                class="py-1 text-center text-[11px] font-medium text-ink-secondary"
              >
                {dayName}
              </div>
            {/each}
          </div>

          <div
            role="presentation"
            bind:this={mobileGridEl}
            bind:clientWidth={mobileGridWidth}
            ontouchstart={startCalendarSwipe}
            ontouchmove={moveCalendarSwipe}
            ontouchend={endCalendarSwipe}
            ontouchcancel={() => { swipeStart = null; swipeAxis = null; swipeOffset = 0; }}
            class="relative grid min-h-0 flex-1"
            style={`grid-template-rows: repeat(${gridModel.weeks.length}, minmax(0, 1fr)); transform: translateX(${swipeOffset}px);`}
          >
            {#each [prevMatchingMonth, nextMatchingMonth] as adjacentMonth, side (side)}
              {#if adjacentMonth}
                {@const adjacentGrid = buildMonthGrid(adjacentMonth, filteredEvents)}
                <div
                  aria-hidden="true"
                  class={`pointer-events-none absolute inset-0 grid bg-surface-card ${side === 0 ? '-translate-x-full' : 'translate-x-full'}`}
                  style={`grid-template-rows: repeat(${adjacentGrid.weeks.length}, minmax(0, 1fr));`}
                >
                  {#each adjacentGrid.weeks as week}
                    <div class="relative min-h-0 border-b border-border-subtle/70 last:border-b-0">
                      <div class="grid h-full grid-cols-7">
                        {#each week.days as cell}
                          <div class={`flex h-full min-h-0 flex-col items-center justify-between border-r border-border-subtle/70 px-0.5 pt-1 pb-0.5 text-center last:border-r-0 ${mobileAgendaOpen && cell.date === selectedDate ? 'bg-brand-crimson-wash/35 ring-1 ring-inset ring-brand-crimson/70' : ''}`}>
                            <span class={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-medium tabular-nums ${cell.date === todayIso ? 'bg-brand-crimson text-white font-semibold' : mobileAgendaOpen && cell.date === selectedDate ? 'bg-brand-crimson-wash text-brand-crimson font-semibold' : cell.inMonth ? 'text-ink-primary' : 'text-ink-muted'}`}>
                              {cell.day}
                            </span>
                            {#if cell.overflowCount > 0}
                              <span class="mt-auto self-start px-1 text-[10px] font-bold leading-none text-ink-secondary">…</span>
                            {/if}
                          </div>
                        {/each}
                      </div>
                      <div class="absolute inset-x-0 top-6.5 grid grid-cols-7 gap-y-0.5">
                        {#each week.visibleSegments as seg}
                          {@const isSolidBar = seg.endCol > seg.startCol || seg.continuesBefore || seg.continuesAfter || seg.event.category === 'holiday'}
                          <div
                            style={`grid-column: ${seg.startCol + 1} / ${seg.endCol + 2}; grid-row: ${seg.lane + 1};`}
                            class={`cal-cat-${seg.event.category} flex h-[15px] min-w-0 items-center overflow-hidden whitespace-nowrap px-1 text-left text-[9.5px] leading-none font-medium ${seg.continuesBefore ? 'ml-0 rounded-l-none' : 'ml-0.5 rounded-l-[3px]'} ${seg.continuesAfter ? 'mr-0 rounded-r-none' : 'mr-0.5 rounded-r-[3px]'} ${isSolidBar ? 'bg-[var(--cal-dot)] text-white dark:bg-[var(--cal-bg)] dark:text-[var(--cal-ink)]' : 'cal-badge border'}`}
                          >
                            <span class="min-w-0 overflow-hidden whitespace-nowrap">{seg.event.title}</span>
                          </div>
                        {/each}
                      </div>
                    </div>
                  {/each}
                </div>
              {/if}
            {/each}
            {#each gridModel.weeks as week, weekIdx (weekIdx)}
              <div class="relative min-h-0 border-b border-border-subtle/70 last:border-b-0">
                <div class="grid h-full grid-cols-7">
                  {#each week.days as cell (cell.date)}
                    {@const isSelected = mobileAgendaOpen && cell.date === selectedDate}
                    {@const isToday = cell.date === todayIso}
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      aria-label={cell.overflowCount > 0
                        ? `${formatIsoDateReadable(cell.date)}, ${cell.overflowCount} more`
                        : formatIsoDateReadable(cell.date)}
                      onclick={() => selectDay(cell.date)}
                      class={`flex h-full min-h-0 cursor-pointer flex-col items-center justify-between border-r border-border-subtle/70 px-0.5 pt-1 pb-0.5 text-center transition-colors last:border-r-0 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-brand-crimson ${
                        isSelected
                          ? 'bg-brand-crimson-wash/35 ring-1 ring-inset ring-brand-crimson/70'
                          : cell.inMonth
                            ? 'bg-surface-card'
                            : 'bg-surface-card text-ink-muted'
                      }`}
                    >
                      <span
                        class={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-medium tabular-nums ${
                          isToday
                            ? 'bg-brand-crimson text-white font-semibold'
                            : isSelected
                              ? 'bg-brand-crimson-wash text-brand-crimson font-semibold'
                              : cell.inMonth
                                ? 'text-ink-primary'
                                : 'text-ink-muted'
                        }`}
                      >
                        {cell.day}
                      </span>

                      {#if cell.overflowCount > 0}
                        <span aria-hidden="true" class="mt-auto self-start px-1 text-[10px] font-bold leading-none text-ink-secondary">
                          …
                        </span>
                      {/if}
                    </button>
                  {/each}
                </div>

                <!-- Mobile miniature event bars inside cells -->
                <div class="pointer-events-none absolute inset-x-0 top-6.5 grid grid-cols-7 gap-y-0.5">
                  {#each week.visibleSegments as seg (`m-${seg.event.id}-${seg.startCol}-${seg.lane}`)}
                    {@const isSolidBar =
                      seg.endCol > seg.startCol ||
                      seg.continuesBefore ||
                      seg.continuesAfter ||
                      seg.event.category === 'holiday'}
                    <button
                      type="button"
                      onclick={(e) => {
                        e.stopPropagation();
                        selectDay(seg.anchorDate, seg.event.id);
                      }}
                      title={seg.event.title}
                      style={`grid-column: ${seg.startCol + 1} / ${seg.endCol + 2}; grid-row: ${seg.lane + 1};`}
                      class={`cal-cat-${seg.event.category} pointer-events-auto flex h-[15px] min-w-0 cursor-pointer items-center overflow-hidden whitespace-nowrap px-1 text-left text-[9.5px] leading-none font-medium ${
                        seg.continuesBefore ? 'ml-0 rounded-l-none' : 'ml-0.5 rounded-l-[3px]'
                      } ${
                        seg.continuesAfter ? 'mr-0 rounded-r-none' : 'mr-0.5 rounded-r-[3px]'
                      } ${
                        isSolidBar
                          ? 'bg-[var(--cal-dot)] text-white dark:bg-[var(--cal-bg)] dark:text-[var(--cal-ink)]'
                          : 'cal-badge border'
                      }`}
                    >
                      <span class="min-w-0 overflow-hidden whitespace-nowrap">{seg.event.title}</span>
                    </button>
                  {/each}
                </div>
              </div>
            {/each}
          </div>
        </section>

        <!-- Separate selected-day events card below the mobile calendar -->
        {#if mobileAgendaOpen}
        <div class="relative px-3" bind:this={mobileAgendaEl}>
          {#if selectedColumn >= 0 && pointerX >= 12 && pointerX <= mobileGridWidth - 12}
            <span
              aria-hidden="true"
              class="pointer-events-none absolute -top-1.5 z-10 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-border-subtle bg-surface-card"
              style={`left: ${pointerX}px;`}
            ></span>
          {/if}
          <section
            aria-label="Selected day agenda"
            class="rounded-xl border border-border-subtle bg-surface-card p-4 shadow-xs"
          >
            <div class="flex items-center justify-between gap-3 border-b border-border-subtle pb-2.5">
              <h3 class="font-heading text-sm font-bold text-ink-primary">
                {formatIsoDateReadable(selectedDate)}
              </h3>
              <button type="button" onclick={() => { mobileAgendaOpen = false; selectedEventId = null; }} aria-label="Close selected day agenda" class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-secondary hover:bg-canvas-paper hover:text-ink-primary focus-visible:outline-2 focus-visible:outline-brand-crimson">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>

            <div class="pt-3">
              {#if selectedDayEvents.length === 0}
                <p class="text-sm text-ink-secondary">
                  No events on this date.
                </p>
              {:else}
                <ul class="space-y-2.5">
                  {#each selectedDayEvents as event (event.id)}
                    {@const isFocused = selectedEventId === event.id}
                    <li
                      class={`cal-cat-${event.category} rounded-lg border p-3 ${
                        isFocused
                          ? 'border-brand-crimson bg-brand-crimson-wash/30'
                          : 'border-border-subtle bg-canvas-paper/60'
                      }`}
                    >
                      <div class="flex flex-wrap items-center justify-between gap-2">
                        <span class="cal-badge inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium">
                          <span aria-hidden="true" class="cal-dot h-1.5 w-1.5 rounded-full"></span>
                          <span>{CALENDAR_CATEGORY_MAP[event.category].label}</span>
                        </span>
                        <span class="text-[11px] font-medium tabular-nums text-ink-secondary">
                          {formatEventCardDate(event)}
                        </span>
                      </div>
                      <p class="mt-2 text-sm font-medium leading-relaxed text-ink-primary">
                        {#if event.subjectToPresidentialChange}
                          <span
                            title="Subject to approval/change by the BulSU University President"
                            class="mr-1 font-bold text-brand-crimson"
                          >
                            *
                          </span>
                        {/if}
                        {#each splitHighlightedParts(event.title, searchTerms) as part, idx (idx)}
                          {#if part.match}
                            <mark class="rounded-xs bg-brand-crimson/15 px-0.5 font-semibold text-brand-crimson">{part.text}</mark>
                          {:else}
                            {part.text}
                          {/if}
                        {/each}
                      </p>
                      {#if event.subjectToPresidentialChange}
                        <p class="mt-1 text-xs leading-relaxed text-ink-secondary">
                          The BulSU University President is granted authority to approve changes to this event as necessary.
                        </p>
                      {/if}
                    </li>
                  {/each}
                </ul>
              {/if}
            </div>
          </section>
        </div>
        {/if}
      </div>
  </div>
</section>
