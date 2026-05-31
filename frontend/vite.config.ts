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
                    // loadPaths lets the `@use "src/scss/..."` below resolve from
                    // the project root regardless of the importing file.
                    loadPaths: [root],
                    // `@use ... as *` makes the global vars/mixins available in
                    // every stylesheet (the module-system replacement for the old
                    // `@import`, which Dart Sass deprecated / removes in 3.0).
                    additionalData: `@use "src/scss/globals" as *;`,
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
        resolve: {
            // The web3 stack (privy/reown/wagmi/phosphor) pulls many separate copies
            // of the Lit family; force the bundler (dev pre-bundle + prod build) to a
            // single physical copy so Lit's dev-mode "Multiple versions of Lit loaded"
            // check sees one instance. Pairs with the `lit*` npm `overrides`.
            dedupe: ['lit', 'lit-html', 'lit-element', '@lit/reactive-element'],
            alias: {
                // alchemy-sdk's ESM build (the default browser entry) inlines
                // ethers v5's @ethersproject/hash as a circular cluster that
                // esbuild's dev dep pre-bundler mis-orders ("init_namehash is not
                // defined"), crashing the dev app. Its CJS build bundles cleanly
                // (normal require interop, no esbuild `init_*` wrappers), so point
                // Vite at it. Dev + prod both resolve fine through this alias.
                'alchemy-sdk': path.resolve(root, 'node_modules/alchemy-sdk/dist/cjs/index.js'),
            },
        },
    };
});
