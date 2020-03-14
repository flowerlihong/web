<!--
 Created by Xuz on 2019/03/08.
 xuz[at]live[dot]cn
 编辑意见类型
-->
<template>
    <a-modal title="编辑意见类型"
             :width="800"
             :visible="visible"
             :maskClosable="false"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading">
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
                <a-input v-decorator="[
                            'typeValue',
                            {initialValue:modalData.typeValue, rules: [{ required: true, message: '请填写意见类型' }]}]" placeholder='意见类型'/>
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
  name: 'OpinionTypeAdd',
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
    preOpinionTypeEdit (id) {
      const that = this
      that.modalLoading = true
      that.$http.get('/api/1/workflow/cate/get_opinion_type.json?id=' + id).then(function (resp) {
        that.modalData = resp.result
        that.modalLoading = false
      })
    },
    onDelete () {
      const that = this
      that.modalLoading = true
      that.$http.post('/api/1/workflow/cate/remove_opinion_type.json', qs.stringify({ id: that.modalData.id })).then(function () {
        that.$message.success('操作成功')
        that.modalLoading = false
        that.$emit('success')
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
        this.$http.post('/api/1/workflow/cate/edit_opinion_type.json', qs.stringify(params)).then(function () {
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
