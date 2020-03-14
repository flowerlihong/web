<template>
    <page-view>
        <a-card title="我的记录" class="card">
            <s-table
                    ref="table"
                    :columns="columns"
                    :data="loadData"
                    :rowKey="record => record.id">
                <template slot="types" slot-scope=" record">
                    <a @click="onView(record)">{{record.extras.configTypeName.substring(0,10)}}</a>
                </template>
                <template slot="vacationName" slot-scope=" record">
                    {{record.extras.configName.substring(0,20)}}
                </template>
                <template slot="intentDays" slot-scope=" record">
                    {{record.extras.vacationDays}}
                </template>
                <template slot="createdTime" slot-scope=" record">
                    {{record.extras.createdAt}}
                </template>
                <template slot="startTime" slot-scope=" record">
                    {{record.items[0].extras.reportStart}}
                </template>
                <template slot="reason" slot-scope=" record">
                    {{record.content.substring(0,20)}}
                </template>
                <template slot="state" slot-scope=" record">
                    <a-tag v-if="record.flag === 'N'" color="red">废弃</a-tag>
                    <a-tag v-else-if="record.flag === 'Q'" color="blue">申请通过</a-tag>
                    <a-tag v-else-if="record.flag === 'Y'" color="green">休假中</a-tag>
                    <a-tag v-else-if="record.flag === 'T'" color="blue">销假中</a-tag>
                    <a-tag v-else-if="record.flag === 'X'" color="green">已销假</a-tag>
                    <a-tag v-else-if="record.flag === 'D'" color="green">已办结</a-tag>
                    <a-tag v-else color="blue">申请中</a-tag>
                </template>
            </s-table>
        </a-card>
        <a-card title="所有在休假人员" v-show="permission" style="margin-bottom:60px">
            <!--<a-button @click="onSearch1">所有在休假人员</a-button>&nbsp; <a-button>在休假部门领导</a-button>&nbsp; <a-button>在休假机构领导</a-button>-->
            <s-table
                    ref="table1"
                    :columns="tabColumns"
                    :data="loadData1"
                    :rowKey="record => record.id">
                <template slot="name" slot-scope=" record">
                    <a @click="onDetailView(record)">{{record.extras.userName}}</a>
                </template>
                <template slot="types" slot-scope=" record">
                    {{record.extras.configTypeName}}
                </template>
                <template slot="vacationName" slot-scope=" record">
                    {{record.extras.configName}}
                </template>
                <template slot="startTime" slot-scope=" record">
                    {{record.items[0].extras.reportStart}}
                </template>
                <template slot="endTime" slot-scope=" record">
                    {{record.items[0].extras.reportEnd}}
                </template>
                <template slot="state" slot-scope=" record">
                    <a-tag v-if="record.flag === 'N'" color="red">废弃</a-tag>
                    <a-tag v-else-if="record.flag === 'Q'" color="blue">申请通过</a-tag>
                    <a-tag v-else-if="record.flag === 'Y'" color="green">休假中</a-tag>
                    <a-tag v-else-if="record.flag === 'T'" color="blue">销假中</a-tag>
                    <a-tag v-else-if="record.flag === 'X'" color="green">已销假</a-tag>
                    <a-tag v-else-if="record.flag === 'D'" color="green">已办结</a-tag>
                    <a-tag v-else color="blue">申请中</a-tag>
                </template>
            </s-table>
        </a-card>
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import STable from '@/components/Table'
import qs from 'qs'
export default {
  name: 'AskVacationMine',
  components: {
    PageView,
    STable
  },
  created () {
    const user = this.$ls.get('user')
    this.queryForm.userId = user.id
    this.caseTypeId = this.$route.query.caseTypeId
    this.onSearch()
    this.hasPermission()
  },
  data () {
    return {
      caseTypeId: '',
      permission: false,
      columns: [
        {
          title: '假期类型',
          scopedSlots: { customRender: 'types' }
        },
        {
          title: '假期名称',
          scopedSlots: { customRender: 'vacationName' }
        },
        {
          title: '请休天数',
          scopedSlots: { customRender: 'intentDays' }
        },
        {
          title: '申请日期',
          scopedSlots: { customRender: 'createdTime' }
        },
        {
          title: '假期开始日期',
          scopedSlots: { customRender: 'startTime' }
        },
        {
          title: '请休原因',
          scopedSlots: { customRender: 'reason' }
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'state' }
        }
      ],
      tabColumns: [
        {
          title: '姓名',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '假期类型',
          scopedSlots: { customRender: 'types' }
        },
        {
          title: '假期名称',
          scopedSlots: { customRender: 'vacationName' }
        },
        {
          title: '假期开始日期',
          scopedSlots: { customRender: 'startTime' }
        },
        {
          title: '假期结束日期',
          scopedSlots: { customRender: 'endTime' }
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'state' }
        }
      ],
      form: this.$form.createForm(this),
      queryForm: {
        title: '',
        userId: '',
        flag: '',
        scen: 2
      },
      queryParam: {
      },
      queryForm1: {
        title: '',
        userId: '',
        flag: 'Y',
        scen: 2
      },
      queryParam1: {
        title: '',
        userId: '',
        flag: 'Y',
        scen: 2
      },
      loadData: parameter => {
        return this.$http.get('/api/1/vacation_report/query_vacation_report_list.json', { params: Object.assign(parameter, this.queryParam),
          paramsSerializer: function (params) {
            return qs.stringify(params, { indices: false })
          }
        }).then(res => {
          return res
        })
      },
      loadData1: parameter => {
        return this.$http.get('/api/1/vacation_report/query_vacation_report_list.json', { params: Object.assign(parameter, this.queryParam1),
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
    hasPermission () {
      const that = this
      that.$http.get('/api/1/vacation_report/get_permission.json').then(function (resp) {
        that.permission = resp.hasPermission
      })
    },
    reset () {
      this.queryParam = {}
      this.queryForm = {}
      this.onSearch()
    },
    onChangeUser (selectedIds) {
      this.queryForm.userId = selectedIds
    },
    onSearch () {
      // 带userId
      this.queryParam = { ...this.queryForm }
      // this.$refs.table.refresh()
    },
    onSearch1 () {
      // 不带userId
      this.queryParam1 = { ...this.queryForm1 }
      this.$refs.table1.refresh()
    },
    onDetailView (record) {
      this.$router.push({ path: '/askvacation/view?id=' + record.id })
    },
    onView (record) {
      // this.$router.push({ path: '/askvacation/reportback?id=' + record.id + '&caseTypeId=' + this.caseTypeId })
      this.$router.push({ path: '/askvacation/view?id=' + record.id })
    }
  }
}
</script>

<style scoped>
    .card {
        margin-bottom: 14px;
    }
</style>
