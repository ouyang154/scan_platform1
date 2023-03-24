import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { InflammationMapping, RadioCellMapping, SatisfyMapping } from '@/mapping'
moment.locale('zh-cn')


Vue.filter('reportProcessFilter', function (value) {
  if (value === 'one_level') {
    return "一级审核"
  } else if (value === 'two_level') {
    return "二级审核"
  } else {
    return "未设置"
  }
})

Vue.filter('NumberFormat', function (value) {
  if (!value) {
    return '0'
  }
  const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
  return intPartFormat
})

Vue.filter('dayjs', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

Vue.filter('moment', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

/**
 * 诊断信息字段过滤器
 * @param diagnosis
 * @returns {string}
 */
Vue.filter('diagnosisFilter', function (record) {
  let diagnosis = record.diagnosisValue
  if(diagnosis == null){
    return '未诊断'
  }
  let report_type = diagnosis.report_type
  if(report_type == null){
    report_type = diagnosis.conclusion ? 1 : 2
  }
  let result = ''
  if (report_type === 1) {
    // standard report
    result = diagnosis.conclusion.value
  } else {
    // simple report
    if (diagnosis) {
      if (diagnosis.radioNormal === '1') {
        result = '未见上皮细胞异常'
      }
      if (diagnosis.checkCIS === true) {
        result = '鳞状细胞癌(CIS)'
      } else if (diagnosis.checkHSIL === true) {
        result = '高级别鳞状上皮内病变(HSIL),包括CIN II/CIN III/CIS'
      } else if (diagnosis.checkLSIL === true) {
        result = '低级别鳞状上皮内病变(LSIL),包括HPV/CIN I'
      } else if (diagnosis.checkASC) {
        result = diagnosis.radioASC === '1' ? '不典型鳞状细胞,属意义不明确(ASC-US)' : ((diagnosis.radioASC === '2') ? '不典型鳞状细胞,不排除HSIL(ASC-H)' : '未知')
      }
      if (diagnosis.checkZigongjing) {
        if (diagnosis.radioZigongjing === '1') { result = '子宫颈内膜腺癌' } else if (diagnosis.radioZigongjing === '2') { result = '子宫内膜腺癌' } else if (diagnosis.radioZigongjing === '3') { result = '子宫外腺癌' } else if (diagnosis.radioZigongjing === '4') { result = '不详(NOS)' }
      } else if (diagnosis.checkZigongjingASC) {
        result = '子宫颈内膜细胞,倾向于肿瘤'
      } else if (diagnosis.checkXianxibao) {
        if (diagnosis.radioXianxibao === '1') { result = '不典型子宫颈内膜' } else if (diagnosis.radioXianxibao === '2') { result = '不典型子宫内膜' } else if (diagnosis.radioXianxibao === '3') { result = '不典型腺细胞异常' }
      }
    }
    if (result == ''){
      result = record.diagnosis_info
    }
  }
  return result
})

/**
 * 满意度字段过滤器
 */
Vue.filter('satisfyFilter', function (value) {
  return SatisfyMapping.get(+value)
})

/**
 * 绝经字段过滤器
 */
Vue.filter('mensesFilter', function (value) {
  return Number(value) === 1 ? '是' : '否'
})

/**
 * 炎症字段过滤器
 */
Vue.filter('inflammationFilter', function (value) {
  return InflammationMapping.get(+value)
})

/**
 * 细胞量字段过滤器
 */
Vue.filter('radioCellFilter', function (value) {
  return RadioCellMapping.get(+value)
})

/**
 * 角色字段过滤器
 */
Vue.filter('roleFilter', function (value) {
  switch (value) {
    case true:
      return '管理员'
    case false:
      return '用户'
    default:
      return '未知'
  }
})

/**
 * 编辑字段过滤器
 */
Vue.filter('editFilter', function (value) {
  switch (value) {
    case true:
      return 'Y'
    case false:
      return ''
    default:
      return '未知'
  }
})

/**
 * 审核字段过滤器
 */
Vue.filter('reviewFilter', function (value) {
  switch (value) {
    case true:
      return 'Y'
    case false:
      return ''
    default:
      return '未知'
  }
})

/**
 * 提交字段过滤器
 */
Vue.filter('submitFilter', function (value) {
  switch (value) {
    case true:
      return 'Y'
    case false:
      return ''
    default:
      return '未知'
  }
})

/**
 * AI结果过滤器
 */
Vue.filter('AIDiagnosisFilter', function (record,satisfaction_nucleus_count) {
  let AIstr=''
  let microscope_flag= false
  if (record.context_infer){
    if(record.context_infer.results.focus0.blood[0]){microscope_flag=true}
    if(record.context_infer.results.focus0.cancer[0]){microscope_flag=true}
  }                                                                             
  AIstr= record.AIdiagnosis == 1 ? '阳性' : record.AIdiagnosis == 0 ? '阴性' : '未知';
  if (record.nucleus_count){
    if(record.AIdiagnosis ==0 & record.nucleus_count<satisfaction_nucleus_count)
    {AIstr='镜下阅片' }
  }  
  else {
    AIstr='镜下阅片'
  }
  if (record.AIdiagnosis ==0 & microscope_flag){
    AIstr='镜下阅片'
  }       
  if (record.micro_flag){ 
    if (record.micro_type){      
      let micro_type = record.micro_type
      if ( micro_type.includes('parasite')){ AIstr=AIstr+' ,滴虫' }
      if ( micro_type.includes('fungal')){ AIstr=AIstr+' ,念珠菌' }
      if ( micro_type.includes('actinomyces')){ AIstr=AIstr+' ,放线菌' }
      if ( micro_type.includes('indicators')){ AIstr=AIstr+' ,线索细胞' }
      if ( micro_type.includes('herpes')){ AIstr=AIstr+' ,疱疹' }
      if ( micro_type.includes('leptotrichia')){ AIstr=AIstr+' ,纤毛菌' }
    }    
    else{
      AIstr=AIstr+',微生物'
    }
  }         
  return AIstr
})

Vue.filter('ContextInferFilter', function (record) {
  let BGstr='' 
  if (record.context_infer){
    if(record.context_infer.results.focus0.base[0]){BGstr=BGstr+'萎缩'}
    if(record.context_infer.results.focus0.inflammation[0]){
      if(BGstr.length>0){BGstr=BGstr+','}
      BGstr=BGstr+'炎症'
    }
    if(record.context_infer.results.focus0.blood[0]){
      if(BGstr.length>0){BGstr=BGstr+','}
      BGstr=BGstr+'血性'
    }
    if(record.context_infer.results.focus0.cancer[0]){
      if(BGstr.length>0){BGstr=BGstr+','}
      BGstr=BGstr+'癌性'
    }
  }                                                                             
                              
  return BGstr
})

/**
 * AI结果过滤器
 */
Vue.filter('AIgradeFilter', function (record, satisfaction_nucleus_count) {
  let AIstr=''  
  let microscope_flag= false
  if (record.context_infer){
    if(record.context_infer.results.focus0.blood[0]){microscope_flag=true}
    if(record.context_infer.results.focus0.cancer[0]){microscope_flag=true}
  }                                                                     
  AIstr= record.AIgrade;
  if (record.nucleus_count){
    if(record.AIdiagnosis ==0 & record.nucleus_count < satisfaction_nucleus_count)
    {AIstr='' }
  }
  else {
    AIstr=''
  } 
  if (record.AIdiagnosis ==0 & microscope_flag) {
    AIstr=''
  }                          
  return AIstr
})

/**
 * AI分数过滤器
 */
Vue.filter('AIscoreFilter', function (record) {
  let AIstr=''                                                                                   
  AIstr= parseInt(record.AIscore*100);                           
  return AIstr
})

Vue.filter('date_format', function (datestr) {
  if(datestr) {
    return datestr.split('T')[0]
  } 
  else{
    return ''
  }    
})



