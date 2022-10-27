<template>
    <div class="news">
        <div class="time_list">
            <div class="list_head">
                <h3>新闻时间表</h3>
                <div>
                    <el-radio-group v-model="type" size="small" @change="change_area">
                        <el-radio-button label="国内"></el-radio-button>
                        <el-radio-button label="国际"></el-radio-button>
                    </el-radio-group>
                </div>
                <el-link type="primary" style="margin-left: 23px" :underline="false" @click="choose_day">选日期</el-link>
                <div class="clear_both"></div>
            </div>
            <div class="inner_time_list">
                <div class="inner_time_list_head"></div>
                <el-timeline v-if="list">
                    <el-timeline-item
                        v-for="item in list"
                        :key="item.date"
                        :timestamp="item.date + ` (${item.list.length} 条)`" 
                        placement="top"
                        size="large">
                        <a :href="`#n${iitem.rid}`" class="text_overflow_1" v-for="(iitem, index) in item.list" :key="index">
                            {{iitem.title}}
                        </a>
                    </el-timeline-item>
                </el-timeline>
                <div v-if="loading" class="not_found" style="margin: 0 0 15px; padding-left: 25px"><i class="el-icon-loading"></i> 加载中</div>
                <div v-if="!loading&&!finished" @click="apply_for_info" class="not_found more" style="margin: 0 0 15px; padding-left: 25px">加载更多</div>
                <div v-if="finished" class="not_found" style="margin: 0 0 15px; padding-left: 25px">已经没有更多的新闻了</div>
            </div>
        </div>
        <transition name="el-zoom-in-top">
            <div v-if="choose_mode" class="time_list">
                <div class="list_head">
                    <h3 style="padding: 0 0.5em">查询新闻</h3>
                    <div>
                        <el-radio-group v-model="type" size="small" @change="change_area">
                            <el-radio-button label="国内"></el-radio-button>
                            <el-radio-button label="国际"></el-radio-button>
                        </el-radio-group>
                    </div>
                    <el-link type="primary" style="margin-left: 30px" :underline="false" @click="quit_choose"> 退出 </el-link>
                    <div class="clear_both"></div>
                </div>
                <div class="inner_time_list" v-loading="loading">
                    <div class="inner_time_list_head" style="height: 60px;">
                        <el-date-picker
                            v-model="chosen_day"
                            type="date"
                            :clearable="false"
                            align="center"
                            placeholder="选择日期查看当日新闻"
                            @change="apply_for_info">
                        </el-date-picker>
                    </div>
                    <div style="height: 10px;"></div>
                    <el-timeline v-if="choose_list">
                        <el-timeline-item
                            v-for="item in choose_list"
                            :key="item.date"
                            :timestamp="item.date + ` (${item.list.length} 条)`" 
                            placement="top"
                            size="large">
                            <a :href="`#n${iitem.rid}`" class="text_overflow_1" v-for="(iitem, index) in item.list" :key="index">
                                {{iitem.title}}
                            </a>
                        </el-timeline-item>
                    </el-timeline>
                </div>
            </div>
        </transition>
        <div class="inner_news">
            <a id="top"></a>
            <div v-if="list" class="domestic">
                <div style="height: 50px;"></div>
                <div
                    v-for="item in list"
                    :key="item.date"
                    style="margin: 0 auto; width: 90%;">
                    <h1 class="date_title">{{item.date}}</h1>
                    <el-row :gutter="30">
                        <el-col v-for="iitem in item.list" :key="iitem.url" :span="span">
                            <NewsItem :id="`n${iitem.rid}`" :info="iitem" />
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div v-if="loading&&!choose_mode" class="not_found" style="margin: 0 0 15px; padding-left: 25px"><i class="el-icon-loading"></i> 加载中</div>
            <div v-if="!loading&&!finished&&!choose_mode" @click="apply_for_info" class="not_found more" style="margin: 0 0 15px; padding-left: 25px">加载更多</div>
            <div v-if="finished||choose_mode" class="not_found" style="margin: 0 0 15px; padding-left: 25px">已经没有更多的新闻了</div>
            <div style="height: 30px;"></div>
            <div class="clear_both"></div>     
        </div>
        <DataFrom :info="data_from" />
    </div>
</template>

<script>
import moment from 'moment';
import NewsItem from '@/components/news_item';

export default {
    name: 'News',

    components: {
        NewsItem
    },

    mounted() {
        var that = this;
        window.onresize = (function() {
            var a = function() {
                // console.log(document.getElementById('app').clientWidth)
                if(document.getElementById('app').clientWidth >= 1700) {
                    that.span = 6;
                }
                else if(document.getElementById('app').clientWidth >= 1380) {
                    that.span = 8;
                }
                else {
                    that.span = 12;
                }
                return this;
            };
            a();
            return a;
        })();
        this.init();
    },

    destroyed() {
        window.onresize = function(){};
    },

    props: {

    },

    data() {
        return {
            list: undefined,
            china: [],
            global: [],
            choose_list: [],
            choose_china: [],
            choose_global: [],
            type: '国内',
            span: 6,
            rid: 0,
            now_day: '',
            loading: true,
            finished:false,
            choose_mode: false,
            chosen_day: '',
            data_from: [{
                title: '新闻（腾讯新闻）',
                content: 'https://i.news.qq.com/trpc.qqnews_web.kv_srv.kv_srv_http_proxy/list?sub_srv_id=antip&srv_id=pc&offset=0&limit=65&strategy=1&ext= {%22pool%22:[%22high%22,%22top%22],%22is_filter%22:10,%22check_type%22:true}'
            }]
        }
    },

    watch: {

    },

    methods: {
        init() {
            this.change_area();
            this.apply_for_info();
        },

        apply_for_info() {
            this.loading = true;
            if(this.choose_mode) {
                this.ajax.post('/news/weekly', {date: moment(this.chosen_day).format('YYYY-MM-DD')}, this, {
                    success(res) {
                        res.china.sort(function(a, b) {
                            return moment(a.publish_time) > moment(b.publish_time);
                        });
                        let time ={};
                        time.date = moment(this.chosen_day).format('YYYY年MM月DD日');
                        time.list = [];
                        for(let i=0; i<res.china.length; i++) {
                            if(moment(res.china[i].publish_time).format('YYYY年MM月DD日')==time.date) {
                                time.list.push(res.china[i]);
                            }
                        }
                        this.choose_china[0] = {...time};
                        res.global.sort(function(a, b) {
                            return moment(a.publish_time) > moment(b.publish_time);
                        });
                        time.date = moment(this.chosen_day).format('YYYY年MM月DD日');
                        time.list = [];
                        for(let i=0; i<res.global.length; i++) {
                            if(moment(res.global[i].publish_time).format('YYYY年MM月DD日')==time.date) {
                                time.list.push(res.global[i]);
                            }
                        }
                        this.choose_global[0] = {...time};
                        this.loading = false;
                        this.change_area();
                    }
                });
            }
            else {
                if(this.now_day) {
                    this.now_day = moment(this.now_day).subtract(7, 'd').format('YYYY-MM-DD');
                }
                this.ajax.post('/news/weekly', {date: this.now_day?this.now_day:''}, this, {
                    success(res) {
                        if(!this.now_day) {
                            this.now_day = moment(res.date).format('YYYY-MM-DD');
                        }
                        res.china.sort(function(a, b) {
                            return moment(a.publish_time) > moment(b.publish_time);
                        });
                        for(let i=0; i<res.china.length; ) {
                            let time ={};
                            time.date = moment(res.china[i].publish_time).format('YYYY年MM月DD日');
                            time.list = [];
                            while(i<res.china.length && moment(res.china[i].publish_time).format('YYYY年MM月DD日')==time.date) {
                                res.china[i].rid = this.rid++;
                                time.list.push(res.china[i++]);
                            }
                            this.china.push(time);
                        }
                        res.global.sort(function(a, b) {
                            return moment(a.publish_time) > moment(b.publish_time);
                        });
                        for(let i=0; i<res.global.length; ) {
                            let time ={};
                            time.date = moment(res.global[i].publish_time).format('YYYY年MM月DD日');
                            time.list = [];
                            while(i<res.global.length && moment(res.global[i].publish_time).format('YYYY年MM月DD日')==time.date) {
                                res.global[i].rid = this.rid++;
                                time.list.push(res.global[i++]);
                            }
                            this.global.push(time);
                        }
                        this.loading = false;
                    },
                    error() {
                        this.now_day = moment(this.now_day).add(7, 'd');
                    }
                });
            }
        },

        change_area() {
            if(this.choose_mode) {
                if(this.type == '国际') {
                    this.choose_list = this.choose_global;
                    this.list = this.choose_global;
                }
                else {
                    this.choose_list = this.choose_china;
                    this.list = this.choose_china;
                }
            }
            else {
                if(this.type == '国际') {
                    this.list = this.global;
                }
                else {
                    this.list = this.china;
                }
            }
            this.back_to_top();
        },

        choose_day() {
            this.choose_mode = true;
            var that = this;
            setTimeout(function() {
                that.change_area();
            }, 180)
        },

        quit_choose() {
            this.choose_mode = false;
            this.change_area();
        },

        back_to_top() {
            let a = document.createElement('a');
            a.href="#top";
            a.click();
        }
    }
}
</script>

<style scoped>
    :local {
        --time-list-width: 400px;
    }

    .news {
        width: 100%;
        height: calc(100% - var(--nav-height));
        position: absolute;
        top: var(--nav-height);
        left: 0;
        /* border: solid 1px #000; */
        /* background-image: url('../assets/news_bc2.jpg'); */
        background-position: center;
        background-size: 1250px auto;
        overflow: overlay;
    }

    .time_list {
        width: var(--time-list-width);
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        /* border: solid 1px #000; */
        border-right: solid 1px #ccc;
        background-color: #fff;
        overflow: hidden;
    }

    .time_list .list_head {
        margin: 0;
        z-index: 1;
    }

    .time_list .list_head > * {
        margin: 25px 23px 0 0;
        line-height: 50px;
        float: left;
    }

    .time_list .list_head>>>.el-radio-button__inner {
        font-size: 15px;
        padding: 7px 11px;
    }

    .time_list h3 {
        font-weight: normal;
        text-indent: 1em;
        /* text-align: center; */
        color: #555;
    }

    .time_list .inner_time_list {
        padding: 0 50px 29px 0;
        height: calc(100% - 79px);
        overflow: overlay;
    }

    .time_list .inner_time_list .inner_time_list_head {
        height: 50px;
        position: sticky;
        top: 0;
        left: 0;
        background-image: linear-gradient(to bottom, #fff, hsla(0, 0%, 100%, 0));
        /* border: solid 1px #000; */
        z-index: 1;
    }

    .time_list .inner_time_list>>>.el-timeline-item__node {
        background-color: var(--color-t);
    }

    .time_list .inner_time_list>>>.el-timeline-item__timestamp {
        color: var(--color-t);
        font-size: 18px;
        font-weight: bold;
    }

    .time_list a {
        margin-top: 20px;
        margin-bottom: 15px;
        color: #777;
        font-size: 16px;
        text-decoration: none;
        display: block;
    }

    .time_list a:hover {
        color: var(--color-t);
    }

    .time_list .el-date-editor.el-input {
        width: calc(100% + 50px);
    }

    .time_list .el-date-editor.el-input>>>input {
        border-left: unset;
        border-right: unset;
        border-radius: 0;
    }

    .more {
        cursor: pointer;
    }

    .more:hover {
        color: var(--color-t);
    }

    .inner_news {
        width: calc(100% - var(--time-list-width));
        height: 100%;
        position: absolute;
        top: 0;
        left: var(--time-list-width);
        overflow: overlay;
    }

    .date_title {
        margin-left: -5px;
        margin-bottom: 30px;
        padding: 10px 25px;
        position: sticky;
        top: 0;
        left: 0;
        width: fit-content;
        background-color: var(--color-t);
        border: solid 6px #fff;
        /* border-radius: 5px; */
        font-size: 23px;
        letter-spacing: 1px;
        color: #fff;
        opacity: 0.90;
        z-index: 1;
    }
</style>



// WEBPACK FOOTER //
// src/pages/news.vue