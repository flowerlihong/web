<!--
 Created by Xuz on 2019/06/24.
 xuz[at]live.cn
 流程传阅
-->
<template>
    <a-modal title="流程传阅"
             :width="960"
             :visible="visible"
             destroyOnClose
             @ok="onSubmit"
             @cancel="$emit('cancel')">
        <a-table :columns="commentColumn" :dataSource="commentNameList" :rowKey="record => record.comment_id" bordered :pagination="false">
            <template slot="name" slot-scope="record">
                {{record.comment_name}}
            </template>
            <div slot="user" slot-scope="record">
                <user-selector multiple :tag="record.comment_id" @change="onSelectUser"/>
            </div>
        </a-table>
    </a-modal>
</template>

<script>
import qs from 'qs'
import UserSelector from '@/components/selector/UserSelector'
import { WorkflowEvent } from './WorkflowEvent'

export default {
  name: 'WorkflowChuanYue',
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
      commentColumn: [
        {
          title: '呈批表意见栏',
          scopedSlots: { customRender: 'name' },
          width: '180px'
        },
        {
          title: '填写意见的人员',
          scopedSlots: { customRender: 'user' }
        }
      ],
      xwfState: null,
      commentNameList: [],
      selectedData: []
    }
  },
  methods: {
    preChuanYue (xwfState) {
      const that = this
      that.xwfState = xwfState
      that.$http.get('/api/1/workflow/get_process_comment_name_list.json?procInsId=' + xwfState.procInsId).then(function (resp) {
        that.commentNameList = resp.result
      })
    },
    onSelectUser (selectedIds, selectedNames, selectedData, commentId) {
      this.selectedData[commentId] = selectedIds
    },
    onSubmit () {
      const that = this
      let result = []
      for (let key in this.selectedData) {
        result.push(key + '@' + this.selectedData[key])
      }
      result = result.join(';')
      if (!result) {
        this.$message.warning('请选择待传阅人员')
        return
      }
      let data = {}
      data.actInsId = that.xwfState.actInsId
      data.userIds = result
      that.$http.post('/api/1/workflow/chuanyue_action.json', qs.stringify(data)).then(function (resp) {
        that.$success({ title: '传阅完成', onOk: () => WorkflowEvent.$emit('PostXwfChuanYue') })
      })
    }
  }
}
</script>

<style scoped>
</style>
