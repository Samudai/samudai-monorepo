import { defineConfig, loadEnv } from 'vite';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const root = __dirname;

export default defineConfig(({ mode }) => {
    // Load REACT_APP_* vars from .env files (env-cmd also injects them into
    // process.env for the build:* scripts). Build a define map so the existing
    // `process.env.REACT_APP_*` and `process.env.NODE_ENV` reads across the
    // codebase keep working untouched.
    const fileEnv = loadEnv(mode, process.cwd(), 'REACT_APP_');
    const merged: Record<string, string | undefined> = {
        ...fileEnv,
        ...process.env,
    };

    const define: Record<string, string> = {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || mode),
    };
    for (const [key, value] of Object.entries(merged)) {
        if (key.startsWith('REACT_APP_')) {
            define[`process.env.${key}`] = JSON.stringify(value);
        }
    }

    return {
        plugins: [
            react(),
            tsconfigPaths(),
            nodePolyfills({
                globals: { Buffer: true, process: true },
                protocolImports: true,
            }),
        ],
        define,
        envPrefix: 'REACT_APP_',
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler',
                    // loadPaths lets the relative-looking imports below resolve
                    // from the project root regardless of the importing file.
                    loadPaths: [root],
                    additionalData: `@import "src/scss/vars.scss"; @import "src/scss/mixins.scss";`,
                },
            },
        },
        build: {
            outDir: 'build',
            // esbuild (the historical Vite minifier) tolerates the existing
            // CSS authoring quirks (e.g. class selectors generated from CSS
            // custom-property names like `.--color-type-1`) that Vite 8's
            // default lightningcss minifier rejects. Matches the lenient
            // cssnano behavior the old webpack/CRA build relied on.
            cssMinify: 'esbuild',
        },
        server: {
            port: 3000,
        },
    };
});
