<!--
 Created by Xuz on 2019/05/30.
 xuz[at]live[dot]cn
 用户岗位添加
-->
<template>
    <a-modal title="添加职位关联"
             :width="440"
             :visible="visible"
             :maskClosable="false"
             @ok="onSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading">
        <a-form :form="form">
            <a-form-item
                    label='岗位类型'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-radio-group v-decorator="['type', {initialValue:'2'}]">
                    <a-radio value="2">分管</a-radio>
                    <a-radio value="3">兼职</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item
                    label='岗位'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <pos-selector v-decorator="[
                            'posId',
                            {rules: [{ required: true, message: '请选择岗位' }]}]"/>
            </a-form-item>
            <a-form-item
                    label='职务'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <dict-cascader v-decorator="['duty']" dictKey="HR.POS"/>
            </a-form-item>
            <a-form-item
                    label='顺序号'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <a-input-number v-decorator="[
                                    'seq',
                                    {rules: [{ required: true, type: 'number', message: '请填写数字类型顺序号' }]}]" placeholder='顺序号'/>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
import PosSelector from '@/components/selector/PosSelector'
import DictCascader from '@/components/dict/DictCascader'
import qs from 'qs'

export default {
  name: 'UserPosAdd',
  components: {
    PosSelector,
    DictCascader
  },
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
        userId: null
      }
    }
  },
  methods: {
    preUserPosAdd (userId) {
      const that = this
      that.modalLoading = false
      that.modalData.userId = userId
    },
    onSubmit () {
      const that = this
      that.form.validateFields((err, values) => {
        if (err) {
          return
        }
        let params = { ...this.modalData, ...this.form.getFieldsValue() }
        that.modalLoading = true
        that.$http.post('/api/1/org/add_user_pos.json', qs.stringify(params)).then(function (resp) {
          that.modalLoading = false
          if (resp.code !== 200) {
            return
          }
          that.$message.success('操作成功')
          that.form.resetFields()
          that.$emit('success')
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
