<!--
 Created by Xuz on 2019/02/20.
 xuz[at]live[dot]cn
 角色编辑
-->
<template>
    <a-modal title="添加角色"
             :width="800"
             :visible="visible"
             :maskClosable="false"
             @ok="onAddRoleSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading.addRole">
        <a-form :form="addRoleForm">
            <a-form-item v-if="(modalData.addRole.parentId != null && modalData.addRole.parentId !== '')"
                         label='上级角色'
                         :labelCol="{ span: 5 }"
                         :wrapperCol="{ span: 12 }">
                {{modalData.addRole.parentName}}
            </a-form-item>
            <a-form-item
                    label='角色名称'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'name',
                            {rules: [{ required: true, message: '请填写角色名称' }]}]" placeholder='角色名称'/>
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
  name: 'RoleAdd',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      addRoleForm: this.$form.createForm(this),
      modalLoading: {
        addRole: false
      },
      modalData: {
        addRole: {
          parentId: null,
          parentName: null
        }
      }
    }
  },
  methods: {
    preRoleAdd (roleId) {
      if (!roleId) {
        this.modalData.addRole.parentId = ''
        return
      }
      this.modalData.addRole.parentId = roleId
      let that = this
      this.$http.get('/api/1/perm/get_role.json?id=' + roleId).then(function (response) {
        that.modalData.addRole.parentName = response.result.name
        that.modalLoading.addRole = false
      })
    },
    onAddRoleSubmit () {
      let that = this
      this.addRoleForm.validateFields((err, values) => {
        if (err) {
          return
        }
        let params = this.addRoleForm.getFieldsValue()
        params.parentId = this.modalData.addRole.parentId
        params.users = ''
        params.RPerm = []

        this.modalLoading.addRole = true
        this.$http.post('/api/1/perm/add_root_role.json', qs.stringify(params)).then(function () {
          that.$message.success('操作成功')
          that.addRoleForm.resetFields()
          that.modalLoading.addRole = false

          that.$emit('success')
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
