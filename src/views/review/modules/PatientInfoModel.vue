/**
* 工作组病例信息修改
* Date: 2020/6/6
* Time: 12:22 上午
*/
<template>
  <div class="case-modify-model">
    <a-modal
      title="编辑病例信息"
      :width="860"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleConfirm"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">

        <!-- S 表单 -->
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-row :gutter="16">

            <a-col :md="8" :sm="24">
              <a-form-model-item ref="name" label="姓名" prop="name">
                <a-input v-model="form.name" />
              </a-form-model-item>
            </a-col>
            <!-- / 姓名 -->

            <a-col :md="8" :sm="24">
              <a-form-model-item ref="specimen_id" label="采样编号">
                <a-input v-model="form.specimen_id" />
              </a-form-model-item>
            </a-col>
            <!-- / 采样编号 -->

            <a-col :md="8" :sm="24">
              <a-form-model-item label="导入">
                <a-button type="primary" style="width: 100%" @click="importSpecimenInfo">病人信息</a-button>
              </a-form-model-item>
            </a-col>
            <!-- / 导入病人信息 -->

            <a-col :md="8" :sm="24">
              <a-form-model-item ref="gender" label="性别">
                <a-radio-group v-model="form.gender">
                  <a-radio :value="1">
                    男
                  </a-radio>
                  <a-radio :value="2">
                    女
                  </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
            <!-- / 性别 -->

            <a-col :md="8" :sm="24">
              <a-form-model-item ref="age" label="年龄">
                <a-input-number style="width: 100%" v-model="form.age" />
              </a-form-model-item>
            </a-col>
            <!-- / 年龄 -->

            <a-col :md="8" :sm="24">
              <a-form-model-item ref="patient_phone" label="电话">
                <a-input v-model="form.patient_phone" />
              </a-form-model-item>
            </a-col>
            <!-- / 电话 -->

            <a-col :md="8" :sm="24">
              <a-form-model-item ref="birth" label="出生日期">
                <el-date-picker style="width: 100%" v-model="form.birth" />
              </a-form-model-item>
            </a-col>
            <!-- / 出生日期 -->

            <a-col :md="8" :sm="24">
              <a-form-model-item ref="patient_id" label="身份证号">
                <a-input v-model="form.patient_id" />
              </a-form-model-item>
            </a-col>
            <!-- / 身份证号 -->

            <a-divider />
            <!-- / 分隔线 -->

            <a-col :md="8" :sm="24">
              <a-form-model-item ref="specimen_date" label="采样日期">
                <el-date-picker style="width: 100%" v-model="form.specimen_date" />
              </a-form-model-item>
            </a-col>
            <!-- / 采样日期 -->

            <a-col :md="8" :sm="24">
              <a-form-model-item ref="menses_date" label="末次月经">
                <el-date-picker style="width: 100%" v-model="form.menses_date" />
              </a-form-model-item>
            </a-col>
            <!-- / 末次月经 -->

            <a-col :md="8" :sm="24">
              <a-form-model-item ref="menses" label="绝经">
                <a-radio-group v-model="form.menses">
                  <a-radio :value="1">
                    是
                  </a-radio>
                  <a-radio :value="2">
                    否
                  </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
            <!-- / 绝经 -->

            <a-col :md="8" :sm="24">
              <a-form-model-item ref="reference_department" label="申请科室">
                <a-auto-complete v-model="form.reference_department" :data-source="departments" />
              </a-form-model-item>
            </a-col>
            <!-- / 申请科室 -->

            <a-col :md="8" :sm="24">
              <a-form-model-item ref="reference_doctor" label="申请医生">
                <a-auto-complete v-model="form.reference_doctor" :data-source="doctors" />
              </a-form-model-item>
            </a-col>
            <!-- / 申请医生 -->

            <a-col :md="8" :sm="24">
              <a-form-model-item ref="reference_date" label="送检日期">
                <el-date-picker style="width: 100%" v-model="form.reference_date" />
              </a-form-model-item>
            </a-col>
            <!-- / 送检日期 -->

            <a-col :md="8" :sm="24">
              <a-form-model-item ref="outpatient_id" label="门诊号">
                <a-input v-model="form.outpatient_id" />
              </a-form-model-item>
            </a-col>
            <!-- / 门诊号 -->

            <a-col :md="8" :sm="24">
              <a-form-model-item ref="inpatient_id" label="住院号">
                <a-input v-model="form.inpatient_id" />
              </a-form-model-item>
            </a-col>
            <!-- / 住院号 -->

            <a-col :md="8" :sm="24">
              <a-form-model-item ref="inpatient_bed" label="床号">
                <a-input v-model="form.inpatient_bed" />
              </a-form-model-item>
            </a-col>
            <!-- / 床号 -->
          </a-row>

        </a-row>
      </a-form-model>
      <!-- E 表单 -->

        <a-divider />
        <!-- / 分隔线 -->
      <!-- S 表单 -->
      <a-form-model
        ref="ruleForm"
        :model="form_scan"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
            <a-row>
              <a-col :span="12">
                <a-col :md="24" :sm="24">
                  <a-form-model-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" ref="AIdiagnosis" label="AI结果">
                    <a-radio-group v-model="form_scan.AIdiagnosis">
                      <a-radio :value="1">
                        阳性
                      </a-radio>
                      <a-radio :value="0">
                        阴性
                      </a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                </a-col>
                <!-- / AI结果 -->

                <a-col :md="24" :sm="24">
                  <a-form-model-item :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" ref="status" label="阅片状态">
                    <a-radio-group v-model="form_scan.status">
                      <a-radio value="predicted">
                        待初审
                      </a-radio>
                      <a-radio value="authored">
                        待复审
                      </a-radio>
                      <a-radio value="approved">
                        待打印
                      </a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                </a-col>
                <!-- / 阅片状态 -->
              </a-col>

              <a-col :span="12">
                <img :src="form_scan.scan_folder | scanFolderFilter" height="100px" alt="">
              </a-col>
            </a-row>

          </a-row>

        </a-form-model>
        <!-- E 表单 -->

      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import OSS from '@/utils/oss'
import { getDoctors, getDepartments } from '@/api/lis'
import { updateScan, getSpecimenList } from '@/api/workspace'

export default {
  name: 'CaseModifyModel',
  data () {
    return {
      visible: false,
      confirmLoading: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      form: {},
      form_scan: {},
      rules: {
        name: [
          { required: true, message: '请输入姓名！', trigger: 'blur' }
        ]
      },
      doctors: [],
      departments: [],
      dateFormat: 'YYYY-MM-DD',
      dataFormat_out: 'YYYY-MM-DD HH:mm:ss',
      id: null
    }
  },
  async created () {
    try {
      const parameter = { page: 1, page_size: 100 }
      const { results: doctorResults } = await getDoctors(parameter)
      const { results: departmentResults } = await getDepartments(parameter)
      this.doctors = doctorResults.map(doctor => doctor.name)
      this.departments = departmentResults.map(department => department.name)
    } catch (e) {
      console.log(e)
    }
  },
  filters: {
    // 玻片地址
    scanFolderFilter (id) {
      return `../../../../static/exam/${id}/preview.jpg`
      // return OSS.instance.signatureUrl(`/exam/${id}/preview.jpg`)
    }
  },
  methods: {
    moment,
    /**
     * 打开编辑模态框
     * @param record
     */
    init (record) {
      this.confirmLoading = false
      this.visible = true
      const {
        birth, specimen_date, menses_date, reference_date,
        ...params
      } = _.cloneDeep(record.specimen_info)
      this.form = Object.assign({}, params, {
        birth: birth ? this.date_format(birth) : null,
        specimen_date: specimen_date ? this.date_format(specimen_date) : null,
        menses_date: menses_date ? this.date_format(menses_date) : null,
        reference_date: reference_date ? this.date_format(reference_date) : null
      }) 
      this.$delete(this.form,'id')
      this.$delete(this.form,'created')
      this.$delete(this.form,'updated')
      const {
        AIdiagnosis,status,scan_folder
      } = _.cloneDeep(record)
      this.form_scan = {
        AIdiagnosis:AIdiagnosis,status:status,scan_folder:scan_folder
      }
      this.id = record.id
    },
    date_format(date){
      return date.split('T')[0]
    },
    /**
     * 关闭模态框
     */
    close () {
      this.confirmLoading = false
      this.visible = false
    },
    /**
     * 确认
     */
    async handleConfirm () {
      try {
        this.confirmLoading = true

        const {
          birth,specimen_date,menses_date,reference_date,
          ...params
        } = _.cloneDeep(this.form)
        // 格式化参数
        const specimen_info = Object.assign({}, params, {
          birth: birth ? moment(birth).format(this.dateFormat_out) : null,
          specimen_date: specimen_date ? moment(specimen_date).format(this.dateFormat_out) : null,
          menses_date: menses_date ? moment(menses_date).format(this.dateFormat_out) : null,
          reference_date: reference_date ? moment(reference_date).format(this.dateFormat_out) : null
        })

        const {
          AIdiagnosis,status
        } = _.cloneDeep(this.form_scan)
        const parameter = {
          specimen_info : specimen_info,
          AIdiagnosis: AIdiagnosis,
          status: status
        }
        await updateScan(this.id, parameter)
        this.$message.success('已修改！')
        this.$emit('updated')
      } catch (e) {
        this.$message.error('修改失败！')
      } finally {
        this.confirmLoading = false
        this.visible = false
        this.form = {}
        this.form_scan = {}
      }
    },
    /**
     * 取消
     */
    handleCancel () {
      this.visible = false
      this.form = {}
      this.form_scan = {}
    },
    importSpecimenInfo(){
      if(this.form.specimen_id){
        const parameter = {
          specimen_id: this.form.specimen_id,
          ordering: '-created'
        }
        getSpecimenList(parameter)
        .then(res=>{
          if (res.count>0){
            this.form = res.results[0]
          }
          else{
            this.$message.error('病例编号错误！')
          }
        })
        .catch( function(error) {
          console.log(error)
        }.bind(this))

      }
      else(
        this.$message.error('请输入病例编号！')
      )
    }
  }
}
</script>

<style scoped>

</style>
