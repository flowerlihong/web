function Schedule (v) {
  let vue = v

  this.alert = function (msg) {
    vue.$message.error(msg)
  }

  this.buildSyntax = function (data) {
    let sb = []
    sb.push('<?xml version="1.0" encoding="UTF-8"?>')
    let cronType = data.cronType

    sb.push('<job type="' + cronType + '">')

    if (cronType === 'cron-loop') { // 每X分钟
      if (data.minute === '') {
        this.alert('分钟数必须填写')
        return null
      }

      sb.push('<el type="text" name="minute" value="' + data.minute + '"/>')
    } else if (cronType === 'cron-hour') { // 每小时
      if (data.hour === '') {
        this.alert('小时数必须填写')
        return null
      }
      if (data.minute === '') {
        this.alert('分钟数必须填写')
        return null
      }
      sb.push('<el type="text" name="hour" value="' + data.hour + '"/>')
      sb.push('<el type="text" name="minute" value="' + data.minute + '"/>')
    } else if (cronType === 'cron-day') { // 每天
      if (data.hour === '') {
        this.alert('小时数必须填写')
        return null
      }
      if (data.minute === '') {
        this.alert('分钟数必须填写')
        return null
      }
      sb.push('<el type="text" name="hour" value="' + data.hour + '"/>')
      sb.push('<el type="text" name="minute" value="' + data.minute + '"/>')
    } else if (cronType === 'cron-week') { // 每周
      if (data.hour === '') {
        this.alert('小时数必须填写')
        return null
      }
      if (data.minute === '') {
        this.alert('分钟数必须填写')
        return null
      }
      if (data.weekList.length === 0) {
        this.alert('星期几必须选择')
        return null
      }

      sb.push('<el type="text" name="hour" value="' + data.hour + '"/>')
      sb.push('<el type="text" name="minute" value="' + data.minute + '"/>')
      for (let v of data.weekList) {
        sb.push('<el type="text" name="week" value="' + v + '" checked="true"/>')
      }
    } else if (cronType === 'cron-month') {
      if (data.day === '') {
        this.alert('几号数必须填写')
        return null
      }
      if (data.hour === '') {
        this.alert('小时数必须填写')
        return null
      }
      if (data.minute === '') {
        this.alert('分钟数必须填写')
        return null
      }
      if (data.monthList.length === 0) {
        this.alert('月份必须选择')
        return null
      }

      sb.push('<el type="text" name="day" value="' + data.day + '"/>')
      sb.push('<el type="text" name="hour" value="' + data.hour + '"/>')
      sb.push('<el type="text" name="minute" value="' + data.minute + '"/>')
      for (let v of data.monthList) {
        sb.push('<el type="text" name="month" value="' + v + '" checked="true"/>')
      }
    } else if (cronType === 'cron-expression') {
      if (data.expression === '') {
        this.alert('Cron表达式必须填写')
        return null
      }

      sb.push('<el type="text" name="expression" value="' + data.expression + '"/>')
    } else {
      this.alert('未知的执行类型：' + cronType)
      return null
    }
    sb.push('<parameter><![CDATA[' + data.parameter + ']]></parameter>')
    sb.push('<expireLogDays>' + data.expireLogDays + '</expireLogDays>')
    sb.push('<class path="' + data.clazz + '"/>')
    sb.push('</job>')

    return sb.join('')
  }
}

export default Schedule