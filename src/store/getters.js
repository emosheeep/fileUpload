export default {
  getQuestion (state) {
    return function (filename) {
      return state.questions[filename] || null
    }
  }
}
