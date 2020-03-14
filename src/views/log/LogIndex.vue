<template>
    <page-view title="系统日志">
    <a-card :bordered="false">
        <div class="table-page-search-wrapper">
            <a-form layout="inline">
                <a-row :gutter="16">
                    <a-col :md="7">
                        <a-form-item label="类型">
                            <a-checkbox-group :options="OPT_TYPE" @change="onTypeChange" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="5">
                        <a-form-item label="等级">
                            <a-checkbox-group :options="OPT_LEVEL" @change="onLevelChange" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="5">
                        <a-form-item label="时间">
                            <a-date-picker format="YYYY年MM月DD日" placeholder="选择时间" @change="onDateChange"/>
                        </a-form-item>
                    </a-col>
                    <a-col :md="6">
                        <a-form-item label="查询">
                            <a-input-search @search="onSearch" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </div>
        <s-table ref="table"
                 :columns="columns"
                 :rowKey="record => record.id"
                 :data="loadData"
                 size="middle">
            <a slot="name" slot-scope="text, record" @click="onView(record)">{{text}}</a>
            <span slot="actionType" slot-scope="record">
                <a-tag v-if="record.actionType === 'D'" color="red">{{record.extras.actionType}}</a-tag>
                <a-tag v-else-if="record.actionType === 'L'" color="green">{{record.extras.actionType}}</a-tag>
                <a-tag v-else>{{record.extras.actionType}}</a-tag>
            </span>
            <span slot="resourceContent" slot-scope="text, record">
                <span v-if="record.level === 'E' || record.level === 'F'" style="color:red;">{{text}}</span>
                <span v-else-if="record.level === 'W'" style="color:orange;">{{text}}</span>
                <span v-else>{{text}}</span>
            </span>
            <span slot="userAgent" slot-scope="record">
                <svg class="fx-icon" aria-hidden="true" style="margin-right: 6px">
                  <use v-if="record.extras.userAgent != null && record.extras.userAgent.os.startsWith('WINDOWS_10')" xlink:href="#fx-windows-10"></use>
                  <use v-else-if="record.extras.userAgent != null && record.extras.userAgent.os.startsWith('WINDOWS_7')" xlink:href="#fx-windows-7"></use>
                  <use v-else-if="record.extras.userAgent != null && record.extras.userAgent.os.startsWith('WINDOWS_XP')" xlink:href="#fx-windows-xp"></use>
                  <use v-else-if="record.extras.userAgent != null && record.extras.userAgent.os.startsWith('WINDOWS')" xlink:href="#fx-windows-10"></use>
                  <use v-else-if="record.extras.userAgent != null && record.extras.userAgent.os.startsWith('MACOS')" xlink:href="#fx-macos"></use>
                </svg>
                <svg class="fx-icon" aria-hidden="true">
                  <use v-if="record.extras.userAgent != null && record.extras.userAgent.browser.startsWith('IE')" xlink:href="#fx-browser-ie"></use>
                  <use v-else-if="record.extras.userAgent != null && record.extras.userAgent.browser.startsWith('CHROME')" xlink:href="#fx-browser-chrome"></use>
                  <use v-else-if="record.extras.userAgent != null && record.extras.userAgent.browser.startsWith('FIREFOX')" xlink:href="#fx-browser-firefox"></use>
                </svg>
            </span>
        </s-table>

        <LogView ref="logView" :visible="modalVisible" @cancel="modalVisible = false"/>
    </a-card>
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import STable from '@/components/Table'
import qs from 'qs'
import LogView from './LogView'

const OPT_TYPE = [
  { label: '读取', value: 'R' },
  { label: '增删改', value: 'U' },
  { label: '登录', value: 'L' }
]

const OPT_LEVEL = [
  { label: '信息', value: 'I' },
  { label: '错误', value: 'E' }
]

const columns = [
  {
    title: '用户',
    dataIndex: 'userName',
    width: '180px'
  },
  {
    title: '动作',
    scopedSlots: { customRender: 'actionType' },
    width: '180px'
  },
  {
    title: '资源类型',
    dataIndex: 'resourceType',
    width: '180px'
  },
  {
    title: '资源',
    dataIndex: 'resourceContent',
    scopedSlots: { customRender: 'resourceContent' }
  },
  {
    title: '操作系统',
    scopedSlots: { customRender: 'userAgent' },
    width: '160px'
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    width: '180px'
  },
  {
    title: '时间',
    dataIndex: 'createdAt',
    width: '180px'
  }
]

export default {
  name: 'LogIndex',
  components: {
    PageView,
    STable,
    LogView
  },
  mounted () {
  },
  data () {
    return {
      OPT_TYPE,
      OPT_LEVEL,
      columns,
      queryParams: {},
      modalVisible: false,
      loadData: parameter => {
        return this.$http.get('/api/1/log/query.json', { params: Object.assign(parameter, this.queryParams),
          paramsSerializer: function (params) {
            return qs.stringify(params, { indices: false })
          }
        }).then(res => {
          return res
        })
      }
    }
  },
  methods: {
    onTypeChange (checkedValue) {
      this.queryParams = Object.assign(this.queryParams, { type: checkedValue })
      this.$refs.table.refresh()
    },
    onLevelChange (checkedValue) {
      this.queryParams = Object.assign(this.queryParams, { level: checkedValue })
      this.$refs.table.refresh()
    },
    onDateChange (date, dateString) {
      this.queryParams = Object.assign(this.queryParams, { date: dateString })
      this.$refs.table.refresh()
    },
    onSearch (value) {
      this.queryParams = Object.assign(this.queryParams, { query: value })
      this.$refs.table.refresh()
    },
    onView (record) {
      this.modalVisible = true
      this.$refs.logView.preView(record.id)
    }
  }
}
</script>

<style scoped>

</style>
