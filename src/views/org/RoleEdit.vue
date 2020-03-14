<!--
 Created by Xuz on 2019/02/20.
 xuz[at]live[dot]cn
 角色编辑
-->
<template>
    <a-modal title="编辑角色"
             :width="960"
             :visible="visible"
             :maskClosable="false"
             @ok="onEditRoleSubmit"
             @cancel="$emit('cancel')"
             destroyOnClose
             :confirmLoading="modalLoading.editRole">
        <a-row>
            <a-col :span="14">
                <a-form :form="editRoleForm">
                    <a-form-item v-if="(modalData.editRole.parentId != null && modalData.editRole.parentId !== '')"
                                 label='上级角色'
                                 :labelCol="{ span: 5 }"
                                 :wrapperCol="{ span: 12 }">
                        {{modalData.editRole.parentName}}
                    </a-form-item>
                    <a-form-item
                            label='角色名称'
                            :labelCol="{ span: 5 }"
                            :wrapperCol="{ span: 12 }">
                        <a-input v-decorator="[
                            'name',
                            {initialValue:modalData.editRole.name, rules: [{ required: true, message: '请填写角色名称' }]}]" placeholder='角色名称'/>
                    </a-form-item>
                    <a-form-item
                            label='关键字'
                            :labelCol="{ span: 5 }"
                            :wrapperCol="{ span: 12 }">
                        <a-input v-decorator="[
                            'keyword',
                            {initialValue:modalData.editRole.keyword, rules: [{ required: true, message: '请填写关键字' }]}]" placeholder='关键字'/>
                    </a-form-item>
                    <a-form-item
                            label='顺序号'
                            :labelCol="{ span: 5 }"
                            :wrapperCol="{ span: 12 }">
                        <a-input-number v-decorator="[
                                    'sort',
                                    {initialValue:modalData.editRole.sort, rules: [{ required: true, type: 'number', message: '请填写数字类型顺序号' }]}]" placeholder='顺序号'/>
                    </a-form-item>
                    <a-form-item
                            label='描述'
                            :labelCol="{ span: 5 }"
                            :wrapperCol="{ span: 12 }">
                        <a-input v-decorator="[
                            'description',
                            {initialValue:modalData.editRole.description, rules: [{ required: false, message: '请填写描述' }]}]" placeholder='描述'/>
                    </a-form-item>
                </a-form>

                <a-card class="user-list" style="display: none;" title="拥有此角色用户">
                    <div :key="i" v-for="(item, i) in userList" class="ant-tag">{{item.name}}<i class="anticon anticon-close" @click="onDeleteUserRole(item.id)"><svg viewBox="64 64 896 896" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true" class=""><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg></i></div>
                    <div v-if="userList.length === 0" style="color:#cccccc">暂无用户</div>
                </a-card>

                <a-form layout="inline">
                    <a-form-item label="增加用户"><user-selector ref="userSelector" multiple/></a-form-item>
                    <a-form-item><a-button type="primary" @click="onAddRoleUser">增加</a-button></a-form-item>
                </a-form>
            </a-col>
            <a-col :span="10">
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
        </a-row>
    </a-modal>
</template>

<script>
import qs from 'qs'
import UserSelector from '@/components/selector/UserSelector'

export default {
  name: 'RoleEdit',
  components: {
    UserSelector
  },
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
  },
  data () {
    return {
      editRoleForm: this.$form.createForm(this),
      modalLoading: {
        editRole: false
      },
      modalData: {
        editRole: {
          id: null,
          parentId: null,
          parentName: null
        }
      },
      //
      treeHeight: 600,
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
      userList: []
    }
  },
  methods: {
    onResizeWindow () {
      this.treeHeight = window.innerHeight - 360
    },
    preRoleEdit (roleId) {
      this.modalLoading.editRole = true
      const that = this
      this.$http.get('/api/1/perm/get_role.json?id=' + roleId).then(function (response) {
        let role = response.result
        that.modalData.editRole.id = role.id
        that.modalData.editRole.parentId = role.parentId
        that.editRoleForm.setFieldsValue({ name: role.name, keyword: role.keyword, sort: role.sort, description: role.description })

        that.modalLoading.editRole = false

        if (role.parentId !== '') {
          that.$http.get('/api/1/perm/get_role.json?id=' + role.parentId).then(function (response) {
            let role = response.result
            that.modalData.editRole.parentName = role.name
          })
        }
      })
      //
      that.srcPermList = []
      that.checkedPermList = []
      that.permChangeSummary = ''
      //
      that.$http.get('/api/1/perm/get_role_permission_list.json?id=' + roleId).then(function (resp) {
        const result = [...resp.result.map(item => item.id)]
        that.srcPermList = result
        that.checkedPermList = result
      })
      //
      that.getUserListByRole(roleId)
    },
    onEditRoleSubmit () {
      let that = this
      this.editRoleForm.validateFields((err, values) => {
        if (err) {
          return
        }
        const perms = that.checkedPermList

        let params = this.editRoleForm.getFieldsValue()
        params.id = this.modalData.editRole.id
        params.parentId = this.modalData.editRole.parentId
        params.users = this.getUserIds()
        params.permIds = perms.join(',')
        this.modalLoading.editRole = true
        this.$http.post('/api/1/perm/edit_role.json', qs.stringify(params)).then(function () {
          that.$message.success('操作成功')
          that.editRoleForm.resetFields()
          that.modalLoading.editRole = false
          that.$emit('success')
        })
      })
    },
    //
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
    getUserListByRole (roleId) {
      if (true) {
        // 不列出用户，有些角色下面几千人
        return
      }
      //
      const that = this
      that.$http.get('/api/1/org/userListByRole.json?pageSize=10000&roleId=' + roleId).then(function (data) {
        that.userList = data.result
      })
    },
    onDeleteUserRole (userId) {
      const that = this
      const roleId = that.modalData.editRole.id
      that.$http.post('/api/1/org/delete_user_role.json', qs.stringify({
        userId: userId,
        roleId: roleId
      })).then(function (data) {
        that.getUserListByRole(roleId)
      })
    },
    onAddRoleUser () {
      if (!this.$refs.userSelector.isSelected()) {
        return
      }
      const that = this
      const roleId = this.modalData.editRole.id
      let data = {
        roleId: roleId,
        userIds: that.$refs.userSelector.getSelectedIds()
      }
      that.$http.post('/api/1/org/add_role_user.json', qs.stringify(data)).then(function (data) {
        if (data.code === 200) {
          that.$refs.userSelector.clear()
          that.getUserListByRole(roleId)
        }
      })
    },
    getUserIds () {
      let ids = []
      this.userList.forEach(function (item) {
        ids.push(item.id)
      })
      return ids.join(',')
    },
    //
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
    //
  }
}
</script>

<style lang="less" scoped>
    .user-list {
        margin-bottom: 10px;
    }

    /deep/ .ant-card-head {
        background: #efefef;
        min-height: auto;
        padding: 0 10px;
    }

    /deep/ .ant-card-head-title {
        padding: 6px;
        font-size: 14px;
    }

    /deep/ .ant-card-body {
        padding: 10px;
    }

    .ant-tag {
        margin: 4px;
    }
</style>
