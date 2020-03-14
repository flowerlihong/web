
<!--
 Created by Xuz on 2019/03/27.
 xuz[at]live[dot]cn
 添加系统模块
-->
<template>
    <a-modal title="添加打印模板类型"
             :width="643"
             :visible="visible"
             :maskClosable="false"
             @ok="onSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading">
        <a-form :form="form">
                <table width="100%" class="fx-form">
                            <tr>
                                <th class="not-null">打印模板类型：</th>
                                <td>
                                   <a-form-item>
                                      <a-input v-decorator="['printDocType',{rules: [{ required: true, message: '请填写打印模板类型' }]}]"></a-input>
                                  </a-form-item>
                                </td>
                            </tr>
                            <tr>
                               <th class="not-null">打印模板类型名称：</th>
                               <td>
                                  <a-form-item>
                                      <a-input v-decorator="['printDocTypeName',{rules: [{ required: true, message: '请填写打印模板类型名称' }]}]"></a-input>
                                  </a-form-item>
                               </td>
                            </tr>
                            <tr>
                               <th>打印模板类型描述：</th>
                               <td>
                                  <a-form-item>
                                    <a-input v-decorator="['printDocTypeDesc']"></a-input>
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
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  created () {
  },
  data () {
    return {
      form: this.$form.createForm(this),
      modalLoading: false
    }
  },
  methods: {
    addTypetemp () {
      this.form.resetFields()
    },
    onSubmit () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        let data = this.form.getFieldsValue()
        this.$http.post('/api/1/dmservices/add_print_doctype.json', qs.stringify(data)).then(
          (resp) => {
            if (resp.code === 200) {
              this.$message.success('添加打印模板类型成功')
              this.$emit('success')
            } else if (resp.code === 201) {
              this.$message.error('该机构的该类打印模板类型的配置已存在，请重新选择!')
            }
          }
        )
      })
    }
  }
}
</script>

<style lang="less" scoped>
    th{
      width: 142px;
    }
    td{
        padding-left: 2px;
    }
</style>
