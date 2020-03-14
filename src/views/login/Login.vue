<template>
    <div id="auth">
        <div class="container">
            <div class="content">
                <div class="top">
                    <div class="header">
                        <img alt="logo" class="logo" src="/img/logo.png" />
                        <br/>
                        <span class="title">{{systemName}}</span>
                    </div>
                    <div class="desc">协同办公管理系统</div>
                </div>
                <div class="login">
                    <a-form :form="form" @submit="onSubmit">
                        <a-tabs size="large" :tabBarStyle="{textAlign: 'center'}" style="padding: 0 2px;">
                            <a-tab-pane tab="账户密码登录" key="1">
                                <a-alert type="error" v-show="error" :message="error" showIcon style="margin-bottom: 24px;" />
                                <a-form-item>
                                    <a-input size="large" placeholder="账号" autofocus v-decorator="['name', {rules: [{ required: true, message: '请输入账号', whitespace: true}]}]">
                                        <a-icon slot="prefix" type="user" />
                                    </a-input>
                                </a-form-item>
                                <a-form-item>
                                    <a-input size="large" placeholder="密码" type="password" v-decorator="['password', {rules: [{ required: true, message: '请输入密码', whitespace: true}]}]">
                                        <a-icon slot="prefix" type="lock" />
                                    </a-input>
                                </a-form-item>
                            </a-tab-pane>
                            <a-tab-pane v-if="false" tab="手机号登录" key="2">
                                <a-form-item>
                                    <a-input size="large" placeholder="手机号码" >
                                        <a-icon slot="prefix" type="mobile" />
                                    </a-input>
                                </a-form-item>
                                <a-form-item>
                                    <a-row :gutter="8" style="margin: 0 -4px">
                                        <a-col :span="16">
                                            <a-input size="large" placeholder="验证码">
                                                <a-icon slot="prefix" type="mail" />
                                            </a-input>
                                        </a-col>
                                        <a-col :span="8" style="padding-left: 4px">
                                            <a-button style="width: 100%" class="captcha-button" size="large">获取验证码</a-button>
                                        </a-col>
                                    </a-row>
                                </a-form-item>
                            </a-tab-pane>
                        </a-tabs>
                        <div style="display:none;">
                            <a-checkbox @change="onChangeRememberMe">自动登录</a-checkbox>
                            <a style="display:none;float:right">忘记密码</a>
                        </div>
                        <a-form-item>
                            <a-button :loading="logging" style="width: 100%;margin-top: 24px" size="large" htmlType="submit" type="primary">登录</a-button>
                        </a-form-item>
                    </a-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  computed: {
    systemName () {
      return '翼迅科技'
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      rememberMe: false,
      logging: false,
      error: '',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    onChangeRememberMe (e) {
      this.rememberMe = e.target.checked
    },
    onSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        this.logging = true
        let data = {
          account: this.form.getFieldValue('name'),
          password: this.form.getFieldValue('password'),
          rememberMe: this.rememberMe ? '1' : '0'
        }
        this.$store.dispatch('Login', data).then(() => {
          this.logging = false
          this.$router.push({ path: this.redirect || '/dashboard' })
        }).catch((error) => {
          this.logging = false
          this.error = error.message
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
    .container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow: auto;
        background: #f0f2f5 url(~@/assets/background.svg) no-repeat center 50%;
        background-size: 100%;
        .content {
            padding: 32px 0;
            flex: 1;
            .top {
                text-align: center;
                .header {
                    a {
                        text-decoration: none;
                    }
                    .logo {
                        height: 100px;
                        vertical-align: top;
                    }
                    .title {
                        font-size: 33px;
                        color: rgba(0,0,0,.85);
                        font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
                        font-weight: 600;
                        position: relative;
                        top: 2px;
                    }
                }
                .desc {
                    font-size: 14px;
                    color: rgba(0,0,0,.45);
                    margin-top: 12px;
                    margin-bottom: 20px;
                }
            }
            .login{
                width: 368px;
                margin: 0 auto;
                .icon {
                    font-size: 24px;
                    color: rgba(0, 0, 0, 0.2);
                    margin-left: 16px;
                    vertical-align: middle;
                    cursor: pointer;
                    transition: color 0.3s;

                    &:hover {
                        color: #1890ff;
                    }
                }
            }
        }
    }
</style>
