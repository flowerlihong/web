<!--
 Created by Xuz on 2019/03/00.
 xuz[at]live[dot]cn
 编辑意见服务分类目录
-->
<template>
    <a-modal title="编辑分类目录"
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
                            {initialValue:modalData.name, rules: [{ required: true, message: '请填写类别名称' }]}]" placeholder='类别名称'/>
            </a-form-item>
            <a-form-item
                    label='顺序号'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input-number v-decorator="[
                                    'seq',
                                    {initialValue:modalData.seq, rules: [{ required: true, type: 'number', message: '请填写数字类型顺序号' }]}]" placeholder='顺序号'/>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
import qs from 'qs'

export default {
  name: 'CSCateRootEdit',
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
    preCSCateRootEdit (id) {
      const that = this
      that.modalLoading = true
      that.$http.get('/api/1/workflow/cate/get_os_root.json?id=' + id).then(function (resp) {
        that.modalData = resp.result
        that.modalLoading = false
      })
    },
    onSubmit () {
      let that = this
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        let tmp = {
          id: this.modalData.id,
          state: this.modalData.state
        }
        let params = { ...tmp, ...this.form.getFieldsValue() }
        this.modalLoading = true
        this.$http.post('/api/1/workflow/cate/edit_os_root.json', qs.stringify(params)).then(function (data) {
          that.modalLoading = false
          if (data.code === 200) {
            that.$message.success('操作成功')
            that.form.resetFields()
            that.$emit('success')
          }
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
