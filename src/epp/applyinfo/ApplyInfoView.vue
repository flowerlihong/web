<template>
    <page-view title="内部请示">
        <workflow-menu slot="xwfMenu" @onLoadXWFState="onLoadXWFState"/>
        <template slot="action">
            <a-button-group v-show="xwfState.hasEdit || permission" style="margin-right: 4px;">
                <a-popconfirm placement="bottom" title="是否确认删除?" @confirm="deleteTrip(apply)">
                    <a-button :loading="loading">删除</a-button>
                </a-popconfirm>
            </a-button-group>
            <a-button v-show="xwfState.hasEdit || permission" type="primary" @click="onView(apply)">编辑</a-button>
        </template>
        <a-card>
            <a-tabs defaultActiveKey="1">
                <a-tab-pane tab="通用呈批表" key="1">
            <table class="fx-form-view">
                <tr>
                    <th>编号</th>
                    <td>
                        {{apply.serial}}
                    </td>
                    <th>登记日期</th>
                    <td>
                        <div>{{apply.extras.createdAt}}</div>
                    </td>
                </tr>
                <tr>
                    <th>标题</th>
                    <td colspan="3">
                        <div>{{apply.title}}</div>
                    </td>
                </tr>
                <tr>
                    <th>主要内容</th>
                    <td colspan="3">
                        <div>{{apply.content}}</div>
                    </td>
                </tr>
                <tr>
                    <th>备注</th>
                    <td colspan="3">
                        <div>{{apply.remark}}</div>
                    </td>
                </tr>
            </table>
                </a-tab-pane>
                <a-tab-pane tab="通用审批登记信息" key="2">
                    <table class="fx-form-view">
                    <tr>
                        <th>编号</th>
                        <td>
                            {{apply.serial}}
                        </td>
                        <th>登记日期</th>
                        <td>
                            <div>{{apply.extras.createdAt}}</div>
                        </td>
                        <th>紧急程度</th>
                        <td>
                            <div v-if="apply.urgency === '1'">平件</div>
                            <div v-else-if="apply.urgency === '2'">急</div>
                            <div v-else-if="apply.urgency === '3'">特急</div>
                            <div v-else>特提</div>
                        </td>
                    </tr>
                    <tr>
                        <th>标题</th>
                        <td colspan="5">
                            <div>{{apply.title}}</div>
                        </td>
                    </tr>
                    <tr>
                        <th>主要内容</th>
                        <td colspan="5">
                            <div>{{apply.content}}</div>
                        </td>
                    </tr>
                        <tr>
                            <th>登记部门</th>
                            <td colspan="3">
                                <div>{{apply.extras.deptName}}</div>
                            </td>
                            <th>登记人</th>
                            <td>
                                <div>{{apply.extras.userName}}</div>
                            </td>
                        </tr>
                    <tr>
                        <th>备注</th>
                        <td colspan="5">
                            <div>{{apply.remark}}</div>
                        </td>
                    </tr>
                        <tr>
                            <th>附件</th>
                            <td colspan="5">
                                <upload-selector readonly :referId='apply.id' configKey='SEAL.FILE' />
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
  name: 'ApplyInfoView',
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
      apply: {
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
      this.$http.get('/api/1/applyinfo/get_apply_info.json?id=' + this.apply.id).then(function (response) {
        let result = response.result
        that.apply = result
      })
    },
    deleteTrip (apply) {
      let that = this
      that.loading = true
      this.$http.post('/api/1/applyinfo/delete_apply_info.json?id=' + apply.id).then(function (response) {
        that.loading = false
        if (response.code === 200) {
          that.$message.success('删除成功')
          that.$router.push({ path: '/applyinfo/index' })
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
      this.$router.push({ path: '/applyinfo/edit?id=' + record.id })
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
