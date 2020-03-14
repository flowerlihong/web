<!--
 Created by Xuz on 2019/02/28.
 xuz[at]live[dot]cn
 第二步：退回至路径送件人
-->
<template>
    <div style="display: flex">
        <a-card class="wf-card wf-route-sender-card" :bordered="false">
            <div class="wf-card-title"><img src="/app/workflow/img/xwf/n2.gif"/> 已选择</div>
            <div class="wf-card-body">
                <ul class="user-selected">
                    <li v-for="user in userData" :key="'s' + user.id">{{user.name}}</li>
                </ul>
            </div>
        </a-card>
    </div>
</template>

<script>
import { XWF } from '../XWF'

export default {
  name: 'NXTRouteReceiverSelector',
  props: {
  },
  created () {
  },
  data () {
    return {
      wfType: null,
      userData: [],
      selectedIds: []
    }
  },
  methods: {
    update (wfType, routeData, that) {
      this.wfType = wfType
      if (!routeData.users) {
        XWF.hideTargetSelector(that)
        that.DSC_Show.DSC_AnyUserContainer = true
        that.oWFEmpSelector = that.$refs.wfAnyUserSelector
        that.oWFEmpSelector.update(wfType, routeData, that)
      } else {
        this.userData = this.mapUserData(routeData.users)
        this.selectedIds = this.userData.map(item => {
          return item.id
        })
      }
    },
    getType () {
      return this.wfType
    },
    getSelected () {
      return this.selectedIds
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
    .wf-route-sender-card {
        width: 140px;
    }

    .user-selected {
        margin: 0;
        padding: 0;
        list-style: none;
        letter-spacing: 1.5px;
    }
</style>
