import { describe, expect, test } from 'bun:test';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { CAMPUS_BUILDINGS } from '../../src/data/campus-map';
import {
  computePanViewBox,
  computePinchViewBox,
  computeZoomViewBox,
  DEFAULT_MAP_VIEWBOX,
  focusBuildingViewBox,
  groupLocationsByFloor,
  partitionBuildingLocations,
  searchCampusLocations,
} from '../../src/lib/map-search';

const ARTICLES_DIR = resolve(import.meta.dir, '..', '..', 'src', 'content', 'articles');

describe('TC-UNIT-06: Campus map search, directory integrity, and viewBox math', () => {
  test('matches indoor locations cleanly and identifies their parent building', () => {
    const cictMatches = searchCampusLocations(CAMPUS_BUILDINGS, 'CICT');
    expect(cictMatches.length).toBeGreaterThan(0);
    expect(cictMatches[0]?.buildingId).toBe('pimentel-hall');
    expect(cictMatches[0]?.buildingName).toBe('Pimentel Hall');

    const ccjeMatches = searchCampusLocations(CAMPUS_BUILDINGS, 'CCJE');
    expect(ccjeMatches.length).toBeGreaterThan(0);
    expect(ccjeMatches[0]?.buildingId).toBe('ccje-building');
    expect(ccjeMatches[0]?.buildingName).toBe('CCJE Building');

    const kaEkekMatches = searchCampusLocations(CAMPUS_BUILDINGS, 'Ka Ekek');
    expect(kaEkekMatches.length).toBeGreaterThan(0);
    expect(kaEkekMatches[0]?.buildingId).toBe('con-canteen');
    expect(kaEkekMatches[0]?.buildingName).toBe('CON Canteen');
  });

  test('filters by location category without throwing on special regex characters', () => {
    const emptyWithSpecialChars = searchCampusLocations(
      CAMPUS_BUILDINGS,
      '([cict?.*])',
      'academic'
    );
    expect(Array.isArray(emptyWithSpecialChars)).toBe(true);
    expect(emptyWithSpecialChars).toHaveLength(0);

    const foodLocations = searchCampusLocations(CAMPUS_BUILDINGS, '', 'food-housing');
    expect(foodLocations.length).toBeGreaterThanOrEqual(2);
    expect(foodLocations.every((m) => m.category === 'food-housing')).toBe(true);
  });

  test('every location articleSlug in CAMPUS_BUILDINGS points to an existing article markdown file', () => {
    const missing: string[] = [];
    for (const building of CAMPUS_BUILDINGS) {
      for (const loc of building.locations) {
        if (!loc.articleSlug) continue;
        const filePath = resolve(ARTICLES_DIR, `${loc.articleSlug}.md`);
        if (!existsSync(filePath)) {
          missing.push(`${building.id}/${loc.id} -> ${loc.articleSlug}.md`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  test('viewBox zoom and building focus stay clamped within campus canvas bounds', () => {
    const zoomedIn = computeZoomViewBox(DEFAULT_MAP_VIEWBOX, 2);
    expect(zoomedIn.width).toBe(DEFAULT_MAP_VIEWBOX.width / 2);
    expect(zoomedIn.height).toBe(DEFAULT_MAP_VIEWBOX.height / 2);

    const overZoomedOut = computeZoomViewBox(DEFAULT_MAP_VIEWBOX, 0.2);
    expect(overZoomedOut).toEqual(DEFAULT_MAP_VIEWBOX);

    const focused = focusBuildingViewBox({ center: { x: -110, y: -510 } }, 480);
    expect(focused.x).toBe(DEFAULT_MAP_VIEWBOX.x);
    expect(focused.y).toBe(DEFAULT_MAP_VIEWBOX.y);
    expect(focused.width).toBe(480);
  });

  test('computePinchViewBox and computePanViewBox zoom around focal midpoint and pan within bounds', () => {
    const svgRect = {
      left: 0,
      top: 0,
      width: DEFAULT_MAP_VIEWBOX.width,
      height: DEFAULT_MAP_VIEWBOX.height,
    };
    const midY = svgRect.height / 2;
    const pinchedOut = computePinchViewBox(
      DEFAULT_MAP_VIEWBOX,
      svgRect,
      { x: svgRect.width * 0.4, y: midY },
      { x: svgRect.width * 0.6, y: midY },
      { x: svgRect.width * 0.3, y: midY },
      { x: svgRect.width * 0.7, y: midY }
    );
    expect(pinchedOut.width).toBe(DEFAULT_MAP_VIEWBOX.width / 2);
    expect(pinchedOut.x).toBe(DEFAULT_MAP_VIEWBOX.x + DEFAULT_MAP_VIEWBOX.width * 0.25);
    expect(pinchedOut.y).toBe(DEFAULT_MAP_VIEWBOX.y + DEFAULT_MAP_VIEWBOX.height * 0.25);

    const panned = computePanViewBox(pinchedOut, -100, -50, svgRect);
    expect(panned.x).toBe(pinchedOut.x + 50);
    expect(panned.y).toBe(pinchedOut.y + 25);
  });

  test('partitionBuildingLocations puts colleges first, then Ground -> 1st..N floors alphabetically, then floorless/non-numeric last alphabetically', () => {
    const pimentel = CAMPUS_BUILDINGS.find((b) => b.id === 'pimentel-hall');
    expect(pimentel).toBeDefined();
    const { colleges, others } = partitionBuildingLocations(pimentel!.locations);
    expect(colleges.map((c) => c.name)).toEqual([
      'College of Information & Communications Technology (CICT)',
      'College of Nursing (CON)',
    ]);
    expect(others.length).toBe(pimentel!.locations.length - 2);
    expect(others[0]?.floor).toBe('1st Floor');
    expect(others[0]?.name).toBe('A1');

    const mixed = partitionBuildingLocations([
      { id: '1', name: 'Zeta Room', category: 'academic' },
      { id: '2', name: 'Back Room', floor: 'Back', category: 'student-services' },
      { id: '3', name: 'Second B', floor: '2nd Floor', category: 'academic' },
      { id: '4', name: 'Ground Office', floor: 'Ground Floor', category: 'administration' },
      { id: '5', name: 'Laboratory High School', category: 'academic' },
      { id: '6', name: 'First A', floor: '1st Floor', category: 'academic' },
      { id: '7', name: 'Second A', floor: '2nd Floor', category: 'academic' },
    ]);
    expect(mixed.colleges.map((c) => c.name)).toEqual(['Laboratory High School']);
    expect(mixed.others.map((o) => o.name)).toEqual([
      'Ground Office',
      'First A',
      'Second A',
      'Second B',
      'Back Room',
      'Zeta Room',
    ]);
  });

  test('groupLocationsByFloor groups numeric/ground floors in order and keeps anything else unfloored', () => {
    const grouped = groupLocationsByFloor([
      { id: '1', name: 'Zeta Room', category: 'academic' },
      { id: '2', name: 'Back Room', floor: 'Back', category: 'student-services' },
      { id: '3', name: 'Second B', floor: '2nd Floor', category: 'academic' },
      { id: '4', name: 'Ground Office', floor: 'Ground Floor', category: 'administration' },
      { id: '5', name: 'First A', floor: '1st Floor', category: 'academic' },
      { id: '6', name: 'Second A', floor: '2nd Floor', category: 'academic' },
    ]);

    expect(grouped.floorGroups.map((g) => g.floor)).toEqual([
      'Ground Floor',
      '1st Floor',
      '2nd Floor',
    ]);
    expect(grouped.floorGroups[2]?.locations.map((l) => l.name)).toEqual([
      'Second A',
      'Second B',
    ]);
    expect(grouped.unfloored.map((l) => l.name)).toEqual(['Back Room', 'Zeta Room']);
  });
});
