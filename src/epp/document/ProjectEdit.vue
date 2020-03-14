<template>
 <a-modal title="新增方案"
             :width="800"
             :visible="visible"
             :maskClosable="false"
             okText= "保存"
             @ok="onSubmit"
             destroyOnClose
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading">
      <a-form :form="form">
        <a-form-item label="方案名称" v-bind="formItemLayout">
            <a-input placeholder="请输入文档标题"
                      v-decorator="['title',{ initialValue:result.title, rules: [{ required: true, message: '请输入文档标题' }, {max: 200, message: '标题不能超过200个字'}]}]"></a-input>
        </a-form-item>
        <a-form-item label="文档类型" v-bind="formItemLayout">
            <a-row :gutter="6">
              <a-col :xl="6" :lg="24" :md="24" :sm="24" :xs="24">
                <a-select
                  placeholder="请选择"
                  v-decorator="['type',{ initialValue:result.type, rules: [{ required: true, message: '请选择文档类型'}]}]">
                  <a-select-option value="doc">
                    doc
                  </a-select-option>
                  <a-select-option value="pdf">
                    pdf
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </a-form-item>
        <a-form-item label="文档页数" v-bind="formItemLayout">
            <a-input-number placeholder="请输入页数"
                      v-decorator="['page',{ initialValue:result.page, rules: [{ required: true, message: '请输入文档页数' }]}]"></a-input-number>
        </a-form-item>
        <a-form-item label="日期" v-bind="formItemLayout" >
            <a-date-picker
                    v-decorator="['dateTime',{ initialValue:result.dateTime, rules: [{ type: 'object', required: true, message: '请选择' }]}]" />
        </a-form-item>
        <a-form-item label="上传文件" >
          <upload-selector :referId='project.id' configKey='DOCUMENT.FILE' />
        </a-form-item>
        <a-form-item label="标签" v-bind="formItemLayout">
            <a-input placeholder="请输入标签，多个标签请以','间隔"
                      v-decorator="['tags',{ initialValue:result.tags, rules: [{ required: true, message: '请输入标签' }]}]"></a-input>
        </a-form-item>
        <a-form-item label="顺序" v-bind="formItemLayout">
          <a-row :gutter="20">
            <a-col :xl="10" :lg="24" :md="24" :sm="24" :xs="24">
              <a-input-number placeholder="0"
                      v-decorator="['sequence',{ initialValue:result.sequence, rules: [{ required: true, message: '请输入顺序' }]}]"></a-input-number>
            </a-col>
            <a-col :xl="10" :lg="24" :md="24" :sm="24" :xs="24">
              <span>默认0，数值越大排名越靠前</span>
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-modal>
</template>

<script>
import qs from 'qs'
import UploadSelector from '@/components/selector/UploadSelector'
import moment from 'moment'

export default {
  name: 'ProjectEdit',
  components: {
    UploadSelector
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visibleModal: {
        add: false
      },
      project: {
        id: ''
      },
      result: {},
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
      this.project.id = id
      this.init()
    },
    init () {
      const that = this
      this.$http.get('/api/1/project/get_project_by_id.json?id=' + that.project.id).then(function (res) {
        let result = res.result
        result.dateTime = moment(result.dateTime)
        that.result = result
      })
    },
    onSubmit () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        const that = this
        let data = that.form.getFieldsValue()
        data.id = that.project.id
        data.dateTime = data.dateTime.format('YYYY-MM-DD')
        if (data.id === '') {
          that.$message.info('表单提交异常')
        } else {
          this.loading = true
          this.$http.post('/api/1/project/edit_project.json', qs.stringify(data)).then(function (res) {
            if (res.code !== 200) {
              return
            }
            that.$message.success('解决方案修改成功!')
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
