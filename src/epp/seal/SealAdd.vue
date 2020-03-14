<template>
    <page-view title="盖章申请">
        <a-card>
            <a-form :form="form">
                <a-form-item>
                    <process-selector class="layout1" v-decorator="['procId',{ rules: [{ required: true, message: '请选择启动流程' }]}]"/>
                </a-form-item>
                <a-form-item label="申请人" v-bind="formItemLayout">
                        <user-selector v-decorator="['userId',{initialValue:seal.userId, rules: [{ required: true, message: '请选择申请人' }]}]"/>
                </a-form-item>

                <a-form-item label="申请时间" v-bind="formItemLayout">
                    <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="['createdAt',{initialValue:submitForm.createdAt, rules: [{ required: true, message: '请输入日期' }]}]"/>
                </a-form-item>

                <a-form-item label="盖章事宜" v-bind="formItemLayout">
                    <a-input v-decorator="['title',{ rules: [{ required: true, message: '请输入盖章事宜' }]}]"
                    ></a-input>
                </a-form-item>

                <a-form-item label="盖章理由" v-bind="formItemLayout">
                    <a-textarea style="height:200px;"  v-decorator="['content',{ rules: [{ required: true, message: '请输入盖章理由' }]}]"></a-textarea>
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
import ProcessSelector from '@/components/workflow/ProcessSelector'
import UploadSelector from '@/components/selector/UploadSelector'

const uuidv4 = require('uuid/v4')

export default {
  name: 'SealAdd',
  components: {
    PageView,
    UserSelector,
    ProcessSelector,
    UploadSelector
  },
  created () {
    const user = this.$ls.get('user')
    this.seal.userId = user.id
    this.seal.caseTypeId = this.$route.query.caseTypeId
  },
  data () {
    return {
      form: this.$form.createForm(this),
      submitForm: {
        id: uuidv4(),
        title: null,
        createdAt: moment(new Date()),
        content: null,
        userName: null,
        userId: null
      },
      loading: false,
      formItemLayout: {
        labelCol: {
          lg: { span: 7 }, sm: { span: 7 }
        },
        wrapperCol: {
          lg: { span: 10 }, sm: { span: 17 }
        }
      },
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      seal: {
        userId: '',
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
      this.seal.userId = selectedIds.join(',')
    },
    moment,
    submit () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        const that = this
        let data = that.form.getFieldsValue()
        data.id = that.submitForm.id
        data.caseTypeId = that.seal.caseTypeId
        data.createdAt = data.createdAt.format('YYYY-MM-DD HH:mm:ss')
        this.$http.post('/api/1/seal/add_seal.json', qs.stringify(data)).then(function (response) {
          if (response.code === 200) {
            that.$message.success('操作成功')
            that.$router.push({ path: '/seal/view?id=' + response.caseId })
          } else {
            that.$message.error('添加失败')
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
