export default {
  save (key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },

  load (key) {
    const value = localStorage.getItem(key)

    if (value === null) {
      return value
    }

    try {
      return JSON.parse(value)
    } catch (e) {
      return null
    }
  },

  remove (key) {
    localStorage.removeItem(key)
  }
}
