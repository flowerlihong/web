<template>
    <page-view :avatar="avatar">
        <div slot="headerContent">
            <div class="title">{{user.nicknameFallback}}</div>
            <div>{{user.dept.name}} - {{user.org.name}}</div>
        </div>
        <div slot="extra">
        </div>

        <div>
            <a-row :gutter="24">
                <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
                    <a-card :loading="loading.task" title="我的待办" :bordered="false" style="margin-bottom: 24px;">
                        <router-link to="/workflow/task" slot="extra">更多</router-link>
                        <a-list>
                            <a-list-item :key="index" v-for="(item, index) in tasks">
                                <a-list-item-meta>
                                    <a-avatar slot="avatar" :src="'/api/1/user/avatar?id=' + item.createUserId"/>
                                    <div slot="title">
                                        <a @click="onViewTask(item)">{{ item.title }}</a>
                                    </div>
                                    <div slot="description">
                                        {{ item.createUser }} / <span style="cursor:help"><a-tooltip><template slot='title'>{{ item.createDate }}</template>{{ item.createDateAgo }}</a-tooltip></span>
                                    </div>
                                </a-list-item-meta>
                            </a-list-item>
                        </a-list>
                    </a-card>

                    <a-card :loading="loading.passTask" title="我的经办" :bordered="false">
                        <router-link to="/workflow/pass" slot="extra">更多</router-link>
                        <a-list>
                            <a-list-item :key="index" v-for="(item, index) in passTasks">
                                <a-list-item-meta>
                                    <a-avatar slot="avatar" :src="'/api/1/user/avatar?id=' + item.create_user_id"/>
                                    <div slot="title">
                                        <a @click="onViewPassTask(item)">{{ item.title }}</a>
                                    </div>
                                    <div slot="description">
                                        {{ item.create_user }} / <span style="cursor:help"><a-tooltip><template slot='title'>{{ item.create_date }}</template>{{ item.create_date_ago }}</a-tooltip></span>
                                    </div>
                                </a-list-item-meta>
                            </a-list-item>
                        </a-list>
                    </a-card>
                </a-col>
                <a-col style="padding: 0 12px" :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
                    <!-- <a-card :loading="true" title="通知公告" :bordered="false">
                        <div class="members">
                        </div>
                    </a-card> -->
                     <a-card
                        class="cardAnnounce"
                        :loading="loading.passTask"
                        :bordered="false"
                        style="margin-bottom:24px;"
                      >
                        <div class="card-head titleHome">
                          <div class="ant-card-head-title">
                            <span>通知公告</span>
                            <span>（{{ announceNum }}）</span>
                          </div>
                          <router-link
                            to="/announce/list"
                            slot="extra"
                            style="padding-top:17px;"
                          >更多</router-link>
                        </div>
                        <div  class="tb-box">
                          <div v-if="announceNum !== 0">
                            <s-table
                              class="tableFont"
                              ref="table"
                              :columns="columns1"
                              :data="loadAnnData"
                              :pagination="annPagination"
                              :customRow="customRow"
                              :pageSize="pageSize"
                              :rowKey="record => record.id"
                            >
                              <template
                                slot="new"
                                slot-scope="record"
                              >
                              <div>
                                <a-tag
                                  v-if="record.urgency === '1'"
                                  color="#10A169"
                                >平件</a-tag>
                                <a-tag
                                  v-else-if="record.urgency==='2'"
                                  color="#F17613"
                                >急</a-tag>
                                <a-tag
                                  v-else-if="record.urgency==='3'"
                                  color="#D83939"
                                >特急</a-tag>
                                <a-tag
                                  v-else
                                  color="#D83939"
                                >特提</a-tag>
                                <span>
                                  <a @click="onAnnounce(record)">{{record.title|subString}}</a>
                                </span>
                               </div>
                               <div>
                                   {{record.extras.publicDateSub}}
                               </div>
                              </template>
                            </s-table>
                          </div>
                          <div
                            class="no-content-index"
                            v-else
                          >
                            <span>
                              <img src="/img/no-content.png">
                              <p>暂无数据</p>
                            </span>
                          </div>
                        </div>
                     </a-card>
                </a-col>
            </a-row>
        </div>

    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import STable from '@/components/Table'
import qs from 'qs'
export default {
  name: 'Workplace',
  components: {
    PageView,
    STable
  },
  created () {
    this.user = this.$ls.get('user')
    this.avatar = this.$store.getters.avatar
    this.onLoadTasks()
    this.onLoadPassTasks()
  },
  props: {
    pageSize: {
      type: Number,
      default: 5
    },
    pageSizeOptions: {
      type: Array,
      default () {
        return ['5', '10']
      }
    }
  },
  filters: {
    subString: function (data) {
      if (data.length > 20) {
        data = data.substring(0, 20) + '...'
      }
      return data
    }
  },
  data () {
    return {
      user: null,
      loading: {
        task: false,
        passTask: false
      },
      tasks: [],
      passTasks: [],
      queryParam: {
      },
      announcePages: null,
      announceNum: null,
      //   {
      //       align: 'right',
      //       scopedSlots: { customRender: 'more' }
      //     }
      columns1: [
        {
          scopedSlots: { customRender: 'new' }
        }
      ],
      // 最新的通知公告
      loadAnnData: parameter => {
        return this.$http.get('/api/1/announce/query_announce_approval.json', { params: Object.assign(parameter, this.queryParam),
          paramsSerializer: function (params) {
            return qs.stringify(params, { indices: false })
          }
        }).then(res => {
          if (res.page) {
            this.announcePages = res.page.pages
            this.announceNum = res.page.total
          }
          return res
        })
      },
      customRow: (record, index) => {
        return {
          on: {
            click: () => {
              this.$router.push({ path: '/announce/search?id=' + record.id })
            }
          }
        }
      },
      annPagination: {
        showTotal: total => `共 ${this.announcePages} 页`,
        size: 'small',
        pageSizeOptions: this.pageSizeOptions
      }
    }
  },
  computed: {
  },
  methods: {
    onLoadTasks () {
      const that = this
      that.loading.task = true
      this.$http.get('/api/1/workflow/tasks.json?pageSize=6').then(function (resp) {
        that.loading.task = false
        that.tasks = resp.result
      })
    },
    onAnnounce (record) {
      this.$router.push({ path: '/announce/search?id=' + record.id })
    },
    onLoadPassTasks () {
      const that = this
      that.loading.passTask = true
      this.$http.get('/api/1/workflow/pass_tasks.json?pageSize=6').then(function (resp) {
        that.loading.passTask = false
        that.passTasks = resp.result
      })
    },
    onViewTask (item) {
      const url = item.viewUrl
      const id = item.caseId
      const cateId = item.cateId
      const actInsId = item.actInsId
      let params = 'id=' + id + '&caseTypeId=' + cateId + '&actInsId=' + actInsId
      let finalUrl = url + '?' + params
      this.$router.push({ path: finalUrl })
    },
    onViewPassTask (item) {
      const url = item.view_url
      const id = item.case_id
      const cateId = item.cate_id
      const actInsId = item.act_ins_id
      let params = 'id=' + id + '&caseTypeId=' + cateId + '&actInsId=' + actInsId
      let finalUrl = url + '?' + params
      this.$router.push({ path: finalUrl })
    }
  }
}
</script>

<style lang="less" scoped>
.tb-box {
  min-height: 171px;
}
    .project-list {
        .card-title {
            font-size: 0;

            a {
                color: rgba(0, 0, 0, 0.85);
                margin-left: 12px;
                line-height: 24px;
                height: 24px;
                display: inline-block;
                vertical-align: top;
                font-size: 14px;

                &:hover {
                    color: #1890ff;
                }
            }
        }
        .card-description {
            color: rgba(0, 0, 0, 0.45);
            height: 44px;
            line-height: 22px;
            overflow: hidden;
        }
        .project-item {
            display: flex;
            margin-top: 8px;
            overflow: hidden;
            font-size: 12px;
            height: 20px;
            line-height: 20px;
            a {
                color: rgba(0, 0, 0, 0.45);
                display: inline-block;
                flex: 1 1 0;

                &:hover {
                    color: #1890ff;
                }
            }
            .datetime {
                color: rgba(0, 0, 0, 0.25);
                flex: 0 0 auto;
                float: right;
            }
        }
        .ant-card-meta-description {
            color: rgba(0, 0, 0, 0.45);
            height: 44px;
            line-height: 22px;
            overflow: hidden;
        }
    }

    .item-group {
        padding: 20px 0 8px 24px;
        font-size: 0;
        a {
            color: rgba(0, 0, 0, 0.65);
            display: inline-block;
            font-size: 14px;
            margin-bottom: 13px;
            width: 25%;
        }
    }

    .members {
        a {
            display: block;
            margin: 12px 0;
            line-height: 24px;
            height: 24px;
            .member {
                font-size: 14px;
                color: rgba(0, 0, 0, .65);
                line-height: 24px;
                max-width: 100px;
                vertical-align: top;
                margin-left: 12px;
                transition: all 0.3s;
                display: inline-block;
            }
            &:hover {
                span {
                    color: #1890ff;
                }
            }
        }
    }
</style>
