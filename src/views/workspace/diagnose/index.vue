/**
* 待诊断
* Date: 2020/5/13
* Time: 12:30 上午
*/
<template>
  <a-card :bordered="false">
    <div class="diagnose">

      <!-- S 表格搜索栏 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="12">
            <a-col :lg="3" :md="8" :sm="24">
              <a-form-item label="姓名">
                <a-input v-model="queryParam.name" placeholder="" />
              </a-form-item>
            </a-col>
            <a-col :lg="3" :md="8" :sm="24">
              <a-form-item label="编号">
                <a-input v-model="queryParam.specimen_id" placeholder="" />
              </a-form-item>
            </a-col>
            <a-col :lg="3" :md="8" :sm="24">
              <a-form-item label="起始编号">
                <a-input v-model="queryParam.specimen_range_min" placeholder="" />
              </a-form-item>
            </a-col>
            <a-col :lg="3" :md="8" :sm="0">
              <a-form-item label="截止编号">
                <a-input v-model="queryParam.specimen_range_max" placeholder="" />
              </a-form-item>
            </a-col>
            <a-col :lg="3" :md="7" :sm="0">
              <a-form-item label="起始日期">
                <a-date-picker style="width: 100%" v-model="queryParam.created_range_after" />
              </a-form-item>
            </a-col>
            <a-col :lg="3" :md="7" :sm="0">
              <a-form-item label="结束日期">
                <a-date-picker style="width: 100%" v-model="queryParam.created_range_before" />
              </a-form-item>
            </a-col>
            <a-col :lg="4" :md="8" :sm="24">
              <a-form-item label="申请科室">
                <a-auto-complete v-model="queryParam.reference_department" :data-source="departments" />
              </a-form-item>
            </a-col>
            <a-col :lg="5" :md="10" :sm="24">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              <a-button type="danger" :disabled="selectedRowKeys.length === 0" style="margin-left: 8px"
                @click="deleteFormVisible = true">删除</a-button>
              <a-button type="primary" :disabled="!(selectedRowKeys.length !== 0 && assignScan && isAdmin)"
                style="margin-left: 8px" @click="handleAssign(selectedRowKeys)">分配</a-button>
            </a-col>
          </a-row>
        </a-form>
        <el-dialog :visible.sync="deleteFormVisible" :close-on-click-modal="false" :modal-append-to-body='false'>
          <div class="title"> 确认删除这些病例?</div>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="deleteFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="bulkDelete">确认</el-button>
          </div>
        </el-dialog>
      </div>
      <!-- E 表格搜索栏 -->



      <!-- S 表格 -->
      <s-table v-if="!isLoading" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData"
        :pageNum="pageNum" :rowSelection="options.rowSelection" :customRow="customRow" showPagination="auto">
        <span slot="reserved_flag" slot-scope="text,record">
          <div :class="[!isDesktop ? 'reserved_icon__image' : '']"><img :src="text | reservedIconFilter" width="20"
              height="20" @click="changeReserve(record)" /></div>
        </span>
        <!-- / 序号 -->
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <!-- / 序号 -->

        <span slot="scanFolder" slot-scope="text">
          <div :class="[!isDesktop ? 'diagnose__image' : '']">
            <img :src="text | scanFolderFilter" height="100px" alt="">
          </div>
        </span>
        <!-- / 玻片 -->

        <span slot="created" slot-scope="text">
          {{ text | createdFilter }}
        </span>
        <!-- / 创建时间 -->

        <span slot="diagnosisValue" slot-scope="text, record">
          {{ record | diagnosisFilter }}
        </span>
        <!-- / 诊断结果 -->

        <span slot="AIDiagnosis" slot-scope="text,record">
          {{ record | AIDiagnosisFilter(satisfaction_nucleus_count) }}<br />
          {{ record | ContextInferFilter }}
        </span>
        <!-- / AI结果 -->

        <span slot="AIgrade" slot-scope="text,record">
          {{ record | AIgradeFilter(satisfaction_nucleus_count) }}
        </span>
        <!-- / AI级别 -->

        <span slot="status" slot-scope="text, record">
          <template>
            <el-button size="small" :type="record.status | statusColorFilter"
              :disabled="record.status | statusDisabledFilter" @click="handleReview(record)">
              {{ record.status | statusTextFilter }}
            </el-button>
            <a-divider type="vertical" />
            <el-button size="small" type="primary" @click="handleEdit(record)">编辑</el-button>
          </template>
        </span>
        <!-- / 操作 -->

      </s-table>
      <!-- E 表格 -->

      <!-- S 病例修改 -->
      <case-modify-model ref="model" @updated="caseUpdated" />
      <!-- E 病例修改 -->

      <!-- S 病例分配 -->
      <case-assign-model ref="assignmodel" @updated="caseUpdated" />
      <!-- E 病例分配 -->

    </div>
  </a-card>
</template>

<script>
import moment, { locale } from 'moment'
import { mapGetters } from 'vuex'
// import OSS from '@/utils/oss'
import { STable } from '@/components'
import CaseModifyModel from '../modules/CaseModifyModel'
import CaseAssignModel from '../modules/CaseAssignModel'
import { getHospitals, deleteScans, getScanList, updateScan } from '@/api/workspace'
import { getDoctors, getDepartments } from '@/api/lis'
import {
  AIDiagnosisMapping, StatusColorMapping,
  StatusDisabledMapping, StatusTextMapping
} from '@/mapping'
// import { reverse } from '_d3@6.2.0@d3/node_modules/d3-array';
export default {
  name: 'Diagnose',
  components: {
    STable,
    CaseModifyModel,
    CaseAssignModel
  },
  data() {
    return {
      // 查询参数
      isLoading: true,
      queryParam: {},
      departments: [],
      totalParameter: {},
      isAdmin: false,
      assignScan: false,
      satisfaction_nucleus_count: 3000,
      report_process: null,
      // 表头
      columns: [
        {
          title: '',
          dataIndex: 'reserved_flag',
          scopedSlots: { customRender: 'reserved_flag' }
        },
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
          title: '日期',
          dataIndex: 'created',
          scopedSlots: { customRender: 'created' },
          sorter: true
        },
        {
          title: '诊断',
          dataIndex: 'diagnosisValue',
          scopedSlots: { customRender: 'diagnosisValue' }
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
          dataIndex: 'status',
          width: '200px',
          scopedSlots: { customRender: 'status' },
          sorter: true
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        const { pageNo, pageSize, sortField, sortOrder } = params
        localStorage.setItem('pro__DIAGNOSE_PAGE_NUM', pageNo)
        const parameter = {
          page: pageNo,
          page_size: pageSize,
          ordering: (sortField && sortOrder) ? (sortOrder !== 'ascend' ? `-${sortField}` : sortField) : '',
          status: 'authored,predicted,qualityControlPass,qualityControlFail',
          excluding: 'scan_log,scout_log,det_log,post_process_log,detection_info',
          disabled: false
        }
        if (this.assignScan && !this.isAdmin) {
          parameter.owner__username = JSON.parse(localStorage.getItem("pro__USER")).value.username
        }
        if (localStorage.getItem("queryParam")) {
          const queryParam = JSON.parse(localStorage.getItem("queryParam"))
          if (queryParam.created_range_after) {
            queryParam.created_range_after = queryParam.created_range_after && moment(queryParam.created_range_after)
          }
          if (queryParam.created_range_before) {
            queryParam.created_range_before = queryParam.created_range_before && moment(queryParam.created_range_before)
          }
          this.queryParam = queryParam
        }

        if (this.queryParam.created_range_after) {
          if (this.queryParam.created_range_before) {
            parameter.created_range_after = this.queryParam.created_range_after && moment(this.queryParam.created_range_after).format('YYYY-MM-DD')
            parameter.created_range_before = this.queryParam.created_range_before && moment(this.queryParam.created_range_before).format('YYYY-MM-DD')
          }
          else {
            parameter.created_date = this.queryParam.created_range_after && moment(this.queryParam.created_range_after).format('YYYY-MM-DD')
          }
        }
        if (this.queryParam.specimen_range_min) {
          if (this.queryParam.specimen_range_min.length > 0) {
            if (this.queryParam.specimen_range_max) {
              parameter.specimen_range_min = this.queryParam.specimen_range_min
              parameter.specimen_range_max = this.queryParam.specimen_range_max
            }
            else {
              parameter.specimen_id_startswith = this.queryParam.specimen_range_min
            }
          }
        }
        if (this.queryParam.name) {
          parameter.specimen_name_contains = this.queryParam.name
        }
        if (this.queryParam.specimen_id) {
          parameter.specimen_id_contains = this.queryParam.specimen_id
        }

        if (this.queryParam.reference_department) {
          parameter.specimen_info__reference_department = this.queryParam.reference_department
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
      deleteFormVisible: false
    }
  },
  watch: {
    queryParam: {
      handler(new_value, old_value) {
        localStorage.setItem('queryParam', JSON.stringify(new_value))
        const parameter = {
          page: 1,
          page_size: 100,
          status: 'authored,predicted,qualityControlPass,qualityControlFail',
          excluding: 'scan_log,scout_log,det_log,post_process_log',
          disabled: false
        }
        if (this.assignScan && !this.isAdmin) {
          parameter.owner__username = JSON.parse(localStorage.getItem("pro__USER")).value.username
        }
        if (new_value.created_range_after) {
          if (new_value.created_range_before) {
            parameter.created_range_after = new_value.created_range_after && moment(new_value.created_range_after).format('YYYY-MM-DD')
            parameter.created_range_before = new_value.created_range_before && moment(new_value.created_range_before).format('YYYY-MM-DD')
          }
          else {
            parameter.created_date = new_value.created_range_after && moment(new_value.created_range_after).format('YYYY-MM-DD')
          }
        }
        if (new_value.specimen_range_min) {
          if (new_value.specimen_range_min.length > 0) {
            if (new_value.specimen_range_max) {
              parameter.specimen_range_min = new_value.specimen_range_min
              parameter.specimen_range_max = new_value.specimen_range_max
            }
            else {
              parameter.specimen_id_startswith = new_value.specimen_range_min
            }
          }
        }
        if (new_value.name) {
          if (new_value.name.length > 0) {
            parameter.specimen_info__name = new_value.name
          }
        }
        if (new_value.reference_department) {
          parameter.specimen_info__reference_department = new_value.reference_department
        }
        this.totalParameter = parameter
      },
      deep: true
    }
  },
  filters: {
    // 玻片地址
    scanFolderFilter(id) {
      return `../../../../static/exam/${id}/preview.jpg`
      // return OSS.instance.signatureUrl(`/exam/${id}/preview.jpg`)
    },
    // 创建时间
    createdFilter(date) {
      return moment(date).format('YYYY-MM-DD HH:mm')
    },
    // 按钮颜色
    statusColorFilter(status) {
      return StatusColorMapping.get(status)
    },
    // 按钮禁用
    statusDisabledFilter(status) {
      return StatusDisabledMapping.get(status)
    },
    // 按钮文本
    statusTextFilter(status) {
      return StatusTextMapping.get(status)
    },
    // 保留病例
    reservedIconFilter(reserved_flag) {
      let url = `images/reserve_rest.png`
      if (reserved_flag) {
        url = `images/reserve_hover.png`
      }
      return url
    },
  },
  computed: {
    ...mapGetters(['device']),
    isDesktop() {
      return this.device === 'desktop'
    },
    pageNum() {
      return +localStorage.getItem('pro__DIAGNOSE_PAGE_NUM') || 1
    },
  },
  created() {
    this.enterKeyup()
    // this.$router.push({ name: 'Diagnose', query: { pageSize: 1 } })
  },
  async mounted() {
    try {
      this.isLoading = true
      const [[hospital]] = await Promise.all([
        getHospitals()
      ])
      console.log("hospital config", hospital)
      if (hospital.satisfaction_nucleus_count) {
        this.satisfaction_nucleus_count = hospital.satisfaction_nucleus_count
      }
      if (hospital.report_process) {
        this.report_process = hospital.report_process
      } else {
        // 默认一级审核
        this.report_process = 'one_level'
      }
      if (hospital.assign_scan) {
        this.assignScan = true
        // add 被分配人column到第8列
        this.columns.splice(7, 0,{
          title: '被分配人',
          dataIndex: 'owner.username',
          scopedSlots: { customRender: 'owner.username' },
          sorter: true
        })
      }
      if (JSON.parse(localStorage.getItem("pro__USER")).value.username == 'admin') {
        this.isAdmin = true
      }
      const parameter = { page: 1, page_size: 100 }
      const { results: departmentResults } = await getDepartments(parameter)
      this.departments = departmentResults.map(department => department.name)
      console.log(this.departments)
      console.log("assignScan", this.assignScan)
      console.log("isAdmin", this.isAdmin)
    } catch (e) {
      this.$message.error('数据获取异常！')
    }
    this.isLoading = false
  },
  methods: {
    /**
     * 预览
     * @param record
     */
    async handleReview(record) {
      let { id, status, author, approver } = record

      let newStatus = null
      if (this.report_process === 'one_level') {
        // 一级审核
        // 初审复审同一个人
        author = JSON.parse(localStorage.getItem("pro__USER")).value.username
        approver = JSON.parse(localStorage.getItem("pro__USER")).value.username
        // 状态待复审
        newStatus = 'approving'
      } else {
        // 二级审核
        if (status === 'predicted') {
          // 初审
          author = JSON.parse(localStorage.getItem("pro__USER")).value.username
          newStatus = 'authoring'
        } else {
          // 复审
          approver = JSON.parse(localStorage.getItem("pro__USER")).value.username
          newStatus = 'approving'
        }
      }
      // update scan
      let updateScanBody = {
        status: newStatus,
        occupied_by: { id: JSON.parse(localStorage.getItem("pro__USER")).value.id },
        author: author,
        approver: approver
      }
      await updateScan(id, updateScanBody)
      // go to detail page
      this.$router.push({
        name: 'Review',
        // params: { id: record.id },
        params: { specimen_id: record.specimen_info.specimen_id },
        query: { id: record.id, sectionType: 'LSIL', page: 1, index: 1 }
      })
    },
    /**
     * 编辑
     * @param record
     */
    handleEdit(record) {
      this.$refs.model.edit(record)
    },
    /**
     * 批量删除
     */
    async bulkDelete() {
      try {
        await deleteScans(this.selectedRowKeys.toString())
        this.$refs.table.refresh(true)
        this.$message.success('已删除！')
      } catch (e) {
        this.$message.error('删除异常！')
      }
      this.deleteFormVisible = false
    },
    handleAssign(selectedRowKeys) {
      if (selectedRowKeys.length > 0) { this.$refs.assignmodel.edit(selectedRowKeys) }
      else {
        if (this.assignScan) {
          getScanList(this.totalParameter)
            .then(res => {
              let results = res.results
              let ids = []
              for (let i = 0; i < results.length; i++) { ids = ids.concat(results[i].id) }
              if (ids.length > 0) { this.$refs.assignmodel.edit(ids) }
            })
        }
      }
      this.$refs.table.refresh(false)
    },
    /**
     * 病例更新完毕
     */
    caseUpdated() {
      this.queryParam = {}
      this.$refs.table.refresh(false)
    },
    /**
     * 选择数据赋值
     * @param selectedRowKeys 已选行id
     * @param selectedRows 已选行对象
     */
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    /**
     * 自定义行事件
     * @param record
     * @param index
     * @returns {{on: {click: on.click}}}
     */
    customRow(record, index) {
      const filter = this.$options.filters['statusDisabledFilter']
      return {
        on: {
          dblclick: () => !filter(record.status) && this.handleReview(record)
        }
      }
    },

    // 键盘监听
    enterKey(event) {
      if (true) {
        const code = event.keyCode
          ? event.keyCode
          : event.which
            ? event.which
            : event.charCode;
        if (true) {
          if (code == 13) { this.$refs.table.refresh(true); }  // key 'enter'
        }
      }
    },
    enterKeyupDestroyed() {
      document.removeEventListener("keydown", this.enterKey);
    },
    enterKeyup() {
      document.addEventListener("keydown", this.enterKey);
    },


    async changeReserve(record) {
      try {
        let { id, reserved_flag } = record

        if (reserved_flag) { reserved_flag = false }
        else { reserved_flag = true }
        await updateScan(id, {
          reserved_flag: reserved_flag,
        })
        this.$refs.table.refresh(false)
        if (reserved_flag) { this.$message.success('已锁定！') }
        else { this.$message.success('已解锁！') }

      } catch (e) {
        this.$message.error('保存失败，请稍后重试！')
      }
    },
  }
}
</script>

<style scoped lang="less">
.diagnose {

  &__image {
    width: 92px;
    overflow: hidden;
  }

  /deep/ .ant-table-tbody>tr>td {
    padding: 0px 2px !important;
  }
}

.reserved_icon {

  &__image {
    width: 20px;
    overflow: hidden;
  }

  /deep/ .ant-table-tbody>tr>td {
    padding: 0px 2px !important;
  }
}

.span {
  white-space: pre-line;
}
</style>
