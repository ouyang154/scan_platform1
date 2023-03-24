/**
* 阅片平台管理
* Date: 2020/5/12
* Time: 12:21 上午
*/

<template>
  <div :class="[isDesktop ? 'read-film' : 'read-film--full']">

    <!-- S 内容区 -->
    <a-row :gutter="16">
      <a-col :span="sideSplitNum" v-show="isDesktop">
        <a-card :bordered="false" >
          <h3 class="read-film__form">添加显微数据资源</h3>
          <form-content show-control ref="form" @submit="onSubmit" />
        </a-card>
      </a-col>
      <a-col :span="mainSplitNum">
        <a-card :bordered="false" >

          <!-- S 表格搜索栏 -->
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="48">
                <a-col :md="12" :sm="24">
                  <a-form-item label="设备编号">
                    <a-input v-model="queryParam.equip_id" placeholder=""/>
                  </a-form-item>
                </a-col>
                <a-col :md="12" :sm="24">
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
            :scroll="{ x: 1024 }"
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
import { addMicro, deleteMicro, getMicros, updateMicro } from '@/api/setting'
import { Ellipsis, STable } from '@/components'
import FormContent from './modules/FormContent'
import FormModel from './modules/FormModel'

export default {
  name: 'ReadFilm',
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
          scopedSlots: { customRender: 'serial' },
          width: 60,
          fixed: 'left'
        },
        {
          title: '设备编号',
          dataIndex: 'equip_id',
          sorter: true
        },
        {
          title: 'ip地址',
          dataIndex: 'ip',
          sorter: true,
          scopedSlots: { customRender: 'ip' }
        },
        {
          title: '物理地址',
          dataIndex: 'mac',
          sorter: true,
          scopedSlots: { customRender: 'mac' }
        },
        {
          title: 'X偏移',
          dataIndex: 'offsetX',
          sorter: true,
          scopedSlots: { customRender: 'offsetX' }
        },
        {
          title: 'Y偏移',
          dataIndex: 'offsetY',
          sorter: true,
          scopedSlots: { customRender: 'offsetY' }
        },
        {
          title: '负责人',
          dataIndex: 'manager',
          sorter: true,
          scopedSlots: { customRender: 'manager' }
        },
        {
          title: '放置地点',
          dataIndex: 'room',
          sorter: true,
          scopedSlots: { customRender: 'room' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 120,
          fixed: 'right',
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
        return getMicros(parameter)
          .then(res => {
            return {
              totalCount: res.length || 0,
              data: res || [],
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
          await addMicro(form)
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
          await updateMicro(id, parameter)
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
          for (const id of this.selectedRowKeys) await deleteMicro(id)
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
.read-film {
  padding: 16px;

  &--full {
     padding: 0;
   }

  &__form {
     margin-bottom: 18px;
   }
}
</style>
