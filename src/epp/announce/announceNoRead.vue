<template>
    <a-modal title=""
             :width="960"
             :visible="visible"
             :maskClosable="false"
             :footer="null"
             :closable="true"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading.showDetail">
            <table  class="fx-form-view">
              <tr>
                <td>
                  <span class="readTitle">已阅人员{{readLength}}人</span>
                </td>
                <td>
                   <span class="noreadTitle">未阅读人员{{noReadLength}}人</span>
                </td>
              </tr>
               <tr>
                 <td style="width:50%">
                      <span v-for="(item,index) in read" :key="index" class="read">
                         <span>{{item.extras.userName}}</span>&nbsp;
                         <span>{{item.extras.readDateSub}}</span>&nbsp;
                      </span>
                  </td>
                  <td style="width:50%">
                    <span v-for="(item,index) in noRead" :key="index"  class="noRead">
                        <span>{{item.name}}</span>
                    </span>
                 </td>
               </tr>
            </table>
      </a-modal>
</template>
<script>

export default {
  name: 'BookView',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      data: [],
      loading: false,
      busy: false,
      read: [],
      noRead: [],
      readLength: '',
      noReadLength: '',
      modalLoading: {
        showDetail: false
      }
    }
  },
  methods: {
    fetchData (callback, id) {
      this.$http.post('/api/1/announce/get_readed_list.json?id=' + id).then(
        (res) => {
          callback(res)
        }
      )
    },
    noaRead (id) {
      this.loadData(id)
    },
    loadData (id) {
      this.$http.post('/api/1/announce/get_readed_list.json?id=' + id).then(
        (res) => {
          this.read = res.result
          this.readLength = res.result.length
        }
      )

      this.$http.post('/api/1/announce/get_read_list.json?id=' + id).then(
        (res) => {
          this.noRead = res.result
          this.noReadLength = res.result.length
        }
      )
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
    th.column-money,
     td.column-money {
  text-align: right !important;
}
.ant-btn{
  margin-bottom: 10px;
}
.fx-form-view{
  margin-top: 18px;
}
.noRead{
  width: 145px;
  display: inline-block;
}
.read{
  width: 216px;
  display: inline-block;
}
.readTitle,.noreadTitle{
    font-size: 18px;
    color:#9e3f3f;
}
</style>
