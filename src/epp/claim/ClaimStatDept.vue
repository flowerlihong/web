<template>
  <div :style="{ padding: '0 0 32px 32px' }">
    <h4 :style="{ marginBottom: '20px' }">{{ title }}&nbsp;&nbsp;<span v-show="dateRange.startDate !== null">{{dateRange.startDate}} 至 {{dateRange.endDate}}</span></h4>
    <v-chart
      height="254"
      :data="data"
      :scale="scale"
      :forceFit="true"
      :padding="['auto', 'auto', '40', '50']">
      <v-tooltip :item-tpl="itemTpl"/>
      <v-axis />
      <v-bar position="user*total"/>
    </v-chart>
  </div>
</template>

<script>
import qs from 'qs'

const scale = [{
  dataKey: 'total'
}]

export default {
  name: 'ClaimStatDept',
  props: {
    title: {
      type: String,
      default: ''
    },
    dateRange: {
      type: Object,
      default: null
    }
  },
  created () {
    this.loadData()
  },
  data () {
    return {
      data: [],
      scale,
      itemTpl: `
        <li data-index="{index}" style="margin-bottom: 4px;">
        <span style="background-color:{color};width:5px;height:5px;border-radius:50%;display:inline-block;margin-right: 8px;" class="g2-tooltip-marker"></span>
        金额<span class="g2-tooltip-value" style="display: inline-block; float: right; margin-left: 30px;">￥{value} 元</span>
        </li>
      `
    }
  },
  watch: {
    dateRange (val) {
      this.dateRange = val
      this.loadData()
    }
  },
  methods: {
    loadData () {
      const that = this
      that.data = []
      that.$http.get('/api/1/claim/stat_dept.json?' + qs.stringify(that.dateRange)).then(function (resp) {
        resp.result.forEach(function (item) {
          that.data.push({
            user: item.dept_name,
            total: item.total
          })
        })
      })
    }
  }
}
</script>
