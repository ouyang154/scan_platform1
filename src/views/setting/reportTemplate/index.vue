/**
* 报告模板
* Date: 2020/5/26
* Time: 12:17 下午
*/
<template>
  <a-spin :spinning="!hospital">
    <div class="report-template" v-if="hospital">
      <el-tabs type="card">
        <!-- S 模板选择 -->
        <el-tab-pane label="模板选择">
          <div class="report-template__container">
            <a-card
              :bordered="false"
              @click="templateChange(1)"
              :class="[isSelected ? 'report-template__wrap report-template__selected' : 'report-template__wrap']">
              <img :src="reportTemplateOne" alt="">
            </a-card>

            <a-card
              :bordered="false"
              @click="templateChange(2)"
              :class="[!isSelected ? 'report-template__wrap report-template__selected' : 'report-template__wrap']">
              <img :src="reportTemplateTwo" alt="">
            </a-card>
          </div> 
        </el-tab-pane>
        <!-- E 模板选择 -->
        <!-- S 模板编辑 -->
        <el-tab-pane label="模板编辑">
          <editor></editor>
        </el-tab-pane>
        <!-- E 模板编辑 -->
      </el-tabs>

    </div>
  </a-spin>
</template>

<script>
import { getHospitals, modifyHospital } from '@/api/workspace'
import ReportTemplateOne from '@/assets/images/report_one.jpg'
import ReportTemplateTwo from '@/assets/images/report_two.jpg'
import Editor from './templateEditor.vue'

export default {
  components: {
    'editor': Editor
  },
  name: 'ReportTemplate',
  data () {
    return {
      hospital: null,
      reportTemplateOne: ReportTemplateOne,
      reportTemplateTwo: ReportTemplateTwo
    }
  },
  created () {
    this.getHospitalInfo()
  },
  computed: {
    isSelected () {
      return this.hospital && +this.hospital.report_model === 1
    }
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
    async templateChange (template) {
      try {
        this.hospital.report_model = template
        const { id, ...parameter } = this.hospital
        await modifyHospital(id, parameter)
      } catch (e) {
        this.$message.error('修改失败！')
      }
    }
  }
}
</script>

<style scoped lang="less">
.report-template {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  box-sizing: border-box;
  margin-bottom: 16px;

  &__header {
    h3 {
      margin: 0;
    }

    /deep/ .ant-card-body {
      padding: 16px;
    }
  }

  &__container {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-evenly;
    align-items: flex-start;
    height: 100%;
    padding: 8px;
  }

  &__wrap {
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: center;
    margin: 8px;
    cursor: pointer;

    img {
      max-width: 100%;
      max-height: 100%;
    }

    /deep/ .ant-card-body {
      transition: all 0.3s ease;
      padding: 8px;
      border-radius: 4px;
    }
  }

  &__selected {
    /deep/ .ant-card-body {
      background: #1890ff;
    }
  }
}
</style>
