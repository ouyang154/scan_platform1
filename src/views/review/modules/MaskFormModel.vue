/**
*
* Date: 2020/6/5
* Time: 11:08 下午
*/
<template>
  <div class="department-form-model">
    <a-modal
      title="添加"
      :width="200"
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
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="">
            <a-radio-group v-model="form.radioValue">
              <a-radio :value="1">细胞核</a-radio>
              <a-radio :value="2">包浆</a-radio>
            </a-radio-group>
          </a-form-model-item>
        </a-form-model>
        <!-- E 表单 -->

      </a-spin>
    </a-modal>
  </div>
</template>

<script>

export default {
  name: 'NucleusFormModel',
  data () {
    return {
      visible: false,
      confirmLoading: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      form: {
        radioValue: 1
      }
    }
  },
  methods: {
    /**
     * 打开新建模态框
     */
    open () {
      this.confirmLoading = false
      this.visible = true
    },
    /**
     * 关闭模态框
     */
    close () {
      this.confirmLoading = false
      this.visible && this.$refs.ruleForm.resetFields()
      this.visible = false
    },
    /**
     * 确认提交
     */
    handleConfirm () {
      if (this.form.radioValue) {
        this.confirmLoading = true
        this.$emit('submit', this.form)
      } else {
        this.handleCancel()
      }
    },
    /**
     * 取消
     */
    handleCancel () {
      this.$refs.ruleForm.resetFields()
      this.visible = false
    }
  }
}
</script>

<style scoped>

</style>
