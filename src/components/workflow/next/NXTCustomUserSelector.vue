<!--
 Created by Xuz on 2019/01/29.
 xuz[at]live[dot]cn
 第二步：指定用户选择
-->
<template>
    <div style="display: flex">
        <a-card class="wf-card wf-any-user-card" :bordered="false">
            <div class="wf-card-title"><img src="/app/workflow/img/xwf/n2.gif"/> 请选择</div>
            <div class="wf-card-body">
                <div v-if="showSelectPanel" class="fx-select-panel" style="width:120px">
                    <template v-if="!bSingle">
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
                <div v-else>
                    <b style='color:#0000FF'>{{groupTip}}</b>
                    <ul class="any-user-selected">
                        <li v-for="user in selectedData" :key="'s' + user.id">{{user.name}}</li>
                    </ul>
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

export default {
  name: 'NXTCustomUserSelector',
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
      userData: [],
      selectedData: [],
      selectedIds: [],
      showSelectPanel: true,
      groupTip: null
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

      if (this.bOrder) {
        // TODO show order message
      }

      if (this.bGroupSendMode) {
        // 使用组方式
        // 当在指定人时的文件池是不用选择的
        this.showSelectPanel = false
        if (wfType.sendMode === XWF.SEND_MODE_TO_GROUP_ALL) {
          this.groupTip = '将发送至以下的所有人员:'
        } else {
          this.groupTip = '将以文件池的方式发送到以下人员:'
        }
        this.selectedData = this.mapUserData(routeData.users)
        this.selectedIds = this.selectedData.map(item => { return item.id })
        // 选中
        this.$emit('change', this.selectedIds)
      } else {
        this.showSelectPanel = true
        this.userData = this.mapUserData(routeData.users)
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
    mapUserData (list) {
      return list.map(item => {
        return {
          id: item.id,
          name: item.name
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
