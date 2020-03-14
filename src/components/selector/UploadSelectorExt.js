class UploadSelectorExt {
  static getUrl (item) {
    // eslint-disable-next-line no-unused-vars,camelcase
    var return_url = ''
    // eslint-disable-next-line camelcase
    var file_postfix = item.extension// 文件后缀
    // eslint-disable-next-line camelcase
    file_postfix = file_postfix.toLowerCase()// 转成小写
    // eslint-disable-next-line camelcase
    if (file_postfix === 'docx' || file_postfix === 'doc' || file_postfix === 'xlsx' || file_postfix === 'xls') {
      // eslint-disable-next-line no-undef,camelcase
      return_url = WEB_SERVER + '/3/ntko/attntkoviewselect.html?caseId=' + item.id + '&caseType=word'
      // eslint-disable-next-line camelcase
    } else if (file_postfix === 'pdf') {
      // eslint-disable-next-line no-undef,camelcase
      return_url = WEB_SERVER + '/3/ntko/attntkoviewselect.html?caseId=' + item.id + '&caseType=pdf'
    } else {
      // eslint-disable-next-line camelcase
      return_url = '/api/1/attachment/download?id=' + item.id
    }
    // eslint-disable-next-line camelcase
    return return_url
  }
}

export default UploadSelectorExt
