/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import {
  ACADEMIC_CALENDAR_EVENTS,
  CALENDAR_CATEGORIES,
  CALENDAR_CATEGORY_MAP,
} from '../../src/data/academic-calendar';
import {
  buildMonthGrid,
  countMatchingEventsByMonth,
  filterCalendarEvents,
  formatIsoDateReadable,
  getDefaultCalendarMonth,
  groupCalendarEventsByMonth,
  parseEventDateSpans,
} from '../../src/lib/calendar';

describe('TC-UNIT-07: Academic calendar dataset, filtering, and chronological grouping', () => {
  test('contains complete AY 2026-2027 events with valid categories and unique IDs', () => {
    expect(ACADEMIC_CALENDAR_EVENTS.length).toBeGreaterThan(150);

    const ids = new Set<string>();
    for (const event of ACADEMIC_CALENDAR_EVENTS) {
      expect(ids.has(event.id)).toBe(false);
      ids.add(event.id);
      expect(event.month).toMatch(/^\d{4}-\d{2}$/);
      expect(event.monthLabel.length).toBeGreaterThan(0);
      expect(event.dateText.length).toBeGreaterThan(0);
      expect(event.title.length).toBeGreaterThan(0);
      expect(CALENDAR_CATEGORY_MAP[event.category]).toBeDefined();
    }

    // Every legend category has at least one event represented.
    for (const cat of CALENDAR_CATEGORIES) {
      expect(ACADEMIC_CALENDAR_EVENTS.some((e) => e.category === cat.id)).toBe(true);
    }
  });

  test('filters events by category chips (single and multi-select) and multi-token search safely', () => {
    const holidays = filterCalendarEvents(ACADEMIC_CALENDAR_EVENTS, '', ['holiday']);
    expect(holidays.length).toBeGreaterThan(10);
    expect(holidays.every((e) => e.category === 'holiday')).toBe(true);

    const lawAndMed = filterCalendarEvents(ACADEMIC_CALENDAR_EVENTS, '', [
      'college-of-law',
      'college-of-medicine',
    ]);
    expect(
      lawAndMed.every((e) => e.category === 'college-of-law' || e.category === 'college-of-medicine')
    ).toBe(true);

    const juneStart = filterCalendarEvents(ACADEMIC_CALENDAR_EVENTS, 'June Start of Classes');
    expect(juneStart.length).toBeGreaterThanOrEqual(1);
    expect(juneStart.some((e) => e.month === '2026-06')).toBe(true);

    // Special regex characters must behave as safe literal substrings.
    expect(() => filterCalendarEvents(ACADEMIC_CALENDAR_EVENTS, '(.*)[?+\\')).not.toThrow();
    expect(filterCalendarEvents(ACADEMIC_CALENDAR_EVENTS, '(.*)[?+\\')).toEqual([]);
  });

  test('groups filtered events chronologically from June 2026 to June 2027', () => {
    const groups = groupCalendarEventsByMonth(ACADEMIC_CALENDAR_EVENTS);
    expect(groups.length).toBe(13);
    expect(groups[0]?.month).toBe('2026-06');
    expect(groups[groups.length - 1]?.month).toBe('2027-06');

    for (let i = 1; i < groups.length; i += 1) {
      expect(groups[i - 1]!.month < groups[i]!.month).toBe(true);
    }
  });

  test('parses single, range, disjoint, cross-month, year-wrap, and TBA dateText formats', () => {
    const base = {
      id: 'test',
      month: '2026-06',
      monthLabel: 'June 2026',
      title: 'Test Event',
      category: 'all' as const,
    };

    expect(parseEventDateSpans({ ...base, dateText: '29' })).toEqual({
      spans: [{ start: '2026-06-29', end: '2026-06-29' }],
      tba: false,
    });

    expect(parseEventDateSpans({ ...base, dateText: '29 to Jul 11' })).toEqual({
      spans: [{ start: '2026-06-29', end: '2026-07-11' }],
      tba: false,
    });

    expect(
      parseEventDateSpans({ ...base, month: '2026-12', monthLabel: 'December 2026', dateText: '14 to Jan 9' }),
    ).toEqual({
      spans: [{ start: '2026-12-14', end: '2027-01-09' }],
      tba: false,
    });

    expect(parseEventDateSpans({ ...base, dateText: '17 to 21, 24' })).toEqual({
      spans: [
        { start: '2026-06-17', end: '2026-06-21' },
        { start: '2026-06-24', end: '2026-06-24' },
      ],
      tba: false,
    });

    expect(parseEventDateSpans({ ...base, dateText: 'TBA' })).toEqual({
      spans: [],
      tba: true,
    });

    // Every dataset event parses cleanly without throwing.
    for (const event of ACADEMIC_CALENDAR_EVENTS) {
      const parsed = parseEventDateSpans(event);
      expect(parsed.tba || parsed.spans.length > 0).toBe(true);
    }
  });

  test('clamps default calendar month and builds Sun-Sat month grid with spillover', () => {
    expect(getDefaultCalendarMonth(new Date('2026-01-15T00:00:00Z'))).toBe('2026-06');
    expect(getDefaultCalendarMonth(new Date('2026-11-27T00:00:00Z'))).toBe('2026-11');
    expect(getDefaultCalendarMonth(new Date('2027-09-01T00:00:00Z'))).toBe('2027-06');

    const julyGrid = buildMonthGrid('2026-07', ACADEMIC_CALENDAR_EVENTS);
    expect(julyGrid.weeks.length).toBeGreaterThanOrEqual(4);
    expect(julyGrid.weeks[0]!.days).toHaveLength(7);
    // "29 to Jul 11" from June 2026 spills into July 1–11.
    expect(julyGrid.eventsByDate['2026-07-02']?.length).toBeGreaterThan(0);

    const counts = countMatchingEventsByMonth(ACADEMIC_CALENDAR_EVENTS);
    expect(counts['2026-06']).toBeGreaterThan(0);
    expect(counts['2027-06']).toBeGreaterThan(0);
    expect(formatIsoDateReadable('2026-11-27')).toBe('November 27, Friday, 2026');
  });
});
