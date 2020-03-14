<template>
  <page-view title="">
    <a-card title="企业列表">
      <!--      <template slot="action">-->
      <!--        <a-button @click="onAdd" icon="plus" type="primary" >-->
      <!--          新增企业-->
      <!--        </a-button>-->
      <!--      </template>-->
      <router-link to="" slot="extra"><a-button type="primary" icon="plus" :size="size" @click="onAdd">新增企业</a-button></router-link>
      <a-list itemLayout="horizontal" :dataSource="data">
        <a-list-item slot="renderItem" slot-scope="item, index">
          <a-list-item-meta>
            <a-avatar
                    shape="square"
                    :size="100"
                    slot="avatar"
                    :src="'api/1/document/avatar.json?id=' + item.id + '&s='+ time"
            />
            <a slot="title" @click="CompanyView(item.id)">{{item.companyName}}</a>
            <div slot="description">
              <span style="width: 200px;display: inline-block">法定代表人：{{item.userName}}</span>
              <span>邮箱：{{item.email}}</span>
            </div>
            <div slot="description">
              <span>地址：{{item.address}}</span>
            </div>
          </a-list-item-meta>
          <a-button slot="actions" icon="search">浏览</a-button>
          <a-button slot="actions" icon="form" @click="onEdit(item.id)">编辑</a-button>
        </a-list-item>
      </a-list>
    </a-card>
    <company-add ref="companyAdd" :visible="modalVisible.companyAdd" @cancel="onAddCancel"
                 @success="onAddSucess"></company-add>
    <company-edit ref="companyEdit" :visible="modalVisible.companyEdit" @cancel="onEditCancel"
                  @success="onEditSuccess"></company-edit>
  </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import CompanyAdd from './CompanyAdd'
import CompanyEdit from './CompanyEdit'
export default {
  name: 'documentList',
  data () {
    return {
      data: [],
      time: '',
      size: 'default',
      modalVisible: {
        companyAdd: false,
        companyEdit: false
      }
    }
  },
  created () {
    this.init()
  },
  components: {
    PageView,
    CompanyAdd,
    CompanyEdit
  },
  methods: {
    // 增加窗口
    onAdd () {
      this.modalVisible.companyAdd = true
    },
    onAddCancel () {
      this.modalVisible.companyAdd = false
    },
    onAddSucess () {
      this.modalVisible.companyAdd = false
      this.time = (new Date()).getTime()
      this.init()
    },
    CompanyView (id) {
      this.$router.push({ path: '/document/view?id=' + id })
    },
    onEdit (id) {
      this.modalVisible.companyEdit = true
      this.$refs.companyEdit.companyEdit(id)
    },
    onEditCancel () {
      this.modalVisible.companyEdit = false
    },
    onEditSuccess () {
      this.modalVisible.companyEdit = false
      this.time = (new Date()).getTime()
      this.init()
    },
    init () {
      const that = this
      this.$http.post('/api/1/document/company_list.json').then(function (res) {
        if (res.code !== 200) {
          return
        }
        that.data = res.result
      })
    }
  }
}
</script>

<style lang="less" scoped>

  /deep/ .ant-card-head{
    padding: 0 20px;
  }
  /deep/ .ant-card-bordered{
    border-radius: 5px;
  }
  /deep/ .ant-card-body{
    padding: 20px;
  }
  /deep/ .ant-list-item-action > li{
    margin-left: 20px;
    padding: 0;
  }
  .ant-list-item-meta-title > a{
    font-size: 18px;
    color: #262626;
    line-height: 26px;
    margin-top: 3px;
  }
  .ant-list-item-meta-description > div{
    color: #474747;
    margin-top: 10px;
  }
  .ant-list-item{
    padding: 20px 0;
  }

/*.ant-list-item-action {*/
/*  :global {*/
/*   .ant-btn {*/
/*      height: 26px !important;*/
/*      width: 93px !important;*/
/*    }*/
/*  }*/
/*}*/
/*.ant-list-item-meta-title {*/
/*  a {*/
/*    font-size: 20px;*/
/*    font-weight: bolder;*/
/*  }*/
/*}*/

/*.ant-list-item-meta-description {*/
/*  span {*/
/*    font-size: 12px;*/
/*  }*/
/*}*/

/*/deep/ .content {*/
/*  margin: 0px 10px 0px 10px !important;*/
/*}*/
/*/deep/ .page-header {*/
/*  padding: 10px 10px 0px !important;*/
/*}*/
</style>
