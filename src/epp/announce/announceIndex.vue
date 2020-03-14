<template>
    <page-view title="公告查询">
        <a-card>
            <a-form :form="form">
                <table class="fx-form">
                    <tr>
                        <th>标题</th>
                        <td>
                            <a-form-item>
                                <a-input v-model="announce.title "></a-input>
                            </a-form-item>
                        </td>
                        <th>发布人</th>
                        <td>
                            <a-form-item>
                                  <user-selector v-model="announce.userId"
                                    @change="onChangeUser"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th>发布单位</th>
                        <td>
                            <a-form-item>
                                   <dept-selector @change="onDeptChange" v-model="announce.publishDept"/>
                            </a-form-item>
                        </td>
                        <th>登记时间</th>
                        <td>
                            <a-form-item>
                                    <a-date-picker format="YYYY-MM-DD"  v-model="announce.registerDate " />
                            </a-form-item>
                        </td>
                    </tr>
                     <tr>
                        <th>类型</th>
                        <td>
                            <a-form-item>
                                <dict-cascader v-model="announce.annTypes" dictKey="ANNOUNCE.ANN_TYPES"/>
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" align="center">
                            <a-button type="primary" @click="onSearch">查询</a-button>
                            <a-button @click="reset" style="margin-left: 20px">重置</a-button>
                        </td>
                    </tr>
                </table>
            </a-form>
            <s-table
                    ref="table"
                    v-if="power===false"
                    :columns="columns"
                    :data="loadData"
                    :rowKey="record => record.id">
                <template slot="type" slot-scope="record">
                    <a-tag v-if="record.annTypes === '1'" color="blue">普通通知</a-tag>
                    <a-tag v-else-if="record.annTypes==='2'" color="red">紧急通知</a-tag>
                    <a-tag v-else-if="record.annTypes==='3'" color="blue">普通公告</a-tag>
                    <a-tag v-else color="pink">特别公告</a-tag>
                </template>
                <template slot="titles" slot-scope="record">
                     <div v-if="record.title.length > 10">
                        <a @click="onView(record)">{{record.title.substring(0,10)}}...</a>
                    </div>
                    <div v-else>
                        <a @click="onView(record)">{{record.title}}</a>
                    </div>
                </template>
                 <template slot="organsize" slot-scope="record">
                    {{record.extras.publishDeptName}}
                </template>
                <template slot="user" slot-scope="record">
                    {{record.extras.userName}}
                </template>
                <template slot="time" slot-scope="record">
                    {{record.extras.registerDateSub }}
                </template>
                <template slot="emergency" slot-scope="record">
                    <a-tag v-if="record.urgency === '1'" color="blue">平件</a-tag>
                    <a-tag v-else-if="record.urgency==='2'" color="orange">急</a-tag>
                    <a-tag v-else-if="record.urgency==='3'" color="pink">特急</a-tag>
                    <a-tag v-else color="red">特提</a-tag>
                </template>
                <template slot="state" slot-scope="record">
                    <a-tag v-if="record.activeStatus === '1'" color="blue">审批中</a-tag>
                    <a-tag v-else-if="record.activeStatus==='2'" color="green">有效公告</a-tag>
                    <a-tag v-else color="purple">历史公告</a-tag>
                </template>
            </s-table>
             <s-table
                    ref="table"
                    v-if="power===true"
                    :columns="columns1"
                    :data="loadData"
                    :rowKey="record => record.id">
                <template slot="type" slot-scope="record">
                    <a-tag v-if="record.annTypes === '1'" color="blue">普通通知</a-tag>
                    <a-tag v-else-if="record.annTypes==='2'" color="red">紧急通知</a-tag>
                    <a-tag v-else-if="record.annTypes==='3'" color="blue">普通公告</a-tag>
                    <a-tag v-else color="pink">特别公告</a-tag>
                </template>
                <template slot="titles" slot-scope="record">
                     <div v-if="record.title.length > 10">
                        <a @click="onView(record)">{{record.title.substring(0,10)}}...</a>
                    </div>
                    <div v-else>
                        <a @click="onView(record)">{{record.title}}</a>
                    </div>
                </template>
                 <template slot="organsize" slot-scope="record">
                    {{record.extras.publishDeptName}}
                </template>
                <template slot="user" slot-scope="record">
                    {{record.extras.userName}}
                </template>
                <template slot="time" slot-scope="record">
                    {{record.extras.registerDateSub}}
                </template>
                <template slot="emergency" slot-scope="record">
                    <a-tag v-if="record.urgency === '1'" color="blue">平件</a-tag>
                    <a-tag v-else-if="record.urgency==='2'" color="orange">急</a-tag>
                    <a-tag v-else-if="record.urgency==='3'" color="pink">特急</a-tag>
                    <a-tag v-else color="red">特提</a-tag>
                </template>
                <template slot="state" slot-scope="record">
                    <a-tag v-if="record.activeStatus === '1'" color="blue">审批中</a-tag>
                    <a-tag v-else-if="record.activeStatus==='2'" color="green">有效公告</a-tag>
                    <a-tag v-else color="purple">历史公告</a-tag>
                </template>
                <template slot="operate" slot-scope="record">
                    <a @click.stop="onEditAnn(record.id)">修改</a>&nbsp;
                    <a-popconfirm placement="bottom" title="是否确认删除?" @confirm="deleteAnn(record.id)">
                        <a>删除</a>
                    </a-popconfirm>
                </template>
            </s-table>
        </a-card>
    </page-view>
</template>
<script>
import { PageView } from '@/layouts'
import STable from '@/components/Table'
import qs from 'qs'
import UserSelector from '@/components/selector/UserSelector'
import DeptSelector from '@/components/selector/DeptSelector'
import DictCascader from '../../components/dict/DictCascader'
export default {
  name: 'BookIndex',
  components: {
    PageView,
    STable,
    UserSelector,
    DeptSelector,
    DictCascader
  },
  created () {
    this.onAuthority()
  },
  data () {
    return {
      columns: [
        {
          title: '类型',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '公告通知标题',
          align: 'left',
          scopedSlots: { customRender: 'titles' }
        },
        {
          title: '发布单位',
          align: 'center',
          scopedSlots: { customRender: 'organsize' }
        },
        {
          title: '发布人',
          align: 'center',
          scopedSlots: { customRender: 'user' }
        },
        {
          title: '登记时间',
          align: 'center',
          scopedSlots: { customRender: 'time' }
        },
        {
          title: '紧急程度',
          align: 'center',
          scopedSlots: { customRender: 'emergency' }
        },
        {
          title: '状态',
          align: 'center',
          scopedSlots: { customRender: 'state' }
        }
      ],
      columns1: [
        {
          title: '类型',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '公告通知标题',
          align: 'left',
          scopedSlots: { customRender: 'titles' }
        },
        {
          title: '发布单位',
          align: 'center',
          scopedSlots: { customRender: 'organsize' }
        },
        {
          title: '发布人',
          align: 'center',
          scopedSlots: { customRender: 'user' }
        },
        {
          title: '登记时间',
          align: 'center',
          scopedSlots: { customRender: 'time' }
        },
        {
          title: '紧急程度',
          align: 'center',
          scopedSlots: { customRender: 'emergency' }
        },
        {
          title: '状态',
          align: 'center',
          scopedSlots: { customRender: 'state' }
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: { customRender: 'operate' }
        }
      ],
      loading: false,
      power: null,
      form: this.$form.createForm(this),
      announce: {
        title: null,
        userId: '',
        registerDate: null,
        publishDept: '',
        annTypes: null
      },
      queryParam: {
      },
      loadData: parameter => {
        return this.$http.get('/api/1/announce/query_announce_list.json', { params: Object.assign(parameter, this.queryParam),
          paramsSerializer: function (params) {
            return qs.stringify(params, { indices: false })
          }
        }).then(res => {
          return res
        })
      }
    }
  },
  methods: {
    reset () {
      this.announce.title = null
      this.announce.userId = ''
      this.announce.registerDate = null
      this.announce.publishDept = ''
      this.announce.annTypes = ''
    },
    onSearch () {
      this.queryParam = { ...this.announce }
      // 日期组件返回的是 moment 对象，需要转换为字符串时间
      if (this.queryParam.registerDate) {
        this.queryParam.registerDate = this.queryParam.registerDate.format('YYYY-MM-DD')
      }
      this.$refs.table.refresh()
    },
    onChangeUser (selectedIds) {
      this.announce.userId = selectedIds
    },
    onDeptChange (selectedIds) {
      this.announce.publishDept = selectedIds
    },
    onEditAnn (val) {
      this.$router.push({ path: '/announce/edit?id=' + val })
    },
    deleteAnn (val) {
      this.$http.post('/api/1/announce/delete_announce.json?id=' + val).then(
        () => {
          this.$message.success('删除成功')
          this.$refs.table.refresh()
        }
      )
    },
    onAuthority () {
      let that = this
      that.$http.post('/api/1/announce/get_ann_adm_authority.json').then(function (response) {
        if (response.code === 200) {
          that.power = false
          if (response.msg === 'true') {
            that.power = true
          }
        }
      })
    },
    onView (record) {
      let routeIndex = this.$router.resolve({
        path: '/announce/view',
        query: { id: record.id }
      })
      window.open(routeIndex.href, '_blank')
    }
  }
}
</script>
<style scoped>
   .table-wrapper{
       margin-top: 1%;
   }
</style>
