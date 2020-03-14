<template>
    <page-view title="打印模板">
        <template slot="action">
            <a-button-group>
                <a-button @click="onAddPrint"><a-icon type="plus-circle"/>添加新的模板</a-button>
                 <a-popconfirm title="是否确认删除所选模板?" @confirm=" onDelPrint (listDel)">
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
                               <org-selector @change="onUserChange" v-model="queryForm.orgId" multiple style="width:300px"/>
                            </a-form-item>
                        </td>
                        <th>模板名称</th>
                        <td>
                            <a-form-item>
                                 <a-input v-model="queryForm.modelName" style="width:300px"></a-input>
                            </a-form-item>
                        </td>
                        <td class="search">
                          <a-button type="primary" @click="onSearch">查询</a-button>
                        </td>
                    </tr>
            </table>
            <s-table
                    ref="table"
                    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                    :columns="columns"
                    :data="loadData"
                    :rowKey="record => record.id">
                <template slot="printType" slot-scope="record">
                       {{record.extras.pringTypeName}}
                </template>
                <template slot="printName" slot-scope="record">
                      <div v-if="record.templateName.length > 10">
                        <a @click="onView(record.printDoctype,record.orgId)">{{record.templateName.substring(0,10)}}...</a>
                    </div>
                    <div v-else>
                        <a @click="onView(record.printDoctype,record.orgId)">{{record.templateName}}</a>
                    </div>
                </template>
                <template slot="ordName" slot-scope="record">
                     {{record.extras.orgName}}
                </template>
                <template slot="printModule" slot-scope="record">
                     <div v-if="record.storagePath.length > 30">
                        {{record.storagePath.substring(0,30)}}...
                    </div>
                    <div v-else>
                        {{record.storagePath}}
                    </div>
                </template>
            </s-table>
        </a-card>
              <!-- 添加打印模板 -->
        <temp-print-add  :visible="addPrint" ref="addPrint" @success="onAddPrintSuccess" @cancel="onAddPrintCancel"/>
                <!-- 编辑打印模板 -->
        <temp-print-edit :visible="editPrint" @success="onEditPrintSuccess" @cancel="onEditPrintCancel" ref="editPrint"/>
    </page-view>
</template>
<script>
import OrgSelector from '@/components/selector/OrgSelector'
import { PageView } from '@/layouts'
import TempPrintAdd from './TempPrintAdd'
import TempPrintEdit from './TempPrintEdit'
import STable from '@/components/Table'
import qs from 'qs'
export default {
  name: 'DriverIndex',
  components: {
    OrgSelector,
    PageView,
    STable,
    TempPrintAdd,
    TempPrintEdit
  },
  data () {
    return {
      addPrint: false,
      editPrint: false,
      columns: [
        {
          title: '打印模板类型',
          scopedSlots: { customRender: 'printType' }
        },
        {
          title: '打印模板名称',
          scopedSlots: { customRender: 'printName' }
        },
        {
          title: '所属机构名称 ',
          scopedSlots: { customRender: 'ordName' }
        },
        {
          title: '打印模板的存放位置',
          align: 'center',
          scopedSlots: { customRender: 'printModule' }
        }
      ],
      selectedRowKeys: [],
      listDel: [],
      queryForm: {
        orgId: '',
        modelName: ''
      },
      queryParam: {
      },
      loadData: parameter => {
        return this.$http.get('/api/1/dmservices/print_template_list.json', { params: Object.assign(parameter, this.queryParam),
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
      this.listDel = this.mapSelectData(selectedRows)
    },
    mapSelectData (list) {
      return list.map(item => {
        return {
          orgId: item.orgId,
          printDocType: item.printDoctype
        }
      })
    },
    onView (printDocType, orgId) {
      this.editPrint = true
      this.$refs.editPrint.editPrintemp(printDocType, orgId)
    },
    onUserChange (selectedIds) {
      this.queryForm.orgId = selectedIds
    },
    onAddPrint () {
      this.addPrint = true
      this.$refs.addPrint.addPrintemp()
    },
    onAddPrintSuccess () {
      this.addPrint = false
      this.$refs.table.refresh()
    },
    onAddPrintCancel () {
      this.addPrint = false
    },
    onEditPrintSuccess () {
      this.editPrint = false
      this.$refs.table.refresh()
    },
    onEditPrintCancel () {
      this.editPrint = false
    },
    onDelPrint (listDel) {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请先选择要删除的打印模板配置')
        return
      }
      this.$http.post('/api/1/dmservices/del_print_template.json',
        qs.stringify({ list: JSON.stringify(listDel) })).then(
        (resp) => {
          this.$message.success('删除模板成功')
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
