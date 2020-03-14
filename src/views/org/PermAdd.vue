<!--
 Created by Xuz on 2019/02/20.
 xuz[at]live[dot]cn
 权限添加
-->
<template>
    <a-modal title="添加权限"
             :width="800"
             :visible="visible"
             :maskClosable="false"
             @ok="onAddPermSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading.addPerm">
        <a-form :form="addPermForm">
            <a-form-item v-if="modalData.addPerm.parentId !== ''"
                         label='上级权限'
                         :labelCol="{ span: 5 }"
                         :wrapperCol="{ span: 12 }">
                {{modalData.addPerm.parentName}}
            </a-form-item>
            <a-form-item
                    label='权限名称'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'name',
                            {rules: [{ required: true, message: '请填写权限名称' }]}]" placeholder='权限名称'/>
            </a-form-item>
            <a-form-item
                    label='关键字'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'keyword',
                            {rules: [{ required: true, message: '请填写关键字' }]}]" placeholder='关键字'/>
            </a-form-item>
            <a-form-item
                    label='顺序号'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input-number v-decorator="[
                                    'sort',
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
  name: 'PermAdd',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      addPermForm: this.$form.createForm(this),
      modalLoading: {
        addPerm: false
      },
      modalData: {
        addPerm: {
          parentId: null,
          parentName: null
        }
      }
    }
  },
  methods: {
    prePermAdd (permId) {
      if (!permId) {
        this.modalData.addPerm.parentId = ''
        return
      }
      this.modalLoading.addPerm = true
      this.modalData.addPerm.parentId = permId
      let that = this
      this.$http.get('/api/1/perm/get_perm.json?id=' + permId).then(function (response) {
        that.modalData.addPerm.parentName = response.result.name
        that.modalLoading.addPerm = false
      })
    },
    onAddPermSubmit () {
      let that = this
      this.addPermForm.validateFields((err, values) => {
        if (err) {
          return
        }
        let params = this.addPermForm.getFieldsValue()
        params.parentId = this.modalData.addPerm.parentId
        this.modalLoading.addPerm = true
        let url = '/api/1/perm/add_root_perm.json'
        if (this.modalData.addPerm.parentId !== '') {
          url = '/api/1/perm/add_sub_perm.json'
        }
        this.$http.post(url, qs.stringify(params)).then(function () {
          that.$message.success('操作成功')
          that.addPermForm.resetFields()
          that.modalLoading.addPerm = false
          that.$emit('success')
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
