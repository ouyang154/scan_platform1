/**
* 用户信息表单
* Date: 2020/6/4
* Time: 9:25 下午
*/
<template>
  <div class="read-film-form-content">

    <!-- S 表单 -->
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item ref="equip_id" label="设备编号" prop="equip_id">
        <a-input v-model="form.equip_id" />
      </a-form-model-item>
      <!-- / 设备编号 -->

      <a-form-model-item ref="ip" label="ip地址" prop="ip">
        <a-input v-model="form.ip" />
      </a-form-model-item>
      <!-- / ip地址 -->

      <a-form-model-item ref="mac" label="mac地址" prop="mac">
        <a-input v-model="form.mac" />
      </a-form-model-item>
      <!-- / mac地址 -->

      <a-form-model-item ref="offsetX" label="X偏移" prop="offsetX">
        <a-input-number v-model="form.offsetX" style="width: 100%" />
      </a-form-model-item>
      <!-- / X偏移 -->

      <a-form-model-item ref="offsetY" label="Y偏移" prop="offsetY">
        <a-input-number v-model="form.offsetY" style="width: 100%" />
      </a-form-model-item>
      <!-- / Y偏移 -->

      <a-form-model-item ref="manager" label="负责人" prop="manager">
        <a-input v-model="form.manager" />
      </a-form-model-item>
      <!-- / 负责人 -->

      <a-form-model-item ref="room" label="放置地点" prop="room">
        <a-input v-model="form.room" />
      </a-form-model-item>
      <!-- / 放置地点 -->

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
        equip_id: '',
        ip: '',
        mac: '',
        offsetX: 0,
        offsetY: 0,
        manager: '',
        room: ''
      },
      rules: {
        equip_id: [
          { required: true, message: '请输入设备编号！', trigger: 'change' }
        ],
        ip: [
          { required: true, message: '请输入ip地址！', trigger: 'change' }
        ],
        offsetX: [
          { required: true, message: '请输入X方向偏移量，默认0！', trigger: 'change' }
        ],
        offsetY: [
          { required: true, message: '请输入Y方向偏移量，默认0！', trigger: 'change' }
        ]
      }
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
