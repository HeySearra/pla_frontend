<template>
    <div class="province_map">
        <div class="left_info">
            <div class="top_bar">
                <div class="top_card text_overflow_1">
                    {{ cur_province }}
                    <!-- <div class="card_bot">更新时间：2021/12/12 15:21</div> -->
                </div>
                <div class="outer_change_card">
                    <ChangeCard
                        card_type="confirmed"
                        :data="province_data.total.confirmed"
                        :new_data="province_data.new.confirmed"
                        :on_select="generateCityInfo"
                    >
                    </ChangeCard>
                </div>
                <div class="outer_change_card">
                    <ChangeCard
                        card_type="died"
                        :data="province_data.total.died"
                        :new_data="province_data.new.died"
                        :on_select="generateCityInfo"
                    >
                    </ChangeCard>
                </div>
                <div class="outer_change_card">
                    <ChangeCard
                        card_type="cured"
                        :data="province_data.total.cured"
                        :new_data="province_data.new.cured"
                        :on_select="generateCityInfo"
                    >
                    </ChangeCard>
                </div>
                <div class="clear_both"></div>
            </div>
            <div class="slider">
                <PointSlider style="flex:1;" ref="slider" @change="slider_change"/>
                <!-- <PointSlider @change="apply_for_info($event)"/> -->
                <el-button @click="follow">{{ follow_info }}</el-button>
            </div>

            <div style="border-bottom: solid 1px #eee"></div>
            <div class="map_chart" id="map_chart"></div>
        </div>
        <div class="right_info shadow">
            <div class="top_info">{{ cur_province }}地区动态</div>
            <div class="inner_right_info">
                    <TravelMessageCard
                        :content="vaccine_content"
                        title="疫苗接种情况"
                        :risk="-2"/>
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
import "echarts-countries-js/echarts-countries-js/china.js";
import ChangeCard from "@/components/change_card";
import TravelMessageCard from "@/components/travel_message_card";
import PointSlider from "@/components/point_slider";
import {provinces_cn, provinces_en} from "@/assets/provinces.js";
import {nameMap} from "@/assets/world_registry.js";
import moment from "moment";

export default {
    name: "ProvinceMap",
    components: {
        ChangeCard,
        TravelMessageCard,
        PointSlider
    },
    data() {
        return {
            mapChart: {},
            resize_func: "",
            maxValue: 0,
            registry: {},
            fileMap: {},
            cur_province: "",
            history_data: [],
            province_data: {
                new: {
                    died: 6,
                    cured: 9,
                    confirmed: 57
                },
                total: {
                    died: 0,
                    cured: 0,
                    confirmed: 0
                }
            },
            cities: [
                {
                    name: "烟台市",
                    new: {died: 6, cured: 900000, confirmed: 57},
                    total: {died: 66, cured: 99, confirmed: 5557}
                },
                {
                    name: "青岛市",
                    new: {died: 6, cured: 90000, confirmed: 57},
                    total: {died: 66, cured: 99, confirmed: 5557}
                },
                {
                    name: "东营市",
                    new: {died: 6, cured: 9, confirmed: 57},
                    total: {died: 66, cured: 99, confirmed: 5557}
                }
            ],
            cities_for_map: [],
            chosen_card: "confirmed",
            max_confirmed: 100,
            info: [],
            provinces: [],
            provincesText: [],
            level: [0, 1, 2, 3, 4, 5],
            vaccine: {
                '海南': {
                    data: '730.90万',
                    time: '2021年7月8日'
                },
                '宁夏': {
                    data: '626.00万',
                    time: '2021年7月5日'
                },
                '青海': {
                    data: '336.00万',
                    time: '2021年6月11日'
                },
                '上海': {
                    data: '3527.71万',
                    time: '2021年6月29日'
                },
                '山东': {
                    data: '8765.87万',
                    time: '2021年7月1日'
                },
                '江苏': {
                    data: '8474.80万',
                    time: '?'
                },
                '安徽': {
                    data: '2145.00万',
                    time: '2021年6月3日'
                },
                '内蒙古': {
                    data: '184.00万',
                    time: '2021年4月14日'
                },
                '吉林': {
                    data: '387.02万',
                    time: '2021年5月17日'
                },
                '湖北': {
                    data: '2746.00万',
                    time: '2021年6月24日'
                },
                '福建': {
                    data: '952.43万',
                    time: '2021年5月24日'
                },
                '贵州': {
                    data: '150.00万',
                    time: '2021年5月20日'
                },
                '河北': {
                    data: '未知',
                    time: '?'
                },
                '江西': {
                    data: '1629.80万',
                    time: '2021年6月26日'
                },
                '澳门': {
                    data: '17.70万',
                    time: '2021年6月14日'
                },
                '黑龙江': {
                    data: '1666.00万',
                    time: '2021年6月28日'
                },
                '甘肃': {
                    data: '1059.00万',
                    time: '2021年6月8日'
                },
                '天津': {
                    data: '1800.00万',
                    time: '2021年6月29日'
                },
                '湖南': {
                    data: '4697.00万',
                    time: '2021年7月5日'
                },
                '陕西': {
                    data: '3070万',
                    time: '2021年6月28日'
                },
                '广西': {
                    data: '3303.28万',
                    time: '2021年6月27日'
                },
                '河南': {
                    data: '8234.81万',
                    time: '2021年7月1日'
                },
                '香港': {
                    data: '345.25万',
                    time: '2021年6月25日'
                },
                '重庆': {
                    data: '2553.40万',
                    time: '2021年6月30日'
                },
                '西藏': {
                    data: '216.00万',
                    time: '2021年6月26日'
                },
                '台湾': {
                    data: '336.00万',
                    time: '2021年7月12日'
                },
                '辽宁': {
                    data: '1556.50万',
                    time: '2021年6月28日'
                },
                '山西': {
                    data: '2663.80万',
                    time: '2021年6月29日'
                },
                '广东': {
                    data: '1.3亿',
                    time: '2021年6月30日'
                },
                '四川': {
                    data: '2979.00万',
                    time: '2021年6月22日'
                },
                '北京': {
                    data: '1840.52万',
                    time: '2021年7月8日'
                },
                '云南': {
                    data: '3019.80万',
                    time: '2021年6月14日'
                },
                '浙江': {
                    data: '3315.20万',
                    time: '2021年6月3日'
                },
                '新疆': {
                    data: '149.00万',
                    time: '2021年6月23日'
                }
            },
            vaccine_content: '',
            in_policy: '',
            out_policy: '',
            risk: 0,
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
        this.provinces = provinces_en;
        this.provincesText = provinces_cn;
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
        cities_for_map(newValue) {
            this.make_map(this.$route.params.name, "map_chart");
        }
    },
    methods: {
        init() {
            // 请求数据
            this.fileMap = require("@/assets/registry.json");
            this.apply_for_info();
            this.cur_province = this.$route.params.name;
            this.mapChart = this.$echarts.init(document.getElementById("map_chart"));
            this.vaccine_content = this.vaccine_message();
            if (nameMap[this.cur_province]) {
                this.cur_province = nameMap[this.cur_province];
            }
            var that = this;
            this.mapChart.on("click", function (params) {
                if (params.componentType === "title") {
                    that.$router.go(-1);
                    return;
                }
                if (
                    that.isProvince(that.cur_province) &&
                    that.cur_province !== "北京" &&
                    that.cur_province !== "天津" &&
                    that.cur_province !== "上海" &&
                    that.cur_province !== "重庆" &&
                    that.cur_province !== "香港"
                )
                    that.$router.push({
                        name: "city_map",
                        params: {province_name: that.cur_province, name: params.name}
                    });
            });
        },
        vaccine_message() {
            if (this.vaccine[this.cur_province] == '未知')  {
                return '该地区疫苗接种情况未知。';
            }
            return "截至" + this.vaccine[this.cur_province]['time'] + "，" + this.cur_province + "已接种疫苗" + this.vaccine[this.cur_province]['data'] + "剂次。";
        },
        apply_for_info() {
            var that = this;
            this.ajax.get(
                "/map/today/province",
                {
                    name: this.$route.params.name
                },
                this,
                {
                    success(res) {
                        if (res.status === 0) {
                            this.province_data = res.province;
                            this.cities = res.cities;
                            this.generateCityInfo("confirmed");
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
                "/map/province",
                {
                    name: this.$route.params.name
                },
                this,
                {
                    success(res) {
                        if (res.status === 0) {
                            this.history_data = res.data;
                            this.$refs.slider.init(this.history_data[0].date, this.history_data[this.history_data.length - 1].date);
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
        generateCityInfo(chosen) {
            this.chosen_card = chosen;
            this.cities_for_map = [];
            for (let i = 0; i < this.cities.length; ++i) {
                let cityItem = this.cities[i];
                let chartValue = 0;
                if (chosen === "confirmed") {
                    chartValue = cityItem.total.confirmed;
                } else if (chosen === "cured") {
                    chartValue = cityItem.total.cured;
                } else {
                    chartValue = cityItem.total.died;
                }
                this.maxValue = Math.max(this.maxValue, chartValue);
                this.cities_for_map.push({
                    name: cityItem.name,
                    value: chartValue,
                    label: {
                        show: true,
                        formatter: function () {
                            return cityItem.name;
                        }
                    }
                });
            }
        },
        isProvince(name) {
            return this.provincesText.some(province => {
                return province === name;
            });
        },
        getCityItem(para) {
            let i = 0;
            for (; i < this.cities.length; ++i) {
                let item = this.cities[i];
                if (item.name === para) {
                    return item;
                }
            }
            return undefined;
        },
        getChineseName(englishName) {
            return this.$nameMap[englishName];
        },
        getFileName(chineseName) {
            // console.log(this.fileMap);
            return this.fileMap.PINYIN_MAP[chineseName];
        },
        make_map(englishName, dom_id) {
            let chineseName = this.getChineseName(englishName);
            let fileName = this.getFileName(chineseName);
            if (chineseName === "中国") {
                chineseName = "china";
            }
            if (englishName === "world") {
                fileName = "world";
                chineseName = "world";
            }
            if (this.isProvince(englishName)) {
                let pinyinName = this.provinces[
                    this.provincesText.indexOf(englishName)
                    ];
                chineseName = englishName;
                require(`echarts-countries-js/echarts-china-provinces-js/${pinyinName}`);
            } else {
                require(`echarts-countries-js/echarts-countries-js/${fileName}`);
            }
            let _that = this;
            var title_text = "返回中国地图";
            if (!this.isProvince(this.cur_province)) title_text = "返回世界地图";
            var option = {
                title: {
                    show: true,
                    // link: `${preLink}`,
                    // target: "self",
                    text: title_text,
                    triggerEvent: true,
                    padding: [20, 50],
                    textStyle: {
                        fontFamily: "Arial",
                        rich: {
                            a: {
                                color: "red",
                                lineHeight: 10
                            },
                            b: {
                                height: 40
                            },
                            x: {
                                fontSize: 18,
                                fontFamily: "Microsoft YaHei",
                                borderColor: "#449933",
                                borderRadius: 4
                            }
                        }
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
                        let ret = "";
                        let cityItem = _that.getCityItem(param.name);
                        if (cityItem != undefined) {
                            ret +=
                                "<p style='text-align: center;font-size: 16px'>" +
                                cityItem.name +
                                "</p>";
                            ret +=
                                "<p style='margin: 0;text-align: center'>" +
                                "确诊：" +
                                cityItem.total.confirmed +
                                "(+" +
                                cityItem.new.confirmed +
                                ")" +
                                "</p>";
                            ret +=
                                "<p style='margin: 0;text-align: center'>" +
                                "死亡：" +
                                cityItem.total.died +
                                "(+" +
                                cityItem.new.died +
                                ")" +
                                "</p>";
                            ret +=
                                "<p style='margin: 0;text-align: center'>" +
                                "治愈：" +
                                cityItem.total.cured +
                                "(+" +
                                cityItem.new.cured +
                                ")" +
                                "</p>";
                            return ret;
                        } else return "";
                    },
                    extraCssText:
                        "background: #182235; border-radius: 5;color: #fff;width:150px;text-align:center"
                },
                visualMap: {
                    left: "right",
                    min: 0,
                    max: this.maxValue,
                    inRange: {
                        color: [
                            "#313695",
                            "#4575b4",
                            "#74add1",
                            "#abd9e9",
                            "#e0f3f8",
                            "#ffffbf",
                            "#fee090",
                            "#fdae61",
                            "#f46d43",
                            "#d73027",
                            "#a50026"
                        ]
                    },
                    text: ["累计确诊"], // 文本，默认为数值文本
                    calculable: true
                },
                backgroundColor: "#fff",
                series: {
                    map: chineseName,
                    zoom: 1.2,
                    roam: true,
                    type: "map",
                    scaleLimit: {
                        min: 1.0,
                        max: 5.0
                    },
                    label: {
                        normal: {
                            show: true, //是否显示省份名称
                            fontSize: "10", //字体大小
                            color: "#000" //字体颜色
                        },
                        emphasis: {
                            //动态展示的样式
                            fontSize: "10", //字体大小
                            color: "#fff" //字体颜色
                        }
                    },
                    itemStyle: {
                        normal: {
                            areaColor: "#ddd",
                            borderColor: "#fefefe",
                            borderWidth: 1 //静态时各省份区域颜色
                        },
                        emphasis: {
                            areaColor: "#3c92cf", //鼠标选择区域颜色
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            shadowBlur: 20,
                            borderWidth: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)"
                        }
                    },
                    data: this.cities_for_map
                }
            };
            this.mapChart.setOption(option);
        },
        slider_change(date) {
            var cities;
            var province;
            for (let i = 0; i < this.history_data.length; i++) {
                if (
                    date.utc().format() ==
                    moment(this.history_data[i].date)
                        .utc()
                        .format()
                ) {
                    cities = this.history_data[i].cities;
                    province = this.history_data[i].province;
                    break;
                }
            }
            this.change_card(province);
            this.change_map(cities);
        },
        change_card(province) {
            this.province_data = province;
        },
        change_map(cities) {
            this.cities = cities;
            this.generateCityInfo("confirmed");
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
                level: 2,
                province: this.cur_province,
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
            });
        }
    }
};
</script>

<style scoped>
* {
    --right-width: 450px;
}

.province_map {
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
    position: relative;
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
// src/pages/province_map.vue