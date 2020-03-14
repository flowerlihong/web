<template>
  <a-card>
    <div class="co-body-top">
      <span>年份：</span>
      <a-select defaultValue="请选择年份" style="margin-right: 20px;min-width: 120px;" @change="handleChange">
        <a-select-option v-for="(item,i) in yearList" :key="i" :value="item.year">{{ item.year }}</a-select-option>
      </a-select>
      <router-link to="">
        <a-button type="primary" icon="plus" :size="size" @click="onAdd">新增社保信息</a-button>
      </router-link>
    </div>
    <div class="co-body">
      <a-card hoverable style="width: 180px"  v-for="item in socialList" :key="item.id">
        <img
                alt="avatar"
                :src="'api/1/social/avatar.json?id=' + item.id +'&s=' +time"
                slot="cover"
                height="250"
                @click="view(item.id)"
        />
        <a-card-meta :title="item.year+'-'+item.month+'月'+item.title" @click="onEdit(item.id)" ></a-card-meta>
      </a-card>
    </div>
    <social-add ref="socialAdd" :visible="modalVisible.socialAdd" @cancel="onAddCancel"
                 @success="onAddSucess" :companyId="companyId"></social-add>
    <social-edit ref="socialEdit" :visible="modalVisible.socialEdit" @cancel="onEditCancel"
                 @success="onEditSucess" :companyId="companyId"></social-edit>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel" style="width: 432px; height: 600px; ">
      <img alt="example" style="width: 100%; height: 100%;" :src="'api/1/social/avatar.json?id=' + social.id" />
    </a-modal>
  </a-card>
</template>

<script>
import qs from 'qs'
import SocialAdd from './SocialAdd'
import SocialEdit from './SocialEdit'
export default {
  name: 'SocialView',
  data () {
    return {
      yearList: [],
      socialList: [],
      size: 'default',
      previewVisible: false,
      modalVisible: {
        socialAdd: false,
        socialEdit: false
      },
      time: '',
      social: {
        id: ''
      }
    }
  },
  created () {
    this.init()
    this.year()
  },
  components: {
    SocialAdd,
    SocialEdit
  },
  props: [
    'companyId'
  ],
  methods: {
    init () {
      const that = this
      this.$http.post('/api/1/social/get_social_list.json', qs.stringify({ companyId: that.companyId })).then(function (res) {
        if (res.code !== 200) {
          return
        }
        that.socialList = res.result
      })
    },
    year () {
      const that = this
      this.$http.post('/api/1/social/get_social_year_list.json', qs.stringify({ companyId: that.companyId })).then(function (res) {
        if (res.code !== 200) {
          return
        }
        that.yearList = res.result
      })
    },
    onAdd () {
      this.modalVisible.socialAdd = true
    },
    handleChange (value) {
      const that = this
      this.$http.post('/api/1/social/get_social_list_by_year.json', qs.stringify({ companyId: that.companyId, year: value })).then(function (res) {
        if (res.code !== 200) {
          return
        }
        that.socialList = res.result
      })
    },
    onAddSucess () {
      this.modalVisible.socialAdd = false
      this.init()
      this.year()
    },
    onAddCancel () {
      this.modalVisible.socialAdd = false
    },
    onEdit (id) {
      this.modalVisible.socialEdit = true
      this.$refs.socialEdit.onEdit(id)
    },
    onEditSucess () {
      this.modalVisible.socialEdit = false
      this.time = (new Date()).getTime()
      this.init()
      this.year()
    },
    onEditCancel () {
      this.modalVisible.socialEdit = false
    },
    view (id) {
      this.previewVisible = true
      this.social.id = id
    },
    handleCancel () {
      this.previewVisible = false
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
  /deep/ .ant-card-meta-title{
    text-align: center;
    padding: 12px 0;
  }
  .co-body .ant-card-cover img{
    border: 1px solid #e6e6e6;
    cursor: zoom-in;
  }
  .co-body .ant-card{
    display: inline-block;
    margin-right: 5px;
    padding: 0 12px;
    box-sizing: content-box;
  }
</style>
