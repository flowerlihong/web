<!--
 Created by Xuz on 2019/01/22.
 xuz[at]live.cn
 流程下一步菜单
-->
<template>
    <span>
        <span v-show="loading"><img src="/img/loading-bar.gif"/></span>
        <span v-show="!loading">
            <a-button v-if="xwfState.withdraw" class="xwf-menu" @click="onWithdraw"><a-icon type="rollback" /> 撤回</a-button>
            <a-button v-if="xwfState.withdrawHuiQian" class="xwf-menu" @click="onWithdrawHuiQian"><a-icon type="rollback" /> 撤回会签</a-button>
            <a-button v-if="xwfState.withdrawChuanYue" class="xwf-menu" @click="onWithdrawChuanYue"><a-icon type="rollback" /> 撤回传阅</a-button>
            <a-button v-if="xwfState.withdrawBingFa" class="xwf-menu" @click="onWithdrawBingFa"><a-icon type="rollback" /> 撤回并发</a-button>
            <a-button v-if="xwfState.withdrawTransfer" class="xwf-menu" @click="onWithdrawTransfer"><a-icon type="rollback" /> 撤回转办</a-button>
            <a-button v-if="xwfState.hasNext" class="xwf-menu" type="primary" @click="onProcessNext"><a-icon type="right-square" /> 下一步</a-button>
            <a-button v-if="xwfState.hasNext" class="xwf-menu" @click="onTransfer"><a-icon type="select" /> 转办</a-button>
            <a-button v-if="xwfState.wfadmin" class="xwf-menu" @click="onManageTransfer"><a-icon type="select" /> 流程管理</a-button>
            <a-button v-if="xwfState.hasNext" class="xwf-menu" @click="onChuanYue"><a-icon type="retweet" /> 传阅</a-button>
            <a-button v-if="xwfState.simpleHandRound" class="xwf-menu" @click="onSimpleHandRounded"><a-icon type="check" /> 我已阅</a-button>
            <a-button v-if="xwfState.simpleHandRound" class="xwf-menu" @click="onChuanYue"><a-icon type="retweet" /> 继续传阅</a-button>
            <a-button v-if="xwfState.hasProcessInstance" class="xwf-menu" @click="onViewHistory"><a-icon type="file-done" /> 流程跟踪</a-button>
            <workflow-next ref="wfNext" :xwfState="xwfState" :visible="modalVisible.next" @cancel="modalVisible.next = false" />
            <workflow-transfer ref="wfTransfer" :xwfState="xwfState" :visible="modalVisible.transfer" @cancel="modalVisible.transfer = false" />
            <workflow-chuan-yue ref="wfChuanYue" :visible="modalVisible.chuanYue" @cancel="modalVisible.chuanYue = false" />
            <workflow-history ref="wfHistory" :visible="modalVisible.history" @cancel="modalVisible.history = false" />
            <workflow-withdraw ref="wfWithdraw" :visible="modalVisible.withdraw" @cancel="modalVisible.withdraw = false"/>
            <WorkflowWithdrawHQCY ref="wfWithdrawHQCY" :visible="modalVisible.withdrawHQCY" @cancel="modalVisible.withdrawHQCY = false"/>
        </span>
    </span>
</template>

<script>
import WorkflowNext from '@/components/workflow/WorkflowNext'
import WorkflowHistory from '@/components/workflow/WorkflowHistory'
import WorkflowTransfer from '@/components/workflow/WorkflowTransfer'
import WorkflowChuanYue from '@/components/workflow/WorkflowChuanYue'
import WorkflowWithdraw from '@/components/workflow/withdraw/WorkflowWithdraw'
import WorkflowWithdrawHQCY from '@/components/workflow/withdraw/WorkflowWithdrawHQCY'
import { WorkflowEvent } from './WorkflowEvent'
import qs from 'qs'

export default {
  name: 'WorkflowMenu',
  components: {
    WorkflowNext,
    WorkflowTransfer,
    WorkflowChuanYue,
    WorkflowHistory,
    WorkflowWithdraw,
    WorkflowWithdrawHQCY
  },
  props: {
    value: {
      type: String,
      default: null
    },
    onBeforeNext: {
      type: Function,
      required: false,
      default: null
    }
  },
  mounted () {
    WorkflowEvent.$on('PostCommentSave', () => {
      if (this.xwfState.hasNext) {
        this.onProcessNext()
      }
    })
    WorkflowEvent.$on('PostXwfNext', () => {
      this.onReloadPage()
    })
    WorkflowEvent.$on('PostXwfWithdraw', () => {
      this.onReloadPage()
    })
    WorkflowEvent.$on('PostXwfTransfer', () => {
      this.onReloadPage()
    })
    WorkflowEvent.$on('PostXwfChuanYue', () => {
      this.onReloadPage()
    })
    WorkflowEvent.$on('PostXwfWithdrawTransfer', () => {
      this.onReloadPage()
    })
    WorkflowEvent.$on('PostXwfSimpleHandRound', () => {
      this.onReloadPage()
    })
  },
  created () {
    this.onFetchData()
  },
  data () {
    return {
      loading: true,
      wfJsParams: null,
      xwfState: {},
      modalVisible: {
        next: false,
        transfer: false,
        chuanYue: false,
        history: false,
        withdraw: false,
        withdrawHQCY: false
      }
    }
  },
  methods: {
    onReloadPage () {
      this.$router.go(0)
      // this.onFetchData()
    },
    onFetchData () {
      const that = this
      that.loading = true
      that.$http.get('/api/1/workflow/xwf_state.json?id=' + this.$route.query.id).then(function (resp) {
        if (resp.code === 200) {
          that.loading = false
          that.xwfState = resp.result
          that.wfJsParams = 'caseTypeId=' + that.xwfState.caseTypeId + '&id=' + that.xwfState.caseId +
                            '&procInsId=' + that.xwfState.procInsId + '&actInsId=' + that.xwfState.actInsId
          that.$emit('onLoadXWFState', that.xwfState)
        }
      })
    },
    onProcessNext () {
      if (this.$props.onBeforeNext !== null) {
        if (!this.$props.onBeforeNext()) {
          return
        }
      }

      WorkflowEvent.$emit('PreXwfNext')

      this.modalVisible.next = true
      this.$refs.wfNext.update(this.xwfState)
    },
    onTransfer () {
      this.modalVisible.transfer = true
      this.$refs.wfTransfer.preTransfer(this.xwfState, 1)
    },
    onManageTransfer () {
      this.modalVisible.transfer = true
      this.$refs.wfTransfer.preTransfer(this.xwfState, 2)
    },
    onChuanYue () {
      this.modalVisible.chuanYue = true
      this.$refs.wfChuanYue.preChuanYue(this.xwfState)
    },
    onViewHistory () {
      this.modalVisible.history = true
      this.$refs.wfHistory.onLoadData(this.xwfState.procInsId)
    },
    onWithdraw () {
      const that = this
      this.$confirm({
        title: '您确定要执行撤回操作吗？',
        onOk () {
          that.modalVisible.withdraw = true
          that.$refs.wfWithdraw.update(that.xwfState)
        }
      })
    },
    onWithdrawHuiQian () {
      const that = this
      this.$confirm({
        title: '您确定要执行会签撤回操作吗？',
        onOk () {
          that.modalVisible.withdrawHQCY = true
          that.$refs.wfWithdrawHQCY.update(that.xwfState, 'H')
        }
      })
    },
    onWithdrawChuanYue () {
      const that = this
      this.$confirm({
        title: '您确定要执行传阅撤回操作吗？',
        onOk () {
          that.modalVisible.withdrawHQCY = true
          that.$refs.wfWithdrawHQCY.update(that.xwfState, 'Y')
        }
      })
    },
    onWithdrawBingFa () {
      const that = this
      this.$confirm({
        title: '您确定要执行并发撤回操作吗？',
        onOk () {
          that.modalVisible.withdrawHQCY = true
          that.$refs.wfWithdrawHQCY.update(that.xwfState, 'C')
        }
      })
    },
    onWithdrawTransfer () {
      const that = this
      this.$confirm({
        title: '您确定要执行转办撤回操作吗？',
        onOk () {
          let data = {}
          data.actInsId = that.xwfState.actInsId
          that.$http.post('/api/1/workflow/withdraw_transfer_action.json', qs.stringify(data)).then(function (resp) {
            if (resp.code === 200) {
              that.$message.success('操作已完成')
            }
            WorkflowEvent.$emit('PostXwfWithdrawTransfer')
          })
        }
      })
    },
    onSimpleHandRounded () {
      const that = this
      let data = {}
      data.actInsId = that.xwfState.actInsId
      that.$http.post('/api/1/workflow/simple_handround_action.json', qs.stringify(data)).then(function (resp) {
        that.$message.success('操作已完成')
        WorkflowEvent.$emit('PostXwfSimpleHandRound')
      })
    }
  }
}
</script>

<style scoped>
.xwf-menu {
    margin-right: 4px;
}

.xwf-menu:last-child {
    margin-right: 12px;
}
</style>
