/**
* 阅片平台接口
* Date: 2020/9/28
* Time: 4:23 下午
*/

import { axios } from '@/utils/request'
const api = {
    getScanConfig: '/get_scan_config/',
    updateScanConfig: '/update_scan_config/',
    scanExecuteCmd: '/scan_execute_cmd/'
  }

/**
 * 获取本机json config
 */
export function getScanConfig () {
    return axios({
        url: api.getScanConfig,
        method: 'get'
    })
}


/**
 * 保存本机json config
 */
export function updateScanConfig (parameter) {
    return axios({
        url: api.updateScanConfig,
        method: 'post',
        data:parameter
    })
}


/**
 * 移动平台
 */
export function scanExecuteCmd (parameter) {
    return axios({
        url: api.scanExecuteCmd,
        method: 'post',
        data:parameter
    })
}


