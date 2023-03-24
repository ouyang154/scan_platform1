/**
* 预审
* Date: 2020/6/7
* Time: 4:37 下午
*/
<template>
  <content-layout>
    <a-spin :spinning="isLoading">

      <div class="preview" v-if="info">

        <!-- S 预览标题区 -->
        <div class="preview__header">
          <div class="preview__row">
            <div class="preview__basic">
              <p>{{ info.specimen_info.name }}</p>
              <p>年龄：{{ info.specimen_info.age }}</p>
              <p>采样编号：{{ info.specimen_info.specimen_id }}</p>
              <p>采样日期：{{ info.specimen_info.specimen_date }}</p>
              <a-button type="primary" @click="$router.push({ name: 'Scan' })">返回</a-button>
            </div>
          </div>
        </div>
        <!-- E 预览标题区 -->

        <!-- S 预览内容区 -->
        <div class="preview__content">
          <a-card class="preview__wrap" :bordered="false">
            <div class="preview__view" id="viewer">

              <div id="toolbar" class="preview__toolbar">
                <a id="zoom-in" href="#zoom-in">
                  <a-button type="default" shape="circle" icon="zoom-in"></a-button>
                </a>
                <a id="zoom-out" href="#zoom-out">
                  <a-button type="default" shape="circle" icon="zoom-out"></a-button>
                </a>
                <a id="home" href="#home">
                  <a-button type="default" shape="circle" icon="home"></a-button>
                </a>
                <a id="full-page" href="#full-page">
                  <a-button type="default" shape="circle" icon="fullscreen"></a-button>
                </a>
                <a-button type="default" shape="circle" icon="right" v-if="ismultifocus" @click="handleNextFocus"></a-button>
              </div>

            </div>
          </a-card>
        </div>
        <!-- E 预览内容区 -->

      </div>
    </a-spin>
  </content-layout>
</template>

<script>
import ContentLayout from '@/layouts/ContentLayout'
import { getScanDetail } from '@/api/workspace'
import OSS from '@/utils/oss'
import Openseadragon from 'openseadragon'

export default {
  name: 'PreReview',
  components: {
    ContentLayout
  },
  data () {
    return {
      isLoading: true, // 载入中
      info: null, // 案例详情
      viewer: null, // 视图对象
      currentPage: 0, // 当前页码
      ismultifocus: false // 切换焦点按钮是否可见
    }
  },
  async mounted () {
    await this.getScanDetail()
    const { scan_folder: scanFolder, multi_focus: multiFocus } = this.info
    // 配置数量
    const configNumbers = multiFocus || 0

    let tileSources = new Array(configNumbers).fill(0).map((_, index) => {
      const imagePath = `exam/${scanFolder}/tile/focus${index}/`
      return {
        height: 54720,
        width: 54720,
        tileSize: 1024,
        maxLevel: 6,
        getTileUrl: function (level, x, y) {
          function zeroPad (i) {
            const n = String(i)
            const m = 3 - n.length
            return (m < 1) ? n : new Array(m + 1).join('0') + n
          }
          const fn = '../../../../static/' + imagePath + (6 - level) + '/' + zeroPad(y) + 'x' + zeroPad(x) + '.jpg'
          // const fn = imagePath + (6 - level) + '/' + zeroPad(y) + 'x' + zeroPad(x) + '.jpg'
          return fn // OSS.instance.signatureUrl(fn)
        }
      }
    })

    // 如果配置项超出一个，则添加第二张预加载
    if (tileSources.length > 1) {
      this.ismultifocus = true
      tileSources = tileSources.map((tileSource, index) => ({
        tileSource,
        index,
        opacity: index === 0 ? 1 : 0,
        preload: index === 1
      }))
    }

    // 实例化视图对象
    this.viewer = new Openseadragon({
      id: 'viewer',
      tileSources: tileSources,
      defaultZoomLevel: 0.5,
      toolbar: 'toolbar',
      zoomInButton: 'zoom-in',
      zoomOutButton: 'zoom-out',
      homeButton: 'home',
      fullPageButton: 'full-page',
      previousButton: 'previous',
      nextButton: 'next',
      showNavigator: true,
      crossOriginPolicy: 'Anonymous'
    })
  },
  methods: {
    /**
     * 获取案例详情
     * @returns {Promise<void>}
     */
    async getScanDetail () {
      try {
        this.isLoading = true
        this.info = await getScanDetail(this.$route.params.id)
      } catch (e) {
      } finally {
        this.isLoading = false
      }
    },
    /**
     * 视图焦点切换
     */
    handleNextFocus () {
      const viewCount = this.viewer.world.getItemCount()
      const currentView = this.viewer.world.getItemAt(this.currentPage)
      currentView.setOpacity(0)
      this.currentPage < viewCount - 1 ? this.currentPage += 1 : this.currentPage = 0
      const nextView = this.viewer.world.getItemAt(this.currentPage)
      nextView.setOpacity(1)
    }
  },
  beforeDestroy () {
    this.viewer && this.viewer.destroy()
  }
}
</script>

<style scoped lang="less">
.preview {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  height: calc(100vh - 64px);
  width: 100vw;

  &__header {
    padding: 12px 16px 0;
    background: white;
  }

  &__row {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;

    &--between {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
    }

    &--end {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-end;
      align-items: center;
    }

    p {
      margin: 0 16px 0 0;
    }
  }

  &__basic {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
  }

  &__control {
    height: 45px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    align-items: center;

    button {
      margin-left: 12px;
    }
  }

  &__bar {
    height: 45px;

    p {
      margin: 0 16px 0 0;
    }
  }

  &__info {
    width: 100%;

    button {
      margin-left: 12px;
    }
  }

  &__tabs {
    flex: none;
    width: 570px;
    padding-left: 10px;
    margin-left: 8px;

    /deep/ .ant-tabs-bar {
      border-bottom: 1px solid transparent;
    }
  }

  &__content {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    height: 100%;
    padding: 0px;
  }

  &__wrap {
    width: 100%;
    height: 100%;

    /deep/ .ant-card-body {
      padding: 0px;
    }
  }

  &__view {
    position: relative;
    width: 100%;
    height: calc(100vh - 117px);
    z-index: 1;

    #grid {
      position: absolute;
      top: 14px;
      left: 280px;
      z-index: 1;
    }

    #measure {
      position: absolute;
      top: 14px;
      left: 320px;
      z-index: 1;
    }
  }

  &__toolbar {
    position: absolute !important;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 36px;
    padding: 0 16px;
    top: 12px;
    z-index: 1;

    button {
      margin-right: 12px;
    }
  }

  &__handle {
    flex: none;
    width: 560px;
    margin-left: 16px;

    &--full {
      width: 100%;
      margin: 0;
    }

    /deep/ .ant-card-body {
      padding: 16px;
    }
  }
}
</style>
