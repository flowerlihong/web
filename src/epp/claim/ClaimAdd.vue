<template>
    <page-view title="报销申请">
        <a-card class="card">
            <a-form :form="form">

                <a-form-item>
                    <process-selector v-decorator="[
                                        'procId',
                                        {rules: [{ required: true, message: '请选择启动流程' }]}
                                    ]"/>
                </a-form-item>

                <table class="fx-form">
                    <tr>
                        <th class="not-null">报销部门</th>
                        <td>
                            <a-form-item>
                                <dept-selector v-decorator="[
                                    'deptId',
                                    {initialValue:claim.deptId, rules: [{ required: true, message: '请选择报销部门' }]}
                                ]"/>
                            </a-form-item>
                        </td>
                        <th class="not-null">填表日期</th>
                        <td>
                            <a-form-item>
                                <a-date-picker v-decorator="[
                                    'createdAt',
                                    {initialValue:claim.createdAt, rules: [{ required: true, message: '请选择填表日期' }]}
                                ]"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th class="not-null">报销人</th>
                        <td>
                            <a-form-item>
                                <user-selector v-decorator="[
                                    'userId',
                                    {initialValue:claim.userId, rules: [{ required: true, message: '请选择报销人' }]}
                                ]" />
                            </a-form-item>
                        </td>
                        <th class="not-null">填表人</th>
                        <td>
                            <a-form-item>
                                <user-selector v-decorator="[
                                    'submitUserId',
                                    {initialValue:claim.submitUserId, rules: [{ required: true, message: '请选择填表人' }]}
                                ]"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th class="not-null">项目名称</th>
                        <td>
                            <a-form-item>
                                <a-textarea style="width:300px;" v-decorator="[
                                    'projectName',
                                    {rules: [{ required: true, message: '请输入项目名称' }]}
                                ]" placeholder="请输入产生报销费用的完整项目名称" />
                            </a-form-item>
                        </td>
                        <th>备注</th>
                        <td>
                            <a-form-item>
                                <a-textarea style="width:300px;" v-decorator="[
                                    'remark',
                                    {rules: [{ required: false, message: '请输入备注' }]}
                                ]" placeholder="备注" />
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th class="no-form-item">合计</th>
                        <td class="amount">
                            {{ totalAmount }}
                        </td>
                        <th>附件</th>
                        <td>
                            <upload-selector :referId='claim.id' configKey='SEAL.FILE' />
                        </td>
                    </tr>
                </table>
            </a-form>
        </a-card>

        <!-- table -->
        <a-card title="报销项目" style="margin-bottom:60px">
            <a-table
                    :columns="columns"
                    :dataSource="claimItems"
                    :rowKey="record => record.id"
                    :pagination="false">
                <template slot="content" slot-scope="text, record, index">
                    <a-input key="content" style="margin: -5px 0" placeholder="用途"
                             @change="e => onEditClaimItem(e.target.value, record.id, 'content')"/>
                </template>
                <template slot="cateIds" slot-scope="text, record, index">
                    <dict-cascader dictKey="CLAIM.CATEGORY"
                                   @change="(value) => onCateChange(record.id, value)"/>
                </template>
                <template slot="quantity" slot-scope="text, record, index">
                    <a-input-number key="quantity" style="margin: -5px 0;width: 100%" placeholder="张数" :min="1"
                                    @change="value => onEditClaimItem(value, record.id, 'quantity')"/>
                </template>
                <template slot="amount" slot-scope="text, record, index">
                    <a-input-number style="margin: -5px 0;width: 100%" placeholder="金额" :min="1"
                                    @change="value => onEditClaimItem(value, record.id, 'amount')"/>
                </template>
                <template slot="operation" slot-scope="text, record, index">
                    <a-popconfirm title="是否要删除此行？" @confirm="onRemoveClaimItem(record.id)">
                        <a>删除</a>
                    </a-popconfirm>
                </template>
            </a-table>
            <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus"
                      @click="onAddClaimItem">新增报销项目
            </a-button>
        </a-card>

        <footer-tool-bar>
            <a-button type="primary" @click="validate" :loading="loading">提交</a-button>
        </footer-tool-bar>
    </page-view>
</template>

<script>
import qs from 'qs'
import { PageView } from '@/layouts'
import FooterToolBar from '@/components/FooterToolbar'
import DictCascader from '@/components/dict/DictCascader'
import UserSelector from '@/components/selector/UserSelector'
import DeptSelector from '@/components/selector/DeptSelector'
import moment from 'moment'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import ProcessSelector from '@/components/workflow/ProcessSelector'
import UploadSelector from '@/components/selector/UploadSelector'
const numeral = require('numeral')
const uuidv4 = require('uuid/v4')

export default {
  name: 'ClaimAdd',
  components: {
    AFormItem,
    PageView,
    FooterToolBar,
    DictCascader,
    UserSelector,
    DeptSelector,
    ProcessSelector,
    UploadSelector
  },
  created () {
    const user = this.$ls.get('user')
    this.claim.caseTypeId = this.$route.query.caseTypeId
    this.claim.deptId = user.deptId
    this.claim.userId = user.id
    this.claim.submitUserId = user.id
    this.claim.createdAt = moment()
  },
  data () {
    return {
      loading: false,
      globalClaimItemId: 0,
      form: this.$form.createForm(this),
      columns: [
        {
          title: '用途',
          scopedSlots: { customRender: 'content' }
        },
        {
          title: '科目',
          width: '300px',
          scopedSlots: { customRender: 'cateIds' }
        },
        {
          title: '单据张数',
          scopedSlots: { customRender: 'quantity' },
          width: '150px'
        },
        {
          title: '金额（元）',
          scopedSlots: { customRender: 'amount' },
          width: '150px'
        },
        {
          title: '操作',
          width: '150px',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      claim: {
        id: uuidv4()
      },
      claimItems: [
        {
          id: 0,
          content: '',
          cateIds: '',
          cateId: '',
          quantity: 0,
          amount: 0
        }
      ]
    }
  },
  computed: {
    totalAmount: function () {
      let total = 0
      this.claimItems.forEach(function (item) {
        total += item.amount
      })
      return numeral(total).format('0,0.[00]')
    }
  },
  methods: {
    onAddClaimItem () {
      this.claimItems.push({
        id: ++this.globalClaimItemId,
        content: '',
        cateIds: '',
        cateId: '',
        quantity: 0,
        amount: 0
      })
    },
    onRemoveClaimItem (id) {
      const newData = this.claimItems.filter(item => item.id !== id)
      this.claimItems = newData
    },
    onEditClaimItem (value, id, column) {
      const newData = [...this.claimItems]
      const target = newData.filter(item => id === item.id)[0]
      if (target) {
        target[column] = value
        this.claimItems = newData
      }
    },
    onCateChange (id, value, selectedOptions) {
      const newData = [...this.claimItems]
      const target = newData.filter(item => id === item.id)[0]
      if (target) {
        const tmp = value.split(',')
        target['cateIds'] = value
        target['cateId'] = tmp[tmp.length - 1]
        this.claimItems = newData
      }
    },
    validate () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }

        let result = this.claimItems.every(function (item) {
          if (item.content === '' || item.cateIds === '' ||
              typeof item.quantity === 'undefined' || item.quantity === 0 ||
              typeof item.amount === 'undefined' || item.amount === 0) {
            return false
          }
          return true
        })

        if (!result) {
          this.$message.error('用途、科目、单据张数、金额必须填写')
          return
        }

        let data = { ...this.form.getFieldsValue() }
        data.id = this.claim.id
        data.caseTypeId = this.claim.caseTypeId
        data.createdAt = data.createdAt.format('YYYY-MM-DD')
        data.items = this.claimItems
        const that = this
        that.loading = true
        that.$http.post('/api/1/claim/add.json', qs.stringify(data, { allowDots: true })).then(function (resp) {
          that.loading = false
          if (resp.code !== 200) {
            return
          }
          that.$message.success('提交报销单成功')
          that.$router.push({ path: '/claim/view?id=' + resp.caseId })
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
    .card {
        margin-bottom: 14px;
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
