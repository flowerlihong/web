<template>
    <page-view title="盖章申请">
        <a-card>
            <a-form :form="form">
                <a-form-item label="申请人" v-bind="formItemLayout">
                    <a-form-item>
                        <user-selector v-decorator="['userId',{initialValue:submitForm.userId, rules: [{ required: true, message: '请选择申请人' }]}]"/>
                    </a-form-item>
                </a-form-item>

                <a-form-item label="申请时间" v-bind="formItemLayout">
                    <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="['createdAt',{initialValue:submitForm.createdAt, rules: [{ required: true, message: '请输入日期' }]}]"/>
                </a-form-item>

                <a-form-item label="盖章事宜" v-bind="formItemLayout">
                    <a-input v-decorator="['title',{initialValue:submitForm.title, rules: [{ required: true, message: '请输入盖章事宜' }]}]"
                    ></a-input>
                </a-form-item>

                <a-form-item label="盖章理由" v-bind="formItemLayout">
                    <a-textarea style="height:200px;"  v-decorator="['content',{initialValue:submitForm.content, rules: [{ required: true, message: '请输入盖章理由' }]}]"></a-textarea>
                </a-form-item>

                <a-form-item label="盖章文件" v-bind="formItemLayout">
                    <upload-selector :referId='submitForm.id' configKey='SEAL.FILE' />
                </a-form-item>

                <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
                    <a-button type="primary" @click="submit" :loading="loading">提交</a-button>
                    <a-button style="margin:0 6px" @click="reset">重置</a-button>
                </a-form-item>

            </a-form>
        </a-card>
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import qs from 'qs'
import moment from 'moment'
import UserSelector from '@/components/selector/UserSelector'
import UploadSelector from '@/components/selector/UploadSelector'
export default {
  name: 'SealEdit',
  components: {
    PageView,
    UserSelector,
    UploadSelector
  },
  created () {
    this.loadData()
    this.seal.caseTypeId = this.$route.query.caseTypeId
  },
  data () {
    return {
      form: this.$form.createForm(this),
      submitForm: {
        title: null,
        createdAt: null,
        content: null,
        userName: null,
        userId: null
      },
      formItemLayout: {
        labelCol: {
          lg: { span: 7 }, sm: { span: 7 }
        },
        wrapperCol: {
          lg: { span: 10 }, sm: { span: 17 }
        }
      },
      loading: false,
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      seal: {
        id: this.$route.query.id
      },
      submitParam: {
      }
    }
  },
  methods: {
    reset () {
      this.form.resetFields()
    },
    onChangeProcess (id) {
      this.seal.procId = id
    },
    onChangeUser (selectedIds) {
      this.submitForm.userId = selectedIds.join(',')
    },
    moment,
    loadData () {
      let that = this
      this.$http.get('/api/1/seal/get_seal.json?id=' + this.seal.id).then(function (response) {
        let result = response.result
        that.submitForm = result
        that.submitForm.createdAt = moment(result.createdAt)
      })
    },
    submit () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        const that = this
        let data = that.form.getFieldsValue()
        data.id = that.seal.id
        data.createdAt = data.createdAt.format('YYYY-MM-DD HH:mm')
        this.$http.post('/api/1/seal/update_seal.json', qs.stringify(data)).then(function (response) {
          if (response.code === 200) {
            that.$message.success('更新成功')
            that.$router.push({ path: '/seal/view?id=' + that.seal.id })
          } else {
            that.$message.error(response.msg)
          }
        }).catch(function () {
        }).then(function () {
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
