<template>
 <a-modal title="新增参保证明"
             :width="800"
             :visible="visible"
             :maskClosable="false"
             okText= "保存"
             @ok="onSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading">
      <a-form :form="form">
        <a-form-item label="标题" v-bind="formItemLayout">
            <a-input placeholder="请输入标题"
                      v-decorator="['title',{ initialValue:social.title, rules: [{ required: true, message: '请输入标题' }, {max: 200, message: '标题不能超过200个字'}]}]"></a-input>
        </a-form-item>
        <a-form-item label="日期" v-bind="formItemLayout" >
            <a-month-picker
                    v-decorator="['dateTime',{ initialValue:social.dateTime, rules: [{ type: 'object', required: true, message: '请选择' }]}]" />
        </a-form-item>
        <a-form-item label="上传文件照片/扫描件" >
          <!-- <span>企业上传LOGO</span> -->
          <div class="ant-upload-preview" @click="$refs.modal.edit(socialId)">
            <a-icon type="cloud-upload-o" class="upload-icon"/>
              <img :src="'api/1/social/avatar.json?id=' + socialId +'&s=' + time" />
          </div>
        </a-form-item>
      </a-form>
      <social-edit-avatar @change="refreshAvator"  ref="modal" :visible="visibleModal.edit" @success="onOk" @cancel="onClose">
      </social-edit-avatar>
    </a-modal>
</template>

<script>
import qs from 'qs'
import SocialEditAvatar from './SocialEditAvatar'
import moment from 'moment'

export default {
  name: 'SocialEdit',
  components: {
    SocialEditAvatar
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    companyId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      visibleModal: {
        edit: false
      },
      socialId: '',
      social: {},
      time: '',
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
    onEdit (id) {
      this.socialId = id
      const that = this
      this.$http.get('/api/1/social/get_social_by_id.json?socialId=' + that.socialId).then(function (res) {
        if (res.code !== 200) {
          return
        }
        that.social = res.result
        that.social.dateTime = moment(that.social.dateTime)
      })
    },
    onOk () {
      this.$refs.modal.close()
    },
    onClose () {
      this.visibleModal.add = false
    },
    refreshAvator () {
      this.time = (new Date()).getTime()
    },
    onSubmit () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        const that = this
        let data = that.form.getFieldsValue()
        data.id = that.socialId
        data.companyId = that.companyId
        data.dateTime = data.dateTime.format('YYYY-MM-DD')
        if (data.id === '') {
          that.$message.info('表单提交异常')
        } else {
          this.loading = true
          this.$http.post('/api/1/social/edit_social.json', qs.stringify(data)).then(function (res) {
            if (res.code !== 200) {
              return
            }
            that.$message.success('社保添加成功!')
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
  margin: 0px 400px 0px 100px;
  width: 180px;
  height: 250px;
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
      width: 100%;
      height: 100%;
      overflow: hidden;
  }
}

</style>
