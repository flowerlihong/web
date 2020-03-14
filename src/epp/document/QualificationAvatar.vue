<template>
  <a-modal
    title="文件图片/扫描件"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    :width="800"
    @ok="okHandel"
    @cancel="cancelHandel">
    <a-row>
      <a-col :xs="24" :md="12" :style="{height: '350px'}">
        <vue-cropper
          ref="cropper"
          :img="options.img"
          :info="true"
          :autoCrop="options.autoCrop"
          :autoCropWidth="options.autoCropWidth"
          :autoCropHeight="options.autoCropHeight"
          :fixedBox="options.fixedBox"
          @realTime="realTime"
        >
        </vue-cropper>
      </a-col>
      <a-col :xs="24" :md="12" :style="{height: '350px'}">
        <div class="avatar-upload-preview">
          <img :src="previews.url" :style="previews.img"/>
        </div>
      </a-col>
    </a-row>

    <input ref="file" type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)" style="display:none">

    <template slot="footer">
      <a-button key="delete" type="danger" @click="$refs.file.click()">上传图片</a-button>
      <a-button key="back" @click="cancelHandel">取消</a-button>
      <a-button key="submit" type="primary" :loading="confirmLoading" @click="okHandel">确定</a-button>
    </template>
  </a-modal>
</template>
<script>
import qs from 'qs'
import { VueCropper } from 'vue-cropper'
import { log } from 'util'

export default {
  components: {
    VueCropper
  },
  data () {
    return {
      visible: false,
      qualifyId: '',
      confirmLoading: false,
      options: {
        img: '',
        autoCrop: true,
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixedBox: true
      },
      previews: {}
    }
  },
  methods: {
    edit (id, companyId) {
      this.visible = true
      this.qualifyId = id
      this.companyId = companyId
      /* 获取原始头像 */
    },
    close () {
      this.id = null
      this.visible = false
    },
    cancelHandel () {
      this.close()
    },
    okHandel () {
      this.uploadImgRemote()
    },
    realTime (data) {
      this.previews = data
    },
    uploadImg (e) {
      // 上传图片
      // this.option.img
      var file = e.target.files[0]
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
        return false
      }
      var reader = new FileReader()
      reader.onload = e => {
        let data
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        this.options.img = data
      }
      // 转化为blob
      reader.readAsArrayBuffer(file)
    },
    uploadImgRemote () {
      const that = this
      that.confirmLoading = true
      that.$refs.cropper.getCropData(data => {
        that.$http.post('/api/1/qualification/avatar_base64.json?id=' + that.qualifyId, qs.stringify({ avatar: data, companyId: that.companyId })).then(function (resp) {
          that.$message.success('上传文件图片/扫描件成功')
          that.confirmLoading = false
          that.$emit('change', resp.msg)
          that.$emit('success')
        })
      })
    },
    onReloadPage () {
      this.$router.go(0)
    }
  }
}
</script>

<style lang="less" scoped>

  .avatar-upload-preview {
    position: absolute;
    top: 50%;
    transform: translate(50%, -50%);
    width: 200px;
    height: 200px;
    box-shadow: 0 0 4px #ccc;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
