<script lang="ts">
  import '@fontsource/plus-jakarta-sans/latin-600.css';
  import '@fontsource/plus-jakarta-sans/latin-700.css';
  import '@fontsource/plus-jakarta-sans/latin-800.css';
  import '@fontsource/inter/latin-400.css';
  import '@fontsource/inter/latin-400-italic.css';
  import '@fontsource/inter/latin-500.css';
  import '@fontsource/inter/latin-600.css';
  import '@fontsource/inter/latin-700.css';
  import inter400Url from '@fontsource/inter/files/inter-latin-400-normal.woff2?url';
  import jakarta700Url from '@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-700-normal.woff2?url';
  import jakarta800Url from '@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-800-normal.woff2?url';
  import '../styles/global.css';

  import type { Snippet } from 'svelte';
  import { page } from '$app/state';
  import Header, { type NavSection } from '#lib/components/Header.svelte';
  import Footer from '#lib/components/Footer.svelte';
  import { CATEGORY_SLUGS, type CategorySlug } from '../data/categories';

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();

  const pathname = $derived(page.url.pathname.replace(/\/+$/, '') || '/');
  const isError = $derived(Boolean(page.error));

  const activeNav = $derived.by<NavSection | undefined>(() => {
    if (isError) return undefined;
    if (pathname === '/') return 'home';
    if (pathname === '/articles' || pathname.startsWith('/articles/')) return 'articles';
    if (pathname === '/calendar') return 'calendar';
    if (pathname === '/map') return 'map';
    if (pathname === '/contribute') return 'contribute';
    return undefined;
  });

  const activeCategory = $derived.by<CategorySlug | undefined>(() => {
    if (isError) return undefined;
    const match = pathname.match(/^\/categories\/([^/]+)$/);
    if (match && (CATEGORY_SLUGS as readonly string[]).includes(match[1])) {
      return match[1] as CategorySlug;
    }
    const fromData = (page.data as { activeCategory?: CategorySlug } | undefined)?.activeCategory;
    return fromData;
  });

  const headerSearchShortcut = $derived(
    !isError && pathname !== '/' && pathname !== '/calendar' && pathname !== '/map',
  );
  const hideFooter = $derived(!isError && pathname === '/map');
  const lockViewport = $derived(!isError && pathname === '/map');

  $effect(() => {
    const locked = lockViewport;
    document.body.classList.toggle('min-h-0', locked);
    document.body.classList.toggle('h-dvh', locked);
    document.body.classList.toggle('overflow-hidden', locked);
    return () => {
      document.body.classList.remove('min-h-0', 'h-dvh', 'overflow-hidden');
    };
  });
</script>

<svelte:head>
  <link rel="preload" href={inter400Url} as="font" type="font/woff2" crossorigin="anonymous" />
  <link rel="preload" href={jakarta700Url} as="font" type="font/woff2" crossorigin="anonymous" />
  <link rel="preload" href={jakarta800Url} as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

<div class={lockViewport ? 'flex h-dvh min-h-0 flex-col overflow-hidden' : 'contents'}>
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-surface-card focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-crimson focus:shadow-md"
  >
    Skip to main content
  </a>

  <Header {activeCategory} {activeNav} {headerSearchShortcut} />

  <main id="main-content" class={lockViewport ? 'min-h-0 flex-1 overflow-hidden' : 'flex-1'}>
    {@render children()}
  </main>

  {#if !hideFooter}
    <Footer />
  {/if}
</div>
