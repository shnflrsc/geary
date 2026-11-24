import { useMemo, useRef, useState } from 'react';
import {
  CAMPUS_2_PATHS,
  CAMPUS_BUILDINGS,
  CAMPUS_GATES,
  CAMPUS_PARKS,
  CAMPUS_PATHS,
  CAMPUS_PERIMETER_PATH,
  SHOW_CAMPUS_2,
  type CampusBuilding,
} from '../data/campus-map';
import {
  DEFAULT_MAP_VIEWBOX,
  searchCampusLocations,
  type MapSearchMatch,
  type ViewBoxRect,
} from '../lib/map-search';
import BuildingInspector from './campus-map/BuildingInspector';
import CampusMapSearch from './campus-map/CampusMapSearch';
import { useMapViewport } from './campus-map/useMapViewport';

function formatViewBox(vb: ViewBoxRect): string {
  return `${vb.x} ${vb.y} ${vb.width} ${vb.height}`;
}

export default function CampusMap() {
  const [query, setQuery] = useState('');
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [highlightedLocationId, setHighlightedLocationId] = useState<string | null>(null);
  const [hoveredBuildingId, setHoveredBuildingId] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLElement | null>(null);

  const {
    svgRef,
    viewBox,
    isDragging,
    isZoomed,
    zoomIn,
    zoomOut,
    resetView,
    focusBuilding,
    consumeDragClick,
    handlePointerDown,
    handlePointerMove,
    handlePointerEnd,
    handlePointerLeave,
  } = useMapViewport();

  const buildingById = useMemo(() => {
    const map = new Map<string, CampusBuilding>();
    for (const b of CAMPUS_BUILDINGS) {
      map.set(b.id, b);
    }
    return map;
  }, []);

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

  function selectBuilding(
    buildingId: string,
    options?: { locationId?: string | null; centerMap?: boolean }
  ) {
    const building = buildingById.get(buildingId);
    if (!building) return;

    setSelectedBuildingId(building.id);
    setHighlightedLocationId(options?.locationId ?? null);

    if (options?.centerMap) {
      focusBuilding(building);
    }
  }

  function handleSelectMatch(match: MapSearchMatch) {
    setQuery(match.name);
    selectBuilding(match.buildingId, {
      locationId: match.kind === 'location' ? match.id : null,
      centerMap: true,
    });
  }

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery);
    if (!nextQuery.trim()) {
      setHighlightedLocationId(null);
    }
  }

  function handleClearSearch() {
    setQuery('');
    setHighlightedLocationId(null);
  }

  function handleClearSelection() {
    setSelectedBuildingId(null);
    setHighlightedLocationId(null);
  }

  function handleBuildingClick(buildingId: string) {
    if (consumeDragClick()) return;
    selectBuilding(buildingId, { locationId: null, centerMap: false });
  }

  const isAtDefaultView =
    !isZoomed &&
    viewBox.x === DEFAULT_MAP_VIEWBOX.x &&
    viewBox.y === DEFAULT_MAP_VIEWBOX.y;

  return (
    <section
      ref={mapContainerRef}
      aria-label="Interactive BulSU Malolos Main Campus Map"
      className="relative h-full w-full overflow-hidden bg-surface-subtle select-none"
    >
      {/* Full-Bleed Interactive 2D SVG Map */}
      <svg
        ref={svgRef}
        viewBox={formatViewBox(viewBox)}
        role="group"
        aria-label="Interactive 2D map of BulSU Malolos Main Campus buildings and pathways"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onPointerLeave={handlePointerLeave}
        style={{ touchAction: 'none' }}
        className={`block h-full w-full select-none touch-none ${
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
          {SHOW_CAMPUS_2 &&
            CAMPUS_2_PATHS.map((d, index) => (
              <path key={`c2-${index}`} d={d} />
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
          {SHOW_CAMPUS_2 &&
            CAMPUS_2_PATHS.map((d, index) => (
              <path key={`c2-${index}`} d={d} />
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
          <text
            transform="translate(239.4, 519.2) rotate(-42)"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={8}
            fontWeight={600}
            letterSpacing="0.04em"
            fill="var(--color-ink-secondary)"
            stroke="var(--color-canvas-paper)"
            strokeWidth={3}
            style={{ paintOrder: 'stroke' }}
          >
            Lover's Lane
          </text>
          <text
            transform="translate(225.9, 294.1) rotate(-43.6)"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={8}
            fontWeight={600}
            letterSpacing="0.04em"
            fill="var(--color-ink-secondary)"
            stroke="var(--color-canvas-paper)"
            strokeWidth={3}
            style={{ paintOrder: 'stroke' }}
          >
            Mojon Diversion Road
          </text>
          {SHOW_CAMPUS_2 && (
            <text
              transform="translate(686.3, -135.3) rotate(-43)"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={8}
              fontWeight={600}
              letterSpacing="0.04em"
              fill="var(--color-ink-secondary)"
              stroke="var(--color-canvas-paper)"
              strokeWidth={3}
              style={{ paintOrder: 'stroke' }}
            >
              Mojon Diversion Road
            </text>
          )}
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
                  selectBuilding(building.id, { locationId: null, centerMap: false });
                }
              }}
              onMouseEnter={() => setHoveredBuildingId(building.id)}
              onMouseLeave={() => setHoveredBuildingId(null)}
              style={{ touchAction: 'none' }}
              className="cursor-pointer focus-visible:outline-2 focus-visible:outline-brand-crimson"
            >
              {building.svgPath.includes(' M') && (
                <path d={building.svgPath.split(' M')[0]} fill="transparent" />
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
            <circle
              r={6}
              fill="var(--color-brand-crimson-solid)"
              stroke="var(--color-surface-card)"
              strokeWidth={2}
            />
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
        <g
          transform={SHOW_CAMPUS_2 ? 'translate(1030, -440)' : 'translate(944, 58)'}
          style={{ pointerEvents: 'none' }}
        >
          <circle
            r={22}
            fill="var(--color-surface-card)"
            stroke="var(--color-border-strong)"
            strokeWidth={1.5}
          />
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

      {/* Google Maps-Style Floating Overlay Stack (Desktop Left Column / Mobile Top Search + Bottom Sheet) */}
      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col lg:right-auto lg:w-[392px] lg:gap-2.5 lg:p-4 xl:w-[412px]">
        <div className="pointer-events-auto shrink-0 p-3 pb-0 lg:p-0">
          <CampusMapSearch
            query={query}
            matches={searchMatches}
            onQueryChange={handleQueryChange}
            onSelectMatch={handleSelectMatch}
            onClear={handleClearSearch}
          />
        </div>

        <BuildingInspector
          selectedBuilding={selectedBuilding}
          highlightedLocationId={highlightedLocationId}
          onClearSelection={handleClearSelection}
          containerRef={mapContainerRef}
        />
      </div>

      {/* Floating Zoom & Reset Controls (Bottom-Right) */}
      <div
        className="absolute right-3 bottom-20 z-10 flex flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface-card/95 shadow-md divide-y divide-border-subtle lg:right-4 lg:bottom-4"
        role="group"
        aria-label="Map zoom controls"
      >
        <button
          type="button"
          aria-label="Zoom in map"
          onClick={zoomIn}
          className="inline-flex h-10 w-10 items-center justify-center text-base font-bold text-ink-primary transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-crimson"
        >
          +
        </button>
        <button
          type="button"
          aria-label="Zoom out map"
          onClick={zoomOut}
          className="inline-flex h-10 w-10 items-center justify-center text-base font-bold text-ink-primary transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-crimson"
        >
          -
        </button>
        <button
          type="button"
          aria-label="Reset map view"
          disabled={isAtDefaultView}
          onClick={resetView}
          title="Reset map view"
          className="inline-flex h-10 w-10 items-center justify-center text-ink-primary transition-colors hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-crimson"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12a9 9 0 1 0 3-6.7L3 8m0-5v5h5"
            />
          </svg>
        </button>
      </div>

      {/* Compact Floating Legend Pill (Desktop) */}
      <div
        aria-label="Map legend"
        className="pointer-events-auto absolute right-16 bottom-4 z-10 hidden items-center gap-3.5 rounded-full border border-border-subtle bg-surface-card/95 px-4 py-2 text-xs text-ink-secondary shadow-md backdrop-blur-xs lg:flex"
      >
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-xs border border-brand-gold bg-brand-crimson-solid" />
          Selected
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-xs border border-brand-gold bg-brand-gold-wash" />
          Search match
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-xs border border-border-strong bg-surface-card" />
          Building
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-xs border border-[var(--color-map-park-stroke)] bg-[var(--color-map-park-fill)]" />
          Park
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-crimson-solid" />
          Campus Gate
        </span>
      </div>
    </section>
  );
}
