<!--
 Created by Xuz on 2019/02/20.
 xuz[at]live[dot]cn
 岗位添加
-->
<template>
    <a-modal title="添加岗位信息"
             :width="800"
             :visible="visible"
             :maskClosable="false"
             @ok="onAddPosSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading.addPos">
        <a-form :form="addPosForm">
            <a-form-item
                    label='岗位名称'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'name',
                            {rules: [{ required: true, message: '请填写岗位名称' }]}]" placeholder='岗位名称'/>
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
                            'memo',
                            {rules: [{ required: false, message: '请填写描述' }]}]" placeholder='描述'/>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
import qs from 'qs'

export default {
  name: 'PosAdd',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      addPosForm: this.$form.createForm(this),
      modalLoading: {
        addPos: false
      },
      modalData: {
        addPos: {
          parentId: null,
          deptId: null,
          orgId: null
        }
      }
    }
  },
  methods: {
    prePosAdd (deptId) {
      this.modalLoading.addPos = true
      let that = this
      this.$http.get('/api/1/org/get_dept.json?id=' + deptId).then(function (response) {
        const dept = response.result
        that.modalData.addPos.parentId = dept.id
        that.modalData.addPos.deptId = dept.id
        that.modalData.addPos.orgId = dept.orgId
        that.modalLoading.addPos = false
      })
    },
    onAddPosSubmit () {
      let that = this
      this.addPosForm.validateFields((err, values) => {
        if (err) {
          return
        }
        let params = { ...this.modalData.addPos, ...this.addPosForm.getFieldsValue() }
        this.modalLoading.addPos = true
        this.$http.post('/api/1/org/add_pos.json', qs.stringify(params)).then(function () {
          that.$message.success('操作成功')
          that.addPosForm.resetFields()
          that.modalLoading.addPos = false
          that.$emit('success')
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
