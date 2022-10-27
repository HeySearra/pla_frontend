<template>
    <div class="city_map">
        <div class="left_info">
            <div class="top_bar">
                <div class="top_card text_overflow_1">
                    {{ cur_city }}
                    <!-- <div class="card_bot">更新时间：2021/12/12 15:21</div> -->
                </div>
                <div class="outer_change_card">
                    <ChangeCard
                        card_type="confirmed"
                        :data="city_data.total.confirmed"
                        :new_data="city_data.new.confirmed"
                    >
                    </ChangeCard>
                </div>
                <div class="outer_change_card">
                    <ChangeCard
                        card_type="died"
                        :data="city_data.total.died"
                        :new_data="city_data.new.died"
                    >
                    </ChangeCard>
                </div>
                <div class="outer_change_card">
                    <ChangeCard
                        card_type="cured"
                        :data="city_data.total.cured"
                        :new_data="city_data.new.cured"
                    >
                    </ChangeCard>
                </div>
                <div class="clear_both"></div>
            </div>
            <div class="slider">
                <PointSlider style="flex: 1" ref="slider" @change="slider_change"/>
                <!-- <PointSlider @change="apply_for_info($event)"/> -->
                <el-button @click="follow">{{ follow_info }}</el-button>
            </div>
            <div style="border-bottom: solid 1px #eee"></div>
            <div class="map_chart" id="map_chart"></div>
        </div>
        <div class="right_info shadow">
            <div class="top_info">{{ cur_city }}地区动态</div>
            <div class="inner_right_info">
                <template v-for="item in info">
                    <TravelMessageCard
                        :title="item['title']"
                        :content="item['content']"
                        :risk="risk"/>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import ChangeCard from "@/components/change_card";
import TravelMessageCard from "@/components/travel_message_card";
import PointSlider from "@/components/point_slider";
import {cityMap} from "@/assets/citys/china-main-city-map.js";
// import echarts from 'echarts'
import moment from "moment";

export default {
    name: "CityMap",
    components: {
        ChangeCard,
        TravelMessageCard,
        PointSlider
    },
    data() {
        return {
            mapChart: {},
            resize_func: "",
            registry: {},
            fileMap: {},
            cur_city: "",
            chosen_card: "confirmed",
            history_data: [],
            city_data: {
                new: {
                    died: 0,
                    cured: 0,
                    confirmed: 0
                },
                total: {
                    died: 0,
                    cured: 0,
                    confirmed: 0,
                }
            },
            districts: [],
            info: [],
            districts_for_map: [],
            in_policy: '',
            out_policy: '',
            risk: '',
            is_star: 2
        };
    },
    computed: {
        follow_info() {
            if (this.is_star == 1) return '取消订阅';
            return '订阅';
        }
    },
    mounted() {
        this.init();
        var that = this;
        this.resize_func = function () {
            that.mapChart.resize();
        };
        window.addEventListener("resize", this.resize_func);
    },
    destroyed() {
        window.removeEventListener("resize", this.resize_func);
    },
    watch: {
        districts_for_map(newValue) {
            this.make_map(this.$route.params.name, "map_chart");
        }
    },
    methods: {
        init() {
            // 请求数据
            this.apply_for_info();
            this.cur_city = this.$route.params.name;
            this.mapChart = this.$echarts.init(document.getElementById("map_chart"));
            this.make_map(this.$route.params.name, "map_chart");
            var that = this;
            //   加载地图
            this.mapChart.on("click", function (params) {
                if (params.componentType === "title") {
                    that.$router.go(-1);
                    return;
                }
            });
        },
        apply_for_info() {
            this.ajax.get(
                "/map/today/city",
                {
                    city: this.$route.params.name,
                    province: this.$route.params.province_name
                },
                this,
                {
                    success(res) {
                        if (res.status === 0) {
                            this.city_data = res.city;
                            this.districts = res.districts;
                            this.generateDistrictInfo("confirmed");
                            // that.alert_msg.success('success');
                        } else {
                            switch (res.status) {
                                default:
                                // that.alert_msg.error('发生了错误');
                            }
                        }
                    },
                    error() {
                        this.alert_msg.error("error");
                    }
                },
                {}
            );
            this.ajax.get(
                "/map/city",
                {
                    city: this.$route.params.name,
                    province: this.$route.params.province_name
                },
                this,
                {
                    success(res) {
                        if (res.status === 0) {
                            this.history_data = res.data;
                            this.$refs.slider.init(this.history_data[0].date, this.history_data[this.history_data.length - 1].date);
                            // that.alert_msg.success('success');
                        } else {
                            switch (res.status) {
                                default:
                                // that.alert_msg.error('发生了错误');
                            }
                        }
                    },
                    error() {
                        this.alert_msg.error("error");
                    }
                },
                {}
            );
            this.ajax.post(
                "/travel/policy",
                {
                    city: this.$route.params.name
                },
                this,
                {
                    success(res) {
                        if (res.status === 0) {
                            this.in_policy = res.enter_policy;
                            this.out_policy = res.out_policy;
                            this.info = [{title: '入省政策', content: this.in_policy}, {title: '出省政策', content: this.out_policy}]
                        } else {
                            this.info = []
                        }
                    },
                    error() {
                    }
                },
                {}
            );
          this.ajax.get(
            "/map/risk",
            {
              name: this.$route.params.name
            },
            this,
            {
              success(res) {
                if (res.status === 0) {
                  this.risk = res.level;

                } else {
                  switch (res.status) {
                    default:

                  }
                }
              },
              error() {
              }
            },
            {}
          );
        },
        make_map(cityName, dom_id) {
            let number = cityMap[cityName];
            let json = require(`@/assets/citys/${number}.json`);
            this.$echarts.registerMap(cityName, json);
            var option = {
                title: {
                    show: true,
                    text: "返回省地图",
                    triggerEvent: true,
                    padding: [20, 50],
                    textStyle: {
                        fontFamily: "Arial"
                    }
                },
                legend: [
                    {
                        selectedMode: "multiple",
                        top: "top",
                        orient: "horizontal",
                        data: [""],
                        left: "center",
                        show: true
                    }
                ],
                tooltip: {
                    ttriggerOn: "mousemove",
                    formatter: function (param) {
                        return param.name;
                    },
                    extraCssText:
                        "background: #182235; border-radius: 5;color: #fff;width:150px;text-align:center"
                },
                visualMap: {
                    type: 'piecewise',
                    //left: "right",
                    right: '30',
                    bottom: '30',
                    itemHeight: 20,
                    itemWidth: 30,
                    pieces: [
                        {min: 2, max: 2, label: '低风险'},
                        {min: 3, max: 3, label: '中风险'},
                        {min: 4, max: 4, label: '高风险'},
                    ],
                    inRange: {
                        color: [
                            "#1882c3",
                            "#e4b921",
                            "#cb3434",
                        ]
                    },
                    //categories: ['高风险', '中风险', '低风险', '未知'],
                    calculable: true
                },
                backgroundColor: "#fff",
                series: {
                    name: cityName,
                    map: cityName,
                    type: "map",
                    data: this.districts_for_map,
                    roam: true, //是否开启缩放和平移
                    zoom: 1.2, //视角缩放比例
                    label: {
                        normal: {
                            show: true, //是否显示省份名称
                            fontSize: "10", //字体大小
                            color: "#000" //字体颜色
                        },
                        emphasis: {
                            //动态展示的样式
                            fontSize: "10", //字体大小
                            color: "#fff", //字体颜色
                            formatter: function (params) {
                                return params.name;
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            areaColor: "#ddd",
                            borderColor: "#fefefe",
                            borderWidth: 1 //静态时各省份区域颜色
                        },
                        emphasis: {
                            areaColor: "#3c92cf", //鼠标经过区域颜色
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            shadowBlur: 20,
                            borderWidth: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)"
                        }
                    }
                }
            };
            this.mapChart.setOption(option);
        },
        generateDistrictInfo(chosen) {
            this.chosen_card = chosen;
            this.districts_for_map = [];
            for (let i = 0; i < this.districts.length; ++i) {
                let districtItem = this.districts[i];
                this.maxValue = Math.max(this.maxValue, districtItem.level);
                let level = '未知'
                if (districtItem.level == 2) {
                    level = '低风险';
                } else if (districtItem.level == 3) {
                    level = '中风险';
                } else if (districtItem.level == 4) {
                    level = '高风险';
                }
                this.districts_for_map.push({
                    name: districtItem.name,
                    value: districtItem.level,
                    label: {
                        show: true,
                        formatter: function () {
                            return districtItem.name;
                        }
                    }
                });
            }
        },
        slider_change(date) {
            var city;
            //   var districts;
            for (let i = 0; i < this.history_data.length; i++) {
                if (
                    date.utc().format() ==
                    moment(this.history_data[i].date)
                        .utc()
                        .format()
                ) {
                    city = this.history_data[i].city;
                    break;
                }
            }
            this.change_card(city);
            //   this.change_map(cities);
        },
        change_card(city) {
            this.city_data = city;
        },
        change_map(cities) {
            this.cities = cities;
            this.generateDistrictInfo("confirmed");
        },
        async follow() {
            if (this.is_star == 2) {
                this.alert_msg.error('请先登录');
                return;
            }

            let mail = 0;
            if(localStorage.getItem('mail')){
                mail = localStorage.getItem('mail');
            }else{
                await this.alert_box.select('', '是否开启邮件提醒功能？', this, () => {
                    mail = 1;
                })
                localStorage.setItem('mail',mail);
            }

            let name = this.cur_province;
            let is_new = 1 - this.is_star;
            this.ajax.post('/follow/new', {
                level: 3,
                city: this.$route.params.name,
                province: this.$route.params.province_name,
                mail: mail,
                is_new: is_new,
            }, this, {
                success(res) {
                    if (res.status == 2) {
                        this.alert_msg.error('该地区已订阅');
                    } else if (res.status == 3) {
                        this.alert_msg.error('该地区未订阅');
                    } else if (res.status == 7) {
                        this.alert_msg.error('该地区不存在');
                    } else {
                        if (is_new == 1) {
                            this.alert_msg.success('订阅' + name + '成功');
                            this.is_star = 1;
                        } else {
                            this.alert_msg.success('成功取消订阅');
                            this.is_star = 0;
                        }
                    }
                },
                error() {
                    if (is_new == 1) {
                        this.alert_msg.error('订阅失败');
                    } else {
                        this.alert_msg.error('取消订阅失败');
                    }
                }
            })
        }
    }
};
</script>

<style scoped>
* {
    --right-width: 450px;
}

.city_map {
    height: calc(100% - var(--nav-height));
    position: relative;
    overflow: hidden;
}

.left_info {
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - var(--right-width));
    height: 100%;
    /* border: solid 1px #000; */
}

.left_info .top_bar {
    height: 115px;
    text-align: center;
}

.left_info .top_bar .top_card {
    margin: 10px;
    width: 23%;
    height: 95px;
    line-height: 95px;
    float: left;
    border-radius: 2px;
    font-size: 36px;
    font-weight: bold;
    /* letter-spacing: 0.5em; */
    text-indent: 0.5em;
    background-image: url("./../assets/city_bc.png");
    background-position: center;
    background-size: contain auto;
    background-repeat: no-repeat;
    color: #565656;
    /* background-color: azure; */
}

.left_info .top_bar .top_card .card_top {
    width: auto;
    margin-top: 7%;
    margin-bottom: 3%;
    text-align: center;
    font-family: Helvetica, "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
    font-size: 18px;
    display: -webkit-box;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
}

.left_info .top_bar .top_card .card_bot {
    width: 90%;
    margin: 0 2%;
    text-align: center;
    font-size: 14px;
}

.left_info .top_bar .slide_bar {
    width: 100%;
    height: 10%;
    background-color: black;
}

.left_info #map_chart {
    height: calc(100% - 115px - 60px);
    width: 100%;
    /* border: solid 1px #000; */
}

.left_info #map_chart2 {
    height: calc(100% - 115px - 60px);
    width: 100%;
    /* border: solid 1px #000; */
}

.right_info {
    position: absolute;
    top: 0;
    right: 0;
    width: var(--right-width);
    height: 100%;
    /* border: solid 1px #000; */
    background-color: #fafafa;
    background-image: url("./../assets/city_bc2.png");
    background-size: contain;
    background-position: bottom center;
    background-repeat: no-repeat;
}

.inner_right_info {
    padding: 30px;
    height: calc(100% - 85px - 60px);
    overflow: overlay;
}

.inner_right_info .travel_message_card {
    margin: 18px 0;
}

.right_info .top_info {
    background-color: hsl(0, 0%, 91%);
    margin: 25px 0 0;
    line-height: 60px;
    font-size: var(--font-size-big);
    font-weight: bold;
    text-align: center;
    color: #565656;
    letter-spacing: 3px;
    text-indent: 3px;
}

.el-divider {
    width: 70%;
    margin: 1% 15%;
    height: 3px;
    background-color: rgb(142, 208, 235);
}

#confirmed {
    color: blue;
    font-weight: bold;
    font-size: 15px;
}

#cured {
    color: green;
    font-weight: bold;
    font-size: 15px;
}

#died {
    color: red;
    font-weight: bold;
    font-size: 15px;
}

.outer_change_card {
    margin-left: 10px;
    width: 23%;
    float: left;
}

.slider {
    margin: 0 auto;
    padding: 10px 0;
    width: 90%;
    height: 40px;
    display: flex;
}
</style>



// WEBPACK FOOTER //
// src/pages/city_map.vue