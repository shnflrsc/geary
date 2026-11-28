<script lang="ts">
  let { desktopOnly = false }: { desktopOnly?: boolean } = $props();
</script>

<footer class={`relative z-10 mt-auto bg-canvas-paper ${desktopOnly ? "hidden md:block" : ""}`}>
  <div class="mx-auto max-w-[90rem] px-4 sm:px-8 lg:px-16">
    <div class="flex flex-wrap items-center justify-between gap-3 py-4 sm:py-6">
      <p class="whitespace-nowrap text-xs sm:text-sm text-ink-secondary">&copy; 2026 Geary</p>

      <ul class="flex flex-wrap items-center gap-4 sm:gap-6">
        <li>
          <a
            href="/terms"
            class="whitespace-nowrap text-xs sm:text-sm text-ink-secondary hover:text-brand-crimson hover:underline underline-offset-2 transition-colors"
          >
            Terms of Service
          </a>
        </li>
        <li>
          <a
            href="/privacy"
            class="whitespace-nowrap text-xs sm:text-sm text-ink-secondary hover:text-brand-crimson hover:underline underline-offset-2 transition-colors"
          >
            Privacy Policy
          </a>
        </li>
      </ul>
    </div>
  </div>
</footer>
