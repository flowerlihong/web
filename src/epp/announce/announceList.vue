<template>
    <page-view title="公告列表">
        <a-card>
           <div class="selectDowm">
               <span class="leixing">
                按类型查看
                <dict-cascader v-model="queryForm.annTypes " dictKey="ANNOUNCE.ANN_TYPES"/>
               </span>
               <span class="status">
                 按状态查看
                 <a-select style="width: 120px" v-model="queryForm.activeStatus">
                    <a-select-option value="">不限</a-select-option>
                    <a-select-option value="1">审批中</a-select-option>
                    <a-select-option value="2">有效公告</a-select-option>
                    <a-select-option value="3">历史公告</a-select-option>
                </a-select>
               </span>
               <span>
                  <a-button type="primary" @click="onSearch">查询</a-button>
               </span>
           </div>
            <s-table
                    ref="table"
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
                        <a @click="onView(record)" target="_blank">{{record.title}}</a>
                    </div>
                </template>
                <template slot="releaseTime" slot-scope="record">
                       {{record.extras.publicDateSub}}
                </template>
                <template slot="releaseRange" slot-scope="record">
                    <span>{{record.scopeTypes}}</span>
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
        </a-card>
    </page-view>
</template>
<script>
import { PageView } from '@/layouts'
import qs from 'qs'
import STable from '@/components/Table'
import DictCascader from '../../components/dict/DictCascader'
export default {
  components: {
    PageView,
    STable,
    DictCascader
  },
  data () {
    return {
      columns: [
        {
          title: '类型',
          align: 'center',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '标题',
          align: 'center',
          scopedSlots: { customRender: 'titles' }
        },
        {
          title: '发布时间',
          align: 'center',
          scopedSlots: { customRender: 'releaseTime' }
        },
        {
          title: '发布范围',
          align: 'center',
          scopedSlots: { customRender: 'releaseRange' }
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
      queryForm: {
        annTypes: null,
        activeStatus: ''
      },
      queryParam: {
      },
      loadData: parameter => {
        return this.$http.get('/api/1/announce/query_announce_approval.json'
          , { params: Object.assign(parameter, this.queryParam),
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
    onView (record) {
      localStorage.setItem('activeStatus', record.activeStatus)
      let routeData = this.$router.resolve({
        path: '/announce/search',
        query: { id: record.id }
      })
      window.open(routeData.href, '_blank')
    },
    onSearch () {
      this.queryParam = { ...this.queryForm }
      this.$refs.table.refresh()
    }
  }
}
</script>

<style scoped>
    .card {
        margin-bottom: 24px;
    }
    table .ant-form-item {
        margin-bottom: 0;
    }
    .status{
        margin:0 30px;
    }
    .selectDowm{
      margin-bottom: 20px;
    }
</style>
