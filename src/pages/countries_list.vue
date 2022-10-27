<template>
  <div class="countries_list">
    <div class="left_info">
        <el-card class="total_info">
            <div slot="header" class="overview">
                <span>世界疫情总览</span>
            </div>
            <ChangeCard class="card" card_type="died" 
                :data="worldwide.total.died" :new_data="worldwide.new.died"></ChangeCard>
            <ChangeCard class="card" card_type="confirmed" 
                :data="worldwide.total.confirmed" :new_data="worldwide.new.confirmed"></ChangeCard>
            <ChangeCard class="card" card_type="cured" 
                :data="worldwide.total.cured" :new_data="worldwide.new.cured"></ChangeCard>
        </el-card>
    </div>
    <div class="right_info">
      <el-card class="saved_list" v-if="isShowLike">
        <div class="top_info">
            收藏<el-input v-model="searchForLike" 
                    placeholder="搜索数据" style="width:20%;float:right"/>
        </div>
        <div class="bot_info">
            <el-table 
                :data="tableData.filter(data => !searchForLike || data.name.includes(searchForLike))" 
                :cell-class-name="addCellClass" :row-class-name="addRowClass" max-height="250px" class="list_bar" stripe>
                <el-table-column prop="name" 
                    label="国家" width="200px" sortable>
                </el-table-column>
                <el-table-column prop="total.died" 
                    label="累计死亡" width="130px" sortable></el-table-column>  
                <el-table-column prop="total.confirmed" 
                    label="累计确诊" width="130px" sortable></el-table-column>  
                <el-table-column prop="total.cured" 
                    label="累计治愈" width="130px" sortable></el-table-column>  
                <el-table-column prop="new.died" 
                    label="新增死亡" width="120px" sortable></el-table-column>  
                <el-table-column prop="new.confirmed"
                    label="新增确诊" width="120px" sortable></el-table-column>  
                <el-table-column prop="new.cured"
                    label="新增治愈" width="120px" sortable></el-table-column>      
            </el-table>
        </div>
      </el-card>
      <el-card class="saved_list">
        <div class="top_info">
            全部<el-input v-model="searchForAll" 
                    placeholder="搜索数据" style="width:20%;float:right"/>
        </div>
        <div class="bot_info">
            <el-table :data="allCountries.filter(data => !searchForAll || data.name.includes(searchForAll))" 
                :cell-class-name="addCellClass" :row-class-name="addRowClass" max-height="1500px" class="list_bar" stripe>
                <el-table-column prop="img" width="50px">
                    <template slot-scope="scope">
                        <el-image fit="contain" :src="getImgName(allCountries[scope.$index].name)" ></el-image>
                     </template>
                </el-table-column>
                <el-table-column prop="name" 
                    label="国家" width="200px" sortable>
                </el-table-column>
                <el-table-column prop="new.died" 
                    label="新增死亡" width="120px" sortable></el-table-column>  
                <el-table-column prop="new.confirmed"
                    label="新增确诊" width="120px" sortable></el-table-column>  
                <el-table-column prop="new.cured"
                    label="新增治愈" width="120px" sortable></el-table-column>  
                <el-table-column prop="total.died" 
                    label="累计死亡" width="130px" sortable></el-table-column>  
                <el-table-column prop="total.confirmed" 
                    label="累计确诊" width="130px" sortable></el-table-column>  
                <el-table-column prop="total.cured" 
                    label="累计治愈" width="130px" sortable></el-table-column>      
            </el-table>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import "echarts-countries-js/echarts-countries-js/china.js";
import RegionCard from "@/components/region_card";
import ChangeCard from "@/components/change_card";
import * as picMap from '@/assets/registry.json';

export default {
  name: "ProvinceMap",
  components: {
    RegionCard,
    ChangeCard
  },
  data() {
    return {
        isShowLike: false,
        searchForLike: '',
        searchForAll : '',
        isLike: [0,0,0,1,0,1],
        picMap: {},
        worldwide: {
            new:{
                died:32, cured:79, confirmed: 432
            },
            total:{
                died:498, cured:88, confirmed: 5557
            }
        },
        tableData: [
        {
          name: '中国',
          new: {died: 120,cured: 34, confirmed: 45},
          total: {died: 100,cured: 34,confirmed: 45}
        },
        {
          name: '不丹',
          new: {died: 20,cured: 34, confirmed: 45},
          total: {died: 100,cured: 34,confirmed: 45}
        },
        {
          name: '乌拉圭',
          new: {died: 500,cured: 34, confirmed: 45},
          total: {died: 100000000,cured: 34,confirmed: 45}
        }
        ],
        allCountries:[
        {
          name: '中国',
          new: {died: 120,cured: 34, confirmed: 45},
          total: {died: 100,cured: 34,confirmed: 45}
        },
        {
          name: '不丹',
          new: {died: 20,cured: 34, confirmed: 45},
          total: {died: 100,cured: 34,confirmed: 45}
        },
        {
          name: '乌拉圭',
          new: {died: 500,cured: 34, confirmed: 45},
          total: {died: 100000000,cured: 34,confirmed: 45}
        },
        {
          name: '俄罗斯',
          new: {died: 120,cured: 34, confirmed: 45},
          total: {died: 100,cured: 34,confirmed: 45}
        },
        {
          name: '美国',
          new: {died: 20,cured: 34, confirmed: 45},
          total: {died: 100,cured: 34,confirmed: 45}
        },
        {
          name: '墨西哥',
          new: {died: 500,cured: 34, confirmed: 45},
          total: {died: 100000000,cured: 34,confirmed: 45}
        },
        {
          name: '刚果民主共和国',
          new: {died: 120,cured: 34, confirmed: 45},
          total: {died: 100,cured: 34,confirmed: 45}
        },
        {
          name: '澳大利亚',
          new: {died: 20,cured: 34, confirmed: 45},
          total: {died: 100,cured: 34,confirmed: 45}
        },
        {
          name: '日本',
          new: {died: 500,cured: 34, confirmed: 45},
          total: {died: 100000000,cured: 34,confirmed: 45}
        }
        ]
    };
  },
  mounted() {
    this.picMap = picMap;
  },
  methods: {
    init() {
      this.apply_for_info();
    },
    apply_for_info() {
        let time_stamp = moment(Date.now()).format('YYYY-MM-DD');
        var that = this;
        this.ajax.debug.get({}, true,
            '/map/world', {
                date: time_stamp
            }, this, {
                success(res){
                    if(res.status === 0) {
                        that.allCountries = res.countries;
                        that.worldwide = res.world;
                        // that.alert_msg.success('success');
                    }else{
                        switch(res.status) {
                            default:
                                // that.alert_msg.error('发生了错误');
                        }
                    }
                },
                error(){
                    // this.alert_msg.error('error');
                }
            }, {}
        );
    },
    addCellClass({row, column, rowIndex, columnIndex}) {
        // if(columnIndex === 0) {
        //     return "iconfont icon-shoucang2"
        // }
        if(columnIndex===2 || columnIndex===5) {
            return "red_number";
        }else if(columnIndex===3 || columnIndex===6) {
            return "blue_number";
        }else if(columnIndex===4 || columnIndex===7) {
            return "green_number";
        }
    },
    addRowClass({row, rowIndex}) {
        return "row_style";
    },
    getImgName(countryName) {
        try 
        {
            console.log(countryName);
            let file_name = this.picMap.PINYIN_MAP[countryName].toLowerCase() + '.png';
            console.log(file_name);
            return require('@/assets/global-national-flag/' + file_name);
        } catch (e) {

        }
    }
  }
};
</script>

<style>
.countries_list {
  height: calc(100% - var(--nav-height) - 4px);
  position: relative;
}

.left_info {
  position: absolute;
  top: 0;
  left: 0;
  width: 30%;
  height: 100%;
  /* border: solid 1px #000; */
}
.left_info .total_info{
  height: 80%;
  margin: 5% 1% 5% 5%;
  /* border: solid 1px #000; */
}

.left_info .total_info .overview{
  text-align: center;
  font-size: 30px;
  /* border: solid 1px #000; */
}

.left_info .total_info .card{
  margin: 2% 0 8% 0;
}

.right_info {
  position: absolute;
  top: 0;
  right: 0;
  width: 70%;
  height: auto;
  /* border: solid 1px #000; */
}
.right_info .saved_list {
  width: 94%;
  height: auto;
  margin: 2.5% 3%;
  font-size: 20px;
}

.right_info .saved_list .top_info{
  height: 40px;
  font-size: 30px;
  margin-bottom: 3%;
}
.right_info .saved_list .bot_info{
  width: 100%;
  height: auto;
  font-size: 20px;
}
.right_info .saved_list .bot_info .list_bar{
  font-size: 18px;
}
.right_info .saved_list .bot_info .list_info{
  font-size: 20px;
}
.right_info .saved_list .bot_info .list_info .list_data{
  width: 100%;
  height: 50px;
}
.red_number{
    margin: 0% 10px;
    color: red;
}
.blue_number{
    margin: 0% 10px;
    color: blue;
}
.green_number{
    margin: 0% 10px;
    color: green;
}

</style>



// WEBPACK FOOTER //
// src/pages/countries_list.vue