import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import vercel from '@sveltejs/adapter-vercel';
import type { Adapter } from '@sveltejs/kit';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';
import { loadArticlesFromRawMap } from './src/lib/server/markdown.ts';

const vercelAdapter = vercel({
  runtime: 'nodejs22.x',
});

const adapter: Adapter = {
  name: vercelAdapter.name,
  supports: vercelAdapter.supports,
  async adapt(builder) {
    try {
      await vercelAdapter.adapt(builder);
    } catch (err) {
      const e = err as NodeJS.ErrnoException;
      const isWindowsSymlinkEperm =
        process.platform === 'win32' &&
        !process.env.VERCEL &&
        !process.env.CI &&
        e?.code === 'EPERM' &&
        e?.syscall === 'symlink';

      if (isWindowsSymlinkEperm) {
        builder.log.warn(
          'Skipped .vercel/output symlink creation on Windows without Developer Mode (EPERM). ' +
            'SvelteKit SSR build (.svelte-kit/output) succeeded; Vercel/Linux CI will emit .vercel/output cleanly.',
        );
        return;
      }
      throw err;
    }
  },
};

function validateArticlesPlugin(): Plugin {
  return {
    name: 'geary-validate-articles',
    enforce: 'pre',
    configResolved() {
      const articlesDir = resolve(process.cwd(), 'src/content/articles');
      const files = readdirSync(articlesDir).filter((file) => file.endsWith('.md'));
      const rawMap: Record<string, string> = {};
      for (const file of files) {
        const fullPath = resolve(articlesDir, file);
        rawMap[fullPath] = readFileSync(fullPath, 'utf-8');
      }
      loadArticlesFromRawMap(rawMap);
    },
  };
}

export default defineConfig({
  plugins: [validateArticlesPlugin(), tailwindcss(), sveltekit({ adapter })],
});
