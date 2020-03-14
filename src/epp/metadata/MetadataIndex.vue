<template>
    <page-view title="元数据配置">
        <template slot="action">
            <a-button-group>
                <a-button @click="onAddDriver"><a-icon type="plus-circle"/>添加元数据</a-button>
            </a-button-group>
        </template>
        <a-card>
            <a-form :form="form">
                <table class="fx-form">
                    <tr>
                        <th>对象ID</th>
                        <td>
                            <a-form-item>
                                <a-input style="width: 300px" v-model="queryForm.objectId"></a-input>
                            </a-form-item>
                        </td>
                        <th>对象KEY</th>
                        <td>
                            <a-form-item>
                                <a-input style="width: 300px" v-model="queryForm.key"></a-input>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" align="center" style="padding:14px 0">
                            <a-button type="primary" @click="onSearch">查询</a-button>
                            <a-button @click="reset">重置</a-button>
                        </td>
                    </tr>
                </table>
            </a-form>
            <s-table
                    ref="table"
                    :columns="columns"
                    :data="loadData"
                    :rowKey="record => record.id">
                <template slot="names" slot-scope=" record">
                   {{record.objectId}}
                </template>
                <template slot="linkMan" slot-scope=" record">
                    {{record.key}}
                </template>
                <template slot="phone" slot-scope=" record">
                    {{record.value}}
                </template>
                <template slot="state" slot-scope=" record">
                    {{record.remark}}
                </template>
                <template slot="operation" slot-scope=" record">
                    <a-button type="primary" @click="onEdit(record)">修改</a-button>&nbsp;
                    <a-popconfirm title="是否确认删除?" @confirm="onDelete(record)">
                        <a-button type="danger" :loading="loading">删除</a-button>
                    </a-popconfirm>
                </template>
            </s-table>
        </a-card>
        <add-view ref="addView" :visible="modalVisible.addView" @success="onOk" @cancel="onClose" />
        <edit-view ref="editView" :visible="modalVisible.editView" @success="onOk" @cancel="onClose" />
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import STable from '@/components/Table'
import addView from './MetadataAdd'
import editView from './MetadataEdit'
import qs from 'qs'
export default {
  name: 'Metadata',
  components: {
    PageView,
    STable,
    addView,
    editView
  },
  created () {
  },
  data () {
    return {
      columns: [
        {
          title: '对象ID',
          scopedSlots: { customRender: 'names' }
        },
        {
          title: '对象KEY',
          scopedSlots: { customRender: 'linkMan' }
        },
        {
          title: '对象值',
          scopedSlots: { customRender: 'phone' }
        },
        {
          title: '描述',
          scopedSlots: { customRender: 'state' }
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      modalVisible: {
        addView: false,
        editView: false
      },
      loading: false,
      form: this.$form.createForm(this),
      queryForm: {
        objectId: '',
        key: ''
      },
      queryParam: {
      },
      loadData: parameter => {
        return this.$http.get('/api/1/metadata/config/query_metadata_list.json', { params: Object.assign(parameter, this.queryParam),
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
    reset () {
      this.queryForm = {}
      this.queryParam = {}
      this.queryForm.userId = ''
      this.onSearch()
    },
    onAddDriver () {
      this.modalVisible.addView = true
      this.$refs.addView.preView()
    },
    onChangeUser (selectedIds) {
      this.queryForm.userId = selectedIds
    },
    onSearch () {
      this.queryParam = { ...this.queryForm }
      this.$refs.table.refresh()
    },
    onOk () {
      this.modalVisible.addView = false
      this.modalVisible.editView = false
      this.$refs.table.refresh()
    },
    onClose () {
      this.modalVisible.addView = false
      this.modalVisible.editView = false
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    onEdit (record) {
      this.modalVisible.editView = true
      this.$refs.editView.preView(record.id)
    },
    onDelete (record) {
      let that = this
      that.loading = true
      this.$http.post('/api/1/metadata/config/delete_metadata.json?id=' + record.id).then(function (response) {
        that.loading = false
        if (response.code === 200) {
          that.$message.success('删除成功')
          that.$refs.table.refresh()
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

    th {
        width: 110px !important;
    }

    table .ant-form-item {
        margin-bottom: 0;
    }
</style>
