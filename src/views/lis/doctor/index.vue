/**
* 医生信息录入
* Date: 2020/5/15
* Time: 12:18 上午
*/
<template>
  <div :class="[isDesktop ? 'doctor' : 'doctor--full']">

    <!-- S 内容区 -->
    <a-row :gutter="16">
      <a-col :span="sideSplitNum" v-show="isDesktop">
        <a-card :bordered="false" >
          <h3 class="doctor__form">添加医生信息</h3>
          <form-content show-control ref="form" @submit="onSubmit" />
        </a-card>
      </a-col>
      <a-col :span="mainSplitNum">
        <a-card :bordered="false" >

          <!-- S 表格搜索栏 -->
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="48">
                <a-col :lg="8" :md="12" :sm="24">
                  <a-form-item label="姓名">
                    <a-input v-model="queryParam.name" placeholder=""/>
                  </a-form-item>
                </a-col>
                <a-col :lg="8" :md="12" :sm="24">
                  <a-form-item label="部门">
                    <a-input v-model="queryParam.department" placeholder=""/>
                  </a-form-item>
                </a-col>
                <a-col :lg="8" :md="12" :sm="24">
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
import { mapGetters } from 'vuex'
import { addDoctor, deleteDoctor, getDoctors, updateDoctor } from '@/api/lis'
import { Ellipsis, STable } from '@/components'
import FormContent from './modules/FormContent'
import FormModel from './modules/FormModel'

export default {
  name: 'Doctor',
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
          title: '工号',
          dataIndex: 'doctor_id',
          sorter: true
        },
        {
          title: '部门',
          dataIndex: 'department',
          sorter: true
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
        const parameter = Object.assign(this.queryParam, {
          page: pageNo,
          page_size: pageSize,
          ordering: (sortField && sortOrder) ? (sortOrder !== 'ascend' ? `-${sortField}` : sortField) : ''
        })
        return getDoctors(parameter)
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
      return this.device === 'desktop' ? 16 : 24
    },
    sideSplitNum () {
      return this.device === 'desktop' ? 8 : 24
    }
  },
  methods: {
    /**
     * 提交数据
     * @param form
     */
    async onSubmit (form) {
      try {
        await addDoctor(form)
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
        await updateDoctor(id, parameter)
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
        for (const id of this.selectedRowKeys) await deleteDoctor(id)
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
.doctor {
  padding: 16px;

  &--full {
    padding: 0;
  }

  &__form {
    margin-bottom: 18px;
  }
}
</style>
