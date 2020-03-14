<template>
  <a-card>
    <div class="co-body-top">
      <a-input-search placeholder="输入您要搜索的资质信息" style="width: 250px" @search="onSearch" />
      <router-link to=""><a-button type="primary" icon="plus" :size="size" @click="onAdd">新增资质</a-button></router-link>
    </div>
    <a-list itemLayout="horizontal" :dataSource="data">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-list-item-meta>
          <a-avatar
                  shape="square"
                  :size="100"
                  slot="avatar"
                  :src="'api/1/qualification/avatar.json?id=' + item.id + '&s='+ time"
          />
          <span slot="title">{{item.qualifyName}}</span>
          <div class="list-text" slot="description">
            <span style="width: 200px;display: inline-block">资质等级：{{gradeFormat(item.qualifyGrade)}}</span>
            <span>资质编号：{{item.code}}</span>
          </div>
          <div class="list-text" slot="description" v-if="!item.dateless">
            <span>资质有效期：{{dateFormat(item.startTime)}} &nbsp;至 &nbsp; {{dateFormat(item.endTime)}}</span>
          </div>
          <div class="list-text" slot="description" v-if="item.dateless">
            <span>资质有效期：无限期</span>
          </div>
        </a-list-item-meta>
        <a-button slot="actions" icon="form" @click="onEdit(item.id)" >编辑</a-button>
      </a-list-item>
    </a-list>
    <qualification-add ref="qualificationAdd" :visible="modalVisible.qualificationAdd" @cancel="onAddCancel"
                 @success="onAddSucess" :companyId="companyId"></qualification-add>
    <qualification-edit ref="qualificationEdit" :visible="modalVisible.qualificationEdit" @cancel="onEditCancel"
                 @success="onEditSucess"></qualification-edit>
  </a-card>
</template>

<script>
import qs from 'qs'
import QualificationAdd from './QualificationAdd'
import QualificationEdit from './QualificationEdit'
export default {
  name: 'QualificationView',
  data () {
    return {
      data: [],
      size: 'default',
      time: '',
      modalVisible: {
        qualificationAdd: false,
        qualificationEdit: false
      }
    }
  },
  components: {
    QualificationAdd,
    QualificationEdit
  },
  created () {
    this.init()
  },
  props: [
    'companyId'
  ],
  methods: {
    onAdd () {
      this.modalVisible.qualificationAdd = true
    },
    onAddCancel () {
      this.modalVisible.qualificationAdd = false
    },
    onAddSucess () {
      this.modalVisible.qualificationAdd = false
      this.init()
      this.time = (new Date()).getTime()
    },
    onEdit (qualifiyId) {
      this.modalVisible.qualificationEdit = true
      this.$refs.qualificationEdit.qualificationEdit(qualifiyId)
    },
    onEditCancel () {
      this.modalVisible.qualificationEdit = false
    },
    onEditSucess () {
      this.modalVisible.qualificationEdit = false
      this.init()
    },
    onSearch (value) {
      const that = this
      this.$http.post('/api/1/qualification/get_qualify_list_by_key.json', qs.stringify({ keyWord: value, companyId: that.companyId })).then(function (res) {
        if (res.code !== 200) {
          return
        }
        that.data = res.result
      })
    },
    init () {
      const that = this
      this.$http.post('/api/1/qualification/get_qualify_list.json', qs.stringify({ companyId: that.companyId })).then(function (res) {
        if (res.code !== 200) {
          return
        }
        that.data = res.result
      })
    },
    dateFormat (dateTime) {
      if (dateTime === null) {
        return dateTime
      } else {
        return dateTime.substring(0, 10)
      }
    },
    gradeFormat (grade) {
      if (grade === 1) {
        return '一级'
      }
      if (grade === 2) {
        return '二级'
      }
      if (grade === 3) {
        return '三级'
      }
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
