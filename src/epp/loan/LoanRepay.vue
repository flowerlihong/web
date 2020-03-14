<!--Created by luRX on 2019/03/29.-->
<template>
    <a-modal :confirmLoading="modalLoading.loanRepay"
             :maskClosable="false"
             :visible="visible"
             :width="580"
             @cancel="$emit('cancel')"
             @ok="onSubmit"
             title="处理还款详情">
        <a-form :form="form">
                <a-form-item label="已还金额" v-bind="formItemLayout">
                    <a-input style="width: 200px"
                             :min="1"
                             type="number"
                             v-decorator="[
                'repaidNum', {rules: [{ required: true, message: '请输入还款金额' }]}]"/>&nbsp;元
                </a-form-item>
                <a-form-item label="实际还清时间" v-bind="formItemLayout">
                    <a-date-picker format="YYYY-MM-DD HH:mm:ss"
                                   showTime
                                   v-decorator="['factPayoffAt']"/>
                </a-form-item>
                <a-form-item label="拨款及还款说明" v-bind="formItemLayouts">
                    <a-textarea style="height: 150px; " v-decorator="['instruction', {initialValue: loan.instruction, rules: [{ max: 1000, message: '拨款情况说明不能超过1000个字' }]}]"></a-textarea>
                </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
import qs from 'qs'
import moment from 'moment'

export default {
  name: 'LoanRepay',

  created () {
    this.loadData()
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      modalLoading: {
        loanRepay: false
      },
      formItemLayout: {
        labelCol: {
          lg: { span: 7 }, sm: { span: 7 }
        },
        wrapperCol: {
          lg: { span: 10 }, sm: { span: 17 }
        },
      },
      formItemLayouts: {
        labelCol: {
          lg: { span: 7 }, sm: { span: 7 }
        },
        wrapperCol: {
          lg: { span: 13 }, sm: { span: 17 }
        }
      },
      loanId: this.$route.query.id,
      loan: {
        id: '',
        instruction: '',
        factLoanAtWeb: null
      },
      queryParam: {}
    }
  },
  methods: {
    moment,
    loanRepay (id) {
      this.loan.id = id
    },
    loadData () {
      const that = this
      that.$http.get('/api/1/loan/get_loan.json?id=' + this.loanId).then(function (response) {
        let result = response.result
        that.loan = result
      })
    },
    onSubmit () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        let params = { ...this.form.getFieldsValue() }
        params.id = this.loanId
        params.factLoanNum = this.loan.factLoanNum
        if (params.factPayoffAt != null) {
          params.factPayoffAt = params.factPayoffAt.format('YYYY-MM-DD HH:mm:ss')
        }
        const that = this
        that.$http.post('/api/1/loan/add_repay_loan.json', qs.stringify(params)).then(function (response) {
          if (response.code !== 200) {
            return
          }
          that.$message.success('处理借款单成功')
          that.form.resetFields()
          that.$emit('success')
          that.modalLoading.loanRepay = false
        })
      })
    }
  }
}
</script>

<style scoped>
    .fx-form th {
        width: 130px;
    }
</style>
