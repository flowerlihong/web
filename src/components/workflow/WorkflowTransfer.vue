<!--
 Created by Xuz on 2019/06/20.
 xuz[at]live.cn
 流程转办
-->
<template>
    <a-modal title="流程转办"
             :width="960"
             :footer="null"
             :visible="visible"
             destroyOnClose
             @cancel="$emit('cancel')">
        <a-alert message="请选择当前待办件的新办理人" type="info" />
        <br/>
        <a-card>
            <a-radio-group v-model="selectedActInsId">
                <a-row>
                    <a-col :span="6" v-for="actIns in actInsData" :key="actIns.id">
                        <a-radio :value="actIns.id">{{actIns.extras.handler}}「{{ actIns.actName }}」</a-radio>
                    </a-col>
                </a-row>
            </a-radio-group>
        </a-card>
        <br/>
        <a-form layout="inline">
            <a-form-item label="转办至">
                <user-selector @change="onSelectUser"/>
            </a-form-item>
            <a-form-item>
                <a-button @click="onTransfer" type="primary">转办</a-button>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
import qs from 'qs'
import UserSelector from '@/components/selector/UserSelector'
import { WorkflowEvent } from './WorkflowEvent'

export default {
  name: 'WorkflowTransfer',
  components: { UserSelector },
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
      loading: false,
      mode: 1, // 1:显示自己，2:显示所有
      xwfState: null,
      actInsData: [],
      selectedActInsId: null,
      transferUserId: null
    }
  },
  methods: {
    preTransfer (xwfState, mode) {
      const that = this
      this.mode = mode
      that.$http.get('/api/1/workflow/get_activity_act_ins_list.json?caseId=' + xwfState.caseId + '&procInsId=' + xwfState.procInsId).then(function (resp) {
        if (that.mode === 2) {
          that.actInsData = resp.result
        } else {
          that.actInsData = resp.result.filter(function (item) {
            return item.id === xwfState.actInsId
          })
        }
        if (that.actInsData.length > 0) {
          that.selectedActInsId = that.actInsData[0].id
        }
      })
    },
    onSelectUser (selectedIds, selectedNames) {
      this.transferUserId = selectedIds
    },
    onTransfer () {
      if (!this.selectedActInsId) {
        this.$message.warning('请选择需要进行转办的流程实例')
        return
      }
      if (!this.transferUserId) {
        this.$message.warning('请选择转办至人员')
        return
      }
      const that = this
      this.$confirm({
        title: '是否确认转办？',
        content: '请优先考虑下一步处理，转办是用于处理正常流程不能处理的办件',
        onOk () {
          let data = {}
          data.userId = that.transferUserId
          data.actInsId = that.selectedActInsId
          that.$http.post('/api/1/workflow/transfer_action.json', qs.stringify(data)).then(function (resp) {
            WorkflowEvent.$emit('PostXwfTransfer')
          })
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
