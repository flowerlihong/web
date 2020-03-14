<template>
  <a-card>
<!--    <div>-->
<!--      <table border-collapse="collapse">-->
<!--        <tr>-->
<!--          <td>-->

<!--          </td>-->
<!--          <td class="info">-->
<!--            <div style="height: 100px;">-->
<!--              <span class="info-title" ></span>-->
<!--              <span slot="description" class="info-base" >-->
<!--              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-->
<!--              </span>-->
<!--              <span slot="description" class="info-base" ></span>-->
<!--            </div>-->
<!--          </td>-->
<!--        </tr>-->
<!--      </table>-->
<!--    </div>-->
    <div class="co-header">
      <div class="left">
        <a-avatar
                shape="square"
                :size="100"
                slot="avatar"
                :src="'api/1/document/avatar.json?id=' + id + '&s='+ time"
        />
        <div class="info">
          <h4>{{ data.companyName}}</h4>
          <p>
            <span>法定代表人：{{data.userName}}</span>
            <span>邮箱：{{data.email}}</span>
          </p>
          <p>
            <span>地址：{{data.address}}</span>
          </p>
        </div>
      </div>
      <div class="right">
        <div class="operation">
          <a-button icon="search">预览</a-button>
          <a-button icon="form" @click="onEdit(id)">编辑</a-button>
        </div>
      </div>
    </div>

    <a-tabs defaultActiveKey="1" @change="callback">
      <a-tab-pane tab="公司资质" key="1">
        <qualification-view :companyId = "id"></qualification-view>
      </a-tab-pane>
      <a-tab-pane tab="解决方案" key="2">
        <project-view :companyId = "id"></project-view>
      </a-tab-pane>
      <a-tab-pane tab="合同案例" key="3">
        <case-view :companyId = "id"></case-view>
      </a-tab-pane>
      <a-tab-pane tab="员工信息" key="4">
        <staff-info-view :companyId = "id"></staff-info-view>
      </a-tab-pane>
      <a-tab-pane tab="社保信息" key="5">
      <social-view :companyId = "id"></social-view>
      </a-tab-pane>
    </a-tabs>
    <company-edit ref="companyEdit" :visible="modalVisible.companyEdit" @cancel="onEditCancel"
                  @success="onEditSuccess"></company-edit>
  </a-card>
</template>
<script>
import QualificationView from './QualificationView'
import ProjectView from './ProjectView'
import CaseView from './CaseView'
import StaffInfoView from './StaffInfoView'
import SocialView from './SocialView'
import CompanyEdit from './CompanyEdit'

export default {
  name: 'Index',
  data () {
    return {
      id: '',
      time: '',
      data: '',
      modalVisible: {
        companyEdit: false
      }
    }
  },
  components: {
    QualificationView,
    ProjectView,
    CaseView,
    StaffInfoView,
    SocialView,
    CompanyEdit
  },
  created () {
    this.id = this.$route.query.id
    this.CompanyView()
  },
  methods: {
    CompanyView () {
      this.time = (new Date()).getTime()
      const that = this
      this.$http.get('/api/1/document/get_company.json?id=' + that.id).then(function (res) {
        if (res.code !== 200) {
          return
        }
        that.data = res.result
      })
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
      this.CompanyView()
    },
    callback (key) {
    }
  }
}
</script>
<style lang="less" scoped>
/*.info {*/
/*  padding: 0;*/
/*  span {*/
/*    margin-left: 15px;*/
/*    display: block !important;*/
/*  }*/
/*  .info-base {*/
/*    font-size: 11px;*/
/*    font-weight: 600;*/
/*    display:block !important;*/
/*  }*/
/*  .info-title {*/
/*    font-size: 20px;*/
/*    font-weight: bolder;*/
/*  }*/
/*}*/

  /deep/ .ant-card-body{
    padding: 20px;
  }
  .co-header{
    position: relative;
    font-size: 0;
    margin-bottom: 20px;
    > div{
      display: inline-block;
    }
    .left{
      width: 70%;
      .info{
        display: inline-block;
        padding-left: 12px;
        p ,h4{
          margin: 8px 0 0 0;
          font-size: 0;
        }
        h4{
          font-size: 18px;
          line-height: 22px;
          color: #262626;
          font-weight: bold;
        }
        span{
          font-size: 14px;
          display: inline-block;
          line-height: 22px;
          color: #474747;
          margin-right: 50px;
        }
      }
      .ant-avatar{
        vertical-align: top;
      }
    }
    .right{
      width: 30%;
      vertical-align: top;
      text-align: right;
      .operation{
        height: 100px;
        button{
          margin-left: 20px;
          vertical-align: middle;
          display: inline-block;
        }
      }
      .operation::before{
        content: "";
        width: 0;
        height: 100%;
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
</style>
