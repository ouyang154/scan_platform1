/**
* 未完成任务
* Date: 2020/5/13
* Time: 12:25 上午
*/
<template>
  <a-card :bordered="false">
    <div class="task">
      <!-- S 表格搜索栏 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :lg="6" :md="8" :sm="24">
              <a-form-item label="搜索姓名">
                <a-input v-model="queryParam.name" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :lg="6" :md="8" :sm="24">
              <a-form-item label="玻片编号">
                <a-input v-model="queryParam.specimen_id_contains" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :lg="6" :md="8" :sm="24">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              <a-button type="danger" :disabled="selectedRowKeys.length === 0" style="margin-left: 8px" @click="bulkDelete">删除</a-button>
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
        :columns="columns"
        :data="loadData"
        :pageNum="pageNum"
        :rowSelection="options.rowSelection"
        :customRow="customRow"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <!-- / 序号 -->

        <span slot="scanFolder" slot-scope="text">
          <div :class="[!isDesktop ? 'task__image' : '']">

            <img :src="text | scanFolderFilter" height="100px" alt="">
          </div>
        </span>
        <!-- / 玻片 -->

        <span slot="AIDiagnosis" slot-scope="text, record">
          {{ record | AIDiagnosisFilter(satisfaction_nucleus_count) }}<br/>
          {{ record | ContextInferFilter }}
        </span>
        <!-- / AI结果 -->

        <span slot="AIgrade" slot-scope="text,record">
          {{ record | AIgradeFilter(satisfaction_nucleus_count) }}
        </span>
        <!-- / AI级别 -->

        <span slot="action" slot-scope="text, record">
          <template>
            <el-button
              size="small"
              :type="record.status | statusColorFilter"
              :disabled="record.status | statusDisabledFilter"
              @click="handleReview(record)">
              {{ record.status | statusTextFilter }}
            </el-button>
          </template>
        </span>
      </s-table>
      <!-- E 表格 -->
    </div>
  </a-card>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import OSS from '@/utils/oss'
import { STable, Ellipsis } from '@/components'
import { getHospitals, deleteScans, getScanList } from '@/api/workspace'
import {
  AIDiagnosisMapping, StatusColorMapping,
  StatusDisabledMapping, StatusTextMapping
} from '@/mapping'

export default {
  name: 'Task',
  components: {
    STable,
    Ellipsis
  },
  data () {
    return {
      satisfaction_nucleus_count:3000,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '#',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '姓名',
          dataIndex: 'specimen_info.name'
        },
        {
          title: '年龄',
          dataIndex: 'specimen_info.age'
        },
        {
          title: '采样编号',
          dataIndex: 'specimen_info.specimen_id',
          sorter: true
        },
        {
          title: '玻片',
          dataIndex: 'scan_folder',
          scopedSlots: { customRender: 'scanFolder' }
        },
        {
          title: '初审员',
          dataIndex: 'author',
          sorter: true
        },
        {
          title: '复审员',
          dataIndex: 'approver',
          sorter: true
        },
        {
          title: '文员',
          dataIndex: 'verifier',
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
          title: '状态',
          dataIndex: 'action',
          width: '220px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        const { pageNo, pageSize, sortField, sortOrder } = params
        localStorage.setItem('pro__TASK_PAGE_NUM', pageNo)
        const parameter = Object.assign(this.queryParam, {
          page: pageNo,
          page_size: pageSize,
          ordering: (sortField && sortOrder) ? (sortOrder !== 'ascend' ? `-${sortField}` : sortField) : '',
          status: 'authoring,approving,printing',
          occupied_by: JSON.parse(localStorage.getItem("pro__USER")).value.id,
          created_date: this.queryParam.created_date && moment(this.queryParam.created_date).format('YYYY-MM-DD'),
          disabled: false,
          excluding:'scan_log,scout_log,det_log,post_process_log,detection_info',
          specimen_info__name: ''
        })
        if (this.queryParam.name){
          parameter.specimen_name_contains = this.queryParam.name
        }
        if (this.queryParam.specimen_id_contains){
          parameter.specimen_id_contains = this.queryParam.specimen_id_contains
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
      selectedRowKeys: [],
      selectedRows: [],
      // custom table alert & rowSelection
      options: {
        alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange,
          getCheckboxProps: record => ({
            props: {
              name: record.id.toString()
            }
          })
        }
      },
      optionAlertShow: true
    }
  },
  filters: {
    // 玻片地址
    scanFolderFilter (id) {
      return `../../../../static/exam/${id}/preview.jpg`
      // return OSS.instance.signatureUrl(`/exam/${id}/preview.jpg`)
    },
    // 创建时间
    createdFilter (date) {
      return moment(date).format('YYYY-MM-DD HH:mm')
    },
    // 按钮颜色
    statusColorFilter (status) {
      return StatusColorMapping.get(status)
    },
    // 按钮禁用
    statusDisabledFilter (status) {
      return StatusDisabledMapping.get(status)
    },
    // 按钮文本
    statusTextFilter (status) {
      return StatusTextMapping.get(status)
    }
  },
  computed: {
    ...mapGetters(['device']),
    isDesktop () {
      return this.device === 'desktop'
    },
    pageNum () {
      return +localStorage.getItem('pro__TASK_PAGE_NUM') || 1
    }
  },
  async mounted () {
    try {
      this.isLoading = true
      const [[hospital]] = await Promise.all([
        getHospitals()
      ])
      if(hospital.satisfaction_nucleus_count){
        this.satisfaction_nucleus_count = hospital.satisfaction_nucleus_count
      }
    } catch (e) {
      this.$message.error('数据获取异常！')
    }
  },
  methods: {
    /**
     * 预览
     * @param record
     */
    handleReview (record) {
      this.$router.push({
        name: 'Review',
        params: { specimen_id: record.specimen_info.specimen_id },
        query: { id:record.id, sectionType: 'LSIL', page: 1, index: 1 }
      })
    },
    /**
     * 编辑
     * @param record
     */
    handleEdit (record) {
      console.log(record)
    },
    /**
     * 批量删除
     */
    async bulkDelete () {
      try {
        await deleteScans(this.selectedRowKeys.toString())
        this.$refs.table.refresh(true)
        this.$message.success('已删除！')
      } catch (e) {
        this.$message.error('删除异常！')
      }
    },
    /**
     * 选择数据赋值
     * @param selectedRowKeys 已选行id
     * @param selectedRows 已选行对象
     */
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    /**
     * 自定义行事件
     * @param record
     * @param index
     * @returns {{on: {click: on.click}}}
     */
    customRow (record, index) {
      const filter = this.$options.filters['statusDisabledFilter']
      return {
        on: {
          dblclick: () => !filter(record.status) && this.handleReview(record)
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.task {

  &__image {
     width: 130px;
     overflow: hidden;
   }

  /deep/ .ant-table-tbody > tr > td {
    padding: 0px 2px !important;
  }
}
</style>
