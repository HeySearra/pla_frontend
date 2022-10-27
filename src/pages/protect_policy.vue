<template>
    <div class="news">
        <div class="time_list">
            <div class="list_head">
                <h3>防疫政策通告</h3>
                <!-- <div>
                    <el-radio-group v-model="type" size="small" @change="change_area">
                        <el-radio-button label="国内"></el-radio-button>
                        <el-radio-button label="国际"></el-radio-button>
                    </el-radio-group>
                </div> -->
                <!-- <el-link type="primary" style="margin-left: 23px" :underline="false" @click="choose_day">选日期</el-link> -->
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
                        <a :href="`#n${iitem.rid}`"
                           style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"
                           v-for="(iitem, index) in item.list"
                           :key="index">
                            {{ iitem.title }}
                        </a>
                    </el-timeline-item>
                </el-timeline>
                <div v-if="loading" class="not_found" style="margin: 0 0 15px; padding-left: 25px"><i
                    class="el-icon-loading"></i> 加载中
                </div>
                <div v-if="!loading&&!finished" @click="apply_for_info" class="not_found more"
                     style="margin: 0 0 15px; padding-left: 25px">加载更多
                </div>
                <div v-if="finished" class="not_found" style="margin: 0 0 15px; padding-left: 25px">已经没有更多的内容了</div>
            </div>
        </div>
        <div class="inner_news">
            <a id="top"></a>
            <div v-if="list" class="domestic">
                <div style="height: 50px;"></div>
                <div
                    v-for="item in list"
                    :key="item.date"
                    style="margin: 0 auto; width: 90%;">
                    <h1 class="date_title">{{ item.date }}</h1>
                    <el-row :gutter="30">
                        <el-col v-for="iitem in item.list" :key="iitem.url" :span="span">
                            <NewsItem :id="`n${iitem.rid}`" :info="iitem"/>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div v-if="loading&&!choose_mode" class="not_found" style="margin: 0 0 15px; padding-left: 25px"><i
                class="el-icon-loading"></i> 加载中
            </div>
            <div v-if="!loading&&!finished&&!choose_mode" @click="apply_for_info" class="not_found more"
                 style="margin: 0 0 15px; padding-left: 25px">加载更多
            </div>
            <div v-if="finished||choose_mode" class="not_found" style="margin: 0 0 15px; padding-left: 25px">
                已经没有更多的内容了
            </div>
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
    name: 'ProtectPolicy',

    components: {
        NewsItem
    },

    mounted() {
        var that = this;
        window.onresize = (function () {
            var a = function () {
                // console.log(document.getElementById('app').clientWidth)
                if (document.getElementById('app').clientWidth >= 1700) {
                    that.span = 6;
                } else if (document.getElementById('app').clientWidth >= 1380) {
                    that.span = 8;
                } else {
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
        window.onresize = function () {
        };
    },

    props: {},

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
            finished: false,
            choose_mode: false,
            chosen_day: '',
            data_from: [{
                title: '疫情实时播报',
                content: 'http://wx.wind.com.cn/unitedweb/cmsapp/Sites/sariInfo/message.html?from=timeline&isappinstalled=0'
            }]
        }
    },

    watch: {},

    methods: {
        init() {
            this.change_area();
            this.apply_for_info();
            console.log(this.list)
        },

        apply_for_info() {
            this.ajax.post('/epidemic_news/list', {}, this, {
                success(res) {
                    let policy = res.data;
                    let last = [];
                    for (let i = 0; i < policy.length; i++) {
                        let cur_date = moment(policy[i].datetime);
                        last.push({
                            body: '',
                            publish_time: cur_date.format("YYYY-MM-DD"),
                            rid: i,
                            title: policy[i].title,
                            body: policy[i].body,
                            url: policy[i].src,
                        })
                        //如果和后面的时间不一样，添加
                        if (i == policy.length - 1 || !cur_date.isSame(moment(policy[i + 1].datetime), 'day')) {
                            this.list.push({
                                date: cur_date.format("YYYY年MM月DD日"),
                                list: last
                            });
                            last = [];
                        }
                    }

                    this.loading = false;
                }
            })
        },

        change_area() {
            if (this.choose_mode) {
                if (this.type == '国际') {
                    this.choose_list = this.choose_global;
                    this.list = this.choose_global;
                } else {
                    this.choose_list = this.choose_china;
                    this.list = this.choose_china;
                }
            } else {
                if (this.type == '国际') {
                    this.list = this.global;
                } else {
                    this.list = this.china;
                }
            }
            this.back_to_top();
        },

        choose_day() {
            this.choose_mode = true;
            var that = this;
            setTimeout(function () {
                that.change_area();
            }, 180)
        },

        quit_choose() {
            this.choose_mode = false;
            this.change_area();
        },

        back_to_top() {
            let a = document.createElement('a');
            a.href = "#top";
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

.time_list .list_head >>> .el-radio-button__inner {
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

.time_list .inner_time_list >>> .el-timeline-item__node {
    background-color: var(--color-t);
}

.time_list .inner_time_list >>> .el-timeline-item__timestamp {
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

.time_list .el-date-editor.el-input >>> input {
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
// src/pages/protect_policy.vue