<template>
    <page-view title="公告详情">

        <template slot="action">
            <span class="readOrange">
              <a-button  @click="noRead(id)">阅读统计</a-button>&nbsp;
              <a-button  @click="read(id)">本机构阅读统计</a-button>
            </span>
             <workflow-menu slot="xwfMenu" @onLoadXWFState="onLoadXWFState"/>
            <a-button-group v-show="xwfState.hasEdit" style="margin-right: 4px;">
                <a-popconfirm placement="bottom" title="是否确认删除?" @confirm="deleteTrip(trip)">
                    <a-button :loading="loading">删除</a-button>
                </a-popconfirm>
            </a-button-group>
            <a-button v-show="xwfState.hasEdit" type="primary" @click="onView">编辑</a-button>
        </template>
        <a-card title="">
            <a-tabs defaultActiveKey="1">
              <a-tab-pane tab="公告呈批表" key="1">
                <table class="fx-form-view">
                <tr>
                    <th>
                        公告标题
                    </th>
                    <td colspan="4">
                          {{announView.title}}
                    </td>
                </tr>
                <tr>
                    <th>发布人</th>
                    <td>
                        {{announView.extras.userName}}
                    </td>
                    <th>发布单位</th>
                    <td>
                        {{announView.extras.publishDeptName}}
                    </td>
                </tr>
                <tr>
                    <th>紧急程度</th>
                    <td>
                       <a-tag v-if="announView.urgency === '1'" color="blue">平件</a-tag>
                       <a-tag v-else-if="announView.urgency==='2'" color="orange">急</a-tag>
                       <a-tag v-else-if="announView.urgency==='3'" color="pink">特急</a-tag>
                       <a-tag v-else color="red">特提</a-tag>
                    </td>
                    <th>公告类型</th>
                    <td>
                       <a-tag v-if="announView.annTypes === '1'" color="blue">普通通知</a-tag>
                       <a-tag v-else-if="announView.annTypes==='2'" color="red">紧急通知</a-tag>
                       <a-tag v-else-if="announView.annTypes==='3'" color="blue">普通公告</a-tag>
                       <a-tag v-else color="pink">特别公告</a-tag>
                    </td>
                </tr>
                <tr>
                    <th>发布范围</th>
                    <td colspan="4">
                          <span v-for="(item,index) in scopeList" :key="index">
                            <span class="organ">{{item.type}}:</span>
                            <span>{{item.values}}</span>&nbsp;&nbsp;
                         </span>
                    </td>
                </tr>
                <tr>
                   <th>公告文件</th>
                    <td colspan="4">
                       <upload-selector :referId='announView.id' configKey='NOTICE.FILE' readonly />
                    </td>
                </tr>
              </table>
            </a-tab-pane>
              <a-tab-pane tab="公告登记信息" key="2" forceRender>
                <table class="fx-form-view">
                <tr>
                    <th>
                        公告标题
                    </th>
                    <td colspan="4">
                        {{announView.title}}
                    </td>
                </tr>
                <tr>
                    <th>登记时间</th>
                    <td>
                        {{announView.extras.registerDateSub}}
                    </td>
                    <th>结束时间</th>
                    <td>
                        {{announView.extras.effectDateSub}}
                    </td>
                </tr>
                <tr>
                    <th>发布人</th>
                    <td>
                       {{announView.extras.userName}}
                    </td>
                    <th>发布单位</th>
                    <td>
                        {{announView.extras.publishDeptName}}
                    </td>
                </tr>
                <tr>
                    <th>紧急程度</th>
                    <td>
                       <a-tag v-if="announView.urgency === '1'" color="blue">平件</a-tag>
                       <a-tag v-else-if="announView.urgency==='2'" color="orange">急</a-tag>
                       <a-tag v-else-if="announView.urgency==='3'" color="pink">特急</a-tag>
                       <a-tag v-else color="red">特提</a-tag>
                    </td>
                    <th>公告类型</th>
                    <td>
                        <a-tag v-if="announView.annTypes === '1'" color="blue">普通通知</a-tag>
                       <a-tag v-else-if="announView.annTypes==='2'" color="red">紧急通知</a-tag>
                       <a-tag v-else-if="announView.annTypes==='3'" color="blue">普通公告</a-tag>
                       <a-tag v-else color="pink">特别公告</a-tag>
                    </td>
                </tr>
                <tr>
                    <th>审核人</th>
                    <td>
                       {{announView.extras.reviewerUserName}}
                    </td>
                    <th>发放范围</th>
                    <td>
                        <span v-for="(item,index) in scopeList" :key="index">
                            <span class="organ">{{item.type}}:</span>
                            <span>{{item.values}}</span>&nbsp;&nbsp;
                         </span>
                    </td>
                </tr>
                 <tr>
                   <th>公告文件</th>
                    <td colspan="4">
                       <upload-selector :referId='announView.id' configKey='NOTICE.FILE' readonly />
                    </td>
                </tr>
                <tr>
                    <th>公告内容</th>
                    <td colspan="4">
                        <span v-html="announView.content"></span>
                    </td>
                </tr>
                 <tr>
                    <th>备注</th>
                    <td colspan="4" >
                        {{announView.memo}}
                    </td>
                </tr>
            </table>
         </a-tab-pane>
        </a-tabs>
      </a-card>
      <workflow-comment :xwfState="xwfState" />
      <announce-no-read ref="announceNoread" :visible="announceNoView" @success="onOk" @cancel="onCancel "/>
      <announce-read  ref="announceRead" :visible="announceView" @success="onOkRead" @cancel="onCancelRead"/>
    </page-view>
</template>
<script>
import { PageView } from '@/layouts'
import WorkflowMenu from '@/components/workflow/WorkflowMenu'
import WorkflowComment from '@/components/workflow/WorkflowComment'
import announceNoRead from './announceNoRead'
import announceRead from './announceRead'
import UploadSelector from '@/components/selector/UploadSelector'
export default {
  name: 'announceSearch',
  components: {
    PageView,
    WorkflowMenu,
    WorkflowComment,
    announceNoRead,
    announceRead,
    UploadSelector
  },
  created () {
    this.onload()
  },
  data () {
    return {
      announView: {
        extras: {}
      },
      announceNoView: false,
      announceView: false,
      xwfState: {},
      scopeList: [],
      loading: false,
      id: this.$route.query.id,
      trip: {
        id: this.$route.query.id
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
    onOk () {
      this.announceNoView = false
    },
    onCancel () {
      this.announceNoView = false
    },
    onOkRead () {
      this.announceView = false
    },
    onCancelRead () {
      this.announceView = false
    },
    onload () {
      this.$http.get('/api/1/announce/get_announce_details.json?id=' + this.id).then((res) => {
        this.scopeList = res.result.scopeList
        this.announView = res.result
      }).catch(function () {
      })
    },
    onLoadXWFState (xwfState) {
      this.xwfState = xwfState
    },
    deleteTrip (trip) {
      let that = this
      that.loading = true
      this.$http.post('/api/1/announce/delete_announce.json?id=' + trip.id).then(function (response) {
        that.loading = false
        if (response.code === 200) {
          that.$message.success('删除成功')
          that.$router.push({ path: '/announce/list' })
        }
      })
    },
    onView () {
      this.$router.push({ path: '/announce/edit?id=' + this.id })
    }
  }
}
</script>
<style scoped>
    .ant-card-body{
        padding:24px 16px;
    }
    .btn{
        text-align: center;
        margin-top: 15px;
    }
    .exit{
       margin-right: 10px;
    }
     .organ{
      font-weight: 600;
    }
    th{
        font-weight: 800;
    }
    .readOrange{
        margin-right: 13px;
    }
</style>
