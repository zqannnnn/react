//https://webpack.js.org/guides/production/
const merge = require('webpack-merge')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const common = require('./webpack.common.js')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = merge(common, {
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]
})
