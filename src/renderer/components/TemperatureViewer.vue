<template>
  <div>
    <div class="Echarts" id="pdfDom">
      <div style="text-align: right;">
        <div class="float-left">就诊ID: {{RecentId}}</div>
        <div class="float-left">姓名: {{RecentPatient}}</div>
        <div class="float-left">登记时间: {{VisitTime}}</div>
      </div>
      <div id="main" style="width: 610px;height: 394px;"></div>
    </div>
    <div style="text-align: right">
      <el-button style="align: right;" @click="getPdf('Temp')">打印</el-button>
    </div>
  </div>
</template>

<script>
import StaticVariable from "./StaticVariable";

export default {
  name: 'BMIViewer',
  data() {
    return{
      temp: [],
      temp_time: [],
      RecentId: StaticVariable.patient.patient_id,
      RecentPatient: StaticVariable.patient.patient_name,
      RecentRoom: StaticVariable.patient.room,
      RecentBed: StaticVariable.patient.bed,
      VisitTime: StaticVariable.patient.visit_time,
      showData:[],
    }
  },
  methods: {
    myEcharts(){
      let echarts = require('echarts');

      let chartDom = document.getElementById('main');
      let myChart = echarts.init(chartDom);
      let option;
      //配置图表
      option = {
        title: {
          text: '体温曲线'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {},
        dataZoom: [
          {
            show: true,
            realtime: true,
            start: 0,
            end: 100
          },
          {
            type: 'inside',
            realtime: true,
            start: 0,
            end: 100
          }
        ],
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'time',
          boundaryGap: false,
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} °C'
          }
        },
        series: [
          {
            name: '体温（°C）',
            type: 'line',
            data: this.showData,
            markPoint: {
              data: [
                { type: 'max', name: 'Max' },
                { type: 'min', name: 'Min' }
              ]
            },
            markLine: {
              data: [{ type: 'average', name: 'Avg' }]
            }
          }
        ]
      };
      myChart.setOption(option);
    },

    updateTemp(){
      this.temp = []
      this.temp_time = []
      this.showData = []
      const _this = this
      this.$http.get('http://localhost:8081/patientsInfo/findById/'+StaticVariable.patient.id).then(result=>{
        if(result.data!=null) {
          if(result.data.temp.length!==0) {
            _this.temp = result.data.temp
            _this.temp_time = result.data.temp_time
            for(let i=0; i<_this.temp.length; i++) {
              _this.showData[i] = [_this.temp_time[i], _this.temp[i]]
            }
          } else {
            _this.$message({message: '未找到温度数据', center: true})
          }
        }else{
          _this.$message({message: '未找到温度数据', center: true})
        }
        _this.myEcharts()
      })
    }
  },
  mounted(){
    this.updateTemp();
  },
  activated() {
    this.RecentId = StaticVariable.patient.patient_id
    this.RecentPatient = StaticVariable.patient.patient_name
    this.VisitTime = StaticVariable.patient.visit_time
    this.RecentRoom = StaticVariable.patient.room
    this.RecentBed = StaticVariable.patient.bed
  },
  deactivated() {
    this.$destroy()
  }
}
</script>

<style>
  .float-left {
    position: relative;
    padding: 0 15px 20px 15px;
    display:inline-block;
  }
</style>