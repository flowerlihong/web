<template>
    <page-view title="外勤/出差管理">
        <a-card>
            <a-form :form="queryTripForm">
                <table class="fx-form">
                    <tr>
                        <th>申请时间</th>
                        <td>
                            <a-form-item>
                                <a-date-picker v-model="queryForm.createdAtSt" />
                                至 <a-date-picker v-model="queryForm.createdAtEnd" />
                            </a-form-item>
                        </td>
                        <th>外出类型</th>
                        <td><dict-cascader dictKey="BUSINESSTRIP.TYPES" style="width:174px" @change="onCascaderChangeTypes"/></td>
                    </tr>
                    <tr>
                        <th>计划外出时间</th>
                        <td>
                            <a-form-item>
                                <a-date-picker v-model="queryForm.planStartAtSt" />
                                至 <a-date-picker v-model="queryForm.planStartAtEnd" />
                            </a-form-item>
                        </td>
                        <th>计划返回时间</th>
                        <td>
                            <a-form-item>
                                <a-date-picker v-model="queryForm.planEndAtSt" />
                                至 <a-date-picker v-model="queryForm.planEndAtEnd" />
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>外出地点</th>
                        <td>
                            <a-form-item>
                                <a-input style="width: 420px"
                                         v-model="queryForm.address"></a-input>
                            </a-form-item>
                        </td>
                        <th>外出事由</th>
                        <td>
                            <a-form-item>
                                <a-input style="width: 420px"
                                         v-model="queryForm.content"></a-input>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" align="center" style="padding:14px 0">
                            <a-button  type="primary" @click="onSearch">查询</a-button>
                            <a-button style="margin-left: 20px" @click="reset">重置</a-button>
                        </td>
                    </tr>
                </table>
            </a-form>
            <s-table
                    ref="table"
                    :columns="columns"
                    :data="loadData"
                    :rowKey="record => record.id">
                <template slot="types" slot-scope=" record">
                        <div v-if="record.types === '1'">出差</div>
                        <div v-else-if="record.types === '2'">外勤</div>
                </template>
                <template slot="address" slot-scope=" record">
                    <div v-if="record.address.length > 10">
                        <a @click="onView(record)">{{record.address.substring(0,20)}}...</a>
                    </div>
                    <div v-else>
                        <a @click="onView(record)">{{record.address}}</a>
                    </div>
                </template>
                <template slot="createdTime" slot-scope=" record">
                    {{record.extras.creatAt}}
                </template>
                <template slot="planStartAt" slot-scope=" record">
                    {{record.extras.planStartAt}}
                </template>
                <template slot="planEndAt" slot-scope=" record">
                    {{record.extras.planEndAt}}
                </template>
                <template slot="state" slot-scope=" record">
                    <a-tag v-if="record.state === '2'" color="green">已办结</a-tag>
                    <a-tag v-else-if="record.state === '3'" color="red">已废弃</a-tag>
                    <a-tag v-else color="blue">办理中</a-tag>
                </template>
            </s-table>
            <div>
                <a-modal
                        title="外出地点"
                        v-model="visible"
                        @ok="handleOk"
                >
                    {{modalContent}}
                </a-modal>
            </div>
        </a-card>
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import STable from '@/components/Table'
import qs from 'qs'
import DictCascader from '@/components/dict/DictCascader'

export default {
  name: 'BusinessTripMine',
  components: {
    PageView,
    STable,
    DictCascader
  },
  created () {
    const user = this.$ls.get('user')
    this.queryForm.userId = user.id
    this.queryParam.userId = user.id
  },
  data () {
    return {
      visible: false,
      modalContent: '',
      // trip: {},
      columns: [
        {
          title: '外出类型',
          scopedSlots: { customRender: 'types' }
        },
        {
          title: '外出地点',
          scopedSlots: { customRender: 'address' }
        },
        {
          title: '申请时间',
          scopedSlots: { customRender: 'createdTime' }
        },
        {
          title: '外出时间',
          scopedSlots: { customRender: 'planStartAt' }
        },
        {
          title: '返回时间',
          scopedSlots: { customRender: 'planEndAt' }
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'state' }
        }
      ],
      queryTripForm: this.$form.createForm(this),
      queryForm: {
        types: null,
        userName: null,
        createdAtSt: null,
        createdAtEnd: null,
        address: '',
        content: '',
        state: '',
        planStartAtSt: null,
        planStartAtEnd: null,
        planEndAtSt: null,
        planEndAtEnd: null,
        userId: ''
      },
      queryParam: {
      },
      loadData: parameter => {
        return this.$http.get('/api/1/business_trip/query_business_trip_list.json', { params: Object.assign(parameter, this.queryParam),
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
    showModal (record) {
      this.modalContent = record.address
      this.visible = true
    },
    handleOk (e) {
      console.log(e)
      this.visible = false
    },
    reset () {
      this.queryParam = {}
      this.queryForm = {}
      const user = this.$ls.get('user')
      this.queryForm.userId = user.id
      this.onSearch()
    },
    onCascaderChangeTypes (values) {
      this.queryForm.types = values
    },
    onSearch () {
      this.queryParam = { ...this.queryForm }
      // 申请时间
      if (this.queryParam.createdAtSt) {
        this.queryParam.createdAtSt = this.queryParam.createdAtSt.format('YYYY-MM-DD')
      }
      if (this.queryParam.createdAtEnd) {
        this.queryParam.createdAtEnd = this.queryParam.createdAtEnd.format('YYYY-MM-DD')
      }
      // 计划外出
      if (this.queryParam.planStartAtSt) {
        this.queryParam.planStartAtSt = this.queryParam.planStartAtSt.format('YYYY-MM-DD')
      }
      if (this.queryParam.planStartAtEnd) {
        this.queryParam.planStartAtEnd = this.queryParam.planStartAtEnd.format('YYYY-MM-DD')
      }
      // 计划返回
      if (this.queryParam.planEndAtSt) {
        this.queryParam.planEndAtSt = this.queryParam.planEndAtSt.format('YYYY-MM-DD')
      }
      if (this.queryParam.planEndAtEnd) {
        this.queryParam.planEndAtEnd = this.queryParam.planEndAtEnd.format('YYYY-MM-DD')
      }
      this.$refs.table.refresh()
    },
    onView (record) {
      this.$router.push({ path: '/businesstrip/view?id=' + record.id })
    }
  }
}
</script>

<style scoped>
    .card {
        margin-bottom: 24px;
    }

    th {
        width: 110px !important;
    }

    table .ant-form-item {
        margin-bottom: 0;
    }
</style>
