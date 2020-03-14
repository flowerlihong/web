<template>
    <page-view title="">
        <a-card class="card">
        <a-tabs defaultActiveKey="1">
            <a-tab-pane tab="请休假申请信息" key="1">
                <table class="fx-form-view">
                    <tr>
                        <th>销假人</th>
                        <td>
                            {{report.extras.userName}}
                        </td>
                        <th>申请日期</th>
                        <td>
                            {{report.extras.createdAt}}
                        </td>
                    </tr>
                    <tr>
                        <th>请假原因</th>
                        <td colspan="3">
                            <div>{{report.content}}</div>
                        </td>
                    </tr>
                </table>
            </a-tab-pane>
            <a-tab-pane tab="请休假申请详情" key="2">
                <table class="fx-form-view" v-for="item in report.items" :key="item.id">
                    <tr>
                        <th>假期类型</th>
                        <td>
                            {{item.extras.configTypeName}}
                        </td>
                        <th>假期名称</th>
                        <td>
                            <div>{{item.extras.configName}}</div>
                        </td>
                    </tr>
                    <tr>
                        <th>拟请假天数</th>
                        <td colspan="3">
                            <div>{{item.reportDays}}</div>
                        </td>
                    </tr>
                    <tr>
                        <th>假期开始日期</th>
                        <td>
                            {{item.extras.reportStart}}
                        </td>
                        <th>假期结束日期</th>
                        <td>
                            <div>{{item.extras.reportEnd}}</div>
                        </td>
                    </tr>
                </table>
            </a-tab-pane>
        </a-tabs>
        </a-card>
        <a-card title="销假登记" style="margin-bottom:60px">
            <a-form :form="form">
                <a-form-item>
                    <process-selector v-decorator="['procId',{ rules: [{ required: true, message: '请选择启动流程' }]}]"/>
                </a-form-item>
                <table class="fx-form">
                    <tr>
                        <th class="not-null">实休天数</th>
                        <td>
                            <a-form-item>
                                <a-input-number :min="0" v-decorator="['vacationday',{initialValue:submitForm.vacationday, rules: [{ required: true, message: '请输入实休天数' }]}]"></a-input-number>
                            </a-form-item>
                        </td>
                        <th class="not-null">销假日期</th>
                        <td>
                            <a-form-item>
                                <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="['date',{initialValue:submitForm.returndate, rules: [{ required: true, message: '请输入日期' }]}]"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>销假说明</th>
                        <td>
                            <a-form-item>
                                <a-textarea style="width: 420px; " placeholder="请输入销假说明"
                                         v-decorator="['turnmemo',{initialValue:submitForm.turnmemo}]"
                                ></a-textarea>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" align="center" style="padding:14px 0">
                            <a-button  type="primary" @click="submit" :loading="loading">提交</a-button>
                            <a-button style="margin-left: 20px" @click="reset">重置</a-button>
                        </td>
                    </tr>
                </table>
            </a-form>
        </a-card>
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import ATextarea from 'ant-design-vue/es/input/TextArea'
import ProcessSelector from '@/components/workflow/ProcessSelector'
import moment from 'moment'
import qs from 'qs'
export default {
  name: 'ReportBackVacation',
  components: {
    ATextarea,
    PageView,
    ProcessSelector
  },
  created () {
    this.report.caseTypeId = this.$route.query.caseTypeId
    this.loadData()
  },
  data () {
    return {
      xwfState: {},
      loading: false,
      flag: 'T',
      form: this.$form.createForm(this),
      submitForm: {
        returndate: moment(new Date())
      },
      report: {
        items: [],
        id: this.$route.query.id,
        extras: {
          userName: ''
        }
      }
    }
  },
  methods: {
    onLoadXWFState (xwfState) {
      this.xwfState = xwfState
    },
    reset () {
      this.form.resetFields()
    },
    loadData () {
      let that = this
      this.$http.get('/api/1/vacation_report/get_report.json?id=' + this.report.id).then(function (response) {
        let result = response.result
        that.report = result
        if (result.returndate) {
          that.report.returndate = moment(result.returndate)
        }
      })
    },
    submit () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        const that = this
        let data = that.form.getFieldsValue()
        data.id = that.report.id
        data.flag = that.flag
        data.caseTypeId = that.report.caseTypeId
        data.returndate = data.date.format('YYYY-MM-DD HH:mm:ss')
        this.$http.post('/api/1/vacation_report/update_report_back.json', qs.stringify(data)).then(function (response) {
          if (response.code === 200) {
            that.$message.success('操作成功')
            that.$router.push({ path: '/askvacation/reportbackview?id=' + that.report.id })
          } else {
            that.$message.error('添加失败')
          }
        })
      })
    },
    onView () {
      this.$router.push({ path: '/askvacation/edit?id=' + this.report.id })
    }
  }
}
</script>

<style scoped>
    .card {
        margin-bottom: 14px;
    }
</style>
