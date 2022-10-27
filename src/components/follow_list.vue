<template>
    <div class="rank_table">
        <h3 class="title">订阅列表</h3>
        <el-divider></el-divider>
        <div class="table_items">
            <div class="cur_poi" v-for="(item,index) in follow_list" :key="index">
                <el-divider v-if="index>0"></el-divider>
                <div style="display: flex">
                    <div style="padding:0 10px">{{ item.country }}</div>
                    <div style="padding:0 10px">{{ item.province }}</div>
                    <div style="padding:0 10px">{{ item.city }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'FollowList',

    mounted() {
        this.init();
    },

    destroyed() {

    },

    props: {
        follow_list: {
            type: Array,
            default: []
        }
    },

    data() {
        return {
        }
    },

    watch: {},

    methods: {
        init() {
            this.apply_for_info();
        },
        apply_for_info() {
        }
    }
}
</script>

<style scoped>
.rank_table {
    /* border: 1px solid #000; */
    height: calc(100% - 330px);
    display: flex;
    flex-direction: column;
    padding: 0;
}

.title {
    margin: 0;
    padding: 10px;
    font-size: var(--font-size-big);
    font-weight: bold;
    /* border-bottom: 1px solid gray; */
}

.table_items {
    height: calc(100% - 50px);
    overflow-y: scroll;
    padding-bottom: 0;
}

.el-divider {
    margin: 0;
}

.table_items > div {
    height: 50px;
    line-height: 50px;
    transition: all 0.1s linear;
}

.table_items > div:hover {
    background-color: #eee;
}

.table_items::-webkit-scrollbar {
    width: 6px;
}

.table_items::-webkit-scrollbar-thumb {
    background-color: hsla(0, 0%, 78%, 0.35);
}

.table_items:hover::-webkit-scrollbar-thumb {
    background-color: hsla(0, 0%, 78%, 0.69);
}

</style>



// WEBPACK FOOTER //
// src/components/follow_list.vue