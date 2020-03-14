<template>
    <page-view title="支付申请查询">
        <template slot="action">
            <a-button-group>
                <a-button @click="exportExcel"><img src="/img/xls.gif" align="absBottom">导出excel</a-button>
            </a-button-group>
        </template>
        <a-card>
            <a-form :form="form">
                <table class="fx-form">
                    <tr>
                        <th>流程状态</th>
                        <td>
                            <a-form-item>
                                <dict-cascader style="width: 80%" dictKey="BUSINESSTRIP.STATE" v-model="queryForm.state"/>
                            </a-form-item>
                        </td>
                        <th>申请时间</th>
                        <td>
                            <a-form-item>
                                <a-date-picker style="width: 22%" v-model="queryForm.createdAtSt" />
                                至 <a-date-picker style="width: 22%" v-model="queryForm.createdAtEnd" />
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>项目名称</th>
                        <td>
                            <a-form-item>
                                <a-input style="width: 80%" v-model="queryForm.projectName"></a-input>
                            </a-form-item>
                        </td>
                        <th>用途</th>
                        <td>
                            <a-form-item>
                                <a-input style="width: 47%" v-model="queryForm.purpose"></a-input>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>付款金额</th>
                        <td>
                            <a-form-item>
                                <a-input-number :min="0" v-model="queryForm.minPrice" />
                                至 <a-input-number :min="0" v-model="queryForm.maxPrice" />
                            </a-form-item>
                        </td>
                        <th>申请人</th>
                        <td>
                            <a-form-item>
                                <user-selector style="width: 50%" v-model="queryForm.userId" @change="onChangeUser"/>
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
                <template slot="userName" slot-scope="record">
                    <a @click="onView(record)">{{record.extras.userName}}</a>
                </template>
                <template slot="receiveUnit" slot-scope="record">
                    <div v-if="record.receiveUnitName.length > 20">
                        {{record.receiveUnitName.substring(0,20)}}...
                    </div>
                    <div v-else>
                        {{record.receiveUnitName}}
                    </div>
                </template>
                <template slot="projectName" slot-scope="record">
                    <div v-if="record.projectName.length > 20">
                        {{record.projectName.substring(0,20)}}...
                    </div>
                    <div v-else>
                        {{record.projectName}}
                    </div>
                </template>
                <template slot="purpose" slot-scope="record">
                    <div v-if="record.purpose.length > 20">
                        {{record.purpose.substring(0,20)}}...
                    </div>
                    <div v-else>
                        {{record.purpose}}
                    </div>
                </template>
                <!--<template slot="payWay" slot-scope="record">-->
                    <!--{{record.extras.payWay}}-->
                <!--</template>-->
                <template slot="price" slot-scope="record">
                    {{record.price}}元
                </template>
                <template slot="createdAt" slot-scope="record">
                    {{record.extras.createdAt}}
                </template>
                <template slot="state" slot-scope="record">
                    <a-tag v-if="record.state === '2'" color="green">已办结</a-tag>
                    <a-tag v-else-if="record.state === '3'" color="red">已废弃</a-tag>
                    <a-tag v-else color="blue">办理中</a-tag>
                </template>
            </s-table>
        </a-card>
    </page-view>
</template>

<script>
import UserSelector from '@/components/selector/UserSelector'
import DictCascader from '@/components/dict/DictCascader'
import { PageView } from '@/layouts'
import STable from '@/components/Table'
import qs from 'qs'
export default {
  name: 'PayApplyIndex',
  components: {
    UserSelector,
    DictCascader,
    PageView,
    STable
  },
  created () {
    this.hasPermission()
  },
  data () {
    return {
      newTabIndex: 0,
      visible: false,
      modalContent: '',
      columns: [
        {
          title: '申请人',
          scopedSlots: { customRender: 'userName' }
        },
        {
          title: '收款单位',
          scopedSlots: { customRender: 'receiveUnit' }
        },
        {
          title: '项目名称',
          scopedSlots: { customRender: 'projectName' }
        },
        {
          title: '用途',
          scopedSlots: { customRender: 'purpose' }
        },
        // {
        //   title: '支付方式',
        //   scopedSlots: { customRender: 'payWay' }
        // },
        {
          title: '付款金额',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: '申请时间',
          scopedSlots: { customRender: 'createdAt' }
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'state' }
        }
      ],
      permission: false,
      loading: false,
      form: this.$form.createForm(this),
      queryForm: {
        projectName: '',
        purpose: '',
        createdAtSt: null,
        createdAtEnd: null,
        state: '',
        userId: ''
      },
      queryParam: {
      },
      loadData: parameter => {
        return this.$http.get('/api/1/pay_apply/query_pay_apply_list.json', { params: Object.assign(parameter, this.queryParam),
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
      this.queryForm = {}
      this.queryParam = {}
      this.queryForm.userId = ''
      this.onSearch()
    },
    hasPermission () {
      const that = this
      that.$http.get('/api/1/pay_apply/get_permission.json').then(function (resp) {
        that.permission = resp.hasPermission
      })
    },
    onCascaderChange: function (values) {
      this.queryForm.state = values
    },
    onChangeUser (selectedIds) {
      this.queryForm.userId = selectedIds
    },
    exportExcel () {
      // window.open('/api/1/pay_apply/export_excel.json')
      const url = '/api/1/pay_apply/export_excel.json'
      this.$http.post(url, qs.stringify(this.queryParam), {
        responseType: 'blob'
      }).then(res => {
        let blob = new Blob([res], {
          type: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        if (window.navigator.msSaveOrOpenBlob) {
          let fileName = '支付申请.xlsx'
          navigator.msSaveBlob(blob, fileName)
        } else {
          let elink = document.createElement('a')
          elink.download = '支付申请.xlsx'
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
      this.queryParam = { ...this.queryForm }
      // 日期组件返回的是 moment 对象，需要转换为字符串时间
      if (this.queryParam.createdAtSt) {
        this.queryParam.createdAtSt = this.queryParam.createdAtSt.format('YYYY-MM-DD')
      }
      if (this.queryParam.createdAtEnd) {
        let time = this.queryParam.createdAtEnd.format('YYYY-MM-DD')
        this.queryParam.createdAtEnd = time + ' 23:59:59'
      }
      this.$refs.table.refresh()
    },
    onView (record) {
      this.$router.push({ path: '/pay/apply/view?id=' + record.id })
      // let newpage = this.$router.resolve({
      //   path: '/pay/apply/view',
      //   query: {
      //     id: record.id
      //   }
      // })
      // window.open(newpage.href, '_blank')
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
