<!--
 Created by Xuz on 2019/03/25.
 xuz[at]live[dot]cn
 模块配置
-->
<template>
    <page-view title="模块配置">
        <!-- action -->
        <template slot="action">
            <a-button-group>
                <a-button @click="onAddRootModule"><a-icon type="plus-circle"/>添加根模块</a-button>
                <a-button v-show="selectedModule.id" @click="onAddModule"><a-icon type="plus-circle"/>添加子模块</a-button>
                <a-button v-show="selectedModule.id" @click="onEditModule"><a-icon type="edit"/>修改模块</a-button>
                <a-popconfirm title="是否确认删除模块?" @confirm="onDeleteModule">
                    <a-button v-show="selectedModule.id" type="danger"><a-icon type="delete"/>删除模块</a-button>
                </a-popconfirm>
            </a-button-group>
        </template>
        <a-card :bordered="false">
            <a-row class="tree-container">
                <a-col :xxl="4" :xl="6">
                    <a-tree :treeData="treeData" @select="onTreeSelect" :defaultSelectedKeys="defaultTreeSelectedKeys">
                    </a-tree>
                </a-col>
                <a-col :xxl="20" :xl="18">
                    <a-skeleton :loading="moduleLoading">
                        <table width="100%" class="fx-form-view">
                            <tr>
                                <th>模块名称</th>
                                <td>{{selectedModule.name}}</td>
                            </tr>
                            <tr>
                                <th>文档类别</th>
                                <td><span>{{selectedModule.extras.cate ? selectedModule.extras.cate.name : ''}}</span></td>
                            </tr>
                            <tr>
                                <th>模块图标</th>
                                <td><a-icon :type="selectedModule.icon" /></td>
                            </tr>
                            <tr>
                                <th>访问路径</th>
                                <td>{{selectedModule.web_path}}</td>
                            </tr>
                            <tr>
                                <th>模板文件</th>
                                <td>{{selectedModule.view_template}}</td>
                            </tr>
                            <tr>
                                <th>排序</th>
                                <td>{{selectedModule.sort}}</td>
                            </tr>
                            <tr>
                                <th>是否显示</th>
                                <td>
                                    <a-tag v-if="selectedModule.state === '1'" color="green">显示</a-tag>
                                    <a-tag v-else color="red">隐藏</a-tag>
                                </td>
                            </tr>
                            <tr>
                                <th>访问权限</th>
                                <td>{{selectedModule.extras.permissionSummary}}</td>
                            </tr>
                            <tr>
                                <th>描述</th>
                                <td>{{selectedModule.memo}}</td>
                            </tr>
                        </table>
                    </a-skeleton>
                </a-col>
            </a-row>
        </a-card>

        <!-- 添加模块 -->
        <module-add ref="moduleAdd" :visible="modalVisible.add" @success="onAddModuleSuccess" @cancel="onAddModuleCancel" />
        <!-- / 添加模块 -->
        <!-- 编辑模块 -->
        <module-edit ref="moduleEdit" :visible="modalVisible.edit" @success="onEditModuleSuccess" @cancel="onEditModuleCancel" />
        <!-- / 编辑模块 -->
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import qs from 'qs'
import ModuleAdd from './ModuleAdd'
import ModuleEdit from './ModuleEdit'

export default {
  name: 'ModuleIndex',
  components: {
    PageView,
    ModuleAdd,
    ModuleEdit
  },
  created () {
    this.loadModule()
  },
  data () {
    return {
      defaultTreeSelectedKeys: [],
      treeData: [],
      selectedModule: {
        id: '',
        cate_id: '',
        parent_id: '',
        icon: '',
        web_path: '',
        sort: '',
        memo: '',
        extras: {
          cate: {
            name: ''
          },
          permissionSummary: ''
        }
      },
      modalVisible: {
        add: false,
        edit: false
      },
      moduleLoading: false
    }
  },
  computed: {
  },
  methods: {
    onReloadPage () {
      this.$router.go(0)
    },
    loadModule () {
      const that = this
      that.$http.get('/api/1/module/get_modules.json').then(function (resp) {
        that.treeData = that.mapTreeData(resp.result)
        that.defaultTreeSelectedKeys.push(that.treeData[0].key)
        that.getModuleInfo(that.treeData[0].key)
      })
    },
    onTreeLoadData (treeNode) {
      return new Promise((resolve) => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        const that = this
        that.$http.get('/api/1/module/get_user_modules.json?parentId=' + treeNode.dataRef.key).then(function (response) {
          treeNode.dataRef.children = that.mapTreeData(response.result)
          that.treeData = [...that.treeData]
          resolve()
        })
      })
    },
    onTreeSelect (selectedKeys, info) {
      if (selectedKeys.length === 0) {
        return
      }
      const id = selectedKeys[0]
      this.getModuleInfo(id)
    },
    getModuleInfo (moduleId) {
      const that = this
      that.moduleLoading = true
      that.$http.get('/api/1/module/get_module.json?id=' + moduleId).then(function (resp) {
        that.selectedModule = resp.result
        that.moduleLoading = false
      })
    },
    onAddRootModule () {
      this.modalVisible.add = true
      this.$refs.moduleAdd.preModuleAdd(null)
    },
    onAddModule () {
      this.modalVisible.add = true
      this.$refs.moduleAdd.preModuleAdd(this.selectedModule)
    },
    onAddModuleSuccess () {
      this.modalVisible.add = false
      this.onReloadPage()
    },
    onAddModuleCancel () {
      this.modalVisible.add = false
    },
    onEditModule () {
      this.modalVisible.edit = true
      this.$refs.moduleEdit.preModuleEdit(this.selectedModule)
    },
    onEditModuleSuccess () {
      this.modalVisible.edit = false
      this.onReloadPage()
    },
    onEditModuleCancel () {
      this.modalVisible.edit = false
    },
    onDeleteModule () {
      const that = this
      that.$http.post('/api/1/module/delete_module.json', qs.stringify({ id: that.selectedModule.id })).then(function (resp) {
        that.$message.success('删除成功')
        that.onReloadPage()
      })
    },
    mapTreeData (list) {
      const that = this
      if (!list) {
        return []
      }
      return list.map(item => {
        return {
          key: item.id,
          title: item.name,
          isLeaf: !item.hasChildren,
          children: that.mapTreeData(item.children)
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
