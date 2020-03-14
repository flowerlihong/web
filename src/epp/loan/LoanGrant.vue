<!--Created by luRX on 2019/03/29.-->
<template>
    <a-modal title="处理拨款详情"
             :width="580"
             :visible="visible"
             :maskClosable="false"
             @ok="onSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading.loanGrant">
        <a-form :form="form">
            <a-form-item label="实际拨款金额" v-bind="formItemLayout">
                <a-input type="number"
                         :min="1"
                         placeholder="实际拨款金额" style="width: 200px"
                         v-decorator="['factLoanNum',{ rules: [{ required: true, message: '请输入实际拨款金额' }]}]"/>&nbsp;元
            </a-form-item>

            <a-form-item label="实际拨款时间" v-bind="formItemLayout">
                <a-date-picker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        v-decorator="['factLoanAt',{rules: [{ required: true, message: '请输入实际拨款日期' }]}]"/>
            </a-form-item>

            <a-form-item label="拨款及还款说明" v-bind="formItemLayouts">
                <a-textarea style="height: 150px; "
                            v-decorator="['instruction', {rules: [{ max: 1000, message: '拨款情况说明不能超过1000个字' }]}]"></a-textarea>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
import qs from 'qs'
import moment from 'moment'
import ATextarea from 'ant-design-vue/es/input/TextArea'

export default {
  name: 'LoanGrant',
  components: { ATextarea },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: {
          lg: { span: 7 }, sm: { span: 7 }
        },
        wrapperCol: {
          lg: { span: 10 }, sm: { span: 17 }
        }
      },
      formItemLayouts: {
        labelCol: {
          lg: { span: 7 }, sm: { span: 7 }
        },
        wrapperCol: {
          lg: { span: 13 }, sm: { span: 17 }
        }
      },
      modalLoading: {
        loanGrant: false
      },
      loanId: this.$route.query.id,
      loan: {
        id: '',
        factLoanNum: '',
        factLoanAt: null
      },
      queryParam: {}
    }
  },
  methods: {
    moment,
    loanGrant (id) {
      this.loan.id = id
    },
    onSubmit () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        let params = { ...this.form.getFieldsValue() }
        params.id = this.loanId
        params.factLoanAt = params.factLoanAt.format('YYYY-MM-DD HH:mm:ss')
        const that = this
        that.$http.post('/api/1/loan/add_grant_loan.json', qs.stringify(params)).then(function (response) {
          if (response.code !== 200) {
            return
          }
          that.$message.success('处理借款单成功')
          that.form.resetFields()
          that.$emit('success')
        }).then(function () {
          that.modalLoading.loanGrant = false
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
