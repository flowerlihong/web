<template>
    <a-modal title="添加元数据"
             :width="960"
             :visible="visible"
             :maskClosable="false"
             @ok="add"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading">
        <a-form :form="form">
            <table class="fx-form">
                <tr>
                    <th class="not-null">对象ID</th>
                    <td>
                        <a-form-item>
                            <a-input v-decorator="['objectId',{ rules: [{ required: true, message: '请输入对象ID' }]}]"
                            />
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <th class="not-null">对象KEY</th>
                    <td>
                        <a-form-item>
                            <a-input v-decorator="['key',{ rules: [{ required: true, message: '请输入key' }]}]"
                            />
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <th>对象值</th>
                    <td>
                        <a-form-item>
                            <a-input v-decorator="['value']"
                            />
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <th>描述</th>
                    <td>
                        <a-form-item>
                            <a-textarea v-decorator="['remark']"
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
  name: 'MetadataAdd',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      modalLoading: false
    }
  },
  methods: {
    preView (id) {
      // this.loadData(id)
    },
    add () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        const that = this
        let data = that.form.getFieldsValue()
        this.$http.post('/api/1/metadata/config/add_metadata.json', qs.stringify(data)).then(function (response) {
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
