<!--Created by luRX on 2019/03/29.-->
<template>
    <page-view title="报销查询">
        <template slot="action">
            <a-button-group>
                <a-button @click="exportExcel"><img src="/img/xls.gif" align="absBottom">导出excel</a-button>
            </a-button-group>
        </template>
        <a-card class="card">
            <a-form >
                <table class="fx-form">
                    <tr>
                        <th>审批状态</th>
                        <td>
                            <a-form-item>
                              <a-select style="width: 150px" v-model="queryForm.state">
                                    <a-select-option value="">不限</a-select-option>
                                    <a-select-option value="P">审批通过</a-select-option>
                                    <a-select-option value="F">审批失败</a-select-option>
                               </a-select>
                            </a-form-item>
                        </td>
                        <th>科目名称</th>
                        <td>
                            <a-form-item>
                                  <dict-cascader ref="category" dictKey="CLAIM.CATEGORY"
                                   @change="(value) => onCateChange(value)"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>报销人</th>
                        <td>
                            <a-form-item>
                                 <user-selector @change="onBurseChange" v-model="queryForm.userId"/>
                            </a-form-item>
                        </td>
                        <th>填表人</th>
                        <td>
                            <a-form-item>
                                <user-selector @change="onPreparedChange" v-model="queryForm.submitUserId"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>报销部门</th>
                        <td>
                            <a-form-item>
                                <dept-selector @change="onDeptChange" v-model="queryForm.deptId"/>
                            </a-form-item>
                        </td>
                        <th>填表日期</th>
                        <td>
                           <a-form-item>
                                <a-range-picker v-model="createdAt" />
                           </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>报销金额范围</th>
                        <td>
                            <a-form-item>
                                大于
                                 <a-input-number :min="1" v-model="queryForm.orange1" style="width:200px"/>
                                小于
                                  <a-input-number :min="1" v-model="queryForm.orange2"  style="width:200px"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" colspan="4" style="padding:14px 0">
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
                    <a @click="onView(record)">{{record.sn}}</a>
                </template>
                <template slot="planstartAt" slot-scope=" record">
                    {{record.extras.createdAt}}
                </template>
                <template slot="factLoanAt" slot-scope=" record">
                        ￥{{record.extras.totalAmount}} 元
                </template>
                <template slot="loanNum" slot-scope=" record">
                    {{record.extras.deptName}}
                </template>
                <template slot="factLoanNum" slot-scope=" record">
                    {{record.extras.userName}}
                </template>
                <template slot="state" slot-scope="record">
                    <a-tag v-if="record.extras.state === 'C'" color="green">{{record.extras.stateDesc}}</a-tag>
                    <a-tag v-else color="blue">{{record.extras.stateDesc}}</a-tag>
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
import DeptSelector from '@/components/selector/DeptSelector'
import DictCascader from '@/components/dict/DictCascader'

export default {
  components: {
    PageView,
    STable,
    UserSelector,
    DictCascader,
    DeptSelector
  },
  data () {
    return {
      columns: [
        {
          title: '报销单编号',
          align: 'left',
          scopedSlots: { customRender: 'factUserName' }
        },
        {
          title: '填表日期',
          align: 'left',
          scopedSlots: { customRender: 'planstartAt' }
        },
        {
          title: '报销金额',
          align: 'left',
          scopedSlots: { customRender: 'factLoanAt' }
        },
        {
          title: '报销部门',
          align: 'left',
          scopedSlots: { customRender: 'loanNum' }
        },
        {
          title: '报销人',
          align: 'left',
          scopedSlots: { customRender: 'factLoanNum' }
        },
        {
          title: '办理情况',
          align: 'left',
          scopedSlots: { customRender: 'state' }
        }
      ],
      claimItems: [
        {
          cateIds: '',
          cateId: ''
        }
      ],
      queryForm: {
        state: '',
        userId: '',
        submitUserId: '',
        deptId: '',
        orange1: '',
        orange2: '',
        startDate: '',
        endDate: '',
        cateIds: '',
        cateId: ''
      },
      createdAt: null,
      queryParam: {},
      loadData: parameter => {
        return this.$http.get('/api/1/claim/query_claim_list.json', {
          params: Object.assign(parameter, this.queryParam),
          paramsSerializer: function (params) {
            return qs.stringify(params, { indices: false, allowDots: true })
          }
        }).then(res => {
          return res
        })
      }
    }
  },
  methods: {
    reset () {
      this.queryForm.state = ''
      this.queryForm.userId = ''
      this.queryForm.deptId = ''
      this.queryForm.submitUserId = ''
      this.queryForm.orange1 = ''
      this.queryForm.orange2 = ''
      this.createdAt = null
      this.queryForm.startDate = ''
      this.queryForm.endDate = ''
      this.$refs.category.reset()
    },
    onCateChange (value) {
      const tmp = value.split(',')
      this.queryForm.cateIds = value
      this.queryForm.cateId = tmp[tmp.length - 1]
    },
    onPreparedChange (selectedIds) {
      this.queryForm.submitUserId = selectedIds
    },
    onBurseChange (selectedIds) {
      this.queryForm.userId = selectedIds
    },
    onDeptChange (selectedIds) {
      this.queryForm.deptId = selectedIds
    },
    exportExcel () {
      const url = '/api/1/claim/export_excel_data.json'
      this.$http.post(url, qs.stringify(this.queryParam), {
        responseType: 'blob'
      }).then(res => {
        let blob = new Blob([res], {
          type: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        if (window.navigator.msSaveOrOpenBlob) {
          let fileName = '报销申请.xlsx'
          navigator.msSaveBlob(blob, fileName)
        } else {
          let elink = document.createElement('a')
          elink.download = '报销申请.xlsx'
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
      if (this.createdAt != null && this.createdAt.length === 2) {
        let start = this.createdAt[0].format('YYYY-MM-DD')
        let end = this.createdAt[1].format('YYYY-MM-DD')
        this.queryForm.startDate = start
        this.queryForm.endDate = end
      } else {
        this.queryForm.startDate = ''
        this.queryForm.endDate = ''
      }
      if (this.queryForm.orange1 > this.queryForm.orange2) {
        this.$message.error('请输入正确的报销金额范围')
        return
      }
      this.queryParam = { ...this.queryForm }
      this.$refs.table.refresh()
    },
    onView (record) {
      this.$router.push({ path: '/claim/view?id=' + record.id })
    }
  }
}
</script>

<style scoped>
    .card {
        margin-bottom: 24px;
    }
    .input {
        width: 34%;
    }
</style>
