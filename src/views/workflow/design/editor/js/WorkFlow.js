/*
 Created by Xuz on 2019/07/16.
 xuz[at]live[dot]cn
 重写 Vue 版流程编辑器
*/
import * as WFC from './WFConstants'
import WFHelper from './WFHelper'
import WFToolBar from './WFToolBar'
import TBChoicer from './toolbar/TBChoicer'
import TBStartNode from './toolbar/TBStartNode'
import TBCreateNode from './toolbar/TBCreateNode'
import TBEndNode from './toolbar/TBEndNode'
import TBLinker from './toolbar/TBLinker'
import TBTransEnd from './toolbar/TBTransEnd'
import svgJs from 'svg.js'

// 存放工具条实例
var aToolbar = []
// 保存所有SVG实例，包括activity与其它各种JS封装类
var aElement = []
// 保存所有的在SVG上的_activity实例
var aActivitys = []
var aRoads = []
var oSvgJs = null
var dSvgDocument = null

// 当前激活toolbar的id
var sCurrentToolBar = null
var dLastActiveElement = null

var bDrawLink = false
var bMouseDowning = false

var sXLinkns = 'http://www.w3.org/2000/xlink/namespace/'

var aWF_SYS_MSG = []
aWF_SYS_MSG['#header'] = '注意:'
aWF_SYS_MSG['#time'] = 5000
aWF_SYS_MSG['startnode.onlyone'] = '一个流程只允许且必须只能存在一个起点'
aWF_SYS_MSG['road.exist'] = '指向该点已经存在连接，连接将不会被创建'
aWF_SYS_MSG['startnode.notlink'] = '起点不能做为任何通道的结束点'
aWF_SYS_MSG['startnode.onlyone.allow'] = '起点只能连接至一个普通节点'
aWF_SYS_MSG['startnode.onlycan.link.common'] = '起点不能连接至子流、终点、状态点'
aWF_SYS_MSG['activity.notlinkable'] = '状态点、结束点、子流程都不能向外做路径的连接'

var sXML_DF_ELEMENT_NODE = 1
var sXML_DF_ATTRIBUTE_NODE = 2
var sXML_DF_TEXT_NODE = 3
var sXML_DF_CDATA_SECTION_NODE = 4
var sXML_DF_ENTITY_REFERENCE_NODE = 5
var sXML_DF_ENTITY_NODE = 6
var sXML_DF_PROCESSING_INSTRUCTION_NODE = 7
var sXML_DF_COMMENT_NODE = 8
var sXML_DF_DOCUMENT_NODE = 9
var sXML_DF_DOCUMENT_TYPE_NODE = 10
var sXML_DF_DOCUMENT_FRAGMENT_NODE = 11
var sXML_DF_NOTATION_NODE = 12

class WorkFlow {
  _init () {
    this.bDrawLink = false
    // 新添加工具条的位置偏移
    this.iTbX = 0
    this.iTbY = 0

    this.iMouseCount = 0
    this.iMouseDbClickTime = 300
    this.sMouseTracker = null
  }

  constructor (svgId) {
    this._init()

    dSvgDocument = document.getElementById(svgId)
    oSvgJs = svgJs(svgId)

    this.addToolBar('TBChoicer', new TBChoicer())

    if (this.isEditMode()) {
      this.addToolBar('TBStartNode', new TBStartNode())
    }

    this.addToolBar('TBCreateNode', new TBCreateNode())
    this.addToolBar('TBEndNode', new TBEndNode())
    this.addToolBar('TBLinker', new TBLinker())
    this.addToolBar('TBTrans', new TBTransEnd())
  }

  addToolBar (id, clazz) {
    let t = new WFToolBar()
    t.create(this, id, clazz, this.iTbX, this.iTbY)
    aToolbar[id] = t

    this.iTbY += WFC.iToolbarHeight
  }

  selectToolBar (event) {
    if (event.button !== 0) {
      return
    }

    event.stopPropagation()

    if (bMouseDowning) {
      return
    }

    var dToolBar = svgJs.adopt(event.target)
    dToolBar = WFHelper.getReal(dToolBar, 'nodeId', 'ToolBar')
    var tId = dToolBar.attr('tbType')
    this.activeToolBar(tId)
  }

  activeToolBar (tId) {
    if (sCurrentToolBar != null) {
      aToolbar[sCurrentToolBar].onUnSelect()
    }
    sCurrentToolBar = tId
    aToolbar[sCurrentToolBar].onSelect()
    // TODO 缺少操作
  }

  onMouseDown (event) {
    if (event.button !== 0) {
      event.preventDefault()
    }
    if (bMouseDowning) {
      return
    }

    if (event.button !== 0) {
      event.preventDefault()

      var bUseOp = false
      var el = aElement[WFHelper.getSelectedElementId(event)]
      if (el != null) {
        if (el instanceof WFLink) {
          alert('WFLink')
          bUseOp = true
          return
        }
      }
      if (!bUseOp) {
        this.activeToolBar('TBChoicer')
        __wfUnSelectElement()
        return
      }
    }

    event.stopPropagation()
    bMouseDowning = true
    if (sCurrentToolBar == null) {
      return
    }

    // 模拟鼠标双击事件
    if (this.iMouseCount >= 1) {
      this.iMouseCount = 0
      window.clearTimeout(this.sMouseTracker)
      this.dispatchEvent(event, 'doMouseDbClick')
      return
    }
    this.dispatchEvent(event, 'doMouseDown')
    this.iMouseCount++
    this.sMouseTracker = window.setTimeout(this.mouseClickTracker, this.iMouseDbClickTime)
  }

  mouseClickTracker () {
    this.iMouseCount = 0
  }

  dispatchEvent (event, eventType) {
    var instance = aToolbar[sCurrentToolBar].getController()
    switch (eventType) {
      case 'doMouseDown':
        instance.doMouseDown(event)
        break
      case 'doMouseMove':
        instance.doMouseMove(event)
        break
      case 'doMouseUp':
        instance.doMouseUp(event)
        break
      case 'doMouseDbClick':
        instance.doMouseDbClick(event)
        break
      default:
        alert('不支持的分派事件:' + eventType)
    }
  };

  getSvgJs () {
    return oSvgJs
  }

  isEditMode () {
    return true
  }
}

export default WorkFlow
