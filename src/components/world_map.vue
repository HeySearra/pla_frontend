<template>
    <div class="world_map" id="world_map" v-loading="loading">

    </div>
</template>

<script>
import 'echarts-countries-js/echarts-countries-js/world'
import 'echarts-countries-js/echarts-countries-js/china'
import {nameMap} from '@/assets/world_registry'

var color = {
    'confirmed': ['#1882c3', '#cb3434'],
    'cured': ['#ccc', '#1882c3'],
    'died': ['#ccc', '#cb3434'],
};

export default {
    name: 'WorldMap',

    mounted() {
        //用于绑定订阅事件
        window.tip_click = this.follow;
        this.init_chart();

        //TODO:暂定在这里获取订阅的省
        this.ajax.post('/follow/country', {}, this, {
            success(res) {
                this.is_star_list = res.data;
            }
        })
    },

    destroyed() {
        window.removeEventListener('resize', this.resize_func);
        this.chart.dispose();
    },
    computed: {},
    props: {
        rank_key: {
            type: String,
            default: 'confirmed',
        },
    },
    data() {
        return {
            //各国疫情数据
            country_data: [],
            registry: {},
            chart: '',
            resize_func: '',
            loading: true,
            is_star_list: {}
        }
    },
    watch: {
        rank_key(new_value) {
            this.rank_key = new_value;
            this.repaint_map(new_value);
        }
    },

    methods: {
        init(countries) {
            this.loading = true;
            this.country_data = countries;
            this.repaint_map(this.rank_key);
            this.loading = false;
        },
        init_chart() {
            //国家名称对照表
            this.registry = require('@/assets/registry.json');
            let _that = this;
            //初始地图
            this.chart = this.make_map('world', 'world_map');
            //点击切换地图
            // this.chart.on('click', function (params) {
            //   if (params.name == 'China') {
            //     _that.$router.push({name: 'index'});
            //   }
            //   // let chinese_name = _that.get_chinese_name(params.name);
            //   else {
            //     _that.$router.push({
            //       name: 'province_map',
            //       params: {
            //         name: params.name,
            //       }
            //     });
            //   }
            // })

            this.resize_func = function () {
                _that.chart.resize();
            };
            window.addEventListener('resize', this.resize_func);
        },
        make_map(cityname, dom_id) {
            let _that = this;
            let achart = this.$echarts.init(document.getElementById(dom_id));
            var option = {
                "title": [
                    {
                        "textStyle": {
                            "color": "#000",
                            "fontSize": 18
                        },
                        "subtext": "",
                        "top": "auto",
                        "subtextStyle": {
                            "color": "#aaa",
                            "fontSize": 12
                        },
                        "left": "auto"
                    }
                ],
                "visualMap": {
                    left: 'right',
                    min: 0,
                    max: 30000,
                    inRange: {
                        color: color[this.rank_key]
                    },
                    outOfRange: {
                        color: ['#ccc']
                    },
                    text: ['高', '低'],            // 文本，默认为数值文本
                    calculable: true
                },
                "legend": [
                    {
                        "selectedMode": "multiple",
                        "top": "top",
                        "orient": "horizontal",
                        "data": [
                            ""
                        ],
                        "left": "center",
                        "show": true
                    }
                ],
                "backgroundColor": "#fefefe",
                series: [
                    {
                        name: cityname,
                        map: cityname,
                        type: 'map',
                        label: {
                            formatter: function (params) {
                                let ch_name = _that.get_chinese_name(params.name);
                                return ch_name;
                            },
                            color: "#fff"
                        },
                        // 把地图放大了1.2倍
                        zoom: 1.2,
                        roam: true,
                        scaleLimit: {
                            min: 1.2,
                            max: 3
                        },
                        showLegendSymbol: false,
                        itemStyle: {
                            normal: {
                                // 地图省份的背景颜色
                                areaColor: "#ccc",
                                borderColor: "#fefefe",
                                borderWidth: 1
                            },
                            emphasis: {
                                areaColor: "hsl(47, 78%, 51%)",
                            }
                        },
                        data: [],
                    },
                ]
            };
            option['tooltip'] = {
                trigger: "item",
                show: true,
                formatter: function (params) {
                    let ch_name = _that.get_chinese_name(params.name);
                    let res = '';
                    let file_name = ''
                    //使用中文名搜索国旗文件名，没有就不显示国旗
                    try {
                        file_name = _that.registry.PINYIN_MAP[ch_name].toLowerCase() + '.png';
                        res += " <img style=\"width: 100px;height: 60px;\" src='" + require('@/assets/global-national-flag/' + file_name) + "'/>"
                    } catch (e) {
                    }
                    res += "<p style='text-align: center;font-size: 18px;margin: 5px 0'>" + ch_name + "</p>";
                    res += "<p style='margin: 0;text-align: center'>" + '确诊人数：未知</p>';
                    res += "<p style='margin: 0;text-align: center'>" + '死亡人数：未知</p>';
                    res += "<p style='margin: 0;text-align: center'>" + '治愈人数：未知</p>';
                    res += "<p style='margin: 0;text-align: center'>" + '疫苗接种剂次：未知</p>';
                    return res;
                },
                extraCssText: 'background: #182235; border-radius: 5;color: #fff;min-weight:120px;text-align:center',
            };

            achart.setOption(option);
            return achart;
        },
        //获取国家中文名
        get_chinese_name(en_name) {
            if (en_name.toLowerCase()) {
                return nameMap[en_name];
            }
            return en_name;
        },
        repaint_map(rank_key) {
            let max = 0;
            this.rank_key = rank_key;
            for (let i = 0; i < this.country_data.length; i++) {
                max = Math.max(max, this.country_data[i].total[this.rank_key]);
            }
            let _that = this;
            //用于展示的热力图数据，name用于映射，value用于展示
            let res = [];
            this.country_data.forEach(item => {
                for (let key in this.$nameMap) {
                    if (this.$nameMap[key] == item.name) {
                        res.push({
                            name: key, value: item.total[rank_key],
                            is_star: this.is_star_list[key]
                        });
                    }
                }
            })
            let option = this.chart.getOption();
            option.series[0].data = res;
            option['tooltip'] = {
                trigger: "item",
                show: true,
                enterable: true,
                position: function (point, params, dom, rect, size) {
                    // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
                    // 提示框位置
                    var x = 0; // x坐标位置
                    var y = 0; // y坐标位置

                    // 当前鼠标位置
                    var pointX = point[0];
                    var pointY = point[1];

                    // 外层div大小
                    // var viewWidth = size.viewSize[0];
                    // var viewHeight = size.viewSize[1];

                    // 提示框大小
                    var boxWidth = size.contentSize[0];
                    var boxHeight = size.contentSize[1];

                    // boxWidth > pointX 说明鼠标左边放不下提示框
                    if (boxWidth > pointX) {
                        x = 5;
                    } else { // 左边放的下
                        x = pointX - boxWidth;
                    }

                    // boxHeight > pointY 说明鼠标上边放不下提示框
                    if (boxHeight > pointY) {
                        y = 5;
                    } else { // 上边放得下
                        y = pointY - boxHeight;
                    }

                    return [x - 5, y - 5];
                },
                formatter: function (params) {
                    let ch_name = _that.get_chinese_name(params.name);
                    let res = '';
                    let file_name = ''
                    //使用中文名搜索国旗文件名，没有就不显示国旗
                    try {
                        file_name = _that.registry.PINYIN_MAP[ch_name].toLowerCase() + '.png';
                        res += " <img style=\"width: 100px;height: 60px;\" src='" + require('@/assets/global-national-flag/' + file_name) + "'/>"
                    } catch (e) {
                    }
                    //从数据中找出对应的name
                    let cur = '';
                    _that.country_data.forEach(item => {
                        if (item.name == ch_name) {
                            cur = item.total;
                        }
                    })
                    if (!cur) {
                        cur = {
                            confirmed: 0, died: 0, cured: 0, vaccinated: 0
                        }
                    }

                    res += "<p style='text-align: center;font-size: 18px;margin: 5px 0'>" + ch_name + "</p>";
                    res += "<p style='margin: 0;text-align: center'>" + '确诊人数：' + cur['confirmed'] + '</p>';
                    res += "<p style='margin: 0;text-align: center'>" + '死亡人数：' + cur['died'] + '</p>';
                    res += "<p style='margin: 0;text-align: center'>" + '治愈人数：' + cur['cured'] + '</p>';
                    res += "<p style='margin: 0;text-align: center'>" + '疫苗接种剂次：' + cur['vaccinated'] + '</p>';

                    if (params.is_star == 1) {
                        res += `<i class="iconfont icon-xingzhuang60kaobei2" style="float: right;color: yellow" onclick="tip_click('${params.name}',this)"></i>`
                    } else {
                        res += `<i class="iconfont icon--star-o" style="float: right;" onclick="tip_click('${ch_name}',this)"></i>`
                    }
                    return res;
                },
                extraCssText: 'background: #182235; border-radius: 5;color: #fff;min-weight:120px;text-align:center',
            };
            // console.log(option)
            this.chart.setOption(option, true);
            this.chart.setOption({
                visualMap: {
                    min: 0,
                    max: max,
                    range: [0, max],
                    inRange: {color: color[this.rank_key]}
                }
            });
        },
        set(data) {
            this.country_data = data;
            this.repaint_map(this.rank_key);
        },
        async follow(name, obj) {

            let mail = 0;
            if (localStorage.getItem('mail')) {
                mail = localStorage.getItem('mail');
            } else {
                await this.alert_box.select('', '是否开启邮件提醒功能？', this, () => {
                    mail = 1;
                })
                localStorage.setItem('mail', mail);
            }

            //icon--star-o 未订阅
            //icon-xingzhuang60kaobei2  已经订阅
            let follow_class = ['icon--star-o', 'icon-xingzhuang60kaobei2']
            let is_new = 0;
            if (obj.classList.contains(follow_class[0])) {//未订阅
                obj.classList.remove(follow_class[0])
                obj.classList.add(follow_class[1])
                obj.style.color = 'yellow'
                is_new = 1;
            } else {
                obj.classList.remove(follow_class[1])
                obj.classList.add(follow_class[0])
                obj.style.color = ''
            }
            console.log(obj);
            this.ajax.post('/follow/new', {
                level: 2,
                country: '',
                province: name,
                mail: mail,
                city: '',
                is_new: is_new,
            }, this, {
                success(res) {
                    if (res.status == 8) {
                        this.alert_msg.error('请先登录');
                    } else if (res.status == 2) {
                        this.alert_msg.error('该地区已订阅');
                    } else if (res.status == 3) {
                        this.alert_msg.error('该地区未订阅');
                    } else if (res.status == 7) {
                        this.alert_msg.error('该地区不存在');
                    } else {
                        if (is_new == 1) {
                            this.alert_msg.success('订阅' + name + '成功');
                            this.is_star_list[name] = 1;
                        } else {
                            this.alert_msg.success('成功取消订阅');
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
}
</script>

<style scoped>
.world_map {
    /* border: 1px solid #000; */
}
</style>



// WEBPACK FOOTER //
// src/components/world_map.vue