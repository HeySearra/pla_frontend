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
    <br>
    <v-row justify="center">
      <v-col
          cols="12"
          md="3"
      >
        <v-text-field
            label="请输入省份名字。"
            prepend-icon = "mdi-magnify"
            v-model = inputProvince
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
                <v-radio-group v-model="chooseProvince">
                  <v-radio
                      dense
                      :value=item.chineseName
                      @click="changeLine(item.chineseName)"
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
          </div>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>

export default {
  name: "ProvinceData",
  data(){
    return{

      value1:false,
      inputProvince:'',
      showName:[],
      chooseProvince:'全国',
      chooseTitle:'全国',
      //某国家的所有数据
      Province:[],
      //历史时间节点
      date:[],
      //累计确诊人数
      confirmed:[],
      //累计治愈
      recovered:[],
      //累计死亡
      deaths:[],
      //国家名字
      provinceName:[],

      //曲线
      series:[],
      //曲线设置
      seriesItem :{
        name : '',
        type: 'line',
        data: '',
      },

      value:0,
    }
  },

  mounted(){
    this.drawLine();
    this.changeProvincePY();
  },
  created(){
    this.$vuetify.theme.dark = false
    this.getProvince();
    this.drawLine();
    this.changeProvincePY();
  },

  methods:{
    Check(){
      var i =this.search();
      if(i === -1) {
        this.showName = this.provinceName;
        this.$forceUpdate()
      }

    },
    //模糊搜索省份
    search(){
      this.showName = [];
      var j = -1;
      for(var i = 0;i < this.provinceName.length ; i++){

        if(this.provinceName[i].chineseName.indexOf(this.inputProvince)!==-1){
          this.showName.push(this.provinceName[i]);
          j = i;
        }
      }
      return j;
    },
    changeLine(x){
      this.changeProvincePY();
      this.chooseTitle = x;
      this.drawLine();

    },
    changeProvincePY(){
      const _this =this;
      if(_this.chooseProvince!== ''){
        if(_this.chooseProvince ==='全国'){
          _this.$axios.post('http://127.0.0.1:8000/data/country_analyze', {'name' : '中国'}).then(function (resp) {
            if(resp.data.status === 0){
              console.log(resp.data)
              _this.Province = resp.data.data;
              _this.date = _this.Province.map(obj => {return obj.date});
              _this.deaths = _this.Province.map(obj => {return obj.total.died});
              _this.confirmed = _this.Province.map(obj => {return obj.total.confirmed});
              _this.recovered = _this.Province.map(obj => {return obj.total.cured});
              _this.drawLine()
            }
          })
        }
        else{
          _this.$axios.post('http://127.0.0.1:8000/data/search',{'name':_this.chooseProvince}).then(function(resp) {
            if(resp.data.status === 0){
              _this.Province = resp.data.data;
              _this.date = _this.Province.map(obj => {return obj.date});
              _this.deaths = _this.Province.map(obj => {return obj.total_died});
              _this.confirmed = _this.Province.map(obj => {return obj.total_confirmed});
              _this.recovered = _this.Province.map(obj => {return obj.total_cured});
              _this.drawLine()
            }
          })
        }

      }
    },
    getProvince(){
      const cityArr = [
        ['上海', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '广西', '海南', '四川', '贵州', '云南',  '陕西', '甘肃', '青海', '宁夏', '新疆', '北京', '天津', '重庆','西藏','台湾','澳门','香港'],
        ['Shanghai', 'Hebei', 'Shanxi', 'Inner Mongolia', 'Liaoning', 'Jilin', 'Heilongjiang', 'Jiangsu', 'Zhejiang', 'Anhui', 'Fujian', 'Jiangxi', 'Shandong', 'Henan', 'Hubei', 'Hunan', 'Guangdong', 'Guangxi', 'Hainan', 'Sichuan', 'Guizhou', 'Yunnan',  'Shaanxi', 'Gansu', 'Qinghai', 'Ningxia', 'Xinjiang', 'Beijing', 'Tianjin', 'Chongqing','Tibet','Taiwan','Aomen','Xianggang']
      ];
      let province = {
        name : 'China',
        chineseName:'全国',
      }
      this.provinceName[0]=province;
      for(let i = 0 ;i<cityArr[0].length;i++){
        let province = {
          name : '',
          chineseName:'',
        }
        province.name = cityArr[1][i];
        province.chineseName= cityArr[0][i];
        this.provinceName[i+1]=province;
      }
      this.showName = this.provinceName
    },
    drawLine() {
      const _this = this;
      var echarts = require('echarts');
      var dom1 = document.getElementById('main');
      var myChart = echarts.init(dom1);

      var option = {
        title: {
          text:this.chooseTitle+'历史数据分析',
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
          name : ["累计确诊病例","累计死亡病例","累计治愈人数"],
          top:"10%",
          textStyle:{
            fontSize:17,
          }
        },
        dataZoom: [
          {   // 这个dataZoom组件，默认控制x轴。
            type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            start: 0,      // 左边在 10% 的位置。
            end: 99,         // 右边在 60% 的位置。
            height: "15px",
          },
          {   // 这个dataZoom组件，也控制x轴。
            type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件
            start: 0,      // 左边在 10% 的位置。
            end: 99        // 右边在 60% 的位置。
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
          },
        },
        series: [{
          name : "累计确诊病例",
          type: 'line',
          color: "#FF3E96",
          data: _this.confirmed,
          smooth:true,
          symbol:'none',
        },
          {
            name : "累计死亡病例",
            type: 'line',
            color: "black",
            data: _this.deaths,
            smooth:true,
            symbol:'none',
          },
          {
            name : "累计治愈人数",
            type: 'line',
            color: "#6699ff",
            data: _this.recovered,
            smooth:true,
            symbol:'none',
          },
        ],
      }
      window.addEventListener('resize', function() {
        myChart.resize();
      })
      myChart.hideLoading();
      myChart.setOption(option)
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
