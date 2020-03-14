<template>
    <page-view title="发送历史">
        <a-card>
            <div class="table-page-search-wrapper">
                <a-form layout="inline">
                    <a-row :gutter="48">
                        <a-col :md="12" :lg="8" :sm="24">
                            <a-form-item label='发送号码'>
                                <a-input v-model="queryForm.mobile" />
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <span class="table-page-search-submitButtons">
                              <a-button type="primary" @click="onSearch">查询</a-button>
                              <a-button style="margin-left: 8px" @click="() => queryForm = {}">重置</a-button>
                            </span>
                        </a-col>
                    </a-row>
                </a-form>
            </div>

            <s-table
                    ref="table"
                    :columns="columns"
                    :data="loadData"
                    :rowKey="record => record.id">
                <template slot="mobile" slot-scope="record">
                    <span v-html="record.extras.mobile"></span>
                </template>
                <template slot="content" slot-scope="record">
                    {{record.content}}
                </template>
                <template slot="createdAt" slot-scope="record">
                    {{record.createdAt}}
                </template>
                <template slot="state" slot-scope="record">
                    <a-tag v-if="record.result === 'S'" color="green">发送成功</a-tag>
                    <a-tag v-else color="red">未知</a-tag>
                </template>
                <template slot="vendor" slot-scope="record">
                    {{record.vendor}}
                </template>
            </s-table>
        </a-card>
    </page-view>
</template>

<script>
import STable from '@/components/Table'
import { PageView } from '@/layouts'
import qs from 'qs'

export default {
  name: 'SmsIndex',
  components: {
    STable,
    PageView
  },
  created () {
  },
  data () {
    return {
      columns: [
        {
          title: '发送号码',
          scopedSlots: { customRender: 'mobile' }
        },
        {
          title: '内容',
          scopedSlots: { customRender: 'content' }
        },
        {
          title: '发送时间',
          scopedSlots: { customRender: 'createdAt' },
          width: '180px'
        },
        {
          title: '发送状态',
          scopedSlots: { customRender: 'state' }
        },
        {
          title: '短信提供商',
          scopedSlots: { customRender: 'vendor' },
          width: '150px'
        }
      ],
      loading: false,
      queryForm: {
        mobile: null
      },
      queryParam: {
      },
      loadData: parameter => {
        return this.$http.get('/api/1/sms/get_sms_list.json', { params: Object.assign(parameter, this.queryParam),
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
    onSearch () {
      this.queryParam.mobile = this.queryForm.mobile
      this.$refs.table.refresh()
    }
  }
}
</script>

<style scoped>

</style>
