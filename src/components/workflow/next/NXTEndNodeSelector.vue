<!--
 Created by Xuz on 2019/01/30.
 xuz[at]live[dot]cn
 第二步：结束节点选择
-->
<template>
    <div style="display: flex">
    </div>
</template>

<script>
export default {
  name: 'NXTEndNodeSelector',
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
      selectedIds: []
    }
  },
  watch: {
  },
  methods: {
    update (wfType, routeData) {
      this.wfType = wfType
    },
    getType () {
      return this.wfType
    }
  }
}
</script>

<style scoped>
</style>
