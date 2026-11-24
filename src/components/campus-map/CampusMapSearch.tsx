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
    <div
      ref={wrapperRef}
      className="relative overflow-visible lg:overflow-hidden lg:rounded-2xl lg:border lg:border-border-subtle lg:bg-surface-card lg:shadow-md"
    >
      <div className="relative flex items-center">
        <svg
          className="pointer-events-none absolute left-4 h-4 w-4 text-ink-muted"
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
          className="w-full rounded-full border border-border-subtle bg-surface-card py-3 pr-11 pl-11 text-sm text-ink-primary shadow-md placeholder:text-ink-muted focus:border-brand-crimson focus:outline-none focus:ring-2 focus:ring-brand-crimson/20 lg:rounded-none lg:border-0 lg:bg-transparent lg:py-3.5 lg:shadow-none lg:focus:ring-0 [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              onClear();
              setDropdownOpen(false);
              setActiveMatchIndex(-1);
            }}
            className="absolute right-2 inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-surface-subtle hover:text-ink-primary focus-visible:outline-2 focus-visible:outline-brand-crimson"
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
        )}
      </div>

      {showDropdown && (
        <div className="absolute right-0 left-0 z-30 mt-2 max-h-72 overflow-y-auto overscroll-contain rounded-2xl border border-border-subtle bg-surface-card shadow-lg lg:static lg:mt-0 lg:max-h-64 lg:rounded-none lg:border-0 lg:border-t lg:shadow-none">
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
                      className={`flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors ${
                        isActive ? 'bg-brand-crimson-wash' : 'hover:bg-surface-subtle'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-ink-secondary"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          className="h-3.5 w-3.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10Z"
                          />
                          <circle cx="12" cy="11" r="2" />
                        </svg>
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink-primary">
                          {match.name}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-ink-secondary">
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
