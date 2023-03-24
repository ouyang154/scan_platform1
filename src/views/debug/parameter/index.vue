<template>
<el-row>
  <el-col :span="8"  style="border-right: 1px solid #e5e5e5;" class="tree">    
    <parameter-model ref="parametermodel" v-if="is_localhost"/>    
  </el-col>
  <el-col :span="16">
    <motion-model ref="motionmodel" v-if="is_localhost"/>
  </el-col>
  <el-col>
    <h1 v-if="!is_localhost">扫描仪只支持本地调试</h1>
  </el-col>  
</el-row>
</template>

<script>
import ParameterModel from './modules/ParameterModel'
import MotionModel from './modules/MotionModel'
export default {
  components: {
    ParameterModel,
    MotionModel
  },  
  data: () => ({
    is_localhost: true
  }),

  created () {
    
  },
  mounted (){
    let wPath = window.document.location.href;
    // 获取当前页面主机地址之后的目录，如：/admin/index
    let pathName =  this.$route.path;
    let pos = wPath.indexOf(pathName);
    // 获取主机地址，如：http://localhost:8080
    let localhostPath = wPath.substring(0, pos)
    if(localhostPath.includes('localhost')){
      this.is_localhost = true      
    }
    else{
      this.is_localhost = false
    } 
    this.$refs.parametermodel.init(this.is_localhost)
    this.$refs.motionmodel.init(this.is_localhost) 
    
       
  },
  methods: {
    
  },
};
</script>
<style lang="scss">
.tree {
  .el-tree-node {
    white-space: normal;
    .el-tree-node__content {
      height: 100%;
      align-items: start;
    }
  }
}
.part_box {
  position:relative;
  border:1px solid rgb(131, 148, 155);
  border-radius: 10px;
  margin: 10px;
}
.part_box_para {
  position:relative;
  border:1px solid rgb(131, 148, 155);
  border-radius: 10px;
  margin: 10px;
  overflow: auto;
}
.part_box_in {
  position:relative;
  border:1px solid rgba(255, 255, 255,1);
  border-radius: 10px;
}
</style>
