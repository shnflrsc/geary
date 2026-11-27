<script lang="ts">
  import type { CategoryMeta } from '../../data/categories';

  interface Props {
    category: CategoryMeta;
  }

  const { category }: Props = $props();

  const ICON_PATHS: Record<CategoryMeta['icon'], string> = {
    admission:
      'M9 2h6v2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V2Zm1 2v2h4V4h-4Zm-1 8.5 2 2 4.5-4.5 1.4 1.4-5.9 5.9-3.4-3.4 1.4-1.4Z',
    academics:
      'M6 4a2 2 0 0 0-2 2v12.5A2.5 2.5 0 0 1 6.5 16H20V4H6Zm12 14H6.5a1 1 0 0 0 0 2H18v-2Z',
    document:
      'M7 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5L13.5 3H7Zm6 1.8L17.2 9H13V4.8ZM8 12h8v1.5H8V12Zm0 3.5h8V17H8v-1.5Z',
    certifications:
      'M12 2a6 6 0 0 0-6 6c0 2.09 1.07 3.93 2.69 5l-1.19 8.5L12 19l4.5 2.5L15.31 13A5.99 5.99 0 0 0 18 8a6 6 0 0 0-6-6Zm0 9a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z',
    scholarship:
      'M12 2.5 14.9 8.4l6.5.9-4.7 4.6 1.1 6.5L12 17.3l-5.8 3.1 1.1-6.5L2.6 9.3l6.5-.9L12 2.5Z',
    policy:
      'M12 2 4 5.5v6.2c0 5.1 3.4 9.7 8 11 4.6-1.3 8-5.9 8-11V5.5L12 2Zm-1.1 12.8-3.2-3.2 1.1-1.1 2.1 2.1 4.4-4.4 1.1 1.1-5.5 5.5Z',
    organizations:
      'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3Zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5Z',
    athletics:
      'M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2ZM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8Zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1Z',
    campus:
      'M12 2a7 7 0 0 0-7 7c0 4.8 7 13 7 13s7-8.2 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z',
    health:
      'M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2Z',
    technology:
      'M4 5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2H1v2h22v-2h-3a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H4Zm0 2h16v9H4V7Z',
    careers:
      'M10 4h4a2 2 0 0 1 2 2v1h4a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4V6a2 2 0 0 1 2-2Zm0 3h4V6h-4v1Z',
    graduation:
      'M12 3 2 8l10 5 8-4v6h2V8L12 3Zm-6 9.2V17c0 2.2 2.7 4 6 4s6-1.8 6-4v-4.8l-6 3-6-3Z',
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
