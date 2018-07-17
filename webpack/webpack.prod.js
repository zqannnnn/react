//https://webpack.js.org/guides/production/
const merge = require('webpack-merge')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const common = require('./webpack.common.js')
const webpack = require('webpack')
const postcssPresetEnv = require('postcss-preset-env')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = merge(common, {
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: () => [
                  postcssPresetEnv({
                    /* use stage 3 features + css nesting rules */
                    stage: 3,
                    features: {
                      'nesting-rules': true
                    }
                  })
                ]
              }
            }
          ]
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
