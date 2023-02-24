<template>
  <div>
    <div style="text-align: right;">
      房间号 <el-input style="width: 150px; padding: 0px 25px 0px 0px"
                     v-model="bed"
                     placeholder="请输入房间号"></el-input>
      床号 <el-input style="width: 150px; padding: 0px 25px 0px 0px"
                   v-model="room"
                   placeholder="请输入床号"></el-input>
      <el-button @click="search">查询</el-button>
      <el-button @click="deleteBed">删除</el-button>
    </div>

    <el-table
        ref="singleTable"
        :data="tableData"
        highlight-current-row
        @current-change="handleCurrentChange"
        style="width: 100%">
      <el-table-column type="index" width="80"></el-table-column>
      <el-table-column v-if="false" property="id" label="id" width="210"></el-table-column>
      <el-table-column property="room" label="房间号" width="210"></el-table-column>
      <el-table-column property="bed" label="床号" width="210"></el-table-column>
      <el-table-column property="weight" label="床重（kg）" ></el-table-column>
    </el-table>

    <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        style="padding: 10px 0;
        text-align: center"
        :page-size="7"
        @current-change="page">
    </el-pagination>

  </div>
</template>

<script>
import StaticVariable from "./StaticVariable";

export default {
  name: "BedViewer",
  data() {
    return {
      bed: "",
      room: "",
      searchBed: "*",
      searchRoom: "*",
      tableData: [],
      currentRow: null,
      total: null,
      selectedPage: 1
    }
  },

  methods: {
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    page(currentPage){
      this.selectedPage = currentPage
      const _this = this
      this.$http.get('http://localhost:8081/bed/findByRoomAndBed/'+this.searchBed+'/'+this.searchRoom+'/'+currentPage+'/7')
          .then(result => {
            _this.tableData = result.data.content
            _this.total = result.data.totalElements
          })
    },
    search(){
      if(this.bed == ""){
        this.searchBed = "*"
      }else{
        this.searchBed = this.bed
      }
      if(this.room == ""){
        this.searchRoom = "*"
      }else{
        this.searchRoom = this.room
      }
      const _this = this
      this.$http.get('http://localhost:8081/bed/findByRoomAndBed/'+this.searchBed+'/'+this.searchRoom+'/1/7')
          .then(result => {
            _this.tableData = result.data.content
            _this.total = result.data.totalElements
          })
    },
    deleteBed(){
      if(this.currentRow!=null){
        const _this = this
        this.$http.get('http://localhost:8081/bed/deleteById/'+this.currentRow.id).then(resp=>{
          if(resp.status==200){
            _this.$message({message:'删除成功', center:true})
            _this.page(_this.selectedPage)
          } else {
            _this.$message({message:'删除失败', center:true})
          }
        })
      }else{
        this.$message({message:'请选择一个床位', center:true})
      }
    }
  },

  created() {
    const _this = this
    this.$http.get('http://localhost:8081/bed/findByRoomAndBed/'+this.searchRoom+'/'+this.searchBed+'/1/7')
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