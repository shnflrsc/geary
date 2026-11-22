import { useEffect, useMemo, useRef, useState } from 'react';
import type { CampusBuilding, CampusLocation } from '../../data/campus-map';
import {
  getLocationType,
  groupLocationsByFloor,
  partitionBuildingLocations,
} from '../../lib/map-search';

interface BuildingInspectorProps {
  selectedBuilding: CampusBuilding | null;
  highlightedLocationId: string | null;
}

export default function BuildingInspector({
  selectedBuilding,
  highlightedLocationId,
}: BuildingInspectorProps) {
  const [openFloors, setOpenFloors] = useState<Record<string, boolean>>({});
  const locationListRef = useRef<HTMLUListElement>(null);
  const lastScrolledHighlightRef = useRef<string | null>(null);

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
  }, [highlightedLocationId, selectedBuilding?.id, openFloors]);

  const toggleFloor = (key: string) => {
    setOpenFloors((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderLocationItem = (loc: CampusLocation) => {
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
        <p className="text-sm font-semibold text-ink-primary">{loc.name}</p>
        <p className="mt-0.5 text-xs font-medium text-ink-secondary">
          {getLocationType(loc)}
        </p>
      </li>
    );
  };

  return (
    <aside
      aria-live="polite"
      aria-label="Selected building locations"
      className="flex flex-col overflow-hidden rounded-lg border border-border-subtle bg-surface-card p-4 shadow-xs sm:p-5 lg:col-span-5 lg:h-0 lg:min-h-full xl:col-span-4"
    >
      {selectedBuilding ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <h2 className="shrink-0 border-b border-border-subtle pb-3 font-heading text-xl font-bold text-ink-primary">
            {selectedBuilding.name}
          </h2>

          {selectedBuilding.locations.length > 0 ? (
            <ul
              ref={locationListRef}
              className="mt-3 max-h-[32rem] min-h-0 flex-1 space-y-2.5 overflow-y-auto py-0.5 pl-0.5 pr-3 [scrollbar-gutter:stable] lg:max-h-none"
            >
              {partitionedLocations.colleges.map(renderLocationItem)}
              {partitionedLocations.colleges.length > 0 &&
                partitionedLocations.others.length > 0 && (
                  <li role="separator" aria-hidden="true" className="py-1.5">
                    <div className="border-t border-border-strong" />
                  </li>
                )}
              {groupedOthers.floorGroups.map((group) => {
                const key = `${selectedBuilding.id}:${group.floor}`;
                const isOpen = Boolean(openFloors[key]);
                return (
                  <li
                    key={key}
                    className="overflow-hidden rounded-md border border-border-subtle bg-canvas-paper"
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
  );
}
