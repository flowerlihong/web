<!--
 Created by Xuz on 2019/02/21.
 xuz[at]live[dot]cn
 机构编辑
-->
<template>
    <a-modal title="编辑机构信息"
             :width="800"
             :visible="visible"
             :maskClosable="false"
             @ok="onEditOrgSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading.editOrg">
        <a-form :form="editOrgForm">
            <a-form-item
                    label='机构名称'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'name',
                            {initialValue:modalData.editOrg.name, rules: [{ required: true, message: '请填写机构名称' }]}]" placeholder='机构名称'/>
            </a-form-item>
            <a-form-item
                    label='顺序号'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input-number v-decorator="[
                                    'sort',
                                    {initialValue:modalData.editOrg.sort, rules: [{ required: true, type: 'number', message: '请填写数字类型顺序号' }]}]" placeholder='顺序号'/>
            </a-form-item>
            <a-form-item
                    label='简称'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'aliasName',
                            {initialValue:modalData.editOrg.aliasName, rules: [{ required: false, message: '请填写简称' }]}]" placeholder='简称'/>
            </a-form-item>
            <a-form-item
                    label='缩写'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'enAbbr',
                            {initialValue:modalData.editOrg.enAbbr, rules: [{ required: false, message: '请填写缩写' }]}]" placeholder='缩写'/>
            </a-form-item>
            <a-form-item
                    label='机构编码'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'code',
                            {initialValue:modalData.editOrg.code, rules: [{ required: false, message: '请填写机构编码' }]}]" placeholder='机构编码'/>
            </a-form-item>
            <a-form-item
                    label='描述'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'memo',
                            {initialValue:modalData.editOrg.memo, rules: [{ required: false, message: '请填写描述' }]}]" placeholder='描述'/>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
import qs from 'qs'

export default {
  name: 'OrgEdit',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editOrgForm: this.$form.createForm(this),
      modalLoading: {
        editOrg: false
      },
      modalData: {
        editOrg: {
          id: null,
          parentId: null
        }
      }
    }
  },
  methods: {
    preOrgEdit (orgId) {
      this.modalLoading.editOrg = true
      this.modalData.editOrg.id = orgId
      let that = this
      this.$http.get('/api/1/org/get_org.json?id=' + orgId).then(function (response) {
        let org = response.result
        that.modalLoading.editOrg = false

        that.modalData.editOrg.id = org.id
        that.modalData.editOrg.parentId = org.parentId
        that.editOrgForm.setFieldsValue({
          name: org.name,
          sort: org.sort,
          aliasName: org.aliasName,
          enAbbr: org.enAbbr,
          code: org.code,
          memo: org.memo
        })
      })
    },
    onEditOrgSubmit () {
      let that = this
      this.editOrgForm.validateFields((err, values) => {
        if (err) {
          return
        }
        let params = this.editOrgForm.getFieldsValue()
        params.id = this.modalData.editOrg.id
        params.parentId = this.modalData.editOrg.parentId
        this.modalLoading.editOrg = true
        this.$http.post('/api/1/org/edit_org.json', qs.stringify(params)).then(function () {
          that.$message.success('操作成功')
          that.editOrgForm.resetFields()
          that.modalLoading.editOrg = false

          that.$emit('success')
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
