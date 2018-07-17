//https://webpack.js.org/guides/production/
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const postcssPresetEnv = require('postcss-preset-env')
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
        test: /\.css$/,
        use: [
          'style-loader',
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
      }
    ]
  }
})
