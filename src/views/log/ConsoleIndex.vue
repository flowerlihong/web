<template>
    <page-view title="实时控制台">
        <div :style="'min-width:' + width" class="container">
            <div id="console" :style="'height:'+ height" class="console">
                <div v-for="item in data" :key="item.time">
                    <span>{{ item.date + ' ' }} </span>
                    <span :style="'color:'+ getColor(item.level)">{{ item.level + ' ' }}</span>
                    <span>---- [{{ item.threadName }}] </span>
                    <span style="color:#00CCCC">{{ item.className }} : </span>
                    <span v-html="item.content"/>
                </div>
            </div>
        </div>
        <a-affix :style="{ position: 'absolute',right: '80px',  bottom: '80px'}">
            <a-tooltip placement="left" :title="content">
                <a-button type="primary" shape="circle" :icon="icon" @click="onLock"/>
            </a-tooltip>
        </a-affix>
    </page-view>
</template>

<script>
import moment from 'moment'
import { PageView } from '@/layouts'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

export default {
  name: 'ConsoleIndex',
  components: {
    PageView
  },
  mounted () {
    this.initWebSocket()
    const that = this
    window.onresize = function () {
      that.height = document.documentElement.clientHeight - 204 + 'px'
    }
  },
  // 监听控制滚动条
  watch: {
    data: {
      handler (val, oldVal) {
        this.$nextTick(() => {
          if (this.unlock) {
            let div = document.getElementById('console')
            div.scrollTop = div.scrollHeight
          }
        })
      }
    }
  },
  beforeDestroy: function () {
    // 页面离开时断开连接,清除定时器
    this.disconnect()
  },
  data () {
    return {
      icon: 'unlock',
      unlock: true,
      content: '锁定滚动条',
      height: document.documentElement.clientHeight - 204 + 'px',
      width: document.documentElement.clientWidth - 294 + 'px',
      data: [{
        date: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
        level: 'INFO',
        threadName: 'system-prompt-message',
        className: 'com.fxoa.Application',
        content: 'Welcome, Waiting for log output...'
      }],
      // level
      INFO: '#00CD00',
      WARN: '#FFFF00',
      ERROR: '#FF0000',
      DEBUG: '#DEA000'
    }
  },
  methods: {
    initWebSocket () {
      this.connection()
    },
    connection () {
      /* global API_SERVER */
      const socket = new SockJS(API_SERVER + '/ws/stomp?token=kl')
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(socket)
      // 定义客户端的认证信息,按需求配置
      var headers = {
        token: 'k1'
      }
      this.stompClient.connect(headers, (frame) => {
        this.stompClient.subscribe('/topic/console/log', (msg) => {
          const content = JSON.parse(msg.body)
          this.data.push(content)
          console.log(this.data)
        })
      }, (err) => {
        // 连接发生错误时的处理函数
        console.log(err)
      })
    },
    // 断开连接
    disconnect () {
      if (this.stompClient != null) {
        this.stompClient.disconnect()
      }
    },
    getColor (level) {
      if (level === 'INFO') {
        return this.INFO
      } else if (level === 'WARN') {
        return this.WARN
      } else if (level === 'DEBUG') {
        return this.DEBUG
      } else {
        return this.ERROR
      }
    },
    onLock () {
      if (this.unlock) {
        this.content = '解除锁定'
        this.icon = 'lock'
      } else {
        this.content = '锁定滚动条'
        this.icon = 'unlock'
      }
      this.unlock = !this.unlock
    }
  }
}
</script>

<style scoped>
    .container {
        width: 100%;
    }

    .container .console {
        font-family: "Interstate", "Hind", -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
        overflow-y: scroll;
        background: #494949;
        color: #f7f7f7;
        padding: 10px;
        font-size: 14px;
        border-radius: 3px 1px 3px 3px;
    }

    .lock {
        position: fixed;
        right: 45px;
        bottom: 6.8%;
        z-index: 100000
    }
</style>
