<template>
    <a-card>
        <div class="co-body-top">
            <span>年份：</span>
            <a-select defaultValue="请选择年份" style="margin-right: 20px;min-width: 120px;" @change="handleChange">
              <a-select-option value="">请选择年份</a-select-option>
              <a-select-option :value="item.year" v-for="(item,i) in yearList" :key="i">{{ item.year }}</a-select-option>
                <!-- <a-select-option value="2018">2018</a-select-option>
                <a-select-option value="2017">2017</a-select-option> -->
            </a-select>
            <a-input-search placeholder="输入您要搜索的解决方案信息" style="width: 250px" @search="onSearch"/>
            <router-link to="">
                <a-button type="primary" icon="plus" :size="size" @click="onAdd">新增合同案例</a-button>
            </router-link>
        </div>
        <a-list itemLayout="horizontal" :dataSource="caseList">
            <a-list-item slot="renderItem" slot-scope="item, index">
                <a-list-item-meta>
                    <a-avatar v-if="item.type === 'doc'"
                            slot="avatar"
                            :size="60"
                            shape="square"
                            src="/img/file/list_ic_attachment_word.png"
                    />
                     <a-avatar v-else
                            slot="avatar"
                            :size="60"
                            shape="square"
                            src="/img/file/list_ic_attachment_pdf.png"
                    />
                    <span slot="title">
                      <document-view readonly :referId='item.id' :fileName="item.title" configKey='DOCUMENT.FILE' />
                    </span>
                    <div class="list-text" slot="description">
                        <span v-if="item.type === 'doc'">文档类型：word</span>
                        <span v-else>文档类型：pdf</span>
                        <span>文档页数：{{ item.page }}</span>
                        <span>日期：{{ item.dateTime}}</span>
                        <span>标签：
                            <a-tag v-for="(tag,i) in item.tagList" :key="i" color="blue">{{ tag }}</a-tag>
                            <!-- <a-tag color="orange">协同</a-tag>
                            <a-tag color="orange">数据</a-tag>
                            <a-tag color="blue">政务</a-tag> -->
                        </span>
                    </div>
                </a-list-item-meta>
                <a-button slot="actions" icon="form" @click="onEdit(item.id)" >编辑</a-button>
            </a-list-item>
        </a-list>
        <case-add ref="caseAdd" :visible="modalVisible.caseAdd" @cancel="onAddCancel"
                 @success="onAddSucess" :companyId="companyId"></case-add>
        <case-edit ref="casetEdit" :visible="modalVisible.caseEdit" @cancel="onEditCancel"
                 @success="onEditSucess"></case-edit>
    </a-card>
</template>
<script>
import CaseAdd from './CaseAdd'
import CaseEdit from './CaseEdit'
import moment from 'moment'
import qs from 'qs'
import DocumentView from '@/components/selector/DocumentView'

export default {
  name: 'ProjectView',
  components: {
    CaseAdd,
    DocumentView,
    CaseEdit
  },
  data () {
    return {
      caseList: [],
      yearList: [],
      size: 'default',
      selectYear: '',
      modalVisible: {
        caseAdd: false,
        caseEdit: false
      }
    }
  },
  props: [
    'companyId'
  ],
  created () {
    this.init()
    this.year()
  },
  methods: {
    moment,
    init () {
      const that = this
      this.$http.get('/api/1/case/get_case_list.json?companyId=' + that.companyId).then(function (res) {
        if (res.code !== 200) {
          return
        }
        let result = res.result
        if(result !== null) {
          result.forEach(object => {
            object.tagList = object.tags.split('，')
            if (object.tagList.length <= 1) {
              object.tagList = object.tags.split(',')
            }
            object.dateTime = object.dateTime.substring(0, 10)
          })
          that.caseList = result
        }
      })
    },
    year () {
      const that = this
      this.$http.get('/api/1/case/get_year_list.json?companyId=' + that.companyId).then(function (res) {
        if (res.code !== 200) {
          return
        }
        that.yearList = res.result
      })
    },
    onAdd () {
      this.modalVisible.caseAdd = true
    },
    onAddCancel () {
      this.modalVisible.caseAdd = false
    },
    onAddSucess () {
      this.modalVisible.caseAdd = false
      this.init()
      this.year()
    },
    onEdit (id) {
      this.modalVisible.caseEdit = true
      this.$refs.caseEdit.onEdit(id)
    },
    onEditCancel () {
      this.modalVisible.caseEdit = false
    },
    onEditSucess () {
      this.modalVisible.caseEdit = false
      this.init()
      this.year()
    },
    handleChange (value) {
      const that = this
      that.selectYear = value
      this.$http.post('/api/1/case/get_case_list_by_year.json', qs.stringify({ companyId: that.companyId, year: value })).then(function (res) {
        if (res.code !== 200) {
          return
        }
        let result = res.result
        if (result !== null) {
          result.forEach(object => {
            object.tagList = object.tags.split('，')
            if (object.tagList.length <= 1) {
              object.tagList = object.tags.split(',')
            }
            object.dateTime = object.dateTime.substring(0, 10)
          })
          that.caseList = result
        }
      })
    },
    onSearch (value) {
      const that = this
      this.$http.post('/api/1/case/search_case_by_key.json', qs.stringify({ companyId: that.companyId, year: that.selectYear, title: value })).then(function (res) {
        if (res.code !== 200) {
          return
        }
        let result = res.result
        if (result !== null) {
          result.forEach(object => {
            object.tagList = object.tags.split('，')
            if (object.tagList.length <= 1) {
              object.tagList = object.tags.split(',')
            }
            object.dateTime = object.dateTime.substring(0, 10)
          })
          that.caseList = result
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
    /deep/ .ant-card-body{
        padding: 0 !important;
    }
    /deep/ .ant-list-item-action > li{
        margin-left: 20px;
        padding: 0;
    }
    .ant-list-item-meta-title > span{
        font-size: 18px;
        color: #262626;
        line-height: 26px;
        margin-top: 3px;
    }
    .ant-list-item-meta-description > div{
        color: #474747;
        margin-top: 10px;
    }
    .ant-list-item {
        padding: 20px 0;
    }
    .ant-card-bordered {
        border: none;
    }
    .co-body-top button{
        float: right;
    }
    .co-body-top{
        margin-bottom: 20px;
    }
    .list-text span{
        margin-right: 40px;
        color: #8c8c8c;
    }

</style>
