<!--
 Created by zqy on 2019/03/20.
-->
<template>
    <a-modal title="修改工作计划"
             :width="960"
             :visible="visible"
             :maskClosable="false"
             @ok="onEditPlanSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading.addUser">
        <a-form :form="addPlanForm">
            <a-row>
                <a-col :span="30">
                    <a-form-item label='标题'
                                 :labelCol="{ span: 30 }"
                                 :wrapperCol="{ span: 30 }">
                        <a-input v-model="queryForm.title" v-decorator="[
                        'title',
                        {initialValue:queryForm.title, rules: [{ required: true, message: '请输入标题' }]}
                        ]"></a-input>
                    </a-form-item>
                    <a-form-item label='内容'
                                 :labelCol="{ span: 30 }"
                                 :wrapperCol="{ span: 30 }">
                        <a-textarea v-model="queryForm.content" :autosize="{ minRows:10 }"
                                    v-decorator="[ 'content',{initialValue:queryForm.content, rules: [{ required: true, message: '请输入内容' }]}]"></a-textarea>
                    </a-form-item>
                    <a-form-item label='类型'
                                 :labelCol="{ span: 30 }"
                                 :wrapperCol="{ span: 30 }">
                        <a-radio-group name="radioGroup" v-model="queryForm.types"
                                       v-decorator="['types',{initialValue:queryForm.types, rules: [{ required: true, message: '请选择类型' }]}]">
                            <a-radio value="1">日计划</a-radio>
                            <a-radio value="2">周计划</a-radio>
                            <a-radio value="3">月计划</a-radio>
                            <a-radio value="4">年计划</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label='级别'
                                 :labelCol="{ span: 30 }"
                                 :wrapperCol="{ span: 30 }">
                        <a-radio-group name="radioGroup"  v-model="queryForm.levels" v-decorator="['levels',{initialValue:queryForm.levels, rules: [{ required: true, message: '请选择级别' }]}]">
                            <a-radio value="1">一般</a-radio>
                            <a-radio value="2">高</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label='日期'
                                 :labelCol="{ span: 1 }"
                                 :wrapperCol="{ span: 5 }" v-if="queryForm.types == 1">
                        <a-date-picker @change="onChangeDay"  placeholder="选择天"
                                       :value="moment(queryForm.planStartAt, dateFormat)" :format="dateFormat"
                                       v-decorator="['date',{initialValue:moment(queryForm.planStartAt), rules: [{ required: true, message: '请输入日期' }]}]"/>
                        <!--v-decorator="[-->
                        <!--'date',-->
                        <!--{initialValue:moment(queryForm.planStartAt), rules: [{ required: true, message: '请输入日期' }]}-->
                        <!--]"-->
                    </a-form-item>
                    <a-form-item label='日期'
                                 :labelCol="{ span: 1 }"
                                 :wrapperCol="{ span: 5 }" v-else-if="queryForm.types == 2">
                        <a-week-picker @change="onChangeWeek" placeholder="选择周" :value="moment(queryForm.showWeek, weekFormat)" :format="weekFormat"
                                       v-decorator="['date',{initialValue:moment(queryForm.planStartAt), rules: [{ required: true, message: '请输入日期' }]}]" />
                    </a-form-item>
                    <a-form-item label='日期'
                                 :labelCol="{ span: 1 }"
                                 :wrapperCol="{ span: 5 }" v-else-if="queryForm.types == 3">
                        <a-month-picker @change="onChangeMonth" placeholder="选择月" :value="moment(queryForm.planStartAt, monthFormat)" :format="monthFormat"
                                        v-decorator="['date',{initialValue:moment(queryForm.planStartAt), rules: [{ required: true, message: '请输入日期' }]}]"/>
                    </a-form-item>
                    <a-form-item label='日期'
                                 :labelCol="{ span: 1 }"
                                 :wrapperCol="{ span: 5 }" v-else>
                        <!--<a-input placeholder="请输入年份 例如：2019" v-model="queryForm.showYear"></a-input>-->
                        <a-input
                                :value="value"
                                @change="inputYear"
                                @blur="onBlur"
                                placeholder="输入年份"
                                maxLength="4"
                                style="width: 120px"
                                v-decorator="['date',{initialValue:moment(value), rules: [{ required: true, message: '请输入日期' }]}]"
                                />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </a-modal>
</template>

<script>
import qs from 'qs'
import ATextarea from 'ant-design-vue/es/input/TextArea'
import moment from 'moment'
import AFormItem from 'ant-design-vue/es/form/FormItem'

export default {
  name: 'WorkPlanEdit',
  components: { AFormItem, ATextarea },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      addPlanForm: this.$form.createForm(this),
      value: '',
      workPlan: '',
      modalLoading: {
        addUser: false
      },
      modalData: {
        addUser: {
          deptList: [],
          posList: []
        }
      },
      dateFormat: 'YYYY-MM-DD',
      monthFormat: 'YYYY-MM',
      weekFormat: 'YYYY-wo',
      queryForm: {
        title: null,
        createdAt: null,
        content: null,
        types: null,
        levels: null,
        id: null,
        inputDate: null,
        planStartAt: null,
        showWeek: null,
        showYear: null
      },
      queryParam: {
      }
    }
  },
  methods: {
    planEdit (record) {
      this.workPlan = record
      this.queryParam = {}
      this.queryForm.levels = record.levels
      this.queryForm.content = record.content
      this.queryForm.title = record.title
      this.queryForm.types = record.types
      // this.queryForm.createdAt = record.createdAt.format('YYYY-MM-DD')
      this.queryForm.id = record.id
      this.queryParam.id = record.id
      this.queryForm.inputDate = record.inputDate
      this.queryForm.planStartAt = record.planStartAt
      this.queryParam.planStartAt = record.planStartAt
      let date = new Date(record.planStartAt)
      this.queryForm.showWeek = date
      this.queryForm.showYear = record.extras.year
      this.value = record.extras.year
    },
    moment,
    inputYear (e) {
      const { value } = e.target
      const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/
      if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
        this.value = value
      }
    },
    onBlur () {
      const { value, onChange } = this
      if (value.charAt(value.length - 1) === '.' || value === '-') {
        onChange({ value: value.slice(0, -1) })
      }
    },
    onChangeDay (date, dateString) {
      if (dateString === '') {
        dateString = this.workPlan.planStartAt
      }
      this.queryForm.planStartAt = dateString
      this.queryParam.planStartAt = dateString
    },
    onChangeWeek (date, dateString) {
      if (dateString === '') {
        date = new Date(this.workPlan.planStartAt)
        this.queryForm.showWeek = date
        this.queryParam.weekOfYear = this.workPlan.planStartAt
      } else {
        this.queryForm.showWeek = date
        this.queryParam.weekOfYear = dateString
      }
    },
    onChangeMonth (date, dateString) {
      if (dateString === '') {
        dateString = this.workPlan.planStartAt
      }
      this.queryForm.planStartAt = dateString
      this.queryParam.monthOfYear = dateString
    },
    onChange (date, dateString) {
      console.log(date, dateString)
      this.queryParam.createdAt = dateString
    },
    onEditPlanSubmit: function () {
      let content = this.queryForm.content
      this.queryParam.content = content
      let types = this.queryForm.types
      this.queryParam.types = types
      let levels = this.queryForm.levels
      this.queryParam.levels = levels
      let title = this.queryForm.title
      this.queryParam.title = title
      // let inputDate = this.queryForm.inputDate
      this.queryParam.inputDate = this.value
      if (types === '2' && typeof (this.queryParam.weekOfYear) === 'undefined') {
        this.queryParam.weekOfYear = this.queryForm.showWeek
      }
      if (types === '3') {
        this.queryParam.monthOfYear = this.queryForm.planStartAt
      }
      let that = this
      this.addPlanForm.validateFields((err, values) => {
        if (err) {
          return
        }
        this.$http.post('/api/1/workPlan/update', qs.stringify(this.queryParam)).then(function (response) {
          if (response.code !== 200) {
            that.$message.error(response.msg)
            return
          }

          that.$message.success('操作成功')
          // that.addUserForm.resetFields()
          that.$emit('success')
        }).catch(function () {
        }).then(function () {
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
