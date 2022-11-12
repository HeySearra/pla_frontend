<template>
  <v-container
      fluid
      style="width: 95%"
  >
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
          <div v-loading="loading">
            <div style="text-align: center;margin:auto">
              <div ref="chart" id="main" style="width:100%;height:720px;text-align: center"></div>
            </div>
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
      loading : false,
      inputCountry:'',
      xiala : false,
      //趋势图
      myChart:'',
      box:[],
      selected:['美国','印度'],
      //某国家的所有数据
      Scountry:[],
      //历史时间节点
      date:[],
      //累计确诊人数
      total:[],
      //新增确诊
      new_cases:[],
      //累计死亡人数
      total_deaths : [],
      //新增死亡人数
      new_deaths : [],
      //累计治愈人数
      total_cured:[],
      //新增治愈人数
      new_cured:[],
      //国家名字
      worldName:[],
      //通过搜索展示的国家名字
      showName:[],
      //选择的数据类型
      type: '累计确诊人数',
      states: ['累计确诊人数', '新增确诊病例','累计死亡人数', '新增死亡人数','累计治愈人数','新增治愈人数'],
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
    this.drawLine().then(()=>{
      this.getCountryPY();
      this.initPY();
    })
  },
  methods: {
    //初始化
    initPY(){
      let i;
      const _this = this;
      for(i = 0; i < _this.selected.length ; i++){
        let country = _this.selected[i];
        _this.box.push(country)
        _this.$axios.post('http://42.194.158.76:8001/data/country_analyze', {'name' : country}).then(function (resp) {
          if(resp.data.status === 0){
            _this.Scountry = resp.data.data;
            _this.date = _this.Scountry.map(obj => {
              return obj.date
            });
            _this.total = _this.Scountry.map(obj => {
              return obj.total.confirmed
            })
            _this.new_cases = _this.Scountry.map(obj => {
              return obj.new.confirmed
            })
            _this.total_deaths = _this.Scountry.map(obj => {
              return obj.total.died
            })
            _this.new_deaths = _this.Scountry.map(obj => {
              return obj.new.died
            })
            _this.total_cured = _this.Scountry.map(obj =>{
              return obj.total.cured
            })
            _this.new_cured = _this.Scountry.map(obj =>{
              return obj.new.cured
            })
          }
          _this.seriesItem = {
            name: country,
            type: 'line',
            data: _this.getDataPY(),
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
      }
      _this.myChart.hideLoading();
    },
    //新增或删除曲线
    changeSeries(y) {
      let x = y.name;
      let i = this.searchCountry(y.chineseName);
      if (i === -1) {
        this.addCountryPY(x,y.chineseName);
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
    getDataPY() {
      const _this = this;
      if (_this.type === '累计确诊人数') return _this.total;
      else if (_this.type === '新增确诊病例') return _this.new_cases;
      else if (_this.type === '累计死亡人数') return _this.total_deaths;
      else if (_this.type === '新增死亡人数') return _this.new_deaths;
      else if (_this.type === '累计治愈人数') return _this.total_cured;
      else if (_this.type === '新增治愈人数') return _this.new_cured;
      else return _this.total;
    },
    changeType() {
      const _this = this;
      _this.box = [];
      // _this.selected = [];
      _this.series = [];
      _this.myChart.clear();
      _this.drawLine().then(()=>{
        _this.inputCountry = '';
        _this.showName = _this.worldName;
        _this.initPY()
      })
    },
    getCountryPY(){
      const _this = this
      const nameMap = require('@/assets/registry.json').PINYIN_MAP
      for(const key in nameMap){
        _this.showName.push({
          name:nameMap[key],
          chineseName:key
        });
      }
      _this.worldName = _this.showName
    },

    //添加新的国家的函数
    addCountryPY: function (x,y) {
      const _this = this;
      _this.$axios.post('http://42.194.158.76:8001/data/country_analyze', {'name' : y}).then(function (resp) {
        if(resp.data.status === 0 && resp.data.data.length !== 0){
          _this.selected.push(y);
          _this.Scountry = resp.data.data;
          _this.date = _this.Scountry.map(obj => {
            return obj.date
          });
          _this.total = _this.Scountry.map(obj => {
            return obj.total.confirmed
          })
          _this.new_cases = _this.Scountry.map(obj => {
            return obj.new.confirmed
          })
          _this.total_deaths = _this.Scountry.map(obj => {
            return obj.total.died
          })
          _this.new_deaths = _this.Scountry.map(obj => {
            return obj.new.died
          })
          _this.total_cured = _this.Scountry.map(obj =>{
            return obj.total.cured
          })
          _this.new_cured = _this.Scountry.map(obj =>{
            return obj.new.cured
          })
          _this.seriesItem = {
            name: y.toString(),
            type: 'line',
            // data: _this.getData(),
            data: _this.getDataPY(),
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
        }
        else {
          _this.box.splice(_this.box.indexOf(y),1)
          _this.$message({
            message: '抱歉，暂时无法提供该国数据。',
            type: 'info'
          });
        }
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
      _this.myChart.showLoading({
        text: 'loading……'
      });
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
