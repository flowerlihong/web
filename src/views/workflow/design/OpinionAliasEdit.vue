<!--
 Created by Xuz on 2019/03/09.
 xuz[at]live[dot]cn
 编辑意见类型别名
-->
<template>
    <a-modal title="编辑意见类型别名"
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
                <span>{{modalData.extras.osCateName}}</span>
            </a-form-item>
            <a-form-item
                    label='意见类型别名'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input v-decorator="[
                            'aliasName',
                            {initialValue:modalData.aliasName, rules: [{ required: true, message: '请填写意见类型别名' }]}]" placeholder='意见类型别名'/>
            </a-form-item>
            <a-form-item
                    label='所属意见类型'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-select :options="opinionTypeList" v-decorator="[
                            'opinionTypeId',
                            {initialValue:modalData.opinionTypeId, rules: [{ required: true, message: '请选择所属意见类型' }]}]" placeholder='所属意见类型'/>
            </a-form-item>
            <a-form-item
                    label='顺序号'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input-number v-decorator="[
                                    'seq',
                                    {initialValue:modalData.seq, rules: [{ required: true, type: 'number', message: '请填写数字类型顺序号' }]}]" placeholder='顺序号'/>
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
import qs from 'qs'

export default {
  name: 'OpinionAliasEdit',
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
        opinionTypeId: null,
        extras: {
          osCateName: ''
        }
      },
      opinionTypeList: []
    }
  },
  methods: {
    preOpinionAliasEdit (id) {
      this.modalLoading = true
      const that = this
      that.$http.get('/api/1/workflow/cate/get_opinion_alias.json?id=' + id).then(function (resp) {
        that.modalData = resp.result
        that.modalLoading = false
      })

      that.$http.get('/api/1/workflow/cate/get_opinion_type_list.json').then(function (resp) {
        that.opinionTypeList = that.mapSelectData(resp.result)
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
        this.$http.post('/api/1/workflow/cate/edit_opinion_alias.json', qs.stringify(params)).then(function () {
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
