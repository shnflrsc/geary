<script lang="ts">
  import type { PageProps } from './$types';
  import ExploreSpotlight from '#lib/components/ExploreSpotlight.svelte';
  import SearchBar from '#lib/components/SearchBar.svelte';
  import SeoHead from '#lib/components/SeoHead.svelte';
  import { buildWebsiteJsonLd } from '#lib/seo';

  const { data }: PageProps = $props();

  const HERO_GEARS = [
    {
      className:
        '-right-14 -top-14 h-60 w-60 sm:h-80 sm:w-80 md:top-1/2 md:bottom-auto md:h-[12rem] md:w-[12rem] md:-mt-[6rem] md:-right-[6rem] lg:h-[22rem] lg:w-[22rem] lg:-mt-[11rem] lg:-right-[11rem] xl:h-[36rem] xl:w-[36rem] xl:-mt-[18rem] xl:-right-[18rem] 2xl:h-[44rem] 2xl:w-[44rem] 2xl:-mt-[22rem] 2xl:-right-[22rem] text-brand-crimson/[0.06] motion-safe:animate-[spin_36s_linear_infinite_reverse]',
    },
    {
      className:
        '-left-12 -bottom-16 h-48 w-48 sm:h-64 sm:w-64 md:top-1/2 md:bottom-auto md:h-[12rem] md:w-[12rem] md:-mt-[6rem] md:-left-[6rem] lg:h-[22rem] lg:w-[22rem] lg:-mt-[11rem] lg:-left-[11rem] xl:h-[36rem] xl:w-[36rem] xl:-mt-[18rem] xl:-left-[18rem] 2xl:h-[44rem] 2xl:w-[44rem] 2xl:-mt-[22rem] 2xl:-left-[22rem] text-brand-gold/[0.11] motion-safe:animate-[spin_36s_linear_infinite]',
    },
    {
      className:
        'right-[14%] -bottom-12 hidden sm:block md:hidden h-36 w-36 text-brand-gold/[0.09] motion-safe:animate-[spin_44s_linear_infinite_reverse]',
    },
    {
      className:
        'left-[7%] -top-8 hidden sm:block md:hidden h-24 w-24 text-brand-crimson/[0.055] motion-safe:animate-[spin_24s_linear_infinite]',
    },
  ] as const;

  const canonicalUrl = $derived(new URL('/', data.siteOrigin).href);
  const ogImageUrl = $derived(new URL('/og-image.png', data.siteOrigin).href);
  const websiteJsonLd = $derived(buildWebsiteJsonLd(data.siteOrigin));

  let snowCanvas: HTMLCanvasElement | undefined = $state();

  $effect(() => {
    const canvas = snowCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0;
    let height = 0;
    let rafId = 0;
    let lastTime = 0;

    interface Flake {
      x: number;
      y: number;
      r: number;
      speedY: number;
      drift: number;
      phase: number;
      opacity: number;
    }

    let flakes: Flake[] = [];

    const createFlake = (randomY: boolean): Flake => ({
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -6,
      r: 1.4 + Math.random() * 2.2,
      speedY: 18 + Math.random() * 26,
      drift: 8 + Math.random() * 14,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.22 + Math.random() * 0.28,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const targetCount = width < 640 ? 28 : 52;
      if (flakes.length !== targetCount) {
        flakes = Array.from({ length: targetCount }, () => createFlake(true));
      }
    };

    const stop = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      ctx.clearRect(0, 0, width, height);
    };

    const tick = (now: number) => {
      if (reducedMotion.matches || document.visibilityState === 'hidden') {
        rafId = 0;
        return;
      }

      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0.016;
      lastTime = now;

      const isDark = document.documentElement.classList.contains('dark');
      const rgb = isDark ? '255, 255, 255' : '100, 116, 139';

      ctx.clearRect(0, 0, width, height);
      for (const f of flakes) {
        f.phase += dt * 0.9;
        f.y += f.speedY * dt;
        f.x += Math.sin(f.phase) * f.drift * dt;

        if (f.y - f.r > height) {
          f.y = -f.r;
          f.x = Math.random() * width;
        } else if (f.x < -f.r) {
          f.x = width + f.r;
        } else if (f.x > width + f.r) {
          f.x = -f.r;
        }

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${f.opacity})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (reducedMotion.matches || document.visibilityState === 'hidden' || rafId) return;
      lastTime = 0;
      rafId = requestAnimationFrame(tick);
    };

    resize();
    start();

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver === 'function') {
      ro = new ResizeObserver(resize);
      ro.observe(canvas);
    } else {
      window.addEventListener('resize', resize, { passive: true });
    }

    const onMotionChange = () => {
      if (reducedMotion.matches) stop();
      else start();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      } else {
        start();
      }
    };

    reducedMotion.addEventListener('change', onMotionChange);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      stop();
      ro?.disconnect();
      window.removeEventListener('resize', resize);
      reducedMotion.removeEventListener('change', onMotionChange);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  });
</script>

<SeoHead
  title="Geary - The Better BulSU Student Handbook"
  description="Student-managed information portal for BulSUans, by BulSUans."
  {canonicalUrl}
  {ogImageUrl}
  jsonLd={websiteJsonLd}
/>

<section class="relative z-20 flex min-h-[calc(100svh-9.3125rem)] items-center bg-canvas-paper py-12 sm:py-14 lg:py-16">
  <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    {#each HERO_GEARS as gear, index (index)}
      <svg viewBox="0 0 200 200" fill="none" class={`absolute ${gear.className}`}>
        <g fill="currentColor">
          <rect x="82" y="10" width="36" height="180" rx="8" />
          <rect x="82" y="10" width="36" height="180" rx="8" transform="rotate(45 100 100)" />
          <rect x="82" y="10" width="36" height="180" rx="8" transform="rotate(90 100 100)" />
          <rect x="82" y="10" width="36" height="180" rx="8" transform="rotate(135 100 100)" />
          <circle cx="100" cy="100" r="64" />
        </g>
        <circle cx="100" cy="100" r="38" fill="var(--color-canvas-paper)" />
      </svg>
    {/each}
    <canvas bind:this={snowCanvas} id="hero-snow" class="block h-full w-full" aria-hidden="true"></canvas>
  </div>

  <div class="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <h1 class="font-heading text-[1.875rem] sm:text-[2.5rem] font-extrabold leading-[1.15] tracking-[-0.025em] text-ink-primary">
        The Better BulSU Student Handbook
      </h1>

      <p class="mt-4 text-base sm:text-lg leading-relaxed text-ink-secondary">
        Student-managed information portal for BulSUans, by BulSUans.
      </p>

      <div class="mt-7">
        <SearchBar variant="hero" enableGlobalShortcut={true} />
      </div>

      <p class="mt-4 text-xs sm:text-sm leading-relaxed text-ink-secondary">
        Content is still a work in progress. Expect missing or outdated information.
        <br class="hidden md:inline" />
        <button
          type="button"
          onclick={() => window.dispatchEvent(new CustomEvent('geary:open-ask'))}
          class="font-medium text-brand-crimson hover:text-brand-crimson-hover hover:underline underline-offset-2 transition-colors"
        >
          Ask Geary
        </button>
        {' '}a question,{' '}
        <a
          href="/contribute"
          class="font-medium text-brand-crimson hover:text-brand-crimson-hover hover:underline underline-offset-2 transition-colors"
        >
          Contribute
        </a>
        to help improve Geary!
      </p>
    </div>

    <ExploreSpotlight
      items={data.featuredPool}
      initialDateKey={data.initialDateKey}
      groupSize={3}
      groupCount={3}
    />
  </div>
</section>
