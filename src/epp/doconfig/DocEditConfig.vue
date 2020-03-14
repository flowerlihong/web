
<!--
 Created by Xuz on 2019/03/27.
 xuz[at]live[dot]cn
 添加系统模块
-->
<template>
    <a-modal title="编辑文档服务器配置信息"
             :width="811"
             :visible="visible"
             :maskClosable="false"
             @ok="onSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading">
        <a-form :form="form">
                <table width="100%" class="fx-form">
                            <tr>
                                <th class="not-null">文档服务器名称:</th>
                                <td>
                                  <a-form-item>
                                    <a-input v-decorator="['serverName',{initialValue: editConfig.serverName,rules: [{ required: true, message: '请填写文档服务名称' }]}]"></a-input>
                                  </a-form-item>
                                </td>
                                <th>文档服务器IP地址:</th>
                                <td>
                                   <a-form-item>
                                      <a-input v-decorator="['ipAddress',{initialValue: editConfig.ipAddress}]"></a-input>
                                  </a-form-item>
                                </td>
                            </tr>
                            <tr>
                                <th class="not-null">服务器Socket端口号:</th>
                                <td>
                                   <a-form-item>
                                       <a-input v-decorator="['socketPort',{initialValue: editConfig.socketPort,rules: [{ required: true, message: '请填写文档服务器Socket端口号' }]}]"></a-input>
                                  </a-form-item>
                                </td>
                                <th class="not-null">文档存放的路径：</th>
                                <td>
                                   <a-form-item>
                                        <a-input v-decorator="['docPath',{initialValue: editConfig.docPath,rules: [{ required: true, message: '请填写文档存放的路径' }]}]"></a-input>
                                  </a-form-item>
                                </td>
                            </tr>
                             <tr>
                                <th class="not-null">字处理软件类型：</th>
                                <td>
                                   <a-form-item>
                                    <a-radio-group @change="onDocApp" v-model="docApp">
                                        <a-radio value="msword">word文档</a-radio>
                                        <a-radio value="wps">wps文档</a-radio>
                                   </a-radio-group>
                                  </a-form-item>
                                </td>
                                <th>对应互联网的域名：</th>
                                <td>
                                   <a-form-item>
                                     <a-input v-decorator="['domainName',{initialValue: editConfig.domainName}]"></a-input>
                                  </a-form-item>
                                </td>
                            </tr>
                            <tr>
                               <th>对应互联网的IP地址：</th>
                               <td>
                                  <a-form-item>
                                      <a-input v-decorator="['domainIp',{initialValue: editConfig.domainIp}]"></a-input>
                                  </a-form-item>
                               </td>
                              <th>对应服务器应用路径：</th>
                              <td>
                                  <a-form-item>
                                        <a-input v-decorator="['domainPath',{initialValue: editConfig.domainPath}]"></a-input>
                                  </a-form-item>
                               </td>
                            </tr>
                             <tr>
                               <th>文档共享文件夹地址：</th>
                               <td>
                                  <a-form-item>
                                      <a-input v-decorator="['filePath',{initialValue: editConfig.filePath}]"></a-input>
                                  </a-form-item>
                               </td>
                              <th>文档服务器描述：</th>
                              <td>
                                  <a-form-item>
                                        <a-input v-decorator="['dmDescription',{initialValue: editConfig.dmDescription}]"></a-input>
                                  </a-form-item>
                               </td>
                            </tr>
                  </table>
        </a-form>
    </a-modal>
</template>
<script>
import qs from 'qs'
export default {
  name: 'ModuleAdd',
  components: {

  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      modalLoading: false,
      editConfig: '',
      docApp: '',
      id: '',
      fileType: '',
      orgId: '',
      activeState: ''
    }
  },
  methods: {
    onDocApp (e) {
      this.docApp = e.target.value
    },
    preEditConfig () {
      this.modalLoading = true
      this.$http.get('/api/1/dmservices/get_dm_service_config.json').then(
        (resp) => {
          this.modalLoading = false
          this.editConfig = resp.result
          this.docApp = resp.result.docApp
          this.id = resp.result.id
          this.fileType = resp.result.fileType
          this.orgId = resp.result.orgId
          this.activeState = resp.result.activeState
        }
      )
    },
    onSubmit () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        let data = this.form.getFieldsValue()
        if (data.socketPort.length > 6) {
          this.$message.error('文档服务器Socket端口号长度不能超过6位数')
          return
        }
        data.id = this.id
        data.docApp = this.docApp
        data.fileType = this.fileType
        data.orgId = this.orgId
        data.activeState = this.activeState
        this.$http.post('/api/1/dmservices/edit_dm_service.json', qs.stringify(data)).then(
          (resp) => {
            if (resp.code === 200) {
              this.modalLoading = false
              this.$message.success('编辑成功')
              this.$emit('success')
            }
          }
        )
      })
    }
  }
}
</script>

<style lang="less" scoped>
    td{
        padding-left: 7px;
    }
    th{
        width: 143px;
    }
</style>
