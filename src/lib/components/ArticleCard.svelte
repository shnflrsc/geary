<script lang="ts">
  interface ArticleCardItem {
    slug: string;
    title: string;
    preview: string;
  }

  interface Props {
    article: ArticleCardItem;
    categoryLabel?: string;
  }

  const { article, categoryLabel }: Props = $props();
</script>

<a
  href={`/articles/${article.slug}`}
  class="group flex flex-col rounded-2xl border border-border-subtle bg-surface-card p-4 transition-colors duration-150 hover:border-brand-crimson"
>
  <div class="mb-3 flex items-center justify-between gap-3">
    {#if categoryLabel}
      <span class="rounded-full bg-brand-crimson-wash px-3 py-1 font-ui text-xs font-medium text-tonal-content">{categoryLabel}</span>
    {/if}
    <span
      aria-hidden="true"
      class="ml-auto inline-flex h-[1.625em] shrink-0 items-center text-sm text-brand-crimson group-hover:translate-x-0.5 group-hover:text-brand-crimson-hover transition-all duration-150"
    >
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.75"
        class="h-3.5 w-3.5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.5 8h9M9 4.5 12.5 8 9 11.5" />
      </svg>
    </span>
  </div>
  <h3 class="font-heading text-xl font-semibold leading-snug group-hover:text-brand-crimson">{article.title}</h3>
  <p class="mt-2 line-clamp-2 font-ui text-sm leading-relaxed text-ink-secondary">{article.preview}</p>
</a>
