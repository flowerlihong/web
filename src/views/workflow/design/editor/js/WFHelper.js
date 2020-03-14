class WFHelper {
  static getRect (elSvg) {
    return elSvg.bbox()
  }

  static getReal (el, attr, value) {
    while (el != null) {
      if (el.attr(attr) === value) {
        return el
      }
      el = el.parent()
    }
    return null
  }

  static getSelectedElementId (event) {
    var currentSvgEl = event.currentTarget
    var uuid = currentSvgEl.getAttribute('uuid')

    if (uuid === '' || uuid == null) {
      uuid = event.target.getAttribute('uuid')
    }

    if (uuid === '' || uuid === null) {
      return null
    } else {
      return uuid
    }
  }
}

export default WFHelper
