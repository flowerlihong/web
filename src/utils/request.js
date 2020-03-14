import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import { VueAxios } from './axios'
import notification from 'ant-design-vue/es/notification'
import Modal from 'ant-design-vue/es/modal'
import { ACCESS_TOKEN } from '@/store/mutation-types'

axios.defaults.withCredentials = false

const service = axios.create({
  baseURL: '/',
  timeout: 1000 * 30,
  withCredentials: false,
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  }
})

/*
const err = (error) => {
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({ message: 'Forbidden', description: data.message })
    }
    if (error.response.status === 401) {
      notification.error({ message: 'Unauthorized', description: 'Authorization verification failed' })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}
*/

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['X-Auth-Token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 401) {
      let path = response.config.url
      if (path.indexOf('?') !== -1) {
        path = path.substr(0, path.indexOf('?'))
      }
      if (path === '/api/1/user/info.json') {
        // 会话正常过期时，不弹出对话框提示未授权界面，很不有好
        store.dispatch('Logout').then(() => {
          location.reload()
        })
        return
      }
      const modal = Modal.error()
      modal.update({
        title: '未授权访问',
        content: '路径：' + path,
        onOk () {
          store.dispatch('Logout').then(() => {
            location.reload()
          })
        }
      })
    } else if (res.code === 500) {
      notification.error({ message: '错误', description: res.msg })
    }
    return response.data
  },
  error => {
    // notification.error({ message: '错误', description: error.message })
    return Promise.reject(error)
  }
)

const installer = {
  vm: {},
  install (Vue, router = {}) {
    Vue.use(VueAxios, router, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
