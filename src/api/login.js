/**
* 登录信息接口
* Date: 2020/5/23
* Time: 2:39 下午
*/

import { axios } from '@/utils/request'

const api = {
  Login: '/api-token-auth/',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  User: '/users/'
}

/**
 * 登录接口
 * parameter: {
 *     username: '', 用户名
 *     password: '', 密码
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return axios({
    url: api.Login,
    method: 'post',
    data: parameter
  })
}

/**
 * 获取所有用户
 * parameter: {
 *     page: '', 页数
 *     page_size: '', 页数
 *     ordering: '' 排序
 * }
 * @param parameter
 * @returns {Promise}
 */
export function getUsers (parameter) {
  return axios({
    url: api.User,
    method: 'get',
    params: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 获取用户详情
 * @param userId 用户id
 * @returns {Promise}
 */
export function getUserInfo (userId) {
  return axios({
    url: `${api.User}${userId}/`,
    method: 'get'
  })
}

/**
 * 注册用户
 * parameter: {
 *      "admin": "true", 管理员
 *      "edit": true, 校对员
 *      "review": true, 初审员
 *      "submit": true, 复审员
 *      "user": {
 *          "username": "", 用户名
 *          "password": "" 密码
 *      }
 * }
 * @param parameter
 * @returns {Promise}
 */
export function register (parameter) {
  return axios({
    url: api.User,
    method: 'post',
    data: parameter
  })
}

/**
 * 删除用户
 * @param id 用户id
 * @returns {Promise}
 */
export function deleteUser (id) {
  return axios({
    url: `${api.User}${id}/`,
    method: 'delete'
  })
}

/**
 * 更新用户信息
 * parameter: {
 *      "admin": "true", 管理员
 *      "edit": true, 校对员
 *      "review": true, 初审员
 *      "submit": true, 复审员
 *      "user": {
 *          "username": "", 用户名
 *      }
 * }
 * @param id
 * @param parameter
 * @returns {Promise}
 */
export function updateUser (id, parameter) {
  return axios({
    url: `${api.User}${id}/`,
    method: 'put',
    data: parameter
  })
}

/**
 * 修改登录用户信息
 * parameter: {
 *      "admin": "true", 管理员
 *      "edit": true, 校对员
 *      "review": true, 初审员
 *      "submit": true, 复审员
 *      "user": {
 *          "username": "", 用户名
 *          "password": "" 密码
 *      }
 * }
 * @param parameter
 * @returns {*}
 */
export function modifyLoginUser (parameter) {
  return axios({
    url: api.Login,
    method: 'put',
    data: parameter
  })
}

/**
 * 获取用户标题（预留）
 * @param token
 * @returns {Promise}
 */
export function getCurrentUserNav (token) {
  return axios({
    url: '/user/nav',
    method: 'get'
  })
}
