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
                            <a-input style="width: 420px; "
                                     v-decorator="['names',{initialValue:submitForm.names, rules: [{ required: true, message: '请输入假期类型' }]}]"
                            ></a-input>
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <th class="not-null">假期类别</th>
                    <td>
                        <a-form-item>
                            <a-select  style='width: 120px'
                                       v-decorator="['category',{initialValue:submitForm.category, rules: [{ required: true, message: '请选择假期类别' }]}]">
                                <a-select-option value="1">请假</a-select-option>
                                <a-select-option value="2">休假</a-select-option>
                            </a-select>
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <th class="not-null">排序号</th>
                    <td>
                        <a-form-item>
                            <a-input-number  v-decorator="['seqNo',{initialValue:submitForm.seqNo, rules: [{ required: true, message: '请输入排序号' }]}]"></a-input-number>
                        </a-form-item>
                    </td>
                    <th class="not-null">活动状态</th>
                    <td>
                        <a-form-item>
                            <a-radio-group name="radioGroup" v-decorator="['activity',{initialValue:submitForm.activity, rules: [{ required: true, message: '请选择活动状态' }]}]">
                                <a-radio value="1">有效</a-radio>
                                <a-radio value="2">已失效</a-radio>
                            </a-radio-group>
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <th class="not-null">类型说明</th>
                    <td colspan="3">
                        <a-form-item>
                            <a-textarea style="width: 420px; height:200px;"  v-decorator="['memo',{initialValue:submitForm.memo, rules: [{ required: true, message: '请输入外出事由' }]}]"></a-textarea>
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
  name: 'VacationConfigTypeEdit',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      modalLoading: false,
      submitForm: {
        seqNo: ''
      }
    }
  },
  methods: {
    preView (id) {
      this.loadData(id)
    },
    loadData (id) {
      let that = this
      this.$http.get('/api/1/vacation_config_type/get_config_type.json?id=' + id).then(function (response) {
        let result = response.result
        that.submitForm = result
        that.submitForm.seqNo = result.seqNo.toString()
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
        this.$http.post('/api/1/vacation_config_type/update_config_type.json', qs.stringify(data)).then(function (response) {
          if (response.code !== 200) {
            return
          }
          that.$message.success('操作成功')
          that.$emit('success')
          that.form.resetFields()
        }).catch(function () {
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
