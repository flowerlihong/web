<template>
    <div>
        <a-button v-if="!readonly" :id="'AttachButton' + _uid" icon="upload" :loading="configLoading">上传文件</a-button>

        <div class="ant-upload-list ant-upload-list-text">
            <div v-for="(file, idx) in uploadFiles" :key="file.id" :class="file.clazz">
                <div>
                    <a-tooltip :title="file.response">
                        <span v-if="file.url" target="_blank" style="font-size: 18px; cursor: pointer; color: #262626;line-height: 26px;"  @click="doViewAttByNtko(file)" >{{ fileName }}</span>
                        <span v-else :title="file.name" class="ant-upload-list-item-name">{{file.name}} {{file.size}}</span>
                    </a-tooltip>
                </div>
                <i v-if="!readonly" @click="onDelete(file.id)" class="anticon anticon-close">
                    <svg viewBox="64 64 896 896" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true" class=""><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg>
                </i>
                <div v-if="file.percent < 100" class="ant-upload-list-item-progress">
                    <div class="ant-progress ant-progress-line ant-progress-status-normal ant-progress-default">
                        <div>
                            <div class="ant-progress-outer">
                                <div class="ant-progress-inner">
                                    <div class="ant-progress-bg" style="height: 2px; border-radius: 100px;" :style="{width:file.percent}"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ACCESS_TOKEN } from '@/store/mutation-types'
import ntkoBrowser from '@/components/DocEditor/ntko/ntkobackground.js'
import plupload from 'plupload'
import UploadSelectorExt from './UploadSelectorExt'

export default {
  name: 'DocumentView',
  props: {
    referId: {
      type: String,
      required: true,
      default: ''
    },
    configKey: {
      type: String,
      required: true
    },
    readonly: {
      type: Boolean,
      required: false,
      default: false
    },
    fileName: {
      type: String,
      default: ''
    },
    max: {
      type: Number,
      required: false
    },
    // 此字段仅用作融合到 Form 检验必须上传功能
    value: {
      type: String
    }
  },
  mounted () {
    this.loadConfig()
    this.refreshData()
  },
  watch: {
    referId (val) {
      this.refreshData()
    }
  },
  data () {
    return {
      configLoading: true,
      uploading: false,
      hasError: false,
      config: null,
      file_postfix: '',
      file_fixs: ['pdf', 'docx', 'doc', 'xlsx', 'xls'],
      uploadFiles: []
    }
  },
  methods: {
    loadConfig () {
      const that = this
      that.$http.get('/api/1/attachment/config.json?key=' + that.configKey).then(function (response) {
        if (response.code === 200) {
          that.configLoading = false
          that.config = response.result
          that.initUploader()
        }
      })
    },
    doViewAttByNtko (file) {
      let flag = true
      this.file_postfix = file.extension.toLowerCase()
      if (this.file_fixs.indexOf(this.file_postfix) === -1) { // 不包含
        flag = false
      }
      if (!flag) {
        window.open('/api/1/attachment/download?id=' + file.id)
      }
      let cmd = 2
      var ntkoed = ntkoBrowser.ExtensionInstalled()
      if (ntkoed) {
        /* global WEB_SERVER */
        if (this.file_postfix === 'pdf') {
          ntkoBrowser.openWindow(WEB_SERVER + '/3/ntko/pdfview.html?caseId=' + file.id + '&name=' + file.name, '广东省环境监测中心', 'F851BFD41D2B19ADED5AC4D87861A08F09C3B3C7')
          // eslint-disable-next-line no-undef
        } else if (this.file_postfix === 'docx' || this.file_postfix === 'doc' || this.file_postfix === 'xlsx' || this.file_postfix === 'xls') {
          ntkoBrowser.openWindow(WEB_SERVER + '/3/ntko/documentview.html?caseId=' + file.id + '&name=' + file.name, '广东省环境监测中心', 'F851BFD41D2B19ADED5AC4D87861A08F09C3B3C7')
        }
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
    getFileIndex (id) {
      return this.uploadFiles.findIndex(item => item.id === id)
    },
    refreshData () {
      const that = this
      if (!that.referId) {
        return
      }
      that.$http.get('/api/1/attachment/attachments.json?referId=' + that.referId + '&configKey=' + that.configKey).then(function (response) {
        if (response.code === 200) {
          let files = response.result.map(item => {
            return {
              id: item.id,
              name: item.name,
              extension: item.extension,
              size: item.sizeDesc,
              percent: 100,
              response: null,
              clazz: 'ant-upload-list-item-done',
              url: UploadSelectorExt.getUrl(item)
            }
          })
          that.uploadFiles = files
          if (that.uploadFiles.length > 0) {
            that.sendEvent()
          }
        }
      })
    },
    onDelete (fileId) {
      const that = this
      that.$http.get('/api/1/attachment/delete.json?id=' + fileId).then(function (response) {
        if (response.code === 200) {
          that.uploadFiles = that.uploadFiles.filter(file => file.id !== fileId)
        }
        that.sendEvent()
      })
    },
    initUploader () {
      const that = this
      let mimeTypes = []
      let mime = that.config.extension.join(',')
      if (!mime.includes('***')) {
        mimeTypes.push({ title: '文件类型', extensions: mime })
      }
      const uploader = new plupload.Uploader({
        headers: { 'X-Auth-Token': that.$ls.get(ACCESS_TOKEN) },
        runtimes: 'html5,flash,html4',
        browse_button: 'AttachButton' + that._uid,
        url: '/api/1/attachment/plupload.json',
        flash_swf_url: '../../../static/plupload/2.3.6/Moxie.swf',
        filters: {
          mime_types: mimeTypes,
          max_file_size: (that.config.maxSize / 1024) + 'kb',
          prevent_duplicates: false
        },
        init: {
          PostInit: function () {
            uploader.setOption('multipart_params', { referId: that.referId, key: that.configKey })
          },
          FilesAdded: function (up, files) {
            that.$emit('change', '1')
            if (that.uploadFiles.length >= that.max) {
              that.$warning({ title: '最多上传 ' + that.max + ' 个文件' })
              return
            }
            plupload.each(files, function (file) {
              that.uploadFiles.push({
                id: file.id,
                name: file.name,
                size: plupload.formatSize(file.size),
                percent: 1,
                response: null,
                clazz: 'ant-upload-list-item-uploading'
              })
            })
            this.uploading = true
            uploader.start()
          },
          UploadProgress: function (up, file) {
            const idx = that.getFileIndex(file.id)
            if (idx < 0) {
              return
            }
            that.uploadFiles[idx].percent = file.percent
          },
          FileUploaded: function (up, file, info) {
            let response = JSON.parse(info.response)
            const idx = that.getFileIndex(file.id)
            if (response.error !== null) {
              that.hasError = true
              that.uploadFiles[idx].percent = file.percent
              that.uploadFiles[idx].response = response.error.message
              that.uploadFiles[idx].clazz = 'ant-upload-list-item-error'
              console.log(that.uploadFiles[idx])
            } else {
              that.uploadFiles[idx].id = response.id
              that.uploadFiles[idx].percent = file.percent
              that.uploadFiles[idx].response = null
              that.uploadFiles[idx].clazz = 'ant-upload-list-item-done'
              that.uploadFiles[idx].url = '/api/1/attachment/download?id=' + response.id
            }

            that.sendEvent()
          },
          UploadComplete: function (up, files) {
            this.uploading = false
          },
          Error: function (up, err) {
            that.$message.error(err.message)
          }
        }
      })
      uploader.init()
    },
    sendEvent () {
      if (this.uploadFiles.length === 0) {
        this.$emit('change', '')
      } else {
        this.$emit('change', this.uploadFiles.length + '')
      }
    }
  }
}
</script>

<style scoped>
    .form-input .has-error .ant-btn {
        color: #f5222d;
        border-color: #f5222d;
    }
</style>
