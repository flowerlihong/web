<!--Created by luRX on 2019/03/29.-->
<template>
    <page-view title="借款申请及处理">
        <a-card class="card">
            <a-form :form="form">
                <a-form-item>
                    <process-selector @change="onChangeProcess"/>
                </a-form-item>
                <table class="fx-form">
                    <tr>
                        <th class="not-null">实际借款人</th>
                        <td>
                            <a-form-item>
                                <user-selector style="width: 100px" v-decorator="[
                                            'factUserId',{initialValue:loan.userId, rules: [{ required: true, message: '请输入实际借款人' }]}]"/>
                            </a-form-item>
                        </td>
                        <th class="not-null">要求拨款金额</th>
                        <td>
                            <a-form-item>
                                <a-input
                                        style="width: 150px"
                                        placeholder="请输入金额"
                                        type="number"
                                        :min="1"
                                        v-decorator="[
                                        'loanNum',{ rules: [{ required: true, message: '请输入要求拨款金额' }]}]">
                                </a-input>&nbsp;&nbsp;元
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th class="not-null">借款原因</th>
                        <td colspan="3">
                            <a-form-item>
                                <a-textarea style="height:130px; width: 85%"
                                            placeholder="请输入借款原因"
                                            v-decorator="[
                                            'reason',{ rules: [{ required: true, message: '请输入借款原因' }, { max: 3000, message: '借款原因不能超过3000个字' }]}]"></a-textarea>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th class="not-null">要求拨款时间</th>
                        <td>
                            <a-form-item>
                                <a-date-picker style="width: 200px"
                                               showTime
                                               format="YYYY-MM-DD HH:mm"
                                               v-decorator="[
                                               'planstartAt',{rules: [{ required: true, message: '请输入要求拨款日期' }]}]">
                                </a-date-picker>
                            </a-form-item>
                        </td>
                        <th class="not-null">预计还款时间</th>
                        <td>
                            <a-form-item>
                                <a-date-picker style="width: 200px"
                                               showTime
                                               format="YYYY-MM-DD HH:mm"
                                               v-decorator="[
                                               'planendAt',{rules: [{ required: true, message: '请输入预计还款日期' }]}]">
                                </a-date-picker>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>还款方式</th>
                        <td colspan="3">
                            <a-form-item>
                                <dict-radio dictKey="LOAN.REPAY"
                                            v-decorator="['repaymentTypes', {initialValue: '1' }]"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>还款方式说明</th>
                        <td colspan="3">
                            <a-form-item>
                                <a-input style="width: 85%"
                                         placeholder="请输入还款方式说明"
                                         v-decorator="['repaymentIns', {rules: [{max: 200, message: '还款方式说明不能超过200个字' }]}]"></a-input>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>申请人</th>
                        <td>
                            <a-form-item>
                                {{loan.userName}}
                            </a-form-item>
                        </td>
                        <th>申请时间</th>
                        <td>
                            <a-form-item>
                                {{loan.createdAt}}
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>附件</th>
                        <td colspan="3">
                            <upload-selector :referId='loan.ids' configKey='LOAN.FILE'/>
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
import ProcessSelector from '@/components/workflow/ProcessSelector'
import DictRadio from '@/components/dict/DictRadio'
import UploadSelector from '@/components/selector/UploadSelector'
import AFormItem from 'ant-design-vue/es/form/FormItem'

const uuidv4 = require('uuid/v4')

export default {
  name: 'LoanAdd',
  components: {
    AFormItem,
    PageView,
    UserSelector,
    ProcessSelector,
    DictRadio,
    UploadSelector
  },
  created () {
    const user = this.$ls.get('user')
    this.loan.userId = user.id
    this.loan.userName = user.name
    this.loan.caseTypeId = this.$route.query.caseTypeId
  },
  data () {
    return {
      form: this.$form.createForm(this),
      loading: false,
      loan: {
        ids: uuidv4(),
        userId: '',
        userName: '',
        createdAt: moment(new Date()).format('YYYY年MM月DD日 HH:mm')
      },
      queryParam: {},
    }
  },
  methods: {
    // 重置
    reset () {
      this.form.resetFields()
    },
    onChangeProcess (id) {
      this.loan.procId = id
    },
    moment,
    onSubmit () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        const that = this
        let params = { ...that.form.getFieldsValue() }
        params.id = this.loan.ids
        params.userId = this.loan.userId
        params.caseTypeId = this.loan.caseTypeId
        params.procId = this.loan.procId
        params.planstartAt = params.planstartAt.format('YYYY-MM-DD HH:mm')
        params.planendAt = params.planendAt.format('YYYY-MM-DD HH:mm')
        params.createdAt = this.loan.createdAt
        that.loading = true
        that.$http.post('/api/1/loan/add_loan.json', qs.stringify(params)).then(function (response) {
          if (response.code !== 200) {
            return
          }
          that.$message.success('提交借款申请成功')
          that.form.resetFields()
          that.queryParam.id = response.id
          that.$router.push({ path: '/loan/view?id=' + response.caseId })
        })
      })
    }
  }
}
</script>

<style type="less" scoped>
    .card {
        margin-bottom: 24px;
    }

    .process-list /deep/ .title {
        width: 120px;
    }

    .fx-form th {
        width: 110px;
    }
</style>
