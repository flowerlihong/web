<template>
    <page-view title="内部请示登记">
        <a-card>
            <a-form :form="form">
                <a-form-item>
                    <process-selector v-decorator="['procId',{ rules: [{ required: true, message: '请选择启动流程' }]}]"/>
                </a-form-item>
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
                                <dict-cascader dictKey="APPLYINFO.URGENCY" v-decorator="['urgency', {initialValue:'1', rules: [{ required: true, message: '请选择紧急程度' }]}]"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th class="not-null">登记部门</th>
                        <td>
                            <a-form-item>
                                <dept-selector disabled=disabled v-decorator="['deptId', {initialValue:initData.deptId, rules: [{ required: true, message: '请选择登记部门' }]}]"/>
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
                                <a-input placeholder="请输入标题" v-decorator="['title',{ rules: [{ required: true, message: '请输入标题' }]}]"></a-input>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th class="not-null">主要内容</th>
                        <td colspan="3">
                            <a-form-item>
                                <a-textarea placeholder="请输入主要内容" style="height:200px;" v-decorator="['content',{ rules: [{ required: true, message: '请输入内容' }]}]"></a-textarea>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>备注</th>
                        <td colspan="3">
                            <a-form-item>
                                <a-textarea placeholder="请输入备注" style="height:100px;" v-decorator="['remark']"></a-textarea>
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
                            <a-button type="primary" @click="submit" :loading="loading">提交</a-button>
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
import ProcessSelector from '@/components/workflow/ProcessSelector'
import UploadSelector from '@/components/selector/UploadSelector'

const uuidv4 = require('uuid/v4')
export default {
  name: 'ApplyInfoAdd',
  components: {
    PageView,
    UserSelector,
    DeptSelector,
    DictCascader,
    ProcessSelector,
    UploadSelector
  },
  created () {
    const user = this.$ls.get('user')
    this.initData.userId = user.id
    this.initData.deptId = user.deptId
    this.initData.caseTypeId = this.$route.query.caseTypeId
  },
  data () {
    return {
      form: this.$form.createForm(this),
      loading: false,
      disabled: true,
      initData: {
        id: uuidv4(),
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
    reset () {
      this.form.resetFields()
    },
    onChangeProcess (id) {
      this.initData.procId = id
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
    submit () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        const that = this
        let data = that.form.getFieldsValue()
        data.deptId = that.initData.deptId
        data.id = that.initData.id
        data.caseTypeId = that.initData.caseTypeId
        // 日期选择组件返回的值是 moment 对象，需要转化为字符串时间提交到后台
        data.createdAt = data.createdAt.format('YYYY-MM-DD HH:mm')
        this.$http.post('/api/1/applyinfo/add_apply_info.json', qs.stringify(data)).then(function (response) {
          if (response.code !== 200) {
            return
          }
          that.$message.success('操作成功')
          that.$router.push({ path: '/applyinfo/view?id=' + response.caseId })
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
