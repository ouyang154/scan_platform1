<template>
<el-row>
  <el-col :span="24"  style="border-right: 1px solid #e5e5e5;" class="tree">
    <div class="part_box_para" style="width:98%;height:40px;background-color: rgb(148, 211, 248);">
      <span>{{'&nbsp;&nbsp;参数设置&nbsp;&nbsp;'}}</span>
      <a-button type="primary" icon="reset" size="small" style="float: left,marginBottom:10" @click="reset">重置</a-button>
      <el-input
        size="mini"
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>
      <a-button type="primary" icon="save" size="small" style="float: right,marginBottom:10" @click="submit">保存</a-button>
    </div>
    <div class="part_box_para" style="width:98%;height:835px;">
      <el-tree
        :data="data"
        node-key="id"
        default-expand-all
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        ref="tree">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span >{{ node.label }}</span>
          <span v-if="data.name" >{{'('}}{{ data.name }}{{')'}}</span>
          <span >{{'&nbsp;&nbsp;&nbsp;'}}</span>
          <el-input v-if="!((data.children && data.children.length) | data.type == 'boolean' | data.type == 'object')" v-model="data.input" size="mini" placeholder="请输入内容" :title="data.description"></el-input>
          <a-switch size="small" v-if="(!(data.children && data.children.length)) && data.type == 'boolean'" :checked="data.input" checked-children="T" un-checked-children="F" @click="data.input=!data.input"/>
          <span v-if="(!(data.children && data.children.length)) && data.type == 'object'">{{data.input}}</span>
        </span>
      </el-tree>
    </div>

  </el-col>  
</el-row>
</template>

<script>
import { getScanConfig, updateScanConfig} from '@/api/scancontrol'
export default {
  name:'ParameterModel',
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  data: () => ({
    filterText: '',
    data:[],
    ori_data:[],
    json_data:{
      sitename: 'dev',
      dataroot: '/media/cw/data',
      log_level: {
        sink:{
          stdout: 1,
          logfile: 1.5,
          harr:[[0,1],[1,0]],
          hflag: true
        }
      }
    },
    json_name:{}
  }),

  created () {
    setTimeout(() => {
      this.$refs.tree.filter(this.filterText);
    }, 300)
  },
  async mounted (){
    try {
      getScanConfig()
      .then(res =>{
        this.json_data = res.config_file
        this.json_name = res.name_file
        this.json_description = res.description_file
        this.data = this.json2tree(this.json_data,this.json_name,this.json_description)
      })
    } catch (e) {
      console.log(e)
    }    
  },
  methods: {
    init(val){
      
    },
    async submit() {
      try {
        let parameter = {config_file:this.tree2json(this.data)}
        updateScanConfig(parameter)
        .then(res =>{
          if(res == "ok"){
            this.$message.success('参数文件已更新！')
          }
          else{
            this.$message.error('参数更新异常！')
          }
        })
      } catch (e) {
        this.$message.error('参数更新异常！')
      }
      
      //console.log(this.json2tree(this.json_data));
    },
    reset() {
      this.data = this.json2tree(this.json_data,this.json_name,this.json_description) 
      setTimeout(() => {
        this.$refs.tree.filter(this.filterText);
      }, 300)  
    },
    json2tree(nodes,names,descriptions) {
      var r = []
      if(Object.keys(nodes)){
        var arr = Object.keys(nodes)
        for (var i=0, l=arr.length; i<l; i++) {
          let tmp = nodes[arr[i]]
          let name_tmp = names[arr[i]]
          let description_tmp = descriptions[arr[i]]
          if (this.is_obj(tmp)){
            r.push({id:i,label:arr[i],children:this.json2tree(tmp,name_tmp,description_tmp)})
          }
          else{
            r.push({id:i,label:arr[i],type:typeof(tmp),input:tmp,name:name_tmp,description:description_tmp})
          } 
        }
      }
      return r;
    },
    is_obj:function(val){
      return Object.prototype.toString.call(val) === '[object Object]'
    },
    tree2json(nodes) {
      var r={};
      if (Array.isArray(nodes)) {
        for (var i=0, l=nodes.length; i<l; i++) {
          if (Array.isArray(nodes[i]["children"])&&nodes[i]["children"].length>0){
            // 若存在children则递归调用，把数据拼接到新数组中，并且删除该children
            this.$set(r,nodes[i]['label'],this.tree2json(nodes[i]["children"]));
          }
          else{
            if(nodes[i]['type'] == 'number'){
              if(nodes[i]['input'].toString().indexOf(".") > -1){
                nodes[i]['input']=parseFloat(nodes[i]['input'])
              }
              else{
                nodes[i]['input']=parseInt(nodes[i]['input'])
              }
            }
            else if (nodes[i]['type'] == 'boolean'){nodes[i]['input']=(nodes[i]['input'])}
            else if (nodes[i]['type'] == 'object'){nodes[i]['input']=(nodes[i]['input'])}
            else {nodes[i]['input']=(nodes[i]['input']).toString()}
            this.$set(r,nodes[i]['label'],nodes[i]['input'])
          }          
        }
      }
      return r;
    },
    filterNode(value, data) {
      if (!value) return this.checkName(data);
      return data.label.indexOf(value) !== -1;
    },
    checkName(data){
      if(data.name) return true
      return false
    }
  },
};
</script>
<style lang="scss">
.form {
  text-align: left;
  width: 90%;
  margin: auto;
}

h2 {
  font-size: 1.7em;
  text-align: center;
  margin-top: 0;
  margin-bottom: 0.2em;
}

h2 + small {
  display: block;
  text-align: center;
  margin-bottom: 1.2em;
}

small {
  line-height: 20px;
  display: block;
}

.el-alert {
  margin-bottom: 15px;
}

.el-form .sub {
  margin-left: 10%;
}

.json {
  text-align: left;
}
.el-input{
  padding: 5px; 
  margin-right: 5px;
  width:200px;
  overflow-x:visible;
}
.el-input__inner {
  margin-left: 5px;
  background-color: rgb(196, 255, 250);
  box-sizing: border-box;
}
.span {
  overflow:hidden;
  word-break: break-all; 
  width:auto; 
  display:block; 
  white-space:pre-wrap;
  word-wrap : break-word ;
}
.tree {
  .el-tree-node {
    white-space: normal;
    .el-tree-node__content {
      height: 100%;
      align-items: start;
    }
  }
}
.part_box_para {
  position:relative;
  border:1px solid rgb(131, 148, 155);
  border-radius: 10px;
  margin: 10px;
  overflow: auto;
}
</style>
