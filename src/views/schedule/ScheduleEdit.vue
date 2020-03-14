<template>
    <a-modal title="编辑定时任务"
             :width="800"
             :visible="visible"
             :maskClosable="false"
             :confirmLoading="loading"
             @ok="onSubmit"
             @cancel="onCancel">
        <a-form :autoFormCreate="(form)=>{this.form = form}">
            <a-form-item
                    label='任务名称'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }"
                    fieldDecoratorId="name"
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请填写任务名称' }]}">
                <a-input placeholder='任务名称'/>
            </a-form-item>
            <a-form-item
                    label='执行时间'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 19 }"
                    fieldDecoratorId="cronType"
                    :fieldDecoratorOptions="{initialValue:'cron-loop'}">
                <a-radio-group @change="onCronTypeChange">
                    <a-radio value="cron-loop">循环</a-radio>
                    <a-radio value="cron-hour">每时</a-radio>
                    <a-radio value="cron-day">每天</a-radio>
                    <a-radio value="cron-week">每周</a-radio>
                    <a-radio value="cron-month">年月</a-radio>
                    <a-radio value="cron-expression">Cron表达式</a-radio>
                </a-radio-group>
                <div id="cron-loop" class="cron-detail" v-show="cronDetailVisible.loop">
                    <span>循环计划任务</span><br>每 <a-input-number name="minute" :min="0" :max="59" v-model="param.minute" /> 分钟执行
                </div>
                <div id="cron-hour" class="cron-detail" v-show="cronDetailVisible.hour">
                    <span>每小时计划任务</span><br>
                    每 <a-input-number name="hour" :min="0" :max="23" v-model="param.hour"/> 小时的第 <a-input-number name="minute" :min="0" :max="59" v-model="param.minute"/> 分执行
                </div>
                <div id="cron-day" class="cron-detail" v-show="cronDetailVisible.day">
                    <span>每日计划任务</span><br>
                    每日的
                    <a-input-number name="hour" :min="0" :max="23" v-model="param.hour"/> 时
                    <a-input-number name="minute" :min="0" :max="59" v-model="param.minute"/> 分执行
                </div>
                <div id="cron-week" class="cron-detail" v-show="cronDetailVisible.week">
                    <span>每周计划任务</span><br>
                    每周的<br>
                    <a-checkbox-group v-model="param.weekList">
                        <a-row>
                            <a-col :span="6"><a-checkbox value="2">星期一</a-checkbox></a-col>
                            <a-col :span="6"><a-checkbox value="3">星期二</a-checkbox></a-col>
                            <a-col :span="6"><a-checkbox value="4">星期三</a-checkbox></a-col>
                            <a-col :span="6"><a-checkbox value="5">星期四</a-checkbox></a-col>
                            <a-col :span="6"><a-checkbox value="6">星期五</a-checkbox></a-col>
                            <a-col :span="6"><a-checkbox value="7">星期六</a-checkbox></a-col>
                            <a-col :span="6"><a-checkbox value="1">星期日</a-checkbox></a-col>
                        </a-row>
                    </a-checkbox-group>
                    <br>
                    每日的<br>
                    <a-input-number name="hour" :min="0" :max="23" v-model="param.hour"/> 时
                    <a-input-number name="minute" :min="0" :max="59" v-model="param.minute"/> 分执行
                </div>
                <div id="cron-month" class="cron-detail" v-show="cronDetailVisible.month">
                    <span>年月计划任务</span><br>
                    每年的<br>
                    <a-checkbox-group v-model="param.monthList">
                        <a-row>
                            <a-col :span="4"><a-checkbox value="1">一月</a-checkbox></a-col>
                            <a-col :span="4"><a-checkbox value="2">二月</a-checkbox></a-col>
                            <a-col :span="4"><a-checkbox value="3">三月</a-checkbox></a-col>
                            <a-col :span="4"><a-checkbox value="4">四月</a-checkbox></a-col>
                            <a-col :span="4"><a-checkbox value="5">五月</a-checkbox></a-col>
                            <a-col :span="4"><a-checkbox value="6">六月</a-checkbox></a-col>
                            <a-col :span="4"><a-checkbox value="7">七月</a-checkbox></a-col>
                            <a-col :span="4"><a-checkbox value="8">八月</a-checkbox></a-col>
                            <a-col :span="4"><a-checkbox value="9">九月</a-checkbox></a-col>
                            <a-col :span="4"><a-checkbox value="10">十月</a-checkbox></a-col>
                            <a-col :span="4"><a-checkbox value="11">十一月</a-checkbox></a-col>
                            <a-col :span="4"><a-checkbox value="12">十二月</a-checkbox></a-col>
                        </a-row>
                    </a-checkbox-group>
                    <br>
                    每月的<br>
                    <a-input-number name="day" :min="0" :max="31" v-model="param.day"/> 日
                    <a-input-number name="hour" :min="0" :max="23" v-model="param.hour"/> 时
                    <a-input-number name="minute" :min="0" :max="59" v-model="param.minute"/> 分执行
                </div>
                <div id="cron-expression" class="cron-detail" v-show="cronDetailVisible.expression">
                    <span>Cron表达式</span><br>
                    <a-input name="expression" v-model="param.expression"/><br>
                    一些示例：<br>
                    <ul>
                        <li>每天00:05分执行一次<br><code>0 5 0 * * ?</code></li>
                        <li>每天凌晨1点整执行一次<br><code>0 0 1 * * ?</code></li>
                        <li>每4小时执行一次<br><code>0 0 */4 * * ?</code></li>
                        <li>每分钟执行一次<br><code>0 0/1 * * * ?</code></li>
                    </ul>
                </div>
            </a-form-item>
            <a-form-item
                    label='执行类'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }"
                    fieldDecoratorId="clazz"
                    :fieldDecoratorOptions="{initialValue: 'com.fxoa.epp.XXX.job.', rules: [{ required: true, message: '请填写执行类名称' }]}">
                <a-input />
            </a-form-item>
            <a-form-item
                    label='参数'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }"
                    fieldDecoratorId="parameter">
                <a-textarea :autosize="{ minRows: 3, maxRows: 6 }"/>
            </a-form-item>
            <a-form-item
                    label='日志存储'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }"
                    fieldDecoratorId="expireLogDays"
                    :fieldDecoratorOptions="{initialValue:7, rules: [{ required: true, type: 'number', message: '请填写数字类型顺序号' }]}">
                <a-input-number /> 天
            </a-form-item>
            <a-form-item
                    label='描述'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }"
                    fieldDecoratorId="description">
                <a-textarea :autosize="{ minRows: 3, maxRows: 6 }"/>
            </a-form-item>
            <a-form-item
                    label='状态'
                    :labelCol="{ span: 5 }"
                    :wrapperCol="{ span: 12 }"
                    fieldDecoratorId="state"
                    :fieldDecoratorOptions="{initialValue:'D'}">
                <a-radio-group>
                    <a-radio value="E">启用</a-radio>
                    <a-radio value="D">停用</a-radio>
                </a-radio-group>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
import { axios as request } from '@/utils/request'
import qs from 'qs'
import Schedule from './schedule.js'

export default {
  name: 'ScheduleEdit',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      id: null,
      param: {
        day: 1,
        hour: 1,
        minute: 15,
        weekList: [],
        monthList: [],
        expression: null
      },
      cronDetailVisible: {
        loop: false,
        hour: false,
        day: false,
        week: false,
        month: false,
        expression: false
      },
      loading: false
    }
  },
  methods: {
    resetForm () {
      this.param.day = 1
      this.param.hour = 1
      this.param.minute = 1
      this.param.weekList = []
      this.param.monthList = []
    },
    getElementText (el) {
      return el.textContent || el.innerText
    },
    preEdit (id) {
      let that = this
      that.loading = true
      that.id = id
      that.resetForm()
      request.get('/api/1/schedule/get_schedule.json?id=' + id).then(function (response) {
        let schedule = response.schedule
        that.loading = false
        that.form.setFieldsValue({
          name: schedule.name,
          description: schedule.description,
          state: schedule.state
        })
      })
      that.loading = true
      request.get('/api/1/schedule/get_syntax.xml?id=' + id, { responseType: 'document' }).then(function (response) {
        let xml = response
        console.log(xml)

        let job = xml.getElementsByTagName('job')[0]
        let cronType = job.getAttribute('type')

        that.changeCronType(cronType)

        that.form.setFieldsValue({
          cronType: cronType,
          parameter: that.getElementText(job.getElementsByTagName('parameter')[0]),
          expireLogDays: parseInt(that.getElementText(job.getElementsByTagName('expireLogDays')[0])),
          clazz: job.getElementsByTagName('class')[0].getAttribute('path')
        })

        let els = job.getElementsByTagName('el')
        if (els != null) {
          for (let i = 0; i < els.length; i++) {
            let name = els[i].getAttribute('name')
            let val = els[i].getAttribute('value')
            if (name === 'week' && els[i].getAttribute('checked') === 'true') {
              that.param.weekList.push(val)
            } else if (name === 'month' && els[i].getAttribute('checked') === 'true') {
              that.param.monthList.push(val)
            } else if (name === 'hour') {
              that.param.hour = parseInt(val)
            } else if (name === 'minute') {
              that.param.minute = parseInt(val)
            } else if (name === 'expression') {
              that.param.expression = val
            }
          }
        }
      })
    },
    onSubmit () {
      let that = this
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        let url = '/api/1/schedule/edit.json'
        let fields = this.form.getFieldsValue()
        //
        let data = { ...fields, ...this.param }
        let syntax = new Schedule(that).buildSyntax(data)
        if (syntax == null) {
          return
        }
        //
        fields.id = that.id
        fields.syntax = syntax
        this.loading = true
        request.post(url, qs.stringify(fields)).then(function () {
          that.$message.success('操作成功')
          that.form.resetFields()
          that.loading = false
          // notify
          that.$emit('success')
        })
      })
    },
    onCancel () {
      this.$emit('cancel')
    },
    onCronTypeChange (e) {
      this.changeCronType(e.target.value)
    },
    changeCronType (val) {
      this.resetCronDetailVisible()

      if (val === 'cron-loop') {
        this.cronDetailVisible.loop = true
      } else if (val === 'cron-hour') {
        this.cronDetailVisible.hour = true
      } else if (val === 'cron-day') {
        this.cronDetailVisible.day = true
      } else if (val === 'cron-week') {
        this.cronDetailVisible.week = true
      } else if (val === 'cron-month') {
        this.cronDetailVisible.month = true
      } else if (val === 'cron-expression') {
        this.cronDetailVisible.expression = true
      }
    },
    resetCronDetailVisible () {
      this.cronDetailVisible.loop = false
      this.cronDetailVisible.hour = false
      this.cronDetailVisible.day = false
      this.cronDetailVisible.week = false
      this.cronDetailVisible.month = false
      this.cronDetailVisible.expression = false
    }
  }
}
</script>
<style>
    .cron-detail {
        border: 1px dashed #a6a6a6;
        padding: 6px;
        line-height: 1.5;
        margin: 4px 0;
    }
    .cron-detail .ant-input-number {
        width: 70px;
    }
    .cron-detail .ant-input {
        width: 280px;
    }
</style>
