<template>
    <page-view title="发送短信">
        <a-card>
            <a-form :form="form">
                <a-row>
                    <a-col :span="24">
                        <a-form-item label="短信模板" v-bind="formItemLayout">
                            <a-select v-decorator="['io',{ rules: [{ required: true, message: '请选择短信模板' }]}]" style="width: 200px">
                                <a-select-option v-for="t in smsData" :key = 't.id' @click="selectedSmsData(t)">{{t.name}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="24">
                        <a-form-item label="模板内容" v-bind="formItemLayout">
                            <a-textarea disabled v-model="submitForm.content" style="height:100px;"></a-textarea>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="24">
                        <a-form-item label="接收用户" v-bind="formItemLayout">
                            <user-selector multiple v-decorator="['receiver',{ rules: [{ required: false, message: '请选择接收用户' }]}]"/>
                        </a-form-item>
                    </a-col>
                </a-row>
                <!--<a-row>-->
                    <!--<a-col :span="24">-->
                        <!--<a-form-item v-for="item in addresses" :key="item.id" label="手机号码" v-bind="formItemLayout">-->
                            <!--<a-input-number v-model="item.phone" style="width: 200px" :min="0"-->
                            <!--&gt;</a-input-number><a-button @click="addF"><a-icon type="plus-circle"/></a-button>&nbsp;<a-button @click="onRemoveClaimItem(item.id)" type="danger"><a-icon type="delete"/></a-button>-->
                        <!--</a-form-item>-->
                    <!--</a-col>-->
                <!--</a-row>-->
                <a-row>
                    <a-col :span="24">
                        <a-form-item label="手机号码" v-bind="formItemLayout">
                            <a-textarea placeholder="手机号码用回车分隔" style="height:100px;" v-decorator="['phone',{ rules: [{ required: false }]}]"></a-textarea>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="24">
                        <a-form-item label="内容" v-bind="formItemLayout">
                            <a-textarea style="height:100px;" v-decorator="['content',{ rules: [{ required: true, message: '请输入内容' }]}]"></a-textarea>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="24" class="footer-button">
                        <a-form-item :wrapperCol="{ span: 23 }" style="text-align: center">
                            <a-button type="primary" @click="submit" :loading="loading">发送</a-button>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-card>
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import qs from 'qs'
import moment from 'moment'
import UserSelector from '@/components/selector/UserSelector'

export default {
  name: 'SendMessage',
  components: {
    PageView,
    UserSelector
  },
  created () {
    this.getSmsTemplateList()
  },
  data () {
    return {
      form: this.$form.createForm(this),
      submitForm: {
        name: '',
        content: '',
        keyword: ''
      },
      message: {},
      globalId: 0,
      addresses: [
        {
          phone: ''
        }
      ],
      smsData: [],
      loading: false,
      formItemLayout: {
        labelCol: {
          lg: { span: 7 }, sm: { span: 7 }
        },
        wrapperCol: {
          lg: { span: 10 }, sm: { span: 17 }
        }
      },
      submitParam: {
      }
    }
  },
  methods: {
    reset () {
      this.form.resetFields()
    },
    addF () {
      this.addresses.push({
        id: ++this.globalId,
        phone: ''
      })
    },
    onRemoveClaimItem (id) {
      if (this.addresses.length < 2) {
        return
      }
      const newData = this.addresses.filter(item => item.id !== id)
      this.addresses = newData
    },
    selectedSmsData (selectedOptions) {
      this.submitForm = selectedOptions
    },
    getSmsTemplateList () {
      let that = this
      this.$http.get('/api/1/msg/config/get_sms_template_config_list.json').then(function (response) {
        let result = response.result
        that.smsData = result
      })
    },
    moment,
    submit () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        const that = this
        let data = that.form.getFieldsValue()
        if (!data.receiver && !data.phone) {
          that.$message.error('接收用户和手机号码不能同时为空')
          return
        }
        data.keyword = that.submitForm.keyword
        this.$http.post('/api/1/message/send_msg.json', qs.stringify(data, { allowDots: true })).then(function (response) {
          if (response.code === 200) {
            that.$message.success('发送成功')
            // that.$router.push({ path: '/car/repair/view?id=' + response.caseId })
          } else {
            that.$message.error('发送失败')
          }
        }).catch(function () {
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
