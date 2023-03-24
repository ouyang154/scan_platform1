/**
* 快速预览
* Date: 2020/5/15
* Time: 12:46 上午
*/
<template>
  <div class="quick-review">

    <!-- S 头部 -->
    <div class="quick-review__header">
      <!--<a-button :type="review_icon_style(microscopeButtonState)" icon="border-outer" @click="enableReviewEquipment" >镜下</a-button>-->
      <a-button type="primary" icon="border-outer" @click="handleNextFocusQuickView()" >焦点</a-button>
      <!--        <a-button type="primary">病变一览</a-button>-->
      <a-row :gutter="12" class="quick-review__navs">
        <a-col :span="6">
          <a-button :type="buttonType('LSIL')" @click="setSection('LSIL')">低级别鳞状上皮病变 {{ LSILCount }}</a-button>
        </a-col>
        <a-col :span="6">
          <a-button :type="buttonType('HSIL')" @click="setSection('HSIL')">高级别鳞状上皮病变 {{ HSILCount }}</a-button>
        </a-col>
        <a-col :span="6">
          <a-button :type="buttonType('AGC')" @click="setSection('AGC')">腺细胞异常 {{ AGCCount }}</a-button>
        </a-col>
        <a-col :span="6">
          <a-button :type="buttonType('micro')" @click="setSection('micro')">微生物感染 {{ microCount }}</a-button>
        </a-col>       
      </a-row>
      <a-button type="primary" icon="rollback" @click="goBack()">返回</a-button> 
    </div>
    <!-- E 头部 -->

    <!-- S 内容区 -->
    <div class="quick-review__content" ref="content">
      <div
        class="quick-review__section"
        v-for="(source, index) of sectionImageList"
        :key="index"
      >
        <p>{{ pageSize * ( $route.query.page - 1) + index + 1 }}{{'&nbsp;&nbsp;&nbsp;'}}{{getType(pageSize * ( $route.query.page - 1) + index)}}</p>
        <img v-if="source" @click="handleImageClick(index)" @dblclick="handleImageDblclick(index)" :src="source" alt="" style="max-width: 100%;max-height: 100%;">
      </div>
      <div class="quick-review__left">
        <a-button type="primary" shape="circle" icon="left" size="large" @click="previousPage" />
      </div>
      <div class="quick-review__right">
        <a-button type="primary" shape="circle" icon="right" size="large" @click="nextPage" />
      </div>
    </div>
    <!-- E 内容区 -->

    <!-- S 辅助视图对象 -->
    <div id="helper-viewer"></div>
    <!-- E 辅助视图对象 -->

    <!-- S 全阅片视图对话框 -->
    <div>
      <el-dialog class="reviewdialog" :title="ReviewDialogTitle" :visible.sync="ReviewFormVisible" fullscreen @close="closeModel">
        <div class="reviewdialog__view" id="ReviewDialogDiv">
          <div id="toolbar" class="reviewdialog__toolbar">
            <a id="zoom-in" href="#zoom-in">
              <a-button type="default" shape="circle" icon="zoom-in"></a-button>
            </a>
            <a id="zoom-out" href="#zoom-out">
              <a-button type="default" shape="circle" icon="zoom-out"></a-button>
            </a>
            <a-button type="default" shape="circle" icon="right" v-if="ismultifocus" @click="handleNextFocus"></a-button>
            <div style="width:47px;margin-left:-100px;margin-top:700px">
              <ul id="toolsul-zoom" class="tools">
                <!-- data-* 属性用于存储页面或应用程序的私有自定义数据。 -->
                  <li data-type="line" :class="{active:zoomType==2}" @click="activeZoom(2)">
                      <i class="icon-tools icon-two-black" data-default='icon-tools icon-two-black'></i>
                  </li>
                  <li data-type="line" :class="{active:zoomType==4}" @click="activeZoom(4)">
                      <i class="icon-tools icon-four-black" data-default='icon-tools icon-four-black'></i>
                  </li>                      
                  <li data-type="rectangle" :class="{active:zoomType==10}" @click="activeZoom(10)">
                      <i class="icon-tools icon-ten-black" data-default='icon-tools icon-ten-black'></i>
                  </li>
                  <li data-type="circle" :class="{active:zoomType==20}" @click="activeZoom(20)">
                      <i class="icon-tools icon-twenty-black" data-default='icon-tools icon-twenty-black'>
                      </i>
                  </li>
                  <li data-type="clear" :class="{active:zoomType==40}" @click="activeZoom(40)">
                      <i class="icon-tools icon-forty-black" data-default='icon-tools icon-forty-black'></i>
                  </li>
                  <li data-type="clear" :class="{active:zoomType==80}" @click="activeZoom(80)">
                    <i class="icon-tools icon-eighty-black" data-default='icon-tools icon-eighty-black'></i>
                  </li>
              </ul>
            </div>
          </div>
        </div>

      </el-dialog>
    </div>
    <!-- 全阅片视图对话框 -->

  </div>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import Openseadragon from 'openseadragon'
import { mapState } from 'vuex'
import OSS from '@/utils/oss'
import imageCompress from '@/utils/imageCompress'
import { getDPI } from '@/utils/measure'
import { moveReviewMachine, closeReviewMachine } from '@/api/microscope'
import { getType } from 'mime';
export default {
  name: 'QuickReview',
  data () {
    return {
      sections: null,
      helperViewer: null, // 视图对象
      // 切片类型映射
      sectionTypesMapping: new Map([
        ['LSIL', 'LSILList'],
        ['HSIL', 'HSILList'],
        ['micro', 'microList'],
        ['AGC', 'AGCList']
      ]),
      // 切片类型名称映射
      sectionTypeNameMapping: new Map([
        ['LSIL', 'LSIL'],
        ['HSIL', 'HSIL'],
        ['micro', 'parasite'],
        ['AGC', 'AGCList']
      ]),
      // 图片压缩配置
      compressOptions: null,
      sectionTypeCache: 'LSIL',
      pageSize: 15,
      page: 1,
      totalPage: 0,
      dialogviewer: '',
      ReviewFormVisible: true,
      jumpTime: 0,
      ReviewDialogTitle: '浏览对话框',
      review_window_height: document.documentElement.clientHeight,
      review_window_width: document.documentElement.clientWidth,
      currentIndex: 0,
      currentPage: 0, // 当前页码
      ismultifocus: false, // 是否多层扫描
      microscopeButtonState: false, //是否开启镜下阅片
      offsetX: 0,
      offsetY: 0,
      isMicroscope: false,
      timer: null,
      zoomType:20,
      zoomRatio:25400/(54720*0.24*10*1.6)
    }
  },
  created () {
    this.sections = Vue.ls.get('sections')
  },
  computed: {
    ...mapState('view', ['scanInfo']),
    // 切片类型
    sectionType () {
      return this.$route.query.sectionType || 'LSIL'
    },
    // 切片图片列表
    sectionImageList () {
      const listType = this.sectionTypesMapping.get(this.sectionType)
      return this.sections.image[listType]
    },
    // 切片资源列表
    sectionSourceList () {
      const listType = this.sectionTypesMapping.get(this.sectionType)
      return this.sections.source[listType]
    },
    LSILCount () {
      return _.get(this.scanInfo.detection_info.bbox_info, 'l_bbox_array.length', 'N/A')
    },
    nucleusCount () {
      return _.get(this.scanInfo, 'nucleus_count', 'N/A')
    },
    HSILCount () {
      return _.get(this.scanInfo.detection_info.bbox_info, 'h_bbox_array.length', 'N/A')
    },
    microCount () {
      return _.get(this.scanInfo.detection_info.bbox_info, 'microbe_bbox_array.length', 'N/A')
    },
    AGCCount () {
      return _.get(this.scanInfo.detection_info.bbox_info, 'agc_bbox_array.length', 'N/A')
    },
  },
  mounted () {
    this.enterKeyup()
    this.isMicroscope = localStorage.getItem('reviewequipment')  =='true'? true : false
    if (this.isMicroscope){
      this.offsetX= parseInt(localStorage.getItem('offsetX'));
      this.offsetY= parseInt(localStorage.getItem('offsetY'));
    }
    setTimeout(() => {
      const { width, height } = this.$refs.content.getBoundingClientRect()
      const sectionWidth = (width - 10 * 4) / 5
      const sectionHeight = (height - 8 * 4) / 3
      // 设置压缩配置
      this.compressOptions = {
        width: sectionWidth,
        height: sectionHeight
      }
      const {
        scan_folder: scanFolder,
        multi_focus: multiFocus
      } = this.scanInfo || Vue.ls.get('scanInfo')
      this.totalPage= Math.ceil(this.scanInfo.detection_info.bbox_info.l_bbox_array.length/this.pageSize)
      const configNumbers = multiFocus || 0

      // 初始化辅助视图，格式化切片图片
      const helpertileSource = new Array(1).fill(0).map((_, index) => {
        const imagePath = `exam/${scanFolder}/tile/focus${index}/`
        return {
          height: 54720,
          width: 54720,
          tileSize: 1024,
          maxLevel: 0,
          getTileUrl: function (level, x, y) {
            function zeroPad (i) {
              const n = String(i)
              const m = 3 - n.length
              return (m < 1) ? n : new Array(m + 1).join('0') + n
            }
            const fn = '../../../../static/' + imagePath + (0 - level) + '/' + zeroPad(y) + 'x' + zeroPad(x) + '.jpg'
            // const fn = imagePath + (6 - level) + '/' + zeroPad(y) + 'x' + zeroPad(x) + '.jpg'
            return fn // OSS.instance.signatureUrl(fn)
          }
        }
      })

      // 初始化辅助视图
      this.helperViewer = new Openseadragon({
        id: 'helper-viewer',
        tileSources: helpertileSource,
        sequenceMode: true,
        defaultZoomLevel: 160,
        minZoomLevel: 160,
        maxZoomLevel: 160,
        crossOriginPolicy: 'Anonymous'
      })

      this.helperViewer.addHandler('open', async () => {
        console.log('open')
        await this.getPaginationImages(this.currentPage)
      })

      // 初始化全阅片对话框
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
        tileSources = tileSources.map((tileSource, index) => ({
          tileSource,
          index,
          opacity: index === 0 ? 1 : 0,
          preload: index === 1
        }))
        this.ismultifocus=true
      }

      this.dialogviewer = new Openseadragon({
        id: 'ReviewDialogDiv',
        tileSources: tileSources,
        defaultZoomLevel: 40,
        minZoomLevel: 0.8,
        maxZoomLevel: 160,
        toolbar: 'toolbar',
        zoomInButton: 'zoom-in',
        zoomOutButton: 'zoom-out',
        showZoomIn: false,
        showNavigator: false,
        showHomeControl: false,
        showFullPageControl: false,
        crossOriginPolicy: 'Anonymous'
      })
    }, 100)
    setTimeout(() => { this.closeModel() }, 50)
  },
  methods: {
    /**
     * 返回
     */
    goBack () {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
      const { params, query } = this.$route
      // this.$router.push({
      //   name: 'Review',
      //   params,
      //   query
      // })
      this.$router.push({
        name: 'Review',
        params,
        query: { id:query.id, sectionType: 'LSIL', page: 1, index: 1 }
      })
    },
    /**
     * 监测图片载入成功
     * @param tileImage
     * @returns {Promise<boolean>}
     */
    imageLoaded (tileImage) {
      return new Promise((resolve, reject) => {
        let usedTime = 0
        const timer = setInterval(() => {
          usedTime += 200
          // 监测图片加载超出10秒后，则认为图片加载失败
          if (usedTime >= 10000) {
            reject(new Error('Images Loaded Timeout 10s'))
          }
          const loaded = tileImage.getFullyLoaded()
          if (loaded) {
            clearInterval(timer)
            resolve(true)
          }
        }, 200)
      })
    },
    /**
     * 导出图片资源
     * @param viewer
     */
    async exportImageSource (viewer) {
      try {
        const tiledImageCount = viewer.world.getItemCount()
        const tiledImageLoaders = new Array(tiledImageCount).fill(0).map((_, index) => {
          const tileImage = viewer.world.getItemAt(index)
          return this.imageLoaded(tileImage)
        })
        const imagesLoadedStatus = await Promise.all(tiledImageLoaders)
        const imagesLoaded = imagesLoadedStatus.reduce((previousValue, currentValue) => previousValue && currentValue)
        if (imagesLoaded) {
          const imageSource = viewer.drawer.canvas.toDataURL('image/png')
          return await imageCompress(imageSource, this.compressOptions)
        }
      } catch (e) {
        return null
      }
    },
    /**
     * 获取当前页面的分页图片
     */
    async getPaginationImages (currentPage) {
      try {
        const page = this.$route.query.page || 1
        const cloneSections = _.cloneDeep(this.sections)
        const targetListName = this.sectionTypesMapping.get(this.sectionType)
        const sources = cloneSections.source[targetListName].slice(
          this.pageSize * (page - 1),
          this.pageSize * page
        )
        this.sections.image[targetListName] = []
        if (this.scanInfo.bbox_ready ===2)
        {
          let scanFolder = this.scanInfo.scan_folder
          for (const source of sources) {        
            const imageSource = `../../../../static/exam/${scanFolder}/detection/`+source.file_focus0
            if (currentPage===1) { imageSource = `../../../../static/exam/${scanFolder}/detection/`+source.file_focus1 }
            if (currentPage===2) { imageSource = `../../../../static/exam/${scanFolder}/detection/`+source.file_focus2 }
            console.log(imageSource)
            this.sections.image[targetListName].push(imageSource)
          }
        }
        else{
          for (const source of sources) {
            const { centerx, centery } = source.bbox_slide
            this.helperViewer.viewport.panTo(new Openseadragon.Point(centerx, centery), true)
            const imageSource = await this.exportImageSource(this.helperViewer)
            this.sections.image[targetListName].push(imageSource)
          }
        }

      } catch (e) {
        this.$message.error('导出图片错误，请尝试刷新！', e)
      }
    },
    /**
     * 按钮类型
     * @param value
     * @returns {string}
     */
    buttonType (value) {
      return this.sectionType === value ? 'primary' : 'default'
    },
    /**
     * 切片类型切换
     * @param sectionType
     */
    setSection (sectionType) {
      let totalCount= this.LSILCount
      if (sectionType === 'HSIL') {totalCount= this.HSILCount}
      if (sectionType === 'AGC') {totalCount= this.AGCCount}
      if (sectionType === 'micro') {totalCount= this.microCount}
      this.totalPage= Math.ceil(totalCount/this.pageSize)
      const { params } = this.$route
      this.$router.push({
        name: 'QuickReview',
        params: params,
        query: {
          id:this.scanInfo.id,
          sectionType,
          page: 1,
          index: 1
        }
      })
    },
    /**
     * 切片选择
     * @param index
     */
    sectionChecked (index) {
      const { params, query: { sectionType, page } } = this.$route
      this.$router.push({
        name: 'Review',
        params,
        query: { sectionType, page, index: index + 1 }
      })
    },
    /**
     * 上一页
     */
    previousPage () {
      const { params, query: { sectionType, page } } = this.$route
      if (page > 1) {
        this.$router.push({
          name: 'QuickReview',
          params,
          query: {
            id:this.scanInfo.id,
            sectionType,
            page: +page - 1,
            index: 1
          }
        })
      }
      else {
        this.$router.push({
          name: 'QuickReview',
          params,
          query: {
            id:this.scanInfo.id,
            sectionType,
            page: this.totalPage,
            index: 1
          }
        })
      }
    },
    /**
     * 下一页
     */
    nextPage () {
      const { params, query: { sectionType, page } } = this.$route
      if (page < this.totalPage){
        this.$router.push({
          name: 'QuickReview',
          params,
          query: {
            id:this.scanInfo.id,
            sectionType,
            page: +page + 1,
            index: 1
          }
        })
      }
      else {
        this.$router.push({
          name: 'QuickReview',
          params,
          query: {
            id:this.scanInfo.id,
            sectionType,
            page: 1,
            index: 1
          }
        })
      }
    },
    // tab键监听
    enterKey (event) {
      const code = event.keyCode
          ? event.keyCode
          : event.which
              ? event.which
              : event.charCode
      if (this.ismultifocus & this.ReviewFormVisible) {
        if (code === 9) { this.handleNextFocus() } // key 'tab'
      }
      if (this.ismultifocus & !this.ReviewFormVisible) {
        if (code === 9) { this.handleNextFocusQuickView() } // key 'tab'
      }
      if (!this.ReviewFormVisible) {
        if (code === 49) { this.previousPage() } // key '1'
        if (code === 50) { this.nextPage() } // key '2'
      }
      if (code === 81) {
        if (this.ReviewFormVisible) { this.closeModel() }
      } // key 'q'
    },
    enterKeyupDestroyed () {
      document.removeEventListener('keyup', this.enterKey)
    },
    enterKeyup () {
      document.addEventListener('keyup', this.enterKey)
    },

    // 切换成全阅片
    handleImageDblclick (index) {
      const timers = this.timer
      if (timers) {
        window.clearTimeout(timers)
        this.timer = null
      }
      this.jumpToReview(index)
    },
    jumpToReview (index) {
      this.ReviewFormVisible = true
      const source = _.cloneDeep(this.sectionSourceList)[(this.page-1)*this.pageSize+index]
      if (source) {
        const { centerx, centery} = source.bbox_slide
        this.ReviewDialogTitle = (this.page-1)*this.pageSize+index+1+' '+source.label
        let t=this.dialogviewer; 
        this.zoomType =25
        t.viewport.zoomTo(20,null,true);       
        t.viewport.panTo(new Openseadragon.Point(centerx,centery),true)
      }  
    },
    closeModel () {
      this.ReviewFormVisible = false
    },
    /**
     * 视图焦点切换
     */
    handleNextFocus () {
      const viewCount = this.dialogviewer.world.getItemCount()
      const currentView = this.dialogviewer.world.getItemAt(this.currentPage)
      currentView.setOpacity(0)
      this.currentPage < viewCount - 1 ? this.currentPage += 1 : this.currentPage = 0
      const nextView = this.dialogviewer.world.getItemAt(this.currentPage)
      nextView.setOpacity(1)
    },
    handleNextFocusQuickView () {
      const viewCount = this.dialogviewer.world.getItemCount()
      this.currentPage < viewCount - 1 ? this.currentPage += 1 : this.currentPage = 0
      this.getPaginationImages (this.currentPage)
    },
    getType (index){
      const source = _.cloneDeep(this.sectionSourceList)[index]
      return source.label
    },

    /**
     * 镜下阅片控制
     */    
    enableReviewEquipment(){
      if (this.isMicroscope) {
        this.microscopeButtonState = !this.microscopeButtonState
        if(this.microscopeButtonState){
          this.$message({
            type: 'success',
            message: '镜下阅片开启'
          })
        }
        else{
          this.$message({
            type: 'info',
            message: '镜下阅片关闭'
          })
          this.closereviewmachine()
        }
      }      
    },

    review_icon_style(microscopeButtonState){
      return microscopeButtonState?"primary":"default"
    },

    handleImageClick (index) {
      let timers=this.timer
      if(timers){
        window.clearTimeout(timers);
        this.timer=null
      }
      this.timer=window.setTimeout(()=>{
        this.moveReview(index)
      },300)
    },
    moveReview(index){
      const source = _.cloneDeep(this.sectionSourceList)[(this.page-1)*this.pageSize+index]
      if (source) {
        const { centerx, centery} = source.bbox_slide
        /*** update main review window corresponding to selected thumbnail ***/
        if (this.isMicroscope && this.microscopeButtonState && centerx>0) {          
          let x_init=null
          let y_init=null
          if (this.scanInfo.scan_log){
            x_init= this.scanInfo.scan_log.x_init
            y_init= this.scanInfo.scan_log.y_init
          }
          let opt={
            x_init: x_init,
            y_init: y_init,
            x_pixel_idx:parseInt((1-centerx)*54720+this.offsetX),
            y_pixel_idx:parseInt((1-centery)*54720+this.offsetY),
            specimen_id:this.scanInfo.specimen_id
          }
          this.movemachine(opt)
        }
      }
    },
    movemachine(opt){
      moveReviewMachine(opt)
      .then(res => {
        console.log(res)
      })
      .catch( function(error) {
        let res_status;
        if (error.response) {
            res_status = error.response.status;
            if(res_status == 200){
                this.$message({
                    type: 'info',
                    message: '移动成功'
                })
            }
            else if (res_status == 401) {
                this.$message({
                    type: 'info',
                    message: 'ID不符'
                })
            } 
            else if (res_status == 409) {
                this.$message({
                    type: 'info',
                    message: '没有权限'
                })
            }           
            else {
                this.$message({
                    type: 'info',
                    message: '服务器错误'
                })
            }
        } else {
            console.log(error);
            this.$message({
                type: 'info',
                message: '服务器错误'
            })
        }
      }.bind(this));
    },
    closereviewmachine(){
      if(this.isMicroscope){
        let opt={
          specimen_id:this.scanInfo.specimen_id,
          close:true
        }
        closeReviewMachine(opt)
        .then(res => {
          console.log(res)
        })
        .catch( function(error) {})
      }
    },
    // zoom segment
    activeZoom(num){
      this.zoomType=num
      this.review_window_width = document.getElementById('ReviewDialogDiv').offsetWidth
      this.dialogviewer.viewport.zoomTo(this.zoomType/(this.zoomRatio/getDPI()*this.review_window_width*window.devicePixelRatio))
    },
  },
  watch: {
    /**
     * 监听路由，切换缩放区域
     */
    '$route': {
      immediate: false,
      handler ({ query: { sectionType, page } }) {
        if (this.page !== +page || this.sectionTypeCache !== sectionType) {
          this.page = +page
          this.sectionTypeCache = sectionType
          this.getPaginationImages(this.currentPage)
        }
      }
    }
  },
  beforeDestroy () {
    this.enterKeyupDestroyed()
    this.dialogviewer && this.dialogviewer.destroy()
    this.helperViewer && this.helperViewer.destroy()
  }
}
</script>

<style scoped lang="scss">
@import "../../components/iconstyle.css";
.quick-review {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: stretch;
  height: 100vh;
  width: 100vw;

  &__header {
    flex: none;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    height: 36px;
    padding: 0 16px;
  }

  &__navs {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-evenly;
    align-items: center;
    margin: 0 6px !important;

    button {
      width: 100%;
    }
  }

  &__content {
    position: relative;
    height: calc(100vh - 36px);
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 4px;
    box-sizing: border-box;
    padding: 12px;
  }

  &__section {
    position: relative;
    cursor: pointer;

    p {
      position: absolute;
      top: 0;
      left: 4px;
      color: red;
      z-index: 1;
    }
  }

  &__left {
    position: absolute;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    width: 64px;
    height: 64px;
    top: calc(50% - 32px);
    left: 12px;
    z-index: 1;
    transition: all 300ms ease-in-out;
    opacity: 0;
  }

  &__right {
    position: absolute;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    width: 64px;
    height: 64px;
    top: calc(50% - 32px);
    right: 12px;
    z-index: 1;
    transition: all 300ms ease-in-out;
    opacity: 0;
  }

  &:hover &__right, &:hover &__left {
    opacity: 1;
  }
}

#helper-viewer {
  height: 160px;
  width: 160px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0;
}

.reviewdialog {
  &__view {
    position: relative;
    width: 100%;
    height: calc(100vh - 147px);
    z-index: 1;

    #grid {
      position: absolute;
      top: 14px;
      left: 280px;
      z-index: 1;
      opacity: 1 !important;
    }

    #measure {
      position: absolute;
      top: 14px;
      left: 320px;
      z-index: 1;
      opacity: 1 !important;
    }
  }
  &__toolbar {
    position:  absolute !important;
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
}
</style>
