import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { formatLocalDateKey, getDailyItemGroups } from '../lib/articles';

export interface ExploreItem {
  slug: string;
  title: string;
  preview: string;
}

interface ExploreSpotlightProps {
  items: readonly ExploreItem[];
  initialDateKey: string;
  groupSize?: number;
  groupCount?: number;
  cycleMs?: number;
}

const FADE_MS = 160;

export default function ExploreSpotlight({
  items,
  initialDateKey,
  groupSize = 6,
  groupCount = 3,
  cycleMs = 6000,
}: ExploreSpotlightProps) {
  const [dateKey, setDateKey] = useState(initialDateKey);
  const [activeGroup, setActiveGroup] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const fadeTimerRef = useRef<number | null>(null);
  const isPaused = isHovered || isFocused;

  useEffect(() => {
    const todayKey = formatLocalDateKey(new Date());
    if (todayKey !== initialDateKey) {
      setDateKey(todayKey);
    }

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const onMotionChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    mq.addEventListener('change', onMotionChange);

    return () => {
      mq.removeEventListener('change', onMotionChange);
      if (fadeTimerRef.current !== null) {
        window.clearTimeout(fadeTimerRef.current);
      }
    };
  }, [initialDateKey]);

  const groups = useMemo(
    () => getDailyItemGroups(items, dateKey, groupSize, groupCount),
    [items, dateKey, groupSize, groupCount],
  );

  const safeGroupIndex = groups.length > 0 ? activeGroup % groups.length : 0;

  const transitionToGroup = useCallback(
    (nextIndex: number) => {
      if (groups.length <= 1) return;
      const target = ((nextIndex % groups.length) + groups.length) % groups.length;
      if (target === safeGroupIndex) return;

      if (fadeTimerRef.current !== null) {
        window.clearTimeout(fadeTimerRef.current);
        fadeTimerRef.current = null;
      }

      if (prefersReducedMotion) {
        setActiveGroup(target);
        return;
      }

      setIsFading(true);
      fadeTimerRef.current = window.setTimeout(() => {
        setActiveGroup(target);
        setIsFading(false);
        fadeTimerRef.current = null;
      }, FADE_MS);
    },
    [groups.length, prefersReducedMotion, safeGroupIndex],
  );

  useEffect(() => {
    if (groups.length <= 1 || isPaused || prefersReducedMotion) return;

    const intervalId = window.setInterval(() => {
      const todayKey = formatLocalDateKey(new Date());
      if (todayKey !== dateKey) {
        setDateKey(todayKey);
        setActiveGroup(0);
        return;
      }
      transitionToGroup(safeGroupIndex + 1);
    }, cycleMs);

    return () => window.clearInterval(intervalId);
  }, [cycleMs, dateKey, groups.length, isPaused, prefersReducedMotion, safeGroupIndex, transitionToGroup]);

  if (groups.length === 0) return null;

  const currentItems = groups[safeGroupIndex] ?? [];

  return (
    <section
      aria-labelledby="featured-articles-heading"
      className="py-10 sm:py-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsFocused(false);
        }
      }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2
            id="featured-articles-heading"
            className="font-heading text-xl sm:text-2xl font-bold text-ink-primary"
          >
            Featured
          </h2>

          {groups.length > 1 && (
            <div
              role="group"
              aria-label="Featured article groups"
              className="flex items-center"
            >
              {groups.map((_, index) => {
                const isActive = index === safeGroupIndex;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => transitionToGroup(index)}
                    aria-label={`Show featured group ${index + 1} of ${groups.length}`}
                    aria-pressed={isActive}
                    className="group inline-flex h-8 w-6 cursor-pointer items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-crimson"
                  >
                    <span
                      aria-hidden="true"
                      className={`h-2 w-2 rounded-full transition-colors duration-150 ${
                        isActive
                          ? 'bg-brand-crimson'
                          : 'bg-ink-muted group-hover:bg-ink-secondary'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div
          className={`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6 transition-opacity duration-150 ${
            isFading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {currentItems.map((item) => (
            <a
              key={item.slug}
              href={`/articles/${item.slug}`}
              className="group flex flex-col justify-between rounded-xl border border-border-subtle bg-surface-card p-5 transition-colors duration-150 hover:border-brand-crimson"
            >
              <h3 className="font-heading text-base font-semibold leading-snug text-ink-primary transition-colors duration-150 group-hover:text-brand-crimson">
                {item.title}
              </h3>

              <div className="mt-1.5 flex items-end justify-between gap-3">
                <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-ink-secondary">
                  {item.preview}
                </p>
                <span
                  aria-hidden="true"
                  className="inline-flex h-[1.625em] shrink-0 items-center text-sm text-brand-crimson transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-brand-crimson-hover"
                >
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    className="h-3.5 w-3.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.5 8h9M9 4.5 12.5 8 9 11.5"
                    />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
