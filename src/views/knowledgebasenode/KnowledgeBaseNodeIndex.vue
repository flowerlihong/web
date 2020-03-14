<!-- Created by LuRX on 2019/04/14-->
<template>
    <page-view title="知识库">
        <template slot="action">
            <a-button-group>
                <a-button @click="onAddRootKNode">
                    <a-icon type="plus-circle"/>
                    添加根节点
                </a-button>
                <a-button @click="onAddSubKNode">
                    <a-icon type="plus-circle"/>
                    添加子节点
                </a-button>
                <a-button @click="onEditKNode">
                    <a-icon type="edit"/>
                    修改节点
                </a-button>
                <a-button type="danger" @click="onDelKNode">
                    <a-icon type="delete"/>
                    删除节点
                </a-button>
                <a-button type="danger" @click="onRecreateIndex">
                    <a-icon type="delete"/>
                    重新建立索引
                </a-button>
            </a-button-group>
        </template>
        <a-card :bordered="false">
            <a-row class="tree-container">
                <a-col :xxl="4" :xl="6">
                    <a-tree
                            showIcon
                            showLine
                            :expandedKeys="expandedKeys"
                            :defaultSelectedKeys="defaultTreeSelectedKeys"
                            :treeData="treeData"
                            @expand="onExpand"
                            @select="onTreeSelect">
                        <template slot="customIcon" slot-scope="{dataRef}">
                            <a-icon :type="dataRef.icons" style="color: #52c41a"></a-icon>
                        </template>
                    </a-tree>
                </a-col>
                <a-col :xxl="20" :xl="18">
                    <a-skeleton :loading="moduleLoading">
                        <table class="fx-form-view">
                            <tr>
                                <th colspan="2">知识点节点详细信息</th>
                            </tr>
                            <tr>
                                <th>节点名称</th>
                                <td>
                                    {{selectedKNode.nodeName}}
                                </td>
                            </tr>
                            <tr>
                                <th>父节点</th>
                                <td>
                                    {{selectedKNode.extras.parentName}}
                                </td>
                            </tr>
                            <tr>
                                <th>顺序号</th>
                                <td>
                                    {{selectedKNode.seqNo}}
                                </td>
                            </tr>
                            <tr>
                                <th>图标</th>
                                <td>
                                    <a-icon :type="selectedKNode.nodeIcon" style="color: #52c41a"></a-icon>
                                </td>
                            </tr>
                            <tr>
                                <th>查看权限</th>
                                <td>
                                    {{selectedKNode.extras.visRight}}
                                </td>
                            </tr>
                            <tr>
                                <th>管理权限</th>
                                <td>
                                    {{selectedKNode.extras.adminRight}}
                                </td>
                            </tr>
                            <tr>
                                <th>描述</th>
                                <td>
                                    {{selectedKNode.description}}
                                </td>
                            </tr>
                        </table>
                    </a-skeleton>
                </a-col>
            </a-row>

            <!-- 添加节点 -->
            <k-node-add ref="kNodeAdd" :visible="modalVisible.addKNode" @success="onAddKNodeSuccess"
                        @cancel="onAddKNodeCancel"/>
            <!-- 编辑节点 -->
            <k-node-edit ref="kNodeEdit" :visible="modalVisible.editKNode" @success="onEditKNodeSuccess"
                         @cancel="onEditKNodeCancel"/>
        </a-card>
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import KNodeAdd from './KnowledgeBaseNodeAdd'
import KNodeEdit from './KnowledgeBaseNodeEdit'

export default {
  name: 'KnowledgeBaseNodePanel',
  components: {
    PageView,
    KNodeAdd,
    KNodeEdit
  },
  created () {
    this.onInitTree()
    this.loadRootNode()
  },
  // 刷新页面
  inject: ['reload'],
  data () {
    return {
      selectedKNode: {
        extras: {
          parentName: '',
          visRight: '',
          adminRight: ''
        },
        id: '',
        parentId: '',
        title: '',
        seqNo: '',
        nodeIcon: '',
        description: ''
      },
      modalVisible: {
        addKNode: false,
        editKNode: false,
      },
      moduleLoading: false,
      defaultTreeSelectedKeys: [],
      expandedKeys: [],
      treeData: [],
      rootNodeId: {
        id: ''
      }
    }
  },
  methods: {
    onInitTree () {
      let that = this
      this.$http.get('/api/1/knowledge_base_node/knowledge_base_node_index.json').then(function (res) {
        that.treeData = that.mapTreeData(res.result)
        if (res.code !== 200) {
          return
        }
        // 显示添加节点
        if (res.result.length > 0) {
          that.getKNodeInfo(that.treeData[0].key)
          that.defaultTreeSelectedKeys.push(that.treeData[0].key)
          // 遍历获取要展开的节点key
          that.treeData.forEach(item => {
            that.expandedKeys.push(item.key)
            item.children.forEach(item => {
              that.expandedKeys.push(item.key)
            })
          })
        }
      })
    },

    // 获取根节点
    loadRootNode () {
      const that = this
      that.$http.get('/api/1/knowledge_base_node/get_knowledge_base_root_node.json').then(function (res) {
        if (res.code !== 200) {
          return
        }
        that.rootNodeId = res.result
      })
    },

    // 节点展开/收起
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
    },

    // 点击节点
    onTreeSelect (selectedKeys, info) {
      if (selectedKeys.length === 0) {
        return
      }
      const id = selectedKeys[0]
      this.getKNodeInfo(id)
    },

    // --------------- 节点操作 ---------------
    onAddRootKNode () {
      this.modalVisible.addKNode = true
      this.$refs.kNodeAdd.kNodeAdd(this.rootNodeId.id)
    },
    onAddSubKNode () {
      this.modalVisible.addKNode = true
      this.$refs.kNodeAdd.kNodeAdd(this.selectedKNode.id)
    },
    onAddKNodeSuccess () {
      this.modalVisible.addKNode = false
      this.reload()
    },
    onAddKNodeCancel () {
      this.modalVisible.addKNode = false
    },
    onEditKNode () {
      this.modalVisible.editKNode = true
      this.$refs.kNodeEdit.kNodeEdit(this.selectedKNode.id)
    },
    onEditKNodeSuccess () {
      this.modalVisible.editKNode = false
      this.reload()
    },
    onEditKNodeCancel () {
      this.modalVisible.editKNode = false
    },

    // 获取节点信息
    getKNodeInfo (nodeId) {
      const that = this
      that.moduleLoading = true
      that.$http.get('/api/1/knowledge_base_node/get_knowledge_base_node.json?id=' + nodeId).then(function (res) {
        that.selectedKNode = res.result
        that.moduleLoading = false
      })
    },

    // 删除
    onDelKNode () {
      let that = this
      if (that.rootNodeId.id === null) {
        return that.$message.info('当前目录为空')
      }
      if (this.selectedKNode.id === '') {
        this.$confirm({
          title: '是否确认删除根目录',
          onOk () {
            that.$http.post('/api/1/knowledge_base_node/delete_knowledge_base_node.json?id=' + that.selectedKNode.id)
            that.$message.success('删除成功')
            that.reload()
          }
        })
      } else {
        this.$confirm({
          title: '是否确认删除当前节点？',
          content: '删除会把节点下子节点全部删除',
          onOk () {
            that.$http.post('/api/1/knowledge_base_node/delete_knowledge_base_node.json?id=' + that.selectedKNode.id)
            that.$message.success('删除成功')
            that.reload()
          }
        })
      }
    },

    // 重建索引
    onRecreateIndex () {
      let that = this
      this.$confirm({
        title: '是否确认建立索引？',
        content: '进行索引操作会占用较长时间,请等候至操作成功提示',
        onOk () {
          that.$http.post('/api/1/knowledge_base_node/recreate_index.json').then(function () {
            that.$message.success('重新建立索引成功')
            that.reload()
          })
        }
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
          title: item.nodeName,
          isLeaf: !item.hasChildren,
          icons: item.nodeIcon,
          children: that.mapTreeData(item.children),
          scopedSlots: { icon: 'customIcon' }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
