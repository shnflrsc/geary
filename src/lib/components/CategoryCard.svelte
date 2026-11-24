<script lang="ts">
  import type { CategoryMeta } from '../../data/categories';

  interface Props {
    category: CategoryMeta;
  }

  const { category }: Props = $props();

  const ICON_PATHS: Record<CategoryMeta['icon'], string> = {
    admission:
      'M12 3 2 8l10 5 8-4v6h2V8L12 3Zm-6 9.2V17c0 2.2 2.7 4 6 4s6-1.8 6-4v-4.8l-6 3-6-3Z',
    academics:
      'M6 4a2 2 0 0 0-2 2v12.5A2.5 2.5 0 0 1 6.5 16H20V4H6Zm12 14H6.5a1 1 0 0 0 0 2H18v-2Z',
    document:
      'M7 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5L13.5 3H7Zm6 1.8L17.2 9H13V4.8ZM8 12h8v1.5H8V12Zm0 3.5h8V17H8v-1.5Z',
    scholarship:
      'M12 2.5 14.9 8.4l6.5.9-4.7 4.6 1.1 6.5L12 17.3l-5.8 3.1 1.1-6.5L2.6 9.3l6.5-.9L12 2.5Z',
    policy:
      'M12 2 4 5.5v6.2c0 5.1 3.4 9.7 8 11 4.6-1.3 8-5.9 8-11V5.5L12 2Zm-1.1 12.8-3.2-3.2 1.1-1.1 2.1 2.1 4.4-4.4 1.1 1.1-5.5 5.5Z',
    organizations:
      'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3Zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5Z',
    campus:
      'M12 2a7 7 0 0 0-7 7c0 4.8 7 13 7 13s7-8.2 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z',
  };
</script>

<a
  href={`/categories/${category.slug}`}
  class="group flex flex-col justify-between rounded-xl border border-border-subtle bg-surface-card p-5 transition-colors duration-150 hover:border-brand-crimson"
>
  <div class="mb-4">
    <div class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-crimson-wash text-brand-crimson">
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
        <path d={ICON_PATHS[category.icon]} />
      </svg>
    </div>
  </div>

  <div class="flex items-center justify-between gap-3">
    <h2 class="font-heading text-lg font-bold text-ink-primary group-hover:text-brand-crimson transition-colors duration-150">
      {category.title}
    </h2>
    <span
      aria-hidden="true"
      class="inline-flex shrink-0 items-center text-brand-crimson group-hover:translate-x-0.5 group-hover:text-brand-crimson-hover transition-all duration-150"
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
</a>
