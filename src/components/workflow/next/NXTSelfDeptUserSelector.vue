<!--
 Created by Xuz on 2019/02/12.
 xuz[at]live[dot]cn
 第二步：本部门用户选择
-->
<template>
    <div style="display: flex">
        <a-card class="wf-card wf-any-user-card" :bordered="false">
            <div class="wf-card-title"><img src="/app/workflow/img/xwf/n2.gif"/> 请选择下一步处理人</div>
            <div class="wf-card-body">
                <div class="fx-select-panel" style="width:200px">
                    <template v-if="!bSingle">
                        <a-checkbox-group @change="onCheckboxUserChange" :value="selectedIds">
                            <div v-for="dept in deptData" :key="dept.id">
                                <div class="dept-name">{{dept.name}}</div>
                                <a-checkbox v-for="user in dept.extras.users" :key="'c' + user.id" :value="user.id">{{ user.name }}</a-checkbox>
                            </div>
                        </a-checkbox-group>
                    </template>
                    <template v-else>
                        <a-radio-group @change="onRadioUserChange" :value="selectedIds.length > 0 ? selectedIds[0] : ''">
                            <div v-for="dept in deptData" :key="dept.id">
                                <div class="dept-name">{{dept.name}}</div>
                                <a-radio v-for="user in dept.extras.users" :key="'c' + user.id" :value="user.id">{{ user.name }}</a-radio>
                            </div>
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
  name: 'NXTCustomRoleUserSelector',
  props: {
  },
  created () {
  },
  data () {
    return {
      wfType: null,
      bSingle: false,
      bOrder: false,
      bGroupSendMode: false,
      deptData: [],
      userData: [],
      selectedData: [],
      selectedIds: []
    }
  },
  watch: {
  },
  methods: {
    update (wfType, routeData) {
      this.wfType = wfType
      this.bSingle = XWF.isSingleEmpSelect(wfType)
      this.bOrder = XWF.isOrderEmpSelect(wfType)
      this.bGroupSendMode = XWF.isGroupSendMode(wfType)

      console.log(this.bSingle)

      if (this.bOrder) {
        // TODO show order message
      }

      if (this.bGroupSendMode) {
        console.log('bGroupSendMode')
      } else {
        this.deptData = Array.of(routeData.selfdept)
        console.log(this.deptData)
        this.userData = this.mapUserData(routeData.selfdept)
      }
    },
    getType () {
      return this.wfType
    },
    getSelected () {
      return this.selectedIds
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
    mapUserData (dept) {
      let users = []

      let tmp = dept.extras.users.map(item => {
        return {
          id: item.id,
          name: item.name
        }
      })

      users = [...users, ...tmp]

      return users
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

    .dept-name {
        background-color: #eeeeee;
        padding: 3px;
        color: #008000;
        padding-left: 8px;
    }
</style>

<style>
    .any-user-tree > li:first-child {
        padding-top: 0 !important;
    }
</style>
