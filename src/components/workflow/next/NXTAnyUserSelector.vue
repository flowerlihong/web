<!--
 Created by Xuz on 2019/01/28.
 xuz[at]live[dot]cn
 第二步：任意用户选择
-->
<template>
    <div style="display: flex">
        <a-card class="wf-card wf-any-user-card" :bordered="false">
            <div class="wf-card-title"><img src="/app/workflow/img/xwf/n2.gif"/> 请选择下一步处理人</div>
            <div class="wf-card-body">
                <div class="fx-select-panel" style="width:300px;">
                    <a-tree class="any-user-tree" showIcon :expandedKeys="treeExpandedKeys" @expand="onTreeExpand" :autoExpandParent="autoExpandParent" :treeData="treeData" :loadData="onLoadData" @select="onSelect">
                        <template slot="customIcon" slot-scope="{dataRef}">
                            <img v-if="dataRef.type==='O'" src="/img/org/unit.gif"/>
                            <img v-else-if="dataRef.type==='D'" src="/img/org/dept.gif"/>
                            <img v-else-if="dataRef.type==='P'" src="/img/org/pos.gif"/>
                            <img v-else src="/img/org/cube.gif"/>
                        </template>
                    </a-tree>
                </div>
                <div class="fx-select-panel" style="width:120px">
                    <template v-if="multiple">
                        <a-checkbox-group @change="onCheckboxUserChange" :value="selectedIds">
                            <a-checkbox v-for="user in userData" :key="'c' + user.id" :value="user.id">{{ user.name }}</a-checkbox>
                        </a-checkbox-group>
                    </template>
                    <template v-else>
                        <a-radio-group @change="onRadioUserChange" :value="selectedIds.length > 0 ? selectedIds[0] : ''">
                            <a-radio v-for="user in userData" :key="'c' + user.id" :value="user.id">{{ user.name }}</a-radio>
                        </a-radio-group>
                    </template>
                </div>
            </div>
        </a-card>
        <a-card class="wf-card" :bordered="false" style="width:160px;padding-left:8px">
            <div class="wf-card-title"><img src="/app/workflow/img/xwf/n3.gif"/> 已选择</div>
            <div class="wf-card-body">
                <ul class="any-user-selected">
                    <li v-for="user in selectedData" :key="'s' + user.id">{{user.name}}</li>
                </ul>
            </div>
        </a-card>
    </div>
</template>

<script>
import { XWF } from '../XWF'
import qs from 'qs'

export default {
  name: 'NXTAnyUserSelector',
  props: {
  },
  created () {
    this.onOrgFetch()
  },
  data () {
    return {
      wfType: null,
      multiple: false,
      autoExpandParent: true,
      treeData: [],
      treeExpandedKeys: [],
      userData: [],
      userQuery: {
        orgId: null,
        deptId: null,
        posId: null,
        query: null
      },
      selectedData: [],
      selectedIds: []
    }
  },
  watch: {
  },
  methods: {
    update (wfType) {
      this.wfType = wfType
      this.multiple = !XWF.isSingleEmpSelect(wfType)
    },
    getType () {
      return this.wfType
    },
    getSelected () {
      return this.selectedIds
    },
    onTreeExpand (expandedKeys) {
      this.treeExpandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onSelect (selectedKeys, info) {
      if (selectedKeys.length === 0) {

      } else {
        this.userQuery = {}

        const item = info.node.dataRef
        if (item.type === 'O') {
          this.userQuery.orgId = item.key
          // 点机构不显示用户列表，正式环境时，机构下会有很多很多人，列出来慢且意义不大
          return
        } else if (item.type === 'D') {
          this.userQuery.deptId = item.key
        } else if (item.type === 'P') {
          this.userQuery.posId = item.key
        }
        this.onUserFetch(item.type)
      }
    },
    onLoadData (treeNode) {
      return new Promise((resolve) => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }

        const that = this
        that.$http.get('/api/1/comp/org.json?id=' + treeNode.dataRef.key).then(function (response) {
          treeNode.dataRef.children = that.mapTreeData(response.result)
          that.treeData = [...that.treeData]
          resolve()
        })
      })
    },
    onOrgFetch () {
      const that = this
      that.$http.get('/api/1/comp/org.json').then(function (response) {
        that.treeData = that.mapTreeData(response.result)
        if (response.result.length > 0) {
          that.treeExpandedKeys = [response.result[0].id]
        }
      })
    },
    onDefaultUserFetch () {
      if (this.value == null) {
        return
      }
      const that = this
      that.selectedIds = this.value.split(',')
      that.$http.get('/api/1/org/get_users.json?ids=' + this.value).then(function (response) {
        that.selectedData = response.result
        that.selectedIds = that.selectedData.map(item => item.id)
      })
    },
    onUserFetch (nodeType) {
      const that = this
      let url = null
      if (nodeType === 'D') {
        url = '/api/1/comp/get_dept_user_list.json'
      } else if (nodeType === 'P') {
        url = '/api/1/comp/get_pos_user_list.json'
      } else {
        return
      }
      const params = { ...{ pageSize: 99 }, ...that.userQuery }
      that.$http.get(url + '?' + qs.stringify(params)).then(function (response) {
        that.userData = response.result
      })
    },
    onUserRemove (userId) {
      if (this.multiple) {
        this.selectedData = this.userData.filter(item => item.id !== userId)
        this.selectedIds = this.selectedIds.filter(id => id !== userId)
      } else {
        this.selectedData = []
        this.selectedIds = []
      }
      this.$emit('change', this.selectedIds)
    },
    onCheckboxUserChange (checkedValues) {
      this.selectedData = this.userData.filter(item => checkedValues.includes(item.id))
      this.selectedIds = [...checkedValues]

      this.$emit('change', this.selectedIds)
    },
    onRadioUserChange (e) {
      this.selectedData = this.userData.filter(item => item.id === e.target.value)
      this.selectedIds = [e.target.value]

      this.$emit('change', this.selectedIds)
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
    .wf-any-user-container {
        width:420px;
        height:260px;
        overflow: auto;
        font-size: 14px;
        background: #fff;
    }

    .fx-select-panel {
        display: inline-block;
        vertical-align: top;
        border-right: 1px solid #e8e8e8;
        height: 260px;
        overflow-x: hidden;
    }

    .fx-select-panel:nth-last-child(1) {
        border-right: none;
    }

    .ant-tree > li:first-child {
        padding-top: 100px !important;
    }

    .ant-radio-group, .ant-checkbox-group {
        margin: 8px;
        margin-top: 0;
    }

    .ant-radio-wrapper, .ant-checkbox-wrapper {
        display: block;
        height: 24px;
        letter-spacing: 1.5px;
    }

    .ant-checkbox-wrapper {
        margin-left: 0;
    }

    .any-user-selected {
        margin: 0;
        padding: 0;
        list-style: none;
        letter-spacing: 1.5px;
    }
</style>

<style>
    .any-user-tree > li:first-child {
        padding-top: 0 !important;
    }
</style>
