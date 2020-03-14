<template>
    <a-modal title="书籍详情"
             :width="960"
             :visible="visible"
             :maskClosable="false"
             @ok="$emit('cancel')"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading">
        <table class="fx-form-view">
            <tr>
                <th>书名</th>
                <td>
                    {{initData.name}}
                </td>
                <th>作者</th>
                <td>
                    {{initData.author}}
                </td>
            </tr>
            <tr>
                <th>标题</th>
                <td>
                    {{initData.title}}
                </td>
                <th>上架时间</th>
                <td>
                    {{initData.extras.createdAt}}
                </td>
            </tr>
            <tr>
                <th>价格</th>
                <td>
                    ￥{{initData.price}}
                </td>
                <th>状态</th>
                <td>
                    <div v-if="initData.state ==='1'">已上架</div>
                    <div v-else>已下架</div>
                </td>
            </tr>
            <tr>
                <th>备注</th>
                <td colspan="3">
                    {{initData.remark}}
                </td>
            </tr>
            <tr>
                <th>简介</th>
                <td colspan="3">
                    {{initData.description}}
                </td>
            </tr>
        </table>
    </a-modal>
</template>

<script>
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
      initData: {
        name: null,
        author: null,
        title: '',
        remark: '',
        price: null,
        userName: '',
        createdAt: null,
        description: null,
        userId: null,
        extras: {
          createdAt: null
        }
      },
      modalLoading: false
    }
  },
  methods: {
    preBookView (id) {
      this.loadData(id)
    },
    loadData (id) {
      const that = this
      this.$http.get('/api/1/examples/book/get_book.json?id=' + id).then(function (response) {
        that.initData = response.result
      })
    }
  }
}
</script>

<style scoped>
</style>
