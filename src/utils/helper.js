export default {
  nl2br (str) {
    if (!str) {
      return ''
    }
    return str.replace(/(?:\r\n|\r|\n)/g, '<br/>')
  }
}
