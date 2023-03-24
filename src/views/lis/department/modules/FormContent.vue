/**
* 部门信息表单
* Date: 2020/6/4
* Time: 9:25 下午
*/
<template>
  <div class="department-form-content">

    <!-- S 表单 -->
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item ref="name" label="部门" prop="name">
        <a-input v-model="form.name" />
      </a-form-model-item>
      <a-form-model-item ref="department_id" label="部门编号" prop="department_id">
        <a-input v-model="form.department_id" />
      </a-form-model-item>
      <a-form-model-item v-if="showControl" :wrapper-col="{ span: 14, offset: 5 }">
        <a-button type="primary" @click="onSubmit">
          添加
        </a-button>
        <a-button style="margin-left: 10px;" @click="resetFields">
          重置
        </a-button>
      </a-form-model-item>
    </a-form-model>
    <!-- E 表单 -->

  </div>
</template>

<script>
export default {
  name: 'FormContent',
  props: {
    showControl: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 17 },
      form: {
        name: '',
        department_id: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入部门名称！', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /**
     * 提交数据
     */
    onSubmit () {
      this.$refs.ruleForm.validate(valid => {
        valid && this.$emit('submit', { ...this.form })
      })
    },
    edit (record) {
      this.form = { ...record }
    },
    /**
     * 重置表单
     */
    resetFields () {
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>

<style scoped>
</style>
