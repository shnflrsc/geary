import { useEffect, useId, useRef, useState } from 'react';
import type { MapSearchMatch } from '../../lib/map-search';

interface CampusMapSearchProps {
  query: string;
  matches: readonly MapSearchMatch[];
  onQueryChange: (nextQuery: string) => void;
  onSelectMatch: (match: MapSearchMatch) => void;
  onClear: () => void;
}

export default function CampusMapSearch({
  query,
  matches,
  onQueryChange,
  onSelectMatch,
  onClear,
}: CampusMapSearchProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeMatchIndex, setActiveMatchIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const listboxId = useId();
  const searchInputId = useId();
  const showDropdown = dropdownOpen && query.trim().length > 0;
  const activeMatch = activeMatchIndex >= 0 ? matches[activeMatchIndex] : undefined;
  const activeOptionId = activeMatch
    ? `map-match-${activeMatch.kind}-${activeMatch.id}`
    : undefined;

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        wrapperRef.current &&
        event.target instanceof Node &&
        !wrapperRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!activeOptionId) return;
    document.getElementById(activeOptionId)?.scrollIntoView({ block: 'nearest' });
  }, [activeOptionId]);

  function handleSelect(match: MapSearchMatch) {
    onSelectMatch(match);
    setDropdownOpen(false);
    setActiveMatchIndex(-1);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!dropdownOpen || matches.length === 0) {
      if (event.key === 'ArrowDown' && matches.length > 0) {
        event.preventDefault();
        setDropdownOpen(true);
        setActiveMatchIndex(0);
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveMatchIndex((prev) => (prev + 1) % matches.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveMatchIndex((prev) => (prev <= 0 ? matches.length - 1 : prev - 1));
    } else if (event.key === 'Enter' && activeMatch) {
      event.preventDefault();
      handleSelect(activeMatch);
    } else if (event.key === 'Escape') {
      setDropdownOpen(false);
      setActiveMatchIndex(-1);
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
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
          aria-expanded={showDropdown}
          aria-controls={showDropdown && matches.length > 0 ? listboxId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={activeOptionId}
          onChange={(event) => {
            onQueryChange(event.target.value);
            setDropdownOpen(true);
            setActiveMatchIndex(-1);
          }}
          onFocus={() => {
            if (query.trim()) setDropdownOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search Map..."
          className="w-full rounded-lg border border-border-strong bg-surface-card py-3 pr-20 pl-10 text-sm text-ink-primary shadow-xs placeholder:text-ink-muted focus:border-brand-crimson focus:outline-none focus:ring-2 focus:ring-brand-crimson/20"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              onClear();
              setDropdownOpen(false);
              setActiveMatchIndex(-1);
            }}
            className="absolute right-2.5 rounded px-2 py-1 text-xs font-medium text-ink-secondary hover:bg-surface-subtle hover:text-ink-primary focus-visible:outline-2 focus-visible:outline-brand-crimson"
          >
            Clear
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-30 mt-1.5 max-h-80 w-full overflow-y-auto rounded-md border border-border-subtle bg-surface-card shadow-lg">
          {matches.length === 0 ? (
            <div className="px-4 py-3 text-sm text-ink-secondary">
              No campus locations matched{' '}
              <span className="font-semibold text-ink-primary">"{query}"</span>.
            </div>
          ) : (
            <ul
              id={listboxId}
              role="listbox"
              aria-label="Campus location search results"
              className="divide-y divide-border-subtle"
            >
              {matches.map((match, idx) => {
                const isActive = idx === activeMatchIndex;
                return (
                  <li key={`${match.kind}-${match.id}`} role="none">
                    <button
                      id={`map-match-${match.kind}-${match.id}`}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onClick={() => handleSelect(match)}
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
  );
}
