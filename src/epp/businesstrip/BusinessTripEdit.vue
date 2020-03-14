<template>
    <page-view title="外勤/出差">
        <a-card>
            <a-form :form="form">
                <table class="fx-form">
                    <tr>
                        <th class="not-null">外出人员</th>
                        <td>
                            <a-form-item>
                                <user-selector v-decorator="['userId',{initialValue:submitForm.userId, rules: [{ required: true, message: '请选择外出人员' }]}]"/>
                            </a-form-item>
                        </td>
                        <th class="not-null">外出类型</th>
                        <td>
                            <a-form-item>
                                <dict-radio dictKey="BUSINESSTRIP.TYPES" v-decorator="['types',{initialValue:submitForm.types, rules: [{ required: true, message: '请选择外出类型' }]}]"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th class="not-null">计划时间</th>
                        <td>
                            <a-form-item>
                                <a-range-picker showTime format="YYYY-MM-DD HH:mm:ss"
                                                v-decorator="['planTime',{initialValue:submitForm.planTime, rules: [{ required: true, message: '请输入日期' }]}]"
                                />
                            </a-form-item>
                        </td>
                        <th class="not-null">申请时间</th>
                        <td>
                            <a-form-item>
                                <a-date-picker showTime
                                               format="YYYY-MM-DD HH:mm:ss"
                                               v-decorator="['date',{initialValue:submitForm.createdAt, rules: [{ required: true, message: '请输入日期' }]}]"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th class="not-null">外出地点</th>
                        <td >
                            <a-form-item>
                                <a-input style="width: 420px" placeholder="请输入外出地点"
                                         v-decorator="['address',{initialValue:submitForm.address, rules: [{ required: true, message: '请输入外出地点' }]}]"
                                ></a-input>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th class="not-null">外出事由</th>
                        <td colspan="3">
                            <a-form-item>
                                <a-textarea placeholder="请输入外出事由" style="width: 420px; height:200px;"
                                            v-decorator="['content',{initialValue:submitForm.content, rules: [{ required: true, message: '请输入外出事由' }]}]"
                                ></a-textarea>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>附件</th>
                        <td colspan="3">
                            <upload-selector :referId='submitForm.id' configKey='SEAL.FILE' />
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" align="center">
                            <a-button type="primary" @click="submit" :loading="loading">修改</a-button>
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
import qs from 'qs'
import moment from 'moment'
import UserSelector from '@/components/selector/UserSelector'
import DictRadio from '@/components/dict/DictRadio'
import UploadSelector from '@/components/selector/UploadSelector'

export default {
  name: 'BusinessTripEdit',
  components: {
    PageView,
    UserSelector,
    DictRadio,
    UploadSelector
  },
  created () {
    this.loadData()
    this.trip.caseTypeId = this.$route.query.caseTypeId
  },
  data () {
    return {
      form: this.$form.createForm(this),
      submitForm: {
        title: null,
        createdAt: null,
        types: '',
        address: '',
        content: null,
        state: '',
        planTime: null,
        userName: null,
        userId: null
      },
      loading: false,
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      trip: {
        id: this.$route.query.id
      },
      submitParam: {
      }
    }
  },
  methods: {
    reset () {
      this.form.resetFields()
    },
    onRadioChange (value) {
      // this.$message.success('已选择：' + value)
      this.submitForm.types = value
    },
    onChangeUser (selectedIds) {
      this.submitForm.userId = selectedIds
    },
    moment,
    loadData () {
      let that = this
      this.$http.get('/api/1/business_trip/get_business_trip.json?id=' + this.trip.id).then(function (response) {
        let result = response.result
        that.submitForm = result
        that.submitForm.createdAt = moment(result.createdAt)
        that.submitForm.planTime = [moment(result.planstartAt), moment(result.planendAt)]
      })
    },
    submit () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        const that = this
        let data = that.form.getFieldsValue()
        data.id = that.trip.id
        data.createdAt = data.date.format('YYYY-MM-DD HH:mm')
        data.planstartAt = data.planTime[0].format('YYYY-MM-DD HH:mm:ss')
        data.planendAt = data.planTime[1].format('YYYY-MM-DD HH:mm:ss')
        this.$http.post('/api/1/business_trip/update_business_trip.json', qs.stringify(data)).then(function (response) {
          if (response.code === 200) {
            that.$message.success('更新成功')
            that.$router.push({ path: '/businesstrip/view?id=' + that.trip.id })
          } else {
            that.$message.error(response.msg)
          }
        }).catch(function () {
        }).then(function () {
        })
      })
    }
  }
}
</script>

<style scoped>
    .card {
        margin-bottom: 24px;
    }

    .fill-form {
        margin-bottom: 0;
        width: 100%;
    }
    .fill-form th{
        width: 90px;
        text-align: justify;
        font-weight: 500;
    }
    .fill-form th::after{
        content: "";
        display: inline-block;
        width: 100%;
    }
    .fill-form td{
        padding-left: 20px;
    }
    .fill-form div{
        width: 350px;
    }
    .title{
        padding-bottom: 24px;
        margin-bottom: 24px;
        border-bottom: 1px dashed #dcdcdc;
    }
    .title span{
        display: inline-block;
        font-size: 16px;
    }
    .title span:nth-child(1){
        width: 90px;
        color: #1890ff;
    }
    .title span i{
        margin-right: 8px;
    }
    .title span:nth-child(2){
        padding-left: 20px;
    }
    .title span div{
        margin: 0;
    }
</style>
