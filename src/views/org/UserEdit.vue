<!--
 Created by Xuz on 2019/02/19.
 xuz[at]live[dot]cn
 用户编辑
-->
<template>
    <a-modal title="编辑用户"
             :width="960"
             :visible="visible"
             :maskClosable="false"
             @ok="onEditUserSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading.editUser"
             destroyOnClose
             class="user-form">
        <a-form :form="editUserForm">
            <a-tabs size="small">
                <a-tab-pane tab="帐号信息" key="1">
                    <a-row>
                        <a-col :span="12">
                            <a-form-item label='所属机构' v-bind="formItemLayout">
                                {{modalData.editUser.org.name}}
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label='所属部门' v-bind="formItemLayout">
                                {{modalData.editUser.dept.name}}
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="12">
                            <a-form-item label='所属岗位' v-bind="formItemLayout">
                                {{modalData.editUser.pos.name}}
                                <a-button icon="edit" size="small" type="danger" @click="onMoveUserPos">调动</a-button>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label='顺序号' v-bind="formItemLayout">
                                <a-input-number v-decorator="[
                                    'seq',
                                    {initialValue:modalData.editUser.seq, rules: [{ required: true, type: 'number', message: '请填写数字类型顺序号' }]}]" placeholder='顺序号'/>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="12">
                            <a-form-item label='帐号名' v-bind="formItemLayout">
                                <a-input v-decorator="[
                                    'account',
                                    {initialValue:modalData.editUser.account, rules: [{ required: true, message: '请填写帐号' }]}]" placeholder='登录使用'/>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label='姓名' v-bind="formItemLayout">
                                <a-input v-decorator="[
                                    'name',
                                    {initialValue:modalData.editUser.name, rules: [{ required: true, message: '请填写姓名' }]}]" placeholder='姓名'/>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="12">
                            <a-form-item label='密码' v-bind="formItemLayout">
                                <a-input v-decorator="[
                                    'password',
                                    {initialValue:modalData.editUser.password, rules: [{ required: false, message: '请填写密码' }]}]" type='password' placeholder='留空不修改密码'/>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label='确认密码' v-bind="formItemLayout">
                                <a-input v-decorator="[
                                    'password2',
                                    {initialValue:modalData.editUser.password2, rules: [{ required: false, message: '请再次填写密码' }]}]" type='password' placeholder='留空不修改密码'/>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="12">
                            <a-form-item label='邮箱' v-bind="formItemLayout">
                                <a-input v-decorator="[
                                    'email',
                                    {initialValue:modalData.editUser.email, rules: [{ required: false, message: '请填写邮箱' },
                                    {type: 'email', message: 'Email 格式不正确' }]}]" placeholder='邮箱'/>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label='手机' v-bind="formItemLayout">
                                <a-input v-decorator="[
                                    'mobile',
                                    {initialValue:modalData.editUser.mobile, rules: [{ required: false, message: '请填写手机号码' }]}]" placeholder='手机号码'/>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-tab-pane>
                <a-tab-pane tab="基本资料" key="2">
                    <a-row>
                        <a-col :span="12">
                            <a-form-item label='性别' v-bind="formItemLayout">
                                <a-radio-group v-decorator="[
                                    'sex', {initialValue:modalData.editUser.profile.sex}]">
                                    <a-radio value="1">男</a-radio>
                                    <a-radio value="0">女</a-radio>
                                </a-radio-group>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label='出生日期' v-bind="formItemLayout">
                                <a-date-picker v-decorator="[
                                        'birthday', {initialValue:modalData.editUser.profile.birthday}]" placeholder='出生日期'/>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="12">
                            <a-form-item label='工作电话' v-bind="formItemLayout">
                                <a-input v-decorator="[
                                    'workPhone', {initialValue:modalData.editUser.profile.workPhone}]" placeholder='工作电话'/>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item label='入职日期' v-bind="formItemLayout">
                                <a-date-picker v-decorator="[
                                        'hireDate', {initialValue:modalData.editUser.profile.hireDate}]" placeholder='入职日期'/>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="24">
                            <a-form-item
                                    label='参加工作时间'
                                    :labelCol="{ span: 3 }"
                                    :wrapperCol="{ span: 18 }">
                                <a-date-picker v-decorator="[
                                        'firstWorkDate', {initialValue:modalData.editUser.profile.firstWorkDate}]" placeholder='参加工作时间'/>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="24">
                            <a-form-item
                                    label='联系地址'
                                    :labelCol="{ span: 3 }"
                                    :wrapperCol="{ span: 18 }">
                                <a-input v-decorator="[
                                        'address',
                                        {initialValue:modalData.editUser.profile.address}]" placeholder='联系地址'/>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="24">
                            <a-form-item
                                    label='备注'
                                    :labelCol="{ span: 3 }"
                                    :wrapperCol="{ span: 18 }">
                                <a-textarea v-decorator="[
                                        'description',
                                        {initialValue:modalData.editUser.profile.description}]" :rows="2"/>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-tab-pane>
                <a-tab-pane tab="任职情况" key="3">
                    <a-row>
                        <a-col>
                            <s-table ref="posTable"
                                     :columns="posColumns"
                                     :rowKey="record => (record.org_id + record.dept_id + record.pos_id)"
                                     :data="loadPosData"
                                     :showPagination="false"
                                     size="middle">
                                <span slot="action" slot-scope="text, record">
                                    <a v-if="record.types === '1'" @click="onMoveUserPos">调动</a>
                                    <a-popconfirm v-else title="是否确认撤职?" @confirm="onDeletePos(record)">
                                        <a href="#">撤职</a>
                                    </a-popconfirm>
                                </span>
                            </s-table>
                        </a-col>
                    </a-row>
                    <a-row style="margin-top:10px">
                        <a-col style="float:right">
                            <a-button @click="onAddUserPos">新增职位关联</a-button>
                        </a-col>
                    </a-row>
                </a-tab-pane>
            </a-tabs>
        </a-form>
        <UserPosAdd ref="userPosAdd" :visible="modalVisible.userPosAdd" @success="onAddUserPosSuccess" @cancel="onAddUserPosCancel" />
        <UserPosMove ref="userPosMove" :visible="modalVisible.userPosMove" @success="onMoveUserPosSuccess" @cancel="onMoveUserPosCancel" />
    </a-modal>
</template>

<script>
import STable from '@/components/Table'
import qs from 'qs'
import moment from 'moment'
import UserPosAdd from './UserPosAdd'
import UserPosMove from './UserPosMove'

const posColumns = [
  {
    title: '机构',
    dataIndex: 'org_name'
  }, {
    title: '部门',
    dataIndex: 'dept_name'
  }, {
    title: '岗位',
    dataIndex: 'pos_name'
  }, {
    title: '类型',
    dataIndex: 'type_name'
  }, {
    title: '职务',
    dataIndex: 'duty_name'
  }, {
    title: '排序',
    dataIndex: 'seq'
  }, {
    title: '操作',
    width: '100px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'UserEdit',
  components: {
    UserPosAdd,
    UserPosMove,
    STable
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      posColumns: posColumns,
      formItemLayout: {
        labelCol: {
          md: { span: 6 }
        },
        wrapperCol: {
          md: { span: 12 }
        }
      },
      editUserForm: this.$form.createForm(this),
      modalLoading: {
        editUser: false
      },
      modalData: {
        editUser: {
          org: {},
          dept: {},
          pos: {},
          profile: {}
        }
      },
      modalVisible: {
        userPosAdd: false,
        userPosMove: false
      },
      loadPosData: parameter => {
        return this.$http.get('/api/1/org/get_user_poss.json?pageSize=99&userId=' + this.modalData.editUser.id, { params: Object.assign(parameter),
          paramsSerializer: function (params) {
            return qs.stringify(params, { indices: false })
          }
        }).then(res => {
          return res
        })
      }
    }
  },
  methods: {
    onInit (userId) {
      this.modalLoading.editUser = true
      this.modalData.editUser.id = userId
      const that = this
      this.$http.get('/api/1/org/get_user.json?id=' + userId).then(function (response) {
        let result = response.result
        if (result.profile.birthday) {
          result.profile.birthday = moment(result.profile.birthday)
        }
        if (result.profile.hireDate) {
          result.profile.hireDate = moment(result.profile.hireDate)
        }
        if (result.profile.firstWorkDate) {
          result.profile.firstWorkDate = moment(result.profile.firstWorkDate)
        }
        that.modalData.editUser = result
        that.modalLoading.editUser = false
      })
    },
    onEditUserSubmit () {
      let that = this
      this.editUserForm.validateFields((err, values) => {
        if (err) {
          return
        }
        let params = this.editUserForm.getFieldsValue()

        if (params.password || params.password2) {
          if (params.password !== params.password2) {
            that.$message.warning('两次密码输入不一致')
            return
          }
        }

        params.id = this.modalData.editUser.id
        params.orgId = this.modalData.editUser.orgId
        params.deptId = this.modalData.editUser.deptId
        params.posId = this.modalData.editUser.posId
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
        this.modalLoading.editUser = true
        this.$http.post('/api/1/org/edit_user.json', qs.stringify(params)).then(function (response) {
          that.modalLoading.editUser = false
          if (response.code !== 200) {
            that.$message.error(response.msg)
            return
          }
          that.$message.success('操作成功')
          that.editUserForm.resetFields()
          that.$emit('success')
        })
      })
    },
    onAddUserPos () {
      this.modalVisible.userPosAdd = true
      this.$refs.userPosAdd.preUserPosAdd(this.modalData.editUser.id)
    },
    onAddUserPosCancel () {
      this.modalVisible.userPosAdd = false
    },
    onAddUserPosSuccess () {
      this.modalVisible.userPosAdd = false
      this.$refs.posTable.refresh()
    },
    onDeletePos (record) {
      const that = this
      that.$http.post('/api/1/org/delete_user_pos.json', qs.stringify({
        userId: that.modalData.editUser.id,
        posId: record.pos_id
      })).then(function (response) {
        that.modalLoading.editUser = false
        if (response.code !== 200) {
          that.$message.error(response.msg)
          return
        }
        that.$refs.posTable.refresh()
      })
    },
    onMoveUserPos () {
      this.modalVisible.userPosMove = true
      this.$refs.userPosMove.preUserPosMove(this.modalData.editUser.id)
    },
    onMoveUserPosCancel () {
      this.modalVisible.userPosMove = false
    },
    onMoveUserPosSuccess () {
      this.modalVisible.userPosMove = false
      this.onInit(this.modalData.editUser.id)
      this.$refs.posTable.refresh()
    }
  }
}
</script>

<style lang="less">
    .user-form .ant-modal-body {
        padding: 4px 14px 14px 14px;
    }
</style>
