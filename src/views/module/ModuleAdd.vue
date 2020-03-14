<!--
 Created by Xuz on 2019/03/27.
 xuz[at]live[dot]cn
 添加系统模块
-->
<template>
    <a-modal title="添加系统模块"
             :width="1024"
             :visible="visible"
             :maskClosable="false"
             @ok="onSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading">
        <a-form :form="form">
            <a-row>
                <a-col :span="12">
                    <a-form-item label='上级模块'
                                 :labelCol="{ span: 5 }"
                                 :wrapperCol="{ span: 12 }">
                        <a-tree-select v-model="modalData.parent_id" :treeData="moduleList" treeDefaultExpandAll allowClear/>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label='文档类别'
                                 :labelCol="{ span: 5 }"
                                 :wrapperCol="{ span: 12 }">
                        <a-select :options="cateList" v-decorator="[
                                    'caseTypeId'
                                  ]" allowClear />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label='模块名称'
                                 :labelCol="{ span: 5 }"
                                 :wrapperCol="{ span: 12 }">
                        <a-input v-decorator="[
                                    'name',
                                    {rules: [{ required: true, message: '请填写模块名称' }]}
                                ]" placeholder='模块名称'/>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item
                            label='顺序号'
                            :labelCol="{ span: 5 }"
                            :wrapperCol="{ span: 12 }">
                        <a-input-number v-decorator="[
                                    'sort',
                                    {rules: [{ required: true, type: 'number', message: '请填写数字类型顺序号' }]}
                                ]" placeholder='顺序号'/>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label='模块图标'
                                 :labelCol="{ span: 5 }"
                                 :wrapperCol="{ span: 12 }">
                        <a-input v-decorator="[
                                    'icon',
                                ]" placeholder='点击右侧按钮选择图标'>
                            <a-icon slot="prefix" :type="modalData.icon" style="color:#108b16"/>
                            <a-icon slot="addonAfter" type="search" @click="onSelectIcon" style="cursor:pointer" />
                        </a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label='是否显示'
                                 :labelCol="{ span: 5 }"
                                 :wrapperCol="{ span: 12 }">
                        <a-radio-group v-decorator="[
                                    'state',
                                    {initialValue:modalData.state}
                                ]">
                            <a-radio value="1">显示</a-radio>
                            <a-radio value="0">隐藏</a-radio>
                        </a-radio-group>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item
                            label='访问路径'
                            :labelCol="{ span: 5 }"
                            :wrapperCol="{ span: 12 }">
                        <a-input v-decorator="[
                                    'path',
                                    {initialValue:modalData.web_path}
                                ]" placeholder='访问路径'/>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item
                            label='模板文件'
                            :labelCol="{ span: 5 }"
                            :wrapperCol="{ span: 12 }">
                        <a-input v-decorator="[
                                    'viewTemplate',
                                    {initialValue:modalData.view_template}
                                ]" placeholder='@/epp/module/viewName'/>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item
                            label='描述'
                            :labelCol="{ span: 5 }"
                            :wrapperCol="{ span: 12 }">
                        <a-input v-decorator="[
                                    'memo',
                                    {initialValue:modalData.memo}
                                ]" placeholder='描述'/>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <a-row>
            <a-col :span="24" style="padding-left:58px;">
                权限：
                <a-input-search size="small" placeholder="搜索权限" style="width:140px" @search="onSearchPerm"/>&nbsp;
                <a-button v-show="permSearchMode" size="small" @click="onSearchPermBack">返回</a-button>
                <div :style="{ height: treeHeight + 'px' }" style="overflow-y:auto;overflow-x:hidden;">
                <a-tree v-show="!permSearchMode" checkable
                        defaultExpandAll
                        checkStrictly
                        :checkedKeys="checkedPermList"
                        :treeData="permList"
                        @check="onCheckPerm"
                        @select="onSelectPerm"/>
                <a-tree v-show="permSearchMode" checkable
                        checkStrictly
                        :expandedKeys="expandedPermSearchKeys"
                        :checkedKeys="checkedPermListSearch"
                        :treeData="permListSearch"
                        @check="onCheckPermSearch"
                        @select="onSelectPermSearch"
                        @expand="onExpandPermSearch"/>
                <div v-html="permChangeSummary"></div>
                </div>
            </a-col>
        </a-row>

        <icon-selector :visible="modalVisible.icon" @success="onSelectedIcon" @cancel="modalVisible.icon = false" />

    </a-modal>
</template>

<script>
import qs from 'qs'
import IconSelector from './icon/IconSelector'

export default {
  name: 'ModuleAdd',
  components: { IconSelector },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    this.onResizeWindow()
  },
  created () {
    const that = this
    that.$http.get('/api/1/perm/perm_full_list.json').then(function (resp) {
      that.permList = that.mapTreeData(resp.result)
      let result = []
      that.mapTreeDataKV(result, resp.result)
      that.permListKV = result
    })
  },
  data () {
    return {
      treeHeight: 400,
      form: this.$form.createForm(this),
      modalLoading: false,
      moduleList: [],
      cateList: [],
      modalVisible: {
        icon: false
      },
      modalData: {
        id: '',
        cate_id: '',
        parent_id: '',
        icon: '',
        web_path: '',
        sort: '',
        memo: '',
        state: '0',
        extras: {
          permissionSummary: ''
        }
      },
      //
      permSearchMode: false,
      srcPermList: [],
      permList: [],
      permListKV: [],
      checkedPermList: [],
      permListSearch: [],
      expandedPermSearchKeys: [],
      checkedPermListSearch: [],
      permChangeSummary: ''
    }
  },
  methods: {
    onResizeWindow () {
      this.treeHeight = window.innerHeight - 640
    },
    preModuleAdd (module) {
      const that = this
      //
      that.srcPermList = []
      that.checkedPermList = []
      that.permChangeSummary = ''
      //
      that.$http.get('/api/1/module/get_modules.json').then(function (resp) {
        let result = []
        that.mapTreeSelectData(result, resp.result, [])
        that.moduleList = result
        if (module) {
          that.modalData.parent_id = module.id
        }
      })

      that.$http.get('/api/1/workflow/cate/get_doc_list.json').then(function (resp) {
        that.cateList = that.mapSelectData(resp.result)
      })
    },
    rePermStats () {
      const that = this
      let sb = []
      sb.push('原拥有: ' + that.srcPermList.length)
      let added = 0
      let removed = 0
      let addedNames = []
      let removedNames = []

      that.srcPermList.forEach(item => {
        if (!that.checkedPermList.includes(item)) {
          removed++
          removedNames.push(that.permListKV[item].title)
        }
      })

      that.checkedPermList.forEach(item => {
        if (!that.srcPermList.includes(item)) {
          added++
          addedNames.push(that.permListKV[item].title)
        }
      })

      if (added > 0 || removed > 0) {
        sb.push('&nbsp;<span style="color:red">+' + added + '</span>')
      }

      if (removed > 0) {
        sb.push('&nbsp;<span style="color:#008000">-' + removed + '</span>')
      }
      if (added > 0 || removed > 0) {
        sb.push('<div style="">')
        if (added > 0) {
          sb.push('<div><span style="color:red">新增</span>：')
          sb.push(addedNames.join(', '))
          sb.push('</div>')
        }
        if (removed > 0) {
          sb.push('<div><span style="color:#008000">移除</span>：')
          sb.push(removedNames.join(', '))
          sb.push('</div>')
        }
        sb.push('</div>')
      }

      that.permChangeSummary = sb.join('')
    },
    onSelectIcon () {
      this.modalVisible.icon = true
    },
    onSelectedIcon (icon) {
      this.modalVisible.icon = false
      this.modalData.icon = icon
      this.form.setFieldsValue({ icon: icon })
    },
    onCheckPerm (checkedKeys, info) {
      this.checkedPermList = [...checkedKeys.checked]
      this.rePermStats()
    },
    onSelectPerm (selectedKeys, info) {
      const sId = info.node.dataRef.key
      if (this.checkedPermList.includes(sId)) {
        this.checkedPermList = this.checkedPermList.filter(item => item !== sId)
      } else {
        this.checkedPermList = [...this.checkedPermList, ...selectedKeys]
      }
      this.rePermStats()
    },
    onSearchPerm (value, event) {
      this.permSearchMode = true
      const that = this
      that.$http.get('/api/1/perm/perm_search_full_list.json?key=' + encodeURIComponent(value)).then(function (resp) {
        that.permListSearch = that.mapTreeData(resp.result)
        that.checkedPermListSearch = [...that.checkedPermList]
        let expandKeys = []
        that.generateExpandKeys(expandKeys, resp.result)
        that.expandedPermSearchKeys = [...expandKeys]
      })
    },
    onSearchPermBack () {
      this.permSearchMode = false
    },
    onCheckPermSearch (checkedKeys, info) {
      this.checkedPermListSearch = [...checkedKeys.checked]
      this.checkedPermList = [...this.checkedPermList, ...this.checkedPermListSearch]
      this.rePermStats()
    },
    onSelectPermSearch (selectedKeys, info) {
      if (info.selected && selectedKeys.length > 0) {
        this.checkedPermListSearch = [...this.checkedPermListSearch, ...selectedKeys]
        this.checkedPermList = [...this.checkedPermList, ...this.checkedPermListSearch]
      } else {
        this.checkedPermListSearch = this.checkedPermListSearch.filter(item => item !== info.node.dataRef.key)
        this.checkedPermList = this.checkedPermList.filter(item => item !== info.node.dataRef.key)
      }
      this.rePermStats()
    },
    onExpandPermSearch (expandedKeys, info) {
      this.expandedPermSearchKeys = expandedKeys
    },
    onSubmit () {
      const that = this
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        const perms = that.checkedPermList
        let data = that.form.getFieldsValue()
        //
        data.parentId = that.modalData.parent_id
        data.permIds = perms.join(',')
        //
        that.modalLoading = true
        that.$http.post('/api/1/module/add_sub_module.json', qs.stringify(data)).then(function (resp) {
          that.modalLoading = false
          that.$message.success('添加模块成功')
          that.$emit('success')
        })
      })
    },
    mapTreeSelectData (result, list, skipModuleIds) {
      const that = this
      if (!list) {
        return
      }
      list.forEach(function (item) {
        if (!skipModuleIds.includes(item.id)) {
          let o = { value: item.id, title: item.name, children: [] }
          that.mapTreeSelectData(o.children, item.children, skipModuleIds)
          result.push(o)
        }
      })
    },
    mapSelectData (list) {
      return list.map(item => {
        return {
          value: item.id,
          label: item.name
        }
      })
    },
    mapTreeData (list) {
      const that = this
      if (!list) {
        return []
      }
      return list.map(item => {
        return {
          key: item.id,
          title: item.name,
          isLeaf: !item.hasChildren,
          children: that.mapTreeData(item.children)
        }
      })
    },
    mapTreeDataKV (result, list) {
      const that = this
      if (!list) {
        return
      }
      list.forEach(item => {
        result[item.id] = { key: item.id, title: item.name, isLeaf: !item.hasChildren }
        if (item.hasChildren) {
          that.mapTreeDataKV(result, item.children)
        }
      })
    },
    generateExpandKeys (result, list) {
      const that = this
      if (!list) {
        return
      }
      list.forEach(item => {
        if (item.hasChildren) {
          result.push(item.id)
          that.generateExpandKeys(result, item.children)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
