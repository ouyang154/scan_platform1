/* 报告根组件 Date: 2021/5/1 12:50 上午 */
<template v-if="hospital">
    <standard-report v-if="hospital && parseInt(hospital.report_model)===1" :hospital="hospital" :autoprint="autoprint"/>
    <simple-report v-else-if="hospital && parseInt(hospital.report_model)===2"/>
</template>

<script>
import SimpleReport from './modules/simpleReport'
import StandardReport from './modules/standardReport'
import { getHospitals } from '@/api/workspace'

export default {
  name: 'Report',
  data () {
    return {
      hospital: null,
      autoprint: Boolean(this.$route.query.autoprint)//{type: Boolean, default: false}
    }
  },
  props: {
    id: {type: String, default: ''}
  },
  components: {
    SimpleReport,
    StandardReport
  },
  async mounted () {
    try {
      const [[hospital]] = await Promise.all([getHospitals()])
      this.hospital = hospital
    } catch (e) {
      this.$message.error('数据获取异常！')
    } finally {
      this.isLoading = false
    }
  }
}
</script>
