const webpack = require('webpack');

module.exports = function override(config, env) {
    config.plugins = config.plugins || [];

    config.plugins.push(
        new webpack.DefinePlugin({
            '__DEV__': JSON.stringify(process.env.NODE_ENV !== 'production')
        })
    );

    return config;
};
