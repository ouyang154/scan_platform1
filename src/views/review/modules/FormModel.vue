/**
*
* Date: 2020/6/5
* Time: 11:08 下午
*/
<template>
  <div class="department-form-model">
    <a-modal
      title="添加"
      :width="700"
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
          <a-form-model-item label="鳞状细胞">
            <a-radio-group v-model="form.radioValue">
              <a-radio :value="1">ASCUS</a-radio>
              <a-radio :value="2">LSIL</a-radio>
              <a-radio :value="3">ASC-H</a-radio>
              <a-radio :value="4">HSIL</a-radio>
              <a-radio :value="5">SCC</a-radio>
            </a-radio-group>
          </a-form-model-item>

          <a-form-model-item label="腺细胞">
            <a-radio-group v-model="form.radioValue">
              <a-radio :value="6">AGC-NOS</a-radio>
              <a-radio :value="7">AGC-FN</a-radio>
              <a-radio :value="8">AIS</a-radio>
              <a-radio :value="9">ADCA</a-radio>
            </a-radio-group>
          </a-form-model-item>

          <a-form-model-item label="微生物">
            <a-radio-group v-model="form.radioValue">
              <a-radio :value="10">滴虫</a-radio>
              <a-radio :value="11">真菌(念珠菌等)</a-radio>
              <a-radio :value="12">放线菌</a-radio>
              <a-radio :value="13">疱疹病毒</a-radio>
              <a-radio :value="14">线索细胞</a-radio>
            </a-radio-group>
          </a-form-model-item>

          <a-form-model-item label="其他">
            <a-radio-group v-model="form.radioValue">
              <a-radio :value="15">子宫内膜细胞</a-radio>
              <a-radio :value="16">其他</a-radio>
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
  name: 'FormModel',
  data () {
    return {
      visible: false,
      confirmLoading: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      form: {
        radioValue: null
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
