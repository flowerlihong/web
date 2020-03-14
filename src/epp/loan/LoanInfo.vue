<!--Created by luRX on 2019/03/29.-->
<template>
    <page-view title="我的借款记录">
        <a-card class="card">
            <s-table
                    ref="table"
                    :columns="columns"
                    :data="loadData"
                    :rowKey="record => record.id">
                <template slot="loanNum" slot-scope=" record">
                    <a @click="onView(record)"> {{record.loanNum}} 元</a>
                </template>
                <template slot="factLoanNum" slot-scope=" record">
                    {{record.factLoanNum}} 元
                </template>
                <template slot="factLoanAt" slot-scope=" record">
                    {{record.extras.factLoanAt}}
                </template>
                <template slot="planendAt" slot-scope=" record">
                    {{record.extras.planendAt}}
                </template>
                <template slot="unrepaidNum" slot-scope=" record">
                    {{record.unrepaidNum}} 元
                </template>
                <template slot="repayment" slot-scope=" record">
                    <a-tag v-if="record.repayment === '1'" color="green">未还清</a-tag>
                    <a-tag v-else-if="record.repayment === '2'" color="blue">已还清</a-tag>
                </template>
                <template slot="state" slot-scope=" record">
                    <a-tag v-if="record.state === '2'" color="green">办结</a-tag>
                    <a-tag v-else-if="record.state === '3'" color="red">废弃</a-tag>
                    <a-tag v-else color="blue">申请中</a-tag>
                </template>
                <template slot="footer">
                    <div class="totalNum">
                        <span class="font">借款金额：</span><span class="amount">{{loanTotal|number}}</span>
                        <span class="font">未还金额：</span><span class="amount">{{unrepaidTotal|number}}</span>
                    </div>
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
  name: 'LoanIndex',
  components: {
    PageView,
    STable
  },
  filters: {
    number: function (data) {
      return data.toFixed(2)
    }
  },
  computed: {
    // 未还总金额
    unrepaidTotal: function () {
      let total = 0
      this.initData.forEach(function (item) {
        total += item.unrepaidNum
      })
      return total
    },
    // 借款总金额
    loanTotal: function () {
      let total = 0
      this.initData.forEach(function (item) {
        total += item.loanNum
      })
      return total
    }
  },
  data () {
    return {
      columns: [
        {
          title: '欲借金额',
          align: 'center',
          scopedSlots: { customRender: 'loanNum' }
        },
        {
          title: '实拨金额',
          align: 'center',
          scopedSlots: { customRender: 'factLoanNum' }
        },
        {
          title: '实际拨款时间',
          align: 'center',
          scopedSlots: { customRender: 'factLoanAt' }
        },
        {
          title: '预计还款时间',
          align: 'center',
          scopedSlots: { customRender: 'planendAt' }
        },
        {
          title: '剩余未还金额',
          align: 'center',
          scopedSlots: { customRender: 'unrepaidNum' }
        },
        {
          title: '办理状态',
          align: 'center',
          scopedSlots: { customRender: 'state' }
        }
      ],
      initData: [],
      queryParam: {},
      loadData: parameter => {
        return this.$http.get('/api/1/loan/query_loan.json', {
          params: Object.assign(parameter, this.queryParam),
          paramsSerializer: function (params) {
            return qs.stringify(params, { indices: false })
          }
        }).then(res => {
          this.initData = res.result
          return res
        })
      }
    }
  },
  methods: {
    onView (record) {
      this.$router.push({ path: '/loan/view?id=' + record.id })
    }
  }
}
</script>

<style scoped>
    .totalNum {
        text-align: right;
    }
    .totalNum .amount {
        margin-right: 20px;
    }
    .totalNum .font {
        font-weight: bolder;
    }

    .amount::before {
        content: '￥';
        font-size: 16px;
    }

    .amount {
        color: red;
        font-size: 22px;
    }
</style>
