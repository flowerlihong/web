<template>
    <a-button @click="onEdit">编辑正文(软航)</a-button>
</template>

<script>
import ntkoBrowser from './ntkobackground.js'

export default {
  name: 'NtkoOfficeButton',
  methods: {
    onEdit: function () {
      console.log('onEdit')
      let cmd = 2
      var ntkoed = ntkoBrowser.ExtensionInstalled()
      if (ntkoed) {
        ntkoBrowser.openWindow('http://172.16.1.114:3737/3/ntko/editindex.html?caseId=666', '深圳市腾讯计算机系统有限公司', '6D7D06565430B0B7C1750E01AC1BC3075F47B7F1')
        if (cmd === 3) {
          let CLOSEVENT = true
        } else {
          let CLOSEVENT = false
        }
      } else {
        alert('未安装 ntko')
        var iTop = ntkoBrowser.NtkoiTop() // 获得窗口的垂直位置
        var iLeft = ntkoBrowser.NtkoiLeft() // 获得窗口的水平位置
        window.open('http://172.16.1.114:3737/3/ntko/exeindex.html', '', 'height=200px,width=500px,top=' + iTop + 'px,left=' + iLeft + 'px,titlebar=no,toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no')
      }
    }
  }
}
</script>

<style scoped>

</style>
