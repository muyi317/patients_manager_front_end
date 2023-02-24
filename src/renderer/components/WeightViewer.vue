<template>
  <div>
<!--    就诊人-->
    <div style="text-align: right;">
      <div class="float-left">就诊ID: {{RecentId}}</div>
      <div class="float-left">姓名: {{RecentPatient}}</div>
      <div class="float-left">登记时间: {{VisitTime}}</div>
    </div>
<!--    重量显示面板-->
    <el-row :gutter="20">
      <el-col :span="1">
        <div style="border-radius: 4px; min-height: 4px;"></div>
      </el-col>
      <el-col :span="16">
        <div style="padding-top: 10px"></div>
        <div>
          重量1（kg）
          <el-input class="grid-content" v-model="weight1" :readonly="true"></el-input>
          重量2（kg）
          <el-input class="grid-content" v-model="weight2" :readonly="true"></el-input>
        </div>
        <div>
          重量3（kg）
          <el-input class="grid-content" v-model="weight3" :readonly="true"></el-input>
          重量4（kg）
          <el-input class="grid-content" v-model="weight4" :readonly="true"></el-input>
        </div>
        <div style="text-align: right">
          <div style="padding-top: 20px"></div>
            <el-button @click="setOriginal">恢复原始值</el-button>
            <el-button @click="setZero">当前值置零</el-button>
          <div style="padding-top: 40px"></div>
        </div>

        <div>
          总重量（kg）
          <el-input class="input-style" v-model="weightSum" :readonly="true"></el-input>
          人体重量（kg）
          <el-input class="input-style" v-model="weightPatient" :readonly="true"></el-input>
        </div>

        <div>
          床重量（kg）
          <el-input class="input-style" v-model="bedWeight" :readonly="true"></el-input>
        </div>

        <div style="padding-left: 100px; color: red">{{bedNotFound}}</div>
        <div style="padding-top: 20px"></div>
        <div style="text-align: right">
          <el-button @click="savePatientWeight">存储当前体重</el-button>
        </div>
      </el-col>

      <!--    床重面板-->
      <el-col :span="6">
        <el-button @click="weightDrawer = true"
                   type="primary"
                   style="margin-left: 50px; margin-top: 100px">
          床重面板
        </el-button>
        <el-button @click="tempDrawer = true"
                   type="primary"
                   style="margin-left: 50px; margin-top: 50px;">
          体温面板
        </el-button>
        <el-button @click="heightDrawer = true"
                   type="primary"
                   style="margin-left: 50px; margin-top: 50px;">
          身高面板
        </el-button>

        <el-drawer
            title="床重面板"
            :visible.sync="weightDrawer"
            direction="rtl">
          <div style="padding: 0px 20px 0px 20px">
            房间号
            <el-input v-model="roomNum" placeholder="请输入房间号"></el-input>
            <div style="padding: 10px"></div>
            床号
            <el-input v-model="bedNum" placeholder="请输入床号"></el-input>
            <div style="padding: 10px"></div>
            <el-button @click="saveBedWeight">床重存储</el-button>
          </div>
        </el-drawer>
        <el-drawer
            title="体温面板"
            :visible.sync="tempDrawer"
            direction="rtl">
          <div style="padding: 0px 20px 0px 20px">
            体温（°C）
            <el-input  v-model="newTemp" placeholder="请输入体温"></el-input>
            <div style="padding: 10px"></div>
            <el-button @click="updateTemp">体温存储</el-button>
          </div>
        </el-drawer>
        <el-drawer
            title="身高面板"
            :visible.sync="heightDrawer"
            direction="rtl">
          <div style="padding: 0px 20px 0px 20px">
            身高（cm）
            <el-input v-model="height" placeholder="请输入身高"></el-input>
            <div style="padding: 10px"></div>
            <el-button @click="updateHeight">身高存储</el-button>
          </div>
        </el-drawer>

      </el-col>
    </el-row>
  </div>
</template>

<script>
import StaticVariable from "./StaticVariable";
export default {
  name: "WeightViewer",
  data(){
    return{
      weight1: 0,
      weight2: 0,
      weight3: 0,
      weight4: 0,
      weightSum: 0,
      weightPatient: 0,
      bedWeight: 0,
      bedNotFound: '',
      RecentId: StaticVariable.patient.patient_id,
      RecentRoom: StaticVariable.patient.room,
      RecentBed: StaticVariable.patient.bed,
      RecentPatient: StaticVariable.patient.patient_name,
      VisitTime: StaticVariable.patient.visit_time,
      weightDrawer: false,
      tempDrawer: false,
      heightDrawer: false,
      height: null,
      patientInfo:{
        _id:0,
        temp:[],
        temp_time:[],
        weight:[],
        weight_time:[]
      },
      newTemp: null,
      bed: {
        room: '',
        bed: '',
        weight: 0.0,
      },
      roomNum: '',
      bedNum: '',
    }
  },

  methods:{
    updateHeight(){
      if(this.height!=null) {
        StaticVariable.patient.height = this.height
        this.$http.post("http://localhost:8081/patients/savePatient",StaticVariable.patient).then(result=>{
          if(result.data==="success"){
            this.$message({message: '添加成功', center: true})
          } else {
            this.$message({message: '添加失败', center: true})
          }
        })
      } else {
        this.$message("请输入身高")
      }
    },

    updateTemp(){
      if(StaticVariable.patient.id!==0){
        const _this = this
        this.$http.get('http://localhost:8081/patientsInfo/findById/'+StaticVariable.patient.id).then(result=> {
          if(_this.newTemp!=null) {
            if (result.data != null) {
              _this.patientInfo._id = StaticVariable.patient.id
              _this.patientInfo.temp = result.data.temp
              _this.patientInfo.temp.push(_this.newTemp)
              _this.patientInfo.temp_time = result.data.temp_time
              _this.patientInfo.weight = result.data.weight
              _this.patientInfo.weight_time = result.data.weight_time
              const that = _this
              _this.$http.put('http://localhost:8081/patientsInfo/updatePatientTemp', _this.patientInfo)
                  .then(result =>{
                    if(result.data==="success"){
                      that.$message({message:'保存成功', center: true})
                    } else {
                      that.$message({message:'保存失败', center: true})
                    }
                  })
            } else {
              _this.patientInfo._id = StaticVariable.patient.id
              _this.patientInfo.temp = [_this.newTemp]
              _this.patientInfo.temp_time = []
              _this.patientInfo.weight = []
              _this.patientInfo.weight_time = []
              const that = _this
              _this.$http.put('http://localhost:8081/patientsInfo/updatePatientTemp', _this.patientInfo)
                  .then(result =>{
                    if(result.data==="success"){
                      that.$message({message:'保存成功', center: true})
                    } else {
                      that.$message({message:'保存失败', center: true})
                    }
                  })
            }

          } else {
            this.$message({message:'请输入体温', center: true})
            this.$message({message: '添加失败', center: true})
          }
        })
      } else {
        this.$message({message:'请选择住院人员', center:true})
      }
    },

    saveBedWeight(){
      this.bed.room = this.roomNum
      this.bed.bed = this.bedNum
      this.bed.weight = this.weightSum
      const _this = this
      this.$http.post('http://localhost:8081/bed/saveBed', this.bed).then(result=>{
        console.log(result.data)
        if(result.data==="success"){
          _this.$message({message:'存储成功', center:true})
        } else {
          _this.$message({message:'存储失败', center:true})
        }
      })
    },

    savePatientWeight(){
      if(StaticVariable.patient.id!==0&&this.bedWeight!=='未找到床重'){
        const _this = this
        this.$http.get('http://localhost:8081/patientsInfo/findById/'+StaticVariable.patient.id).then(result=> {
          if(_this.weightPatient!==0) {
            if (result.data != null) {
              _this.patientInfo._id = StaticVariable.patient.id
              _this.patientInfo.temp = result.data.temp
              _this.patientInfo.temp_time = result.data.temp_time
              _this.patientInfo.weight = result.data.weight
              _this.patientInfo.weight.push(_this.weightPatient)
              _this.patientInfo.weight_time = result.data.weight_time
              const that = _this
              _this.$http.put('http://localhost:8081/patientsInfo/updatePatientWeight', _this.patientInfo)
                  .then(result =>{
                    if(result.data==="success"){
                      that.$message({message:'保存成功', center: true})
                    } else {
                      that.$message({message:'保存失败', center: true})
                    }
                  })
            } else {
              _this.patientInfo._id = StaticVariable.patient.id
              _this.patientInfo.temp = []
              _this.patientInfo.temp_time = []
              _this.patientInfo.weight = [_this.weightPatient]
              _this.patientInfo.weight_time = []
              const that = _this
              _this.$http.put('http://localhost:8081/patientsInfo/updatePatientWeight', _this.patientInfo)
                  .then(result =>{
                    if(result.data==="success"){
                      that.$message({message:'保存成功', center: true})
                    } else {
                      that.$message({message:'保存失败', center: true})
                    }
                  })
            }
          } else {
            this.$message({message:'未找到床重', center: true})
            this.$message({message: '添加失败', center: true})
          }
        })
      } else {
        this.$message({message:'请先确认住院人员是否选取或床重是否存储', center:true})
      }
    },

    refreshUI() {
      const _this = this
      this.$http.get('http://localhost:8081/serialPort/getWeightValue').then(result=>{
        _this.weight1 = result.data[0] / 2700;
        _this.weight1 = _this.weight1.toFixed(2)*1
        _this.weight2 = result.data[1] / 2700;
        _this.weight2 = _this.weight2.toFixed(2)*1
        _this.weight3 = result.data[2] / 2700;
        _this.weight3 = _this.weight3.toFixed(2)*1
        _this.weight4 = result.data[3] / 2660;
        _this.weight4 = _this.weight4.toFixed(2)*1
        _this.weightSum = _this.weight1+_this.weight2+_this.weight3+_this.weight4
        _this.weightSum = _this.weightSum.toFixed(2)*1
        if(_this.bedWeight!==0){
          _this.weightPatient = _this.weightSum - _this.bedWeight
          _this.weightPatient = _this.weightPatient.toFixed(2)*1
        }
      })
    },

    findBedWeight() {
      const _this = this
      if(StaticVariable.patient.id!==0){
        this.$http.get('http://localhost:8081/bed/findByRoomAndBed/'+StaticVariable.patient.room+'/'+StaticVariable.patient.bed+'/1/1').then(result=>{
          if(result.data.content.length!==0){
            _this.bedWeight = result.data.content[0].weight
            _this.bedNotFound = ''
          } else {
            _this.bedWeight = 0
            _this.bedNotFound = '未设置床重量'
            _this.bedWeight = 0
            _this.weightPatient = 0
          }
        })
      } else {
        _this.bedWeight = 0
      }
    },

    setZero() {
      const _this = this
      this.$http.get('http://localhost:8081/serialPort/setZero/'+this.weight1+'/'+this.weight2+'/'+this.weight3+'/'+this.weight4).then(result=>{
        if(result.data==="success"){
          _this.$message({message:'调零成功'})
        } else {
          _this.$message({message:'调零失败'})
        }
      })
    },

    setOriginal() {
      const _this = this
      this.$http.get('http://localhost:8081/serialPort/setOriginal').then(result=>{
        if(result.data==="success"){
          _this.$message({message:'设置成功'})
        } else {
          _this.$message({message:'设置失败'})
        }
      })
    }
  },

  created() {
    const _this = this
    window.setInterval(() => {
      setTimeout(function(){_this.refreshUI()},0);
    },1300);
  },

  activated() {
    this.RecentId = StaticVariable.patient.patient_id
    this.RecentPatient = StaticVariable.patient.patient_name
    this.RecentRoom = StaticVariable.patient.room
    this.RecentBed = StaticVariable.patient.bed
    this.VisitTime = StaticVariable.patient.visit_time
    this.height = null
    this.newTemp = null
    this.bedNum = null
    this.roomNum = null
    this.findBedWeight()
  }
}
</script>

<style scoped>
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    width: 100px;
    padding: 10px 0;
  }
  .float-left {
    position: relative;
    padding: 0px 15px 10px 15px;
    display:inline-block;
  }
  .input-style{
    border-radius: 4px;
    min-height: 36px;
    width: 85px;
    padding: 10px 0;
  }
</style>