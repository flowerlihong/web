<template>
    <page-view title="工作日志">
        <template slot="action">
            <div id="add" class="table-operator">
                <a-button type="primary" icon="plus" @click="onAddWorkLog">增加工作日志</a-button>
            </div>
        </template>
        <a-card>
            <a-form :form="form">
                <table class="fx-form">
                    <tr>
                        <th>标题</th>
                        <td>
                            <a-form-item>
                                <a-input style="width: 300px" placeholder="标题" v-decorator="['title']"></a-input>
                            </a-form-item>
                        </td>
                        <th>日期</th>
                        <td>
                            <a-form-item>
                                <a-date-picker class="date"
                                               showTime
                                               format="YYYY-MM-DD HH:mm:ss"
                                               v-decorator="['startAt']"/>
                                至
                                <a-date-picker class="date"
                                               showTime
                                               format="YYYY-MM-DD HH:mm:ss"
                                               v-decorator="['endAt']"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" align="center">
                            <a-button type="primary" @click="onSearch" :loading="loading">查询</a-button>
                            <a-button @click="reset">重置</a-button>
                        </td>
                    </tr>
                </table>
            </a-form>
            <s-table
                    ref="table"
                    :columns="columns"
                    :data="loadData"
                    :rowKey="record => record.id">
                <template slot="title" slot-scope="record">
                    <a @click="onView(record)">{{record.title}}</a>
                </template>
                <template slot="startAt" slot-scope="record">
                    {{record.extras.startAt}}
                </template>
                <template slot="endAt" slot-scope="record">
                    {{record.extras.endAt}}
                </template>
                <template slot="operation" slot-scope="record">

                    <a-button type="primary" size="small" @click="onEditWorkLog(record.id)">修改</a-button>&nbsp;

                    <a-popconfirm title="是否确认删除?" @confirm="deleteWorkLog(record.id)">
                        <a-button type="danger" size="small">删除</a-button>
                    </a-popconfirm>
                </template>
            </s-table>
            <!-- 增加工作日志 -->
            <work-log-add ref="workLogAdd" :visible="modalVisible.workLogAdd" @success="onAddWorkLogSuccess"
                          @cancel="onAddWorkLogCancel"/>

            <!--编辑工作日志-->
            <work-log-edit ref="workLogEdit" :visible="modalVisible.workLogEdit" @success="onEditWorkLogSuccess"
                           @cancel="onEditWorkLogCancel"/>

        </a-card>
    </page-view>
</template>

<script>
import STable from '@/components/Table/'
import qs from 'qs'
import WorkLogAdd from './WorkLogAdd'
import WorkLogEdit from './WorkLogEdit'
import moment from 'moment'
import { PageView } from '@/layouts'

export default {
  name: 'WorkLogIndex',
  components: {
    STable,
    WorkLogAdd,
    WorkLogEdit,
    PageView
  },
  data () {
    return {
      columns: [
        {
          title: '标题',
          align: 'center',
          width: '35%',
          scopedSlots: { customRender: 'title' }
        },
        {
          title: '开始时间',
          align: 'center',
          width: '15%',
          scopedSlots: { customRender: 'startAt' }
        },
        {
          title: '结束时间',
          align: 'center',
          width: '15%',
          scopedSlots: { customRender: 'endAt' }
        },
        {
          title: '操作',
          align: 'center',
          width: '15%',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      workLog: {
        createdAt: ''
      },
      form: this.$form.createForm(this),
      loading: false,
      queryParam: {},
      loadData: parameter => {
        return this.$http.get('/api/1/work_log/query_work_log_list.json', {
          params: Object.assign(parameter, this.queryParam),
          paramsSerializer: function (params) {
            return qs.stringify(params, { indices: false })
          }
        }).then(res => {
          return res
        })
      },
      // 对话框是否显示
      modalVisible: {
        workLogAdd: false,
        workLogEdit: false
      }
    }
  },
  methods: {
    moment,
    reset () {
      this.form.resetFields()
    },
    // 查询
    onSearch () {
      const that = this
      let params = { ...that.form.getFieldsValue() }
      if (params.startAt != null) {
        let startAt = params.startAt.format('YYYY-MM-DD HH:mm:ss')
        this.queryParam.startAt = startAt
      }
      if (params.endAt != null) {
        let endAt = params.endAt.format('YYYY-MM-DD HH:mm:ss')
        this.queryParam.endAt = endAt
      }
      if (params.title !== '') {
        this.queryParam.title = params.title
      }
      this.$refs.table.refresh(true)
      this.queryParam = {}
    },
    // 增加窗口
    onAddWorkLog () {
      this.modalVisible.workLogAdd = true
    },
    onAddWorkLogSuccess () {
      this.modalVisible.workLogAdd = false
      this.$refs.table.refresh(true)
    },
    onAddWorkLogCancel () {
      this.modalVisible.workLogAdd = false
    },
    // 编辑窗口
    onEditWorkLog (record) {
      this.modalVisible.workLogEdit = true
      this.$refs.workLogEdit.workLogEdit(record)
    },
    onEditWorkLogSuccess () {
      this.modalVisible.workLogEdit = false
      this.$refs.table.refresh(true)
    },
    onEditWorkLogCancel () {
      this.modalVisible.workLogEdit = false
    },
    // 删除
    deleteWorkLog (id) {
      let that = this
      this.$http.post('/api/1/work_log/delete_work_log.json?id=' + id).then(function (response) {
        if (response.code !== 200) {
          return
        }
        that.$message.success('删除工作日志成功')
        that.$refs.table.refresh()
      })
    },
    onView (record) {
      this.$router.push({ path: '/worklog/view?id=' + record.id })
    },
  }
}
</script>

<style lang="less" scoped>
    .card {
        margin-bottom: 24px;
    }

    .fx-form th {
        width: 50px;
    }
</style>
