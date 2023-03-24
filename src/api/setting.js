/**
* 设置部分接口
* Date: 2020/6/13
* Time: 4:23 下午
*/

import { axios } from '@/utils/request'

const api = {
  Micros: '/micros/'
}

/**
 * 获取显微数据资源
 * parameter: {
 *     page: '', 页数
 *     page_size: '', 页数
 *     ordering: '' 排序
 * }
 * @param parameter
 * @returns {Promise}
 */
export function getMicros (parameter) {
  return axios({
    url: api.Micros,
    method: 'get',
    params: parameter
  })
}

/**
 * 添加显微数据资源
 * parameter: {
 *     equip_id: '', 设备编号
 *     ip: '', ip地址
 *     mac: '', mac地址
 *     offsetX: 0, X偏移
 *     offsetY: 0, Y偏移
 *     manager: '', 负责人
 *     room: '' 放置地点
 * }
 * @param parameter
 * @returns {Promise}
 */
export function addMicro (parameter) {
  return axios({
    url: api.Micros,
    method: 'post',
    data: parameter
  })
}

/**
 * 更新显微数据资源
 * parameter: {
 *     equip_id: '', 设备编号
 *     ip: '', ip地址
 *     mac: '', mac地址
 *     offsetX: 0, X偏移
 *     offsetY: 0, Y偏移
 *     manager: '', 负责人
 *     room: '' 放置地点
 * }
 * @param id
 * @param parameter
 * @returns {Promise}
 */
export function updateMicro (id, parameter) {
  return axios({
    url: `${api.Micros}${id}/`,
    method: 'put',
    data: parameter
  })
}

/**
 * 删除显微数据资源
 * @param id
 * @returns {Promise}
 */
export function deleteMicro (id) {
  return axios({
    url: `${api.Micros}${id}/`,
    method: 'delete'
  })
}
