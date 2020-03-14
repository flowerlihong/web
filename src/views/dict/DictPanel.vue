<template>
    <a-card :bordered="false">
        <detail-list :col="2">
            <detail-list-item term="字典名称">{{dictModel.name}}</detail-list-item>
            <detail-list-item term="字典标识">{{dictModel.keyword}}</detail-list-item>
            <detail-list-item term="是否缓存">{{dictModel.enableCache === 1 ? '是' : '否'}}</detail-list-item>
            <detail-list-item term="描述">{{dictModel.remark}}</detail-list-item>
        </detail-list>
        <div class="table-operator">
            <a-button type="primary" icon="plus" @click="onAddItem">添加字典项</a-button>&nbsp;
            <a-button v-if="selectedTreeNode" type="primary" icon="edit" @click="onEditItem">修改字典项</a-button>&nbsp;
            <a-popconfirm title="是否确认删除？" @confirm="onDeleteItem">
                <a-button v-if="selectedTreeNode" type="primary" icon="delete">删除字典项</a-button>
            </a-popconfirm>
        </div>
        <a-row class="tree-container">
            <a-col :span="7">
                <div>字典项：</div>
                <a-tree showLine :loadData="onLoadTreeData" :treeNodes="treeData" @select="onSelectItem" />
            </a-col>
            <a-col :span="17" class="tree-detail">
                <table class="fx-form-view">
                    <tr>
                        <th>字典名称</th>
                        <td>{{selectedModel.name}}</td>
                    </tr>
                    <tr>
                        <th>字典取值</th>
                        <td>{{selectedModel.value}}</td>
                    </tr>

                    <tr>
                        <th>排序号</th>
                        <td>{{selectedModel.seq_no}}</td>
                    </tr>
                    <tr>
                        <th>描述</th>
                        <td>{{selectedModel.remark}}</td>
                    </tr>
                </table>
            </a-col>
        </a-row>
        <DictItemEdit ref="dictItemEdit" :dictId="dictId" @success="onSaveSuccess"/>
    </a-card>
</template>

<script>
import { axios as request } from '@/utils/request'
import DetailList from '@/components/tools/DetailList'
import DictItemEdit from './DictItemEdit'

const DetailListItem = DetailList.Item

export default {
  name: 'DictPanel',
  components: {
    DetailList,
    DetailListItem,
    DictItemEdit
  },
  created () {
    this.loadDict()
    this.loadDictItem('')
  },
  data () {
    return {
      dictId: this.$route.query.id,
      dictModel: {},
      selectedTreeNode: null,
      selectedModel: {},
      treeData: [],
      modalVisible: false
    }
  },
  methods: {
    reloadTree () {
      this.selectedTreeNode = null
      this.selectedModel = {}
      this.loadDictItem('')
    },
    onLoadTreeData (treeNode) {
      this.selectedTreeNode = treeNode
      if (treeNode.dataRef.children) {
        return new Promise(function (resolve, reject) {
          resolve()
        })
      }
      return this.loadDictItem(treeNode.dataRef.key)
    },
    loadDict () {
      let that = this
      return request.get('/api/1/dict/dict.json?id=' + this.dictId).then(function (response) {
        that.dictModel = response.result
      })
    },
    loadDictItem (parentId) {
      let that = this
      return request.get('/api/1/dict/item-list.json?dictId=' + this.dictId + '&id=' + parentId).then(function (response) {
        if (that.selectedTreeNode == null) {
          that.treeData = response.result
        } else {
          that.selectedTreeNode.dataRef.children = response.result
          that.treeData = [...that.treeData]
        }
      })
    },
    onSelectItem (selectedKeys, info) {
      if (selectedKeys.length === 0) {
        this.selectedTreeNode = null
        this.selectedModel = {}
      } else {
        this.selectedTreeNode = info.node
        this.selectedModel = info.node.dataRef
      }
    },
    onAddItem () {
      if (this.selectedTreeNode !== null) {
        this.$refs.dictItemEdit.preAdd(this.selectedModel.id)
      } else {
        this.$refs.dictItemEdit.preAdd(null)
      }
    },
    onEditItem () {
      this.$refs.dictItemEdit.preEdit(this.selectedModel.id)
    },
    onSaveSuccess () {
      this.reloadTree()
    },
    onDeleteItem () {
      let that = this
      request.post('/api/1/dict/item-remove.json?id=' + this.selectedModel.id).then(function () {
        that.$message.success('删除字典项成功')
        that.reloadTree()
      })
    }
  }
}
</script>

<style scoped>
    .table-operator {
        margin-bottom: 14px;
    }
</style>
