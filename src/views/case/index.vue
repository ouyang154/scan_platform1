/**
* 全部病例统计
* Date: 2020/5/12
* Time: 11:46 下午
*/
<template>
  <div class="content">
    <div class="page-header-index-wide">
      <a-card :bordered="false">
        <div class="case">

          <!-- S 表格搜索栏 -->
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="48">
                <a-col :lg="4" :md="12" :sm="24">
                  <a-form-item label="起始编号">
                    <a-input v-model="queryParam.specimen_range_min" placeholder=""/>
                  </a-form-item>
                </a-col>
                <a-col :lg="4" :md="12" :sm="24">
                  <a-form-item label="截止编号">
                    <a-input v-model="queryParam.specimen_range_max" placeholder=""/>
                  </a-form-item>
                </a-col>
                <a-col :lg="4" :md="12" :sm="0">
                  <a-form-item label="起始日期">
                    <a-date-picker style="width: 100%" v-model="queryParam.created_range_after" />
                  </a-form-item>
                </a-col>
                <a-col :lg="4" :md="12" :sm="0">
                  <a-form-item label="结束日期">
                    <a-date-picker style="width: 100%" v-model="queryParam.created_range_before" />
                  </a-form-item>
                </a-col>
                <a-col :lg="8" :md="8" :sm="24">
                  <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                  <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
                  <a-button style="margin-left: 8px" @click="handlePdf('print')">打印</a-button>
                  <a-button style="margin-left: 8px" @click="handlePdf('download')">下载</a-button>
                </a-col>
              </a-row>
            </a-form>
          </div>
          <!-- E 表格搜索栏 -->

          <!-- S 表格 -->
          <s-table
            ref="table"
            size="default"
            rowKey="id"
            :pageSize=20
            :columns="columns"
            :data="loadData"
            showPagination="auto"
          >
            <span slot="serial" slot-scope="text, record, index">
              {{ index + 1 }}
            </span>
            <!-- / 序号 -->

            <span slot="created" slot-scope="text">
              {{ text | createdFilter }}
            </span>
            <!-- / 创建时间 -->

            <span slot="AIDiagnosis" slot-scope="text,record">
              {{ record | AIDiagnosisFilter(satisfaction_nucleus_count) }}{{'&nbsp;&nbsp;'}}
              {{ record | ContextInferFilter }}
            </span>
            <!-- / AI结果 -->

            <span slot="AIgrade" slot-scope="text,record">
              {{ record | AIgradeFilter(satisfaction_nucleus_count) }}
            </span>
            <!-- / AI级别 -->

            <span slot="AIscore" slot-scope="text,record">
              {{ record | AIscoreFilter }}
            </span>
            <!-- / AI分数 -->

            <span slot="nucleus_count" slot-scope="text,record">
              {{ record.nucleus_count }}
            </span>
            <!-- / AI分数 -->

          </s-table>
          <!-- E 表格 -->

        </div>
      </a-card>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import html2pdf from 'html2pdf.js'
import { STable, Ellipsis } from '@/components'
import { getScanList } from '@/api/workspace'
import { AIDiagnosisMapping } from '@/mapping'

export default {
  name: 'Case',
  components: {
    STable,
    Ellipsis
  },
  data () {
    return {
      satisfaction_nucleus_count:3000,
      moment,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '#',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '创建日期',
          dataIndex: 'created',
          scopedSlots: { customRender: 'created' },
          sorter: true
        },
        {
          title: '审核医生',
          dataIndex: 'owner',
          scopedSlots: { customRender: 'owner' },
          sorter: true
        },
        {
          title: '采样编号',
          dataIndex: 'specimen_info.specimen_id',
          sorter: true
        },
        {
          title: 'AI结果',
          dataIndex: 'AIdiagnosis',
          scopedSlots: { customRender: 'AIDiagnosis' },
          sorter: true
        },
        {
          title: '级别',
          dataIndex: 'AIgrade',
          scopedSlots: { customRender: 'AIgrade' },
          sorter: true
        },
        {
          title: '分数',
          dataIndex: 'AIscore',
          scopedSlots: { customRender: 'AIscore' },
          sorter: true
        },
        {
          title: '细胞数',
          dataIndex: 'nucleus_count',
          scopedSlots: { customRender: 'nucleus_count' },
        },
        {
          title: '诊断结果',
          dataIndex: 'diagnosisValue'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        const { pageNo, pageSize, sortField, sortOrder } = params
        const parameter = {
          page: pageNo,
          page_size: pageSize,
          ordering: (sortField && sortOrder) ? (sortOrder !== 'ascend' ? `-${sortField}` : sortField) : '',
        }
        if (this.queryParam.created_range_after){
          if (this.queryParam.created_range_before){
            parameter.created_range_after = this.queryParam.created_range_after  && moment(this.queryParam.created_range_after).format('YYYY-MM-DD')
            parameter.created_range_before = this.queryParam.created_range_before  && moment(this.queryParam.created_range_before).format('YYYY-MM-DD')
          }
          else{
            parameter.created_date = this.queryParam.created_range_after  && moment(this.queryParam.created_range_after).format('YYYY-MM-DD')
          }         
        }
        if (this.queryParam.specimen_range_min){
          if (this.queryParam.specimen_range_max){
            parameter.specimen_range_min = this.queryParam.specimen_range_min
            parameter.specimen_range_max = this.queryParam.specimen_range_max
          }
          else{
            parameter.specimen_id_contains = this.queryParam.specimen_range_min
          }         
        }
        if (this.queryParam.name){
          parameter.name = this.queryParam.name
        }
        return getScanList(parameter)
          .then(res => {
            return {
              totalCount: res.count || 0,
              data: res.results || [],
              ...params
            }
          })
      },
      options: {
        alert: false,
        rowSelection: null
      }
    }
  },
  filters: {
    // 创建时间
    createdFilter (date) {
      return moment(date).format('YYYY-MM-DD HH:mm')
    },
    // AI分数
    AIScoreFilter (score) {
      return Math.round(score * 100)
    }
  },
  methods: {
    /**
     * 处理pdf文件打印与下载
     * @param type 'print' | 'download'
     * @returns {Promise<void>}
     */
    async handlePdf (type) {
      try {
        const dom = this.$refs.table.$el.cloneNode(true)
        dom.style.width = '1920px'
        const opt = {
          margin: [12, 12],
          filename: `所有病例统计-${moment().format('YYYY-MM-DD')}.pdf`,
          image: { type: 'jpeg', quality: 1 },
          html2canvas: {
            useCORS: true,
            width: 1920,
            ignoreElements: (element) => [...element.classList].includes('ant-table-pagination')
          },
          //jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
          jsPDF: { unit: 'pt', format: 'a4', orientation: 'landscape' }
        }
        const pdf = html2pdf().set(opt).from(dom)
        if (type === 'print') {
          const pdfSource = await pdf.output('datauristring')
          const iframe = `<iframe width='100%' height='100%' src='${pdfSource}'></iframe>`
          const page = window.open()
          page.document.open()
          page.document.write(iframe)
          page.document.close()
        } else {
          await pdf.save()
        }
      } catch (e) {
        this.$message.error(type === 'print' ? '打印失败' : '下载失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.content {
    margin: 0;
}
</style>
