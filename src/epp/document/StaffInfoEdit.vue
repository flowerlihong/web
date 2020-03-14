<template>
 <a-modal title="新增人员信息"
             :width="1000"
             :visible="visible"
             :maskClosable="false"
             okText= "保存"
             @ok="onSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <p><a-icon type="user" />基本信息</p>
            <a-form-item label="人员名称" v-bind="formItemLayout">
                <a-input placeholder="请输入人员名称"
                          v-decorator="['staffName',{ initialValue: staff.staffName, rules: [{ required: true, message: '请输入人员名称' }, {max: 10, message: '人员名称不能超过10个字'}]}]"></a-input>
            </a-form-item>
             <a-form-item label="人员岗位" v-bind="formItemLayout">
                <a-input placeholder="请输入人员岗位"
                          v-decorator="['staffPost',{ initialValue: staff.staffPost, rules: [{ required: true, message: '请输入人员岗位' }, {max: 200, message: '人员岗位不能超过200个字'}]}]"></a-input>
            </a-form-item>
            <a-form-item label="联系手机" v-bind="formItemLayout">
                <a-input placeholder="请输入联系手机"
                          v-decorator="['staffTelephone',{ initialValue: staff.staffTelephone, rules: [{ required: true, message: '请输入联系手机' }, {max: 20, message: '联系手机不能超过20个字'}]}]"></a-input>
            </a-form-item>
            <a-form-item label="联系邮箱" v-bind="formItemLayout">
                <a-input placeholder="请输入联系邮箱"
                          v-decorator="['staffEmail',{ initialValue: staff.staffEmail, rules: [{ required: true, message: '请输入联系邮箱', type: 'email' }]}]"></a-input>
            </a-form-item>
            <a-form-item label="身份证" v-bind="formItemLayout">
                <a-input placeholder="请输入身份证"
                          v-decorator="['staffIdcard',{ initialValue:staff.staffIdcard, rules: [{ required: true, message: '请输入身份证' }, {max: 20, message: '身份证不能超过20个字'}]}]"></a-input>
            </a-form-item>
            <a-form-item label="入职时间" v-bind="formItemLayout">
                <a-date-picker v-decorator="['staffEntryTime',{ initialValue:staff.staffEntryTime, rules: [{ type: 'object', required: true, message: '请选择' }]}]" />
            </a-form-item>
            <a-form-item label="顺序" v-bind="formItemLayout">
            <a-row :gutter="24">
              <a-col :xl="11" :lg="24" :md="24" :sm="24" :xs="24">
                <a-input placeholder="0"
                        v-decorator="['sequence',{ initialValue:staff.sequence, rules: [{ required: true, message: '请输入顺序' }]}]"></a-input>
              </a-col>
              <a-col :xl="13" :lg="24" :md="24" :sm="24" :xs="24">
                <span>默认0，数值越大排名越靠前</span>
              </a-col>
            </a-row>
          </a-form-item>
          </a-col>
          <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <p><a-icon type="read" />学位及职业资格证书</p>
            <a-form-item label="毕业学校" v-bind="formItemLayout">
                <a-input placeholder="请输入毕业学校"
                          v-decorator="['staffSchool',{ initialValue:staff.staffSchool, rules: [{ required: true, message: '请输入毕业学校' }, {max: 50, message: '毕业学校不能超过50个字'}]}]"></a-input>
            </a-form-item>
            <a-form-item label="学历" v-bind="formItemLayout">
              <a-select
                placeholder="请选择"
                v-decorator="['staffEducation',{ initialValue:staff.staffEducation, rules: [{ required: true, message: '请输入你资质等级'}]}]">
                <a-select-option value="博士">
                  博士
                </a-select-option>
                <a-select-option value="硕士">
                  硕士
                </a-select-option>
                <a-select-option value="本科">
                  本科
                </a-select-option>
                <a-select-option value="大专">
                  大专
                </a-select-option>
                <a-select-option value="高中">
                  高中
                </a-select-option>
                <a-select-option value="初中">
                  初中
                </a-select-option>
                <a-select-option value="小学">
                  小学
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="毕业年份" v-bind="formItemLayout">
                <a-input placeholder="请输入毕业年份"
                          v-decorator="['staffGraduate',{ initialValue:staff.staffGraduate, rules: [{ required: true, message: '请输入毕业年份' }, {max: 10, message: '身份证不能超过10个字'}]}]"></a-input>
            </a-form-item>
            <a-form-item label="职业资格证书" v-for="(item,i) in certificateList" :key="i">
              <!-- <span>企业上传LOGO</span> -->
              <a-row :gutter="12">
                <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
                  <a-form-item :wrapperCol="{ lg: { span: 50 }, sm: { span: 50 }}">
                      <a-input :placeholder="item.certificate"
                                v-model="item.certificate"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :xl="4" :lg="24" :md="24" :sm="24" :xs="24">
                  <div class="ant-upload-preview" @click="$refs.editModal.edit(item.id,item.certificate)">
                    <img :src="'api/1/staff/certificate_avatar.json?id=' + item.id +'&s=' + time" />
                  </div>
                </a-col>
              </a-row>
            </a-form-item>
            <a-form-item label="职业资格证书">
              <!-- <span>企业上传LOGO</span> -->
              <a-row :gutter="12">
                <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
                  <a-form-item :wrapperCol="{ lg: { span: 50 }, sm: { span: 50 }}">
                      <a-input placeholder="请输入证书名称"
                                v-model= "staffCertificate" ></a-input>
                  </a-form-item>
                </a-col>
                <a-col :xl="4" :lg="24" :md="24" :sm="24" :xs="24">
                  <a-button size="default" @click="$refs.modal.edit(staffCertificate)">文件上传</a-button>
                </a-col>
              </a-row>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <staff-info-add-avatar @change="refreshAvator"  ref="modal" :visible="visibleModal.add" @success="onOk" @cancel="onClose">
      </staff-info-add-avatar>
      <staff-info-edit-avatar @change="refreshEditAvator"  ref="editModal" :visible="visibleModal.edit" @success="onEditOk" @cancel="onEditClose">
      </staff-info-edit-avatar>
    </a-modal>
</template>

<script>
import qs from 'qs'
import moment from 'moment'
import StaffInfoAddAvatar from './StaffInfoAddAvatar'
import StaffInfoEditAvatar from './StaffInfoEditAvatar'

export default {
  name: 'StaffInfoEdit',
  components: {
    StaffInfoAddAvatar,
    StaffInfoEditAvatar
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      certificateList: [],
      staff: {},
      visibleModal: {
        add: false,
        edit: false
      },
      time: '',
      staffCertificate: '',
      staffId: '',
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: {
          lg: { span: 5 }, sm: { span: 5 }
        },
        wrapperCol: {
          lg: { span: 15 }, sm: { span: 15 }
        }
      },
      loading: false,
      modalLoading: false
    }
  },
  methods: {
    moment,
    onEdit (staffId) {
      this.staffId = staffId
      this.init()
    },
    init () {
      const that = this
      this.$http.post('/api/1/staff/get_staff_by_id.json', qs.stringify({ staffId: that.staffId })).then(function (res) {
        if (res.code !== 200) {
          return
        }
        that.staff = res.result
        that.staff.staffEntryTime = moment(that.staff.staffEntryTime)
        console.log(that.staff)
        that.certificateList = that.staff.certificateList
        console.log(that.certificateList)
      })
    },
    onOk () {
      this.$refs.modal.close()
    },
    onClose () {
      this.visibleModal.add = false
    },
    refreshAvator (id,certificate) {
      let object = {
        id: '',
        certificate: ''
      }
      object.id = id
      object.certificate = certificate
      this.certificateList.push(object)
      this.staffCertificate = ''
      this.time = (new Date()).getTime()
    },
    onEditOk () {
      this.$refs.editModal.close()
    },
    onEditClose () {
      this.visibleModal.edit = false
    },
    refreshEditAvator (id,certificate) {
      this.certificateList.forEach(
        object =>{
          if(object.id === id){
            object.certificate = certificate
          }
        }
      )
      this.time = (new Date()).getTime()
    },
    onSubmit () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        const that = this
        let data = that.form.getFieldsValue()
        data.id = that.staffId
        data.staffEntryTime = data.staffEntryTime.format('YYYY-MM-DD')
        // data.companyId = that.companyId
        data.certificateList = that.certificateList
        if (data.id === '') {
          that.$message.info('表单提交异常')
        } else {
          this.loading = true
          this.$http.post('/api/1/staff/edit_staff.json', qs.stringify(data,{ allowDots: true })).then(function (res) {
            if (res.code !== 200) {
              return
            }
            that.$message.success('人员修改成功!')
            that.form.resetFields()
            that.certificateList = []
            that.modalLoading = false
            that.$emit('success')
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.upload{
    line-height: 40px;
    display: inline-block;
    height: 40px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    font-size: 40px;
    color: #8c8c8c;
    cursor: pointer;
}
.ant-modal-content {
  :global {
    .ant-modal-footer {
      text-align: center !important;
    }
  }
}

.ant-modal-body {
  :global {
    .ant-form-item {
      margin-bottom: 3px !important;
    }
  }
}
.ant-upload-preview {
  position: relative;
  margin: 0 auto;
  width: 100px;
  height: 120px;
  box-shadow: 0 0 4px #ccc;
  text-align: center;
  line-height: 100px;

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
    i{
      font-size: 30px;
        line-height: 30px;
    }
  }

  img, .mask {
      width: 100px;
      height: 100px;
      overflow: hidden;
  }
}

</style>
