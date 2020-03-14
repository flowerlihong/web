
<!--
 Created by Xuz on 2019/03/27.
 xuz[at]live[dot]cn
 添加系统模块
-->
<template>
    <a-modal title="编辑打印模板"
             :width="643"
             :visible="visible"
             :maskClosable="false"
             @ok="onSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading">
        <a-form :form="form">
                <table style="width:100%" class="fx-form">
                            <tr>
                                <th class="not-null">打印模板类型：</th>
                                <td>
                                   <a-form-item>
                                         <a-select :options="cateList"  allowClear  v-decorator="[
                                    'printDoctype',{initialValue:editPrint.printDoctype,rules: [{ required: true, message: '请填写打印模板类型' }]}
                                  ]" />
                                  </a-form-item>
                                </td>
                            </tr>
                            <tr>
                               <th class="not-null">打印模板名称：</th>
                               <td>
                                  <a-form-item>
                                      <a-input v-decorator="['templateName',{initialValue:editPrint.templateName,rules: [{ required: true, message: '请填写打印模板名称' }]}]"></a-input>
                                  </a-form-item>
                               </td>
                            </tr>
                            <tr>
                               <th class="not-null">所属机构：</th>
                               <td>
                                  <a-form-item>
                                         <org-selector @change="onOrgChange" v-model="orgId" style="width:100%;"/>
                                  </a-form-item>
                               </td>
                            </tr>
                            <tr>
                               <th class="not-null">模板的存放位置：</th>
                               <td>
                                  <a-form-item>
                                    <a-input v-decorator="['storagePath',{initialValue:editPrint.storagePath,rules: [{ required: true, message: '请填写打印模板的存放位置' }]}]"></a-input>
                                  </a-form-item>
                               </td>
                            </tr>
                  </table>
        </a-form>
    </a-modal>
</template>
<script>
import OrgSelector from '@/components/selector/OrgSelector'
import qs from 'qs'
export default {
  name: 'ModuleAdd',
  components: {
    OrgSelector
  },
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
      orgId: '',
      editPrint: {
        extras: ''
      },
      cateList: [],
      oldDocType: '',
      oldOrgId: ''
    }
  },
  methods: {
    editPrintemp (printDocType, orgId) {
      this.form.resetFields()
      this.$http.post('/api/1/dmservices/view_print_template.json', qs.stringify({ printDocType, orgId })).then(
        (resp) => {
          this.editPrint = resp.result
          this.orgId = resp.result.orgId
          this.oldDocType = resp.result.printDoctype
          this.oldOrgId = resp.result.orgId
          this.cateList = this.mapSelectData(resp.result.list)
        }
      )
    },
    mapSelectData (list) {
      return list.map(item => {
        return {
          value: item.code,
          label: item.name
        }
      })
    },
    onOrgChange (selectedIds) {
      this.orgId = selectedIds
    },
    onSubmit () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        if (this.orgId === '') {
          this.$message.error('请选择所属机构')
          return
        }
        let data = this.form.getFieldsValue()
        data.orgId = this.orgId
        data.oldDocType = this.oldDocType
        data.oldOrgId = this.oldOrgId
        this.modalLoading = true
        this.$http.post('/api/1/dmservices/edit_print_template.json', qs.stringify(data)).then(
          (resp) => {
            if (resp.code === 200) {
              this.modalLoading = false
              this.$message.success('编辑打印模板成功')
              this.$emit('success')
            } else if (resp.code === 201) {
              this.modalLoading = false
              this.$message.error('该机构的该类打印模板的配置已存在，请重新选择!')
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
