/**
* 医院信息
* Date: 2020/5/26
* Time: 12:16 下午
*/
<template>
  <a-card :bordered="false">
      <div class="data-management">     

        <!-- S 数据删除及上传设置 -->
        <div v-show="true" >
          <a-row>
            <a-col :span="12">
              <!-- S 阳性 -->
              <a-form-model
                ref="ruleForm"
                :model="Form"
              >
                <a-form-model-item >
                  <a-radio-group v-model="Form.disabled"> <strong>删除方式 : </strong>                
                    <a-radio :value="true">手动删除</a-radio>
                    <a-radio :value="false">自动删除</a-radio>
                  </a-radio-group>
                </a-form-model-item>
                <div v-if="!Form.disabled">
                    <a-form-model-item > 每日
                    <a-auto-complete style='width: 60px' v-model="Form.hour_of_day" :data-source="hours" /> 时开启删除进程
                    </a-form-model-item>
                    <a-form-model-item>
                    <a-radio-group v-model="Form.data_kept_days"> <strong>阳性病例保留时间 : </strong>
                        <a-radio :value="7">周</a-radio>
                        <a-radio :value="15">两周</a-radio>
                        <a-radio :value="21">三周</a-radio>
                        <a-radio :value="30">月</a-radio>
                        <a-radio :value="90">季度</a-radio>
                        <a-radio :value="365">年</a-radio>
                        <a-radio :value="100000">永久</a-radio>
                    </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item>
                    <a-radio-group v-model="Form.keep_results"> <strong>阳性病例是否保留阳性区域 : </strong> 
                        <a-radio :value="true">Y</a-radio>
                        <a-radio :value="false">N</a-radio>
                    </a-radio-group>            
                    </a-form-model-item>

                    <a-form-model-item>
                    <a-radio-group v-model="Form.negative_data_kept_days"> <strong>阴性病例保留时间 : </strong>
                        <a-radio :value="7">周</a-radio>
                        <a-radio :value="15">两周</a-radio>
                        <a-radio :value="21">三周</a-radio>
                        <a-radio :value="30">月</a-radio>
                        <a-radio :value="90">季度</a-radio>
                        <a-radio :value="365">年</a-radio>
                        <a-radio :value="100000">永久</a-radio>
                    </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item>
                    <a-radio-group v-model="Form.negative_keep_results"> <strong>阴性病例是否保留阳性区域 : </strong>
                        <a-radio :value="true">Y</a-radio>
                        <a-radio :value="false">N</a-radio>
                    </a-radio-group>            
                    </a-form-model-item>
                </div>
                
              </a-form-model>
              <!-- E 阳性 -->
            </a-col>
          </a-row>  
            <!-- S 确定 -->
          <a-row>
            <a-col :span="24">
                <a-button type="primary" @click="save">确认并保存设置</a-button>
            </a-col>
          </a-row>
            <!-- E 确定 --> 
        </div>
        <!-- E 数据删除及上传设置 -->



      </div>
  </a-card>
</template>

<script>
import { getTaskList, updateTask } from '@/api/workspace'

export default {
  name: 'DataManagement',
  components: {
  },
  data () {
    return {
      Form:{
        task_name: '', 
        data_kept_days: '', 
        keep_results: '', 
        disabled: true, 
        minute_of_hour: 0, 
        hour_of_day: 4,
        negative_data_kept_days: '',
        negative_keep_results: ''
      },
      positiveDelForm:{
        id:'',
        task_name: '', 
        data_kept_days: '', 
        keep_results: '', 
        disabled: true, 
        minute_of_hour: 0, 
        hour_of_day: 4
      },
      negativeDelForm:{
        id:'',
        task_name: '', 
        data_kept_days: '', 
        keep_results: '', 
        disabled: true, 
        minute_of_hour: 0, 
        hour_of_day: 4
      },
      hours:['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24']
    }
  },
  created () {
    this.getTaskInfo()
  },
  methods: {
    /**
     * 编辑医院信息
     */
    async save () {
        try {            
            await updateTask(this.positiveDelForm.id,{
                data_kept_days: this.Form.data_kept_days,
                keep_results:  this.Form.keep_results,
                disabled: this.Form.disabled,
                hour_of_day: parseInt(this.Form.hour_of_day)
            })
            await updateTask(this.negativeDelForm.id,{
                data_kept_days: this.Form.negative_data_kept_days,
                keep_results:  this.Form.negative_keep_results,
                disabled: this.Form.disabled,
                hour_of_day: parseInt(this.Form.hour_of_day)
            })
            this.$message.success('已修改！')             
        } catch (e) {
            this.$message.error('修改异常！')
        }

      
    },

    /**
     * 获取数据删除信息
     */
    async getTaskInfo () {
      try {
        await getTaskList()
          .then(res => {
            this.positiveDelForm = res[4]
            this.negativeDelForm = res[1]
            this.Form={
              task_name: this.positiveDelForm.task_name,
              data_kept_days: this.positiveDelForm.data_kept_days,
              keep_results:  this.positiveDelForm.keep_results,
              disabled: this.positiveDelForm.disabled,
              minute_of_hour:  this.positiveDelForm.minute_of_hour.toString(),
              hour_of_day: this.positiveDelForm.hour_of_day.toString(),
              negative_data_kept_days: this.negativeDelForm.data_kept_days,
              negative_keep_results: this.negativeDelForm.keep_results
            }      
          })

      } catch (e) {
        this.$message.error('数据获取异常')
      }
    },
  }
}
</script>

<style scoped>

</style>
