<template>
    <page-view title="">
        <a-card>
            <s-table
                    ref="table"
                    :columns="columns"
                    :data="loadData"
                    :rowKey="record => record.id">
                <template slot="types" slot-scope=" record">
                    {{record.names}}
                </template>
                <template slot="state" slot-scope=" record">
                    <div v-if="record.activity === '1'">
                        有效
                    </div>
                    <div v-else>无效</div>
                </template>
                <template slot="typeInfo" slot-scope=" record">
                    {{record.memo}}
                </template>
                <template slot="query" slot-scope=" record">
                    <a @click="onSystemView(record.id)">查看详细信息</a>
                </template>
            </s-table>
        </a-card>
        <system-view ref="systemView" :visible="modalVisible.systemView" @success="onOk" @cancel="onClose" />
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import STable from '@/components/Table'
import qs from 'qs'
import systemView from './AskVacationSystemView'
export default {
  name: 'AskVacationSystem',
  components: {
    PageView,
    STable,
    systemView
  },
  data () {
    return {
      columns: [
        {
          title: '假期类型',
          scopedSlots: { customRender: 'types' }
        },
        {
          title: '活动状态',
          scopedSlots: { customRender: 'state' }
        },
        {
          title: '假期类型说明',
          scopedSlots: { customRender: 'typeInfo' }
        },
        {
          title: '查看',
          scopedSlots: { customRender: 'query' }
        }
      ],
      modalVisible: {
        systemView: false
      },
      form: this.$form.createForm(this),
      queryParam: {
      },
      loadData: parameter => {
        return this.$http.get('/api/1/vacation_config_type/query_config_type_list.json', { params: Object.assign(parameter, this.queryParam),
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
    reset () {
      this.queryParam = {}
      this.queryForm = {}
      this.onSearch()
    },
    onSearch () {
      this.queryParam = { ...this.queryForm }
      // 申请时间
      if (this.queryParam.startTime) {
        this.queryParam.startTime = this.queryParam.startTime.format('YYYY-MM-DD')
      }
      if (this.queryParam.endTime) {
        this.queryParam.endTime = this.queryParam.endTime.format('YYYY-MM-DD')
      }
      this.$refs.table.refresh()
    },
    onSystemView (id) {
      this.modalVisible.systemView = true
      this.$refs.systemView.preSystemView(id)
    },
    onOk () {
      this.modalVisible.systemView = false
    },
    onClose () {
      this.modalVisible.systemView = false
    }
  }
}
</script>

<style scoped>

</style>
