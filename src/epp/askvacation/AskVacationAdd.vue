<template>
    <page-view title="请休假申请">
        <a-card class="card">
            <a-form :form="form">
                <a-form-item>
                    <process-selector v-decorator="['procId',{ rules: [{ required: true, message: '请选择启动流程' }]}]"/>
                </a-form-item>
                <table class="fx-form">
                    <tr>
                        <th>请假人</th>
                        <td>
                            <a-form-item>
                                {{initData.name}}
                            </a-form-item>
                        </td>
                        <th class="not-null">申请日期</th>
                        <td>
                            <a-form-item>
                                <a-date-picker showTime format="YYYY-MM-DD HH:mm"
                                               v-decorator="['createdAt', {initialValue:initData.createdAt, rules: [{ required: true, message: '请输入登记日期' }]}]"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th class="not-null">请假原因</th>
                        <td colspan="3">
                            <a-form-item>
                                <a-textarea style="height:100px;" v-decorator="['content',{ rules: [{ required: true, message: '请输入内容' }]}]"></a-textarea>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>备注</th>
                        <td colspan="3">
                            <a-form-item>
                                <a-textarea style="height:100px;" v-decorator="['remark']"></a-textarea>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>附件</th>
                        <td colspan="3">
                            <upload-selector :referId='initData.id' configKey='SEAL.FILE' />
                        </td>
                    </tr>
                </table>
            </a-form>
        </a-card>

        <a-card title="假期具体信息" style="margin-bottom:60px">
            <a-form :form="form1">
                <table class="fx-form" v-for="item in addresses" :key="item.id">
                    <tr>
                        <td><a-button type="primary" @click="addF" :loading="loading">添加</a-button></td>
                        <td><a-button @click="onRemoveClaimItem(item.id)">删除</a-button></td>
                    </tr>
                    <tr>
                        <th class="not-null">假期类型</th>
                        <td>
                            <a-form-item>
                                <a-select style="width: 120px" @change="value => onEdit(value, item.id, 'confgtype')"
                                          >
                                    <!--v-decorator="[{ rules: [{ required: true, message: '请选择假期类型' }]}]"-->
                                    <a-select-option v-for="t in vacationTypeData" :key = 't.id'>{{t.names}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </td>
                        <th class="not-null">假期名称</th>
                        <td>
                            <a-form-item>
                                <a-select style="width: 180px" v-model="item.configid" @change="value => onEdit(value, item.id, 'configid')">
                                    <a-select-option v-for="t in item.vacationConfig" :key = 't.id'>{{t.names}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>限请天数</th>
                        <td>
                            <a-form-item>
                                    <a-input  style="margin: -5px 0;width: 50%" disabled  :value="item.vacationConfigOne.days === null? '无限制':item.vacationConfigOne.days "/>
                            </a-form-item>
                        </td>
                        <th class="not-null">拟请假天数</th>
                        <td>
                            <a-form-item>
                                <a-input-number disabled v-if="item.vacationConfigOne.days" v-model="item.reportDays" :min="0.5" :max="item.vacationConfigOne.days" key="intentDays" style="margin: -5px 0;width: 60%"
                                         @change="value => onEdit(value, item.id, 'reportDays')"/>
                                <a-input-number disabled v-else :min="0.5" v-model="item.reportDays" key="intentDays" style="margin: -5px 0;width: 60%"
                                                @change="value => onEdit(value, item.id, 'reportDays')"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>假期说明</th>
                        <td colspan="3">
                            <a-form-item>
                                <a-textarea :value="item.vacationConfigOne.meno" disabled></a-textarea>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th class="not-null">假期日期</th>
                        <td>
                            <a-form-item>
                                <a-range-picker key="reportTime" showTime format="YYYY-MM-DD HH:mm:ss"
                                                @change="value => onEdit(value, item.id, 'reportTime')" />
                            </a-form-item>
                        </td>
                    </tr>
                </table>
            </a-form>
        </a-card>
        <footer-tool-bar>
            <a-button type="primary" @click="validate" :loading="loading">提交</a-button>&nbsp;&nbsp;
            <a-button @click="reset">重置</a-button>
        </footer-tool-bar>
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import moment from 'moment'
import qs from 'qs'
import FooterToolBar from '@/components/FooterToolbar'
import ProcessSelector from '@/components/workflow/ProcessSelector'
import UploadSelector from '@/components/selector/UploadSelector'

const uuidv4 = require('uuid/v4')
export default {
  name: 'AskVacationAdd',
  components: {
    PageView,
    FooterToolBar,
    ProcessSelector,
    UploadSelector
  },
  created () {
    const user = this.$ls.get('user')
    this.initData.userId = user.id
    this.initData.name = user.name
    this.initData.deptId = user.deptId
    this.initData.orgId = user.orgId
    this.initData.caseTypeId = this.$route.query.caseTypeId
    this.loadData()
  },
  data () {
    return {
      addresses: [
        {
          id: '',
          confgtype: '',
          configid: '',
          reportDays: 0,
          vacationConfig: [],
          vacationConfigOne: {
            days: '',
            meno: ''
          },
          vacationConfigValue: '',
          vacationName: '',
          limitDays: '',
          intentDays: '',
          content: '',
          reportTime: [],
          reportStart: '',
          reportEnd: ''
        }
      ],
      form: this.$form.createForm(this),
      form1: this.$form.createForm(this),
      loading: false,
      configName: '',
      globalId: 0,
      disabled: true,
      vacationTypeData: [],
      vacationConfig: [],
      initData: {
        id: uuidv4(),
        types: '',
        vacationName: '',
        limitDays: '',
        intentDays: 0,
        content: 0,
        startTime: null,
        endTime: null,
        userId: '',
        deptId: '',
        procId: '',
        urgency: '',
        caseTypeId: '',
        createdAt: moment()
      }
    }
  },
  methods: {
    loadData () {
      const that = this
      that.$http.get('/api/1/vacation_config_type/get_config_type_list.json').then(function (resp) {
        that.vacationTypeData = resp.result
      })
    },
    getVacationConfigList (id, target, newData) {
      const that = this
      target['configid'] = ''
      target['vacationConfigOne'] = []
      that.$http.get('/api/1/vacation_config/get_config_list.json?confgType=' + id).then(function (resp) {
        target['confgtype'] = id
        target['vacationConfig'] = resp.result
        that.addresses = newData
      })
    },
    getVacationConfig (id, target, newData) {
      const that = this
      target['configid'] = id
      that.$http.get('/api/1/vacation_config/get_config_info.json?id=' + id).then(function (resp) {
        target['vacationConfigOne'] = resp.result
        that.addresses = newData
      })
    },
    addF () {
      this.addresses.push({
        id: ++this.globalId,
        types: '',
        vacationName: '',
        limitDays: '',
        intentDays: '',
        content: '',
        reportTime: '',
        startTime: '',
        endTime: '',
        vacationConfigOne: {
          days: '',
          meno: ''
        }
      })
    },
    onEdit (value, id, column) {
      if (typeof (value) === 'object') {
        var time = []
        time[0] = value[0].format('YYYY-MM-DD HH:mm:ss')
        time[1] = value[1].format('YYYY-MM-DD HH:mm:ss')
        // let startDate = Date.parse(time[0])
        // let endDate = Date.parse(time[1])
        // let days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000)
        let days = (value[1] - value[0]) / (1 * 24 * 60 * 60 * 1000)
        let str = days.toString().split('.')
        let num = parseFloat('0.' + str[1])
        var reportDays = parseFloat(str[0])
        if (num > 0.3) {
          reportDays = reportDays + 1
        } else if (num > 0.1) {
          reportDays = reportDays + 0.5
        }
        console.log(reportDays)
      }
      const newData = [...this.addresses]
      const target = newData.filter(item => id === item.id)[0]
      if (target) {
        if (column === 'reportTime') {
          target[column] = time
          target['reportStart'] = time[0]
          target['reportEnd'] = time[1]
          target['reportDays'] = reportDays
          this.addresses = newData
          return
        }
        if (column === 'confgtype') {
          this.getVacationConfigList(value, target, newData)
          this.configName = ''
          return
        }
        if (column === 'configid') {
          this.getVacationConfig(value, target, newData)
          return
        }
        target[column] = value
        this.addresses = newData
        console.log(this.addresses)
      }
    },
    onCascaderChangeTypes (values) {
      this.initData.types = values
    },
    onRemoveClaimItem (id) {
      if (id === '') {
        return
      }
      const newData = this.addresses.filter(item => item.id !== id)
      this.addresses = newData
    },
    onAddClaimItem () {
      this.form1.push({
        id: ++this.globalClaimItemId,
        types: '',
        vacationName: '',
        limitDays: '',
        intentDays: 0,
        content: 0,
        reportTime: null,
        startTime: null,
        endTime: null
      })
    },
    reset () {
      this.form.resetFields()
    },
    onChangeProcess (id) {
      this.initData.procId = id
    },
    onChangeUser (selectedIds) {
      this.initData.userId = selectedIds
    },
    validate () {
      this.form.validateFields((err, values) => {
        if (err) {
          console.log(this.addresses)
          return
        }
        let result = this.addresses.every(function (item) {
          if (item.confgtype === '' || item.configid === '' ||
            typeof item.reportDays === 'undefined' || item.reportDays === 0 ||
            typeof item.reportTime === 'undefined' || item.reportTime.length < 1) {
            return false
          }
          return true
        })

        if (!result) {
          this.$message.error('假期类型、假期名称、拟请假天数、假期日期不能为空')
          return
        }
        // let arr = this.addresses
        // let obj = {}
        // let newArr = arr.reduce((cur, next) => {
        //   obj[next.confgtype] ? '' : obj[next.confgtype] = true && cur.push(next)
        //   return cur
        // }, [])
        //
        // console.log('数组长度' + this.addresses.length)
        // if (newArr.length !== this.addresses.length) {
        //   this.$message.error('提交失败！存在重复的假期类型')
        //   return
        // }

        const that = this
        let data = that.form.getFieldsValue()
        data.id = that.initData.id
        data.caseTypeId = that.initData.caseTypeId
        data.userId = that.initData.userId
        data.deptId = that.initData.deptId
        data.orgId = that.initData.orgId
        // data.caseTypeId = that.initData.caseTypeId
        // data.procId = that.initData.procId
        // 日期选择组件返回的值是 moment 对象，需要转化为字符串时间提交到后台
        data.createdAt = data.createdAt.format('YYYY-MM-DD HH:mm')
        data.state = 'B'
        data.items = this.addresses
        this.$http.post('/api/1/vacation_report/add_report.json', qs.stringify(data, { allowDots: true })).then(function (response) {
          if (response.code !== 200) {
            return
          }
          that.$message.success('操作成功')
          that.$router.push({ path: '/askvacation/view?id=' + response.caseId })
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
</style>
