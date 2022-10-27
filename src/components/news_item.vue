<template>
    <div class="news_item shadow" :style="show ? 'opacity:1' : 'opacity:0'">
        <div class="cur_poi" @click="to_news">
            <div class="img">
                <el-image v-if="info.img_url" :src="info.img_url" fit="cover">
                    <div slot="placeholder" class="image-slot">
                        加载中<span class="dot">...</span>
                    </div>
                </el-image>
                <el-image v-if="!info.img_url" :src="require('@/assets/news_default'+(parseInt(Math.random()*100)%6)+'.jpg')" fit="cover">
                    <div slot="placeholder" class="image-slot">
                        加载中<span class="dot">...</span>
                    </div>
                </el-image>
            </div>
            <div class="text">
                <h3 class="text_overflow_3">{{info.title}}</h3>
                <p class="text_overflow_5">{{info.body}}</p>
            </div>
            <div class="append">
                <p class="from">{{info.publish_time}}</p>
                <p v-if="info.media_name">来源：{{info.media_name}}</p>
                <!-- <p class="cur_poi" @click="to_news" style="color: var(--color-safe)">跳转到新闻</p> -->
            </div>
            <div style="height: 10px;"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NewsItem',

    mounted() {
        this.url = this.info.url;
        var that = this;
        setTimeout(function() {
            that.show = true;
        }, parseInt(Math.random()*690));
    },

    destroyed() {

    },

    props: {
        info: {
            type: Object, 
            default: {url:'', title:'11', body: '111111111111111111111111111111111111111111111111111111111111111111111111111'}
        }
    },

    data() {
        return {
            url: '',
            show: false
        }
    },

    watch: {

    },

    methods: {
        to_news() {
            if(this.url) {
                let a = document.createElement('a');
                a.href = this.url;
                a.target = '_blank';
                a.click();
            }
        }
    }
}
</script>

<style scoped>
    .news_item {
        margin-bottom: 30px;
        padding: 0;
        /* min-height: 300px; */
        background-color: hsla(0, 0%, 100%, 83%);
        transition: all 0.2s linear;
        opacity: 0;
    }

    .news_item:hover .text h3 {
        color: var(--color-t);
    }

    .el-skeleton {
        height: fit-content;
    }

    .news_item .img {
        float: left;
    }

    .el-image {
        width: 100%;
        height: 200px;
    }

    .news_item .text {
        margin: 10px 0;
        padding: 0 23px;
        height: 247px;
        float: left;
    }

    .news_item .text h3 {
        margin: 10px 0;
        color: #333;
        word-break: break-all;
        transition: color 0.1s linear;
    }

    .news_item .text p {
        height: 115px;
        line-height: 23px;
        color: #565656;
        word-break: break-all;
    }

    .news_item .append p {
        text-align: right;
        margin: 3px 0;
        padding: 0 23px;
        color: #aaa;
        font-size: 15px;
    }
</style>



// WEBPACK FOOTER //
// src/components/news_item.vue