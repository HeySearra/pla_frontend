<template>
    <div class="travel_search">
        <div class="inner">
            <div class="title">
                出行风险查询
            </div>
            <div class="input">
                <input 
                    v-model="input"
                    placeholder="请搜索列车号或航班号" 
                    :style="input.length?'font-size:21px':'font-size:18px'"
                    maxlength="18"
                    @keyup.enter="search">
                <span
                    v-if="!loading"
                    class="search_icon" 
                    :style="input?'opacity: 0.5':'opacity: 0 !important; cursor: text'"
                    @click="search">
                    <i class="el-icon-search"></i>
                </span>
                <span
                    v-if="loading"
                    class="search_icon" 
                    style="opacity: 0.75; cursor: text">
                    <i class="el-icon-loading"></i>
                </span>
            </div>
        </div>
        <div class="searching_result">
            <div style="line-height: 50px; border-bottom: solid 1px #ddd; color: #999">搜索结果共 {{train.length+plane.length}} 条：</div>
            <router-link 
                v-for="item in train" 
                :key="item.key"
                :to="{name: 'travel_train', query: {train: item.key}}">
                <TravelSearchItem :info="item" />
            </router-link>
            <div v-if="train.length&&plane.length" style="height: 50px; border-bottom: solid 1px #ddd; color: #999"></div>
            <router-link 
                v-for="item in plane" 
                :key="item.key"
                :to="{name: 'travel_plane', query: {plane: item.key}}">
                <TravelSearchItem type="plane" :info="item" />
            </router-link>
            <div v-if="!train.length&&!plane.length" class="not_found" style="margin-top: 50px">找不到任何的列车或航班</div>
            <div style="height: 50px"></div>
        </div>
        <div class="background"></div>
        <DataFrom :info="data_from" />
    </div>
</template>

<script>
import TravelSearchItem from '@/components/travel_search_item';

export default {
    name: 'TravelSearch',

    components: {
        TravelSearchItem
    },

    mounted() {
        this.init();
    },

    destroyed() {

    },

    props: {

    },

    data() {
        return {
            input: '',
            searching: false,
            loading: false,
            train: [],
            plane: [],
            data_from: [{
                title: '列车数据 1',
                content: 'http://train.qunar.com/qunar/checiInfo.jsp'
            }, {
                title: '列车数据 2',
                content: 'https://trains.ctrip.com/'
            }, {
                title: '航班数据',
                content: 'http://www.umetrip.com/mskyweb/main/index.html?hrefParam=index'
            }, {
                title: '机场经纬度',
                content: 'https://ourairports.com/'
            }, {
                title: '出行政策',
                content: 'http://wx.wind.com.cn/unitedweb/cmsapp/Sites/TravelPolicy/index.html?lan=cn&dt_platform=douban_broadcast&dt_dapp=3#/'
            }, {
                title: '风险地区',
                content: 'http://www.gd.gov.cn/gdywdt/zwzt/yqfk/content/mpost_3021711.html'
            }]
        }
    },

    watch: {
        '$route.query.s': {
            handler() {
                this.init();
            },
        },
        input() {
            this.input = this.input.replace(/[\W]/g,'');
        }
    },

    methods: {
        init() {
            let s = this.$route.query.s;
            if(s && s.replace(/[\W]/g,'').length){
                if(this.loading) {
                    return;
                }
                this.input = s.replace(/[\W]/g,'');
                this.search();
            }
            else{
                this.input = '';
                this.quit_search();
            }
        },

        search() {
            this.loading = true;
            this.$router.push({name: 'travel_search', query: {s: this.input}});
            if(this.input.length){
                this.ajax.post('/travel/search', {key: this.input}, this, {
                    success(res) {
                        if(res.status == 3) {
                            this.alert_msg.warning('搜索内容过短');
                            this.loading = false;
                            return;
                        }
                        this.train = [];
                        this.plane = [];
                        for(let i=0; i<res.results.length; i++) {
                            if(res.results[i].is_train) {
                                this.train.push(res.results[i]);
                            }
                            else {
                                this.plane.push(res.results[i]);
                            }
                        }
                        var that = this;
                        $('.travel_search *').addClass('searching');
                        setTimeout(function(){
                            $('.searching_result').slideDown('slow');
                            that.loading = false;
                        }, 300);
                    },
                    error() {
                        this.loading = false;
                    }
                });
            }
            else{
                this.quit_search();
                this.loading = false;
            }
        },

        quit_search() {
            $('.searching_result').slideUp(300);
            setTimeout(function() {
                $('.searching').removeClass('searching');
            }, 270);
        }
    }
}
</script>

<style scoped>
    .background{
        background-color: #f3f6f5;
        background-image: url('./../assets/travel_search_bc.jpg');
        background-position: center bottom;
        background-size: 1500px auto;
        background-repeat: no-repeat;
        width: 100vw;
        height: 100%;
        min-width: var(--min-width);
        position: fixed;
        top: 0;
        left: 0;
        z-index: -1;
    }

    .travel_search {
        position: relative;
    }

    .inner{
        padding-top: 15vh;
        position: absolute;
        width: 100%;
        transition: all 0.2s ease;
    }

    .inner.searching{
        padding-top: 1vh;
    }

    .inner .title{
        width: 450px;
        margin: 0 auto;
        font-size: 56px;
        font-weight: bold;
        letter-spacing: 6px;
        border-bottom: double 6px hsla(219, 36%, 56%, 50%);
        text-align: center;
        padding-bottom: 5px;
        color: hsl(219, 36%, 56%);
        transition: all 0.2s ease;
    }

    .inner .title.searching{
        opacity: 0;
    }

    .input{
        margin: 78px auto;
        position: absolute;
        top: calc(6vh + 138px);
        left: calc(50% - 285px);
        text-align: center;
        transition: all 0.5s ease;
    }

    .input.searching{
        margin: 0 auto;
        top: 60px;
    }

    .input input{
        padding-top: 5px;
        width: 560px;
        line-height: 45px;
        font-size: 21px;
        border: solid 2px hsl(0, 0%, 83%);
        border-radius: 27px;
        position: relative;
        letter-spacing: 1px;
        text-indent: 1px;
        color: hsl(219, 36%, 56%);
        background-color: hsla(0, 0%, 100%, 69%);
        text-align: center;
        text-transform: uppercase;
        transition: border 0.1s linear;
    }

    .input input:hover, .input input:focus{
        border-color: hsl(219, 36%, 56%);
    }

    .input input:focus, .input input:active{
        outline: none;
    }

    .search_icon{
        padding: 5px;
        position: absolute;
        top: 9px;
        right: 18px;
        font-size: 21px;
        color: hsl(154, 27%, 30%, 100%);
        cursor: pointer;
        opacity: 0;
        display: block;
        transition: opacity 0.1s linear;
    }

    .search_icon:hover{
        opacity: 0.75 !important;
    }

    .searching_result{
        position: absolute;
        top: 150px;
        left: calc(50% - 550px);
        width: 1100px;
        /* height: 1000px; */
        /* border: solid 1px #000; */
        display: none;
    }

    /* .searching_result.searching{
        display: block;
    } */
</style>



// WEBPACK FOOTER //
// src/pages/travel_search.vue