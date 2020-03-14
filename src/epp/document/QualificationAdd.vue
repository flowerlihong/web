<template>
 <a-modal title="新增资质"
             :width="800"
             :visible="visible"
             :maskClosable="false"
             okText= "保存"
             @ok="onSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading">
      <a-form :form="form">
          <a-form-item label="资质名称" v-bind="formItemLayout">
              <a-input placeholder="请输入你资质名称"
                        v-decorator="['qualifyName',{ rules: [{ required: true, message: '请输入你资质名称'}, {max: 200, message: '资质名称不能超过200个字'}]}]"></a-input>
          </a-form-item>
          <a-form-item label="资质编号" v-bind="formItemLayout">
              <a-input placeholder="请输入你资质编号"
                        v-decorator="['code',{ rules: [{ required: true, message: '请输入你资质编号'}]}]"></a-input>
          </a-form-item>
          <a-form-item label="资质等级" v-bind="formItemLayout">
            <a-row :gutter="6">
              <a-col :xl="6" :lg="24" :md="24" :sm="24" :xs="24">
                <a-select
                  placeholder="请选择"
                  v-decorator="['qualifyGrade',{ rules: [{ required: true, message: '请输入你资质等级'}]}]">
                  <a-select-option value="1">
                    一级
                  </a-select-option>
                  <a-select-option value="2">
                    二级
                  </a-select-option>
                  <a-select-option value="3">
                    三级
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item label="资质有效期" v-bind="formItemLayout">
            <a-row :gutter="24">
              <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
                <a-range-picker v-decorator="['indate', rangeConfig]" />
              </a-col>
              <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
                <a-checkbox
                  v-decorator="[
                    'dateless',
                    {
                      valuePropName: 'checked',
                      initialValue: false
                    }
                  ]"
                >
                  无限期
                </a-checkbox>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item label="上传文件照片/扫描件" v-bind="formItemLayout">
            <!-- <span>企业上传LOGO</span> -->
              <a-col>
                <div class="ant-upload-preview" @click="$refs.modal.edit(qualify.id,companyId)">
                    <a-icon type="cloud-upload-o" class="upload-icon"/>
                    <div class="upload" v-if="qualify.isNull">
                        <a-icon type="plus" />
                        <div>点击上传</div>
                    </div>
                    <div v-else>
                        <img :src="'api/1/qualification/avatar.json?id=' + qualify.id +'&s=' + time" />
                    </div>
                </div>
              </a-col>
          </a-form-item>
          <a-form-item label="顺序" v-bind="formItemLayout">
            <a-row :gutter="24">
              <a-col :xl="11" :lg="24" :md="24" :sm="24" :xs="24">
                <a-input placeholder="0"
                        v-decorator="['sequence',{ rules: [{ required: true, message: '请输入顺序' }, {max: 20, message: '不能超过20个字'}]}]"></a-input>
              </a-col>
              <a-col :xl="13" :lg="24" :md="24" :sm="24" :xs="24">
                <span>默认0，数值越大排名越靠前</span>
              </a-col>
            </a-row>
          </a-form-item>
      </a-form>
      <qualification-avatar @change="refreshAvator"  ref="modal" :visible="visibleModal" @success="onOk" @cancel="onClose">
      </qualification-avatar>
    </a-modal>
</template>

<script>
import qs from 'qs'
import QualificationAvatar from './QualificationAvatar'

export default {
  name: 'QualificationAdd',
  components: {
    // UploadSelector
    QualificationAvatar
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
      visibleModal: false,
      time: '',
      qualify: {
        isNull: true,
        id: ''
      },
      rangeConfig: {
        rules: [{ type: 'array' }]
      },
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: {
          lg: { span: 5 }, sm: { span: 5 }
        },
        wrapperCol: {
          lg: { span: 12 }, sm: { span: 12 }
        }
      },
      loading: false,
      modalLoading: false
    }
  },
  methods: {
    onOk () {
      this.$refs.modal.close()
    },
    onClose () {
      this.visibleModal = false
    },
    refreshAvator (id) {
      this.qualify.isNull = false
      this.qualify.id = id
      this.time = (new Date()).getTime()
    },
    onSubmit () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        const that = this
        let data = that.form.getFieldsValue()
        data.id = that.qualify.id
        if (data.indate !== undefined) {
          const indate = data.indate
          data.startTime = indate[0].format('YYYY-MM-DD')
          data.endTime = indate[1].format('YYYY-MM-DD')
        }
        data.companyId = that.companyId
        if (data.companyId === '') {
          that.$message.info('表单提交异常')
        } else {
          this.loading = true
          this.$http.post('/api/1/qualification/add_qualify.json', qs.stringify(data)).then(function (res) {
            if (res.code !== 200) {
              return
            }
            that.qualify.id = ''
            that.qualify.isNull = true
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
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    font-size: 40px;
    color: #8c8c8c;
    cursor: pointer;
    height: 75px;
}
.upload div{
    font-size: 14px;
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
  margin: 4px 0;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
    box-shadow: none;
    border: 1px solid #d9d9d9;
    box-sizing: content-box;
    border-radius: 4px;

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
