import { defineConfig, Plugin } from 'vite';
import { copyFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Primary output: embedded into the class library as a static web asset.
// The Razor SDK serves wwwroot/ContentSync/* at /ContentSync/* in the consuming app.
const outDir = resolve(__dirname, '../wwwroot/ContentSync');

function copyManifest(): Plugin {
  return {
    name: 'copy-umbraco-manifest',
    closeBundle() {
      mkdirSync(outDir, { recursive: true });
      copyFileSync(
        resolve(__dirname, 'umbraco-package.json'),
        resolve(outDir, 'umbraco-package.json')
      );
    }
  };
}

export default defineConfig({
  build: {
    outDir,
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/content-sync-dashboard.ts'),
      formats: ['es'],
      fileName: () => 'content-sync-dashboard.js'
    },
    rollupOptions: {
      external: [/^@umbraco-cms\//],
      output: {
        inlineDynamicImports: true
      }
    }
  },
  plugins: [copyManifest()]
});
