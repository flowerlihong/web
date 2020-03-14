<!--
 Created by Xuz on 2019/02/21.
 xuz[at]live[dot]cn
 机构添加
-->
<template>
    <a-modal title="添加机构信息"
             :width="800"
             :visible="visible"
             :maskClosable="false"
             @ok="onAddOrgSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading.addOrg">
        <a-form :form="addOrgForm">
            <a-form-item v-if="modalData.addOrg.parentId != null"
                         label='上级机构'
                         :labelCol="{ span: 5 }"
                         :wrapperCol="{ span: 12 }">
                {{modalData.addOrg.parentName}}
            </a-form-item>
            <a-form-item
                    label='机构名称'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'name',
                            {rules: [{ required: true, message: '请填写机构名称' }]}]" placeholder='机构名称'/>
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
                    label='简称'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'aliasName',
                            {rules: [{ required: false, message: '请填写简称' }]}]" placeholder='简称'/>
            </a-form-item>
            <a-form-item
                    label='缩写'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }"
                    fieldDecoratorId="enAbbr">
                <a-input v-decorator="[
                            'enAbbr',
                            {rules: [{ required: false, message: '请填写缩写' }]}]" placeholder='缩写'/>
            </a-form-item>
            <a-form-item
                    label='机构编码'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }"
                    fieldDecoratorId="code">
                <a-input v-decorator="[
                            'code',
                            {rules: [{ required: false, message: '请填写机构编码' }]}]" placeholder='机构编码'/>
            </a-form-item>
            <a-form-item
                    label='描述'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'memo',
                            {rules: [{ required: false, message: '请填写描述' }]}]" placeholder='描述'/>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
import qs from 'qs'

export default {
  name: 'OrgAdd',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      addOrgForm: this.$form.createForm(this),
      modalLoading: {
        addOrg: false
      },
      modalData: {
        addOrg: {
          parentId: null,
          parentName: null
        }
      }
    }
  },
  methods: {
    preOrgAdd (parentId) {
      if (!parentId) {
        this.modalData.addOrg.parentId = null
        return
      }

      this.modalLoading.addOrg = true
      this.modalData.addOrg.parentId = parentId
      let that = this
      this.$http.get('/api/1/org/get_org.json?id=' + parentId).then(function (response) {
        let org = response.result
        that.modalLoading.addOrg = false
        that.modalData.addOrg.parentId = org.id
        that.modalData.addOrg.parentName = org.name
      })
    },
    onAddOrgSubmit () {
      let that = this
      this.addOrgForm.validateFields((err, values) => {
        if (err) {
          return
        }
        let url = '/api/1/org/add_root_org.json'
        if (this.modalData.addOrg.parentId != null) {
          url = '/api/1/org/add_sub_org.json'
        }
        let params = this.addOrgForm.getFieldsValue()
        params.parentId = this.modalData.addOrg.parentId
        this.modalLoading.addOrg = true
        that.$http.post(url, qs.stringify(params)).then(function () {
          that.$message.success('操作成功')
          that.addOrgForm.resetFields()
          that.modalLoading.addOrg = false

          that.$emit('success')
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
