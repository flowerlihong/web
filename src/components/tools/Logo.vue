<template>
  <div class="logo">
    <router-link :to="{name:'dashboard'}">
      <img alt="logo" src="/img/logo.png" />
      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
import LogoSvg from '@/assets/logo.svg?inline'

export default {
  name: 'Logo',
  components: {
    LogoSvg
  },
  props: {
    title: {
      type: String,
      default: '翼迅科技',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>

<style lang="less">
  .sider .logo img {
    width: 64px !important;
    height: 64px !important;
    padding: 0 !important;
  }

  .ant-layout-sider-collapsed.sider .logo img {
    width: 32px !important;
    height: 32px !important;
  }
</style>
