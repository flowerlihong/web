<template>
    <span>
        <span @click="onViewOnline" class="header-online">
            <a-icon style="font-size: 16px; padding: 4px" type="team" />
        </span>
        <online-users ref="onlineUsers" :visible="modalVisible" @cancel="modalVisible = false"  />
    </span>
</template>

<script>
import OnlineUsers from '@/views/org/OnlineUsers'

export default {
  name: 'HeaderOnline',
  components: { OnlineUsers },
  data () {
    return {
      modalVisible: false
    }
  },
  methods: {
    onViewOnline () {
      this.modalVisible = true
      this.$refs.onlineUsers.preOnlineUsers()
    }
  }
}
</script>

<style lang="less" scoped>
    .header-online {
        display: inline-block;
        transition: all 0.3s;

        span {
            vertical-align: initial;
        }
    }
</style>
