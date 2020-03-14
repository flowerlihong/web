<template>
 <a-modal title="修改企业信息"
             :width="650"
             :visible="visible"
             :maskClosable="false"
             okText= "保存"
             @ok="onSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading">
    <a-row :gutter="24">
        <a-col :xl="18" :lg="24" :md="24" :sm="24" :xs="24">
            <a-form :form="form">
                <a-form-item label="企业名称" v-bind="formItemLayout">
                    <a-input placeholder="请输入你企业名称"
                             v-decorator="['companyName',{ initialValue:result.companyName, rules: [{ required: true, message: '请输入你企业名称' }, {max: 200, message: '企业名称不能超过200个字'}]}]"></a-input>
                </a-form-item>
                <a-form-item label="法定代表人" v-bind="formItemLayout">
                     <a-input placeholder="请输入法定代表人姓名"
                             v-decorator="['userName',{ initialValue:result.userName, rules: [{ required: true, message: '请输入法定代表人姓名' }, {max: 200, message: '法定代表人姓名不能超过200个字'}]}]"></a-input>
                </a-form-item>
                <a-form-item label="企业邮箱" v-bind="formItemLayout">
                     <a-input placeholder="请输入邮箱号"
                             v-decorator="['email',{ initialValue:result.email, rules: [{ required: true, message: '请输入邮箱号', type: 'email' }, {max: 200, message: '邮箱号不能超过200个字'}]}]"></a-input>
                </a-form-item>
                <a-form-item label="企业固话" v-bind="formItemLayout">
                     <a-input placeholder="请输入企业固话"
                             v-decorator="['telephone',{ initialValue:result.telephone, rules: [{ required: true, message: '请输入企业固话' }, {max: 200, message: '标题不能超过200个字'}]}]"></a-input>
                </a-form-item>
                <a-form-item label="成立时间" v-bind="formItemLayout">
                  <a-date-picker
                   v-decorator="['dateTime', { initialValue:result.dateTime,type: 'object', required: true, message: '请选择' }]" />
                </a-form-item>
                <a-form-item label="统一社会信用代码" v-bind="formItemLayout">
                     <a-input placeholder="请输入统一社会信用代码"
                             v-decorator="['code',{ initialValue:result.code, rules: [{ required: true, message: '请输入统一社会信用代码' }, {max: 200, message: '标题不能超过200个字'}]}]"></a-input>
                </a-form-item>
                <a-form-item label="注册资金" v-bind="formItemLayout">
                     <a-input placeholder="请输入注册资金（单位：万）"
                             v-decorator="['money',{ initialValue:result.money, rules: [{ required: true, message: '请输入注册资金（单位：万）' }, {max: 200, message: '标题不能超过200个字'}]}]"></a-input>
                </a-form-item>
                <a-form-item label="地址" v-bind="formItemLayout">
                     <a-input placeholder="请输入公司地址"
                             v-decorator="['address',{ initialValue:result.address, rules: [{ required: true, message: '请输入公司地址' }, {max: 200, message: '不能超过200个字'}]}]"></a-input>
                </a-form-item>
                 <!-- <a-form-item> -->
                    <!-- 企业上传LOGO -->
                     <!-- <div class="ant-upload-preview" @click="$refs.modal.edit(company.id)"  style="text-align: center" >
                      <a-icon type="cloud-upload-o" class="upload-icon"/>
                      <div class="mask" >
                        <a-icon type="plus"/>
                      </div>
                      <div v-if="company.isNull">
                        <img :src="company.avatar" />
                      </div>
                      <div v-else>
                        <img :src="'api/1/document/avatar.json?id=' + company.id +'&s=' + time" />
                      </div>
                    </div>
                     <span style="padding: 0px 0px 0px 250px;" >企业上传LOGO</span>
                </a-form-item> -->
            </a-form>
            </a-col>
            <a-col :xl="6" :lg="24" :md="24" :sm="24" :xs="24">
                <div class="ant-upload-preview" @click="$refs.modal.edit(company.id)">
                    <a-icon type="cloud-upload-o" class="upload-icon"/>
    <!--                 <div class="mask" >-->
    <!--                     <a-icon type="plus"/>-->
    <!--                 </div>-->
                    <div class="upload" v-if="company.isNull">
    <!--                     <img :src="company.avatar" />-->
                        <a-icon type="plus" />
                    </div>
                    <div v-else>
                        <img :src="'api/1/document/avatar.json?id=' + company.id +'&s=' + time" />
                    </div>
                </div>
                <div style="text-align: center;margin-top: 10px">上传LOGO</div>
            </a-col>
        </a-row>
        <company-edit-avatar @change="refreshAvator"  ref="modal" :visible="visibleModal" @success="onOk" @cancel="onClose">
        </company-edit-avatar>
    </a-modal>
</template>

<script>
import qs from 'qs'
import CompanyEditAvatar from './CompanyEditAvatar'
import moment from 'moment'

export default {
  name: 'CompanyEdit',
  components: {
    // UploadSelector
    CompanyEditAvatar
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dateFormat: 'YYYY-MM-DD',
      result: {},
      time: '',
      visibleModal: false,
      company: {
        avatar: '/img/company.png',
        isNull: false,
        id: ''
      },
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: {
          lg: { span: 6 }, sm: { span: 6 }
        },
        wrapperCol: {
          lg: { span: 18 }, sm: { span: 18 }
        }
      },
      loading: false,
      modalLoading: false
    }
  },
  methods: {
    moment,
    companyEdit (companyId) {
      this.company.id = companyId
      this.loadData()
    },
    loadData () {
      let that = this
      this.$http.get('/api/1/document/company_edit.json?id=' + this.company.id).then(function (res) {
        let result = res
        result.dateTime = moment(result.dateTime)
        that.result = result
      })
    },
    onOk () {
      // this.visibleModal = false
      this.$refs.modal.close()
    },
    onClose () {
      this.visibleModal = false
    },
    refreshAvator (id) {
      this.company.isNull = false
      this.company.id = id
      this.time = (new Date()).getTime()
    },
    onSubmit () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        const that = this
        let data = that.form.getFieldsValue()
        data.dateTime = data.dateTime.format('YYYY-MM-DD')
        data.id = that.company.id
        if (data.id === '') {
          that.$message.info('表单提交异常')
        } else {
          this.loading = true
          this.$http.post('/api/1/document/add_company.json', qs.stringify(data)).then(function (res) {
            if (res.code !== 200) {
              return
            }
            that.$message.success('修改成功!')
            that.form.resetFields()
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
  width: 100%;
  max-width: 100px;
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
      max-width: 100px;
      height: 100%;
      max-height: 100px;
      overflow: hidden;
  }
}
// .ant-form-item-children {
//   :global {
//     .ant-upload,.ant-upload-select-picture-card {
//       margin: 0px 150px 0px !important;
//     }
//   }
// }

// .avatar-uploader > .ant-upload {
//   width: 128px;
//   height: 128px;
// }

// .ant-upload-select-picture-card i {
//   font-size: 32px;
//   color: #999;
// }

// .ant-upload-select-picture-card .ant-upload-text {
//   margin-top: 8px;
//   color: #666;
// }
</style>
