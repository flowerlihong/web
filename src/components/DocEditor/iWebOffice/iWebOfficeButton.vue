<template>
    <a-button @click="onEdit">编辑正文(金格)</a-button>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'iWebOfficeButton',
  methods: {
    onEdit: function () {
      console.log('onEdit')
      const that = this
      $.ajax({
        type: 'get',
        async: false,
        //  url: "http://127.0.0.1:9588/LongListen?id=111",
        url: 'http://127.0.0.1:9588/QueryOpen',
        jsonp: 'hookback',
        dataType: 'jsonp',
        success: function (data) {
          console.log('success')
          that.onLink()
        },
        error: function () {
          var answer = confirm('未安装支持多浏览器应用程序是否点击安装\n提示：安装的时候360全部点击允许程序所有操作')
          if (answer) {
            window.open('/3/iWebOffice/KGBrowserSetup.exe')
          }
        }
      })
    },
    onLink: function (url, skin) {
      console.log('onLink')
      // skin  0灰色 1蓝色 2黄色 3绿色 4红色
      let link = 'KGBrowser://$link:http://172.16.1.114:3737/3/iWebOffice/iWebOffice.html?token=ggg$skin=1$tabshow=1' + '$cookie=123'
      location.href = link
      this.onConnect()
    },
    onConnect () {
      $.ajax({
        type: 'get',
        async: false,
        url: 'http://127.0.0.1:9588/LongListen?id=111', // 此代码ip固定，端口号与Edit页面该方法一致，其他固定。
        jsonp: 'hookback',
        dataType: 'jsonp',
        success: function (data) {
          var jsonobj = eval(data)
          if (jsonobj.ret === 'save') { // 此判断处理Edit页面Msg传过来的值，判断之后下面做响应处理即可
            alert('save')
            setTimeout('location.reload();', 100)
          }
          if (jsonobj.ret === 'returnlist') { // 此判断处理Edit页面Msg传过来的值，判断之后下面做响应处理即可
            setTimeout('location.reload();', 100)
          }
          if (jsonobj.ret !== 'none') {
            alert('接收上个页面传输的数据为：' + jsonobj.ret)
          } else if (jsonobj.ret === 'none') {
            setTimeout('onConnect', 500) // 这里一定要调用，不可删除
          }
        },
        error: function (a, b, c) {
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
