/**
* 工作区布局
* Date: `2020/5/15`
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
  name: 'WorkspaceList',
  components: {
    PageHeader
  },
  data () {
    return {
      tabs: {
        items: [
          {
            key: '1',
            title: '待诊断'
          },
          {
            key: '2',
            title: '待打印'
          },
          {
            key: '3',
            title: '待扫描'
          },
          {
            key: '4',
            title: '未完成任务'
          }
        ],
        active: () => {
          switch (this.$route.path) {
            case '/workspace/diagnose':
              return '1'
            case '/workspace/print':
              return '2'
            case '/workspace/scan':
              return '3'
            case '/workspace/task':
              return '4'
            default:
              return '1'
          }
        },
        callback: (key) => {
          switch (key) {
            case '1':
              this.$router.push('/workspace/diagnose')
              break
            case '2':
              this.$router.push('/workspace/print')
              break
            case '3':
              this.$router.push('/workspace/scan')
              break
            case '4':
              this.$router.push('/workspace/task')
              break
            default:
              this.$router.push('/workspace')
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
    margin: 0;
  }

  .page-header {
    background: #fff;
    padding: 16px 32px 0;

    &--mobile {
      padding: 16px 8px 0;
    }
  }
</style>
