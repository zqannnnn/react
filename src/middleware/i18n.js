export const i18n = require('i18next')
export const middleware = require('i18next-express-middleware')

i18n.use(middleware.LanguageDetector).init({
  resources: {
    en: { translations: require('../locales/en.json') },
    zh: { translations: require('../locales/zh.json') }
  },
  fallbackLng: 'en',
  //debug: true,
  // have a common namespace used around the full app
  ns: ['translations'],
  defaultNS: 'translations'
})
