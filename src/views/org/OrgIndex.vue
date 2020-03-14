<template>
    <page-view title="组织机构">
    <!-- action -->
    <template slot="action">
        <a-button type="primary" icon="plus" @click="onAddUser">添加用户</a-button>
    </template>
    <a-card :bordered="false">
        <a-row :gutter="16" class="tree-container">
            <a-col :xxl="4" :xl="6">
                <div :style="{ height: treeHeight + 'px' }" style="overflow-y:auto;overflow-x:hidden;">
                    <a-tree showLine showIcon :expandedKeys="treeExpandedKeys" @expand="onTreeExpand" :autoExpandParent="autoExpandParent" :loadData="onTreeLoadData" :treeData="treeData" @select="onSelect" @rightClick="onTreeRightClick" @load="onTreeLoad">
                        <a-icon slot="smile" type="smile-o" />
                        <a-icon slot="meh" type="smile-o" />
                        <template slot="customIcon" slot-scope="{dataRef}">
                            <img v-if="dataRef.key.startsWith('org_block')" src="/img/org/nopos.gif"/>
                            <img v-else-if="dataRef.key.startsWith('org_')" src="/img/org/unit.gif"/>
                            <img v-else-if="dataRef.key.startsWith('dept_')" src="/img/org/dept.gif"/>
                            <img v-else-if="dataRef.key.startsWith('pos_')" src="/img/org/pos.gif"/>
                            <img v-else-if="dataRef.key === 'perm_0'" src="/img/org/plugin.png"/>
                            <img v-else-if="dataRef.key === 'role_0'" src="/img/org/user.gif"/>
                            <img v-else src="/img/org/cube.gif"/>
                        </template>
                    </a-tree>
                </div>
            </a-col>
            <a-col :xxl="20" :xl="18">
                <a-row>
                    <a-col :span="16">
                        <div>
                            <a-form layout="inline">
                                <a-form-item>
                                    <a-input v-model="queryParams.query" placeholder="查询用户" @pressEnter="onSearch" style="width:140px">
                                        <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)"/>
                                    </a-input>
                                </a-form-item>
                                <a-form-item>
                                    <a-select style="width:93px" placeholder="状态" allowClear @change="onChangeState">
                                        <a-select-option value="1">禁用</a-select-option>
                                        <a-select-option value="2">出差</a-select-option>
                                        <a-select-option value="4">休假</a-select-option>
                                        <a-select-option value="0">正常</a-select-option>
                                    </a-select>
                                </a-form-item>
                                <a-form-item>
                                    <a-button type="primary" @click="onSearch">查询</a-button>
                                </a-form-item>
                                <a-form-item>
                                    当前用户列表：<span style="color:red">{{userRangeDesc.join(' -> ')}}</span>
                                </a-form-item>
                            </a-form>
                        </div>
                    </a-col>
                    <a-col :span="8">
                        <div style="text-align:right">
                            <a-pagination v-show="userList.length > 0"
                                          @change="onUserListPageChange" style="margin-bottom:14px;"
                                          :current="queryParams.page" :pageSize="queryParams.pageSize"
                                          :total="queryParams.total" :showTotal="total => `共 ${total} 人`"
                                          simple/>
                        </div>
                    </a-col>
                </a-row>

                <a-skeleton :loading="userLoading" :paragraph="{rows: 12}" :avatar="{size:'large', shape:'square'}" active>
                <div class="user-list">
                    <a-row :gutter="16">
                        <a-col :span="24">
                            <div v-show="userList.length === 0" class="user-list-blank">
                                <img src="/img/org/user2.png" height="100" />
                                <p>此机构下暂无用户</p>
                            </div>
                        </a-col>
                        <a-col :xxl="6" :xl="8" :key="i" v-for="(item, i) in userList" class="user-card">
                            <a-card :class="{ block: item.state === '1' }" hoverable>
                                <template class="ant-card-actions" slot="actions">
                                    <a-icon type="edit" @click="onEditUser(item.id)" />
                                    <a-icon type="eye" @click="onEditUserPerm(item.id, item.name)" />
                                    <a-icon :type="item.state === '1' ? 'check-circle' : 'stop'" @click="onBlockUser(item.id, item.state)"></a-icon>
                                </template>
                                <a-card-meta :title="item.name" :description="item.dept.name">
                                    <a-avatar :size="56" slot="avatar" icon="user" shape="square" />
                                </a-card-meta>
                            </a-card>
                        </a-col>
                    </a-row>
                </div>
                </a-skeleton>

                <div style="text-align:right">
                    <a-pagination v-show="userList.length > 0" @change="onUserListPageChange" :current="queryParams.page"
                                  :pageSize="queryParams.pageSize" :total="queryParams.total"
                                  :showTotal="total => `共 ${total} 人`"/>
                </div>

            </a-col>
        </a-row>

        <!-- menu start -->

        <ul id="userMenu" v-show="treeMenu.userMenuVisible" :style="{left:treeMenu.positionX + 'px', top:treeMenu.positionY + 'px'}" class="dropdown-menu context-menu">
            <li><a href="javascript:onEditUser()"><img src="/img/org/edit.gif" align="absmiddle">编辑资料</a></li>
            <li><a href="javascript:onEditUserPerm()"><img src="/img/org/sec.gif" align="absmiddle">权限设置</a></li>
            <li class="va-enable"><a href="javascript:onEnableUser()"><img src="/img/org/lock.png" align="absmiddle">启用帐号</a></li>
            <li class="va-disable"><a href="javascript:onDisableUser()"><img src="/img/org/lockb.gif" align="absmiddle">禁用帐号</a></li>
            <li><a href="javascript:onDelUser()"><img src="/img/org/del.gif" align="absmiddle">删除用户</a></li>
        </ul>

        <ul id="orgMenu" v-show="treeMenu.orgMenuVisible" :style="{left:treeMenu.positionX + 'px', top:treeMenu.positionY + 'px'}" class="dropdown-menu context-menu">
            <li v-show="treeMenu.rootVisible" class="va-root"><a @click="onAddRootOrg"><img src="/img/org/edit.gif" align="absmiddle">增加根机构</a></li>
            <li v-show="treeMenu.subVisible" class="va-sub"><a @click="onEditOrg"><img src="/img/org/edit.gif" align="absmiddle">修改机构</a></li>
            <li v-show="treeMenu.subVisible" class="va-sub"><a @click="onDelOrg"><img src="/img/org/del.gif" align="absmiddle">删除机构</a></li>
            <li v-show="treeMenu.subVisible" class="va-sub"><a @click="onAddSubOrg"><img src="/img/org/new2.png" align="absmiddle">增加子机构</a></li>
            <li v-show="treeMenu.subVisible" class="va-sub"><a @click="onAddDept"><img src="/img/org/new1.png" align="absmiddle">增加部门</a></li>
            <li v-show="treeMenu.subVisible" class="va-sub"><a @click="onAddUser"><img src="/img/org/new.png" align="absmiddle">增加用户</a></li>
        </ul>

        <ul id="deptMenu" v-show="treeMenu.deptMenuVisible" :style="{left:treeMenu.positionX + 'px', top:treeMenu.positionY + 'px'}" class="dropdown-menu context-menu">
            <li><a @click="onEditDept"><img src="/img/org/edit.gif" align="absmiddle">修改部门</a></li>
            <li><a @click="onDelDept"><img src="/img/org/del.gif" align="absmiddle">删除部门</a></li>
            <li><a @click="onAddPos"><img src="/img/org/pos.gif" align="absmiddle">增加岗位</a></li>
            <li><a @click="onAddUser"><img src="/img/org/new.png" align="absmiddle">增加用户</a></li>
        </ul>

        <ul id="posMenu" v-show="treeMenu.posMenuVisible" :style="{left:treeMenu.positionX + 'px', top:treeMenu.positionY + 'px'}" class="dropdown-menu context-menu">
            <li><a @click="onEditPos"><img src="/img/org/edit.gif" align="absmiddle">修改岗位</a></li>
            <li><a @click="onDelPos"><img src="/img/org/del.gif" align="absmiddle">删除岗位</a></li>
            <li><a @click="onAddUser"><img src="/img/org/new.png" align="absmiddle">增加用户</a></li>
        </ul>

        <ul id="permMenu" v-show="treeMenu.permMenuVisible" :style="{left:treeMenu.positionX + 'px', top:treeMenu.positionY + 'px'}"  class="dropdown-menu context-menu">
            <li v-show="treeMenu.rootVisible" class="va-root"><a @click="onAddRootPerm"><img src="/img/org/edit.gif" align="absmiddle">增加权限</a></li>
            <li v-show="treeMenu.subVisible" class="va-sub"><a @click="onEditPerm"><img src="/img/org/edit.gif" align="absmiddle">修改权限</a></li>
            <li v-show="treeMenu.subVisible" class="va-sub"><a @click="onDelPerm"><img src="/img/org/del.gif" align="absmiddle">删除权限</a></li>
            <li v-show="treeMenu.subVisible" class="va-sub"><a @click="onAddSubPerm"><img src="/img/org/new2.png" align="absmiddle">增加子权限</a></li>
        </ul>

        <ul id="roleMenu" v-show="treeMenu.roleMenuVisible" :style="{left:treeMenu.positionX + 'px', top:treeMenu.positionY + 'px'}" class="dropdown-menu context-menu">
            <li v-show="treeMenu.rootVisible" class="va-root"><a @click="onAddRootRole"><img src="/img/org/edit.gif" align="absmiddle">增加角色</a></li>
            <li v-show="treeMenu.subVisible" class="va-sub"><a @click="onEditRole"><img src="/img/org/edit.gif" align="absmiddle">修改角色</a></li>
            <li v-show="treeMenu.subVisible" class="va-sub"><a @click="onDelRole"><img src="/img/org/del.gif" align="absmiddle">删除角色</a></li>
            <li v-show="treeMenu.subVisible" class="va-sub"><a @click="onAddSubRole"><img src="/img/org/new.png" align="absmiddle">增加子角色</a></li>
        </ul>
        <!-- menu end -->

        <!-- 添加机构 -->
        <org-add ref="orgAdd" :visible="modalVisible.addOrg" @success="onAddOrgSuccess" @cancel="onAddOrgCancel" />
        <!-- / 添加机构 -->
        <!-- 编辑机构 -->
        <org-edit ref="orgEdit" :visible="modalVisible.editOrg" @success="onEditOrgSuccess" @cancel="onEditOrgCancel" />
        <!-- / 编辑机构 -->
        <!-- 添加部门 -->
        <dept-add ref="deptAdd" :visible="modalVisible.addDept" @success="onAddDeptSuccess" @cancel="onAddDeptCancel"/>
        <!-- / 添加部门 -->
        <!-- 编辑部门 -->
        <dept-edit ref="deptEdit" :visible="modalVisible.editDept" @success="onEditDeptSuccess" @cancel="onEditDeptCancel"/>
        <!-- / 编辑部门 -->
        <!-- 添加岗位 -->
        <pos-add ref="posAdd" :visible="modalVisible.addPos" @success="onAddPosSuccess" @cancel="onAddPosCancel" />
        <!-- / 添加岗位 -->
        <!-- 编辑岗位 -->
        <pos-edit ref="posEdit" :visible="modalVisible.editPos" @success="onEditPosSuccess" @cancel="onEditPosCancel" />
        <!-- / 编辑岗位 -->
        <!-- 添加权限 -->
        <perm-add ref="permAdd" :visible="modalVisible.addPerm" @success="onAddPermSuccess" @cancel="onAddPermCancel"/>
        <!-- / 添加权限 -->
        <!-- 编辑权限 -->
        <perm-edit ref="permEdit" :visible="modalVisible.editPerm" @success="onEditPermSuccess" @cancel="onEditPermCancel"/>
        <!-- / 编辑权限 -->
        <!-- 添加角色 -->
        <role-add ref="roleAdd" :visible="modalVisible.addRole" @success="onAddRoleSuccess" @cancel="onAddRoleCancel"/>
        <!-- / 添加角色 -->
        <!-- 编辑角色 -->
        <role-edit ref="roleEdit" :visible="modalVisible.editRole" @success="onEditRoleSuccess" @cancel="onEditRoleCancel"/>
        <!-- / 编辑角色 -->
        <!-- 添加用户 -->
        <user-add ref="userAdd" :visible="modalVisible.addUser" @success="onAddUserSuccess" @cancel="onAddUserCancel" />
        <!-- / 添加用户 -->
        <!-- 编辑用户 -->
        <user-edit ref="userEdit" :visible="modalVisible.editUser" @success="onEditUserSuccess" @cancel="onEditUserCancel" />
        <!-- / 编辑用户 -->
        <!-- 编辑用户权限 -->
        <user-perm ref="userPerm" :visible="modalVisible.editUserPerm" @success="onEditUserPermSuccess" @cancel="onEditUserPermCancel" />
        <!-- / 编辑用户权限 -->
    </a-card>
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import { axios as request } from '@/utils/request'
import PosAdd from './PosAdd'
import PosEdit from './PosEdit'
import RoleAdd from './RoleAdd'
import RoleEdit from './RoleEdit'
import PermAdd from './PermAdd'
import PermEdit from './PermEdit'
import OrgAdd from './OrgAdd'
import OrgEdit from './OrgEdit'
import DeptAdd from './DeptAdd'
import DeptEdit from './DeptEdit'
import UserAdd from './UserAdd'
import UserEdit from './UserEdit'
import UserPerm from './UserPerm'
import qs from 'qs'

export default {
  name: 'OrgIndex',
  inject: ['reload'],
  components: {
    PageView,
    PosAdd,
    PosEdit,
    RoleAdd,
    RoleEdit,
    PermAdd,
    PermEdit,
    OrgAdd,
    OrgEdit,
    DeptAdd,
    DeptEdit,
    UserAdd,
    UserEdit,
    UserPerm
  },
  mounted () {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResizeWindow)
    })
    this.onResizeWindow()
  },
  created () {
    this.onInitTree()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResizeWindow)
  },
  data () {
    return {
      // -----------------------
      userRangeDesc: [],
      // -----------------------
      lastViewport: 'org',
      lastOrgId: '',
      lastDeptId: '',
      lastPosId: '',
      lastPermId: '',
      lastRoleId: '',
      lastUserId: '',
      // -----------------------
      queryParams: {
        query: '',
        state: '',
        orgId: '',
        deptId: '',
        posId: '',
        permId: '',
        roleId: '',
        page: 1,
        pageSize: 12,
        pages: 1,
        total: 0
      },
      userLoading: false,
      userList: [],
      // -----------------------
      treeHeight: 600,
      treeMenu: {
        userMenuVisible: false,
        orgMenuVisible: false,
        deptMenuVisible: false,
        posMenuVisible: false,
        permMenuVisible: false,
        roleMenuVisible: false,
        rootVisible: false,
        subVisible: false,
        positionX: 0,
        positionY: 0
      },
      modalVisible: {
        addOrg: false,
        editOrg: false,
        addDept: false,
        editDept: false,
        addPos: false,
        editPos: false,
        addPerm: false,
        editPerm: false,
        addRole: false,
        editRole: false,
        addUser: false,
        editUser: false,
        editUserPerm: false
      },
      // ------------------------
      autoExpandParent: true,
      orgModal: {},
      selectedTreeNode: null,
      treeExpandedKeys: [],
      treeData: []
    }
  },
  methods: {
    onResizeWindow () {
      this.treeHeight = window.innerHeight - 260
    },
    reloadTree () {
      /*
      this.selectedTreeNode = null
      this.selectedModel = {}
      this.treeExpandedKeys = []
      this.treeData = []
      this.onInitTree()
      */
      this.onReloadPage()
    },
    onSearch () {
      if (this.lastViewport === 'role') {
        this.getUserListByRole(this.lastRoleId)
      } else if (this.lastViewport === 'perm') {
        this.getUserListByPerm(this.lastPermId)
      } else if (this.lastViewport === 'org') {
        this.getUserList(this.lastOrgId, '', '')
      } else if (this.lastViewport === 'dept') {
        this.getUserList('', this.lastDeptId, '')
      } else if (this.lastViewport === 'pos') {
        this.getUserList('', '', this.lastPosId)
      }
    },
    onReloadPage () {
      // this.$router.go(0)
      this.reload()
    },
    onChangeState (val) {
      this.queryParams.state = val
      this.onSearch()
    },
    onTreeLoadData (treeNode) {
      this.selectedTreeNode = treeNode
      return new Promise((resolve) => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }

        let that = this
        this.$http.get('/api/1/org/org_panel.json?id=' + treeNode.dataRef.key).then(function (response) {
          treeNode.dataRef.children = that.mapTreeData(response.result)
          that.treeData = [...that.treeData]
          resolve()
        })
      })
    },
    onInitTree () {
      let that = this
      this.$http.get('/api/1/org/org_panel.json').then(function (response) {
        that.treeData = that.mapTreeData(response.result)
        if (response.result.length > 0) {
          that.treeExpandedKeys = [response.result[0].id]
        }
      })
    },
    onTreeLoad (loadedKeys) {
      if (loadedKeys.length === 1) {
        this.loadUserList()
      }
    },
    onSelect (selectedKeys, info) {
      const key = info.node.dataRef.key
      this.userRangeDesc = this.getParentNameList(info)
      if (this.treeExpandedKeys.includes(key)) {
        // 如果展开，则缩起
        this.treeExpandedKeys = this.treeExpandedKeys.filter(item => item !== key)
      } else {
        if (info.selected && !info.node.isLeaf) {
          // 如果没展开，就展开
          this.treeExpandedKeys.push(key)
        }
      }

      this.hideContextMenu()

      if (selectedKeys.length === 0) {
        this.selectedTreeNode = null
        this.selectedModel = {}
        return
      }
      //
      this.selectedTreeNode = info.node
      this.selectedModel = info.node.dataRef
      //
      let tmp = this.selectedModel.key.split('_')
      let type = tmp[0]
      let id = tmp[1]

      if (id === '0') {
        return
      }
      //
      this.queryParams.page = 1
      this.lastViewport = type
      //
      if (this.lastViewport === 'org') {
        this.lastOrgId = id
      } else if (this.lastViewport === 'dept') {
        this.lastOrgId = info.node.$parent.dataRef.key.split('_')[1]
        this.lastDeptId = id
      } else if (this.lastViewport === 'pos') {
        this.lastOrgId = info.node.$parent.$parent.dataRef.key.split('_')[1]
        this.lastDeptId = info.node.$parent.dataRef.key.split('_')[1]
        this.lastPosId = id
      } else if (this.lastViewport === 'perm') {
        this.lastPermId = id
      } else if (this.lastViewport === 'role') {
        this.lastRoleId = id
      }
      //
      this.loadUserList()
    },
    onTreeExpand (expandedKeys) {
      this.hideContextMenu()
      this.treeExpandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onTreeRightClick (info) {
      // 隐藏所有右键菜单
      this.hideContextMenu()
      //
      let tmp = info.node.dataRef.key.split('_')
      let type = tmp[0]
      let id = tmp[1]

      let rect = info.event.currentTarget.getBoundingClientRect()

      this.treeMenu.positionX = rect.left
      this.treeMenu.positionY = rect.top + 23

      if (type === 'org') {
        this.lastOrgId = id
        this.showOrgContextMenu(id)
      } else if (type === 'dept') {
        this.lastDeptId = id
        this.showDeptContextMenu(id)
      } else if (type === 'pos') {
        this.lastPosId = id
        this.showPosContextMenu(id)
      } else if (type === 'perm') {
        this.lastPermId = id
        this.showPermContextMenu(id)
      } else if (type === 'role') {
        this.lastRoleId = id
        this.showRoleContextMenu(id)
      }
    },
    getParentNameList (nInfo) {
      let result = []
      let parent = nInfo.node
      do {
        result.push(parent.dataRef.title)
        parent = parent.$parent
      } while (parent.dataRef)

      // 删除“组织机构”这个虚拟节点
      if (result.length > 0) {
        if (result[result.length - 1] === '组织机构') {
          result.pop()
        }
      }
      result.reverse()

      return result
    },
    // ------------------------------------------
    loadUserList () {
      if (this.lastOrgId === '0') {
        this.lastOrgId = ''
      }

      if (this.lastViewport === 'org') {
        this.getUserList(this.lastOrgId, '', '')
      } else if (this.lastViewport === 'dept') {
        this.getUserList('', this.lastDeptId, '')
      } else if (this.lastViewport === 'pos') {
        this.getUserList('', '', this.lastPosId)
      } else if (this.lastViewport === 'perm') {
        this.getUserListByPerm(this.lastPermId)
      } else if (this.lastViewport === 'role') {
        this.getUserListByRole(this.lastRoleId)
      }
    },
    onUserListPageChange (page, pageSize) {
      this.queryParams.page = page
      this.queryParams.pageSize = pageSize

      this.loadUserList()
    },
    getUserList (orgId, deptId, posId) {
      this.userLoading = true
      let priorityParams = { }
      this.queryParams.orgId = orgId
      this.queryParams.deptId = deptId
      this.queryParams.posId = posId

      if (orgId === 'block') {
        // 点击了禁用用户节点，转向查看禁用用户列表
        this.queryParams.orgId = ''
        priorityParams.state = '1'
      }
      const finalParams = Object.assign(this.queryParams, priorityParams)
      let that = this
      that.$http.get('/api/1/org/user_list.json?' + qs.stringify(finalParams)).then(function (response) {
        that.processUserListData(response)
      })
    },
    getUserListByPerm (permId) {
      this.queryParams.permId = permId
      //
      let that = this
      that.$http.get('/api/1/org/query_user_by_perm.json?' + qs.stringify(this.queryParams)).then(function (response) {
        that.processUserListData(response)
      }).catch(function (error) {
        console.log(error)
        alert('读取数据失败')
      }).then(function () {
      })
    },
    getUserListByRole (roleId) {
      this.queryParams.roleId = roleId
      let that = this
      that.$http.get('/api/1/org/query_user_by_role.json?' + qs.stringify(this.queryParams)).then(function (response) {
        that.processUserListData(response)
      })
    },
    processUserListData (data) {
      this.userList = data.result
      this.queryParams.total = data.page.total

      this.userLoading = false
    },
    // -------------- 树菜单右键操作 --------------
    hideContextMenu () {
      this.treeMenu.orgMenuVisible = false
      this.treeMenu.userMenuVisible = false
      this.treeMenu.orgMenuVisible = false
      this.treeMenu.deptMenuVisible = false
      this.treeMenu.posMenuVisible = false
      this.treeMenu.permMenuVisible = false
      this.treeMenu.roleMenuVisible = false
    },
    showOrgContextMenu (id, x, y) {
      this.treeMenu.orgMenuVisible = true
      this.treeMenu.rootVisible = false
      this.treeMenu.subVisible = false

      if (id === '0') {
        // 点击了机构根节点
        this.treeMenu.rootVisible = true
      } else {
        this.treeMenu.subVisible = true
      }
    },
    showDeptContextMenu (id, x, y) {
      this.treeMenu.deptMenuVisible = true
    },
    showPosContextMenu (id, x, y) {
      this.treeMenu.posMenuVisible = true
    },
    showPermContextMenu (id, x, y) {
      this.treeMenu.permMenuVisible = true
      this.treeMenu.rootVisible = false
      this.treeMenu.subVisible = false
      if (id === '0') {
        // 点击了权限根节点
        this.treeMenu.rootVisible = true
      } else {
        this.treeMenu.subVisible = true
      }
    },
    showRoleContextMenu (id, x, y) {
      this.treeMenu.roleMenuVisible = true
      this.treeMenu.rootVisible = false
      this.treeMenu.subVisible = false
      if (id === '0') {
        // 点击了角色根节点
        this.treeMenu.rootVisible = true
      } else {
        this.treeMenu.subVisible = true
      }
    },
    // --------------- 组织机构操作 ---------------
    onAddRootOrg () {
      this.hideContextMenu()
      this.modalVisible.addOrg = true
      this.$refs.orgAdd.preOrgAdd(null)
    },
    onAddSubOrg () {
      this.hideContextMenu()
      this.modalVisible.addOrg = true
      this.$refs.orgAdd.preOrgAdd(this.lastOrgId)
    },
    onAddOrgSuccess () {
      this.modalVisible.addOrg = false
      this.reloadTree()
    },
    onAddOrgCancel () {
      this.modalVisible.addOrg = false
    },
    onEditOrg () {
      this.hideContextMenu()
      this.modalVisible.editOrg = true
      this.$refs.orgEdit.preOrgEdit(this.lastOrgId)
    },
    onEditOrgSuccess () {
      this.modalVisible.editOrg = false
      this.reloadTree()
    },
    onEditOrgCancel () {
      this.modalVisible.editOrg = false
    },
    onDelOrg () {
      let that = this
      this.$confirm({
        title: '是否确认删除机构？',
        content: '删除机构会删除其下级所有机构、部门、岗位、用户',
        onOk () {
          that.hideContextMenu()

          request.post('/api/1/org/delete_org.json', qs.stringify({ id: that.lastOrgId })).then(function () {
            that.$message.success('操作成功')
            that.reloadTree()
          })
        }
      })
    },
    onAddDept () {
      this.hideContextMenu()
      this.modalVisible.addDept = true
      this.$refs.deptAdd.preDeptAdd(this.lastOrgId)
    },
    onAddDeptSuccess () {
      this.modalVisible.addDept = false
      this.reloadTree()
    },
    onAddDeptCancel () {
      this.modalVisible.addDept = false
    },
    onEditDept () {
      this.hideContextMenu()
      this.modalVisible.editDept = true
      this.$refs.deptEdit.preDeptEdit(this.lastOrgId, this.lastDeptId)
    },
    onEditDeptSuccess () {
      this.modalVisible.editDept = false
      this.reloadTree()
    },
    onEditDeptCancel () {
      this.modalVisible.editDept = false
    },
    onDelDept () {
      let that = this
      this.$confirm({
        title: '是否确认删除部门？',
        content: '删除机构会删除其下级所有岗位、用户',
        onOk () {
          that.hideContextMenu()

          request.post('/api/1/org/delete_dept.json', qs.stringify({ id: that.lastDeptId })).then(function () {
            that.$message.success('操作成功')
            that.reloadTree()
          })
        }
      })
    },
    onAddPos () {
      this.hideContextMenu()
      this.modalVisible.addPos = true
      this.$refs.posAdd.prePosAdd(this.lastDeptId)
    },
    onAddPosSuccess () {
      this.modalVisible.addPos = false
      this.reloadTree()
    },
    onAddPosCancel () {
      this.modalVisible.addPos = false
    },
    onEditPos () {
      this.hideContextMenu()
      this.modalVisible.editPos = true
      this.$refs.posEdit.prePosEdit(this.lastPosId)
    },
    onEditPosSuccess () {
      this.modalVisible.editPos = false
      this.reloadTree()
    },
    onEditPosCancel () {
      this.modalVisible.editPos = false
    },
    onDelPos () {
      let that = this
      this.$confirm({
        title: '是否确认删除岗位？',
        content: '删除岗位会删除其下级所有用户',
        onOk () {
          that.hideContextMenu()

          request.post('/api/1/org/delete_pos.json', qs.stringify({ id: that.lastPosId })).then(function () {
            that.$message.success('操作成功')
            that.reloadTree()
          })
        }
      })
    },
    onAddUser () {
      this.hideContextMenu()
      if (!this.lastOrgId) {
        this.$message.warning('请选择用户所属机构')
        return
      }
      this.modalVisible.addUser = true
      this.$refs.userAdd.preUserAdd(this.lastOrgId, this.lastDeptId, this.lastPosId)
    },
    onAddUserSuccess () {
      this.modalVisible.addUser = false
      this.reloadTree()
    },
    onAddUserCancel () {
      this.modalVisible.addUser = false
    },
    onEditUser (userId) {
      this.hideContextMenu()
      this.modalVisible.editUser = true
      this.$refs.userEdit.onInit(userId)
    },
    onEditUserSuccess () {
      this.modalVisible.editUser = false
      this.reloadTree()
    },
    onEditUserCancel () {
      this.modalVisible.editUser = false
    },
    onEditUserPerm (userId, userName) {
      this.modalVisible.editUserPerm = true
      this.$refs.userPerm.preUserPerm(userId, userName)
    },
    onEditUserPermSuccess () {
      this.modalVisible.editUserPerm = false
    },
    onEditUserPermCancel () {
      this.modalVisible.editUserPerm = false
    },
    onDeleteUser (userId) {
      const that = this
      this.$confirm({
        title: '是否确认删除用户？',
        onOk () {
          that.hideContextMenu()

          that.$http.post('/api/1/org/delete_user.json', qs.stringify({ id: userId })).then(function (resp) {
            that.$message.success(resp.msg)
            that.loadUserList()
          })
        }
      })
    },
    onBlockUser (userId, state) {
      const that = this

      let title = '?'
      let value = '?'
      if (state === '1') {
        title = '是否确认启用用户？'
        value = '0'
      } else {
        title = '是否确认禁用用户？'
        value = '1'
      }

      this.$confirm({
        title: title,
        onOk () {
          that.hideContextMenu()

          that.$http.post('/api/1/org/block_user.json', qs.stringify({ id: userId, state: value })).then(function (resp) {
            that.$message.success(resp.msg)
            that.loadUserList()
          })
        }
      })
    },
    onAddRootPerm () {
      this.hideContextMenu()
      this.modalVisible.addPerm = true
      this.$refs.permAdd.prePermAdd(null)
    },
    onAddSubPerm () {
      this.hideContextMenu()
      this.modalVisible.addPerm = true
      this.$refs.permAdd.prePermAdd(this.lastPermId)
    },
    onAddPermSuccess () {
      this.modalVisible.addPerm = false
      this.reloadTree()
    },
    onAddPermCancel () {
      this.modalVisible.addPerm = false
    },
    onEditPerm () {
      this.hideContextMenu()
      this.modalVisible.editPerm = true
      this.$refs.permEdit.prePermEdit(this.lastPermId)
    },
    onEditPermSuccess () {
      this.modalVisible.editPerm = false
      this.reloadTree()
    },
    onEditPermCancel () {
      this.modalVisible.editPerm = false
    },
    onDelPerm () {
      let that = this
      this.$confirm({
        title: '是否确认删除权限？',
        content: '删险权限同时会删除角色、用户与权限之间的关联',
        onOk () {
          that.hideContextMenu()

          request.post('/api/1/perm/delete_perm.json', qs.stringify({ id: that.lastPermId })).then(function () {
            that.$message.success('操作成功')
            that.reloadTree()
          })
        }
      })
    },
    onAddRootRole () {
      this.hideContextMenu()
      this.modalVisible.addRole = true
      this.$refs.roleAdd.preRoleAdd(null)
    },
    onAddSubRole () {
      this.hideContextMenu()
      this.modalVisible.addRole = true
      this.$refs.roleAdd.preRoleAdd(this.lastRoleId)
    },
    onAddRoleSuccess () {
      this.modalVisible.addRole = false
      this.reloadTree()
    },
    onAddRoleCancel () {
      this.modalVisible.addRole = false
    },
    onEditRole () {
      this.hideContextMenu()
      this.modalVisible.editRole = true
      this.$refs.roleEdit.preRoleEdit(this.lastRoleId)
    },
    onEditRoleSuccess () {
      this.modalVisible.editRole = false
      this.reloadTree()
    },
    onEditRoleCancel () {
      this.modalVisible.editRole = false
    },
    onDelRole () {
      let that = this
      this.$confirm({
        title: '是否确认删除角色？',
        content: '删险权限同时会删除用户、权限与角色之间的关联',
        onOk () {
          that.hideContextMenu()

          request.post('/api/1/perm/delete_role.json', qs.stringify({ id: that.lastRoleId })).then(function () {
            that.$message.success('操作成功')
            that.reloadTree()
          })
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
    // ------------------------------------------
  }
}
</script>

<style lang="less" scoped>
    .user-card {
        padding-bottom: 14px;
    }

    .project-list {
        .ant-card-grid {
            width: 25%;
        }

        .card-title {
            font-size: 0;

            a {
                color: rgba(0, 0, 0, 0.85);
                margin-left: 12px;
                line-height: 24px;
                height: 24px;
                display: inline-block;
                vertical-align: top;
                font-size: 14px;

                &:hover {
                    color: #1890ff;
                }
            }
        }
        .card-description {
            color: rgba(0, 0, 0, 0.45);
            height: 44px;
            line-height: 22px;
            overflow: hidden;
        }
        .project-item {
            display: flex;
            margin-top: 8px;
            overflow: hidden;
            font-size: 12px;
            height: 20px;
            line-height: 20px;
            a {
                color: rgba(0, 0, 0, 0.45);
                display: inline-block;
                flex: 1 1 0;

                &:hover {
                    color: #1890ff;
                }
            }
            .datetime {
                color: rgba(0, 0, 0, 0.25);
                flex: 0 0 auto;
                float: right;
            }
        }
        .ant-card-meta-description {
            color: rgba(0, 0, 0, 0.45);
            height: 44px;
            line-height: 22px;
            overflow: hidden;
        }
    }

    .item-group {
        padding: 20px 0 8px 24px;
        font-size: 0;
        a {
            color: rgba(0, 0, 0, 0.65);
            display: inline-block;
            font-size: 14px;
            margin-bottom: 13px;
            width: 25%;
        }
    }

    .members {
        a {
            display: block;
            margin: 12px 0;
            line-height: 24px;
            height: 24px;
            .member {
                font-size: 14px;
                color: rgba(0, 0, 0, .65);
                line-height: 24px;
                max-width: 100px;
                vertical-align: top;
                margin-left: 12px;
                transition: all 0.3s;
                display: inline-block;
            }
            &:hover {
                span {
                    color: #1890ff;
                }
            }
        }
    }

    .dropdown-menu li a {
        padding-left: 6px;
        padding-right: 10px;
    }

    .dropdown-menu img {
        margin: 0 4px 2px 4px;
    }

    .dropdown-menu {
        background: #fafafa;
        position: fixed;
        z-index: 1000;
        /*display: none;*/
        top: 300px;
        left: 300px;
        padding: 5px 0;
        margin: 2px 0 0;
        font-size: 14px;
        text-align: left;
        list-style: none;
        border: 1px solid #eee;
        border-radius: 4px;
        box-shadow: none;
    }

    .user-list {
        margin-top: 6px;
    }

    .user-list /deep/ .ant-card-bordered {
        border-top: 2px solid #2eabff;
    }

    .ant-card-meta {
        margin: 0;
    }

    .user-list /deep/ .ant-avatar.ant-avatar-icon {
        height: 72px !important;
        line-height: 72px !important;
    }

    .user-list /deep/ .ant-card-body {
        padding: 20px 14px;
    }

    .user-list /deep/ .ant-card-actions li {
        margin: 4px 0 !important;
    }

    .user-list /deep/ .ant-card-meta-title {
        margin-bottom: 4px;
    }

    .user-list .block {
        border-top: 2px solid #838383;
    }

    .user-list-blank {
        text-align: center;
        margin-top: 120px;
        margin-left: -120px;
        font-size: 16px;
        color: #838383;
        letter-spacing: 2px;
    }
</style>
