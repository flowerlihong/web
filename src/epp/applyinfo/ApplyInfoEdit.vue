<template>
    <page-view title="内部请示修改">
        <a-card>
            <a-form :form="form">
                <table class="fx-form">
                    <tr>
                        <th class="not-null">登记日期</th>
                        <td>
                            <a-form-item>
                                <a-date-picker showTime format="YYYY-MM-DD HH:mm"
                                               v-decorator="['createdAt', {initialValue:initData.createdAt, rules: [{ required: true, message: '请输入登记日期' }]}]"/>
                            </a-form-item>
                        </td>
                        <th class="not-null">紧急程度</th>
                        <td>
                            <a-form-item>
                                <dict-cascader dictKey="APPLYINFO.URGENCY" v-decorator="['urgency', {initialValue:initData.urgency, rules: [{ required: true, message: '请选择紧急程度' }]}]"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th class="not-null">登记部门</th>
                        <td>
                            <a-form-item>
                                <dept-selector v-decorator="['deptId', {initialValue:initData.deptId, rules: [{ required: true, message: '请选择登记部门' }]}]"/>
                            </a-form-item>
                        </td>
                        <th class="not-null">登记人</th>
                        <td>
                            <a-form-item>
                                <user-selector v-decorator="['userId', {initialValue:initData.userId, rules: [{ required: true, message: '请选择登记人' }]}]"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th class="not-null">标题</th>
                        <td colspan="3">
                            <a-form-item>
                                <a-input placeholder="请输入标题" v-decorator="['title',{initialValue:initData.title, rules: [{ required: true, message: '请输入标题' }]}]"></a-input>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th class="not-null">主要内容</th>
                        <td colspan="3">
                            <a-form-item>
                                <a-textarea placeholder="请输入主要内容" style="height:200px;"
                                            v-decorator="['content',{initialValue:initData.content, rules: [{ required: true, message: '请输入内容' }]}]"></a-textarea>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>备注</th>
                        <td colspan="3">
                            <a-form-item>
                                <a-textarea style="height:100px;" placeholder="请输入备注" v-decorator="['remark',{initialValue:initData.remark, rules: [{ required: false }]}]"></a-textarea>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>附件</th>
                        <td colspan="3">
                            <upload-selector :referId='initData.id' configKey='SEAL.FILE' />
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3" align="center">
                            <a-button type="primary" @click="submit" :loading="loading">修改</a-button>
                            <a-button @click="reset">重置</a-button>
                        </td>
                    </tr>
                </table>
            </a-form>
        </a-card>
    </page-view>
</template>

<script>
import DeptSelector from '@/components/selector/DeptSelector'
import { PageView } from '@/layouts'
import moment from 'moment'
import qs from 'qs'
import UserSelector from '@/components/selector/UserSelector'
import DictCascader from '@/components/dict/DictCascader'
import UploadSelector from '@/components/selector/UploadSelector'

export default {
  name: 'ApplyInfoEdit',
  components: {
    PageView,
    UserSelector,
    DeptSelector,
    DictCascader,
    UploadSelector
  },
  created () {
    this.loadData()
  },
  data () {
    return {
      form: this.$form.createForm(this),
      initData: {
        userId: '',
        deptId: '',
        procId: '',
        urgency: '',
        caseTypeId: '',
        createdAt: null
      },
      loading: false,
      caseId: this.$route.query.id
    }
  },
  methods: {
    reset () {
      this.form.resetFields()
    },
    onDeptChange (selectedIds) {
      this.initData.deptId = selectedIds.join(',')
    },
    onChangeUser (selectedIds) {
      this.initData.userId = selectedIds.join(',')
    },
    onCascaderChange: function (values) {
      this.initData.urgency = values.join(',')
    },
    loadData () {
      const that = this
      that.$http.get('/api/1/applyinfo/get_apply_info.json?id=' + that.caseId).then(function (response) {
        const result = response.result
        that.initData = result
        // 日期选择组件需要的是 moment 对象，将日期转换为对象
        that.initData.createdAt = moment(result.createdAt)
      })
    },
    submit () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        const that = this
        let data = that.form.getFieldsValue()
        data.id = that.caseId
        // 日期选择组件返回的值是 moment 对象，需要转化为字符串时间提交到后台
        data.createdAt = data.createdAt.format('YYYY-MM-DD HH:mm')
        this.$http.post('/api/1/applyinfo/update_apply_info.json', qs.stringify(data)).then(function (response) {
          if (response.code !== 200) {
            return
          }
          that.$message.success('操作成功')
          that.$router.push({ path: '/applyinfo/view?id=' + that.caseId })
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
