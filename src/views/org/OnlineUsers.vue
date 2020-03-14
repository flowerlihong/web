<!--
 Created by Xuz on 2019/07/10.
 xuz[at]live[dot]cn
 在线用户列表
-->
<template>
    <a-modal title="在线用户"
             :visible="visible"
             @cancel="$emit('cancel')"
             :width="960"
             :footer="null">
        <a-row>
            <ul class="timeline">
                <li v-for="org in data" :key="org.orgId" class="time-label">
                  <span class="bg-red">
                    {{org.orgName}}
                  </span>
                  <ul>
                      <li v-for="dept in org.deptList" :key="dept.deptId">
                          <i class="fa fa-envelope bg-blue"></i>
                          <div class="timeline-item">
                              <h3 class="timeline-header"><a href="#">{{dept.deptName}}</a>（{{dept.userList.length}}）</h3>
                              <div class="timeline-body">
                                  <a-tag v-for="user in dept.userList" :key="user.userId">
                                      <a-avatar size="small" icon="user" :src="'/api/1/user/avatar?id=' + user.userId"/>
                                      {{user.userName}}
                                  </a-tag>
                              </div>
                          </div>
                      </li>
                  </ul>
                </li>
                <li>
                    <i class="fa fa-clock-o bg-gray"></i>
                </li>
            </ul>
        </a-row>
    </a-modal>
</template>

<script>
export default {
  name: 'OnlineUsers',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      data: []
    }
  },
  methods: {
    preOnlineUsers () {
      const that = this
      that.$http.get('/api/1/user/online_users.json').then(function (resp) {
        that.data = resp.result
      })
    }
  }
}
</script>

<style scoped>
    .timeline {
        position: relative;
        margin: 0 0 30px 0;
        padding: 0;
        list-style: none;
    }

    .timeline ul {
        padding: 0;
        margin-top: 16px;
    }

    .timeline li:nth-last-child(1) {
        margin-bottom: 0;
    }

    .timeline > li:nth-last-child(1) i {
        top: -2px;
    }

    .timeline li {
        position: relative;
        margin-right: 10px;
        margin-bottom: 15px;
        list-style: none;
    }

    .timeline > li:before, .timeline > li:after {
        content: " ";
        display: table;
    }

    .timeline > .time-label > span {
        padding: 5px 20px;
        display: inline-block;
        background-color: #1890ff;
        border-radius: 4px;
        color: #fff;
        font-weight: 500;
    }

    .timeline > li .timeline-item {
        border-radius: 3px;
        margin-top: 0;
        background: #fff;
        color: #803333;
        margin-left: 60px;
        margin-right: 15px;
        padding: 0;
        position: relative;
        border: 1px solid #e0e0e0;
    }

    .timeline > li .timeline-item > .time {
        color: #999;
        float: right;
        padding: 10px;
        font-size: 12px;
    }

    .timeline > li .timeline-item .timeline-header {
        margin: 0;
        color: #555;
        border-bottom: 1px solid #f4f4f4;
        padding: 8px;
        font-size: 12px;
        line-height: 1.1;
    }

    .timeline > li .fa, .timeline li .glyphicon, .timeline li .ion {
        width: 12px;
        height: 12px;
        position: absolute;
        color: #666;
        background: #d2d6de;
        border-radius: 50%;
        text-align: center;
        left: 27px;
        top: 12px;
    }

    .bg-blue {
        background-color: #1890ff !important;
    }

    .timeline > li .timeline-item .timeline-body, .timeline li .timeline-item > .timeline-footer {
        padding: 8px;
    }

    .timeline:before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        width: 4px;
        background: #ddd;
        left: 31px;
        margin: 0;
        border-radius: 2px;
    }

    .timeline .ant-tag {
        padding: 5px 8px;
        line-height: 24px;
        margin: 4px;
        height: 36px;
        font-size: 14px;
    }

    .timeline .ant-avatar-sm {
        margin-right: 4px;
    }

    .timeline-header a {
        font-size: 14px;
    }
</style>
