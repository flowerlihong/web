<!--Created by luRX on 2019/03/29.-->
<template>
    <page-view title="借款查询">
        <a-card class="card">
            <a-form :form="form">
                <table class="fx-form">
                    <tr>
                        <th>借款人</th>
                        <td>
                            <a-form-item>
                                <user-selector v-decorator="[
                                            'factUserId',{initialValue:queryForm.factUserId}]"/>
                            </a-form-item>
                        </td>
                        <th>办理状态</th>
                        <td>
                            <a-form-item>
                                <dict-cascader dictKey="BUSINESSTRIP.STATE" style="width: 100px"
                                               v-decorator="['state']"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>拨款金额</th>
                        <td>
                            <a-form-item>
                                大于
                                <a-input-number class="input" :min="1"
                                                placeholder="请输入金额"
                                         v-decorator="['factLoanNumSt']"/>
                                小于
                                <a-input-number class="input" :min="1"
                                                placeholder="请输入金额"
                                         v-decorator="['factLoanNumEnd']"/>
                            </a-form-item>
                        </td>
                        <th>还款情况</th>
                        <td>
                            <a-form-item>
                                <dict-cascader dictKey="LOAN.REPAYMENT" style="width: 100px"
                                               v-decorator="['repayment']"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>剩余未还金额</th>
                        <td>
                            <a-form-item>
                                大于
                                <a-input-number class="input" :min="1"
                                                placeholder="请输入金额"
                                         v-decorator="['unrepaidNumSt']"/>
                                小于
                                <a-input-number class="input" :min="1"
                                                placeholder="请输入金额"
                                         v-decorator="['unrepaidNumEnd']"/>
                            </a-form-item>
                        </td>
                        <th>预计还款时间</th>
                        <td>
                            <a-form-item>
                                <a-date-picker class="date"
                                               format="YYYY-MM-DD HH:mm"
                                               v-decorator="['planendAtSt']"/>
                                至
                                <a-date-picker class="date"
                                               format="YYYY-MM-DD HH:mm"
                                               v-decorator="['planendAtEnd']"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>实际拨款时间</th>
                        <td>
                            <a-form-item>
                                <a-date-picker class="date"
                                               format="YYYY-MM-DD HH:mm"
                                               v-decorator="['factLoanAtSt']"/>
                                至
                                <a-date-picker class="date"
                                               format="YYYY-MM-DD HH:mm"
                                               v-decorator="['factLoanAtEnd']"/>
                            </a-form-item>
                        </td>
                        <th>要求拨款时间</th>
                        <td>
                            <a-form-item>
                                <a-date-picker class="date"
                                               format="YYYY-MM-DD HH:mm"
                                               v-decorator="['planstartAtSt']"/>
                                至
                                <a-date-picker class="date"
                                               format="YYYY-MM-DD HH:mm"
                                               v-decorator="['planstartAtEnd']"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" colspan="4" height="70px">
                            <a-button @click="onSearch" type="primary">查询</a-button>
                            <a-button @click="reset" style="margin-left: 20px">重置</a-button>
                        </td>
                    </tr>
                </table>
            </a-form>
            <s-table
                    :columns="columns"
                    :data="loadData"
                    :rowKey="record => record.id"
                    ref="table">
                <template slot="factUserName" slot-scope=" record">
                    {{record.extras.factUserName}}
                </template>
                <template slot="planstartAt" slot-scope=" record">
                    {{record.extras.planstartAt}}
                </template>
                <template slot="factLoanAt" slot-scope=" record">
                    {{record.extras.factLoanAt}}
                </template>
                <template slot="loanNum" slot-scope=" record">
                    <a @click="onView(record)">{{record.loanNum}} 元</a>
                </template>
                <template slot="factLoanNum" slot-scope=" record">
                    {{record.factLoanNum}} 元
                </template>
                <template slot="planEndAt" slot-scope=" record">
                    {{record.extras.planendAt}}
                </template>
                <template slot="unrepaidNum" slot-scope=" record">
                    {{record.unrepaidNum}} 元
                </template>
                <template slot="state" slot-scope=" record">
                    <a-tag color="green" v-if="record.state === '2'">办结</a-tag>
                    <a-tag color="red" v-else-if="record.state === '3'">废弃</a-tag>
                    <a-tag color="blue" v-else>申请中</a-tag>
                </template>
            </s-table>
        </a-card>
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import STable from '@/components/Table'
import qs from 'qs'
import UserSelector from '@/components/selector/UserSelector'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import DictCascader from '@/components/dict/DictCascader'

export default {
  name: 'LoanIndex',
  components: {
    AFormItem,
    PageView,
    STable,
    UserSelector,
    DictCascader
  },
  created () {
    const user = this.$ls.get('user')
    this.queryForm.factUserId = user.id
  },
  data () {
    return {
      form: this.$form.createForm(this),
      columns: [
        {
          title: '借款人',
          align: 'center',
          width: '10%',
          scopedSlots: { customRender: 'factUserName' }
        },
        {
          title: '要求拨款时间',
          align: 'center',
          scopedSlots: { customRender: 'planstartAt' }
        },
        {
          title: '实际拨款时间',
          align: 'center',
          scopedSlots: { customRender: 'factLoanAt' }
        },
        {
          title: '欲借金额',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'loanNum' }
        },
        {
          title: '实拨金额',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'factLoanNum' }
        },
        {
          title: '预计还款时间',
          align: 'center',
          scopedSlots: { customRender: 'planEndAt' }
        },
        {
          title: '剩余未还金额',
          width: '15%',
          align: 'center',
          scopedSlots: { customRender: 'unrepaidNum' }
        },
        {
          title: '办理状态',
          align: 'center',
          scopedSlots: { customRender: 'state' }
        }
      ],
      form: this.$form.createForm(this),
      queryForm: {
        factUserId: ''
      },
      state: '',
      queryParam: {},
      loadData: parameter => {
        return this.$http.get('/api/1/loan/query_loan_list.json', {
          params: Object.assign(parameter, this.queryParam),
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
      this.queryForm.factUserId = ''
      this.form.resetFields()
    },
    onSearch () {
      const that = this
      let params = { ...that.form.getFieldsValue() }
      if (params.factUserId !== '') {
        let factUserId = params.factUserId
        that.queryParam.factUserId = factUserId
      }
      if (params.state !== '') {
        let state = params.state
        that.queryParam.state = state
      }
      if (params.repayment !== '') {
        let repayment = params.repayment
        that.queryParam.repayment = repayment
      }
      if (params.factLoanNumSt !== '') {
        let factLoanNumSt = params.factLoanNumSt
        that.queryParam.factLoanNumSt = factLoanNumSt
      }
      if (params.factLoanNumEnd !== '') {
        let factLoanNumEnd = params.factLoanNumEnd
        that.queryParam.factLoanNumEnd = factLoanNumEnd
      }
      if (params.unrepaidNumSt !== '') {
        let unrepaidNumSt = params.unrepaidNumSt
        that.queryParam.unrepaidNumSt = unrepaidNumSt
      }
      if (params.unrepaidNumSt !== '') {
        let unrepaidNumEnd = params.unrepaidNumEnd
        that.queryParam.unrepaidNumEnd = unrepaidNumEnd
      }
      // 要求拨款时间
      if (params.planstartAtSt != null) {
        let planstartAtSt = params.planstartAtSt.format('YYYY-MM-DD HH:mm')
        that.queryParam.planstartAtSt = planstartAtSt
      }
      if (params.planstartAtEnd != null) {
        let planstartAtEnd = params.planstartAtEnd.format('YYYY-MM-DD HH:mm')
        that.queryParam.planstartAtEnd = planstartAtEnd
      }
      // 预计还款时间
      if (params.planendAtSt != null) {
        let planendAtSt = params.planendAtSt.format('YYYY-MM-DD HH:mm')
        that.queryParam.planendAtSt = planendAtSt
      }
      if (params.planendAtEnd != null) {
        let planendAtEnd = params.planendAtEnd.format('YYYY-MM-DD HH:mm')
        that.queryParam.planendAtEnd = planendAtEnd
      }
      // 实际拨款时间
      if (params.factLoanAtSt != null) {
        let factLoanAtSt = params.factLoanAtSt.format('YYYY-MM-DD HH:mm')
        that.queryParam.factLoanAtSt = factLoanAtSt
      }
      if (params.factLoanAtEnd != null) {
        let factLoanAtEnd = params.factLoanAtEnd.format('YYYY-MM-DD HH:mm')
        that.queryParam.factLoanAtEnd = factLoanAtEnd
      }
      that.$refs.table.refresh(true)
      this.queryParam = {}
    },
    onView (record) {
      this.$router.push({ path: '/loan/view?id=' + record.id })
    },
    onCascaderChange: function (values) {
      this.state = values
    }
  }
}
</script>

<style scoped>
    .card {
        margin-bottom: 24px;
    }
    .date {
        width: 160px;
    }
    .input {
        width: 135px;
    }
    table .ant-form-item {
          margin-bottom: 0;
    }
</style>
