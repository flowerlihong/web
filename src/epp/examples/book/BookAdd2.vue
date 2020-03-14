<!--<template>-->
    <!--<page-view title="添加书籍 - 二列布局">-->
        <!--<a-card>-->
            <!--<a-form :form="form">-->
                <!--<table class="fx-form">-->
                    <!--<tr>-->
                        <!--<th class="not-null">书名</th>-->
                        <!--<td>-->
                            <!--<a-form-item>-->
                                <!--<a-input placeholder="书籍名称"-->
                                         <!--v-decorator="['name',{ rules: [{ required: true, message: '请输入书名' }]}]"></a-input>-->
                            <!--</a-form-item>-->
                        <!--</td>-->
                        <!--<th class="not-null">价格</th>-->
                        <!--<td>-->
                            <!--<a-form-item>-->
                                <!--<a-input type="number"-->
                                         <!--v-decorator="['price',{ rules: [{ required: true, message: '请输入价格' }]}]"></a-input>-->
                            <!--</a-form-item>-->
                        <!--</td>-->
                    <!--</tr>-->
                    <!--<tr>-->
                        <!--<th class="not-null">作者</th>-->
                        <!--<td>-->
                            <!--<a-form-item>-->
                                <!--<a-input v-decorator="['author',{ rules: [{ required: true, message: '请输入作者' }]}]"></a-input>-->
                            <!--</a-form-item>-->
                        <!--</td>-->
                        <!--<th class="not-null">上架时间</th>-->
                        <!--<td>-->
                            <!--<a-form-item style="width:195px">-->
                                <!--<a-date-picker showTime format="YYYY-MM-DD HH:mm"-->
                                               <!--v-decorator="['createdAt', {initialValue:initData.createdAt, rules: [{ required: true, message: '请输入上架日期' }]}]"/>-->
                            <!--</a-form-item>-->
                        <!--</td>-->
                    <!--</tr>-->
                    <!--<tr>-->
                        <!--<th>标题</th>-->
                        <!--<td>-->
                            <!--<a-form-item>-->
                                <!--<a-input v-decorator="['title']"></a-input>-->
                            <!--</a-form-item>-->
                        <!--</td>-->
                        <!--<th>备注</th>-->
                        <!--<td>-->
                            <!--<a-form-item>-->
                                <!--<a-input v-decorator="['remark']"></a-input>-->
                            <!--</a-form-item>-->
                        <!--</td>-->
                    <!--</tr>-->
                    <!--<tr>-->
                        <!--<th>上架人</th>-->
                        <!--<td>-->
                            <!--<a-form-item>-->
                                <!--<user-selector v-decorator="['userId', {initialValue:initData.userId, rules: [{ required: true, message: '请输入上架人' }]}]" />-->
                            <!--</a-form-item>-->
                        <!--</td>-->
                    <!--</tr>-->
                    <!--<tr>-->
                        <!--<th>简介</th>-->
                        <!--<td colspan="3">-->
                            <!--<a-form-item>-->
                                <!--<a-textarea style="height:200px;" v-decorator="['description']"></a-textarea>-->
                            <!--</a-form-item>-->
                        <!--</td>-->
                    <!--</tr>-->
                    <!--<tr>-->
                        <!--<td colspan="4" align="center">-->
                            <!--<a-button type="primary" @click="submit" :loading="loading">提交</a-button>-->
                            <!--<a-button @click="reset">重置</a-button>-->
                        <!--</td>-->
                    <!--</tr>-->
                <!--</table>-->
            <!--</a-form>-->
        <!--</a-card>-->
    <!--</page-view>-->
<!--</template>-->


<!--<script>-->
<!--import { PageView } from '@/layouts'-->
<!--import moment from 'moment'-->
<!--import qs from 'qs'-->
<!--import UserSelector from '@/components/selector/UserSelector'-->

<!--export default {-->
  <!--name: 'BookAdd',-->
  <!--components: {-->
    <!--PageView,-->
    <!--UserSelector-->
  <!--},-->
  <!--created () {-->
    <!--const user = this.$ls.get('user')-->
    <!--this.initData.userId = user.id-->
  <!--},-->
  <!--data () {-->
    <!--return {-->
      <!--form: this.$form.createForm(this),-->
      <!--loading: false,-->
      <!--initData: {-->
        <!--userId: '',-->
        <!--createdAt: moment()-->
      <!--}-->
    <!--}-->
  <!--},-->
  <!--methods: {-->
    <!--reset () {-->
      <!--this.form.resetFields()-->
    <!--},-->
    <!--submit () {-->
      <!--this.form.validateFields((err, values) => {-->
        <!--if (err) {-->
          <!--return-->
        <!--}-->
        <!--const that = this-->
        <!--let data = that.form.getFieldsValue()-->
        <!--// 日期选择组件返回的值是 moment 对象，需要转化为字符串时间提交到后台-->
        <!--data.createdAt = data.createdAt.format('YYYY-MM-DD HH:mm')-->
        <!--this.$http.post('/api/1/examples/book/add_book.json', qs.stringify(data)).then(function (response) {-->
          <!--if (response.code !== 200) {-->
            <!--return-->
          <!--}-->
          <!--that.$message.success('操作成功')-->
          <!--that.$router.push({ path: '/examples/book/index' })-->
        <!--})-->
      <!--})-->
    <!--}-->
  <!--}-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--</style>-->



<template>
    <page-view title="添加书籍 - 二列布局">
        <a-card>
            <a-form :form="form" class="custom">

                <a-row>
                    <div class="process-list">
                        <span class="title"><a-icon type="deployment-unit"/>启动流程</span>
                        <span>
                            <a-select :value="selectedValue" placeholder="请选择流程" :options="options" @change="onChange" style="width: 300px"/>
                        </span>
                    </div>
                </a-row>
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="书籍名称" v-bind="formItemLayout">
                            <a-input placeholder="书籍名称"
                                     v-decorator="['name',{ rules: [{ required: true, message: '请输入书名' }]}]"></a-input>
                        </a-form-item>
                    </a-col>

                    <a-col :span="12">
                        <a-form-item label="价格" v-bind="formItemLayout">
                            <a-input type="number"
                                     v-decorator="['price',{ rules: [{ required: true, message: '请输入价格' }]}]"></a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="作者" v-bind="formItemLayout">
                            <a-input
                                    v-decorator="['author',{ rules: [{ required: true, message: '请输入作者' }]}]"></a-input>
                        </a-form-item>
                    </a-col>

                    <a-col :span="12">
                        <a-form-item label="上架人" v-bind="formItemLayout" class="qqq">
                            <user-selector v-decorator="['userId', {initialValue:initData.userId, rules: [{ required: true, message: '请输入上架人' }]}]" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="12">

                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="上架时间" v-bind="formItemLayout">
                            <a-date-picker showTime format="YYYY-MM-DD HH:mm"
                                           v-decorator="['createdAt', {initialValue:initData.createdAt, rules: [{ required: true, message: '请输入上架日期' }]}]"/>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="上架时间" v-bind="formItemLayout">
                            <a-input v-decorator="['remark']"></a-input>
                        </a-form-item>
                    </a-col>

                    <a-col :span="12">
                        <a-form-item label="上架时间" v-bind="formItemLayout">
                            <a-input v-decorator="['remark']"></a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="简介" v-bind="formItemLayout">
                            <a-textarea style="height:200px;" v-decorator="['description']"></a-textarea>
                        </a-form-item>
                    </a-col>

                </a-row>
                <a-row>
                    <a-col :span="23">
                        <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
                            <a-button type="primary" @click="submit" :loading="loading">提交</a-button>
                            <a-button style="margin:0 6px" @click="reset">重置</a-button>
                        </a-form-item>
                    </a-col>
                </a-row>

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
            lg: { span: 24 }, sm: { span: 24 }
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

<style lang="less">
    .custom .ant-col-lg-24{
        padding-left: 100px;
    }
    .custom .ant-col-lg-7{
        width: 100px;
        position: absolute;
    }
    .process-list {
        padding-bottom: 24px;
        border-bottom: 1px dashed #dcdcdc;
        margin-bottom: 20px;
    }

    .process-list span {
        display: inline-block;
        font-size: 14px;
    }

    .process-list .title {
        color: #1890ff;
        text-align: right;
        width: 100px;

    }

    .process-list span i {
        margin-right: 8px;
    }

    .process-list.layout1 .title{
        width: 29.16666667%;
        padding-right: 13px;
    }

    .process-list.layout1 span:nth-child(2) {
        padding-left: 0;
    }
    .process-list .title:after {
        content: ':';
        margin: 0 8px 0 2px;
        position: relative;
        top: -0.5px;
    }
    .ant-calendar-picker{
        width: 100% !important;
    }
    .qqq #userId{
        width: 100% !important;
    }
    .qqq #userId .ant-select{
        width: 100% !important;
    }

</style>
