<template>
  <transition name="showHeader">
    <div v-if="visible" class="header-animat">
      <a-layout-header
        v-if="visible"
        :class="[fixedHeader && 'ant-header-fixedHeader', sidebarOpened ? 'ant-header-side-opened' : 'ant-header-side-closed', ]"
        :style="{ padding: '0' }">
        <div :class="['top-nav-header-index', theme]">
          <div class="header-index-wide">

            <!-- S Logo -->
            <div class="header-index-left">
              <router-link to="/">
                <img :src="logoSlogan" alt="" height="50" class="header-index-logo">
              </router-link>
            </div>
            <!-- E Logo -->

            <!-- S Nav and not mobile and tablet -->
            <div class="header-index-nav" v-if="!(deviceType === 'mobile' || deviceType === 'tablet') && !hideNav">

              <router-link
                class="header-index-nav__item"
                active-class="header-index-nav__item--active"
                v-for="nav of navs"
                :key="nav.name"
                :to="{ path: nav.path }" >
                <a-icon :type="nav.meta.icon" />
                {{ nav.meta.title }}
              </router-link>
            </div>
            <!-- E Nav and not mobile and tablet -->

            <!-- S Nav and is mobile or tablet -->
            <div class="header-index-mobile" v-if="(deviceType === 'mobile' || deviceType === 'tablet') && !hideNav">
              <a-dropdown placement="bottomCenter">
                <a-icon type="bars" />
                <a-menu slot="overlay">
                  <a-menu-item v-for="nav of navs" :key="nav.name">
                    <router-link
                      active-class="header-index-nav__item--active"
                      :to="{ path: nav.path }">
                      <a-icon :type="nav.meta.icon" />
                      {{ nav.meta.title }}
                    </router-link>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </div>
            <!-- E Nav and is mobile and tablet -->

            <!-- S User -->
            <user-menu class="header-index-right"></user-menu>
            <!-- E User -->

          </div>
        </div>
      </a-layout-header>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
import UserMenu from '../tools/UserMenu'
import { mixin } from '@/utils/mixin'
import LogoSlogan from '@/assets/logo_slogan.png'
import { siblingRoutes } from '@/utils/routeConvert'

export default {
  name: 'GlobalHeader',
  components: {
    UserMenu
  },
  mixins: [mixin],
  props: {
    mode: {
      type: String,
      default: 'sidemenu'
    },
    menus: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'light'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    device: {
      type: String,
      required: false,
      default: 'desktop'
    },
    hideNav: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      logoSlogan: LogoSlogan,
      visible: true,
      oldScrollTop: 0,
      navs: []
    }
  },
  mounted () {
    document.addEventListener('scroll', this.handleScroll, { passive: true })
  },
  computed: {
    ...mapState({
      routes: state => state.permission.addRouters
    })
  },
  methods: {
    handleScroll () {
      if (!this.autoHideHeader) {
        return
      }

      const scrollTop = document.body.scrollTop + document.documentElement.scrollTop
      if (!this.ticking) {
        this.ticking = true
        requestAnimationFrame(() => {
          if (this.oldScrollTop > scrollTop) {
            this.visible = true
          } else if (scrollTop > 300 && this.visible) {
            this.visible = false
          } else if (scrollTop < 300 && !this.visible) {
            this.visible = true
          }
          this.oldScrollTop = scrollTop
          this.ticking = false
        })
      }
    },
    toggle () {
      this.$emit('toggle')
    }
  },
  watch: {
    '$route': {
      immediate: true,
      handler (route) {
        this.navs = siblingRoutes({
          children: this.routes
        }, [], route)
      }
    }
  },
  beforeDestroy () {
    document.body.removeEventListener('scroll', this.handleScroll, true)
  }
}
</script>

<style lang="less">
@import '../index.less';

.header-animat{
  position: relative;
  z-index: @ant-global-header-zindex;
}
.showHeader-enter-active {
  transition: all 0.25s ease;
}
.showHeader-leave-active {
  transition: all 0.5s ease;
}
.showHeader-enter, .showHeader-leave-to {
  opacity: 0;
}
.header-index-logo {
  cursor: pointer;
}
.header-index-nav {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding-left: 36px;

  &__item {
    margin-right: 36px;
    color: rgba(0, 0, 0, .65);

    i {
      margin-right: 4px;
    }

    &--active {
      color: #1890ff !important;
    }
  }
}
.header-index-mobile {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
  width: 100%;

  i {
    font-size: 18px;
    margin-right: 6px;
  }
}
</style>
