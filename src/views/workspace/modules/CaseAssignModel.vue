/**
* 工作组病例信息修改
* Date: 2020/6/6
* Time: 12:22 上午
*/
<template>
  <div class="case-modify-model">
    <a-modal
      title="分配病例"
      :width="400"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleConfirm"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">

        <!-- S 表单 -->
        <a-form-model
          ref="ruleForm"
          :model="form"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-row :gutter="24">
            <a-col :md="24" :sm="24">
              <a-form-model-item ref="owner" label="分配医生">
                <a-auto-complete v-model="form.owner" :data-source="users" />
              </a-form-model-item>
            </a-col>
            <!-- / 申请医生 -->
          </a-row>

        </a-form-model>
        <!-- E 表单 -->

      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import OSS from '@/utils/oss'
import { getUsers } from '@/api/login'
import { updateScan } from '@/api/workspace'

export default {
  name: 'CaseAssignModel',
  data () {
    return {
      visible: false,
      confirmLoading: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      form: {},
      users: [],
      user_ids: [],
      ids:[]
    }
  },
  async created () {
    try {
      //let users= this.loadUser
      const parameter = Object.assign({}, {page: 1,page_size: 100})
      const users = await getUsers(parameter)      
      this.users = users.map(user => user.user.username)
      this.user_ids = users.map(user => user.user.id)
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    moment,
    /**
     * 打开编辑模态框
     * @param ids
     */
    edit (ids) {
      this.confirmLoading = false
      this.visible = true
      this.ids=ids
      this.form.owner='admin'
    },
    /**
     * 关闭模态框
     */
    close () {
      this.confirmLoading = false
      this.visible = false
    },
    /**
     * 确认
     */
    async handleConfirm () {
      try {
        this.confirmLoading = true
        let index = this.users.findIndex(item=>item===this.form.owner)
        let user_id = this.user_ids[index]
        for(let i=0; i<this.ids.length; i ++){
            let id=this.ids[i]
            await updateScan(id, {owner: {id: user_id}})
        }        
        this.$message.success('已修改！')
        this.$emit('updated')
      } catch (e) {
        this.$message.error('修改失败！')
      } finally {
        this.confirmLoading = false
        this.visible = false
      }
    },
    /**
     * 取消
     */
    handleCancel () {
      this.visible = false
    }
  }
}
</script>

<style scoped>

</style>
