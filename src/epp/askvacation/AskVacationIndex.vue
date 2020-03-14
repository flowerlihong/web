<template>
    <page-view title="假期查询">
        <a-card>
            <a-form>
                <table class="fx-form">
                    <tr v-show="permission">
                        <th>查询类别</th>
                        <td>
                            <a-form-item>
                                <a-select style="width: 170px" v-model="queryForm.range">
                                    <a-select-option value="">不限</a-select-option>
                                    <a-select-option value="1">部门经办</a-select-option>
                                    <a-select-option value="2">请假人</a-select-option>
                                </a-select>
                            </a-form-item>
                        </td>
                        <th v-show="queryForm.range === '2'">请假人</th>
                        <th v-show="queryForm.range === '1'">部门</th>
                        <td>
                            <a-form-item>
                                <div v-show="queryForm.range === '2'">
                                    <user-selector @change="onChangeUser"/>
                                </div>
                                <div v-show="queryForm.range === '1'">
                                    <dept-selector multiple @change="onDeptChange"/>
                                </div>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>假期分类</th>
                        <td>
                            <a-form-item>
                                <a-select style="width: 170px" v-model="queryForm.category">
                                    <a-select-option value="">不限</a-select-option>
                                    <a-select-option value="1">请假</a-select-option>
                                    <a-select-option value="2">休假</a-select-option>
                                </a-select>
                            </a-form-item>
                        </td>
                        <th>假期状态</th>
                        <td>
                            <a-form-item>
                                <a-select style="width: 170px" v-model="queryForm.flag">
                                    <a-select-option value="">不限</a-select-option>
                                    <a-select-option value="A">申请中</a-select-option>
                                    <a-select-option value="Q">申请通过</a-select-option>
                                    <a-select-option value="Y">休假中</a-select-option>
                                    <a-select-option value="D">已办结</a-select-option>
                                    <!--<a-select-option value="T">销假中</a-select-option>-->
                                    <!--<a-select-option value="X">已销假</a-select-option>-->
                                    <a-select-option value="N">废弃</a-select-option>
                                </a-select>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>假期类型</th>
                        <td>
                            <a-form-item>
                                <a-select style="width: 170px" v-model="configTypeId" @change="handleChange">
                                    <a-select-option v-for="t in vacationTypeData" :key = 't.id'>{{t.names}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </td>
                        <th>假期名称</th>
                        <td>
                            <a-form-item>
                                <a-select style="width: 170px" v-model="configId" @change="handleChange1">
                                    <a-select-option v-for="t in vacationConfig" :key = 't.id'>{{t.names}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>假期开始日期</th>
                        <td>
                            <a-form-item>
                                <a-date-picker v-model="queryForm.startAtSt" />
                                至 <a-date-picker v-model="queryForm.startAtEnd" />
                            </a-form-item>
                        </td>
                        <th>假期结束日期</th>
                        <td>
                            <a-form-item>
                                <a-date-picker v-model="queryForm.endAtSt" />
                                至 <a-date-picker v-model="queryForm.endAtEnd" />
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" align="center">
                            <a-button type="primary" @click="onSearch">查询</a-button>
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
                <template slot="userName" slot-scope="record">
                    <a @click="onAlertView(record.userId,queryParam)">{{record.extras.userName}}</a>
                </template>
                <template slot="askVacation" slot-scope="record">
                    {{record.extras.askVacationDays}}
                </template>
                <template slot="vacation" slot-scope="record">
                    {{record.extras.restDays}}
                </template>
                <template slot="apply" slot-scope="record">
                    {{record.extras.applyingDays}}
                </template>
                <template slot="onVacation" slot-scope="record">
                    {{record.extras.inRestDays}}
                </template>
                <template slot="reportVacation" slot-scope="record">
                    {{record.extras.reportingBackDays}}
                </template>
                <template slot="reportedVacation" slot-scope="record">
                    {{record.extras.reportedBackDays}}
                </template>
            </s-table>
        </a-card>
        <vacation-view ref="vacationView" :visible="modalVisible.vacationView" @success="onOk" @cancel="onClose" />
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import STable from '@/components/Table'
import qs from 'qs'
import UserSelector from '@/components/selector/UserSelector'
import vacationView from './AskVacationAlertView'
import DeptSelector from '@/components/selector/DeptSelector'
export default {
  name: 'AskVacationIndex',
  components: {
    PageView,
    STable,
    UserSelector,
    vacationView,
    DeptSelector
  },
  created () {
    this.findConfigType()
    this.hasPermission()
  },
  data () {
    return {
      columns: [
        {
          title: '请假人',
          scopedSlots: { customRender: 'userName' }
        },
        {
          title: '请假（天）',
          scopedSlots: { customRender: 'askVacation' }
        },
        {
          title: '休假（天）',
          scopedSlots: { customRender: 'vacation' }
        },
        {
          title: '申请中（天）',
          scopedSlots: { customRender: 'apply' }
        },
        {
          title: '休假中（天）',
          scopedSlots: { customRender: 'onVacation' }
        }
        // {
        //   title: '销假中（天）',
        //   scopedSlots: { customRender: 'reportVacation' }
        // },
        // {
        //   title: '已销假（天）',
        //   scopedSlots: { customRender: 'reportedVacation' }
        // }
      ],
      configTypeId: '',
      configId: '',
      vacationTypeData: [],
      vacationConfig: [],
      permission: false,
      modalVisible: {
        vacationView: false
      },
      queryTripForm: this.$form.createForm(this),
      queryForm: {
        types: null,
        userName: null,
        category: null,
        state: '',
        flag: '',
        type: '',
        confgtype: '',
        configid: '',
        startAtSt: null,
        startAtEnd: null,
        endAtSt: null,
        endAtEnd: null,
        deptIds: '',
        scene: 1
      },
      queryParam: {
        scene: 1
      },
      loadData: parameter => {
        this.queryParam.userId = ''
        this.queryParam.scene = 1
        return this.$http.get('/api/1/vacation_report/query_vacation_report_list.json', { params: Object.assign(parameter, this.queryParam),
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
      this.configTypeId = ''
      this.configId = ''
      this.onSearch()
    },
    handleChange (value) {
      this.configTypeId = value
      this.queryForm.confgtype = value
      this.queryForm.configid = ''
      this.getVacationConfigList(value)
    },
    handleChange1 (value) {
      this.configId = value
      this.queryForm.configid = value
    },
    getVacationConfigList (id) {
      const that = this
      that.$http.get('/api/1/vacation_config/get_config_list.json?confgType=' + id).then(function (resp) {
        that.vacationConfig = resp.result
      })
    },
    findConfigType () {
      const that = this
      that.$http.get('/api/1/vacation_config_type/get_config_type_list.json').then(function (resp) {
        that.vacationTypeData = resp.result
      })
    },
    hasPermission () {
      const that = this
      that.$http.get('/api/1/vacation_report/get_permission.json').then(function (resp) {
        that.permission = resp.hasPermission
      })
    },
    onChangeUser (selectedIds) {
      this.queryForm.userId = selectedIds
    },
    onDeptChange (selectedIds) {
      this.queryForm.deptIds = selectedIds
    },
    onCascaderChange: function (values) {
      this.queryForm.state = values
    },
    onCascaderChangeTypes (values) {
      this.queryForm.types = values
    },
    onSearch () {
      this.queryParam = { ...this.queryForm }
      if (this.queryParam.startAtSt) {
        this.queryParam.startAtSt = this.queryParam.startAtSt.format('YYYY-MM-DD')
      }
      if (this.queryParam.startAtEnd) {
        this.queryParam.startAtEnd = this.queryParam.startAtEnd.format('YYYY-MM-DD') + ' 23:59:59'
      }
      if (this.queryParam.endAtSt) {
        this.queryParam.endAtSt = this.queryParam.endAtSt.format('YYYY-MM-DD')
      }
      if (this.queryParam.endAtEnd) {
        this.queryParam.endAtEnd = this.queryParam.endAtEnd.format('YYYY-MM-DD') + ' 23:59:59'
      }
      this.$refs.table.refresh()
    },
    onOk () {
      this.modalVisible.vacationView = false
    },
    onClose () {
      this.modalVisible.vacationView = false
    },
    onAlertView (userId, param) {
      this.modalVisible.vacationView = true
      this.$refs.vacationView.preView(userId, param)
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
