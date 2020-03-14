<template>
    <a-modal title="日志详情"
             :width="800"
             :footer="null"
             :visible="visible"
             @cancel="$emit('cancel')">
        <detail-list :col="1" title="日志详情">
            <detail-list-item term="事件">{{model.value}}</detail-list-item>
            <detail-list-item term="用户">{{model.userName}}</detail-list-item>
            <detail-list-item term="时间">{{model.date}}</detail-list-item>
            <detail-list-item term="IP">{{model.ip}}</detail-list-item>
            <detail-list-item term="类型">{{model.type}}</detail-list-item>
            <detail-list-item term="详情">{{model.detail}}</detail-list-item>
        </detail-list>
    </a-modal>
    <!-- / a-modal -->
</template>

<script>
import { axios as request } from '@/utils/request'
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item

export default {
  name: 'LogView',
  components: {
    DetailList,
    DetailListItem
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      model: {}
    }
  },
  methods: {
    preView (id) {
      let that = this
      request.get('/api/1/log/get_log.json?id=' + id).then(function (response) {
        let model = response.result
        that.model = { ...that.model, ...model }
      })
    }
  }
}
</script>

<style scoped>

</style>
