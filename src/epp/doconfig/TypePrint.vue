<template>
    <page-view title="打印类型">
        <template slot="action">
            <a-button-group>
                <a-button @click="onAddType "><a-icon type="plus-circle"/>添加新的类型</a-button>
                 <!-- <a-popconfirm title="请注意：删除打印模板类型的同时将会删除该类的所有打印模板配置，您确定要删除所选的打印模板类型吗?" @confirm="onDelType (listDel)">
                    <a-button type="danger"><a-icon type="delete"/>删除所选类型</a-button>
                </a-popconfirm> -->
                 <a-button @click="showConfirm(id)" type="danger"><a-icon type="delete"/>删除所选类型</a-button>
            </a-button-group>
        </template>
        <a-card>
            <s-table
                    ref="table"
                    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                    :columns="columns"
                    :data="loadData"
                    :rowKey="record => record.id">
                <template slot="printType" slot-scope="record">
                       {{record.printDocType}}
                </template>
                <template slot="printName" slot-scope="record">
                      <div v-if="record.printDocTypeName.length > 20">
                        <a @click="onView(record.printDocType)">{{record.printDocTypeName.substring(0,20)}}...</a>
                    </div>
                    <div v-else>
                        <a @click="onView(record.printDocType)">{{record.printDocTypeName}}</a>
                    </div>
                </template>
                <template slot="printDescription" slot-scope="record">
                      <div v-if="record.printDocTypeDesc.length > 20">
                        {{record.printDocTypeDesc.substring(0,20)}}...
                    </div>
                    <div v-else>
                          {{record.printDocTypeDesc}}
                    </div>
                </template>
            </s-table>
        </a-card>
              <!-- 添加新的类型 -->
        <temp-type-add  :visible="addType" ref="addType" @success="onAddTypeSuccess" @cancel="onAddTypeCancel"/>
                <!-- 编辑打印类型 -->
        <temp-type-edit :visible="editType" @success="onEditTypeSuccess" @cancel="onEditTypeCancel" ref="editType"/>
    </page-view>
</template>
<script>
import { PageView } from '@/layouts'
import TempTypeAdd from './TempTypeAdd'
import TempTypeEdit from './TempTypeEdit'
import STable from '@/components/Table'
import qs from 'qs'
export default {
  name: 'DriverIndex',
  components: {
    PageView,
    STable,
    TempTypeAdd,
    TempTypeEdit
  },
  data () {
    return {
      addType: false,
      editType: false,
      columns: [
        {
          title: '打印模板类型',
          scopedSlots: { customRender: 'printType' }
        },
        {
          title: '打印模板类型名称',
          align: 'center',
          scopedSlots: { customRender: 'printName' }
        },
        {
          title: '打印模板类型描述 ',
          align: 'center',
          scopedSlots: { customRender: 'printDescription' }
        }
      ],
      selectedRowKeys: [],
      id: '',
      queryParam: {
      },
      loadData: parameter => {
        return this.$http.get('/api/1/dmservices/print_doctype_list.json', { params: Object.assign(parameter, this.queryParam),
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
          id: item.printDocType
        }
      })
    },
    onView (id) {
      this.editType = true
      this.$refs.editType.editTypetemp(id)
    },
    onUserChange (selectedIds) {
      this.queryForm.orgId = selectedIds
    },
    onAddType () {
      this.addType = true
      this.$refs.addType.addTypetemp()
    },
    onAddTypeSuccess () {
      this.addType = false
      this.$refs.table.refresh()
    },
    onAddTypeCancel () {
      this.addType = false
    },
    onEditTypeSuccess () {
      this.editType = false
      this.$refs.table.refresh()
    },
    onEditTypeCancel () {
      this.editType = false
    },
    showConfirm (id) {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请先选择要删除的打印模板配置')
        return
      }
      var that = this
      localStorage.setItem('id', id)
      that.$confirm({
        title: '请注意：删除打印模板类型的同时将会删除该类的所有打印模板配置，您确定要删除所选的打印模板类型吗?',
        onOk () {
          that.$http.get('/api/1/dmservices/del_print_doctype.json?id=' + localStorage.getItem('id')).then(
            (resp) => {
              that.$message.success('删除成功')
              that.selectedRowKeys = []
              that.$refs.table.refresh()
            }
          )
        }
      })
    }
  }
}
</script>

<style scoped>
    .card {
        margin-bottom: 24px;
    }
    td{
      padding:0 20px 0 10px;
    }
    .search{
      padding-top: 5px
    }
</style>
