const path = require('path');
const sassResourcesLoader = require('craco-sass-resources-loader');
const { alias, configPaths } = require('react-app-rewire-alias');
const aliasMap = configPaths('./tsconfig.paths.json');
const webpack = require('webpack');
const src = 'src';

const includePath = (...segments) => path.resolve(__dirname, src, ...segments);

module.exports = {
    plugins: [
        {
            plugin: sassResourcesLoader,
            options: {
                resources: ['./src/scss/mixins.scss', './src/scss/vars.scss'],
            },
        },
    ],
    webpack: {
        configure: (config, { env }) => {
            config.resolve['alias'] = {
                images: includePath('assets', 'images'),
                fonts: includePath('assets', 'fonts'),
                media: includePath('assets', 'media'),
                components: includePath('components'),
                hooks: includePath('hooks'),
                pages: includePath('pages'),
                styles: includePath('scss'),
                store: includePath('store'),
                ui: includePath('UI'),
                utils: includePath('utils'),
                root: includePath(),
            };
            const fallback = config.resolve.fallback || {};
            Object.assign(fallback, {
                crypto: require.resolve('crypto-browserify'),
                stream: require.resolve('stream-browserify'),
                assert: require.resolve('assert'),
                http: require.resolve('stream-http'),
                https: require.resolve('https-browserify'),
                os: require.resolve('os-browserify'),
                url: require.resolve('url'),
                path: require.resolve('path-browserify'),
                zlib: require.resolve('browserify-zlib'),
                fs: false,
                'process/browser': require.resolve('process/browser'),
            });
            config.resolve.fallback = fallback;
            config.plugins = (config.plugins || []).concat([
                new webpack.ProvidePlugin({
                    process: 'process/browser',
                    Buffer: ['buffer', 'Buffer'],
                }),
            ]);
            alias(aliasMap)(config);
            return config;
        },
    },
};
