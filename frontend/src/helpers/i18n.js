import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n.use(LanguageDetector).init({
  resources: {
    en: { translations: require('../locales/en.json') },
    zh: { translations: require('../locales/zh.json') }
  },
  fallbackLng: 'en',
  //debug: true,
  // have a common namespace used around the full app
  ns: ['translations'],
  defaultNS: 'translations',
  // we use content as keys
  keySeparator: false,
  interpolation: {
    escapeValue: false,
    formatSeparator: ','
  },
  react: {
    wait: true
  }
})

export default i18n
