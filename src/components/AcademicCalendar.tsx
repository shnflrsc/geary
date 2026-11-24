import { useEffect, useMemo, useState } from 'react';
import {
  ACADEMIC_CALENDAR_EVENTS,
  ACADEMIC_CALENDAR_META,
  CALENDAR_CATEGORIES,
  type CalendarCategory,
} from '../data/academic-calendar';
import { filterCalendarEvents, groupCalendarEventsByMonth } from '../lib/calendar';

function formatShortMonth(monthLabel: string): string {
  const [monthName = '', year = ''] = monthLabel.split(' ');
  return `${monthName.slice(0, 3)} '${year.slice(-2)}`;
}

export default function AcademicCalendar() {
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<CalendarCategory[]>([]);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 300);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function scrollToTop() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  }

  const categoryCounts = useMemo(() => {
    const counts: Record<CalendarCategory, number> = {
      all: 0,
      undergraduate: 0,
      'graduate-school': 0,
      'laboratory-high-school': 0,
      'college-of-law': 0,
      'college-of-medicine': 0,
      holiday: 0,
    };
    for (const event of ACADEMIC_CALENDAR_EVENTS) {
      counts[event.category] += 1;
    }
    return counts;
  }, []);

  const filteredEvents = useMemo(
    () => filterCalendarEvents(ACADEMIC_CALENDAR_EVENTS, query, selectedCategories),
    [query, selectedCategories]
  );

  const monthGroups = useMemo(
    () => groupCalendarEventsByMonth(filteredEvents),
    [filteredEvents]
  );

  const hasActiveFilters = query.trim().length > 0 || selectedCategories.length > 0;

  function toggleCategory(category: CalendarCategory) {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]
    );
  }

  function clearAllFilters() {
    setQuery('');
    setSelectedCategories([]);
  }

  return (
    <section aria-label="BulSU Academic Calendar events">
      {/* Sticky Search & Category Filter Bar Connected to Header */}
      <div className="sticky top-16 z-30 border-b border-border-subtle bg-canvas-paper/95 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8">
          <div className="relative flex items-center">
            <svg
              className="pointer-events-none absolute left-3 h-4 w-4 text-ink-muted"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search academic calendar events"
              placeholder="Search Academic Calendar..."
              className="w-full rounded-lg border border-border-strong bg-surface-card py-2 pr-9 pl-9 text-sm text-ink-primary placeholder:text-ink-muted focus:border-brand-crimson focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear calendar search"
                className="absolute right-2 inline-flex h-6 w-6 items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-surface-subtle hover:text-ink-primary focus-visible:outline-2 focus-visible:outline-brand-crimson"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Category Filter Pills (Single Scrollable Row) */}
          <div
            role="group"
            aria-label="Filter calendar events by category"
            className="mt-2 flex flex-nowrap items-center gap-1.5 overflow-x-auto px-0.5 pt-0.5 pb-2.5 [scrollbar-width:thin]"
          >
            <button
              type="button"
              aria-pressed={selectedCategories.length === 0}
              onClick={() => setSelectedCategories([])}
              className={`inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-brand-crimson ${
                selectedCategories.length === 0
                  ? 'border-brand-crimson bg-brand-crimson text-white'
                  : 'border-border-subtle bg-surface-card text-ink-secondary hover:border-border-strong hover:text-ink-primary'
              }`}
            >
              <span>All Events</span>
              <span className="opacity-80">({ACADEMIC_CALENDAR_EVENTS.length})</span>
            </button>

            {CALENDAR_CATEGORIES.map((cat) => {
              const isSelected = selectedCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleCategory(cat.id)}
                  className={`cal-cat-${cat.id} inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-brand-crimson ${
                    isSelected
                      ? 'cal-badge font-semibold ring-1 ring-inset ring-current'
                      : 'border-border-subtle bg-surface-card text-ink-secondary hover:border-border-strong hover:text-ink-primary'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="cal-dot h-2 w-2 shrink-0 rounded-full"
                  />
                  <span>{cat.label}</span>
                  <span className="text-[11px] opacity-75">({categoryCounts[cat.id]})</span>
                </button>
              );
            })}
          </div>

          {/* Compact Quick Month Jump & Reset */}
          {(monthGroups.length > 1 || hasActiveFilters) && (
            <div className="mt-1 flex items-center justify-between gap-3 text-xs text-ink-secondary">
              {monthGroups.length > 1 ? (
                <nav
                  aria-label="Jump to month"
                  className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto pt-0.5 pb-2 [scrollbar-width:thin]"
                >
                  {monthGroups.map((group) => (
                    <a
                      key={group.month}
                      href={`#month-${group.month}`}
                      className="shrink-0 rounded px-2 py-0.5 text-xs font-medium text-ink-secondary transition-colors hover:bg-surface-subtle hover:text-brand-crimson focus-visible:outline-2 focus-visible:outline-brand-crimson"
                    >
                      {formatShortMonth(group.monthLabel)}
                    </a>
                  ))}
                </nav>
              ) : (
                <span />
              )}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="shrink-0 cursor-pointer font-semibold text-brand-crimson hover:text-brand-crimson-hover hover:underline focus-visible:outline-2 focus-visible:outline-brand-crimson"
                >
                  Reset
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="mx-auto max-w-5xl space-y-5 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">

      {/* Month-Grouped Schedule */}
      {monthGroups.length === 0 ? (
        <div className="rounded-xl border border-border-subtle bg-surface-card p-8 text-center">
          <p className="font-heading text-base font-bold text-ink-primary">
            No matching calendar events
          </p>
          <p className="mt-1 text-sm text-ink-secondary">
            Try another keyword or clear your active category filters.
          </p>
          <button
            type="button"
            onClick={clearAllFilters}
            className="mt-4 inline-flex cursor-pointer items-center rounded-lg bg-brand-crimson px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-crimson-hover focus-visible:outline-2 focus-visible:outline-brand-crimson"
          >
            Show all events
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {monthGroups.map((group) => (
            <section
              key={group.month}
              id={`month-${group.month}`}
              aria-labelledby={`heading-${group.month}`}
              className="scroll-mt-56 overflow-hidden rounded-xl border border-border-subtle bg-surface-card shadow-xs sm:scroll-mt-60"
            >
              <div className="border-b border-border-subtle bg-surface-subtle/70 px-4 py-3 sm:px-5">
                <h2
                  id={`heading-${group.month}`}
                  className="font-heading text-base font-bold tracking-tight text-ink-primary sm:text-lg"
                >
                  {group.monthLabel}
                </h2>
              </div>

              <ul className="divide-y divide-border-subtle">
                {group.events.map((event) => (
                  <li
                    key={event.id}
                    className={`cal-cat-${event.category} flex flex-col gap-2 px-4 py-3.5 sm:flex-row sm:items-start sm:gap-4 sm:px-5`}
                  >
                    <div className="flex shrink-0 items-center gap-2 sm:w-32 sm:pt-0.5">
                      <span
                        aria-hidden="true"
                        className="cal-dot h-2.5 w-2.5 shrink-0 rounded-xs"
                      />
                      <span className="text-sm font-bold tabular-nums text-ink-primary">
                        {event.dateText}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-relaxed text-ink-primary">
                        {event.subjectToPresidentialChange && (
                          <span
                            title="Subject to approval/change by the BulSU University President"
                            className="mr-1 font-bold text-brand-crimson"
                          >
                            *
                          </span>
                        )}
                        {event.title}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {/* Presidential Schedule Change Footnote Card */}
      <aside
        aria-label="Schedule change notice"
        className="rounded-xl border border-border-subtle bg-surface-subtle/60 p-4 text-xs leading-relaxed text-ink-secondary sm:p-5"
      >
        <p>
          <span className="font-bold text-brand-crimson">*</span>{' '}
          {ACADEMIC_CALENDAR_META.presidentialNote}
        </p>
      </aside>

      {/* Source Card (matching ArticleLayout source card) */}
      <aside
        aria-label="Calendar source"
        className="rounded-xl border border-border-subtle bg-surface-card p-4 sm:p-5"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
          Source
        </p>
        <ul className="mt-2 space-y-1.5">
          <li>
            <a
              href={ACADEMIC_CALENDAR_META.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-baseline gap-1.5 text-sm font-medium text-brand-crimson hover:text-brand-crimson-hover hover:underline underline-offset-2 transition-colors"
            >
              <span>{ACADEMIC_CALENDAR_META.sourceLabel}</span>
              <span aria-hidden="true">↗</span>
            </a>
          </li>
        </ul>
      </aside>
      </div>

      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed right-4 bottom-4 z-30 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border-subtle bg-surface-card/95 px-3.5 py-2 text-xs font-semibold text-ink-primary shadow-md backdrop-blur-xs transition-colors hover:border-brand-crimson hover:text-brand-crimson focus-visible:outline-2 focus-visible:outline-brand-crimson sm:right-6 sm:bottom-6"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-3.5 w-3.5"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m18 15-6-6-6 6" />
          </svg>
          <span>Back to top</span>
        </button>
      )}
    </section>
  );
}
