<template>
    <page-view title="通用审批查询">
        <a-card>
            <a-form :form="form">
                <table class="fx-form">
                    <tr>
                        <th>流程状态</th>
                        <td>
                            <a-form-item>
                                <dict-cascader dictKey="BUSINESSTRIP.STATE" v-model="queryForm.state"/>
                            </a-form-item>
                        </td>
                        <th>编号</th>
                        <td>
                            <a-form-item>
                                <a-input style="width: 300px" v-model="queryForm.serial"></a-input>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>标题</th>
                        <td>
                            <a-form-item>
                                <a-input v-model="queryForm.title"></a-input>
                            </a-form-item>
                        </td>
                        <th>登记日期</th>
                        <td>
                            <a-form-item>
                                <a-date-picker v-model="queryForm.createdAt" />
                            </a-form-item>
                        </td>
                    </tr>
                    <tr v-show="permission">
                        <th>查询范围</th>
                        <td>
                            <a-form-item>
                            <a-select v-model="queryForm.range">
                                <a-select-option value="">不限</a-select-option>
                                <a-select-option value="1">本人经办</a-select-option>
                                <a-select-option value="2">本部门经办</a-select-option>
                                <a-select-option value="3">本机构经办</a-select-option>
                                <a-select-option value="4">本机构及下级机构经办</a-select-option>
                            </a-select>
                        </a-form-item>
                        </td>
                        <th>经办人</th>
                        <td>
                            <a-form-item>
                                <user-selector v-model="queryForm.userId" @change="onChangeUser"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>主要内容</th>
                        <td>
                            <a-form-item>
                                <a-input v-model="queryForm.content"></a-input>
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
                <template slot="serial" slot-scope="record">
                   {{record.serial}}
                </template>
                <template slot="urgency" slot-scope="record">
                    <div v-if="record.urgency === '1'">平件</div>
                    <div v-else-if="record.urgency === '2'">急</div>
                    <div v-else-if="record.urgency === '3'">特急</div>
                    <div v-else>特提</div>
                </template>
                <template slot="userName" slot-scope="record">
                    {{record.extras.userName}}
                </template>
                <template slot="createdAt" slot-scope="record">
                    {{record.extras.creatAt}}
                </template>
                <template slot="titles" slot-scope="record">
                    <div v-if="record.title.length > 10">
                        <a @click="onView(record)">{{record.title.substring(0,30)}}...</a>
                    </div>
                    <div v-else>
                        <a @click="onView(record)">{{record.title}}</a>
                    </div>
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
  name: 'ApplyInfoIndex',
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
          title: '编号',
          width: '200px',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '标题',
          width: '500px',
          scopedSlots: { customRender: 'titles' }
        },
        {
          title: '紧急程度',
          scopedSlots: { customRender: 'urgency' }
        },
        {
          title: '申请人',
          scopedSlots: { customRender: 'userName' }
        },
        {
          title: '登记日期',
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
        serial: '',
        title: '',
        createdAt: null,
        content: '',
        state: '',
        check: '',
        range: '',
        userId: ''
      },
      queryParam: {
      },
      loadData: parameter => {
        return this.$http.get('/api/1/applyinfo/query_apply_info_list.json', { params: Object.assign(parameter, this.queryParam),
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
      this.modalContent = record.title
      this.visible = true
    },
    handleOk (e) {
      console.log(e)
      this.visible = false
    },
    reset () {
      this.queryForm = {}
      this.queryParam = {}
      this.queryForm.userId = ''
      this.onSearch()
    },
    hasPermission () {
      const that = this
      that.$http.get('/api/1/vacation_report/get_permission.json').then(function (resp) {
        that.permission = resp.hasPermission
      })
    },
    onCascaderChange: function (values) {
      this.queryForm.state = values
    },
    onChangeUser (selectedIds) {
      this.queryForm.userId = selectedIds
    },
    onSearch () {
      this.queryParam = { ...this.queryForm }
      // 日期组件返回的是 moment 对象，需要转换为字符串时间
      if (this.queryParam.createdAt) {
        this.queryParam.createdAt = this.queryParam.createdAt.format('YYYY-MM-DD')
      }
      this.$refs.table.refresh()
    },
    onView (record) {
      // this.$router.push({ path: '/applyinfo/view?id=' + record.id })
      let newpage = this.$router.resolve({
        path: '/applyinfo/view',
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
        width: 110px !important;
    }

    table .ant-form-item {
        margin-bottom: 0;
    }
</style>
