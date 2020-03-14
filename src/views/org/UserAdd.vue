<!--
 Created by Xuz on 2019/02/19.
 xuz[at]live[dot]cn
 用户添加
-->
<template>
    <a-modal title="添加用户"
             :width="960"
             :visible="visible"
             :maskClosable="false"
             @ok="onAddUserSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading.addUser"
             destroyOnClose
             class="user-form">
        <a-form :form="addUserForm">
            <a-tabs size="small">
            <a-tab-pane tab="帐号信息" key="1">
            <a-row>
                <a-col :span="12">
                    <a-form-item label='所属机构' v-bind="formItemLayout">
                        {{modalData.addUser.orgName}}
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label='所属部门' v-bind="formItemLayout">
                        <a-select v-decorator="[
                                    'deptId',
                                    {rules: [{ required: true, message: '请选择所属部门' }]}
                                ]" @change="onAddUserDeptChange">
                            <a-select-option v-for="item in modalData.addUser.deptList" :key="item.id">{{item.name}}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
                <a-row>
                <a-col :span="12">
                    <a-form-item label='所属岗位' v-bind="formItemLayout">
                        <a-select v-decorator="[
                                    'posId',
                                    {rules: [{ required: true, message: '请选择所属岗位' }]}
                                ]">
                            <a-select-option v-for="item in modalData.addUser.posList" :key="item.id">{{item.name}}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label='顺序号' v-bind="formItemLayout">
                        <a-input-number v-decorator="[
                                    'seq',
                                    {rules: [{ required: true, type: 'number', message: '请填写数字类型顺序号' }]}
                                ]" placeholder='顺序号'/>
                    </a-form-item>
                </a-col>
                </a-row>
                <a-row>
                <a-col :span="12">
                    <a-form-item label='帐号名' v-bind="formItemLayout">
                        <a-input v-decorator="[
                                    'account',
                                    {rules: [{ required: true, message: '请填写帐号' }]}
                                ]" placeholder='登录使用'/>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label='姓名' v-bind="formItemLayout">
                        <a-input v-decorator="[
                                    'name',
                                    {rules: [{ required: true, message: '请填写姓名' }]}
                                ]" placeholder='姓名'/>
                    </a-form-item>
                </a-col>
                </a-row>
                <a-row>
                <a-col :span="12">
                    <a-form-item label='密码' v-bind="formItemLayout">
                        <a-input v-decorator="[
                                    'password',
                                    {rules: [{ required: true, message: '请填写密码' }]}
                                ]" type='password' placeholder='密码'/>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label='确认密码' v-bind="formItemLayout">
                        <a-input v-decorator="[
                                    'password2',
                                    {rules: [{ required: true, message: '请再次填写密码' }]}
                                ]" type='password' placeholder='确认密码'/>
                    </a-form-item>
                </a-col>
                </a-row>
                <a-row>
                <a-col :span="12">
                    <a-form-item label='邮箱' v-bind="formItemLayout">
                        <a-input v-decorator="[
                                    'email',
                                    {rules: [{ required: false, message: '请填写邮箱' }, {type: 'email', message: 'Email 格式不正确' }]}
                                ]" placeholder='邮箱'/>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label='手机' v-bind="formItemLayout">
                        <a-input v-decorator="[
                                    'mobile',
                                    {rules: [{ required: false, message: '请填写手机号码' }]}
                                ]" placeholder='手机号码'/>
                    </a-form-item>
                </a-col>
            </a-row>
            </a-tab-pane>
            <a-tab-pane tab="基本资料" key="2">
                <a-row>
                    <a-col :span="12">
                        <a-form-item label='性别' v-bind="formItemLayout">
                            <a-radio-group v-decorator="['sex']">
                                <a-radio value="1">男</a-radio>
                                <a-radio value="0">女</a-radio>
                            </a-radio-group>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='出生日期' v-bind="formItemLayout">
                            <a-date-picker v-decorator="['birthday']" placeholder='出生日期'/>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="12">
                        <a-form-item label='工作电话' v-bind="formItemLayout">
                            <a-input v-decorator="['workPhone']" placeholder='工作电话'/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label='入职日期' v-bind="formItemLayout">
                            <a-date-picker v-decorator="['hireDate']" placeholder='入职日期'/>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="24">
                        <a-form-item
                                label='参加工作时间'
                                :labelCol="{ span: 3 }"
                                :wrapperCol="{ span: 18 }">
                            <a-date-picker v-decorator="['firstWorkDate']" placeholder='参加工作时间'/>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="24">
                        <a-form-item
                                label='联系地址'
                                :labelCol="{ span: 3 }"
                                :wrapperCol="{ span: 18 }">
                            <a-input v-decorator="['address']" placeholder='联系地址'/>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="24">
                        <a-form-item
                                label='备注'
                                :labelCol="{ span: 3 }"
                                :wrapperCol="{ span: 18 }">
                            <a-textarea v-decorator="['description']" :rows="2"/>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-tab-pane>
            </a-tabs>
        </a-form>
    </a-modal>
</template>

<script>
import qs from 'qs'

export default {
  name: 'UserAdd',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formItemLayout: {
        labelCol: {
          md: { span: 6 }
        },
        wrapperCol: {
          md: { span: 12 }
        }
      },
      addUserForm: this.$form.createForm(this),
      defaultOrgId: '',
      defaultDeptId: '',
      defaultPosId: '',
      modalLoading: {
        addUser: false
      },
      modalData: {
        addUser: {
          deptList: [],
          posList: []
        }
      }
    }
  },
  methods: {
    preUserAdd (orgId, deptId, posId) {
      const that = this
      this.defaultOrgId = orgId
      this.defaultDeptId = deptId
      this.defaultPosId = posId
      this.$http.get('/api/1/org/get_org.json?id=' + orgId).then(function (response) {
        that.modalData.addUser.orgId = response.result.id
        that.modalData.addUser.orgName = response.result.name
        that.modalLoading.addUser = false
      })
      this.$http.get('/api/1/org/get_org_depts.json?orgId=' + orgId).then(function (response) {
        that.modalData.addUser.deptList = response.result
        if (response.result.length > 0) {
          let selectedDeptId = null
          if (that.defaultDeptId !== '') {
            selectedDeptId = that.defaultDeptId
          } else {
            selectedDeptId = response.result[0].id
          }
          that.addUserForm.setFieldsValue({
            deptId: selectedDeptId
          })
          that.onAddUserDeptChange(selectedDeptId)
        }
      })
    },
    onAddUserDeptChange (value) {
      let that = this
      this.$http.get('/api/1/org/get_dept_poss.json?deptId=' + value).then(function (response) {
        that.modalData.addUser.posList = response.result
        let selectedPosId = null
        if (that.defaultPosId !== '') {
          selectedPosId = that.defaultPosId
        } else {
          selectedPosId = response.result[0].id
        }
        that.addUserForm.setFieldsValue({
          posId: selectedPosId
        })
      })
    },
    onAddUserSubmit () {
      let that = this
      this.addUserForm.validateFields((err, values) => {
        if (err) {
          return
        }
        let params = this.addUserForm.getFieldsValue()

        if (params.password !== params.password2) {
          that.$message.warning('两次密码输入不一致')
          return
        }

        params.orgId = this.modalData.addUser.orgId
        if (params.birthday) {
          params.birthday = params.birthday.format('YYYY-MM-DD')
        }
        if (params.hireDate) {
          params.hireDate = params.hireDate.format('YYYY-MM-DD')
        }
        if (params.firstWorkDate) {
          params.firstWorkDate = params.firstWorkDate.format('YYYY-MM-DD')
        }
        params.saveProfile = '1'
        this.modalLoading.addUser = true
        this.$http.post('/api/1/org/add_user.json', qs.stringify(params)).then(function (response) {
          that.modalLoading.addUser = false
          if (response.code !== 200) {
            that.$message.error(response.msg)
            return
          }

          that.$message.success('操作成功')
          that.addUserForm.resetFields()
          that.$emit('success')
        })
      })
    }
  }
}
</script>

<style lang="less">
    .user-form .ant-modal-body {
        padding: 4px 14px 14px 14px;
    }
</style>
