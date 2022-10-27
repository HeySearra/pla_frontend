<template>
    <div class="cas">
        <div style="height: 20px;"></div>
        <div class="graphs-and-table" v-loading="loading">
            <div class="graphs">
                <div class="change_pic">
                    <el-radio-group v-model="type" size="small">
                        <el-radio-button label="统计图"></el-radio-button>
                        <el-radio-button label="数据表"></el-radio-button>
                    </el-radio-group>
                </div>
                <div class="graph" id="chart"></div>
            </div>
            <div class="table shadow">
                <el-table
                    class="all-data"
                    :style="type == '统计图'?'filter: blur(3px)':''"
                    :data="tableData"
                    :default-sort="{prop: 'date', order: 'descending'}"
                    height="100%"
                    stripe>
                    <el-table-column
                        prop="date"
                        label="日期"
                        sortable
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="confirmed"
                        label="确诊人数"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="cured"
                        label="治愈人数"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="died"
                        label="死亡人数"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="vaccinated"
                        label="疫苗接种剂次"
                        align="center">
                    </el-table-column>
                </el-table>
                <transition name="el-zoom-in-top">
                    <div v-show="type == '统计图'" class="other_statistic">
                        <el-row v-show="tableData.length" :gutter="0">
                            <el-col :span="8">
                                <div class="rate_card">
                                    <div class="title">治愈率</div>
                                    <div class="content" style="color: var(--color-safe);">{{ rate.cured }}%</div>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div class="rate_card">
                                    <div class="title">死亡率</div>
                                    <div class="content" style="color: var(--color-died);">{{ rate.died }}%</div>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div class="rate_card">
                                    <div class="title">未治愈</div>
                                    <div class="content" style="color: var(--color-high-risk);">{{ rate.rest }}%</div>
                                </div>
                            </el-col>
                        </el-row>
                        <div id="pie" v-show="tableData.length"></div>
                        <el-divider v-show="tableData.length"></el-divider>
                        <div v-show="tableData.length" id="other_line"></div>
                        <el-empty v-show="tableData.length == 0" style="margin: 12vh auto 0; width: 230px;" description=" "></el-empty>
                        <div v-show="tableData.length == 0" class="not_found">暂无数据</div>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import {provinces_cn, provinces_en} from '@/assets/provinces.js';
import {nameMap} from '@/assets/world_registry.js';

export default {
    name: "cross-analysis-simple",

    mounted() {
        this.init();
        var that = this;
        window.onresize = function () {
            that.resize_charts();
        };
    },

    destroyed() {
        window.onresize = function () {
        }
    },

    data() {
        return {
            nowTime: '2021-7-5',
            tableHeight: '100%',
            tableData: [],
            charts: [],
            area_name_cn: '',
            area_name_en: '',
            range_start: '',
            range_end: '',
            loading: false,
            predict_confirmed: [],
            predict_cured: [],
            predict_died: [],
            type: '统计图',
            rate: {
                cured: '0',
                died: '0',
                rest: '0'
            }
        }
    },

    watch: {
        '$route': {
            handler(route) {
                if (route.query.area != this.area_name_en) {
                    this.init();
                }
            },
            deep: true
        }
    },

    methods: {
        init() {
            this.area_name_en = this.$route.query.area;
            this.area_name_cn = nameMap[this.$route.query.area];
            if (!this.area_name_cn) {
                let i = 0;
                for (; i < provinces_en.length; i++) {
                    if (provinces_en[i] == this.area_name_en) {
                        break;
                    }
                }
                this.area_name_cn = provinces_cn[i];
            }
            this.apply_for_info();
            this.init_pie();
        },

        apply_for_info() {
            this.loading = true;
            this.ajax.post('/data/country_analyze', {
                name: this.area_name_cn
            }, this, {
                success(res) {
                    this.tableData = [];
                    for (let i = 0; i < res.data.length; i++) {
                        this.tableData.push({
                            date: res.data[i].date,
                            confirmed: res.data[i].total.confirmed,
                            cured: res.data[i].total.cured,
                            died: res.data[i].total.died,
                            vaccinated: res.data[i].total.vaccinated
                        });
                    }
                    if (res.data.length) {
                        this.rate.cured = (res.data[res.data.length - 1].total.cured / res.data[res.data.length - 1].total.confirmed * 100).toFixed(2);
                        this.rate.died = (res.data[res.data.length - 1].total.died / res.data[res.data.length - 1].total.confirmed * 100).toFixed(2);
                        this.rate.rest = (100 - parseFloat(this.rate.cured) - parseFloat(this.rate.died)).toFixed(2);
                    } else {
                        this.rate.cured = '-';
                        this.rate.died = '-';
                        this.rate.rest = '-';
                    }
                    var that = this;
                    this.show_graphs();
                    this.init_pie();
                    this.init_other_line();
                    setTimeout(function() {
                        that.resize_charts();
                    }, 0);
                    this.$emit('change_head', res.data.length ? res.data[res.data.length - 1] : undefined);
                    this.loading = false;
                },
                error() {
                    this.loading = false;
                }
            });
        },

        get_option() {
            var confirmed = [];
            var cured = [];
            var died = [];
            for (let i = 0; i < this.tableData.length; i++) {
                confirmed.push([moment(this.tableData[i].date).valueOf(), this.tableData[i].confirmed]);
                cured.push([moment(this.tableData[i].date).valueOf(), this.tableData[i].cured]);
                died.push([moment(this.tableData[i].date).valueOf(), this.tableData[i].died]);
            }

            var option = {
                tooltip: {
                    trigger: 'axis',
                },
                title: {
                    // left: 'center',
                    // text: '人数变化趋势',
                },
                grid: {
                    top: 78
                },
                legend: {
                    data: ['确诊人数', '治愈人数', '死亡人数', '确诊人数 - 预测', '治愈人数 - 预测', '死亡人数 - 预测'],
                    textStyle: {
                        fontSize: 16,
                        // color: '#000'
                    },
                    padding: [5, 230, 0, 0]
                },
                xAxis: {
                    type: 'time',
                    boundaryGap: false,
                },
                yAxis: {
                    type: 'value',
                },
                dataZoom: [{
                    type: 'inside',
                    start: 69,
                    end: 100,
                    zoomOnMouseWheel: true,
                }, {
                    start: 0,
                    end: 100
                }],
                series: [
                    {
                        name: '确诊人数',
                        type: 'line',
                        data: confirmed,
                        showSymbol: false,
                        smooth: true,
                        itemStyle: {
                            normal: {
                                color: 'hsl(0, 59%, 50%)',
                                lineStyle: {
                                    color: 'hsl(0, 59%, 50%)'
                                }
                            }
                        }
                    },
                    {
                        name: '治愈人数',
                        type: 'line',
                        data: cured,
                        showSymbol: false,
                        smooth: true,
                        itemStyle: {
                            normal: {
                                color: 'hsl(203, 78%, 43%)',
                                lineStyle: {
                                    color: 'hsl(203, 78%, 43%)'
                                },
                            }
                        },
                    },
                    {
                        name: '死亡人数',
                        type: 'line',
                        data: died,
                        showSymbol: false,
                        smooth: true,
                        itemStyle: {
                            normal: {
                                color: 'hsl(0, 0%, 69%)',
                                lineStyle: {
                                    color: 'hsl(0, 0%, 69%)'
                                }
                            }
                        },
                        emphasis: {
                            focus: 'series'
                        },
                    }
                ]
            };

            return option;
        },

        set_predict(op) {
            var series = [{
                name: '确诊人数 - 预测',
                type: 'line',
                data: [],
                showSymbol: false,
                smooth: true,
                itemStyle: {
                    normal: {
                        color: 'hsl(0, 59%, 50%)',
                        lineStyle: {
                            color: 'hsl(0, 59%, 50%)',
                            type: [5, 7],
                            dashOffset: 5
                        }
                    }
                },
                emphasis: {
                    focus: 'series'
                },
            },
                {
                    name: '治愈人数 - 预测',
                    type: 'line',
                    data: [],
                    showSymbol: false,
                    smooth: true,
                    lineStyle: {
                        type: 'dashed'
                    },
                    itemStyle: {
                        normal: {
                            color: 'hsl(203, 78%, 43%)',
                            lineStyle: {
                                color: 'hsl(203, 78%, 43%)',
                                type: [5, 7],
                                dashOffset: 5
                            },
                        }
                    },
                    emphasis: {
                        focus: 'series'
                    },
                },
                {
                    name: '死亡人数 - 预测',
                    type: 'line',
                    data: [],
                    showSymbol: false,
                    smooth: true,
                    lineStyle: {
                        type: 'dashed'
                    },
                    itemStyle: {
                        normal: {
                            color: 'hsl(0, 0%, 69%)',
                            lineStyle: {
                                color: 'hsl(0, 0%, 69%)',
                                type: [5, 7],
                                dashOffset: 5
                            },
                        }
                    },
                    emphasis: {
                        focus: 'series'
                    },
                }];
            series[0].data = this.predict_confirmed;
            series[1].data = this.predict_cured;
            series[2].data = this.predict_died;
            if (!op) {
                series[0].name = series[1].name = series[2].name = '';
            }
            // else {
            // 	console.log(this.predict_confirmed[this.predict_confirmed.length-1][0]);
            // 	series[0].markArea = {
            // 		itemStyle: {
            // 			color: '#e4b921'
            // 		},
            // 		data: [{
            // 			xAxis: this.predict_confirmed[0][0]
            // 		}, {
            // 			xAxis: this.predict_confirmed[this.predict_confirmed.length-1][0]
            // 		}]
            // 	};
            // }
            var option = this.charts[0].getOption();
            option.series = option.series.slice(0, 3).concat(series);
            this.charts[0].setOption(option);
        },

        show_graphs() {
            var chart = this.$echarts.init(document.getElementById('chart'));

            var confirmed_data = [];
            var cured_data = [];
            var died_data = [];
            for (let i = 0; i < this.tableData.length; i++) {
                confirmed_data.push(this.tableData[i].confirmed);
                cured_data.push(this.tableData[i].cured);
                died_data.push(this.tableData[i].died);
            }

            chart.setOption(this.get_option('感染总人数', confirmed_data));

            this.charts = [];
            this.charts.push(chart);
        },

        resize_charts() {
            this.charts.forEach(function (c) {
                c.resize();
            });
        },

        change_predict(op, data) {
            this.predict_confirmed = [];
            this.predict_cured = [];
            this.predict_died = [];
            if (op) {
                for (let i = 0; i < data.length; i++) {
                    this.predict_confirmed.push([moment(data[i].date).valueOf(), data[i].confirmed]);
                    this.predict_cured.push([moment(data[i].date).valueOf(), data[i].cured]);
                    this.predict_died.push([moment(data[i].date).valueOf(), data[i].died]);
                }
                this.set_predict(op);
            } else {
                this.set_predict(op);
            }
        },

        init_pie() {
            var data = [];
            if (this.tableData.length) {
                data = [
                    {value: this.tableData[this.tableData.length - 1].cured, name: '治愈率'},
                    {value: this.tableData[this.tableData.length - 1].died, name: '死亡率'},
                    {
                        value: this.tableData[this.tableData.length - 1].confirmed - this.tableData[this.tableData.length - 1].cured - this.tableData[this.tableData.length - 1].died,
                        name: '未治愈'
                    },
                ];
            }
            var pie = this.$echarts.init(document.getElementById('pie'));
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{b} : {c} 人 ({d}%)',
                    textStyle: {
                        fontSize: 18
                    }
                },
                legend: {
                    // orient: 'vertical',
                    // left: 'right',
                    textStyle: {
                        fontSize: 18
                    }
                },
                grid: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                series: [
                    {
                        name: '比率',
                        type: 'pie',
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            // show: false,
                            // position: 'center'
                            fontSize: '21',
                            fontWeight: 'bold'
                        },
                        color: ['#1882c3', '#808080', '#cb3434'],
                        // emphasis: {
                        // 	label: {
                        // 		// show: true,
                        // 		fontSize: '36',
                        // 		fontWeight: 'bold'
                        // 	}
                        // },
                        startAngle: 180,
                        labelLine: {
                            // show: false
                        },
                        data: data
                    }
                ]
            };
            pie.setOption(option);
            this.charts.push(pie);
        },

        init_other_line() {
            var other_line = this.$echarts.init(document.getElementById('other_line'));

            console.log(this.tableData);
            let data1 = []
            let data2 = []
            if (this.tableData.length && this.tableData[0].vaccinated && this.tableData[0].vaccinated != '未知') {
                data2.push([this.tableData[0].date, this.tableData[0].vaccinated]);
            }
            for (let i = 1; i < this.tableData.length; i++) {
                if (moment(this.tableData[i].date).diff(this.tableData[i - 1].date, 'day') == 1) {
                    data1.push([this.tableData[i].date, this.tableData[i].confirmed - this.tableData[i - 1].confirmed]);
                }
                if (this.tableData[i].vaccinated && this.tableData[i].vaccinated != '未知') {
                    data2.push([this.tableData[i].date, this.tableData[i].vaccinated]);
                }
            }
            console.log(data1);
            var series = [{
                name: '新增确诊',
                data: data1,
                label: {
                    fontSize: 16
                },
                type: 'line',
                yAxisIndex: 0,
                smooth: true,
                showSymbol: false,
            }];
            if (data2.length > 0) {
                series.push({
                    name: '疫苗接种剂次',
                    data: data2,
                    type: 'line',
                    showSymbol: false,
                    yAxisIndex: 1,
                    smooth: true
                })
            }
            else {
                series.push({
                    name: '',
                    data: [],
                    type: 'line',
                    showSymbol: false,
                    yAxisIndex: 1,
                    smooth: true
                })
            }
            var option = {
                title: {
                    text: '疫苗接种剂次 - 新增确诊',
                    padding: 10
                },
                tooltip: {
                    trigger: 'axis',
                },
                xAxis: {
                    type: 'time',
                    boundaryGap: false
                },
                yAxis: [{
                    type: 'value',
                    axisLabel: {
                        fontSize: 16,
                    }
                }, {
                    type: 'value',
                    axisLabel: {
                        fontSize: 16,
                    }
                }],
                legend: {
                    data: ['新增确诊', '疫苗接种剂次'],
                    textStyle: {
                        fontSize: 16
                    },
                    left: 'right',
                    padding: [12, 15]
                },
                grid: {
                    top: 50,
                    right: 100,
                    bottom: 50,
                    left: 70
                },
                series: series,
            };
            other_line.setOption(option);
            this.charts.push(other_line);
        }
    }
}
</script>

<style scoped>
* {
    --table-width: 40%;
    --slider-width: 1200px;
    --slider-height: 45px;
    --date-selector-width: 118px;
}

.cas {
    position: relative;
    height: 100%;
    /* border: solid 1px #000; */
}

.slider {
    margin: 20px auto;
    width: calc(90% + 30px);
    height: var(--slider-height);
    position: relative;
}

.graphs {
    position: relative;
    /* top: var(--slider-height); */
    /* left: 0; */
    padding: 0 30px;
    width: calc(100% - var(--table-width) - 60px);
    height: calc(100% - var(--slider-height) - 20px);
    float: left;
    overflow: overlay;
}

.graphs-and-table {
    height: calc(100% - 20px);
    border-top: solid 1px #eee;
    /* background-color: #565656; */
}

.graph {
    margin: 15px auto;
    width: 100%;
    height: calc(100% - 36px);
    border-radius: 5px;
    /* box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); */
    /* border: solid 1px #ccc; */
    overflow: hidden;
}

.table {
    width: var(--table-width);
    height: calc(100% - 50px);
    position: relative;
    float: right;
}

.table >>> .el-table .cell {
    font-size: var(--font-size);
}

.change_pic {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;
}

.change_pic >>> .el-radio-button span {
    font-size: 16px;
    padding: 10px 15px;
}

.table .other_statistic {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: hsla(0, 0%, 100%, 90%);
}

#pie {
    margin-top: 30px;
    padding: 0 25px;
    width: calc(100% - 50px);
    height: 270px;
}

.rate_card {
    margin: 10px 5px 0;
    height: 100px;
    /* border: solid 1px #000; */
}

.rate_card .title {
    margin: 0 3%;
    line-height: 36px;
    font-size: var(--font-size-big);
    font-weight: bold;
    border-bottom: solid 1px #aaa;
    color: #787878;
}

.rate_card .content {
    line-height: 65px;
    font-size: 39px;
    font-weight: bold;
    text-align: center;
}

.el-divider {
    margin: 0;
}

#other_line {
    height: calc(100% - 410px);
    /* border: solid 1px #000; */
}
</style>



// WEBPACK FOOTER //
// src/components/cross-analysis-simple.vue