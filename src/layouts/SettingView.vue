/**
* 设置页布局
* Date: 2020/5/11
* Time: 11:58 下午
*/
<template>
  <div class="setting-view">
    <div class="page-header-index-wide">
      <a-card :bordered="false" :bodyStyle="{ padding: '16px 0', height: '100%' }" :style="{ height: '100%' }">
        <div class="setting-view-main" :class="device">
          <div class="setting-view-info-left">
            <a-menu
              :mode="device == 'mobile' ? 'horizontal' : 'inline'"
              :style="{ border: '0', width: device == 'mobile' ? '560px' : 'auto'}"
              :selectedKeys="selectedKeys"
              type="inner"
              @openChange="onOpenChange"
            >
              <a-menu-item key="/setting/password-change">
                <router-link :to="{ name: 'PasswordChange' }">
                  密码修改
                </router-link>
              </a-menu-item>
              <a-menu-item key="/setting/hospital-info">
                <router-link :to="{ name: 'HospitalInfo' }">
                  医院信息
                </router-link>
              </a-menu-item>
              <a-menu-item key="/setting/user-management">
                <router-link :to="{ name: 'UserManagement' }">
                  用户管理
                </router-link>
              </a-menu-item>
              <a-menu-item key="/setting/report-template">
                <router-link :to="{ name: 'ReportTemplate' }">
                  报告模板
                </router-link>
              </a-menu-item>
              <a-menu-item key="/setting/read-film">
                <router-link :to="{ name: 'ReadFilm' }">
                  阅片平台管理
                </router-link>
              </a-menu-item>
              <a-menu-item key="/setting/data-management">
                <router-link :to="{ name: 'DataManagement' }">
                  数据管理
                </router-link>
              </a-menu-item>
            </a-menu>
          </div>
          <div class="setting-view-info-right">
            <div class="setting-view-info-title">
              <span>{{ $route.meta.title }}</span>
            </div>
            <route-view></route-view>
          </div>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { PageView, RouteView } from '@/layouts'
import { mixinDevice } from '@/utils/mixin.js'

export default {
  name: 'SettingView',
  components: {
    RouteView,
    PageView
  },
  mixins: [mixinDevice],
  data () {
    return {
      // horizontal  inline
      mode: 'inline',

      openKeys: [],
      selectedKeys: []
    }
  },
  computed: {
    ...mapState({
      multiTab: state => state.app.multiTab
    })
  },
  mounted () {
    this.updateMenu()
  },
  methods: {
    onOpenChange (openKeys) {
      this.openKeys = openKeys
    },
    updateMenu () {
      const routes = this.$route.matched.concat()
      this.selectedKeys = [ routes.pop().path ]
    }
  },
  watch: {
    '$route' (val) {
      this.updateMenu()
    }
  }
}
</script>

<style scoped lang="less">
  .setting-view-main {
    width: 100%;
    display: flex;
    height: 100%;
    overflow: auto;

    &.mobile {
      display: block;

      .setting-view-info-left {
        border-right: unset;
        border-bottom: 1px solid #e8e8e8;
        width: 100%;
        height: 50px;
        overflow-x: auto;
        overflow-y: scroll;
      }
      .setting-view-info-right {
        padding: 20px 40px;
      }
    }

    .setting-view-info-left {
      border-right: 1px solid #e8e8e8;
      width: 224px;
    }

    .setting-view-info-right {
      flex: 1 1;
      padding: 8px 40px;

      .setting-view-info-title {
        color: rgba(0,0,0,.85);
        font-size: 20px;
        font-weight: 500;
        line-height: 28px;
        margin-bottom: 12px;
      }
    }
  }
</style>
