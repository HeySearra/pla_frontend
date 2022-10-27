<template>
    <div class="travel_search_item">
        <div v-if="type=='train'" class="icon">
            <i class="iconfont" style="font-size: 27px;">&#xeb45;</i>
        </div>
        <div v-if="type=='plane'" class="icon">
            <i class="iconfont" style="font-size: 35px;">&#xe608;</i>
        </div>
        <div class="id">
            {{info.key}}
        </div>
        <div class="location">
            <div class="start"><span style="font-weight:bold; color:var(--color-t); font-size: var(--font-size-big);">{{info.start.station_name}}</span> - {{info.start.country_name==info.end.country?info.start.city_name:info.start.country_name}}</div>
            <div class="mid" style="opacity: 0.5">至</div>
            <div class="end"><span style="font-weight:bold; color:var(--color-t); font-size: var(--font-size-big);">{{info.end.station_name}}</span> -  {{info.end.country_name==info.end.country?info.end.city_name:info.end.country_name}}</div>
        </div>
        <div class="risk">
            <div v-if="risk=='safe'" class="rt safe">无风险</div>
            <div v-if="risk=='low'" class="rt low_risk">低风险</div>
            <div v-if="risk=='mid'" class="rt mid_risk">中风险</div>
            <div v-if="risk=='high'" class="rt high_risk">高风险</div>
            <div v-if="risk=='cancel'" class="rt cancel">停 运</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TravelSearchItem',

    mounted() {
        switch(Math.max(this.info.start.risk, this.info.end.risk)) {
            case -1:
                this.risk = 'cancel';
                break;
            case 0:
                this.risk = 'safe';
                break;
            case 1:
            case 2:
                this.risk = 'low';
                break;
            case 3:
                this.risk = 'mid';
                break;
            case 4:
            case 5:
                this.risk = 'high';
                break;
        }
    },

    destroyed() {

    },

    props: {
        type: {
            type: String,
            default: 'train'    // train, plane
        },
        info: {
            type: Object,
            default: {}
        }
    },

    data() {
        return {
            risk: ''
        }
    },

    watch: {

    },

    methods: {

    }
}
</script>

<style scoped>
    @import url("./../assets/risk_tag.css");

    :local{
        --height: 65px;
    }

    .travel_search_item{
        width: 100%;
        height: var(--height);
        /* border: solid 1px #000; */
        position: relative;
        background-color: hsla(0, 0%, 100%, 75%);
        border-bottom: solid 1px #ddd;
        color: #565656;
    }

    .travel_search_item:hover{
        background-color: hsla(0, 0%, 100%, 100%);
        cursor: pointer;
    }

    .travel_search_item > div{
        float: left;
    }

    .icon{
        margin: 0 25px 0 56px;
        width: 50px;
        text-align: center;
        height: var(--height);
        line-height: var(--height);
        float: left;
    }

    .id{
        width: 230px;
        line-height: var(--height);
        /* letter-spacing: 1px; */
        font-weight: bold;
        font-size: var(--font-size-big);
        text-align: center;
    }

    .location .start, .location .end{
        width: 270px;
        line-height: var(--height);
        font-size: var(--font-size);
        text-align: center;
        float: left;
    }

    .location .mid{
        line-height: var(--height);
        font-size: var(--font-size);
        text-align: center;
        float: left;
    }

    .risk{
        width: 150px;
        line-height: var(--height);
        font-size: var(--font-size);
        text-align: center;
        float: left;
    }
</style>



// WEBPACK FOOTER //
// src/components/travel_search_item.vue