import { useEffect, useMemo, useRef, useState } from 'react';
import type { CampusBuilding, CampusLocation } from '../../data/campus-map';
import {
  getCollegeShortLabel,
  getLocationType,
  groupLocationsByFloor,
  partitionBuildingLocations,
} from '../../lib/map-search';

type SheetSnap = 'collapsed' | 'half' | 'expanded';

const COLLAPSED_HEIGHT_PX = 68;
const HALF_HEIGHT_RATIO = 0.48;
const EXPANDED_HEIGHT_RATIO = 0.82;
const DESKTOP_MEDIA_QUERY = '(min-width: 1024px)';

interface BuildingInspectorProps {
  selectedBuilding: CampusBuilding | null;
  highlightedLocationId: string | null;
  onClearSelection: () => void;
  containerRef: React.RefObject<HTMLElement | null>;
}

export default function BuildingInspector({
  selectedBuilding,
  highlightedLocationId,
  onClearSelection,
  containerRef,
}: BuildingInspectorProps) {
  const [openFloors, setOpenFloors] = useState<Record<string, boolean>>({});
  const [isDesktop, setIsDesktop] = useState(false);
  const [sheetSnap, setSheetSnap] = useState<SheetSnap>('collapsed');
  const [dragHeightPx, setDragHeightPx] = useState<number | null>(null);

  const locationListRef = useRef<HTMLUListElement>(null);
  const lastScrolledHighlightRef = useRef<string | null>(null);
  const sheetDragRef = useRef<{
    pointerId: number;
    startY: number;
    startHeight: number;
    moved: boolean;
  } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MEDIA_QUERY);
    setIsDesktop(mq.matches);
    const onChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Automatically open bottom sheet on mobile when a building is selected, and collapse when cleared.
  useEffect(() => {
    if (selectedBuilding) {
      setSheetSnap('half');
    } else {
      setSheetSnap('collapsed');
    }
    setDragHeightPx(null);
  }, [selectedBuilding?.id, highlightedLocationId]);

  const partitionedLocations = useMemo(
    () =>
      selectedBuilding
        ? partitionBuildingLocations(selectedBuilding.locations)
        : { colleges: [], others: [] },
    [selectedBuilding]
  );

  const groupedOthers = useMemo(
    () => groupLocationsByFloor(partitionedLocations.others),
    [partitionedLocations.others]
  );

  useEffect(() => {
    if (!selectedBuilding || !highlightedLocationId) return;
    const matchGroup = groupedOthers.floorGroups.find((g) =>
      g.locations.some((loc) => loc.id === highlightedLocationId)
    );
    if (!matchGroup) return;
    const key = `${selectedBuilding.id}:${matchGroup.floor}`;
    setOpenFloors((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
  }, [selectedBuilding, highlightedLocationId, groupedOthers.floorGroups]);

  useEffect(() => {
    if (!highlightedLocationId) {
      lastScrolledHighlightRef.current = null;
      return;
    }
    if (lastScrolledHighlightRef.current === highlightedLocationId) return;
    const listEl = locationListRef.current;
    if (!listEl) return;
    const matchEl = listEl.querySelector<HTMLElement>('[data-search-match="true"]');
    if (!matchEl) return;

    lastScrolledHighlightRef.current = highlightedLocationId;
    const rafId = requestAnimationFrame(() => {
      matchEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
    return () => cancelAnimationFrame(rafId);
  }, [highlightedLocationId, selectedBuilding?.id, openFloors, sheetSnap]);

  const toggleFloor = (key: string) => {
    setOpenFloors((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getContainerHeight = () => containerRef.current?.clientHeight ?? 600;

  const getSnapHeightPx = (snap: SheetSnap, containerHeight: number) => {
    if (snap === 'collapsed') return COLLAPSED_HEIGHT_PX;
    if (snap === 'half') return Math.round(containerHeight * HALF_HEIGHT_RATIO);
    return Math.round(containerHeight * EXPANDED_HEIGHT_RATIO);
  };

  const handleSheetPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isDesktop) return;
    if ((event.target as HTMLElement).closest('button[data-no-drag="true"]')) return;

    const containerHeight = getContainerHeight();
    const startHeight = getSnapHeightPx(sheetSnap, containerHeight);
    sheetDragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startHeight,
      moved: false,
    };
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Ignore synthetic events
    }
  };

  const handleSheetPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = sheetDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const dy = drag.startY - event.clientY;
    if (!drag.moved && Math.abs(dy) < 5) return;
    drag.moved = true;

    const containerHeight = getContainerHeight();
    const maxHeight = Math.round(containerHeight * 0.86);
    const nextHeight = Math.min(maxHeight, Math.max(COLLAPSED_HEIGHT_PX, drag.startHeight + dy));
    setDragHeightPx(nextHeight);
  };

  const handleSheetPointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = sheetDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {
      // Ignore synthetic events
    }

    if (drag.moved && dragHeightPx !== null) {
      const containerHeight = getContainerHeight();
      const collapsedPx = getSnapHeightPx('collapsed', containerHeight);
      const halfPx = getSnapHeightPx('half', containerHeight);
      const expandedPx = getSnapHeightPx('expanded', containerHeight);
      const dy = drag.startY - event.clientY;

      if (dy > 40) {
        setSheetSnap(dragHeightPx > halfPx + 24 ? 'expanded' : 'half');
      } else if (dy < -40) {
        setSheetSnap(dragHeightPx < halfPx - 24 ? 'collapsed' : 'half');
      } else {
        const distances: Array<[SheetSnap, number]> = [
          ['collapsed', Math.abs(dragHeightPx - collapsedPx)],
          ['half', Math.abs(dragHeightPx - halfPx)],
          ['expanded', Math.abs(dragHeightPx - expandedPx)],
        ];
        distances.sort((a, b) => a[1] - b[1]);
        setSheetSnap(distances[0]?.[0] ?? 'collapsed');
      }
    }

    sheetDragRef.current = null;
    setDragHeightPx(null);
  };

  const cycleSheetSnap = () => {
    setSheetSnap((prev) => {
      if (prev === 'collapsed') return 'half';
      if (prev === 'half') return 'expanded';
      return 'collapsed';
    });
  };

  const mobileSheetStyle: React.CSSProperties | undefined = isDesktop
    ? undefined
    : {
        height:
          dragHeightPx !== null
            ? `${dragHeightPx}px`
            : sheetSnap === 'collapsed'
              ? `${COLLAPSED_HEIGHT_PX}px`
              : sheetSnap === 'half'
                ? `${HALF_HEIGHT_RATIO * 100}%`
                : `${EXPANDED_HEIGHT_RATIO * 100}%`,
      };

  const renderLocationItem = (loc: CampusLocation) => {
    const isHighlightedLoc = highlightedLocationId === loc.id;
    return (
      <li
        key={loc.id}
        data-search-match={isHighlightedLoc ? 'true' : undefined}
        className={`rounded-lg border p-3 transition-colors ${
          isHighlightedLoc
            ? 'border-brand-crimson bg-brand-crimson-wash/50 ring-1 ring-brand-crimson'
            : 'border-border-subtle bg-canvas-paper'
        }`}
      >
        <p className="text-sm font-semibold text-ink-primary">{loc.name}</p>
        <p className="mt-0.5 text-xs font-medium text-ink-secondary">
          {getLocationType(loc)}
        </p>
      </li>
    );
  };

  const isMobileCollapsed = !isDesktop && sheetSnap === 'collapsed' && dragHeightPx === null;
  const locationCount = selectedBuilding?.locations.length ?? 0;

  return (
    <aside
      aria-live="polite"
      aria-label="Selected building locations"
      style={mobileSheetStyle}
      className={`pointer-events-auto absolute inset-x-0 bottom-0 z-20 flex flex-col overflow-hidden rounded-t-2xl border-t border-border-subtle bg-surface-card shadow-[0_-8px_24px_rgba(0,0,0,0.12)] lg:static lg:inset-auto lg:h-auto! lg:min-h-0 lg:max-h-full lg:rounded-2xl lg:border lg:shadow-md ${
        dragHeightPx === null ? 'transition-[height] duration-200 ease-out' : 'transition-none'
      }`}
    >
      {/* Mobile Drag Handle + Header Bar */}
      <div
        onPointerDown={handleSheetPointerDown}
        onPointerMove={handleSheetPointerMove}
        onPointerUp={handleSheetPointerEnd}
        onPointerCancel={handleSheetPointerEnd}
        className="shrink-0 touch-none px-4 pt-2.5 pb-3 lg:touch-auto lg:px-4 lg:pt-3.5 lg:pb-3"
      >
        <button
          type="button"
          onClick={cycleSheetSnap}
          aria-label={
            sheetSnap === 'expanded'
              ? 'Collapse building locations sheet'
              : 'Expand building locations sheet'
          }
          className="mx-auto mb-2.5 flex h-4 w-16 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-brand-crimson lg:hidden"
        >
          <span className="h-1.5 w-10 rounded-full bg-border-strong" aria-hidden="true" />
        </button>

        {selectedBuilding ? (
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="truncate font-heading text-lg font-bold leading-snug text-ink-primary lg:text-xl">
                  {selectedBuilding.name}
                </h2>
                <p className="mt-0.5 text-xs text-ink-secondary">
                  {locationCount} {locationCount === 1 ? 'location' : 'locations'}
                </p>
              </div>
              <button
                type="button"
                data-no-drag="true"
                onClick={onClearSelection}
                aria-label="Close building details"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-ink-secondary transition-colors hover:bg-border-subtle hover:text-ink-primary focus-visible:outline-2 focus-visible:outline-brand-crimson"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {selectedBuilding.colleges && selectedBuilding.colleges.length > 0 && (
              <ul
                aria-label="Colleges in this building"
                className={`mt-2.5 flex-wrap gap-1.5 ${
                  isMobileCollapsed ? 'hidden lg:flex' : 'flex'
                }`}
              >
                {selectedBuilding.colleges.map((college) => {
                  const isHighlightedCollege = highlightedLocationId === college.id;
                  return (
                    <li
                      key={college.id}
                      title={college.name}
                      aria-label={college.name}
                      data-search-match={isHighlightedCollege ? 'true' : undefined}
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors ${
                        isHighlightedCollege
                          ? 'border-brand-crimson bg-brand-crimson text-white'
                          : 'border-brand-crimson/20 bg-brand-crimson-wash text-brand-crimson'
                      }`}
                    >
                      {getCollegeShortLabel(college)}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ) : (
          <div>
            <p className="font-heading text-sm font-bold text-ink-primary lg:text-base">
              Main Campus
            </p>
            <p className="mt-0.5 text-xs text-ink-secondary">
              {isMobileCollapsed
                ? 'Tap a building on the map to see locations inside.'
                : 'Select any building on the map or search above to view offices, classrooms, and facilities.'}
            </p>
          </div>
        )}
      </div>

      {/* Scrollable Locations Content */}
      {selectedBuilding && (
        <div
          className={`min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-border-subtle px-4 py-3 [scrollbar-gutter:stable] ${
            isMobileCollapsed ? 'hidden lg:block' : 'block'
          }`}
        >
          {selectedBuilding.locations.length > 0 ? (
            <ul ref={locationListRef} className="space-y-2.5 pb-2">
              {groupedOthers.floorGroups.map((group) => {
                const key = `${selectedBuilding.id}:${group.floor}`;
                const isOpen = Boolean(openFloors[key]);
                return (
                  <li
                    key={key}
                    className="overflow-hidden rounded-lg border border-border-subtle bg-canvas-paper"
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => toggleFloor(key)}
                      className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-semibold text-ink-primary transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-crimson"
                    >
                      <span>{group.floor}</span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                        className={`h-4 w-4 shrink-0 text-ink-secondary transition-transform duration-150 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                    {isOpen && (
                      <ul className="space-y-2 border-t border-border-subtle bg-surface-card p-2.5">
                        {group.locations.map(renderLocationItem)}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-ink-secondary">
              No listed locations for this building yet.
            </p>
          )}
        </div>
      )}
    </aside>
  );
}
