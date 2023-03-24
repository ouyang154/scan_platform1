/**
* 用户信息模态框
* Date: 2020/6/5
* Time: 11:08 下午
*/
<template>
  <div class="doctor-form-model">
    <a-modal
      :title="!isEdit ? '添加医生信息' : '编辑医生信息'"
      :width="640"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleConfirm"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <form-content ref="form" @submit="handleSubmit" :is-edit="isEdit" />
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import FormContent from './FormContent'

export default {
  name: 'FormModel',
  components: {
    FormContent
  },
  data () {
    return {
      isEdit: false,
      visible: false,
      confirmLoading: false
    }
  },
  methods: {
    /**
     * 打开新建模态框
     */
    add () {
      this.isEdit = false
      this.confirmLoading = false
      this.visible = true
    },
    /**
     * 打开编辑模态框
     * @param record
     */
    edit (record) {
      this.isEdit = true
      this.confirmLoading = false
      this.visible = true
      this.$nextTick(() => this.$refs.form.edit(record))
    },
    /**
     * 关闭模态框
     */
    close () {
      this.confirmLoading = false
      this.visible && this.$refs.form.resetFields()
      this.visible = false
    },
    /**
     * 确认
     */
    handleConfirm () {
      this.$refs.form.onSubmit()
    },
    /**
     * 提交
     * @param form
     */
    handleSubmit (form) {
      this.confirmLoading = true
      this.$emit(this.isEdit ? 'modify' : 'submit', form)
    },
    /**
     * 取消
     */
    handleCancel () {
      this.$refs.form.resetFields()
      this.visible = false
    }
  }
}
</script>

<style scoped>

</style>
