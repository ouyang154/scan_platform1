/**
* 医院信息
* Date: 2020/5/26
* Time: 12:16 下午
*/
<template>
  <a-card :bordered="false">
    <a-spin :spinning="!hospital">
      <div class="hospital-info" v-if="hospital">

        <!-- S 医院详情 -->
        <description-list :title="hospital.name">
          <description-list-item term="图标">
            <el-image
            style="width: 250px; height: 250px"
            :src="'static/media/' + hospital.hospital_logo"
            fit="scale-down"></el-image>
          </description-list-item>
          <description-list-item term="地址">{{ hospital.address }}</description-list-item>
          <description-list-item term="电话">{{ hospital.telephone }}</description-list-item>
          <description-list-item term="邮编">{{ hospital.poster_code }}</description-list-item>
          <description-list-item term="病例诊断中心">{{ hospital.pathology_tel }}</description-list-item>
          <description-list-item term="咨询">{{ hospital.consult_sel }}</description-list-item>
          <description-list-item term="网址">{{ hospital.internet_url }}</description-list-item>
          <description-list-item term="细胞量阈值">{{ hospital.satisfaction_nucleus_count }}</description-list-item>
          <description-list-item term="报告截图倍数">{{ hospital.report_zoom_level }}{{'x'}}</description-list-item>
          <description-list-item term="审核级别">{{ hospital.report_process | reportProcessFilter }}</description-list-item>
          <description-list-item term="任务分配">{{ hospital.assign_scan ? "打开" : "关闭" }}</description-list-item>
          <description-list-item term="玻片医院简称">{{ hospital.sp_barcode_hospital_name }}</description-list-item>
        </description-list>
        <!-- E 医院详情 -->

        <!-- S 详情编辑 -->
        <a-row>
          <a-col :span="24">
            <a-button type="primary" @click="edit">编辑</a-button>
          </a-col>
        </a-row>
        <!-- E 详情编辑 -->      

        <!-- S 编辑弹框 -->
        <form-model ref="form" @updated="getHospitalInfo" />
        <!-- E 编辑弹框 -->
      </div>
    </a-spin>
  </a-card>
</template>

<script>
import DescriptionList from '@/components/DescriptionList'
import { getHospitals, modifyHospital } from '@/api/workspace'
import FormModel from './modules/FormModel'

const DescriptionListItem = DescriptionList.Item

export default {
  name: 'HospitalInfo',
  components: {
    DescriptionList,
    DescriptionListItem,
    FormModel
  },
  data () {
    return {
      hospital: null,
    }
  },
  created () {
    this.getHospitalInfo()
  },
  methods: {
    /**
     * 获取医院信息
     */
    async getHospitalInfo () {
      try {
        const [hospital] = await getHospitals()
        this.hospital = hospital
      } catch (e) {
        this.$message.error('数据获取异常')
      }
    },
    /**
     * 编辑医院信息
     */
    edit () {
      this.$refs.form.edit({ ...this.hospital })
    }
  }
}
</script>

<style scoped>

</style>
