/**
* 用户信息表单
* Date: 2020/6/4
* Time: 9:25 下午
*/
<template>
  <div class="patient-form-content">

    <!-- S 表单 -->
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-row :gutter="16">

        <a-divider orientation="left" class="patient-form-content__divider">基本信息</a-divider>

        <a-col :span="span">
          <a-form-model-item ref="name" label="姓名" prop="name">
            <a-input v-model="form.name" />
          </a-form-model-item>
        </a-col>
        <!-- / 姓名 -->

        <a-col :span="span">
          <a-form-model-item ref="patient_phone" label="电话">
            <a-input v-model="form.patient_phone" />
          </a-form-model-item>
        </a-col>
        <!-- / 电话 -->

        <a-col :span="span">
          <a-form-model-item ref="birth" label="出生日期">
            <el-date-picker style="width: 100%" v-model="form.birth" />
          </a-form-model-item>
        </a-col>
        <!-- / 出生日期 -->

        <a-col :span="span">
          <a-form-model-item ref="patient_id" label="身份证号">
            <a-input v-model="form.patient_id" />
          </a-form-model-item>
        </a-col>
        <!-- / 身份证号 -->

        <a-col :span="span">
          <a-form-model-item ref="age" label="年龄">
            <a-input-number style="width: 100%" v-model="form.age" />
          </a-form-model-item>
        </a-col>
        <!-- / 年龄 -->

        <a-col :span="span">
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

        <a-col :span="span">
          <a-form-model-item ref="menses_date" label="末次月经">
            <el-date-picker style="width: 100%" v-model="form.menses_date" />
          </a-form-model-item>
        </a-col>
        <!-- / 末次月经 -->

        <a-col :span="span">
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

        <a-divider orientation="left" class="patient-form-content__divider">样本信息</a-divider>

        <a-col :span="span">
          <a-form-model-item ref="specimen_id" label="采样编号">
            <a-input v-model="form.specimen_id" />
          </a-form-model-item>
        </a-col>
        <!-- / 采样编号 -->

        <a-col :span="span">
          <a-form-model-item ref="specimen_date" label="采样日期">
            <el-date-picker style="width: 100%" v-model="form.specimen_date" />
          </a-form-model-item>
        </a-col>
        <!-- / 采样日期 -->

        <a-col :span="span">
          <a-form-model-item ref="reference_department" label="申请科室">
            <a-auto-complete v-model="form.reference_department" :data-source="departments" />
          </a-form-model-item>
        </a-col>
        <!-- / 申请科室 -->

        <a-col :span="span">
          <a-form-model-item ref="reference_doctor" label="申请医生">
            <a-auto-complete v-model="form.reference_doctor" :data-source="doctors" />
          </a-form-model-item>
        </a-col>
        <!-- / 申请医生 -->

        <a-col :span="span">
          <a-form-model-item ref="reference_date" label="送检日期">
            <el-date-picker style="width: 100%" v-model="form.reference_date" />
          </a-form-model-item>
        </a-col>
        <!-- / 送检日期 -->

        <a-col :span="span">
          <a-form-model-item ref="outpatient_id" label="门诊号">
            <a-input v-model="form.outpatient_id" />
          </a-form-model-item>
        </a-col>
        <!-- / 门诊号 -->

        <a-col :span="span">
          <a-form-model-item ref="inpatient_id" label="住院号">
            <a-input v-model="form.inpatient_id" />
          </a-form-model-item>
        </a-col>
        <!-- / 住院号 -->

        <a-col :span="span">
          <a-form-model-item ref="inpatient_bed" label="床号">
            <a-input v-model="form.inpatient_bed" />
          </a-form-model-item>
        </a-col>
        <!-- / 床号 -->

      </a-row>

      <a-form-model-item v-if="showControl" :wrapper-col="{ span: 14, offset: 5 }">
        <a-button type="primary" @click="onSubmit">
          添加
        </a-button>
        <a-button style="margin-left: 10px;" @click="resetFields">
          重置
        </a-button>
      </a-form-model-item>
      <!-- / 操作 -->

    </a-form-model>
    <!-- E 表单 -->

  </div>
</template>

<script>

import _ from 'lodash'
import moment from 'moment'
import { getDepartments, getDoctors } from '@/api/lis'

export default {
  name: 'FormContent',
  props: {
    showControl: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      confirmDirty: false,
      form: {},
      rules: {
        name: [
          { required: true, message: '请输入医生姓名！', trigger: 'change' }
        ]
      },
      doctors: [],
      departments: [],
      dataFormat_out: 'YYYY-MM-DD HH:mm:ss'
    }
  },
  computed: {
    span () {
      return this.showControl ? 12 : 8
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
  methods: {
    /**
     * 提交数据
     */
    onSubmit () {
      return this.$refs.ruleForm.validate(valid => {
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
        valid && this.$emit('submit', { ...specimen_info })
      })
    },
    /**
     * 编辑数据
     * @param record
     */
    edit (record) {
      this.form = { ...record }
    },
    /**
     * 重置表单
     */
    resetFields () {
      this.form.department = ''
      this.$refs.ruleForm.resetFields()
    },
    /**
     * 脏值检测
     * @param e
     */
    handleConfirmBlur (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    date_format(date){
      return date.split('T')[0]
    },
  }
}
</script>

<style scoped lang="less">
.patient-form-content {

  &__divider {
    font-weight: normal;
    font-size: 14px;
  }
}
</style>
