<template>
    <page-view title="请休假申请单">
        <workflow-menu slot="xwfMenu" @onLoadXWFState="onLoadXWFState"/>
        <template slot="action">
            <a-button-group  v-show="xwfState.hasEdit || permission" style="margin-right: 4px;">
                <a-popconfirm placement="bottom" title="是否确认删除?" @confirm="deleteTrip()">
                    <a-button :loading="loading">删除</a-button>
                </a-popconfirm>
            </a-button-group>
            <a-button v-show="xwfState.hasEdit || permission" type="primary" @click="onView">编辑</a-button>
        </template>
        <a-card>
        <a-tabs defaultActiveKey="1">
            <a-tab-pane tab="请休假申请信息" key="1">
                <table class="fx-form-view">
                    <tr>
                        <th>请假人</th>
                        <td>
                            {{report.extras.userName}}
                        </td>
                        <th>申请日期</th>
                        <td>
                            <div>{{report.extras.createdAt}}</div>
                        </td>
                    </tr>
                    <tr>
                        <th>请假原因</th>
                        <td colspan="3">
                            <div>{{report.content}}</div>
                        </td>
                    </tr>
                    <tr>
                        <th>备注</th>
                        <td colspan="3">
                            <div>{{report.remark}}</div>
                        </td>
                    </tr>
                    <tr>
                        <th>附件</th>
                        <td colspan="3">
                            <upload-selector readonly :referId='report.id' configKey='SEAL.FILE' />
                        </td>
                    </tr>
                </table>
            </a-tab-pane>
            <a-tab-pane tab="假期详情信息" key="2" forceRender>
                <table class="fx-form-view" v-for="item in report.items" :key="item.id">
                    <tr>
                        <th>假期类型</th>
                        <td>
                            {{item.extras.configTypeName}}
                        </td>
                        <th>假期名称</th>
                        <td>
                            <div>{{item.extras.configName}}</div>
                        </td>
                    </tr>
                    <tr>
                        <th>拟请假天数</th>
                        <td colspan="3">
                            <div>{{item.reportDays}}</div>
                        </td>
                    </tr>
                    <tr>
                        <th>假期开始日期</th>
                        <td>
                            {{item.extras.reportStart}}
                        </td>
                        <th>假期结束日期</th>
                        <td>
                            <div>{{item.extras.reportEnd}}</div>
                        </td>
                    </tr>
                </table>
            </a-tab-pane>
        </a-tabs>
        </a-card>
        <workflow-comment :xwfState="xwfState" />
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import WorkflowMenu from '@/components/workflow/WorkflowMenu'
import WorkflowComment from '@/components/workflow/WorkflowComment'
import UploadSelector from '@/components/selector/UploadSelector'
export default {
  name: 'AskVacationView',
  components: {
    PageView,
    WorkflowMenu,
    WorkflowComment,
    UploadSelector
  },
  created () {
    this.loadData()
    this.hasPermission()
  },
  data () {
    return {
      xwfState: {},
      loading: false,
      permission: false,
      form: this.$form.createForm(this),
      report: {
        items: [],
        id: this.$route.query.id,
        extras: {
          userName: ''
        }
      }
    }
  },
  methods: {
    onLoadXWFState (xwfState) {
      this.xwfState = xwfState
    },
    loadData () {
      let that = this
      this.$http.get('/api/1/vacation_report/get_report.json?id=' + this.report.id).then(function (response) {
        let result = response.result
        that.report = result
        console.log(that.report)
      })
    },
    deleteTrip () {
      let that = this
      that.loading = true
      this.$http.post('/api/1/vacation_report/delete_report.json?id=' + this.report.id).then(function (response) {
        that.loading = false
        if (response.code === 200) {
          that.$message.success('删除成功')
          that.$router.push({ path: '/askvacation/index' })
        }
      })
    },
    hasPermission () {
      const that = this
      that.$http.get('/api/1/vacation_report/get_permission.json').then(function (resp) {
        that.permission = resp.hasPermission
      })
    },
    onView () {
      this.$router.push({ path: '/askvacation/edit?id=' + this.report.id })
    }
  }
}
</script>

<style scoped>
    .card {
        margin-bottom: 24px;
    }

    th {
        width: 130px !important;
    }

    table .ant-form-item {
        margin-bottom: 0;
    }
</style>
