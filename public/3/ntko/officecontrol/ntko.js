var ntko // 控件对象

// 初始化去打开文档
// eslint-disable-next-line camelcase
function init (caseId, access_token) {
  ntko = document.getElementById('TANGER_OCX')
  ntko.Menubar = false// 设置不显示软航菜单
  ntko.Statusbar = false// 设置是否显示状态栏
  ntko.TitleBar = false// 设置是否显示标题栏

  /* $.getJSON(HOST + '/api/1/ntko/exists.json?caseId=' + caseId, function (data) {
    if (data.exists) {
      ntko.OpenFromURL(HOST + '/api/1/ntko/file?caseId=' + caseId)
    } else {
      ntko.CreateNew('word.document')
    }
  }) */

  $.ajax({
    type: 'GET',
    dataType: 'json',
    // eslint-disable-next-line camelcase
    url: '/api/1/ntko/exists_doc.json?caseId=' + caseId,
    headers: { 'X-Auth-Token': access_token },
    success: function (data) {
      if (data.state === 0) {
        /* global API_SERVER */
        ntko.OpenFromURL(API_SERVER + '/api/1/ntko/case_document?caseId=' + caseId)
      } else if (data.state === 1) {
        ntko.CreateNew('word.document')
      } else if (data.state === 400) {
        alert('请求失败，请联系OA系统管理员。')
      }
    },
    error: function (data) {
      alert('请求失败，请联系OA系统管理员。')
    }
  })

  // if (cmd === '1') {
  //   ntko.CreateNew('word.document')
  // } else {
  //   ntko.OpenFromURL('aboutus.docx')
  // }
}
