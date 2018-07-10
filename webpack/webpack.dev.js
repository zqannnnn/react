//https://webpack.js.org/guides/production/
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'inline-source-map',

    devServer: {
        historyApiFallback: true,
        inline: true,
        stats: {
            colors: true
        }
    }
        
});