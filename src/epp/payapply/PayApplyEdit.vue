<template>
    <page-view title="支付申请">
        <a-card class="card">
            <a-form :form="form">
                <table class="fx-form">
                    <tr>
                        <th class="not-null">收款单位</th>
                        <td>
                            <a-form-item>
                                <a-input placeholder="请输入收款单位名称" v-decorator="[
                                    'receiveUnitName',
                                    {initialValue: initData.receiveUnitName, rules: [{ required: true, message: '请输入收款单位名称' }]}
                                ]"/>
                            </a-form-item>
                        </td>
                        <th class="not-null">单位地址</th>
                        <td>
                            <a-form-item>
                                <a-input placeholder="请输入收款单位地址" v-decorator="[
                                    'receiveUnitAddress',
                                    {initialValue: initData.receiveUnitAddress, rules: [{ required: true, message: '请输入收款单位地址' }]}
                                ]"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th class="not-null">开户银行</th>
                        <td>
                            <a-form-item>
                                <a-input placeholder="请输入收款单位开户银行及支行名称" v-decorator="[
                                    'accountName',
                                    {initialValue: initData.accountName, rules: [{ required: true, message: '请输入收款单位开户银行及支行名称' }]}
                                ]"/>
                            </a-form-item>
                        </td>
                        <th class="not-null">收款账号</th>
                        <td>
                            <a-form-item>
                                <a-input v-decorator="[
                                    'account',
                                    {initialValue: initData.account, rules: [{ required: true, message: '请输入账号' }]}
                                ]"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th class="not-null">省份</th>
                        <td>
                            <a-form-item>
                                <a-input placeholder="请输入收款单位省份" v-decorator="[
                                    'province',
                                    {initialValue: initData.province, rules: [{ required: true, message: '请输入收款单位省份' }]}
                                ]"/>
                            </a-form-item>
                        </td>
                        <th class="not-null">地市</th>
                        <td>
                            <a-form-item>
                                <a-input placeholder="请输入收款单位地市" v-decorator="[
                                    'city',
                                    {initialValue: initData.city, rules: [{ required: true, message: '请输入收款单位地市' }]}
                                ]"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th class="not-null">项目名称</th>
                        <td>
                            <a-form-item>
                                <a-input placeholder="必须填写与收款单位签订的合同项目名称" v-decorator="[
                                    'projectName',
                                    {initialValue: initData.projectName, rules: [{ required: true, message: '请输入项目名称' }]}
                                ]"/>
                            </a-form-item>
                        </td>
                        <th class="not-null">用途</th>
                        <td>
                            <a-form-item>
                                <a-input v-decorator="[
                                    'purpose',
                                    {initialValue: initData.purpose, rules: [{ required: true, message: '请输入用途' }]}
                                ]"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th class="not-null">付款金额</th>
                        <td class="amount">
                            {{ totalAmount }}
                            <a-input-number v-show="false" :min="0" v-decorator="[
                                    'price',
                                    {initialValue: totalAmount, rules: [{ required: false }]}
                                ]"/>
                        </td>
                        <th class="not-null">已付金额</th>
                        <td>
                            <a-form-item>
                                <a-input-number :min="0" v-decorator="[
                                    'payMoney',
                                    {initialValue: initData.payMoney,rules: [{ required: true, message: '请输入已付金额' }]}
                                ]"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th class="not-null">付款方式</th>
                        <td>
                            <a-form-item>
                                <dict-radio dictKey="PAY.WAY" @change="onRadioChange" v-decorator="['payWay',{initialValue:initData.payWay, rules: [{ required: true, message: '请选择付款方式' }]}]"/>
                                <a-input v-show="submitForm.payWay === '4'" v-decorator="[
                                    'payWays',
                                    { rules: [{ required: false, message: '请输入付款方式' }]}
                                ]"/>
                            </a-form-item>
                        </td>
                        <th class="not-null">申请人</th>
                        <td>
                            <a-form-item>
                                <user-selector v-decorator="[
                                    'userId',
                                    {initialValue: initData.userId, rules: [{ required: true, message: '请选择申请人' }]}
                                ]" />
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>备注</th>
                        <td>
                            <a-form-item>
                                <a-textarea style="width:300px;" v-decorator="[
                                    'remark',
                                    {initialValue: initData.remark}
                                ]" placeholder="用于哪个项目"/>
                            </a-form-item>
                        </td>
                        <th class="not-null">收到发票</th>
                        <td>
                            <a-form-item>
                                <a-radio-group name="radioGroup"
                                               v-decorator="['hasCheck',
                                    {initialValue: initData.hasCheck, rules: [{ required: true, message: '请选择是否收到支票' }]}
                                ]">
                                    <a-radio value="1">是</a-radio>
                                    <a-radio value="2">否</a-radio>
                                </a-radio-group>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>附件</th>
                        <td>
                            <upload-selector :referId='initData.id' configKey='SEAL.FILE' />
                        </td>
                    </tr>
                </table>
            </a-form>
        </a-card>

        <!-- table -->
        <a-card title="会计科目" style="margin-bottom:60px">
            <a-table
                    :columns="columns"
                    :dataSource="payApplySubjects"
                    :rowKey="record => record.id"
                    :pagination="false">
                <template slot="content" slot-scope="record">
                    <dict-cascader dictKey="PAY.APPLY.SUBJECT"
                                   v-model="record.subject"/>
                </template>
                <template slot="amount" slot-scope="record">
                    <a-input-number style="margin: -5px 0;width: 100%" placeholder="金额" :min="0"
                                    v-model="record.price"/>
                </template>
                <template slot="operation" slot-scope="record">
                    <a-popconfirm title="是否要删除此行？" @confirm="onRemoveSubject(record.id)">
                        <a>删除</a>
                    </a-popconfirm>
                </template>
            </a-table>
            <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus"
                      @click="onAddSubject">新增会计科目
            </a-button>
        </a-card>
        <footer-tool-bar>
            <a-button type="primary" @click="submit" :loading="loading">提交</a-button>
        </footer-tool-bar>
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import qs from 'qs'
import moment from 'moment'
import UserSelector from '@/components/selector/UserSelector'
import ProcessSelector from '@/components/workflow/ProcessSelector'
import UploadSelector from '@/components/selector/UploadSelector'
import DictRadio from '@/components/dict/DictRadio'
import FooterToolBar from '@/components/FooterToolbar'
import DictCascader from '@/components/dict/DictCascader'
const uuidv4 = require('uuid/v4')
const numeral = require('numeral')
export default {
  name: 'PayApplyEdit',
  components: {
    PageView,
    UserSelector,
    ProcessSelector,
    UploadSelector,
    DictRadio,
    FooterToolBar,
    DictCascader
  },
  created () {
    const user = this.$ls.get('user')
    this.submitForm.userId = user.id
    this.submitForm.caseTypeId = this.$route.query.caseTypeId
    this.loadData()
  },
  computed: {
    totalAmount: function () {
      let total = 0
      this.payApplySubjects.forEach(function (item) {
        total += item.price
      })
      return total
    }
  },
  data () {
    return {
      procId: '',
      subjectId: 0,
      form: this.$form.createForm(this),
      submitForm: {
        id: uuidv4(),
        userId: '',
        price: 0,
        payWay: '',
        createdAt: moment(new Date())
      },
      columns: [
        {
          title: '会计科目',
          width: '150px',
          scopedSlots: { customRender: 'content' }
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
      payApplySubjects: [
        {
          id: 0,
          payApplyId: '',
          subject: '',
          price: 0
        }
      ],
      modalVisible: {
        carInfo: false
      },
      initData: {
        id: this.$route.query.id
      },
      loading: false,
      dateFormat: 'YYYY-MM-DD HH:mm:ss'
    }
  },
  methods: {
    onAddSubject () {
      this.payApplySubjects.push({
        id: ++this.subjectId,
        payApplyId: this.initData.id,
        subject: '',
        price: 0
      })
    },
    onRadioChange (value) {
      this.submitForm.payWay = value
    },
    loadData () {
      let that = this
      this.$http.get('/api/1/pay_apply/get_pay_apply.json?id=' + this.initData.id).then(function (response) {
        let result = response.result
        that.initData = result
        that.initData.createdAt = moment(result.createdAt)
        that.payApplySubjects = result.payApplySubjects
      })
    },
    onRemoveSubject (id) {
      const newData = this.payApplySubjects.filter(item => item.id !== id)
      this.payApplySubjects = newData
    },
    submit () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }

        let result = this.payApplySubjects.every(function (item) {
          if (item.subject === '' || item.price === '') {
            return false
          }
          return true
        })

        if (!result) {
          this.$message.error('科目、金额必须填写')
          return
        }

        let data = { ...this.form.getFieldsValue() }
        data.id = this.initData.id
        data.price = this.totalAmount
        data.payApplySubjects = this.payApplySubjects
        const that = this
        that.loading = true
        that.$http.post('/api/1/pay_apply/update_pay_apply.json', qs.stringify(data, { allowDots: true })).then(function (resp) {
          that.loading = false
          if (resp.code !== 200) {
            return
          }
          that.$message.success('提交成功')
          that.$router.push({ path: '/pay/apply/view?id=' + that.initData.id })
        })
      })
    }
  }
}
</script>

<style scoped>
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
