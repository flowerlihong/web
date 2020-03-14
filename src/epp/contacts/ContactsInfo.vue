<!--
    Created by LuRX on 2019/03/26.
    联系人信息
-->
<template>
    <a-modal title="联系人信息"
             :width="750"
             :visible="visible"
             @cancel="onCancel">
        <table id="tab-info" border="1">
            <tr>
                <th>姓名</th>
                <td colspan="2">{{userQuery.name}}</td>
                <td rowspan="2" style="width: 200px">
                    <a-avatar class="avatar" shape="square" :size="120" :src="'/api/1/user/avatar?id=' + userQuery.id"/>
                </td>
            </tr>
            <tr>
                <th>单位</th>
                <td colspan="2">{{userQuery.orgName}}</td>
            </tr>
            <tr>
                <th>部门</th>
                <td>{{userQuery.deptName}}</td>
                <th>职位</th>
                <td>{{userQuery.posName}}</td>
            </tr>
            <tr>
                <th>电子邮件</th>
                <td colspan="3">{{userQuery.email}}</td>
            </tr>
            <tr>
                <th>联系电话</th>
                <td colspan="3">{{userQuery.mobile}}</td>
            </tr>
        </table>

        <!-- 隐藏取消/确定按钮 -->
        <template>
            <div slot="footer"></div>
        </template>
    </a-modal>
</template>

<script>

export default {
  name: 'ContactsInfo',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modalVisible: {
        contactsInfo: false
      },
      userQuery: {
        orgName: '',
        deptName: '',
        posName: ''
      }
    }
  },
  methods: {
    contactsInfo (id) {
      const that = this
      this.$http.get('/api/1/org/get_user_detail.json?id=' + id).then(function (response) {
        that.userQuery = response.result
        that.userQuery.orgName = response.result.org.name
        that.userQuery.deptName = response.result.dept.name
        that.userQuery.posName = response.result.pos.name
      })
    },
    onCancel () {
      this.$emit('cancel')
    }

  }

}

</script>

<style scoped>
    #tab-info {
        border: 1px solid #CCCCCC;
        width:700px;
    }

    #tab-info th {
        text-align: center;
        font-weight: bolder;
        background: #F8F8F8;
        width: 150px;
        height: 50px;
    }

    #tab-info td {
        width: 30%;
        padding: 20px;
    }

    #tab-info .avatar{
        margin-left: 25px;
    }
</style>
