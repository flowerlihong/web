<template>
    <a-modal :title="title"
             :width="800"
             :visible="visible"
             @ok="onSave"
             @cancel="$emit('cancel')"
             destroyOnClose
             :confirmLoading="confirmLoading">
        <a-form :form="form">
            <a-form-item
                    label='模块描述名称'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="['name', {initialValue:formData.name, rules: [{ required: true, message: '请填写模块描述名称' }]}]" placeholder='模块描述名称'/>
            </a-form-item>
            <a-form-item
                    label='附件标识Key'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="['keyword', {initialValue:formData.keyword, rules: [{ required: true, message: '请填写附件标识Key' }]}]" placeholder='附件标识Key'/>
            </a-form-item>
            <a-form-item
                    label='存放路径'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="['storePath', {initialValue:formData.storePath, rules: [{ required: true, message: '请填写存放路径' }]}]" placeholder='存放路径'/>
            </a-form-item>
            <a-form-item
                    label='允许格式'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-checkbox-group v-decorator="['extension', {initialValue:formData.extension, rules: [{ required: true, message: '请填写允许格式' }]}]" :options="extensions"/>
            </a-form-item>
            <a-form-item
                    label='最大值 (KB)'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="['maxSize', {initialValue:formData.maxSize, rules: [{ required: true, message: '请填写最大值 (数字类型)'}]}]" placeholder='最大值 (KB)'/>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
import qs from 'qs'

const extensions = [
  { label: 'GIF', value: 'gif' },
  { label: 'JPG', value: 'jpg' },
  { label: 'PNG', value: 'png' },
  { label: 'BMP', value: 'bmp' },
  { label: 'HTM', value: 'htm' },
  { label: 'TXT', value: 'txt' },
  { label: 'RAR', value: 'rar' },
  { label: 'ZIP', value: 'zip' },
  { label: 'XLS', value: 'xls' },
  { label: 'DOC', value: 'doc' },
  { label: 'PPT', value: 'ppt' },
  { label: 'PDF', value: 'pdf' },
  { label: 'TIF', value: 'tif' },
  { label: '任何', value: '***' }
]

export default {
  name: 'AttachmentEdit',
  props: ['visible'],
  data () {
    return {
      form: this.$form.createForm(this),
      mode: '',
      title: '',
      formData: {
        id: null,
        name: null,
        keyword: null,
        storePath: null,
        extension: null,
        maxSize: null
      },
      extensions: extensions,
      confirmLoading: false
    }
  },
  methods: {
    preAdd () {
      this.title = '新建上传配置'
      this.mode = 'add'
    },
    preEdit (id) {
      this.title = '编辑上传配置'
      this.mode = 'edit'
      this.formData.id = id

      const that = this
      that.$http.get('/api/1/attachment/config.json?id=' + id).then(function (response) {
        let result = response.result
        result.maxSize = result.maxSize / 1024
        that.formData = result
      })
    },
    onSave () {
      const that = this
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        this.confirmLoading = true
        if (this.mode === 'add') {
          that.$http.post('/api/1/attachment/config-add.json', qs.stringify(this.form.getFieldsValue())).then(function () {
            that.confirmLoading = false
            that.$emit('success', that.mode)
          })
        } else {
          let params = this.form.getFieldsValue()
          params.id = that.formData.id
          that.$http.post('/api/1/attachment/config-edit.json', qs.stringify(params)).then(function () {
            that.confirmLoading = false
            that.$emit('success', that.mode)
          })
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
