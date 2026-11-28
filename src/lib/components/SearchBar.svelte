<script module lang="ts">
  import type { SearchIndexItem } from '#lib/search';

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
</script>

<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { CATEGORIES, type CategoryMeta } from '../../data/categories';
  import { filterAndRankArticles } from '#lib/search';
  import { bindSearchShortcut } from '#lib/search-shortcut';

  const dynamicCategories = $derived(
    (page.data as { categories?: CategoryMeta[] } | undefined)?.categories ?? CATEGORIES,
  );

  interface Props {
    variant?: 'hero' | 'header';
    enableGlobalShortcut?: boolean;
  }

  const { variant = 'hero', enableGlobalShortcut = false }: Props = $props();

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

  const uid = $props.id();
  const inputId = `${uid}-input`;
  const panelId = `${uid}-panel`;

  let query = $state('');
  let items = $state<SearchIndexItem[]>(cachedIndex ?? []);
  let isLoading = $state(false);
  let fetchError = $state(false);
  let isOpen = $state(false);
  let activeIndex = $state(-1);
  let isHydrated = $state(false);
  let isFocused = $state(false);
  let placeholderIndex = $state(0);
  let placeholderVisible = $state(true);

  let containerEl: HTMLDivElement | undefined = $state();
  let inputEl: HTMLInputElement | undefined = $state();

  const isHero = $derived(variant === 'hero');
  const trimmedQuery = $derived(query.trim());
  const results = $derived(trimmedQuery ? filterAndRankArticles(items, trimmedQuery) : []);
  const showPanel = $derived(isOpen && (trimmedQuery.length > 0 || fetchError));
  const activeOptionId = $derived(
    activeIndex >= 0 && results[activeIndex] ? `${panelId}-opt-${activeIndex}` : undefined,
  );

  // Close dropdown on SPA route change
  $effect(() => {
    const _path = page.url.pathname;
    void _path;
    isOpen = false;
    activeIndex = -1;
  });

  // Mark hydrated
  $effect(() => {
    isHydrated = true;
  });

  // Cycling placeholder in hero mode
  $effect(() => {
    if (!isHero || isFocused || query.length > 0) {
      placeholderVisible = true;
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
      placeholderVisible = false;
      swapTimer = window.setTimeout(() => {
        placeholderIndex = (placeholderIndex + 1) % HERO_PLACEHOLDERS.length;
        placeholderVisible = true;
      }, 300);
    }, 3500);

    return () => {
      window.clearInterval(interval);
      if (swapTimer !== undefined) {
        window.clearTimeout(swapTimer);
      }
    };
  });

  // Outside click dismissal
  $effect(() => {
    const handleOutsidePointer = (event: MouseEvent) => {
      if (containerEl && !containerEl.contains(event.target as Node)) {
        isOpen = false;
        activeIndex = -1;
      }
    };

    document.addEventListener('mousedown', handleOutsidePointer);
    return () => document.removeEventListener('mousedown', handleOutsidePointer);
  });

  // Global `/` and `Ctrl/Cmd+K` shortcut
  $effect(() => {
    if (!enableGlobalShortcut) return;

    return bindSearchShortcut(() => {
      inputEl?.focus();
      isOpen = true;
      void ensureIndexLoaded();
    });
  });

  // Keep active option visible
  $effect(() => {
    if (!activeOptionId) return;
    document.getElementById(activeOptionId)?.scrollIntoView({ block: 'nearest' });
  });

  async function ensureIndexLoaded(forceRetry = false) {
    if (cachedIndex) {
      items = cachedIndex;
      fetchError = false;
      return;
    }

    if (fetchError && !forceRetry) {
      return;
    }

    isLoading = true;
    fetchError = false;
    try {
      const data = await loadSearchIndex();
      items = data;
    } catch {
      fetchError = true;
    } finally {
      isLoading = false;
    }
  }

  function handleInputKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      isOpen = false;
      activeIndex = -1;
      inputEl?.blur();
      return;
    }

    if (event.key === 'ArrowDown') {
      if (results.length > 0) {
        event.preventDefault();
        isOpen = true;
        activeIndex = (activeIndex + 1) % results.length;
      }
      return;
    }

    if (event.key === 'ArrowUp') {
      if (results.length > 0) {
        event.preventDefault();
        isOpen = true;
        activeIndex = activeIndex <= 0 ? results.length - 1 : activeIndex - 1;
      }
      return;
    }

    if (event.key === 'Enter' && activeIndex >= 0 && results[activeIndex]) {
      event.preventDefault();
      const targetSlug = results[activeIndex].slug;
      isOpen = false;
      activeIndex = -1;
      void goto(`/articles/${targetSlug}`);
    }
  }
</script>

<div
  bind:this={containerEl}
  class={isHero ? 'relative w-full max-w-[38.5rem] mx-auto' : 'relative w-full'}
>
  <label for={inputId} class="sr-only">Search BulSU articles</label>

  <div>
    <div class="relative flex items-center">
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        class={`pointer-events-none absolute text-ink-muted ${
          isHero ? 'left-4 h-5 w-5' : 'left-3 h-4 w-4'
        }`}
      >
        <path
          d="M8.5 3a5.5 5.5 0 1 0 3.473 9.766l3.63 3.63a.75.75 0 1 0 1.061-1.06l-3.63-3.631A5.5 5.5 0 0 0 8.5 3Zm-4 5.5a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"
          fill="currentColor"
        />
      </svg>

      <input
        bind:this={inputEl}
        id={inputId}
        type="text"
        inputmode="search"
        enterkeyhint="search"
        role="combobox"
        value={query}
        aria-expanded={showPanel}
        aria-controls={showPanel ? panelId : undefined}
        aria-autocomplete="list"
        aria-activedescendant={activeOptionId}
        data-search-ready={isHydrated ? 'true' : 'false'}
        placeholder={isHero ? '' : 'Search Geary...'}
        onfocus={() => {
          isFocused = true;
          isOpen = true;
          void ensureIndexLoaded();
        }}
        onblur={() => {
          isFocused = false;
        }}
        oninput={(event) => {
          const nextValue = (event.currentTarget as HTMLInputElement).value;
          query = nextValue;
          activeIndex = -1;
          isOpen = nextValue.trim().length > 0 || fetchError;
          void ensureIndexLoaded();
        }}
        onkeydown={handleInputKeyDown}
        class={`w-full font-ui bg-surface-card text-ink-primary placeholder:text-ink-muted transition-colors duration-150 focus:outline-none ${
          isHero
            ? 'h-14 rounded-full border-0 pl-11 pr-14 text-base focus-visible:ring-2 focus-visible:ring-brand-crimson'
            : 'h-10 rounded-full border border-border-subtle pl-9 pr-9 sm:pr-12 text-base sm:text-sm focus:border-brand-crimson focus:ring-2 focus:ring-brand-crimson/20'
        }`}
      />

      {#if isHero && query.length === 0}
        <span
          aria-hidden="true"
          class={`pointer-events-none absolute left-11 right-14 truncate text-left text-base text-ink-muted transition-opacity duration-300 ease-in-out ${
            placeholderVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {HERO_PLACEHOLDERS[placeholderIndex]}
        </span>
      {/if}

      {#if query.length > 0}
        <button
          type="button"
          aria-label="Clear search"
          onclick={() => {
            query = '';
            activeIndex = -1;
            isOpen = false;
            inputEl?.focus();
          }}
          class={`inline-flex items-center justify-center rounded-md text-ink-secondary hover:bg-surface-subtle hover:text-ink-primary transition-colors ${
            isHero ? 'absolute right-2.5 h-8 w-8' : 'absolute right-1.5 h-7 w-7'
          }`}
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      {:else if enableGlobalShortcut}
        <kbd
          aria-hidden="true"
          class={`pointer-events-none hidden sm:inline-flex items-center justify-center rounded border border-border-subtle bg-surface-subtle font-mono text-xs font-medium text-ink-secondary ${
            isHero ? 'absolute right-3.5 px-2 py-0.5' : 'absolute right-2.5 px-1.5 py-0.5'
          }`}
        >
          /
        </kbd>
      {/if}
    </div>
  </div>

  {#if showPanel}
    <div
      id={panelId}
      class={`z-50 mt-2 rounded-3xl border border-border-subtle bg-surface-card shadow-geary-2 max-h-[400px] overflow-y-auto ${
        isHero
          ? 'absolute inset-x-0 top-full'
          : 'fixed inset-x-4 top-[4.25rem] sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:w-[24rem]'
      }`}
    >
      {#if isLoading && items.length === 0}
        <div class="px-4 py-5 text-sm text-ink-secondary">
          Loading article index...
        </div>
      {:else if fetchError}
        <div class="p-4 text-left space-y-3">
          <p class="text-sm font-medium text-ink-primary">
            Search index couldn't load right now.
          </p>
          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onclick={() => void ensureIndexLoaded(true)}
              class="inline-flex min-h-[36px] items-center rounded-lg border border-brand-crimson bg-brand-crimson-wash px-3 py-1.5 text-xs font-semibold text-brand-crimson hover:bg-brand-crimson-solid hover:text-white transition-colors"
            >
              Retry search
            </button>
          </div>
          <div class="border-t border-border-subtle pt-3">
            <p class="mb-2 text-xs font-medium text-ink-secondary">
              Browse by category instead:
            </p>
            <div class="flex flex-wrap gap-1.5">
              {#each dynamicCategories as category (category.slug)}
                <a
                  href={`/categories/${category.slug}`}
                  class="inline-flex items-center rounded-full border border-border-subtle bg-canvas-paper px-3 py-1 text-xs font-medium text-ink-primary hover:border-brand-crimson hover:text-brand-crimson transition-colors"
                >
                  {category.title}
                </a>
              {/each}
            </div>
          </div>
        </div>
      {:else if results.length > 0}
        <ul role="listbox" aria-label="Search results" class="divide-y divide-border-subtle">
          {#each results as item, index (item.slug)}
            {@const isActive = index === activeIndex}
            <li role="none">
              <a
                id={`${panelId}-opt-${index}`}
                role="option"
                aria-selected={isActive}
                href={`/articles/${item.slug}`}
                onmouseenter={() => {
                  activeIndex = index;
                }}
                onclick={() => {
                  isOpen = false;
                }}
                class={`block px-4 py-3 text-left transition-colors duration-150 ${
                  isActive ? 'bg-brand-crimson-wash' : 'hover:bg-brand-crimson-wash'
                }`}
              >
                <p class="text-sm font-semibold text-ink-primary">
                  {item.title}
                </p>
                <p class="mt-0.5 line-clamp-1 text-xs text-ink-secondary">
                  {item.preview}
                </p>
              </a>
            </li>
          {/each}
        </ul>
      {:else}
        <div class="p-4 text-left">
          <p class="text-sm text-ink-primary">
            No articles matched <span class="font-semibold">“{trimmedQuery}”</span>.
          </p>
        </div>
      {/if}
    </div>
  {/if}
</div>
