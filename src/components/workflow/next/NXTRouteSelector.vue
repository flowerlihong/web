<!--
 Created by Xuz on 2019/01/28.
 xuz[at]live[dot]cn
 第一步：路径选择
-->
<template>
    <a-card class="wf-card" :bordered="false">
        <div class="wf-card-title"><img src="/app/workflow/img/xwf/n1.gif"/> 流程操作信息提示</div>
        <div class="wf-card-body">
            <a-radio-group style="width:100%" @change="onSelectedRoute" v-model="selectedRoute">
                <a-row>
                    <a-col v-for="item in routes" :key="item.id" :span="12"><a-radio :value="item.id">{{item.name}}</a-radio></a-col>
                </a-row>
            </a-radio-group>
            <div v-html="selectedInfo"></div>
            <div v-html="tranInfo"></div>
            <a-radio-group style="width:100%" @change="onSelectedAppendRoute" v-model="selectedAppendRoute">
                <a-row>
                    <a-col v-for="item in appendRoutes" :key="item.id" :span="12"><a-radio :value="item.id">{{item.name}}</a-radio></a-col>
                </a-row>
            </a-radio-group>
        </div>
    </a-card>
</template>

<script>
import { WFConstant, XWF } from '../XWF'
import NxtBus from './NXTBus'

export default {
  name: 'NXTRouteSelector',
  props: {
  },
  created () {
    NxtBus.$on('changeTranInfo', (info) => {
      this.tranInfo = info
    })
    NxtBus.$on('changeAppendRoutes', (routes) => {
      this.appendRoutes = routes
      if (this.appendRoutes.length > 0) {
        this.selectedAppendRoute = this.appendRoutes[0].id
        this.doSelectedAppendRoute(this.selectedAppendRoute)
      }
    })
  },
  data () {
    return {
      routes: [],
      bWFAppendMode: false,
      selectedRoute: null,
      selectedAppendRoute: null,
      selectedInfo: '',
      tranInfo: '',
      appendRoutes: []
    }
  },
  watch: {
  },
  methods: {
    update (actInsId) {
      console.log('WFRouteSelector.update' + actInsId)
      const that = this
      that.actInsId = actInsId
      that.$http.get('/api/1/workflow/routes.json?actInsId=' + actInsId).then(function (resp) {
        that.routes = resp.result
        if (that.routes.length > 0) {
          that.selectedRoute = that.routes[0].id
          that.doSelectedRoute(that.selectedRoute)
        }
      })
    },
    onSelectedRoute (e) {
      this.doSelectedRoute(e.target.value)
    },
    onSelectedAppendRoute (e) {
      this.doSelectedAppendRoute(e.target.value)
    },
    doSelectedRoute (routeId) {
      const that = this
      that.loading = true
      this.$http.get('/api/1/workflow/route_select.json?routeId=' + routeId + '&actInsId=' + that.actInsId + '&t=' + new Date().getTime()).then(this.onUserLoaded)
    },
    doSelectedAppendRoute (routeId) {
      const that = this
      this.bWFAppendMode = true
      this.selectedAppendRoute = routeId
      this.$http.get('/api/1/workflow/route_select.json?routeId=' + routeId + '&actInsId=' + that.actInsId + '&t=' + new Date().getTime()).then(this.onUserLoaded)
    },
    onUserLoaded (resp) {
      if (resp.code !== 200) {
        return
      }
      let wfType = {}
      wfType.actFlowKind = resp.result.actFlowKind
      wfType.routeType = resp.result.routeType
      wfType.targetType = resp.result.targetType
      wfType.nodeType = resp.result.nodeType
      wfType.sendMode = resp.result.sendMode
      wfType.routeId = resp.result.routeId
      if (!this.bWFAppendMode) {
        const route = this.routes.filter(item => item.id === wfType.routeId)[0]
        let sb = []
        sb.push('已选择的目标为：<span style="color:red">' + route.toActivity.name + '</span><br>')
        // 如果是结束的话，不需要显示类型描述
        if (WFConstant.NODETYPE_END_NODE === wfType.nodeType) {
          sb.push('<span style="color:#008000">本流程将运行结束</span>')
        } else if (WFConstant.NODETYPE_TRANS_NODE === wfType.nodeType) {
          sb.push('送件类型：特殊送件')
        } else {
          if (WFConstant.ROUTE_CATE_FORWARD === wfType.routeType) {
            sb.push('送件类型：' + XWF.getFlowCateDesc(wfType.actFlowKind) + '<br>')
            sb.push('收件类型：' + XWF.getTargetTypeDesc(wfType.targetType))
          } else if (WFConstant.ROUTE_CATE_BACK === wfType.routeType) {
            sb.push('送件类型：退件给送件人')
          }
        }
        this.selectedInfo = sb.join('')
      }

      let routeSelectorData = {
        bWFAppendMode: this.bWFAppendMode,
        selectedAppendRoute: this.selectedAppendRoute
      }

      this.$emit('change', this.selectedRoute, wfType, resp.result, routeSelectorData)
    }
  }
}
</script>
