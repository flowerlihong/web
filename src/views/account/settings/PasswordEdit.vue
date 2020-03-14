<template>
    <a-modal
            :visible="visible"
            title='修改密码'
            @cancel="() => { $emit('cancel') }"
            @ok="onSave">
        <a-form layout='vertical' :form="form">
            <a-form-item label='当前密码'>
                <a-input type="password"
                         v-decorator="['currentPassword', {rules: [{ required: true, message: '请输入当前密码' }]}]"/>
            </a-form-item>
            <a-form-item label='新密码'>
                <a-input type="password" v-decorator="['password', {rules: [{ required: true, message: '请输入新密码' }, { min: 6, message: '长度不能小于6位' }]}]"/>
            </a-form-item>
            <a-form-item label='确认密码'>
                <a-input type="password" v-decorator="['password2', {rules: [{ required: true, message: '请再次输入新密码' }, { min: 6, message: '长度不能小于6位' }]}]"/>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
import qs from 'qs'

export default {
  name: 'PasswordEdit',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    onSave: function () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        const that = this
        that.loading = true
        const data = { ...this.form.getFieldsValue() }
        that.$http.post('/api/1/user/edit_password.json', qs.stringify(data)).then(function (response) {
          if (response.code === 200) {
            that.loading = false
            that.form.resetFields()
            that.$message.success('修改成功')
            that.$emit('success')
          }
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
