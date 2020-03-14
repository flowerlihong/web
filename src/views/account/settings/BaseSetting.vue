<template>
    <div class="account-settings-info-view">
        <a-row :gutter="16">
            <a-col :md="24" :lg="16">
                <a-form :form="form">
                    <a-form-item label="帐号">
                        <a-input disabled placeholder="登录系统帐号" v-decorator="[
                                    'account',
                                    {initialValue:user.account, rules: [{ required: true, message: '请填写帐号' }]}
                                ]"/>
                    </a-form-item>
                    <a-form-item label="姓名">
                        <a-input v-decorator="[
                                    'name',
                                    {initialValue:user.name, rules: [{ required: true, message: '请填写姓名' }]}
                                ]"/>
                    </a-form-item>
                    <a-form-item label="昵称">
                        <a-input v-decorator="[
                                    'nickname',
                                    {initialValue:user.nickname, rules: []}
                                ]"/>
                    </a-form-item>
                    <a-form-item label="邮件">
                        <a-input v-decorator="[
                                    'email',
                                    {initialValue:user.email, rules: [{type: 'email', message: 'Email 格式不正确' }]}
                                ]"/>
                    </a-form-item>
                    <a-form-item label="手机">
                        <a-input v-decorator="[
                                    'mobile',
                                    {initialValue:user.mobile, rules: []}
                                ]"/>
                    </a-form-item>
                    <a-form-item>
                        <a-button type="primary" @click="onSave">提交</a-button>
                    </a-form-item>
                </a-form>
            </a-col>
            <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
                <div class="ant-upload-preview" @click="$refs.modal.edit(1)">
                    <a-icon type="cloud-upload-o" class="upload-icon"/>
                    <div class="mask">
                        <a-icon type="plus"/>
                    </div>
                    <img :src="user.avatar"/>
                </div>
            </a-col>
        </a-row>

        <avatar-modal ref="modal">
        </avatar-modal>
    </div>
</template>

<script>
import AvatarModal from './AvatarModal'
import qs from 'qs'

export default {
  components: {
    AvatarModal
  },
  created () {
    this.loadData()
  },
  data () {
    return {
      form: this.$form.createForm(this),
      user: {
        avatar: '/img/man.png'
      },
      // cropper
      preview: {},
      option: {
        img: ''
      }
    }
  },
  methods: {
    loadData: function () {
      const user = this.$ls.get('user')
      const that = this
      this.$http.get('/api/1/org/get_user.json?id=' + user.id).then(function (response) {
        if (response.code === 200) {
          that.user = response.result
        }
      })
    },
    onSave: function () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        let data = { ...this.form.getFieldsValue() }
        data.id = this.user.id
        data.orgId = this.user.orgId
        data.deptId = this.user.deptId
        data.posId = this.user.posId
        const that = this
        // this.loading = true
        that.$http.post('/api/1/user/edit.json', qs.stringify(data)).then(function (resp) {
          that.loading = false
          if (resp.code !== 200) {
            that.$message.error(resp.msg)
            return
          }
          that.$message.success('修改成功')
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>

    .avatar-upload-wrapper {
        height: 200px;
        width: 100%;
    }

    .ant-upload-preview {
        position: relative;
        margin: 0 auto;
        width: 100%;
        max-width: 180px;
        border-radius: 50%;
        box-shadow: 0 0 4px #ccc;

        .upload-icon {
            display: none;
            position: absolute;
            top: 0;
            right: 10px;
            font-size: 1.4rem;
            padding: 0.5rem;
            background: rgba(222, 221, 221, 0.7);
            border-radius: 50%;
            border: 1px solid rgba(0, 0, 0, 0.2);
        }

        .mask {
            opacity: 0;
            position: absolute;
            background: rgba(0, 0, 0, 0.4);
            cursor: pointer;
            transition: opacity 0.4s;

            &:hover {
                opacity: 1;
            }

            i {
                font-size: 2rem;
                position: absolute;
                top: 50%;
                left: 50%;
                margin-left: -1rem;
                margin-top: -1rem;
                color: #d6d6d6;
            }
        }

        img, .mask {
            width: 100%;
            max-width: 180px;
            height: 100%;
            border-radius: 50%;
            overflow: hidden;
        }
    }
</style>
