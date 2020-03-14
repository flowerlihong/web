<template>
    <a-modal title="编辑工作日志"
             :width="850"
             :visible="visible"
             :maskClosable="false"
             @ok="onSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading.workLogEdit">
        <a-form :form="form">
            <a-form-item label="标题" v-bind="formItemLayout">
                <a-input placeholder="标题"
                         v-decorator="['title',{initialValue:workLog.title, rules: [{ required: true, message: '请输入标题' },{ max : 50, message: '标题不能超过50个字'}]}]"></a-input>
            </a-form-item>
            <a-form-item label="内容" v-bind="formItemLayout">
                <TinyMCE ref="editor" height="420px" :value="workLog.content"/>
                <!--<a-textarea style="height:200px"-->
                            <!--v-decorator="[-->
                            <!--'content', {initialValue:workLog.content, rules: [{ required: true, message: '请填写内容' },{ max : 1500, message: '内容不能超过1500个字'}]} ]"-->
                            <!--placeholder='内容'/>-->
            </a-form-item>
            <a-form-item label="日期" v-bind="formItemLayout">
                <a-date-picker class="date"
                               showTime
                               format="YYYY-MM-DD HH:mm"
                               v-decorator="['startAt', {initialValue:workLog.startAt, rules: [{ required: true, message: '请填写开始时间' }]} ]"
                               placeholder='开始时间'/>
                至
                <a-date-picker class="date"
                               showTime
                               format="YYYY-MM-DD HH:mm"
                               v-decorator="['endAt', {initialValue:workLog.endAt, rules: [{ required: true, message: '请填写结束时间' }]} ]"
                               placeholder='结束时间'/>
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
  name: 'WorkLogEdit',
  components: {
    ATextarea,
    TinyMCE
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
        workLogEdit: false
      },
      formItemLayout: {
        labelCol: {
          lg: { span: 3 }, sm: { span: 7 }
        },
        wrapperCol: {
          lg: { span: 18 }, sm: { span: 17 }
        }
      },
      workLogId: '',
      workLog: {
        id: '',
        title: '',
        content: '',
        startAt: null,
        endAt: null
      }
    }
  },
  methods: {
    moment,
    // 回调函数
    workLogEdit (id) {
      this.loadDate(id)
      this.workLogId = id
    },
    loadDate (id) {
      const that = this
      this.$http.get('/api/1/work_log/get_work_log.json?id=' + id).then(function (response) {
        let result = response.result
        that.content = result.content
        that.workLog = result
        that.workLog.startAt = moment(result.startAt)
        that.workLog.endAt = moment(result.endAt)
      })
    },
    // 编辑工作日志
    onSubmit () {
      let that = this
      this.form.validateFields((err, value) => {
        if (err) {
          return
        }
        // 时间组件
        let params = { ...this.form.getFieldsValue() }
        params.id = this.workLogId
        params.startAt = params.startAt.format('YYYY-MM-DD HH:mm:ss')
        params.endAt = params.endAt.format('YYYY-MM-DD HH:mm:ss')
        params.content = this.$refs.editor.getContent()
        if (params.content === ''){
          that.$message.info('内容不能为空')
        } else {
          this.$http.post('/api/1/work_log/update_work_log.json', qs.stringify(params)).then(function (response) {
            if (response.code !== 200) {
              return
            }
            that.$message.success('操作成功')
            that.form.resetFields()
            that.$emit('success')
            that.modalLoading.workLogEdit = false
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
