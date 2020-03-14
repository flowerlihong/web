<template>
    <page-view title="我的报销">
        <template slot="action">
            <a-button-group>
                <a-button @click="exportExcel"><img src="/img/xls.gif" align="absBottom">导出excel</a-button>
            </a-button-group>
        </template>
        <a-card>
            <div class="table-page-search-wrapper">
                <a-form layout="inline">
                    <a-row :gutter="48">
                        <a-col :md="12" :lg="8" :sm="24">
                            <a-form-item label='填表日期'>
                                <a-range-picker v-model="queryForm.createdAt" />
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
                <template slot="sn" slot-scope="text, record, index">
                    <a @click="onView(record)">{{record.sn}}</a>
                </template>
                <template slot="createdAt" slot-scope="text, record, index">
                    {{record.extras.createdAt}}
                </template>
                <template slot="total" slot-scope="text, record, index">
                    ￥{{record.extras.totalAmount}} 元
                </template>
                <template slot="state" slot-scope="text, record, index">
                    <a-tag v-if="record.state === 'P'" color="green">审核通过</a-tag>
                    <a-tag v-else-if="record.state === 'F'" color="red">审核失败</a-tag>
                    <a-tag v-else color="blue">审核中</a-tag>
                </template>
                <template slot="process" slot-scope="record">
                    <a-tag v-if="record.extras.state === 'C'" color="green">{{record.extras.stateDesc}}</a-tag>
                    <a-tag v-else>{{record.extras.stateDesc}}</a-tag>
                </template>
            </s-table>
        </a-card>
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import STable from '@/components/Table'
import { axios } from '@/utils/request'
import qs from 'qs'

export default {
  name: 'ClaimIndex',
  components: {
    STable,
    PageView
  },
  mounted () {
  },
  data () {
    return {
      columns: [
        {
          title: '报销单编号',
          scopedSlots: { customRender: 'sn' }
        },
        {
          title: '填表日期',
          scopedSlots: { customRender: 'createdAt' }
        },
        {
          title: '报销金额',
          scopedSlots: { customRender: 'total' }
        },
        {
          title: '审核情况',
          scopedSlots: { customRender: 'state' }
        },
        {
          title: '办理情况',
          scopedSlots: { customRender: 'process' }
        }
      ],
      loading: false,
      queryForm: {
        createdAt: null
      },
      queryParam: {
      },
      loadData: parameter => {
        return axios.get('/api/1/claim/query.json', { params: Object.assign(parameter, this.queryParam),
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
    onFetch (params = {}) {
    },
    exportExcel () {
      const url = '/api/1/claim/export_excel_my_data.json'
      this.$http.post(url, qs.stringify(this.queryParam), {
        responseType: 'blob'
      }).then(res => {
        let blob = new Blob([res], {
          type: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        if (window.navigator.msSaveOrOpenBlob) {
          let fileName = '我的报销申请.xlsx'
          navigator.msSaveBlob(blob, fileName)
        } else {
          let elink = document.createElement('a')
          elink.download = '我的报销申请.xlsx'
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          document.body.removeChild(elink)
        }
      }).catch(err => {
        console.warn(err)
      })
    },
    onSearch () {
      if (this.queryForm.createdAt != null && this.queryForm.createdAt.length === 2) {
        let start = this.queryForm.createdAt[0].format('YYYY-MM-DD')
        let end = this.queryForm.createdAt[1].format('YYYY-MM-DD')
        this.queryParam.startDate = start
        this.queryParam.endDate = end
      } else {
        this.queryParam.startDate = ''
        this.queryParam.endDate = ''
      }
      this.$refs.table.refresh()
    },
    onView (record) {
      this.$router.push({ path: '/claim/view?id=' + record.id })
    }
  }
}
</script>

<style lang="less" scoped>
    .card {
        margin-bottom: 24px;
    }
</style>
