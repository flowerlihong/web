<template>
    <page-view title="附件上传">
    <!-- action -->
    <template slot="action">
        <a-button type="primary" icon="plus-circle" @click="onAdd">新建配置</a-button>
    </template>
    <a-card :bordered="false">
        <!-- / table-operator -->
        <s-table ref="table"
                 :columns="columns"
                 :rowKey="record => record.id"
                 :data="loadData"
                 size="middle">
            <a slot="name" slot-scope="text, record" @click="onEdit(record)">{{text}}</a>
            <span slot="action" slot-scope="text, record">
                <a @click="onEdit(record)">编辑</a>
                <a-divider type="vertical"/>
                <a-popconfirm title="是否确认删除?" @confirm="onDelete(record)">
                    <a href="#">删除</a>
                </a-popconfirm>
            </span>
        </s-table>
        <!-- / a-table -->

        <AttachmentEdit ref="attEdit" :visible="modalVisible" @cancel="modalVisible = false" @success="postAddOrUpdate"/>

    </a-card>
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import STable from '@/components/Table'
import qs from 'qs'
import AttachmentEdit from './AttachmentEdit'

const columns = [
  {
    title: '模块名称',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' }
  }, {
    title: '附件标识Key',
    dataIndex: 'keyword'
  }, {
    title: '允许类型',
    dataIndex: 'extensionDesc'
  }, {
    title: '大小',
    dataIndex: 'maxSizeDesc'
  }, {
    title: '操作',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'AttachmentList',
  components: {
    PageView,
    STable,
    AttachmentEdit
  },
  mounted () {
  },
  data () {
    return {
      columns,
      queryParams: {},
      loadData: parameter => {
        return this.$http.get('/api/1/attachment/configs.json', { params: Object.assign(parameter, this.queryParams),
          paramsSerializer: function (params) {
            return qs.stringify(params, { indices: false })
          }
        }).then(res => {
          return res
        })
      },
      modalVisible: false
    }
  },
  methods: {
    onAdd () {
      this.modalVisible = true
      this.$refs.attEdit.preAdd()
    },
    onEdit (record) {
      this.modalVisible = true
      this.$refs.attEdit.preEdit(record.id)
    },
    postAddOrUpdate (mode) {
      let msg = null
      if (mode === 'add') {
        msg = '添加附件配置成功'
      } else {
        msg = '编辑附件配置成功'
      }
      this.modalVisible = false
      this.$message.success(msg)
      this.$refs.table.refresh()
    },
    onDelete (record) {
      let that = this
      this.$http.get('/api/1/attachment/config-delete.json?id=' + record.id).then(function () {
        that.$message.success('删除附件配置成功')
        that.$refs.table.refresh()
      })
    }
  }
}
</script>
