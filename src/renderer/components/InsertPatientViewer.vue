<template>
  <div style="text-align: center; height: 470px; position: relative; font-size: x-large">卧床称重远程监测系统
    <div style="text-align: left;
                width: 540px;
                height: 180px;
                position: absolute;
                transform:translate(-50%,-50%);
                top:50%;
                left:50%;
                font-size: medium">
      就诊ID <el-input style="width: 160px; padding: 10px 25px 0px 0px"
                     v-model="newPatient.patient_id"
                     placeholder="请输入就诊ID"></el-input>
      姓名 <el-input style="width: 160px; padding: 10px 90px 0px 0px"
                   v-model="newPatient.patient_name"
                   placeholder="请输入姓名"></el-input>
      房间号 <el-input style="width: 160px; padding: 10px 25px 0px 0px"
                     v-model="newPatient.room"
                     placeholder="请输入房间号"></el-input>
      床号 <el-input style="width: 160px; padding: 10px 25px 10px 0px"
                   v-model="newPatient.bed"
                   placeholder="请输入床号"></el-input>
      <el-button @click="insert">添加</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "InsertPatientViewer",
  data() {
    return{
      newPatient: {
        Patient_id: '',
        Patient_name: '',
        Room: '',
        Bed: '',
        Height: 0,
        Weight: 0,
        Temp: 0,
        Visit_time: ''
      }
    }
  },

  methods: {
    insert(){
      this.$http.post('http://localhost:8081/patients/savePatient',this.newPatient)
          .then(result => {
            if(result.data==="success"){
              this.$message({message: '添加成功', center: true})
            } else {
              this.$message({message: '添加失败', center: true})
            }
      })
      }

  }
}
</script>

<style scoped>

</style>