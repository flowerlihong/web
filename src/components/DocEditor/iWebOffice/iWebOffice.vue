<template>
    <div class="word-wrap" style="width:100%;height:100%">
        <div style="width:100%;">
            <a-button type="primary" @click="onUploadDoc">保存文档到服务器</a-button>
            <a-button @click="onOpenLocalDoc">打开本地文档</a-button>
            <input style="color:Red;WIDTH:40%" type="text" readonly :value="statusMsg">&nbsp;|←状态信息
        </div>
        <div id="office" style="width:100%;height:100%"></div>
    </div>
</template>

<script>
import $ from 'jquery'
import Vue from 'vue'
import WebOffice2015 from './WebOffice.js'
import webOfficeTpl from './iWebOffice2015.js'

export default {
  name: 'iWebOffice',
  data () {
    return {
      browser: {
        ieWin32: false,
        ieWin64: false,
        chrome: false,
        firefox: false
      },
      webOffice: null,
      webOfficeObj: null,
      statusMsg: null
    }
  },
  methods: {
    renderWebOfficePage () {
      $('#office').append($(webOfficeTpl))
    },
    initWebOfficeObject () {
      this.webOfficeObj = new WebOffice2015()
      this.webOfficeObj.setObj(document.getElementById('WebOffice'))
      try {
        // this.webOfficeObj.WebUrl = 'http://172.16.1.114:9090/api/1/kinggrid/office-server2'
        this.webOfficeObj.WebUrl = 'http://172.16.1.114:9090/api/1/kinggrid/office-server2'
        this.webOfficeObj.UserName = '演示人'
        this.webOfficeObj.RecordID = '123456789'
        this.webOfficeObj.FileName = 'sample.doc'
        this.webOfficeObj.FileType = '.doc'
        this.webOfficeObj.DebugMode = false
        this.webOfficeObj.ShowWindow = true
        this.webOfficeObj.EditType = '1'
        this.webOfficeObj.ShowMenu = 0
        this.webOfficeObj.ShowToolBar = 0

        if (this.webOfficeObj.WebOpen()) {
          console.log(this.webOfficeObj.Status)
          this.setStatusMsg(this.webOfficeObj.Status)
        }
      } catch (e) {
        console.log(e.description)
        this.setStatusMsg(this.webOfficeObj.Status)
      }
    },
    onUploadDoc () {
      this.setStatusMsg('onUploadDoc')
      if (this.webOfficeObj.WebSave()) {
        this.webOfficeObj.WebClose()
        window.close()
      } else {
        this.setStatusMsg(this.webOfficeObj.Status)
      }
    },
    onOpenLocalDoc () {
      this.setStatusMsg('onOpenLocalDoc')
      this.webOfficeObj.WebOpenLocal()
    },
    setStatusMsg (msg) {
      this.statusMsg = msg
    },
    uaMatch (ua) {
      const rMsie = /(msie\s|trident.*rv:)([\w.]+)/
      const rFirefox = /(firefox)\/([\w.]+)/
      const rOpera = /(opera).+version\/([\w.]+)/
      const rChrome = /(chrome)\/([\w.]+)/
      const rSafari = /version\/([\w.]+).*(safari)/

      let match = rMsie.exec(ua)
      if (match != null) {
        return { browser: 'IE', version: match[2] || '0' }
      }
      match = rFirefox.exec(ua)
      if (match != null) {
        return { browser: match[1] || '', version: match[2] || '0' }
      }
      match = rOpera.exec(ua)
      if (match != null) {
        return { browser: match[1] || '', version: match[2] || '0' }
      }
      match = rChrome.exec(ua)
      if (match != null) {
        return { browser: match[1] || '', version: match[2] || '0' }
      }
      match = rSafari.exec(ua)
      if (match != null) {
        return { browser: match[2] || '', version: match[1] || '0' }
      }
      if (match != null) {
        return { browser: '', version: '0' }
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.renderWebOfficePage()
      this.initWebOfficeObject()
    })
  },
  beforeDestroy () {
    this.webOfficeObj.WebClose()
  }
}
</script>

<style scoped>

</style>
