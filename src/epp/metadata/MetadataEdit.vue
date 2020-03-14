<template>
    <a-modal title="修改元数据配置"
             :width="960"
             :visible="visible"
             :maskClosable="false"
             @ok="add"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading">
        <a-alert message="请谨慎修改“对象ID”和“对象KEY”的内容，实际使用中一般硬编码在代码中。" banner />
        <br />
        <a-form :form="form">
            <table class="fx-form">
                <tr>
                    <th class="not-null">对象ID</th>
                    <td>
                        <a-form-item>
                            <a-input v-decorator="['objectId',{initialValue:initData.objectId, rules: [{ required: true, message: '请输入objectId' }]}]"
                            />
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <th class="not-null">对象KEY</th>
                    <td>
                        <a-form-item>
                            <a-input v-decorator="['key',{initialValue:initData.key, rules: [{ required: true, message: '请输入key' }]}]"
                            />
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <th>对象值</th>
                    <td>
                        <a-form-item>
                            <a-input v-decorator="['value',{initialValue:initData.value}]"
                            />
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <th>描述</th>
                    <td>
                        <a-form-item>
                            <a-textarea v-decorator="['remark',{initialValue:initData.remark}]"
                            />
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
  name: 'MetadataEdit',
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
      this.$http.get('/api/1/metadata/config/get_metadata.json?id=' + id).then(function (response) {
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
        this.$http.post('/api/1/metadata/config/update_metadata.json', qs.stringify(data)).then(function (response) {
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
