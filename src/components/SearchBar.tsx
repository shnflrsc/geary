import { useEffect, useId, useRef, useState } from 'react';
import { CATEGORIES } from '../data/categories';
import { filterAndRankArticles, type SearchIndexItem } from '../lib/search';

interface SearchBarProps {
  variant?: 'hero' | 'header';
  enableGlobalShortcut?: boolean;
}

const HERO_PLACEHOLDERS = [
  'Search Geary...',
  'How to request a TOR or COG?',
  'How to apply for scholarships?',
  'BulSU grading system & INC...',
  'Lost my BulSU student ID...',
  'Can I graduate with honors?',
  'How to shift or transfer?',
  'e-Library Turnitin & iPads...',
] as const;

let cachedIndex: SearchIndexItem[] | null = null;
let pendingFetch: Promise<SearchIndexItem[]> | null = null;

async function loadSearchIndex(): Promise<SearchIndexItem[]> {
  if (cachedIndex) {
    return cachedIndex;
  }
  if (!pendingFetch) {
    pendingFetch = fetch('/search-index.json')
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = (await response.json()) as SearchIndexItem[];
        cachedIndex = data;
        return data;
      })
      .finally(() => {
        pendingFetch = null;
      });
  }
  return pendingFetch;
}

export default function SearchBar({
  variant = 'hero',
  enableGlobalShortcut = false,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SearchIndexItem[]>(() => cachedIndex ?? []);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderVisible, setPlaceholderVisible] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const listboxId = useId();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const isHero = variant === 'hero';

  useEffect(() => {
    if (!isHero || isFocused || query.length > 0) {
      setPlaceholderVisible(true);
      return;
    }

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let swapTimer: number | undefined;
    const interval = window.setInterval(() => {
      setPlaceholderVisible(false);
      swapTimer = window.setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % HERO_PLACEHOLDERS.length);
        setPlaceholderVisible(true);
      }, 300);
    }, 3500);

    return () => {
      window.clearInterval(interval);
      if (swapTimer !== undefined) {
        window.clearTimeout(swapTimer);
      }
    };
  }, [isHero, isFocused, query]);

  const trimmedQuery = query.trim();
  const results = trimmedQuery ? filterAndRankArticles(items, trimmedQuery) : [];
  const showPanel = isOpen && (trimmedQuery.length > 0 || fetchError);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const ensureIndexLoaded = async (forceRetry = false) => {
    if (cachedIndex) {
      setItems(cachedIndex);
      setFetchError(false);
      return;
    }

    if (fetchError && !forceRetry) {
      return;
    }

    setIsLoading(true);
    setFetchError(false);
    try {
      const data = await loadSearchIndex();
      if (!isMountedRef.current) return;
      setItems(data);
    } catch {
      if (!isMountedRef.current) return;
      setFetchError(true);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const handleOutsidePointer = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleOutsidePointer);
    return () => document.removeEventListener('mousedown', handleOutsidePointer);
  }, []);

  useEffect(() => {
    if (!enableGlobalShortcut) {
      return;
    }

    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditable =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      const isSlash =
        event.key === '/' &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        !isEditable;
      const isModK =
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === 'k' &&
        !isEditable;

      if (isSlash || isModK) {
        event.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
        void ensureIndexLoaded();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [enableGlobalShortcut]);

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
      return;
    }

    if (event.key === 'ArrowDown') {
      if (results.length > 0) {
        event.preventDefault();
        setIsOpen(true);
        setActiveIndex((prev) => (prev + 1) % results.length);
      }
      return;
    }

    if (event.key === 'ArrowUp') {
      if (results.length > 0) {
        event.preventDefault();
        setIsOpen(true);
        setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
      }
      return;
    }

    if (event.key === 'Enter' && activeIndex >= 0 && results[activeIndex]) {
      event.preventDefault();
      window.location.assign(`/articles/${results[activeIndex].slug}`);
    }
  };

  const activeOptionId =
    activeIndex >= 0 && results[activeIndex]
      ? `${listboxId}-opt-${activeIndex}`
      : undefined;

  useEffect(() => {
    if (!activeOptionId) return;
    document.getElementById(activeOptionId)?.scrollIntoView({ block: 'nearest' });
  }, [activeOptionId]);

  return (
    <div
      ref={containerRef}
      className={isHero ? 'relative w-full max-w-2xl mx-auto' : 'relative w-full'}
    >
      <label htmlFor={inputId} className="sr-only">
        Search BulSU articles
      </label>

      <div className={isHero ? 'hero-search-beam shadow-xs' : undefined}>
      <div className="relative flex items-center">
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className={`pointer-events-none absolute text-ink-muted ${
            isHero ? 'left-4 h-5 w-5' : 'left-3 h-4 w-4'
          }`}
        >
          <path
            d="M8.5 3a5.5 5.5 0 1 0 3.473 9.766l3.63 3.63a.75.75 0 1 0 1.061-1.06l-3.63-3.631A5.5 5.5 0 0 0 8.5 3Zm-4 5.5a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"
            fill="currentColor"
          />
        </svg>

        <input
          ref={inputRef}
          id={inputId}
          type="text"
          inputMode="search"
          enterKeyHint="search"
          role="combobox"
          value={query}
          aria-expanded={showPanel}
          aria-controls={showPanel && results.length > 0 ? listboxId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={activeOptionId}
          data-search-ready={isHydrated ? 'true' : 'false'}
          placeholder={isHero ? '' : 'Search Geary...'}
          onFocus={() => {
            setIsFocused(true);
            setIsOpen(true);
            void ensureIndexLoaded();
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          onChange={(event) => {
            const nextValue = event.target.value;
            setQuery(nextValue);
            setActiveIndex(-1);
            setIsOpen(nextValue.trim().length > 0 || fetchError);
            void ensureIndexLoaded();
          }}
          onKeyDown={handleInputKeyDown}
          className={`w-full bg-surface-card text-ink-primary placeholder:text-ink-muted transition-colors duration-150 focus:outline-none ${
            isHero
              ? 'h-[52px] rounded-[calc(0.75rem-1.5px)] border-0 pl-11 pr-14 text-base'
              : 'h-10 rounded-lg border border-border-strong pl-9 pr-9 sm:pr-12 text-base sm:text-sm focus:border-brand-crimson focus:ring-2 focus:ring-brand-crimson/20'
          }`}
        />

        {isHero && query.length === 0 && (
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute left-11 right-14 truncate text-left text-base text-ink-muted transition-opacity duration-300 ease-in-out ${
              placeholderVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {HERO_PLACEHOLDERS[placeholderIndex]}
          </span>
        )}

        {query.length > 0 ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery('');
              setActiveIndex(-1);
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className={`inline-flex items-center justify-center rounded-md text-ink-secondary hover:bg-surface-subtle hover:text-ink-primary transition-colors ${
              isHero ? 'absolute right-2.5 h-8 w-8' : 'absolute right-1.5 h-7 w-7'
            }`}
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        ) : (
          enableGlobalShortcut && (
            <kbd
              aria-hidden="true"
              className={`pointer-events-none hidden sm:inline-flex items-center justify-center rounded border border-border-subtle bg-surface-subtle font-mono text-xs font-medium text-ink-secondary ${
                isHero ? 'absolute right-3.5 px-2 py-0.5' : 'absolute right-2.5 px-1.5 py-0.5'
              }`}
            >
              /
            </kbd>
          )
        )}
      </div>
      </div>

      {showPanel && (
        <div
          className={`z-50 mt-2 rounded-xl border border-border-subtle bg-surface-card shadow-lg max-h-[400px] overflow-y-auto ${
            isHero
              ? 'absolute inset-x-0 top-full'
              : 'fixed inset-x-4 top-[4.25rem] sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:w-[24rem]'
          }`}
        >
          {isLoading && !cachedIndex ? (
            <div className="px-4 py-5 text-sm text-ink-secondary">
              Loading article index...
            </div>
          ) : fetchError ? (
            <div className="p-4 text-left space-y-3">
              <p className="text-sm font-medium text-ink-primary">
                Search index couldn&apos;t load right now.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => void ensureIndexLoaded(true)}
                  className="inline-flex min-h-[36px] items-center rounded-lg border border-brand-crimson bg-brand-crimson-wash px-3 py-1.5 text-xs font-semibold text-brand-crimson hover:bg-brand-crimson-solid hover:text-white transition-colors"
                >
                  Retry search
                </button>
              </div>
              <div className="border-t border-border-subtle pt-3">
                <p className="mb-2 text-xs font-medium text-ink-secondary">
                  Browse by category instead:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((category) => (
                    <a
                      key={category.slug}
                      href={`/categories/${category.slug}`}
                      className="inline-flex items-center rounded-full border border-border-subtle bg-canvas-paper px-3 py-1 text-xs font-medium text-ink-primary hover:border-brand-crimson hover:text-brand-crimson transition-colors"
                    >
                      {category.title}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : results.length > 0 ? (
            <ul id={listboxId} role="listbox" aria-label="Search results" className="divide-y divide-border-subtle">
              {results.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <li key={item.slug} role="none">
                    <a
                      id={`${listboxId}-opt-${index}`}
                      role="option"
                      aria-selected={isActive}
                      href={`/articles/${item.slug}`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 text-left transition-colors duration-150 ${
                        isActive
                          ? 'bg-brand-crimson-wash'
                          : 'hover:bg-brand-crimson-wash'
                      }`}
                    >
                      <p className="text-sm font-semibold text-ink-primary">
                        {item.title}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-ink-secondary">
                        {item.preview}
                      </p>
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-4 text-left">
              <p className="text-sm text-ink-primary">
                No articles matched <span className="font-semibold">&ldquo;{trimmedQuery}&rdquo;</span>.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
