<template>
    <page-view title="公共知识库">
        <template slot="action">
            <a-input-search @search="onSearch" enterButton="搜索" placeholder="标题/文章内容"
                            size="default" style="width: 300px"/>
            <a-button @click="onAdd" icon="plus" style="margin-left: 50px" type="primary"
                      v-show="selectedKNode.id !== '' && selectedKNode.id !== rootData.id">添加文章
            </a-button>
        </template>
        <a-card class="card">
            <div class="tree">
                <a-tree
                        showIcon
                        :expandedKeys="expandedKeys"
                        :treeData="treeData"
                        @select="onTreeSelect"
                        @expand="onExpand"
                        class="treeStyle">
                    <template slot="customIcon" slot-scope="{dataRef}">
                        <a-icon v-if="dataRef.icons === 'star'" :type="dataRef.icons" style="color: #ff9c2f"></a-icon>
                        <a-icon v-else :type="dataRef.icons" style="color: #52c41a"></a-icon>
                    </template>
                </a-tree>
            </div>
            <div class="content">
                <a-icon style="margin-left: 10px; color: #ff311d" type="book"/>
                <span class="c-title">{{selectedKNode.nodeName}} </span>
                <a-list :dataSource="knowledgeArticle" :pagination="pagination" bordered style="margin-top: 5px">
                    <a-list-item slot="renderItem" slot-scope="item, index">
                        <template v-if="rootData.id === selectedKNode.id || selectedKNode.id === ''">
                            <span class="s-title"><a @click="onView(item.id)">{{item.title|subString}}</a></span>
                            <span class="s-nodes">{{item.extras.nodeName}}</span>
                            <span class="s-time">{{item.extras.publicDate}}</span>
                        </template>
                        <template v-else>
                            <span class="s-title"><a @click="onView(item.id)">{{item.title|subString}}</a></span>
                            <span class="s-nodes">{{item.extras.userName}}</span>
                            <span class="s-time">{{item.extras.publicDate}}</span>
                        </template>
                    </a-list-item>
                </a-list>
            </div>

            <!-- 添加弹窗 -->
            <knowledge-base-add ref="knowledgeBaseAdd" :visible="modalVisible.knowledgeBaseAdd" @success="onAddSuccess"
                                @cancel="onAddCancel"></knowledge-base-add>
        </a-card>
    </page-view>
</template>

<script>
import PageView from '@/layouts/PageView'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import qs from 'qs'
import KnowledgeBaseAdd from './KnowledgeBaseAdd'

export default {
  name: 'KnowledgeBaseIndex',
  components: {
    AFormItem,
    PageView,
    KnowledgeBaseAdd
  },
  created () {
    this.loadData()
    this.onInitTree()
  },
  // 截取字符串长度
  filters: {
    subString: function (data) {
      if (data.length > 30){
        data = data.substring(0, 30) + '...'
      }
      return data
    }
  },
  data () {
    return {
      knowledgeArticle: {
        title: '',
        extras: {
          userName: '',
          nodeName: '',
          publicDate: null
        }
      },
      // 分页
      pagination: {
        onChange: (page) => {
          this.queryParam.page = page
          this.loadData()
        },
        pageSize: 10,
        total: 0
      },
      queryParam: {
        page: 1,
        pageSize: 10,
        nodeId: '',
        title: '',
        content: ''
      },
      selectedKNode: {
        extras: {
          hasEdit: null
        },
        id: '',
        nodeName: ''
      },
      expandedKeys: [],
      treeData: [],
      rootData: {
        id: ''
      },
      // 对话框是否显示
      modalVisible: {
        knowledgeBaseAdd: false
      }
    }
  },
  methods: {
    // 初始化知识库内容列表
    loadData () {
      const that = this
      that.$http.get('/api/1/knowledge_base/query_knowledge_base_list_index.json').then(function (res) {
        let result = res.result
        that.knowledgeArticle = result
        that.pagination.total = res.page.total
      })
    },

    // 点击节点或查询获取数据
    onloadData () {
      const that = this
      that.$http.get('/api/1/knowledge_base/query_knowledge_base_list.json', {
        params: Object.assign(this.queryParam),
        paramsSerializer: function (params) {
          return qs.stringify(params, { indices: false })
        }
      }).then(function (res) {
        let result = res.result
        that.knowledgeArticle = result
        that.pagination.total = res.page.total
      })
    },

    // 查询
    onSearch (value) {
      this.queryParam.title = value
      this.queryParam.content = value
      this.queryParam.nodeId = ''
      this.onloadData()
    },

    onView (id) {
      this.$router.push({ path: '/knowledgebase/view?id=' + id })
    },

    // 增加窗口
    onAdd () {
      if (this.selectedKNode.extras.hasEdit) {
        this.modalVisible.knowledgeBaseAdd = true
        this.$refs.knowledgeBaseAdd.knowledgeBaseAdd(this.selectedKNode.id)
      } else {
        this.$message.success('没有权限操作')
      }
    },
    onAddSuccess () {
      this.modalVisible.knowledgeBaseAdd = false
      this.onloadData()
    },
    onAddCancel () {
      this.modalVisible.knowledgeBaseAdd = false
    },

    // 获取节点名称
    onGetNodeName (id) {
      const that = this
      that.$http.get('/api/1/knowledge_base/get_knowledge_node_name.json?id=' + id).then(function (res) {
        const result = res.result
        that.selectedKNode.nodeName = result.nodeName
        that.selectedKNode.extras.hasEdit = result.extras.hasEdit
      })
    },
    // 初始化节点
    onInitTree () {
      const that = this
      that.$http.get('/api/1/knowledge_base_node/knowledge_base_node_list_index.json').then(function (res) {
        that.treeData = that.mapTreeData(res.result)
        that.rootData.id = that.treeData[0].key
        // 遍历获取要展开的节点key
        that.treeData.forEach(item => {
          that.expandedKeys.push(item.key)
          item.children.forEach(item => {
            that.expandedKeys.push(item.key)
          })
        })
        that.onGetNodeName(that.treeData[0].key)
      })
    },

    // 节点展开/收起
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
    },

    // 节点选中
    onTreeSelect (selectedKeys, info) {
      if (selectedKeys.length === 0) {
        return
      }
      const id = selectedKeys[0]
      this.selectedKNode.id = id
      if (id !== this.rootData.id) {
        this.queryParam.nodeId = id
      } else {
        this.queryParam.nodeId = ''
      }
      this.onGetNodeName(id)
      this.queryParam.title = ''
      this.queryParam.content = ''
      this.onloadData()
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

<style scoped>
    .card {
        background: #FFFFFF;
    }

    .tree {
        float: left;
        width: 20%;
        height: auto;
        font-weight: bolder;
    }

    .content {
        background: #FAFAFA;
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

    .content .s-title {
        font-size: 16px;
    }

    .content .s-nodes, .s-time {
        margin-left: 10px;
        font-size: 14px;
        color: #999999;
        line-height: 24px;
    }

    .content .c-title {
        font-size: 18px;
        color: #B31E1E;
        margin-left: 5px;
    }
</style>
