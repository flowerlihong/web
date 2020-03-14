<template>
    <page-view title="流程管理">
        <!-- action -->
        <template slot="action">
            <a-button @click="onRefreshWorkflow" style="margin-right:6px"><a-icon type="redo"/>刷新流程定义</a-button>
            <a-button type="primary" @click="onAddWF"><a-icon type="deployment-unit"/>新建流程</a-button>
        </template>
        <a-card :bordered="false">
        <a-row :gutter="16" class="tree-container">
            <a-col :xl="6" :xxl="4">
                <div :style="{ height: treeHeight + 'px' }" style="overflow-y:auto;overflow-x:hidden;">
                <a-tree showLine showIcon :selectedKeys.sync="treeSelectedKeys" :expandedKeys="treeExpandedKeys" @expand="onTreeExpand" :autoExpandParent="autoExpandParent" :loadData="onTreeLoadData" :treeData="treeData" @select="onSelect" @rightClick="onTreeRightClick" @load="onTreeLoad">
                    <template slot="customIcon" slot-scope="{dataRef}">
                        <img v-if="dataRef.key === 'WFProc_0'" src="/img/xwf/k.gif"/>
                        <img v-else-if="dataRef.key === 'WFCate_0'" src="/img/org/root.gif"/>
                        <img v-else-if="dataRef.key === 'WFOpinion_0'" src="/img/org/new2.png"/>
                        <img v-else-if="dataRef.key === 'WFOSCate_0'" src="/img/org/plugin.png"/>
                        <img v-else src="/img/org/cube.gif"/>
                    </template>
                </a-tree>
                </div>
            </a-col>
            <a-col :xl="18" :xxl="20">
                <!-- 流程列表 -->
                <div v-show="visible.processList">
                    <div style="margin-bottom:6px">
                        <a-form layout="inline">
                            <a-form-item>
                                <a-input placeholder="流程名称" v-model="data.queryParam.name" @pressEnter="onSearchWorkflow">
                                    <a-icon slot="prefix" type="share-alt" style="color:rgba(0,0,0,.25)"/>
                                </a-input>
                            </a-form-item>
                            <a-form-item>
                                <a-select style="width:93px" placeholder="状态" allowClear @change="onChangeWFQueryState">
                                    <a-select-option value="U">使用中</a-select-option>
                                    <a-select-option value="E">编辑中</a-select-option>
                                    <a-select-option value="S">已停用</a-select-option>
                                </a-select>
                            </a-form-item>
                            <a-form-item>
                                <a-button type="primary" @click="onSearchWorkflow">查询</a-button>
                            </a-form-item>
                        </a-form>
                    </div>
                    <s-table ref="processList"
                             :columns="column.processList"
                             :rowKey="record => record.id"
                             :data="data.processList"
                             size="middle">
                        <a slot="name" slot-scope="record" @click.stop="onProcessClick(record, $event)">{{record.name}}</a>
                        <template slot="belong" slot-scope="record">
                            <span v-if="record.extras.belong.length === 1">{{record.extras.belong.join(', ')}}</span>
                            <a-tooltip v-else placement="right">
                                <template slot="title">
                                    <span v-for="(item, index) in record.extras.belong" :key="index">
                                        <span>{{index + 1}}. {{item}}</span><br v-if="index + 1 < record.extras.belong.length"/>
                                    </span>
                                </template>
                                多机构共用 <a-icon type="question-circle" style="color:rgba(0,0,0,.25)"/>
                            </a-tooltip>
                        </template>
                        <template slot="cate" slot-scope="record">{{record.extras.cate.join(', ')}}</template>
                        <template slot="state" slot-scope="record">
                            <a-tag v-if="record.state === 'U'" color="green">{{record.extras.state}}</a-tag>
                            <a-tag v-else-if="record.state === 'S'" color="red">{{record.extras.state}}</a-tag>
                            <a-tag v-else color="blue">{{record.extras.state}}</a-tag>
                        </template>
                    </s-table>
                </div>
                <!-- 文档类别摘要 -->
                <div v-show="visible.cateSummary">
                    <a-table :columns="column.cateSummary" :dataSource="data.cateSummary" :rowKey="record => record.id" bordered>
                        <a slot="cateRoot" slot-scope="record" @click="loadCateList(record.id)">{{record.name}}</a>
                        <template slot="cateList" slot-scope="record">
                            <a-tag class="cate-tag" v-for="cate in record.extras.cateList" :key="cate.id" @click="onEditCate(cate.id)">{{cate.name}}</a-tag>
                        </template>
                    </a-table>
                </div>
                <!-- 意见类型 -->
                <div v-show="visible.opinionTypeSummary">
                    <div style="margin-bottom: 10px"><a-button type="primary" @click="onOpinionTypeAdd">添加意见类型</a-button></div>
                    <a-table :columns="column.opinionType" :dataSource="data.opinionTypeList" :rowKey="record => record.id" bordered>
                        <a slot="name" slot-scope="record" @click="onOpinionTypeEdit(record.id)">{{record.typeValue}}</a>
                        <template slot="opinionList" slot-scope="record">
                            <a-tag class="cate-tag" v-for="opinion in record.extras.opinionList" :key="opinion.id" @click="onEditOpinionDefault(opinion.id)">{{opinion.default_value}}</a-tag>
                        </template>
                        <span slot="action" slot-scope="text, record">
                            <a-button type="primary" size="small" @click="onAddOpinionDefault(record)">添加常用意见</a-button>
                        </span>
                    </a-table>
                </div>
                <!-- 文档目录下类别列表 -->
                <div v-show="visible.cateList">
                    <a-row :gutter="16">
                        <a-col :xl="12" :xxl="8" v-for="cate in data.cateList" :key="cate.id">
                            <a-card :title="cate.name" class="cate-card">
                                <a @click="onEditCate(cate.id)" slot="extra">编辑</a>
                                <p>类别名称：{{cate.name}}</p>
                                <p>查看页面：{{cate.url}}</p>
                                <p>描述信息：{{cate.description}}</p>
                            </a-card>
                        </a-col>
                    </a-row>
                </div>
                <!-- 意见服务分类摘要 -->
                <div v-show="visible.osCateSummary">
                    <a-table :columns="column.osCateSummary" :dataSource="data.osCateSummary" :rowKey="record => record.id" bordered>
                        <a slot="cateRoot" slot-scope="record" @click="loadOSCateList(record.id)">{{record.name}}</a>
                        <template slot="summaryList" slot-scope="record">
                            <div v-if="record.extras.aliasList.length > 0">
                                <span><a-icon type="file-text" theme="twoTone" twoToneColor="#52c41a"/>&nbsp;意见</span>&nbsp;<a-tag class="cate-tag" v-for="alias in record.extras.aliasList" :key="alias.id" @click="onOpinionAliasEdit(alias.id)">{{alias.aliasName}}</a-tag>
                            </div>
                            <a-divider dashed style="margin: 14px 0;" v-if="record.extras.aliasList.length > 0 && record.extras.serviceList.length > 0"/>
                            <div v-if="record.extras.serviceList.length > 0">
                                <span><a-icon type="thunderbolt" theme="twoTone" twoToneColor="#eb2f96"/>&nbsp;服务</span>&nbsp;<a-tag class="cate-tag" v-for="service in record.extras.serviceList" :key="service.id" @click="onServiceEdit(service.id)">{{service.name}}</a-tag>
                            </div>
                        </template>
                    </a-table>
                </div>
                <!-- 意见服务分类列表 -->
                <div v-show="visible.osCateList">
                    <a-table :columns="column.osCateList" :dataSource="data.osCateList" :rowKey="record => record.id" bordered>
                        <template slot="summaryList" slot-scope="record">
                            <div v-if="record.extras.aliasList.length > 0">
                                <span><a-icon type="file-text" theme="twoTone" twoToneColor="#52c41a"/>&nbsp;意见</span>&nbsp;<a-tag class="cate-tag" v-for="alias in record.extras.aliasList" :key="alias.id" @click="onOpinionAliasEdit(alias.id)">{{alias.aliasName}}</a-tag>
                            </div>
                            <a-divider dashed style="margin: 14px 0;" v-if="record.extras.aliasList.length > 0 && record.extras.serviceList.length > 0"/>
                            <div v-if="record.extras.serviceList.length > 0">
                                <span><a-icon type="thunderbolt" theme="twoTone" twoToneColor="#eb2f96"/>&nbsp;服务</span>&nbsp;<a-tag class="cate-tag" v-for="service in record.extras.serviceList" :key="service.id" @click="onServiceEdit(service.id)">{{service.name}}</a-tag>
                            </div>
                        </template>
                    </a-table>
                </div>
            </a-col>
        </a-row>

        <!-- menu start -->

        <ul id="procMenu" v-show="treeMenu.procVisible" class="dropdown-menu context-menu"
                            :style="{left:treeMenu.positionX + 'px', top:treeMenu.positionY + 'px'}"
                            v-on-clickaway='onProcessMenuClickaway'>
            <li class="ctx-menu"><a @click="onProcessCateEdit"><img src="/img/xwf/cateb.gif" align="absmiddle">关联文档</a></li>
            <li v-show="treeMenu.procMenu.start" class="ctx-menu"><a @click="onProcessStart"><img src="/img/xwf/use.gif" align="absmiddle">启用流程</a></li>
            <li v-show="treeMenu.procMenu.stop" class="ctx-menu"><a @click="onProcessStop"><img src="/img/xwf/stop.gif" align="absmiddle">停用流程</a></li>
            <li v-show="treeMenu.procMenu.delete" class="ctx-menu"><a @click="onProcessDelete"><img src="/img/xwf/trash.gif" align="absmiddle">删除流程</a></li>
        </ul>

        <ul id="cateMenu" v-show="treeMenu.cateVisible" :style="{left:treeMenu.positionX + 'px', top:treeMenu.positionY + 'px'}" class="dropdown-menu context-menu">
            <li v-show="treeMenu.rootVisible" class="va-root"><a @click="onAddRootCate()"><img src="/img/org/edit.gif" align="absmiddle">增加文档目录</a></li>
            <li v-show="treeMenu.subVisible" class="va-sub"><a @click="onEditRootCate()"><img src="/img/org/edit.gif" align="absmiddle">修改目录</a></li>
            <li v-show="treeMenu.subVisible" class="va-sub"><a @click="onDelRootCate()"><img src="/img/org/del.gif" align="absmiddle">删除目录</a></li>
            <li v-show="treeMenu.subVisible" class="va-sub"><a @click="onAddCate()"><img src="/img/org/new.png" align="absmiddle">增加文档类别</a></li>
        </ul>

        <ul id="classMenu" v-show="treeMenu.classVisible" :style="{left:treeMenu.positionX + 'px', top:treeMenu.positionY + 'px'}" class="dropdown-menu context-menu">
            <li v-show="treeMenu.rootVisible" class="va-root"><a @click="onAddCSCateRoot()" class="va-root"><img src="/img/org/edit.gif" align="absmiddle">增加分类目录</a></li>
            <li v-show="treeMenu.subVisible" class="va-sub"><a @click="onEditCSCateRoot()"><img src="/img/org/edit.gif" align="absmiddle">修改目录</a></li>
            <li v-show="treeMenu.subVisible" class="va-sub"><a @click="onDelCSCateRoot()"><img src="/img/org/del.gif" align="absmiddle">删除目录</a></li>
            <li v-show="treeMenu.subVisible" class="va-sub"><a @click="onOpinionAliasAdd()"><img src="/img/org/new.png" align="absmiddle">增加意见</a></li>
            <li v-show="treeMenu.subVisible" class="va-sub"><a @click="onServiceAdd()"><img src="/img/org/plugin.png" align="absmiddle">增加服务</a></li>
        </ul>

        <!-- / menu end -->

        <!-- modal start -->
        <DocCateRootAdd ref="cateRootAdd" :visible="modalVisible.cateRootAdd" @success="onCateRootAddSuccess" @cancel="onCateRootAddCancel" />
        <DocCateRootEdit ref="cateRootEdit" :visible="modalVisible.cateRootEdit" @success="onCateRootEditSuccess" @cancel="onCateRootEditCancel" />
        <DocCateAdd ref="cateAdd" :visible="modalVisible.cateAdd" @success="onCateAddSuccess" @cancel="onCateAddCancel" />
        <DocCateEdit ref="cateEdit" :visible="modalVisible.cateEdit" @success="onCateEditSuccess" @cancel="onCateEditCancel" />
        <OpinionTypeAdd ref="opinionTypeAdd" :visible="modalVisible.opinionTypeAdd" @success="onOpinionTypeAddSuccess" @cancel="onOpinionTypeAddCancel" />
        <OpinionTypeEdit ref="opinionTypeEdit" :visible="modalVisible.opinionTypeEdit" @success="onOpinionTypeEditSuccess" @cancel="onOpinionTypeEditCancel" />
        <OpinionDefaultAdd ref="opinionDefaultAdd" :visible="modalVisible.opinionDefaultAdd" @success="onOpinionDefaultAddSuccess" @cancel="onOpinionDefaultAddCancel" />
        <OpinionDefaultEdit ref="opinionDefaultEdit" :visible="modalVisible.opinionDefaultEdit" @success="onOpinionDefaultEditSuccess" @cancel="onOpinionDefaultEditCancel" />
        <CSCateRootAdd ref="csCateRootAdd" :visible="modalVisible.csCateRootAdd" @success="onCSCateRootAddSuccess" @cancel="onCSCateRootAddCancel" />
        <CSCateRootEdit ref="csCateRootEdit" :visible="modalVisible.csCateRootEdit" @success="onCSCateRootEditSuccess" @cancel="onCSCateRootEditCancel" />
        <OpinionAliasAdd ref="opinionAliasAdd" :visible="modalVisible.opinionAliasAdd" @success="onOpinionAliasAddSuccess" @cancel="onOpinionAliasAddCancel" />
        <OpinionAliasEdit ref="opinionAliasEdit" :visible="modalVisible.opinionAliasEdit" @success="onOpinionAliasEditSuccess" @cancel="onOpinionAliasEditCancel" />
        <ServiceAdd ref="serviceAdd" :visible="modalVisible.serviceAdd" @success="onServiceAddSuccess" @cancel="onServiceAddCancel" />
        <ServiceEdit ref="serviceEdit" :visible="modalVisible.serviceEdit" @success="onServiceEditSuccess" @cancel="onServiceEditCancel" />
        <ProcessCateEdit ref="processCateEdit" :visible="modalVisible.processCateEdit" @success="onProcessCateEditSuccess" @cancel="onProcessCateEditCancel" />
        <WFAdd ref="wfAdd" :visible="modalVisible.wfAdd" @success="onWFAddSuccess" @cancel="onWFAddCancel" />
        <!-- /modal end -->

    </a-card>
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import CSCateRootAdd from './CSCateRootAdd'
import CSCateRootEdit from './CSCateRootEdit'
import DocCateRootAdd from './DocCateRootAdd'
import DocCateRootEdit from './DocCateRootEdit'
import DocCateAdd from './DocCateAdd'
import DocCateEdit from './DocCateEdit'
import OpinionTypeAdd from './OpinionTypeAdd'
import OpinionTypeEdit from './OpinionTypeEdit'
import OpinionDefaultAdd from './OpinionDefaultAdd'
import OpinionDefaultEdit from './OpinionDefaultEdit'
import OpinionAliasAdd from './OpinionAliasAdd'
import OpinionAliasEdit from './OpinionAliasEdit'
import ServiceAdd from './ServiceAdd'
import ServiceEdit from './ServiceEdit'
import ProcessCateEdit from './ProcessCateEdit'
import STable from '@/components/Table'
import qs from 'qs'
import { mixin as clickaway } from 'vue-clickaway'
import WFAdd from './editor/WFAdd'

export default {
  name: 'WorkflowPanel',
  mixins: [clickaway],
  inject: ['reload'],
  components: {
    PageView,
    STable,
    DocCateRootAdd,
    DocCateRootEdit,
    DocCateAdd,
    DocCateEdit,
    CSCateRootAdd,
    CSCateRootEdit,
    OpinionTypeAdd,
    OpinionTypeEdit,
    OpinionDefaultAdd,
    OpinionDefaultEdit,
    OpinionAliasAdd,
    OpinionAliasEdit,
    ServiceAdd,
    ServiceEdit,
    ProcessCateEdit,
    WFAdd
  },
  mounted () {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResizeWindow)
    })
    this.onResizeWindow()
  },
  created () {
    this.onInitTree()
    this.showInitPage()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResizeWindow)
  },
  data () {
    return {
      // -----------------------
      treeHeight: 600,
      treeMenu: {
        procVisible: false,
        cateVisible: false,
        classVisible: false,
        positionX: 0,
        positionY: 0,
        procMenu: {
          start: false,
          stop: false,
          delete: false
        },
        procData: {
        }
      },
      visible: {
        processList: false,
        cateSummary: false,
        cateList: false,
        opinionTypeSummary: false,
        osCateSummary: false,
        osCateList: false
      },
      modalVisible: {
        cateRootAdd: false,
        cateRootEdit: false,
        cateAdd: false,
        cateEdit: false,
        csCateRootAdd: false,
        csCateRootEdit: false,
        opinionTypeAdd: false,
        opinionTypeEdit: false,
        opinionDefaultAdd: false,
        opinionDefaultEdit: false,
        opinionAliasAdd: false,
        opinionAliasEdit: false,
        serviceAdd: false,
        serviceEdit: false,
        processCateEdit: false,
        wfAdd: false
      },
      // ------------------------
      autoExpandParent: true,
      treeSelectedKeys: [],
      treeExpandedKeys: [],
      treeData: [],
      selectedId: null,
      column: {
        processList: [
          {
            title: '目录名称',
            key: 'name',
            scopedSlots: { customRender: 'name' }
          },
          {
            title: '所属',
            key: 'belong',
            scopedSlots: { customRender: 'belong' }
          },
          {
            title: '版本',
            key: 'version',
            dataIndex: 'version'
          },
          {
            title: '文档类别',
            key: 'cate',
            scopedSlots: { customRender: 'cate' }
          },
          {
            title: '状态',
            key: 'state',
            scopedSlots: { customRender: 'state' }
          }
        ],
        cateSummary: [
          {
            title: '目录名称',
            key: 'name',
            scopedSlots: { customRender: 'cateRoot' },
            width: '180px'
          },
          {
            title: '类别列表',
            key: 'cate',
            scopedSlots: { customRender: 'cateList' }
          }
        ],
        opinionType: [
          {
            title: '意见类型',
            key: 'name',
            scopedSlots: { customRender: 'name' },
            width: '180px'
          },
          {
            title: '常用批语',
            key: 'opinion',
            scopedSlots: { customRender: 'opinionList' }
          },
          {
            title: '操作',
            width: '150px',
            className: 'text-center',
            scopedSlots: { customRender: 'action' }
          }
        ],
        osCateSummary: [
          {
            title: '分类名称',
            key: 'name',
            scopedSlots: { customRender: 'cateRoot' },
            width: '180px'
          },
          {
            title: '意见服务一览表',
            key: 'cate',
            scopedSlots: { customRender: 'summaryList' }
          }
        ],
        osCateList: [
          {
            title: '意见服务一览表',
            key: 'cate',
            scopedSlots: { customRender: 'summaryList' }
          }
        ]
      },
      data: {
        cateSummary: [],
        cateList: [],
        opinionTypeList: [],
        osCateSummary: [],
        osCateList: [],
        queryParam: {
          name: null,
          state: 'NF',
          processList: {
          }
        },
        processList: parameter => {
          const that = this
          return that.$http.get('/api/1/workflow/design/get_process_list.json', { params: Object.assign(parameter, that.data.queryParam),
            paramsSerializer: function (params) {
              return qs.stringify(params, { indices: false })
            }
          }).then(res => {
            return res
          })
        }
      }
    }
  },
  methods: {
    onChangeWFQueryState (value) {
      this.data.queryParam.state = value
      this.onSearchWorkflow()
    },
    onSearchWorkflow () {
      this.$refs.processList.refresh(true)
    },
    onResizeWindow () {
      this.treeHeight = window.innerHeight - 260
    },
    reloadTree () {
      this.treeExpandedKeys = []
      this.treeData = []
      this.onInitTree()
    },
    onTreeLoadData (treeNode) {
      return new Promise((resolve) => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }

        let that = this
        this.$http.get('/api/1/workflow/design/xwf_panel.json?id=' + treeNode.dataRef.key).then(function (response) {
          treeNode.dataRef.children = that.mapTreeData(response.result)
          that.treeData = [...that.treeData]
          resolve()
        })
      })
    },
    onInitTree () {
      let that = this
      this.$http.get('/api/1/workflow/design/xwf_panel.json').then(function (response) {
        that.treeData = that.mapTreeData(response.result)
        if (response.result.length > 0) {
          that.treeExpandedKeys = ['WFCate_0', 'WFOSCate_0']
        }
      })
    },
    onTreeLoad (loadedKeys) {
      if (loadedKeys.length === 1) {
      }
    },
    onSelect (selectedKeys, info) {
      const key = info.node.dataRef.key

      this.hideContextMenu()

      if (selectedKeys.length === 0) {
        return
      }

      let tmp = key.split('_')
      let type = tmp[0]
      let id = tmp[1]

      this.selectedId = id

      if (type === 'WFProc') {
        this.loadProcessList()
      } else if (type === 'WFCate') {
        if (id === '0') {
          this.loadCateSummary()
        } else {
          this.loadCateList(this.selectedId)
        }
      } else if (type === 'WFOpinion') {
        this.loadOpinionTypeSummary()
      } else if (type === 'WFOSCate') {
        if (id === '0') {
          this.loadOSCateSummary()
        } else {
          this.loadOSCateList(this.selectedId)
        }
      }
    },
    onTreeExpand (expandedKeys) {
      this.hideContextMenu()
      this.treeExpandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onTreeRightClick (info) {
      // 隐藏所有右键菜单
      this.hideContextMenu()
      //
      let tmp = info.node.dataRef.key.split('_')
      let type = tmp[0]
      let id = tmp[1]

      let rect = info.event.currentTarget.getBoundingClientRect()

      this.treeMenu.positionX = rect.left
      this.treeMenu.positionY = rect.top + 23

      this.selectedId = id

      if (type === 'WFCate') {
        this.showCateContextMenu(id)
      } else if (type === 'WFOSCate') {
        this.showClassContextMenu(id)
      }
    },
    onReloadPage () {
      // this.$router.go(0)
      this.reload()
    },
    onRefreshWorkflow () {
      const that = this
      this.$confirm({
        title: '是否确定刷新内存流程定义？',
        onOk () {
          that.$http.get('/api/1/workflow/design/refresh_workflow.json').then(function () {
            that.$message.success('操作成功')
            that.onReloadPage()
          })
        }
      })
    },
    // -------------- 用户事件 --------------
    onProcessClick (record, event) {
      this.treeMenu.procVisible = true

      let rect = event.currentTarget.getBoundingClientRect()

      this.treeMenu.positionX = rect.left
      this.treeMenu.positionY = rect.top + 18

      this.treeMenu.procData = record

      this.hideProcMenu()

      if (record.state === 'U') {
        // 使用中的就只有停用选择
        this.treeMenu.procMenu.stop = true
      } else if (record.state === 'S') {
        // 停用
        this.treeMenu.procMenu.start = true
      } else if (record.state === 'E') {
        // 编辑
        this.treeMenu.procMenu.start = true
        this.treeMenu.procMenu.delete = true
      }
    },
    onProcessMenuClickaway () {
      this.treeMenu.procVisible = false
    },
    onProcessCateEdit () {
      this.hideContextMenu()
      this.modalVisible.processCateEdit = true
      this.$refs.processCateEdit.preProcessCateEdit(this.treeMenu.procData.id)
    },
    onProcessCateEditSuccess () {
      this.onReloadPage()
    },
    onProcessCateEditCancel () {
      this.modalVisible.processCateEdit = false
    },
    onProcessStart () {
      this.changeProcessState('是否确认启用流程 [' + this.treeMenu.procData.name + '] ？', this.treeMenu.procData.id, 'U')
    },
    onProcessStop () {
      this.changeProcessState('是否确认停用流程 [' + this.treeMenu.procData.name + '] ？', this.treeMenu.procData.id, 'S')
    },
    changeProcessState (title, procId, state) {
      const that = this
      this.$confirm({
        title: title,
        onOk () {
          that.$http.post('/api/1/workflow/change_process_state.json', qs.stringify({ id: procId, state: state })).then(function () {
            that.$message.success('操作成功')
            that.onReloadPage()
          })
        }
      })
    },
    onProcessDelete () {
      const that = this
      this.$confirm({
        title: '是否确认删除流程 [ ' + this.treeMenu.procData.name + ' ] ？',
        onOk () {
          that.$http.post('/api/1/workflow/delete_process.json', qs.stringify({ id: that.treeMenu.procData.id })).then(function () {
            that.$message.success('操作成功')
            that.onReloadPage()
          })
        }
      })
    },
    hideProcMenu () {
      for (let key in this.treeMenu.procMenu) {
        this.treeMenu.procMenu[key] = false
      }
    },
    onAddRootCate () {
      this.hideContextMenu()
      this.modalVisible.cateRootAdd = true
      this.$refs.cateRootAdd.preCateRootAdd()
    },
    onCateRootAddSuccess () {
      this.onReloadPage()
    },
    onCateRootAddCancel () {
      this.modalVisible.cateRootAdd = false
    },
    onEditRootCate () {
      this.hideContextMenu()
      this.modalVisible.cateRootEdit = true
      this.$refs.cateRootEdit.preCateRootEdit(this.selectedId)
    },
    onCateRootEditSuccess () {
      this.onReloadPage()
    },
    onCateRootEditCancel () {
      this.modalVisible.cateRootEdit = false
    },
    onDelRootCate () {
      const that = this
      this.$confirm({
        title: '是否确认删除文档目录？',
        content: '删除文档目录会删除其子文档目录也一并删除',
        onOk () {
          that.hideContextMenu()
          that.$http.post('/api/1/workflow/cate/delete_doc_root.json', qs.stringify({ id: that.selectedId })).then(function () {
            that.$message.success('操作成功')
            that.onReloadPage()
          })
        }
      })
    },
    onAddCate () {
      this.hideContextMenu()
      this.modalVisible.cateAdd = true
      this.$refs.cateAdd.preCateAdd(this.selectedId)
    },
    onCateAddSuccess () {
      this.onReloadPage()
    },
    onCateAddCancel () {
      this.modalVisible.cateAdd = false
    },
    onEditCate (id) {
      this.modalVisible.cateEdit = true
      this.$refs.cateEdit.preCateEdit(id)
    },
    onCateEditSuccess () {
      this.onReloadPage()
    },
    onCateEditCancel () {
      this.modalVisible.cateEdit = false
    },
    onAddCSCateRoot () {
      this.hideContextMenu()
      this.modalVisible.csCateRootAdd = true
      this.$refs.csCateRootAdd.preCSCateRootAdd()
    },
    onCSCateRootAddSuccess () {
      this.onReloadPage()
    },
    onCSCateRootAddCancel () {
      this.modalVisible.csCateRootAdd = false
    },
    onEditCSCateRoot () {
      this.hideContextMenu()
      this.modalVisible.csCateRootEdit = true
      this.$refs.csCateRootEdit.preCSCateRootEdit(this.selectedId)
    },
    onCSCateRootEditSuccess () {
      this.onReloadPage()
    },
    onCSCateRootEditCancel () {
      this.modalVisible.csCateRootEdit = false
    },
    onDelCSCateRoot () {
      const that = this
      this.$confirm({
        title: '是否确认删除分类目录？',
        onOk () {
          that.hideContextMenu()
          that.$http.post('/api/1/workflow/cate/delete_os_root.json', qs.stringify({ id: that.selectedId })).then(function () {
            that.$message.success('操作成功')
            that.onReloadPage()
          })
        }
      })
    },
    onOpinionAliasAdd () {
      this.modalVisible.opinionAliasAdd = true
      this.$refs.opinionAliasAdd.preOpinionAliasAdd(this.selectedId)
    },
    onOpinionAliasAddSuccess () {
      this.onReloadPage()
    },
    onOpinionAliasAddCancel () {
      this.modalVisible.opinionAliasAdd = false
    },
    onOpinionAliasEdit (id) {
      this.modalVisible.opinionAliasEdit = true
      this.$refs.opinionAliasEdit.preOpinionAliasEdit(id)
    },
    onOpinionAliasEditSuccess () {
      this.onReloadPage()
    },
    onOpinionAliasEditCancel () {
      this.modalVisible.opinionAliasEdit = false
    },
    onServiceAdd () {
      this.hideContextMenu()
      this.modalVisible.serviceAdd = true
      this.$refs.serviceAdd.preServiceAdd(this.selectedId)
    },
    onServiceAddSuccess () {
      this.onReloadPage()
    },
    onServiceAddCancel () {
      this.modalVisible.serviceAdd = false
    },
    onServiceEdit (id) {
      this.hideContextMenu()
      this.modalVisible.serviceEdit = true
      this.$refs.serviceEdit.preServiceEdit(id)
    },
    onServiceEditSuccess () {
      this.onReloadPage()
    },
    onServiceEditCancel () {
      this.modalVisible.serviceEdit = false
    },
    onOpinionTypeAdd () {
      this.modalVisible.opinionTypeAdd = true
    },
    onOpinionTypeAddSuccess () {
      this.onReloadPage()
    },
    onOpinionTypeAddCancel () {
      this.modalVisible.opinionTypeAdd = false
    },
    onOpinionTypeEdit (id) {
      this.modalVisible.opinionTypeEdit = true
      this.$refs.opinionTypeEdit.preOpinionTypeEdit(id)
    },
    onOpinionTypeEditSuccess () {
      this.onReloadPage()
    },
    onOpinionTypeEditCancel () {
      this.modalVisible.opinionTypeEdit = false
    },
    onAddOpinionDefault (opinionType) {
      this.modalVisible.opinionDefaultAdd = true
      this.$refs.opinionDefaultAdd.preOpinionDefaultAdd(opinionType.id)
    },
    onOpinionDefaultAddSuccess () {
      this.onReloadPage()
    },
    onOpinionDefaultAddCancel () {
      this.modalVisible.opinionDefaultAdd = false
    },
    onEditOpinionDefault (id) {
      this.modalVisible.opinionDefaultEdit = true
      this.$refs.opinionDefaultEdit.preOpinionDefaultEdit(id)
    },
    onOpinionDefaultEditSuccess () {
      this.onReloadPage()
    },
    onOpinionDefaultEditCancel () {
      this.modalVisible.opinionDefaultEdit = false
    },
    // -------------- 树菜单右键操作 --------------
    showCateContextMenu (id) {
      this.treeMenu.cateVisible = true
      this.treeMenu.rootVisible = false
      this.treeMenu.subVisible = false

      if (id === '0') {
        // 点击了根节点
        this.treeMenu.rootVisible = true
      } else {
        this.treeMenu.subVisible = true
      }
    },
    showClassContextMenu (id) {
      this.treeMenu.classVisible = true
      this.treeMenu.rootVisible = false
      this.treeMenu.subVisible = false

      if (id === '0') {
        // 点击了根节点
        this.treeMenu.rootVisible = true
      } else {
        this.treeMenu.subVisible = true
      }
    },
    hideContextMenu () {
      this.treeMenu.cateVisible = false
      this.treeMenu.classVisible = false
    },
    hideRightContent () {
      for (let key in this.visible) {
        this.visible[key] = false
      }
    },
    mapTreeData (list) {
      return list.map(item => {
        return {
          key: item.id,
          title: item.name,
          type: item.type,
          isLeaf: !item.hasChildren,
          scopedSlots: { icon: 'customIcon' }
        }
      })
    },
    showInitPage () {
      const that = this
      that.hideRightContent()
      that.visible.processList = true
    },
    loadProcessList () {
      this.showInitPage()
      this.$refs.processList.refresh()
    },
    loadCateSummary () {
      const that = this
      that.hideRightContent()
      that.visible.cateSummary = true
      that.$http.get('/api/1/workflow/cate/get_doc_root_summary.json').then(function (resp) {
        that.data.cateSummary = resp.result
      })
    },
    loadCateList (cateRootId) {
      const that = this
      that.hideRightContent()
      that.visible.cateList = true
      that.$http.get('/api/1/workflow/cate/get_doc_list.json?parentId=' + cateRootId).then(function (resp) {
        that.data.cateList = resp.result
      })
    },
    loadOpinionTypeSummary () {
      const that = this
      that.hideRightContent()
      that.visible.opinionTypeSummary = true
      that.$http.get('/api/1/workflow/cate/get_opinion_type_list.json?pageSize=999').then(function (resp) {
        that.data.opinionTypeList = resp.result
      })
    },
    loadOSCateSummary () {
      const that = this
      that.hideRightContent()
      that.visible.osCateSummary = true
      that.$http.get('/api/1/workflow/cate/get_os_root_summary.json').then(function (resp) {
        that.data.osCateSummary = resp.result
      })
    },
    loadOSCateList (id) {
      const that = this
      that.treeSelectedKeys = ['WFOSCate_' + id]
      that.hideRightContent()
      that.visible.osCateList = true
      that.$http.get('/api/1/workflow/cate/get_os_root.json?id=' + id).then(function (resp) {
        let list = []
        list.push(resp.result)
        that.data.osCateList = list
      })
    },
    onAddWF () {
      this.modalVisible.wfAdd = true
      this.$refs.wfAdd.preWFAdd()
    },
    onWFAddSuccess () {
      console.log('onWFAddSuccess')
    },
    onWFAddCancel () {
      this.modalVisible.wfAdd = false
    }
  }
}
</script>

<style scoped>
    .ctx-menu {
        padding: 2px 0;
    }

    .cate-table > tr > td {
        padding-bottom: 8px !important;
    }

    .cate-tag {
        font-size: 14px;
        line-height: 22px;
        height: 24px;
        margin: 8px 8px 8px 0;
    }

    .dropdown-menu li a {
        padding-left: 6px;
        padding-right: 10px;
    }

    .dropdown-menu img {
        margin: 0 4px 2px 4px;
    }

    .dropdown-menu {
        background: #fafafa;
        position: fixed;
        z-index: 1000;
        /*display: none;*/
        top: 300px;
        left: 300px;
        padding: 5px 0;
        margin: 2px 0 0;
        font-size: 14px;
        text-align: left;
        list-style: none;
        border: 1px solid #eee;
        border-radius: 4px;
        box-shadow: none;
    }

    .cate-card {
        margin-bottom: 16px;
    }
</style>
