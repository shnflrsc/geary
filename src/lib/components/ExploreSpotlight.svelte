<script lang="ts">
  import { formatLocalDateKey, getDailyItemGroups } from '#lib/articles';

  export interface ExploreItem {
    slug: string;
    title: string;
    preview: string;
  }

  interface Props {
    items: readonly ExploreItem[];
    initialDateKey: string;
    groupSize?: number;
    groupCount?: number;
    cycleMs?: number;
  }

  const {
    items,
    initialDateKey,
    groupSize = 3,
    groupCount = 3,
    cycleMs = 6000,
  }: Props = $props();

  let clientDateKey = $state<string | null>(null);
  let activeGroup = $state(0);
  let isHovered = $state(false);
  let isFocused = $state(false);
  let prefersReducedMotion = $state(false);

  const dateKey = $derived(clientDateKey ?? initialDateKey);
  const isPaused = $derived(isHovered || isFocused);
  const groups = $derived(getDailyItemGroups(items, dateKey, groupSize, groupCount));
  const safeGroupIndex = $derived(groups.length > 0 ? activeGroup % groups.length : 0);

  function transitionToGroup(nextIndex: number) {
    if (groups.length <= 1) return;
    const target = ((nextIndex % groups.length) + groups.length) % groups.length;
    if (target !== safeGroupIndex) {
      activeGroup = target;
    }
  }

  $effect(() => {
    const todayKey = formatLocalDateKey(new Date());
    if (todayKey !== dateKey) {
      clientDateKey = todayKey;
    }

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion = mq.matches;
    const onMotionChange = (event: MediaQueryListEvent) => {
      prefersReducedMotion = event.matches;
    };
    mq.addEventListener('change', onMotionChange);

    return () => {
      mq.removeEventListener('change', onMotionChange);
    };
  });

  $effect(() => {
    if (groups.length <= 1 || isPaused || prefersReducedMotion) return;

    const intervalId = window.setInterval(() => {
      const todayKey = formatLocalDateKey(new Date());
      if (todayKey !== dateKey) {
        clientDateKey = todayKey;
        activeGroup = 0;
        return;
      }
      transitionToGroup(safeGroupIndex + 1);
    }, cycleMs);

    return () => window.clearInterval(intervalId);
  });
</script>

{#if groups.length > 0}
  <div
    role="region"
    aria-label="Suggested articles"
    class="mt-10 sm:mt-12 text-left"
    onmouseenter={() => {
      isHovered = true;
    }}
    onmouseleave={() => {
      isHovered = false;
    }}
    onfocusin={() => {
      isFocused = true;
    }}
    onfocusout={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
        isFocused = false;
      }
    }}
  >
    <div class="grid grid-cols-1 grid-rows-1">
      {#each groups as group, groupIdx (groupIdx)}
        {@const isActive = groupIdx === safeGroupIndex}
        <div
          aria-hidden={!isActive ? 'true' : undefined}
          class={`col-start-1 row-start-1 grid grid-cols-1 gap-3 md:grid-cols-3 transition-opacity duration-200 motion-reduce:transition-none ${
            isActive ? 'opacity-100' : 'pointer-events-none select-none opacity-0'
          }`}
        >
          {#each group as item (item.slug)}
            <a
              href={`/articles/${item.slug}`}
              tabindex={isActive ? undefined : -1}
              class="group flex flex-col justify-between rounded-xl border border-border-subtle bg-surface-card/50 p-3.5 transition-colors duration-150 hover:border-brand-crimson"
            >
              <h2 class="font-heading text-sm font-semibold leading-snug text-ink-primary transition-colors duration-150 group-hover:text-brand-crimson">
                {item.title}
              </h2>

              <div class="mt-1.5 flex items-end justify-between gap-3">
                <p class="line-clamp-1 flex-1 text-sm leading-snug text-ink-secondary">
                  {item.preview}
                </p>
                <span
                  aria-hidden="true"
                  class="inline-flex h-[1.625em] shrink-0 items-center text-sm text-brand-crimson transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-brand-crimson-hover"
                >
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.75"
                    class="h-3.5 w-3.5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3.5 8h9M9 4.5 12.5 8 9 11.5"
                    />
                  </svg>
                </span>
              </div>
            </a>
          {/each}
        </div>
      {/each}
    </div>
  </div>
{/if}
