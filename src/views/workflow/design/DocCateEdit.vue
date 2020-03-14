<!--
 Created by Xuz on 2019/03/05.
 xuz[at]live[dot]cn
 编辑文档类别
-->
<template>
    <a-modal title="编辑文档类别"
             :width="800"
             :visible="visible"
             :maskClosable="false"
             @ok="onSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading">
        <a-form :form="form">
            <a-form-item
                    label='所属目录'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <span>{{modalData.extras.parentName}}</span>
            </a-form-item>
            <a-form-item
                    label='类别名称'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'name',
                            {initialValue:modalData.name, rules: [{ required: true, message: '请填写类别名称' }]}]" placeholder='类别名称'/>
            </a-form-item>
            <a-form-item
                    label='流水号'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-select allowClear :options="fileNoList" v-decorator="[
                            'fileNoId',
                            {initialValue:modalData.fileNoId}
                            ]"/>
            </a-form-item>
            <a-form-item
                    label='管理角色'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-select allowClear :options="roleList" v-decorator="[
                            'manageRoleId',
                            {initialValue:modalData.manageRoleId}]"/>
            </a-form-item>
            <a-form-item
                    label='查看页面'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'url',
                            {initialValue:modalData.url, rules: [{ required: true, message: '请填写查看页面路径' }]}]" placeholder='查看页面路径'/>
            </a-form-item>
            <a-form-item
                    label='描述'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'description',
                            {initialValue:modalData.description, rules: [{ required: false, message: '请填写描述' }]}]" placeholder='描述'/>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
import axios from 'axios'
import qs from 'qs'

export default {
  name: 'DocCateEdit',
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
      fileNoList: [],
      roleList: [],
      modalData: {
        extras: {
          parentName: ''
        }
      }
    }
  },
  methods: {
    preCateEdit (id) {
      this.modalLoading = true
      const that = this
      axios.all([
        that.$http.get('/api/1/workflow/cate/get_fileno_list.json'),
        that.$http.get('/api/1/perm/role_flat_list.json'),
        that.$http.get('/api/1/workflow/cate/get_doc.json?id=' + id)
      ]).then(axios.spread((resp0, resp1, resp2) => {
        that.fileNoList = that.mapSelectData(resp0.result)
        that.roleList = that.mapSelectData(resp1.result)
        that.modalData = resp2.result
        that.modalLoading = false
      }))
    },
    onSubmit () {
      let that = this
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        let params = { ...this.modalData, ...this.form.getFieldsValue() }
        this.modalLoading = true
        this.$http.post('/api/1/workflow/cate/edit_doc.json', qs.stringify(params)).then(function () {
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
          label: item.name
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
