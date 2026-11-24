import {
  CALENDAR_CATEGORY_MAP,
  type CalendarCategory,
  type CalendarEvent,
} from '../data/academic-calendar';

export interface CalendarMonthGroup {
  month: string;
  monthLabel: string;
  events: CalendarEvent[];
}

/**
 * Filters calendar events by multi-token literal substring query (matching title,
 * month, date text, or category label) and optional selected categories.
 */
export function filterCalendarEvents(
  events: readonly CalendarEvent[],
  rawQuery: string,
  selectedCategories: ReadonlySet<CalendarCategory> | readonly CalendarCategory[] = []
): CalendarEvent[] {
  const categorySet =
    selectedCategories instanceof Set ? selectedCategories : new Set(selectedCategories);
  const terms = rawQuery
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  return events.filter((event) => {
    if (categorySet.size > 0 && !categorySet.has(event.category)) {
      return false;
    }

    if (terms.length === 0) {
      return true;
    }

    const haystack = [
      event.title,
      event.monthLabel,
      event.dateText,
      CALENDAR_CATEGORY_MAP[event.category].label,
    ]
      .join(' ')
      .toLowerCase();

    return terms.every((term) => haystack.includes(term));
  });
}

/** Groups calendar events chronologically by `YYYY-MM` while preserving intra-month order. */
export function groupCalendarEventsByMonth(
  events: readonly CalendarEvent[]
): CalendarMonthGroup[] {
  const map = new Map<string, CalendarMonthGroup>();

  for (const event of events) {
    const existing = map.get(event.month);
    if (existing) {
      existing.events.push(event);
    } else {
      map.set(event.month, {
        month: event.month,
        monthLabel: event.monthLabel,
        events: [event],
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month));
}
