<template>
    <page-view title="我的经办">
        <a-card>
            <div class="table-page-search-wrapper">
                <a-form layout="inline">
                    <a-row :gutter="48">
                        <a-col :md="12" :lg="8" :sm="24">
                            <a-form-item label='标题'>
                                <a-input v-model="queryForm.title" />
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

            <s-table ref="table" :columns="columns" :data="loadData" :rowKey="record => record.case_id">
                <template slot="title" slot-scope="record">
                    <a @click="onView(record)">{{record.title}}</a>
                </template>
            </s-table>
        </a-card>
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import STable from '@/components/Table'
import qs from 'qs'

export default {
  name: 'WorkflowPass',
  components: {
    PageView,
    STable
  },
  mounted () {
    this.onFetch()
  },
  data () {
    return {
      columns: [
        {
          title: '类别',
          width: '160px',
          dataIndex: 'cate_name'
        },
        {
          title: '事项',
          scopedSlots: { customRender: 'title' }
        },
        {
          title: '当前处理人',
          width: '160px',
          dataIndex: 'current_user'
        },
        {
          title: '启动时间',
          width: '160px',
          dataIndex: 'create_date'
        },
        {
          title: '办结时间',
          width: '160px',
          dataIndex: 'end_date'
        }
      ],
      loading: false,
      queryForm: {
        title: null
      },
      queryParam: {
      },
      loadData: parameter => {
        return this.$http.get('/api/1/workflow/pass_tasks.json?all=1', { params: Object.assign(parameter, this.queryParam),
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
      let that = this
      this.loading = true
      this.$http.get('/api/1/workflow/pass_tasks.json?all=1', {
        params: params,
        paramsSerializer: function (params) {
          return qs.stringify(params, { indices: false })
        }
      }).then(function (response) {
        that.loading = false
        that.data = response.result
      })
    },
    onSearch () {
      if (this.queryForm.title != null) {
        this.queryParam.title = this.queryForm.title
      } else {
        this.queryParam.title = ''
      }
      this.$refs.table.refresh()
    },
    onView (record) {
      let url = record.view_url + '?id=' + record.case_id
      this.$router.push({ path: url })
    }
  }
}
</script>

<style lang="less" scoped>
    .card {
        margin-bottom: 24px;
    }
</style>
