/**
* LIS 管理相关接口
* Date: 2020/6/5
* Time: 10:27 下午
*/

import { axios } from '@/utils/request'

const api = {
  Patient: '/specimen/',
  Doctor: '/doctors/',
  Department: '/departments/'
}

/**
 * 获取病例列表
 * parameter: {
 *     page: '', 页数
 *     ordering: '', 排序
 *     page_size: '', 页数
 *     name: '', 医生名称
 *     created_date: '', 创建时间
 *     specimen_id: '' 采样编号
 * }
 * @param parameter
 * @returns {Promise}
 */
export function getPatients (parameter) {
  return axios({
    url: api.Patient,
    method: 'get',
    params: parameter
  })
}

/**
 * 添加病例信息
 * @param parameter
 * @returns {Promise}
 */
export function addPatient (parameter) {
  return axios({
    url: api.Patient,
    method: 'post',
    data: parameter
  })
}

/**
 * 更新病例信息
 * @param id
 * @param parameter
 * @returns {Promise}
 */
export function updatePatient (id, parameter) {
  return axios({
    url: `${api.Patient}${id}/`,
    method: 'put',
    data: parameter
  })
}

/**
 * 删除病例
 * @param id
 * @returns {Promise}
 */
export function deletePatient (id) {
  return axios({
    url: `${api.Patient}${id}/`,
    method: 'delete'
  })
}

/**
 * 获取医生列表
 * parameter: {
 *     page: '', 页数
 *     created_date: '', 创建时间
 *     ordering: '', 排序
 *     page_size: '', 页数
 *     name: '', 医生名称
 * }
 * @param parameter
 * @returns {Promise}
 */
export function getDoctors (parameter) {
  return axios({
    url: api.Doctor,
    method: 'get',
    params: parameter
  })
}

/**
 * 添加医生信息
 * parameter: {
 *     name: '', 医生姓名
 *     doctor_id: '', 医生工号
 *     department: '' 医生部门
 * }
 * @param parameter
 * @returns {Promise}
 */
export function addDoctor (parameter) {
  return axios({
    url: api.Doctor,
    method: 'post',
    data: parameter
  })
}

/**
 * 更新医生信息
 * parameter: {
 *     name: '', 医生姓名
 *     doctor_id: '', 医生工号
 *     department: '' 医生部门
 * }
 * @param id 医生id
 * @param parameter
 * @returns {Promise}
 */
export function updateDoctor (id, parameter) {
  return axios({
    url: `${api.Doctor}${id}/`,
    method: 'put',
    data: parameter
  })
}

/**
 * 删除医生信息
 * @param id 医生id
 * @returns {Promise}
 */
export function deleteDoctor (id) {
  return axios({
    url: `${api.Doctor}${id}/`,
    method: 'delete'
  })
}

/**
 * 获取部门列表
 * parameter: {
 *     page: '', 页数
 *     created_date: '', 创建时间
 *     ordering: '', 排序
 *     page_size: '', 页数
 *     occupied_by: '',
 *     name: '', 部门名称
 * }
 * @param parameter
 * @returns {Promise}
 */
export function getDepartments (parameter) {
  return axios({
    url: api.Department,
    method: 'get',
    params: parameter
  })
}

/**
 * 添加部门
 * parameter: {
 *     name: '', 部门名称
 *     department_id: '', 部门id
 * }
 * @param parameter
 * @returns {Promise}
 */
export function addDepartment (parameter) {
  return axios({
    url: api.Department,
    method: 'post',
    data: parameter
  })
}

/**
 * 删除部门
 * @param id 部门id
 * @returns {Promise}
 */
export function deleteDepartment (id) {
  return axios({
    url: `${api.Department}${id}/`,
    method: 'delete'
  })
}

/**
 * 编辑部门
 * @param id 部门id
 * parameter: {
 *     name: '', 部门名称
 *     department_id: '', 部门id
 * }
 * @param parameter
 * @returns {Promise}
 */
export function updateDepartment (id, parameter) {
  return axios({
    url: `${api.Department}${id}/`,
    method: 'put',
    data: parameter
  })
}
