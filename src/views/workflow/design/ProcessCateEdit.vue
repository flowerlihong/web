<!--
 Created by Xuz on 2019/03/13.
 xuz[at]live[dot]cn
 流程关联文档类别
-->
<template>
    <a-modal title="流程关联文档类别"
             :width="800"
             :visible="visible"
             :maskClosable="false"
             :destroyOnClose="true"
             @ok="onSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading">
        <div :style="{ height: treeHeight + 'px' }" style="overflow-y:auto;overflow-x:hidden;">
        <a-checkbox-group :value="selectedIds" @change="onCheckCate">
        <a-table :columns="columns" :dataSource="modalData" :rowKey="record => record.id" :pagination="false" bordered>
            <template slot="cateRoot" slot-scope="record">{{record.name}}</template>
            <template slot="cateList" slot-scope="record">
                <a-row>
                    <a-col :span="8" v-for="cate in record.extras.cateList" :key="cate.id">
                        <a-checkbox :value="cate.id">{{cate.name}}</a-checkbox>
                    </a-col>
                </a-row>
            </template>
        </a-table>
        </a-checkbox-group>
        </div>
    </a-modal>
</template>

<script>
import qs from 'qs'

export default {
  name: 'ProcessCateEdit',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    this.onResizeWindow()
  },
  data () {
    return {
      treeHeight: 600,
      modalLoading: false,
      procId: null,
      modalData: [],
      selectedIds: [],
      columns: [
        {
          title: '目录名称',
          key: 'name',
          scopedSlots: { customRender: 'cateRoot' },
          width: '180px'
        },
        {
          title: '类别列表',
          key: 'cate',
          scopedSlots: { customRender: 'cateList' }
        }
      ]
    }
  },
  methods: {
    onResizeWindow () {
      this.treeHeight = window.innerHeight - 360
    },
    preProcessCateEdit (id) {
      const that = this
      that.procId = id
      that.modalLoading = true
      that.$http.get('/api/1/workflow/cate/get_doc_root_summary.json').then(function (resp) {
        that.modalData = resp.result
        that.$http.get('/api/1/workflow/design/get_process_cate_list.json?procId=' + id).then(function (resp) {
          that.modalLoading = false
          that.selectedIds = resp.result.map(item => {
            return item.id
          })

          console.log(that.selectedIds)
        })
      })
    },
    onCheckCate (checkedValue) {
      this.selectedIds = checkedValue
    },
    onSubmit () {
      const that = this
      that.modalLoading = true
      that.$http.post('/api/1/workflow/design/edit_process_cate.json', qs.stringify({ procId: that.procId, cateIds: this.selectedIds.join(',') })).then(function () {
        that.$message.success('操作成功')
        that.modalLoading = false
        that.$emit('success')
      })
    }
  }
}
</script>

<style scoped>
    .ant-checkbox-group {
        display: block;
    }
</style>
