//https://webpack.js.org/guides/production/
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  devtool: 'inline-source-map',

  devServer: {
    historyApiFallback: true,
    inline: true,
    stats: {
      colors: true
    }
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  }
})
