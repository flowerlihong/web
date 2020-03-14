<!--
 Created by Xuz on 2019/02/13.
 xuz[at]live.cn
 流程撤回
-->
<template>
    <a-modal title="流程撤回"
             :width="600"
             :footer="null"
             :visible="visible"
             @cancel="onCancel">
        <div v-if="actInsList.length > 1 && !showResult">
            <a-alert message="请选择要撤回的办件" type="info" />
            <br/>
            <a-card>
                <div style="font-weight:bold;border-bottom:1px solid #E9E9E9;padding-bottom:6px;margin-bottom:6px">
                    <a-checkbox @change="onCheckAllChange" :checked="checkAll">全部撤回</a-checkbox>
                </div>
                <a-checkbox-group v-model="selectedActInsIds" @change="onChange">
                    <a-row>
                        <a-col :span="24" v-for="actIns in actInsList" :key="actIns.act_ins_id">
                            <a-checkbox :value="actIns.act_ins_id">{{actIns.handler_name}}「{{ actIns.act_name }}」</a-checkbox>
                        </a-col>
                    </a-row>
                </a-checkbox-group>
                <div style="margin-top:10px;text-align:center">
                    <a-button @click="onWithdraw" type="primary">撤回</a-button>
                </div>
            </a-card>
        </div>
        <div class="result" v-show="showResult">
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
import { WorkflowEvent } from '../WorkflowEvent'
import qs from 'qs'

export default {
  name: 'WorkflowWithdraw',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  created () {
  },
  data () {
    return {
      xwfState: null,
      loading: true,
      indeterminate: true,
      checkAll: false,
      selectedActInsIds: [],
      actInsList: [],
      showResult: false,
      result: {
        title: '',
        desc: ''
      }
    }
  },
  methods: {
    update (xwfState) {
      const that = this
      that.loading = true
      that.xwfState = xwfState
      that.$http.get('/api/1/workflow/withdraw_act_ins.json?actInsId=' + xwfState.actInsId).then(function (resp) {
        that.loading = false
        if (resp.code !== 200) {
          return
        }
        if (resp.result.length === 1) {
          // 只有一个可以撤回的件时,直接撤回。否则出现选择页面
          that.doWithdraw(xwfState.actInsId, [resp.result[0].act_ins_id])
        } else {
          // 多人撤件选择
          that.actInsList = resp.result
        }
      })
    },
    doWithdraw (actInsId, withdrawActInsId) {
      const that = this
      let data = {
        actInsId: actInsId,
        withdrawActInsIds: withdrawActInsId
      }
      that.$http.post('/api/1/workflow/withdraw_action.json', qs.stringify(data, { indices: false })).then(function (resp) {
        if (resp.code !== 200) {
          return
        }
        that.showResult = true
        let count = 3
        that.result.title = '撤回操作成功'
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
      WorkflowEvent.$emit('PostXwfWithdraw')
      this.$emit('cancel')
    },
    getCounterDesc (count) {
      return '本窗口 <span style="color:red">' + count + '</span> 秒后自动关闭'
    },
    onChange (checkedList) {
      this.indeterminate = !!checkedList.length && (checkedList.length < this.actInsList.length)
      this.checkAll = checkedList.length === this.actInsList.length
    },
    onCheckAllChange (e) {
      Object.assign(this, {
        selectedActInsIds: e.target.checked ? this.actInsList.map(item => item.act_ins_id) : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
    },
    onWithdraw () {
      if (this.selectedActInsIds.length === 0) {
        this.$message.warning('请选择要撤回的办件')
        return
      }
      this.doWithdraw(this.xwfState.actInsId, this.selectedActInsIds)
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
