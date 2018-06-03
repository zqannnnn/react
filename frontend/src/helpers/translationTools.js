function getLocale() {
  let locale =
    (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    //|| navigator.userLanguage
    'en'
  if (locale.indexOf('en') === 0) locale = 'en'
  if (locale.indexOf('zh') === 0) locale = 'zh'
  if (['en', 'zh'].indexOf(locale) < 0) locale = 'en'
  return locale
}
export { getLocale }
