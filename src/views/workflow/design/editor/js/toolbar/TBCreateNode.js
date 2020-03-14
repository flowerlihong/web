class TBCreateNode {
  /*
      this.doMouseDown = function($evt) {
          var el = __wfGetSelectedElement($evt);
          if (el == null) {
              el = new WFNode();
              el.create($evt);
              __wfActiveElement(el, $evt);
          } else {
              __wfActiveElement(el, $evt);
          }
      };

      this.doMouseMove = function($evt) {
          var el = __wfGetLastElement($evt);
          el.onMove($evt);
      };

      this.doMouseUp = function($evt) {
          var el = __wfGetLastElement($evt);
          if (el == null) {
              return;
          }
          el.onUp($evt);
      };

      this.doMouseDbClick = function($evt) {
          var el = __wfGetLastElement($evt);
          if (el == null) {
              __wfUnSelectElement($evt);
          } else {
              if (el == __wfGetLastElement()) {
                  el.onMouseDbClick($evt);
              } else {
                  __wfActiveElement(el, $evt);
              }
          }
      };
  */
  getName () {
    return '新节点'
  }

  getIcon () {
    return '/app/workflow/img/design/kuser.png'
  }
}

export default TBCreateNode
