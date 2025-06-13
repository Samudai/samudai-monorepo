const webpack = require('webpack');
const { alias, configPaths } = require('react-app-rewire-alias');
const aliasMap = configPaths('./tsconfig.paths.json');
const path = require('path');
const resourceLoader = require('./resource-loader');

module.exports = function override(config, env) {
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
    resourceLoader([
        path.resolve(__dirname, 'src', 'scss', 'mixins.scss'),
        path.resolve(__dirname, 'src', 'scss', 'vars.scss'),
    ])(config);

    return config;
};
