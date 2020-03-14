<!--
 Created by zqy on 2019/03/20.
-->
<template>
    <a-modal title="添加工作计划"
             :width="960"
             :visible="visible"
             :maskClosable="false"
             @ok="onAddPlanSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading.addUser">
        <a-form :form="addPlanForm">
            <a-row>
                <a-col :span="30">
                    <a-form-item label='标题'
                                 :labelCol="{ span: 30 }"
                                 :wrapperCol="{ span: 30 }">
                        <a-input v-decorator="[ 'title',{rules: [{ required: true, message: '请输入标题' }]}]" placeholder="请输入标题"/>
                    </a-form-item>
                    <a-form-item label='内容'
                                 :labelCol="{ span: 30 }"
                                 :wrapperCol="{ span: 30 }">
                        <a-textarea :autosize="{ minRows:10 }"
                                    v-decorator="['content',{rules: [{ required: true, message: '请输入内容' }]}]"></a-textarea>
                    </a-form-item>
                    <a-form-item label='类型'
                                 :labelCol="{ span: 30 }"
                                 :wrapperCol="{ span: 30 }">
                        <a-radio-group name="radioGroup" v-model="queryForm.types"
                                       >
                            <a-radio value="1">日计划</a-radio>
                            <a-radio value="2">周计划</a-radio>
                            <a-radio value="3">月计划</a-radio>
                            <a-radio value="4">年计划</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label='级别'
                                 :labelCol="{ span: 30 }"
                                 :wrapperCol="{ span: 30 }">
                        <a-radio-group name="radioGroup"
                                       v-decorator="[ 'levels',{rules: [{ required: true, message: '请输入级别' }]}]">
                            <a-radio value="1">一般</a-radio>
                            <a-radio value="2">高</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label='日期'
                                 :labelCol="{ span: 1 }"
                                 :wrapperCol="{ span: 5 }" v-if="queryForm.types == 4">
                        <a-input
                                :value="value"
                                @change="inputYear"
                                @blur="onBlur"
                                placeholder="输入年份"
                                maxLength="4"
                                style="width: 120px"
                                v-decorator="[ 'date',{rules: [{ required: true, message: '请输入时间' }]}]"/>
                    </a-form-item>
                    <a-form-item label='日期'
                                 :labelCol="{ span: 1 }"
                                 :wrapperCol="{ span: 5 }" v-else-if="queryForm.types == 2">
                        <a-week-picker placeholder="选择周"
                                       v-decorator="[ 'week',{rules: [{ required: true, message: '请选择时间' }]}]"/>
                    </a-form-item>
                    <a-form-item label='日期'
                                 :labelCol="{ span: 1 }"
                                 :wrapperCol="{ span: 5 }" v-else-if="queryForm.types == 3">
                        <a-month-picker placeholder="选择月" v-decorator="[ 'month',{rules: [{ required: true, message: '请选择时间' }]}]"/>
                    </a-form-item>
                    <a-form-item label='日期'
                                 :labelCol="{ span: 1 }"
                                 :wrapperCol="{ span: 5 }" v-else>
                        <a-date-picker v-decorator="[ 'day',{rules: [{ required: true, message: '请选择时间' }]}]"/>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </a-modal>
</template>

<script>
import qs from 'qs'
import ATextarea from 'ant-design-vue/es/input/TextArea'
import ACol from 'ant-design-vue/es/grid/Col'

export default {
  name: 'WorkPlanAdd',
  components: { ACol, ATextarea },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      addPlanForm: this.$form.createForm(this),
      defaultOrgId: '',
      defaultDeptId: '',
      defaultPosId: '',
      value: '',
      modalLoading: {
        addUser: false
      },
      modalData: {
        addUser: {
          deptList: [],
          posList: []
        }
      },
      queryForm: {
        title: null,
        createdAt: null,
        content: null,
        types: '1',
        levels: '1',
        week: null,
        inputDate: null
      },
      queryParam: {
      }
    }
  },
  methods: {
    planAdd () {
      this.queryForm = {}
      this.queryParam = {}
    },
    onChangeDay (date, dateString) {
      this.queryParam.planStartAt = dateString
    },
    onChangeWeek (date, dateString) {
      this.queryParam.weekOfYear = dateString
    },
    onChangeMonth (date, dateString) {
      this.queryParam.monthOfYear = dateString
    },
    onChange (date, dateString) {
    },
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
    onAddPlanSubmit () {
      this.addPlanForm.validateFields((err, values) => {
        if (err) {
          console.log(values)
          return
        }
        let content = this.queryForm.content
        this.queryParam.content = content
        let types = this.queryForm.types
        this.queryParam.types = types
        let levels = this.queryForm.levels
        this.queryParam.levels = levels
        let title = this.queryForm.title
        this.queryParam.title = title
        this.queryParam.inputDate = this.value
        let that = this
        this.$http.post('/api/1/workPlan/add.json', qs.stringify(this.queryParam)).then(function (response) {
          if (response.code !== 200) {
            that.$message.error(response.msg)
            return
          }

          that.$message.success('操作成功')
          // that.addUserForm.resetFields()
          that.$emit('success')
        }).catch(function () {
        }).then(function () {
          that.modalLoading.addPlan = false
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
