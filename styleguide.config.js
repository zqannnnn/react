const path = require('path')
module.exports = {
  components: 'frontend/src/components/**/*.{ts,tsx}',
  require: [
    path.join(__dirname, 'frontend/src/app.css'),
    path.join(__dirname, 'frontend/src/components/nav-bar.css'),
    path.join(__dirname, 'frontend/src/components/styleguide/nav-bar.css')
  ],
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'frontend/src/components/styleguide/wrapper')
  },
  ignore: ['**/styleguide/*.tsx', '**/index.{ts,js}'],
  webpackConfig: require('./webpack/webpack.common.js')
}
