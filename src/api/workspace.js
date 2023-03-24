/**
* 工作区接口
* Date: 2020/5/23
* Time: 2:39 下午
*/

import { axios } from '@/utils/request'

const api = {
  Scan: '/scans/',
  Report: '/reports/',
  Bbox: '/bbox/',
  grabCut:'/grab_cut/',
  Task:'/tasks/',
  Specimen: '/specimen/',
  SpecimenLIS: '/specimen/LIS_patient_info/'
}

/**
 * 获取扫描列表
 * parameter: {
 *     page: '', 页数
 *     created_date: '', 创建时间
 *     ordering: '', 排序
 *     scan_folder: '', 扫描文件夹
 *     page_size: '', 页数
 *     occupied_by: '',
 *     created_range_after: '', 时间范围
 *     created_range_before: '', 时间范围
 *     specimen_id_contains: '', 样本
 * }
 * @param parameter
 * @returns {Promise}
 */
export function getScanList (parameter) {
  return axios({
    url: api.Scan,
    method: 'get',
    params: parameter
  })
}

/**
 * 删除扫描项
 * @param ids 扫描项id
 * @returns {Promise}
 */
export function deleteScans (ids) {
  return axios({
    url: `${api.Scan}${ids}/`,
    method: 'delete'
  })
}

/**
 * 更新病例信息
 * parameter: {
 *     name: '', 姓名
 *     specimen_id: '', 采样编号
 *     gender: '', 性别
 *     age: '', 年龄
 *     patient_phone: '', 电话
 *     birth: '', 出生日期
 *     patient_id: '', 身份证号
 *     specimen_date: '', 采样日期
 *     menses_date: '', 末次月经
 *     menses: '', 绝经
 *     reference_department: '', 申请科室
 *     reference_doctor: '', 申请医生
 *     reference_date: '', 送检日期
 *     outpatient_id: '', 门诊号
 *     inpatient_id: '', 住院号
 *     inpatient_bed: '', 床号
 *     AIdiagnosis: '', AI结果
 *     status: '', 阅片状态
 * }
 * @param id
 * @param parameter
 * @returns {Promise}
 */
export function updateScan (id, parameter) {
  return axios({
    url: `${api.Scan}${id}/`,
    method: 'put',
    data: parameter
  })
}

export function submitReport (id, parameter) {
  return axios({
    url: `${api.Scan}${id}/submit_report/`,
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data: parameter
  })
}

export function addBbox (id, parameter) {
  return axios({
    url: `${api.Bbox}${id}/add/`,
    method: 'post',
    data: parameter
  })
}

/**
 * 获取病例详情
 * @param id
 * @returns {Promise}
 */
export function getScanDetail (id) {
  return axios({
    url: `${api.Scan}${id}/`,
    method: 'get'
  })
}


/**
 * 获取报告模板
 * @returns {Promise}
 */
 export function getReportConfig () {
  return axios({
    url: api.Report + 'get_report_config/',
    method: 'get'
  })
}


export function updateReportConfig (parameter) {
  return axios({
    url: api.Report + 'update_report_config/',
    method: 'post',
    data: parameter
  })
}

/**
 * 获取医院信息
 * @returns {Promise}
 */
export function getHospitals () {
  return axios({
    url: api.Report,
    method: 'get'
  })
}

/**
 * 修改医院信息
 * parameter: {
 *     name: '', 医院名称
 *     address: '', 医院地址
 *     telephone: '', 电话
 *     poster_code: '', 邮编
 *     pathology_tel: '', 病例诊断中心
 *     consult_sel: '', 咨询
 *     internet_url: '', 网址
 * }
 * @param id
 * @param parameter
 * @returns {Promise}
 */
export function modifyHospital (id, parameter) {
  return axios({
    url: `${api.Report}${id}/`,
    method: 'put',
    data: parameter
  })
}

/**
 * 获取细胞核或包浆
 * @param parameter
 * @returns {Promise}
 */
export function grabCut (parameter) {
  return axios({
    url: api.grabCut,
    method: 'post',
    data: parameter
  })
}

/**
 * 获取后台任务列表
 * parameter: {
 *     task_name: '', 任务名称
 *     data_kept_days: '', 保留时间
 *     keep_results: '', 保留数据方式
 *     disabled: '', 自动删除开关
 *     minute_of_hour: '', 自动删除分(几分)
 *     hour_of_day: '', 自动删除时(几点)
 * }
 * @param parameter
 * @returns {Promise}
 */
export function getTaskList () {
  return axios({
    url: api.Task,
    method: 'get'
  })
}

/**
 * 更新任务
 * parameter: {
  *     task_name: '', 任务名称
 *     data_kept_days: '', 保留时间
 *     keep_results: '', 保留数据方式
 *     disabled: '', 自动删除开关
 *     minute_of_hour: '', 自动删除分(几分)
 *     hour_of_day: '', 自动删除时(几点)
 * }
 * @param id
 * @param parameter
 * @returns {Promise}
 */
export function updateTask (id, parameter) {
  return axios({
    url: `${api.Task}${id}/`,
    method: 'put',
    data: parameter
  })
}

/**
 * 根据specimen_id获取病例
 * @param specimen_id
 * @returns {Promise}
 */
export function getSpecimenList (parameter) {
  return axios({
    url: api.Specimen,
    method: 'get',
    params: parameter
  })
}

/**
 * 根据specimen_id获取病例
 * @param specimen_id
 * @returns {Promise}
 */
 export function getSpecimenInfoFromLIS (parameter) {
  return axios({
    url: api.SpecimenLIS,
    method: 'get',
    params: parameter
  })
}
