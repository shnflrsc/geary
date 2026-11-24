<script lang="ts">
  import {
    ACADEMIC_CALENDAR_EVENTS,
    ACADEMIC_CALENDAR_META,
    CALENDAR_CATEGORIES,
    type CalendarCategory,
  } from '../../data/academic-calendar';
  import { filterCalendarEvents, groupCalendarEventsByMonth } from '#lib/calendar';
  import { bindSearchShortcut } from '#lib/search-shortcut';

  function formatShortMonth(monthLabel: string): string {
    const [monthName = '', year = ''] = monthLabel.split(' ');
    return `${monthName.slice(0, 3)} '${year.slice(-2)}`;
  }

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

  let query = $state('');
  let selectedCategories = $state<CalendarCategory[]>([]);
  let showBackToTop = $state(false);
  let searchInputEl: HTMLInputElement | undefined = $state();

  const filteredEvents = $derived(
    filterCalendarEvents(ACADEMIC_CALENDAR_EVENTS, query, selectedCategories),
  );
  const monthGroups = $derived(groupCalendarEventsByMonth(filteredEvents));
  const searchTerms = $derived(query.trim().split(/\s+/).filter(Boolean));
  const hasActiveFilters = $derived(searchTerms.length > 0 || selectedCategories.length > 0);

  $effect(() => bindSearchShortcut(() => searchInputEl?.focus()));

  $effect(() => {
    const onScroll = () => {
      showBackToTop = window.scrollY > 300;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });

  function scrollToTop() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  }

  function toggleCategory(category: CalendarCategory) {
    selectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((item) => item !== category)
      : [...selectedCategories, category];
  }

  function clearAllFilters() {
    query = '';
    selectedCategories = [];
  }
</script>

<section aria-label="BulSU Academic Calendar events">
  <div class="sticky top-16 z-30 border-b border-border-subtle bg-canvas-paper/95 backdrop-blur-sm">
    <div class="mx-auto max-w-5xl px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8">
      <div class="relative flex items-center">
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
          onkeydown={(event) => {
            if (event.key === 'Escape') searchInputEl?.blur();
          }}
          aria-label="Search academic calendar events"
          placeholder="Search Academic Calendar..."
          class="w-full rounded-lg border border-border-strong bg-surface-card py-2 pr-9 pl-9 text-sm text-ink-primary placeholder:text-ink-muted focus:border-brand-crimson focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 [&::-webkit-search-cancel-button]:hidden"
        />
        {#if query}
          <button
            type="button"
            onclick={() => {
              query = '';
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
      </div>

      <div
        role="group"
        aria-label="Filter calendar events by category"
        class="mt-2 flex flex-nowrap items-center gap-1.5 overflow-x-auto px-0.5 pt-0.5 pb-3.5 [scrollbar-width:thin]"
      >
        <button
          type="button"
          aria-pressed={selectedCategories.length === 0}
          onclick={() => {
            selectedCategories = [];
          }}
          class={`inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-brand-crimson ${
            selectedCategories.length === 0
              ? 'border-brand-crimson bg-brand-crimson text-white'
              : 'border-border-subtle bg-surface-card text-ink-secondary hover:border-border-strong hover:text-ink-primary'
          }`}
        >
          <span>All Events</span>
        </button>

        {#each CALENDAR_CATEGORIES as cat (cat.id)}
          {@const isSelected = selectedCategories.includes(cat.id)}
          <button
            type="button"
            aria-pressed={isSelected}
            onclick={() => toggleCategory(cat.id)}
            class={`cal-cat-${cat.id} inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-brand-crimson ${
              isSelected
                ? 'cal-badge font-semibold ring-1 ring-inset ring-current'
                : 'border-border-subtle bg-surface-card text-ink-secondary hover:border-border-strong hover:text-ink-primary'
            }`}
          >
            <span aria-hidden="true" class="cal-dot h-2 w-2 shrink-0 rounded-full"></span>
            <span>{cat.label}</span>
          </button>
        {/each}
      </div>

      {#if monthGroups.length > 1 || hasActiveFilters}
        <div class="mt-1 flex items-center justify-between gap-3 text-xs text-ink-secondary">
          {#if monthGroups.length > 1}
            <nav
              aria-label="Jump to month"
              class="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto pt-0.5 pb-3 [scrollbar-width:thin]"
            >
              {#each monthGroups as group (group.month)}
                <a
                  href={`#month-${group.month}`}
                  class="shrink-0 rounded px-2 py-0.5 text-xs font-medium text-ink-secondary transition-colors hover:bg-surface-subtle hover:text-brand-crimson focus-visible:outline-2 focus-visible:outline-brand-crimson"
                >
                  {formatShortMonth(group.monthLabel)}
                </a>
              {/each}
            </nav>
          {:else}
            <span></span>
          {/if}
          {#if hasActiveFilters}
            <button
              type="button"
              onclick={clearAllFilters}
              class="shrink-0 cursor-pointer font-semibold text-brand-crimson hover:text-brand-crimson-hover hover:underline focus-visible:outline-2 focus-visible:outline-brand-crimson"
            >
              Reset
            </button>
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <div class="mx-auto max-w-5xl space-y-5 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
    {#if monthGroups.length === 0}
      <div class="rounded-xl border border-border-subtle bg-surface-card p-8 text-center">
        <p class="font-heading text-base font-bold text-ink-primary">
          No matching calendar events
        </p>
        <p class="mt-1 text-sm text-ink-secondary">
          Try another keyword or clear your active category filters.
        </p>
        <button
          type="button"
          onclick={clearAllFilters}
          class="mt-4 inline-flex cursor-pointer items-center rounded-lg bg-brand-crimson px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-crimson-hover focus-visible:outline-2 focus-visible:outline-brand-crimson"
        >
          Show all events
        </button>
      </div>
    {:else}
      <div class="space-y-6">
        {#each monthGroups as group (group.month)}
          <section
            id={`month-${group.month}`}
            aria-labelledby={`heading-${group.month}`}
            class="scroll-mt-56 overflow-hidden rounded-xl border border-border-subtle bg-surface-card shadow-xs sm:scroll-mt-60"
          >
            <div class="border-b border-border-subtle bg-surface-subtle/70 px-4 py-3 sm:px-5">
              <h2
                id={`heading-${group.month}`}
                class="font-heading text-base font-bold tracking-tight text-ink-primary sm:text-lg"
              >
                {group.monthLabel}
              </h2>
            </div>

            <ul class="divide-y divide-border-subtle">
              {#each group.events as event (event.id)}
                <li
                  class={`cal-cat-${event.category} flex flex-col gap-2 px-4 py-3.5 sm:flex-row sm:items-start sm:gap-4 sm:px-5`}
                >
                  <div class="flex shrink-0 items-center gap-2 sm:w-32 sm:pt-0.5">
                    <span
                      aria-hidden="true"
                      class="cal-dot h-1.5 w-1.5 shrink-0 rounded-full opacity-75"
                    ></span>
                    <span class="text-sm font-medium tabular-nums text-ink-secondary">
                      {#each splitHighlightedParts(event.dateText, searchTerms) as part, idx (idx)}
                        {#if part.match}
                          <mark class="rounded-xs bg-brand-crimson/15 px-0.5 font-semibold text-brand-crimson">{part.text}</mark>
                        {:else}
                          {part.text}
                        {/if}
                      {/each}
                    </span>
                  </div>

                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium leading-relaxed text-ink-primary">
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
                        The BulSU University President is granted authority to approve changes to
                        this event as necessary.
                      </p>
                    {/if}
                  </div>
                </li>
              {/each}
            </ul>
          </section>
        {/each}
      </div>
    {/if}

    <aside
      aria-label="Calendar source"
      class="rounded-xl border border-border-subtle bg-surface-card p-4 sm:p-5"
    >
      <p class="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
        Source
      </p>
      <ul class="mt-2 space-y-1.5">
        <li>
          <a
            href={ACADEMIC_CALENDAR_META.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-baseline gap-1.5 text-sm font-medium text-brand-crimson hover:text-brand-crimson-hover hover:underline underline-offset-2 transition-colors"
          >
            <span>{ACADEMIC_CALENDAR_META.sourceLabel}</span>
            <span aria-hidden="true">↗</span>
          </a>
        </li>
      </ul>
    </aside>
  </div>

  {#if showBackToTop}
    <button
      type="button"
      onclick={scrollToTop}
      aria-label="Back to top"
      class="fixed right-4 bottom-4 z-30 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border-subtle bg-surface-card/95 px-3.5 py-2 text-xs font-semibold text-ink-primary shadow-md backdrop-blur-xs transition-colors hover:border-brand-crimson hover:text-brand-crimson focus-visible:outline-2 focus-visible:outline-brand-crimson sm:right-6 sm:bottom-6"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        class="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="m18 15-6-6-6 6" />
      </svg>
      <span>Back to top</span>
    </button>
  {/if}
</section>
