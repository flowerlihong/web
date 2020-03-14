<!--
 Created by Xuz on 2019/03/21.
 xuz[at]live[dot]cn
 用户权限编辑
-->
<template>
    <a-modal :title="modalTitle"
             :width="960"
             :visible="visible"
             :maskClosable="false"
             @ok="onSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading">
        <a-row :gutter="20">
            <a-col :span="12">
                权限：<a-input-search size="small" placeholder="搜索权限" style="width:140px" @search="onSearchPerm"/>&nbsp;<a-button v-show="permSearchMode" size="small" @click="onSearchPermBack">返回</a-button>
                <div :style="{ height: treeHeight + 'px' }" style="overflow-y:auto;overflow-x:hidden;">
                <a-tree v-show="!permSearchMode" checkable
                        defaultExpandAll
                        checkStrictly
                        :checkedKeys="checkedPermList"
                        :treeData="permList"
                        @check="onCheckPerm"
                        @select="onSelectPerm"/>
                <a-tree v-show="permSearchMode" checkable
                        checkStrictly
                        :expandedKeys="expandedPermSearchKeys"
                        :checkedKeys="checkedPermListSearch"
                        :treeData="permListSearch"
                        @check="onCheckPermSearch"
                        @select="onSelectPermSearch"
                        @expand="onExpandPermSearch"/>
                <div v-html="permChangeSummary"></div>
                </div>
            </a-col>
            <a-col :span="12">
                角色：<a-input-search size="small" placeholder="搜索角色" style="width:140px" @search="onSearchRole"/>&nbsp;<a-button v-show="roleSearchMode" size="small" @click="onSearchRoleBack">返回</a-button>
                <div :style="{ height: treeHeight + 'px' }" style="overflow-y:auto;overflow-x:hidden;">
                <a-tree v-show="!roleSearchMode" checkable
                        defaultExpandAll
                        checkStrictly
                        :checkedKeys="checkedRoleList"
                        :treeData="roleList"
                        @check="onCheckRole"
                        @select="onSelectRole"/>
                <a-tree v-show="roleSearchMode" checkable
                        checkStrictly
                        :expandedKeys="expandedRoleSearchKeys"
                        :checkedKeys="checkedRoleListSearch"
                        :treeData="roleListSearch"
                        @check="onCheckRoleSearch"
                        @select="onSelectRoleSearch"
                        @expand="onExpandRoleSearch"/>
                <div v-html="roleChangeSummary"></div>
                </div>
            </a-col>
        </a-row>
    </a-modal>
</template>

<script>
import qs from 'qs'

export default {
  name: 'UserPerm',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    this.onResizeWindow()
  },
  created () {
    const that = this
    that.$http.get('/api/1/perm/perm_full_list.json').then(function (resp) {
      that.permList = that.mapTreeData(resp.result)
      let result = []
      that.mapTreeDataKV(result, resp.result)
      that.permListKV = result
    })
    that.$http.get('/api/1/perm/role_full_list.json').then(function (resp) {
      that.roleList = that.mapTreeData(resp.result)
      let result = []
      that.mapTreeDataKV(result, resp.result)
      that.roleListKV = result
    })
  },
  data () {
    return {
      treeHeight: 600,
      modalTitle: '',
      modalLoading: false,
      userId: null,
      //
      permSearchMode: false,
      srcPermList: [],
      permList: [],
      permListKV: [],
      checkedPermList: [],
      permListSearch: [],
      expandedPermSearchKeys: [],
      checkedPermListSearch: [],
      permChangeSummary: '',
      //
      roleSearchMode: false,
      srcRoleList: [],
      roleList: [],
      roleListKV: [],
      checkedRoleList: [],
      roleListSearch: [],
      expandedRoleSearchKeys: [],
      checkedRoleListSearch: [],
      roleChangeSummary: ''
    }
  },
  methods: {
    onResizeWindow () {
      this.treeHeight = window.innerHeight - 360
    },
    preUserPerm (userId, userName) {
      const that = this
      that.modalTitle = '用户「' + userName + '」权限列表'
      //
      that.srcPermList = []
      that.checkedPermList = []
      that.permChangeSummary = ''
      //
      that.srcRoleList = []
      that.checkedRoleList = []
      that.roleChangeSummary = ''
      //
      that.userId = userId
      that.$http.get('/api/1/org/get_user_pure_permission_list.json?userId=' + userId).then(function (resp) {
        const result = [...resp.result.map(item => item.id)]
        that.srcPermList = result
        that.checkedPermList = result
      })
      that.$http.get('/api/1/org/get_user_role_list.json?userId=' + userId).then(function (resp) {
        const result = [...resp.result.map(item => item.id)]
        that.srcRoleList = result
        that.checkedRoleList = result
      })
    },
    rePermStats () {
      const that = this
      let sb = []
      sb.push('原拥有: ' + that.srcPermList.length)
      let added = 0
      let removed = 0
      let addedNames = []
      let removedNames = []

      that.srcPermList.forEach(item => {
        if (!that.checkedPermList.includes(item)) {
          removed++
          removedNames.push(that.permListKV[item].title)
        }
      })

      that.checkedPermList.forEach(item => {
        if (!that.srcPermList.includes(item)) {
          added++
          addedNames.push(that.permListKV[item].title)
        }
      })

      if (added > 0 || removed > 0) {
        sb.push('&nbsp;<span style="color:red">+' + added + '</span>')
      }

      if (removed > 0) {
        sb.push('&nbsp;<span style="color:#008000">-' + removed + '</span>')
      }
      if (added > 0 || removed > 0) {
        sb.push('<div style="">')
        if (added > 0) {
          sb.push('<div><span style="color:red">新增</span>：')
          sb.push(addedNames.join(', '))
          sb.push('</div>')
        }
        if (removed > 0) {
          sb.push('<div><span style="color:#008000">移除</span>：')
          sb.push(removedNames.join(', '))
          sb.push('</div>')
        }
        sb.push('</div>')
      }

      that.permChangeSummary = sb.join('')
    },
    onCheckPerm (checkedKeys, info) {
      this.checkedPermList = [...checkedKeys.checked]
      this.rePermStats()
    },
    onSelectPerm (selectedKeys, info) {
      const sId = info.node.dataRef.key
      if (this.checkedPermList.includes(sId)) {
        this.checkedPermList = this.checkedPermList.filter(item => item !== sId)
      } else {
        this.checkedPermList = [...this.checkedPermList, ...selectedKeys]
      }
      this.rePermStats()
    },
    onSearchPerm (value, event) {
      this.permSearchMode = true
      const that = this
      that.$http.get('/api/1/perm/perm_search_full_list.json?key=' + encodeURIComponent(value)).then(function (resp) {
        that.permListSearch = that.mapTreeData(resp.result)
        that.checkedPermListSearch = [...that.checkedPermList]
        let expandKeys = []
        that.generateExpandKeys(expandKeys, resp.result)
        that.expandedPermSearchKeys = [...expandKeys]
      })
    },
    onSearchPermBack () {
      this.permSearchMode = false
    },
    onCheckPermSearch (checkedKeys, info) {
      this.checkedPermListSearch = [...checkedKeys.checked]
      this.checkedPermList = [...this.checkedPermList, ...this.checkedPermListSearch]
      this.rePermStats()
    },
    onSelectPermSearch (selectedKeys, info) {
      if (info.selected && selectedKeys.length > 0) {
        this.checkedPermListSearch = [...this.checkedPermListSearch, ...selectedKeys]
        this.checkedPermList = [...this.checkedPermList, ...this.checkedPermListSearch]
      } else {
        this.checkedPermListSearch = this.checkedPermListSearch.filter(item => item !== info.node.dataRef.key)
        this.checkedPermList = this.checkedPermList.filter(item => item !== info.node.dataRef.key)
      }
      this.rePermStats()
    },
    onExpandPermSearch (expandedKeys, info) {
      this.expandedPermSearchKeys = expandedKeys
    },
    //
    reRoleStats () {
      const that = this
      let sb = []
      sb.push('原拥有: ' + that.srcRoleList.length)
      let added = 0
      let removed = 0
      let addedNames = []
      let removedNames = []

      that.srcRoleList.forEach(item => {
        if (!that.checkedRoleList.includes(item)) {
          removed++
          removedNames.push(that.roleListKV[item].title)
        }
      })

      that.checkedRoleList.forEach(item => {
        if (!that.srcRoleList.includes(item)) {
          added++
          addedNames.push(that.roleListKV[item].title)
        }
      })

      if (added > 0 || removed > 0) {
        sb.push('&nbsp;<span style="color:red">+' + added + '</span>')
      }

      if (removed > 0) {
        sb.push('&nbsp;<span style="color:#008000">-' + removed + '</span>')
      }
      if (added > 0 || removed > 0) {
        sb.push('<div style="">')
        if (added > 0) {
          sb.push('<div><span style="color:red">新增</span>：')
          sb.push(addedNames.join(', '))
          sb.push('</div>')
        }
        if (removed > 0) {
          sb.push('<div><span style="color:#008000">移除</span>：')
          sb.push(removedNames.join(', '))
          sb.push('</div>')
        }
        sb.push('</div>')
      }

      that.roleChangeSummary = sb.join('')
    },
    onCheckRole (checkedKeys, info) {
      this.checkedRoleList = [...checkedKeys.checked]
      this.reRoleStats()
    },
    onSelectRole (selectedKeys, info) {
      const sId = info.node.dataRef.key
      if (this.checkedRoleList.includes(sId)) {
        this.checkedRoleList = this.checkedRoleList.filter(item => item !== sId)
      } else {
        this.checkedRoleList = [...this.checkedRoleList, ...selectedKeys]
      }
      this.reRoleStats()
    },
    onSearchRole (value, event) {
      this.roleSearchMode = true
      const that = this
      that.$http.get('/api/1/perm/role_search_full_list.json?key=' + encodeURIComponent(value)).then(function (resp) {
        that.roleListSearch = that.mapTreeData(resp.result)
        that.checkedroleListSearch = [...that.checkedRoleList]
        let expandKeys = []
        that.generateExpandKeys(expandKeys, resp.result)
        that.expandedRoleSearchKeys = [...expandKeys]
      })
    },
    onSearchRoleBack () {
      this.roleSearchMode = false
    },
    onCheckRoleSearch (checkedKeys, info) {
      this.checkedRoleListSearch = [...checkedKeys.checked]
      this.checkedRoleList = [...this.checkedRoleList, ...this.checkedRoleListSearch]
      this.reRoleStats()
    },
    onSelectRoleSearch (selectedKeys, info) {
      if (info.selected && selectedKeys.length > 0) {
        this.checkedRoleListSearch = [...this.checkedRoleListSearch, ...selectedKeys]
        this.checkedRoleList = [...this.checkedRoleList, ...this.checkedRoleListSearch]
      } else {
        this.checkedRoleListSearch = this.checkedRoleListSearch.filter(item => item !== info.node.dataRef.key)
        this.checkedRoleList = this.checkedRoleList.filter(item => item !== info.node.dataRef.key)
      }
      this.reRoleStats()
    },
    onExpandRoleSearch (expandedKeys, info) {
      this.expandedRoleSearchKeys = expandedKeys
    },
    //
    onSubmit () {
      const that = this
      const perms = that.checkedPermList
      const roles = that.checkedRoleList
      const data = {
        userId: that.userId,
        permIds: perms.join(','),
        roleIds: roles.join(',')
      }
      that.modalLoading = true
      that.$http.post('/api/1/org/edit_user_permission.json', qs.stringify(data)).then(function (resp) {
        that.modalLoading = false
        if (resp.code !== 200) {
          that.$message.error(resp.msg)
          return
        }
        that.$message.success('更新权限成功')
        that.$emit('success')
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
    },
    mapTreeDataKV (result, list) {
      const that = this
      if (!list) {
        return
      }
      list.forEach(item => {
        result[item.id] = { key: item.id, title: item.name, isLeaf: !item.hasChildren }
        if (item.hasChildren) {
          that.mapTreeDataKV(result, item.children)
        }
      })
    },
    generateExpandKeys (result, list) {
      const that = this
      if (!list) {
        return
      }
      list.forEach(item => {
        if (item.hasChildren) {
          result.push(item.id)
          that.generateExpandKeys(result, item.children)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
    .ant-col-12 {
        border-right: 1px solid #eee;
    }

    .ant-col-12:nth-last-child(1) {
        padding-left: 30px;
        border: none;
    }
</style>
