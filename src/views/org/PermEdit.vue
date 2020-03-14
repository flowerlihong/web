<!--
 Created by Xuz on 2019/02/20.
 xuz[at]live[dot]cn
 权限编辑
-->
<template>
    <a-modal title="编辑权限"
             :width="800"
             :visible="visible"
             :maskClosable="false"
             @ok="onEditPermSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading.editPerm">
        <a-form :form="editPermForm">
            <a-form-item v-if="modalData.editPerm.parentId !== ''"
                         label='上级权限'
                         :labelCol="{ span: 5 }"
                         :wrapperCol="{ span: 12 }">
                {{modalData.editPerm.parentName}}
            </a-form-item>
            <a-form-item
                    label='权限名称'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'name',
                            {initialValue:modalData.editPerm.name, rules: [{ required: true, message: '请填写权限名称' }]}]" placeholder='权限名称'/>
            </a-form-item>
            <a-form-item
                    label='关键字'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'keyword',
                            {initialValue:modalData.editPerm.keyword, rules: [{ required: true, message: '请填写关键字' }]}]" placeholder='关键字'/>
            </a-form-item>
            <a-form-item
                    label='顺序号'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input-number v-decorator="[
                                    'sort',
                                    {initialValue:modalData.editPerm.sort, rules: [{ required: true, type: 'number', message: '请填写数字类型顺序号' }]}]" placeholder='顺序号'/>
            </a-form-item>
            <a-form-item
                    label='描述'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'description',
                            {initialValue:modalData.editPerm.description, rules: [{ required: false, message: '请填写描述' }]}]" placeholder='描述'/>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
import qs from 'qs'

export default {
  name: 'PermEdit',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editPermForm: this.$form.createForm(this),
      modalLoading: {
        editPerm: false
      },
      modalData: {
        editPerm: {
          id: null,
          parentId: null,
          parentName: null
        }
      }
    }
  },
  methods: {
    prePermEdit (permId) {
      const that = this
      this.modalLoading.editPerm = true
      this.$http.get('/api/1/perm/get_perm.json?id=' + permId).then(function (response) {
        let perm = response.result
        that.modalData.editPerm.id = perm.id
        that.modalData.editPerm.parentId = perm.parentId
        that.editPermForm.setFieldsValue({ name: perm.name, keyword: perm.keyword, sort: perm.sort, description: perm.description })

        that.modalLoading.editPerm = false

        if (perm.parentId !== '') {
          that.$http.get('/api/1/perm/get_perm.json?id=' + perm.parentId).then(function (response) {
            let perm = response.result
            that.modalData.editPerm.parentName = perm.name
          })
        }
      })
    },
    onEditPermSubmit () {
      let that = this
      this.editPermForm.validateFields((err, values) => {
        if (err) {
          return
        }
        let params = this.editPermForm.getFieldsValue()
        params.id = this.modalData.editPerm.id
        params.parentId = this.modalData.editPerm.parentId
        params.deptId = this.modalData.editPerm.deptId
        params.orgId = this.modalData.editPerm.orgId
        this.modalLoading.editPerm = true
        this.$http.post('/api/1/perm/edit_perm.json', qs.stringify(params)).then(function () {
          that.$message.success('操作成功')
          that.editPermForm.resetFields()
          that.modalLoading.editPerm = false
          that.$emit('success')
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
