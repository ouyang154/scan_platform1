/**
* 用户信息表单
* Date: 2020/6/4
* Time: 9:25 下午
*/
<template>
  <div class="user-management-form-content">

    <!-- S 表单 -->
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item ref="username" label="姓名" prop="username">
        <a-input v-model="form.username" />
      </a-form-model-item>
      <!-- / 姓名 -->

      <a-form-model-item ref="password" label="密码" prop="password">
        <a-input type="password" v-model="form.password" />
      </a-form-model-item>
      <!-- / 密码 -->

      <a-form-model-item ref="checkPass" label="确认" prop="checkPass">
        <a-input type="password" v-model="form.checkPass" @blur="handleConfirmBlur" />
      </a-form-model-item>
      <!-- / 再次输入码 -->

      <a-form-model-item ref="role" prop="role" label="角色">
        <a-checkbox-group v-model="form.role">
          <a-row>
            <a-col :span="8">
              <a-checkbox value="admin">管理员</a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="edit">校对员</a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="review">初审员</a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="submit">复审员</a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </a-form-model-item>
      <!-- / 角色 -->

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
    }
  },
  data () {
    // 新密码触发验证密码校验
    const validateToPassword = (rule, value, callback) => {
      if (value && this.confirmDirty) {
        this.$refs.ruleForm.validateField(['checkPass'])
      }
      callback()
    }
    // 与新密码进行比对
    const compareToPassword = (rule, value, callback) => {
      if (value && value !== this.form.password) {
        // eslint-disable-next-line standard/no-callback-literal
        callback('两次密码不同！')
      } else {
        callback()
      }
    }
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 17 },
      confirmDirty: false,
      form: {
        username: '',
        password: '',
        checkPass: '',
        role: []
      },
      isAdmin: false,
      rules: {
        username: [
          { required: true, message: '请输入用户名！', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码！', trigger: 'change' },
          { validator: validateToPassword }
        ],
        checkPass: [
          { required: true, message: '请再次输入密码！！', trigger: 'change' },
          { validator: compareToPassword }
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
        const { username, password, role, id } = this.form
        const roleNames = ['admin', 'edit', 'review', 'submit']
        const roles = roleNames.reduce((cum, roleName) => Object.assign(cum, { [roleName]: role.includes(roleName) }), {})
        const form = Object.assign({}, {
          id,
          user: {
            username,
            password
          },
          ...roles
        })
        valid && this.$emit('submit', form)
      })
    },
    /**
     * 编辑数据
     * @param record
     */
    edit (record) {
      const { id, username } = record
      const roleNames = ['admin', 'edit', 'review', 'submit']
      this.isAdmin = JSON.parse(localStorage.getItem("pro__USER")).value.username === 'admin' ? true : false
      this.form = {
        id,
        username,
        role: roleNames.filter(role => record[role])
      }
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
