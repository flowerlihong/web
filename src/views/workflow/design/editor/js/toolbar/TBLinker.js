class TBLinker {
  /*
  var _linker = null;

  this.doMouseDown = function($evt) {
      var el = __wfGetSelectedElement($evt);
      if (el == null) {
          __wfUnSelectElement($evt);
      } else {
          __wfActiveElement(el, $evt);
      }
  };

  this.doMouseMove = function($evt) {
      var el = __wfGetLastElement($evt);
      if (_linker == null) {
          // TODO 缺少操作
          if (el.getType() == sNODETYPE_END_NODE) {
              oWF.info("activity.notlinkable");
              return;
          } else if (el.getType() == sNODETYPE_START_NODE) {
              var startNodeLinkers = oWF.getNodeRoads(el.uuid());
              if (startNodeLinkers != null) {
                  for (var i in startNodeLinkers) {
                      if (startNodeLinkers[i] != null) {
                          oWF.info("startnode.onlyone.allow");
                          return;
                      }
                  }
              }
          }
          _linker = new WFLink();
          _linker.create($evt, el);
      }
      _linker.onMove($evt);
  };

  this.doMouseUp = function($evt) {
      if (_linker == null) {
          return;
      }
      _linker.onUp($evt);
      _linker = null;
  };

  this.doMouseDbClick = function($evt) {
      var el = __wfGetSelectedElement($evt);
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
    return '连线'
  }

  getIcon () {
    return '/app/workflow/img/design/linker.png'
  }
}

export default TBLinker
