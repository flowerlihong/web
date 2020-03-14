<template>
    <page-view title="书籍管理">
        <a-card>
            <a-form :form="form">
                <table class="fx-form">
                    <tr>
                        <th>书名</th>
                        <td>
                            <a-form-item>
                                <a-input v-model="queryForm.name"></a-input>
                            </a-form-item>
                        </td>
                        <th>作者</th>
                        <td>
                            <a-form-item>
                                <a-input v-model="queryForm.author"></a-input>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>上架时间</th>
                        <td>
                            <a-form-item style="width:460px">
                                <a-date-picker v-model="queryForm.createdAtStart" />&nbsp;&nbsp;至&nbsp;&nbsp;<a-date-picker v-model="queryForm.createdAtEnd"/>
                            </a-form-item>
                        </td>
                        <th>状态</th>
                        <td>
                            <a-form-item>
                                <a-select v-model="queryForm.state">
                                    <a-select-option value="">不限</a-select-option>
                                    <a-select-option value="1">已上架</a-select-option>
                                    <a-select-option value="2">已下架</a-select-option>
                                </a-select>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" align="center">
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
                <template slot="title" slot-scope="record">
                   {{record.title}}
                </template>
                <template slot="name" slot-scope="record">
                    <a @click="onBookView(record.id)">{{record.name}}</a>
                </template>
                <template slot="author" slot-scope="record">
                    {{record.author}}
                </template>
                <template slot="price" slot-scope="record">
                    ￥{{record.price}}
                </template>
                <template slot="createdAt" slot-scope="record">
                    {{record.extras.createdAt}}
                </template>
                <template slot="state" slot-scope="record">
                    <a-tag v-if="record.state === '1'" color="green">已上架</a-tag>
                    <a-tag v-else-if="record.state === '2'" color="red">已下架</a-tag>
                </template>
                <template slot="userName" slot-scope="record">
                    {{record.extras.userName}}
                </template>
                <template slot="operation" slot-scope="record">
                    <a-button type="primary" @click="onEditBook(record)">修改</a-button>&nbsp;
                    <a-popconfirm placement="bottom" title="是否确认删除?" @confirm="deleteBook(record)">
                        <a-button :loading="loading">删除</a-button>
                    </a-popconfirm>
                </template>
            </s-table>
        </a-card>
        <book-view ref="bookView" :visible="modalVisible.bookView" @success="onOk" @cancel="onClose" />
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import STable from '@/components/Table'
import qs from 'qs'
import bookView from './BookView'

export default {
  name: 'BookIndex',
  components: {
    PageView,
    STable,
    bookView
  },
  data () {
    return {
      columns: [
        {
          title: '书名',
          scopedSlots: { customRender: 'name' }
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
          scopedSlots: { customRender: 'createdAt' }
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
      form: this.$form.createForm(this),
      queryForm: {
        name: null,
        author: null,
        createdAtStart: null,
        createdAtEnd: null,
        state: ''
      },
      queryParam: {
      },
      loadData: parameter => {
        return this.$http.get('/api/1/examples/book/query_book_list.json', { params: Object.assign(parameter, this.queryParam),
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
      this.onSearch()
    },
    onSearch () {
      this.queryParam = { ...this.queryForm }
      // 日期组件返回的是 moment 对象，需要转换为字符串时间
      if (this.queryParam.createdAtStart) {
        this.queryParam.createdAtStart = this.queryParam.createdAtStart.format('YYYY-MM-DD')
      }
      if (this.queryParam.createdAtEnd) {
        this.queryParam.createdAtEnd = this.queryParam.createdAtEnd.format('YYYY-MM-DD')
      }
      this.$refs.table.refresh()
    },
    deleteBook (record) {
      let that = this
      this.$http.post('/api/1/examples/book/delete_book.json?id=' + record.id).then(function () {
        that.$message.success('删除成功')
        that.$refs.table.refresh()
      })
    },
    onEditBook (record) {
      this.$router.push({ path: '/examples/book/edit?id=' + record.id })
    },
    onBookView (id) {
      this.modalVisible.bookView = true
      this.$refs.bookView.preBookView(id)
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
</style>
