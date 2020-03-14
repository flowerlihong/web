<template>
    <a-modal title="书籍详情"
             :width="960"
             :visible="visible"
             :maskClosable="false"
             @ok="$emit('cancel')"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading.showDetail">
                    <table class="fx-form-view">
                        <tr>
                            <th>书名</th>
                            <td>
                                    《{{books.bookName}}》
                            </td>
                            <th>作者</th>
                            <td>
                                    {{books.author}}
                            </td>
                        </tr>
                        <tr>
                            <th>标题</th>
                            <td>
                                    {{books.title}}
                            </td>
                            <th>上架时间</th>
                            <td>
                                    {{books.addTime}}
                            </td>
                        </tr>
                        <tr>
                            <th>价格</th>
                            <td>
                                    {{books.price}}￥
                            </td>
                            <th>状态</th>
                            <td>
                                    <div v-if="books.state ==='1'">已上架</div>
                                    <div v-else>已下架</div>
                            </td>
                        </tr>
                        <tr>
                            <th>备注</th>
                            <td colspan="3">
                                {{books.note}}
                            </td>
                        </tr>
                        <tr>
                            <th>简介</th>
                            <td colspan="3">
                                    {{books.description}}
                            </td>
                        </tr>
                    </table>
    </a-modal>
</template>

<script>
import moment from 'moment'

export default {
  name: 'BookView',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      DetailForm: this.$form.createForm(this),
      books: {
        bookName: null,
        author: null,
        title: '',
        note: '',
        price: null,
        userName: '',
        addTime: null,
        description: null,
        userId: null
      },
      modalLoading: {
        showDetail: false
      },
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      book: {
        id: this.$route.query.id
      }
    }
  },
  methods: {
    bookView (record) {
      this.loadData(record)
    },
    moment,
    loadData (record) {
      let that = this
      if (typeof (record.id) === 'undefined') {
        return
      }
      this.$http.get('/api/1/book/get_book.json?id=' + record.id).then(function (response) {
        let result = response.result
        console.log(result)
        that.books.bookName = result.bookName
        that.books.addTime = result.extras.addTime
        that.books.author = result.author
        that.books.note = result.note
        that.books.description = result.description
        that.books.state = result.state
        that.books.userName = result.extras.userName
        that.books.price = result.price
        that.books.title = result.title
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
