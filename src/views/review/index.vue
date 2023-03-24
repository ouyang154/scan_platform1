/**
* 审阅视图
* Date: 2020/5/15
* Time: 12:37 上午
*/
<template>
  <content-layout>
    <a-spin :spinning="isLoading">

      <div class="review" v-if="info">

        <!-- S 审阅标题区 -->
        <div class="review__header">
          <div class="review__bar review__row--between">
            <div class="review__info review__row--between">
              <div class="review__row">
                <a-button style="box-sizing: border-box; margin: 0px; width: 18px;height:50px;" type="primary"
                  @click="showDrawer" icon='right'></a-button>
                <a-drawer title="病例信息" placement="left" :closable="true" :visible="drawer_visible"
                  :after-visible-change="afterVisibleChange" @close="onClose">
                  <div>
                    <a-row :gutter="16">
                      <a-col :span="10">
                        <p style="text-align: right;">姓名:</p>
                      </a-col>
                      <a-col :span="14">
                        <p>{{ info.specimen_info.name }}</p>
                      </a-col>
                      <a-col :span="10">
                        <p style="text-align: right;">年龄:</p>
                      </a-col>
                      <a-col :span="14">
                        <p>{{ info.specimen_info.age }}</p>
                      </a-col>
                      <a-col :span="10">
                        <p style="text-align: right;">出生日期:</p>
                      </a-col>
                      <a-col :span="14">
                        <p>{{ info.specimen_info.birth | date_format }}</p>
                      </a-col>
                      <a-col :span="10">
                        <p style="text-align: right;">绝经:</p>
                      </a-col>
                      <a-col :span="14">
                        <p>{{ info.specimen_info.menses }}</p>
                      </a-col>
                      <a-col :span="10">
                        <p style="text-align: right;">末次月经:</p>
                      </a-col>
                      <a-col :span="14">
                        <p>{{ info.specimen_info.menses_date | date_format }}</p>
                      </a-col>
                      <a-col :span="10">
                        <p style="text-align: right;">采样编号:</p>
                      </a-col>
                      <a-col :span="14">
                        <p>{{ info.specimen_info.specimen_id }}</p>
                      </a-col>
                      <a-col :span="10">
                        <p style="text-align: right;">采样日期:</p>
                      </a-col>
                      <a-col :span="14">
                        <p>{{ info.specimen_info.specimen_date | date_format }}</p>
                      </a-col>
                      <a-col :span="10">
                        <p style="text-align: right;">送检日期:</p>
                      </a-col>
                      <a-col :span="14">
                        <p>{{ info.specimen_info.reference_date | date_format }}</p>
                      </a-col>
                      <a-col :span="10">
                        <p style="text-align: right;">申请科室:</p>
                      </a-col>
                      <a-col :span="14">
                        <p>{{ info.specimen_info.reference_department }}</p>
                      </a-col>
                      <a-col :span="10">
                        <p style="text-align: right;">申请医生:</p>
                      </a-col>
                      <a-col :span="14">
                        <p>{{ info.specimen_info.reference_doctor }}</p>
                      </a-col>
                      <a-col :span="10">
                        <p style="text-align: right;">门诊号:</p>
                      </a-col>
                      <a-col :span="14">
                        <p>{{ info.specimen_info.outpatient_id }}</p>
                      </a-col>
                      <a-col :span="10">
                        <p style="text-align: right;">住院号:</p>
                      </a-col>
                      <a-col :span="14">
                        <p>{{ info.specimen_info.inpatient_id }}</p>
                      </a-col>
                      <a-col :span="10">
                        <p style="text-align: right;">床号:</p>
                      </a-col>
                      <a-col :span="14">
                        <p>{{ info.specimen_info.inpatient_bed }}</p>
                      </a-col>
                    </a-row>
                  </div>
                </a-drawer>
                <p style="margin-left: 20px;"><b>{{ info.specimen_info.name }}</b></p>
                <p><b>{{ info.specimen_info.age }}</b></p>
                <p>{{ info.specimen_info.specimen_id }}</p>
                <p>{{ info.specimen_info.specimen_date | date_format }}</p>
                <p>{{ info | AIDiagnosisFilter(satisfaction_nucleus_count) }}</p>
                <a-button type="primary" v-if="gridButtonState" @click="showGridDrawer">设置视野参数</a-button>
                <a-drawer title="视野参数" placement="left" :closable="true" :visible="gridparadrawer_visible"
                  :after-visible-change="afterVisibleChange" @close="onClose">
                  <div>
                    <a-form-item label="横向视野">
                      <a-input v-model="gridXSplitLineCount" placeholder="" />
                    </a-form-item>
                    <a-form-item label="纵向视野">
                      <a-input v-model="gridYSplitLineCount" placeholder="" />
                    </a-form-item>
                    <a-form-item label="视野比例">
                      <a-input v-model="gridZoomLevel" placeholder="" />
                    </a-form-item>
                    <a-button type="primary" @click="setGridPara">设置视野参数</a-button>

                  </div>
                </a-drawer>

              </div>
            </div>

            <div class="review__tabs">
              <a-tabs :tabBarStyle="{ margin: 0 }" :activeKey="activeKey" @change="tabChange">
                <a-tab-pane tab="阳性列表" key="0"></a-tab-pane>
                <a-tab-pane tab="报告诊断" key="1"></a-tab-pane>

                <div slot="tabBarExtraContent" class="review__control">
                  <a-button type="default" @click="returnToList">返回</a-button>
                  <a-button type="primary" @click="save(true)">保存</a-button>
                  <a-button type="primary" @click="checkCompletion">提交报告</a-button>
                </div>
              </a-tabs>
            </div>
          </div>
        </div>
        <!-- E 审阅标题区 -->

        <!-- S 审阅内容区 -->
        <div class="review__content">
          <a-card class="review__wrap" :bordered="false" v-show="isDesktop">
            <div class="review__view" id="viewer">
              <div id="toolbar" class="review__toolbar">
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
                <a id="select" ref="select">
                  <a-button :type="selectionButtonState ? 'primary' : 'default'" shape="circle" icon="border"
                    @click="selectionButtonState = !selectionButtonState"></a-button>
                </a>
                <a id="grid" ref="grid">
                  <a-button :type="gridButtonState ? 'primary' : 'default'" shape="circle" icon="number"></a-button>
                </a>
                <a id="measure" ref="measure">
                  <a-button :type="measureButtonState ? 'primary' : 'default'" shape="circle" icon="edit"></a-button>
                </a>
                <a-button type="default" shape="circle" icon="right" v-if="ismultifocus" @click="handleNextFocus">
                </a-button>

                <a id="microscope" ref="microscope">
                  <a-button :type="microscopeButtonState ? 'primary' : 'default'" shape="circle" icon="eye"
                    v-if="isMicroscope" @click="enableReviewEquipment"></a-button>
                </a>
                <a id="backward" ref="backward">
                  <a-button :type="gridButtonState ? 'primary' : 'default'" shape="circle" icon="backward"
                    v-if="gridButtonState" value="large"></a-button>
                </a>
                <a id="forward" ref="forward">
                  <a-button :type="gridButtonState ? 'primary' : 'default'" shape="circle" icon="forward"
                    v-if="gridButtonState" value="large"></a-button>
                </a>
                <div style="width:47px;margin-left:-230px;margin-top:700px" v-if="measureButtonState">
                  <ul id="toolsul" class="tools">
                    <!-- data-* 属性用于存储页面或应用程序的私有自定义数据。  -->
                    <li data-type="line" :class="{ active: drawType == 1 }" @click="activeDraw(1)" title="开发中...">
                      <i class="icon-tools icon-line-black" data-default='icon-tools icon-line-black'></i>
                    </li>
                    <li data-type="rectangle" :class="{ active: drawType == 2 }" @click="activeDraw(2)" title="开发中...">
                      <i class="icon-tools icon-rectangle-black" data-default='icon-tools icon-rectangle-black'></i>
                    </li>
                    <li data-type="ellipse" :class="{ active: drawType == 3 }" @click="activeDraw(3)" title="开发中...">
                      <i class="icon-tools icon-ellipse-black" data-default='icon-tools icon-ellipse-black'></i>
                    </li>
                    <li data-type="circle" :class="{ active: drawType == 4 }" @click="activeDraw(4)" title="
                        键盘快捷键:
                        1: 圆心缩小, 
                        2: 圆心放大, 
                        3: 圆圈缩小, 
                        4: 圆圈放大, 
                        空格键: 回退, 
                        回车: 确认标记, 

                        鼠标左键: 选择, 
                        鼠标右键: 擦除">
                      <i class="icon-tools icon-circle-black" data-default='icon-tools icon-circle-black'></i>
                    </li>
                    <li data-type="clear" :class="{ active: drawType == 5 }" @click="activeDraw(5)">
                      <i class="icon-tools icon-clear-black" data-default='icon-tools icon-clear-black'></i>
                    </li>
                  </ul>
                </div>
                <div style="width:47px;margin-left:-230px;margin-top:700px">
                  <ul id="toolsul-zomm" class="tools">
                    <!-- data-* 属性用于存储页面或应用程序的私有自定义数据。 -->
                    <li data-type="line" :class="{ active: zoomType == 2 }" @click="activeZoom(2)">
                      <i class="icon-tools icon-two-black" data-default='icon-tools icon-two-black'></i>
                    </li>
                    <li data-type="line" :class="{ active: zoomType == 4 }" @click="activeZoom(4)">
                      <i class="icon-tools icon-four-black" data-default='icon-tools icon-four-black'></i>
                    </li>
                    <li data-type="rectangle" :class="{ active: zoomType == 10 }" @click="activeZoom(10)">
                      <i class="icon-tools icon-ten-black" data-default='icon-tools icon-ten-black'></i>
                    </li>
                    <li data-type="circle" :class="{ active: zoomType == 20 }" @click="activeZoom(20)">
                      <i class="icon-tools icon-twenty-black" data-default='icon-tools icon-twenty-black'>
                      </i>
                    </li>
                    <li data-type="clear" :class="{ active: zoomType == 40 }" @click="activeZoom(40)">
                      <i class="icon-tools icon-forty-black" data-default='icon-tools icon-forty-black'></i>
                    </li>
                    <li data-type="clear" :class="{ active: zoomType == 80 }" @click="activeZoom(80)">
                      <i class="icon-tools icon-eighty-black" data-default='icon-tools icon-eighty-black'></i>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div :class="['g-cursor', { 'g-cursor_hover': hover }, { 'g-cursor_hide': hideCursor }]">
              <div :style="cursorCircle" class="g-cursor__circle"></div>
              <div class="g-cursor__point" ref="point" :style="cursorPoint"></div>
            </div>
          </a-card>

          <a-card class="review__handle" :bordered="false"
            :class="[!isDesktop ? 'review__handle review__handle--full' : 'review__handle']">

            <div class="report-list" v-show="isShowReportList">
              <a-row :gutter="[2, 2]">
                <a-col :span="12">
                  <a-row>
                    <a-col :span="16">
                      <a-button :type="buttonType('LSIL')" @click="setSection('LSIL')">低级别鳞状上皮病变</a-button>
                    </a-col>
                    <a-col :span="8" class="report-list__num">
                      <p>{{ LSILCount }}</p>
                    </a-col>
                  </a-row>
                </a-col>
                <!-- / 低级别鳞状上皮病变 -->

                <a-col :span="12">
                  <a-row>
                    <a-col :span="16">
                      <a-button type="default">鳞状细胞总数</a-button>
                    </a-col>
                    <a-col :span="8" class="report-list__num">
                      <p>{{ nucleusCount }}</p>
                    </a-col>
                  </a-row>
                </a-col>
                <!-- / 鳞状细胞总数 -->

                <a-col :span="12">
                  <a-row>
                    <a-col :span="16">
                      <a-button :type="buttonType('HSIL')" @click="setSection('HSIL')">高级别鳞状上皮病变</a-button>
                    </a-col>
                    <a-col :span="8" class="report-list__num">
                      <p>{{ HSILCount }}</p>
                    </a-col>
                  </a-row>
                </a-col>
                <!-- / 高级别鳞状上皮病变 -->

                <a-col :span="12">
                  <a-row>
                    <a-col :span="16">
                      <a-button :type="buttonType('micro')" @click="setSection('micro')">微生物感染</a-button>
                    </a-col>
                    <a-col :span="8" class="report-list__num">
                      <p>{{ microCount }}</p>
                    </a-col>
                  </a-row>
                </a-col>
                <!-- / 微生物感染 -->

                <a-col :span="12">
                  <a-row>
                    <a-col :span="16">
                      <a-button :type="buttonType('AGC')" @click="setSection('AGC')">腺细胞异常</a-button>
                    </a-col>
                    <a-col :span="8" class="report-list__num">
                      <p>{{ AGCCount }}</p>
                    </a-col>
                  </a-row>
                </a-col>
                <!-- / 腺细胞异常 -->

                <a-col :span="12">
                  <a-row>
                    <a-col :span="16">
                      <a-button :type="buttonType('TOP')" @click="setSection('TOP')">Top60</a-button>
                    </a-col>
                    <a-col :span="8" class="report-list__num">
                      <p>{{ TOPCount }}</p>
                    </a-col>
                  </a-row>
                </a-col>
                <!-- / LSIL/HSIL/AGC排名前60 -->

              </a-row>

              <a-divider style="margin: 4px 0" />

              <a-row>
                <a-col :span="8">
                  <a-button icon="left" @click="previousPage"></a-button>
                </a-col>
                <a-col :span="8" class="report-list__control">
                  <a-button type="primary" @click="navigateToQuick">快速阅片</a-button>
                </a-col>
                <a-col :span="8">
                  <a-button style="float: right" icon="right" @click="nextPage"></a-button>
                </a-col>
              </a-row>

              <div class="report-list__sections" ref="container">
                <div class="report-list__section" v-for="({ type, source }, index) of sectionImageList" :key="index">
                  <a-skeleton active v-if="type === 'skeleton'" />
                  <router-link v-else exact active-class="report-list__section--active"
                    :to="{ name: 'Review', params: $route.params, query: { sectionType, page: $route.query.page, index: index + 1 } }">
                    <p>{{ pageSize * ($route.query.page - 1) + index + 1 }}{{ annotation_display(index) }}</p>
                    <img :src="source" @dblclick="setPositiveBbox(pageSize * ($route.query.page - 1) + index)"
                      @contextmenu.prevent="setNegativeBbox(pageSize * ($route.query.page - 1) + index)" alt="">
                  </router-link>
                </div>

              </div>
            </div>
            <!-- / 阳性列表 -->

            <div class="report-diagnose" v-show="!isShowReportList">
              <div class="diagnosis_block">
                <standard-diagnosis-model v-if="reportType === 1" ref="diagnosisDialogRef" />
                <simple-diagnosis-model v-else-if="reportType === 2" ref="diagnosisDialogRef" />
              </div>
              <a-divider style="margin: 16px 0 0" />

              <div class="report-diagnose__viewpoint">
                <div class="report-diagnose__view" v-for="(view, index) of viewpoints" :key="index">
                  <img v-if="view" :src="view" alt="">
                  <a-button type="primary" shape="circle" icon="reload" @click="refreshView(index)"></a-button>
                </div>
              </div>
              <!-- / 当前视图 -->

            </div>
            <!-- / 报告诊断 -->

          </a-card>
        </div>
        <!-- E 审阅内容区 -->

        <!-- S 选区模态框 -->
        <form-model ref="model" @submit="handleSelectSubmit" />
        <!-- E 选区模态框-->

        <!-- S 选区模态框 -->
        <mask-form-model ref="maskmodel" @submit="addMeasurement" />
        <!-- E 选区模态框-->

        <!-- S 辅助视图对象 -->
        <div id="helper-viewer"></div>
        <!-- E 辅助视图对象 -->

      </div>
    </a-spin>
  </content-layout>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import { mapState, mapGetters, mapMutations } from 'vuex'
import moment from 'moment'
import Openseadragon from 'openseadragon'
import Openseadragonselection from 'openseadragonselection'
import Openseadragonscalebar from '@/components/openseadragon-scalebar'
import OpenseadragonsvgOverlay from '@/components/openseadragon-svg-overlay'
//import OpenseadragonfabricjsOverlay from '@/components/openseadragon-fabricjs-overlay'
import fabric from '@/components/fabric.adapted'
// import OSS from '@/utils/oss'
import { getHospitals, getScanDetail, getScanList, updateScan, addBbox, grabCut, submitReport } from '@/api/workspace'
import { moveReviewMachine, closeReviewMachine } from '@/api/microscope'
import { AIDiagnosisMapping, ClassNameMapping, TypeColorMapping } from '@/mapping'
import ContentLayout from '@/layouts/ContentLayout'
import imageCompress from '@/utils/imageCompress'
import { rle_encode, rle_decode, filterClass, getDPI } from '@/utils/measure'
import { ViewMutations } from '@/store/modules/view'
import FormModel from './modules/FormModel'
import MaskFormModel from './modules/MaskFormModel'
import SimpleDiagnosisModel from './modules/SimpleDiagnosisModel'
import StandardDiagnosisModel from './modules/StandardDiagnosisModel'
import * as d3 from 'd3'

// eslint-disable-next-line no-undef
Openseadragon.selection = Openseadragonselection
Openseadragon.scalebar = Openseadragonscalebar
Openseadragon.svgOverlay = OpenseadragonsvgOverlay
//Openseadragon.fabricjsOverlay = OpenseadragonfabricjsOverlay

export default {
  name: 'Review',
  components: {
    ContentLayout,
    FormModel,
    MaskFormModel,
    SimpleDiagnosisModel,
    StandardDiagnosisModel
  },
  data() {
    return {
      moment,
      isLoading: true, // 载入中
      info: null, // 案例详情
      viewer: null, // 视图对象
      helperViewer: null, // 辅助视图对象，用于导出视图切片图片资源
      selection: null, // 视图区域选择对象
      rect: null, // 选择的矩形对象
      tabName: 'report-list', // tab 对应组件
      activeKey: '0', // tab activeKey
      ismultifocus: false, // 切换焦点按钮显示
      sections: {
        // 切片图片数据
        image: {
          LSILList: [],
          HSILList: [],
          microList: [],
          AGCList: [],
          TOPList: []
        },
        // 切片资源数据
        source: {
          LSILList: [],
          HSILList: [],
          microList: [],
          AGCList: [],
          TOPList: []
        }
      },
      selectionButtonState: false, // 选择状态按钮
      // 切片类型映射
      sectionTypesMapping: new Map([
        ['LSIL', 'LSILList'],
        ['HSIL', 'HSILList'],
        ['micro', 'microList'],
        ['AGC', 'AGCList'],
        ['TOP', 'TOPList']
      ]),
      selectionBoxes: [], // 选择框数组
      reportList: [],
      reportType: 0,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      viewpoints: [],
      sectionTypeCache: 'LSIL',
      pageSize: 12,
      page: 1,
      totalPage: 0,
      gridButtonState: false,
      gridSplitLineElements: [],
      gridXSplitLineCount: 4,
      gridYSplitLineCount: 5,
      gridZoomLevel: 4,
      measureButtonState: false,
      currentPage: 0,
      microscopeButtonState: false,
      isMicroscope: false,
      offsetX: 0,
      offsetY: 0,
      recentCenterx: 0.5,
      recentCentery: 0.5,
      scalebarOffsetx: 15,
      scalebarOffsety: 20,
      // drawing parameter
      drawType: 0,
      zoomType: 20,
      zoomRatio: 25400 / (54720 * 0.24 * 10 * 1.6),
      screenWidth: document.body.clientWidth,
      hover: false,
      hideCursor: true,
      maskEnable: false,
      annotationEnable: false,
      annoataionInit: false,
      review_window_height: window.innerHeight,
      review_window_width: window.innerWidth,
      circleSize: 50,
      pointSize: 10,
      scale_circleSize: 50,
      scale_pointSize: 10,
      init_scale: 0.4,
      xChild: 0,
      yChild: 0,
      xParent: 0,
      yParent: 0,
      svgOverlay: '',
      d3Mask: '',
      imgArr: [],
      indexlist: [],
      indexinfolist: [],
      svgList: [],
      nucleusSvgOverlay: '',
      isMaskDisplay: false,
      measureClass: '',
      addMeasurementFormVisible: false,
      newRect: {},
      measurement_array: [],
      maskAnnotation: [],
      d3Annotation: '',
      fabricjsOverlay: '',
      drawer_visible: false,
      gridparadrawer_visible: false,
      currentRange: 0,
      rangeList: [],
      currentIndex: 1,
      satisfaction_nucleus_count: 3000,
      report_zoom_level: 40,
      report_process: null
    }
  },
  filters: {
  },
  computed: {
    ...mapState('view', ['sectionSource']),
    ...mapGetters(['device']),
    isDesktop() {
      return this.device === 'desktop'
    },
    isShowReportList() {
      return !_.isEmpty(this.info) && this.tabName === 'report-list'
    },
    LSILCount() {
      return _.get(this.info.detection_info.bbox_info, 'l_bbox_array.length', 'N/A')
    },
    nucleusCount() {
      return _.get(this.info.detection_info, 'nucleus_count', 'N/A')
    },
    HSILCount() {
      return _.get(this.info.detection_info.bbox_info, 'h_bbox_array.length', 'N/A')
    },
    microCount() {
      return _.get(this.info.detection_info.bbox_info, 'microbe_bbox_array.length', 'N/A')
    },
    AGCCount() {
      return _.get(this.info.detection_info.bbox_info, 'agc_bbox_array.length', 'N/A')
    },
    TOPCount() {
      return _.get(this.info.detection_info.bbox_info, 'bbox_array.length', 'N/A')
    },
    // 切片图片列表
    sectionImageList() {
      const listType = this.sectionTypesMapping.get(this.sectionType)
      return this.sections.image[listType]
    },
    // 切片资源列表
    sectionSourceList() {
      const page = this.$route.query.page || 1
      const listType = this.sectionTypesMapping.get(this.sectionType)
      return this.sections.source[listType].slice(
        this.pageSize * (page - 1),
        this.pageSize * page
      )
    },
    // 切片类型
    sectionType() {
      return this.$route.query.sectionType || 'LSIL'
    },
    // public 文件夹路径
    publicPath() {
      return process.env.BASE_URL
    },
    // drawing functions
    cursorCircle() {
      return `transform: translateX(${this.xParent - 0 - (this.circleSize - 30) / 2}px) translateY(${this.yParent - 0 - (this.circleSize - 30) / 2}px) translateZ(0) translate3d(0, 0, 0); width: ${this.circleSize}px; height: ${this.circleSize}px`
    },
    cursorPoint() {
      return `transform: translateX(${this.xChild - 5 - (this.pointSize - 10) / 2}px) translateY(${this.yChild - 5 - (this.pointSize - 10) / 2}px) translateZ(0) translate3d(0, 0, 0); width: ${this.pointSize}px; height: ${this.pointSize}px`
    }
  },
  created() {
  },
  async mounted() {
    try {
      const [[hospital]] = await Promise.all([
        getHospitals()
      ])
      let { report_model: reportModel } = hospital
      if (!reportModel) {
        // report model uninitialiezed, default report type 1
        reportModel = 1
      }
      this.reportType = +reportModel
      if (hospital.satisfaction_nucleus_count) {
        this.satisfaction_nucleus_count = hospital.satisfaction_nucleus_count
      }
      if (hospital.report_zoom_level) {
        this.report_zoom_level = hospital.report_zoom_level
      }
      if (hospital.report_process) {
        this.report_process = hospital.report_process
      } else {
        this.report_process = 'one_level'
      }
      await this.getScanDetail()
      const {
        scan_folder: scanFolder,
        multi_focus: multiFocus,
        report_bbox_array: reportList,
        measurement_array: measurement_array
      } = this.info
      this.$nextTick(() => {
        this.$refs.diagnosisDialogRef.init(this.info);
      })
      this.reportList = reportList
      if (measurement_array) { this.measurement_array = measurement_array }
      const {
        l_bbox_array: LSILList,
        h_bbox_array: HSILList,
        agc_bbox_array: AGCList,
        microbe_bbox_array: microList,
        bbox_array: TOPList
      } = this.info.detection_info.bbox_info
      this.totalPage = Math.ceil(LSILList.length / this.pageSize)
      // 存储切片资源数据
      Object.assign(this.sections.source, {
        LSILList, HSILList, microList, AGCList, reportList, TOPList
      })
      // 将数据存入内存之中
      this.setSectionSource(_.cloneDeep(this.sections))
      // 将数据存入本地
      Vue.ls.set('sections', this.sections)
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
            function zeroPad(i) {
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
        defaultZoomLevel: 20,
        minZoomLevel: 0.01,
        maxZoomLevel: 160,
        toolbar: 'toolbar',
        zoomInButton: 'zoom-in',
        zoomOutButton: 'zoom-out',
        homeButton: 'home',
        fullPageButton: 'full-page',
        previousButton: 'previous',
        nextButton: 'next',
        showNavigator: true,
        crossOriginPolicy: 'Anonymous',
        gestureSettingsMouse: { clickToZoom: false } //设置鼠标单击不可放大
      })

      this.viewer.scalebar({
        minWidth: "60px",
        xOffset: this.scalebarOffsetx,
        yOffset: this.scalebarOffsety,
        pixelsPerMeter: 4166667,
        color: "rgb(0, 0, 0)",
        fontColor: "rgb(0, 0, 0)",
        backgroundColor: "rgba(255, 255, 255, 0.2)"
      });

      new Openseadragon.MouseTracker({
        element: this.viewer.canvas,
        dragEndHandler: this.equipmentMove,
        keyUpHandler: this.equipmentMove,
        moveHandler: this.trackmove
      }).setTracking(true);

      // 初始化辅助视图，格式化切片图片
      const helpertileSource = new Array(1).fill(0).map((_, index) => {
        const imagePath = `exam/${scanFolder}/tile/focus${index}/`
        return {
          height: 54720,
          width: 54720,
          tileSize: 1024,
          maxLevel: 0,
          getTileUrl: function (level, x, y) {
            function zeroPad(i) {
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

      this.initHelper(helpertileSource)

      // 添加视图选中区域
      this.addSelectedArea()

      // 选择器
      this.selection = this.viewer.selection({
        prefixUrl: 'images/',
        showConfirmDenyButtons: true,
        styleConfirmDenyButtons: true,
        returnPixelCoordinates: true,
        toggleButton: this.$refs.select,
        navImages: {
          selectionConfirm: {
            REST: `${this.publicPath}selection_confirm_rest.svg`,
            GROUP: `${this.publicPath}selection_confirm_rest.svg`,
            HOVER: `${this.publicPath}selection_confirm_hover.svg`,
            DOWN: `${this.publicPath}selection_confirm_hover.svg`
          },
          selectionCancel: {
            REST: `${this.publicPath}selection_cancel_rest.svg`,
            GROUP: `${this.publicPath}selection_cancel_rest.svg`,
            HOVER: `${this.publicPath}selection_cancel_hover.svg`,
            DOWN: `${this.publicPath}selection_cancel_hover.svg`
          }
        },
        handleStyle: {
          top: '50%',
          left: '50%',
          width: '6px',
          height: '6px',
          margin: '-4px 0 0 -4px',
          background: '#1890ff',
          border: '1px solid #1890ff'
        },
        cornersStyle: {
          width: '6px',
          height: '6px',
          background: '#1890ff',
          border: '1px solid #1890ff'
        },
        onSelection: async rect => {
          this.rect = rect
          this.$refs.model.open()
        }
      })

      // 添加单次视图初始化打开事件，用以添加栅格按钮
      this.viewer.addOnceHandler('open', () => {
        const gridButton = new Openseadragon.Button({
          element: this.$refs.grid,
          fadeDelay: 2000,
          fadeLength: 2000,
          onClick: this.gridButtonHandleClick
        })
        this.viewer.addControl(gridButton.element, { anchor: Openseadragon.ControlAnchor.TOP_LEFT })
      })

      // 添加单次视图初始化打开事件，用以添加测量按钮
      this.viewer.addOnceHandler('open', () => {
        const measureButton = new Openseadragon.Button({
          element: this.$refs.measure,
          fadeDelay: 2000,
          fadeLength: 2000,
          onClick: this.measureButtonHandleClick
        })
        this.viewer.addControl(measureButton.element, { anchor: Openseadragon.ControlAnchor.TOP_LEFT })
      })

      // 添加单次视图初始化打开事件，用以backward按钮
      this.viewer.addOnceHandler('open', () => {
        const backwardButton = new Openseadragon.Button({
          element: this.$refs.backward,
          fadeDelay: 2000,
          fadeLength: 2000,
          onClick: this.backwardButtonHandleClick
        })
        this.viewer.addControl(backwardButton.element, { anchor: Openseadragon.ControlAnchor.BOTTOM_LEFT })
      })
      // 添加单次视图初始化打开事件，用以backward按钮
      this.viewer.addOnceHandler('open', () => {
        const forwardButton = new Openseadragon.Button({
          element: this.$refs.forward,
          fadeDelay: 2000,
          fadeLength: 2000,
          onClick: this.forwardButtonHandleClick
        })
        this.viewer.addControl(forwardButton.element, { anchor: Openseadragon.ControlAnchor.BOTTOM_RIGHT })
      })

      // 指向第一个阳性框
      if (LSILList.length > 0) {
        let t = this.viewer;
        let px = LSILList[0].bbox_slide.centerx;
        let py = LSILList[0].bbox_slide.centery;
        t.addHandler('open', function () { t.viewport.panTo(new Openseadragon.Point(px, py), true); });
      }

      // this.getReportImages()
      this.viewpoints = new Array(2)

      // 查看是否是镜下阅片平台
      this.isMicroscope = localStorage.getItem('reviewequipment') == 'true' ? true : false
      if (this.isMicroscope) {
        this.offsetX = parseInt(localStorage.getItem('offsetX'));
        this.offsetY = parseInt(localStorage.getItem('offsetY'));
      }

      // drawing
      document.oncontextmenu = function () { return false };
      var mainDiv = document.getElementById("viewer");
      this.review_window_height = mainDiv.offsetHeight
      this.review_window_width = mainDiv.offsetWidth
      mainDiv.addEventListener("mousemove", this.moveCursor);
      mainDiv.addEventListener('mouseleave', e => { this.hideCursor = true; });
      mainDiv.addEventListener('mouseenter', e => { this.hideCursor = !this.maskEnable; });
      this.enterKeyup();

      let t = this.viewer;
      t.addHandler('canvas-click', this.grabcut)
      t.addHandler("mousewheel", this.trackScale)
      t.addHandler('canvas-nonprimary-press', this.erasecut)
      this.svgOverlay = this.viewer.svgOverlay();
      this.svgOverlay.node().parentNode.style.pointerEvents = 'none';
      this.nucleusSvgOverlay = this.viewer.svgOverlay();
      this.nucleusSvgOverlay.node().parentNode.style.pointerEvents = 'none';
      this.annotation_svgOverlay = this.viewer.svgOverlay();
      this.annotation_svgOverlay.node().parentNode.style.pointerEvents = 'none';
      if (this.isMaskDisplay) { this.plotMask() }

      // 添加屏幕缩放比例及窗口监测
      this.zoomRatio = this.zoomRatio / getDPI() * this.review_window_width * window.devicePixelRatio
      this.zoomType = 25
      t.viewport.zoomTo(this.zoomType / this.zoomRatio)
      window.addEventListener('resize', this.fixWindow)
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    ...mapMutations('view', {
      setScanInfo: ViewMutations.SET_SCAN_INFO,
      setSectionSource: ViewMutations.SET_SECTIONS
    }),
    /**
     * 初始化辅助视图
     * @param tileSources
     */
    initHelper(tileSources) {
      this.helperViewer = new Openseadragon({
        id: 'helper-viewer',
        tileSources: tileSources,
        defaultZoomLevel: 160,
        minZoomLevel: 20,
        maxZoomLevel: 160,
        crossOriginPolicy: 'Anonymous'
      })

      this.helperViewer.addHandler('open', async () => {
        await this.getPaginationImages()
      })
    },
    /**
     * tab 切换事件
     */
    async loadReportImage() {
        this.helperViewer.viewport.zoomTo(this.report_zoom_level / this.zoomRatio, null, true);
        const sources = this.reportList
        let index = 0
        for (const source of sources) {
          const { centerx, centery } = source
          this.helperViewer.viewport.panTo(new Openseadragon.Point(centerx, centery), true)
          const reportimageSource = await this.exportImageSource(this.helperViewer)
          this.viewpoints.splice(index, 1, reportimageSource)
          index++
        }
        this.helperViewer.viewport.zoomTo(160, null, true)
    },
    async tabChange() {
      this.tabName = this.tabName === 'report-list' ? 'report-diagnose' : 'report-list'
      this.activeKey = this.tabName === 'report-list' ? '0' : '1'
      // 添加视图打开时间，处理新视图打开后对焦
      // this.helperViewer.addHandler('open', async () => {
      if (this.tabName === 'report-diagnose') {
          await this.loadReportImage()
      }
      // })
    },
    /**
     * 获取案例详情
     * @returns {Promise<void>}
     */
    async getScanDetail() {
      try {
        this.isLoading = true
        if (this.$route.query.id) {
          this.info = await getScanDetail(this.$route.query.id)
          // 持久化于内存
          this.setScanInfo(_.cloneDeep(this.info))
          // 持久化于本地
          Vue.ls.set('scanInfo', this.info)
        }
        else if (this.$route.params.specimen_id) {
          let parameter = {
            specimen_id_contains: this.$route.params.specimen_id,
            ordering: '-created'
          }
          await getScanList(parameter)
            .then(res => {
              if (res.count > 0) {
                this.info = res.results[0]
                // 持久化于内存
                this.setScanInfo(_.cloneDeep(this.info))
                // 持久化于本地
                Vue.ls.set('scanInfo', this.info)
              }
              else (
                this.$message.error('无此病例！')
              )
            })
            .catch(function (error) {
              console.log(error)
            }.bind(this));
        }

      } catch (e) {
      } finally {
        this.isLoading = false
      }
    },
    /**
     * 分栏按钮点击事件
     */
    gridButtonHandleClick() {
      this.gridButtonState = !this.gridButtonState
      // 添加网格
      if (this.gridButtonState) {
        if (localStorage.getItem("gridXSplitLineCount")) {
          this.gridXSplitLineCount = parseInt(localStorage.getItem("gridXSplitLineCount"))
          this.gridYSplitLineCount = parseInt(localStorage.getItem("gridYSplitLineCount"))
          this.gridZoomLevel = parseInt(localStorage.getItem("gridZoomLevel"))
        }
        const xRatio = 1 / this.gridXSplitLineCount
        const yRatio = 1 / this.gridYSplitLineCount
        const total = this.gridXSplitLineCount * this.gridYSplitLineCount
        this.gridSplitLineElements = []
        this.rangeList = []
        for (let y = 0; y < this.gridYSplitLineCount; y++) {
          for (let x = 0; x < this.gridXSplitLineCount; x++) {
            this.rangeList.unshift(total - (this.gridXSplitLineCount * y + x + 1))
          }
        }
        new Array(total).fill(null).forEach((_, index) => {
          const element = document.createElement('div')
          element.style.border = '1px solid green'
          element.textContent = index + 1
          const left = index % this.gridXSplitLineCount * xRatio
          const top = parseInt(index / this.gridXSplitLineCount) * yRatio
          this.gridSplitLineElements.push(element)
          const location = new Openseadragon.Rect(left, top, xRatio, yRatio, Openseadragon.Placement.CENTER)
          this.viewer.addOverlay({ element, location })
        })
      } else {
        !_.isEmpty(this.gridSplitLineElements) && this.gridSplitLineElements.forEach(element => this.viewer.removeOverlay(element))
      }
    },
    forwardButtonHandleClick() {
      if (this.gridButtonState) {
        this.currentRange = (this.currentRange + 1) % this.rangeList.length
        let x_ratio = 1 / this.gridXSplitLineCount;
        let y_ratio = 1 / this.gridYSplitLineCount;
        let t = this.viewer;
        let px = (this.rangeList[this.currentRange] % this.gridXSplitLineCount + 0.5) * x_ratio
        let py = (parseInt(this.rangeList[this.currentRange] / this.gridXSplitLineCount) + 0.5) * y_ratio
        t.viewport.zoomTo(this.gridZoomLevel, null, true);
        t.viewport.panTo(new Openseadragon.Point(px, py), true)
      }
    },
    backwardButtonHandleClick() {
      if (this.gridButtonState) {
        this.currentRange = (this.currentRange - 1 + this.rangeList.length) % this.rangeList.length
        let x_ratio = 1 / this.gridXSplitLineCount;
        let y_ratio = 1 / this.gridYSplitLineCount;
        let t = this.viewer;
        let px = (this.rangeList[this.currentRange] % this.gridXSplitLineCount + 0.5) * x_ratio
        let py = (parseInt(this.rangeList[this.currentRange] / this.gridXSplitLineCount) + 0.5) * y_ratio
        t.viewport.zoomTo(this.gridZoomLevel, null, true);
        t.viewport.panTo(new Openseadragon.Point(px, py), true)
      }
    },
    showGridDrawer() {
      this.gridparadrawer_visible = true
    },
    setGridPara() {
      localStorage.setItem("gridXSplitLineCount", this.gridXSplitLineCount)
      localStorage.setItem("gridYSplitLineCount", this.gridYSplitLineCount)
      localStorage.setItem("gridZoomLevel", this.gridZoomLevel)
      this.gridButtonState = false
      !_.isEmpty(this.gridSplitLineElements) && this.gridSplitLineElements.forEach(element => this.viewer.removeOverlay(element))
      this.onClose()
      this.gridButtonHandleClick()
    },
    /**
     * 添加选中区域
     */
    addSelectedArea() {
      const sourceList = _.cloneDeep(this.sectionSourceList)
      !_.isEmpty(sourceList) && sourceList.forEach(({ bbox_slide: bbox_slide, label: classType }) => {
        const element = document.createElement('div')
        let { centerx: centerX, centery: centerY, width, height } = bbox_slide
        Object.assign(element.style, {
          width: `${width}px`,
          height: `${height}px`,
          border: `2px solid ${TypeColorMapping.get(classType)}`
        })
        this.selectionBoxes.push(element)
        const location = new Openseadragon.Rect(centerX - width / 2, centerY - height / 2, width, height, Openseadragon.Placement.CENTER)
        this.viewer.addOverlay({ element, location })
      })
    },
    /**
     * 删除选中区域
     */
    deleteSelectedArea() {
      !_.isEmpty(this.selectionBoxes) && this.selectionBoxes.forEach(element => this.viewer.removeOverlay(element))
    },
    /**
     * 切片类型切换
     * @param sectionType
     */
    setSection(sectionType) {
      let totalCount = this.LSILCount
      if (sectionType === 'HSIL') { totalCount = this.HSILCount }
      if (sectionType === 'AGC') { totalCount = this.AGCCount }
      if (sectionType === 'micro') { totalCount = this.microCount }
      if (sectionType === 'TOP') { totalCount = this.TOPCount }
      this.totalPage = Math.ceil(totalCount / this.pageSize)
      // 先行移除当选中前数组中的dom对象
      this.deleteSelectedArea()
      // 切换路由，切换切片类型
      this.$router.push({
        name: 'Review',
        params: this.$route.params,
        query: { id: this.info.id, sectionType, page: 1, index: 1 }
      })
      // 再添加新的选择区域
      this.addSelectedArea()

    },
    /**
     * 缩放至区域
     * @param index
     */
    zoomToArea(index = 1) {
      this.currentIndex = index
      // 先行移除当选中前数组中的dom对象
      this.deleteSelectedArea()
      // 再添加新的选择区域
      this.addSelectedArea()
      const source = _.cloneDeep(this.sectionSourceList)[index - 1]
      if (source) {
        const { centerx, centery } = source.bbox_slide
        this.viewer.viewport.panTo(new Openseadragon.Point(centerx, centery), true)
        //this.viewer.viewport.zoomTo(25)

        if (this.isMicroscope && this.microscopeButtonState && centerx > 0) {
          let x_init = null
          let y_init = null
          if (this.info.scan_log) {
            x_init = this.info.scan_log.x_init
            y_init = this.info.scan_log.y_init
          }
          let opt = {
            x_init: x_init,
            y_init: y_init,
            x_pixel_idx: parseInt((1 - centerx) * 54720 + this.offsetX),
            y_pixel_idx: parseInt((1 - centery) * 54720 + this.offsetY),
            specimen_id: this.info.specimen_id
          }
          this.movemachine(opt)
        }
      }
    },
    /**
     * 视图焦点切换
     */
    handleNextFocus() {
      const viewCount = this.viewer.world.getItemCount()
      const currentView = this.viewer.world.getItemAt(this.currentPage)
      currentView.setOpacity(0)
      this.currentPage < viewCount - 1 ? this.currentPage += 1 : this.currentPage = 0
      const nextView = this.viewer.world.getItemAt(this.currentPage)
      nextView.setOpacity(1)
    },
    /**
     * 按钮类型
     * @param value
     * @returns {string}
     */
    buttonType(value) {
      return this.sectionType === value ? 'primary' : 'default'
    },
    /**
     * 监测图片载入成功
     * @param tileImage
     * @returns {Promise<boolean>}
     */
    imageLoaded(tileImage) {
      return new Promise((resolve, reject) => {
        let usedTime = 0
        const timer = setInterval(() => {
          usedTime += 50
          // 监测图片加载超出10秒后，则认为图片加载失败
          if (usedTime >= 10000) {
            reject(new Error('Images Loaded Timeout 10s'))
          }
          const loaded = tileImage.getFullyLoaded()
          if (loaded) {
            clearInterval(timer)
            resolve(true)
          }
        }, 50)
      })
    },
    /**
     * 导出图片资源
     * @param viewer
     */
    // 获取所有的tileImage对象，找到该 tileImage source 对象
    async exportImageSource(viewer) {
      try {
        const tiledImageCount = viewer.world.getItemCount()
        const tiledImageLoaders = new Array(tiledImageCount).fill(0).map((_, index) => {
          const tileImage = viewer.world.getItemAt(index)
          return this.imageLoaded(tileImage)
        })
        const imagesLoadedStatus = await Promise.all(tiledImageLoaders)
        const imagesLoaded = imagesLoadedStatus.reduce((previousValue, currentValue) => previousValue && currentValue)
        if (imagesLoaded) {
          const imageSource = viewer.drawer.canvas.toDataURL('image/jpeg')
          return await imageCompress(imageSource,{ width: 530, height: 400, quality: 1 })
        }
      } catch (e) {
        return null
      }
    },
    /**
     * 并发获取图片资源
     * @param sources 图片资源地址
     * @param max 最大并发数
     * @param callback 响应后回掉
     */
    async concurrent(sources, max, callback) {
      const cloneSources = _.cloneDeep(sources).map((source, index) => ({ index: index, source }))
      let maxCount = max
      let count = 0
      const request = () => {
        count++
        const { index, source } = cloneSources.shift()
        this.exportImageSource(this.helperViewer, source)
          .then(source => {
            count--
            const target = { index, source: { type: 'source', source } }
            callback(target)
            if (count < max && cloneSources.length > 0) {
              request()
            }
          })
      }
      while (maxCount--) {
        request()
      }
    },
    /**
     * 获取当前页面的分页图片
     */
    async getPaginationImages() {
      if (!this.$route.query.page) {
        this.$router.push({
          name: 'Review',
          params: { specimen_id: this.info.specimen_info.specimen_id },
          query: { id: this.info.id, sectionType: 'LSIL', page: 1, index: 1 }
        })
      }
      try {
        let index = 0
        const page = this.$route.query.page || 1
        const cloneSections = _.cloneDeep(this.sections)
        const targetListName = this.sectionTypesMapping.get(this.sectionType)
        const sources = cloneSections.source[targetListName].slice(
          this.pageSize * (page - 1),
          this.pageSize * page
        )
        // 对所显图片的位置添加骨架屏
        this.sections.image[targetListName] = new Array(sources.length).fill({ type: 'skeleton' })
        if (this.info.bbox_ready === 2) {
          let scanFolder = this.info.scan_folder
          for (const source of sources) {
            const imageSource = `../../../../static/exam/${scanFolder}/detection/` + source.file_focus0
            this.$set(this.sections.image[targetListName], index, { type: 'source', source: imageSource })
            index++
          }
        }
        else {
          for (const source of sources) {
            const { centerx, centery } = source.bbox_slide
            this.helperViewer.viewport.panTo(new Openseadragon.Point(centerx, centery), true)
            const imageSource = await this.exportImageSource(this.helperViewer)
            this.$set(this.sections.image[targetListName], index, { type: 'source', source: imageSource })
            index++
          }
        }

      } catch (e) {
        this.$message.error('导出图片错误，请尝试刷新！', e)
      }


    },
    /**
     * 刷新视图
     * @param index
     */
    async refreshView(index) {
      // const source = await this.exportImageSource(this.viewer)
      // this.viewpoints.splice(index, 1, source)
      let t = this.viewer;
      const centerx = t.viewport.getBounds().x + t.viewport.getBounds().width / 2;
      const centery = t.viewport.getBounds().y + t.viewport.getBounds().height / 2;
      const scale = Math.min(40, 1 / t.viewport.getBounds().width);
      let opt = {
        centerx: centerx,
        centery: centery,
        scale: scale
      }
      this.reportList.splice(index, 1, opt)
      this.helperViewer.viewport.zoomTo(this.report_zoom_level / this.zoomRatio, null, true);
      this.helperViewer.viewport.panTo(new Openseadragon.Point(centerx, centery), true)
      const reportimageSource = await this.exportImageSource(this.helperViewer)
      this.viewpoints.splice(index, 1, reportimageSource)
      this.helperViewer.viewport.zoomTo(160, null, true)
    },
    /**
     * 导航至快速阅片
     */
    navigateToQuick() {
      // 全屏请求
      if (!document.fullscreenElement) {
        var box = document.documentElement
        if (box.requestFullscreen) {
          box.requestFullscreen()
        } else if (box.webkitRequestFullscreen) {
          //谷歌浏览器
          box.webkitRequestFullscreen()
        } else if (box.mozRequestFullScreen) {
          //火狐浏览器
          box.mozRequestFullScreen()
        } else if (box.msRequestFullscreen) {
          //IE浏览器
          box.msRequestFullscreen()
        } else {
          console.log('请更新你的浏览器版本')
        }
      }
      const { params, query } = this.$route
      this.$router.push({
        name: 'QuickReview',
        params,
        query: { id: this.info.id, sectionType: 'LSIL', page: 1, index: 1 }
      })
    },
    /**
     * 上一页
     */
    previousPage() {
      const { params, query: { sectionType, page } } = this.$route
      if (page > 1) {
        this.$router.push({
          name: 'Review',
          params,
          query: {
            id: this.info.id,
            sectionType,
            page: +page - 1,
            index: 1
          }
        })
      }
      else {
        this.$router.push({
          name: 'Review',
          params,
          query: {
            id: this.info.id,
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
    nextPage() {
      const { params, query: { sectionType, page } } = this.$route
      if (page < this.totalPage) {
        this.$router.push({
          name: 'Review',
          params,
          query: {
            id: this.info.id,
            sectionType,
            page: +page + 1,
            index: 1
          }
        })
      }
      else {
        this.$router.push({
          name: 'Review',
          params,
          query: {
            id: this.info.id,
            sectionType,
            page: 1,
            index: 1
          }
        })
      }

    },
    /**
     * 保存
     */
    async save(flag) {
      try {
        const { id } = this.info
        if (flag) {
          await updateScan(id, {
            diagnosisValue: this.$refs.diagnosisDialogRef.get_diagnosisValue(),
            suggestion1: this.$refs.diagnosisDialogRef.suggestion1,
            diagnosis_info: this.$refs.diagnosisDialogRef.diagnosis_info,
            report_bbox_array: this.reportList
          })
          this.$message.success('已保存！')
        }
        else {
          await updateScan(id, {
            diagnosisValue: this.$refs.diagnosisDialogRef.get_diagnosisValue(),
            suggestion1: this.$refs.diagnosisDialogRef.suggestion1,
            diagnosis_info: this.$refs.diagnosisDialogRef.diagnosis_info
          })
        }
      } catch (e) {
        this.$message.error('保存失败，请稍后重试！')
      }
    },
    base64ImgtoFile(dataurl, filename = 'file') {
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let suffix = mime.split('/')[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
      })
    },
    async checkCompletion() {
      let reportValidFlag = this.$refs.diagnosisDialogRef.reportValidation()
      let reportImageValid = this.viewpoints && this.viewpoints[0] && this.viewpoints[1]
      if (reportImageValid && reportValidFlag) {
        this.submitAndReport()
      } else {
        // change tab
        this.activeKey = '1'
        this.tabName = 'report-diagnose'
        if (!reportImageValid) {
          // pop msg
          alert('请先获取报告截图，再次点击提交报告。')
          await this.loadReportImage()
        } else {
          // pop msg
          alert('诊断报告不完整：请检查勾选项并填写诊断意见与建议。')
        }
      }
    },

    /**
     * 提交复审并生成报告
     */
    async submitAndReport() {
      try {
        const { id, status } = this.info

        let username = JSON.parse(localStorage.getItem("pro__USER")).value.username
        let data = {
          diagnosisValue: this.$refs.diagnosisDialogRef.get_diagnosisValue(),
          suggestion1: this.$refs.diagnosisDialogRef.suggestion1,
          diagnosis_info: this.$refs.diagnosisDialogRef.diagnosis_info,
          report_bbox_array: this.reportList
        }

        let now = moment().toISOString(true)
        if (this.report_process === 'one_level') {
          // 一级审核
          data['status'] = 'approved'
          data['author'] = username
          data['authoring_date'] = now
          data['approver'] = username
          data['approving_date'] = now
        } else {
          // 二级审核
          if (status === 'authoring') {
            // 初审
            data['status'] = 'authored'
            data['author'] = username
            data['authoring_date'] = now
            data['approver'] = null
            let approving_date = null
          } else {
            // 复审
            data['status'] = 'authored'
            data['approver'] = username
            data['approving_date'] = now
          }
        }
        // update scan
        await updateScan(id, data)
        // 提交报告, 保存图片
        const formData = new FormData()
        formData.append('file_1', this.base64ImgtoFile(this.viewpoints[0]))
        formData.append('file_2', this.base64ImgtoFile(this.viewpoints[1]))
        formData.append('status', data['status'])
        let submit_res = await submitReport(id, formData)
        console.info('submit_report_res:', submit_res)
    
        this.$router.push({ name: 'Diagnose' })
        this.$message.success('已提交！')
      } catch (e) {
        console.error('submit_report_error:', e)
        this.$message.error('提交失败，请稍后重试！')
      }
    },
    /**
     * 返回列表
     */
    async returnToList() {
      try {
        let { id, status, author, approver } = this.info
        const statusMapping = new Map([
          ['authoring', 'predicted'],
          ['approving', 'authored']
        ])
        if (status === 'authoring') { author = '#' }
        else { approver = '#' }
        await updateScan(id, {
          diagnosisValue: this.$refs.diagnosisDialogRef.get_diagnosisValue(),
          suggestion1: this.$refs.diagnosisDialogRef.suggestion1,
          diagnosis_info: this.$refs.diagnosisDialogRef.diagnosis_info,
          report_bbox_array: this.reportList,
          status: statusMapping.get(status) || status,
          author: author,
          approver: approver,
          occupied_by: null
        })
        this.$router.push({ name: 'Diagnose' })
        // this.$message.success('已提交！')
      } catch (e) {
        // console.error(e)
        this.$message.error('提交失败，请稍后重试！')
      }
    },
    /**
     * 选区提交
     */
    async handleSelectSubmit({ radioValue }) {
      const HEIGHT = 54720
      const WIDTH = 54720
      const { x, y, width, height } = this.rect
      const className = ClassNameMapping.get(radioValue)
      const center = {
        centerx: +((x + width / 2) / WIDTH).toFixed(5),
        centery: +((y + height / 2) / HEIGHT).toFixed(5),
        width: +(width / WIDTH).toFixed(5),
        height: +(height / HEIGHT).toFixed(5),
        label: className
      }
      const sourceConfigs = {
        LSIL: ['ASCUS', 'LSIL'],
        HSIL: ['ASC-H', 'HSIL', 'SCC'],
        AGC: ['AGC-NOS', 'AGC-FN', 'AIS', 'ADCA'],
        micro: ['parasite', 'fungal', 'actinomyces', 'herpes', 'indicators', 'endometrial'],
        other: ['OTHER']
      }

      const arrayConfigs = {
        "l_bbox_array": ['ASCUS', 'LSIL'],
        "h_bbox_array": ['ASC-H', 'HSIL', 'SCC'],
        "agc_bbox_array": ['AGC-NOS', 'AGC-FN', 'AIS', 'ADCA'],
        "microbe_bbox_array": ['parasite', 'fungal', 'actinomyces', 'herpes', 'indicators', 'endometrial'],
        "other": ['OTHER']
      }

      // 切片类型
      let [classification] = Object.entries(sourceConfigs).find(([key, value]) => value.includes(className))
      let [arrayupdate] = Object.entries(arrayConfigs).find(([key, value]) => value.includes(className))

      // 如果找寻不到匹配类型，则退出
      if (!classification) return


      try {
        // 如果添加的类型与当前类型相同，添加矩形选框
        if (true) { //(sourceConfigs[this.sectionType].includes(className)) {
          const { centerx, centery, width, height } = center
          const element = document.createElement('div')
          Object.assign(element.style, {
            width: `${width}px`,
            height: `${height}px`,
            border: `2px solid ${TypeColorMapping.get(classification)}`
          })
          this.selectionBoxes.push(element)
          const location = new Openseadragon.Rect(centerx - width / 2, centery - height / 2, width, height, Openseadragon.Placement.CENTER)
          this.viewer.addOverlay({ element, location })

          // 移动至中心，导出图片
          const bbox_slide = {
            pixel_edge_total: 54720,
            pixel_edge_image: 1024,
            width: width,
            height: height,
            centerx: centerx,
            centery: centery
          }
          const bbox = {
            focus_folder: "focus0",
            image_level: "0",
            label: className,
            bbox_slide: bbox_slide
          }
          const opt = {
            array: arrayupdate,
            position: 0,
            bbox: bbox
          }
          // 更新匹配的资源数组

          await addBbox(this.info.id, opt)
            .then(res => {
              let scanFolder = this.info.scan_folder
              const imageSource = `../../../../static/exam/${scanFolder}/detection/` + res.bbox.file_focus0
              this.sections.source[this.sectionTypesMapping.get(classification)].unshift(res.bbox)
              this.sections.image[this.sectionTypesMapping.get(classification)].unshift({ type: 'source', source: imageSource })
            })
        }
        this.$message.success('已添加！')
      } catch (e) {
        this.$message.error('添加失败！')
      }
      // 关闭模态框
      this.$refs.model.close()
    },
    async deleteBboxAll(sectionType) {
      let del_pos = (this.page - 1) * this.pageSize + this.currentIndex - 1
      this.sections.source[this.sectionTypesMapping.get(sectionType)] = []
      this.sections.image[this.sectionTypesMapping.get(sectionType)] = []
      this.info.detection_info.bbox_info.l_bbox_array = this.sections.source['LSILList']
      this.info.detection_info.bbox_info.h_bbox_array = this.sections.source['HSILList']
      this.info.detection_info.bbox_info.agc_bbox_array = this.sections.source['AGCList']
      this.info.detection_info.bbox_info.microbe_bbox_array = this.sections.source['microList']
      this.info.detection_info.bbox_info.bbox_array = this.sections.source['TOPList']
      if (sectionType === 'micro') {
        this.info.micro_flag = false
      }
      await updateScan(this.info.id, {
        detection_info: this.info.detection_info,
        micro_flag: this.info.micro_flag
      })
      this.previousPage()
      let totalCount = this.sections.source[this.sectionTypesMapping.get(sectionType)].length
      this.totalPage = Math.ceil(totalCount / this.pageSize)
      this.sleep(10).then(() => {
        this.nextPage()
      })
    },
    async deleteBbox(sectionType) {
      let del_pos = (this.page - 1) * this.pageSize + this.currentIndex - 1
      this.sections.source[this.sectionTypesMapping.get(sectionType)].splice(del_pos, 1)
      this.sections.image[this.sectionTypesMapping.get(sectionType)].splice(del_pos, 1)
      this.info.detection_info.bbox_info.l_bbox_array = this.sections.source['LSILList']
      this.info.detection_info.bbox_info.h_bbox_array = this.sections.source['HSILList']
      this.info.detection_info.bbox_info.agc_bbox_array = this.sections.source['AGCList']
      this.info.detection_info.bbox_info.microbe_bbox_array = this.sections.source['microList']
      this.info.detection_info.bbox_info.bbox_array = this.sections.source['TOPList']
      await updateScan(this.info.id, {
        detection_info: this.info.detection_info
      })
      if (this.totalPage > 1) {
        this.previousPage()
        let totalCount = this.sections.source[this.sectionTypesMapping.get(sectionType)].length
        this.totalPage = Math.ceil(totalCount / this.pageSize)
        this.sleep(10).then(() => {
          this.nextPage()
        })
      }
      else {
        this.previousPage()
      }

    },
    async setPositiveBbox(index) {
      let bbox = this.sections.source[this.sectionTypesMapping.get(this.sectionTypeCache)][index]
      if (bbox['positive']) { bbox['positive'] = !bbox['positive'] }
      else { bbox['positive'] = true }
      if (bbox['negative']) { bbox['negative'] = false }
      this.info.detection_info.bbox_info.l_bbox_array = this.sections.source['LSILList']
      this.info.detection_info.bbox_info.h_bbox_array = this.sections.source['HSILList']
      this.info.detection_info.bbox_info.agc_bbox_array = this.sections.source['AGCList']
      this.info.detection_info.bbox_info.microbe_bbox_array = this.sections.source['microList']
      this.info.detection_info.bbox_info.bbox_array = this.sections.source['TOPList']
      await updateScan(this.info.id, {
        detection_info: this.info.detection_info
      })
      const { params, query: { sectionType, page } } = this.$route
      this.$router.push({
        name: 'Review',
        params,
        query: {
          id: this.info.id,
          sectionType,
          page: page,
          index: index + 1
        }
      })
    },
    async setNegativeBbox(index) {
      let bbox = this.sections.source[this.sectionTypesMapping.get(this.sectionTypeCache)][index]
      if (bbox['negative']) { bbox['negative'] = !bbox['negative'] }
      else { bbox['negative'] = true }
      if (bbox['positive']) { bbox['positive'] = false }
      this.info.detection_info.bbox_info.l_bbox_array = this.sections.source['LSILList']
      this.info.detection_info.bbox_info.h_bbox_array = this.sections.source['HSILList']
      this.info.detection_info.bbox_info.agc_bbox_array = this.sections.source['AGCList']
      this.info.detection_info.bbox_info.microbe_bbox_array = this.sections.source['microList']
      this.info.detection_info.bbox_info.bbox_array = this.sections.source['TOPList']
      await updateScan(this.info.id, {
        detection_info: this.info.detection_info
      })
      const { params, query: { sectionType, page } } = this.$route
      this.$router.push({
        name: 'Review',
        params,
        query: {
          id: this.info.id,
          sectionType,
          page: page,
          index: index + 1
        }
      })
    },
    annotation_display(index) {
      const source = _.cloneDeep(this.sectionSourceList)[index]
      if (source) {
        return source.positive ? '+' : source.negative ? '-' : ''
      }
      else {
        return ''
      }
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    /**
     * 镜下阅片控制
     */
    enableReviewEquipment() {
      if (this.isMicroscope) {
        this.microscopeButtonState = !this.microscopeButtonState
        if (this.microscopeButtonState) {
          this.$message({
            type: 'success',
            message: '镜下阅片开启'
          })
          let t = this.viewer;
          this.recentCenterx = t.viewport.getBounds().x + t.viewport.getBounds().width / 2;
          this.recentCentery = t.viewport.getBounds().y + t.viewport.getBounds().height / 2;
        }
        else {
          this.$message({
            type: 'info',
            message: '镜下阅片关闭'
          })
          this.closereviewmachine()
        }
      }
    },
    /**
     * 镜下阅片随动
     */
    equipmentMove(event) {
      if (this.microscopeButtonState) {
        let t = this.viewer;
        let centerx = t.viewport.getBounds().x + t.viewport.getBounds().width / 2;
        let centery = t.viewport.getBounds().y + t.viewport.getBounds().height / 2;
        if (centerx != this.recentCenterx | centery != this.recentCentery) {
          let x_init = null
          let y_init = null
          if (this.info.scan_log) {
            x_init = this.info.scan_log.x_init
            y_init = this.info.scan_log.y_init
          }
          let opt = {
            x_init: x_init,
            y_init: y_init,
            x_pixel_idx: parseInt((1 - centerx) * 54720 + this.offsetX),
            y_pixel_idx: parseInt((1 - centery) * 54720 + this.offsetY),
            specimen_id: this.info.specimen_id
          }
          this.movemachine(opt)
          this.recentCenterx = centerx
          this.recentCentery = centery
        }
      }
    },
    movemachine(opt) {
      moveReviewMachine(opt)
        .then(res => {
          console.log(res)
        })
        .catch(function (error) {
          let res_status;
          if (error.response) {
            res_status = error.response.status;
            if (res_status == 200) {
              this.$message({
                type: 'success',
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
    closereviewmachine() {
      if (this.isMicroscope) {
        let opt = {
          specimen_id: this.info.specimen_id,
          close: true
        }
        closeReviewMachine(opt)
          .then(res => {
            console.log(res)
          })
          .catch(function (error) { })
      }
    },
    measureButtonHandleClick() {
      this.measureButtonState = !this.measureButtonState
      this.isMaskDisplay = this.measureButtonState
      if (this.measureButtonState) {
        var options = {};
        options['xOffset'] = 400;
        options['yOffset'] = 400;
        this.viewer.scalebar(options);
        this.clearAll()
        this.plotMask()
      }
      else {
        var options = {};
        options['xOffset'] = this.scalebarOffsetx;
        options['yOffset'] = this.scalebarOffsety;
        this.viewer.scalebar(options);
        this.hideCursor = true
        this.maskEnable = false
        this.annotationEnable = false
        this.annoataionInit = false
      }
    },
    getAsCanvas() {
      var canvasContainer = document.getElementById("canvasContainer");
      while (canvasContainer.firstChild) {
        canvasContainer.removeChild(canvasContainer.firstChild);
      }
      var canvas = this.viewer.scalebarInstance.getAsCanvas();
      canvasContainer.appendChild(canvas);
    },

    // drawing segment
    activeDraw(num) {
      this.drawType = num
      if (num == 1 | num == 2 | num == 3) {
        this.hideCursor = true
        this.maskEnable = false
        this.annotationEnable = true
      }
      else if (num == 4) {
        this.hideCursor = false
        this.maskEnable = true
        this.annotationEnable = false
      }
      else {
        this.hideCursor = true
        this.maskEnable = false
        this.annotationEnable = false
        this.drawType = 0
        this.clearAll()
        this.deleteMaskAnnotation()
      }
    },

    // zoom segment
    activeZoom(num) {
      this.zoomType = num
      this.viewer.viewport.zoomTo(this.zoomType / this.zoomRatio)
    },

    fixWindow() {
      let review_window_width = document.getElementById("viewer").offsetWidth
      if (review_window_width > 0) {
        let zoomCurrent = this.viewer.viewport.getZoom('current')
        if (review_window_width < this.review_window_width) {
          this.viewer.viewport.zoomTo(zoomCurrent * this.review_window_width / review_window_width)
        }
        this.review_window_width = review_window_width
      }
    },

    // 鼠标监听
    moveCursor(e) {
      this.xChild = e.clientX;
      this.yChild = e.clientY;
      setTimeout(() => {
        this.xParent = e.clientX - 15;
        this.yParent = e.clientY - 15;
      }, 100);
    },

    trackmove(event) {
      if (this.annotationEnable & this.annoataionInit) {
        // The canvas-click event gives us a position in web coordinates.
        var webPoint = event.position;
        // Convert that to viewport coordinates, the lingua franca of OpenSeadragon coordinates.
        var viewportPoint = this.viewer.viewport.pointFromPixel(webPoint);
        // Convert from viewport coordinates to image coordinates.
        var imagePoint = this.viewer.viewport.viewportToImageCoordinates(viewportPoint);
        // Crop Openseadragon image,parseInt(imagePoint.y),,parseInt(this.scale_circleSize)
        let x = parseInt(imagePoint.x)
        let y = parseInt(imagePoint.y)
        this.annotation_svgOverlay.node().lastChild.remove()
        let mark_size = 1 / 54720
        if (this.drawType == 1) {
          this.d3Annotation = d3.select(this.annotation_svgOverlay.node()).append('line')
            .attr('x1', this.start_point.x * mark_size)
            .attr('y1', this.start_point.y * mark_size)
            .attr('x2', x * mark_size)
            .attr('y2', y * mark_size)
            .attr('stroke', "rgba(0,255,0,0.9)")
            .attr('stroke-width', mark_size * 3)
        }
        else if (this.drawType == 2) {
          this.d3Annotation = d3.select(this.annotation_svgOverlay.node()).append("rect")
            .style('fill', 'rgba(0,225,0,0.1)')
            .attr("x", this.start_point.x * mark_size)
            .attr("width", Math.abs(this.start_point.x - x) * mark_size)
            .attr("y", this.start_point.y * mark_size)
            .attr("height", Math.abs(this.start_point.y - y) * mark_size);
        }
        else if (this.drawType == 3) {
          this.d3Annotation = d3.select(this.annotation_svgOverlay.node()).append("ellipse")
            .style('fill', 'rgba(0,225,0,0.1)')
            .attr("cx", (this.start_point.x + x) * mark_size / 2)
            .attr("rx", Math.abs(this.start_point.x - x) * mark_size / 2)
            .attr("cy", (this.start_point.y + y) * mark_size / 2)
            .attr("ry", Math.abs(this.start_point.y - y) * mark_size / 2);
        }
      }
    },

    // 键盘监听
    enterKey(event) {
      if (this.maskEnable) {
        const code = event.keyCode
          ? event.keyCode
          : event.which
            ? event.which
            : event.charCode;
        if (true) {
          if (code == 49) { this.point_dec(); } // key '1'
          if (code == 50) { this.point_inc(); } // key '2'
          if (code == 51) { this.circle_dec(); } // key '3'
          if (code == 52) { this.circle_inc(); } // key '4'
          if (code == 32) { this.returnToLast(); }  // key 'space'
          if (code == 13) { this.addMask(); }  // key 'enter'
        }
      }
      if (this.isShowReportList) {
        const global_code = event.keyCode
          ? event.keyCode
          : event.which
            ? event.which
            : event.charCode;
        if (event.ctrlKey == true) {
          if (global_code == 46) { this.deleteBboxAll(this.sectionTypeCache) } // ctrl + key 'delete'
        }
        else {
          if (global_code == 46) { this.deleteBbox(this.sectionTypeCache); } // key 'delete'
        }
        // if(global_code == 65) { this.setPositiveBbox(this.sectionTypeCache);}     
        // if(global_code == 83) { this.setNegativeBbox(this.sectionTypeCache);} 
      }
    },
    enterKeyupDestroyed() {
      document.removeEventListener("keydown", this.enterKey);
    },
    enterKeyup() {
      document.addEventListener("keydown", this.enterKey);
    },
    point_dec() {
      this.pointSize = this.pointSize - 2
      if (this.pointSize < 4) { this.pointSize = 4 }
    },
    point_inc() {
      this.pointSize = this.pointSize + 2
      if (this.pointSize > this.circleSize) { this.pointSize = this.circleSize }
    },
    circle_dec() {
      this.circleSize = this.circleSize - 2
      if (this.circleSize < this.pointSize) { this.circleSize = this.pointSize }
    },
    circle_inc() {
      this.circleSize = this.circleSize + 2
      if (this.circleSize > 256) { this.pointSize = 256 }
    },
    trackScale() {
      let scale = this.viewer.viewport.getZoom()
      this.circleSize = this.circleSize * scale / this.init_scale
      this.pointSize = this.pointSize * scale / this.init_scale
    },
    async grabcut(event) {
      if (this.maskEnable) {
        // The canvas-click event gives us a position in web coordinates.
        var webPoint = event.position;
        // Convert that to viewport coordinates, the lingua franca of OpenSeadragon coordinates.
        var viewportPoint = this.viewer.viewport.pointFromPixel(webPoint);

        // Convert from viewport coordinates to image coordinates.
        var imagePoint = this.viewer.viewport.viewportToImageCoordinates(viewportPoint);

        //let scale=this.viewer.viewport.getZoom()
        var pixel_scale = this.review_window_height / this.viewer.viewport.getBounds().height / 54720
        this.scale_circleSize = parseInt(this.circleSize / pixel_scale / 2)
        this.scale_pointSize = parseInt(this.pointSize / pixel_scale / 2)

        // Crop Openseadragon image,parseInt(imagePoint.y),,parseInt(this.scale_circleSize)
        let x1 = parseInt(imagePoint.x)
        let y1 = parseInt(imagePoint.y)
        let width = parseInt(this.scale_circleSize * 2)
        let height = parseInt(this.scale_circleSize * 2)


        var img = ''
        const { canvas } = this.viewer.drawer;
        let source = canvas.toDataURL();
        const img1 = new Image();
        img1.onload = () => {
          let croppedCanvas = document.createElement('canvas');
          let ctx = croppedCanvas.getContext('2d');
          croppedCanvas.width = width;
          croppedCanvas.height = height;

          const pixelDens = 1;
          const window_scale = canvas.height / this.review_window_height
          let select_x = (webPoint.x * window_scale - this.circleSize * window_scale / 2)
          let select_y = (webPoint.y * window_scale - this.circleSize * window_scale / 2)
          let select_w = this.circleSize * window_scale
          let select_h = this.circleSize * window_scale
          ctx.drawImage(img1, select_x, select_y, select_w, select_h, 0, 0, width, height);
          //ctx.rotate(90*3.1416/180)
          let croppedSrc = croppedCanvas.toDataURL();
          img = ctx.getImageData(0, 0, width, height).data
          let imgArr = []
          for (let i = 0; i < img.length; i += 4) {
            imgArr.push(img[i], img[i + 1], img[i + 2])
          }
          let opt = {
            image: imgArr,
            background_r: this.scale_circleSize,
            foreground_r: this.scale_pointSize
          }
          grabCut(opt)
            .then(res => {
              let mask = res.mask
              // Show the results 
              let start_x = x1 - this.scale_circleSize
              let start_y = y1 - this.scale_circleSize
              let svgNum = this.indexlist.length
              for (let i = 0; i < mask.length; i++) {
                for (let j = 0; j < mask.length; j++) {
                  if (mask[i][j] > 0) {
                    if (this.indexinfolist.map(item => item).indexOf((start_x + j) * 54720 + start_y + i) < 0) {
                      this.indexinfolist.push((start_x + j) * 54720 + start_y + i)
                      this.indexlist.push([start_x + j, start_y + i])
                    }
                  }
                }
              }
              let indexlist = this.indexlist
              this.svgList = this.svgList.concat(indexlist.length - svgNum)

              let mark_size = 1 / 54720
              for (let i = svgNum; i < indexlist.length; i++) {
                this.d3Mask = d3.select(this.svgOverlay.node()).append("rect")
                  .style('fill', 'rgba(225,225,0,0.5)')
                  .attr("x", indexlist[i][0] * mark_size)
                  .attr("width", mark_size)
                  .attr("y", indexlist[i][1] * mark_size)
                  .attr("height", mark_size);
              }
            })
        }
        img1.src = source;
      }
      if (this.annotationEnable) {
        // The canvas-click event gives us a position in web coordinates.
        var webPoint = event.position;
        // Convert that to viewport coordinates, the lingua franca of OpenSeadragon coordinates.
        var viewportPoint = this.viewer.viewport.pointFromPixel(webPoint);
        // Convert from viewport coordinates to image coordinates.
        var imagePoint = this.viewer.viewport.viewportToImageCoordinates(viewportPoint);
        // Crop Openseadragon image,parseInt(imagePoint.y),,parseInt(this.scale_circleSize)
        let x = parseInt(imagePoint.x)
        let y = parseInt(imagePoint.y)
        if (!this.annoataionInit) {
          this.annoataionInit = true
          this.start_point = { x: x, y: y }
          let mark_size = 1 / 54720
          this.d3Annotation = d3.select(this.annotation_svgOverlay.node()).append('line')
            .attr('x1', this.start_point.x * mark_size)
            .attr('y1', this.start_point.y * mark_size)
            .attr('x2', this.start_point.x * mark_size)
            .attr('y2', this.start_point.y * mark_size)
            .attr('stroke', "rgba(0,255,0,0.9)")
            .attr('stroke-width', mark_size * 3)
        }
        else {
          this.annoataionInit = false
          let mark_size = 1 / 54720
          let x1 = this.start_point.x
          let y1 = this.start_point.y
          let x2 = x
          let y2 = y
          let cx = (x2 + x1) / 2
          let cy = (y2 + y1) / 2
          let width = Math.abs(x2 - x1)
          let height = Math.abs(y2 - y1)
          this.annotation_svgOverlay.node().lastChild.remove()
          if (this.drawType === 1) {
            this.d3Annotation = d3.select(this.svgOverlay.node()).append('line')
              .attr('x1', x1 * mark_size)
              .attr('y1', y1 * mark_size)
              .attr('x2', x2 * mark_size)
              .attr('y2', y2 * mark_size)
              .attr('stroke', "rgba(0,255,0,0.9)")
              .attr('stroke-width', mark_size * 3)
            let newMeasure = {
              x1: x1 * mark_size,
              y1: y1 * mark_size,
              x2: x2 * mark_size,
              y2: y2 * mark_size,
              class: 'line',
              measure: (Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) * 0.24).toFixed(1)
            }
            this.measurement_array.unshift(newMeasure)
            this.addMaskAnnotation(newMeasure, 'line')
          }
          else if (this.drawType === 2) {
            this.d3Annotation = d3.select(this.svgOverlay.node()).append("rect")
              .style('fill', 'rgba(0,225,0,0.1)')
              .attr("x", x1 * mark_size)
              .attr("width", width * mark_size)
              .attr("y", y1 * mark_size)
              .attr("height", height * mark_size);
            let newMeasure = {
              x: x1 * mark_size,
              y: y1 * mark_size,
              width: width * mark_size,
              height: height * mark_size,
              class: 'rect',
              measure: [(width * 0.24).toFixed(1), (height * 0.24).toFixed(1)]
            }
            this.measurement_array.unshift(newMeasure)
            this.addMaskAnnotation(newMeasure, 'rect')
          }
          else if (this.drawType === 3) {
            this.d3Annotation = d3.select(this.svgOverlay.node()).append("ellipse")
              .style('fill', 'rgba(0,225,0,0.1)')
              .attr("cx", cx * mark_size)
              .attr("rx", width * mark_size / 2)
              .attr("cy", cy * mark_size)
              .attr("ry", height * mark_size / 2);
            let newMeasure = {
              cx: cx * mark_size,
              cy: cy * mark_size,
              rx: width * mark_size / 2,
              ry: height * mark_size / 2,
              class: 'ellipse',
              measure: [(width * 0.24).toFixed(1), (height * 0.24).toFixed(1)]
            }
            this.measurement_array.unshift(newMeasure)
            this.addMaskAnnotation(newMeasure, 'ellipse')
          }
          this.addAnnotation()
        }

      }
    },
    erasecut(event) {
      if (this.maskEnable) {
        var webPoint = event.position;
        // Convert that to viewport coordinates, the lingua franca of OpenSeadragon coordinates.
        var viewportPoint = this.viewer.viewport.pointFromPixel(webPoint);

        // Convert from viewport coordinates to image coordinates.
        var imagePoint = this.viewer.viewport.viewportToImageCoordinates(viewportPoint);

        //let scale=this.viewer.viewport.getZoom()
        var pixel_scale = this.review_window_height / this.viewer.viewport.getBounds().height / 54720
        this.scale_circleSize = parseInt(this.circleSize / pixel_scale / 2)

        // Crop Openseadragon image,parseInt(imagePoint.y),,parseInt(this.scale_circleSize)
        let x1 = parseInt(imagePoint.x)
        let y1 = parseInt(imagePoint.y)
        let radius = this.scale_circleSize
        let svgNum = this.indexlist.length
        for (let i = svgNum - 1; i > -1; i--) {
          if (((this.indexlist[i][0] - x1) * (this.indexlist[i][0] - x1) + (this.indexlist[i][1] - y1) * (this.indexlist[i][1] - y1)) < radius * radius) {
            this.indexlist.splice(i, 1)
            this.indexinfolist.splice(i, 1)
          }
        }
        d3.select(this.svgOverlay.node()).selectAll("*").remove()
        let mark_size = 1 / 54720
        for (let i = 0; i < this.indexlist.length; i++) {
          this.d3Mask = d3.select(this.svgOverlay.node()).append("rect")
            .style('fill', 'rgba(225,225,0,0.5)')
            .attr("x", this.indexlist[i][0] * mark_size)
            .attr("width", mark_size)
            .attr("y", this.indexlist[i][1] * mark_size)
            .attr("height", mark_size);
        }
        this.svgList = []
        this.svgList = this.svgList.concat(this.indexlist.length)
        if (this.isMaskDisplay) { this.plotMask() }
      }
    },
    returnToLast() {
      if (this.svgList.length > 0) {
        d3.select(this.svgOverlay.node()).selectAll("*").remove()
        let svgNum = this.indexlist.length
        let lastNum = this.svgList[this.svgList.length - 1]
        for (let i = svgNum - 1; i > -1; i--) {
          if (i > svgNum - lastNum - 1) {
            this.indexlist.splice(i, 1)
            this.indexinfolist.splice(i, 1)
          }
          else {
            let mark_size = 1 / 54720
            this.d3Mask = d3.select(this.svgOverlay.node()).append("rect")
              .style('fill', 'rgba(225,225,0,0.5)')
              .attr("x", this.indexlist[i][0] * mark_size)
              .attr("width", mark_size)
              .attr("y", this.indexlist[i][1] * mark_size)
              .attr("height", mark_size);
          }
        }
        this.svgList.splice(this.svgList.length - 1, 1)
        if (this.isMaskDisplay) { this.plotMask() }
      }
    },
    addMask() {
      if (this.indexlist.length > 0) {
        let x_list = this.indexlist.map((item) => { return item = item[0] })
        let y_list = this.indexlist.map((item) => { return item = item[1] })
        let x1 = Math.min.apply(Math, x_list);
        let x2 = Math.max.apply(Math, x_list);
        let y1 = Math.min.apply(Math, y_list);
        let y2 = Math.max.apply(Math, y_list);
        let mask = rle_encode(this.indexlist);
        let rect = {
          x: x1 - 1,
          y: y1 - 1,
          width: x2 + 1 - x1,
          height: y2 + 1 - y1,
          mask: mask,
          measure: parseInt(this.indexlist.length * 0.24 * 0.24)
        }
        this.changeMeasurement(rect)
        d3.select(this.svgOverlay.node()).selectAll("*").remove()
        this.indexlist = []
        this.indexinfolist = []
        this.svgList = []
      }
    },
    clearAll() {
      d3.select(this.svgOverlay.node()).selectAll("*").remove()
      this.indexlist = []
      this.indexinfolist = []
      this.svgList = []
    },
    displayMask() {
      this.isMaskDisplay = !this.isMaskDisplay
      if (this.isMaskDisplay) {
        this.plotMask()
      }
      else {
        d3.select(this.nucleusSvgOverlay.node()).selectAll("*").remove()
        this.clearAll()
      }
    },
    plotMask() {
      this.deleteMaskAnnotation()
      let mark_size = 1 / 54720
      for (let i = 0; i < this.measurement_array.length; i++) {
        if (this.measurement_array[i].class === 'line') {
          this.d3Annotation = d3.select(this.svgOverlay.node()).append('line')
            .attr('x1', this.measurement_array[i].x1)
            .attr('y1', this.measurement_array[i].y1)
            .attr('x2', this.measurement_array[i].x2)
            .attr('y2', this.measurement_array[i].y2)
            .attr('stroke', "rgba(0,255,0,0.9)")
            .attr('stroke-width', mark_size * 3)
          this.addMaskAnnotation(this.measurement_array[i], 'line')
        }
        else if (this.measurement_array[i].class === 'rect') {
          this.d3Annotation = d3.select(this.annotation_svgOverlay.node()).append("rect")
            .style('fill', 'rgba(0,225,0,0.1)')
            .attr("x", this.measurement_array[i].x)
            .attr("width", this.measurement_array[i].width)
            .attr("y", this.measurement_array[i].y)
            .attr("height", this.measurement_array[i].height);
          this.addMaskAnnotation(this.measurement_array[i], 'rect')
        }
        else if (this.measurement_array[i].class === 'ellipse') {
          this.d3Annotation = d3.select(this.annotation_svgOverlay.node()).append("ellipse")
            .style('fill', 'rgba(0,225,0,0.1)')
            .attr("cx", this.measurement_array[i].cx)
            .attr("rx", this.measurement_array[i].rx)
            .attr("cy", this.measurement_array[i].cy)
            .attr("ry", this.measurement_array[i].ry);
          this.addMaskAnnotation(this.measurement_array[i], 'ellipse')
        }
        else {
          if (this.measurement_array[i].mask) {
            let indexlist = rle_decode(this.measurement_array[i].mask)
            for (let i = 0; i < indexlist.length; i++) {
              this.d3Mask = d3.select(this.nucleusSvgOverlay.node()).append("rect")
                .style('fill', 'rgba(0,255,0,0.5)')
                .attr("x", indexlist[i][0] * mark_size)
                .attr("width", mark_size)
                .attr("y", indexlist[i][1] * mark_size)
                .attr("height", mark_size);
            }
            this.addMaskAnnotation(this.measurement_array[i], 'mask')
          }
        }
      }
    },
    /**
     * 添加选中区域
     */
    addMaskAnnotation(rect, type) {
      if (type === 'mask') {
        const element = document.createElement('div')
        let { centerx: centerX, centery: centerY, width, height } = rect
        Object.assign(element.style, {
          fontSize: '14px'
        })
        element.textContent = '面积 ' + rect.measure + ' um2'
        this.maskAnnotation.push(element)
        const location = new Openseadragon.Rect(centerX + width / 2, centerY - height / 2, 0.01, height, Openseadragon.Placement.CENTER)
        this.viewer.addOverlay({ element, location })
      }
      else if (type === 'line') {
        const element = document.createElement('div')
        let { x1, y1, x2, y2 } = rect
        Object.assign(element.style, {
          fontSize: '14px'
        })
        element.textContent = '长度 ' + rect.measure + ' um'
        this.maskAnnotation.push(element)
        const location = new Openseadragon.Rect(x2, (y1 + y2) / 2, 0.01, Math.abs(y2 - y1), Openseadragon.Placement.CENTER)
        this.viewer.addOverlay({ element, location })
      }
      else if (type === 'rect') {
        const element = document.createElement('div')
        let { x, y, width, height } = rect
        Object.assign(element.style, {
          fontSize: '14px'
        })
        element.textContent = '长 ' + rect.measure[0] + ' um, 高 ' + rect.measure[1] + ' um'
        this.maskAnnotation.push(element)
        const location = new Openseadragon.Rect(x, y + height, 0.01, height, Openseadragon.Placement.CENTER)
        this.viewer.addOverlay({ element, location })
      }
      else if (type === 'ellipse') {
        const element = document.createElement('div')
        let { cx, cy, rx, ry } = rect
        Object.assign(element.style, {
          fontSize: '14px'
        })
        element.textContent = '长 ' + rect.measure[0] + ' um, 高 ' + rect.measure[1] + ' um'
        this.maskAnnotation.push(element)
        const location = new Openseadragon.Rect(cx - rx, cy + ry, 0.01, ry * 2, Openseadragon.Placement.CENTER)
        this.viewer.addOverlay({ element, location })
      }
    },
    /**
     * 删除选中区域
     */
    deleteMaskAnnotation() {
      !_.isEmpty(this.maskAnnotation) && this.maskAnnotation.forEach(element => this.viewer.removeOverlay(element))
    },
    changeMeasurement(rect) {
      this.newRect = rect
      this.$refs.maskmodel.open()
    },
    async addMeasurement({ radioValue }) {
      let totalheight = 54720;
      let totalwidth = 54720;
      let newMeasure = {
        centerx: ((this.newRect.x + this.newRect.width / 2) / totalwidth).toFixed(5) * 1,
        centery: ((this.newRect.y + this.newRect.height / 2) / totalheight).toFixed(5) * 1,
        width: (this.newRect.width / totalwidth).toFixed(5) * 1,
        height: (this.newRect.height / totalheight).toFixed(5) * 1,
        class: filterClass(radioValue),
        mask: this.newRect.mask,
        measure: this.newRect.measure
      };
      this.measurement_array.unshift(newMeasure);
      await updateScan(this.info.id, {
        measurement_array: this.measurement_array
      })
      this.$refs.maskmodel.close()
      if (this.isMaskDisplay) { this.plotMask() }
    },
    async addAnnotation() {
      await updateScan(this.info.id, {
        measurement_array: this.measurement_array
      })
    },
    afterVisibleChange(val) {
      console.log('visible', val);
    },
    showDrawer() {
      this.drawer_visible = true;
    },
    onClose() {
      this.drawer_visible = false;
      this.gridparadrawer_visible = false;
    }
  },
  watch: {
    /**
     * 监听路由，切换缩放区域
     */
    '$route': {
      immediate: true,
      handler({ query: { sectionType, page, index } }) {
        if (this.page !== +page || this.sectionTypeCache !== sectionType) {
          this.page = +page
          this.sectionTypeCache = sectionType
          this.getPaginationImages()
        }
        this.zoomToArea(index)
      }
    },
    /**
     * 监听窗口变化
     */
    screenWidth(val) {
      this.screenWidth = val
    }
  },
  beforeDestroy() {
    this.viewer && this.viewer.destroy()
    this.helperViewer && this.helperViewer.destroy()
    this.enterKeyupDestroyed()
  }
}
</script>

<style scoped lang="scss">
@import "../../components/iconstyle.css";
@import "../../components/cursor-circle.scss";

.review {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  height: calc(100vh - 64px);
  width: 100vw;

  &__header {
    padding: 3px 4px 0;
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
      margin: 0 8px 0 0;
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
    width: 500px;
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
    padding: 4px;
  }

  &__wrap {
    width: 100%;
    height: 100%;

    /deep/ .ant-card-body {
      padding: 4px;
    }
  }

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
      left: 290px;
      z-index: 1;
      opacity: 1 !important;
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
    width: 510px;
    margin-left: 4px;

    &--full {
      width: 100%;
      margin: 0;
    }

    /deep/ .ant-card-body {
      padding: 4px;
    }
  }
}

.report-list {

  &__control {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
  }

  &__num {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    min-height: 32px;
    background: rgba(0, 0, 0, .12);
    border-radius: 4px;

    p {
      margin: 0;
    }
  }

  &__sections {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: center;
    align-content: flex-start;
    height: calc(100vh - 283px);
    box-sizing: border-box;
    margin-top: 8px;
    overflow-y: auto;
  }

  &__section {
    position: relative;
    width: 160px;
    height: 160px;
    margin: 0 0px 0px 0;
    cursor: pointer;

    a {
      display: block;
      width: 160px;
      height: 160px;
      cursor: pointer;
      border: 2px solid transparent;

      img {
        height: 100%;
        width: 100%;
      }

      p {
        position: absolute;
        top: 0;
        left: 4px;
        font-size: 13px;
        color: purple;
      }
    }

    &--active {
      border-color: #1890ff !important;
    }
  }
}

.report-diagnose {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  align-items: stretch;
  height: calc(100vh - 167px);

  /deep/ .ant-row.ant-form-item {
    margin: 0;
  }

  &__checkbox {
    height: 21px;

    label {
      flex: none;
      height: 21px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
      align-items: center;
      overflow: hidden;

      /deep/ span {
        flex: none;
      }

      /deep/ span.ant-checkbox {
        margin-top: 4px;
      }
    }
  }

  &__radio {
    height: 21px;

    /deep/ .ant-radio-group.ant-radio-group-outline.ant-radio-group-default {
      position: relative;
      top: -9px;
    }
  }

  &__form {
    height: 100%;
    overflow-y: auto;
  }

  &__viewpoint {
    flex: none;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 200px;
  }

  &__view {
    position: relative;

    img {
      width: 200px;
      height: 200px;
      max-height: 100%;
      max-width: 100%;
    }

    button {
      position: absolute;
      top: 0;
      right: -1px;
    }
  }
}

.diagnosis_block {
  height: 100%;
  overflow-x: auto;
  overflow-y: auto;
  white-space: nowrap;
}

#helper-viewer {
  height: 320px;
  width: 320px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0;
}
</style>
