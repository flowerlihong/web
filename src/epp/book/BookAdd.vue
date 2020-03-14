<template>
    <page-view title="外勤/出差">
        <a-card>
            <a-form :form="addBookForm">
                <table class="fx-form">
                    <tr>
                        <th>书名</th>
                        <td>
                            <a-form-item>
                                <!--官方form检验方式v-decorator（注意：该校验方式不推荐使用v-model以及:value），前面的参数例如下面这个案例'bookName'，-->
                                <!--是用来动态设值的以及表单校验的时候来取值，详细使用见下面的重置方法与提交方法-->
                                <a-input style="width: 420px" placeholder="无需输入书名号"
                                         v-decorator="['bookName',{ rules: [{ required: true, message: '请输入书名' }]}]"
                                ></a-input>
                                <span class="not-null">*</span>
                            </a-form-item>
                        </td>
                        <th>价格</th>
                        <td>
                            <a-form-item>
                                <a-input style="width: 420px" type="number" @keydown="handleInput2"
                                         v-decorator="['price',{ rules: [{ required: true, message: '请输入价格' }]}]"
                                ></a-input>
                                <span class="not-null">*</span>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>作者</th>
                        <td>
                            <a-form-item>
                                <a-input style="width: 420px"
                                         v-decorator="['author',{ rules: [{ required: true, message: '请输入作者' }]}]"
                                ></a-input>
                                <span class="not-null">*</span>
                            </a-form-item>
                        </td>
                        <th>上架时间</th>
                        <td>
                            <a-form-item>
                                <!--加上showTime可以选择时分秒-->
                                <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss"
                                               v-decorator="['date',{initialValue:submitForm.addTime, rules: [{ required: true, message: '请输入上架日期' }]}]"/>
                                <span class="not-null">*</span>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>标题</th>
                        <td>
                            <a-form-item>
                                <a-input style="width: 420px"
                                         v-decorator="['title',{ rules: [{ required: true, message: '请输入标题' }]}]"
                                ></a-input>
                                <span class="not-null">*</span>
                            </a-form-item>
                        </td>
                        <th>备注</th>
                        <td>
                            <a-form-item>
                                <a-input style="width: 420px"
                                         v-decorator="['note',{ rules: [{ required: false, message: '请输入备注' }]}]"
                                ></a-input>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>上架人</th>
                        <td>
                            <a-form-item>
                                <!--引用选人组件,默认选择某人传入一个userId即可-->
                                <user-selector v-model="book.userId"
                                               @change="onChangeUser"/>
                                <span class="not-null">*</span>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>简介</th>
                        <td colspan="3">
                            <a-form-item>
                                <a-textarea style="width: 420px; height:200px;" v-decorator="['description',{ rules: [{ required: true, message: '请输入简介' }]}]"
                                ></a-textarea>
                                <span class="not-null">*</span>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" align="center" style="padding:14px 0">
                            <a-button  type="primary" @click="submit" :loading="loading">提交</a-button>
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
import UserSelector from '@/components/selector/UserSelector' //  导入选人组件
export default {
  name: 'BookAdd',
  components: {
    PageView,
    UserSelector
  },
  created () {
    const user = this.$ls.get('user')
    console.log(user)
    this.book.userId = user.id
  },
  data () {
    return {
      addBookForm: this.$form.createForm(this),
      submitForm: {
        bookName: null,
        author: null,
        title: '',
        note: '',
        price: null,
        userName: '',
        addTime: moment(new Date()),
        description: null,
        userId: null
      },
      loading: false,
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      book: {
        userId: ''
      },
      submitParam: {
      }
    }
  },
  methods: {
    reset () {
      // 因为官方form校验不支持v-model等方式绑定（会报很多警告），所以使用官方推荐的setFieldsValue来进行重置
      this.addBookForm.setFieldsValue({
        bookName: '', // 这个值就是v-decorator的第一个参数
        author: '',
        title: '',
        note: '',
        price: '',
        description: '',
        date: null
      })
    },
    onChangeUser (selectedIds) {
      this.book.userId = selectedIds.join(',')
    },
    moment,
    submit () {
      this.addBookForm.validateFields((err, values) => {
        if (err) {
          return
        }
        let bookName = values.bookName // values.后面的属性就是v-decorator的第一个参数
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
        this.submitParam.userId = this.book.userId
        let planEndAt = values.date.format('YYYY-MM-DD HH:mm:ss')
        this.submitParam.addTime = planEndAt
        let that = this
        this.$http.post('/api/1/book/add_book.json', qs.stringify(this.submitParam)).then(function (response) {
          if (response.code === 200) {
            that.$message.success('操作成功')
            that.$router.push({ path: '/book/index' })
          } else {
            that.$message.error('添加失败')
          }
        }).catch(function () {
        })
      })
    },
    handleInput2 (e) {
      // 通过正则过滤小数点后两位
      e.target.value = (e.target.value.match(/^\d*(\.?\d{0,1})/g)[0]) || null
    }
  }
}
</script>

<style scoped>
    .card {
        margin-bottom: 24px;
    }

    th {
        width: 90px !important;
    }

    table .ant-form-item {
        margin-bottom: 10px;
    }
</style>
