<template>
    <div v-on-clickaway="onClickAway" style="position:relative;width:300px">
        <div style="line-height:39.9999px">
            <span role="combobox" aria-haspopup="listbox" tabindex="0" class="ant-select ant-select-enabled ant-select-allow-clear" style="width:300px">
                <span @click="onUserSelect" class="ant-select-selection ant-select-selection--multiple">
                    <ul class="ant-select-selection__rendered">
                        <li v-for="user in selectedData" :key="user.id" unselectable="unselectable" role="menuitem" :title="user.name" class="ant-select-selection__choice" style="user-select: none;">
                            <span @click.stop="onUserRemove(user.id)" class="ant-select-selection__choice__remove">
                                <i class="ant-select-remove-icon anticon anticon-close">
                                    <svg viewBox="64 64 896 896" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true" class="">
                                        <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
                                    </svg>
                                </i>
                            </span>
                            <span class="ant-select-selection__choice__content">{{user.name}}</span>
                        </li>
                    </ul>
                    <span class="ant-select-selection__placeholder" style="display: none;">请选择用户</span>
                </span>
            </span>
        </div>
        <div style="position: absolute; top: 0; left: 0; width: 100%;">
            <div>
                <div class="fx-select-dropdown" :style="style">
                    <div style="width:420px;background-color: #e5e5e5;padding: 5px 0;">
                        <a-input-search placeholder="" style="width:200px;margin-left:10px" @search="onSearch"/>
                        <span style="float:right">
                            <a-button type="danger" @click="onClearUser">清空</a-button>
                            <a-button @click="onClickAway" style="margin-left:0px;">关闭</a-button>
                        </span>
                    </div>
                    <div class="fx-select-panel" style="width:300px;">
                        <a-tree showIcon :expandedKeys="treeExpandedKeys" @expand="onTreeExpand" :autoExpandParent="autoExpandParent" :treeData="treeData" :loadData="onLoadData" @select="onSelect">
                            <template slot="customIcon" slot-scope="{dataRef}">
                                <img v-if="dataRef.type==='O'" src="/img/org/unit.gif"/>
                                <img v-else-if="dataRef.type==='D'" src="/img/org/dept.gif"/>
                                <img v-else-if="dataRef.type==='P'" src="/img/org/pos.gif"/>
                                <img v-else src="/img/org/cube.gif"/>
                            </template>
                        </a-tree>
                    </div>
                    <div class="fx-select-panel" style="width:120px">
                        <div v-if="(selectedNodeType === 'D' || selectedNodeType === 'P') && userData.length === 0" style="color:lightgray;padding:6px">暂无用户</div>
                        <template v-if="multiple">
                            <a-checkbox-group :value="selectedIds">
                                <a-checkbox @change="onCheckboxUserChange" v-for="user in userData" :key="user.id" :value="user.id">{{ user.name }}</a-checkbox>
                            </a-checkbox-group>
                        </template>
                        <template v-else>
                            <a-radio-group :value="selectedIds.join('')" @change="onRadioUserChange">
                                <a-radio v-for="user in userData" :key="user.id" :value="user.id">{{ user.name }}</a-radio>
                            </a-radio-group>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import qs from 'qs'
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'UserSelector',
  mixins: [clickaway],
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: String
    },
    tag: {
    }
  },
  created () {
    this.onDefaultUserFetch()
    this.onOrgFetch()
  },
  data () {
    return {
      style: {
        left: 0,
        top: '40px',
        display: 'none'
      },
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
      selectedNodeType: null,
      selectedData: [],
      selectedIds: []
    }
  },
  watch: {
    value (val) {
      this.onDefaultUserFetch()
    }
  },
  methods: {
    clear () {
      this.selectedIds = []
      this.selectedData = []
    },
    isSelected () {
      return this.selectedIds.length > 0
    },
    getSelectedIds () {
      return this.selectedIds.join(',')
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
        this.selectedNodeType = item.type
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
      // console.log('onLoadData: ' + treeNode)
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
      } else if (nodeType === 'SEARCH') {
        url = '/api/1/comp/users.json'
      } else {
        return
      }
      const params = { ...{ pageSize: 99 }, ...that.userQuery }
      that.$http.get(url + '?' + qs.stringify(params)).then(function (response) {
        that.userData = response.result
      })
    },
    onUserSelect () {
      this.style.display = ''
    },
    onUserRemove (userId) {
      if (this.multiple) {
        this.selectedData = this.selectedData.filter(item => item.id !== userId)
        this.selectedIds = this.selectedIds.filter(id => id !== userId)
      } else {
        this.selectedData = []
        this.selectedIds = []
      }
      this.onTriggerChange()
    },
    onCheckboxUserChange (e) {
      const value = e.target.value
      if (e.target.checked) {
        // 选中
        this.selectedData = [...this.selectedData, ...this.userData.filter(item => item.id === value)]
        this.selectedIds = [...this.selectedIds, ...[value]]
      } else {
        // 删除
        this.selectedData = this.selectedData.filter(item => item.id !== value)
        this.selectedIds = this.selectedIds.filter(id => id !== value)
      }
      this.onTriggerChange()
    },
    onRadioUserChange (e) {
      this.selectedData = this.userData.filter(item => item.id === e.target.value)
      this.selectedIds = [e.target.value]
      this.style.display = 'none'

      this.onTriggerChange()
    },
    onSearch (value) {
      this.userQuery = {}
      this.userQuery.query = value
      this.onUserFetch('SEARCH')
    },
    onClearUser () {
      this.selectedData = []
      this.selectedIds = []
      this.onTriggerChange()
    },
    onClickAway () {
      this.style.display = 'none'
    },
    onTriggerChange () {
      let selectedNames = []
      this.selectedData.forEach(item => selectedNames.push(item.name))
      this.$emit('change', this.selectedIds.join(','), selectedNames.join(','), this.selectedData, this.tag)
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
    .fx-select-dropdown {
        width:420px;
        height:320px;
        overflow: auto;
        font-size: 14px;
        background: #fff;
        position: absolute;
        z-index: 1050;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, .15);
        white-space: nowrap;
    }

    .fx-select-panel {
        display: inline-block;
        vertical-align: top;
        border-right: 1px solid #e8e8e8;
        height: 260px;
        overflow-x: hidden;
        -ms-overflow-style: -ms-autohiding-scrollbar;
    }

    .ant-tree li {
        padding: 2px 0 !important;
    }

    .ant-radio-group, .ant-checkbox-group {
        margin: 8px;
    }

    .ant-radio-wrapper, .ant-checkbox-wrapper {
        display: block;
        height: 24px;
        letter-spacing: 1.5px;
    }

    .ant-checkbox-wrapper {
        margin-left: 0;
    }
</style>
