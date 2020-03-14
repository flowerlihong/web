
/**
 * 处理支付申请数据
 */
// eslint-disable-next-line no-unused-vars
function operationPayApplyData ($caseId) {
  // 加载基本信息数据
  $.ajax({
    type: 'GET',
    dataType: 'json',
    sync: false,
    // eslint-disable-next-line camelcase
    url: '/api/1/pay_apply/get_pay_apply.json?id=' + $caseId,
    // eslint-disable-next-line no-undef
    headers: { 'X-Auth-Token': access_token },
    success: function (data) {
      //  var table = ntko.ActiveDocument.Tables(1)
      // table.Cell(1, 1).range.Text = '第一行第一列的值33'
      ntko.SetBookmarkValue('createdAt', data.result.extras.createdAt)
      ntko.SetBookmarkValue('price', data.result.price)
      ntko.SetBookmarkValue('accountName', data.result.accountName)
      ntko.SetBookmarkValue('province', data.result.province + data.result.city)
      ntko.SetBookmarkValue('account', data.result.account)
      ntko.SetBookmarkValue('receiveUnitName', data.result.receiveUnitName)
      ntko.SetBookmarkValue('purpose', data.result.purpose)
      ntko.SetBookmarkValue('userName', data.result.extras.userName)
      ntko.SetBookmarkValue('projectName', data.result.projectName)
      ntko.SetBookmarkValue('payMoney', data.result.payMoney)
      ntko.SetBookmarkValue('payWay', data.result.extras.payWay)
      ntko.SetBookmarkValue('hasCheck', data.result.extras.hasCheck)
      ntko.SetBookmarkValue('remark', data.result.remark)
      ntko.SetBookmarkValue('subject', data.result.extras.subject)
    },
    error: function (data) {
      alert('请求失败，请联系OA系统管理员。')
    }
  })
}

/**
 * 处理报销申请数据
 */
// eslint-disable-next-line no-unused-vars
function operationClaimApplyData ($caseId) {
  // 加载基本信息数据
  $.ajax({
    type: 'GET',
    dataType: 'json',
    sync: false,
    // eslint-disable-next-line camelcase
    url: '/api/1/claim/get_claim.json?id=' + $caseId,
    // eslint-disable-next-line no-undef
    headers: { 'X-Auth-Token': access_token },
    success: function (data) {
      //  var table = ntko.ActiveDocument.Tables(1)
      // table.Cell(1, 1).range.Text = '第一行第一列的值33'
      ntko.SetBookmarkValue('createdAt', data.result.extras.createdAt)
      ntko.SetBookmarkValue('deptName', data.result.extras.dept)
      ntko.SetBookmarkValue('submitUser', data.result.extras.submitUser)
      ntko.SetBookmarkValue('user', data.result.extras.user)
      ntko.SetBookmarkValue('totalAmount', data.result.extras.totalAmount)
      if (data.result.projectName) {
        ntko.SetBookmarkValue('projectName', data.result.projectName)
      } else {
        ntko.SetBookmarkValue('projectName', '')
      }
      ntko.SetBookmarkValue('remark', data.result.remark)
      ntko.SetBookmarkValue('subject', data.result.extras.subject)
    },
    error: function (data) {
      alert('请求失败，请联系OA系统管理员。')
    }
  })
}

// eslint-disable-next-line no-unused-vars，处理打印意见时几行几列的问题,no-unused-vars
function getCellTotal ($docType) {
  // eslint-disable-next-line no-unused-vars
  var cpbPrint = new Array(2)
  if ($docType === 'PAYAPPLY') { // 支付申请呈批表
    cpbPrint[0] = '4'
    cpbPrint[1] = '9'
  } else if ($docType === 'CLAIMAPPLY') { // 报销申请呈批表
    cpbPrint[0] = '4'
    cpbPrint[1] = '5'
  }
  return cpbPrint
}
