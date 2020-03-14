import * as WFC from './WFConstants'
import WFHelper from './WFHelper'

function WFToolBar () {
  var parent = null
  var dSvg = null
  var dImg = null
  var dText = null
  var dTextSpan = null
  var dTextNode = null
  var dContainer = null
  var dMask = null

  var oClass = null
  var iWidth = 44
  var iImgWidth = 24
  var iImgHeight = 24
  var fDefaultMask = '0'
  var fKeepMask = fDefaultMask
  var sDefaultFill = 'rgb(220,220,220)'
  var sKeepFill = sDefaultFill

  this.getController = function () {
    return oClass
  }

  this.create = function (parent, id, clazz, x, y) {
    this.parent = parent
    let oSvgJs = parent.getSvgJs()
    oClass = clazz
    // 一个小工具条顶层元素
    dSvg = oSvgJs.group()
    dSvg.attr('tbType', id)
    dSvg.attr('nodeId', 'ToolBar')

    var trans = 'translate(' + x + ', ' + y + ')'
    dSvg.attr('transform', trans)

    dContainer = oSvgJs.rect()

    dContainer.attr('width', iWidth)
    dContainer.attr('height', WFC.iToolbarHeight)
    dContainer.attr('fill', sDefaultFill)
    dContainer.attr('stroke', 'black')
    dContainer.attr('stroke-width', '0')

    dSvg.add(dContainer)

    // 图标组
    var dGImg = oSvgJs.group()
    var trans2 = 'translate(' + 2 + ', ' + 2 + ')'
    dGImg.attr('transform', trans2)

    // 一个工具条图标
    var sImgUrl = oClass.getIcon()
    dImg = oSvgJs.image(sImgUrl, iImgWidth, iImgHeight)

    dGImg.add(dImg)
    dSvg.add(dGImg)

    // 文字组
    var dGText = oSvgJs.group()
    trans = 'translate(0, ' + (iImgHeight + 0) + ')'
    dGText.attr('transform', trans)
    // 文字
    dText = oSvgJs.text(oClass.getName())
    dText.attr({
      'font-size': 12
    })
    //dTextSpan = dSvgPaper.createElement("tspan");
    var sName = oClass.getName()

    //dTextNode = dSvgPaper.createTextNode(sName);

    //dText.appendChild(dTextSpan);
    //dTextSpan.appendChild(dTextNode);
    dGText.add(dText)
    dSvg.add(dGText)

    dMask = oSvgJs.rect()
    dMask.attr('width', '50')
    dMask.attr('height', '42')
    dMask.attr('fill', 'white')
    dMask.attr('stroke', 'black')
    dMask.attr('stroke-width', '0')
    dMask.attr('style', 'opacity:' + fDefaultMask)

    dSvg.add(dMask)

    // 注册事件
    //dSvg.attr("onmousedown", "oWF.selectToolBar(evt)");
    //dSvg.addEventListener("mouseover", this.mOver, false);
    //dSvg.addEventListener("mouseout", this.mOut, false);
    dSvg.mousedown(event => this.parent.selectToolBar(event))
    dSvg.mouseover(this.mOver)
    dSvg.mouseout(this.mOut)

    oSvgJs.select('#ToolBarContainer').add(dSvg)

    this.fixLayout()
  }

  this.fixLayout = function () {
    var maxRect = null
    var textRect = WFHelper.getRect(dText)
    var imgRect = WFHelper.getRect(dImg)

    var x = (iWidth - textRect.width) / 2
    dText.attr('x', x)

    x = (iWidth - iImgWidth) / 2
    dImg.attr('x', x)
  }

  this.onSelect = function ($evt) {
    fDefaultMask = '0'
    dMask.attr('style', 'cursor:pointer;opacity:' + fDefaultMask)
    sDefaultFill = 'rgb(251,201,66)'
    dContainer.attr('fill', sDefaultFill)

    if (typeof (oClass.onSelect) !== 'undefined') {
      oClass.onSelect()
    }
  }

  this.onUnSelect = function ($evt) {
    fDefaultMask = fKeepMask
    dMask.attr('style', 'opacity:' + fDefaultMask)
    sDefaultFill = sKeepFill
    dContainer.attr('fill', sDefaultFill)

    if (typeof (oClass.onUnSelect) !== 'undefined') {
      oClass.onUnSelect()
    }
  }

  this.mOver = function ($evt) {
    if (this.parent.bDrawLink) {
      return
    }
    dMask.attr('style', 'opacity:0;cursor:pointer')
    dContainer.attr('fill', 'rgb(168,209,120)')
  }

  this.mOut = function ($evt) {
    if (this.parent.bDrawLink) {
      return
    }
    dMask.attr('style', 'opacity:' + fDefaultMask)
    dContainer.attr('fill', sDefaultFill)
  }

  this.mDbClick = function ($evt) {
    alert('double click')
  }
}

export default WFToolBar
