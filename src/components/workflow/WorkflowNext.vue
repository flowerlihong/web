<!--
 Created by Xuz on 2019/01/24.
 xuz[at]live[dot]cn
 流程下一步操作
-->
<template>
    <a-modal title="下一步操作"
             class="wf-modal"
             :destroyOnClose="true"
             :width="1060"
             :footer="null"
             :visible="visible"
             @cancel="onCancel">
        <div class="wf-cards" v-show="!DSC_Show.complete">
            <div style="width:280px">
                <NXTRouteSelector ref="wfRouteSelector" :tranInfo="tranInfo" @change="onChangeRoute" />
            </div>
            <div style="padding-left:8px;">
                <!-- 任何人员选择器 -->
                <NXTAnyUserSelector ref="wfAnyUserSelector" v-show="DSC_Show.DSC_AnyUserContainer"/>
                <!-- 指定人员选择器 -->
                <NXTCustomUserSelector ref="wfCustomUserSelector" v-show="DSC_Show.DSC_CustomUserContainer"/>
                <!-- 指定岗位人员选择器 -->
                <NXTCustomPosUserSelector ref="wfCustomPosUserSelector" v-show="DSC_Show.DSC_CustomPosUserContainer"/>
                <!-- 指定部门人员选择器 -->
                <NXTCustomDeptUserSelector ref="wfCustomDeptUserSelector" v-show="DSC_Show.DSC_CustomDeptUserContainer"/>
                <!-- 指定角色人员选择器 -->
                <NXTCustomRoleUserSelector ref="wfCustomRoleUserSelector" v-show="DSC_Show.DSC_CustomRoleUserContainer"/>
                <!-- 本部门人员选择器 -->
                <NXTSelfDeptUserSelector ref="wfSelfDeptUserSelector" v-show="DSC_Show.DSC_SelfDeptUserContainer"/>
                <!-- 传阅人员转换点选择器 -->
                <NXTRouteTransSelector ref="wfRouteTransSelector" v-show="DSC_Show.DSC_RouteTransContainer"/>
                <!-- 送件至路径选择器-->
                <NXTRouteSenderSelector ref="wfRouteSenderSelector" v-show="DSC_Show.DSC_RouteHandlerContainer"/>
                <!-- 退件给送件人选择器 -->
                <NXTCateBackSelector ref="wfCateBackSelector" v-show="DSC_Show.DSC_RouteCateBackContainer"/>
                <!-- 退回至路径送件人 -->
                <NXTRouteReceiverSelector ref="wfRouteReceiverSelector" v-show="DSC_Show.DSC_RouteReceiverContainer"/>
                <!-- 结束结点选择器 -->
                <NXTEndNodeSelector ref="wfEndNodeSelector" v-show="DSC_Show.DSC_EndNodeContainer"/>
            </div>
            <div style="padding-left:8px;">
                <a-card class="wf-card" :bordered="false" style="width:146px" v-show="DSC_Show.DSC_ConfirmContainer">
                    <div class="wf-card-title"><img src="/app/workflow/img/xwf/xgo.gif"/> 确认信息</div>
                    <div class="wf-card-body" style="display:flex;">
                        <a-button type="danger" style="margin:auto" @click="onWFNextSend" :loading="sending">执行操作！</a-button>
                    </div>
                </a-card>
            </div>
        </div>
        <div class="result" v-show="DSC_Show.complete">
            <div>
                <a-icon class="icon success" type="check-circle"/>
            </div>
            <div class="title">{{result.title}}</div>
            <div v-html="result.desc" class="description"></div>
            <!--<div class="content"></div>-->
            <div class="action">
                <a-button @click="onClose">关闭窗口</a-button>
            </div>
        </div>
    </a-modal>
</template>

<script>
import qs from 'qs'
import { WFConstant, XWF } from './XWF'
import NxtBus from './next/NXTBus'
import { WorkflowEvent } from './WorkflowEvent'
import NXTRouteSelector from '@/components/workflow/next/NXTRouteSelector'
import NXTAnyUserSelector from '@/components/workflow/next/NXTAnyUserSelector'
import NXTCustomUserSelector from '@/components/workflow/next/NXTCustomUserSelector'
import NXTCustomPosUserSelector from '@/components/workflow/next/NXTCustomPosUserSelector'
import NXTCustomDeptUserSelector from '@/components/workflow/next/NXTCustomDeptUserSelector'
import NXTCustomRoleUserSelector from '@/components/workflow/next/NXTCustomRoleUserSelector'
import NXTSelfDeptUserSelector from '@/components/workflow/next/NXTSelfDeptUserSelector'
import NXTRouteTransSelector from '@/components/workflow/next/NXTRouteTransSelector'
import NXTRouteSenderSelector from '@/components/workflow/next/NXTRouteSenderSelector'
import NXTCateBackSelector from '@/components/workflow/next/NXTCateBackSelector'
import NXTRouteReceiverSelector from '@/components/workflow/next/NXTRouteReceiverSelector'
import NXTEndNodeSelector from '@/components/workflow/next/NXTEndNodeSelector'

export default {
  name: 'WorkflowNext',
  components: {
    NXTRouteSelector,
    NXTAnyUserSelector,
    NXTCustomUserSelector,
    NXTCustomPosUserSelector,
    NXTCustomDeptUserSelector,
    NXTCustomRoleUserSelector,
    NXTSelfDeptUserSelector,
    NXTRouteTransSelector,
    NXTRouteSenderSelector,
    NXTCateBackSelector,
    NXTRouteReceiverSelector,
    NXTEndNodeSelector
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  created () {
    NxtBus.$on('changeRouteTransSelector', () => {
      this.DSC_Show.DSC_RouteTransContainer = false
    })
  },
  data () {
    return {
      xwfState: null,
      actInsId: null,
      tranInfo: null,
      oWFEmpSelector: null,
      DSC_Show: {
        complete: false,
        DSC_AnyUserContainer: false,
        DSC_CustomUserContainer: false,
        DSC_CustomPosUserContainer: false,
        DSC_CustomDeptUserContainer: false,
        DSC_CustomRoleUserContainer: false,
        DSC_SelfDeptUserContainer: false,
        DSC_RouteTransContainer: false,
        DSC_RouteHandlerContainer: false,
        DSC_RouteCateBackContainer: false,
        DSC_RouteReceiverContainer: false,
        DSC_EndNodeContainer: false,
        DSC_ConfirmContainer: false
      },
      routeId: null,
      routeData: null,
      routeSelectorData: null,
      userIds: [],
      sending: false,
      result: {
        title: '',
        desc: ''
      }
    }
  },
  watch: {
  },
  methods: {
    update (xwfState) {
      const that = this
      that.DSC_Show.complete = false
      that.xwfState = xwfState
      that.actInsId = xwfState.actInsId
      that.$nextTick(function () {
        that.$refs.wfRouteSelector.update(that.actInsId)
      })
    },
    onChangeRoute (routeId, wfType, routeData, routeSelectorData) {
      this.routeId = routeId
      this.routeData = routeData
      this.routeSelectorData = routeSelectorData
      XWF.showTargetSelector(this, wfType)
      this.oWFEmpSelector.update(wfType, routeData, this)
      this.DSC_Show.DSC_ConfirmContainer = true
    },
    onWFNextSend () {
      const that = this
      let processing = true
      if (this.oWFEmpSelector == null) {
        this.$warning({
          title: '未找到相应的人员选择器，请重新打开页面'
        })
        processing = false
        return
      }
      const nodeType = this.oWFEmpSelector.getType().nodeType
      if (nodeType === WFConstant.NODETYPE_END_NODE) {
        this.userIds = []
        this.$confirm({
          title: '您确认要结束当前流程吗？',
          onOk () {
            that.process()
          },
          onCancel () {
            processing = false
          }
        })
      } else if (nodeType === WFConstant.NODETYPE_TRANS_NODE) {
        this.userIds = []
        that.process()
      } else {
        const selectedIds = this.oWFEmpSelector.getSelected()
        if (selectedIds.length === 0) {
          this.$warning({
            title: '您还未选择任何需要发送的名单'
          })
          processing = false
          return
        }
        this.userIds = selectedIds

        if (!processing) {
          return
        }
        that.process()
      }
    },
    process () {
      if (this.DSC_Show.DSC_RouteTransContainer) {
        if (this.oWFEmpSelector.isComplete()) {
          // 如果已经选择了后续路径选择器实例不会是TransNextSelector
          if (!this.oWFEmpSelector.isEnd()) {
            alert('请先选择会签后续路径！')
            return
          }
        }
      }

      this.sending = true
      let data = {}
      data.procId = this.xwfState.procId
      data.actInsId = this.actInsId
      data.routeId = this.routeId
      data.userIds = this.userIds.join(',')
      if (this.routeSelectorData.bWFAppendMode && this.routeSelectorData.selectedAppendRoute) {
        data.appendRouteId = this.routeSelectorData.selectedAppendRoute
      }
      data.dateLimit = null
      let that = this
      this.$http.post('/api/1/workflow/next_action.json', qs.stringify(data)).then(function (resp) {
        that.sending = false
        if (resp.code !== 200) {
          return
        }
        that.DSC_Show.complete = true
        let result = resp.result
        let mode = result.mode
        let nextActInsId = result.nextActInsId
        if (mode === 'N') {
          that.result.title = '已成功发送'
        } else if (mode === 'C') {
          that.result.title = '该办件已成功办结'
        } else if (mode === 'T') {
          that.result.title = '该办件已成功废弃'
        }
        let count = 3
        that.result.desc = that.getCounterDesc(count)
        let counter = setInterval(function () {
          if (--count <= 0) {
            clearInterval(counter)
            that.onClose()
          } else {
            that.result.desc = that.getCounterDesc(count)
          }
        }, 1000)
      })
    },
    onCancel () {
      this.$emit('cancel')
    },
    onClose () {
      WorkflowEvent.$emit('PostXwfNext')
      this.$emit('cancel')
    },
    getCounterDesc (count) {
      return '本窗口 <span style="color:red">' + count + '</span> 秒后自动关闭'
    }
  }
}
</script>

<style>
    .wf-modal .ant-modal-body {
        padding: 12px !important;
    }

    .wf-card .ant-card-body {
        padding: 0 !important;
    }

    .wf-card-title {
        border-width: 1px 1px 0 1px;
        border-style: solid;
        border-color: #cccccc;
        background-color: #ECF3F9;
        padding: 5px;
    }

    .wf-card-body {
        height: 280px;
        overflow-y: auto;
        border: 1px solid #cccccc;
        padding: 5px;
    }

    .wf-cards {
        display: flex;
        flex-wrap: wrap;
    }
</style>

<style lang="less" scoped>
    .result {
        text-align: center;
        width: 72%;
        margin: 0 auto;
        padding: 24px 0 8px;

        .icon {
            font-size: 72px;
            line-height: 72px;
            margin-bottom: 24px;
        }
        .success {
            color: #52c41a;
        }
        .error {
            color: red;
        }
        .title {
            font-size: 24px;
            color: rgba(0, 0, 0, .85);
            font-weight: 500;
            line-height: 32px;
            margin-bottom: 16px;
        }
        .description {
            font-size: 14px;
            line-height: 22px;
            color: rgba(0, 0, 0, 0.45);
            margin-bottom: 24px;
        }
        .content {
            background: #fafafa;
            padding: 24px 40px;
            border-radius: 2px;
            text-align: left;
        }
        .action {
            margin-top: 32px;
        }
    }
</style>
