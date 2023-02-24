<template>
  <div>
    <el-container style="height: 515px; border: 1px solid #eee">

        <el-menu
            router
            default-active="/Container/InsertPatientViewer"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
          <el-menu-item route index="/Container/InsertPatientViewer">
            <span slot="title">住院录入</span>
          </el-menu-item>
          <el-menu-item route index="/Container/PatientsViewer">
            <span slot="title">人员查找</span>
          </el-menu-item>
          <el-menu-item route index="/Container/WeightViewer">
            <span slot="title">指标检测</span>
          </el-menu-item>
          <el-menu-item route index="/Container/BMIViewer">
            <span slot="title">BMI曲线</span>
          </el-menu-item>
          <el-menu-item route index="/Container/TemperatureViewer">
            <span slot="title">体温曲线</span>
          </el-menu-item>
          <el-menu-item route index="/Container/BedViewer">
            <span slot="title">床重数据</span>
          </el-menu-item>
        </el-menu>


      <el-main>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-main>

    </el-container>
  </div>
</template>

<script>
export default {
  name: "Container",
  data() {
    return {

    }
  },
  methods:{

  }
};
</script>

<style>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>
