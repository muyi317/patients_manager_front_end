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
      <el-button @click="getPdf('BMI')">打印</el-button>
    </div>
  </div>

</template>

<script>
import StaticVariable from "./StaticVariable";

export default {
  name: 'BMIViewer',
  data(){
    return{
      RecentId: StaticVariable.patient.patient_id,
      RecentRoom: StaticVariable.patient.room,
      RecentBed: StaticVariable.patient.bed,
      RecentPatient: StaticVariable.patient.patient_name,
      VisitTime: StaticVariable.patient.visit_time,
      weight: [],
      bmi: [],
      weight_time: [],
      showData: [],
      showWeight: [],
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
          text: 'BMI曲线'
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
        yAxis: [
          {
            name:'BMI',
            type: 'value',
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            name:'体重（kg）',
            type: 'value',
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: 'BMI',
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
          },
          {
            name: '体重',
            type: 'line',
            yAxisIndex: 1,
            data: this.showWeight,
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
    updateWeight(){
      this.weight= []
      this.bmi=[]
      this.weight_time= []
      this.showData= []
      this.showWeight= []
      const _this = this
      this.$http.get('http://localhost:8081/patientsInfo/findById/'+StaticVariable.patient.id).then(result=>{
        if(result.data!=null) {
          //判断有没有体重与身高数据
          if(result.data.weight.length!==0 && StaticVariable.patient.height!==0) {
            _this.bmi = result.data.weight.map(function (index) {
              return Math.floor(index / Math.pow(StaticVariable.patient.height * 0.001, 2)) / 100
            })
            _this.weight = result.data.weight
            _this.weight_time = result.data.weight_time
            for(let i=0; i<_this.weight.length; i++) {
              _this.showWeight[i] = [_this.weight_time[i], _this.weight[i]]
              _this.showData[i] = [_this.weight_time[i], _this.bmi[i]]
            }
          } else {
            _this.$message({message: '未找到体重或身高数据', center: true})
          }
        }else{
          _this.$message({message: '未找到体重或身高数据', center: true})
        }
        _this.myEcharts()
      })
    }
  },
  mounted(){
    this.updateWeight()
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