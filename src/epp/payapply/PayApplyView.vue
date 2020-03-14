<template>
    <page-view title="支付申请">
        <workflow-menu slot="xwfMenu" @onLoadXWFState="onLoadXWFState"/>
        <template slot="action">
            <ntko-c-p-b-print :id="id" :fileName="fileName" :docType="printType" :procInsId="processInstanceID"/>
            <a-button-group v-show="xwfState.hasEdit || permission" style="margin-right: 4px; margin-left: 5px">
                <a-button type="primary" @click="onView(initData)">编辑</a-button>&nbsp;
                <a-popconfirm placement="bottom" title="是否确认删除?" @confirm="deleteTrip(initData)">
                    <a-button :loading="loading">删除</a-button>
                </a-popconfirm>
            </a-button-group>
        </template>
        <a-card>
            <table class="fx-form-view">
                <tr>
                    <th>收款单位</th>
                    <td>
                        {{initData.receiveUnitName}}
                    </td>
                    <th>单位地址</th>
                    <td>
                        {{initData.receiveUnitAddress}}
                    </td>
                </tr>
                <tr>
                    <th>开户银行</th>
                    <td>
                        <div>{{initData.accountName}}</div>
                    </td>
                    <th>账号</th>
                    <td>
                        <div>{{initData.account}}</div>
                    </td>
                </tr>
                <tr>
                    <th>省份</th>
                    <td>
                        <div>{{initData.province}}</div>
                    </td>
                    <th>地市</th>
                    <td>
                        <div>{{initData.city}}</div>
                    </td>
                </tr>
                <tr>
                    <th>项目名称</th>
                    <td>
                        <div>{{initData.projectName}}</div>
                    </td>
                    <th>用途</th>
                    <td>
                        <div>{{initData.purpose}}</div>
                    </td>
                </tr>
                <tr>
                    <th>付款金额</th>
                    <td>
                        <div>{{initData.price}}元</div>
                    </td>
                    <th>已付金额</th>
                    <td>
                        <div>{{initData.payMoney}}元</div>
                    </td>
                </tr>
                <tr>
                    <th>付款方式</th>
                    <td>
                        <div v-if="initData.payWay === '4'">
                            {{initData.extras.payWay}}（{{initData.payWays}}）
                        </div>
                        <div v-else>{{initData.extras.payWay}}</div>
                    </td>
                    <th>申请人</th>
                    <td>
                        <div>{{initData.extras.userName}}</div>
                    </td>
                </tr>
                <tr>
                    <th>是否收到发票</th>
                    <td colspan="3">
                        <div>{{initData.extras.hasCheck}}</div>
                    </td>
                </tr>
                <tr>
                    <th>备注</th>
                    <td colspan="3">
                        <div>{{initData.remark}}</div>
                    </td>
                </tr>
                <tr>
                    <th>附件</th>
                    <td colspan="3">
                        <upload-selector readonly :referId='initData.id' configKey='SEAL.FILE' />
                    </td>
                </tr>
            </table>
        </a-card>

        <a-card title="会计科目">
            <a-table
                    :columns="columns"
                    :dataSource="initData.payApplySubjects"
                    :rowKey="record => record.id"
                    :pagination="false">
                <template slot="subject" slot-scope="record">
                    {{record.extras.subject}}
                </template>
                <template slot="price" slot-scope="record">
                    ￥{{record.price}}元
                </template>
                <template slot="time" slot-scope="record">
                    {{record.extras.createdAt}}
                </template>
            </a-table>
        </a-card>
        <workflow-comment :xwfState="xwfState" />
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import WorkflowMenu from '@/components/workflow/WorkflowMenu'
import WorkflowComment from '@/components/workflow/WorkflowComment'
import UploadSelector from '@/components/selector/UploadSelector'
import NtkoCPBPrint from '@/components/DocEditor/ntko/NtkoCPBPrint'

export default {
  name: 'PayApplyView',
  components: {
    PageView,
    WorkflowMenu,
    WorkflowComment,
    UploadSelector,
    NtkoCPBPrint
  },
  created () {
    this.loadData()
    this.hasPermission()
  },
  data () {
    return {
      xwfState: {},
      id: this.$route.query.id,
      printType: 'PAYAPPLY',
      processInstanceID: '',
      fileName: '支付申请单',
      loading: false,
      permission: false,
      columns: [
        {
          title: '科目',
          scopedSlots: { customRender: 'subject' }
        },
        {
          title: '金额（元）',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: '创建时间',
          scopedSlots: { customRender: 'time' }
        }
      ],
      form: this.$form.createForm(this),
      initData: {
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
      this.processInstanceID = xwfState.actIns.procInsId
    },
    hasPermission () {
      const that = this
      that.$http.get('/api/1/pay_apply/get_permission.json').then(function (resp) {
        that.permission = resp.hasPermission
      })
    },
    loadData () {
      let that = this
      this.$http.get('/api/1/pay_apply/get_pay_apply.json?id=' + this.initData.id).then(function (response) {
        let result = response.result
        that.initData = result
      })
    },
    deleteTrip (initData) {
      let that = this
      that.loading = true
      this.$http.post('/api/1/pay_apply/delete_pay_apply.json?id=' + initData.id).then(function (response) {
        that.loading = false
        if (response.code === 200) {
          that.$message.success('删除成功')
          that.$router.push({ path: '/pay/apply/index' })
        }
      })
    },
    onView (record) {
      this.$router.push({ path: '/pay/apply/edit?id=' + record.id })
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
