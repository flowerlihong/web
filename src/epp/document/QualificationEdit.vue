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
                        v-decorator="['qualifyName',{ initialValue:result.qualifyName, rules: [{ required: true, message: '请输入你资质名称'}, {max: 200, message: '资质名称不能超过200个字'}]}]"></a-input>
          </a-form-item>
          <a-form-item label="资质编号" v-bind="formItemLayout">
              <a-input placeholder="请输入你资质编号"
                        v-decorator="['code',{ initialValue:result.code, rules: [{ required: true, message: '请输入你资质编号'}]}]"></a-input>
          </a-form-item>
          <a-form-item label="资质等级" v-bind="formItemLayout">
            <a-row :gutter="6">
              <a-col :xl="6" :lg="24" :md="24" :sm="24" :xs="24">
                <a-select
                  v-decorator="['qualifyGrade',{ initialValue: result.qualifyGrade, rules: [{ required: true, message: '请输入你资质等级'}]}]">
                  <a-select-option :value="1">
                    一级
                  </a-select-option>
                  <a-select-option :value="2">
                    二级
                  </a-select-option>
                  <a-select-option :value="3">
                    三级
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item label="资质有效期" v-bind="formItemLayout">
            <a-row :gutter="24">
              <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
                <a-range-picker v-decorator="['indate', { initialValue: result.dateTime, rangeConfig}]" />
              </a-col>
              <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
                <a-checkbox
                  v-decorator="[
                    'dateless',
                    {
                      valuePropName: 'checked',
                      initialValue: result.dateless
                    }
                  ]"
                >
                  无限期
                </a-checkbox>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item label="上传文件照片/扫描件">
            <!-- <span>企业上传LOGO</span> -->
            <a-row :gutter="18">
              <a-col :xl="18" :lg="24" :md="24" :sm="24" :xs="24">
                <div class="ant-upload-preview" @click="$refs.modal.edit(qualify.id)">
                    <a-icon type="cloud-upload-o" class="upload-icon"/>
                    <div class="upload" v-if="qualify.isNull">
                        <a-icon type="plus" />
                        <span>点击上传</span>
                    </div>
                    <div v-else>
                        <img :src="'api/1/qualification/avatar.json?id=' + qualify.id +'&s=' + time" />
                    </div>
                </div>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item label="顺序" v-bind="formItemLayout">
            <a-row :gutter="24">
              <a-col :xl="11" :lg="24" :md="24" :sm="24" :xs="24">
                <a-input placeholder="0"
                        v-decorator="['sequence',{ initialValue:result.sequence, rules: [{ required: true, message: '请输入顺序' }]}]"></a-input>
              </a-col>
              <a-col :xl="13" :lg="24" :md="24" :sm="24" :xs="24">
                <span>默认0，数值越大排名越靠前</span>
              </a-col>
            </a-row>
          </a-form-item>
      </a-form>
      <qualification-edit-avatar @change="refreshAvator"  ref="modal" :visible="visibleModal" @success="onOk" @cancel="onClose">
      </qualification-edit-avatar>
    </a-modal>
</template>

<script>
import qs from 'qs'
import QualificationEditAvatar from './QualificationEditAvatar'
import moment from 'moment'

export default {
  name: 'QualificationEdit',
  components: {
    // UploadSelector
    QualificationEditAvatar
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
      result: {},
      qualify: {
        isNull: false,
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
    moment,
    onOk () {
      this.$refs.modal.close()
    },
    onClose () {
      this.visibleModal = false
    },
    qualificationEdit (qualifiyId) {
      this.qualify.id = qualifiyId
      this.loadData()
    },
    loadData () {
      let that = this
      this.$http.get('/api/1/qualification/get_qualify_by_id.json?id=' + this.qualify.id).then(function (res) {
        let result = res.result
       // result.qualifyGrade = that.gradeFormat(result.qualifyGrade)
        var dateTime = []
        if (result.startTime !== null && result.endTime !== null) {
          dateTime = [moment(result.startTime), moment(result.endTime)]
        }
        result.dateTime = dateTime
        that.result = result
      })
    },
    refreshAvator (id) {
      this.qualify.id = id
      this.time = (new Date()).getTime()
    },
    onSubmit () {
         debugger
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        const that = this
        let data = that.form.getFieldsValue()
        data.id = that.qualify.id
        if (data.indate.length !== 0) {
          const indate = data.indate
          data.startTime = indate[0].format('YYYY-MM-DD')
          data.endTime = indate[1].format('YYYY-MM-DD')
        }
        if (data.id === '') {
          that.$message.info('表单提交异常')
        } else {
          this.loading = true
          this.$http.post('/api/1/qualification/qualify_edit.json', qs.stringify(data)).then(function (res) {
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
    },
    gradeFormat (grade) {
      if (grade === 1) {
        return '一级'
      }
      if (grade === 2) {
        return '二级'
      }
      if (grade === 3) {
        return '三级'
      }
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
  width: 200px;
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
