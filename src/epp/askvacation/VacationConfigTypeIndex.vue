<template>
    <page-view title="假期配置">
        <template slot="action">
            <a-button-group>
                <a-button @click="onAddVacationConfigType"><a-icon type="plus-circle"/>添加假期类型</a-button>
                <a-button v-show="!isLeaf" @click="onAddVacationConfig(treeNodeId, treeNodeName)"><a-icon type="plus-circle"/>添加假期名称</a-button>
                <a-button v-show="!isLeaf" @click="onEditVacationConfigType(treeNodeId)"><a-icon type="edit"/>编辑此类型</a-button>
                <a-button v-show="isLeaf" @click="onEditVacationConfig(treeNodeId)"><a-icon type="edit"/>编辑此名称</a-button>
                <a-button v-show="!isLeaf" @click="onDelVacationConfigType(treeNodeId)" type="danger"><a-icon type="delete"/>删除此类型</a-button>
                <a-button v-show="isLeaf" @click="onDelVacationConfig(treeNodeId)" type="danger"><a-icon type="delete"/>删除此名称</a-button>
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
                        <table class="fx-form-view" v-show="parentTable">
                            <tr>
                                <th>假期类型</th>
                                <td colspan="3">
                                    <div>{{selectedModule.names}}</div>
                                </td>
                            </tr>
                            <tr>
                                <th>假期类别</th>
                                <td>
                                    <div>{{selectedModule.category ==='1'? '请假':'休假'}}</div>
                                </td>
                                <th>活动状态</th>
                                <td>
                                    <div>{{selectedModule.activity ==='1'? '有效':'无效'}}</div>
                                </td>
                            </tr>
                            <tr>
                                <th>假期类型说明</th>
                                <td colspan="3">
                                    <div>{{selectedModule.memo}}</div>
                                </td>
                            </tr>
                        </table>
                    </a-skeleton>
                </a-col>
                <a-col :xxl="20" :xl="18">
                    <a-skeleton :loading="moduleLoading">
                        <table class="fx-form-view" v-show="leafTable">
                            <tr>
                                <th>假期名称</th>
                                <td>
                                    <div>{{leafData.names}}</div>
                                </td>
                                <th>所属类型</th>
                                <td>
                                    <div>{{leafData.names}}</div>
                                </td>
                            </tr>
                            <tr>
                                <th>假期天数</th>
                                <td>
                                    <div>{{leafData.days === null? '无限制':leafData.days}}</div>
                                </td>
                                <th>活动状态</th>
                                <td>
                                    <div v-if="leafData.status === '1'">有效</div>
                                    <div v-else>无效</div>
                                </td>
                            </tr>
                            <tr>
                                <th>假期说明</th>
                                <td colspan="3">
                                    <div>{{leafData.meno}}</div>
                                </td>
                            </tr>
                        </table>
                    </a-skeleton>
                </a-col>
            </a-row>
        </a-card>
        <add-view ref="addView" :visible="modalVisible.addView" @success="onOk" @cancel="onClose" />
        <add-config ref="addConfig" :visible="modalVisible.addConfig" @success="onOk" @cancel="onClose" />
        <edit-config-type ref="editConfigType" :visible="modalVisible.editConfigType" @success="onOk" @cancel="onClose" />
        <edit-config ref="editConfig" :visible="modalVisible.editConfig" @success="onOk" @cancel="onClose" />
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import addView from './VacationConfigTypeAdd'
import editConfigType from './VacationConfigTypeEdit'
import addConfig from './VacationConfigAdd'
import editConfig from './VacationConfigEdit'
export default {
  name: 'VacationConfigTypeIndex',
  components: {
    PageView,
    addView,
    addConfig,
    editConfigType,
    editConfig
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
      leafData: {
        id: '',
        names: '',
        limits: '',
        meno: '',
        status: '1',
        workyear: '',
        confgtype: '',
        days: '',
        deletes: ''
      },
      selectedModule: {
        id: '',
        names: '',
        parent_id: '',
        memo: '',
        activity: ''
      },
      modalVisible: {
        addView: false,
        addConfig: false,
        editConfigType: false,
        editConfig: false
      }
    }
  },
  methods: {
    onTreeSelect (selectedKeys, info) {
      console.log(info)
      if (selectedKeys.length === 0) {
        return
      }
      const id = selectedKeys[0]
      this.treeNodeId = id
      this.treeNodeName = info.node.title
      this.isLeaf = info.node.isLeaf
      this.getDetailInfo(id, this.isLeaf)
    },
    getDetailInfo (id, isLeaf) {
      if (isLeaf) {
        this.getChildrenInfo(id)
        this.leafTable = true
        this.parentTable = false
      } else {
        this.leafTable = false
        this.parentTable = true
        this.getModuleInfo(id)
      }
    },
    // 展开/收起树节点
    onTreeExpand (expandedKeys) {
      this.treeExpandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    getChildrenInfo (id) {
      const that = this
      that.moduleLoading = true
      that.$http.get('/api/1/vacation_config/get_config_info.json?id=' + id).then(function (resp) {
        that.leafData = resp.result
        that.moduleLoading = false
      })
    },
    getModuleInfo (moduleId) {
      const that = this
      that.moduleLoading = true
      that.$http.get('/api/1/vacation_config_type/get_config_type.json?id=' + moduleId).then(function (resp) {
        that.selectedModule = resp.result
        that.moduleLoading = false
      })
    },
    loadConfigType () {
      const that = this
      that.$http.get('/api/1/vacation_config_type/get_config_type_list.json?activity=' + '2').then(function (resp) {
        that.treeData = that.mapTreeData(resp.result)
        that.defaultTreeSelectedKeys.push(that.treeData[0].key)
        that.treeNodeId = that.treeData[0].key
        that.treeNodeName = that.treeData[0].title
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
          title: item.names,
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
      // that.loading = true
      this.$http.post('/api/1/vacation_config_type/delete_config_type.json?id=' + id).then(function (response) {
        // that.loading = false
        if (response.code === 200) {
          that.$message.success('删除成功')
        }
      })
    },
    onDelVacationConfig (id) {
      let that = this
      // that.loading = true
      this.$http.post('/api/1/vacation_config/delete_config.json?id=' + id).then(function (response) {
        // that.loading = false
        if (response.code === 200) {
          that.$message.success('删除成功')
        }
      })
    },
    onEditVacationConfigType (id) {
      this.modalVisible.editConfigType = true
      this.$refs.editConfigType.preView(id)
    },
    onEditVacationConfig (id) {
      this.modalVisible.editConfig = true
      this.$refs.editConfig.preView(id)
    },
    onAddVacationConfig (id, name) {
      this.modalVisible.addConfig = true
      this.$refs.addConfig.preView(id, name)
    },
    onOk () {
      this.modalVisible.addView = false
      this.modalVisible.addConfig = false
      this.modalVisible.editConfigType = false
      this.modalVisible.editConfig = false
      this.loadConfigType()
      this.getDetailInfo(this.treeNodeId, this.isLeaf)
    },
    onClose () {
      this.modalVisible.addView = false
      this.modalVisible.addConfig = false
      this.modalVisible.editConfigType = false
      this.modalVisible.editConfig = false
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
