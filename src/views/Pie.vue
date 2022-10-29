<template>
  <v-container fluid style="width: 95%">
    <v-tabs
        fixed-tabs
        background-color="indigo"
        dark
        v-model="value"
        height="55px"
    >
      <v-tab to='/provinceData' style="font-size: 16px">
        国内疫情数据
      </v-tab>
      <v-tab to='/crossanalysis' style="font-size: 16px">
        世界历史数据
      </v-tab>
      <v-tab to='/historicalData' style="font-size: 16px">
        各国基础数据发展对比
      </v-tab>
      <v-tab to = "/pie" style="font-size: 16px">
        全球疫情分析
      </v-tab>

    </v-tabs>
    <br>
    <v-row justify="center">
      <v-col
          cols="12"
          md="6"
      >
        <v-card style="text-align: center;over-flow:visible">
          <div style="text-align: center">
            <div ref="chart" id="pie1" style="width: 100%;height:700px;text-align: center"></div>
          </div>
        </v-card>
      </v-col>

      <v-col
          cols="12"
          md="6"
      >
        <v-card style="text-align: center;over-flow:visible">
          <div style="text-align: center;margin:auto">
            <div ref="chart" id="pie2" style="width: 100%;height:700px;text-align: center"></div>
          </div>
        </v-card>
      </v-col>

      <v-col
          cols="12"
          md="6"
      >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Pie",
  data(){
    return{
      value:3,
      top15:[],
      continent:[],
      continentData:[],
      confirmed:[],
      countryName:[],
      top15Data:[],
      test:[{name:'usa',value:'100'},{name:'uk',value:'200'}]
    }
  },

  mounted(){
    this.getTOP15();
    this.getContinent();
    //this.drawPie1();
   // this.drawPie2();
  },
  created(){
    this.$vuetify.theme.dark = false
   // this.drawPie();
    //this.getTOP15();
  },

  methods:{
    drawPie1(){
      const _this=this;
      var echarts = require('echarts');
      var dom1=document.getElementById('pie1');
      var instance1 = echarts.init(dom1);
      var option1 = {
        title: {
          text: '各洲累计确诊分布',
          left: 'center',
          top: 20,
        },
        grid: {

          textAlign:'center',

        },
        color: [
          "#5470c6",
          "#91cc75",
          "#fac858",
          "#ee6666",
          "#73c0de",
          "#3ba272",
          "#fc8452",
          "#9a60b4",
          "#ea7ccc",
        ],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          // 距离底部为0%
          bottom: "0%",
          // 小图标的宽度和高度
          itemWidth: 10,
          itemHeight: 10,
          // 修改图例组件的文字为 12px
          textStyle: {
            color: "rgba(0,0,0,0.5)",
            fontSize: "14"
          }
        },
        series: [{
          name: '确诊病例',
          type: 'pie',
          //设置饼状图在容器中的位置，这里和带有坐标系的图不一样
          center: ["50%", "50%"],
          //  修改内圆半径和外圆半径为  百分比是相对于容器宽度来说的
          radius: ["20%", "50%"],
          avoidLabelOverlap: false,
          label: {
            fontSize: 15
          },
          // emphasis: {
          //   label: {
          //     // show: true,
          //     fontSize: '20',
          //     fontWeight: 'bold'
          //   }
          // },
          //不显示连接线
          // labelLine: {
          //   show: false
          // },
          labelLine: {
            show: true,
            // 连接扇形图线长
            length: 30,
            // 连接文字线长
            length2: 16
          },
          data: _this.continentData
        }]
      };
      // 使用刚指定的配置项和数据显示图表。
      instance1.setOption(option1);
      window.addEventListener('resize', function() {
        instance1.resize();
      })
    },
    drawPie2(){
       const _this=this;
      //this.getTOP15();
    //  console.log(_this.top15Data);
      var echarts = require('echarts');
      var dom2=document.getElementById('pie2');
      var instance2 = echarts.init(dom2);
      var option2 = {
        color: [
          '#ff9f7f',
          '#91cc75',
          '#fac858',
          '#ee6666',
          '#73c0de',
          '#3ba272',
          '#fc8452',
          '#9a60b4',
          '#006cff',
          '#ea7ccc'],
        // color: ['#006cff', '#60cda0', '#ed8884', '#ff9f7f', '#0096ff', '#9fe6b8', '#32c5e9', '#1d9dff'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        title:{
          text:'世界疫情确诊情况前十',
          left: 'center',
          top: 20,
        },
        legend: {
          left: 'center',
          top: 'bottom',
          data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5', 'rose6', 'rose7', 'rose8']
        },
        series: [{
          name: '确诊人数',
          type: 'pie',
          //饼图大小
          radius: ['10%', '70%'],
          center: ['50%', '55%'],
          //饼图显示模式area面积模式radius半径模式
          roseType: 'radius',
          // 文本标签控制饼形图文字的相关样式
          label: {
            fontSize: 15
          },
          // 引导线调整
          labelLine: {
            // 连接扇形图线长
            length: 12,
            // 连接文字线长
            length2: 12
          },
          data: _this.top15Data
        }]
      };
      // 使用刚指定的配置项和数据显示图表。
      //option2.series.data=_this.top15Data
      instance2.setOption(option2);
      window.addEventListener('resize', function() {
        instance2.resize()
      })
    },
    getTOP15(){
      const _this=this;
      this.$axios.get('http://10.251.254.107:8081/data/top15').then(function(resp) {
        _this.top15 = resp.data.data;
      //  console.log(_this.top15);
        const nameMap = require('@/assets/world_name_map.json')
        for (let i=0;i<10;i++){
          const x = {
            name: nameMap[_this.top15[i].name],
            value: _this.top15[i].confirmed
          };
          _this.top15Data.push(x)
        }
       // console.log(_this.top15Data);
        _this.drawPie2();
      })
    },
    getContinent(){
      const _this=this;
      this.$axios.get('http://10.251.254.107:8081/data/continent').then(function(resp) {
        //alert(resp.data.message)
        _this.continent = resp.data.data;
        console.log(_this.continent);
        var len=_this.continent.length;
        //alert(len)
        for(var i=0;i<len;i++){
          var x={name:'',value:'100'};
          x.value=_this.continent[i].confirmed;
          x.name=_this.continent[i].name;
          //alert(x.name)
          _this.continentData.push(x)
        }
        console.log(_this.continentData);
        _this.drawPie1();
      })
    },
  }
}

</script>

<style scoped>

</style>
