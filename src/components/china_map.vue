<template>
    <div class="china_map" id="china_map" v-loading="loading"></div>
</template>

<script>
import 'echarts-countries-js/echarts-countries-js/world'
import 'echarts-countries-js/echarts-countries-js/china'

var color = {
    'confirmed': ['#1882c3', '#cb3434'],
    'cured': ['#ccc', '#1882c3'],
    'died': ['#ccc', '#cb3434'],
};

export default {
    name: 'ChinaMap',

    mounted() {
        //用于绑定订阅事件
        window.tip_click = this.follow;
        this.init_chart();

        //TODO:暂定在这里获取订阅的省
        this.ajax.post('/follow/province', {}, this, {
            success(res) {
                this.is_star_list = res.data;
            }
        })
    },

    destroyed() {
        window.removeEventListener('resize', this.resize_func);
        this.chart.dispose();
    },

    props: {
        rank_key: {
            type: String,
            default: 'confirmed'
        },
        follow_list_add: {
            type: Function,
            default: () => {

            }
        }
    }
    ,

    data() {
        return {
            chart: '',
            resize_func: '',
            //中国各省疫情数据
            china_data: [],
            loading: true,
            vaccine: {
                '海南': '730.90万',
                '宁夏': '626.00万',
                '青海': '336.00万',
                '上海': '3527.71万',
                '山东': '8765.87万',
                '江苏': '8474.80万',
                '安徽': '2145.00万',
                '内蒙古': '184.00万',
                '吉林': '387.02万',
                '湖北': '2746.00万',
                '福建': '952.43万',
                '贵州': '150.00万',
                '河北': '未知',
                '江西': '1629.80万',
                '澳门': '17.70万',
                '黑龙江': '1666.00万',
                '甘肃': '1059.00万',
                '天津': '1800.00万',
                '湖南': '4697.00万',
                '陕西': '3070万',
                '广西': '3303.28万',
                '河南': '8234.81万',
                '香港': '345.25万',
                '重庆': '2553.40万',
                '西藏': '216.00万',
                '台湾': '336.00万',
                '辽宁': '1556.50万',
                '山西': '2663.80万',
                '广东': '1.3亿',
                '四川': '2979.00万',
                '北京': '1840。52万',
                '云南': '3019.80万',
                '浙江': '3315.20万',
                '新疆': '149.00万',
            },
            is_star_list: []
        }
    }
    ,

    watch: {
        rank_key(newValue) {
            this.rank_key = newValue;
            this.repaint_map(newValue);
        }
    },

    methods: {
        init(china_data) {
            this.loading = true;
            this.china_data = china_data;
            this.repaint_map(this.rank_key);
            this.loading = false;
        },
        init_chart() {
            let _that = this;
            //初始地图
            this.chart = this.make_map('china', 'china_map');

            //点击切换地图
            this.chart.on('click', function (params) {
                if (params.componentSubType == 'map') {
                    _that.$router.push({
                        name: 'province_map',
                        params: {
                            name: params.name,
                        }
                    })
                }
            })

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
                tooltip: {
                    trigger: 'item',
                    enterable: true,
                },
                "visualMap": {
                    left: 'right',
                    min: 0,
                    // max: max,
                    inRange: {
                        color: ['#6683b7', '#cb3434']
                    },
                    outOfRange: {
                        color: ['#ccc']
                    },
                    text: ['高', '低'],           // 文本，默认为数值文本
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
                "backgroundColor": "rgba(0, 0, 0, 0%)",
                "series": {
                    name: cityname,
                    map: cityname,
                    type: 'map',
                    label: {
                        color: "#fff"
                    },
                    // 把地图放大了1.2倍
                    zoom: 1.2,
                    // roam: true,
                    scaleLimit: {
                        min: 1.2,
                        max: 1.2
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
                    data: this.map_data,
                },
            };

            option['tooltip'] = {
                trigger: "item",
                show: true,
                formatter: function (params) {
                    let ch_name = params.name;
                    let res = '';

                    res += "<p style='text-align: center;font-size: 18px;margin: 5px 0'>" + ch_name + "</p>";
                    res += "<p style='margin: 0;text-align: center'>" + '确诊人数：未知</p>';
                    res += "<p style='margin: 0;text-align: center'>" + '死亡人数：未知</p>';
                    res += "<p style='margin: 0;text-align: center'>" + '治愈人数：未知</p>';
                    //todo
                    return res;
                },
                extraCssText: 'background: #182235; border-radius: 5;color: #fff;text-align:center',
            };

            achart.setOption(option);
            return achart;
        },
        repaint_map(rank_key) {
            let max = 0;
            this.rank_key = rank_key;
            for (let i = 0; i < this.china_data.length; i++) {
                max = Math.max(max, this.china_data[i].total[this.rank_key]);
            }
            let _that = this;
            //用于展示的热力图数据，name用于映射，value用于展示
            let res = [];
            this.china_data.forEach(item => {
                res.push({name: item.name, value: item.total[rank_key], is_star: this.is_star_list[item.name]});
            });
            let option = this.chart.getOption();
            var that = this;
            option.series[0].data = res;
            option.tooltip = {
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
                    let ch_name = params.name;
                    let res = '';

                    let cur = '';
                    _that.china_data.forEach(item => {
                        if (item.name == ch_name) {
                            cur = item.total;
                        }
                    })
                    if (!cur) {
                        cur = {
                            confirmed: '未知', died: '未知', cured: '未知',
                        }
                    }
                    res += "<p style='text-align: center;font-size: 18px;margin: 5px 0'>" + ch_name + "</p>";
                    res += "<p style='margin: 0;text-align: center'>" + '确诊人数：' + cur['confirmed'] + '</p>';
                    res += "<p style='margin: 0;text-align: center'>" + '死亡人数：' + cur['died'] + '</p>';
                    res += "<p style='margin: 0;text-align: center'>" + '治愈人数：' + cur['cured'] + '</p>';
                    res += "<p style='margin: 0;text-align: center'>" + '疫苗接种剂次：' + that.vaccine[ch_name] + '</p>';
                    //todo

                    if (params.is_star == 1) {
                        res += `<i class="iconfont icon-xingzhuang60kaobei2" style="float: right;color: yellow" onclick="tip_click('${params.name}',this)"></i>`
                    } else {
                        res += `<i class="iconfont icon--star-o" style="float: right;" onclick="tip_click('${params.name}',this)"></i>`
                    }
                    return res;
                },
                extraCssText: 'background: #182235; border-radius: 5;color: #fff;text-align:center',
            };
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
            this.china_data = data;
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
                            this.follow_list_add({
                                'province': name
                            })
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
.china_map {
    /* border: 1px solid #000; */
}

.icon-xingzhuang60kaobei2 {
    background-color: yellow;
}
</style>



// WEBPACK FOOTER //
// src/components/china_map.vue