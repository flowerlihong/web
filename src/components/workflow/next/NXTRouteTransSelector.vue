<!--
 Created by Xuz on 2019/01/30.
 xuz[at]live[dot]cn
 第二步：传阅用户转换点选择
-->
<template>
    <div style="display: flex">
        <a-card class="wf-card wf-trans-card" :bordered="false">
            <div class="wf-card-title"><img src="/app/workflow/img/xwf/n2.gif"/> 已选择</div>
            <div class="wf-card-body">
                <div v-html="result"></div>
            </div>
        </a-card>
    </div>
</template>

<script>
import { XWF } from '../XWF'
import NxtBus from './NXTBus'
import qs from 'qs'

export default {
  name: 'NXTRouteTransSelector',
  props: {
  },
  created () {
  },
  data () {
    return {
      wfType: null,
      bEnd: false,
      bComplete: false,
      result: null
    }
  },
  watch: {
  },
  methods: {
    update (wfType, routeData) {
      this.wfType = wfType
      this.bComplete = routeData.next.complete
      const tranType = routeData.next.type
      if (!this.bComplete) {
        // 还有下一步处理人
        if (tranType === 'D') {
          // 并发
          NxtBus.$emit('changeRouteTransSelector', true)
        } else if (tranType === 'C') {
          // 传阅
          NxtBus.$emit('changeRouteTransSelector', true)
        } else if (tranType === 'H') {
          // 会签
          const group = routeData.group
          if (group) {
            // 以文件池方式发送
            let uName = group
            // 如果带有岗位显示就去掉显示
            const idx = uName.indexOf('[')
            if (idx !== -1) {
              uName = uName.substr(0, idx)
            }
            this.result = uName
          } else {
            this.result = routeData.user.name
          }
        }
      } else {
        const nextRoutes = routeData.routes
        const conFlowType = routeData.next.flowType
        let hasRoutes = false
        if (nextRoutes && nextRoutes.length > 0) {
          hasRoutes = true
        }
        if (!hasRoutes || conFlowType === 'H') {
          this.bEnd = true
          NxtBus.$emit('changeRouteTransSelector', true)
          NxtBus.$emit('changeTranInfo', '<span style="color:red">分支环节结束</span>')
        } else {
          // 有连接出去的路径，用户必须选择好路径
          this.bEnd = false
          NxtBus.$emit('changeRouteTransSelector', true)
          NxtBus.$emit('changeTranInfo', '<span style="color:blue;font-weight:bold">请选择状态结束后的路径</span>')
          NxtBus.$emit('changeAppendRoutes', nextRoutes)
        }
      }
    },
    getType () {
      return this.wfType
    },
    isEnd () {
      return this.bEnd
    },
    isComplete () {
      return this.bComplete
    },
    getSelected () {
      return ['#']
    }
  }
}
</script>

<style scoped>
    .wf-trans-card {
        width:146px;
    }
</style>
