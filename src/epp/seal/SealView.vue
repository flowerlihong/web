<template>
    <page-view title="盖章管理">
        <workflow-menu slot="xwfMenu" @onLoadXWFState="onLoadXWFState"/>
        <template slot="action">
            <a-button-group v-show="xwfState.hasEdit || permission" style="margin-right: 4px;">
                <a-popconfirm placement="bottom" title="是否确认删除?" @confirm="deleteTrip(seal)">
                    <a-button :loading="loading">删除</a-button>
                </a-popconfirm>
            </a-button-group>
            <a-button v-show="xwfState.hasEdit || permission" type="primary" @click="onView(seal)">编辑</a-button>
        </template>
        <a-card>
            <div>
                <table class="fx-form-view">
                    <tr>
                        <th>申请人</th>
                        <td>
                            {{seal.extras.userName}}
                        </td>
                        <th>申请登记时间</th>
                        <td>
                            <div>{{seal.extras.createdAt}}</div>
                        </td>
                    </tr>
                    <tr>
                        <th>盖章事宜</th>
                        <td colspan="3">
                            <div>{{seal.title}}</div>
                        </td>
                    </tr>
                    <tr>
                        <th>盖章理由</th>
                        <td colspan="3">
                            <div>{{seal.content}}</div>
                        </td>
                    </tr>
                    <tr>
                        <th>盖章文件</th>
                        <td colspan="3">
                            <upload-selector readonly :referId='seal.id' configKey='SEAL.FILE' />
                        </td>
                    </tr>
                </table>
            </div>
        </a-card>
        <workflow-comment :xwfState="xwfState" />
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import WorkflowMenu from '@/components/workflow/WorkflowMenu'
import WorkflowComment from '@/components/workflow/WorkflowComment'
import UploadSelector from '@/components/selector/UploadSelector'

export default {
  name: 'SealView',
  components: {
    PageView,
    WorkflowMenu,
    WorkflowComment,
    UploadSelector
  },
  created () {
    this.loadData()
    this.hasPermission()
  },
  data () {
    return {
      xwfState: {},
      loading: false,
      permission: false,
      form: this.$form.createForm(this),
      seal: {
        id: this.$route.query.id,
        extras: {
          userName: ''
        }
      }
    }
  },
  methods: {
    callback (key) {
      console.log(key)
    },
    onLoadXWFState (xwfState) {
      this.xwfState = xwfState
    },
    loadData () {
      let that = this
      this.$http.get('/api/1/seal/get_seal.json?id=' + this.seal.id).then(function (response) {
        let result = response.result
        that.seal = result
      })
    },
    deleteTrip (seal) {
      let that = this
      that.loading = true
      this.$http.post('/api/1/seal/delete_seal.json?id=' + seal.id).then(function (response) {
        that.loading = false
        if (response.code === 200) {
          that.$message.success('删除成功')
          that.$router.push({ path: '/seal/index' })
        }
      })
    },
    hasPermission () {
      const that = this
      that.$http.get('/api/1/pay_apply/get_permission.json').then(function (resp) {
        that.permission = resp.hasPermission
      })
    },
    onView (seal) {
      this.$router.push({ path: '/seal/edit?id=' + seal.id })
    }
  }
}
</script>

<style scoped>
    .card {
        margin-bottom: 24px;
    }

    th {
        width: 130px !important;
    }

    table .ant-form-item {
        margin-bottom: 0;
    }
</style>
