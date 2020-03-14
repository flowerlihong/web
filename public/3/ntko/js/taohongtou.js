/**
 * 加载红头模板书签数据
 * @param $caseId
 * @param $docTypeId
 */
// eslint-disable-next-line no-unused-vars,camelcase
function onload_ht_data ($caseId, $docTypeId) {
  // 加载基本信息数据
  $.ajax({
    type: 'GET',
    dataType: 'json',
    sync: false,
    // eslint-disable-next-line camelcase
    url: '/api/1/dispatchinfo/get_dispatch_info.json?id=' + $caseId,
    // eslint-disable-next-line no-undef
    headers: { 'X-Auth-Token': access_token },
    success: function (data) {
      var activeDocument = ntko.ActiveDocument
      if (activeDocument.BookMarks.Exists('Title')) {
        ntko.SetBookmarkValue('Title', data.result.fileTitle)// 设置书签值--标题
      }
      if (activeDocument.BookMarks.Exists('CS')) {
        ntko.SetBookmarkValue('CS', data.result.copyToDept)// 设置书签值--抄送机关
      }
      if (activeDocument.BookMarks.Exists('LXDH')) {
        ntko.SetBookmarkValue('LXDH', '')// 设置书签值--联系电话
      }
      if (activeDocument.BookMarks.Exists('LXR')) {
        ntko.SetBookmarkValue('LXR', '')// 设置书签值--联系人
      }
      if (activeDocument.BookMarks.Exists('ZS')) {
        ntko.SetBookmarkValue('ZS', data.result.mainToDept)// 设置书签值--主送机关
      }
      if (activeDocument.BookMarks.Exists('FWDWBM')) {
        ntko.SetBookmarkValue('FWDWBM', '')// 设置书签值--发文单位编码
      }
      if (activeDocument.BookMarks.Exists('JD')) {
        ntko.SetBookmarkValue('JD', '')// 设置书签值--校对
      }
      if (activeDocument.BookMarks.Exists('NO')) {
        ntko.SetBookmarkValue('NO', data.result.fileNo)// 设置书签值--文件字号
      }
      if (activeDocument.BookMarks.Exists('YFRQ')) {
        ntko.SetBookmarkValue('YFRQ', data.result.extras.yfrq)// 设置书签值--印发日期
      }
      if (activeDocument.BookMarks.Exists('ZTC')) {
        ntko.SetBookmarkValue('ZTC', data.result.mainToDept)// 设置书签值--主题词
      }
      if (activeDocument.BookMarks.Exists('QFR')) {
        ntko.SetBookmarkValue('QFR', data.result.extras.signer)// 设置书签值--签发人
      }
    },
    error: function (data) {
      alert('请求失败，请联系OA系统管理员。')
    }
  })
}
