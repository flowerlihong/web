<template>
    <a-modal title="修改短信模板信息"
             :width="960"
             :visible="visible"
             :maskClosable="false"
             @ok="add"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading">
        <a-form :form="form">
            <table class="fx-form">
                <tr>
                    <th class="not-null">模板名称</th>
                    <td>
                        <a-form-item>
                            <a-input v-decorator="['name',{initialValue:initData.name, rules: [{ required: true, message: '请输入模板名称' }]}]"
                            />
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <th class="not-null">keyword</th>
                    <td>
                        <a-form-item>
                            <a-input v-decorator="['keyword',{initialValue:initData.keyword, rules: [{ required: true, message: '请输入keyword' }]}]"
                            />
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <th>vendorCode</th>
                    <td>
                        <a-form-item>
                            <a-input v-decorator="['vendorCode',{initialValue:initData.vendorCode, rules: [{ required: false, message: '请输入vendorCode' }]}]"
                            />
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <th class="not-null">内容</th>
                    <td>
                        <a-form-item>
                            <a-textarea v-decorator="['content',{initialValue:initData.content, rules: [{ required: true, message: '请输入内容' }]}]"
                            />
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <th class="not-null">状态</th>
                    <td>
                        <a-form-item>
                            <a-select style="width: 170px" v-decorator="['state', {initialValue:initData.state, rules: [{ required: true, message: '请选择司机状态' }]}]">
                                <a-select-option value="E">正常</a-select-option>
                                <a-select-option value="S">停用</a-select-option>
                            </a-select>
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
  name: 'SmsTemplateEdit',
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
      initData: {}
    }
  },
  methods: {
    preView (id) {
      this.loadData(id)
    },
    loadData (id) {
      let that = this
      this.$http.get('/api/1/msg/config/get_sms_template_config.json?id=' + id).then(function (response) {
        let result = response.result
        that.initData = result
      })
    },
    add () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        const that = this
        let data = that.form.getFieldsValue()
        data.id = that.initData.id
        data.createdAt = that.initData.createdAt
        this.$http.post('/api/1/msg/config/update_sms_template_config.json', qs.stringify(data)).then(function (response) {
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
    .fx-form th {
        width: 120px;
    }
</style>
