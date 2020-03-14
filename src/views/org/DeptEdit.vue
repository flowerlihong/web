<!--
 Created by Xuz on 2019/02/21.
 xuz[at]live[dot]cn
 部门编辑
-->
<template>
    <a-modal title="编辑部门信息"
             :width="800"
             :visible="visible"
             :maskClosable="false"
             @ok="onEditDeptSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading.editDept">
        <a-form :form="editDeptForm">
            <a-form-item
                    label='所属机构'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <span>{{modalData.editDept.orgName}}</span>
            </a-form-item>
            <a-form-item
                    label='部门名称'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'name',
                            {initialValue:modalData.editDept.name, rules: [{ required: true, message: '请填写部门名称' }]}]" placeholder='部门名称'/>
            </a-form-item>
            <a-form-item
                    label='顺序号'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input-number v-decorator="[
                                    'sort',
                                    {initialValue:modalData.editDept.sort, rules: [{ required: true, type: 'number', message: '请填写数字类型顺序号' }]}]" placeholder='顺序号'/>
            </a-form-item>
            <a-form-item
                    label='描述'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'memo',
                            {initialValue:modalData.editDept.memo, rules: [{ required: false, message: '请填写描述' }]}]" placeholder='描述'/>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
import qs from 'qs'

export default {
  name: 'DeptEdit',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editDeptForm: this.$form.createForm(this),
      modalLoading: {
        editDept: false
      },
      modalData: {
        editDept: {
          id: null,
          orgId: null,
          orgName: null
        }
      }
    }
  },
  methods: {
    preDeptEdit (orgId, deptId) {
      this.modalLoading.editDept = true
      this.modalData.editDept.orgId = orgId
      this.modalData.editDept.id = deptId
      let that = this

      Promise.all([
        this.$http.get('/api/1/org/get_org.json?id=' + orgId),
        this.$http.get('/api/1/org/get_dept.json?id=' + deptId)
      ]).then(function ([respOrg, respDept]) {
        let org = respOrg.result
        let dept = respDept.result
        that.modalData.editDept.orgName = org.name
        that.modalLoading.editDept = false

        that.editDeptForm.setFieldsValue({ name: dept.name, sort: dept.sort, memo: dept.memo })
      })
    },
    onEditDeptSubmit () {
      let that = this
      this.editDeptForm.validateFields((err, values) => {
        if (err) {
          return
        }
        let params = this.editDeptForm.getFieldsValue()
        params.id = this.modalData.editDept.id
        params.parentId = this.modalData.editDept.orgId
        this.modalLoading.editDept = true
        that.$http.post('/api/1/org/edit_dept.json', qs.stringify(params)).then(function () {
          that.$message.success('操作成功')
          that.editDeptForm.resetFields()
          that.modalLoading.editDept = false

          that.$emit('success')
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
