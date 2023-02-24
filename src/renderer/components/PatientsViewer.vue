<template>
  <div>
    <div style="text-align: right;">
      就诊ID <el-input style="width: 150px; padding: 0px 25px 0px 0px"
                     v-model="newId"
                     placeholder="请输入ID"></el-input>
      姓名 <el-input style="width: 150px; padding: 0px 25px 0px 0px"
                   v-model="newName"
                   placeholder="请输入姓名"></el-input>
      <el-button @click="search">查询</el-button>
      <el-button @click="deletePatient">删除</el-button>
    </div>

    <el-table
        ref="singleTable"
        :data="tableData"
        highlight-current-row
        @current-change="handleCurrentChange"
        style="width: 100%">
      <el-table-column type="index" width="30"></el-table-column>
      <el-table-column v-if="false" property="id" label="id" width="30"></el-table-column>
      <el-table-column property="patient_id" label="就诊ID" width="90"></el-table-column>
      <el-table-column property="patient_name" label="姓名" width="90"></el-table-column>
      <el-table-column property="room" label="房间号" width="90"></el-table-column>
      <el-table-column property="bed" label="床号" width="80"></el-table-column>
      <el-table-column property="height" label="身高" width="70"></el-table-column>
      <el-table-column property="visit_time" label="就诊日期" ></el-table-column>
    </el-table>

    <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="7"
        style="padding: 10px 0; text-align: center"
        @current-change="page">
    </el-pagination>

  </div>
</template>

<script>
import StaticVariable from "./StaticVariable";
export default {
  name: "PatientsViewer",
  data() {
    return {
      newId: "",
      newName: "",
      searchId: "*",
      searchName: "*",
      tableData: [],
      currentRow: null,
      total: null,
      selectedPage: 1,
    }
  },

  methods: {
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
      if(val !== null){
        StaticVariable.patient = val;
      } else {
        StaticVariable.patient.id=0
        StaticVariable.patient.patient_id=""
        StaticVariable.patient.patient_name=""
        StaticVariable.patient.room=""
        StaticVariable.patient.visit_time=""
        StaticVariable.patient.bed=""
        StaticVariable.patient.height=0
      }
    },
    page(currentPage){
      this.selectedPage = currentPage
      const _this = this
      this.$http.get('http://localhost:8081/patients/findByIdAndName/'+this.searchId+'/'+this.searchName+'/'+currentPage+'/7')
          .then(result => {
            _this.tableData = result.data.content
            _this.total = result.data.totalElements
          })
    },
    search(){
      if(this.newId === ""){
        this.searchId = "*"
      }else{
        this.searchId = this.newId
      }
      if(this.newName === ""){
        this.searchName = "*"
      }else{
        this.searchName = this.newName
      }
      const _this = this
      this.$http.get('http://localhost:8081/patients/findByIdAndName/'+this.searchId+'/'+this.searchName+'/1/7')
          .then(result => {
            _this.tableData = result.data.content
            _this.total = result.data.totalElements
          })
    },
    deletePatient(){
      if(this.currentRow!==null){
        const _this = this
        this.$http.get('http://localhost:8081/patients/deleteById/'+this.currentRow.id).then(resp=>{
          if(resp.status===200){
            _this.$http.get('http://localhost:8081/patientsInfo/deletePatientInfoById/'+StaticVariable.patient.id)
            _this.$message({message:'删除成功', center:true})
            _this.page(_this.selectedPage)
          } else {
            _this.$message({message:'删除失败', center:true})
          }
        })
      }else{
        this.$message({message:'请选择一个住院人员', center:true})
      }
    }
  },

  created() {
    const _this = this
    this.$http.get('http://localhost:8081/patients/findByIdAndName/'+this.searchId+'/'+this.searchName+'/1/7')
        .then(result => {
      _this.tableData = result.data.content
      _this.total = result.data.totalElements
    })
  },

  // activated() {
  //   this.page(this.selectedPage)
  // }
}
</script>

<style scoped>

</style>