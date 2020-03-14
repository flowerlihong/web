<!--
 Created by Xuz on 2019/04/08.
 xuz[at]live[dot]cn
 富文本编辑器 TinyMCE
-->
<template>
    <editor v-model="content" :init="editorInit"/>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/silver'

import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/code'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/paste'

import Editor from '@tinymce/tinymce-vue'

import { axios } from '@/utils/request'

export default {
  name: 'EditorExample',
  components: {
    Editor
  },
  props: {
    value: {
      type: String,
      default: null
    },
    height: {
      type: String,
      default: '400px'
    }
  },
  mounted () {
    this.content = this.value
    tinymce.init({})
  },
  watch: {
    value (val) {
      this.content = val
    }
  },
  data () {
    return {
      content: null,
      editorInit: {
        language_url: '/3/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        skin_url: '/3/tinymce/skins/ui/oxide',
        plugins: 'link image code paste',
        toolbar: 'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | link image | undo redo',
        branding: false,
        height: this.height,
        file_picker_types: 'file',
        images_upload_handler: function (blobInfo, success, failure) {
          let formData = new FormData()
          formData.append('key', 'tinymce.image')
          formData.append('file', blobInfo.blob(), blobInfo.filename())

          axios.post('/api/1/attachment/upload.json', formData).then(function (resp) {
            if (resp.code === 200) {
              success('/api/1/attachment/download?id=' + resp.id, { alt: blobInfo.filename() })
            } else {
              failure(resp.msg)
            }
          })
        },
        file_picker_callback: function (cb, value, meta) {
          const input = document.createElement('input')
          input.setAttribute('type', 'file')
          input.onchange = function () {
            const file = this.files[0]

            let formData = new FormData()
            formData.append('key', 'tinymce.image')
            formData.append('file', file, file.name)

            axios.post('/api/1/attachment/upload.json', formData).then(function (resp) {
              if (resp.code === 200) {
                cb('/api/1/attachment/download?id=' + resp.id, { text: file.name })
              } else {
                alert(resp.msg)
              }
            })
          }

          input.click()
        }
      }
    }
  },
  methods: {
    getContent () {
      return this.content
    }
  }
}
</script>

<style scoped>
</style>
