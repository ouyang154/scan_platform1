/**
* 报告
* Date: 2020/5/15
* Time: 12:50 上午
*/
<template>
  <a-spin :spinning="isLoading" class="report">
    <!-- S 报告二模板 -->
    <div class="report" v-if="patientInfo && hospital && reportType === 2" ref="report">
      <div class="a4-end-wise" ref="pageOne" id="page-one">
        <a-row :gutter="10">
          <br>
          <br>
          <a-col :span="24">
            <div>
              <p style="text-align: center;font-weight:600"><font size="6" >{{ hospital.name }}</font></p>
              <p style="text-align: center;font-weight:500"><font size="5" >液基细胞检测报告单</font></p>
              <br>
              <p style="text-align: right;font-weight:500"><font size="4" >{{ '申请号/报告号: ' }}{{ patientInfo.specimen_id }}</font></p>
              <hr style="width:100%;border:4;" >
            </div>
          </a-col>
          <a-col :span="24">
            <div>
              <p style="text-align: left;font-weight:500"><font size="4" >{{ '送检医院: ' }}{{ hospital.name }}</font></p>
              <hr style="width:100%;border:4;" >
            </div>
          </a-col>
          <a-col :span="12">
            <p><font size="3" >{{ '姓名: ' }} {{ patientInfo.specimen_info.name }}</font></p>
            <p><font size="3" >{{ '末次月经日期: ' }} {{ patientInfo.specimen_info.menses_date | date_format}}</font></p>
            <p><font size="3" >{{ '被检者联系方式: ' }}{{ patientInfo.specimen_info.patient_phone }}</font></p>
          </a-col>
          <a-col :span="4">
            <p><font size="3" >{{ "年龄: " }}{{ patientInfo.specimen_info.age }}</font></p>
            <p><font size="3" >{{ "绝经: " }}{{ patientInfo.specimen_info.menses | mensesFilter }}</font></p>
          </a-col>
          <a-col :span="8">
            <p><font size="3" >{{ "病例号: " }}{{ patientInfo.specimen_info.patient_id }}</font></p>
            <p><font size="3" >{{ '取样日期: ' }}{{ patientInfo.specimen_info.specimen_date  | date_format}}</font></p>
          </a-col>
          <a-col :span="24">
            <hr style="width:100%;border:4;" >
          </a-col>

          <a-col :span="12">
            <div style="width: 100%; height: 340px;">
              <div class="block">
                <div >
                  <p><font size="3" >{{ '标本满意度: ' }}{{ diagnosisValue.specimen_satisfication | satisfyFilter }}</font></p>
                  <p style="text-indent: 6.3em"><font size="3" >细胞量: {{ diagnosisValue.cell_count | radioCellFilter }}</font></p>
                  <p style="text-indent: 6.3em"><font size="3" >颈管细胞: {{ diagnosisValue.gland_cell ? '有' : '无' }}</font></p>
                  <p style="text-indent: 6.3em"><font size="3" >化生细胞: {{ diagnosisValue.metaplasia_cell ? '有' : '无' }}</font></p>
                  <br>
                </div>
                <div >
                  <p><font size="3" >病{{ '&nbsp;&nbsp;&nbsp;' }}原{{ '&nbsp;&nbsp;&nbsp;' }}体: 滴虫感染提示: {{ diagnosisValue.trichomonas_vaginalis ? '有' : '无' }}</font>
                  </p><p style="text-indent: 6.3em"><font size="3" >霉菌感染提示: {{ diagnosisValue.candida_albicans ? '有' : '无' }}</font></p>
                  <p style="text-indent: 6.3em"><font size="3" >疱疹感染提示: {{ diagnosisValue.herpes ? '有' : '无' }}</font></p>
                  <p style="text-indent: 6.3em"><font size="3" >HPV感染提示: {{ diagnosisValue.koilocyte ? '有' : '无' }}</font></p>
                  <br>
                  <br>
                </div>
                <div >
                  <p style="font-weight:500"><font size="3" >诊{{ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' }}断: {{ patientInfo.diagnosis_info }}</font>
                  </p>
                </div>
              </div>
            </div>
          </a-col>

          <a-col :span="12">
            <div style="width: 100%; height: 340px;">
              <div class="block">
                <p><font size="3" >镜下所见:</font></p>
                <div id="cut-area" style="margin-left: 50px;width: 80%; height: 300px; border: 2px solid #fff"></div>

              </div>
            </div>
          </a-col>
          <a-col :span="24">
            <p>
              <font size="3" >补充意见1:</font>
              <a-input v-model="suggestInput1" :placeholder="patientInfo.suggestion1" /></p>
            <br>
            <br>
            <br>
            <p>
              <font size="3" >补充意见2:</font>
              <a-input v-model="suggestInput2" :placeholder="patientInfo.suggestion2" /></p>
            <br>
            <br>
            <br>
          </a-col>
          <a-col :span="16">
            <p><font size="3" >报告医师签字: </font></p>
          </a-col>
          <a-col :span="8">
            <p><font size="3" >{{ '报告日期: ' }}{{ moment().format('YYYY-MM-DD') }} </font></p>
          </a-col>
          <a-col :span="24">
            <hr style="width:100%;border:4;" >
            <p><font size="2" >本报告只对此标本负责,仅供临床医生参考</font></p>
            <p><font size="2" >此标本由江西晶铸生物科技有限公司细胞学扫描图像分析系统(JZ SCANNER Plus)辅助分析</font></p>
          </a-col>
        </a-row>
      </div>
      <div>
        <a-row>
          <a-col :span="24" class="report__control">
            <a-button type="primary" @click="handleReturn">返回</a-button>
            <a-button type="primary" @click="handlePrint">打印</a-button>
            <!-- <a-button type="primary" @click="handleSubmit" >提交</a-button> -->
          </a-col>
        </a-row>
      </div>
      <div class="a4-end-wise" ref="pageTwo" id="page-two">
        <a-row :gutter="10">
          <br>
          <br>
          <a-col :span="24">
            <div>
              <p style="text-align: center;font-weight:600"><font size="6" >宫颈细胞学影像分析报告单</font></p>
              <br>
            </div>
          </a-col>

          <a-col :span="16">
            <p><font size="3" >{{ '玻片条码号: ' }} {{ patientInfo.specimen_id }}</font></p>
          </a-col>
          <a-col :span="8">
            <p><font size="3" >{{ '报告流水号: ' }}{{ '202109260003' }}</font></p>
          </a-col>
          <a-col :span="24">
            <hr style="width:100%;border:4;" >
            <p><font size="3" >{{ '系统名称: ' }} {{ '细胞学扫描图像分析系统' }}</font></p>
            <!-- <p><font size="3" >{{ '系统型号: ' }} {{ 'JZ SCANNER Plus' }}</font></p> -->
            <br>
            <p><font size="3" >{{ '影像分析结果: ' }} {{ gradeInfo }}</font></p>
            <p style="text-indent: 7.5em"><font size="3" >{{ gradeTips }}</font></p>

          </a-col>
          <a-col :span="12">

            <p><font size="3" >{{ '分析结果概要:&nbsp;&nbsp;&nbsp;标本质量: ' }}{{ diagnosisValue.specimen_satisfication | satisfyFilter }}</font></p>
            <p style="text-indent: 7.5em"><font size="3" >{{ '&nbsp;&nbsp;&nbsp;细胞数量: ' }}{{ patientInfo.nucleus_count }}</font></p>
            <p style="text-indent: 7.5em"><font size="3" >{{ '&nbsp;&nbsp;&nbsp;炎症程度: ' }}{{ diagnosisValue.inflammatory | inflammationFilter }}</font></p>
            <p style="text-indent: 7.5em"><font size="3" >{{ '&nbsp;&nbsp;&nbsp;菌群失调: ' }}{{ '无' }}</font></p>
            <p style="text-indent: 9.7em"><font size="3" >{{ '&nbsp;&nbsp;&nbsp;霉菌: ' }}{{ diagnosisValue.candida_albicans ? '有' : '无'}}</font></p>
          </a-col>

          <a-col :span="12">
            <p style="text-indent: 3.5em"><font size="3" >滴虫: {{ diagnosisValue.trichomonas_vaginalis ? '有' : '无' }}</font></p>
            <p ><font size="3" >{{ '内膜细胞: ' }}{{ diagnosisValue.gland_cell ? '有' : '无' }}</font></p>
            <p style="text-indent: 1em"><font size="3" >颈管细胞: {{ diagnosisValue.gland_cell ? '有' : '无' }}</font></p>
            <p style="text-indent: 1em" ><font size="3" >化生细胞: {{ diagnosisValue.metaplasia_cell ? '有' : '无' }}</font></p>
          </a-col>

          <a-col :span="24">
            <br>
            <p><font size="3" >{{ '制片质量&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;染色情况: ' }}{{ '正常' }}</font></p>
            <p style="text-indent: 7.7em"><font size="3" >{{ '细胞数量: ' }}{{ '正常' }}</font></p>
            <p style="text-indent: 7.7em"><font size="3" >{{ '细胞聚集: ' }}{{ '正常' }}</font></p>
            <br>
          </a-col>

          <a-col :span="24">
            <p><font size="3" >{{ '背景识别&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;萎缩背景: ' }}{{ '否' }}</font></p>
            <p style="text-indent: 7.7em"><font size="3" >{{ ' 炎性背景: ' }}{{ '是' }}</font></p>
            <p style="text-indent: 7.7em"><font size="3" >{{ ' 血性背景: ' }}{{ '否' }}</font></p>
            <p style="text-indent: 7.7em"><font size="3" >{{ ' 癌性背景: ' }}{{ '否' }}</font></p>            
            <br>
          </a-col>


          <a-col :span="24">
            <p><font size="3" >{{ '可疑细胞圈选: ' }}</font></p>
            <div class="canvas">
              <canvas id="specimen-area" width="700" height="200" style="width:700px;height:200px;"></canvas>
            </div>

            <br>
            <br>
            <br>
          </a-col>
          <a-col :span="16">
            <p><font size="3" >操作人员签字: </font></p>
          </a-col>
          <a-col :span="8">
            <p><font size="3" >{{ '机检分析时间: ' }}{{ '2021-09-26 17:31' }} </font></p>
          </a-col>
          <a-col :span="24">
            <hr style="width:100%;border:4;" >
            <p><font size="2" >本报告为机检结果,可用于阅片辅助,分析结果仅供临床医生参考,不作为诊断依据。</font></p>
          </a-col>
        </a-row>
      </div>
    </div>
    <!-- E 报告二模板 -->

    <!-- S 辅助视图对象 -->
    <div id="helper-viewer"></div>
    <!-- E 辅助视图对象 -->

  </a-spin>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import html2pdf from 'html2pdf.js'
import Openseadragon from 'openseadragon'
import OSS from '@/utils/oss'
import QrCode from '@/assets/images/qrcode.jpg'
import ReportNav from '@/assets/images/report_nav.jpg'
import { getHospitals, updateScan, getScanDetail } from '@/api/workspace'
import imageCompress from '@/utils/imageCompress'

export default {
  name: 'SimpleReport',
  data () {
    return {
      dateFormat: 'YYYY-MM-DD',
      reportNav: ReportNav,
      isLoading: true,
      patientInfo: null,
      hospital: null,
      diagnosisValue: {
        radioSatisfy: '1',
        checkListMicroorganism: [],
        checkASC: false,
        radioASC: '1',
        checkLSIL: false,
        checkHSIL: false,
        checkCIS: false
      },
      suggestInput0: '',
      suggestInput1: '',
      suggestInput2: '',
      cutViewer: '',
      form: {
        radioProcess: null,
        radioSatisfy: null,
        radioCell: null,
        radioNormal: null,
        checkListMicroorganism: null,
        checkYanzheng: null,
        radioYanzheng: null,
        checkErythrocytes: null,
        checkEndocervical: null,
        checkMetaplastic: null,
        checkXray: null,
        checkPregnant: null,
        checkIUO: null,
        checkAtrophy: null,
        checkAtypicalRepairCell: null,
        checkTypeOther: null,
        checkASC: null,
        radioASC: null,
        checkLSIL: null,
        checkHSIL: null,
        checkCIS: null,
        checkXianxibao: null,
        radioXianxibao: null,
        checkZigongjingASC: null,
        checkZigongjing: null,
        radioZigongjing: null,
        suggestion1: null
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      reportType: 0,
      imageSource: null
    }
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  computed: {
    // 级别信息
    gradeInfo () {
      return (this.patientInfo.AIgrade === 'I') ? this.patientInfo.AIgrade + '级' : this.patientInfo.AIgrade + '级 (全阅片)'
    },
    // 级别提示
    gradeTips () {
      return (this.patientInfo.AIgrade === 'I') ? '' : this.patientInfo.AIgrade + '级需要医生进行镜下阅片,影像分析系统可为医生提供可疑点导航定位'
    },
    reportFileBaseName: function() {
      const info = this.patientInfo.specimen_info
      return `${moment().format('YYYYMMDD')}-${info.name}-${info.age}-${info.specimen_id}`
    },
  },
  async mounted () {
    try {
      this.isLoading = true
      const [info, [hospital]] = await Promise.all([
        getScanDetail(this.$route.params.id),
        getHospitals()
      ])
      this.patientInfo = info
      this.form = info.diagnosisValue
      this.suggestInput0 = info.suggestion1
      this.diagnosisValue = this.patientInfo.diagnosisValue
      this.hospital = hospital
      const { report_model: reportModel } = hospital
      this.reportType = +reportModel

      const imagePath = 'exam/' + this.patientInfo.scan_folder + '/tile/focus0/'

      const tileOptions = {
        height: 798 * 64,
        width: 855 * 64,
        tileSize: 1024,
        maxLevel: 0,
        getTileUrl: function (level, x, y) {
          function zeroPad (i) {
            let n = String(i)
            const m = 3 - n.length
            n = (m < 1) ? n : new Array(m + 1).join('0') + n
            return n
          }
          const fn = '../../../../static/' + imagePath + (0 - level) + '/' + zeroPad(y) + 'x' + zeroPad(x) + '.jpg'
          // const fn = imagePath + (0 - level) + '/' + zeroPad(y) + 'x' + zeroPad(x) + '.jpg'
          return fn // OSS.instance.signatureUrl(fn)
        }
      }

      if (this.reportType === 1) {
        this.$nextTick(() => {
          this.helperViewer = new Openseadragon({
            id: 'helper-viewer',
            tileSources: tileOptions,
            defaultZoomLevel: this.patientInfo.report_bbox_array[0].scale,
            minZoomLevel: this.patientInfo.report_bbox_array[0].scale,
            maxZoomLevel: this.patientInfo.report_bbox_array[0].scale,
            showNavigationControl: false,
            panHorizontal: false,
            panVertical: false,
            crossOriginPolicy: 'Anonymous'
          })

          const px2 = this.patientInfo.report_bbox_array[0].centerx
          const py2 = this.patientInfo.report_bbox_array[0].centery

          this.helperViewer.addHandler('open', async () => {
            this.helperViewer.viewport.panTo(new Openseadragon.Point(px2, py2), true)
            this.imageSource = await this.exportImageSource(this.helperViewer)
          })
        })
      } else if (this.reportType === 2) {
        this.$nextTick(() => {
          this.cutViewer = new Openseadragon({
            id: 'cut-area',
            tileSources: tileOptions,
            defaultZoomLevel: this.patientInfo.report_bbox_array[0].scale,
            minZoomLevel: this.patientInfo.report_bbox_array[0].scale,
            maxZoomLevel: this.patientInfo.report_bbox_array[0].scale,
            showNavigationControl: false,
            panHorizontal: false,
            panVertical: false
          })
          const px2 = this.patientInfo.report_bbox_array[0].centerx
          const py2 = this.patientInfo.report_bbox_array[0].centery

          console.log(px2,py2)

          this.cutViewer.addHandler('open', () => {
            this.cutViewer.viewport.panTo(new Openseadragon.Point(px2, py2), true)
          })

          const c = document.getElementById('specimen-area')
          const ctx = c.getContext('2d')
          ctx.beginPath()
          ctx.strokeRect(100, 20, 500, 160)

          ctx.closePath()
          const imgObj = new Image()
          imgObj.src = QrCode
          let imgW = ''
          let imgH = ''

          imgObj.onload = function () {
            imgW = imgObj.width
            imgH = imgObj.height
            ctx.drawImage(this, 120, 40, 120, imgH * 120 / imgW)
          }

          // ctx.drawImage(imgObj,150,70,50,50);
          ctx.beginPath()
          ctx.arc(410, 100, 60, 0, 2 * Math.PI)

          ctx.stroke()
          ctx.closePath()
          let candidateLength = 10
          if (this.patientInfo.p_bbox_array.length < candidateLength) {
            candidateLength = this.patientInfo.p_bbox_array.length
          }
          if (candidateLength > 0) {
            for (let i = 0; i < candidateLength; i++) {
              const px = this.patientInfo.p_bbox_array[i].centerx
              const py = this.patientInfo.p_bbox_array[i].centery

              ctx.beginPath()
              ctx.arc(350 + 120 * px, 40 + 120 * py, 3, 0, 2 * Math.PI)
              ctx.stroke()
              ctx.closePath()
            }
          }
        })
      }
    } catch (e) {
      this.$message.error('数据获取异常！')
    } finally {
      this.isLoading = false
    }
  },
  methods: {
    moment,
    handleReturn: async function () {
      this.$router.push({ name: 'Print' })
    },
    handleSubmit: async function () {
      this.patientInfo.status = 'printed'
      // 提交的内容
      let reportData = {}

      if (this.reportType === 1) {
        reportData = Object.assign(_.cloneDeep(this.patientInfo), {
          diagnosisValue: { ...this.form },
          suggestion1: this.suggestInput0
        })
      } else if (this.reportType === 2) {
        if (this.suggestInput1.length > 0) { this.patientInfo.suggestion1 = this.suggestInput1 }
        if (this.suggestInput2.length > 0) { this.patientInfo.suggestion2 = this.suggestInput2 }
        reportData = _.cloneDeep(this.patientInfo)
      }

      await this.changeSuggestion(reportData)

      this.$router.push({ name: 'Print' })
    },
    async handlePrint () {
      try {
        const dom = this.$refs.report
        const opt = {
          margin: [12, 12],
          filename: `${this.reportFileBaseName}.pdf`,
          image: { type: 'jpeg', quality: 1 },
          html2canvas: {
            useCORS: true,
            allowTaint: true,
            taintTest: true,
            width: 1075,
            height: 3048,
            scrollY: -48,
            ignoreElements: (element) => [...element.classList].includes('report__control')
          },
          jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
        }
        const pdf = html2pdf().set(opt).from(dom)
        const pdfSource = await pdf.output('datauristring')
        const iframe = `<iframe width='100%' height='100%' src='${pdfSource}'></iframe>`
        const page = window.open()
        page.document.open()
        page.document.write(iframe)
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
    /**
     * 更新报告
     * @param obj
     */
    async changeSuggestion (obj) {
      try {
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
          return await imageCompress(imageSource, { width: 200, height: 200 })
        }
      } catch (e) {
        return null
      }
    }
  },
  beforeDestroy () {
    this.cutViewer && this.cutViewer.destroy()
    this.helperViewer && this.helperViewer.destroy()
  }
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
    height: 200px;

    img {
      max-height: 100%;
      max-width: 100%;
    }
  }
}
/* 布局纵向 */
.a4-end-wise{
  width: 1075px;
  height: 1568px;
  padding: 100px;
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
  height: 160px;
  width: 160px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0;
}
</style>
