<!--
 Created by Xuz on 2019/03/09.
 xuz[at]live[dot]cn
 编辑流程服务
-->
<template>
    <a-modal title="编辑流程服务"
             :width="800"
             :visible="visible"
             :maskClosable="false"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading">
        <template slot="footer">
            <a-button key="back" @click="$emit('cancel')">取消</a-button>
            <a-popconfirm title="是否确认删除?" @confirm="onDelete">
                <a-button key="delete" type="danger">删除</a-button>
            </a-popconfirm>
            <a-button key="submit" type="primary" :loading="modalLoading" @click="onSubmit">确定</a-button>
        </template>
        <a-form :form="form">
            <a-form-item
                    label='分类目录'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <span>{{modalData.extras.osCateName}}</span>
            </a-form-item>
            <a-form-item
                    label='服务名称'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'name',
                            {initialValue:modalData.name, rules: [{ required: true, message: '请填写服务名称' }]}]" placeholder='可执行服务名称'/>
            </a-form-item>
            <a-form-item
                    label='服务类名'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'clazz',
                            {initialValue:modalData.clazz, rules: [{ required: true, message: '请填写服务类名' }]}]" placeholder='可执行服务类名'/>
            </a-form-item>
            <a-form-item
                    label='备注'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'description',
                            {initialValue:modalData.description, rules: [{ required: false, message: '请填写备注' }]}]" placeholder='备注'/>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
import qs from 'qs'

export default {
  name: 'ServiceEdit',
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
        extras: {
          osCateName: null
        }
      },
      opinionTypeList: []
    }
  },
  methods: {
    preServiceEdit (id) {
      this.modalLoading = true
      const that = this
      that.$http.get('/api/1/workflow/cate/get_service.json?id=' + id).then(function (resp) {
        that.modalData = resp.result
        that.modalLoading = false
      })
    },
    onDelete () {
      const that = this
      that.modalLoading = true
      that.$http.post('/api/1/workflow/cate/remove_service.json', qs.stringify({ id: that.modalData.id })).then(function () {
        that.$message.success('操作成功')
        that.modalLoading = false
        that.$emit('success')
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
        this.$http.post('/api/1/workflow/cate/edit_service.json', qs.stringify(params)).then(function () {
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
