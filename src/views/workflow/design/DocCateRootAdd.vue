<!--
 Created by Xuz on 2019/03/04.
 xuz[at]live[dot]cn
 添加文档目录
-->
<template>
    <a-modal title="添加文档目录"
             :width="800"
             :visible="visible"
             :maskClosable="false"
             @ok="onSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading">
        <a-form :form="form">
            <a-form-item
                    label='类别名称'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'name',
                            {rules: [{ required: true, message: '请填写类别名称' }]}]" placeholder='类别名称'/>
            </a-form-item>
            <a-form-item
                    label='顺序号'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input-number v-decorator="[
                                    'seq',
                                    {rules: [{ required: true, type: 'number', message: '请填写数字类型顺序号' }]}]" placeholder='顺序号'/>
            </a-form-item>
            <a-form-item
                    label='描述'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'description',
                            {rules: [{ required: false, message: '请填写描述' }]}]" placeholder='描述'/>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
import qs from 'qs'

export default {
  name: 'DocCateRootAdd',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      modalLoading: false,
      modalData: {
      }
    }
  },
  methods: {
    preCateRootAdd () {
    },
    onSubmit () {
      let that = this
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        let params = { ...this.modalData, ...this.form.getFieldsValue() }
        this.modalLoading = true
        this.$http.post('/api/1/workflow/cate/add_doc_root.json', qs.stringify(params)).then(function () {
          that.$message.success('操作成功')
          that.form.resetFields()
          that.modalLoading = false
          that.$emit('success')
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
