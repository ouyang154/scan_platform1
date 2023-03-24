<template>
  <div style="width:100%;marginTop: '0px'">
      <a-row :gutter="10">
        <a-col :span ="12">
          <div class="part_box" style="width:98%;height:150px;"><p>轴运动控制</p> 
            <div style="width:98%;marginTop: '0px'">
              <a-col :span="5"><span>{{'移动(move) : '}}</span></a-col>
              <a-col :span="13"><a-radio-group v-model="mvValue" :options="axisList" :style="radioStyle" @change="onChangeMv"/></a-col>
              <a-col :span="6"><a-auto-complete v-model="mvInput" :data-source="mvSource" /></a-col>
              <!-- <a-col :span="2"><a-button type="primary" size="small" style="margin:5px" @click="callRunMv">运行</a-button></a-col> -->
            </div>
            <div style="width:98%;marginTop: '0px'">
              <a-col :span="5"><span>{{'移到(moveto) : '}}</span></a-col>
              <a-col :span="13"><a-radio-group v-model="mvtoValue" :options="axisList" :style="radioStyle" @change="onChangeMvTo"/></a-col>
              <a-col :span="6"><a-auto-complete v-model="mvtoInput" :data-source="mvtoSource" /></a-col>
              <!-- <a-col :span="2"><a-button type="primary" size="small" style="margin:5px" @click="callRunMvTo">运行</a-button></a-col> -->
            </div>
            <div style="width:98%;marginTop: '0px'">
              <a-col :span="5"><span>{{'回原点(zero) : '}}</span></a-col>
              <a-col :span="19"><a-radio-group v-model="zeroValue" :options="zeroAxisList" :style="radioStyle" @change="onChangeZero"/></a-col>
              <!-- <a-col :span="2"><a-button type="primary" size="small" style="margin:5px" @click="callRunZero">运行</a-button></a-col> -->
            </div>
            <div style="width:98%;marginTop: '0px'">
              <a-col :span="24"><a-button type="primary" size="small" style="float: right" @click="callRunAxis">运行</a-button></a-col>
            </div>

          </div>
          <div class="part_box" style="width:98%;height:110px;"><p>轴使能控制</p> 
            <div style="width:98%;marginTop: '0px'">
              <a-col :span="5"><span>{{'轴使能开(on) : '}}</span></a-col>
              <a-col :span="17"><a-radio-group v-model="onValue" :options="axisList" :style="radioStyle" @change="onChangeOn"/></a-col>
              <a-col :span="2">{{'&nbsp;'}}</a-col>
              <!-- <a-col :span="2"><a-button type="primary" size="small" style="margin:5px" @click="callRunOn">运行</a-button></a-col> -->
            </div>
            <div style="width:98%;marginTop: '0px'">
              <a-col :span="5"><span>{{'轴使能关(off) : '}}</span></a-col>
              <a-col :span="17"><a-radio-group v-model="offValue" :options="axisList" :style="radioStyle" @change="onChangeOff"/></a-col>
              <a-col :span="2">{{'&nbsp;'}}</a-col>
              <!-- <a-col :span="2"><a-button type="primary" size="small" style="margin:5px" @click="callRunOff">运行</a-button></a-col> -->
            </div>
            <div style="width:98%;marginTop: '0px'">
              <a-col :span="24"><a-button type="primary" size="small" style="float: right" @click="callRunAxisEnable">运行</a-button></a-col>
            </div>
          </div>
          
          <div class="part_box" style="width:98%;height:75px;"><p>预览灯控制</p> 
            <div style="width:98%;marginTop: '0px'">
              <a-col :span="9"><span>{{'预览灯(light) : '}}</span></a-col>
              <a-col :span="6"><a-button type="primary" size="small" shape="round" style="margin:5px" @click="callLight(1)">开灯(on)</a-button></a-col>
              <a-col :span="9"><a-button type="danger" size="small" shape="round" style="margin:5px" @click="callLight(0)">关灯(off)</a-button></a-col>
            </div>        
          </div>
          <div class="part_box" style="width:98%;height:520px;">
            <p>组合控制/其他</p>
            <a-form-model-item style='margin-left: 10px'> 
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
    radioStyle: {
      display: 'block',
      height: '20px',
      lineHeight: '20px',
      width:'600px'
    },
    mvInput:'',
    mvValue:'',
    mvSource:[],
    mvtoInput:'',
    mvtoValue:'',
    mvtoSource:[],
    zeroValue:'',
    onValue:'',
    offValue:'',
    axisList:['x','y','z','u','v','w'],
    zeroAxisList: ['x','y','xy','xyz','z',,'v','w'],
    apiList:[
      {cmd:'motor eject', name:'放弃扫描并退出玻片匣(eject)', type:'danger'},
      {cmd:'motor uload', name:'移动玻片匣到传送带左侧(uload)', type:'primary'},
      {cmd:'motor load_clip', name:'上玻片匣到电梯(load_clip)', type:'primary'},
      {cmd:'motor mvto w first_slide', name:'电梯到第一层玻片位(first_slide)', type:'primary'},             
      {cmd:'motor in', name:'推入一张玻片(in)', type:'primary'},      
      {cmd:'motor out', name:'推出一张玻片(out)', type:'primary'},
      {cmd:'motor mv w next_slide', name:'电梯下降一层(next_slide)', type:'primary'},
      {cmd:'motor mvto w drawer', name:'电梯到抽屉推出位(drawer)', type:'primary'},
      {cmd:'motor return_clip', name:'退还玻片匣到抽屉(return_clip)', type:'primary'},
      {cmd:'motor cancel', name:'全部停止(cancel)', type:'danger'},
      {cmd:'camera_reset', name:'重启扫描相机(camera_reset)', type:'primary'},
      {cmd:'ping localhost -c 3', name:'ping localhost', type:'primary'},
    ],
    running: false,
    axis_run:'',
    axis_enable:'',
    run_log:''
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
    onChangeMv(e){
      if(e.target.value=='w'){this.mvSource=['inout_offset','next_slide']}
      else{
        this.mvSource = []
      }
      this.mvtoSource = []
      this.mvtoValue = ''
      this.zeroValue = ''
      this.mvInput = ''
      this.mvtoInput = ''
      this.axis_run='mv'
    },
    onChangeMvTo(e){
      if(e.target.value=='w'){this.mvtoSource=['drawer','first_slide']}
      else{
        this.mvtoSource = []
      }
      this.mvSource = []
      this.mvValue = ''
      this.zeroValue = ''
      this.mvInput = ''
      this.mvtoInput = ''
      this.axis_run='mvto'
    }, 
    onChangeZero(e){      
      this.mvtoSource = []
      this.mvSource = []
      this.mvValue = ''
      this.mvtoValue = ''
      this.mvInput = ''
      this.mvtoInput = ''
      this.axis_run='zero'
    }, 
    callRunAxis(){
      if(this.axis_run=='mv'){this.callRunMv()}
      if(this.axis_run=='mvto'){this.callRunMvTo()}
      if(this.axis_run=='zero'){this.callRunZero()}
    },
    callRunMv(){
      console.log(this.mvInput)
      if(this.mvInput && this.mvValue){
        let run_code = 'motor mv '+this.mvValue+' ' + this.mvInput.toString()
        this.runMotor(run_code)
      }
      else{
        alert('请选择一个运动轴并输入步数!')
      }      
    },
    callRunMvTo(){
      if(this.mvtoInput && this.mvtoValue){
        let run_code = 'motor mvto '+this.mvtoValue+' ' + this.mvtoInput.toString()
        this.runMotor(run_code)
      }
      else{
        alert('请选择一个运动轴并输入步数!')
      }      
    },
    callRunZero(){
      if(this.zeroValue){
        let run_code = 'motor zero '+this.zeroValue
        this.runMotor(run_code)
      }
      else{
        alert('请选择一个运动轴!')
      }      
    },
    onChangeOn(e){
      this.offValue = ''
      this.axis_enable = 'on'
    },
    onChangeOff(e){
      this.onValue = ''
      this.axis_enable = 'off'
    },
    callRunAxisEnable(){
      if(this.axis_enable=='on'){this.callRunOn()}
      if(this.axis_enable=='off'){this.callRunOff()}
    },
    callRunOn(){
      if(this.onValue){
        let run_code = 'motor on '+this.onValue
        this.runMotor(run_code)
      }
      else{
        alert('请选择一个运动轴!')
      }      
    },
    callRunOff(){
      if(this.offValue){
        let run_code = 'motor off '+this.offValue
        this.runMotor(run_code)
      }
      else{
        alert('请选择一个运动轴!')
      }      
    },
    onChangeApi(run_code){
      this.runMotor(run_code)
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
