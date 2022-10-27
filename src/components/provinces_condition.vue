<template>
    <div class="provinces_condition">
        <h3>今日各省情况</h3>
        <el-divider></el-divider>
        <div class="list_item shadow">
            <div class="item_name">&nbsp;</div>
            <div class="item_data cur_poi" style="color: var(--color-high-risk)" @click="sort_data('confirmed')">确诊 <i v-if="sort_k=='confirmed'" class="el-icon-caret-bottom"></i></div>
            <div class="item_data cur_poi" style="color: var(--color-safe)" @click="sort_data('cured')">治愈 <i v-if="sort_k=='cured'" class="el-icon-caret-bottom"></i></div>
            <div class="item_data cur_poi" style="color: var(--color-died)" @click="sort_data('died')">死亡 <i v-if="sort_k=='died'" class="el-icon-caret-bottom"></i></div>
            <el-divider></el-divider>
        </div>
        <div class="inner_list" v-loading="loading">
            <div class="list_item" v-for="(item, index) in list" :key="index">
                <div class="item_name">{{item.name}}</div>
                <div class="item_data" style="color: var(--color-high-risk)">{{item.total.confirmed}} (+ {{item.new.confirmed}})</div>
                <div class="item_data" style="color: var(--color-safe)">{{item.total.cured}} (+ {{item.new.cured}})</div>
                <div class="item_data" style="color: var(--color-died)">{{item.total.died}} (+ {{item.new.died}})</div>
                <div class="clear_both"></div>
                <el-divider></el-divider>
            </div>
            <div style="width: 100%; height: 50px;"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProvincesCondition',

    mounted() {

    },

    destroyed() {

    },

    props: {

    },

    data() {
        return {
            list: [],
            sort_k: '',
            loading: true
        }
    },

    watch: {

    },

    methods: {
        init(data) {
            this.list = [];
            for(let i=0; i<data.length; i++) {
                this.list.push({name: data[i].name, new: {
                    confirmed: data[i].new.confirmed,
                    cured: data[i].new.cured,
                    died: data[i].new.died
                }, total: {
                    confirmed: data[i].total.confirmed,
                    cured: data[i].total.cured,
                    died: data[i].total.died
                }});
            }
            this.loading = false;
        },

        sort_data(key) {
            if(this.loading) {
                return;
            }
            this.sort_k = key;
            this.list.sort(function(a, b) {
                return b.total[key] - a.total[key];
            });
        }
    }
}
</script>

<style scoped>
    .provinces_condition {
        width: 100%;
        height: 100%;
        position: relative;
        background-color: #fafafa;
    }

    h3 {
        text-align: center;
        color: #565656;
    }

    .el-divider {
        margin: 0;
    }

    .inner_list {
        width: 100%;
        height: calc(100% - 128px);
        /* border: solid 1px #000; */
        font-size: var(--font-size-big);
        overflow: overlay;
    }

    .list_item {
        width: 100%;
        height: 50px;
        line-height: 50px;
        /* border: solid 1px #000; */
        font-weight: bold;
    }

    .list_item > div {
        float: left;
    }

    .list_item .item_name {
        margin: 0 15px;
        width: 3em;
        text-align: center;
        font-size: var(--font-size-big);
        color: #565656;
    }

    .list_item .item_data {
        width: 118px;
        /* border: solid 1px #000; */
        text-align: center;
        font-size: var(--font-size);
    }
</style>



// WEBPACK FOOTER //
// src/components/provinces_condition.vue