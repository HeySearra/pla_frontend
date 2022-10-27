<template>
    <div class="index">
        <div class="provinces">
            <ProvincesCondition ref="provinces"/>
        </div>
        <div class="map">
            <div class="index_header">
                <PointSlider ref="slider" @change="slider_change"></PointSlider>
            </div>
            <div class="index_main">
                <div class="index-left">
                    <ChinaMap ref="china_map" :rank_key="rank_key" :follow_list_add = "follow_list_add"></ChinaMap>
                </div>
                <div class="index-right">
                    <el-button class="get_location_button" type="primary" plain @click="get_location"><i :class="location_loading?'el-icon-loading':'el-icon-location'"></i> {{location_loading?'正在获取当前的位置信息':'查看当前位置的疫情'}}</el-button>
                    <ChangeCard v-for="(item,index) in card_list"
                                :key="index"
                                :card_type="item.type"
                                :data="item.total"
                                :new_data="item.new"
                                :on_select="on_click_card">
                    </ChangeCard>
                    <ChangeCard
                      card_type="vaccinated"
                      :data="vaccine_data">
                    </ChangeCard>
                    <div style="text-align: center; color: #aaa;"><i class="el-icon-info"></i> 疫苗无历史数据，最近更新时间 2021.07.04</div>
                    <!-- <RankTable v-if="false" ref="rank_key"  :rank_key="rank_key"></RankTable> -->
                    <FollowList :follow_list="follow_list"></FollowList>
                </div>
            </div>
        </div>
        <DataFrom :info="data_from" />
    </div>
</template>

<script>
import moment from 'moment';
import ChangeCard from "@/components/change_card";
import ChinaMap from "@/components/china_map";
import RankTable from "@/components/rank_table";
import PointSlider from '@/components/point_slider';
import ProvincesCondition from '@/components/provinces_condition';
import FollowList from '@/components/follow_list'

export default {
	name: "IndexChina",

	components: {
		ChangeCard,
		ChinaMap,
		RankTable,
		PointSlider,
		ProvincesCondition,
    FollowList
	},

  mounted() {
    this.init();
  },

  destroyed() {
  },

  props: {},

  data() {
    return {
      rank_key: "confirmed",
      card_list: [{
        type: 'confirmed',
        total: '',
        new: ''
      }, {
        type: 'cured',
        total: '',
        new: ''
      }, {
        type: 'died',
        total: '',
        new: ''
      }],
      //中国疫情数据
      china_data:{},
      location_loading: false,
      data_from: [{
        title: '国内数据（丁香园）',
        content: 'https://github.com/BlankerL/DXY-COVID-19-Data/releases/tag/2021.07.05'
      }, {
        title: '位置获取信息',
        content: '基于百度地图 API'
      }],
      vaccine_data: '130549.9万'
    };
  },

  watch: {},

  methods: {
    init() {
      this.location_loading = false;
      this.apply_for_info();
      if (localStorage.getItem('map_type')) {
        this.rank_key = localStorage.getItem('map_type');
      }
    },
    apply_for_info() {

      this.ajax.get('/data/today/domestic_analyze', {}, this, {
        success(res) {
          this.china_data = res.data;
          // this.$refs.slider.init(res.data[0].date, res.data[res.data.length-1].date);

          this.change_card(this.china_data[0].provinces);

          this.$refs.provinces.init(this.china_data[0].provinces);
          this.$refs.china_map.init(this.china_data[0].provinces);
          // this.$refs.rank_key.init(this.china_data.provinces);
        }
      });
      this.ajax.get('/data/domestic_analyze', {}, this, {
        success(res) {
          this.china_data = res.data;
          this.$refs.slider.init(res.data[0].date, res.data[res.data.length-1].date);
        }
      });
    },
    change_card(provinces) {
      // cal chinese total and new
      let total = {
        confirmed: 0,
        cured: 0,
        died: 0
      };
      let n = {...total};
      for(let i=0; i<provinces.length; i++) {
        total.confirmed += provinces[i].total.confirmed;
        total.cured += provinces[i].total.cured;
        total.died += provinces[i].total.died;
        n.confirmed += provinces[i].new.confirmed;
        n.cured += provinces[i].new.cured;
        n.died += provinces[i].new.died;
      }
      this.card_list[0].total = total.confirmed;
      this.card_list[0].new = n.confirmed;
      this.card_list[1].total = total.cured;
      this.card_list[1].new = n.cured;
      this.card_list[2].total = total.died;
      this.card_list[2].new = n.died;
    },

    destroyed() {
    },

    props: {},

    data() {
        return {
            rank_key: "confirmed",
            card_list: [{
                type: 'confirmed',
                total: '',
                new: ''
            }, {
                type: 'cured',
                total: '',
                new: ''
            }, {
                type: 'died',
                total: '',
                new: ''
            }],
            //中国疫情数据
            china_data: {},
            location_loading: false,
            follow_list: [],
        };
    },

    watch: {},

    methods: {
        init() {
            this.apply_for_info();
            if (localStorage.getItem('map_type')) {
                this.rank_key = localStorage.getItem('map_type');
            }
        },
        apply_for_info() {

            this.ajax.get('/data/today/domestic_analyze', {}, this, {
                success(res) {
                    this.china_data = res.data;
                    // this.$refs.slider.init(res.data[0].date, res.data[res.data.length-1].date);

                    this.change_card(this.china_data[0].provinces);

                    this.$refs.provinces.init(this.china_data[0].provinces);
                    this.$refs.china_map.init(this.china_data[0].provinces);
                    // this.$refs.rank_key.init(this.china_data.provinces);
                }
            });
            this.ajax.get('/data/domestic_analyze', {}, this, {
                success(res) {
                    this.china_data = res.data;
                    this.$refs.slider.init(res.data[0].date, res.data[res.data.length - 1].date);
                }
            });
            this.ajax.post('/follow/data', {}, this, {
                success(res) {
                    this.follow_list = res.data;
                }
            })
        },
        change_card(provinces) {
            // cal chinese total and new
            let total = {
                confirmed: 0,
                cured: 0,
                died: 0
            };
            let n = {...total};
            for (let i = 0; i < provinces.length; i++) {
                total.confirmed += provinces[i].total.confirmed;
                total.cured += provinces[i].total.cured;
                total.died += provinces[i].total.died;
                n.confirmed += provinces[i].new.confirmed;
                n.cured += provinces[i].new.cured;
                n.died += provinces[i].new.died;
            }
            this.card_list[0].total = total.confirmed;
            this.card_list[0].new = n.confirmed;
            this.card_list[1].total = total.cured;
            this.card_list[1].new = n.cured;
            this.card_list[2].total = total.died;
            this.card_list[2].new = n.died;
        },
        change_map(provinces) {
            this.$refs.china_map.set(provinces);
        },
        on_click_card(type) {
            this.rank_key = type;
        },
        slider_change(date) {
            var provinces;
            for (let i = 0; i < this.china_data.length; i++) {
                if (date.utc().format() == moment(this.china_data[i].date).utc().format()) {
                    provinces = this.china_data[i].provinces;
                    break;
                }
            }
            this.change_card(provinces);
            this.change_map(provinces);
        },
        get_location() {
            var that = this;
            this.alert_box.confirm('获取隐私信息', 'MarCov 定位功能将会获取您的位置等相关信息，有可能涉及敏感内容，请问您是否允许？', this, function () {
                this.location_loading = true;
                $.ajax({
                    type: 'get',
                    url: 'http://api.map.baidu.com/location/ip?ak=ITHarvTYyTLaChyAUAbAyb6LCb5HyjYy&coor=bd09ll',
                    dataType: "jsonp",
                    jsonp: "callback",
                    success: function (res) {
                        $.ajax({
                            type: 'get',
                            url: 'http://api.map.baidu.com/reverse_geocoding/v3/?ak=ITHarvTYyTLaChyAUAbAyb6LCb5HyjYy&output=json&coordtype=wgs84ll&location=' + res.content.point.y + ',' + res.content.point.x,
                            dataType: "jsonp",
                            jsonp: "callback",
                            success: function (res) {
                                that.alert_msg.success('当前位置为：' + res.result.addressComponent.province + '-' + res.result.addressComponent.city + '-' + res.result.addressComponent.district);
                            },
                            error: function (xhr) {
                                that.location_loading = false;
                            }
                        });
                    },
                    error: function (xhr) {
                        that.location_loading = false;
                    }
                });
            }, function () {
                this.alert_msg.error('MarCov 没有权限获取位置信息');
            });
        },
        follow_list_add(item){
            this.follow_list.push(item)
        }
    },
    get_location() {
      var that = this;
      var point;

      this.alert_box.confirm('获取隐私信息', 'MarCov 定位功能将会获取您的位置等相关信息，有可能涉及敏感内容，请问您是否允许？', this, function() {
        this.location_loading = true;
        var geolocation = new BMap.Geolocation();
        // 开启SDK辅助定位
        geolocation.enableSDKLocation();
        geolocation.getCurrentPosition(function(r){
          if(this.getStatus() == BMAP_STATUS_SUCCESS){
            point = r.point;
            $.ajax({
              type: 'get',
              url: 'http://api.map.baidu.com/reverse_geocoding/v3/?ak=ITHarvTYyTLaChyAUAbAyb6LCb5HyjYy&output=json&coordtype=wgs84ll&location='+(point.lat+0.06)+','+(point.lng-0.03),
              dataType: "jsonp",
              jsonp: "callback",
              success: function(res){
                that.alert_msg.success('当前位置为：'+res.result.addressComponent.province+'-'+res.result.addressComponent.city+'-'+res.result.addressComponent.district);
                if (res.result.addressComponent.province == '上海市' || res.result.addressComponent.province == '北京市') {
                    that.$router.push({
                        name: 'province_map',
                        params: {
                            name: res.result.addressComponent.province.substring(0, res.result.addressComponent.province.length-1),
                        }
                    });
                } else {
                    that.$router.push({
                        name: "city_map",
                        params: {
                            province_name: res.result.addressComponent.province.substring(0, res.result.addressComponent.province.length-1),
                            name: res.result.addressComponent.city
                        }
                    });
                }
              },
              error: function(xhr){
                that.location_loading = false;
              }
            });
          }
          else {
            that.alert_msg.error('定位失败');
            return;
          }
        });
      }, function() {
        this.alert_msg.error('MarCov 没有权限获取位置信息');
      });
    }
  },
};
</script>

<style scoped>
:local {
    --provinces-width: 450px;
}

.el-slider {
    margin: 0 100px;
}

.provinces {
    width: var(--provinces-width);
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #fafafa;
    border-right: solid 1px #eee;
}

.map {
    position: absolute;
    height: 100%;
    width: calc(100% - var(--provinces-width));
    top: 0;
    left: var(--provinces-width);
}

.world_map, .china_map {
    margin-left: 3px;
    width: calc(100% - 3px);
    height: 100%;
    /* border: solid 1px #aaa; */
}

.rank_table {
    height: calc(100% - 240px);
    width: 100%;
    margin: 0 auto;
}

* {
    --index-right-width: 350px;
    --index-header-height: 60px;
}

.index {
    height: calc(100% - var(--nav-height) - 4px);
    position: relative;
    overflow: hidden;
    background-color: #fefefe;
    /* border: solid 1px #000; */
}

.index_header {
    margin: 0 auto;
    width: 90%;
    padding: 10px;
    /* height: var(--index-header-height); */
}

.index_main {
    width: 100%;
    height: calc(100% - var(--index-header-height));
    position: relative;
    /* background-image: url('../assets/water.jpg'); */
}

.index-left {
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - var(--index-right-width));
    height: 100%;
    /* border: solid 1px #000; */
}

.index-right {
    position: absolute;
    top: 0;
    right: 0;
    width: var(--index-right-width);
    height: 100%;
    /* background-color: #ccc; */
    /* border: solid 1px #000; */
}

.el-slider {
    margin: 0 100px;
}

.world_map, .china_map {
    margin-left: 3px;
    width: calc(100% - 3px);
    height: 100%;
    /* border: solid 1px #aaa; */
}

.rank_table {
    height: calc(100% - 240px);
    width: 100%;
    margin: 0 auto;
}

* {
    --index-right-width: 350px;
    --index-header-height: 60px;
}

.index {
    height: calc(100% - var(--nav-height) - 4px);
    position: relative;
    overflow: hidden;
    background-color: #fefefe;
    /* border: solid 1px #000; */
}

.index_header {
    margin: 0 auto;
    width: 90%;
    padding: 10px;
    /* height: var(--index-header-height); */
}

.index_main {
    width: 100%;
    height: calc(100% - var(--index-header-height));
    position: relative;
}

.index-left {
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - var(--index-right-width) - 4px);
    height: 100%;
    /* border: solid 1px #000; */
}

.index-right {
    position: absolute;
    top: 0;
    right: 0;
    width: var(--index-right-width);
    height: 100%;
    /* border: solid 1px #000; */
}

.get_location_button {
    width: 97%;
    font-size: 16px;
    margin: 10px 2% 10px 1%;
}
</style>



// WEBPACK FOOTER //
// src/pages/index_china.vue