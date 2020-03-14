function WFLink () {

  var sType = 1
  var sUuid = $.uuid()
  var bKilled = false
  var bCreated = false

  var dSvg = null
  var dLine = null
  var dContent = null
  var dText = null
  var dTextPath = null
  var dTspan = null

  var dOutLine = null

  var sAttrName = null
  var sRouteType = null

  var sLinkStartEl = null
  var sLinkEndEl = null
  var iOrder = null

  var dLastOverNode = null

  this.getType = function () {
    return sType
  }

  this.uuid = function () {
    return sUuid
  }

  this.getName = function () {
    return sAttrName
  }

  this.getStart = function () {
    return sLinkStartEl
  }

  this.getEnd = function () {
    return sLinkEndEl
  }

  this.setName = function ($name) {
    sAttrName = $name
    dContent.data = sAttrName
  }

  this.setOrder = function ($ord) {
    iOrder = $ord
    dSvg.setAttribute('wfLinkOrder', iOrder)
  }

  this.setStart = function ($el) {
    sLinkStartEl = $el.uuid()
  }

  this.setEnd = function ($el) {
    sLinkEndEl = $el.uuid()
  }

  this.getLine = function () {
    return dLine
  }

  this.createPos = function ($x, $y, $x1, $y1) {
  }

  this.create = function ($evt, $el) {
  }

  this.onMove = function ($evt) {
  }

  this.onUp = function ($evt) {
  }

  this.onTrackStyle = function () {
    dLine.setAttribute('stroke', 'red')
    dLine.setAttribute('marker-end', 'url(#redArrow)')
  }

  this.remove = function () {
  }

  this.isRoad = function ($startElUuid, $endElUuid) {
    if (sLinkStartEl == $startElUuid && sLinkEndEl == $endElUuid) {
      return true
    }
    return false
  }

  this.serial = function () {
  }

  this.getXmlNode = function ($oXml) {
    var node = $oXml.createElement('route')
    node.setAttribute('uuid', sUuid)
    node.setAttribute('name', sAttrName)
    node.setAttribute('start', sLinkStartEl)
    node.setAttribute('end', sLinkEndEl)
    var r = iOrder == null ? '' : iOrder
    node.setAttribute('order', r)

    return node
  }

  this.onSelect = function ($evt) {

    oLastTrackLink = this

    var rect = __wfGetRect(dSvg)
    __wfExtendRect(rect, 6)
    dOutLine = dSvgDocument.createElement('rect')
    dOutLine.setAttribute('x', rect.x)
    dOutLine.setAttribute('y', rect.y)
    dOutLine.setAttribute('width', rect.width)
    dOutLine.setAttribute('height', rect.height)
    dOutLine.setAttribute('style', 'stroke-dasharray:3.3;stroke:black;stroke-width:1;fill:white;opacity:0.8')
    dSvg.insertBefore(dOutLine, dSvg.firstChild)

    __wfBringToFront(dSvg)
    __wfBringToFront(__getElement(sLinkStartEl).getSvg())
  }

  this.onUnSelect = function ($evt) {
    if (dOutLine == null) {
      return
    }
    dSvg.removeChild(dSvg.firstChild)
    dOutLine = null
  }

  this.relateMove = function ($uuid) {
  }

  this.onMouseDbClick = function ($evt) {
  }

  this.setWFAttributes = function ($attrName, $value) {
  }

  this.updateXmlNode = function () {
  }

  this.pushWFAttributes = function ($dForm) {
  }

  this.unSerial = function ($svg) {
    dSvg = $svg
    sUuid = dSvg.getAttribute('uuid')
    dLine = dSvg.childNodes.item(0)
    dText = dSvg.childNodes.item(1)
    dTextPath = dText.childNodes.item(0)
    dTspan = dTextPath.childNodes.item(0)
    dContent = dTspan.childNodes.item(0)
    sAttrName = unescape(dContent.data)
    sLinkStartEl = dSvg.getAttribute('wfLinkStartEl')
    sLinkEndEl = dSvg.getAttribute('wfLinkEndEl')
    iOrder = dSvg.getAttribute('wfLinkOrder')
    __registerElement(this)
    oWF.setRoad(sLinkStartEl, sLinkEndEl, this)
    oWFXml.addRoute(this)
    dTspan.setAttribute('style', 'cursor:move;fill:black;text-anchor:middle;font-size:13;font-family:simsun')
  }

  this.onCanGo = function () {

  }
}
