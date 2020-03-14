<!--
 Created by Xuz on 2019/03/08.
 xuz[at]live[dot]cn
 编辑常用意见
-->
<template>
    <a-modal title="编辑常用意见"
             :width="800"
             :visible="visible"
             :maskClosable="false"
             :confirmLoading="modalLoading"
             @cancel="$emit('cancel')">
        <template slot="footer">
            <a-button key="back" @click="$emit('cancel')">取消</a-button>
            <a-popconfirm title="是否确认删除?" @confirm="onDelete">
                <a-button key="delete" type="danger">删除</a-button>
            </a-popconfirm>
            <a-button key="submit" type="primary" :loading="modalLoading" @click="onSubmit">确定</a-button>
        </template>
        <a-form :form="form">
            <a-form-item
                    label='意见类型'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <span>{{modalData.extras.typeName}}</span>
            </a-form-item>
            <a-form-item
                    label='常用批语'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'defaultValue',
                            {initialValue:modalData.defaultValue, rules: [{ required: true, message: '请填写常用批语' }]}]" placeholder='常用批语'/>
            </a-form-item>
            <a-form-item
                    label='顺序号'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input-number v-decorator="[
                                    'seq',
                                    {initialValue:modalData.seq, rules: [{ required: true, type: 'number', message: '请填写数字类型顺序号' }]}]" placeholder='顺序号'/>
            </a-form-item>
            <a-form-item
                    label='描述'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'description',
                            {initialValue:modalData.description, rules: [{ required: false, message: '请填写描述' }]}]" placeholder='描述'/>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
import qs from 'qs'

export default {
  name: 'OpinionDefaultEdit',
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
        extras: {
          typeName: ''
        }
      }
    }
  },
  methods: {
    preOpinionDefaultEdit (opinionTypeId) {
      this.modalLoading = true
      this.modalData.opinionTypeId = opinionTypeId
      const that = this
      this.$http.get('/api/1/workflow/cate/get_opinion_default.json?id=' + opinionTypeId).then(function (resp) {
        that.modalData = resp.result
        that.modalLoading = false
      })
    },
    onDelete () {
      const that = this
      that.modalLoading = true
      that.$http.post('/api/1/workflow/cate/remove_opinion_default.json', qs.stringify({ id: that.modalData.id })).then(function () {
        that.$message.success('操作成功')
        that.modalLoading = false
        that.$emit('success')
      })
    },
    onSubmit () {
      const that = this
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        let params = { ...this.modalData, ...this.form.getFieldsValue() }
        this.modalLoading = true
        this.$http.post('/api/1/workflow/cate/edit_opinion_default.json', qs.stringify(params)).then(function () {
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
