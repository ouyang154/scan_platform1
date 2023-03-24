/* 标准化报告  Date: 2021/5/7 Time: 8:50 上午 */

<template>
  <a-spin :spinning="isLoading" class="report">

    <div class="report" v-if="patientInfo && hospital" ref="report">
      <div class="a4-end-wise" id="pdfDom" ref="a4">
        <el-row :gutter="10">
          <el-col :span="2">
            <img v-if="hospital_logo" :src="hospital_logo" style='margin:0;padding-right:0;height:100px;'/>
          </el-col>
          <el-col :span="hospital_logo?20:24">
            <div align="center" style="font-size:50px;"> {{ hospital.name }} <br>
              <div align="center" style="font-size:30px" >宫颈液基细胞学TBS计算机辅助分析报告</div>
            </div>
          </el-col>
        </el-row>
        <p align="right"><font size="4" >{{ '病理号：' }}{{ patientInfo.specimen_info.specimen_id }}</font></p>
        <hr style="border:2px solid black;width:100%;" >

        <a-row :gutter="10" class="section-title">
          <a-col :span="10">{{ '姓名: ' }}{{ patientInfo.specimen_info.name }}</a-col>
          <a-col :span="4">{{ '性别: ' }}{{ patientInfo.specimen_info.gender == 1 ? '男' :'女' }}</a-col>
          <a-col :span="4">{{ '年龄: ' }}{{ patientInfo.specimen_info.age }}</a-col>
          <a-col :span="6">{{ '门诊号: ' }}{{ patientInfo.specimen_info.outpatient_id }}</a-col>
          <br>
          <a-col :span="10">{{ '送检科室: ' }}{{ patientInfo.specimen_info.reference_department }}</a-col>
          <a-col :span="8">{{ '送检医生: ' }}{{ patientInfo.specimen_info.reference_doctor }}</a-col>
          <a-col :span="6">
            {{ '送检时间: ' }}<font size="3">{{ patientInfo.specimen_info.reference_date| date_format }}</font>
          </a-col>
          <br>
          <a-col :span="10">{{ '检查项目: ' }}{{patientInfo.specimen_info.examine_type}}</a-col>
          <a-col :span="12">{{ '临床诊断: ' }}{{patientInfo.specimen_info.clinical_diagnosis}}</a-col>
        </a-row>

        <hr style="border:2px solid black;width:100%;" >

        <!-- 标本满意度 -->
        <div style="border:none solid;width: 100%; height: 7%;">
          <div class="block" >
            <div class="section-title">{{ diagnosisValue.checkbox[0].properties.displayed_name }}:</div>
            <div style="text-indent: 2em" >
                <template v-for="(line,index) in diagnosisValue.checkbox[0].children" >
                  <div class="content">
                    <tr>
                      <td>{{check_box_text(line.properties)}}{{line.properties.displayed_name}}:</td>
                      <template v-for="(element,index) in line.children">
                        <td>{{' ' + check_box_text(element.properties)}} {{element.properties.displayed_name}}</td>
                      </template>
                    </tr>
                  </div>
                </template>
            </div>
          </div>
        </div>

        <!-- 诊断标准化模板 -->
        <div style="border:1px solid;width: 97%; height: 48%;margin: 13px;">
          <el-col :span="12">
            <div id="tableDiv1" style="width: 100%; height: 100%;padding: 18px;">
              <div class="block" >
                <!-- 微生物分析: -->
                <div class="section-title" >{{ diagnosisValue.checkbox[1].properties.displayed_name }}:</div>
                <div style="text-indent: 2em" class="content">
                    <template v-for="(line,index) in diagnosisValue.checkbox[1].children" >
                      <p>
                      <div style="line-height:6px">{{check_box_text(line.properties)}}{{line.properties.displayed_name}}</div>
                      </p>
                    </template>
                </div>
                <br>
                <!-- 鳞状上皮细胞分析: -->
                <div class="section-title">{{ diagnosisValue.checkbox[2].properties.displayed_name }}:</div>
                    <template v-for="(line,index) in diagnosisValue.checkbox[2].children" >
                      <div style="text-indent: 2em"  class="content">
                        {{check_box_text(line.properties)}}{{line.properties.displayed_name}}
                        <template v-for="(element,index) in line.children">
                          <div v-if="element.properties.disabled===false" style="text-indent: 4em">
                            {{check_box_text(element.properties)}}{{element.properties.displayed_name}}
                            <!-- 炎症分级: -->
                            <template v-if="element.children && !element.children[0].properties.disabled"> 
                              {{':'}}
                              <template v-for="(subele,index) in element.children">
                                {{'  '}}{{check_box_text(subele.properties)}}{{subele.properties.displayed_name}}
                              </template>
                            </template>
                            <!-- 炎症分级: -->
                          </div>
                        </template>
                      </div>
                    </template>
                <br>
                <!-- P16: -->
                <template v-if="diagnosisValue.checkbox[4].properties.disabled===false">
                  <div class="section-title" >{{ diagnosisValue.checkbox[4].properties.displayed_name }}:</div>
                  <div style="text-indent: 2em" >
                      <template v-for="(line,index) in diagnosisValue.checkbox[4].children" >
                        <div class="content">
                          {{check_box_text(line.properties)}}{{line.properties.displayed_name}}
                          <template v-for="(element,index) in line.children">
                            <div style="text-indent: 4em">{{check_box_text(element.properties)}}{{element.properties.displayed_name}}</div>
                          </template>
                        </div>
                      </template>
                  </div>
                </template>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div id="tableDiv2" style="width: 100%; height: 100%;padding: 18px;">
              <div class="block">
                <div class="section-title">{{ diagnosisValue.checkbox[3].properties.displayed_name }}:</div>
                    <template v-for="(line,index) in diagnosisValue.checkbox[3].children" >
                      <div style="text-indent: 2em" class="content">
                        {{check_box_text(line.properties)}}{{line.properties.displayed_name}}
                        <template v-for="(element,index) in line.children">
                          <div v-if="element.properties.disabled===false" class="content" style="text-indent: 4em">
                            {{check_box_text(element.properties)}}{{element.properties.displayed_name}}
                          </div>
                        </template>
                      </div>
                    </template>

                <!-- 截图 -->
                <div class="report__scan">
                  <!-- <img v-if="imageSource" :src="imageSource" alt=""/> -->
                  <img :src="imageFilePath" alt=""/>
                </div>
                <div style="text-align:center" class="content"> 放大倍数:10x10 染色:巴氏 </div>
              </div>
            </div>
          </el-col>
        </div>
        <!-- 诊断意见与建议 -->
        <div style="width: 100%; height: 13%;">
          <div class="section-title" >{{ diagnosisValue.conclusion.displayed_name }}:</div>
          <div class="content" style="text-indent: 2em" >
              <div v-for="line in diagnosisValue.conclusion.value.split('\n')">{{line}}</div>
              <div v-if="suggestion"> {{suggestion}} </div>
          </div>
        </div>

        <div class="section-title" >
          <a-col :span="8"> {{ '初诊医师: ' }}{{ diagnosisValue.show_print_name ? patientInfo.author : '' }} </a-col>
          <a-col :span="8"> {{ '复诊医师: ' }}{{ diagnosisValue.show_print_name ? patientInfo.approver  : '' }} </a-col>
          <a-col :span="8"> {{ '报告时间: ' }}{{ moment().format('YYYY-MM-DD HH:mm') }} </a-col>

          <a-col :span="24" >
            <hr style="border:2px solid black;width:100%;font-size: small;" >
            <p  style="font-size: small">
              本报告只对此标本负责,仅供临床医生参考<br>
              <template v-if="hospital && hospital.address && hospital.address.trim().length>1">地址：{{ hospital.address }}<br></template>
              此标本由江西晶铸生物科技有限公司细胞学扫描图像分析系统(JZ SCANNER Plus)辅助分析
            </p>
          </a-col>
        </div>
      </div>
    </div>

    <a-row v-if="false">
      <a-col :span="24" class="report__control">
        <a-button type="primary" @click="handleReturn">返回</a-button>
        <a-button type="primary" @click="handlePrintAsPDF">打印</a-button>
        <!-- <a-button type="primary" @click="handleSubmit" >提交</a-button> -->
      </a-col>
    </a-row>

    <div id="helper-viewer"></div> <!-- E 辅助视图对象 -->
  </a-spin>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import html2pdf from 'html2pdf.js'
// import Openseadragon from 'openseadragon'
// import QrCode from '@/assets/images/qrcode.jpg'
// import ReportNav from '@/assets/images/report_nav.jpg'
import { updateScan, getScanDetail } from '@/api/workspace'
// import imageCompress from '@/utils/imageCompress'
// import hospital_logo from '@/assets/images/hospital_logo.jpg'
// import axios from 'axios'
import printDOM from "print-dom"

const checked_form = [true, 'checked', "half_checked"]

export default {
  name: 'StandardReport',
  data () {
    return {
      isLoading: true,
      patientInfo: null,
      diagnosisValue: {}
      // cutViewer: '',
      // imageSource: null
    }
  },
  props: { 
    id: { type: String, default: '' },
    hospital:{ default:null},
    autoprint: {type: Boolean, default: false}
  },
  computed: {
    hospital_logo: function(){
      if(this.hospital){
        if(this.hospital.hospital_logo)
          return 'static/media/' + this.hospital.hospital_logo
        // else
        //   this.hospital_logo_loaded = true // no logo uploaded
      }
    },
    suggestion: function(){
      let result = null
      const diag = this.diagnosisValue
      if(diag && diag.conclusion.suggestion && diag.conclusion.suggestion.length > 0){
        result = diag.conclusion.suggestion[0].value.trim()
        if(result.length && !result.startsWith('建议')) {result = '建议' + result}
      }
      return result
    },
    imageFilePath: function(){
      if(this.patientInfo) return `static/exam/${this.patientInfo.scan_folder}/report/file_1`
    },
    reportFileBaseName: function() {
      const info = this.patientInfo.specimen_info
      return `${moment().format('YYYYMMDD')}-${info.name}-${info.age}-${info.specimen_id}`
    },
  },
  async mounted () {
    try {
      this.isLoading = true
      const [info] = await Promise.all([ getScanDetail(this.$route.params.id) ])
      this.patientInfo = info
      this.diagnosisValue = this.patientInfo.diagnosisValue
      document.title = this.reportFileBaseName
      // this.filter_diagnosis(this.diagnosisValue.checkbox )
      // const imagePath = 'exam/' + this.patientInfo.scan_folder + '/tile/focus0/'
      // const tileOptions = {
      //   height: 798 * 64,
      //   width: 855 * 64,
      //   tileSize: 1024,
      //   maxLevel: 0,
      //   getTileUrl: function (level, x, y) {
      //     function zeroPad (i) {
      //       let n = String(i)
      //       const m = 3 - n.length
      //       n = (m < 1) ? n : new Array(m + 1).join('0') + n
      //       return n
      //     }
      //     return '../../../../static/' + imagePath + (0 - level) + '/' + zeroPad(y) + 'x' + zeroPad(x) + '.jpg'
      //   }
      // }

      // this.$nextTick(() => {
      //   this.helperViewer = new Openseadragon({
      //     id: 'helper-viewer',
      //     tileSources: tileOptions,
      //     defaultZoomLevel: this.patientInfo.report_bbox_array[0].scale,
      //     minZoomLevel: this.patientInfo.report_bbox_array[0].scale,
      //     maxZoomLevel: this.patientInfo.report_bbox_array[0].scale,
      //     showNavigationControl: false,
      //     panHorizontal: false,
      //     panVertical: false,
      //     crossOriginPolicy: 'Anonymous'
      //   })

      //   const px2 = this.patientInfo.report_bbox_array[0].centerx
      //   const py2 = this.patientInfo.report_bbox_array[0].centery

      //   this.helperViewer.addHandler('open', async () => {
      //     this.helperViewer.viewport.panTo(new Openseadragon.Point(px2, py2), true)
      //     this.imageSource = await this.exportImageSource(this.helperViewer)
      //     if(this.autoprint) this.handlePrintAsImage()
      //   })
      // })

      this.$nextTick(this.handlePrintAsHtml)
    } catch (e) {
      this.$message.error('数据获取异常！')
      throw(e)
    } finally {
      this.isLoading = false
    }
  },
  methods: {
    moment,
    check_box_text: function(properties){
      return checked_form.indexOf(properties.value) < 0 ? '□  ' : '√  '
    },
    // filter_diagnosis(diag){},
    handleReturn: async function () {
      this.$router.push({ name: 'Print' })
    },
    handleSubmit: async function () {
      this.patientInfo.status = 'printed'
      // 提交的内容
      let reportData = Object.assign(_.cloneDeep(this.patientInfo), {
        diagnosisValue: { ...this.diagnosisValue }
      })

      await this.changeSuggestion(reportData)

      if(this.autoprint && window.opener)
      {
        window.opener.dispatchEvent(new CustomEvent('autoPrintDone', { detail: {} }));
        window.close()
      }
      else
      {
        this.$router.push({ name: 'Print' })
      }
    },
    async handlePrintAsPDF () {
      try {
        const opt = {
          margin: [12, 12],
          filename: `${this.reportFileBaseName}.pdf`,
          image: { type: 'jpeg', quality: 1 },
          html2canvas: {
            useCORS: true,
            allowTaint: true,
            taintTest: true,
            width: 1075,
            height: 1524,
            scrollY: -48,
            ignoreElements: (element) => [...element.classList].includes('report__control')
          },
          jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
        }
        const pdf = html2pdf().set(opt).from(this.$refs.report)
        const pdfSource = await pdf.output('datauristring')
        const page = window.open()
        page.document.open()
        page.document.write(`<iframe width='100%' height='100%' src='${pdfSource}'></iframe>`)
        page.document.close()
        // 自动保存状态、跳转页面
        this.handleSubmit()
      } catch (e) {
        this.$message.error('打印失败')
      }
    },
    async changeStatus (obj) {
      try {
        const parameter = Object.assign(
          _.pick(obj, ['id', 'status', 'author', 'approver', 'verifier']),
          { occupied_by: null }
          )
        await updateScan(obj.id, parameter)
      } catch (e) {
        this.$message('修改异常！')
      }
    },
    handlePrintAsHtml() {
      printDOM(this.$refs.a4, {documentTitle:`${this.patientInfo.specimen_info.specimen_id}`});
      this.handleSubmit()
    },
    async handlePrintAsImage() {
      try {
        const opt = {
          margin: [12, 12],
          filename: `${this.reportFileBaseName}.jpg`,
          image: { type: 'jpeg', quality: 1 },
          html2canvas: {
            useCORS: true,
            allowTaint: true,
            taintTest: true,
            width: 1075,
            height: 1524,
            scrollY: -48,
            ignoreElements: (element) => [...element.classList].includes('report__control')
          },
          jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
        }
        const pdf = html2pdf().set(opt).from(this.$refs.report)
        const imgSource = await pdf.outputImg('datauristring')
        const page = window.open('','_blank')
        page.document.open()
        page.document.write(`<img id='iframepdf' src='${imgSource}'/>`)
        page.document.close()
        page.onload = function () {page.print();page.close()}

        // 自动保存状态、跳转页面
        this.handleSubmit()
      } catch (e) {
        this.$message.error('打印失败')
      }
    },
    /**
     * 更新报告
     * @param obj
     */
    async changeSuggestion (obj) {
      try { // TODO 
        const parameter = Object.assign(
          _.pick(obj, ['id', 'status', 'author', 'approver', 'verifier', 'suggestion1', 'suggestion2']),
          { occupied_by: null }
        )
        await updateScan(obj.id, parameter)
      } catch (e) {
        this.$message('修改异常！')
      }
    },
    /**
    //  * 监测图片载入成功
    //  * @param tileImage
    //  * @returns {Promise<boolean>}
    //  */
    // imageLoaded (tileImage) {
    //   return new Promise((resolve, reject) => {
    //     let usedTime = 0
    //     const timer = setInterval(() => {
    //       usedTime += 200
    //       // 监测图片加载超出10秒后，则认为图片加载失败
    //       if (usedTime >= 10000) {
    //         reject(new Error('Images Loaded Timeout 10s'))
    //       }
    //       const loaded = tileImage.getFullyLoaded()
    //       if (loaded) {
    //         clearInterval(timer)
    //         resolve(true)
    //       }
    //     }, 200)
    //   })
    // },
    // /**
    //  * 导出图片资源
    //  * @param viewer
    //  */
    // async exportImageSource (viewer) {
    //   try {
    //     const tiledImageCount = viewer.world.getItemCount()
    //     const tiledImageLoaders = new Array(tiledImageCount).fill(0).map((_, index) => {
    //       const tileImage = viewer.world.getItemAt(index)
    //       return this.imageLoaded(tileImage)
    //     })
    //     const imagesLoadedStatus = await Promise.all(tiledImageLoaders)
    //     const imagesLoaded = imagesLoadedStatus.reduce((previousValue, currentValue) => previousValue && currentValue)
    //     if (imagesLoaded) {
    //       const imageSource = viewer.drawer.canvas.toDataURL('image/png')
    //       return await imageCompress(imageSource, { width: 640, height: 480 })
    //     }
    //   } catch (e) {
    //     return null
    //   }
    // }
  }//,
  // beforeDestroy () {
  //   this.cutViewer && this.cutViewer.destroy()
  //   this.helperViewer && this.helperViewer.destroy()
  // }
}
</script>

<style scoped lang="less">
.report {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  width: 1075px;
  margin: 16px auto 0 auto;
  margin-top: 0px;
  color: black;

  &__control {
    width: 1075px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    align-items: center;
    margin: 12px 0;

    button {
      margin-left: 12px;
    }
  }

  &__scan {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    margin-top: 12px;
    height: 300px;

    img {
      max-height: 100%;
      max-width: 100%;
    }
  }
}

.section-title{
  font-size: x-large;
}

.content{
  font-size: large;
}
/* 布局纵向 */
.a4-end-wise{
  width: 1075px;
  height: 1568px;
  padding-left: 38px;
  padding-right: 38px;
  // padding-top: 0%;
  // padding-bottom: 0%;
  background: white;
}
/* 布局横向 */
.a4-broad-wise{
  width: 1569px;
  height: 1075px;
  border: 1px white solid;
  background: white;
}

#helper-viewer {
  height: 360px;
  width: 360px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0;
}

</style>
