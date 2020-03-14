<template>
    <page-view title="定时任务">
    <!-- action -->
    <template slot="action">
        <a-button-group>
            <a-button type="primary" icon="plus-circle" @click="onAdd">添加任务</a-button>
        </a-button-group>
    </template>
    <a-card :bordered="false">
        <!-- / table-operator -->
        <s-table ref="table"
                 :columns="columns"
                 :rowKey="record => record.id"
                 :data="loadData"
                 size="middle">
            <a slot="name" slot-scope="text, record" @click="onEdit(record)">{{text}}</a>
            <span slot="runResult" slot-scope="text">
                <a-tag v-if="text === 'S'" color="#00a65a">成功</a-tag>
                <a-tag v-else color="red">失败</a-tag>
            </span>
            <span slot="state" slot-scope="text">
                <a-tag v-if="text === 'E'" color="blue">启用</a-tag>
                <a-tag v-else color="red">停用</a-tag>
            </span>
            <span slot="action" slot-scope="text, record">
                <a-button type="primary" size="small" :disabled="record.state !== 'E'" @click="onExecute(record)">执行</a-button>
                &nbsp;
                <a-popconfirm title="是否确认删除?" @confirm="onDelete(record)">
                    <a-button type="danger" size="small">删除</a-button>
                </a-popconfirm>
            </span>
        </s-table>
        <!-- / a-table -->
        <!-- -->
        <ScheduleAddComponent :visible="visibleAdd" @cancel='visibleAdd = false' @success="onAddSuccess"/>
        <ScheduleEditComponent ref="editModal" :visible="visibleEdit" @cancel='visibleEdit = false' @success="onEditSuccess"/>
        <!-- -->
    </a-card>
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import STable from '@/components/Table'
import qs from 'qs'
import ScheduleAddComponent from './ScheduleAdd.vue'
import ScheduleEditComponent from './ScheduleEdit.vue'

const columns = [
  {
    title: '任务名称',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' }
  }, {
    title: '最后运行时间',
    dataIndex: 'lastRunTime'
  }, {
    title: '最后运行结果',
    dataIndex: 'lastRunResult',
    className: 'text-center',
    scopedSlots: { customRender: 'runResult' }
  }, {
    title: '下次运行时间',
    dataIndex: 'nextFireTime'
  }, {
    title: '状态',
    dataIndex: 'state',
    className: 'text-center',
    scopedSlots: { customRender: 'state' }
  }, {
    title: '操作',
    width: '150px',
    className: 'text-center',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'ScheduleList',
  components: {
    PageView,
    STable,
    ScheduleAddComponent,
    ScheduleEditComponent
  },
  mounted () {
  },
  data () {
    return {
      columns,
      queryParams: {},
      loadData: parameter => {
        return this.$http.get('/api/1/schedule/schedules.json', { params: Object.assign(parameter, this.queryParams),
          paramsSerializer: function (params) {
            return qs.stringify(params, { indices: false })
          }
        }).then(res => {
          return res
        })
      },
      visibleAdd: false,
      visibleEdit: false
    }
  },
  methods: {
    onAdd () {
      this.visibleAdd = true
    },
    onAddSuccess () {
      this.visibleAdd = false
      this.$refs.table.refresh()
    },
    onEdit (record) {
      this.visibleEdit = true
      this.$refs.editModal.preEdit(record.id)
    },
    onEditSuccess () {
      this.visibleEdit = false
      this.$refs.table.refresh()
    },
    onExecute (record) {
      let that = this
      this.$http.get('/api/1/schedule/execute.json?id=' + record.id).then(function () {
        that.$message.success('执行成功')
        that.$refs.table.refresh()
      })
    },
    onDelete (record) {
      let that = this
      this.$http.get('/api/1/schedule/delete.json?id=' + record.id).then(function () {
        that.$message.success('删除成功')
        that.$refs.table.refresh()
      })
    }
  }
}
</script>
<style>
    th.text-center,
    td.text-center {
        text-align: center !important;
    }
</style>
