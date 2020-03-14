<template>
    <a-modal title="增加工作日志"
             :width="850"
             :visible="visible"
             :maskClosable="false"
             @ok="onSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading.workLogAdd">
        <a-form :form="form">
            <a-form-item label="标题" v-bind="formItemLayout">
                <a-input placeholder="标题"
                         v-decorator="['title',{ rules: [{ required: true, message: '请输入标题' }, { max : 50, message: '标题不能超过50个字'}]}]"></a-input>
            </a-form-item>
            <a-form-item label="内容" v-bind="formItemLayout">
                <TinyMCE ref="editor" height="420px" :value="content"/>
            </a-form-item>
            <a-form-item label="日期" v-bind="formItemLayout">
                <a-range-picker
                        :ranges="{ '今天': [moment(), moment()], '这个月': [moment(), moment().endOf('month')] }"
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        v-decorator="['rangeTimeValue', rangeConfig]"/>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
import qs from 'qs'
import ATextarea from 'ant-design-vue/es/input/TextArea'
import TinyMCE from '@/components/Editor/TinyMCE'
import moment from 'moment'

export default {
  name: 'WorkLogAdd',
  components: { ATextarea,TinyMCE },
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
          lg: { span: 3 }, sm: { span: 7 }
        },
        wrapperCol: {
          lg: { span: 18 }, sm: { span: 17 }
        }
      },
      modalLoading: {
        workLogAdd: false
      },
      // 校验
      rangeConfig: {
        rules: [{ type: 'array', required: true, message: '请输入时间' }],
      },
      workLog: {
        title: '',
        content: ''
      },
      queryParam: {},
      content: ''
    }
  },
  methods: {
    moment,
    // 增加工作日志
    onSubmit () {
      let that = this
      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          return
        }
        let params = { ...this.form.getFieldsValue() }
        params.startAt = params.rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss')
        params.endAt = params.rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss')
        params.content = this.$refs.editor.getContent()
        if (params.content === '') {
          that.$message.info('内容不能为空')
        }else {
          this.modalLoading.workLogAdd = true
          this.$http.post('/api/1/work_log/add_work_log.json', qs.stringify(params)).then(function (response) {
            if (response.code !== 200) {
              return
            }
            that.$message.success('增加工作日志成功')
            that.form.resetFields()
            that.modalLoading.workLogAdd = false
            that.$emit('success')
          })
        }
      })
    }

  }
}
</script>

<style scoped>

</style>
