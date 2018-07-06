const path = require('path')
module.exports = {
  components: 'frontend/src/components/**/*.{ts,tsx}',
  require: [path.join(__dirname, 'frontend/src/app.css')],
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'frontend/src/components/styleguide/wrapper')
  },
  ignore: ['**/styleguide/*.tsx']
}
