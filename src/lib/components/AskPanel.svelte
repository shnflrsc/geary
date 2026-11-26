<script module lang="ts">
  import type { AskIndexItem } from '#lib/ask';

  let cachedAskIndex: AskIndexItem[] | null = null;
  let pendingAskIndex: Promise<AskIndexItem[]> | null = null;

  async function loadAskIndex(): Promise<AskIndexItem[]> {
    if (cachedAskIndex) {
      return cachedAskIndex;
    }
    if (!pendingAskIndex) {
      pendingAskIndex = fetch('/ask-index.json')
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          const data = (await response.json()) as AskIndexItem[];
          cachedAskIndex = data;
          return data;
        })
        .finally(() => {
          pendingAskIndex = null;
        });
    }
    return pendingAskIndex;
  }
</script>

<script lang="ts">
  import { tick } from 'svelte';
  import { page } from '$app/state';
  import { CATEGORIES } from '../../data/categories';
  import { formatArticleDate } from '#lib/articles';
  import {
    hasAnswerableEvidence,
    parseCitedAnswer,
    retrieveAskSources,
    type AnswerSegment,
    type AskSource,
  } from '#lib/ask';

  type Phase =
    | 'idle'
    | 'loading'
    | 'asking'
    | 'answered'
    | 'not-covered'
    | 'index-error'
    | 'api-error';

  const EXAMPLE_QUESTIONS = [
    'How do I apply for a scholarship?',
    'How do I request a transcript of records?',
    'What happens if I fail a subject?',
  ] as const;

  const uid = $props.id();
  const inputId = `${uid}-ask-input`;
  const panelId = `${uid}-ask-panel`;

  let open = $state(false);
  let hasUnread = $state(true);
  let query = $state('');
  let phase = $state<Phase>('idle');
  let sources = $state<AskSource[]>([]);
  let segments = $state<AnswerSegment[]>([]);
  let lastQuestion = $state('');

  let launcherEl: HTMLButtonElement | undefined = $state();
  let inputEl: HTMLInputElement | undefined = $state();
  let scrollEl: HTMLDivElement | undefined = $state();

  const busy = $derived(phase === 'loading' || phase === 'asking');

  async function openWidget() {
    open = true;
    hasUnread = false;
    await tick();
    inputEl?.focus();
  }

  function closeWidget() {
    open = false;
    launcherEl?.focus();
  }

  function toggleWidget() {
    if (open) {
      closeWidget();
    } else {
      void openWidget();
    }
  }

  // Close drawer automatically on route navigation so destination content is unobscured.
  $effect(() => {
    const _path = page.url.pathname;
    void _path;
    open = false;
  });

  $effect(() => {
    const onOpenEvent = () => {
      void openWidget();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        closeWidget();
      }
    };
    window.addEventListener('geary:open-ask', onOpenEvent);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('geary:open-ask', onOpenEvent);
      document.removeEventListener('keydown', onKeyDown);
    };
  });

  async function submitQuestion(question: string) {
    const trimmed = question.trim();
    if (!trimmed || busy) return;

    phase = 'loading';
    sources = [];
    segments = [];
    lastQuestion = trimmed;
    await tick();
    if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;

    let items;
    try {
      items = await loadAskIndex();
    } catch {
      phase = 'index-error';
      return;
    }

    const retrieved = retrieveAskSources(items, trimmed);
    if (!hasAnswerableEvidence(retrieved)) {
      sources = [];
      phase = 'not-covered';
      return;
    }

    sources = retrieved;
    phase = 'asking';

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed, sources: retrieved }),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = (await response.json()) as { answer?: string };
      const parsed = parseCitedAnswer(data.answer ?? '', retrieved);
      if (parsed.status === 'not-covered') {
        phase = 'not-covered';
      } else {
        segments = parsed.segments;
        phase = 'answered';
      }
    } catch {
      phase = 'api-error';
    }
  }

  function onSubmit(event: SubmitEvent) {
    event.preventDefault();
    void submitQuestion(query);
  }

  function onExampleClick(example: string) {
    query = example;
    void submitQuestion(example);
  }
</script>

{#if open}
  <div
    id={panelId}
    role="dialog"
    aria-label="Ask Geary"
    class="fixed right-4 bottom-21 z-50 flex max-h-[min(76dvh,560px)] w-[calc(100vw-2rem)] max-w-[400px] flex-col overflow-hidden rounded-2xl border border-border-subtle bg-canvas-paper shadow-2xl sm:right-6 sm:bottom-24"
  >
    <header class="flex items-center justify-between gap-3 border-b border-border-subtle bg-surface-card px-4 py-3">
      <div class="flex items-center gap-2.5">
        <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" class="h-6 w-6 shrink-0">
          <g fill="var(--color-brand-crimson)">
            <rect x="13" y="2" width="6" height="28" rx="1.5" />
            <rect x="13" y="2" width="6" height="28" rx="1.5" transform="rotate(45 16 16)" />
            <rect x="13" y="2" width="6" height="28" rx="1.5" transform="rotate(90 16 16)" />
            <rect x="13" y="2" width="6" height="28" rx="1.5" transform="rotate(135 16 16)" />
            <circle cx="16" cy="16" r="10.5" />
          </g>
          <circle cx="16" cy="16" r="6.5" fill="var(--color-brand-gold)" />
          <circle cx="16" cy="16" r="3.4" fill="var(--color-surface-card)" />
        </svg>
        <h2 class="font-heading text-sm font-bold leading-tight text-ink-primary">
          Ask Geary
        </h2>
      </div>

      <button
        type="button"
        onclick={closeWidget}
        aria-label="Close Ask Geary"
        class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-secondary transition-colors hover:bg-surface-subtle hover:text-ink-primary"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </header>

    <div bind:this={scrollEl} class="flex-1 space-y-3 overflow-y-auto px-4 py-4">
      <div class="flex justify-start">
        <div class="max-w-[85%] rounded-2xl rounded-tl-sm border border-border-subtle bg-surface-card px-3.5 py-2.5 text-sm leading-relaxed text-ink-primary">
          Hi! What can I help you with?
        </div>
      </div>

      {#if phase === 'idle'}
        <div class="flex flex-wrap gap-1.5 pt-1">
          {#each EXAMPLE_QUESTIONS as example (example)}
            <button
              type="button"
              disabled={busy}
              onclick={() => onExampleClick(example)}
              class="rounded-full border border-border-subtle bg-surface-subtle px-3 py-1.5 text-left text-xs font-medium text-ink-secondary transition-colors hover:border-brand-crimson hover:text-brand-crimson disabled:opacity-60"
            >
              {example}
            </button>
          {/each}
        </div>
      {/if}

      {#if lastQuestion && phase !== 'idle'}
        <div class="flex justify-end">
          <div class="max-w-[85%] rounded-2xl rounded-tr-sm bg-brand-crimson-solid px-3.5 py-2.5 text-sm leading-relaxed text-white">
            {lastQuestion}
          </div>
        </div>
      {/if}

      <div aria-live="polite" class="space-y-3">
        {#if phase === 'loading'}
          <div class="flex justify-start">
            <p
              role="status"
              class="max-w-[85%] rounded-2xl rounded-tl-sm border border-border-subtle bg-surface-card px-3.5 py-2.5 text-sm text-ink-secondary"
            >
              Checking the handbook…
            </p>
          </div>
        {/if}

        {#if phase === 'asking'}
          <div class="flex justify-start">
            <p
              role="status"
              class="max-w-[85%] rounded-2xl rounded-tl-sm border border-border-subtle bg-surface-card px-3.5 py-2.5 text-sm text-ink-secondary"
            >
              Writing an answer from {sources.length} article passage{sources.length === 1 ? '' : 's'}…
            </p>
          </div>
        {/if}

        {#if phase === 'answered'}
          <div class="flex justify-start">
            <div class="max-w-[90%] rounded-2xl rounded-tl-sm border border-border-subtle bg-surface-card px-3.5 py-3">
              <p class="whitespace-pre-line text-sm leading-relaxed text-ink-primary">
                {#each segments as segment, index (index)}
                  {#if segment.type === 'citation'}
                    <a
                      href={segment.url}
                      aria-label="Source {segment.n}: {segment.title}"
                      class="mx-0.5 inline-flex items-center rounded border border-brand-crimson/30 bg-brand-crimson-wash px-1 py-px align-super text-[0.7rem] font-semibold text-brand-crimson hover:bg-brand-crimson-solid hover:text-white transition-colors"
                    >
                      [{segment.n}]
                    </a>
                  {:else}
                    {segment.text}
                  {/if}
                {/each}
              </p>

              <div class="mt-3 border-t border-border-subtle pt-2.5">
                <h3 class="text-[11px] font-semibold uppercase tracking-wider text-ink-secondary">
                  Sources
                </h3>
                <ul class="mt-1.5 space-y-2">
                  {#each sources as source (source.slug + '-' + source.n)}
                    <li>
                      <a
                        href={source.url}
                        class="text-xs font-semibold text-brand-crimson hover:text-brand-crimson-hover hover:underline underline-offset-2 transition-colors"
                      >
                        {source.title}
                      </a>
                      <p class="mt-0.5 text-[11px] text-ink-secondary">
                        {source.categoryLabel} · {source.subcategory} · Last updated
                        {formatArticleDate(new Date(`${source.updatedDate}T00:00:00`))}
                      </p>
                    </li>
                  {/each}
                </ul>
              </div>

              <p class="mt-2.5 text-[11px] leading-relaxed text-ink-secondary">
                Answers are generated from Geary articles and can be incomplete.
                Verify fees, deadlines, and policies with the official BulSU office
                before acting.
              </p>
            </div>
          </div>
        {/if}

        {#if phase === 'not-covered'}
          <div class="flex justify-start">
            <div class="max-w-[90%] rounded-2xl rounded-tl-sm border border-border-subtle bg-surface-card px-3.5 py-3">
              <p class="text-sm leading-relaxed text-ink-primary">
                We don&apos;t have a guide covering that yet. Try rephrasing with
                BulSU terms like &ldquo;TOR&rdquo;, &ldquo;COR&rdquo;, or
                &ldquo;INC&rdquo;, or browse by topic:
              </p>
              <div class="mt-2.5 flex flex-wrap gap-1.5">
                {#each CATEGORIES as category (category.slug)}
                  <a
                    href="/categories/{category.slug}"
                    class="inline-flex items-center rounded-full border border-border-subtle bg-canvas-paper px-2.5 py-1 text-[11px] font-medium text-ink-primary hover:border-brand-crimson hover:text-brand-crimson transition-colors"
                  >
                    {category.title}
                  </a>
                {/each}
                <a
                  href="/articles"
                  class="inline-flex items-center rounded-full border border-border-subtle bg-canvas-paper px-2.5 py-1 text-[11px] font-medium text-ink-primary hover:border-brand-crimson hover:text-brand-crimson transition-colors"
                >
                  All articles
                </a>
              </div>
            </div>
          </div>
        {/if}

        {#if phase === 'index-error' || phase === 'api-error'}
          <div class="flex justify-start">
            <p class="max-w-[85%] rounded-2xl rounded-tl-sm border border-border-subtle bg-surface-card px-3.5 py-2.5 text-sm leading-relaxed text-ink-primary">
              Sorry, Ask Geary is unavailable at the moment. Please try again later.
            </p>
          </div>
        {/if}
      </div>
    </div>

    <form
      onsubmit={onSubmit}
      class="flex items-center gap-2 border-t border-border-subtle bg-surface-card p-3"
    >
      <label for={inputId} class="sr-only">
        Ask Geary a question about BulSU student life
      </label>
      <input
        bind:this={inputEl}
        id={inputId}
        type="text"
        inputmode="search"
        enterkeyhint="search"
        bind:value={query}
        placeholder="Ask Geary a question..."
        class="h-10 min-w-0 flex-1 rounded-xl border border-border-strong bg-canvas-paper px-3 text-sm text-ink-primary placeholder:text-ink-muted transition-colors focus:border-brand-crimson focus:outline-none focus:ring-2 focus:ring-brand-crimson/20"
      />
      <button
        type="submit"
        disabled={busy || query.trim().length === 0}
        class="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-brand-crimson-solid px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-crimson-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {phase === 'asking' ? '…' : 'Ask'}
      </button>
    </form>
  </div>
{/if}

<div class="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6">
  <button
    bind:this={launcherEl}
    type="button"
    onclick={toggleWidget}
    aria-label={hasUnread ? 'Ask Geary, 1 unread message' : 'Ask Geary'}
    aria-expanded={open}
    aria-controls={panelId}
    title="Ask Geary"
    class="inline-flex h-14 w-14 items-center justify-center rounded-full border border-border-strong bg-surface-card shadow-lg transition-all duration-150 hover:scale-105 hover:border-brand-crimson hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-crimson focus-visible:ring-offset-2"
  >
    <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" class="h-7 w-7 shrink-0">
      <g fill="var(--color-brand-crimson)">
        <rect x="13" y="2" width="6" height="28" rx="1.5" />
        <rect x="13" y="2" width="6" height="28" rx="1.5" transform="rotate(45 16 16)" />
        <rect x="13" y="2" width="6" height="28" rx="1.5" transform="rotate(90 16 16)" />
        <rect x="13" y="2" width="6" height="28" rx="1.5" transform="rotate(135 16 16)" />
        <circle cx="16" cy="16" r="10.5" />
      </g>
      <circle cx="16" cy="16" r="6.5" fill="var(--color-brand-gold)" />
      <circle cx="16" cy="16" r="3.4" fill="var(--color-surface-card)" />
    </svg>
  </button>

  {#if hasUnread}
    <span
      aria-hidden="true"
      data-testid="ask-unread-badge"
      class="pointer-events-none absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-crimson-solid px-1 text-[11px] font-bold leading-none text-white ring-2 ring-canvas-paper"
    >
      1
    </span>
  {/if}
</div>
