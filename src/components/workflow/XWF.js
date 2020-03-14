/**
 * Xuz on 2016/03/25.
 * xuz[at]live[dot]cn
 *
 * Xuz on 2019/01/25.
 * Vue 版移植
 */
var WFConstant = {}

// 一般送件
WFConstant.FLOW_CATE_ELECTRONIC = 'E'
// 会签送件（等待）
WFConstant.FLOW_CATE_HUIQIAN = 'H'
// 会签送件（非等待）
WFConstant.FLOW_CATE_HUIQIAN_UNWAIT = 'I'
// 传阅送件
WFConstant.FLOW_CATE_CHUANYUE = 'Y'
// 并发送件
WFConstant.FLOW_CATE_BINGFA = 'M'
// 批量送件(谁先打开办件就谁处理)
WFConstant.FLOW_CATE_BATCH = 'T'
// 纸质送件
WFConstant.FLOW_CATE_PAPER = 'P'
// 并发送件(等待)
WFConstant.FLOW_CATE_CONCURRENT = 'C'
// 并发送件(非等待)
WFConstant.FLOW_CATE_CONCURRENT_UNWAIT = 'D'

// 路径类别 - 送件
WFConstant.ROUTE_CATE_FORWARD = 'F'
// 路径类别 - 退件给送件人
WFConstant.ROUTE_CATE_BACK = 'B'
// 路径类别 - 路径返回操作
WFConstant.ROUTE_CATE_ROUTE = 'X'
// 路径类别 - 路径返回操作至收件人
WFConstant.ROUTE_CATE_ROUTE_RECEIVER = 'Y'

// 送件时选择指定岗位
WFConstant.SEND_SELECTED_POS = '0'
// 送件时选择指定岗位[本机构]
WFConstant.SEND_SELECTED_LOCAL_POS = '5'
// 送件时选择指定岗位[本部门]
WFConstant.SEND_SELECTED_LOCAL_DEPT_POS = 'Z'
// 送件时选择指定收件人
WFConstant.SEND_SELECTED_USER = '1'
// 送件时选择指定角色[本机构]
WFConstant.SEND_SELECTED_ROLE = '2'
// 送件时选择指定角色[所有机构]
WFConstant.SEND_SELECTED_ROLE_ALL_ORG = 'J'
// 送件时选择指定部门
WFConstant.SEND_SELECTED_DEPARTMENT = '3'
// 送件时选择指定部门[本机构]
WFConstant.SEND_SELECTED_LOCAL_DEPARTMENT = '4'
// 送件时选择本部门的人
WFConstant.SEND_LOCAL_DEPARTMENT = '8'
// 送件时可自由选择整个组织架构中的任何人
WFConstant.SEND_ALL_USER = '9'

WFConstant.NODETYPE_COMMON_NODE = '1'
WFConstant.NODETYPE_START_NODE = '2'
WFConstant.NODETYPE_END_NODE = '3'
WFConstant.NODETYPE_TRANS_NODE = '5'

// 发送方式到人
WFConstant.SEND_MODE_TO_PERSON = '1'
// 发送方式到目标中全部人
WFConstant.SEND_MODE_TO_GROUP_ALL = '2'
// 发送方式到目标当中且以文件池的方式
WFConstant.SEND_MODE_TO_GROUP_POLL = '3'

class XWF {
  static getFlowCateDesc (type) {
    switch (type) {
      case WFConstant.FLOW_CATE_ELECTRONIC:
        return '电子送件'
      case WFConstant.FLOW_CATE_PAPER:
        return '纸质送件'
      case WFConstant.FLOW_CATE_HUIQIAN:
        return '会签送件[等待]<span style="color:blue">(*区分先后顺序)</span>'
      case WFConstant.FLOW_CATE_HUIQIAN_UNWAIT:
        return '会签送件[非等待]<span style="color:blue">(*区分先后顺序)</span>'
      case WFConstant.FLOW_CATE_CHUANYUE:
        return '传阅送件'
      case WFConstant.FLOW_CATE_BATCH:
        return '批量送件'
      case WFConstant.FLOW_CATE_CONCURRENT:
        return '并发送件'
      case WFConstant.FLOW_CATE_CONCURRENT_UNWAIT:
        return '并发送件[非等待]'
      default:
        return '错误类型'
    }
  }

  static getTargetTypeDesc (type) {
    switch (type) {
      case WFConstant.SEND_LOCAL_DEPARTMENT:
        return '本部门'
      case WFConstant.SEND_SELECTED_POS:
        return '指定岗位'
      case WFConstant.SEND_SELECTED_LOCAL_POS:
        return '指定岗位[本机构]'
      case WFConstant.SEND_SELECTED_LOCAL_DEPT_POS:
        return '指定岗位[本部门]'
      case WFConstant.SEND_SELECTED_USER:
        return '指定人员'
      case WFConstant.SEND_SELECTED_DEPARTMENT:
        return '指定部门'
      case WFConstant.SEND_SELECTED_LOCAL_DEPARTMENT:
        return '指定部门[本机构]'
      case WFConstant.SEND_ALL_USER:
        return '任何人员'
      case WFConstant.SEND_SELECTED_ROLE:
        return '指定角色[本机构]'
      case WFConstant.SEND_SELECTED_ROLE_ALL_ORG:
        return '指定角色[所有机构]'
      default:
        return '错误类型'
    }
  }

  static hideTargetSelector (that) {
    for (let i in that.DSC_Show) {
      if (that.DSC_Show.hasOwnProperty(i) && typeof that.DSC_Show[i] !== 'function') {
        that.DSC_Show[i] = false
      }
    }
  }

  static showTargetSelector (that, wfType, routeData) {
    XWF.hideTargetSelector(that)

    if (WFConstant.NODETYPE_END_NODE === wfType.nodeType) {
      // 结束点
      that.DSC_Show.DSC_EndNodeContainer = true
      that.oWFEmpSelector = that.$refs.wfEndNodeSelector
      return
    } else if (WFConstant.NODETYPE_TRANS_NODE === wfType.nodeType) {
      // 转换点
      that.DSC_Show.DSC_RouteTransContainer = true
      that.oWFEmpSelector = that.$refs.wfRouteTransSelector
      return
    } else {
      // 一般节点
      if (wfType.routeType === WFConstant.ROUTE_CATE_FORWARD) {
        if (wfType.targetType === WFConstant.SEND_SELECTED_USER) {
          // 指定用户
          that.DSC_Show.DSC_CustomUserContainer = true
          that.oWFEmpSelector = that.$refs.wfCustomUserSelector
          return
        } else if (wfType.targetType === WFConstant.SEND_ALL_USER) {
          // 任意用户
          that.DSC_Show.DSC_AnyUserContainer = true
          that.oWFEmpSelector = that.$refs.wfAnyUserSelector
          return
        } else if (wfType.targetType === WFConstant.SEND_LOCAL_DEPARTMENT) {
          // 本部门
          that.DSC_Show.DSC_SelfDeptUserContainer = true
          that.oWFEmpSelector = that.$refs.wfSelfDeptUserSelector
          return
        } else if (wfType.targetType === WFConstant.SEND_SELECTED_POS || wfType.targetType === WFConstant.SEND_SELECTED_LOCAL_POS || wfType.targetType === WFConstant.SEND_SELECTED_LOCAL_DEPT_POS) {
          // 指定岗位
          that.DSC_Show.DSC_CustomPosUserContainer = true
          that.oWFEmpSelector = that.$refs.wfCustomPosUserSelector
          return
        } else if (wfType.targetType === WFConstant.SEND_SELECTED_DEPARTMENT || wfType.targetType === WFConstant.SEND_SELECTED_LOCAL_DEPARTMENT) {
          // 指定部门
          that.DSC_Show.DSC_CustomDeptUserContainer = true
          that.oWFEmpSelector = that.$refs.wfCustomDeptUserSelector
          return
        } else if (wfType.targetType === WFConstant.SEND_SELECTED_ROLE || wfType.targetType === WFConstant.SEND_SELECTED_ROLE_ALL_ORG) {
          // 指定角色
          that.DSC_Show.DSC_CustomRoleUserContainer = true
          that.oWFEmpSelector = that.$refs.wfCustomRoleUserSelector
          return
        }
      } else if (wfType.routeType === WFConstant.ROUTE_CATE_BACK) {
        // 退回至送件人
        that.DSC_Show.DSC_RouteCateBackContainer = true
        that.oWFEmpSelector = that.$refs.wfCateBackSelector
        return
      } else if (wfType.routeType === WFConstant.ROUTE_CATE_ROUTE) {
        // 退件至路径最后发件人
        that.DSC_Show.DSC_RouteHandlerContainer = true
        that.oWFEmpSelector = that.$refs.wfRouteSenderSelector
        return
      } else if (wfType.routeType === WFConstant.ROUTE_CATE_ROUTE_RECEIVER) {
        // 退件至路径最后收件人
        that.DSC_Show.DSC_RouteReceiverContainer = true
        that.oWFEmpSelector = that.$refs.wfRouteReceiverSelector
        return
      }
    }

    alert('未实现的选择器,Route[' + wfType.routeType + '], Type[' + wfType.targetType + ']')
  }

  static isSingleEmpSelect (wfType) {
    if (wfType.actFlowKind === WFConstant.FLOW_CATE_ELECTRONIC) {
      return true
    }
    return false
  }

  static isOrderEmpSelect (wfType) {
    if (wfType.actFlowKind === WFConstant.FLOW_CATE_HUIQIAN || wfType.actFlowKind === WFConstant.FLOW_CATE_HUIQIAN_UNWAIT) {
      return true
    }
    return false
  }

  static isGroupSendMode (wfType) {
    if (wfType.sendMode === WFConstant.SEND_MODE_TO_GROUP_ALL || wfType.sendMode === WFConstant.SEND_MODE_TO_GROUP_POLL) {
      return true
    }
    return false
  }
}

export { WFConstant, XWF }
