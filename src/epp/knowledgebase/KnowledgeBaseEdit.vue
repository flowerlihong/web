<template>
    <a-modal title="修改文章"
             :width="850"
             :visible="visible"
             :maskClosable="false"
             @ok="onSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading">
            <a-form :form="form">
                <a-form-item label="文章标题" v-bind="formItemLayout">
                    <a-input placeholder="标题"
                             v-decorator="['title',{initialValue:knowledgeArticle.title ,rules: [{ required: true, message: '请输入标题' }]}]"></a-input>
                </a-form-item>
                <a-form-item label="文章内容" v-bind="formItemLayout">
                    <TinyMCE ref="editor" height="420px" :value="knowledgeArticle.content"/>
                </a-form-item>
                <a-form-item label="上传附件" v-bind="formItemLayout">
                    <upload-selector :referId='knowledgeArticle.id' configKey='KNOWLEDGEBASE.FILE'/>
                </a-form-item>
            </a-form>
    </a-modal>
</template>

<script>
import PageView from '@/layouts/PageView'
import qs from 'qs'
import TinyMCE from '@/components/Editor/TinyMCE'
import UploadSelector from '@/components/selector/UploadSelector'
import AFormItem from 'ant-design-vue/es/form/FormItem'

export default {
  name: 'KnowledgeBaseEdit',
  components: {
    AFormItem,
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
  data () {
    return {
      loadId: '',
      form: this.$form.createForm(this),
      loading: false,
      formItemLayout: {
        labelCol: {
          lg: { span: 3 }, sm: { span: 7 }
        },
        wrapperCol: {
          lg: { span: 18 }, sm: { span: 18 }
        }
      },
      knowledgeArticle: {
        id: '',
        title: ''
      },
      modalLoading: false,
    }
  },
  methods: {
    // 点击弹窗回调方法
    knowledgeBaseEdit (loadId) {
      this.loadId = loadId
      this.loadData()
    },

    // 初始化数据
    loadData () {
      let that = this
      this.$http.get('/api/1/knowledge_base/get_knowledge_base.json?id=' + this.loadId).then(function (res) {
        let result = res.result
        that.knowledgeArticle = result
        that.content = result.content
      })
    },
    onSubmit () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        const that = this
        let data = that.form.getFieldsValue()
        data.content = this.$refs.editor.getContent()
        data.id = this.loadId
        if (data.content === ''){
          that.$message.info('内容不能为空')
        } else {
          this.loading = true
          this.$http.post('/api/1/knowledge_base/update_knowledge_base.json', qs.stringify(data)).then(function (res) {
            if (res.code !== 200) {
              return
            }
            that.$message.success('修改成功!')
            that.$emit('success')
            that.form.resetFields()
            that.modalLoading = false
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
