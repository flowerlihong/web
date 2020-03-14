class TBChoicer {
  // doMouseDown ($evt) {
  //   var el = __wfGetSelectedElement($evt)
  //   if (el == null) {
  //     __wfUnSelectElement($evt)
  //     // TODO 缺少操作
  //   } else {
  //     __wfActiveElement(el, $evt)
  //   }
  // }
  //
  // doMouseMove ($evt) {
  //   // TODO 缺少操作
  //   var el = __wfGetLastElement($evt)
  //   el.onMove($evt)
  // }
  //
  // doMouseUp ($evt) {
  //   var el = __wfGetLastElement($evt)
  //   if (el == null) {
  //     return
  //   }
  //   el.onUp($evt)
  // }
  //
  // doMouseDbClick ($evt) {
  //   // TODO 缺少操作
  //   var el = __wfGetSelectedElement($evt)
  //   if (el == null) {
  //     __wfUnSelectElement($evt)
  //   } else {
  //     if (el == __wfGetLastElement()) {
  //       el.onMouseDbClick($evt)
  //     } else {
  //       __wfActiveElement(el, $evt)
  //     }
  //   }
  // }

  getName () {
    return '选择器'
  }

  getIcon () {
    return '/app/workflow/img/design/choicer.png'
  }
}

export default TBChoicer
