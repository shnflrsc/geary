/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import {
  ACADEMIC_CALENDAR_EVENTS,
  CALENDAR_CATEGORIES,
  CALENDAR_CATEGORY_MAP,
} from '../../src/data/academic-calendar';
import { filterCalendarEvents, groupCalendarEventsByMonth } from '../../src/lib/calendar';

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
});
