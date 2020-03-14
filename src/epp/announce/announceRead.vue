<template>
    <a-modal title=""
             :width="621"
             :visible="visible"
             :maskClosable="false"
             :footer="null"
             :closable="true"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading.showDetail">
            <table  class="fx-form-view">
              <tr>
                <td>
                  <span class="readTitle">
                        已阅读人员{{readLength}}人
                  </span>
                </td>
              </tr>
               <tr>
                  <td>
                     <span v-for="(item,index) in read" :key="index" class="read">
                        <span>{{item.extras.userName}}</span>&nbsp;
                        <span>{{item.extras.readDateSub}}</span>&nbsp;
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
      read: [],
      readLength: '',
      modalLoading: {
        showDetail: false
      }
    }
  },
  methods: {
    noaeRead (id) {
      this.loadData(id)
    },
    loadData (id) {
      this.$http.post('/api/1/announce/get_readed_list.json?id=' + id).then(
        (res) => {
          this.read = res.result
          this.readLength = res.result.length
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

    th {
        width: 110px !important;
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
  width:550px;
}
.read{
  width: 263px;
  display: inline-block;
}
.readTitle{
    font-size: 18px;
    color:#9e3f3f;
}
</style>
