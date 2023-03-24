/**
* 用户管理
* Date: 2020/5/12
* Time: 12:17 上午
*/
<template>
  <div :class="[isDesktop ? 'user-management' : 'user-management--full']">
    <!-- S 内容区 -->
    <a-row :gutter="16">
      <a-col :span="sideSplitNum" v-show="isDesktop">
        <a-card :bordered="false" >
          <h3 class="user-management__form">添加用户</h3>
          <form-content show-control ref="form" @submit="onSubmit" />
        </a-card>
      </a-col>
      <a-col :span="mainSplitNum">
        <a-card :bordered="false" >

          <div class="table-operator">
            <a-button type="primary" icon="plus" v-if="!isDesktop" @click="$refs.model.add()">新建</a-button>
            <a-button type="danger" icon="delete" :disabled="selectedRowKeys.length === 0" @click="bulkDelete">删除</a-button>
          </div>

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

            <span slot="admin" slot-scope="text">
              {{ text | roleFilter }}
            </span>
            <!-- / 角色 -->

            <span slot="edit" slot-scope="text">
              {{ text | editFilter }}
            </span>
            <!-- / 编辑 -->

            <span slot="review" slot-scope="text">
              {{ text | reviewFilter }}
            </span>
            <!-- / 审核 -->

            <span slot="submit" slot-scope="text">
              {{ text | submitFilter }}
            </span>
            <!-- / 提交 -->

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
import { deleteUser, getUsers, register, updateUser } from '@/api/login'
import { Ellipsis, STable } from '@/components'
import FormContent from './modules/FormContent'
import FormModel from './modules/FormModel'

export default {
name: 'UserManagement',
  components: {
    STable,
    Ellipsis,
    FormContent,
    FormModel
  },
  data () {
    return {
      // 表头
      columns: [
        {
          title: '#',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '姓名',
          dataIndex: 'username',
          sorter: true
        },
        {
          title: '角色',
          dataIndex: 'admin',
          sorter: true,
          scopedSlots: { customRender: 'admin' }
        },
        {
          title: '编辑',
          dataIndex: 'edit',
          sorter: true,
          scopedSlots: { customRender: 'edit' }
        },
        {
          title: '审核',
          dataIndex: 'review',
          sorter: true,
          scopedSlots: { customRender: 'review' }
        },
        {
          title: '提交',
          dataIndex: 'submit',
          sorter: true,
          scopedSlots: { customRender: 'submit' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '120px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        const { pageNo, pageSize, sortField, sortOrder } = params
        const parameter = Object.assign({}, {
          page: pageNo,
          page_size: pageSize,
          ordering: (sortField && sortOrder) ? (sortOrder !== 'ascend' ? `-${sortField}` : sortField) : ''
        })
        return getUsers(parameter)
          .then(res => {
            const data = res.map(item => {
              item.username = item.user.username
              return item
            })
            return {
              totalCount: res.length || 0,
              data: data || [],
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
        await register(form)
        this.$refs.table.refresh(true)
        this.$refs.form.resetFields()
        this.$refs.model.close()
        this.$message.success('添加成功！')
      } catch (e) {
        this.$message.error('添加异常！')
      }
    },
    /**
     * 修改用户信息
     * @param form
     */
    async onModify (form) {
      try {
        const { id, ...parameter } = form
        await updateUser(id, parameter)
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
        for (const id of this.selectedRowKeys) await deleteUser(id)
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
.user-management {
  padding: 16px;

  &--full {
     padding: 0;
   }

  &__form {
     margin-bottom: 18px;
   }
}
</style>
