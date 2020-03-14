<!-- Created by LuRX on 2019/04/14-->
<template>
    <a-modal :confirmLoading="modalLoading.kNodeEdit"
             :maskClosable="false"
             :visible="visible"
             :width="700"
             @cancel="$emit('cancel')"
             @ok="onEditSubmit"
             title="修改节点">
        <a-form :form="form">
            <table class="fx-form">
                <tr>
                    <th class="not-null">节点名称</th>
                    <td class="fx-td-left">
                        <a-form-item>
                            <a-input
                                    v-decorator="['node',{initialValue: knowledgeNode.nodeName, rules: [{required: true, message: '请输入节点名称' }]}]"></a-input>
                        </a-form-item>
                    </td>
                    <template v-if="queryParam.parentId !== null"></template>
                    <th>父节点</th>
                    <td>
                        <a-form-item>
                            <a-tree-select :treeData="treeData" allowClear style="width: 180px"
                                           treeDefaultExpandAll
                                           v-model="knowledgeNode.parentId"/>
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <th>节点图标</th>
                    <td class="fx-td-left">
                        <a-form-item>
                            <a-input
                                    placeholder='点击按钮选择图标' v-decorator="['nodeIcon',{initialValue: knowledgeNode.nodeIcon}
                                     ]">
                                <a-icon :type="knowledgeNode.nodeIcon" slot="prefix" style="color:#108b16"/>
                                <a-icon @click="onSelectIcon" slot="addonAfter" style="cursor:pointer"
                                        type="search"/>
                            </a-input>
                        </a-form-item>
                    </td>
                    <th class="not-null">序号</th>
                    <td>
                        <a-form-item>
                            <a-input-number :min="1" type="number"
                                            v-decorator="['seqNo',{initialValue: knowledgeNode.seqNo, rules: [{ required: true, message: '请输入节点顺序号' }]}]"/>
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <th class="not-null">可见权限</th>
                    <td class="fx-td-left">
                        <a-form-item>
                            <a-tree-select :treeData="permission" allowClear
                                           style="width: 180px"
                                           treeDefaultExpandAll
                                           v-decorator="['visRight',{initialValue: knowledgeNode.visRight,rules: [{ required: true, message: '请输入查看权限' }]}]"/>
                        </a-form-item>
                    </td>
                    <th class="not-null">管理权限</th>
                    <td>
                        <a-form-item>
                            <a-tree-select :treeData="permission" allowClear
                                           style="width: 180px"
                                           treeDefaultExpandAll
                                           v-decorator="['adminRight',{initialValue: knowledgeNode.adminRight ,rules: [{ required: true, message: '请输入管理权限' }]}]"/>
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <th>节点描述</th>
                    <td colspan="3">
                        <a-form-item>
                            <a-textarea style="height:100px; width: 500px" placeholder="请输入节点描述"
                                        v-decorator="['description', { max : 200, message: '描述不能超过200个字'}]"></a-textarea>
                        </a-form-item>
                    </td>
                </tr>
            </table>
        </a-form>
        <icon-selector :visible="modalLoading.nodeIcon" @cancel="modalLoading.nodeIcon = false"
                       @success="onSelectedIcon"/>
    </a-modal>
</template>

<script>
import qs from 'qs'
import IconSelector from '@/views/module/icon/IconSelector'
import AFormItem from 'ant-design-vue/es/form/FormItem'

export default {
  name: 'KnowledgeBaseNodeEdit',
  components: {
    AFormItem,
    IconSelector
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  created () {
    this.onPermission()
  },
  data () {
    return {
      form: this.$form.createForm(this),
      modalLoading: {
        kNodeEdit: false,
        nodeIcon: false
      },
      treeExpandedKeys: [],
      value: undefined,
      treeData: [],
      permission: [],
      knowledgeNode: {
        id: '',
        parentId: '',
        title: '',
        seqNo: '',
        nodeName: '',
        nodeIcon: '',
        visRight: '',
        adminRight: '',
        description: '',
        extras: {
          parentName: '',
          visRight: '',
          adminRight: ''
        }
      },
      queryParam: {}
    }
  },
  methods: {
    // index传过来的方法
    kNodeEdit (id) {
      const that = this
      that.$http.get('/api/1/knowledge_base_node/get_knowledge_base_node.json?id=' + id).then(function (res) {
        let result = res.result
        that.knowledgeNode = result
      }),
        that.$http.get('/api/1/knowledge_base_node/knowledge_base_node_list.json').then(function (response) {
          let result = []
          that.mapTreeSelectData(result, response.result, [id])
          that.treeData = result
        })
    },

    // 权限选择
    onPermission () {
      const that = this
      that.$http.get('/api/1/perm/perm_full_list.json').then(function (res) {
        let result = []
        that.perSelectData(result, res.result)
        that.permission = result
      })
    },

    // 确认提交
    onEditSubmit () {
      let that = this
      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          return
        }
        let params = { ...this.form.getFieldsValue() }
        this.modalLoading.kNodeEdit = true
        params.nodeName = params.node
        params.id = this.knowledgeNode.id
        params.parentId = this.knowledgeNode.parentId
        that.$http.post('/api/1/knowledge_base_node/update_knowledge_base_node.json', qs.stringify(params)).then(function (res) {
          if (res.code !== 200) {
            return
          }
          that.$message.success('修改节点成功')
          that.form.resetFields()
          that.knowledgeNode.kNodeEdit = false
          that.$emit('success')
        })
      })
    },

    // 图标选择
    onSelectIcon () {
      this.modalLoading.nodeIcon = true
    },
    onSelectedIcon (icon) {
      this.modalLoading.nodeIcon = false
      this.knowledgeNode.nodeIcon = icon
      this.form.setFieldsValue({ nodeIcon: icon })
    },

    // 节点树
    mapTreeSelectData (result, list, ids) {
      const that = this
      if (!list) {
        return
      }
      list.forEach(function (item) {
        if (!ids.includes(item.id)) {
          let o = { value: item.id, title: item.nodeName, children: [] }
          that.mapTreeSelectData(o.children, item.children, ids)
          result.push(o)
        }
      })
    },

    // 权限管理树
    perSelectData (result, list) {
      const that = this
      if (!list) {
        return
      }
      list.forEach(function (item) {
        let o = { value: item.id, title: item.name, children: [] }
        that.perSelectData(o.children, item.children)
        result.push(o)
      })
    }
  }
}
</script>

<style scoped>
    .fx-form .fx-td-left {
        width: 35%;
    }
</style>
