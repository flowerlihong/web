<!--
 Created by Xuz on 2019/01/22.
 xuz[at]live.cn
 办件流程历史
-->
<template>
    <a-modal title="流程跟踪"
             class="wf-history"
             destroyOnClose
             :width="1024"
             :footer="null"
             :visible="visible"
             @cancel="$emit('cancel')">
        <div style="text-align:right;margin-bottom:10px;">
            <div style="float:left;line-height:32px;margin:auto;font-size:14px;"><span style="font-weight:bold;">{{process.name}}</span> <span style="font-size:12px">（v{{process.version}}）</span></div>
            <a-input-search placeholder="" style="width: 200px" @search="onSearch"/>
        </div>
        <a-table :rowKey="record => record.act_ins_id" :loading="loading" :columns="columns" :dataSource="items" :pagination="false">
            <template slot="index" slot-scope="text, record, index">
                {{index + 1}}
            </template>
            <template slot="createDateAgo" slot-scope="record">
                <div :title="record.create_date">{{record.create_date_ago}}</div>
            </template>
            <template slot="signDateAgo" slot-scope="record">
                <div :title="record.sign_date">{{record.sign_date_ago}}</div>
            </template>
            <template slot="endDateAgo" slot-scope="record">
                <div :title="record.end_date">{{record.end_date_ago}}</div>
            </template>
        </a-table>
    </a-modal>
</template>

<script>
export default {
  name: 'WorkflowHistory',
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
      loading: false,
      procInsId: null,
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'index' },
          width: '70px'
        },
        {
          title: '启动时间',
          scopedSlots: { customRender: 'createDateAgo' }
        },
        {
          title: '在办人',
          dataIndex: 'handler'
        },
        {
          title: '签收时间',
          scopedSlots: { customRender: 'signDateAgo' }
        },
        {
          title: '完成时间',
          scopedSlots: { customRender: 'endDateAgo' }
        },
        {
          title: '任务',
          dataIndex: 'act_name'
        },
        {
          title: '备注',
          dataIndex: 'description'
        }
      ],
      process: { },
      items: []
    }
  },
  methods: {
    onLoadData (procInsId) {
      this.procInsId = procInsId
      this.getData(procInsId, '')
    },
    onSearch (value) {
      this.getData(this.procInsId, value)
    },
    getData (procInsId, query) {
      const that = this
      that.loading = true
      that.$http.get('/api/1/workflow/history.json?procInsId=' + procInsId + '&query=' + query).then(function (resp) {
        that.loading = false
        if (resp.code === 200) {
          that.process = resp.result.process
          that.items = resp.result.history
        }
      })
    }
  }
}
</script>

<style>
    .wf-history .ant-modal-body {
        padding-top: 10px !important;
    }
</style>
