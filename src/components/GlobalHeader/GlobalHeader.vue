<template>
    <!-- , width: fixedHeader ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'  -->
    <a-layout-header v-if="!headerBarFixed"
                     :class="[fixedHeader && 'ant-header-fixedHeader', sidebarOpened ? 'ant-header-side-opened' : 'ant-header-side-closed', ]"
                     :style="{ padding: '0' }">
        <div v-if="mode === 'sidemenu'" class="header">
            <a-icon
                    v-if="device==='mobile'"
                    class="trigger"
                    :type="collapsed ? 'menu-fold' : 'menu-unfold'"
                    @click="toggle"></a-icon>
            <a-icon
                    v-else
                    class="trigger"
                    :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                    @click="toggle"/>
            <a-menu mode="horizontal" @click="onClickHMenu" :style="{ display:'inline-block', width:'600px', lineHeight: '62px' }">
                <a-menu-item key="dashboard">工作台</a-menu-item>
                <a-menu-item key="task">我的待办</a-menu-item>
                <a-menu-item key="passTask">我的经办</a-menu-item>
                <a-menu-item key="contacts">通讯录</a-menu-item>
                <a-menu-item key="knowledgeBase">知识库</a-menu-item>
                <a-menu-item key="document">文档管理</a-menu-item>
            </a-menu>

            <user-menu></user-menu>
        </div>
        <div v-else :class="['top-nav-header-index', theme]">
            <div class="header-index-wide">
                <div class="header-index-left">
                    <logo class="top-nav-header" :show-title="device !== 'mobile'"/>
                    <s-menu
                            v-if="device !== 'mobile'"
                            mode="horizontal"
                            :menu="menus"
                            :theme="theme"
                    ></s-menu>
                    <a-icon
                            v-else
                            class="trigger"
                            :type="collapsed ? 'menu-fold' : 'menu-unfold'"
                            @click="toggle"></a-icon>
                </div>
                <user-menu class="header-index-right"></user-menu>
            </div>
        </div>
    </a-layout-header>
</template>

<script>
import UserMenu from '../tools/UserMenu'
import SMenu from '../Menu/'
import Logo from '../tools/Logo'

import { mixin } from '@/utils/mixin'
import { handleScrollHeader } from '@/utils/util'

export default {
  name: 'GlobalHeader',
  components: {
    UserMenu,
    SMenu,
    Logo
  },
  mixins: [mixin],
  props: {
    mode: {
      type: String,
      // sidemenu, topmenu
      default: 'sidemenu'
    },
    menus: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    device: {
      type: String,
      required: false,
      default: 'desktop'
    }
  },
  data () {
    return {
      headerBarFixed: false
    }
  },
  mounted () {
    const _this = this
    handleScrollHeader(direction => {
      _this.handleScroll(direction)
    })
  },
  methods: {
    handleScroll (direction) {
      if (this.autoHideHeader) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        if (direction === 'up') {
          this.headerBarFixed = false
        } else {
          scrollTop > 100 && (this.headerBarFixed = true)
        }
      } else {
        this.headerBarFixed = false
      }
    },
    toggle () {
      this.$emit('toggle')
    },
    onClickHMenu (target) {
      if (target.key === 'dashboard') {
        this.$router.push({ path: '/dashboard/workplace' })
      } else if (target.key === 'task') {
        this.$router.push({ path: '/workflow/task' })
      } else if (target.key === 'passTask') {
        this.$router.push({ path: '/workflow/pass' })
      } else if (target.key === 'contacts') {
        this.$router.push({ path: '/contacts/index' })
      } else if (target.key === 'knowledgeBase'){
        this.$router.push({ path: '/knowledgebase/index'})
      } else if (target.key === 'document'){
        this.$router.push({path: '/document/index' })
      }
    }
  }
}
</script>

<style lang="less" scoped>
    .ant-menu-horizontal {
        border-bottom: none;
    }
</style>
