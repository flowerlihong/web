<!--Created by luRX on 2019/03/29.-->
<template>
    <page-view>
        <a-card>
            <a-form :form="form">
                <table class="fx-form">
                    <tr>
                        <th class="not-null">实际借款人</th>
                        <td>
                            <a-form-item>
                                <user-selector v-decorator="[
                                            'factUserId',{initialValue:loans.factUserId, rules: [{ required: true, message: '请输入实际借款人' }]}]"/>
                            </a-form-item>
                        </td>
                        <th class="not-null">要求拨款金额</th>
                        <td>
                            <a-form-item>
                                <a-input type="number"
                                         :min="1"
                                         style="width: 200px"
                                         v-decorator="[
                                        'loanNum',{initialValue:loan.loanNum, rules: [{required: true, message: '请输入要求拨款金额' }]}]">
                                </a-input>&nbsp;元
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th class="not-null">借款原因</th>
                        <td colspan="3">
                            <a-form-item>
                                <a-textarea style="width: 95%; height:150px;"
                                            v-decorator="['reason',{initialValue:loan.reason, rules: [{ required: true, message: '请输入借款原因' }]}]"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th class="not-null">要求拨款时间</th>
                        <td>
                            <a-form-item>
                                <a-date-picker showTime
                                               format="YYYY-MM-DD"
                                               v-decorator="['planstartAt',{initialValue:loan.planstartAt, rules: [{required: true, message: '请输入要求拨款日期' }]}]"/>
                            </a-form-item>
                        </td>
                        <th class="not-null">预计还款时间</th>
                        <td>
                            <a-form-item>
                                <a-date-picker showTime
                                               format="YYYY-MM-DD"
                                               v-decorator="['planendAt',{initialValue:loan.planendAt, rules: [{required: true, message: '请输入预计还款日期' }]}]"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>还款方式</th>
                        <td colspan="3">
                            <a-form-item>
                                <dict-radio dictKey="LOAN.REPAY"
                                            v-decorator="['repaymentTypes', {initialValue:loan.repaymentTypes}]"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>还款方式说明</th>
                        <td colspan="3">
                            <a-form-item>
                                <a-input style="width: 95%"
                                         v-decorator="['repaymentIns',{initialValue:loan.repaymentIns}]"></a-input>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>申请人</th>
                        <td>
                            <a-form-item>
                                {{loans.extras.userName}}
                            </a-form-item>
                        </td>
                        <th>申请时间</th>
                        <td>
                            <a-form-item>
                                <a-date-picker showTime
                                               format="YYYY-MM-DD HH:mm"
                                               v-decorator="['createdAt',{initialValue:loan.createdAt, rules: [{required: true, message: '请输入申请日期' }]}]"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>附件</th>
                        <td colspan="3">
                            <upload-selector :referId='loan.id' configKey='LOAN.FILE'/>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" align="center" style="padding:14px 0">
                            <a-button type="primary" @click="onSubmit" :loading="loading">提交</a-button>
                            <a-button style="margin-left: 20px" @click="reset">重置</a-button>
                        </td>
                    </tr>
                </table>
            </a-form>
        </a-card>
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import qs from 'qs'
import moment from 'moment'
import UserSelector from '@/components/selector/UserSelector'
import DictRadio from '@/components/dict/DictRadio'
import UploadSelector from '@/components/selector/UploadSelector'

export default {
  name: 'LoanEdit',
  components: {
    PageView,
    UserSelector,
    DictRadio,
    UploadSelector
  },
  created () {
    this.loadData()
  },
  data () {
    return {
      form: this.$form.createForm(this),
      loading: false,
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      loanId: this.$route.query.id,
      loans: {
        factUserId: '',
        extras: {
          userName: '',
        }
      },
      loan: {
        id: '',
        userId: '',
        loanNum: 0,
        reason: '',
        repaymentTypes: '',
        repaymentIns: '',
        planstartAt: null,
        planendAt: null,
        createdAt: null
      },
      queryParam: {}
    }
  },
  methods: {
    moment,
    // 重置
    reset () {
      this.form.resetFields()
    },
    // 初始化数据
    loadData () {
      const that = this
      that.$http.get('/api/1/loan/get_loan.json?id=' + this.loanId).then(function (response) {
        let result = response.result
        that.loan = result
        that.loans.extras.userName = result.extras.userName
        that.loans.factUserId = result.factUserId
        that.loan.planstartAt = moment(result.planstartAt)
        that.loan.planendAt = moment(result.planendAt)
        that.loan.createdAt = moment(result.createdAt)
      })
    },
    onSubmit () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        let params = { ...this.form.getFieldsValue() }
        params.id = this.loanId
        params.planstartAt = params.planstartAt.format('YYYY-MM-DD HH:mm:ss')
        params.planendAt = params.planendAt.format('YYYY-MM-DD HH:mm:ss')
        params.createdAt = this.loan.createdAt.format('YYYY-MM-DD HH:mm:ss')
        const that = this
        that.loading = true
        that.$http.post('/api/1/loan/update_loan.json', qs.stringify(params)).then(function (response) {
          if (response.code !== 200) {
            return
          }
          that.$message.success('编辑借款单成功')
          that.form.resetFields()
          that.$router.push({ path: '/loan/view?id=' + that.loanId })
        })
      })
    }
  }
}
</script>

<style type="less" scoped>
    .process-list /deep/ .title {
        width: 120px;
    }

    .fx-form th {
        width: 110px;
    }

</style>
