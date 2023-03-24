/**
* LIS管理布局
* Date: 2020/5/15
* Time: 12:13 上午
*/
<template>
  <div :style="!$route.meta.hiddenHeaderContent ? 'margin: -24px -24px 0px;' : null">
    <div class="page-header" :class="[isMobile && 'page-header--mobile']">
      <div class="page-header-index-wide">
        <div slot="pageMenu">
          <div class="page-menu-tabs" v-if="tabs && tabs.items">
            <!-- @change="callback" :activeKey="activeKey" -->
            <a-tabs :tabBarStyle="{margin: 0, border: '1px solid transparent'}" :activeKey="tabs.active()" @change="tabs.callback">
              <a-tab-pane v-for="item in tabs.items" :tab="item.title" :key="item.key"></a-tab-pane>
            </a-tabs>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="page-header-index-wide">
        <slot>
          <!-- keep-alive  -->
          <keep-alive v-if="multiTab">
            <router-view ref="content" />
          </keep-alive>
          <router-view v-else ref="content" />
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PageHeader from '@/components/PageHeader'

export default {
    name: 'LisView',
    components: {
      PageHeader
    },
    data () {
      return {
        tabs: {
          items: [
            {
              key: '1',
              title: '病人信息录入'
            },
            {
              key: '2',
              title: '医生信息录入'
            },
            {
              key: '3',
              title: '部分信息录入'
            }
          ],
          active: () => {
            switch (this.$route.path) {
              case '/lis/patient':
                return '1'
              case '/lis/doctor':
                return '2'
              case '/lis/department':
                return '3'
              default:
                return '1'
            }
          },
          callback: (key) => {
            switch (key) {
              case '1':
                this.$router.push('/lis/patient')
                break
              case '2':
                this.$router.push('/lis/doctor')
                break
              case '3':
                this.$router.push('/lis/department')
                break
              default:
                this.$router.push('/lis')
            }
          }
        }
      }
    },
    computed: {
      ...mapState({
        multiTab: state => state.app.multiTab,
        isMobile: state => state.app.device
      })
    }
  }
</script>

<style lang="less" scoped>
  .content {
    margin: 24px 24px 0;
  }

  .page-header {
    background: #fff;
    padding: 16px 32px 0;

    &--mobile {
      padding: 16px 8px 0;
    }
  }
</style>
