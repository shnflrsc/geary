<script lang="ts">
  import Breadcrumbs from './Breadcrumbs.svelte';
  import TableOfContents, { type HeadingItem } from './TableOfContents.svelte';
  import type { CategoryMeta } from '../../data/categories';
  import type { ArticleSource } from '#lib/articles';

  interface Props {
    title: string;
    formattedDate: string;
    articleUrl: string;
    categoryMeta: CategoryMeta;
    headings: HeadingItem[];
    html: string;
    sources: ArticleSource[];
  }

  const {
    title,
    formattedDate,
    articleUrl,
    categoryMeta,
    headings,
    html,
    sources,
  }: Props = $props();

  let proseEl: HTMLElement | undefined = $state();
  let canNativeShare = $state(false);
  let copied = $state(false);
  let resetTimer: number | undefined;

  const tocHeadings = $derived(headings.filter((h) => h.depth === 2 || h.depth === 3));
  const hasToc = $derived(tocHeadings.length >= 2);
  const fbShareUrl = $derived(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`,
  );

  async function copyText(text: string): Promise<boolean> {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // Fallback below for non-HTTPS origins or restricted contexts
      }
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    ta.style.pointerEvents = 'none';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, text.length);
    let ok = false;
    try {
      const legacyCopy = (document as unknown as { execCommand?: (cmd: string) => boolean })
        .execCommand;
      ok = typeof legacyCopy === 'function' ? legacyCopy.call(document, 'copy') : false;
    } catch {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }

  function handleNativeShare() {
    if (typeof navigator.share === 'function') {
      navigator.share({ title, url: articleUrl || window.location.href }).catch(() => {});
    }
  }

  function handleCopyLink() {
    void copyText(window.location.href).then((ok) => {
      if (!ok) return;
      copied = true;
      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
        copied = false;
      }, 1800);
    });
  }

  $effect(() => {
    canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
    return () => {
      window.clearTimeout(resetTimer);
    };
  });

  $effect(() => {
    const _html = html;
    void _html;
    const container = proseEl;
    if (!container) return;

    const cleanups: Array<() => void> = [];

    for (const table of container.querySelectorAll<HTMLTableElement>('table')) {
      table.setAttribute('tabindex', '0');

      const rows = Array.from(table.rows);
      const colCount = rows[0]?.cells.length ?? 0;
      if (colCount >= 2) {
        for (let col = 0; col < colCount; col++) {
          let maxLen = 0;
          for (const row of rows) {
            const text = row.cells[col]?.textContent?.trim() ?? '';
            if (text.length > maxLen) maxLen = text.length;
          }
          const minW = maxLen >= 100 ? '15rem' : maxLen >= 45 ? '11rem' : '';
          if (minW) {
            const headerCell = rows[0]?.cells[col];
            if (headerCell) headerCell.style.minWidth = minW;
          }
        }
      }

      const parent = table.parentElement;
      if (!parent || parent.classList.contains('table-scroll-wrap')) continue;

      const wrap = document.createElement('div');
      wrap.className = 'table-scroll-wrap';
      parent.insertBefore(wrap, table);
      wrap.appendChild(table);

      const updateScrollState = () => {
        const maxScroll = Math.max(0, table.scrollWidth - table.clientWidth);
        const overflows = maxScroll > 2;
        wrap.dataset.canScrollLeft = String(overflows && table.scrollLeft > 2);
        wrap.dataset.canScrollRight = String(overflows && table.scrollLeft < maxScroll - 2);
      };

      table.addEventListener('scroll', updateScrollState, { passive: true });
      cleanups.push(() => table.removeEventListener('scroll', updateScrollState));

      if (typeof ResizeObserver === 'function') {
        const ro = new ResizeObserver(updateScrollState);
        ro.observe(table);
        cleanups.push(() => ro.disconnect());
      } else {
        window.addEventListener('resize', updateScrollState, { passive: true });
        cleanups.push(() => window.removeEventListener('resize', updateScrollState));
      }
      updateScrollState();
    }

    for (const link of container.querySelectorAll<HTMLAnchorElement>(
      'a[href^="http://"], a[href^="https://"]',
    )) {
      try {
        if (new URL(link.href).origin === window.location.origin) continue;
      } catch {
        continue;
      }
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      if (!link.querySelector('.sr-only')) {
        const note = document.createElement('span');
        note.className = 'sr-only';
        note.textContent = ' (opens in new tab)';
        link.appendChild(note);
      }
    }

    for (const heading of container.querySelectorAll('h2[id], h3[id]')) {
      const id = heading.getAttribute('id');
      const headingTitle = heading.textContent?.trim();
      if (!id || !headingTitle || heading.querySelector('.heading-anchor')) continue;

      const anchor = document.createElement('a');
      anchor.className = 'heading-anchor';
      anchor.href = `#${id}`;
      anchor.setAttribute('aria-label', `Link to ${headingTitle}`);
      anchor.textContent = '#';
      const onAnchorClick = () => {
        const url = `${window.location.origin}${window.location.pathname}#${id}`;
        void copyText(url);
      };
      anchor.addEventListener('click', onAnchorClick);
      cleanups.push(() => anchor.removeEventListener('click', onAnchorClick));
      heading.appendChild(anchor);
    }

    return () => {
      for (const cleanup of cleanups) {
        cleanup();
      }
    };
  });
</script>

<div class="mx-auto max-w-[82rem] px-4 py-6 sm:px-8 lg:px-16 lg:py-10">
  <div class="mb-8">
    <Breadcrumbs
      items={[
        { label: 'Home', href: '/' },
        { label: 'Articles', href: '/articles' },
        { label: categoryMeta.title, href: `/categories/${categoryMeta.slug}` },
        { label: title },
      ]}
    />

    <a href={`/categories/${categoryMeta.slug}`} class="inline-flex rounded-full bg-brand-crimson-wash px-3 py-1 font-ui text-xs font-medium text-tonal-content">{categoryMeta.title}</a>
    <h1 class="mt-3 font-heading text-[2rem] md:text-[2.5rem] font-bold leading-[1.2] tracking-[-0.02em] text-ink-primary">
      {title}
    </h1>

    <div class="mt-4 flex flex-wrap items-center justify-between gap-2">
      <p class="text-xs font-medium text-ink-secondary">
        Last Updated: {formattedDate}
      </p>

      <div
        role="group"
        aria-label="Share this article"
        class="flex items-center gap-1 rounded-full bg-surface-card px-1.5 py-0.5 text-brand-crimson"
      >
        <button
          type="button"
          id="article-native-share"
          aria-label="Share"
          title="Share"
          onclick={handleNativeShare}
          class={`${
            canNativeShare ? 'inline-flex' : 'hidden'
          } h-9 w-9 cursor-pointer items-center justify-center rounded-full text-xs font-medium transition-colors duration-150 hover:bg-surface-subtle hover:text-brand-crimson focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-crimson`}
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.75" class="h-3.5 w-3.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm-7-5.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm1.7-1.1 3.6-2.1m-3.6 3.3 3.6 2.1" />
          </svg>
        </button>

        <a
          href={fbShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
          title="Share on Facebook"
          class="inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium transition-colors duration-150 hover:bg-surface-subtle hover:text-brand-crimson focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-crimson"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" class="h-3.5 w-3.5">
            <path d="M11.5 17.5v-6.8h2.3l.35-2.65H11.5V6.35c0-.77.22-1.3 1.32-1.3h1.41V2.68c-.24-.03-1.08-.1-2.06-.1-2.04 0-3.44 1.24-3.44 3.53v1.94H6.4v2.65h2.33v6.8h2.77Z" />
          </svg>
        </a>

        <button
          type="button"
          id="article-copy-link"
          aria-label="Copy link"
          title="Copy link"
          onclick={handleCopyLink}
          class={`inline-flex h-9 min-w-9 cursor-pointer items-center justify-center gap-1 rounded-full px-1.5 text-xs font-medium transition-colors duration-150 hover:bg-surface-subtle hover:text-brand-crimson focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-crimson ${
            copied ? 'text-brand-crimson' : ''
          }`}
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.75" class="h-3.5 w-3.5 shrink-0">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.5 11.5a3.5 3.5 0 0 0 4.95 0l2.12-2.12a3.5 3.5 0 0 0-4.95-4.95L9.4 5.65m2.1 2.85a3.5 3.5 0 0 0-4.95 0L4.43 10.62a3.5 3.5 0 1 0 4.95 4.95l1.2-1.2" />
          </svg>
          <span id="article-copy-label" class={copied ? '' : 'hidden'}>Copied</span>
        </button>
      </div>
    </div>
  </div>

  <div
    class={hasToc
      ? 'lg:grid lg:grid-cols-[minmax(0,712px)_244px] lg:justify-between lg:gap-12 lg:items-start'
      : 'max-w-[65ch]'}
  >
    <div class="min-w-0">
      <TableOfContents {headings} mode="mobile" />

      <article bind:this={proseEl} class="geary-prose">
        {@html html}
      </article>

      {#if sources.length > 0}
        <aside
          aria-label="Article source"
          class="mt-8 rounded-2xl bg-hero p-4 sm:p-5"
        >
          <p class="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
            {sources.length === 1 ? 'Source' : 'Sources'}
          </p>
          <ul class="mt-2 space-y-1.5">
            {#each sources as item (item.label + (item.url ?? ''))}
              <li>
                {#if item.url}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-baseline gap-1.5 text-sm font-medium text-brand-crimson hover:text-brand-crimson-hover hover:underline underline-offset-2 transition-colors"
                  >
                    <span>{item.label}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                {:else}
                  <p class="text-sm font-medium text-ink-primary">{item.label}</p>
                {/if}
              </li>
            {/each}
          </ul>
        </aside>
      {/if}
    </div>

    {#if hasToc}
      <TableOfContents {headings} mode="desktop" />
    {/if}
  </div>
</div>
