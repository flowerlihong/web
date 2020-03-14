<!--
 Created by Xuz on 2019/02/28.
 xuz[at]live[dot]cn
 第二步：退回至送件人
-->
<template>
    <div style="display: flex">
        <a-card class="wf-card wf-cate-back-card" :bordered="false">
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
export default {
  name: 'NXTCateBackSelector',
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
    update (wfType, routeData) {
      this.wfType = wfType
      console.log('NXTCateBackSelector update')
      if (routeData.users.length === 0) {
        console.log('TODO NXTCateBackSelector')
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
    .wf-cate-back-card {
        width: 140px;
    }

    .user-selected {
        margin: 0;
        padding: 0;
        list-style: none;
        letter-spacing: 1.5px;
    }
</style>
