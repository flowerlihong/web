<!--
 Created by Xuz on 2019/04/08.
 xuz[at]live[dot]cn
 组织机构示例
-->
<template>
    <page-view title="组织机构组件示例">
        <a-card>
            <table class="fx-form">
                <tr>
                    <th>选机构</th>
                    <td>
                        <a-form-item>
                            <org-selector @change="onOrgChange"/>
                        </a-form-item>
                    </td>
                    <th>选机构（多选）</th>
                    <td>
                        <a-form-item>
                            <org-selector multiple @change="onOrgChange"/>
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <th>选部门</th>
                    <td>
                        <a-form-item>
                            <dept-selector @change="onDeptChange"/>
                        </a-form-item>
                    </td>
                    <th>选部门（多选）</th>
                    <td>
                        <a-form-item>
                            <dept-selector multiple @change="onDeptChange" value="7524b332-0123-1000-e000-0009c0a864cb,9273ba76-0123-1000-e000-009ac0a864cb"/>
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <th>选岗位</th>
                    <td>
                        <a-form-item>
                            <pos-selector @change="onPosChange"/>
                        </a-form-item>
                    </td>
                    <th>选岗位（多选）</th>
                    <td>
                        <a-form-item>
                            <pos-selector multiple @change="onPosChange" value="9273ba76-0123-1000-e000-00a6c0a864cb,9273ba76-0123-1000-e000-0054c0a864cb,8ea6eaf5-0169-1000-e000-01c4ac100110"/>
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <th>选用户</th>
                    <td>
                        <a-form-item>
                            <user-selector @change="onUserChange" value="becce11d-014b-1000-e000-139cac100110"/>
                        </a-form-item>
                    </td>
                    <th>选用户（多选）</th>
                    <td>
                        <a-form-item>
                            <user-selector multiple @change="onUserChange" value="becce11d-014b-1000-e000-139cac100110,becce11d-014b-1000-e000-1399ac100110"/>
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <th>选角色</th>
                    <td>
                        <a-form-item>
                            <role-selector @change="onRoleChange" value="419bc4f8-0126-1000-e000-0040ac106321"/>
                        </a-form-item>
                    </td>
                    <th>选角色（多选）</th>
                    <td>
                        <a-form-item>
                            <role-selector multiple @change="onRoleChange" value="419bc4f8-0126-1000-e000-0040ac106321,880c5efe-0129-1000-e000-0014c0a8641a"/>
                        </a-form-item>
                    </td>
                </tr>
            </table>
        </a-card>
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import OrgSelector from '@/components/selector/OrgSelector'
import DeptSelector from '@/components/selector/DeptSelector'
import PosSelector from '@/components/selector/PosSelector'
import UserSelector from '@/components/selector/UserSelector'
import RoleSelector from '@/components/selector/RoleSelector'

export default {
  name: 'OrgExample',
  components: {
    PageView,
    OrgSelector,
    DeptSelector,
    PosSelector,
    UserSelector,
    RoleSelector
  },
  methods: {
    onOrgChange (selectedIds) {
      this.$message.success('已选机构：' + selectedIds)
    },
    onDeptChange (selectedIds) {
      this.$message.success('已选部门：' + selectedIds)
    },
    onPosChange (selectedIds) {
      this.$message.success('已选岗位：' + selectedIds)
    },
    onUserChange (selectedIds, selectedNames) {
      this.$message.success('已选用户：' + selectedIds + ', 姓名：' + selectedNames)
    },
    onRoleChange (selectedIds) {
      this.$message.success('已选角色：' + selectedIds)
    }
  }
}
</script>

<style scoped>
    .fx-form th {
        width: 120px !important;
    }
</style>
