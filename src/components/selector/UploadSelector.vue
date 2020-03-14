<template>
    <div>
        <a-button v-if="!readonly" :id="'AttachButton' + _uid" icon="upload" :loading="configLoading">上传文件</a-button>

        <div class="ant-upload-list ant-upload-list-text">
            <div v-for="(file, idx) in uploadFiles" :key="file.id" class="ant-upload-list-item" :class="file.clazz">
                <div class="ant-upload-list-item-info">
                    <a-tooltip :title="file.response">
                        <i class="anticon anticon-paper-clip"><svg viewBox="64 64 896 896" data-icon="paper-clip" width="1em" height="1em" fill="currentColor" aria-hidden="true" class=""><path d="M779.3 196.6c-94.2-94.2-247.6-94.2-341.7 0l-261 260.8c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0 0 12.7 0l261-260.8c32.4-32.4 75.5-50.2 121.3-50.2s88.9 17.8 121.2 50.2c32.4 32.4 50.2 75.5 50.2 121.2 0 45.8-17.8 88.8-50.2 121.2l-266 265.9-43.1 43.1c-40.3 40.3-105.8 40.3-146.1 0-19.5-19.5-30.2-45.4-30.2-73s10.7-53.5 30.2-73l263.9-263.8c6.7-6.6 15.5-10.3 24.9-10.3h.1c9.4 0 18.1 3.7 24.7 10.3 6.7 6.7 10.3 15.5 10.3 24.9 0 9.3-3.7 18.1-10.3 24.7L372.4 653c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0 0 12.7 0l215.6-215.6c19.9-19.9 30.8-46.3 30.8-74.4s-11-54.6-30.8-74.4c-41.1-41.1-107.9-41-149 0L463 364 224.8 602.1A172.22 172.22 0 0 0 174 724.8c0 46.3 18.1 89.8 50.8 122.5 33.9 33.8 78.3 50.7 122.7 50.7 44.4 0 88.8-16.9 122.6-50.7l309.2-309C824.8 492.7 850 432 850 367.5c.1-64.6-25.1-125.3-70.7-170.9z"></path></svg></i>
                        <a v-if="file.url" target="_blank" :href="file.url" class="ant-upload-list-item-name">{{file.name}} {{file.size}}</a>
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
import plupload from 'plupload'

export default {
  name: 'UploadSelector',
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
              size: item.sizeDesc,
              percent: 100,
              response: null,
              clazz: 'ant-upload-list-item-done',
              url: '/api/1/attachment/download?id=' + item.id
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
