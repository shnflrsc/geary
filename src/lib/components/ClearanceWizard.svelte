<script lang="ts">
  import {
    buildWizardHash,
    parseWizardHash,
    readStoredChecks,
    writeStoredChecks,
    type WizardRequestView,
  } from '#lib/wizard';

  interface Props {
    requests: WizardRequestView[];
  }

  const { requests }: Props = $props();

  type ChecksByRequest = Record<string, number[]>;

  function normalizeIndices(indices: readonly number[], max: number): number[] {
    return [...new Set(indices.filter((i) => Number.isSafeInteger(i) && i >= 0 && i < max))].sort(
      (a, b) => a - b,
    );
  }

  function applyHash(hash: string, stored: ChecksByRequest) {
    const parsed = parseWizardHash(hash, validIds);
    if (!parsed) {
      checks = stored;
      selectedId = null;
      return;
    }
    const shared = parsed.checked;
    const merged = { ...stored };
    if (shared.length > 0) {
      const request = requests.find((r) => r.id === parsed.requestId);
      const max = request?.requirements.length ?? 0;
      merged[parsed.requestId] = normalizeIndices(
        [...(stored[parsed.requestId] ?? []), ...shared],
        max,
      );
    }
    checks = merged;
    selectedId = parsed.requestId;
  }

  function replaceHash(hash: string) {
    const url = `${window.location.pathname}${hash}`;
    window.history.replaceState(null, '', url);
  }

  function selectRequest(id: string) {
    selectedId = id;
    replaceHash(buildWizardHash(id, checks[id] ?? []));
  }

  function backToPicker() {
    selectedId = null;
    replaceHash('');
  }

  function toggleItem(requestId: string, index: number, max: number) {
    const current = checks[requestId] ?? [];
    const next = current.includes(index)
      ? current.filter((i) => i !== index)
      : normalizeIndices([...current, index], max);
    checks = { ...checks, [requestId]: next };
    writeStoredChecks(checks);
  }

  function resetRequest() {
    if (!selectedId) return;
    checks = { ...checks, [selectedId]: [] };
    writeStoredChecks(checks);
  }

  let selectedId = $state<string | null>(null);
  let checks = $state<ChecksByRequest>({});
  let mounted = $state(false);

  const validIds = $derived(new Set(requests.map((r) => r.id)));
  const selected = $derived(requests.find((r) => r.id === selectedId) ?? null);

  // Mount: restore hash + stored state, then track hashchange for shared links.
  $effect(() => {
    mounted = true;
    applyHash(window.location.hash, readStoredChecks());

    const onHashChange = () => applyHash(window.location.hash, readStoredChecks());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  });

  // Keep URL hash in sync with checked state for the selected request.
  $effect(() => {
    if (!mounted || !selectedId) return;
    const current = parseWizardHash(window.location.hash, validIds);
    const desiredChecked = checks[selectedId] ?? [];
    if (
      !current ||
      current.requestId !== selectedId ||
      current.checked.join(',') !== desiredChecked.join(',')
    ) {
      replaceHash(buildWizardHash(selectedId, desiredChecked));
    }
  });
</script>

{#if requests.length === 0}
  <p class="rounded-xl border border-border-subtle bg-surface-subtle p-4 text-sm text-ink-secondary">
    No document requests are listed yet. Check back after more guides publish their
    requirements.
  </p>
{:else if !mounted}
  <!-- Deterministic pre-hydration shell: request picker grid -->
  <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2" aria-label="Document requests">
    {#each requests as request (request.id)}
      <li class="rounded-xl border border-border-subtle bg-surface-card p-5">
        <p class="font-heading text-base font-semibold text-ink-primary">{request.title}</p>
        {#if request.summary}
          <p class="mt-1.5 text-sm leading-relaxed text-ink-secondary">{request.summary}</p>
        {/if}
      </li>
    {/each}
  </ul>
{:else if !selected}
  <div>
    <p class="mb-4 text-sm leading-relaxed text-ink-secondary">
      Pick the request you are preparing for. Check off each requirement as you
      gather it. Your progress saves on this device only.
    </p>
    <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2" aria-label="Document requests">
      {#each requests as request (request.id)}
        {@const done = checks[request.id]?.length ?? 0}
        {@const total = request.requirements.length}
        <li>
          <button
            type="button"
            onclick={() => selectRequest(request.id)}
            class="group flex h-full w-full flex-col justify-between rounded-xl border border-border-subtle bg-surface-card p-5 text-left transition-colors duration-150 hover:border-brand-crimson focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-crimson"
          >
            <span>
              <span
                class="block font-heading text-base font-semibold leading-snug text-ink-primary transition-colors duration-150 group-hover:text-brand-crimson"
              >
                {request.title}
              </span>
              {#if request.summary}
                <span class="mt-1.5 block text-sm leading-relaxed text-ink-secondary">
                  {request.summary}
                </span>
              {/if}
            </span>
            <span class="mt-3 flex items-center justify-between gap-3">
              <span class="text-xs font-medium text-ink-muted">
                {done > 0 ? `${done} of ${total} checked` : `${total} requirements`}
              </span>
              <span
                aria-hidden="true"
                class="shrink-0 text-base font-semibold text-brand-crimson transition-all duration-150 group-hover:translate-x-0.5"
              >
                →
              </span>
            </span>
          </button>
        </li>
      {/each}
    </ul>
  </div>
{:else}
  {@const checkedIndices = checks[selected.id] ?? []}
  {@const doneCount = checkedIndices.length}
  {@const totalCount = selected.requirements.length}
  {@const guideHref = `/articles/${selected.articleSlug}${
    selected.guideAnchor ? `#${selected.guideAnchor}` : ''
  }`}
  <div>
    <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
      <button
        type="button"
        onclick={backToPicker}
        class="rounded-sm text-sm font-medium text-brand-crimson transition-colors hover:text-brand-crimson-hover hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-crimson"
      >
        ← All requests
      </button>
      <button
        type="button"
        onclick={resetRequest}
        disabled={doneCount === 0}
        class="rounded-sm text-sm font-medium text-ink-secondary transition-colors hover:text-brand-crimson disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:text-ink-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-crimson"
      >
        Reset checklist
      </button>
    </div>

    <div class="rounded-xl border border-border-subtle bg-surface-card p-5 sm:p-6">
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <h2 class="font-heading text-xl font-bold text-ink-primary">{selected.title}</h2>
        <p
          aria-live="polite"
          class="text-sm font-semibold {doneCount === totalCount
            ? 'text-brand-crimson'
            : 'text-ink-secondary'}"
        >
          {doneCount} of {totalCount} checked
        </p>
      </div>
      {#if selected.summary}
        <p class="mt-2 text-sm leading-relaxed text-ink-secondary">{selected.summary}</p>
      {/if}

      {#if selected.office || selected.fee || selected.processingTime}
        <dl
          class="mt-4 grid grid-cols-1 gap-3 rounded-lg bg-surface-subtle p-4 text-sm sm:grid-cols-3"
        >
          {#if selected.office}
            <div>
              <dt class="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
                Office
              </dt>
              <dd class="mt-0.5 text-ink-primary">{selected.office}</dd>
            </div>
          {/if}
          {#if selected.fee}
            <div>
              <dt class="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
                Fee
              </dt>
              <dd class="mt-0.5 text-ink-primary">{selected.fee}</dd>
            </div>
          {/if}
          {#if selected.processingTime}
            <div>
              <dt class="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
                Processing time
              </dt>
              <dd class="mt-0.5 text-ink-primary">{selected.processingTime}</dd>
            </div>
          {/if}
        </dl>
      {/if}

      <ul class="mt-5 space-y-1">
        {#each selected.requirements as req, index (index)}
          {@const checked = checkedIndices.includes(index)}
          <li>
            <label
              class="flex min-h-[44px] cursor-pointer items-start gap-3 rounded-lg px-2 py-2.5 transition-colors duration-150 hover:bg-surface-subtle"
            >
              <input
                type="checkbox"
                {checked}
                onchange={() => toggleItem(selected.id, index, totalCount)}
                class="mt-1 h-4 w-4 shrink-0 accent-brand-crimson"
              />
              <span class="min-w-0">
                <span
                  class="block text-sm font-medium leading-snug {checked
                    ? 'text-ink-secondary'
                    : 'text-ink-primary'}"
                >
                  {req.label}
                </span>
                {#if req.note}
                  <span class="mt-0.5 block text-sm leading-relaxed text-ink-secondary">
                    {req.note}
                  </span>
                {/if}
              </span>
            </label>
          </li>
        {/each}
      </ul>

      <aside
        aria-label="Verification notice"
        class="mt-5 rounded-xl border border-border-subtle bg-surface-subtle p-4 text-sm text-ink-secondary"
      >
        <p class="leading-relaxed">
          Fees, requirements, and schedules change across Academic Years. Always verify
          final details with the issuing office before your visit. Progress is saved on
          this device only. Share this page's link to send someone your checklist.
        </p>
      </aside>

      <p class="mt-4 text-sm">
        <a
          href={guideHref}
          class="font-medium text-brand-crimson transition-colors hover:text-brand-crimson-hover hover:underline underline-offset-2"
        >
          Read the full guide: {selected.articleTitle} →
        </a>
      </p>
    </div>
  </div>
{/if}
