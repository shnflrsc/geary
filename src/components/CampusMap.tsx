import { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  CAMPUS_BUILDINGS,
  CAMPUS_GATES,
  CAMPUS_PARKS,
  CAMPUS_PATHS,
  CAMPUS_PERIMETER_PATH,
  type CampusBuilding,
} from '../data/campus-map';
import {
  computePanViewBox,
  computePinchViewBox,
  computeZoomViewBox,
  DEFAULT_MAP_VIEWBOX,
  focusBuildingViewBox,
  searchCampusLocations,
  type MapSearchMatch,
  type ViewBoxRect,
} from '../lib/map-search';

type GestureState =
  | {
      mode: 'pan';
      pointerId: number;
      moved: boolean;
      startX: number;
      startY: number;
      startViewBox: ViewBoxRect;
    }
  | {
      mode: 'pinch';
      id1: number;
      id2: number;
      startP1: { x: number; y: number };
      startP2: { x: number; y: number };
      startViewBox: ViewBoxRect;
    };

function formatViewBox(vb: ViewBoxRect): string {
  return `${vb.x} ${vb.y} ${vb.width} ${vb.height}`;
}

export default function CampusMap() {
  const [query, setQuery] = useState('');
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [highlightedLocationId, setHighlightedLocationId] = useState<string | null>(null);
  const [hoveredBuildingId, setHoveredBuildingId] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeMatchIndex, setActiveMatchIndex] = useState(-1);
  const [viewBox, setViewBox] = useState<ViewBoxRect>(DEFAULT_MAP_VIEWBOX);
  const [isDragging, setIsDragging] = useState(false);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const searchWrapperRef = useRef<HTMLDivElement | null>(null);
  const viewBoxRef = useRef<ViewBoxRect>(DEFAULT_MAP_VIEWBOX);
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const gestureRef = useRef<GestureState | null>(null);
  const didGestureMoveRef = useRef(false);

  function updateViewBox(
    updater: ViewBoxRect | ((prev: ViewBoxRect) => ViewBoxRect)
  ) {
    setViewBox((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      viewBoxRef.current = next;
      return next;
    });
  }

  const listboxId = useId();
  const searchInputId = useId();

  const buildingById = useMemo(() => {
    const map = new Map<string, CampusBuilding>();
    for (const b of CAMPUS_BUILDINGS) {
      map.set(b.id, b);
    }
    return map;
  }, []);

  const locationListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!highlightedLocationId || !locationListRef.current) return;
    const matchEl = locationListRef.current.querySelector<HTMLElement>('[data-search-match="true"]');
    matchEl?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [highlightedLocationId, selectedBuildingId]);

  const selectedBuilding = selectedBuildingId
    ? buildingById.get(selectedBuildingId) ?? null
    : null;

  const searchMatches = useMemo(() => {
    if (!query.trim()) return [];
    return searchCampusLocations(CAMPUS_BUILDINGS, query).slice(0, 12);
  }, [query]);

  const matchingBuildingIds = useMemo(() => {
    const ids = new Set<string>();
    if (query.trim()) {
      for (const m of searchMatches) ids.add(m.buildingId);
    }
    return ids;
  }, [query, searchMatches]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    function handleWheel(event: WheelEvent) {
      event.preventDefault();
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const relX = (event.clientX - rect.left) / rect.width;
      const relY = (event.clientY - rect.top) / rect.height;
      const factor = event.deltaY < 0 ? 1.2 : 1 / 1.2;

      updateViewBox((prev) =>
        computeZoomViewBox(prev, factor, {
          x: prev.x + relX * prev.width,
          y: prev.y + relY * prev.height,
        })
      );
    }

    function preventTouchScroll(event: TouchEvent) {
      event.preventDefault();
    }

    svg.addEventListener('wheel', handleWheel, { passive: false });
    svg.addEventListener('touchmove', preventTouchScroll, { passive: false });
    return () => {
      svg.removeEventListener('wheel', handleWheel);
      svg.removeEventListener('touchmove', preventTouchScroll);
    };
  }, []);

  function selectBuilding(
    buildingId: string,
    options?: { locationId?: string | null; centerMap?: boolean }
  ) {
    const building = buildingById.get(buildingId);
    if (!building) return;

    setSelectedBuildingId(building.id);
    setHighlightedLocationId(options?.locationId ?? null);

    if (options?.centerMap) {
      updateViewBox(focusBuildingViewBox(building));
    }
  }

  function handleSelectMatch(match: MapSearchMatch) {
    selectBuilding(match.buildingId, {
      locationId: match.kind === 'location' ? match.id : null,
      centerMap: true,
    });
    setDropdownOpen(false);
    setActiveMatchIndex(-1);
  }

  function handleSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!dropdownOpen || searchMatches.length === 0) {
      if (event.key === 'ArrowDown' && searchMatches.length > 0) {
        setDropdownOpen(true);
        setActiveMatchIndex(0);
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveMatchIndex((prev) => (prev + 1) % searchMatches.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveMatchIndex((prev) =>
        prev <= 0 ? searchMatches.length - 1 : prev - 1
      );
    } else if (event.key === 'Enter' && activeMatchIndex >= 0) {
      event.preventDefault();
      const match = searchMatches[activeMatchIndex];
      if (match) handleSelectMatch(match);
    } else if (event.key === 'Escape') {
      setDropdownOpen(false);
      setActiveMatchIndex(-1);
    }
  }

  function handlePointerDown(event: React.PointerEvent<SVGSVGElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    const pointers = activePointersRef.current;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.size === 1) {
      didGestureMoveRef.current = false;
      gestureRef.current = {
        mode: 'pan',
        pointerId: event.pointerId,
        moved: false,
        startX: event.clientX,
        startY: event.clientY,
        startViewBox: viewBoxRef.current,
      };
      return;
    }

    if (pointers.size === 2) {
      const entries = Array.from(pointers.entries());
      const [first, second] = entries;
      if (first && second) {
        didGestureMoveRef.current = true;
        setIsDragging(true);
        gestureRef.current = {
          mode: 'pinch',
          id1: first[0],
          id2: second[0],
          startP1: { ...first[1] },
          startP2: { ...second[1] },
          startViewBox: viewBoxRef.current,
        };
      }
    }
  }

  function handlePointerMove(event: React.PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    const pointers = activePointersRef.current;
    if (!svg || !pointers.has(event.pointerId)) return;

    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const gesture = gestureRef.current;
    if (!gesture) return;

    const rect = svg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    if (gesture.mode === 'pinch') {
      const p1 = pointers.get(gesture.id1);
      const p2 = pointers.get(gesture.id2);
      if (!p1 || !p2) return;

      updateViewBox(
        computePinchViewBox(
          gesture.startViewBox,
          rect,
          gesture.startP1,
          gesture.startP2,
          p1,
          p2
        )
      );
      return;
    }

    if (gesture.pointerId !== event.pointerId) return;

    const dxPx = event.clientX - gesture.startX;
    const dyPx = event.clientY - gesture.startY;

    if (!gesture.moved) {
      if (Math.hypot(dxPx, dyPx) < 5) {
        return;
      }
      gesture.moved = true;
      didGestureMoveRef.current = true;
      setIsDragging(true);
      try {
        svg.setPointerCapture(event.pointerId);
      } catch {
        // Ignore if capture is unsupported on a synthetic test event
      }
    }

    updateViewBox(computePanViewBox(gesture.startViewBox, dxPx, dyPx, rect));
  }

  function handlePointerEnd(event: React.PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    const pointers = activePointersRef.current;
    pointers.delete(event.pointerId);

    if (svg) {
      try {
        if (svg.hasPointerCapture(event.pointerId)) {
          svg.releasePointerCapture(event.pointerId);
        }
      } catch {
        // Ignore if release fails
      }
    }

    if (pointers.size === 1) {
      const remaining = Array.from(pointers.entries())[0];
      if (remaining) {
        gestureRef.current = {
          mode: 'pan',
          pointerId: remaining[0],
          moved: true,
          startX: remaining[1].x,
          startY: remaining[1].y,
          startViewBox: viewBoxRef.current,
        };
      }
      return;
    }

    if (pointers.size === 0) {
      gestureRef.current = null;
      setIsDragging(false);
    }
  }

  function handleBuildingClick(buildingId: string) {
    if (didGestureMoveRef.current) {
      didGestureMoveRef.current = false;
      return;
    }
    selectBuilding(buildingId, { locationId: null, centerMap: false });
  }

  function handleResetMap() {
    updateViewBox(DEFAULT_MAP_VIEWBOX);
  }

  const isZoomed = viewBox.width < DEFAULT_MAP_VIEWBOX.width - 1;

  return (
    <section aria-label="Interactive BulSU Malolos Main Campus Map" className="space-y-4">
      {/* Search Bar */}
      <div ref={searchWrapperRef} className="relative">
        <div className="relative flex items-center">
          <svg
            className="pointer-events-none absolute left-3.5 h-4 w-4 text-ink-muted"
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
            id={searchInputId}
            type="search"
            value={query}
            role="combobox"
            aria-label="Search offices, services, or buildings"
            aria-expanded={dropdownOpen && query.trim().length > 0}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={
              activeMatchIndex >= 0 && searchMatches[activeMatchIndex]
                ? `map-match-${searchMatches[activeMatchIndex].kind}-${searchMatches[activeMatchIndex].id}`
                : undefined
            }
            onChange={(event) => {
              setQuery(event.target.value);
              setDropdownOpen(true);
              setActiveMatchIndex(-1);
            }}
            onFocus={() => {
              if (query.trim()) setDropdownOpen(true);
            }}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search..."
            className="w-full rounded-lg border border-border-strong bg-surface-card py-3 pr-20 pl-10 text-sm text-ink-primary shadow-xs placeholder:text-ink-muted focus:border-brand-crimson focus:outline-none focus:ring-2 focus:ring-brand-crimson/20"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setHighlightedLocationId(null);
                setDropdownOpen(false);
                setActiveMatchIndex(-1);
              }}
              className="absolute right-2.5 rounded px-2 py-1 text-xs font-medium text-ink-secondary hover:bg-surface-subtle hover:text-ink-primary focus-visible:outline-2 focus-visible:outline-brand-crimson"
            >
              Clear
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {dropdownOpen && query.trim().length > 0 && (
          <div
            id={listboxId}
            role="listbox"
            aria-label="Campus location search results"
            className="absolute z-30 mt-1.5 max-h-80 w-full overflow-y-auto rounded-md border border-border-subtle bg-surface-card shadow-lg"
          >
            {searchMatches.length === 0 ? (
              <div className="px-4 py-3 text-sm text-ink-secondary">
                No campus locations matched{' '}
                <span className="font-semibold text-ink-primary">"{query}"</span>.
              </div>
            ) : (
              <ul className="divide-y divide-border-subtle">
                {searchMatches.map((match, idx) => {
                  const isActive = idx === activeMatchIndex;
                  return (
                    <li key={`${match.kind}-${match.id}`}>
                      <button
                        id={`map-match-${match.kind}-${match.id}`}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        onClick={() => handleSelectMatch(match)}
                        className={`flex w-full items-start justify-between gap-3 px-4 py-2.5 text-left transition-colors ${
                          isActive ? 'bg-brand-crimson-wash' : 'hover:bg-surface-subtle'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-ink-primary">
                            {match.name}
                          </p>
                          <p className="mt-0.5 text-xs text-ink-secondary">
                            {match.kind === 'location' ? (
                              <>
                                Inside{' '}
                                <span className="font-semibold text-brand-crimson">
                                  {match.buildingName}
                                </span>
                                {match.floor ? ` · ${match.floor}` : ''}
                              </>
                            ) : (
                              <>Building</>
                            )}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Main Split Workspace: Interactive 2D SVG Map + Selected Building Locations */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-start">
        {/* Interactive Map Viewport */}
        <div className="overflow-hidden rounded-lg border border-border-subtle bg-surface-card shadow-xs lg:col-span-7 xl:col-span-8">
          <div className="relative bg-surface-subtle touch-none select-none">
            <div
              className="absolute top-3 left-3 z-10 flex items-center gap-1.5"
              role="group"
              aria-label="Map zoom controls"
            >
              <button
                type="button"
                aria-label="Zoom in map"
                onClick={() => updateViewBox((prev) => computeZoomViewBox(prev, 1.35))}
                className="inline-flex h-8 w-8 items-center justify-center rounded border border-border-strong bg-surface-card/95 text-sm font-bold text-ink-primary shadow-xs hover:bg-surface-card focus-visible:outline-2 focus-visible:outline-brand-crimson"
              >
                +
              </button>
              <button
                type="button"
                aria-label="Zoom out map"
                onClick={() => updateViewBox((prev) => computeZoomViewBox(prev, 1 / 1.35))}
                className="inline-flex h-8 w-8 items-center justify-center rounded border border-border-strong bg-surface-card/95 text-sm font-bold text-ink-primary shadow-xs hover:bg-surface-card focus-visible:outline-2 focus-visible:outline-brand-crimson"
              >
                -
              </button>
              <button
                type="button"
                aria-label="Reset map view"
                disabled={!isZoomed && viewBox.x === 0 && viewBox.y === 0}
                onClick={handleResetMap}
                className="inline-flex h-8 items-center rounded border border-border-strong bg-surface-card/95 px-2.5 text-xs font-medium text-ink-primary shadow-xs hover:bg-surface-card disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-brand-crimson"
              >
                Reset
              </button>
            </div>

            <svg
              ref={svgRef}
              viewBox={formatViewBox(viewBox)}
              role="group"
              aria-label="Interactive 2D map of BulSU Malolos Main Campus buildings and pathways"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              onPointerLeave={(event) => {
                if (
                  !gestureRef.current ||
                  (gestureRef.current.mode === 'pan' && !gestureRef.current.moved)
                ) {
                  handlePointerEnd(event);
                }
              }}
              style={{ touchAction: 'none' }}
              className={`block h-[360px] w-full select-none touch-none sm:h-[480px] lg:h-[580px] ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
            >
              {/* Campus Ground Perimeter */}
              <path
                d={CAMPUS_PERIMETER_PATH}
                fill="var(--color-canvas-paper)"
                stroke="var(--color-border-strong)"
                strokeWidth={2.5}
                style={{ pointerEvents: 'none' }}
              />

              {/* Campus Parks & Quadrangles (fills under paths) */}
              {CAMPUS_PARKS.map((park) => (
                <path
                  key={`${park.name}-fill`}
                  d={park.svgPath}
                  fill="var(--color-map-park-fill)"
                  stroke="var(--color-map-park-stroke)"
                  strokeWidth={1.5}
                  style={{ pointerEvents: 'none' }}
                />
              ))}

              {/* Walkways & Internal Roads */}
              <g
                fill="none"
                stroke="var(--color-border-subtle)"
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ pointerEvents: 'none' }}
              >
                {CAMPUS_PATHS.map((d, index) => (
                  <path key={index} d={d} />
                ))}
              </g>
              <g
                fill="none"
                stroke="var(--color-surface-card)"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ pointerEvents: 'none' }}
              >
                {CAMPUS_PATHS.map((d, index) => (
                  <path key={index} d={d} />
                ))}
              </g>

              {/* Park Labels Layer (rendered above paths for legibility) */}
              <g aria-hidden="true" style={{ pointerEvents: 'none' }}>
                {CAMPUS_PARKS.map((park) => (
                  <text
                    key={`${park.name}-label`}
                    x={park.center.x}
                    y={park.center.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={9}
                    fontWeight={600}
                    fill="var(--color-map-park-ink)"
                    stroke="var(--color-map-park-fill)"
                    strokeWidth={3}
                    style={{ paintOrder: 'stroke' }}
                  >
                    {park.name}
                  </text>
                ))}
              </g>

              {/* Clickable Campus Buildings */}
              {CAMPUS_BUILDINGS.map((building) => {
                const isSelected = selectedBuildingId === building.id;
                const isHovered = hoveredBuildingId === building.id;
                const isHighlighted = matchingBuildingIds.has(building.id);

                let fill = 'var(--color-surface-card)';
                let stroke = 'var(--color-border-strong)';
                let strokeWidth = 1.6;

                if (isSelected) {
                  fill = 'var(--color-brand-crimson-solid)';
                  stroke = 'var(--color-brand-gold)';
                  strokeWidth = 3;
                } else if (isHighlighted) {
                  fill = 'var(--color-brand-gold-wash)';
                  stroke = 'var(--color-brand-gold)';
                  strokeWidth = 2.6;
                } else if (isHovered) {
                  fill = 'var(--color-brand-crimson-wash)';
                  stroke = 'var(--color-brand-crimson)';
                  strokeWidth = 2.2;
                }

                return (
                  <a
                    key={building.id}
                    href={`#${building.id}`}
                    data-building-id={building.id}
                    draggable={false}
                    aria-label={`${building.name} (${building.shortLabel}), ${building.locations.length} listed ${building.locations.length === 1 ? 'location' : 'locations'}`}
                    aria-current={isSelected ? 'true' : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      handleBuildingClick(building.id);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === ' ') {
                        event.preventDefault();
                        handleBuildingClick(building.id);
                      }
                    }}
                    onMouseEnter={() => setHoveredBuildingId(building.id)}
                    onMouseLeave={() => setHoveredBuildingId(null)}
                    style={{ touchAction: 'none' }}
                    className="cursor-pointer focus-visible:outline-2 focus-visible:outline-brand-crimson"
                  >
                    {building.svgPath.includes(' M') && (
                      <path
                        d={building.svgPath.split(' M')[0]}
                        fill="transparent"
                      />
                    )}
                    <path
                      d={building.svgPath}
                      fill={fill}
                      fillRule="evenodd"
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                      strokeLinejoin="round"
                    />
                  </a>
                );
              })}

              {/* Building Labels Layer */}
              <g aria-hidden="true" style={{ pointerEvents: 'none' }}>
                {CAMPUS_BUILDINGS.map((building) => {
                  const isSelected = selectedBuildingId === building.id;
                  const isHovered = hoveredBuildingId === building.id;
                  const isHighlighted = matchingBuildingIds.has(building.id);
                  const textFill = isSelected ? '#FFFFFF' : 'var(--color-ink-primary)';
                  const textStroke = isSelected
                    ? 'var(--color-brand-crimson-solid)'
                    : isHighlighted
                      ? 'var(--color-brand-gold-wash)'
                      : isHovered
                        ? 'var(--color-brand-crimson-wash)'
                        : 'var(--color-surface-card)';

                  return (
                    <text
                      key={`${building.id}-label`}
                      x={building.center.x}
                      y={building.center.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={10}
                      fontWeight={700}
                      fill={textFill}
                      stroke={textStroke}
                      strokeWidth={3}
                      style={{ paintOrder: 'stroke' }}
                    >
                      {building.shortLabel}
                    </text>
                  );
                })}
              </g>

              {/* Campus Gates */}
              {CAMPUS_GATES.map((gate) => (
                <g
                  key={gate.name}
                  transform={`translate(${gate.x}, ${gate.y})`}
                  style={{ pointerEvents: 'none' }}
                >
                  <circle r={6} fill="var(--color-brand-crimson-solid)" stroke="var(--color-surface-card)" strokeWidth={2} />
                  <rect
                    x={10}
                    y={-10}
                    width={gate.name.length * 5.8 + 10}
                    height={19}
                    rx={4}
                    fill="var(--color-ink-primary)"
                  />
                  <text
                    x={15}
                    y={0}
                    dominantBaseline="central"
                    fontSize={9.5}
                    fontWeight={600}
                    fill="var(--color-canvas-paper)"
                  >
                    {gate.name}
                  </text>
                </g>
              ))}

              {/* Street Orientation Hint */}
              <g style={{ pointerEvents: 'none' }}>
                <text
                  x={64}
                  y={674}
                  transform="rotate(52 64 674)"
                  fontSize={10.5}
                  fontWeight={700}
                  letterSpacing="0.08em"
                  fill="var(--color-ink-muted)"
                >
                  MACARTHUR HIGHWAY
                </text>
              </g>

              {/* Compass Rose */}
              <g transform="translate(944, 58)" style={{ pointerEvents: 'none' }}>
                <circle r={22} fill="var(--color-surface-card)" stroke="var(--color-border-strong)" strokeWidth={1.5} />
                <polygon points="0,-14 5,4 0,0 -5,4" fill="var(--color-brand-crimson)" />
                <text
                  x={0}
                  y={14}
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight={700}
                  fill="var(--color-ink-primary)"
                >
                  N
                </text>
              </g>
            </svg>
          </div>

          {/* Map Legend */}
          <div className="flex flex-wrap items-center gap-4 border-t border-border-subtle bg-surface-card px-3.5 py-2.5 text-xs text-ink-secondary">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs border border-brand-gold bg-brand-crimson-solid" />
              Selected
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs border border-brand-gold bg-brand-gold-wash" />
              Search match
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs border border-border-strong bg-surface-card" />
              Building
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-crimson-solid" />
              Campus Gate
            </span>
          </div>
        </div>

        {/* Selected Building Locations Panel */}
        <aside
          aria-live="polite"
          aria-label="Selected building locations"
          className="rounded-lg border border-border-subtle bg-surface-card p-4 shadow-xs sm:p-5 lg:col-span-5 xl:col-span-4"
        >
          {selectedBuilding ? (
            <div>
              <h2 className="border-b border-border-subtle pb-3 font-heading text-xl font-bold text-ink-primary">
                {selectedBuilding.name}
              </h2>

              {selectedBuilding.locations.length > 0 ? (
                <ul
                  ref={locationListRef}
                  className="mt-3 max-h-[32rem] space-y-2.5 overflow-y-auto py-0.5 pl-0.5 pr-3 [scrollbar-gutter:stable]"
                >
                  {selectedBuilding.locations.map((loc) => {
                    const isHighlightedLoc = highlightedLocationId === loc.id;

                    return (
                      <li
                        key={loc.id}
                        data-search-match={isHighlightedLoc ? 'true' : undefined}
                        className={`rounded-md border p-3 transition-colors ${
                          isHighlightedLoc
                            ? 'border-brand-crimson bg-brand-crimson-wash/50 ring-1 ring-brand-crimson'
                            : 'border-border-subtle bg-canvas-paper'
                        }`}
                      >
                        <p className="text-sm font-semibold text-ink-primary">
                          {loc.name}
                        </p>
                        {loc.floor && (
                          <p className="mt-0.5 text-xs font-medium text-ink-secondary">
                            {loc.floor}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-ink-secondary">
                  No listed locations for this building yet.
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-ink-secondary">
              Select a building on the map or search above to see locations inside.
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}
