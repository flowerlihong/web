<!--
 Created by Xuz on 2019/03/08.
 xuz[at]live[dot]cn
 添加常用意见
-->
<template>
    <a-modal title="添加常用意见"
             :width="800"
             :visible="visible"
             :maskClosable="false"
             @ok="onSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading">
        <a-form :form="form">
            <a-form-item
                    label='意见类型'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <span>{{modalData.opinionTypeName}}</span>
            </a-form-item>
            <a-form-item
                    label='常用批语'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'defaultValue',
                            {rules: [{ required: true, message: '请填写常用批语' }]}]" placeholder='常用批语'/>
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
  name: 'OpinionDefaultAdd',
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
        opinionTypeId: null,
        opinionTypeName: null
      }
    }
  },
  methods: {
    preOpinionDefaultAdd (opinionTypeId) {
      this.modalLoading = true
      this.modalData.opinionTypeId = opinionTypeId
      const that = this
      this.$http.get('/api/1/workflow/cate/get_opinion_type.json?id=' + opinionTypeId).then(function (resp) {
        that.modalData.opinionTypeName = resp.result.typeValue
        that.modalLoading = false
      })
    },
    onSubmit () {
      let that = this
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        let params = { ...this.modalData, ...this.form.getFieldsValue() }
        this.modalLoading = true
        this.$http.post('/api/1/workflow/cate/add_opinion_default.json', qs.stringify(params)).then(function () {
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
