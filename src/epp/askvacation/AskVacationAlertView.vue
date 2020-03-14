<template>
    <a-modal title="请休假记录"
             :width="960"
             :visible="visible"
             :maskClosable="false"
             @ok="$emit('cancel')"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading">
        <a-card>
            <s-table
                    ref="table"
                    :columns="columns"
                    :data="loadData"
                    :rowKey="record => record.id">
                <template slot="types" slot-scope=" record">
                    <div v-if="record.extras.configTypeName.length > 7">
                        <a @click="onView(record)">{{record.extras.configTypeName.substring(0,7)}}...</a>
                    </div>
                    <div v-else>
                        <a @click="onView(record)">{{record.extras.configTypeName}}</a>
                    </div>
                </template>
                <template slot="vacationName" slot-scope=" record">
                    <div v-if="record.extras.configName.length > 10">
                        {{record.extras.configName.substring(0,10)}}...
                    </div>
                    <div v-else>
                        {{record.extras.configName}}
                    </div>
                </template>
                <template slot="applyTime" slot-scope=" record">
                    {{record.extras.createdAt}}
                </template>
                <template slot="days" slot-scope=" record">
                    {{record.extras.vacationDays}}
                </template>
                <template slot="startTime" slot-scope=" record">
                    {{record.items[0].extras.reportStart}}
                </template>
                <template slot="state" slot-scope=" record">
                    <a-tag v-if="record.flag === 'N'" color="red">废弃</a-tag>
                    <a-tag v-else-if="record.flag === 'Q'" color="blue">申请通过</a-tag>
                    <a-tag v-else-if="record.flag === 'Y'" color="green">休假中</a-tag>
                    <a-tag v-else-if="record.flag === 'D'" color="green">已办结</a-tag>
                    <a-tag v-else color="blue">申请中</a-tag>
                </template>
            </s-table>
        </a-card>
    </a-modal>
</template>

<script>
import STable from '@/components/Table'
import qs from 'qs'
export default {
  name: 'AskVacationAlertView',
  components: {
    STable
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      columns: [
        {
          title: '假期类型',
          scopedSlots: { customRender: 'types' }
        },
        {
          title: '假期名称',
          scopedSlots: { customRender: 'vacationName' }
        },
        {
          title: '申请日期',
          scopedSlots: { customRender: 'applyTime' }
        },
        {
          title: '请休天数',
          scopedSlots: { customRender: 'days' }
        },
        {
          title: '假期开始日期',
          scopedSlots: { customRender: 'startTime' }
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'state' }
        }
      ],
      queryParam: {
        scene: 2
      },
      loadData: parameter => {
        return this.$http.get('/api/1/vacation_report/query_vacation_report_list.json', { params: Object.assign(parameter, this.queryParam),
          paramsSerializer: function (params) {
            return qs.stringify(params, { indices: false })
          }
        }).then(res => {
          return res
        })
      },
      modalLoading: false
    }
  },
  methods: {
    preView (userId, param) {
      this.queryParam = param
      this.queryParam.userId = userId
      this.queryParam.scen = 2
      this.queryParam.scene = 2
      this.onSearch()
    },
    onSearch () {
      this.$refs.table.refresh()
    },
    onView (record) {
      if (record.extras.state === 'T' || record.extras.state === 'X') {
        this.$router.push({ path: '/askvacation/reportbackview?id=' + record.id })
        return
      }
      this.$router.push({ path: '/askvacation/view?id=' + record.id })
    }
  }
}
</script>

<style scoped>

</style>
