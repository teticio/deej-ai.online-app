const webpack = require('webpack');

module.exports = function override(config, env) {
    config.plugins = config.plugins || [];

    config.plugins.push(
        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
        })
    );

    return config;
};
