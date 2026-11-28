<script lang="ts">
  import { tick } from 'svelte';

  type ThemePreference = 'light' | 'dark' | 'system';

  interface Props {
    class?: string;
    alignLeftOnMobile?: boolean;
  }

  const { class: className = '', alignLeftOnMobile = false }: Props = $props();

  const KEY = 'geary-theme';
  const OPTIONS: readonly { value: ThemePreference; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System default' },
  ];

  let isOpen = $state(false);
  let preference = $state<ThemePreference>('system');
  let isDark = $state(false);
  let triggerEl: HTMLButtonElement | undefined = $state();
  let menuEl: HTMLDivElement | undefined = $state();

  function readPreference(): ThemePreference {
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved;
      }
    } catch {}
    const fromDom = document.documentElement.dataset.themePreference;
    if (fromDom === 'light' || fromDom === 'dark' || fromDom === 'system') {
      return fromDom;
    }
    return 'system';
  }

  function applyTheme(pref: ThemePreference) {
    const mediaQuery =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null;
    const systemDark = Boolean(mediaQuery && mediaQuery.matches);
    const resolvedDark = pref === 'dark' || (pref === 'system' && systemDark);
    preference = pref;
    isDark = resolvedDark;

    const root = document.documentElement;
    root.classList.toggle('dark', resolvedDark);
    root.dataset.themePreference = pref;
    root.dataset.themeResolved = resolvedDark ? 'dark' : 'light';
    root.style.colorScheme = resolvedDark ? 'dark' : 'light';
  }

  function selectPreference(pref: ThemePreference) {
    try {
      window.localStorage.setItem(KEY, pref);
    } catch {}
    applyTheme(pref);
    closeMenu(true);
  }

  function closeMenu(restoreFocus = false) {
    if (!isOpen) return;
    isOpen = false;
    if (restoreFocus) {
      triggerEl?.focus();
    }
  }

  async function openMenu(focusTarget: 'selected' | 'first' | 'last' = 'selected') {
    isOpen = true;
    await tick();
    const buttons = menuEl
      ? Array.from(menuEl.querySelectorAll<HTMLButtonElement>('[data-theme-option]'))
      : [];
    let target = buttons[0];
    if (focusTarget === 'last') {
      target = buttons[buttons.length - 1];
    } else if (focusTarget === 'selected') {
      target =
        buttons.find((btn) => btn.getAttribute('data-theme-option') === preference) ?? buttons[0];
    }
    target?.focus();
  }

  function handleTriggerClick() {
    if (isOpen) {
      closeMenu(false);
    } else {
      void openMenu('selected');
    }
  }

  function handleTriggerKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      void openMenu('selected');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      void openMenu('last');
    }
  }

  function handleMenuKeyDown(event: KeyboardEvent) {
    const buttons = menuEl
      ? Array.from(menuEl.querySelectorAll<HTMLButtonElement>('[data-theme-option]'))
      : [];
    const idx = buttons.indexOf(document.activeElement as HTMLButtonElement);

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu(true);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      buttons[(idx + 1 + buttons.length) % buttons.length]?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIdx = idx <= 0 ? buttons.length - 1 : idx - 1;
      buttons[prevIdx]?.focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      buttons[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      buttons[buttons.length - 1]?.focus();
    } else if (event.key === 'Tab') {
      closeMenu(false);
    }
  }

  $effect(() => {
    applyTheme(readPreference());

    const mediaQuery =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null;

    const onSystemChange = () => {
      if (readPreference() === 'system') {
        applyTheme('system');
      }
    };

    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (isOpen && target && !menuEl?.contains(target) && !triggerEl?.contains(target)) {
        closeMenu(false);
      }
    };

    mediaQuery?.addEventListener('change', onSystemChange);
    document.addEventListener('click', onDocumentClick);

    return () => {
      mediaQuery?.removeEventListener('change', onSystemChange);
      document.removeEventListener('click', onDocumentClick);
    };
  });
</script>

<div class={`relative shrink-0 ${className}`}>
  <button
    bind:this={triggerEl}
    id="theme-toggle-button"
    type="button"
    aria-haspopup="menu"
    aria-expanded={isOpen}
    aria-controls="theme-toggle-menu"
    aria-label="Choose color theme"
    onclick={handleTriggerClick}
    onkeydown={handleTriggerKeyDown}
    class="inline-flex min-h-[44px] min-w-[44px] md:min-h-[40px] md:min-w-[40px] md:h-10 md:w-10 cursor-pointer items-center justify-center rounded-full bg-hero text-ink-primary hover:border-brand-crimson hover:text-brand-crimson transition-colors duration-150"
  >
    <svg
      data-theme-trigger-icon="light"
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={`h-[18px] w-[18px] ${isDark ? 'hidden' : ''}`}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41" />
    </svg>
    <svg
      data-theme-trigger-icon="dark"
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={`h-[18px] w-[18px] ${isDark ? '' : 'hidden'}`}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  </button>

  <div
    bind:this={menuEl}
    id="theme-toggle-menu"
    role="menu"
    aria-label="Color theme"
    tabindex="-1"
    onkeydown={handleMenuKeyDown}
    class={`absolute right-0 ${alignLeftOnMobile ? 'max-md:left-0 max-md:right-auto' : ''} top-full z-50 mt-2 w-48 rounded-2xl border border-border-subtle bg-surface-card p-1.5 shadow-geary-2 ${
      isOpen ? '' : 'hidden'
    }`}
  >
    {#each OPTIONS as opt (opt.value)}
      {@const isSelected = preference === opt.value}
      <button
        type="button"
        role="menuitemradio"
        data-theme-option={opt.value}
        aria-checked={isSelected}
        tabindex="-1"
        onclick={() => selectPreference(opt.value)}
        class={`flex min-h-[44px] w-full cursor-pointer items-center justify-between gap-2.5 rounded-lg px-3 py-2 text-left text-sm hover:bg-surface-subtle focus-visible:bg-surface-subtle transition-colors duration-150 ${
          isSelected
            ? 'bg-brand-crimson-wash font-semibold text-tonal-content'
            : 'font-medium text-ink-primary'
        }`}
      >
        <span class="flex items-center gap-2.5">
          {#if opt.value === 'light'}
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-4 w-4 shrink-0"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41" />
            </svg>
          {:else if opt.value === 'dark'}
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-4 w-4 shrink-0"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          {:else}
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-4 w-4 shrink-0"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8m-4-4v4" />
            </svg>
          {/if}
          <span>{opt.label}</span>
        </span>
        <svg
          data-theme-check
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          stroke-width="2.25"
          stroke-linecap="round"
          stroke-linejoin="round"
          class={`h-4 w-4 shrink-0 text-brand-crimson ${isSelected ? '' : 'hidden'}`}
        >
          <path d="m4.5 10.5 3.5 3.5 7.5-8" />
        </svg>
      </button>
    {/each}
  </div>
</div>
