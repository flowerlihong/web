<template>
  <div>
    <div class="co-body-top">
      <a-input-search placeholder="输入您要搜索的人员信息" style="width: 250px" @search="onSearch"/>
      <router-link to="">
        <a-button type="primary" icon="plus" :size="size" @click="onAdd">新增人员</a-button>
      </router-link>
    </div>
    <a-row :gutter="24">
      <a-col :xl="8" :lg="12" :md="12" :sm="12" :xs="12" :key="i" v-for="(item, i) in staffList" class="user-card">
        <a-card :title="item.staffName" style="width: 100%;background:rgba(251,254,255,1);">
          <div slot="title">{{ item.staffPost}}</div>
          <div slot="extra">
            <span class="operate"><a-icon type="search"/>预览</span>
            <span class="operate" @click="onEdit(item.id)"><a-icon type="form"/>编辑</span>
            <span class="operate" @click="onDelete(item.id)"><a-icon type="delete"/></span>
          </div>
          <p style="color:#1890ff">
            <a-icon type="user"/>
            基本信息
          </p>
          <p><span>联系手机：</span><span>{{ item.staffTelephone}}</span></p>
          <p><span>联系邮箱：</span><span>{{ item.staffEmail}}</span></p>
          <p><span>身份证：</span><span>{{ item.staffIdcard}}</span></p>
          <div style="height: 1px;background: #e6e6e6;margin: 16px 0"></div>
          <p style="color:#1890ff">
            <a-icon type="read"/>
            学位及职业资格证书
          </p>
          <p><span>毕业院校：</span><span>{{ item.staffSchool}}</span></p>
          <p><span>学历：</span><span>{{ item.staffEducation}}</span></p>
          <p><span>毕业年份：</span><span>{{ item.staffGraduate}}</span></p>
          <p>
            <span>职业资格证：</span>
            <span>
              <p v-for="(certificate,index) in item.certificateList" :key="index">{{certificate.certificate}}</p>
            </span>
          </p>
        </a-card>
      </a-col>
    </a-row>
  <staff-info-add ref="staffInfoAdd" :visible="modalVisible.staffInfoAdd" @cancel="onAddCancel"
                  @success="onAddSucess" :companyId="companyId"></staff-info-add>
  <staff-info-edit ref="staffInfoEdit" :visible="modalVisible.staffInfoEdit" @cancel="onEditCancel"
                   @success="onEditSucess"></staff-info-edit>
  </div>
</template>

<script>
import qs from 'qs'
import StaffInfoAdd from './StaffInfoAdd'
import StaffInfoEdit from './StaffInfoEdit'

export default {
  name: 'StaffInfoView',
  components: {
    StaffInfoAdd,
    StaffInfoEdit
  },
  data () {
    return {
      size: 'default',
      modalVisible: {
        staffInfoAdd: false,
        staffInfoEdit: false
      },
      staffList: []
    }
  },
  props: [
    'companyId'
  ],
  created () {
    this.init()
  },
  methods: {
    init () {
      const that = this
      this.$http.post('/api/1/staff/get_staff_list.json', qs.stringify({ companyId: that.companyId })).then(function (res) {
        if (res.code !== 200) {
          return
        }
        that.staffList = res.result
      })
    },
    onEdit (id) {
      this.modalVisible.staffInfoEdit = true
      this.$refs.staffInfoEdit.onEdit(id)
    },
    onDelete (id) {
      console.log(id)
    },
    onAdd () {
      this.modalVisible.staffInfoAdd = true
    },
    onSearch (value) {

    },
    onAddSucess () {
      this.modalVisible.staffInfoAdd = false
      this.init()
    },
    onAddCancel () {
      this.modalVisible.staffInfoAdd = false
    },
    onEditSucess () {
      this.modalVisible.staffInfoEdit = false
      this.init()
    },
    onEditCancel () {
      this.modalVisible.staffInfoEdit = false
    }
  }
}
</script>

<style lang="less" scoped>
  .operate {
    cursor: pointer;
    margin-left: 20px;
  }

  .operate:hover {
    color: #1890ff;
  }

  .co-body-top button {
    float: right;
  }

  .co-body-top {
    margin-bottom: 20px;
  }

  .user-card {
    height: 430px;
  }

  .user-card /deep/ .ant-card-head {
    padding: 0 16px;
    line-height: 44px;
    margin: 0;
    min-height: 44px;
  }
  /deep/ .ant-card-extra , /deep/ .ant-card-head-title{
    padding: 0;
  }

  .user-card /deep/ .ant-card-body {
    padding: 16px;
    height: 363px;
  }

  .user-card /deep/ .ant-card-body .anticon {
    margin-right: 6px;
  }
  .user-card /deep/ .ant-card-body > p{
    margin-bottom: 7px;
    line-height: 22px;
  }
  .user-card /deep/ .ant-card-body > p span:nth-child(1) {
    width: 100px;
    display: inline-block;
    color: #8c8c8c;
    vertical-align: top;
  }
  .user-card /deep/ .ant-card-body > p span:nth-child(2) {
    display: inline-block;
    color: #262626;
  }
  .user-card /deep/ .ant-card-body > p span:nth-child(2) p{
    margin-bottom: 0;
  }
</style>
