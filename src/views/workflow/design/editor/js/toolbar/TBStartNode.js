class TBStartNode {
  /*
  this.doMouseDown = function ($evt) {
    var el = __wfGetSelectedElement($evt)
    if (el == null) {
      if (oWF.getStartNode() != null) {
        oWF.info('startnode.onlyone')
        __wfUnSelectElement($evt)
        return
      }

      el = new WFNode(sNODETYPE_START_NODE)
      el.create($evt)
      __wfActiveElement(el, $evt)
    } else {
      __wfActiveElement(el, $evt)
    }
  }

  this.doMouseMove = function ($evt) {
    var el = __wfGetLastElement($evt)
    el.onMove($evt)
  }

  this.doMouseUp = function ($evt) {
    var el = __wfGetLastElement($evt)
    if (el == null) {
      return
    }
    el.onUp($evt)
  }

  this.doMouseDbClick = function ($evt) {
    var el = __wfGetSelectedElement($evt)
    if (el == null) {
      __wfUnSelectElement($evt)
    } else {
      if (el == __wfGetLastElement()) {
        el.onMouseDbClick($evt)
      } else {
        __wfActiveElement(el, $evt)
      }
    }
  }
   */

  getName () {
    return '起点'
  }

  getIcon () {
    return '/app/workflow/img/design/start.png'
  }
}

export default TBStartNode
