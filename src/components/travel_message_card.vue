<template>
    <div class="travel_message_card cur_poi" :class="inner_risk=='safe'?'safe':inner_risk+'inner_riskisk'" @click="full=!full">
        <h3 v-if="inner_risk==0"><i class="el-icon-warning"></i> {{title}}</h3>
        <h3 v-if="inner_risk=='mid_'"><i class="el-icon-warning"></i> {{title}}</h3>
        <h3 v-if="inner_risk=='low'"><i class="el-icon-warning"></i> {{title}}</h3>
        <h3 v-if="inner_risk=='safe'"><i class="el-icon-info"></i> {{title}}</h3>
        <h3 v-if="inner_risk=='stop'"><i class="el-icon-info"></i> 线路停运通知</h3>
        <p :class="full?'text_overflow_3':''">{{content}}</p>
    </div>
</template>

<script>
export default {
    name: 'TravelMessageCard',

    mounted() {
        var that = this;
        this.inner_risk = (function() {
            if (that.risk == -2) {
                return 'safe';
            }
            if (that.risk == -3) {
                return 'mid';
            }
            if (that.risk == -4) {
                return 'high';
            }
            if(that.risk >= 4) {
                that.title = '高风险警告';
                return 'high';
            }
            else if(that.risk >= 3) {
                that.title = '中风险警告';
                return 'mid';
            }
            else if(that.risk >= 1) {
                that.title = '低风险警告';
                return 'low';
            }
            else if(that.risk == -1) {
                return 'stop';
            }
            else {
                that.title = '本条线路安全';
                return 'safe';
            }
        })();
        // console.log(this.inner_risk);
    },

    destroyed() {

    },

    props: {
        risk: {
            type: Number,
            default: 0
        },
        content: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        }
    },

    data() {
        return {
            inner_risk: '',
            full: true,
        }
    },

    watch: {

    },

    methods: {

    }
}
</script>

<style scoped>
    .travel_message_card{
        padding: 9px 20px;
        border: solid 2px;
        border-left: solid 15px;
    }

    .travel_message_card.highinner_riskisk{
        background-color: hsla(3, 49%, 99%, 78%);
        border-color: var(--color-high-risk);
    }

    .travel_message_card.midinner_riskisk{
        background-color: hsla(27, 65%, 99%, 78%);
        border-color: var(--color-mid-risk);
    }

    .travel_message_card.lowinner_riskisk{
        background-color: hsla(47, 78%, 99%, 78%);
        border-color: var(--color-safe);
    }

    .travel_message_card.safe{
        background-color: hsla(122, 36%, 99%, 78%);
        border-color: var(--color-safe);
    }

    .travel_message_card.stopinner_riskisk{
        background-color: rgba(252, 252, 252, 0.78);
        border-color: var(--color-died);
    }

    .travel_message_card h3{
        margin: 0;
        font-size: 18px;
        line-height: 30px;
        letter-spacing: 1px;
    }

    .travel_message_card h3 i{
        font-size: 20px;
        vertical-align: middle;
    }

    .travel_message_card.highinner_riskisk h3, .travel_message_card.highinner_riskisk p{
        color: var(--color-high-risk);
    }

    .travel_message_card.midinner_riskisk h3, .travel_message_card.midinner_riskisk p{
        color: var(--color-mid-risk);
    }

    .travel_message_card.lowinner_riskisk h3, .travel_message_card.lowinner_riskisk p{
        color: var(--color-safe);
    }

    .travel_message_card.safe h3, .travel_message_card.safe p{
        color: var(--color-safe);
    }

    .travel_message_card.stopinner_riskisk h3, .travel_message_card.stopinner_riskisk p{
        color: var(--color-died);
    }

    .travel_message_card p{
        margin: 5px 0;
        padding: 0 10px;
        line-height: 23px;
    }
</style>



// WEBPACK FOOTER //
// src/components/travel_message_card.vue