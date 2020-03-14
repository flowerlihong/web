<!--
 Created by Xuz on 2019/02/20.
 xuz[at]live[dot]cn
 岗位编辑
-->
<template>
    <a-modal title="编辑岗位信息"
             :width="800"
             :visible="visible"
             :maskClosable="false"
             @ok="onEditPosSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading.editPos">
        <a-form :form="editPosForm">
            <a-form-item
                    label='岗位名称'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'name',
                            {initialValue:modalData.editPos.name, rules: [{ required: true, message: '请填写岗位名称' }]}]" placeholder='岗位名称'/>
            </a-form-item>
            <a-form-item
                    label='顺序号'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input-number v-decorator="[
                                    'sort',
                                    {initialValue:modalData.editPos.sort, rules: [{ required: true, type: 'number', message: '请填写数字类型顺序号' }]}]" placeholder='顺序号'/>
            </a-form-item>
            <a-form-item
                    label='描述'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'memo',
                            {initialValue:modalData.editPos.memo, rules: [{ required: false, message: '请填写描述' }]}]" placeholder='描述'/>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
import qs from 'qs'

export default {
  name: 'PosEdit',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editPosForm: this.$form.createForm(this),
      modalLoading: {
        editPos: false
      },
      modalData: {
        editPos: {
          id: null,
          parentId: null,
          deptId: null,
          orgId: null,
          name: null
        }
      }
    }
  },
  methods: {
    prePosEdit (posId) {
      this.modalLoading.editPos = true
      let that = this
      this.$http.get('/api/1/org/get_pos.json?id=' + posId).then(function (response) {
        let pos = response.result
        that.modalData.editPos = { ...that.modalData.editPos, ...pos }
        that.modalLoading.editPos = false
      })
    },
    onEditPosSubmit () {
      let that = this
      this.editPosForm.validateFields((err, values) => {
        if (err) {
          return
        }
        let params = { ...this.modalData.editPos, ...this.editPosForm.getFieldsValue() }
        this.modalLoading.editPos = true
        this.$http.post('/api/1/org/edit_pos.json', qs.stringify(params)).then(function () {
          that.$message.success('操作成功')
          that.editPosForm.resetFields()
          that.modalLoading.editPos = false
          that.$emit('success')
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
