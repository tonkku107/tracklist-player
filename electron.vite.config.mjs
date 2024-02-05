import react from '@vitejs/plugin-react';
import { execSync } from 'child_process';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import { resolve } from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

let commit;
try {
  commit = execSync(`git describe --always --dirty`).toString();
} catch (e) {
  commit = e.stderr.toString();
}

const define = {
  __VERSION__: JSON.stringify(process.env.npm_package_version),
  __REPO__: JSON.stringify(process.env.npm_package_repository_url),
  __COMMIT__: JSON.stringify(commit.trim()),
  __CONTRIBUTORS__: JSON.stringify(
    Object.entries(process.env)
      .filter(([k]) => k.startsWith('npm_package_contributors_') && k.endsWith('_name'))
      .map(([, v]) => v)
  ),
};

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    define,
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
      },
    },
    plugins: [react(), nodePolyfills({ globals: { buffer: true } })],
    define,
    build: {
      minify: true,
    },
  },
});
