import { axios as request } from '@/utils/request'
import { setStore, getStore } from '@/utils/storage'
import qs from 'qs'

const uuidv4 = require('uuid/v4')
const platform = require('platform')

export const TokenKey = 'Access-Token'

export function getDeviceId () {
  let deviceId = getStore('Device-Id')
  if (!deviceId) {
    deviceId = uuidv4()
    setStore('Device-Id', deviceId)
  }
  return deviceId
}

export function login (params) {
  params.deviceId = getDeviceId()
  params.deviceName = platform.name + ' ' + platform.version
  params.os = platform.os.toString()
  return request.post('/api/1/device/login.json', qs.stringify(params))
}

export function getInfo () {
  return request({ url: '/api/1/user/info.json', method: 'get' })
}

export function logout () {
  return request({ url: '/api/1/device/logout.json', method: 'post' })
}
