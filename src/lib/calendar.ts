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

export interface CalendarMonthMeta {
  month: string;
  label: string;
  shortLabel: string;
}

export const CALENDAR_MONTHS: readonly CalendarMonthMeta[] = [
  { month: '2026-06', label: 'June 2026', shortLabel: "Jun '26" },
  { month: '2026-07', label: 'July 2026', shortLabel: "Jul '26" },
  { month: '2026-08', label: 'August 2026', shortLabel: "Aug '26" },
  { month: '2026-09', label: 'September 2026', shortLabel: "Sep '26" },
  { month: '2026-10', label: 'October 2026', shortLabel: "Oct '26" },
  { month: '2026-11', label: 'November 2026', shortLabel: "Nov '26" },
  { month: '2026-12', label: 'December 2026', shortLabel: "Dec '26" },
  { month: '2027-01', label: 'January 2027', shortLabel: "Jan '27" },
  { month: '2027-02', label: 'February 2027', shortLabel: "Feb '27" },
  { month: '2027-03', label: 'March 2027', shortLabel: "Mar '27" },
  { month: '2027-04', label: 'April 2027', shortLabel: "Apr '27" },
  { month: '2027-05', label: 'May 2027', shortLabel: "May '27" },
  { month: '2027-06', label: 'June 2027', shortLabel: "Jun '27" },
] as const;

const VALID_MONTH_SET = new Set(CALENDAR_MONTHS.map((m) => m.month));

const MONTH_ABBR_TO_NUM: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export function formatIsoDate(year: number, month: number, day: number): string {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

export function parseMonthKey(monthKey: string): { year: number; month: number } {
  const [y, m] = monthKey.split('-').map((v) => Number.parseInt(v, 10));
  return { year: y, month: m };
}

export function getTodayIso(today = new Date()): string {
  return formatIsoDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
}

/**
 * Returns the initial month key (`YYYY-MM`) for `/calendar`:
 * today's month if within `2026-06`..`2027-06`, otherwise clamped to the nearest bound.
 */
export function getDefaultCalendarMonth(today = new Date()): string {
  const current = `${today.getFullYear()}-${pad2(today.getMonth() + 1)}`;
  const first = CALENDAR_MONTHS[0]!.month;
  const last = CALENDAR_MONTHS[CALENDAR_MONTHS.length - 1]!.month;
  if (current < first) return first;
  if (current > last) return last;
  return current;
}

export function isValidCalendarMonth(month: string | null | undefined): month is string {
  return Boolean(month && VALID_MONTH_SET.has(month));
}

export function getDefaultSelectedDate(month: string, today = new Date()): string {
  const todayIso = getTodayIso(today);
  if (todayIso.startsWith(`${month}-`)) return todayIso;
  return `${month}-01`;
}

export function formatIsoDateReadable(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map((v) => Number.parseInt(v, 10));
  const date = new Date(Date.UTC(y, m - 1, d));
  const month = date.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
  const day = date.getUTCDate();
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
  const year = date.getUTCFullYear();
  return `${month} ${day}, ${weekday}, ${year}`;
}

export interface EventDateSpan {
  start: string;
  end: string;
}

/**
 * Expands `event.dateText` (e.g. `"29"`, `"1 to 3"`, `"29 to Jul 11"`, `"13, 16, 20"`,
 * `"17 to 21, 24"`, `"TBA"`) into exact `YYYY-MM-DD` spans.
 */
export function parseEventDateSpans(event: CalendarEvent): {
  spans: EventDateSpan[];
  tba: boolean;
} {
  const raw = event.dateText.trim();
  if (!raw || raw.toUpperCase() === 'TBA') {
    return { spans: [], tba: true };
  }

  const { year: startYear, month: startMonth } = parseMonthKey(event.month);
  const spans: EventDateSpan[] = [];

  for (const segment of raw.split(',')) {
    const part = segment.trim();
    if (!part) continue;

    const crossMonth = part.match(/^(\d{1,2})\s+to\s+([A-Za-z]{3})\s+(\d{1,2})$/i);
    if (crossMonth) {
      const startDay = Number.parseInt(crossMonth[1]!, 10);
      const endMonth = MONTH_ABBR_TO_NUM[crossMonth[2]!.toLowerCase()];
      const endDay = Number.parseInt(crossMonth[3]!, 10);
      if (endMonth) {
        const endYear = endMonth < startMonth ? startYear + 1 : startYear;
        spans.push({
          start: formatIsoDate(startYear, startMonth, startDay),
          end: formatIsoDate(endYear, endMonth, endDay),
        });
      }
      continue;
    }

    const sameMonthRange = part.match(/^(\d{1,2})\s+to\s+(\d{1,2})$/i);
    if (sameMonthRange) {
      const d1 = Number.parseInt(sameMonthRange[1]!, 10);
      const d2 = Number.parseInt(sameMonthRange[2]!, 10);
      spans.push({
        start: formatIsoDate(startYear, startMonth, Math.min(d1, d2)),
        end: formatIsoDate(startYear, startMonth, Math.max(d1, d2)),
      });
      continue;
    }

    const singleDay = part.match(/^(\d{1,2})$/);
    if (singleDay) {
      const d = Number.parseInt(singleDay[1]!, 10);
      const iso = formatIsoDate(startYear, startMonth, d);
      spans.push({ start: iso, end: iso });
    }
  }

  return { spans, tba: spans.length === 0 };
}

/**
 * Filters calendar events by multi-token literal substring query (matching title,
 * month, date text, or category label) and optional selected categories.
 */
export function filterCalendarEvents(
  events: readonly CalendarEvent[],
  rawQuery: string,
  selectedCategories: ReadonlySet<CalendarCategory> | readonly CalendarCategory[] = [],
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
  events: readonly CalendarEvent[],
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

function monthBounds(monthKey: string): { start: string; end: string } {
  const { year, month } = parseMonthKey(monthKey);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return {
    start: formatIsoDate(year, month, 1),
    end: formatIsoDate(year, month, daysInMonth),
  };
}

/** Counts matching events active in each of the 13 academic calendar months (including cross-month spans). */
export function countMatchingEventsByMonth(
  events: readonly CalendarEvent[],
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const m of CALENDAR_MONTHS) counts[m.month] = 0;

  for (const event of events) {
    const { spans, tba } = parseEventDateSpans(event);
    if (tba) {
      if (event.month in counts) counts[event.month]! += 1;
      continue;
    }
    for (const m of CALENDAR_MONTHS) {
      const { start, end } = monthBounds(m.month);
      if (spans.some((span) => span.start <= end && span.end >= start)) {
        counts[m.month]! += 1;
      }
    }
  }
  return counts;
}

export interface GridDayCell {
  date: string;
  day: number;
  inMonth: boolean;
  overflowCount: number;
}

export interface GridWeekSegment {
  event: CalendarEvent;
  startCol: number;
  endCol: number;
  lane: number;
  continuesBefore: boolean;
  continuesAfter: boolean;
  anchorDate: string;
}

export interface GridWeekRow {
  days: GridDayCell[];
  visibleSegments: GridWeekSegment[];
}

export interface MonthGridModel {
  month: string;
  weeks: GridWeekRow[];
  eventsByDate: Record<string, CalendarEvent[]>;
  tbaEvents: CalendarEvent[];
}

export const DESKTOP_MAX_EVENT_LANES = 2;

function addDaysIso(isoDate: string, offset: number): string {
  const [y, m, d] = isoDate.split('-').map((v) => Number.parseInt(v, 10));
  const dt = new Date(Date.UTC(y, m - 1, d + offset));
  return formatIsoDate(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
}

export function buildMonthGrid(
  monthKey: string,
  events: readonly CalendarEvent[],
): MonthGridModel {
  const { year, month } = parseMonthKey(monthKey);
  const firstOfMonth = new Date(Date.UTC(year, month - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const leadingPad = firstOfMonth.getUTCDay(); // 0 = Sun .. 6 = Sat
  const totalCells = Math.ceil((leadingPad + daysInMonth) / 7) * 7;
  const gridStartIso = addDaysIso(formatIsoDate(year, month, 1), -leadingPad);
  const gridEndIso = addDaysIso(gridStartIso, totalCells - 1);

  const parsedEvents = events.map((event) => ({
    event,
    ...parseEventDateSpans(event),
  }));

  const tbaEvents = parsedEvents
    .filter((entry) => entry.tba && entry.event.month === monthKey)
    .map((entry) => entry.event);

  const eventsByDate: Record<string, CalendarEvent[]> = {};
  for (let i = 0; i < totalCells; i += 1) {
    eventsByDate[addDaysIso(gridStartIso, i)] = [];
  }

  for (const { event, spans } of parsedEvents) {
    for (const span of spans) {
      if (span.end < gridStartIso || span.start > gridEndIso) continue;
      let cursor = span.start < gridStartIso ? gridStartIso : span.start;
      const limit = span.end > gridEndIso ? gridEndIso : span.end;
      while (cursor <= limit) {
        const bucket = eventsByDate[cursor];
        if (bucket && !bucket.some((existing) => existing.id === event.id)) {
          bucket.push(event);
        }
        cursor = addDaysIso(cursor, 1);
      }
    }
  }

  const weeks: GridWeekRow[] = [];
  const weekCount = totalCells / 7;

  for (let w = 0; w < weekCount; w += 1) {
    const weekStartIso = addDaysIso(gridStartIso, w * 7);
    const weekEndIso = addDaysIso(weekStartIso, 6);
    const days: GridDayCell[] = Array.from({ length: 7 }, (_, col) => {
      const date = addDaysIso(weekStartIso, col);
      const day = Number.parseInt(date.slice(8, 10), 10);
      return {
        date,
        day,
        inMonth: date.startsWith(`${monthKey}-`),
        overflowCount: 0,
      };
    });

    const rawSegments: Array<Omit<GridWeekSegment, 'lane'>> = [];
    for (const { event, spans } of parsedEvents) {
      for (const span of spans) {
        if (span.end < weekStartIso || span.start > weekEndIso) continue;
        const clampedStart = span.start < weekStartIso ? weekStartIso : span.start;
        const clampedEnd = span.end > weekEndIso ? weekEndIso : span.end;
        const startCol = days.findIndex((d) => d.date === clampedStart);
        const endCol = days.findIndex((d) => d.date === clampedEnd);
        if (startCol < 0 || endCol < 0) continue;
        rawSegments.push({
          event,
          startCol,
          endCol,
          continuesBefore: span.start < weekStartIso,
          continuesAfter: span.end > weekEndIso,
          anchorDate: clampedStart,
        });
      }
    }

    rawSegments.sort((a, b) => {
      if (a.startCol !== b.startCol) return a.startCol - b.startCol;
      const spanA = a.endCol - a.startCol;
      const spanB = b.endCol - b.startCol;
      if (spanB !== spanA) return spanB - spanA;
      return a.event.title.localeCompare(b.event.title);
    });

    const laneEndCols: number[] = [];
    const placedSegments: GridWeekSegment[] = [];

    for (const seg of rawSegments) {
      let lane = laneEndCols.findIndex((endCol) => endCol < seg.startCol);
      if (lane === -1) {
        lane = laneEndCols.length;
        laneEndCols.push(seg.endCol);
      } else {
        laneEndCols[lane] = seg.endCol;
      }
      placedSegments.push({ ...seg, lane });
    }

    const visibleSegments = placedSegments.filter((s) => s.lane < DESKTOP_MAX_EVENT_LANES);
    for (const seg of placedSegments) {
      if (seg.lane >= DESKTOP_MAX_EVENT_LANES) {
        for (let col = seg.startCol; col <= seg.endCol; col += 1) {
          days[col]!.overflowCount += 1;
        }
      }
    }

    weeks.push({ days, visibleSegments });
  }

  return { month: monthKey, weeks, eventsByDate, tbaEvents };
}
