<template>
    <page-view title="发送记录">
        <a-card>
            <a-form :form="form">
                <table class="fx-form">
                    <tr>
                        <th>状态</th>
                        <td>
                            <a-form-item>
                                <a-select style="width: 170px" v-model="queryForm.state">
                                    <a-select-option value="">不限</a-select-option>
                                    <a-select-option value="S">成功</a-select-option>
                                    <a-select-option value="F">失败</a-select-option>
                                </a-select>
                            </a-form-item>
                        </td>
                        <th>内容或号码</th>
                        <td>
                            <a-form-item>
                                <a-input style="width: 300px" v-model="queryForm.content"></a-input>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>发送时间</th>
                        <td>
                            <a-form-item>
                                <a-date-picker v-model="queryForm.startTime" />
                                至 <a-date-picker v-model="queryForm.endTime" />
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" align="center" style="padding:14px 0">
                            <a-button type="primary" @click="onSearch">查询</a-button>
                            <a-button @click="reset">重置</a-button>
                        </td>
                    </tr>
                </table>
            </a-form>
            <s-table
                    ref="table"
                    :columns="columns"
                    :data="loadData"
                    :rowKey="record => record.id">
                <template slot="names" slot-scope=" record">
                    <a @click="showModal(record)">{{record.extras.mobile}}</a>
                </template>
                <template slot="linkMan" slot-scope=" record">
                    <div v-if="record.content.length > 50">
                        {{record.content.substring(0,50)}}...
                    </div>
                    <div v-else>{{record.content}}</div>
                </template>
                <template slot="phone" slot-scope=" record">
                    {{record.createdAt}}
                </template>
                <template slot="state" slot-scope=" record">
                    <a-tag v-if="record.result === 'S'" color="green">成功</a-tag>
                    <a-tag v-else color="red">失败</a-tag>
                </template>
                <template slot="operation" slot-scope=" record">
                    {{record.vendor}}
                </template>
            </s-table>
        </a-card>
        <a-modal
                title="详细信息"
                v-model="visible"
                :width="960"
                @ok="handleOk"
        >
            <div>
                <table class="fx-form-view">
                    <tr>
                        <th>接收号码</th>
                        <td colspan="3">
                            <!--<p v-for="item in mobiles" :key="item.id">{{item.mobile}}</p>-->
                            {{mobile}}
                        </td>
                    </tr>
                    <tr>
                        <th>内容</th>
                        <td colspan="3">
                            {{smsRecord.content}}
                        </td>
                    </tr>
                    <tr>
                        <th>发送时间</th>
                        <td>
                            {{smsRecord.createdAt}}
                        </td>
                        <th>状态</th>
                        <td>
                            {{smsRecord.result === 'S'? '成功':'失败'}}
                        </td>
                    </tr>
                    <tr>
                        <th>短信提供商</th>
                        <td colspan="3">
                            {{smsRecord.vendor}}
                        </td>
                    </tr>
                </table>
            </div>
        </a-modal>
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import STable from '@/components/Table'
import qs from 'qs'
export default {
  name: 'MessageIndex',
  components: {
    PageView,
    STable
  },
  created () {
  },
  data () {
    return {
      visible: false,
      mobiles: [],
      mobile: '',
      columns: [
        {
          title: '接收号码',
          scopedSlots: { customRender: 'names' }
        },
        {
          title: '内容',
          scopedSlots: { customRender: 'linkMan' }
        },
        {
          title: '发送时间',
          scopedSlots: { customRender: 'phone' }
        },
        {
          title: '发送状态',
          scopedSlots: { customRender: 'state' }
        },
        {
          title: '短信提供商',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      loading: false,
      form: this.$form.createForm(this),
      queryForm: {
        state: '',
        mobile: '',
        content: '',
        startTime: null,
        endTime: null
      },
      smsRecord: {

      },
      queryParam: {
      },
      loadData: parameter => {
        return this.$http.get('/api/1/message/get_sms_list.json', { params: Object.assign(parameter, this.queryParam),
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
      this.smsRecord = record
      this.visible = true
      this.getMobile(record)
    },
    getMobile (record) {
      const that = this
      that.$http.get('/api/1/message/get_mobile_list.json?smsRecordId=' + record.id).then(function (resp) {
        that.mobiles = resp.list
        that.mobile = resp.mobile
      })
    },
    handleOk () {
      this.visible = false
    },
    reset () {
      this.queryForm = {}
      this.queryParam = {}
      this.onSearch()
    },
    onSearch () {
      this.queryParam = { ...this.queryForm }
      if (this.queryParam.startTime) {
        this.queryParam.startTime = this.queryParam.startTime.format('YYYY-MM-DD')
      }
      if (this.queryParam.endTime) {
        this.queryParam.endTime = this.queryParam.endTime.format('YYYY-MM-DD')
      }
      this.$refs.table.refresh()
    },
    onView (record) {
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
