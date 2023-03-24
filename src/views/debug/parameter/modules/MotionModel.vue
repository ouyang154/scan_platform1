<template>
  <div style="width:100%;marginTop: '0px'">
      <a-row :gutter="10">
        <a-col :span ="12">
          <div class="part_box" style="width:98%;height:280px;"><p>轴运动控制</p> 
            <a-form-model-item style='margin-left: -30px'>
              <a-row :gutter="10">
                <ul>
                  <li v-for="(item,index) in axisList">
                      <a-col :span="4"><p style="height:24px">{{item.name}}</p></a-col>
                      <a-col :span="3"><a-button-group>
                        <a-button type="primary" :style="buttonStyleOn(item.on)" :ghost="item.on" size="small" @click="axisEnableControl(item,true)">ON</a-button>
                        <a-button type="primary" :ghost="!item.on" size="small" :style="buttonStyleOff(item.on)" @click="axisEnableControl(item,false)">OFF</a-button>
                      </a-button-group></a-col>
                      <a-col :span="1"><a-button-group>
                        <a-button type="primary" size="small" style='margin-left: -10px' @click="goHome(item)" icon="home"></a-button>
                      </a-button-group></a-col>

                      <a-col :span="7"><a-radio-group v-model="item.mvRadio" @change="onChangeMv(item)"><a-radio value="mv">移动</a-radio><a-radio value="mvto">移到</a-radio></a-radio-group></a-col>
                      <a-col :span="7"><a-auto-complete v-model="item.input" :data-source="item.inputSource" style='margin-left: -10px' :dropdown-match-select-width="false" :dropdown-style="{ width: '200px' }"/></a-col>
                      <a-col :span="1"><a-button-group>
                        <a-button type="primary" size="small" @click="runAxis(item)" icon="caret-right"></a-button>
                      </a-button-group></a-col>
                  </li>
                </ul>
              </a-row>
            </a-form-model-item>
          </div>
          <div class="part_box" style="width:98%;height:50px;"> 
            <a-form-model-item style='margin-left: -30px'>
              <a-row :gutter="10">
                <ul>
                  <li v-for="(item,index) in outList">
                      <a-col :span="6"><p style="height:24px">{{item.name}}</p></a-col>
                      <a-col :span="18"><a-button-group>
                        <a-button type="primary" :style="buttonStyleOn(item.on)" :ghost="item.on" size="small" @click="outControl(item,true)">ON</a-button>
                        <a-button type="primary" :ghost="!item.on" size="small" :style="buttonStyleOff(item.on)" @click="outControl(item,false)">OFF</a-button>
                      </a-button-group></a-col>
                  </li>
                </ul>
              </a-row>
            </a-form-model-item>       
          </div>
          <div class="part_box" style="width:98%;height:535px;">
            <p>组合控制/其他</p>
            <a-form-model-item style='margin-left: 10px;margin-top:-20px;'> 
              <a-row :gutter="10">
                <ul>
                    <li style="margin-top:3px;" v-for="(item,index) in apiList">
                      <a-col :span="4"><p style="height:15px">{{index+1}}</p></a-col>
                      <a-col :span="20"><a-button  :type="item.type" size="small" shape="round" @click="onChangeApi(item.cmd)">{{item.name}}</a-button></a-col>                                
                    </li>
                </ul>
              </a-row>
            </a-form-model-item>
          </div>
        </a-col>
        <a-col :span="12">
          <div id="camera_div" class="part_box" style="width:98%;height:450px;">
            <p>相机</p>
            <a-row :gutter="10">
              <a-col :span="24">         
                <div id="container">
                  <div style="left:10px; position: absolute; top: -10px;">
                    <a-button type="primary" size ="small" icon="camera"  @click = startCamera ></a-button>
                  </div>
                  <div style="right:10px; position: absolute; top: -10px;">
                    <a-button type="danger" size="small" icon="stop" style="margin:5px；float:right；" @click = stopCamera></a-button>
                  </div>
                  <video autoplay="true" id="videoElement" style="object-fit:fill;"></video>               
                </div>                   
              </a-col>     
            </a-row>
          </div>
          <div class="part_box" style="width:98%;height:425px;">
            <a-col :span="5"><p>运动控制指示灯 </p></a-col>
            <a-col :span="19"><a-button :type="checkRunning(running)" shape="round" style="float: right" :loading="running"/></a-col>        

            <a-form-model-item style='width:110%;margin-left: 10px; margin-right:10px;' :labelCol="{ span: 4 }" :wrapper-col="{ span: 20}" label="">
              <a-textarea v-model="run_log" placeholder="" :auto-size="{ minRows: 17, maxRows: 17 }" />
            </a-form-model-item>
          </div>
        </a-col>
      </a-row>
      <div style="margin-left:200px; position: fixed; bottom: 40px;">          
          
      </div> 
  </div>

</template>

<script>
import { scanExecuteCmd } from '@/api/scancontrol'
export default {
  name:'MotionModel',
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  data: () => ({
    vedio: null,
    mvInput:'',
    mvValue:'',
    mvSource:[],
    mvtoInput:'',
    mvtoValue:'',
    mvtoSource:[],
    zeroValue:'',
    onValue:'',
    offValue:'',
    zeroAxisList: ['x','y','xy','xyz','z',,'v','w'],
    axisList:[
      {label:'x',name:'光学平台x',on:true,input:'',inputSource:[],mvRadio:'0',mvSource:[],mvtoSource:[]},
      {label:'y',name:'光学平台y',on:true,input:'',inputSource:[],mvRadio:'0',mvSource:[],mvtoSource:[]},
      {label:'z',name:'显微镜焦点z',on:true,input:'',inputSource:[],mvRadio:'0',mvSource:[],mvtoSource:[]},
      {label:'u',name:'传送带u',on:true,input:'',inputSource:[],mvRadio:'0',mvSource:[],mvtoSource:[]},
      {label:'v',name:'玻叉v',on:true,input:'',inputSource:[],mvRadio:'0',mvSource:[],mvtoSource:['clip_to_elevator','scanner_clearance','slide_to_scanner','elevator_clearance','slide_to_clip']},
      {label:'w',name:'电梯w',on:true,input:'',inputSource:[],mvRadio:'0',mvSource:['inout_offset','next_slide'],mvtoSource:['drawer','first_slide']},
    ],
    outList:[
      {label:'light',name:'预览灯(light)',on:true}
    ],
    apiList:[
      {cmd:'motor eject', name:'放弃扫描并退出玻片匣(eject)', type:'danger'},
      {cmd:'motor uload', name:'移动玻片匣到传送带左侧(uload)', type:'primary'},
      {cmd:'motor load_clip', name:'上玻片匣到电梯(load_clip)', type:'primary'},
      {cmd:'motor mvto w first_slide', name:'电梯到第一层玻片位(first_slide)', type:'primary'},             
      {cmd:'motor mvto v slide_to_scanner', name:'推入一张玻片(in)', type:'primary', follow:'motor mvto v scanner_clearance'},      
      {cmd:'motor mvto init', name:'玻片移到初始对焦位', type:'primary'},      
      {cmd:'motor zero xy', name:'平台回Home', type:'primary'},      
      {cmd:'motor mvto v slide_to_clip', name:'推出一张玻片(out)', type:'primary', follow:'motor mvto v elevator_clearance'},
      {cmd:'motor mv w next_slide', name:'电梯下降一层(next_slide)', type:'primary'},
      {cmd:'motor mvto w drawer', name:'电梯到抽屉推出位(drawer)', type:'primary'},
      {cmd:'motor return_clip', name:'退还玻片匣到抽屉(return_clip)', type:'primary', follow:'motor mvto v elevator_clearance'},
      {cmd:'motor cancel', name:'全部停止(cancel)', type:'danger'},
      {cmd:'camera_reset', name:'重启扫描相机(camera_reset)', type:'primary'},
      // {cmd:'ping localhost -c 3', name:'ping localhost', type:'primary'},
    ],
    running: false,
    axis_run:'',
    axis_enable:'',
    run_log:'',
    radioStyle: {
        display: 'block',
        height: '20px',
        lineHeight: '20px',
        width:'200px'
    },
  }),

  created () {
  },
  mounted (){
    
  },
  methods: {
    init(val){
      
    },
    checkRunning(running){
      if(running){ return "danger"}
      else {return "primary"}
    },
    buttonStyleOn(on){
        return on? "width:20px; height:22px;text-align:center;padding-left:1px;font-size: 9px;"
            : "width:20px; height:22px;text-align:center;padding-left:1px;font-size: 9px;"
    },
    buttonStyleOff(on){
        return on? "width:20px; height:22px;text-align:left;padding-left:1px;font-size: 9px;"
            : "width:20px; height:22px;text-align:left;padding-left:1px;font-size: 9px;"
    },
    letterOn(on){
        return on ? "":"O"
    },
    letterOff(on){
        return on ? "F":""
    },
    axisEnableControl(obj,tf){
      let axisNum = this.axisList.findIndex(item=>item.label===obj.label)
      obj.on = tf
      this.axisList[axisNum] = obj
      let run_code = 'motor on '+obj.label
      if(!tf){run_code = 'motor off '+obj.label}
      this.runMotor(run_code)
    },
    goHome(obj){
      let run_code = 'motor zero '+obj.label
      this.runMotor(run_code)
    },
    onChangeMv(obj){
      let axisNum = this.axisList.findIndex(item=>item.label===obj.label)
      for (var i = 0; i < this.axisList.length; i++){
        if (this.axisList[i].label!=obj.label){
          this.axisList[i].mvRadio = '0'
          this.axisList[i].input = ''
          this.axisList[i].inputSource = []
        }
      }
      if(obj.mvRadio==='mv'){obj.inputSource=obj.mvSource}  
      else if(obj.mvRadio==='mvto'){obj.inputSource=obj.mvtoSource}
      obj.input = ''
      this.axisList[axisNum] = obj
    },
    runAxis(obj){
      if(obj.input && (obj.mvRadio==='mv' || obj.mvRadio==='mvto')){
        let run_code = 'motor '+obj.mvRadio+' '+obj.label+' '+obj.input
        this.runMotor(run_code)
      }
      else{
        alert('请选择一个运动方式并输入步数!')
      }      
    },
    outControl(obj,tf){
      let IONum = this.outList.findIndex(item=>item.label===obj.label)
      obj.on = tf
      this.outList[IONum] = obj
      let run_code = 'motor '+obj.label+' on'
      if(!tf){run_code = 'motor '+obj.label+' off'}
      this.runMotor(run_code)
    },
    
    onChangeApi(run_code){
      let apiNum = this.apiList.findIndex(item=>item.cmd===run_code)
      if(this.apiList[apiNum].follow){
        this.runMotorMulti(run_code,this.apiList[apiNum].follow)
      }
      else{
        this.runMotor(run_code)
      }
    },
    callLight(flag){
      let run_code = 'motor light on'
      if(!flag){run_code = 'motor light off'}
      this.runMotor(run_code)
    },
    runMotor(cmd){
      if (this.running){
        alert('上一运动操作未完成，请等待')
      }
      else{
        this.$message.success('开始运行 '+cmd)
        this.running = true
        let parameter = {cmd: cmd}
        scanExecuteCmd(parameter)
        .then(res =>{
          if(res.flag){
            this.$message.success(cmd+'运行完成')
            this.run_log = '运行成功\n'
          }
          else{
            this.$message.error(cmd+'运行失败')
            this.run_log = '运行失败\n'
          }
          this.run_log = this.run_log+ res.result
          this.running =  false
        })
      }
      
    },
    runMotorMulti(cmd1, cmd2){
      if (this.running){
        alert('上一运动操作未完成，请等待')
      }
      else{
        this.$message.success('开始运行 '+cmd1)
        this.running = true
        let parameter = {cmd: cmd1}
        scanExecuteCmd(parameter)
        .then(res =>{
          if(res.flag){
            this.$message.success(cmd1+'运行完成')
            this.run_log = '运行成功\n'
            this.running =  false
            this.runMotor(cmd2)
          }
          else{
            this.$message.error(cmd1+'运行失败')
            this.run_log = '运行失败\n'
            this.running =  false
          }
          this.run_log = this.run_log+ res.result          
        })
      }      
    },
    startCamera(){
      this.video = document.querySelector("#videoElement");
      if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(function (stream) {
            this.video.srcObject = stream;
          }.bind(this))
          .catch(function (err0r) {
            console.log("Something went wrong!");
          });
      }
      this.updateRect()          
    },
    stopCamera(){
      var stream = this.video.srcObject;
      var tracks = stream.getTracks();
      for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i];
        track.stop();
      }
      this.video.srcObject = null;
    }    
  },
};
</script>
<style lang="scss">
.span {
  overflow:hidden;
  word-break: break-all; 
  width:auto; 
  display:inline-block; 
  height:20px;
  margin: 5px;
  white-space:pre-wrap;
  word-wrap : break-word ;
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
ul li {
  list-style-type:none;
  margin: 0px;
}
#container {
	margin: 0px auto;
	width: 100%;
	height: 380px;
  background-color:  #333;
	border: 0px #666 solid;
}
#videoElement {
  margin-top: -14px;
	width: 100%;
	height: 380px;
	background-color: #333;
}
.my-button {
  position: fixed;  // 浮动
  z-index: 999999;
}

.ant-form-item-label {
    margin-left: auto;
}
.a-form-model-item {
    margin-left: auto;
}
</style>
