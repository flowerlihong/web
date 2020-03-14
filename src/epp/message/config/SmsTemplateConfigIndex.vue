<template>
    <page-view title="短信模板配置">
        <template slot="action">
            <a-button-group>
                <a-button @click="onAddVacationConfigType"><a-icon type="plus-circle"/>添加</a-button>
                <a-button @click="onEditVacationConfigType(treeNodeId)"><a-icon type="edit"/>编辑</a-button>
                <a-button @click="onDelVacationConfigType(treeNodeId)" type="danger"><a-icon type="delete"/>删除</a-button>
            </a-button-group>
        </template>
        <a-card :bordered="false">
            <a-row class="tree-container">
                <a-col :xxl="4" :xl="6">
                    <a-tree showLine showIcon :treeData="treeData" @select="onTreeSelect" :defaultSelectedKeys="defaultTreeSelectedKeys">
                    </a-tree>
                </a-col>
                <a-col :xxl="20" :xl="18">
                    <a-skeleton :loading="moduleLoading">
                        <table class="fx-form-view">
                            <tr>
                                <th>模板名称</th>
                                <td colspan="3">
                                    <div>{{selectedModule.name}}</div>
                                </td>
                            </tr>
                            <tr>
                                <th>keyword</th>
                                <td>
                                    <div>{{selectedModule.keyword}}</div>
                                </td>
                                <th>vendorCode</th>
                                <td>
                                    <div>{{selectedModule.vendorCode}}</div>
                                </td>
                            </tr>
                            <tr>
                                <th>内容</th>
                                <td colspan="3">
                                    <div>{{selectedModule.content}}</div>
                                </td>
                            </tr>
                            <tr>
                                <th>登记日期</th>
                                <td>
                                    <div>{{selectedModule.extras.createdAt}}</div>
                                </td>
                                <th>状态</th>
                                <td>
                                    <div>{{selectedModule.state === 'E'? '正常使用':'停用'}}</div>
                                </td>
                            </tr>
                        </table>
                    </a-skeleton>
                </a-col>
            </a-row>
        </a-card>
        <add-view ref="addView" :visible="modalVisible.addView" @success="onOk" @cancel="onClose" />
        <edit-view ref="editView" :visible="modalVisible.editView" @success="onEditOk" @cancel="onClose" />
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import addView from './SmsTemplateAdd'
import editView from './SmsTemplateEdit'
export default {
  name: 'SmsTemplateConfigIndex',
  components: {
    PageView,
    addView,
    editView
  },
  created () {
    this.loadConfigType()
  },
  data () {
    return {
      treeNodeName: '',
      treeNodeId: '',
      isLeaf: false,
      defaultTreeSelectedKeys: [],
      loading: false,
      parentTable: true,
      leafTable: false,
      moduleLoading: false,
      autoExpandParent: true,
      treeData: [],
      treeExpandedKeys: [],
      selectedModule: {
        id: '',
        name: '',
        keyword: '',
        vendorCode: '',
        content: '',
        createdAt: '',
        extras: {
          createdAt: ''
        }
      },
      modalVisible: {
        addView: false,
        editView: false
      }
    }
  },
  methods: {
    onTreeSelect (selectedKeys, info) {
      if (selectedKeys.length === 0) {
        return
      }
      const id = selectedKeys[0]
      this.treeNodeId = id
      this.treeNodeName = info.node.title
      this.isLeaf = info.node.isLeaf
      this.getModuleInfo(id)
    },
    // 展开/收起树节点
    onTreeExpand (expandedKeys) {
      this.treeExpandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    getModuleInfo (moduleId) {
      const that = this
      that.moduleLoading = true
      that.$http.get('/api/1/msg/config/get_sms_template_config.json?id=' + moduleId).then(function (resp) {
        that.selectedModule = resp.result
        that.moduleLoading = false
      })
    },
    loadConfigType () {
      const that = this
      that.$http.get('/api/1/msg/config/get_sms_template_config_list.json?state=' + 'E').then(function (resp) {
        that.treeData = that.mapTreeData(resp.result)
        that.defaultTreeSelectedKeys.push(that.treeData[0].key)
        that.treeNodeId = that.treeData[0].key
        that.treeNodeName = that.treeData[0].name
        that.getModuleInfo(that.treeData[0].key)
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
          // isLeaf: !item.hasChildren,
          isLeaf: !item.parent,
          children: that.mapTreeData(item.children)
        }
      })
    },
    onAddVacationConfigType () {
      this.modalVisible.addView = true
      this.$refs.addView.preView()
    },
    onDelVacationConfigType (id) {
      let that = this
      this.$http.post('/api/1/msg/config/delete_sms_template_config.json?id=' + id).then(function (response) {
        if (response.code !== 200) {
          that.$message.error('删除失败')
        }
        that.$message.success('删除成功')
        that.loadConfigType()
      })
    },
    onEditVacationConfigType (id) {
      this.modalVisible.editView = true
      this.$refs.editView.preView(id)
    },
    onOk () {
      this.modalVisible.addView = false
      this.loadConfigType()
    },
    onEditOk () {
      this.modalVisible.editView = false
      this.getModuleInfo(this.treeNodeId)
    },
    onClose () {
      this.modalVisible.addView = false
      this.modalVisible.editView = false
    }
  }
}
</script>

<style scoped>
    #fx-select-dropdown {
        float: left;
        width: 20%;
        height: auto;
        font-weight: bolder;
    }

    #fx-select-panel {
        margin-left: 5%;
        float: left;
        width: 75%;
    }

    .treeStyle {
        color: #54aeeb;
        border: 1px dashed #E8E8E8;
        border-radius: 15px;
        background: #FAFAFA;
    }
</style>
