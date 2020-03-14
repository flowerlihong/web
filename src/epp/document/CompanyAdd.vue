<template>
 <a-modal title="新增企业"
             :width="800"
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
                              v-decorator="['companyName',{ rules: [{ required: true, message: '请输入你企业名称' }, {max: 200, message: '企业名称不能超过200个字'}]}]"></a-input>
                 </a-form-item>
                 <a-form-item label="法定代表人" v-bind="formItemLayout">
                     <a-input placeholder="请输入法定代表人姓名"
                              v-decorator="['userName',{ rules: [{ required: true, message: '请输入法定代表人姓名' }, {max: 200, message: '法定代表人姓名不能超过200个字'}]}]"></a-input>
                 </a-form-item>
                 <a-form-item label="企业邮箱" v-bind="formItemLayout">
                     <a-input placeholder="请输入邮箱号"
                              v-decorator="['email',{ rules: [{ required: true, message: '请输入邮箱号', type: 'email' }, {max: 200, message: '邮箱号不能超过200个字'}]}]"></a-input>
                 </a-form-item>
                 <a-form-item label="企业固话" v-bind="formItemLayout">
                     <a-input placeholder="请输入企业固话"
                              v-decorator="['telephone',{ rules: [{ required: true, message: '请输入企业固话' }, {max: 200, message: '标题不能超过200个字'}]}]"></a-input>
                 </a-form-item>
                 <a-form-item label="成立时间" v-bind="formItemLayout">
                     <a-date-picker v-decorator="['dateTime', { type: 'object', required: true, message: '请选择' }]" />
                 </a-form-item>
                 <a-form-item label="统一社会信用代码" v-bind="formItemLayout">
                     <a-input placeholder="请输入统一社会信用代码"
                              v-decorator="['code',{ rules: [{ required: true, message: '请输入统一社会信用代码' }, {max: 200, message: '不能超过200个字'}]}]"></a-input>
                 </a-form-item>
                 <a-form-item label="注册资金" v-bind="formItemLayout">
                     <a-input placeholder="请输入注册资金（单位：万）"
                              v-decorator="['money',{ rules: [{ required: true, message: '请输入注册资金（单位：万）' }, {max: 200, message: '不能超过200个字'}]}]"></a-input>
                 </a-form-item>
                 <a-form-item label="地址" v-bind="formItemLayout">
                     <a-input placeholder="请输入公司地址"
                              v-decorator="['address',{ rules: [{ required: true, message: '请输入公司地址' }, {max: 200, message: '不能超过200个字'}]}]"></a-input>
                 </a-form-item>
                 <a-form-item label="顺序" v-bind="formItemLayout">
                    <a-row :gutter="18">
                      <a-col :xl="6" :lg="24" :md="24" :sm="24" :xs="24">
                        <a-input-number placeholder="0"
                                v-decorator="['sequence',{ rules: [{ required: true, message: '请输入顺序' }]}]"></a-input-number>
                      </a-col>
                      <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
                        <span>默认0，数值越大排名越靠前</span>
                      </a-col>
                    </a-row>
                  </a-form-item>
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

            <company-avatar @change="refreshAvator"  ref="modal" :visible="visibleModal" @success="onOk" @cancel="onClose">
            </company-avatar>
    </a-modal>
</template>

<script>
import qs from 'qs'
import CompanyAvatar from './CompanyAvatar'

export default {
  name: 'CompanyAdd',
  components: {
    // UploadSelector
    CompanyAvatar
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visibleModal: false,
      time: '',
      company: {
        avatar: '/img/company.png',
        isNull: true,
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
    CompanyAdd (nodeId) {
      this.nodeId = nodeId
    },
    onOk () {
      this.$refs.modal.close()
    },
    onClose () {
      this.visibleModal = false
    },
    refreshAvator (id) {
      debugger
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
            that.$message.success('添加成功!')
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
  height: 100px;
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
