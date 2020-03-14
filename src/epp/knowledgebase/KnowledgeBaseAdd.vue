<template>
    <a-modal title="添加新文章"
             :width="850"
             :visible="visible"
             :maskClosable="false"
             @ok="onSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading">
            <a-form :form="form">
                <a-form-item label="文章标题" v-bind="formItemLayout">
                    <a-input placeholder="标题"
                             v-decorator="['title',{ rules: [{ required: true, message: '请输入标题' }, {max: 200, message: '标题不能超过200个字'}]}]"></a-input>
                </a-form-item>
                <a-form-item label="文章内容" v-bind="formItemLayout">
                    <TinyMCE ref="editor" height="420px" :value="content"/>
                </a-form-item>
                <a-form-item label="上传附件" v-bind="formItemLayout">
                    <upload-selector :referId='fileId' configKey='KNOWLEDGEBASE.FILE'/>
                </a-form-item>
            </a-form>
    </a-modal>
</template>

<script>
import PageView from '@/layouts/PageView'
import qs from 'qs'
import TinyMCE from '@/components/Editor/TinyMCE'
import UploadSelector from '@/components/selector/UploadSelector'

const uuidv4 = require('uuid/v4')

export default {
  name: 'KnowledgeBaseAdd',
  components: {
    PageView,
    TinyMCE,
    UploadSelector
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  created () {
    const user = this.$ls.get('user')
    this.knowledgeArticle.userId = user.id
  },
  data () {
    return {
      content: '',
      nodeId: '',
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: {
          lg: { span: 3 }, sm: { span: 7 }
        },
        wrapperCol: {
          lg: { span: 18 }, sm: { span: 18 }
        }
      },
      knowledgeArticle: {
        userId: '',
        nodeId: ''
      },
      loading: false,
      modalLoading: false,
      fileId: uuidv4()
    }
  },
  methods: {
    knowledgeBaseAdd (nodeId) {
        this.nodeId = nodeId
    },

    onSubmit () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        const that = this
        let data = that.form.getFieldsValue()
        data.userId = this.knowledgeArticle.userId
        data.nodeId = this.nodeId
        data.id = this.fileId
        data.content = this.$refs.editor.getContent()
        if (data.content === '') {
          that.$message.info('内容不能为空')
        } else {
          this.loading = true
          this.$http.post('/api/1/knowledge_base/add_knowledge_base.json', qs.stringify(data)).then(function (res) {
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

<style scoped>

</style>
