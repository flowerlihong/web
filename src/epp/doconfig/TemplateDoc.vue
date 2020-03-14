<template>
    <page-view title="公文模板">
        <template slot="action">
            <a-button-group>
                <a-button @click="onAddModel"><a-icon type="plus-circle"/>添加新的模板</a-button>
                 <a-popconfirm title="是否确认删除所选模板?" @confirm="onDelModel(id)">
                    <a-button  type="danger"><a-icon type="delete"/>删除所选模板</a-button>
                </a-popconfirm>
            </a-button-group>
        </template>
        <a-card>
            <table>
                  <tr>
                        <th>所属机构</th>
                        <td>
                            <a-form-item>
                               <org-selector @change="onUserChange" v-model="queryForm.orgId" multiple/>
                            </a-form-item>
                        </td>
                        <th>模板名称</th>
                        <td>
                            <a-form-item>
                                 <a-input v-model="queryForm.modelName" style="width:300px"></a-input>
                            </a-form-item>
                        </td>
                        <th class="search">
                          <a-button type="primary" @click="onSearch">查询</a-button>
                        </th>
                    </tr>
            </table>
            <s-table
                    ref="table"
                    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                    :columns="columns"
                    :data="loadData"
                    :rowKey="record => record.id">
                <template slot="description" slot-scope="record">
                    <div v-if="record.templateName.length > 10">
                        <a @click="onView(record.templateNo)">{{record.templateName.substring(0,10)}}...</a>
                    </div>
                    <div v-else>
                        <a @click="onView(record.templateNo)">{{record.templateName}}</a>
                    </div>
                </template>
                <template slot="organsize" slot-scope=" record">
                    {{record.extras.orgName}}
                </template>
                <template slot="cate" slot-scope=" record">
                    {{record.extras.docTypeName}}
                </template>
                <template slot="updown" slot-scope="record">
                    {{record.extras.uper}}
                </template>
                <template slot="path" slot-scope="record">
                   <div v-if="record.docPath.length > 20">
                        {{record.docPath.substring(0,20)}}...
                    </div>
                    <div v-else>
                        {{record.docPath}}
                    </div>
                </template>
                <template slot="picturePath" slot-scope="record">
                   <div v-if="record.sealPath === null">
                    </div>
                    <div v-else-if="record.sealPath.length > 20">
                        {{record.sealPath.substring(0,20)}}...
                    </div>
                    <div v-else>
                        {{record.sealPath}}
                    </div>
                </template>
            </s-table>
        </a-card>
              <!-- 添加新的模板 -->
        <temp-doc-add  :visible="addDoc" @success="onAddDocSuccess" @cancel="onAddDocCancel"  ref="addDoc"/>
                <!-- 编辑模板 -->
        <temp-doc-edit :visible="editDoc" @success="onEditDocSuccess" @cancel="onEditDocCancel" ref="editDoc"/>
    </page-view>
</template>
<script>
import OrgSelector from '@/components/selector/OrgSelector'
import { PageView } from '@/layouts'
import TempDocAdd from './TempDocAdd'
import TempDocEdit from './TempDocEdit'
import STable from '@/components/Table'
import qs from 'qs'
export default {
  name: 'DriverIndex',
  components: {
    OrgSelector,
    PageView,
    STable,
    TempDocAdd,
    TempDocEdit
  },
  data () {
    return {
      addDoc: false,
      editDoc: false,
      columns: [
        {
          title: '公文模板描述',
          scopedSlots: { customRender: 'description' }
        },
        {
          title: '所属机构名称',
          scopedSlots: { customRender: 'organsize' }
        },
        {
          title: '公文类别',
          scopedSlots: { customRender: 'cate' }
        },
        {
          title: '上行文',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'updown' }
        },
        {
          title: '公文模板存放的路径',
          align: 'center',
          scopedSlots: { customRender: 'path' }
        },
        {
          title: '缮印图片存放路径',
          align: 'center',
          scopedSlots: { customRender: 'picturePath' }
        }
      ],
      selectedRowKeys: [],
      id: '',
      queryForm: {
        orgId: '',
        modelName: ''
      },
      queryParam: {
      },
      loadData: parameter => {
        return this.$http.get('/api/1/dmservices/doc_template_list.json', { params: Object.assign(parameter, this.queryParam),
          paramsSerializer: function (params) {
            return qs.stringify(params, { indices: false })
          }
        }).then(res => {
          return res
        })
      }
    }
  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      var idse = []
      var rowset = this.mapSelectData(selectedRows)
      for (var i = 0; i < rowset.length; i++) {
        idse.push(rowset[i].id)
      }
      this.id = idse.join(',')
    },
    mapSelectData (list) {
      return list.map(item => {
        return {
          id: item.templateNo
        }
      })
    },
    onView (id) {
      this.editDoc = true
      this.$refs.editDoc.editDoctemp(id)
    },
    onUserChange (selectedIds) {
      this.queryForm.orgId = selectedIds
    },
    onAddModel () {
      this.addDoc = true
      this.$refs.addDoc.addDoctemp()
    },
    onAddDocSuccess () {
      this.addDoc = false
      this.$refs.table.refresh()
    },
    onAddDocCancel () {
      this.addDoc = false
    },
    onEditDocSuccess () {
      this.editDoc = false
      this.$refs.table.refresh()
    },
    onEditDocCancel () {
      this.editDoc = false
    },
    onDelModel (id) {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请先选择要删除的公文模板配置')
        return
      }
      this.$http.get('/api/1/dmservices/del_doc_template.json?id=' + id).then(
        (resp) => {
          this.$message.success('删除成功')
          this.selectedRowKeys = []
          this.$refs.table.refresh()
        }
      )
    },
    onSearch () {
      this.queryParam = { ...this.queryForm }
      if (this.queryParam.modelName !== '' && this.queryParam.orgId === '') {
        this.$message.warning('请指定机构进行查询')
        return
      } else if (this.queryParam.modelName === '' && this.queryParam.orgId === '') {
        this.$message.warning('请指定机构进行查询')
        return
      }
      this.$refs.table.refresh()
    }
  }
}
</script>

<style scoped>
    .card {
        margin-bottom: 24px;
    }
     table th {
      padding:10px;
    }

    table th, table td {
      vertical-align: top;
    }
     .search{
      padding:5px 0 0 10px;
    }
</style>
