var fs = require('fs')
var chalk = require('chalk')

module.exports = {
  options: {
    debug: true,
    func: {
      list: ['t', 'i18n.t'],
      extensions: ['.ts', '.tsx']
    },
    trans: {
      component: 'Trans',
      i18nKey: 'i18nKey',
      extensions: ['.ts', '.tsx'],
      fallbackKey: function(ns, value) {
        // Returns a hash value as the fallback key
        return value
      }
    },
    lngs: ['en', 'zh'],
    ns: ['translations'],
    defaultLng: 'en',
    defaultNs: 'translations',
    defaultValue: function(lng, ns, key) {
      //https://github.com/i18next/i18next-scanner/issues/27
      return key
    },
    resource: {
      loadPath: 'frontend/src/locales/{{lng}}.json',
      savePath: 'frontend/src/locales/{{lng}}.json',
      jsonIndent: 2,
      lineEnding: '\n'
    },
    nsSeparator: false, // namespace separator
    keySeparator: false, // key separator
    interpolation: {
      prefix: '{{',
      suffix: '}}'
    }
  },
  transform: function customTransform(file, enc, done) {
    'use strict'
    const parser = this.parser
    const content = fs.readFileSync(file.path, enc)
    let count = 0

    parser.parseFuncFromString(
      content,
      { list: ['i18next._', 'i18next.__'] },
      (key, options) => {
        parser.set(
          key,
          Object.assign({}, options, {
            nsSeparator: false,
            keySeparator: false
          })
        )
        ++count
      }
    )

    if (count > 0) {
      console.log(
        `i18next-scanner: count=${chalk.cyan(count)}, file=${chalk.yellow(
          JSON.stringify(file.relative)
        )}`
      )
    }

    done()
  }
}
