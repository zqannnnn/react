let localStorage = {}

module.exports = {
  setItem(key, value) {
    return Object.assign(localStorage, { [key]: value })
  },
  getItem(key) {
    return localStorage[key]
  },
  get() {
    return localStorage
  }
}