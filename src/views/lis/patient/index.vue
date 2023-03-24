/**
* 病人信息录入
* Date: 2020/5/15
* Time: 12:19 上午
*/
<template>
  <div :class="[isDesktop ? 'patient' : 'patient--full']">

    <!-- S 内容区 -->
    <a-row :gutter="16">
      <a-col :span="sideSplitNum" v-show="isDesktop">
        <a-card :bordered="false" >
          <h3 class="doctor__form">添加病人信息</h3>
          <form-content show-control ref="form" @submit="onSubmit" />
        </a-card>
      </a-col>
      <a-col :span="mainSplitNum">
        <a-card :bordered="false" >

          <!-- S 表格搜索栏 -->
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="48">
                <a-col :md="8" :sm="24">
                  <a-form-item label="姓名">
                    <a-input v-model="queryParam.name" placeholder=""/>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="采样编号">
                    <a-input v-model="queryParam.specimen_id" placeholder=""/>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="选择日期">
                    <a-date-picker style="width: 100%" v-model="queryParam.created" />
                  </a-form-item>
                </a-col>
                <a-col :md="12" :sm="24" style="margin-bottom: 16px">
                  <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                  <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
                  <a-button style="margin-left: 8px" type="primary" v-if="!isDesktop" @click="$refs.model.add()">新建</a-button>
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
            :rowSelection="options.rowSelection"
            showPagination="auto"
          >
            <span slot="serial" slot-scope="text, record, index">
              {{ index + 1 }}
            </span>
            <!-- / 序号 -->

            <span slot="action" slot-scope="text, record">
              <template>
                <a-button type="primary" @click="handleEdit(record)">编辑</a-button>
              </template>
            </span>
            <!-- / 操作 -->

          </s-table>
          <!-- E 表格 -->

        </a-card>
      </a-col>
    </a-row>
    <!-- E 内容区 -->

    <!-- S 新建及编辑模态框 -->
    <form-model ref="model" @submit="onSubmit" @modify="onModify" />
    <!-- E 新建及编辑模态框 -->

  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import { addPatient, deletePatient, getPatients, updatePatient } from '@/api/lis'
import { Ellipsis, STable } from '@/components'
import FormContent from './modules/FormContent'
import FormModel from './modules/FormModel'

export default {
  name: 'Patient',
  components: {
    STable,
    Ellipsis,
    FormContent,
    FormModel
  },
  data () {
    return {
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
          dataIndex: 'name',
          sorter: true
        },
        {
          title: '年龄',
          dataIndex: 'age',
          sorter: true
        },
        {
          title: '采样编号',
          dataIndex: 'specimen_id',
          sorter: true
        },
        {
          title: '创建日期',
          dataIndex: 'created',
          sorter: true,
          scopedSlots: { customRender: 'created'}
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 120,
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        const { pageNo, pageSize, sortField, sortOrder } = params
        const parameter = {
          page: pageNo,
          page_size: pageSize,
          ordering: (sortField && sortOrder) ? (sortOrder !== 'ascend' ? `-${sortField}` : sortField) : '',
          name: this.queryParam.name? this.queryParam.name: '',
          specimen_id: this.queryParam.specimen_id? this.queryParam.specimen_id: '',
          created_date: this.queryParam.created? moment(this.queryParam.created).format('YYYY-MM-DD'): ''
        }
        return getPatients(parameter)
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
      }
    }
  },
  computed: {
    ...mapGetters(['device']),
    isDesktop () {
      return this.device === 'desktop'
    },
    mainSplitNum () {
      return this.device === 'desktop' ? 14 : 24
    },
    sideSplitNum () {
      return this.device === 'desktop' ? 10 : 24
    }
  },
  methods: {
    moment,
    /**
     * 提交数据
     * @param form
     */
    async onSubmit (form) {
      try {
        await addPatient(form)
        this.$refs.table.refresh(true)
        this.$refs.form.resetFields()
        this.$refs.model.close()
        this.$message.success('添加成功！')
      } catch (e) {
        this.$message.error('添加异常！')
      }
    },
    /**
     * 修改信息
     * @param form
     */
    async onModify (form) {
      try {
        const { id, ...parameter } = form
        await updatePatient(id, parameter)
        this.$refs.model.close()
        this.$refs.table.refresh(true)
        this.$message.success('修改成功！')
      } catch (e) {
        this.$message.error('修改异常！')
      }
    },
    /**
     * 编辑
     * @param record
     */
    handleEdit (record) {
      this.$refs.model.edit(record)
    },
    /**
     * 批量删除
     */
    async bulkDelete () {
      try {
        for (const id of this.selectedRowKeys) await deletePatient(id)
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
    }
  }
}
</script>

<style scoped lang="less">
.patient {
  padding: 16px;

  &--full {
    padding: 0;
  }

  &__form {
    margin-bottom: 18px;
  }
}
</style>
