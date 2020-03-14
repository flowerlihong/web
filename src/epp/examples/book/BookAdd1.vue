<template>
    <page-view title="添加书籍 - 一列布局">
        <a-card>
            <a-form :form="form">
                <a-form-item label="书籍名称" v-bind="formItemLayout">
                    <a-input placeholder="书籍名称"
                             v-decorator="['name',{ rules: [{ required: true, message: '请输入书名' }]}]"></a-input>
                </a-form-item>

                <a-form-item label="价格" v-bind="formItemLayout">
                    <a-input type="number"
                             v-decorator="['price',{ rules: [{ required: true, message: '请输入价格' }]}]"></a-input>
                </a-form-item>

                <a-form-item label="作者" v-bind="formItemLayout">
                    <a-input
                            v-decorator="['author',{ rules: [{ required: true, message: '请输入作者' }]}]"></a-input>
                </a-form-item>

                <a-form-item label="上架时间" v-bind="formItemLayout">
                    <a-date-picker showTime format="YYYY-MM-DD HH:mm"
                                   v-decorator="['createdAt', {initialValue:initData.createdAt, rules: [{ required: true, message: '请输入上架日期' }]}]"/>
                </a-form-item>

                <a-form-item label="标题" v-bind="formItemLayout">
                    <a-input v-decorator="['title']"></a-input>
                </a-form-item>

                <a-form-item label="上架人" v-bind="formItemLayout">
                    <user-selector v-decorator="['userId', {initialValue:initData.userId, rules: [{ required: true, message: '请输入上架人' }]}]" />
                </a-form-item>

                <a-form-item label="上架时间" v-bind="formItemLayout">
                    <a-input v-decorator="['remark']"></a-input>
                </a-form-item>

                <a-form-item label="上架时间" v-bind="formItemLayout">
                    <a-input v-decorator="['remark']"></a-input>
                </a-form-item>

                <a-form-item label="简介" v-bind="formItemLayout">
                    <a-textarea style="height:200px;" v-decorator="['description']"></a-textarea>
                </a-form-item>

                <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
                    <a-button type="primary" @click="submit" :loading="loading">提交</a-button>
                    <a-button style="margin:0 6px" @click="reset">重置</a-button>
                </a-form-item>

            </a-form>
        </a-card>
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import moment from 'moment'
import qs from 'qs'
import UserSelector from '@/components/selector/UserSelector'

export default {
  name: 'BookAdd',
  components: {
    PageView,
    UserSelector
  },
  created () {
    const user = this.$ls.get('user')
    this.initData.userId = user.id
  },
  data () {
    return {
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: {
          lg: { span: 7 }, sm: { span: 7 }
        },
        wrapperCol: {
          lg: { span: 10 }, sm: { span: 17 }
        }
      },
      loading: false,
      initData: {
        userId: '',
        createdAt: moment()
      }
    }
  },
  methods: {
    reset () {
      this.form.resetFields()
    },
    submit () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        const that = this
        let data = that.form.getFieldsValue()
        // 日期选择组件返回的值是 moment 对象，需要转化为字符串时间提交到后台
        data.createdAt = data.createdAt.format('YYYY-MM-DD HH:mm')
        this.$http.post('/api/1/examples/book/add_book.json', qs.stringify(data)).then(function (response) {
          if (response.code !== 200) {
            return
          }
          that.$message.success('操作成功')
          that.$router.push({ path: '/examples/book/index' })
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
