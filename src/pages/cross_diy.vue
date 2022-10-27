<template>
    <div class="cross_diy">
        <div class="cross_diy_left shadow" v-loading="loading">
            <div class="search_input">
                <el-select
                    v-model="search_key"
                    filterable
                    placeholder="请选择国家或地区来搜索"
                    @change="change_area">
                    <el-option-group
                        v-for="(group, index) in options"
                        :key="group.label"
                        :label="group.label">
                        <el-option
                            v-for="item in group.options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            <span style="float: left">{{ item.label }}</span>
                            <span v-if="index == 1" style="float: right; color: #8492a6; font-size: 13px">{{
                                    item.value
                                }}</span>
                        </el-option>
                    </el-option-group>
                </el-select>
            </div>
            <div class="search_result">
                <!-- <div v-if="loading" class="not_found" style="margin-top: 50px">搜索中</div> -->
                <div
                    ref="table"
                    v-for="item in result"
                    :key="item.area+item.type"
                    :draggable="true"
                    @dragstart="start_drag($event)"
                    @dragend="end_drag($event)">
                    <SearchTableItem :info="item" @add="add_table" @remove="delete_tag(get_tag_name(item))"/>
                </div>
                <div v-if="!result.length" class="not_found can_not_choose" style="margin-top: 50px">
                    在上方输入国家或者地区名称以搜索数据表格
                </div>
            </div>
        </div>
        <div class="cross_diy_right">
            <div class="pool">
                <el-tag
                    v-for="tag in tags"
                    :key="tag"
                    closable
                    @close="delete_tag(tag)">
                    {{ tag }}
                </el-tag>
                <div v-if="!tags.length" class="not_found can_not_choose">搜索数据表格添加进折线图中</div>
            </div>
            <div id="chart"></div>
        </div>
        <div
            id="cross_diy_fakeright"
            class="cross_diy_fakeright"
            style="z-index: 2; opacity: 0;"
            @drop="face_drop($event)"
            @dragover="allow_drop($event)"
            @dragenter="dragenter"
            @dragleave="dragleave">
        </div>
        <div class="cross_diy_fakeright" style="z-index: 1">
            <div>{{ drag_over ? '松开' : '拖动至此' }}以添加图表</div>
        </div>
        <DataFrom :info="data_from" />
    </div>
</template>

<script>
import moment from 'moment';
import {provinces_cn, provinces_en} from '@/assets/provinces.js';
import {nameMap} from '@/assets/world_registry.js';
import SearchTableItem from '@/components/search_table_item';
import DataFrom from '@/components/data_from';

export default {
    name: 'CrossDiy',

    components: {
        SearchTableItem,
        DataFrom
    },

    mounted() {
        this.init_search_suggest();
        this.init_charts();
        var that = this;
        window.onresize = function () {
            that.resize_charts();
        }
    },

    destroyed() {
        window.onresize = function () {
        }
    },

    props: {},

    data() {
        return {
            tags: [],
            info: [],
            charts: [],
            result: [],
            drag_over: false,
            search_key: '',
            options: [{
                label: '省份',
                options: []
            },
                {
                    label: '国家',
                    options: []
                }],
            vm_map: {},
            dragging_info: undefined,
            loading: false,
            data_from: [{
                title: '疫情国际数据',
                content: 'https://news.qq.com/zt2020/page/feiyan.htm#/'
            }, {
                title: '疫苗国际数据',
                content: 'https://github.com/owid/covid-19-data/tree/master/public/data/vaccinations'
            }, {
                title: '全球疫苗接种明细',
                content: 'http://wx.wind.com.cn/unitedweb/cmsapp/Sites/sariInfo/message.html?from=timeline&isappinstalled=0'
            }, {
                title: '国内数据（丁香园）',
                content: 'https://github.com/BlankerL/DXY-COVID-19-Data/releases/tag/2021.07.05'
            }, {
                title: '疫情国内数据',
                content: 'https://github.com/BlankerL/DXY-COVID-19-Data'
            }, {
                title: '疫情预测数据',
                content: 'http://covid19.whalemed.cn/#/home'
            }, {
                "title": "海南疫苗数据",
                "content": "https: //baijiahao.baidu.com/s?id=1704722373499727253&wfr=spider&for=pc"
            },
            {
                "title": "宁夏疫苗数据",
                "content": "https://www.thepaper.cn/newsDetail_forward_13468978"
            },
            {
                "title": "湖南疫苗数据",
                "content": "https://www.hnmsw.com/show_article.php?articleID=158356.html"
            },
            {
                "title": "青海疫苗数据",
                "content": "http://www.qh.gov.cn/zwgk/system/2021/06/11/010385277.shtml"
            },
            {
                "title": "上海疫苗数据",
                "content": "http://www.wandaclub.cc/thread-259382-1-1.html?continueFlag=9aa6f5f8cf33d5e4e7d77595b84f1b6e"
            },
            {
                "title": "广西疫苗数据",
                "content": "http://www.wandaclub.cc/thread-259382-1-1.html?continueFlag=9aa6f5f8cf33d5e4e7d77595b84f1b6e"
            },
            {
                "title": "河南疫苗数据",
                "content": "http://www.wandaclub.cc/thread-259382-1-1.html?continueFlag=9aa6f5f8cf33d5e4e7d77595b84f1b6e"
            },
            {
                "title": "山东疫苗数据",
                "content": "http://news.sdchina.com/show/4630234.html"
            },
            {
                "title": "江苏疫苗数据",
                "content": "https://baijiahao.baidu.com/s?id=1704722373499727253&wfr=spider&for=pc"
            },
            {
                "title": "港疫苗数据",
                "content": "https://www.news.gov.hk/chi/2021/06/20210625/20210625_223106_983.html"
            },
            {
                "title": "重庆疫苗数据",
                "content": "https://www.chinanews.com/gn/2021/06-30/9510541.shtml"
            },
            {
                "title": "安徽疫苗数据",
                "content": "http://wjw.ah.gov.cn/xwzx/tpxw/55745221.html"
            },
            {
                "title": "内蒙古疫苗数据",
                "content": "http://m.hu.bendibao.com/mip/44323.shtm"
            },
            {
                "title": "西藏疫苗数据",
                "content": "http://news.cctv.com/2021/06/27/VIDEBlMxAuwCl8g5TspMzkPf210627.shtml"
            },
            {
                "title": "吉林疫苗数据",
                "content": "https://baijiahao.baidu.com/s?id=1700105386793643852&wfr=spider&for=pc"
            },
            {
                "title": "湖北疫苗数据",
                "content": "http://bj.bendibao.com/news/202175/295490.shtm"
            },
            {
                "title": "辽宁疫苗数据",
                "content": "https://www.sohu.com/a/474800306_121106822"
            },
            {
                "title": "贵州疫苗数据",
                "content": "http://www.gz.chinanews.com/dcsj/2021-05-20/doc-ihamqrhv6862248.shtml"
            },
            {
                "title": "广东疫苗数据",
                "content": "https://ourworldindata.org/covid-vaccinations?country=TWN"
            },
            {
                "title": "江西疫苗数据",
                "content": "http://hc.jiangxi.gov.cn/art/2021/6/30/art_38255_3459697.html"
            },
            {
                "title": "四川疫苗数据",
                "content": "http://www.sc.gov.cn/10462/12771/2021/6/24/2b50646dd9704b698d7c3331e41185e0.shtml"
            },
            {
                "title": "北京疫苗数据",
                "content": "https://www.jiemian.com/article/6339840.html"
            },
            {
                "title": "澳门疫苗数据",
                "content": "https://www.163.com/dy/article/GCFSBCPE053469RG.html"
            },
            {
                "title": "黑龙江疫苗数据",
                "content": "https://www.thepaper.cn/newsDetail_forward_13354824"
            },
            {
                "title": "云南疫苗数据",
                "content": "http://www.yn.xinhuanet.com/original/2021-06/16/c_1310010614.htm"
            },
            {
                "title": "浙江疫苗数据",
                "content": "http://www.chinanews.com/gn/2021/06-04/9492777.shtml"
            },
            {
                "title": "甘肃疫苗数据",
                "content": "http://wsjk.gansu.gov.cn/single/11067/90081.html"
            },
            {
                "title": "天津疫苗数据",
                "content": "http://www.tj.gov.cn/sy/xwfbh/202106/t20210629_5489304.html"
            },
            {
                "title": "新疆疫苗数据",
                "content": "http://wjw.xizang.gov.cn/xwzx/wsjkdt/202106/t20210624_247900.html"
            }]
        }
    },

    watch: {},

    methods: {
        init_search_suggest() {
            this.vm_map = {};
            this.options[0].options = [];
            for (let i = 0; i < provinces_cn.length; i++) {
                this.options[0].options.push({value: provinces_en[i], label: provinces_cn[i]});
                this.vm_map[provinces_en[i]] = provinces_cn[i];
            }
            this.options[1].options = [];
            for (let k in nameMap) {
                this.options[1].options.push({value: k, label: nameMap[k]});
                this.vm_map[k] = nameMap[k];
            }
        },

        get_option() {
            console.log(this.info)
            var series = [];
            let y_axis = [{
                type: 'value',
            }, {
                type: 'value',
            }];
            for (let i = 0; i < this.info.length; i++) {
                let data = [];
                for (let j = 0; j < this.info[i].arr.length; j++) {
                    data.push([moment(this.info[i].arr[j].date).format(), this.info[i].arr[j].value]);
                }
                let y_index = 0;
                // if (this.info.length == 2) {
                //     y_index = i;
                // }
                series.push({
                    name: this.info[i].tag,
                    type: 'line',
                    yAxisIndex: y_index,
                    smooth: true,
                    showSymbol: false,
                    data: [...data]
                });
            }

            var option = {
                tooltip: {
                    trigger: 'axis',
                },
                grid: {
                    top: 50,
                    bottom: 78,
                    left: 90,
                    right: 90
                },
                title: {
                    left: 'center',
                },
                legend: {
                    data: this.tags
                },
                toolbox: {
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'time',
                    boundaryGap: false
                },
                yAxis: y_axis,
                dataZoom: [{
                    type: 'inside',
                    start: 0,
                    end: 90
                }, {
                    start: 0,
                    end: 20
                }],
                series: series
            };

            return option;
        },

        init_charts() {
            var chart = this.$echarts.init(document.getElementById('chart'));
            chart.setOption(this.get_option(), true);
            this.charts.push(chart);
        },

        resize_charts() {
            this.charts.forEach(function (c) {
                c.resize();
            });
        },

        allow_drop(e, item) {
            if (true) {
                e.preventDefault();
            }
        },

        face_drop(e, item) {
            if (this.dragging_info) {
                this.add_table(this.dragging_info);
                this.dragging_info = undefined;
            }
            e.preventDefault();
        },

        start_drag(e, item) {
            // e.preventDefault();
            this.dragging_info = e.toElement.children[0].__vue__.info;
            this.drag_over = false;
            $('.cross_diy_fakeright').fadeIn(150);
        },

        end_drag(e, item) {
            $('.cross_diy_fakeright').fadeOut(150);
        },

        dragenter() {
            this.drag_over = true;
        },

        dragleave() {
            this.drag_over = false;
        },

        change_area(item) {
            this.search(this.vm_map[item]);
        },

        search(name) {
            this.loading = true;
            this.ajax.post('/data/search', {
                name: name
            }, this, {
                success(res) {
                    this.result = [];
                    console.log(res);

                    var confirmed = {arr: [], area: name};
                    confirmed.type = 'confirmed';
                    var cured = {arr: [], area: name};
                    cured.type = 'cured';
                    var died = {arr: [], area: name};
                    died.type = 'died';
                    var vaccinated = {arr: [], area: name, max: 0};
                    vaccinated.type = 'vaccinated';

                    for (let i = 0; i < res.data.length; i++) {
                        confirmed.arr.push({date: res.data[i].date, value: res.data[i].total_confirmed});
                        cured.arr.push({date: res.data[i].date, value: res.data[i].total_cured});
                        died.arr.push({date: res.data[i].date, value: res.data[i].total_died});
                        if (res.data[i].total_vaccinated && res.data[i].total_vaccinated > vaccinated.max) {
                            vaccinated.arr.push({date: res.data[i].date, value: res.data[i].total_vaccinated})
                            vaccinated.max = res.data[i].total_vaccinated;
                        }
                    }


                    //计算新增的数据
                    let confirmed_new = {arr: [], area: name, type: 'confirmed_new'};
                    confirmed_new.arr = this.calc_new_data(confirmed.arr);
                    let cured_new = {arr: [], area: name, type: 'cured_new'};
                    cured_new.arr = this.calc_new_data(cured.arr);
                    let died_new = {arr: [], area: name, type: 'died_new'};
                    died_new.arr = this.calc_new_data(died.arr);

                    let tmp_arr = confirmed.arr;
                    for (let i = 1; i < tmp_arr.length; i++) {
                        if (moment(tmp_arr[1].date).diff(tmp_arr[0].date, 'day')) {

                        }
                    }


                    this.result = [confirmed, cured, died, confirmed_new, cured_new, died_new];
                    if (vaccinated.arr.length > 0) {
                        this.result.push(vaccinated);
                    }

                    var that = this;
                    setTimeout(function () {
                        for (let i = 0; i < that.$refs.table.length; i++) {
                            that.$refs.table[i].children[0].__vue__.init(that.result[i]);
                        }
                        that.renew_result();
                        that.loading = false;
                    }, 0);

                },
                error() {
                    this.loading = false;
                }
            });
        },

        calc_new_data(tmp_arr) {
            let res = []
            for (let i = 1; i < tmp_arr.length; i++) {
                if (moment(tmp_arr[i].date).diff(tmp_arr[i - 1].date, 'day') == 1) {
                    res.push({date: tmp_arr[i].date, value: tmp_arr[i].value - tmp_arr[i - 1].value});
                }
            }
            return res;
        },

        get_tag_name(info) {
            var res = '';
            switch (info.type) {
                case 'confirmed':
                    res = '确诊人数(累计) - ';
                    break;
                case 'confirmed_new':
                    res = '确诊人数(新增) - ';
                    break;
                case 'cured':
                    res = '治愈人数(累计) - ';
                    break;
                case 'cured_new':
                    res = '治愈人数(新增) - ';
                    break;
                case 'died':
                    res = '死亡人数(累计) - ';
                    break;
                case 'died_new':
                    res = '死亡人数(新增) - ';
                    break;
                case 'vaccinated':
                    res = '接种剂次 - ';
                    break;
            }
            res += info.area;
            return res;
        },

        add_table(info) {
            if (this.tags.indexOf(this.get_tag_name(info)) != -1) {
                this.alert_msg.warning('该表格已经添加进图中');
                return;
            }
            info.tag = this.get_tag_name(info);
            this.info.push(JSON.parse(JSON.stringify(info)));
            this.tags.push(this.get_tag_name(info));
            this.renew_result();
            this.renew_charts();
        },

        delete_table(tag) {
            for (let i = 0; i < this.info.length; i++) {
                if (this.info[i].tag == tag) {
                    // this.info[i].tag = undefined;
                    // this.info[i].arr = [];
                    this.info.splice(i, 1);
                }
            }
            this.renew_result();
            this.renew_charts();
        },

        delete_tag(tag) {
            let temp = [];
            for (let i = 0; i < this.tags.length; i++) {
                if (this.tags[i] != tag) {
                    temp.push(this.tags[i]);
                }
            }
            this.tags = [...temp];
            this.delete_table(tag);
        },

        renew_charts() {
            // this.charts[0].dispose();
            // this.init_charts();
            this.charts[0].setOption(this.get_option(), true);
        },

        renew_result() {
            for (let i = 0; i < this.$refs.table.length; i++) {
                if (this.tags.indexOf(this.get_tag_name(this.$refs.table[i].children[0].__vue__.info)) != -1) {
                    this.$refs.table[i].children[0].__vue__.choose(true);
                } else {
                    this.$refs.table[i].children[0].__vue__.choose(false);
                }
            }
        }
    }
}
</script>

<style scoped>
* {
    --cross-diy-left-width: 500px;
}

.cross_diy {
    height: calc(100% - var(--nav-height));
    position: relative;
    /* border: solid 1px #000; */
}

.cross_diy_left {
    position: absolute;
    top: 0;
    left: 0;
    width: var(--cross-diy-left-width);
    height: 100%;
    /* border: solid 1px #000; */
}

.cross_diy_right {
    position: absolute;
    top: 0;
    right: 0;
    width: calc(100% - var(--cross-diy-left-width));
    height: 100%;
    /* border: solid 1px #000; */
}

.cross_diy_fakeright {
    position: absolute;
    top: 0;
    right: 0;
    width: calc(100% - var(--cross-diy-left-width));
    height: 100%;
    background-color: hsla(0, 0%, 100%, 0.69);
    display: none;
}

.cross_diy_fakeright > div {
    width: 100%;
    position: absolute;
    top: calc(50% - 36px);
    font-size: 21px;
    font-weight: bold;
    color: hsla(0, 0%, 0%, 0.36);
    text-align: center;
    letter-spacing: 3px;
}

.search_input {
    padding: 30px 0;
    border-bottom: solid 1px #ddd;
    text-align: center;
    background-color: #ddd;
}

.search_input .el-select {
    width: 56%;
}

.search_input .el-select input {
    border-radius: 0;
}

.search_result {
    padding: 20px 50px;
    /* border: solid 1px #000; */
    height: calc(100% - 142px);
    background-color: #f6f6f6;
    overflow: overlay;
}

.search_table_item {
    margin: 30px 0 36px;
}

.cross_diy_right .pool {
    margin: 20px 70px;
    padding: 10px 20px;
    height: 90px;
    background-color: #fafafa;
    border: solid 1px #ccc;
    position: relative;
    overflow: overlay;
}

.cross_diy_right .pool .el-tag {
    margin: 5px;
}

.cross_diy_right .pool div.not_found {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    line-height: 110px;
}

.cross_diy_right .slider {
    margin: 10px 50px;
}

.cross_diy_right #chart {
    margin: 20px 30px;
    /* border: solid 1px #ccc; */
    height: calc(100% - 183px);
}
</style>



// WEBPACK FOOTER //
// src/pages/cross_diy.vue