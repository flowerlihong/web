import Vue from 'vue'
import { login, logout, getInfo } from '@/utils/auth'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    id: '',
    name: '',
    token: '',
    welcome: '',
    avatar: '',
    roles: [],
    permission: [],
    userInit: false
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER_INFO: (state, { id, name, welcome }) => {
      state.id = id
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USER_INIT: (state, result) => {
      state.userInit = result
    }
  },

  actions: {
    // 登录
    Login ({ commit }, params) {
      return new Promise((resolve, reject) => {
        login(params).then(response => {
          if (response.code === 200) {
            Vue.ls.set(ACCESS_TOKEN, response.user.token, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', response.user.token)
            resolve()
          } else {
            reject(new Error(response.msg))
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          if (response.code !== 200) {
            reject(new Error(response.msg))
            return
          }

          // const data = response.data
          // if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
          //   commit('SET_ROLES', data.roles)
          // } else {
          //   reject(new Error('getInfo: roles must be a non-null array !'))
          // }
          const user = response.result.user
          commit('SET_USER_INFO', { id: user.id, name: user.nicknameFallback, welcome: welcome() })
          commit('SET_AVATAR', user.avatar)
          commit('SET_USER_INIT', true)

          Vue.ls.set('user', user)

          resolve(response)
        }).catch(error => {
          commit('SET_USER_INIT', true)

          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_USER_INIT', false)

          Vue.ls.remove(ACCESS_TOKEN)

          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 强行设置 Token
    SetToken ({ commit }, token) {
      Vue.ls.set(ACCESS_TOKEN, token, 7 * 24 * 60 * 60 * 1000)
      commit('SET_TOKEN', token)
    }
  }
}

export default user
