<template>
    <a-card title="审批意见" class="card">
        <div class="comment-container">
            <div v-show="xwfState.hasSignOption">
                <a-row>
                    <a-col :span="12">
                        <a-textarea v-model="signParams.content" placeholder="请填写意见" :rows="6"/>
                    </a-col>
                    <a-col :span="12">&nbsp;</a-col>
                    <a-col :span="24" style="margin-top:10px;margin-bottom: 20px">
                        <a-select style="width:140px;margin-right:10px" placeholder="常用意见" :options="defaultCommentList"
                                  @change="onChangeDefaultComment"/>
                        <a-select style="width:140px;margin-right:10px" placeholder="个人常用意见" :options="personalCommentList"
                                  @change="onChangeDefaultComment"/>
                        <a-button @click="onSaveComment" type="primary">保存意见</a-button>
                    </a-col>
                </a-row>
            </div>
            <div v-show="loading" class="loading-text">
                <a-icon type="loading"/>
                正在读取意见数据…
            </div>
            <div v-for="comment in xwfState.opinions" :key="comment.opinionId">
                <a-list v-show="commentList[comment.opinionId]" class="comment-list" itemLayout="horizontal"
                        :header="comment.opinionName" :dataSource="commentList[comment.opinionId]">
                    <a-list-item slot="renderItem" slot-scope="item, index">
                        <div class="ant-col-xs-5">
                        <span class="head">
                            <a-avatar shape="square" size="large" icon="user" :src="'/api/1/user/avatar?id=' + item.userId"/>
                        </span>
                            <span class="autograph">
                            <strong>{{item.userName}}</strong>
                            <small>{{item.createdAt}}</small>
                        </span>
                        </div>
                        <div class="ant-col-xs-19">
                            <div class="approvals">
                                <p slot="content" v-html="$helper.nl2br(item.content)"></p>
                            </div>
                        </div>
                    </a-list-item>
                </a-list>
            </div>
            <div v-show="!hasComment" class="no_comment">
                <img src="/img/no-comment.png">
                <p>暂无意见</p>
            </div>
        </div>
    </a-card>
</template>

<script>
import qs from 'qs'
import { WorkflowEvent } from './WorkflowEvent'

export default {
  name: 'WorkflowComment',
  props: {
    xwfState: {
      type: Object,
      default: null
    }
  },
  mounted () {
    WorkflowEvent.$on('PreXwfNext', () => {
      // 判断是否有填意见，有填意见就先保存意见
      if (this.signParams.content) {
        this._onSaveComment(true)
      }
    })
  },
  created () {
  },
  data () {
    return {
      loading: false,
      signParams: {
        caseId: null,
        caseTypeId: null,
        procInsId: null,
        actInsId: null,
        commentTypeId: null,
        content: null
      },
      defaultCommentList: [],
      personalCommentList: [],
      hasComment: true,
      commentList: []
    }
  },
  watch: {
    xwfState (val) {
      this.xwfState = val
      this.loadCommentList()
    }
  },
  methods: {
    loadCommentList () {
      const that = this
      const params = {
        caseId: this.xwfState.caseId,
        caseTypeId: this.xwfState.caseTypeId,
        procInsId: this.xwfState.procInsId,
        actInsId: this.xwfState.actInsId,
        commentTypeId: this.xwfState.commentTypeId,
        hasSignOption: this.xwfState.hasSignOption,
        hasMend: '',
        state: this.xwfState.procIns.state
      }
      const url = '/api/1/workflow/comment/comment_list.json?'
      that.loading = true
      that.$http.get(url + qs.stringify(params)).then(function (resp) {
        that.loading = false
        that.processData(resp)
      })
    },
    processData (data) {
      // 清空旧的意见内容
      this.commentList = []
      if (this.xwfState.hasSignOption) {
        const ps = {
          caseId: this.xwfState.caseId,
          caseTypeId: this.xwfState.caseTypeId,
          procInsId: this.xwfState.procInsId,
          actInsId: this.xwfState.actInsId,
          commentTypeId: this.xwfState.commentTypeId
        }
        this.signParams = { ...this.signParams, ...ps }
      }
      this.defaultCommentList = data.extras.defaultComment.map(item => {
        return {
          value: item.value,
          label: item.value
        }
      })
      this.personalCommentList = data.extras.personalComment.map(item => {
        return {
          value: item.content,
          label: item.content
        }
      })
      for (let i = 0; i < data.result.length; i++) {
        const item = data.result[i]
        const commentTypeId = item.commentTypeId
        // 如果还不存在这个文档类别意见，新建一个空的
        if (!this.commentList[commentTypeId]) {
          this.commentList[commentTypeId] = []
        }
        this.commentList[commentTypeId].push(item)
      }

      this.hasComment = data.result.length > 0
    },
    onChangeDefaultComment (value) {
      if (this.signParams.content) {
        this.signParams.content = this.signParams.content + ' ' + value
      } else {
        this.signParams.content = value
      }
    },
    onSaveComment () {
      const that = this
      if (!that.signParams.content) {
        this.$warning({
          title: '请填写意见再提交'
        })
        return
      }
      that._onSaveComment(false)
    },
    _onSaveComment (quietly) {
      const that = this
      that.$http.post('/api/1/workflow/comment/save.json', qs.stringify(that.signParams)).then(function (resp) {
        if (quietly) {
          return
        }
        that.$message.success('提交意见成功')
        that.loadCommentList()
        // 发送一个保存成功事件
        WorkflowEvent.$emit('PostCommentSave')
      })
    }
  }
}
</script>

<style scoped>
    .card {
        margin-top: 14px;
    }

    .title {
        color: #717171;
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 16px;
    }

    .loading-text {
        color: #737373;
        margin: 14px 0 6px 0;
    }

    .comment-list .ant-comment-content-author-name {
        font-size: 16px;
        color: #333;
    }

    .comment-list .ant-list-header {
        font-size: 18px !important;
        color: red;
    }

    .comment-list .ant-list-empty-text {
        text-align: left !important;
        padding-left: 42px;
    }

    .comment-container .ant-list-split {
        background: #f8f8f8;
        padding: 0 20px;
        margin-bottom: 6px;
    }

    .comment-container .ant-comment-content-detail p {
        margin: 0;
    }

    .comment-container .comment-list .ant-list-header {
        color: #40a9ff;
    }

    .autograph {
        display: inline-block;
        padding-left: 50px;
        padding-top: 2px;
    }

    .autograph strong {
        display: block;;
    }

    .head {
        position: absolute;
    }

    .head span {
        line-height: 45px;
        height: 45px;
        border-radius: 2px;
    }

    .ant-list-split .ant-list-item {
        padding: 20px 0;
    }

    .approvals {
        display: flex;
        width: 100%;
        justify-content: left;
        min-height: 42px;
        border-left: 1px solid #eee;
        padding-left: 20px;
    }

    .approvals p {
        margin: auto 0;
        font-size: 16px;
        color: #000;
    }

    .ant-table table {
        border: 1px solid #eee;
    }

    .no_comment {
        text-align: center;
    }

    .no_comment img {
        height: 100px;
    }

    .no_comment p {
        margin-top: 6px;
        font-size: 16px;
        color: #838383;
    }
</style>
