<template>
    <page-view title="编辑报销申请">
        <a-card class="card">
            <a-form :form="form">
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
                                    {initialValue:claim.projectName, rules: [{ required: true, message: '请输入项目名称' }]}
                                ]" placeholder="请输入产生报销费用的完整项目名称" :autosize="{ minRows: 2, maxRows: 6 }"/>
                            </a-form-item>
                        </td>
                        <th>备注</th>
                        <td>
                            <a-form-item>
                                <a-textarea style="width:300px;" v-decorator="[
                                    'remark',
                                    {initialValue:claim.remark}
                                ]" placeholder="备注" :autosize="{ minRows: 2, maxRows: 6 }"/>
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
        <a-card style="margin-bottom:60px">
            <a-table
                    :columns="columns"
                    :dataSource="claimItems"
                    :rowKey="record => record.id"
                    :pagination="false">
                <template slot="content" slot-scope="text, record, index">
                    <a-input key="content" style="margin: -5px 0" placeholder="用途" :value="record.content"
                             @change="e => onEditClaimItem(e.target.value, record.id, 'content')"/>
                </template>
                <template slot="cateIds" slot-scope="text, record, index">
                    <dict-cascader dictKey="CLAIM.CATEGORY" :value="record.cateIds"
                                   @change="(value, selectedOptions) => onCateChange(record.id, value, selectedOptions)" />
                </template>
                <template slot="quantity" slot-scope="text, record, index">
                    <a-input-number key="quantity" style="margin: -5px 0" placeholder="张数" :min="1" :value="record.quantity"
                             @change="value => onEditClaimItem(value, record.id, 'quantity')"/>
                </template>
                <template slot="amount" slot-scope="text, record, index">
                    <a-input-number key="amount" style="margin: -5px 0" placeholder="金额" :min="1" :value="record.amount"
                             @change="value => onEditClaimItem(value, record.id, 'amount')"/>
                </template>
                <template slot="operation" slot-scope="text, record, index">
                  <a-popconfirm title="是否要删除此行？" @confirm="onRemoveClaimItem(record.id)">
                    <a>删除</a>
                  </a-popconfirm>
                </template>
            </a-table>
            <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="onAddClaimItem">新增报销项目</a-button>
        </a-card>

        <footer-tool-bar>
            <a-button type="primary" @click="validate" :loading="loading">提交</a-button>
        </footer-tool-bar>
    </page-view>
</template>

<script>
import qs from 'qs'
import moment from 'moment'
import { PageView } from '@/layouts'
import FooterToolBar from '@/components/FooterToolbar'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import UserSelector from '@/components/selector/UserSelector'
import DeptSelector from '@/components/selector/DeptSelector'
import DictCascader from '@/components/dict/DictCascader'
import UploadSelector from '@/components/selector/UploadSelector'
const numeral = require('numeral')

export default {
  name: 'ClaimEdit',
  components: {
    AFormItem,
    PageView,
    FooterToolBar,
    DictCascader,
    UserSelector,
    DeptSelector,
    UploadSelector
  },
  created () {
    this.loadData()
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
        id: this.$route.query.id
      },
      claimItems: []
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
    loadData () {
      const that = this
      that.$http.get('/api/1/claim/get_claim.json?id=' + this.claim.id).then(function (response) {
        let result = response.result
        result.createdAt = moment(result.createdAt)
        that.claim = result
        that.claimItems = result.items
      })
    },
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
        data.createdAt = data.createdAt.format('YYYY-MM-DD')
        data.items = this.claimItems
        const that = this
        that.loading = true
        that.$http.post('/api/1/claim/edit.json', qs.stringify(data, { allowDots: true })).then(function () {
          that.loading = false
          that.$message.success('编辑报销单成功')
          that.$router.push({ path: '/claim/view?id=' + that.claim.id })
        })
      })
    }
  }
}
</script>

<style lang="less">
    .card {
        margin-bottom: 24px;
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
