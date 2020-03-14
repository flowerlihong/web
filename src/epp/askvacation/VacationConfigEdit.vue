<template>
    <a-modal title="假期配置信息"
             :width="960"
             :visible="visible"
             :maskClosable="false"
             @ok="add"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading">
        <a-form :form="form">
            <table class="fx-form">
                <tr>
                    <th class="not-null">假期类型</th>
                    <td colspan="3">
                        <a-form-item>
                            <div>{{parentName}}</div>
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <th class="not-null">假期名称</th>
                    <td>
                        <a-form-item>
                            <a-input style="width: 420px; "
                                     v-decorator="['names',{initialValue:submitForm.names, rules: [{ required: true, message: '请输入假期名称' }]}]"
                            ></a-input>
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <th>假期天数</th>
                    <td>
                        <a-form-item>
                            <a-input-number style="width: 130px" :min="1" placeholder="不填即没有限制" v-decorator="['days',{initialValue:submitForm.days, rules: [{ required: false }]}]"></a-input-number>
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <th class="not-null">活动状态</th>
                    <td>
                        <a-form-item>
                            <a-radio-group name="radioGroup" v-decorator="['status',{initialValue:submitForm.status, rules: [{ required: true, message: '请选择活动状态' }]}]">
                                <a-radio value="1">有效</a-radio>
                                <a-radio value="2">已失效</a-radio>
                            </a-radio-group>
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <th class="not-null">假期说明</th>
                    <td colspan="3">
                        <a-form-item>
                            <a-textarea style="width: 420px; height:200px;"  v-decorator="['meno',{initialValue:submitForm.meno, rules: [{ required: true, message: '请输入外出事由' }]}]"></a-textarea>
                        </a-form-item>
                    </td>
                </tr>
            </table>
        </a-form>
    </a-modal>
</template>

<script>
import qs from 'qs'
export default {
  name: 'VacationConfigEdit',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  created () {
    this.submitForm = {}
  },
  data () {
    return {
      form: this.$form.createForm(this),
      modalLoading: false,
      parentName: '',
      submitForm: {
        days: '',
        names: ''
      }
    }
  },
  methods: {
    preView (id) {
      this.submitForm = {}
      this.loadData(id)
    },
    loadData (id) {
      let that = this
      this.$http.get('/api/1/vacation_config/get_config_info.json?id=' + id).then(function (response) {
        let result = response.result
        that.submitForm = result
        that.parentName = result.extras.parentName
        console.log(that.submitForm)
      })
    },
    add () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        const that = this
        let data = that.form.getFieldsValue()
        data.id = that.submitForm.id
        data.confgtype = that.submitForm.confgtype
        this.$http.post('/api/1/vacation_config/update_config.json', qs.stringify(data)).then(function (response) {
          if (response.code !== 200) {
            return
          }
          that.$message.success('操作成功')
          that.$emit('success')
          that.form.resetFields()
        }).catch(function () {
        }).then(function () {
          // that.modalLoading.addConfig = false
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
