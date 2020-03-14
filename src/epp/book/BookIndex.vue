<template>
    <page-view title="书籍管理">
        <a-card>
            <a-form :form="queryBookForm">
                <table class="fx-form">
                    <tr>
                        <th>书名</th>
                        <td>
                            <a-form-item>
                                <a-input style="width: 320px"
                                         v-model="queryForm.bookName"></a-input>
                            </a-form-item>
                        </td>
                        <th>作者</th>
                        <td>
                            <a-form-item>
                                <a-input style="width: 320px"
                                         v-model="queryForm.author"></a-input>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>上架时间</th>
                        <td>
                            <a-form-item>
                                <a-date-picker v-model="queryForm.startTime" />
                                至 <a-date-picker v-model="queryForm.endTime" />
                            </a-form-item>
                        </td>
                        <th>状态</th>
                        <td>
                            <a-form-item>
                                <a-select style="width: 100px"
                                          v-model="queryForm.state">
                                    <a-select-option value="">不限</a-select-option>
                                    <a-select-option value="1">已上架</a-select-option>
                                    <a-select-option value="2">已下架</a-select-option>
                                </a-select>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" align="" style="padding:14px 0">
                            <a-button  type="primary" @click="onSearch">查询</a-button>
                            <a-button style="margin-left: 20px" @click="reset">重置</a-button>
                        </td>
                    </tr>
                </table>
            </a-form>
            <s-table
                    ref="table"
                    :columns="columns"
                    :data="loadData"
                    :rowKey="record => record.id">
                <template slot="title" slot-scope=" record">
                   {{record.title}}
                </template>
                <template slot="bookName" slot-scope=" record">
                    <a @click="bookView(record)">《{{record.bookName}}》</a>
                </template>
                <template slot="author" slot-scope=" record">
                    {{record.author}}
                </template>
                <template slot="price" slot-scope=" record">
                    {{record.price}}￥
                </template>
                <template slot="addTime" slot-scope=" record">
                    {{record.extras.addTime}}
                </template>
                <template slot="state" slot-scope=" record">
                    <a-tag v-if="record.state === '1'" color="green">已上架</a-tag>
                    <a-tag v-else-if="record.state === '2'" color="red">已下架</a-tag>
                </template>
                <template slot="userName" slot-scope=" record">
                    {{record.extras.userName}}
                </template>
                <template slot="operation" slot-scope=" record">
                    <a-button type="primary" @click="onEditBook(record)">修改</a-button>&nbsp;
                    <a-popconfirm placement="bottom" title="是否确认删除?" @confirm="deleteBook(record)">
                        <a-button :loading="loading">删除</a-button>
                    </a-popconfirm>
                </template>
            </s-table>
        </a-card>
        <book-view ref="bookView" :visible="modalVisible.bookView" @success="onOk" @cancel="onClose"/>
    </page-view>
</template>
<script>
import { PageView } from '@/layouts'
import STable from '@/components/Table'
import qs from 'qs'
import bookView from './BookView'
import AFormItem from 'ant-design-vue/es/form/FormItem'
export default {
  name: 'BookIndex',
  components: {
    AFormItem,
    PageView,
    STable,
    bookView
  },
  data () {
    return {
      columns: [
        {
          title: '标题',
          scopedSlots: { customRender: 'title' }
        },
        {
          title: '书名',
          scopedSlots: { customRender: 'bookName' }
        },
        {
          title: '作者',
          scopedSlots: { customRender: 'author' }
        },
        {
          title: '价格',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: '上架时间',
          scopedSlots: { customRender: 'addTime' }
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'state' }
        },
        {
          title: '上架人',
          scopedSlots: { customRender: 'userName' }
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      loading: false,
      modalVisible: {
        bookView: false
      },
      queryBookForm: this.$form.createForm(this),
      queryForm: {
        bookName: null,
        author: null,
        startTime: null,
        endTime: null,
        state: ''
      },
      queryParam: {
      },
      loadData: parameter => {
        return this.$http.get('/api/1/book/query_book_list.json', { params: Object.assign(parameter, this.queryParam),
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
      this.queryParam = {}
      this.queryForm = {}
      this.onSearch()
    },
    onSearch () {
      let bookName = this.queryForm.bookName
      this.queryParam.bookName = bookName
      let author = this.queryForm.author
      this.queryParam.author = author
      if (this.queryForm.startTime != null) {
        let start = this.queryForm.startTime.format('YYYY-MM-DD')
        this.queryParam.startTime = start
      }
      if (this.queryForm.endTime != null) {
        let end = this.queryForm.endTime.format('YYYY-MM-DD')
        this.queryParam.endTime = end
      }
      let state = this.queryForm.state
      this.queryParam.state = state
      this.$refs.table.refresh()
    },
    deleteBook (record) {
      let that = this
      this.$http.post('/api/1/book/delete_book.json?id=' + record.id).then(function () {
        that.$message.success('删除成功')
        that.$refs.table.refresh()
      })
    },
    onEditBook (record) {
      this.$router.push({ path: '/book/edit?id=' + record.id })
    },
    bookView (record) {
      this.modalVisible.bookView = true
      this.$refs.bookView.bookView(record)
    },
    onOk () {
      this.modalVisible.bookView = false
    },
    onClose () {
      this.modalVisible.bookView = false
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
