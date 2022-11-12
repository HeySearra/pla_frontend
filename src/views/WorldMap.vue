<template>
  <div v-loading="loading">
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
            <p class="text-h4 mb-1" style="font-weight:bold">总计治愈</p>
            <p class="text-h2 mb-4" style="color:#35791b;font-weight:bold">{{cured}}</p>
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
            <v-tab style="font-size: 20px">世界疫情数据</v-tab>
          </v-tabs>
          <v-row v-if="value===0">
            <v-col>
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
              </el-table>
            </v-col>
          </v-row>
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
  </div>
</template>

<script>
import * as echarts from 'echarts'

require('@/assets/world')

export default {
  name: "WorldMap",
  data() {
    return {
      loading : false,
      value:'',
      search: '',
      confirmed: 0,
      deceased: 0,
      cured: 0,
      time: '',
      headers: [
        {
          text: '国家/地区',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: '累计确诊人数', value: 'confirmed' },
        { text: '累计死亡人数', value: 'died' },
        { text: '累计治愈人数', value: 'cured' },
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

      sortRule:{prop:'confirmed',order:null},
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
      if (order === 'descending'){
        this.data.sort(this.desSortFun);
      }else if (order === 'ascending'){
        this.data.sort(this.ascSortFun);
      }
      else if (order === 'null') {
        this.data = this.tabdata;
      }

    },
    ascSortFun(a, b) {
      return a.total[this.proptype] - b.total[this.proptype]
    },
    // 降序排列方法
    desSortFun(a, b) {
      return b.total[this.proptype] - a.total[this.proptype]
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
                '累计治愈：' + params.data.dataset[1] + '人' + '<br/>' +
                '累计死亡：' + params.data.dataset[2] + '人' ;
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
    async getToTalDatePy(){
      this.loading = true;
      const nameMap = require('@/assets/world_name_map.json')
      var numReg = /^[0-9]*$/
      var numRe = new RegExp(numReg)
      await this.$axios.get('http://42.194.158.76:8001/data/today/international_analyze').then(res => {
        if (res.data.status === 0) {
          this.data = res.data.data[0].countries;
          for(var i=0;i<this.data.length;i++){
            this.country = this.data[i];
            this.deceased += numRe.test(this.country.total.died)?parseInt(this.country.total.died):0;
            this.confirmed += numRe.test(this.country.total.confirmed)?parseInt(this.country.total.confirmed):0;
            this.cured += numRe.test(this.country.total.cured)?parseInt(this.country.total.cured):0;
            if (nameMap[this.country.name] === undefined) {
              const data1 = {
                name: this.country.name,
                value: this.country.total.confirmed,
                dataset: [
                  this.country.total.confirmed,
                  this.country.total.cured,
                  this.country.total.died,
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
                ]
              }
              this.data[i].name = nameMap[this.country.name]
              this.mapData.push(data1)
            }

          }
        }
      })
      this.tabdata = this.data;

      this.initData = this.data;
    },

  },

  created() {
    this.getToTalDatePy();
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
    this.loadMap().then(()=>{
      this.loading = false;
    })
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
