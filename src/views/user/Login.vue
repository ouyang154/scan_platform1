/**
* 登录表单
* Date: 2020/5/22
* Time: 11:14 上午
*/
<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >

      <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" message="账户或密码错误" />

      <a-form-item>
        <a-input
          size="large"
          type="text"
          placeholder="请输入用户名"
          v-decorator="[
            'username',
            {rules: [{ required: true, message: '请输入用户名', validateTrigger: 'change' }] }
          ]"
        >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-input
          size="large"
          type="password"
          autocomplete="false"
          placeholder="请输入密码"
          v-decorator="[
            'password',
            {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
          ]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >确定</a-button>
      </a-form-item>

    </a-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import { getReviewMachine } from '@/api/microscope'
import { getMicros } from '@/api/setting'
export default {
  data () {
    return {
      loginBtn: false,
      isLoginError: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false
      }
    }
  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    /**
     * 提交登录
     * @param event
     */
    handleSubmit (event) {
      event.preventDefault()
      const {
        form: { validateFields },
        state,
        Login
      } = this

      state.loginBtn = true

      const validateFieldsKey = ['username', 'password']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          Login({ ...values })
            .then(this.loginSuccess)
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    /**
     * 登录成功处理
     */
    loginSuccess () {
      this.checkMachineType()
      this.getmachines()
      this.$router.push({ path: '/' })
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
      this.isLoginError = false
    },
    /**
     * 登录失败处理
     * @param err
     */
    requestFailed (err) {
      this.isLoginError = true
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
    },

    /**
     * 查看是否阅片平台
     * @param err
     */
    checkMachineType () {
      let mac={mac:[]}
      localStorage.setItem('mac',JSON.stringify(mac) );
      this.getUserMAC((mac) => {
        tlocalStorage.setItem('mac', JSON.stringify(mac));
      });
      this.getmachines()
    },
    getUserMAC(onNewMAC){
      getReviewMachine()
      .then(res =>{
          onNewMAC(res.data)
      })
    },

    /**
     * 获取阅片平台列表
     * @param err
     */
    getmachines() {
      getMicros().then(res=>{ 
        let machines=res
        let obj = JSON.parse(localStorage.getItem('mac'));
        let maclist=obj.mac
        let filtermachines =[]
        for(let i=0;i<maclist.length;i++){
          filtermachines = filtermachines.concat(machines.filter(item => (item.mac === maclist[i])))
        }
        if (filtermachines.length > 0) {
          localStorage.setItem('reviewequipment', true)
          localStorage.setItem('offsetX',filtermachines[0].offsetX)
          localStorage.setItem('offsetY',filtermachines[0].offsetY)
        } else {
          localStorage.setItem('reviewequipment', false)
          localStorage.setItem('offsetX',0)
          localStorage.setItem('offsetY',0)
        }        
      })  
    }    
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
