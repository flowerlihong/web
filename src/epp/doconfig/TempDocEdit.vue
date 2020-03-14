
<!--
 Created by Xuz on 2019/03/27.
 xuz[at]live[dot]cn
 添加系统模块
-->
<template>
    <a-modal title="编辑公文模板"
             :width="643"
             :visible="visible"
             :maskClosable="false"
             @ok="onSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading">
        <a-form :form="form">
                <table style="width:100%"  class="fx-form">
                            <tr>
                                <th class="not-null">公文模板描述 ：</th>
                                <td>
                                  <a-form-item>
                                      <a-input v-decorator="['templateName',{initialValue: editDoc.templateName,rules: [{ required: true, message: '请填写公文模板描述' }]}]"></a-input>
                                  </a-form-item>
                                </td>
                            </tr>
                            <tr>
                                <th class="not-null">公文类别：</th>
                                <td>
                                   <a-form-item>
                                         <a-select :options="cateList"  allowClear  v-decorator="[
                                    'docTypeId',{initialValue:editDoc.docTypeId,rules: [{ required: true, message: '请填写公文类别' }]}
                                  ]" />
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
                                           <a-input v-decorator="['docPath',{initialValue: editDoc.docPath,rules: [{ required: true, message: '请填写公文模板的存放位置' }]}]"></a-input>
                                  </a-form-item>
                               </td>
                            </tr>
                            <tr>
                               <th class="not-null">缮印图片存放位置：</th>
                               <td>
                                  <a-form-item>
                                       <a-input v-decorator="['sealPath',{initialValue: editDoc.sealPath,rules: [{ required: true, message: '请填写缮印图片存放位置' }]}]"></a-input>
                                  </a-form-item>
                               </td>
                            </tr>
                            <tr>
                               <th></th>
                               <td>
                                  <a-form-item>
                                       <a-checkbox @change="onChange" :checked="check">是否上行文</a-checkbox>
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
  created () {
    this.onCate()
  },
  data () {
    return {
      form: this.$form.createForm(this),
      modalLoading: false,
      check: true,
      value: '',
      orgId: '',
      cateList: [],
      templateNo: '',
      editDoc: {
        extras: {}
      }
    }
  },
  methods: {
    editDoctemp (id) {
      this.form.resetFields()
      this.$http.get('/api/1/dmservices/view_doc_template.json?id=' + id).then(
        (resp) => {
          this.editDoc = resp.result
          this.orgId = resp.result.orgId
          this.templateNo = resp.result.templateNo
          if (resp.result.isUper === '0') {
            this.check = false
            this.value = '0'
          } else if (resp.result.isUper === '1') {
            this.check = true
            this.value = '1'
          }
        }
      )
    },
    onCate () {
      this.$http.get('/api/1/dispatchtype/get_sys_dispatch_type_select.json').then(
        (resp) => {
          this.cateList = this.mapSelectData(resp.result)
        }
      )
    },
    mapSelectData (list) {
      return list.map(item => {
        return {
          value: item.id,
          label: item.name
        }
      })
    },
    onChange (e) {
      if (e.target.checked) {
        this.check = true
        this.value = '1'
      } else {
        this.check = false
        this.value = '0'
      }
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
        data.isUper = this.value
        data.orgId = this.orgId
        data.templateNo = this.templateNo
        this.modalLoading = true
        this.$http.post('/api/1/dmservices/edit_doc_template.json', qs.stringify(data, { allowDots: true })).then(
          (resp) => {
            if (resp.code === 200) {
              this.modalLoading = false
              this.$message.success('编辑公文模板成功')
              this.$emit('success')
            } else if (resp.code === 201) {
              this.modalLoading = false
              this.$message.error('该机构的该类公文模板的配置已存在，请重新选择!')
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
