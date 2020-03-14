<!--
 Created by Xuz on 2019/02/20.
 xuz[at]live[dot]cn
 部门添加
-->
<template>
    <a-modal title="添加部门信息"
             :width="800"
             :visible="visible"
             :maskClosable="false"
             @ok="onAddDeptSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading.addDept">
        <a-form :form="addDeptForm">
            <a-form-item
                    label='所属机构'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <span>{{modalData.addDept.orgName}}</span>
            </a-form-item>
            <a-form-item
                    label='部门名称'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'name',
                            {rules: [{ required: true, message: '请填写部门名称' }]}]" placeholder='部门名称'/>
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
                    :wrapperCol="{ span: 12 }"
                    fieldDecoratorId="memo">
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
  name: 'DeptAdd',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      addDeptForm: this.$form.createForm(this),
      modalLoading: {
        addDept: false
      },
      modalData: {
        addDept: {
          orgId: null,
          orgName: null
        }
      }
    }
  },
  methods: {
    preDeptAdd (orgId) {
      this.modalLoading.addDept = true
      this.modalData.addDept.orgId = orgId
      let that = this
      this.$http.get('/api/1/org/get_org.json?id=' + orgId).then(function (response) {
        that.modalData.addDept.orgName = response.result.name
        that.modalLoading.addDept = false
      })
    },
    onAddDeptSubmit () {
      let that = this
      this.addDeptForm.validateFields((err, values) => {
        if (err) {
          return
        }
        let params = this.addDeptForm.getFieldsValue()
        params.parentId = this.modalData.addDept.orgId
        this.modalLoading.addDept = true
        that.$http.post('/api/1/org/add_dept.json', qs.stringify(params)).then(function () {
          that.$message.success('操作成功')
          that.addDeptForm.resetFields()
          that.modalLoading.addDept = false

          that.$emit('success')
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
