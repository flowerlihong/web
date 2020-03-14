<template>
    <page-view title="书籍管理">
        <a-card>
            <a-form :form="editBookForm">
                <table class="fx-form">
                    <tr>
                        <th>书名</th>
                        <td>
                            <a-form-item>
                                <a-input style="width: 420px"
                                         v-decorator="['bookName',{initialValue:submitForm.bookName, rules: [{ required: true, message: '请输入书名' }]}]"
                                ></a-input>
                                <span class="not-null">*</span>
                            </a-form-item>
                        </td>
                        <th>作者</th>
                        <td>
                            <a-form-item>
                                <a-input style="width: 420px"
                                         v-decorator="['author',{initialValue:submitForm.author, rules: [{ required: true, message: '请输入作者' }]}]"
                                ></a-input>
                                <span class="not-null">*</span>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>标题</th>
                        <td>
                            <a-form-item>
                                <a-input style="width: 420px"
                                         v-decorator="['title',{initialValue:submitForm.title, rules: [{ required: true, message: '请输入标题' }]}]"
                                ></a-input>
                                <span class="not-null">*</span>
                            </a-form-item>
                        </td>
                        <th>备注</th>
                        <td>
                            <a-form-item>
                                <a-input style="width: 420px"
                                         v-decorator="['note',{initialValue:submitForm.note, rules: [{ required: false, message: '请输入备注' }]}]"
                                ></a-input>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>价格</th>
                        <td>
                            <a-form-item>
                                <a-input style="width: 420px"
                                         v-decorator="['price',{initialValue:submitForm.price, rules: [{ required: true, message: '请输入价格' }]}]"
                                ></a-input>
                                <span class="not-null">*</span>
                            </a-form-item>
                        </td>
                        <th>状态</th>
                        <td>
                            <a-form-item>
                                <a-select style="width: 100px"
                                          v-decorator="['state',{initialValue:submitForm.state, rules: [{ required: true, message: '状态不能为空' }]}]">
                                    <a-select-option value="1">上架</a-select-option>
                                    <a-select-option value="2">下架</a-select-option>
                                </a-select>
                                <span class="not-null">*</span>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>上架时间</th>
                        <td>
                            <a-form-item>
                                <a-date-picker v-decorator="['addTime',{initialValue:submitForm.addTime, rules: [{ required: true, message: '请输入上架日期' }]}]"/>
                                <span class="not-null">*</span>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>上架人</th>
                        <td colspan="3">
                            <a-form-item>
                                <user-selector v-model="this.book.userId"
                                               @change="onChangeUser"/>
                                <span class="not-null">*</span>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>简介</th>
                        <td colspan="3">
                            <a-form-item>
                                <a-textarea  style="width: 420px; height:200px;" v-decorator="['description',{initialValue:submitForm.description, rules: [{ required: true, message: '请输入简介' }]}]"
                                ></a-textarea>
                                <span class="not-null">*</span>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" align="center" style="padding:14px 0">
                            <a-button  type="primary" @click="submit" :loading="loading">修改</a-button>
                            <a-button style="margin-left: 20px" @click="reset">重置</a-button>
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
      editBookForm: this.$form.createForm(this),
      submitForm: {
        bookName: null,
        author: null,
        title: '',
        note: '',
        price: null,
        userName: '',
        addTime: null,
        description: null,
        userId: null,
        state: null
      },
      loading: false,
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      book: {
        id: this.$route.query.id,
        userId: ''
      },
      submitParam: {
      }
    }
  },
  methods: {
    reset () {
      this.editBookForm.setFieldsValue({
        bookName: '',
        author: '',
        title: '',
        note: '',
        price: '',
        description: '',
        addTime: null
      })
    },
    bookEdit (record) {
      this.loadData(record)
    },
    onChangeUser (selectedIds) {
      this.book.userId = selectedIds.join(',')
    },
    moment,
    loadData () {
      let that = this
      this.$http.get('/api/1/book/get_book.json?id=' + this.book.id).then(function (response) {
        let result = response.result
        that.submitForm.bookName = result.bookName
        that.submitForm.addTime = moment(result.addTime)
        that.submitForm.author = result.author
        that.submitForm.title = result.title
        that.submitForm.note = result.note
        that.submitForm.state = result.state
        that.submitForm.price = result.price
        that.submitForm.description = result.description
        that.book.userId = result.userId
      })
    },
    submit () {
      this.editBookForm.validateFields((err, values) => {
        if (err) {
          console.log(values)
          return
        }
        if (!this.book.userId) {
          this.$message.error('请选择外出人员')
          return
        }
        let bookName = values.bookName
        this.submitParam.bookName = bookName
        let author = values.author
        this.submitParam.author = author
        let title = values.title
        this.submitParam.title = title
        let note = values.note
        this.submitParam.note = note
        let price = values.price
        this.submitParam.price = price
        let description = values.description
        this.submitParam.description = description
        let state = values.state
        this.submitParam.state = state
        this.submitParam.userId = this.book.userId
        if (typeof (values.addTime) === 'string') {
          this.submitParam.addTime = values.addTime
        } else {
          let addTime = values.addTime.format('YYYY-MM-DD')
          this.submitParam.addTime = addTime
        }
        let that = this
        this.submitParam.id = this.book.id
        this.$http.post('/api/1/book/update_book.json', qs.stringify(this.submitParam)).then(function (response) {
          if (response.code !== 200) {
            that.$message.error(response.msg)
            return
          }
          that.$message.success('更新成功')
          that.$router.push({ path: '/book/index' })
        }).catch(function () {
        }).then(function () {
        })
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
        width: 60px !important;
    }

    table .ant-form-item {
        margin-bottom: 0;
    }
</style>
