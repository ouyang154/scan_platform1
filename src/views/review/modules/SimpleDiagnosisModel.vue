/**
*
* Date: 2020/6/5
* Time: 11:08 下午
*/
<template>
  <div class="department-form-model">
        <!-- S 表单 -->
        <a-form-model
            ref="ruleForm"
            :model="form"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            class="report-diagnose__form"
        >

            <a-row :gutter="16">
                <a-col :span="span">
                    <a-form-model-item ref="specimen_satisfaction" label="样本满意度" :labelCol="{ span: 8 }" :wrapper-col="{ span: 16}">
                        <a-auto-complete :value="formatSatisfy(form.specimen_satisfaction)" :data-source="specimen_satisfaction" @select="onSelectSatisfy"/>
                    </a-form-model-item>
                </a-col>
                <a-col :span="span">
                    <a-form-model-item ref="cell_count" label="细胞量" :labelCol="{ span: 8 }" :wrapper-col="{ span: 16}">
                        <a-auto-complete :value="formatCount(form.cell_count)" :data-source="cell_count" @select="onSelectCount"/>
                    </a-form-model-item>
                </a-col>
                <a-col :span="span">
                    <a-form-model-item ref="gland_cell" label="颈管细胞" :labelCol="{ span: 8 }" :wrapper-col="{ span: 16}">
                        <a-auto-complete :value="formatBool2Str(form.gland_cell)" :data-source="bool_list" @select="onSelectGland"/>
                    </a-form-model-item>
                </a-col>
                <a-col :span="span">
                    <a-form-model-item ref="metaplasia_cell" label="化生细胞" :labelCol="{ span: 8 }" :wrapper-col="{ span: 16}">
                        <a-auto-complete :value="formatBool2Str(form.metaplasia_cell)" :data-source="bool_list" @select="onSelectMetaplasia"/>
                    </a-form-model-item>
                </a-col>
                <a-col :span="span">
                    <a-form-model-item ref="trichomonas_vaginalis" label="滴虫感染" :labelCol="{ span: 8 }" :wrapper-col="{ span: 16}">
                        <a-auto-complete :value="formatBool2Str(form.trichomonas_vaginalis)" :data-source="bool_list" @select="onSelectTrichomonas"/>
                    </a-form-model-item>
                </a-col>
                <a-col :span="span">
                    <a-form-model-item ref="candida_albicans" label="霉菌感染" :labelCol="{ span: 8 }" :wrapper-col="{ span: 16}">
                        <a-auto-complete :value="formatBool2Str(form.candida_albicans)" :data-source="bool_list" @select="onSelectCandida"/>
                    </a-form-model-item>
                </a-col>
                <a-col :span="span">
                    <a-form-model-item ref="herpes" label="疱疹感染" :labelCol="{ span: 8 }" :wrapper-col="{ span: 16}">
                        <a-auto-complete :value="formatBool2Str(form.herpes)" :data-source="bool_list" @select="onSelectHerpes"/>
                    </a-form-model-item>
                </a-col>
                <a-col :span="span">
                    <a-form-model-item ref="koilocyte" label="挖空细胞" :labelCol="{ span: 8 }" :wrapper-col="{ span: 16}">
                        <a-auto-complete :value="formatBool2Str(form.koilocyte)" :data-source="bool_list" @select="onSelectKoilocyte"/>
                    </a-form-model-item>
                </a-col>
                <a-col :span="24">
                    <a-form-model-item :labelCol="{ span: 4 }" :wrapper-col="{ span: 20}" label="细胞诊断">
                        <a-textarea v-model="diagnosis_info"
                        placeholder="请填写诊断"
                        :auto-size="{ minRows: 3, maxRows: 5 }"
                        />
                    </a-form-model-item>
                    <a-form-model-item :labelCol="{ span: 4 }" :wrapper-col="{ span: 20}" label="补充意见">
                        <a-auto-complete v-model="suggestion1" :data-source="suggestion_list" />
                    </a-form-model-item>
                </a-col>
                <br><br><br>
                <a-divider orientation="center" class="patient-form-content__divider" font-size="90%">病理诊断</a-divider>
                <a-col :span="24">
                    <div :style="{ width: '100%',overflow:'scroll'}">
                      <el-tree
                        :data="diagnosisList"
                        class="tree_app"
                        @node-click="handleNodeClick">
                      </el-tree>
                    </div>
                </a-col>


            </a-row>
        </a-form-model>
        <!-- / 表单 -->
  </div>
</template>

<script>
import { updateScan } from '@/api/workspace'


export default {
  name: 'DiagnosisModel',
  data () {
    return {
        visible: false,
        confirmLoading: false,
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
        form: {
            specimen_satisfaction: 1,
            cell_count: 1,
            gland_cell: false,
            metaplasia_cell: false,
            trichomonas_vaginalis: false,
            candida_albicans: false,
            herpes: false,
            koilocyte: false
        },
        specimen_satisfaction: ['满意','基本满意','重新采样'],
        cell_count: ['>40%','<40%','>5000','<5000'],
        bool_list: ['有','无'],
        suggestion1:'',
        diagnosis_info: '',
        diagnosis_head: '',
        diagnosisList: [
            {id:1, label:'无上皮内病变或恶性病变-NILM'},
            {id:2, label:'无上皮内病变或恶性病变-NILM（炎性改变）'},
            {id:3, label:'无上皮内病变或恶性病变-NILM（表皮细胞萎缩）'},
            {id:4, label:'鳞状细胞',children: [
                {id: 101,label:'非典型鳞状上皮细胞，不能明确诊断意义（ASCUS）'},
                {id: 102,label:'非典型鳞状上皮细胞，不能除外高级别鳞状上皮（ASC-H）'},
                {id: 103,label:'低度鳞状上皮内病变 —（LSIL）'},
                {id: 104,label:'高度鳞状上皮内病变 —（HSIL）'},
                {id: 105,label:'鳞状细胞癌'}
            ]},
            {id:5, label:'腺细胞',children: [
                {id: 106,label:'非典型腺细胞，倾向瘤变（AGC-FN）'},
                {id: 107,label:'非典型腺细胞，未明确意义（AGC-NOS）'},
                {id: 108,label:'腺癌'},
                {id: 109,label:'原位腺癌'}
            ]},
            {id:6, label:'有子宫内膜细胞'},
            {id:7, label:'轻度炎症'},
            {id:8, label:'中度炎症'},
            {id:9, label:'重度炎症'}
        ],
        suggestion_list: [
            '有非典型细胞，建议3-6个月复查。',
            '请阴道镜检查及活检。',
            '可见霉菌感染。',
            '可见滴虫感染。',
            '线索细胞大于20%。',
            '有子宫内膜细胞，请进一步检查。',
            '上皮细胞较少，结果供参考。',
            '极少上皮细胞，需要重新采样。'
        ]
    }
  },
  computed: {
    span () {
      return true ? 12 : 12
    }
  },
  methods: {
    //初始化
    async init(val){
        this.id = val.id;
        if(val.diagnosisValue){
          this.form= val.diagnosisValue;
          this.form.report_type = 2
        }
        else{
            this.updateDiagnosis(false)
        }
        if(val.suggestion1){
            this.suggestion1=val.suggestion1
        }
        if(val.diagnosis_info){
            this.diagnosis_info=val.diagnosis_info
        }
    },
    get_diagnosisValue(){
        return this.form
    },
    updateDiagnosis:function(flagStatus){
        updateScan(this.id, {
            diagnosisValue: this.form,
            suggestion1: this.suggestion1,
            diagnosis_info: this.diagnosis_info
        })
    },
    formatSatisfy(value){
        return value ==1? "满意"
              :value ==2? "基本满意"
              :value ==3? "重新采样"
              :"满意";
    },
    formatCount(value){
        return value ==1? ">40%"
              :value ==2? "<40%"
              :value ==3? ">5000"
              :value ==4? "<5000"
              :">40%";
    },
    formatBool2Str(value){
        return value?'有':'无'
    },
    onSelectSatisfy(value){
        this.form.specimen_satisfaction = (
            value=="满意"? 1
            : value=="基本满意"? 2
            : value=="重新采样"? 3
            : 1)
    },
    onSelectCount(value){
        this.form.cell_count = (
            value==">40%"? 1
            : value=="<40%"? 2
            : value==">5000"? 3
            : value=="<5000"? 4
            : 1)
    },
    onSelectGland(value){this.form.gland_cell = (value=="有"? true : false)},
    onSelectTrichomonas(value){this.form.trichomonas_vaginalis = (value=="有"? true : false)},
    onSelectMetaplasia(value){this.form.metaplasia_cell = (value=="有"? true : false)},
    onSelectCandida(value){this.form.candida_albicans = (value=="有"? true : false)},
    onSelectHerpes(value){this.form.herpes = (value=="有"? true : false)},
    onSelectKoilocyte(value){this.form.koilocyte = (value=="有"? true : false)},
    handleNodeClick(data) {
        if (data.children== undefined){
            if(data.id<100){
                this.diagnosis_head=data.label
            }
            else{
                this.diagnosis_head=this.diagnosis_head.concat(data.label)
            }
            this.diagnosis_info=this.diagnosis_info.concat(this.diagnosis_head)
            this.diagnosis_info=this.diagnosis_info.concat(' ')
            this.diagnosis_head=''
        }
        else{
            this.diagnosis_head=data.label
        }

    },
  }
}
</script>

<style scoped>
.ant-form-item-label {
    margin-left: auto;
}
.a-form-model-item {
    margin-left: auto;
}

</style>
