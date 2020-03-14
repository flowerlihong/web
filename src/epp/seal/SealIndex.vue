<template>
    <page-view title="盖章管理">
        <a-card>
            <a-form :form="form">
                <table class="fx-form">
                    <tr>
                        <th>流程状态</th>
                        <td><dict-cascader dictKey="BUSINESSTRIP.STATE" style="width:174px"
                                           v-model="queryForm.state"/></td>
                        <th>登记时间</th>
                        <td>
                            <a-form-item>
                                <a-date-picker v-model="queryForm.startTime" />
                                至 <a-date-picker v-model="queryForm.endTime" />
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>盖章事宜</th>
                        <td>
                            <a-form-item>
                                <a-input style="width: 320px"
                                         v-model="queryForm.title"></a-input>
                            </a-form-item>
                        </td>
                        <th v-show="permission">登记人员</th>
                        <td v-show="permission">
                            <a-form-item>
                                <user-selector v-model="queryForm.userId"  @change="onChangeUser"/>
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
                <template slot="titles" slot-scope=" record">
                    <div v-if="record.title.length > 30">
                        <a @click="onView(record)">{{record.title.substring(0,30)}}...</a>
                    </div>
                    <div v-else>
                        <a @click="onView(record)">{{record.title}}</a>
                    </div>
                </template>
                <template slot="userName" slot-scope=" record">
                   {{record.extras.userName}}
                </template>
                <template slot="createdTime" slot-scope=" record">
                    {{record.extras.creatAt}}
                </template>
                <template slot="state" slot-scope=" record">
                    <a-tag v-if="record.state === '2'" color="green">已办结</a-tag>
                    <a-tag v-else-if="record.state === '3'" color="red">已废弃</a-tag>
                    <a-tag v-else color="blue">办理中</a-tag>
                </template>
            </s-table>
            <div>
                <a-modal
                        title="标题"
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
import UserSelector from '@/components/selector/UserSelector'
import DictCascader from '@/components/dict/DictCascader'
export default {
  name: 'SealIndex',
  components: {
    PageView,
    STable,
    UserSelector,
    DictCascader
  },
  created () {
    this.hasPermission()
  },
  data () {
    return {
      visible: false,
      permission: false,
      modalContent: '',
      columns: [
        {
          title: '盖章事宜',
          width: '500px',
          scopedSlots: { customRender: 'titles' }
        },
        {
          title: '登记人',
          scopedSlots: { customRender: 'userName' }
        },
        {
          title: '登记时间',
          scopedSlots: { customRender: 'createdTime' }
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'state' }
        }
      ],
      form: this.$form.createForm(this),
      queryForm: {
        title: '',
        userId: '',
        state: '',
        startTime: null,
        endTime: null
      },
      queryParam: {
      },
      loadData: parameter => {
        return this.$http.get('/api/1/seal/query_seal_list.json', { params: Object.assign(parameter, this.queryParam),
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
    hasPermission () {
      const that = this
      that.$http.get('/api/1/vacation_report/get_permission.json').then(function (resp) {
        that.permission = resp.hasPermission
      })
    },
    showModal (record) {
      this.modalContent = record.title
      this.visible = true
    },
    handleOk (e) {
      console.log(e)
      this.visible = false
    },
    reset () {
      this.queryParam = {}
      this.queryForm = {}
      this.queryForm.userId = ''
      this.onSearch()
    },
    onChangeUser (selectedIds) {
      this.queryForm.userId = selectedIds
    },
    onSearch () {
      this.queryParam = { ...this.queryForm }
      // 申请时间
      if (this.queryParam.startTime) {
        this.queryParam.startTime = this.queryParam.startTime.format('YYYY-MM-DD')
      }
      if (this.queryParam.endTime) {
        this.queryParam.endTime = this.queryParam.endTime.format('YYYY-MM-DD')
      }
      this.$refs.table.refresh()
    },
    onView (record) {
      // this.$router.push({ path: '/seal/view?id=' + record.id })
      let newpage = this.$router.resolve({
        path: '/seal/view',
        query: {
          id: record.id
        }
      })
      window.open(newpage.href, '_blank')
    }
  }
}
</script>

<style scoped>
    .card {
        margin-bottom: 24px;
    }

    th {
        width: 60px !important;
    }

    table .ant-form-item {
        margin-bottom: 0;
    }
</style>
