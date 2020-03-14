<template>
    <page-view title="报销单详情">
        <!-- workflow -->
        <workflow-menu slot="xwfMenu" @onLoadXWFState="onLoadXWFState"/>
        <!-- action -->
        <template slot="action">
            <ntko-c-p-b-print :id="id" :fileName="fileName" :docType="printType" :procInsId="processInstanceID"/>
            <a-button-group v-show="xwfState.hasEdit || permission" style="margin-right: 4px;">
                <a-popconfirm placement="bottom" title="是否确认删除?" @confirm="onDelete">
                    <a-button :loading="loading">删除</a-button>
                </a-popconfirm>
            </a-button-group>
            <a-button v-show="xwfState.hasEdit || permission" type="primary" @click="onEdit">编辑</a-button>
        </template>

        <a-card class="card" title="报销信息">

            <table class="fx-form-view">
                <tr>
                    <th>报销部门</th>
                    <td>{{claim.extras.dept}}</td>
                    <th>填表日期</th>
                    <td>{{createdAt}}</td>
                </tr>
                <tr>
                    <th>报销人</th>
                    <td>{{claim.extras.user}}</td>
                    <th>填表人</th>
                    <td>{{claim.extras.submitUser}}</td>
                </tr>
                <tr>
                    <th>项目名称</th>
                    <td colspan="3">{{claim.projectName}}</td>
                </tr>
                <tr>
                    <th>备注</th>
                    <td colspan="3" v-html="remarkBr"></td>
                </tr>
                <tr>
                    <th>合计</th>
                    <td colspan="3" class="amount">{{ totalAmount }}</td>
                </tr>
                <tr>
                    <th>附件</th>
                    <td colspan="3">
                        <upload-selector readonly :referId='claim.id' configKey='SEAL.FILE' />
                    </td>
                </tr>
            </table>

        </a-card>

        <!-- table -->
        <a-card title="报销项目">
            <a-table
                    :columns="columns"
                    :dataSource="claim.items"
                    :rowKey="record => record.id"
                    :pagination="false">
                <template slot="content" slot-scope="text, record, index">
                    {{record.content}}
                </template>
                <template slot="cateId" slot-scope="text, record, index">
                    {{record.extras.cate}}
                </template>
                <template slot="quantity" slot-scope="text, record, index">
                    {{record.quantity}} 张
                </template>
                <template slot="amount" slot-scope="text, record, index">
                    ￥{{record.amount}} 元
                </template>
                <template slot="state" slot-scope="text, record, index">
                    <a-tag v-if="record.state === 'P'" color="green">审核通过</a-tag>
                    <a-tag v-else-if="record.state === 'F'" color="red">审核失败</a-tag>
                    <a-tag v-else color="blue">审核中</a-tag>
                </template>
                <template slot="operation" slot-scope="text, record, index">
                  <a-popconfirm title="是否要删除此行？" @confirm="onRemoveClaimItem(record.id)">
                    <a>删除</a>
                  </a-popconfirm>
                </template>
            </a-table>
        </a-card>

        <workflow-comment :xwfState="xwfState" />

    </page-view>
</template>

<script>
import qs from 'qs'
import moment from 'moment'
import WorkflowMenu from '@/components/workflow/WorkflowMenu'
import WorkflowComment from '@/components/workflow/WorkflowComment'
import { PageView } from '@/layouts'
import { WorkflowEvent } from '@/components/workflow/WorkflowEvent'
import NtkoCPBPrint from '@/components/DocEditor/ntko/NtkoCPBPrint'
import UploadSelector from '@/components/selector/UploadSelector'
const numeral = require('numeral')

export default {
  name: 'ClaimView',
  components: {
    PageView,
    WorkflowMenu,
    WorkflowComment,
    NtkoCPBPrint,
    UploadSelector
  },
  mounted () {
    WorkflowEvent.$on('PostXwfNext', () => {
      this.loadData()
    })
    WorkflowEvent.$on('PostXwfWithdraw', () => {
      this.loadData()
    })
  },
  created () {
    this.loadData()
    this.hasPermission()
  },
  data () {
    return {
      id: this.$route.query.id,
      printType: 'CLAIMAPPLY',
      processInstanceID: '',
      fileName: '报销申请单',
      xwfState: {},
      loading: false,
      permission: false,
      claimId: this.$route.query.id,
      columns: [
        {
          title: '用途',
          scopedSlots: { customRender: 'content' },
          width: '40%'
        },
        {
          title: '科目',
          scopedSlots: { customRender: 'cateId' },
          width: '20%'
        },
        {
          title: '单据张数',
          scopedSlots: { customRender: 'quantity' },
          width: '20%'
        },
        {
          title: '金额（元）',
          scopedSlots: { customRender: 'amount' },
          width: '20%'
        },
        {
          title: '审核状态',
          scopedSlots: { customRender: 'state' },
          width: '20%'
        }
      ],
      claim: {
        extras: {
          dept: '',
          user: '',
          submitUser: ''
        }
      }
    }
  },
  computed: {
    createdAt: function () {
      if (this.claim.createdAt == null) {
        return ''
      }
      return this.claim.createdAt.format('YYYY-MM-DD')
    },
    totalAmount: function () {
      if (this.claim.extras == null) {
        return ''
      }
      return numeral(this.claim.extras.totalAmount).format('0,0.[00]')
    },
    remarkBr: function () {
      if (!this.claim.remark) {
        return ''
      }
      return this.claim.remark.replace(/(?:\r\n|\r|\n)/g, '<br/>')
    }
  },
  methods: {
    onLoadXWFState (xwfState) {
      this.xwfState = xwfState
      this.processInstanceID = xwfState.actIns.procInsId
    },
    loadData () {
      let that = this
      return that.$http.get('/api/1/claim/get_claim.json?id=' + this.claimId).then(function (response) {
        let result = response.result
        result.createdAt = moment(result.createdAt)
        that.claim = result
      })
    },
    onEdit () {
      this.$router.push({ path: '/claim/edit?id=' + this.claimId })
    },
    onDelete () {
      let that = this
      that.loading = true
      return that.$http.post('/api/1/claim/delete_claim.json', qs.stringify({ id: this.claimId })).then(function (response) {
        that.loading = false
        if (response.code === 200) {
          that.$router.push({ path: '/claim/index' })
        }
      })
    },
    onAgree () {
      this.onApproval(this.claimId, 'P')
    },
    onDisagree () {
      this.onApproval(this.claimId, 'F')
    },
    hasPermission () {
      const that = this
      that.$http.get('/api/1/pay_apply/get_permission.json').then(function (resp) {
        that.permission = resp.hasPermission
      })
    },
    onApproval (caseId, state) {
      const that = this
      that.$http.post('/api/1/claim/approval.json', qs.stringify({ id: caseId, state: state })).then(function (response) {
        if (response.code === 200) {
          that.$message.success('操作成功')
          that.loadData()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
    .card {
        margin-bottom: 14px;
    }

    .ant-table-thead > tr > th {
        background: #f8f8f8;
    }

    .ant-card {
        margin-bottom: 14px;
    }

    .amount::before {
        content: '￥';
        font-size: 16px;
    }

    .amount {
        color: red;
        font-size: 22px;
    }
</style>
