<template>
    <page-view :title="knowledgeArticle.title|subString">
        <template slot="action">
            <a-button @click="onEdit" type="primary">编辑</a-button>
            <a-button @click="onDelete" style="margin-left: 10px" type="danger">删除</a-button>
        </template>
        <a-card class="card">
            <div class="content">
                <div class="c-title">
                    <h3>{{knowledgeArticle.title}}</h3>
                    <span>(发表时间:&nbsp;&nbsp;{{knowledgeArticle.extras.publicDate}} &nbsp; {{knowledgeArticle.extras.userName}})</span>
                </div>
                <a-divider/>
                <div class="c-content" v-html="knowledgeArticle.content">
                </div>
            </div>
            <div class="annex">
                <div class="a-title">
                    <a-icon type="file" style="margin-right: 5px"/>
                    <span>相关附件</span>
                </div>

                <upload-selector :referId='knowledgeArticle.id' configKey='KNOWLEDGEBASE.FILE' readonly/>
            </div>
            <!-- 编辑弹窗 -->
            <knowledge-base-edit ref="knowledgeBaseEdit" :visible="modalVisible.knowledgeBaseEdit" @success="onEditSuccess"
                                 @cancel="onEditCancel"></knowledge-base-edit>
        </a-card>
    </page-view>
</template>

<script>
import PageView from '@/layouts/PageView'
import UploadSelector from '@/components/selector/UploadSelector'
import KnowledgeBaseEdit from './KnowledgeBaseEdit'

export default {
  name: 'KnowledgeBaseView',
  components: {
    PageView,
    UploadSelector,
    KnowledgeBaseEdit
  },
  // 截取字符串长度
  filters: {
    subString: function (data) {
      if (data.length > 35) {
        data = data.substring(0, 30) + '...'
      }
      return data
    }
  },
  created () {
    this.loadData()
  },
  data () {
    return {
      loadId: this.$route.query.id,
      knowledgeArticle: {
        id: '',
        title: '',
        content: '',
        extras: {
          publicDate: null,
          hasEdit: null
        }
      },
      // 对话框是否显示
      modalVisible: {
        knowledgeBaseEdit: false
      }
    }
  },
  methods: {
    // 初始化数据
    loadData () {
      const that = this
      that.$http.get('/api/1/knowledge_base/get_knowledge_base.json?id=' + that.loadId).then(function (res) {
        let result = res.result
        that.knowledgeArticle = result
      })
    },

    onEdit () {
      if (this.knowledgeArticle.extras.hasEdit){
        this.modalVisible.knowledgeBaseEdit = true
        this.$refs.knowledgeBaseEdit.knowledgeBaseEdit(this.loadId)
      } else {
        this.$message.success('没有权限操作')
      }
    },
    onEditSuccess () {
      this.modalVisible.knowledgeBaseEdit = false
      this.loadData()
    },
    onEditCancel () {
      this.modalVisible.knowledgeBaseEdit = false
    },

    onDelete () {
      const that = this
      if (this.knowledgeArticle.extras.hasEdit) {
        this.$confirm({
          title: '是否确认删除内容？',
          onOk () {
            that.$http.post('/api/1/knowledge_base/delete_knowledge_base.json?id=' + that.loadId).then(function (res) {
              if (res.code !== 200) {
                return
              }
              that.$message.success('删除文章成功')
              that.$router.push({ path: '/knowledgebase/index' })
            })
          }
        })
      }else {
        this.$message.success('没有权限操作')
      }
    }
  }
}
</script>

<style scoped>
    .card {
        background: #FAFAFA;
    }

    .content {
        background: #FFFFFF;
        float: left;
        width: 70%;
    }

    .content .c-content {
        padding: 0 20px;
    }

    .content .c-title {
        padding: 0 50px;
        text-align: center;
        color: #52c41a;
    }

    .content .c-title h3 {
        margin-top: 10px;
    }

    .annex {
        background: #FFFFFF;
        border-left: 1px solid #F0F2F5;
        margin-left: 10px;
        height: 250px;
        float: right;
        width: 28%;
    }

    .annex .a-title {
        padding: 5px 0 10px 10px;
        margin-top: 10px;
        border-bottom: 1px dashed #E8E8E8;
    }


</style>
