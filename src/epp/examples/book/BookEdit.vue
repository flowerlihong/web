<template>
    <page-view title="编辑书籍">
        <a-card>
            <a-form :form="form">
                <table class="fx-form">
                    <tr>
                        <th>书名</th>
                        <td>
                            <a-form-item class="not-null">
                                <a-input v-decorator="['name',{initialValue:initData.name, rules: [{ required: true, message: '请输入书名' }]}]"></a-input>
                            </a-form-item>
                        </td>
                        <th>作者</th>
                        <td>
                            <a-form-item class="not-null">
                                <a-input v-decorator="['author',{initialValue:initData.author, rules: [{ required: true, message: '请输入作者' }]}]"></a-input>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>标题</th>
                        <td>
                            <a-form-item>
                                <a-input v-decorator="['title',{initialValue:initData.title}]"></a-input>
                            </a-form-item>
                        </td>
                        <th>备注</th>
                        <td>
                            <a-form-item>
                                <a-input v-decorator="['remark',{initialValue:initData.remark}]"></a-input>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>价格</th>
                        <td>
                            <a-form-item class="not-null">
                                <a-input v-decorator="['price',{initialValue:initData.price, rules: [{ required: true, message: '请输入价格' }]}]"></a-input>
                            </a-form-item>
                        </td>
                        <th>状态</th>
                        <td>
                            <a-form-item>
                                <a-select style="width: 100px" v-decorator="['state',{initialValue:initData.state, rules: [{ required: true, message: '状态不能为空' }]}]">
                                    <a-select-option value="1">上架</a-select-option>
                                    <a-select-option value="2">下架</a-select-option>
                                </a-select>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>上架时间</th>
                        <td>
                            <a-form-item>
                                <a-date-picker showTime format="YYYY-MM-DD HH:mm" v-decorator="['createdAt', {initialValue:initData.createdAt, rules: [{ required: true, message: '请输入上架日期' }]}]"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>上架人</th>
                        <td colspan="3">
                            <a-form-item>
                                <user-selector :value="initData.userId" @change="onChangeUser"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>简介</th>
                        <td colspan="3">
                            <a-form-item>
                                <a-textarea style="height:200px;" v-decorator="['description',{initialValue:initData.description, rules: [{message: '请输入简介' }]}]"></a-textarea>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" align="center">
                            <a-button type="primary" @click="submit" :loading="loading">修改</a-button>
                            <a-button @click="reset">重置</a-button>
                        </td>
                    </tr>
                </table>
            </a-form>
        </a-card>
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import qs from 'qs'
import moment from 'moment'
import UserSelector from '@/components/selector/UserSelector'

export default {
  name: 'BookEdit',
  components: {
    PageView,
    UserSelector
  },
  created () {
    this.loadData()
  },
  data () {
    return {
      form: this.$form.createForm(this),
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
        state: null
      },
      loading: false,
      caseId: this.$route.query.id
    }
  },
  methods: {
    reset () {
      this.form.resetFields()
    },
    onChangeUser (selectedIds) {
      this.initData.userId = selectedIds.join(',')
    },
    loadData () {
      const that = this
      that.$http.get('/api/1/examples/book/get_book.json?id=' + that.caseId).then(function (response) {
        const result = response.result
        that.initData = result
        // 日期选择组件需要的是 moment 对象，将日期转换为对象
        that.initData.createdAt = moment(result.createdAt)
      })
    },
    submit () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        const that = this
        let data = that.form.getFieldsValue()
        data.id = that.caseId
        data.userId = that.initData.userId
        // 日期选择组件返回的值是 moment 对象，需要转化为字符串时间提交到后台
        data.createdAt = data.createdAt.format('YYYY-MM-DD HH:mm')
        that.$http.post('/api/1/examples/book/update_book.json', qs.stringify(data)).then(function (response) {
          if (response.code !== 200) {
            return
          }
          that.$message.success('更新成功')
          that.$router.push({ path: '/examples/book/index' })
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
