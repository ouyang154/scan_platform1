/**
* 密码更改
* Date: 2020/5/11
* Time: 11:45 下午
*/
<template>
  <a-card :bordered="false">
    <div class="password-change">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <!-- S 姓名 -->
        <a-form-model-item ref="username" label="姓名" prop="username">
          <a-input v-model="form.username" :disabled="true" />
        </a-form-model-item>
        <!-- E 姓名 -->

        <!-- S 原密码 -->
        <a-form-model-item ref="password" label="原密码" prop="password">
          <a-input type="password" v-model="form.password" autocomplete="off" />
        </a-form-model-item>
        <!-- E 原密码 -->

        <!-- S 新密码 -->
        <a-form-model-item ref="newpassword" label="新密码" prop="newpassword">
          <a-input type="password" v-model="form.newpassword" autocomplete="off" />
        </a-form-model-item>
        <!-- E 新密码 -->

        <!-- S 确认密码 -->
        <a-form-model-item ref="checkPass" label="确认密码" prop="checkPass">
          <a-input type="password" v-model="form.checkPass" autocomplete="off" @blur="handleConfirmBlur" />
        </a-form-model-item>
        <!-- E 确认密码 -->

        <!-- S 提交 -->
        <a-row>
          <a-col span="2"></a-col>
          <a-col span="7">
            <a-button type="primary" @click="onSubmit">提交</a-button>
          </a-col>
        </a-row>
        <!-- E 提交 -->

      </a-form-model>
    </div>
  </a-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { login,updateUser } from '@/api/login'
export default {
  name: 'PasswordChange',
  data () {
    // 新密码触发验证密码校验
    const validateToNextPassword = (rule, value, callback) => {
      if (value && this.confirmDirty) {
        this.$refs.ruleForm.validateField(['checkPass'])
      }
      callback()
    }
    // 与新密码进行比对
    const compareToFirstPassword = (rule, value, callback) => {
      if (value && value !== this.form.newpassword) {
        // eslint-disable-next-line standard/no-callback-literal
        callback('两次密码不同！')
      } else {
        callback()
      }
    }
    return {
      labelCol: { span: 2 },
      wrapperCol: { span: 7 },
      confirmDirty: false,
      form: {
        username: '',
        password: '',
        newpassword: '',
        checkPass: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入用户名！', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码！', trigger: 'change' }
        ],
        newpassword: [
          { required: true, message: '请输入新密码！', trigger: 'change' },
          { validator: validateToNextPassword, trigger: 'change' }
        ],
        checkPass: [
          { required: true, message: '请再次输入新密码！', trigger: 'change' },
          { validator: compareToFirstPassword, trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['nickname'])
  },
  created () {
    this.form.username = this.nickname
  },
  methods: {
    ...mapActions(['Login']),
    /**
     * 数据提交
     */
    onSubmit () {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {          
          const { username, password} = this.form
          try{
            await login({ username, password })
            this.changepassword() 
          } catch (e){
            this.$message.error('密码错误！')
          }                  
        } else {
          return false
        }
      })
    },
    /**
     * 脏值检测
     * @param e
     */
    handleConfirmBlur (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    async changepassword(){
      try {
        const { username, newpassword } = this.form
        const id =  JSON.parse(localStorage.getItem("pro__USER")).value.id
        await updateUser(id,{
          user: { username, password: newpassword }
        })
        this.$message.success('密码已修改！')             
      } catch (e) {
        this.$message.error('修改异常！')
      }
    }
  }
}
</script>

<style scoped>

</style>
