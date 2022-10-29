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

    <v-row justify="center">
      <v-col
          cols="12"
          md="3"
      >
        <v-container fluid>
          <v-row align="center">
            <v-col >
              <v-select
                  v-model="type"
                  :items="states"
                  menu-props="auto"
                  label="请选择数据类型"
                  hide-details
                  prepend-icon="mdi-chart-box-outline"
                  single-line
                  @change="changeType()"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
        <v-col >
        <v-text-field
            label="请输入国家名字。"
            prepend-icon = "mdi-magnify"
            v-model = inputCountry
            @input="cCheckbox()"
        >
        </v-text-field>
        </v-col>
        <v-col
            width = "100%"
        >
          <div style="height:560px;overflow: auto;width: 100%;font-size: 20px" class="test-1">
            <material-card
                color="primary"
            >
              <v-container class="py-0">
                <!--              <p>已选：{{ selected }}</p >-->
                <v-row  v-for="(item) in showName" :key="item.chineseName" >
                  <div style="margin:0 0 0 15px;width:10px;word-break:normal;word-wrap: break-word;font-size: 20px" >
                    <v-checkbox
                        :label=item.chineseName
                        v-model ="box"
                        :value="item.chineseName"
                        @click="changeSeries(item)"
                        dense
                    >
                      <template v-slot:label>
                        <span style="width:100px;font-size: 20px">{{item.chineseName}}</span>
                      </template>
                    </v-checkbox>
                  </div>
                </v-row>
              </v-container>

            </material-card>
          </div>
        </v-col>
      </v-col>

      <v-col
          cols="12"
          md="9"
      >
        <br>
        <v-card>
          <div style="text-align: center;margin:auto">
            <div ref="chart" id="main" style="width:100%;height:720px;text-align: center"></div>
          </div>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: "HistoricalData",
  data(){
    return{

      inputCountry:'',
      xiala : false,
      //趋势图
      myChart:'',
      box:[],
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
      //通过搜索展示的国家名字
      showName:[],
      //选择的数据类型
      type: '累计确诊人数',
      states: ['累计确诊人数', '新增确诊病例','确诊病例新增率','累计死亡人数', '新增死亡人数',
        '死亡人数新增率','总确诊病例每百万占比','新增病例每百万占比','总死亡病例每百万占比',
        '疫苗总接种人数', '新增疫苗接种人数', '疫苗新增接种率','人口总数'],
      //曲线
      series:[],
      //曲线设置
      seriesItem :{
        name : '',
        type: 'line',
        data: '',
        smooth:true,
        symbol:'none',
      },
      value:1,

    }
  },

  mounted(){
    this.drawLine();
  },
  created(){
    this.$vuetify.theme.dark = false
    this.getCountry();
    this.init();


  },

  methods: {
    //初始化
    init(){
      const _this = this;
      this.box[0]='美国';
      this.selected[0]='美国';
      let x = 'United States';
      this.$axios.get('http://10.251.254.107:8081/data/history?country=' + x).then(function (resp) {
        _this.Scountry = resp.data.data;
        _this.date = _this.Scountry.map(obj => {
          return obj.date
        });
        _this.total = _this.Scountry.map(obj => {
          return obj.total_cases
        })
        _this.new_cases = _this.Scountry.map(obj => {
          return obj.new_cases
        })
        _this.new_cases_smoothed = _this.Scountry.map(obj => {
          return obj.new_cases_smoothed
        })
        _this.total_deaths = _this.Scountry.map(obj => {
          return obj.total_deaths
        })
        _this.new_deaths = _this.Scountry.map(obj => {
          return obj.new_deaths
        })
        _this.new_deaths_smoothed = _this.Scountry.map(obj => {
          return obj.new_deaths_smoothed
        })
        _this.total_cases_per_million = _this.Scountry.map(obj => {
          return obj.total_cases_per_million
        })
        _this.new_cases_per_million = _this.Scountry.map(obj => {
          return obj.new_cases_per_million
        })
        _this.new_cases_smoothed_per_million = _this.Scountry.map(obj => {
          return obj.new_cases_smoothed_per_million
        })
        _this.total_vaccinations = _this.Scountry.map(obj => {
          return obj.total_vaccinations
        })
        _this.new_vaccinations = _this.Scountry.map(obj => {
          return obj.new_vaccinations
        })
        _this.new_vaccinations_smoothed = _this.Scountry.map(obj => {
          return obj.new_vaccinations_smoothed
        })
        // _this .total_vaccinations_per_hundred = _this.Scountry.map(obj => {return obj.total_vaccinations_per_hundred})
        _this.population = _this.Scountry.map(obj => {
          return obj.population
        })

        _this.seriesItem = {
          name: '美国',
          type: 'line',
          data: _this.getData(),
          smooth:true,
          symbol:'none',
        };
        _this.series[0]=_this.seriesItem;
        _this.myChart.setOption({
          xAxis: {
            data: _this.date,
          },
          legend: {
            name: _this.selected,
            top: "10%",
          },
          series: _this.series,
        })
      })

      this.box[1]='印度';
      this.selected[1]='印度';
      let y = 'India';
      this.$axios.get('http://10.251.254.107:8081/data/history?country=' + y).then(function (resp) {
        _this.Scountry = resp.data.data;
        _this.date = _this.Scountry.map(obj => {
          return obj.date
        });
        _this.total = _this.Scountry.map(obj => {
          return obj.total_cases
        })
        _this.new_cases = _this.Scountry.map(obj => {
          return obj.new_cases
        })
        _this.new_cases_smoothed = _this.Scountry.map(obj => {
          return obj.new_cases_smoothed
        })
        _this.total_deaths = _this.Scountry.map(obj => {
          return obj.total_deaths
        })
        _this.new_deaths = _this.Scountry.map(obj => {
          return obj.new_deaths
        })
        _this.new_deaths_smoothed = _this.Scountry.map(obj => {
          return obj.new_deaths_smoothed
        })
        _this.total_cases_per_million = _this.Scountry.map(obj => {
          return obj.total_cases_per_million
        })
        _this.new_cases_per_million = _this.Scountry.map(obj => {
          return obj.new_cases_per_million
        })
        _this.new_cases_smoothed_per_million = _this.Scountry.map(obj => {
          return obj.new_cases_smoothed_per_million
        })
        _this.total_vaccinations = _this.Scountry.map(obj => {
          return obj.total_vaccinations
        })
        _this.new_vaccinations = _this.Scountry.map(obj => {
          return obj.new_vaccinations
        })
        _this.new_vaccinations_smoothed = _this.Scountry.map(obj => {
          return obj.new_vaccinations_smoothed
        })
        // _this .total_vaccinations_per_hundred = _this.Scountry.map(obj => {return obj.total_vaccinations_per_hundred})
        _this.population = _this.Scountry.map(obj => {
          return obj.population
        })

        _this.seriesItem = {
          name: '印度',
          type: 'line',
          data: _this.getData(),
          smooth:true,
          symbol:'none',
        };
        _this.series[1]=_this.seriesItem;
        _this.myChart.setOption({
          xAxis: {
            data: _this.date,
          },
          legend: {
            name: _this.selected,
            top: "10%",
          },
          series: _this.series,
        })
      })
    },


    //新增或删除曲线
    changeSeries(y) {
      let x = y.name;
      let i = this.searchCountry(y.chineseName);
      console.log(y.name)
      console.log(i)
      // alert(i)
      if (i === -1) {
        this.addCountry(x,y.chineseName);
      } else {
        this.deleteCountry(i);
      }
    },
    //在selected中查找某值
    searchCountry(x) {
      let i = this.selected.indexOf(x);
      if (i === -1) return -1;
      else return i;
    },
    //根据type返回需要的数组
    getData() {
      const _this = this;
      if (_this.type === '累计确诊人数') return _this.total;
      else if (_this.type === '新增确诊病例') return _this.new_cases;
      else if (_this.type === '确诊病例新增率') return _this.new_cases_smoothed;
      else if (_this.type === '累计死亡人数') return _this.total_deaths;
      else if (_this.type === '新增死亡人数') return _this.new_deaths;
      else if (_this.type === '死亡人数新增率') return _this.new_deaths_smoothed;
      else if (_this.type === '总确诊病例每百万占比') return _this.total_cases_per_million;
      else if (_this.type === '新增病例每百万占比') return _this.new_cases_per_million;
      else if (_this.type === '总死亡病例每百万占比') return _this.new_cases_smoothed_per_million;
      else if (_this.type === '疫苗总接种人数') return _this.total_vaccinations;
      else if (_this.type === '新增疫苗接种人数') return _this.new_vaccinations;
      else if (_this.type === '疫苗新增接种率') return _this.new_vaccinations_smoothed;
      // else if(_this.type === '每百人疫苗接种总数占比') return _this.total_vaccinations_per_hundred;
      else if (_this.type === '人口总数') return _this.population;
      else return _this.total;
    },

    changeType() {
      const _this = this;
      _this.box = [];
      _this.selected = [];
      _this.series = [];
      _this.myChart.clear();
      _this.drawLine();
      _this.inputCountry = '';
      _this.showName = _this.worldName;
      _this.init();
    },
    getCountry() {
      const _this = this;
      this.$axios.get('http://10.251.254.107:8081/data/all').then(function (resp) {
        // _this.worldName = resp.data.data;
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
        _this.showName = _this.worldName;
      })
    },
    //添加新的国家的函数
    addCountry: function (x,y) {
      const _this = this;
      this.selected.push(y);
      this.$axios.get('http://10.251.254.107:8081/data/history?country=' + x).then(function (resp) {
        _this.Scountry = resp.data.data;
        _this.date = _this.Scountry.map(obj => {
          return obj.date
        });
        _this.total = _this.Scountry.map(obj => {
          return obj.total_cases
        })
        _this.new_cases = _this.Scountry.map(obj => {
          return obj.new_cases
        })
        _this.new_cases_smoothed = _this.Scountry.map(obj => {
          return obj.new_cases_smoothed
        })
        _this.total_deaths = _this.Scountry.map(obj => {
          return obj.total_deaths
        })
        _this.new_deaths = _this.Scountry.map(obj => {
          return obj.new_deaths
        })
        _this.new_deaths_smoothed = _this.Scountry.map(obj => {
          return obj.new_deaths_smoothed
        })
        _this.total_cases_per_million = _this.Scountry.map(obj => {
          return obj.total_cases_per_million
        })
        _this.new_cases_per_million = _this.Scountry.map(obj => {
          return obj.new_cases_per_million
        })
        _this.new_cases_smoothed_per_million = _this.Scountry.map(obj => {
          return obj.new_cases_smoothed_per_million
        })
        _this.total_vaccinations = _this.Scountry.map(obj => {
          return obj.total_vaccinations
        })
        _this.new_vaccinations = _this.Scountry.map(obj => {
          return obj.new_vaccinations
        })
        _this.new_vaccinations_smoothed = _this.Scountry.map(obj => {
          return obj.new_vaccinations_smoothed
        })
        // _this .total_vaccinations_per_hundred = _this.Scountry.map(obj => {return obj.total_vaccinations_per_hundred})
        _this.population = _this.Scountry.map(obj => {
          return obj.population
        })

        _this.seriesItem = {
          name: y.toString(),
          type: 'line',
          data: _this.getData(),
          smooth:true,
          symbol:'none',
        };
        _this.series.push(_this.seriesItem);
        _this.myChart.setOption({
          xAxis: {
            data: _this.date,
          },
          legend: {
            name: _this.selected,
            top: "10%",
          },
          series: _this.series,
        })
      })
    },
    deleteCountry(i) {
      this.selected.splice(i, 1);
      this.series.splice(i, 1);
      this.myChart.clear();
      this.drawLine();
    },
    drawLine() {
      const _this = this;
      var echarts = require('echarts');
      _this.myChart = echarts.init(document.getElementById('main'));
      var option = {
        title: {
          text: '各国'+_this.type+'发展对比',
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
          name: _this.selected,
          top: "10%",
          textStyle:{
            fontSize:17,
          }
        },
        dataZoom: [
          {   // 这个dataZoom组件，默认控制x轴。
            type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            start: 0,      // 左边在 10% 的位置。
            end: 100,         // 右边在 60% 的位置。
            height: "15px",
          },
          {   // 这个dataZoom组件，也控制x轴。
            type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件
            start: 0,      // 左边在 10% 的位置。
            end: 100        // 右边在 60% 的位置。
          }
        ],
        xAxis: {
          data: _this.date,
          // data: [120, 132, 101, 134, 90],
          type: "category",
          axisLabel:{
            textStyle:{
              fontSize:17
            }
          },
        },
        grid: {
          top: "20%",
          textAlign: 'center',
          containLabel: true
        },
        yAxis: {
          axisLabel:{
            textStyle:{
              fontSize:17
            }
          },
        },
        series: _this.series,
      }
      window.addEventListener('resize', function () {
        _this.myChart.resize();
      })
      _this.myChart.setOption(option)
    },
    //模糊搜索国家
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
    cCheckbox(){
      const _this =this;
      var i =_this.search();
      if(i === -1) {
        _this.showName = _this.worldName;
      }
    },
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
