<!--
 Created by Xuz on 2019/03/09.
 xuz[at]live[dot]cn
 添加流程服务
-->
<template>
    <a-modal title="添加流程服务"
             :width="800"
             :visible="visible"
             :maskClosable="false"
             @ok="onSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading">
        <a-form :form="form">
            <a-form-item
                    label='分类目录'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <span>{{modalData.osCateName}}</span>
            </a-form-item>
            <a-form-item
                    label='服务名称'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'name',
                            {rules: [{ required: true, message: '请填写服务名称' }]}]" placeholder='可执行服务名称'/>
            </a-form-item>
            <a-form-item
                    label='服务类名'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'clazz',
                            {rules: [{ required: true, message: '请填写服务类名' }]}]" placeholder='可执行服务类名'/>
            </a-form-item>
            <a-form-item
                    label='备注'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'description',
                            {rules: [{ required: false, message: '请填写备注' }]}]" placeholder='备注'/>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
import qs from 'qs'

export default {
  name: 'ServiceAdd',
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
        osCateId: null,
        osCateName: null
      },
      opinionTypeList: []
    }
  },
  methods: {
    preServiceAdd (osCateId) {
      this.modalLoading = true
      this.modalData.osCateId = osCateId
      const that = this
      that.$http.get('/api/1/workflow/cate/get_os_root.json?id=' + osCateId).then(function (resp) {
        that.modalData.osCateName = resp.result.name
        that.modalLoading = false
      })
    },
    onSubmit () {
      let that = this
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        let params = { ...this.modalData, ...this.form.getFieldsValue() }
        this.modalLoading = true
        this.$http.post('/api/1/workflow/cate/add_service.json', qs.stringify(params)).then(function () {
          that.$message.success('操作成功')
          that.form.resetFields()
          that.modalLoading = false
          that.$emit('success')
        })
      })
    },
    mapSelectData (list) {
      return list.map(item => {
        return {
          value: item.id,
          label: item.typeValue
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
