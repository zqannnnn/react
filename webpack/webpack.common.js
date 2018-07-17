const path = require('path')
const base = path.join(__dirname, '../frontend/src')
const dist = path.join(__dirname, '../public')

module.exports = {
  entry: 'index.tsx',

  output: {
    path: dist,
    publicPath: '/',
    filename: 'main.js'
  },

  resolve: {
    modules: [base, path.join(__dirname, '../node_modules')],
    extensions: ['.js', '.ts', '.tsx']
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  }
}
