<template>
    <page-view title="日志详情">
        <a-card>
            <div class="topic">
                <div class="topic1">{{workLog.title}}</div>
                <div>
                    <span>开始时间：{{workLog.extras.startAt}}</span>&nbsp;&nbsp;
                    <span>结束时间：{{workLog.extras.endAt}}</span>
                </div>
            </div><hr>
            <span v-html="workLog.content" class="content"></span>
        </a-card>
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'

export default {
  name: 'WorkLogView',
  components: {
    PageView
  },
  created () {
    this.loadDate()
  },
  data () {
    return {
      loadingId: this.$route.query.id,
      workLog: {
        title: '',
        content: '',
        extras: {
          startAt: '',
          endAt: ''
        }
      }
    }
  },
  methods: {
    loadDate () {
      const that = this
      this.$http.get('/api/1/work_log/get_work_log.json?id=' + that.loadingId).then(function (response) {
        let result = response.result
        that.workLog = result
      })
    },
  }
}
</script>

<style scoped lang="less">
    .topic {
        text-align: center;
    }
    .topic1 {
        margin-bottom: 10px;
        font-size: 20px;
        font-weight: 800;
        color: #4aa8ed;
    }
</style>
