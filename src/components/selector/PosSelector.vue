<template>
    <div v-on-clickaway="onClickAway" style="width: 300px;">
        <div>
            <span role="combobox" aria-haspopup="listbox" tabindex="0" class="ant-select ant-select-enabled ant-select-allow-clear" style="width:300px">
                <span @click="onOpenSelector" class="ant-select-selection ant-select-selection--multiple">
                    <ul class="ant-select-selection__rendered">
                        <li v-for="(item, i) in selectedData" :key="`${i}-${item.key}`" unselectable="unselectable" role="menuitem" :title="item.title" class="ant-select-selection__choice" style="user-select: none;">
                            <span @click.stop="onNodeRemove(item.key)" class="ant-select-selection__choice__remove">
                                <i class="ant-select-remove-icon anticon anticon-close">
                                    <svg viewBox="64 64 896 896" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true" class="">
                                        <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
                                    </svg>
                                </i>
                            </span>
                            <span class="ant-select-selection__choice__content"><span style="color:#0050b3">{{item.deptName}}</span>[{{item.title}}]</span>
                        </li>
                    </ul>
                    <span class="ant-select-selection__placeholder" style="display: none;">请选择部门</span>
                </span>
            </span>
        </div>
        <div style="position: absolute; top: 0; left: 0; width: 100%;">
            <div>
                <div class="fx-select-dropdown" :style="style">
                    <div class="fx-select-panel" style="width:300px;">
                        <a-tree :selectedKeys="treeSelectedKeys" :checkable="multiple" showIcon v-model="treeCheckedKeys" :expandedKeys="treeExpandedKeys" @expand="onTreeExpand" :autoExpandParent="autoExpandParent" :treeData="treeData" :loadData="onLoadData" @check="onTreeCheck" @select="onTreeSelect">
                            <template slot="customIcon" slot-scope="{dataRef}">
                                <img v-if="dataRef.type==='O'" src="/img/org/unit.gif"/>
                                <img v-else-if="dataRef.type==='D'" src="/img/org/dept.gif"/>
                                <img v-else-if="dataRef.type==='P'" src="/img/org/pos.gif"/>
                                <img v-else src="/img/org/cube.gif"/>
                            </template>
                        </a-tree>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'PosSelector',
  mixins: [clickaway],
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: String
    }
  },
  created () {
    this.onDefaultValueFetch()
    this.onOrgFetch()
  },
  data () {
    return {
      style: {
        left: 0,
        top: '40px',
        display: 'none'
      },
      treeSelectedKeys: [],
      autoExpandParent: true,
      treeData: [],
      treeExpandedKeys: [],
      treeCheckedKeys: [],
      flatData: new Map(),
      selectedData: [],
      selectedIds: []
    }
  },
  watch: {
    value (val) {
      this.onDefaultValueFetch()
    }
  },
  methods: {
    onOpenSelector () {
      const that = this
      that.style.display = ''
      // 只找出加载过的节点去勾选
      let tmp = []
      that.flatData.forEach((v, k) => {
        if (that.selectedIds.includes(k)) {
          tmp.push(k)
        }
      })
      if (that.multiple) {
        that.treeCheckedKeys = [...tmp]
      } else {
        that.treeSelectedKeys = [...tmp]
      }
    },
    isSelected () {
      return this.selectedIds.length > 0
    },
    getSelectedIds () {
      return this.selectedIds.join(',')
    },
    onTreeExpand (expandedKeys) {
      // console.log('onTreeExpand')
      this.treeExpandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onTreeCheck (checkedKeys, info) {
      const that = this
      if (!info.checked) {
        // remove
        this.selectedData = this.selectedData.filter(item => item.key !== info.node.dataRef.key)
        this.selectedIds = this.selectedIds.filter(item => item !== info.node.dataRef.key)
      }
      if (checkedKeys.length !== 0) {
        let tmpData = []
        let tmpIds = []
        checkedKeys.forEach(function (id) {
          if (that.selectedIds.includes(id)) {
            return
          }
          tmpData.push(that.flatData.get(id))
          tmpIds.push(id)
        })
        this.selectedData = [...this.selectedData, ...tmpData]
        this.selectedIds = [...this.selectedIds, ...tmpIds]
      } else {
        this.selectedData = this.selectedData.filter(item => item.key !== info.node.dataRef.key)
        this.selectedIds = this.selectedIds.filter(item => item !== info.node.dataRef.key)
      }
      this.onTriggerChange()
    },
    onTreeSelect (selectedKeys, info) {
      const nodeType = info.node.dataRef.type
      if (nodeType === 'O' || nodeType === 'D') {
        if (info.selected) {
          // 选中，展开
          this.treeExpandedKeys = [...this.treeExpandedKeys, ...selectedKeys]
        } else {
          // 收缩
          this.treeExpandedKeys = this.treeExpandedKeys.filter(item => item !== info.node.dataRef.key)
        }
        this.treeSelectedKeys = [...selectedKeys]
        return
      }
      if (selectedKeys.length === 0) {
      } else {
        if (!this.multiple) {
          this.treeSelectedKeys = [...selectedKeys]
          // 单选模式，直接安排~
          this.selectedData = [this.flatData.get(selectedKeys[0])]
          this.selectedIds = [...selectedKeys]
          this.onClickAway()
          this.onTriggerChange()
        }
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
          treeNode.dataRef.children = that.mapTreeData(response.result, true)
          that.treeData = [...that.treeData]

          // 只找出加载过的节点去勾选
          let tmp = []
          that.flatData.forEach((v, k) => {
            if (that.selectedIds.includes(k)) {
              tmp.push(k)
            }
          })
          if (that.multiple) {
            that.treeCheckedKeys = [...that.treeCheckedKeys, ...tmp]
          } else {
            that.treeSelectedKeys = [...that.treeSelectedKeys, ...tmp]
          }

          resolve()
        })
      })
    },
    onOrgFetch () {
      const that = this
      that.$http.get('/api/1/comp/org.json').then(function (response) {
        that.treeData = that.mapTreeData(response.result, true)
        if (response.result.length > 0) {
          that.treeExpandedKeys = [response.result[0].id]
        }
      })
    },
    onDefaultValueFetch () {
      if (!this.value) {
        this.selectedData = []
        this.selectedIds = []
        return
      }
      const that = this
      that.$http.get('/api/1/org/get_poss.json?ids=' + this.value).then(function (response) {
        that.selectedData = that.mapTreeData(response.result, false)
        that.selectedIds = that.selectedData.map(item => item.key)
      })
    },
    onNodeRemove (nodeId) {
      if (this.multiple) {
        this.selectedData = this.selectedData.filter(item => item.key !== nodeId)
        this.selectedIds = this.selectedIds.filter(id => id !== nodeId)
      } else {
        this.selectedData = []
        this.selectedIds = []
      }
      this.onTriggerChange()
    },
    onClickAway () {
      this.style.display = 'none'
    },
    onTriggerChange () {
      this.$emit('change', this.selectedIds.join(','))
    },
    mapTreeData (list, storeFlat) {
      const that = this
      let result = list.map(item => {
        return {
          key: item.id,
          title: item.name,
          type: item.type,
          isLeaf: !item.hasChildren,
          deptName: item.deptName,
          disableCheckbox: item.type !== 'P',
          class: 'org-node',
          scopedSlots: { icon: 'customIcon' }
        }
      })
      if (storeFlat) {
        result.forEach(function (item) {
          that.flatData.set(item.key, item)
        })
      }
      return result
    }
  }
}
</script>

<style>
    .fx-select-dropdown {
        height:260px;
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

    .org-node li.ant-tree-treenode-disabled > span:not(.ant-tree-switcher),
    li.ant-tree-treenode-disabled > .ant-tree-node-content-wrapper,
    li.ant-tree-treenode-disabled > .ant-tree-node-content-wrapper span {
        color: rgba(0, 0, 0, 0.65);
        cursor: pointer;
    }
</style>
