import {
  SHOW_CAMPUS_2,
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

export const DEFAULT_MAP_VIEWBOX: ViewBoxRect = SHOW_CAMPUS_2
  ? {
      x: -120,
      y: -520,
      width: 1240,
      height: 1380,
    }
  : {
      x: 0,
      y: 0,
      width: 1000,
      height: 850,
    };

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
  loc: CampusBuilding['locations'][number],
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
  const width = Math.min(MAX_VIEWBOX_WIDTH, Math.max(MIN_VIEWBOX_WIDTH, vb.width));
  const height = Math.round(width * VIEWBOX_ASPECT * 100) / 100;
  const minX = DEFAULT_MAP_VIEWBOX.x;
  const minY = DEFAULT_MAP_VIEWBOX.y;
  const maxX = DEFAULT_MAP_VIEWBOX.x + Math.max(0, DEFAULT_MAP_VIEWBOX.width - width);
  const maxY = DEFAULT_MAP_VIEWBOX.y + Math.max(0, DEFAULT_MAP_VIEWBOX.height - height);

  return {
    x: Math.round(Math.min(maxX, Math.max(minX, vb.x)) * 100) / 100,
    y: Math.round(Math.min(maxY, Math.max(minY, vb.y)) * 100) / 100,
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
  const fx = focalPoint?.x ?? current.x + current.width / 2;
  const fy = focalPoint?.y ?? current.y + current.height / 2;
  const nextWidth = current.width / zoomMultiplier;
  const clampedWidth = Math.min(
    MAX_VIEWBOX_WIDTH,
    Math.max(MIN_VIEWBOX_WIDTH, nextWidth)
  );
  const nextHeight = clampedWidth * VIEWBOX_ASPECT;
  const relX = (fx - current.x) / current.width;
  const relY = (fy - current.y) / current.height;

  return clampViewBox({
    x: fx - relX * clampedWidth,
    y: fy - relY * nextHeight,
    width: clampedWidth,
    height: nextHeight,
  });
}

/** Centers the SVG viewBox on a building coordinate at a readable zoom level. */
export function focusBuildingViewBox(
  building: Pick<CampusBuilding, 'center'>,
  targetWidth = 480
): ViewBoxRect {
  const clampedWidth = Math.min(
    MAX_VIEWBOX_WIDTH,
    Math.max(MIN_VIEWBOX_WIDTH, targetWidth)
  );
  const targetHeight = clampedWidth * VIEWBOX_ASPECT;

  return clampViewBox({
    x: building.center.x - clampedWidth / 2,
    y: building.center.y - targetHeight / 2,
    width: clampedWidth,
    height: targetHeight,
  });
}

/** Computes a panned viewBox from a pixel drag delta relative to the SVG element rect. */
export function computePanViewBox(
  startViewBox: ViewBoxRect,
  dxPx: number,
  dyPx: number,
  svgRect: { width: number; height: number }
): ViewBoxRect {
  if (svgRect.width <= 0 || svgRect.height <= 0) {
    return startViewBox;
  }
  const scaleX = startViewBox.width / svgRect.width;
  const scaleY = startViewBox.height / svgRect.height;

  return clampViewBox({
    ...startViewBox,
    x: startViewBox.x - dxPx * scaleX,
    y: startViewBox.y - dyPx * scaleY,
  });
}

/**
 * Computes a combined pinch-zoom + pan viewBox keeping the campus point under
 * the initial two-finger midpoint aligned with the current two-finger midpoint.
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

  const startMidRelX =
    ((startP1.x + startP2.x) / 2 - svgRect.left) / svgRect.width;
  const startMidRelY =
    ((startP1.y + startP2.y) / 2 - svgRect.top) / svgRect.height;
  const curMidRelX =
    ((currentP1.x + currentP2.x) / 2 - svgRect.left) / svgRect.width;
  const curMidRelY =
    ((currentP1.y + currentP2.y) / 2 - svgRect.top) / svgRect.height;

  const anchorWorldX = startViewBox.x + startMidRelX * startViewBox.width;
  const anchorWorldY = startViewBox.y + startMidRelY * startViewBox.height;

  return clampViewBox({
    x: anchorWorldX - curMidRelX * nextWidth,
    y: anchorWorldY - curMidRelY * nextHeight,
    width: nextWidth,
    height: nextHeight,
  });
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
 * Splits `others` (non-college locations) into ordered floor accordion groups
 * (Ground, 1st..N) followed by remaining locations without a numeric/ground floor.
 */
export function groupLocationsByFloor(locations: readonly CampusLocation[]): {
  floorGroups: FloorLocationGroup[];
  unfloored: CampusLocation[];
} {
  const byRank = new Map<number, FloorLocationGroup>();
  const unfloored: CampusLocation[] = [];

  for (const loc of locations) {
    const rank = getFloorRank(loc.floor);
    if (rank === Number.POSITIVE_INFINITY || !loc.floor) {
      unfloored.push(loc);
      continue;
    }

    const existing = byRank.get(rank);
    if (existing) {
      existing.locations.push(loc);
    } else {
      byRank.set(rank, {
        floor: loc.floor.trim(),
        rank,
        locations: [loc],
      });
    }
  }

  const floorGroups = Array.from(byRank.values()).sort((a, b) => a.rank - b.rank);
  for (const group of floorGroups) {
    group.locations.sort(compareLocationNames);
  }
  unfloored.sort(compareLocationNames);

  return { floorGroups, unfloored };
}
