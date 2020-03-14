<template>
    <a-button icon="printer" @click="onEdit">打印呈批表</a-button>
</template>

<script>
import ntkoBrowser from './ntkobackground.js'
import { ACCESS_TOKEN } from '../../../store/mutation-types'

export default {
  created () {
    // eslint-disable-next-line camelcase
    this.access_token = this.$ls.get(ACCESS_TOKEN)
    const user = this.$ls.get('user')
    this.userId = user.id
    this.orgId = user.orgId
  },
  name: 'NtkoCPBPrint',
  // eslint-disable-next-line no-undef
  props: { id: { type: String }, docType: { type: String }, procInsId: { type: String } },
  methods: {
    onEdit: function () {
      let cmd = 2
      var ntkoed = ntkoBrowser.ExtensionInstalled()
      if (ntkoed) {
        /* global WEB_SERVER */
        ntkoBrowser.openWindow(WEB_SERVER + '/3/ntko/cpbprint.html?caseId=' + this.id + '&access_token=' + this.access_token + '&userId=' + this.userId + '&docType=' + this.docType + '&procInsId=' + this.procInsId + '&orgId=' + this.orgId, '广东省环境监测中心', 'F851BFD41D2B19ADED5AC4D87861A08F09C3B3C7')
        if (cmd === 3) {
          // eslint-disable-next-line no-unused-vars
          let CLOSEVENT = true
        } else {
          // eslint-disable-next-line no-unused-vars
          let CLOSEVENT = false
        }
      } else {
        alert('未安装 ntko')
        var iTop = ntkoBrowser.NtkoiTop() // 获得窗口的垂直位置
        var iLeft = ntkoBrowser.NtkoiLeft() // 获得窗口的水平位置
        window.open(WEB_SERVER + '/3/ntko/exeindex.html', '', 'height=200px,width=500px,top=' + iTop + 'px,left=' + iLeft + 'px,titlebar=no,toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no')
      }
    },
    ntkoCloseEvent () {
    }
  },
  data () {
    return {
      access_token: '',
      userId: '',
      orgId: ''
    }
  }
}
</script>

<style scoped>

</style>
