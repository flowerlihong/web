<!--
 Created by Xuz on 2019/04/07.
 xuz[at]live[dot]cn
 富文本编辑器示例
-->
<template>
    <page-view title="富文本编辑器示例">
        <a-card>
            <table class="fx-form">
                <tr>
                    <td>
                        <TinyMCE ref="editor" height="420px" :value="content"/>
                    </td>
                </tr>
                <tr>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td align="center">
                        <a-button type="primary" @click="onGetContent">读取内容</a-button>
                    </td>
                </tr>
            </table>
        </a-card>
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import TinyMCE from '@/components/Editor/TinyMCE'

export default {
  name: 'EditorExample',
  components: {
    PageView,
    TinyMCE
  },
  mounted () {
    this.that = this
  },
  data () {
    return {
      content: '默认内容'
    }
  },
  methods: {
    onGetContent: function () {
      alert(this.$refs.editor.getContent())
    }
  }
}
</script>

<style scoped>
</style>
