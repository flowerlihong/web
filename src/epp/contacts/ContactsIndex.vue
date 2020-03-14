<!--
    Created by LuRX on 2019/3/26.
    通讯录
-->
<template>
    <page-view title="通讯录">
        <template slot="action">
            <a-input-search placeholder="请输入联系人姓名" @search="onSearch" enterButton="查询" size="default"/>
        </template>
        <a-card>
            <div style="width: 100%">
                <div id="fx-select-dropdown">
                    <a-tree showIcon
                            :expandedKeys="treeExpandedKeys"
                            @expand="onTreeExpand"
                            :autoExpandParent="autoExpandParent"
                            :treeData="treeData"
                            :loadData="onLoadData"
                            @select="onSelect" class="treeStyle">
                        <template slot="customIcon" slot-scope="{dataRef}">
                            <img v-if="dataRef.type==='O'" src="/img/org/unit.gif"/>
                            <img v-else-if="dataRef.type==='D'" src="/img/org/dept.gif"/>
                            <img v-else-if="dataRef.type==='P'" src="/img/org/pos.gif"/>
                            <img v-else src="/img/org/cube.gif"/>
                        </template>
                    </a-tree>
                </div>
                <div id="fx-select-panel">
                    <s-table
                            ref="table"
                            :columns="columns"
                            :data="loadData"
                            :rowKey="record => record.id">
                        <template slot="name" slot-scope="record">
                            <a @click="onInfo(record.id)">{{record.name}}</a>
                        </template>
                        <template slot="email" slot-scope="record">
                            {{record.email}}
                        </template>
                        <template slot="mobile" slot-scope="record">
                            {{record.mobile}}
                        </template>
                    </s-table>
                </div>
                <!-- 联系人信息对话框
                     默认隐藏 -->
                <contacts-info ref="contactsInfo" :visible="modalVisible.contactsInfo" @cancel="onCancel"/>
            </div>
        </a-card>
    </page-view>
</template>

<script>
import STable from '@/components/Table'
import qs from 'qs'
import ContactsInfo from './ContactsInfo'
import { PageView } from '@/layouts'

export default {
  name: 'ContactsIndex',
  components: {
    PageView,
    STable,
    ContactsInfo
  },
  created () {
    this.onOrgFetch()
  },
  data () {
    return {
      // 对话框显示属性
      modalVisible: {
        contactsInfo: false
      },
      // 表格列属性
      columns: [
        {
          title: '联系人姓名',
          align: 'center',
          width: '30%',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '电子邮件',
          align: 'center',
          width: '30%',
          scopedSlots: { customRender: 'email' }
        },
        {
          title: '联系电话',
          align: 'center',
          width: '35%',
          scopedSlots: { customRender: 'mobile' }
        }
      ],
      loading: false,
      autoExpandParent: true,
      treeData: [],
      treeExpandedKeys: [],
      userQuery: {
        orgId: '',
        deptId: '',
        posId: '',
        query: ''
      },
      // 初始化数据
      loadData: parameter => {
        return this.$http.get('/api/1/comp/users.json', {
          params: Object.assign(parameter, this.userQuery),
          paramsSerializer: function (params) {
            return qs.stringify(params, { indices: false })
          }
        }).then(res => {
          return res
        })
      }
    }
  },
  methods: {
    // 对话框弹出
    onInfo (id) {
      this.modalVisible.contactsInfo = true
      this.$refs.contactsInfo.contactsInfo(id)
    },
    onCancel () {
      this.modalVisible.contactsInfo = false
    },
    // 搜索
    onSearch (value) {
      if (value !== '') {
        let name = value
        this.userQuery.orgId = ''
        this.userQuery.deptId = ''
        this.userQuery.posId = ''
        this.userQuery.query = name
        this.$refs.table.refresh(true)
      } else if (value === '') {
        this.$message.info('请输入查询条件', 1)
      }
    },
    // 展开/收起树节点
    onTreeExpand (expandedKeys) {
      this.treeExpandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    // 点击树节点
    onSelect (selectedKeys, info) {
      const key = info.node.dataRef.key

      if (this.treeExpandedKeys.includes(key)) {
        // 如果展开，则缩起
        this.treeExpandedKeys = this.treeExpandedKeys.filter(item => item !== key)
      } else {
        if (info.selected && !info.node.isLeaf) {
          // 如果没展开，就展开
          this.treeExpandedKeys.push(key)
        }
      }

      if (selectedKeys.length === 0) {
      } else {
        this.userQuery = {}
        const item = info.node.dataRef
        if (item.type === 'O') {
          this.userQuery.orgId = item.key
        } else if (item.type === 'D') {
          this.userQuery.deptId = item.key
        } else if (item.type === 'P') {
          this.userQuery.posId = item.key
        }
        this.$refs.table.refresh(true)
      }
    },
    // 异步加载数据
    onLoadData (treeNode) {
      return new Promise((resolve) => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        let that = this
        this.$http.get('/api/1/comp/org.json?id=' + treeNode.dataRef.key).then(function (response) {
          treeNode.dataRef.children = that.mapTreeData(response.result)
          that.treeData = [...that.treeData]
          resolve()
        })
      })
    },
    onOrgFetch () {
      let that = this
      this.$http.get('/api/1/comp/org.json').then(function (response) {
        that.treeData = that.mapTreeData(response.result)
        if (response.result.length > 0) {
          that.treeExpandedKeys = [response.result[0].id]
        }
      })
    },
    mapTreeData (list) {
      return list.map(item => {
        return {
          key: item.id,
          title: item.name,
          type: item.type,
          isLeaf: !item.hasChildren,
          scopedSlots: { icon: 'customIcon' }
        }
      })
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
