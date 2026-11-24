<script lang="ts">
  export interface BreadcrumbItem {
    label: string;
    href?: string;
  }

  interface Props {
    items: BreadcrumbItem[];
  }

  const { items }: Props = $props();
</script>

<nav aria-label="Breadcrumb" class="mb-4">
  <ol class="flex flex-wrap items-center gap-1.5 text-sm text-ink-secondary">
    {#each items as item, index (index)}
      {@const isLast = index === items.length - 1}
      <li class="inline-flex items-center gap-1.5 min-w-0">
        {#if index > 0}
          <span aria-hidden="true" class="text-ink-muted select-none">›</span>
        {/if}
        {#if item.href && !isLast}
          <a
            href={item.href}
            class="hover:text-brand-crimson hover:underline underline-offset-2 transition-colors duration-150"
          >
            {item.label}
          </a>
        {:else}
          <span aria-current="page" class="font-medium text-ink-primary break-words">
            {item.label}
          </span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>
