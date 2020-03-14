<template>
    <page-view title="数据字典">
    <!-- action -->
    <template slot="action">
        <a-button type="primary" icon="plus-circle" @click="onAdd">添加字典</a-button>
        &nbsp;
        <a-button type="primary" icon="sync" @click="onRefresh" :loading="refreshing">刷新字典</a-button>
    </template>
    <a-card :bordered="false">
        <s-table ref="table"
                 :columns="columns"
                 :rowKey="record => record.id"
                 :data="loadData"
                 size="middle">
            <a slot="name" slot-scope="text, record" @click="onView(record)">{{text}}</a>
            <span slot="action" slot-scope="text, record">
                <a @click="onEdit(record)">编辑</a>
                <a-divider type="vertical"/>
                <a-popconfirm title="是否确认删除?" @confirm="onDelete(record)">
                    <a href="#">删除</a>
                </a-popconfirm>
            </span>
        </s-table>
        <!-- / a-table -->
        <DictEdit ref="dictEdit" :visible="modalVisible" @cancel="modalVisible = false" @success="onDictSave" />
    </a-card>
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import STable from '@/components/Table'
import qs from 'qs'
import DictEdit from './DictEdit'

const columns = [
  {
    title: '字典名称',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' }
  }, {
    title: '字典标识',
    dataIndex: 'keyword'
  }, {
    title: '备注',
    dataIndex: 'remark'
  }, {
    title: '操作',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'DictList',
  components: {
    PageView,
    STable,
    DictEdit
  },
  mounted () {
  },
  data () {
    return {
      columns,
      queryParams: {},
      loadData: parameter => {
        return this.$http.get('/api/1/dict/list.json', { params: Object.assign(parameter, this.queryParams),
          paramsSerializer: function (params) {
            return qs.stringify(params, { indices: false })
          }
        }).then(res => {
          return res
        })
      },
      refreshing: false,
      modalVisible: false
    }
  },
  methods: {
    onAdd () {
      this.modalVisible = true
      this.$refs.dictEdit.preAdd()
    },
    onRefresh () {
      let that = this
      this.refreshing = true
      this.$http.get('/api/1/dict/refresh.json').then(function (response) {
        that.refreshing = false
        that.$message.success('刷新字典成功')
      })
    },
    onView (record) {
      this.$router.push({ path: '/dict/panel?id=' + record.id })
    },
    onEdit (record) {
      this.modalVisible = true
      this.$refs.dictEdit.preEdit(record.id)
    },
    onDelete (record) {
      let that = this
      this.$http.get('/api/1/dict/delete.json?id=' + record.id).then(function () {
        that.$message.success('删除字典成功')
        that.$refs.table.refresh()
      })
    },
    onDictSave (mode) {
      let msg = ''
      if (mode === 'add') {
        msg = '添加字典成功'
      } else {
        msg = '编辑字典成功'
      }
      this.modalVisible = false
      this.$message.success(msg)
      this.$refs.table.refresh()
    }
  }
}
</script>

<style scoped>

</style>
