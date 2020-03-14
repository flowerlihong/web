<template>
    <page-view title="工作计划">
        <a-card>
            <div class="table-operator">
                <a-button type="primary" icon="plus" @click="onAddPlan">添加工作计划</a-button>
            </div>
            <a-form :form="queryTripForm">
                <table style="width:100%">
                    <tr>
                        <th>创建日期</th>
                        <td>
                            <a-form-item>
                                <a-date-picker v-model="queryForm.startTime" />
                                至 <a-date-picker v-model="queryForm.endTime" />
                            </a-form-item>
                        </td>
                        <th>计划类型</th>
                        <td>
                            <a-form-item>
                                <a-select style="width: 100px" v-model="queryForm.types">
                                    <a-select-option value="">不限</a-select-option>
                                    <a-select-option value="1">日计划</a-select-option>
                                    <a-select-option value="2">周计划</a-select-option>
                                    <a-select-option value="3">月计划</a-select-option>
                                    <a-select-option value="4">年计划</a-select-option>
                                </a-select>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>级别</th>
                        <td>
                            <a-form-item>
                                <a-select style="width: 100px" v-model="queryForm.levels">
                                    <a-select-option value="">不限</a-select-option>
                                    <a-select-option value="1">一般</a-select-option>
                                    <a-select-option value="2">高级</a-select-option>
                                </a-select>
                            </a-form-item>
                        </td>
                    </tr>
                </table>
            </a-form>
            <a-button  type="primary" @click="onSearch">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            <s-table
                    ref="table"
                    :columns="columns"
                    :data="loadData"
                    :rowKey="record => record.id">
                <template slot="userid" slot-scope=" record">
                    {{record.extras.userName}}
                </template>
                <template slot="title" slot-scope=" record">
                    {{record.title}}
                </template>
                <template slot="types" slot-scope=" record">
                    <a-tag v-if="record.types === '1'" >日计划</a-tag>
                    <a-tag v-else-if="record.types === '2'" >周计划</a-tag>
                    <a-tag v-else-if="record.types === '3'" >月计划</a-tag>
                    <a-tag v-else >年计划</a-tag>
                </template>
                <template slot="levels" slot-scope=" record">
                    <a-tag v-if="record.levels === '1'" >一般</a-tag>
                    <a-tag v-else >高级</a-tag>
                </template>
                <template slot="createdTime" slot-scope=" record">
                    {{record.extras.planStartAt}}<div v-if="record.extras.planEndAt">-{{record.extras.planEndAt}}</div>
                </template>
                <template slot="operation" slot-scope=" record">
                    <a-button type="primary" @click="onEditPlan(record)">修改</a-button>
                    <a-button type="danger" @click="deletePlan(record)">删除</a-button>
                </template>
            </s-table>
            <!-- 添加 -->
            <plan-add ref="planAdd" :visible="modalVisible.addPlan" @success="onAddPlanSuccess" @cancel="onAddPlanCancel" />
            <!-- / 添加 -->
        </a-card>
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import STable from '@/components/Table'
import planAdd from './WorkPlanAdd'
import qs from 'qs'
export default {
  name: 'WorkPlanIndex',
  components: {
    PageView,
    STable,
    planAdd
  },
  data () {
    return {
      columns: [
        {
          title: '用户',
          scopedSlots: { customRender: 'userid' }
        },
        {
          title: '标题',
          scopedSlots: { customRender: 'title' }
        },
        {
          title: '内容',
          scopedSlots: { customRender: 'content' }
        },
        {
          title: '类型',
          scopedSlots: { customRender: 'types' }
        },
        {
          title: '级别',
          scopedSlots: { customRender: 'levels' }
        },
        {
          title: '时间',
          scopedSlots: { customRender: 'createdTime' }
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      loading: false,
      modalVisible: {
        addPlan: false
      },
      queryTripForm: this.$form.createForm(this),
      queryForm: {
        types: '',
        levels: '',
        startTime: null,
        endTime: null
      },
      queryParam: {
      },
      loadData: parameter => {
        return this.$http.get('/api/1/workPlan/query.json', { params: Object.assign(parameter, this.queryParam),
          paramsSerializer: function (params) {
            return qs.stringify(params, { indices: false })
          }
        }).then(res => {
          return res
        })
      }
    }
  },
  methods: {
    reset () {
      this.queryParam = {}
      this.queryForm = {}
    },
    onSearch () {
      if (this.queryForm.startTime != null) {
        let start = this.queryForm.startTime.format('YYYY-MM-DD')
        this.queryParam.startTime = start
      } else {
        this.queryParam.startTime = ''
      }
      if (this.queryForm.endTime != null) {
        let end = this.queryForm.endTime.format('YYYY-MM-DD')
        this.queryParam.endTime = end
      } else {
        this.queryParam.endTime = ''
      }
      let content = this.queryForm.content
      this.queryParam.content = content
      let types = this.queryForm.types
      this.queryParam.types = types
      let levels = this.queryForm.levels
      this.queryParam.levels = levels
      this.$refs.table.refresh()
    },
    deletePlan (record) {
      let that = this
      this.$http.post('/api/1/workPlan/delete?id=' + record.id).then(function () {
        that.$message.success('删除成功')
        that.$refs.table.refresh()
      })
    },
    onAddPlan () {
      this.modalVisible.addPlan = true
      this.$refs.planAdd.planAdd()
    },
    onAddPlanSuccess () {
      this.modalVisible.addPlan = false
      this.$refs.table.refresh()
    },
    onAddPlanCancel () {
      this.modalVisible.addPlan = false
    }
  }
}
</script>

<style scoped>
    .card {
        margin-bottom: 24px;
    }

    th {
        width: 110px !important;
    }

    table .ant-form-item {
        margin-bottom: 0;
    }
</style>
