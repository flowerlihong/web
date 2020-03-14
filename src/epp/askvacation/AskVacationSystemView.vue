<template>
    <a-modal title="假期配置信息"
             :width="960"
             :visible="visible"
             :maskClosable="false"
             @ok="$emit('cancel')"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading">
        <a-card title="假期类型信息">
            <a-table
                    :columns="columns"
                    :dataSource="initData"
                    :pagination="false"
                    :rowKey="record => record.id">
                <template slot="types" slot-scope=" record">
                   {{record.names}}
                </template>
                <template slot="category" slot-scope=" record">
                    <div v-if="record.category === '1'">
                        请假
                    </div>
                    <div v-else>休假</div>
                </template>
                <template slot="typeInfo" slot-scope=" record">
                    {{record.memo}}
                </template>
            </a-table>
        </a-card>
        <a-card title="具体假期信息">
            <a-table
                    ref="table"
                    :columns="detailColumns"
                    :dataSource="initData[0].extras.items"
                    :pagination="false"
                    :rowKey="record => record.id">
                <template slot="vacationName" slot-scope=" record">
                    {{record.names}}
                </template>
                <template slot="days" slot-scope=" record">
                    {{record.days === null? '无限制':record.days}}
                </template>
                <template slot="info" slot-scope=" record">
                    <div v-if="record.meno.length > 10">
                        {{record.meno.substring(0,20)}}...
                    </div>
                    <div v-else>
                        {{record.meno}}
                    </div>
                </template>
            </a-table>
        </a-card>
    </a-modal>
</template>

<script>
export default {
  name: 'AskVacationSystemView',
  components: {
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
          width: '100px',
          scopedSlots: { customRender: 'types' }
        },
        {
          title: '分类',
          width: '100px',
          scopedSlots: { customRender: 'category' }
        },
        {
          title: '假期类型说明',
          width: '100px',
          scopedSlots: { customRender: 'typeInfo' }
        }
      ],
      detailColumns: [
        {
          title: '假期名称',
          width: '100px',
          scopedSlots: { customRender: 'vacationName' }
        },
        {
          title: '天数',
          width: '100px',
          scopedSlots: { customRender: 'days' }
        },
        {
          title: '假期说明',
          width: '100px',
          scopedSlots: { customRender: 'info' }
        }
      ],
      initData: [
        { extras: '' }
      ],
      queryParam: {
      },
      modalLoading: false
    }
  },
  methods: {
    preSystemView (id) {
      this.loadData(id)
    },
    onSearch (id) {
      this.queryParam.id = id
      this.$refs.table.refresh()
    },
    loadData (id) {
      let that = this
      this.$http.get('/api/1/vacation_config_type/get_config_type_and_children.json?id=' + id).then(function (response) {
        let result = response.result
        that.initData = result
        console.log(that.initData)
      })
    }
  }
}
</script>

<style scoped>

</style>
