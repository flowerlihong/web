<!--Created by luRX on 2019/03/29.-->
<template>
    <page-view title="借款详情">
        <!-- workflow -->
        <workflow-menu slot="xwfMenu" @onLoadXWFState="onLoadXWFState"/>
        <!-- action -->
        <template slot="action">
            <a-button-group v-show="xwfState.hasEdit" style="margin-right: 4px;">
                <a-popconfirm placement="bottom" title="是否确认删除?" @confirm="onDelete">
                    <a-button :loading="loading">删除</a-button>
                </a-popconfirm>
            </a-button-group>
            <a-button v-show="xwfState.hasEdit" type="primary" @click="onView">编辑</a-button>
            <a-button v-if="loan.factLoanNum === 0" v-show="xwfState.hasEvtPerform" type="primary" icon="plus"
                      @click="onLoanGrant">财务拨款处理
            </a-button>
            <a-button v-if="loan.repayment === '1'" v-show="xwfState.hasEvtReceipt" type="primary" icon="plus"
                      @click="onLoanRepay">财务还款处理
            </a-button>
        </template>
        <a-card>
            <a-tabs defaultActiveKey="1">
                <a-tab-pane tab="申请信息" key="1">
                    <table class="fx-form-view">
                        <tr>
                            <th>实际借款人</th>
                            <td>
                                {{loan.extras.factUserName}}
                            </td>
                            <th>要求借款金额</th>
                            <td>
                                ￥ {{loan.loanNum}} 元
                            </td>
                        </tr>
                        <tr>
                            <th>借款原因</th>
                            <td colspan="3">
                                <div>{{loan.reason}}</div>
                            </td>
                        </tr>
                        <tr>
                            <th>要求拨款时间</th>
                            <td>
                                <div>{{loan.extras.planstartAt}}</div>
                            </td>
                            <th>预计还款时间</th>
                            <td>
                                <div>{{loan.extras.planendAt}}</div>
                            </td>
                        </tr>
                        <tr>
                            <th>还款方式</th>
                            <td colspan="3">
                                <div v-if="loan.repaymentTypes === '1'">报销(多退少补)</div>
                                <div v-else-if="loan.repaymentTypes === '2'">从工资中扣除</div>
                                <div v-else-if="loan.repaymentTypes === '3'">其他</div>
                            </td>
                        </tr>
                        <tr>
                            <th>还款方式说明</th>
                            <td colspan="3">
                                <div>{{loan.repaymentIns}}</div>
                            </td>
                        </tr>
                        <tr>
                            <th>申请人</th>
                            <td>
                                <div>{{loan.extras.userName}}</div>
                            </td>
                            <th>申请时间</th>
                            <td>
                                <div>{{loan.extras.creatAt}}</div>
                            </td>
                        </tr>
                        <tr>
                            <th>附件</th>
                            <td colspan="3">
                                <upload-selector readonly :referId='loanId' configKey='LOAN.FILE'/>
                            </td>
                        </tr>
                    </table>
                </a-tab-pane>
                <a-tab-pane tab="财务处理" key="2" forceRender>
                    <table class="fx-form-view">
                        <tr>
                            <th>实际拨款金额</th>
                            <td>
                                {{loan.factLoanNum}} 元
                            </td>
                            <th>实际拨款时间</th>
                            <td>
                                {{loan.extras.factLoanAtWeb}}
                            </td>
                        </tr>
                        <tr>
                            <th>还款情况</th>
                            <td>
                                <div v-if="loan.repayment === '1'">未还清</div>
                                <div v-else-if="loan.repayment === '2'">已还清</div>
                            </td>
                            <th>实际还清时间</th>
                            <td>
                                {{loan.extras.factPayOffAtWeb}}
                            </td>
                        </tr>

                        <tr>
                            <th>已还金额</th>
                            <td>
                                {{loan.repaidNum}} 元
                            </td>

                            <th>剩余未还金额</th>
                            <td>
                                {{loan.unrepaidNum}} 元
                            </td>
                        </tr>
                        <tr>
                            <th>拨款及还款说明</th>
                            <td colspan="3">
                                <div>{{loan.instruction}}</div>
                            </td>
                        </tr>
                    </table>
                </a-tab-pane>
            </a-tabs>
            <workflow-comment :xwfState="xwfState"/>
            <!--财务拨款处理-->
            <loan-grant ref="loanGrant" :visible="modalVisible.loanGrant" @success="onLoanGrantSuccess"
                        @cancel="onLoanGrantCancel"/>
            <!--财务借款处理-->
            <loan-repay ref="loanRepay" :visible="modalVisible.loanRepay" @success="onLoanRepaySuccess"
                        @cancel="onLoanRepayCancel"/>
        </a-card>
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import WorkflowMenu from '@/components/workflow/WorkflowMenu'
import WorkflowComment from '@/components/workflow/WorkflowComment'
import qs from 'qs'
import LoanGrant from './LoanGrant'
import LoanRepay from './LoanRepay'
import moment from 'moment'
import UploadSelector from '@/components/selector/UploadSelector'

export default {
  name: 'LoanView',
  components: {
    PageView,
    WorkflowMenu,
    WorkflowComment,
    LoanGrant,
    LoanRepay,
    UploadSelector
  },

  created () {
    this.loadData()
  },
  data () {
    return {
      xwfState: {},
      loading: false,
      loanId: this.$route.query.id,
      loan: {
        extras: {
          userName: '',
          factUserName: '',
          planstartAt: null,
          planentAt: null,
          creatAt: null,
          factLoanAtWeb: '',
          factPayOffAtWeb: ''
        },
        loanNum: 0,
        factLoanNum: 0,
        factLoanAt: null,
        repayment: '',
        repaidNum: 0,
        unrepaidNum: 0,
        instruction: ''
      },
      // 对话框是否显示
      modalVisible: {
        loanGrant: false,
        loanRepay: false
      }
    }
  },
  methods: {
    moment,
    // 工作流
    onLoadXWFState (xwfState) {
      this.xwfState = xwfState
    },
    // 初始化数据
    loadData () {
      let that = this
      this.$http.get('/api/1/loan/get_loan.json?id=' + this.loanId).then(function (response) {
        let result = response.result
        that.loan = result
      })
    },
    onDelete () {
      const that = this
      that.loading = true
      return that.$http.post('/api/1/loan/delete_loan.json', qs.stringify({ id: this.loanId })).then(function (response) {
        that.loading = false
        if (response.code === 200) {
          that.$router.push({ path: '/loan/info' })
        }
      })
    },

    // 编辑,跳转页面
    onView () {
      this.$router.push({ path: '/loan/edit?id=' + this.loanId })
    },
    // 拨款处理窗口
    onLoanGrant () {
      this.modalVisible.loanGrant = true
      this.$refs.loanGrant.loanGrant(this.loanId)
    },
    onLoanGrantSuccess () {
      this.loadData()
      this.modalVisible.loanGrant = false
    },
    onLoanGrantCancel () {
      this.modalVisible.loanGrant = false
    },

    // 还款处理窗口
    onLoanRepay () {
      this.modalVisible.loanRepay = true
      this.$refs.loanRepay.loanRepay(this.loanId)
    },
    onLoanRepaySuccess () {
      this.loadData()
      this.modalVisible.loanRepay = false
    },
    onLoanRepayCancel () {
      this.modalVisible.loanRepay = false
    },
  }
}
</script>

<style scoped>

</style>
