<template>
  <div class="user-wrapper">
    <a-dropdown>
      <span class="action ant-dropdown-link user-dropdown-menu">
        <a-avatar class="avatar" :src="avatar"/>
        <span>{{ nickname }}</span>
      </span>
      <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
        <a-menu-item key="1">
          <router-link :to="{ name: 'Case' }">
            <a-icon type="container" />
            <span>所有病例统计</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="2">
          <router-link :to="{ name: 'LIS' }">
            <a-icon type="project"/>
            <span>LIS管理</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="3">
          <router-link :to="{ path: '/setting' }">
            <a-icon type="setting"/>
            <span>管理</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="4" v-if="nickname==='admin'">
          <router-link :to="{ path: '/debug' }">
            <a-icon type="control"/>
            <span>扫描调试</span>
          </router-link>
        </a-menu-item>
        <a-menu-divider/>
        <a-menu-item key="5">
          <a href="javascript:;" @click="handleLogout">
            <a-icon type="logout"/>
            <span>退出登录</span>
          </a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'UserMenu',
  computed: {
    ...mapGetters(['nickname', 'avatar'])
  },
  methods: {
    ...mapActions(['Logout']),
    handleLogout () {
      this.Logout({}).then(() => {
        setTimeout(() => {
          window.location.reload()
        }, 16)
      }).catch(err => {
        this.$message.error({
          title: '错误',
          description: err.message
        })
      })
    }
  }
}
</script>
