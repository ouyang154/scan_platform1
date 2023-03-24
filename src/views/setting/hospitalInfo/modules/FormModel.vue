/**
* 医院信息修改模态框
* Date: 2020/6/9
* Time: 7:05 下午
*/
<template>
  <div class="form-model">
    <a-modal
      title="编辑医院信息"
      :width="860"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleConfirm"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">

        <!-- S 表单 -->
        <a-form-model
          v-if="form"
          ref="ruleForm"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-row :gutter="16">
            <!-- / 医院名 -->
            <a-col :md="12" :sm="24">
              <a-form-model-item ref="name" label="医院" prop="name">
                <a-input v-model="form.name" />
              </a-form-model-item>
            </a-col>
            <!-- / 医院logo -->
            <a-col :md="12" :sm="24">
              <a-form-model-item ref="logo" label="医院图标">
                <el-upload
                  :action="'/api/reports/' + form.id + '/hospital_logo/'"
                  :file-list="fileList"
                  :headers="headers"
                  list-type="picture">
                  <el-button size="median" type="primary">上传</el-button>
                </el-upload>
              </a-form-model-item>
            </a-col>
            <!-- / 地址 -->
            <a-col :md="12" :sm="24">
              <a-form-model-item ref="address" label="地址">
                <a-input v-model="form.address" />
              </a-form-model-item>
            </a-col>          
            <!-- / 邮编 -->
            <a-col :md="12" :sm="24">
              <a-form-model-item ref="poster_code" label="邮编">
                <a-input v-model="form.poster_code" />
              </a-form-model-item>
            </a-col>            
            <!-- / 病例诊断中心 -->
            <a-col :md="12" :sm="24">
              <a-form-model-item ref="pathology_tel" label="病例诊断中心">
                <a-input v-model="form.pathology_tel" />
              </a-form-model-item>
            </a-col>            
            <!-- / 咨询 -->
            <a-col :md="12" :sm="24">
              <a-form-model-item ref="consult_sel" label="咨询">
                <a-input v-model="form.consult_sel" />
              </a-form-model-item>
            </a-col>            
            <!-- / 网址 -->
            <a-col :md="12" :sm="24">
              <a-form-model-item ref="internet_url" label="网址">
                <a-input v-model="form.internet_url" />
              </a-form-model-item>
            </a-col>            
            <!-- / 细胞量阈值 -->
            <a-col :md="12" :sm="24">
              <a-form-model-item ref="satisfaction_nucleus_count" label="细胞量阈值">
                <a-input v-model="form.satisfaction_nucleus_count" />
              </a-form-model-item>
            </a-col>            
            <!-- / 报告截图倍数 -->
            <a-col :md="12" :sm="24">
              <a-form-model-item ref="report_zoom_level" label="报告截图倍数">
                <a-auto-complete v-model="form.report_zoom_level" :data-source="zoom_levels" />
              </a-form-model-item>
            </a-col>         
            <a-col :md="12" :sm="24">
              <a-form-model-item label="报告审核级别">
                <a-radio-group v-model="form.report_process">
                  <a-radio value="one_level">一级审核</a-radio>
                  <a-radio value="two_level">二级审核</a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>    
            <a-col :md="12" :sm="24">
              <a-form-model-item label="分配任务">
                <a-switch checked-children="开" un-checked-children="关" v-model="form.assign_scan" />
              </a-form-model-item>
            </a-col>    
            <!-- / 玻片医院简称  -->
            <a-col :md="12" :sm="24">
              <a-form-model-item ref="sp_barcode_hospital_name" label="玻片医院简称">
                <a-input v-model="form.sp_barcode_hospital_name" />
              </a-form-model-item>
            </a-col>
          </a-row>

        </a-form-model>

      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { modifyHospital } from '@/api/workspace'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'FormModel',
  data () {
    return {
      visible: false,
      confirmLoading: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      form: {},
      fileList: [],
      headers: {},
      rules: {
        name: [
          { required: true, message: '请输入医院名称！', trigger: 'blur' }
        ]
      },
      zoom_levels:['4','10','20','40','60','80']
    }
  },
  methods: {
    /**
     * 打开编辑模态框
     * @param record
     */
    edit (record) {
      this.confirmLoading = false
      this.visible = true
      this.form = record
      const token = Vue.ls.get(ACCESS_TOKEN)
      this.headers['Authorization'] = `token ${token}`
      if(this.form.report_zoom_level){
        this.form.report_zoom_level = this.form.report_zoom_level.toString()
      }
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
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          try {
            const { id, ...parameter } = this.form
            if(parameter.report_zoom_level){
              parameter.report_zoom_level = parseInt(parameter.report_zoom_level)
            }
            // hospital logo is updated by upload button not here
            delete parameter['hospital_logo']
            await modifyHospital(id, parameter)
            this.$message.success('已修改！')
            this.$emit('updated')
          } catch (e) {
            this.$message.error('修改失败！')
          } finally {
            this.confirmLoading = false
            this.visible = false
          }
        } else {
          return false
        }
      })
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

<style>

.el-upload__input {
    display: none !important;
}

</style>
