<template>
  <v-container
      id="world-map-view"
      fluid
      tag="section"
  >
    <v-row>
      <v-col cols="3" >
        <v-card
            class="mx-auto"
            max-width="344"
            outlined

        >
          <div class="info-card">
            <p class="text-h4 mb-1" style="font-weight:bold">总计确诊</p>
            <p class="text-h2 mb-4" style="color:#e60000;font-weight:bold">{{confirmed}}</p>
          </div>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-card
            class="mx-auto"
            max-width="344"
            outlined

        >
          <div class="info-card">
            <p class="text-h4 mb-1" style="font-weight:bold">死亡人数</p>
            <p class="text-h2 mb-4" style="color:#000000;font-weight:bold">{{deceased}}</p>
          </div>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-card
            class="mx-auto"
            max-width="344"
            outlined

        >
          <div class="info-card">
            <p class="text-h4 mb-1" style="font-weight:bold">疫苗接种人数</p>
            <p class="text-h2 mb-4" style="color:#35791b;font-weight:bold">{{vaccinated}}</p>
          </div>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-card
            class="mx-auto"
            max-width="344"
            outlined

        >
          <div class="info-card">
            <p class="text-h4 mb-1" style="font-weight:bold">当前时间</p>
            <div style="padding-top: 11px"></div>
            <p class="text-h3 mb-4" style="color:#0D47A1;font-weight:bold">{{time}}</p>
            <div style="padding-top: 8px"></div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="5">
        <div id="world-map" ref="worldMap" style="width: 100%"></div>
      </v-col>
      <v-col md="7">
        <el-card>
          <v-tabs v-model="value">
            <v-tab style="font-size: 20px">疫情数据</v-tab>
<!--            <v-tab style="font-size: 20px">出行预警</v-tab>-->
          </v-tabs>

<!--          <v-text-field-->
<!--              v-model="search"-->
<!--              append-icon="mdi-magnify"-->
<!--              label="Search"-->
<!--              single-line-->
<!--              hide-details-->
<!--          ></v-text-field>-->
          <v-row v-if="value===0">
            <v-col>
<!--              <v-data-table-->
<!--                  :headers="headers"-->
<!--                  :items="data"-->
<!--                  class="overflow-x-auto"-->
<!--                  :search="search"-->
<!--                  style="white-space: nowrap;font-size: 20px"-->
<!--              >-->
<!--                <template v-slot:item.name="{ item }"-->
<!--                          fixed>-->
<!--                  <span style="font-weight:bold;font-size: 20px">{{item.name}}</span>-->
<!--                </template>-->
<!--                <template v-slot:item.confirmed="{ item }">-->
<!--                  <span style="color:#F65164;font-weight:bold;font-size: 20px;">{{item.confirmed}}</span>-->
<!--                </template>-->
<!--                <template v-slot:item.deceased="{ item }">-->
<!--                  <span style="color:#666666;font-weight:bold;font-size: 20px">{{item.deceased}}</span>-->
<!--                </template>-->
<!--                <template v-slot:item.tests="{ item }">-->
<!--                  <span style="color:#ffc137;font-weight:bold;font-size: 20px">{{item.tests}}</span>-->
<!--                </template>-->
<!--                <template v-slot:item.active="{ item }">-->
<!--                  <span style="color:rgb(68, 155, 226);font-weight:bold;font-size: 20px">{{item.active}}</span>-->
<!--                </template>-->
<!--                <template v-slot:item.recovered="{ item }">-->
<!--                  <span style="color:#35791b;font-weight:bold;font-size: 20px">{{item.recovered}}</span>-->
<!--                </template>-->
<!--                <template v-slot:item.vaccinated="{ item }">-->
<!--                  <span style="color:#3ecee5;font-weight:bold;font-size: 20px">{{item.vaccinated}}</span>-->
<!--                </template>-->
<!--              </v-data-table>-->

<!--              qiao-->
              <v-col cols="12" md="12">
                <v-text-field
                    label="请输入国家名称"
                    single-line
                    prepend-icon = "mdi-magnify"
                    hide-details
                    v-model="searchCountry"
                    @input="changedata()"
                ></v-text-field>
              </v-col>


              <el-table
                  :data="data"
                  style="width: 100%"
                  height="600px"
                  @sort-change="sortData"
                  :default-sort="sortRule"
              >
                <el-table-column
                    fixed
                    prop="name"
                    label="国家/地区"
                >
                  <template slot="header" >
                    <span style="font-size: 16px;font-weight:bold;">国家/地区</span>
                  </template>
                  <template slot-scope="item">
                    <span style="font-size: 16px;font-weight:bold;">{{item.row.name}}</span>
                  </template>
                </el-table-column>

                <el-table-column
                    prop="confirmed"
                    label="累计确诊人数"
                    sortable="custom">
                  <template slot="header" >
                    <span style="font-size: 16px;font-weight:bold;">累计确诊</span>
                  </template>
                  <template slot-scope="item">
                    <span style="font-size: 16px;font-weight:bold;color:#B71C1C;">{{item.row.total.confirmed}}</span>
                  </template>
                </el-table-column>

                <el-table-column
                    prop="deceased"
                    label="累计死亡人数"
                    sortable="custom">
                  <template slot="header" >
                    <span style="font-size: 16px;font-weight:bold;">累计死亡</span>
                  </template>
                  <template slot-scope="item">
                    <span style="font-size: 16px;font-weight:bold;color:#666666">{{item.row.total.died}}</span>
                  </template>
                </el-table-column>
<!--                <el-table-column-->
<!--                    prop="tests"-->
<!--                    label="核酸检测人次"-->
<!--                    sortable="custom">-->
<!--                  <template slot="header" >-->
<!--                    <span style="font-size: 16px;font-weight:bold;">核酸检测</span>-->
<!--                  </template>-->
<!--                  <template slot-scope="item">-->
<!--                    <span style="font-size: 16px;font-weight:bold;color:#c68400;">{{item.row.tests}}</span>-->
<!--                  </template>-->
<!--                </el-table-column>-->

<!--                <el-table-column-->
<!--                    prop="active"-->
<!--                    label="现存确诊人数"-->
<!--                    sortable="custom">-->
<!--                  <template slot="header" >-->
<!--                    <span style="font-size: 16px;font-weight:bold;">现存确诊</span>-->
<!--                  </template>-->
<!--                  <template slot-scope="item">-->
<!--                    <span style="font-size: 16px;font-weight:bold;color:#1565C0;">{{item.row.active}}</span>-->
<!--                  </template>-->
<!--                </el-table-column>-->

                <el-table-column
                    prop="recovered"
                    label="累计治愈人数"
                    sortable="custom">
                  <template slot="header" >
                    <span style="font-size: 16px;font-weight:bold;">累计治愈</span>
                  </template>
                  <template slot-scope="item">
                    <span style="color:#1B5E20;font-weight:bold;font-size: 16px">{{item.row.total.cured}}</span>
                  </template>
                </el-table-column>

                <el-table-column
                    prop="vaccinated"
                    label="疫苗接种人数"
                    sortable="custom">
                  <template slot="header" >
                    <span style="font-size: 16px;font-weight:bold;">疫苗接种(人)</span>
                  </template>
                  <template slot-scope="item">
                    <span style="color:#0277BD;font-weight:bold;font-size: 16px">{{item.row.total.vaccinated}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </v-col>
          </v-row>

          <div v-if="value === 1">
            <v-row
                style="margin: 10px"
            >
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-btn
                    block
                    class="ma-2"
                    outlined
                    color="indigo"
                    @click="switchAir"
                >
                  <v-icon >mdi-cached</v-icon>
                  <span v-if="changeArrival">国内到达</span>
                  <span v-else>国内出发</span>
                </v-btn>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="输入关键字"
                    single-line
                    hide-details
                ></v-text-field>
              </v-col>
<!--              <v-col cols="12" md="4">-->
<!--                <v-text-field-->
<!--                    label="出发地"-->
<!--                    single-line-->
<!--                    hide-details-->
<!--                    v-model="searchBeginning"-->
<!--                ></v-text-field>-->
<!--              </v-col>-->
<!--              <v-col cols="12" md="4">-->
<!--                <v-text-field-->
<!--                    label="目的地"-->
<!--                    single-line-->
<!--                    hide-details-->
<!--                    v-model="searchArrival"-->
<!--                ></v-text-field>-->
<!--              </v-col>-->
<!--              <v-col cols="12" md="2">-->
<!--                <v-btn-->
<!--                    depressed-->
<!--                    color="primary"-->
<!--                    @click="searchTrain"-->
<!--                >-->
<!--                  搜索-->
<!--                </v-btn>-->
<!--              </v-col>-->
<!--              <v-col  cols="12" md="2">-->
<!--                <v-btn depressed @click="changeFlag">-->
<!--                  返回-->
<!--                </v-btn>-->
<!--              </v-col>-->
            </v-row>
            <v-row>
              <v-data-table
                  :headers="flightHeaders"
                  :items="airShow"
                  class="overflow-x-auto"
                  :search="search"
                  style="white-space: nowrap;font-size: 20px"
              >
                <template v-slot:item.number="{ item }"
                          fixed>
                  <span style="font-weight:bold;font-size: 20px">{{item.number}}</span>
                </template>
                <template v-slot:item.beginning="{ item }">
                  <span style="font-size: 20px;">{{item.beginning}}</span>
                </template>
                <template v-slot:item.arrival="{ item }">
                  <span style="font-size: 20px">{{item.arrival}}</span>
                </template>
                <template v-slot:item.scheduledTime="{ item }">
                  <span style="font-size: 20px">{{item.scheduledTime}}</span>
                </template>
                <template v-slot:item.actualTime="{ item }">
                  <span style="font-size: 20px">{{item.actualTime}}</span>
                </template>
                <template v-slot:item.status="{ item }">
                  <v-chip
                      :color="getColor(item.status)"
                      dark
                      style="font-weight: bold"
                  >
                    {{ item.status }}
                  </v-chip>
<!--                  <span style="font-size: 20px;">{{item.status}}</span>-->
                </template>
              </v-data-table>
            </v-row>

          </div>



        </el-card>

      </v-col>
    </v-row>

    <v-row justify="end">
      <div>
        <a style="text-align: right;display: block;text-decoration: none;color: #999"
           href="https://ncov2019.live/data" target="_blank">
          数据来源：ncov2019.live（点击查看）
        </a>
      </div>
    </v-row>


  </v-container>
</template>

<script>
import * as echarts from 'echarts'
// import moment from 'moment';
// import nameMap from "@/assets/world_name_map.json";

require('@/assets/world')

export default {
  name: "WorldMap",
  data() {
    return {
      value:'',
      search: '',
      confirmed: 0,
      deceased: 0,
      vaccinated: 0,
      time: '',
      headers: [
        {
          text: '国家/地区',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        // { text: '累计确诊人数', value: 'confirmed' },
        // { text: '累计死亡人数', value: 'deceased' },
        // { text: '核酸检测人次', value: 'tests' },
        // { text: '现存确诊人数', value: 'active' },
        // { text: '累计治愈人数', value: 'recovered' },
        // { text: '疫苗接种人数', value: 'vaccinated' },
        { text: '累计确诊人数', value: 'confirmed' },
        { text: '累计死亡人数', value: 'died' },
        { text: '累计治愈人数', value: 'cured' },
        { text: '疫苗接种人数', value: 'vaccinated' },
      ],
      flightHeaders: [
        {
          text: '航班号',
          align: 'start',
          sortable: false,
          value: 'number',
        },
        { text: '起飞机场', value: 'beginning' },
        { text: '到达机场', value: 'arrival' },
        { text: '状态', value: 'status' },
        { text: '预计起飞时间', value: 'scheduledTime' },
        { text: '实际起飞时间', value: 'actualTime' },

      ],
      mapData: [],
      data: [],
      changeArrival:true,
      airShow:[],
      airArrival:[],
      airGo:[],

      sortRule:{prop:null,order:null},
      tabdata:[],
      proptype:'',

      //qiao
      initData:[],
      searchCountry:'',
      all:{
        died:'',
        cures:'',
        confirmed:'',
      },
      country:{
        name:'',
        total:{
          died:'',
          cured:'',
          confirmed:'',
          vaccinated:'',
        }
      }

    }
  },
  methods: {
    //qiao
    changedata(){
      let da = [];
      for(let i =0 ;i<this.initData.length;i++){
        if(this.initData[i].name.indexOf(this.searchCountry)!==-1) {
          da.push(this.initData[i]);
        }
      }
      this.data = da;
      if(this.searchCountry === '') this.data = this.initData;
    },



    sortData({ prop, order}){

      this.proptype = prop;
      console.log(order);

      if (order === 'descending'){
        let pai =[];
        let pai2 = [];
        // this.data.sort(this.ascSortFun);
        for(let i =0;i<this.data.length;i++){
          if(this.data[i][prop] ==='Unknown'){
            pai2.push(this.data[i]);
          }
          else{
            pai.push(this.data[i]);
          }
        }
        pai.sort(this.desSortFun)
        this.data = pai.concat(pai2);
      }else if (order === 'ascending'){
        let pai =[];
        let pai2 = [];
        // this.data.sort(this.ascSortFun);
        for(let i =0;i<this.data.length;i++){
          if(this.data[i][prop] ==='Unknown'){
            pai2.push(this.data[i]);
          }
          else{
            pai.push(this.data[i]);
          }
        }
        pai.sort(this.ascSortFun)
        this.data = pai.concat(pai2);
      }
      else if (order === 'null') {
        this.data = this.tabdata;
      }

    },
    ascSortFun(a, b) {
      return a[this.proptype] - b[this.proptype]
    },
    // 降序排列方法
    desSortFun(a, b) {
      return b[this.proptype] - a[this.proptype]
    },
    getColor (x) {
      if (x==="起飞") return 'green'
      else if (x==="延误")  return 'orange'
      else if (x==="取消")  return 'red'
      else if (x==="计划")  return 'blue'
      else return ''
    },
    async loadMap() {
      await this.getToTalDatePy();
      const myChart = echarts.init(document.getElementById('world-map'))
      const option = {
        title: {
          text: '世界疫情地图',
          left: 'center',
          textStyle: {
            color: 'black'
          },
          top: 'top'
        },
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            return params.name + '<br/>' +
                '累计确诊：' + params.data.dataset[0] + '人' + '<br/>' +
                // '现存确诊：' + params.data.dataset[1] + '人' + '<br/>' +
                '累计治愈：' + params.data.dataset[1] + '人' + '<br/>' +
                '累计死亡：' + params.data.dataset[2] + '人' + '<br/>' +
                '接种疫苗：' + params.data.dataset[3] + '人' ;
                // '核酸检测：' + params.data.dataset[5] + '人';
          }
        },
        visualMap: {
          type: 'piecewise',
          pieces: [
            {min: 10000000,  color: '#4a1d99', width:10},
            {min: 900000, max: 9999999, color: '#763bc8',},
            {min: 1000, max: 899999, color: '#b26cd7'},
            {max: 999, color: '#f0f0f1'},
          ],
          // min: 0,
          // max: 1000000,
          // text: ['High', 'Low'],
          // realtime: false,
          // calculable: false,
          // textStyle: {
          //   color: 'black'
          // },
          // color: ['#481380', '#7f78d2', '#efb1ff', '#ffe2ff'],
          orient: 'horizontal', //控制条横向
          left: 'center',

        },

        series: [{
          name: '累计确诊人数',
          type: 'map',
          zoom:1.3,
          mapType: 'world',
          roam: true,
          itemStyle: {
            normal: {
              areaColor: '#fce8d5',
              borderColor: 'rgb(0,108,255)',
            },
            emphasis: {
              label: {
                show: true,
                color: 'black'
              },
              areaColor: '#fce8d5'
            }
          },
          nameMap: require('@/assets/world_name_map.json'),
          data: this.mapData,
          scaleLimit: {
            min: 0.9
          }
        }]
      }
      myChart.setOption(option)
    },
    getTotalData(){
      this.$axios.get('http://10.251.254.107:8081/data/total').then(res=>{
        console.log(res)
        this.confirmed = res.data.data.confirmed;
        this.deceased = res.data.data.deceased;
        this.vaccinated = res.data.data.vaccinated;
      })
    },
    async getToTalDatePy(){
      const nameMap = require('@/assets/world_name_map.json')
      // let time_stamp = moment(Date.now()).format('YYYY-MM-DD');
      // console.log(nameMap.PINYIN_MAP)
      await this.$axios.get('http://127.0.0.1:8000/data/today/international_analyze').then(res => {
        if (res.data.status === 0) {
          this.data = res.data.data[0].countries;
          for(var i=0;i<this.data.length;i++){
            var numReg = /^[0-9]*$/
            var numRe = new RegExp(numReg)
            this.country = this.data[i];
            this.deceased += numRe.test(this.country.total.died)?parseInt(this.country.total.died):0;
            this.confirmed += numRe.test(this.country.total.confirmed)?parseInt(this.country.total.confirmed):0;
            this.vaccinated += numRe.test(this.country.total.vaccinated)?parseInt(this.country.total.vaccinated):0;
            if (nameMap[this.country.name] === undefined) {
              const data1 = {
                name: this.country.name,
                value: this.country.total.confirmed,
                dataset: [
                  this.country.total.confirmed,
                  this.country.total.cured,
                  this.country.total.died,
                  this.country.total.vaccinated,
                ]
              }
              this.mapData.push(data1)
            } else {
              const data1 = {
                name: nameMap[this.country.name],
                value: this.country.total.confirmed,
                dataset: [
                  this.country.total.confirmed,
                  this.country.total.cured,
                  this.country.total.died,
                  this.country.total.vaccinated,
                ]
              }
              this.data[i].name = nameMap[this.country.name]
              this.mapData.push(data1)
            }

          }
        }
      })
      this.tabdata = this.data;

      //qiao
      this.initData = this.data;
    },
    async getCountryData(){
      const nameMap = require('@/assets/world_name_map.json')
      await this.$axios.get('http://10.251.254.107:8081/data/all').then(res =>{
        this.data = res.data.data;
        this.data.forEach((country, i) => {
          if (nameMap[country.name] === undefined) {
            const data1 = {
              name: country.name,
              value: country.confirmed,
              dataset: [
                country.confirmed,
                parseInt(country.active.replace(/,/g, "")),
                parseInt(country.recovered.replace(/,/g, "")),
                parseInt(country.deceased.replace(/,/g, "")),
                parseInt(country.vaccinated.replace(/,/g, "")),
                parseInt(country.tests.replace(/,/g, "")),
              ]
            }
            this.mapData.push(data1)
          } else {
            const data1 = {
              name: nameMap[country.name],
              value: country.confirmed,
              dataset: [
                country.confirmed,
                parseInt(country.active.replace(/,/g, "")),
                parseInt(country.recovered.replace(/,/g, "")),
                parseInt(country.deceased.replace(/,/g, "")),
                parseInt(country.vaccinated.replace(/,/g, "")),
                parseInt(country.tests.replace(/,/g, "")),
              ]
            }
            this.data[i].name = nameMap[country.name]
            this.mapData.push(data1)
          }
        })
        console.log(this.mapData)
      })
      this.tabdata = this.data;

      //qiao
      this.initData = this.data;


      console.log(this.data.length)
    },
    getAirData(){
      const _this = this;
      this.$axios.get('http://10.251.254.107:8081/data/flightToAbroad').then(function (resp) {
        _this.airGo = resp.data.data;
        _this.airShow = _this.airGo;
        })
      this.$axios.get('http://10.251.254.107:8081/data/flightToChina').then(function (resp) {
        _this.airArrival = resp.data.data;
      })
    },
    switchAir() {
      this.changeArrival= !this.changeArrival;
      if(this.changeArrival) {
        this.airShow = this.airGo;
        this.$forceUpdate()
        // this.reload()
      }
      else {
        this.airShow = this.airArrival;
        this.$forceUpdate()
      }
    }
  },

  created() {
    this.getToTalDatePy();
    // this.getCountryData();

    // this.getAirData();
    this.$vuetify.theme.dark = false
    const formDate = () => {
      let d = new Date()
      let year = d.getFullYear(), //多变量赋值
          month = d.getMonth() + 1, //month：从0开始
          date = d.getDate(),
          hour = d.getHours(),
          minute = d.getMinutes(),
          second = d.getSeconds();

      year = year < 10 ? '0' + year : year; //三元操作符
      month = month < 10 ? '0' + month : month;
      date = date < 10 ? '0' + date : date;
      hour = hour < 10 ? '0' + hour : hour;
      minute = minute < 10 ? '0' + minute : minute;
      second = second < 10 ? '0' + second : second;
      this.time = year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
    }
    formDate()
    setInterval(formDate, 1000) //设定定时器，循环运行;
  },
  mounted() {
    this.getToTalDatePy();
    // this.getTotalData();
    this.loadMap();
  }
}
</script>

<style scoped>
.info-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
}
#world-map {
  padding: 0;
  margin: 0;
  height: 600px;
  width: 100%;
}
.el-table .go-row {
  background: #35791b;
}

.el-table .delete-row {
  background: #e60000;
}
</style>
