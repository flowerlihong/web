<!--
 Created by Xuz on 2019/05/30.
 xuz[at]live[dot]cn
 用户岗位添加
-->
<template>
    <a-modal class="move-pos-modal"
             title="岗位调动"
             :width="440"
             :visible="visible"
             :maskClosable="false"
             @ok="onSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading">
        <a-form :form="form">
            <a-form-item
                    label='原机构'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                {{modalData.org.name}}
            </a-form-item>
            <a-form-item
                    label='原部门'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                {{modalData.dept.name}}
            </a-form-item>
            <a-form-item
                    label='原岗位'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                {{modalData.pos.name}}
            </a-form-item>
            <a-form-item
                    label='新岗位'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }">
                <pos-selector v-decorator="[
                            'posId',
                            {rules: [{ required: true, message: '请选择岗位' }]}]"/>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
import PosSelector from '@/components/selector/PosSelector'
import qs from 'qs'

export default {
  name: 'UserPosMove',
  components: {
    PosSelector
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
        id: null,
        org: {},
        dept: {},
        pos: {}
      }
    }
  },
  methods: {
    preUserPosMove (userId) {
      const that = this
      that.modalLoading = true
      that.modalData.id = userId
      that.$http.get('/api/1/org/get_user.json?id=' + userId).then(function (response) {
        that.modalData = response.result
        that.modalLoading = false
      })
    },
    onSubmit () {
      const that = this
      that.form.validateFields((err, values) => {
        if (err) {
          return
        }
        let params = { ...that.form.getFieldsValue() }
        params.userId = that.modalData.id
        that.modalLoading = true
        that.$http.post('/api/1/org/move_user_pos.json', qs.stringify(params)).then(function () {
          that.$message.success('操作成功')
          that.form.resetFields()
          that.modalLoading = false
          that.$emit('success')
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
    .move-pos-modal .ant-modal-content .ant-modal-body {
        padding-top: 10px !important;
    }

    .ant-form {
        margin-top: -10px !important;
    }

    .ant-form-item {
        margin-bottom: 0 !important;
    }
</style>
