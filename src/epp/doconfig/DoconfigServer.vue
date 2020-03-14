<!--
 Created by Xuz on 2019/03/25.
 xuz[at]live[dot]cn
 模块配置
-->
<template>
    <page-view title="文档服务器配置信息" ref="card">
        <!-- action -->
        <template slot="action">
            <a-button @click="onEditConfig"><a-icon type="edit"/>修改配置信息</a-button>
        </template>
        <a-card :bordered="false" >
           <table width="100%" class="fx-form-view" >
               <tr>
                   <th>文档服务器名称</th>
                   <td>{{serve.serverName}}</td>
               </tr>
               <tr>
                   <th>文档服务器IP地址</th>
                   <td>{{serve.ipAddress}}</td>
               </tr>
               <tr>
                  <th>文档服务器Socket端口号</th>
                  <td>{{serve.socketPort}}</td>
               </tr>
               <tr>
                  <th>文档存放的路径</th>
                  <td>{{serve.docPath}}</td>
               </tr>
               <tr>
                  <th>文档软件类型</th>
                  <td>{{type}}</td>
               </tr>
                <tr>
                   <th>对应互联网的域名</th>
                   <td>{{serve.domainName}}</td>
               </tr>
               <tr>
                   <th>对应互联网的IP地址</th>
                   <td>{{serve.domainIp}}</td>
               </tr>
               <tr>
                  <th>对应服务器应用路径</th>
                  <td>{{serve.domainPath}}</td>
               </tr>
               <tr>
                  <th>文档共享文件夹地址</th>
                  <td>{{serve.filePath}}</td>
               </tr>
               <tr>
                  <th>文档服务器描述</th>
                  <td>{{serve.dmDescription}}</td>
               </tr>
           </table>
        </a-card>
          <!-- 修改配置信息 -->
        <doc-edit-config ref="docEditConfig" :visible="editConfig" @success="onEditConfigSuccess" @cancel="onEditConfigCancel" />
    </page-view>
</template>
<script>
import { PageView } from '@/layouts'
import DocEditConfig from './DocEditConfig.vue'
import qs from 'qs'
export default {
  name: 'ModuleIndex',
  components: {
    PageView,
    DocEditConfig
  },
  created () {
    this.information()
  },
  data () {
    return {
      serve: {},
      type: '',
      editConfig: false
    }
  },
  methods: {
    onEditConfig () {
      this.editConfig = true
      this.$refs.docEditConfig.preEditConfig()
    },
    onEditConfigSuccess () {
      this.editConfig = false
      this.$router.go(0)
    },
    onEditConfigCancel () {
      this.editConfig = false
    },
    information () {
      this.$http.get('/api/1/dmservices/get_dm_service_config.json').then(
        (resp) => {
          this.serve = resp.result
          var doc = resp.result.docAppList
          for (var i = 0; i < doc.length; i++) {
            if (resp.result.docApp === doc[i].app_name) {
              this.type = doc[i].file_name
            }
          }
        }
      )
    }
  }
}
</script>

<style scoped>
    th{
        width: 174px;
    }
</style>
