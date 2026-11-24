import {
  CAMPUS_MAP_VIEWBOX,
  type CampusBuilding,
  type CampusLocation,
  type LocationCategory,
} from '../data/campus-map';

export interface MapSearchMatch {
  kind: 'location' | 'building';
  id: string;
  name: string;
  buildingId: string;
  buildingName: string;
  floor?: string;
  category?: LocationCategory;
  notes?: string;
  articleSlug?: string;
  score: number;
}

export interface ViewBoxRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

function parseViewBox(raw: string): ViewBoxRect {
  const [x = 0, y = 0, width = 1000, height = 850] = raw.trim().split(/\s+/).map(Number);
  return { x, y, width, height };
}

export const DEFAULT_MAP_VIEWBOX: ViewBoxRect = parseViewBox(CAMPUS_MAP_VIEWBOX);

const MIN_VIEWBOX_WIDTH = 280;
const MAX_VIEWBOX_WIDTH = DEFAULT_MAP_VIEWBOX.width;
const VIEWBOX_ASPECT = DEFAULT_MAP_VIEWBOX.height / DEFAULT_MAP_VIEWBOX.width;

/**
 * Literal substring search across campus indoor locations and buildings.
 * Prioritizes exact and partial location hits and preserves parent building metadata.
 */
export function searchCampusLocations(
  buildings: readonly CampusBuilding[],
  rawQuery: string,
  categoryFilter: LocationCategory | 'all' = 'all'
): MapSearchMatch[] {
  const query = rawQuery.trim().toLowerCase();
  const hasCategory = categoryFilter !== 'all';

  if (!query && !hasCategory) {
    return [];
  }

  const matches: MapSearchMatch[] = [];

  for (const building of buildings) {
    const bNameLower = building.name.toLowerCase();
    const bLabelLower = building.shortLabel.toLowerCase();
    const bSummaryLower = building.summary.toLowerCase();

    for (const college of building.colleges ?? []) {
      if (hasCategory && categoryFilter !== 'academic') {
        continue;
      }

      if (!query) {
        matches.push({
          kind: 'location',
          id: college.id,
          name: college.name,
          buildingId: building.id,
          buildingName: building.name,
          category: 'academic',
          score: 50,
        });
        continue;
      }

      const score = scoreLocationMatch(college, building.name, query);
      if (score > 0) {
        matches.push({
          kind: 'location',
          id: college.id,
          name: college.name,
          buildingId: building.id,
          buildingName: building.name,
          category: 'academic',
          score,
        });
      }
    }

    for (const loc of building.locations) {
      if (hasCategory && loc.category !== categoryFilter) {
        continue;
      }

      if (!query) {
        matches.push({
          kind: 'location',
          id: loc.id,
          name: loc.name,
          buildingId: building.id,
          buildingName: building.name,
          floor: loc.floor,
          category: loc.category,
          notes: loc.notes,
          articleSlug: loc.articleSlug,
          score: 50,
        });
        continue;
      }

      const score = scoreLocationMatch(loc, building.name, query);
      if (score > 0) {
        matches.push({
          kind: 'location',
          id: loc.id,
          name: loc.name,
          buildingId: building.id,
          buildingName: building.name,
          floor: loc.floor,
          category: loc.category,
          notes: loc.notes,
          articleSlug: loc.articleSlug,
          score,
        });
      }
    }

    if (!query || hasCategory) {
      continue;
    }

    let bScore = 0;
    if (bNameLower === query || bLabelLower === query) {
      bScore = 80;
    } else if (bNameLower.startsWith(query) || bLabelLower.startsWith(query)) {
      bScore = 65;
    } else if (
      bNameLower.includes(query) ||
      bLabelLower.includes(query) ||
      bSummaryLower.includes(query)
    ) {
      bScore = 40;
    }

    if (bScore > 0) {
      matches.push({
        kind: 'building',
        id: building.id,
        name: building.name,
        buildingId: building.id,
        buildingName: building.name,
        notes: building.summary,
        score: bScore,
      });
    }
  }

  return matches.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.kind !== b.kind) return a.kind === 'location' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

function scoreLocationMatch(
  loc: { name: string; keywords?: readonly string[]; floor?: string; notes?: string },
  buildingName: string,
  query: string
): number {
  const nameLower = loc.name.toLowerCase();
  if (nameLower === query) return 100;
  if (nameLower.startsWith(query)) return 85;
  if (nameLower.includes(query)) return 75;

  const keywords = loc.keywords ?? [];
  for (const kw of keywords) {
    const kwLower = kw.toLowerCase();
    if (kwLower === query) return 70;
    if (kwLower.includes(query)) return 60;
  }

  const floorLower = loc.floor?.toLowerCase() ?? '';
  const notesLower = loc.notes?.toLowerCase() ?? '';
  const buildingLower = buildingName.toLowerCase();
  if (
    notesLower.includes(query) ||
    floorLower.includes(query) ||
    buildingLower.includes(query)
  ) {
    return 45;
  }

  return 0;
}

/** Clamps SVG viewBox dimensions and pan coordinates within the campus canvas. */
export function clampViewBox(vb: ViewBoxRect): ViewBoxRect {
  const safeWidth = Number.isFinite(vb.width) && vb.width > 0 ? vb.width : DEFAULT_MAP_VIEWBOX.width;
  const safeX = Number.isFinite(vb.x) ? vb.x : DEFAULT_MAP_VIEWBOX.x;
  const safeY = Number.isFinite(vb.y) ? vb.y : DEFAULT_MAP_VIEWBOX.y;
  const width = Math.min(MAX_VIEWBOX_WIDTH, Math.max(MIN_VIEWBOX_WIDTH, safeWidth));
  const height = Math.round(width * VIEWBOX_ASPECT * 100) / 100;
  const minX = DEFAULT_MAP_VIEWBOX.x;
  const minY = DEFAULT_MAP_VIEWBOX.y;
  const maxX = DEFAULT_MAP_VIEWBOX.x + Math.max(0, DEFAULT_MAP_VIEWBOX.width - width);
  const maxY = DEFAULT_MAP_VIEWBOX.y + Math.max(0, DEFAULT_MAP_VIEWBOX.height - height);

  return {
    x: Math.round(Math.min(maxX, Math.max(minX, safeX)) * 100) / 100,
    y: Math.round(Math.min(maxY, Math.max(minY, safeY)) * 100) / 100,
    width: Math.round(width * 100) / 100,
    height,
  };
}

/**
 * Computes a zoomed SVG viewBox around a focal point.
 * `zoomMultiplier > 1` zooms in (smaller viewBox); `< 1` zooms out.
 */
export function computeZoomViewBox(
  current: ViewBoxRect,
  zoomMultiplier: number,
  focalPoint?: { x: number; y: number }
): ViewBoxRect {
  const safeCurrent = clampViewBox(current);
  if (!Number.isFinite(zoomMultiplier) || zoomMultiplier <= 0) {
    return safeCurrent;
  }

  const fx =
    focalPoint && Number.isFinite(focalPoint.x)
      ? focalPoint.x
      : safeCurrent.x + safeCurrent.width / 2;
  const fy =
    focalPoint && Number.isFinite(focalPoint.y)
      ? focalPoint.y
      : safeCurrent.y + safeCurrent.height / 2;
  const nextWidth = safeCurrent.width / zoomMultiplier;
  const clampedWidth = Math.min(
    MAX_VIEWBOX_WIDTH,
    Math.max(MIN_VIEWBOX_WIDTH, nextWidth)
  );
  const nextHeight = clampedWidth * VIEWBOX_ASPECT;
  const relX = (fx - safeCurrent.x) / safeCurrent.width;
  const relY = (fy - safeCurrent.y) / safeCurrent.height;

  return clampViewBox({
    x: fx - relX * clampedWidth,
    y: fy - relY * nextHeight,
    width: clampedWidth,
    height: nextHeight,
  });
}

export interface FocusViewBoxOffset {
  /** Shift target building horizontally relative to viewBox width (+ places building further right). */
  offsetXRatio?: number;
  /** Shift target building vertically relative to viewBox height (- places building higher). */
  offsetYRatio?: number;
}

/** Centers the SVG viewBox on a building coordinate at a readable zoom level, with optional overlay offset. */
export function focusBuildingViewBox(
  building: Pick<CampusBuilding, 'center'>,
  targetWidth = 480,
  offset?: FocusViewBoxOffset
): ViewBoxRect {
  const clampedWidth = Math.min(
    MAX_VIEWBOX_WIDTH,
    Math.max(MIN_VIEWBOX_WIDTH, targetWidth)
  );
  const targetHeight = clampedWidth * VIEWBOX_ASPECT;
  const rawX = offset?.offsetXRatio ?? 0;
  const rawY = offset?.offsetYRatio ?? 0;
  const offsetX = Number.isFinite(rawX) ? Math.min(0.35, Math.max(-0.35, rawX)) : 0;
  const offsetY = Number.isFinite(rawY) ? Math.min(0.35, Math.max(-0.35, rawY)) : 0;

  return clampViewBox({
    x: building.center.x - clampedWidth * (0.5 + offsetX),
    y: building.center.y - targetHeight * (0.5 + offsetY),
    width: clampedWidth,
    height: targetHeight,
  });
}

/**
 * Computes a panned viewBox from a pixel drag delta using uniform xMidYMid-meet
 * scaling so dragging feels 1:1 on both widescreen desktop and portrait mobile viewports.
 */
export function computePanViewBox(
  startViewBox: ViewBoxRect,
  dxPx: number,
  dyPx: number,
  svgRect: { width: number; height: number }
): ViewBoxRect {
  if (svgRect.width <= 0 || svgRect.height <= 0) {
    return startViewBox;
  }
  const unitsPerPx = Math.max(
    startViewBox.width / svgRect.width,
    startViewBox.height / svgRect.height
  );

  return clampViewBox({
    ...startViewBox,
    x: startViewBox.x - dxPx * unitsPerPx,
    y: startViewBox.y - dyPx * unitsPerPx,
  });
}

/**
 * Computes a combined pinch-zoom + pan viewBox keeping the campus point under
 * the initial two-finger midpoint aligned with the current two-finger midpoint,
 * accounting for uniform xMidYMid-meet letterboxing inside svgRect.
 */
export function computePinchViewBox(
  startViewBox: ViewBoxRect,
  svgRect: { left: number; top: number; width: number; height: number },
  startP1: { x: number; y: number },
  startP2: { x: number; y: number },
  currentP1: { x: number; y: number },
  currentP2: { x: number; y: number }
): ViewBoxRect {
  if (svgRect.width <= 0 || svgRect.height <= 0) {
    return startViewBox;
  }

  const startDist = Math.hypot(startP2.x - startP1.x, startP2.y - startP1.y);
  const currentDist = Math.hypot(
    currentP2.x - currentP1.x,
    currentP2.y - currentP1.y
  );
  const scale = startDist > 4 && currentDist > 0 ? currentDist / startDist : 1;

  const nextWidth = Math.min(
    MAX_VIEWBOX_WIDTH,
    Math.max(MIN_VIEWBOX_WIDTH, startViewBox.width / scale)
  );
  const nextHeight = nextWidth * VIEWBOX_ASPECT;

  const pxPerUnit = Math.min(
    svgRect.width / startViewBox.width,
    svgRect.height / startViewBox.height
  );
  const renderedWidth = startViewBox.width * pxPerUnit;
  const renderedHeight = startViewBox.height * pxPerUnit;
  const contentLeft = svgRect.left + (svgRect.width - renderedWidth) / 2;
  const contentTop = svgRect.top + (svgRect.height - renderedHeight) / 2;

  const startMidRelX =
    ((startP1.x + startP2.x) / 2 - contentLeft) / renderedWidth;
  const startMidRelY =
    ((startP1.y + startP2.y) / 2 - contentTop) / renderedHeight;
  const curMidRelX =
    ((currentP1.x + currentP2.x) / 2 - contentLeft) / renderedWidth;
  const curMidRelY =
    ((currentP1.y + currentP2.y) / 2 - contentTop) / renderedHeight;

  const anchorWorldX = startViewBox.x + startMidRelX * startViewBox.width;
  const anchorWorldY = startViewBox.y + startMidRelY * startViewBox.height;

  return clampViewBox({
    x: anchorWorldX - curMidRelX * nextWidth,
    y: anchorWorldY - curMidRelY * nextHeight,
    width: nextWidth,
    height: nextHeight,
  });
}

const TRAILING_ACRONYM_RE = /\(([^)]+)\)\s*$/;

/** Extracts a concise college code (e.g., "CICT", "CPTEd", "LHS") for compact UI pills. */
export function getCollegeShortLabel(college: { id: string; name: string }): string {
  const match = college.name.match(TRAILING_ACRONYM_RE);
  return match?.[1]?.trim() || college.id.toUpperCase();
}

const COLLEGE_LOCATION_RE = /^(?:College of |Laboratory High School\b)/i;
const NUMBERED_FLOOR_RE = /^(\d+)(?:st|nd|rd|th)\s+floor$/i;

function getFloorRank(floor?: string): number {
  if (!floor) return Number.POSITIVE_INFINITY;
  const trimmed = floor.trim();
  if (/^ground\s+floor$/i.test(trimmed)) return 0;
  const match = trimmed.match(NUMBERED_FLOOR_RE);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
}

function compareLocationNames(a: CampusLocation, b: CampusLocation): number {
  return a.name.localeCompare(b.name, 'en', { numeric: true, sensitivity: 'base' });
}

/**
 * Splits and sorts a building's locations into umbrella college/school entries first,
 * followed by floor-ranked locations (Ground, 1st..N, alphabetical within floor) and
 * locations without numeric/ground floor labels last (alphabetical).
 */
export function partitionBuildingLocations(locations: readonly CampusLocation[]): {
  colleges: CampusLocation[];
  others: CampusLocation[];
} {
  const colleges: CampusLocation[] = [];
  const others: CampusLocation[] = [];

  for (const loc of locations) {
    if (COLLEGE_LOCATION_RE.test(loc.name.trim())) {
      colleges.push(loc);
    } else {
      others.push(loc);
    }
  }

  colleges.sort(compareLocationNames);
  others.sort((a, b) => {
    const rankA = getFloorRank(a.floor);
    const rankB = getFloorRank(b.floor);
    return rankA !== rankB ? rankA - rankB : compareLocationNames(a, b);
  });

  return { colleges, others };
}

export interface FloorLocationGroup {
  floor: string;
  rank: number;
  locations: CampusLocation[];
}

/**
 * Splits `others` (non-college locations) into ordered floor/sub-location accordion
 * groups (Ground, 1st..N, named subtitles alphabetically, and "No Location" last).
 */
export function groupLocationsByFloor(locations: readonly CampusLocation[]): {
  floorGroups: FloorLocationGroup[];
} {
  const byKey = new Map<string, FloorLocationGroup>();

  for (const loc of locations) {
    const trimmedFloor = loc.floor?.trim();
    const label = trimmedFloor || 'No Location';
    const rank = trimmedFloor
      ? getFloorRank(trimmedFloor)
      : Number.POSITIVE_INFINITY;
    const key =
      trimmedFloor && rank < Number.POSITIVE_INFINITY
        ? `rank:${rank}`
        : trimmedFloor
          ? `label:${trimmedFloor.toLowerCase()}`
          : 'no-location';

    const existing = byKey.get(key);
    if (existing) {
      existing.locations.push(loc);
    } else {
      byKey.set(key, {
        floor: label,
        rank,
        locations: [loc],
      });
    }
  }

  const floorGroups = Array.from(byKey.values()).sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank;
    const aNoLocation = a.floor === 'No Location';
    const bNoLocation = b.floor === 'No Location';
    if (aNoLocation !== bNoLocation) return aNoLocation ? 1 : -1;
    return a.floor.localeCompare(b.floor, 'en', { numeric: true, sensitivity: 'base' });
  });

  for (const group of floorGroups) {
    group.locations.sort(compareLocationNames);
  }

  return { floorGroups };
}

/**
 * Infers a concise human-readable type label for a campus location card subtitle.
 */
export function getLocationType(loc: CampusLocation): string {
  const name = loc.name.trim();

  if (/^College of /i.test(name)) return 'College';
  if (/^Laboratory High School\b/i.test(name)) return 'High School';
  if (loc.category === 'food-housing') {
    return /cafeteria/i.test(name) ? 'Cafeteria' : 'Food Stall';
  }
  if (/clinic|health services/i.test(name)) return 'Clinic';
  if (/\b(?:dean's office|office|admissions|registrar|procurement|pdo|r & e|accre)\b/i.test(name)) {
    return 'Office';
  }
  if (/\bfaculty\b/i.test(name)) return 'Faculty Room';
  if (/\b(?:lab|laboratory|server room)\b/i.test(name)) return 'Laboratory';
  if (/\blibrary\b|book gallery/i.test(name)) return 'Library';
  if (/\bavr\b/i.test(name)) return 'Audio-Visual Room';
  if (/\btheater\b|\bamphitheater\b/i.test(name)) return 'Theater';
  if (/function hall|multipurpose hall/i.test(name)) return 'Function Hall';
  if (/lactation|child-minding/i.test(name)) return 'Student Services';
  if (/^(?:[A-Z]{1,4}[-\s]?\d+[A-Z]?|N\d+|IT \d+|CT \d+|SDL \d+|ACAD \d+|FT-\d+|DT-\d+|FH TL)$/i.test(name)) {
    return 'Classroom';
  }
  if (/\broom\b/i.test(name)) return 'Facility';

  if (loc.category === 'administration') return 'Office';
  if (loc.category === 'student-services') return 'Student Services';
  if (loc.category === 'library') return 'Library';
  if (loc.category === 'sports-events') return 'Event Venue';
  return 'Room';
}
