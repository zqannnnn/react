import * as i18n from 'i18next'
import * as middleware from 'i18next-express-middleware'
i18n.use(middleware.LanguageDetector).init({
  resources: {
    en: { translations: require('../locales/en.json') },
    zh: { translations: require('../locales/zh.json') }
  },
  fallbackLng: 'en',
  // debug: true,
  // have a common namespace used around the full app
  ns: ['translations'],
  defaultNS: 'translations'
})
export { i18n, middleware }
