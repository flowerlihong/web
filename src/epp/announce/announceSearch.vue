<template>
    <page-view title="公告查看详情">
      <a-card title="">
            <div class="topic">
                <div class="topic1">{{announSearch.title}}</div>
                <div>
                    <span>发布人：{{ announSearch.extras.userName}}</span>&nbsp;&nbsp;
                    <span>发布时间：{{announSearch.extras.publicDateSub}}</span>&nbsp;&nbsp;
                    <span>结束时间：{{announSearch.extras.effectDateSub}}</span>
               </div>
            </div><hr>
            <span v-html="announSearch.content" class="content"></span>
            <hr>
            <div>
                 <span class="publish">发布范围:</span>&nbsp;
                 <span v-for="(item,index) in scopeList" :key="index">
                    <span class="organ">{{item.type}}:</span>
                    <span>{{item.values}}</span>&nbsp;
                </span>
            </div>
            <div class="file">
                <span class="publish noticeFile">公告文件:</span>
                <upload-selector :referId='announSearch.id' configKey='NOTICE.FILE' readonly />
            </div>
            <div class="read">
               <a @click="noRead(data.id)">阅读统计</a>&nbsp;&nbsp;&nbsp;
               <a @click="read(data.id)">本机构阅读统计</a>
            </div>
        <announce-no-read ref="announceNoread" :visible="announceNoView"  @cancel="onCancel"/>
        <announce-read  ref="announceRead" :visible="announceView"  @cancel="onCancelRead"/>
      </a-card>
    </page-view>
</template>
<script>
import qs from 'qs'
import { PageView } from '@/layouts'
import announceNoRead from './announceNoRead'
import announceRead from './announceRead'
import UploadSelector from '@/components/selector/UploadSelector'
export default {
  name: 'announceSearch',
  components: {
    PageView,
    announceNoRead,
    announceRead,
    UploadSelector
  },
  created () {
    this.onload()
  },
  data () {
    return {
      scopeList: [],
      announceNoView: false,
      announceView: false,
      data: {
        id: this.$route.query.id,
        activeStatus: ''
      },
      announSearch: {
        extras: {}
      }
    }
  },
  methods: {
    noRead (id) {
      this.announceNoView = true
      this.$refs.announceNoread.noaRead(id)
    },
    read (id) {
      this.announceView = true
      this.$refs.announceRead.noaeRead(id)
    },
    onCancel () {
      this.announceNoView = false
    },
    onCancelRead () {
      this.announceView = false
    },
    onload () {
      this.data.activeStatus = localStorage.getItem('activeStatus')
      this.$http.post('/api/1/announce/get_announce.json', qs.stringify(this.data)).then((res) => {
        if (!res.result.extras.userName) {
          this.$router.push({ path: '/announce/list' })
          return
        }
        this.scopeList = res.result.scopeList
        this.announSearch = res.result
      }).catch(function () {
      })
    }
  }
}
</script>
<style scoped lang="less">
    .ant-card-body{
        padding:24px 16px;
    }
    .read{
      margin-top:10px;
    }
    .organ,.publish{
      font-weight: 600;
    }
    .topic{
      text-align: center;
      .topic1{
          font-size: 30px;
          font-weight: 800;
          color:#ed4828;
      }
    }
    .content{
      display:block;
      padding:0 13% 0 9%;
    }
    .file{
      display: flex;
    }
    .noticeFile{
      margin-top: 8px;
    }
</style>
