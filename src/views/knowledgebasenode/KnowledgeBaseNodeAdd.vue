<!-- Created by LuRX on 2019/04/14-->
<template>
    <a-modal :confirmLoading="rootNodeAdd"
             :maskClosable="false"
             :visible="visible"
             :width="700"
             @cancel="$emit('cancel')"
             @ok="onAddSubmit"
             title="添加新节点">
        <a-form :form="form">
            <table class="fx-form">
                <tr>
                    <th class="not-null">节点名称</th>
                    <td class="fx-td-left">
                        <a-form-item>
                            <a-input placeholder="请输入节点名称"
                                     v-decorator="['node',{ rules: [{ required: true, message: '请输入节点名称' }]}]"></a-input>
                        </a-form-item>
                    </td>
                    <th>父节点</th>
                    <td>
                        <a-form-item>
                            {{knowledgeNode.nodeName}}
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <th>节点图标</th>
                    <td class="fx-td-left">
                        <a-form-item>
                            <a-input
                                    placeholder='点击按钮选择图标' v-decorator="['nodeIcon']">
                                <a-icon :type="queryParam.nodeIcon" slot="prefix" style="color:#108b16"/>
                                <a-icon @click="onSelectIcon" slot="addonAfter" style="cursor:pointer"
                                        type="search"/>
                            </a-input>
                        </a-form-item>
                    </td>
                    <th class="not-null">序号</th>
                    <td>
                        <a-form-item>
                            <a-input :min="1" style="width: 120px" type="number" placeholder="请输入序号"
                                     v-decorator="['seqNo',{ rules: [{ required: true, message: '请输入节点顺序号' }]}]"></a-input>
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <th class="not-null">可见权限</th>
                    <td class="fx-td-left">
                        <a-form-item>
                            <a-tree-select :treeData="permission" allowClear
                                           style="width: 180px"
                                           placeholder="请输入可见权限"
                                           treeDefaultExpandAll
                                           v-decorator="['visRight',{initialValue:defualtPermission, rules: [{ required: true, message: '请输入可见权限' }]}]"/>
                        </a-form-item>
                    </td>
                    <th class="not-null">管理权限</th>
                    <td>
                        <a-form-item>
                            <a-tree-select :treeData="permission" allowClear
                                           style="width: 180px"
                                           placeholder="请输入管理权限"
                                           treeDefaultExpandAll
                                           v-decorator="['adminRight',{ rules: [{ required: true, message: '请输入管理权限' }]}]"/>
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <th>节点描述</th>
                    <td colspan="3">
                        <a-textarea style="height:100px; width: 500px" placeholder="请输入节点描述"
                                    v-decorator="['description',{ rules: [{ max: 200, message: '描述不能超过200个字' }, { max : 200, message: '描述不能超过200个字'}]}]"></a-textarea>
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

export default {
  name: 'KnowledgeBaseNodeAdd',
  components: {
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
      rootNodeAdd: false,
      modalLoading: {
        nodeIcon: false
      },
      queryParam: {
        nodeIcon: '',
        parentId: ''
      },
      permission: [],
      defualtPermission: '',
      knowledgeNode: {
        id: '',
        path: '',
        nodeName: '',
        extras: {
          parentName: '',
          visRight: '',
          adminRight: ''
        }
      },
      rootNodeId: {
        id: ''
      }
    }
  },
  methods: {
    // index传过来的方法
    kNodeAdd (parentId) {
      this.queryParam.parentId = parentId
      if (parentId === this.rootNodeId.id) {
        return
      } else {
        let that = this
        this.$http.get('/api/1/knowledge_base_node/get_knowledge_base_node.json?id=' + parentId).then(function (res) {
          let result = res.result
          that.knowledgeNode = result
        })
      }
      this.loadRootNode()
    },

    // 获取根节点
    loadRootNode () {
      const that = this
      that.$http.get('/api/1/knowledge_base_node/get_knowledge_base_root_node.json').then(function (res) {
        that.rootNodeId = res.result
      })

    },

    // 权限
    onPermission () {
      const that = this
      that.$http.get('/api/1/perm/perm_full_list.json').then(function (res) {
        let result = []
        that.perSelectData(result, res.result)
        that.permission = result
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
    },

    // 图标
    onSelectIcon () {
      this.modalLoading.nodeIcon = true
    },
    onSelectedIcon (icon) {
      this.modalLoading.nodeIcon = false
      this.queryParam.nodeIcon = icon
      this.form.setFieldsValue({ nodeIcon: icon })
    },

    // 添加
    onAddSubmit () {
      let that = this
      this.form.validateFields((err, fieldsValue) => {
        if (err) {
          return
        }
        let params = { ...this.form.getFieldsValue() }
        params.nodeName = params.node
        params.parentId = this.queryParam.parentId
        this.$http.post('/api/1/knowledge_base_node/add_knowledge_base_node.json', qs.stringify(params)).then(function (res) {
          if (res.code !== 200) {
            return
          }
          that.$message.success('添加节点成功')
          that.form.resetFields()
          that.modalLoading.rootNodeAdd = false
          that.$emit('success')
        })
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
