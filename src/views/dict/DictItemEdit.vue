<template>
    <a-modal :title="title"
             :width="800"
             :visible="visible"
             @ok="onSave"
             @cancel="onCancel"
             :confirmLoading="confirmLoading">
        <a-form :autoFormCreate="(form)=>{this.form = form}">
            <a-form-item v-if="parentModel"
                         label='所属上级'
                         :labelCol="{ span: 5 }"
                         :wrapperCol="{ span: 12 }">
                {{parentModel.name}}
            </a-form-item>
            <a-form-item
                    label='字典项名称'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }"
                    fieldDecoratorId="name"
                    :fieldDecoratorOptions="{initialValue:model.name, rules: [{ required: true, message: '请填写字典项名称' }]}">
                <a-input placeholder='字典项名称'/>
            </a-form-item>
            <a-form-item
                    label='字典项取值'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }"
                    fieldDecoratorId="value"
                    :fieldDecoratorOptions="{initialValue:model.value, rules: [{ required: true, message: '请填写字典项取值' }]}">
                <a-input placeholder='字典项取值'/>
            </a-form-item>
            <a-form-item
                    label='顺序号'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }"
                    fieldDecoratorId="seqNo"
                    :fieldDecoratorOptions="{initialValue:model.seqNo, rules: [{ required: true, message: '请填写顺序号' }]}">
                <a-input placeholder='顺序号'/>
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
import qs from 'qs'

export default {
  name: 'DictItemEdit',
  props: ['dictId'],
  data () {
    return {
      title: '',
      visible: false,
      confirmLoading: false,
      mode: '',
      parentModel: null,
      model: {}
    }
  },
  methods: {
    preAdd: function (parentId) {
      const that = this
      this.title = '添加字典项'
      this.mode = 'add'
      this.visible = true
      if (parentId != null) {
        that.$http.get('/api/1/dict/dict-item.json?id=' + parentId).then(function (response) {
          that.parentModel = response.result
        })
      } else {
        that.parentModel = null
      }
    },
    preEdit: function (id) {
      const that = this
      this.title = '修改字典项'
      this.mode = 'edit'
      this.model.id = id
      this.visible = true
      that.$http.get('/api/1/dict/dict-item.json?id=' + id).then(function (response) {
        let model = response.result
        that.model = model
        if (model.parentId != null) {
          that.$http.get('/api/1/dict/dict-item.json?id=' + model.parentId).then(function (response) {
            that.parentModel = response.result
          })
        } else {
          that.parentModel = null
        }
      })
    },
    onSave: function () {
      const that = this
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        // action url
        let actionUrl = null
        // post params
        let data = this.form.getFieldsValue()
        //
        if (that.mode === 'add') {
          actionUrl = '/api/1/dict/item-add.json'
        } else if (that.mode === 'edit') {
          actionUrl = '/api/1/dict/item-edit.json'
          data.id = that.model.id
        }
        // post data
        data.dictId = that.dictId
        if (that.parentModel !== null) {
          data.parentId = that.parentModel.id
        }
        that.$http.post(actionUrl, qs.stringify(data)).then(function () {
          that.confirmLoading = false
          that.$message.success('操作成功')
          that.visible = false
          that.form.resetFields()
          that.$emit('success')
        })
      })
    },
    onCancel: function () {
      this.visible = false
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>

</style>
