<template>
    <div class="page-header-index-wide">
        <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
            <div class="salesCard">
                <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
                    <div class="extra-wrapper" slot="tabBarExtraContent">
                        <div class="extra-item">
                            <a @click="onFastChangeDateRange('prevMonth')">上月</a>
                            <a @click="onFastChangeDateRange('currentMonth')">本月</a>
                            <a @click="onFastChangeDateRange('prevQuarter')">上季</a>
                            <a @click="onFastChangeDateRange('currentQuarter')">本季</a>
                            <a @click="onFastChangeDateRange('currentYear')">本年</a>
                        </div>
                        <a-range-picker @change="onChangeDateRange"/>
                    </div>
                    <a-tab-pane loading="true" tab="按人员" key="1">
                        <a-row>
                            <a-col :xl="22" :lg="22" :md="22" :sm="22" :xs="22">
                                <ClaimStatUser title="员工报销额排行" :dateRange="dateRange" />
                            </a-col>
                        </a-row>
                    </a-tab-pane>
                    <a-tab-pane tab="按部门" key="2">
                        <a-row>
                            <a-col :xl="22" :lg="22" :md="22" :sm="22" :xs="22">
                                <ClaimStatDept title="部门报销额排行" :dateRange="dateRange" />
                            </a-col>
                        </a-row>
                    </a-tab-pane>
                    <a-tab-pane tab="按科目" key="3">
                        <a-row>
                            <a-col :xl="22" :lg="22" :md="22" :sm="22" :xs="22">
                                <ClaimStatCate title="科目报销额排行" :dateRange="dateRange" />
                            </a-col>
                        </a-row>
                    </a-tab-pane>
                </a-tabs>
            </div>
        </a-card>
    </div>
</template>

<script>
import moment from 'moment'
import ClaimStatUser from './ClaimStatUser'
import ClaimStatDept from './ClaimStatDept'
import ClaimStatCate from './ClaimStatCate'
import RankList from '@/components/Charts/RankList'

export default {
  name: 'ClaimStat',
  components: {
    ClaimStatUser,
    ClaimStatDept,
    ClaimStatCate,
    RankList
  },
  created () {
    this.loadData()
  },
  data () {
    return {
      loading: false,
      dateRange: {
        startDate: null,
        endDate: null
      }
    }
  },
  methods: {
    moment,
    loadData () {
    },
    onFastChangeDateRange (type) {
      let start = moment()
      let end = moment()

      if (type === 'prevMonth') {
        start = moment().startOf('month').subtract(1, 'month')
        end = moment().endOf('month').subtract(1, 'month').endOf('month')
      } else if (type === 'currentMonth') {
        start = moment().startOf('month')
        end = moment().endOf('month').endOf('month')
      } else if (type === 'prevQuarter') {
        start = moment().quarter(moment().quarter() - 1).startOf('quarter')
        end = moment().quarter(moment().quarter() - 1).endOf('quarter')
      } else if (type === 'currentQuarter') {
        start = moment().quarter(moment().quarter()).startOf('quarter')
        end = moment().quarter(moment().quarter()).endOf('quarter')
      } else if (type === 'currentYear') {
        start = moment().startOf('year')
        end = moment().endOf('year').endOf('year')
      }

      this.dateRange = { startDate: start.format('YYYY-MM-DD'), endDate: end.format('YYYY-MM-DD') }
    },
    onChangeDateRange (dates, dateStrings) {
      if (dateStrings.length !== 2) {
        return
      }
      this.dateRange = { startDate: dateStrings[0], endDate: dateStrings[1] }
    }
  }
}
</script>

<style lang="less" scoped>
    .extra-wrapper {
        line-height: 55px;
        padding-right: 24px;

        .extra-item {
            display: inline-block;
            margin-right: 24px;

            a {
                margin-left: 24px;
            }
        }
    }
</style>
