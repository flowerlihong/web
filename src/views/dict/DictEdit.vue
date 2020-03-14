<template>
    <a-modal :title="title"
             :width="800"
             :visible="visible"
             @ok="onSave"
             @cancel="$emit('cancel')"
             :confirmLoading="confirmLoading">
        <a-form :autoFormCreate="(form)=>{this.form = form}">
            <a-form-item
                    label='字典名称'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }"
                    fieldDecoratorId="name"
                    :fieldDecoratorOptions="{initialValue:model.name, rules: [{ required: true, message: '请填写字典名称' }]}">
                <a-input placeholder='字典名称'/>
            </a-form-item>
            <a-form-item
                    label='字典标识'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }"
                    fieldDecoratorId="keyword"
                    :fieldDecoratorOptions="{initialValue:model.keyword, rules: [{ required: true, message: '请填写字典标识' }]}">
                <a-input placeholder='字典标识'/>
            </a-form-item>
            <a-form-item
                    label='是否缓存'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }"
                    fieldDecoratorId="enableCache"
                    :fieldDecoratorOptions="{initialValue:model.enableCache}">
                <a-select>
                    <a-select-option value='1'>是</a-select-option>
                    <a-select-option value='0'>否</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item
                    label='描述'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }"
                    fieldDecoratorId="remark"
                    :fieldDecoratorOptions="{initialValue:model.remark}">
                <a-input placeholder='字典描述'/>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
import { axios as request } from '@/utils/request'
import qs from 'qs'

export default {
  name: 'DictEdit',
  props: ['visible'],
  data () {
    return {
      mode: '',
      title: '',
      model: {},
      confirmLoading: false
    }
  },
  methods: {
    preAdd: function () {
      this.title = '添加字典'
      this.mode = 'add'
    },
    preEdit: function (id) {
      this.title = '编辑字典'
      this.mode = 'edit'

      this.model = Object.assign({}, { id: id })

      let that = this
      request.get('/api/1/dict/dict.json?id=' + id).then(function (response) {
        let model = response.result
        that.model = { ...that.model, ...model }
        that.model.enableCache = that.model.enableCache + ''
      })
    },
    onSave () {
      let that = this
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        this.confirmLoading = true
        if (that.mode === 'add') {
          request.post('/api/1/dict/add.json', qs.stringify(this.form.getFieldsValue())).then(function () {
            that.confirmLoading = false
            that.$emit('success', that.mode)
          })
        } else {
          let params = Object.assign({}, this.form.getFieldsValue())
          params.id = this.model.id
          request.post('/api/1/dict/edit.json', qs.stringify(params)).then(function () {
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
