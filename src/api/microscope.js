/**
* 阅片平台接口
* Date: 2020/9/28
* Time: 4:23 下午
*/

import { axios } from '@/utils/request'
const reviewMachinePrefix='http://localhost:6688';

/**
 * 获取本机mac地址
 */
export function getReviewMachine () {
    return axios({
        url: reviewMachinePrefix+'/ping/',
        method: 'get'
    })
}

/**
 * 移动阅片平台
 */
export function moveReviewMachine (parameter) {
    let url = '?specimen_id='+parameter.specimen_id
    url = url+'&x_init='+parameter.x_init
    url = url+'&y_init='+parameter.y_init
    url = url+'&x_pixel_idx='+parameter.x_pixel_idx
    url = url+'&y_pixel_idx='+parameter.y_pixel_idx
    return axios({
        url: reviewMachinePrefix+'/move/'+url,
        method: 'get'
    })
}

/**
 * 关闭阅片平台
 */
export function closeReviewMachine (parameter) {
    let url = '?specimen_id='+parameter.specimen_id
    return axios({
        url: reviewMachinePrefix+'/close/'+url,
        method: 'get'
    })
}
