<template>
  <v-container
      fluid
      style="width: 95%"
  >
    <!--    {{value}} 0~n -->
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
          md="3"
      >
        <v-text-field
            label="请输入国家名字。"
            prepend-icon = "mdi-magnify"
            v-model = inputCountry
            @input="Check()"
        >
        </v-text-field>
        <div style="height: 650px;overflow: auto;width:100%;" class="test-1">

          <v-card
          >
            <v-container
                class="px-0"
                fluid
            >
              <v-row v-for="(item) in showName" :key=item.name>
              <div style="margin:0 0 0 40px;width:10px;word-break:normal;word-wrap: break-word" >

                <v-radio-group v-model="chooseCountry">
                  <v-radio
                      :value=item.name
                      @click="changeLine(item.chineseName)"
                      dense
                  >
                    <template v-slot:label>
                      <span style="width:100px;font-size: 20px">{{item.chineseName}}</span>
                    </template>
                  </v-radio>
                </v-radio-group>
              </div>
              </v-row>
            </v-container>

          </v-card>
        </div>

      </v-col>

      <v-col
          cols="12"
          md="9"
      >
        <v-card>
          <div style="text-align: center;margin:auto">
            <div ref="chart" id="main" style="width:100%;height:720px;text-align: center"></div>
<!--            <div ref="chart" id="active" style="width:100%;height:300px;text-align: center"></div>-->
<!--            <p style="font-size: 18px;color: #666666;padding-bottom: 20px">{{activeDate}}</p>-->

          </div>

        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>

export default {
  name: "CrossAnalysis",
  data(){
    return{

      inputCountry:'',
      showName:[],
      activeDate:'',
      // chooseCountry:'China',
      // chooseTitle:'中国',
      chooseCountry:'World',
      chooseTitle:'世界',

      aoption:'',
      acharts : '',
      Change : [0,0,0,0,0,0,0,0],
      jishu : 0,

      //交叉分析图
      compareChart:'',
      checkbox:[],
      selected:[],
      //某国家的所有数据
      Scountry:[],
      //历史时间节点
      date:[],
      //累计确诊人数
      total:[],
      //新增确诊
      new_cases:[],
      //确诊病例新增率
      new_cases_smoothed:[],
      //累计死亡人数
      total_deaths : [],
      //新增死亡人数
      new_deaths : [],
      //死亡人数新增率
      new_deaths_smoothed : [],
      //总确诊病例每百万占比
      total_cases_per_million :[],
      //新增病例每百万占比
      new_cases_per_million : [],
      //总死亡病例每百万占比
      new_cases_smoothed_per_million : [],
      //疫苗总接种人数
      total_vaccinations : [],
      //新增疫苗接种人数
      new_vaccinations : [],
      //疫苗新增接种率
      new_vaccinations_smoothed : [],
      // //每百人疫苗接种总数占比
      // total_vaccinations_per_hundred : [],
      //人口总数
      population : [],

      //国家名字
      worldName:[],
      //选择的数据类型
      type: '累计确诊人数',
      states: ['累计确诊人数', '新增确诊病例','累计死亡人数', '新增死亡人数',
        '疫苗总接种人数', '新增疫苗接种人数'],

      //曲线
      series:[],
      //曲线设置
      seriesItem :{
        name : '',
        type: 'line',
        data: '',
      },

      value:2,
    }
  },

  mounted(){
    this.drawLine();
    // this.drawActive();
    this.changeCountry();
    // this.$nextTick(() => {
    //   setInterval(this.run,100);
    // })
  },
  created(){
    this.$vuetify.theme.dark = false
    this.getCountry();
    this.drawLine();
    // this.drawActive();
    this.changeCountry();
  },

  methods:{
    Check(){
      var i =this.search();
      if(i === -1) {
        this.showName = this.worldName;
      }

    },
    //模糊搜索省份
    search(){
      this.showName = [];
      var j = -1;
      for(var i = 0;i < this.worldName.length ; i++){

        if(this.worldName[i].chineseName.indexOf(this.inputCountry)!==-1){
          this.showName.push(this.worldName[i]);
          j = i;
        }
      }
      return j;
    },
    changeLine(x){
      this.changeCountry();
      this.chooseTitle = x;
      this.drawLine();
      // this.drawActive();
    },
    changeCountry(){
      const _this =this;
      if(_this.chooseCountry !== ''){
        if(_this.changeCountry==='World'){
          _this.$axios.get('http://10.251.254.107:8081/data/h-World').then(function(resp) {
            _this.Scountry = resp.data.data;
            _this.date = _this.Scountry.map(obj => {return obj.last_Update});
            _this.total = _this.Scountry.map(obj => {return obj.confirmed});
            _this.total_deaths = _this.Scountry.map(obj => {return obj.death});
            _this.total_vaccinations = _this.Scountry.map(obj => {return obj.vaccinations});
          })
        }
        else{
          // console.log(_this.chooseCountry)
          _this.$axios.get('http://10.251.254.107:8081/data/history?country='+ _this.chooseCountry).then(function(resp) {
            _this.Scountry = resp.data.data;
            _this.date = _this.Scountry.map(obj => {return obj.date});
            _this.total = _this.Scountry.map(obj => {return obj.total_cases})
            _this.new_cases = _this.Scountry.map(obj => {return obj.new_cases})
            _this.new_cases_smoothed = _this.Scountry.map(obj => {return obj.new_cases_smoothed})
            _this.total_deaths = _this.Scountry.map(obj => {return obj.total_deaths})
            _this.new_deaths = _this.Scountry.map(obj => {return obj.new_deaths})
            _this.new_deaths_smoothed = _this.Scountry.map(obj => {return obj.new_deaths_smoothed})
            _this.total_cases_per_million = _this.Scountry.map(obj => {return obj.total_cases_per_million})
            _this.new_cases_per_million = _this.Scountry.map(obj => {return obj.new_cases_per_million})
            _this.new_cases_smoothed_per_million = _this.Scountry.map(obj => {return obj.new_cases_smoothed_per_million})
            _this.total_vaccinations = _this.Scountry.map(obj => {return obj.total_vaccinations})
            _this.new_vaccinations = _this.Scountry.map(obj => {return obj.new_vaccinations})
            _this.new_vaccinations_smoothed = _this.Scountry.map(obj => {return obj.new_vaccinations_smoothed})
            // _this .total_vaccinations_per_hundred = _this.Scountry.map(obj => {return obj.total_vaccinations_per_hundred})
            _this.population = _this.Scountry.map(obj => {return obj.population})
            _this.drawLine()
          })
        }

       }
    },
    getCountry(){
      const _this = this;
      this.$axios.get('http://10.251.254.107:8081/data/all').then(function(resp) {
        _this.worldName = resp.data.data;
        // console.log(_this.worldName)
        const nameMap = require('@/assets/world_name_map.json')
        _this.worldName.forEach((item, i) => {
          if (nameMap[item.name] === undefined) {
            _this.worldName[i].chineseName = item.name
          } else {
            _this.worldName[i].chineseName = nameMap[item.name]
          }
        })
        let country ={
          name:'World',
          chineseName:'世界',
        }
        _this.showName[0]=country;
        _this.showName=_this.showName.concat(_this.worldName);
        _this.worldName = _this.showName;
        console.log(_this.showName)
      })
    },
    drawLine() {
      const _this = this;
      var echarts = require('echarts');
      var dom1 = document.getElementById('main');
      var myChart = echarts.init(dom1);
      var option = {
        title: {
          text: this.chooseTitle+'数据交叉分析',
          top: "2%",
          left: "40%"
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',//指示类型
            label: {
              // 横纵坐标指示区块颜色
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          name : ["新增确诊病例","新增死亡病例","疫苗接种总人数"],
          top:"10%",
          textStyle:{
            fontSize:17,
          }
        },
        dataZoom: [
          {   // 这个dataZoom组件，默认控制x轴。
            type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            start:0,      // 左边在 10% 的位置。
            end: 100,         // 右边在 60% 的位置。
            height: "15px",
          },
          {   // 这个dataZoom组件，也控制x轴。
            type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件
            start: 0,      // 左边在 10% 的位置。
            end: 100         // 右边在 60% 的位置。
          }
        ],
        xAxis: {
          data: _this.date,
          type: "category",
          axisLabel:{
            textStyle:{
              fontSize:17
            }
          },
        },
        grid: {
          left : "10%" ,
          right:"10%",
          top:"20%",
          bottom:"10%",
          textAlign:'center',
          containLabel: true
        },
        yAxis: {
          axisLabel:{
            textStyle:{
              fontSize:17
            }
          },},
        series: [{
          name : "累计确诊病例",
          type: 'line',
          color: "#FF3E96",
          data: _this.total,
          smooth:true,
          symbol:'none',

        },
          {
            name : "累计死亡病例",
            type: 'line',
            color: "black",
            data: _this.total_deaths,
            smooth:true,
            symbol:'none',
          },
          {
            name : "疫苗接种总人数",
            type: 'line',
            color: "#6699ff",
            data: _this.total_vaccinations,
            smooth:true,
            symbol:'none',
          },
        ],
      }
      window.addEventListener('resize', function() {
        myChart.resize();
      })
       myChart.setOption(option)
    },
    //
    // drawActive(){
    //   const _this = this;
    //   var echarts = require('echarts');
    //   var dom2 = document.getElementById('active');
    //   this.acharts = echarts.init(dom2);
    //
    //   this.aoption = {
    //     xAxis: {
    //       max: 'dataMax',
    //       axisLabel:{
    //         textStyle:{
    //           fontSize:17
    //         }
    //       },
    //     },
    //     yAxis: {
    //       type: 'category',
    //       data:['累计确诊', '新增确诊','累计死亡', '新增死亡',
    //         '疫苗总接种', '新增疫苗接种'],
    //       inverse: true,
    //       animationDuration: 300,
    //       animationDurationUpdate: 300,
    //       axisLabel:{
    //         textStyle:{
    //           fontSize:17
    //         }
    //       },
    //     },
    //     grid: {
    //       left : "10%" ,
    //       right:"10%",
    //       top:"20%",
    //       bottom:"10%",
    //       textAlign:'center',
    //       containLabel: true
    //     },
    //     series: [{
    //       realtimeSort: true,
    //       name: '数值',
    //       type: 'bar',
    //       data: _this.Change,
    //       label: {
    //         show: true,
    //         position: 'right',
    //       },
    //       color:"#6699ff",
    //     }],
    //     legend: {
    //       show: true,
    //       textStyle:{
    //         fontSize:17,
    //       }
    //     },
    //     animationDuration: 0,
    //     animationDurationUpdate: 3000,
    //     animationEasing: 'linear',
    //     animationEasingUpdate: 'linear',
    //   }
    //   this.acharts.setOption(this.aoption);
    // },
    //
    // run(){
    //   let i = this.jishu;
    //   this.activeDate = this.date[i];
    //   this.Change[0]=this.total[i];
    //   this.Change[1]=this.new_cases[i];
    //   this.Change[2]=this.total_deaths[i];
    //   this.Change[3]=this.new_deaths[i];
    //   this.Change[4]=this.total_vaccinations[i];
    //   this.Change[5]=this.new_vaccinations[i];
    //   this.jishu =this.jishu+1;
    //   this.acharts.setOption(this.aoption);
    // }
  }
}
</script>
<style scoped>
  .test-1::-webkit-scrollbar {/*滚动条整体样式*/
    width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  .test-1::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(21, 101, 192,0.5);
  }
  .test-1::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 10px;
    background: #EDEDED;
  }
  .v-application .mt-4 {
     margin-top: 0px !important;
   }

</style>
