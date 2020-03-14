<template>
    <page-view title="外勤/出差管理">
        <workflow-menu slot="xwfMenu" @onLoadXWFState="onLoadXWFState"/>
        <template slot="action">
            <a-button-group v-show="xwfState.hasEdit || permission" style="margin-right: 4px;">
                <a-button type="primary" @click="onView(trip)">编辑</a-button>&nbsp;
                <a-popconfirm placement="bottom" title="是否确认删除?" @confirm="deleteTrip(trip)">
                    <a-button :loading="loading">删除</a-button>
                </a-popconfirm>
            </a-button-group>
        </template>
        <a-card>
                <table class="fx-form-view">
                    <tr>
                        <th>外出人员</th>
                        <td colspan="3">
                                {{trip.extras.userName}}
                        </td>
                    </tr>
                    <tr>
                        <th>申请时间</th>
                        <td>
                                <div>{{trip.extras.creatAt}}</div>
                        </td>
                        <th>外出类型</th>
                        <td>
                                <div v-if="trip.types === '1'">出差</div>
                                <div v-else-if="trip.types === '2'">外勤</div>
                        </td>
                    </tr>
                    <tr>
                        <th>计划外出时间</th>
                        <td>
                                <div>{{trip.extras.planStartAt}}</div>
                        </td>
                        <th>计划返回时间</th>
                        <td>
                                <div>{{trip.extras.planEndAt}}</div>
                        </td>
                    </tr>
                    <tr>
                        <th>外出地点</th>
                        <td colspan="3">
                            <div>{{trip.address}}</div>
                        </td>
                    </tr>
                    <tr>
                        <th>外出事由</th>
                        <td colspan="3">
                                <div>{{trip.content}}</div>
                        </td>
                    </tr>
                    <tr>
                        <th>附件</th>
                        <td colspan="3">
                            <upload-selector readonly :referId='trip.id' configKey='SEAL.FILE' />
                        </td>
                    </tr>
                </table>
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
  name: 'BusinessTripView',
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
      trip: {
        id: this.$route.query.id,
        extras: {
          userName: ''
        }
      }
    }
  },
  methods: {
    onLoadXWFState (xwfState) {
      console.log(xwfState)
      this.xwfState = xwfState
    },
    loadData () {
      let that = this
      this.$http.get('/api/1/business_trip/get_business_trip.json?id=' + this.trip.id).then(function (response) {
        let result = response.result
        that.trip = result
      })
    },
    deleteTrip (trip) {
      let that = this
      that.loading = true
      this.$http.post('/api/1/business_trip/delete_business_trip.json?id=' + trip.id).then(function (response) {
        that.loading = false
        if (response.code === 200) {
          that.$message.success('删除成功')
          that.$router.push({ path: '/businesstrip/index' })
        }
      })
    },
    hasPermission () {
      const that = this
      that.$http.get('/api/1/pay_apply/get_permission.json').then(function (resp) {
        that.permission = resp.hasPermission
      })
    },
    onView (record) {
      this.$router.push({ path: '/businesstrip/edit?id=' + record.id })
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
