import { defineConfig } from 'vite';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const root = __dirname;

export default defineConfig(({ mode }) => {
    // App config is read through `import.meta.env.REACT_APP_*` (statically
    // replaced by Vite via `envPrefix` below), so no `define` is needed for it.
    // We only define `process.env.NODE_ENV` for the few dependencies that read
    // it at runtime — vite-plugin-node-polyfills' `process` shim ships an empty
    // `env`, and the `process` global it injects defeats per-key `define`
    // replacement anyway, so this is the one value worth providing.
    const define: Record<string, string> = {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || mode),
    };

    return {
        plugins: [
            react(),
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
            tsconfigPaths: true,
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
