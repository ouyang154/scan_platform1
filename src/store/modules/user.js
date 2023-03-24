import Vue from 'vue'
import { login, getUserInfo } from '@/api/login'
import { ACCESS_TOKEN, USER } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    user: {},
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          Vue.ls.set(ACCESS_TOKEN, response.token)
          Vue.ls.set(USER, {
            username: userInfo.username,
            id: response.id
          })
          commit('SET_USER', {
            username: userInfo.username,
            id: response.id
          })
          commit('SET_TOKEN', response.token)
          resolve()
        }).catch(error => {
          console.log('catch error: ', error)
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        const { id } = Vue.ls.get(USER)
        getUserInfo(id).then(userInfo => {
          const user = Object.assign(userInfo, { ...userInfo.user })
          Reflect.deleteProperty(user, 'user')
          commit('SET_USER', user)
          commit('SET_ROLES', user)
          commit('SET_NAME', { name: user.username, welcome: welcome() })
          commit('SET_AVATAR', 'doctor.jpg')
          resolve(user)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        Vue.ls.remove(ACCESS_TOKEN)
        resolve()
      })
    }

  }
}

export default user
