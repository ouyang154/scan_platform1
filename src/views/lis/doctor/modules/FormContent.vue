/**
* 用户信息表单
* Date: 2020/6/4
* Time: 9:25 下午
*/
<template>
  <div class="doctor-form-content">

    <!-- S 表单 -->
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item ref="name" label="姓名" prop="name">
        <a-input v-model="form.name" />
      </a-form-model-item>
      <!-- / 姓名 -->

      <a-form-model-item ref="department" label="部门">
        <a-auto-complete v-model="form.department" :data-source="departments" />
      </a-form-model-item>
      <!-- / 部门 -->

      <a-form-model-item ref="doctor_id" label="工号" prop="doctor_id">
        <a-input v-model="form.doctor_id" />
      </a-form-model-item>
      <!-- / ip地址 -->

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
import { getDepartments } from '@/api/lis'

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
      labelCol: { span: 5 },
      wrapperCol: { span: 17 },
      confirmDirty: false,
      form: {
        name: '',
        department: '',
        doctor_id: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入医生姓名！', trigger: 'change' }
        ]
      },
      departments: []
    }
  },
  async created () {
    try {
      const parameter = { page: 1, page_size: 100 }
      const { results: departmentResults } = await getDepartments(parameter)
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
        valid && this.$emit('submit', { ...this.form })
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
    }
  }
}
</script>

<style scoped>

</style>
