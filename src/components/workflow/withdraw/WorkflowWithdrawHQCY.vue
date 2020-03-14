<!--
 Created by Xuz on 2019/02/15.
 xuz[at]live.cn
 会签流程撤回
-->
<template>
    <a-modal title="流程撤回"
             :width="960"
             :footer="null"
             :visible="visible"
             @cancel="onCancel">
        <div class="result" v-show="showResult">
            <div>
                <a-icon :class="{ 'icon': true, 'success': result.success, 'error': !result.success }" :type="result.success ? 'check-circle' : 'close-circle'"/>
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
import { WorkflowEvent } from '../WorkflowEvent'

export default {
  name: 'WorkflowWithdrawHQCY',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    xwfState: {
      type: Object
    }
  },
  created () {
  },
  data () {
    return {
      loading: true,
      showResult: true,
      result: {
        success: false,
        title: '',
        desc: ''
      }
    }
  },
  methods: {
    update (xwfState, type) {
      const that = this
      this.$http.get('/api/1/workflow/withdraw_hqcy_action.json?actInsId=' + xwfState.actInsId + '&type=' + type).then(function (resp) {
        if (resp.code !== 200) {
          return
        }
        that.showResult = true
        let count = 3
        that.result.success = resp.result.success
        that.result.title = resp.result.msg
        if (that.result.success) {
          that.result.desc = that.getCounterDesc(count)
          let counter = setInterval(function () {
            if (--count <= 0) {
              clearInterval(counter)
              that.onClose()
            } else {
              that.result.desc = that.getCounterDesc(count)
            }
          }, 1000)
        }
      })
    },
    onCancel () {
      this.$emit('cancel')
    },
    onClose () {
      WorkflowEvent.$emit('PostXwfWithdraw')
      this.$emit('cancel')
    },
    getCounterDesc (count) {
      return '本窗口 <span style="color:red">' + count + '</span> 秒后自动关闭'
    }
  }
}
</script>

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
