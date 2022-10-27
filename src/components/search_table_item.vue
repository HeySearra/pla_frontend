<template>
    <div class="search_table_item" :class="style">
        <transition name="el-zoom-in-top">
            <div v-show="show">
                <div class="item_head">
                    <span>{{ title }} - {{ area }}</span>
                    <el-switch
                        v-model="swc"
                        active-color="#13ce66"
                        inactive-color="#dedede">
                    </el-switch>
                </div>
                <div class="item_table">
                    <el-table
                        :data="tableData"
                        height="230px"
                        border
                        style="width: 100%"
                        size="mini"
                        stripe
                        lazy>
                        <el-table-column
                            prop="date"
                            label="日期">
                        </el-table-column>
                        <el-table-column
                            prop="value"
                            label="人数">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'SearchTableItem',

    mounted() {
        // this.show = true;
    },

    destroyed() {

    },

    props: {},

    data() {
        return {
            swc: false,
            tableData: [],
            area: '',
            title: '',
            style: '',
            info: {},
            show: false,
        }
    },

    watch: {
        swc() {
            if (this.flag) {
                return;
            }
            if (this.swc) {
                this.$emit('add', this.info);
            } else {
                this.$emit('remove', this.info);
            }
        }
    },

    methods: {
        init(info) {
            this.info = info;
            switch (info.type) {
                case 'confirmed':
                    this.title = '确诊人数(累计)';
                    break;
                case 'confirmed_new':
                    this.title = '确诊人数(新增)';
                    break;
                case 'cured':
                    this.title = '治愈人数(累计)';
                    break;
                case 'cured_new':
                    this.title = '治愈人数(新增)';
                    break;
                case 'died':
                    this.title = '死亡人数(累计)';
                    break;
                case 'died_new':
                    this.title = '死亡人数(新增)';
                    break;
                case 'vaccinated':
                    this.title = '接种剂次';
                    break;
            }
            this.style = info.type;
            this.area = info.area;
            this.tableData = info.arr;
            this.show = true;
        },

        choose(value) {
            this.flag = true;
            this.swc = value;
            var that = this;
            setTimeout(function () {
                that.flag = false;
            }, 10);
        }
    }
}
</script>

<style scoped>
.search_table_item {
    position: relative;
    border: solid 1px hsla(0, 0%, 100%, 0);
    transition: border-color 0.3s linear;
}

.search_table_item.confirmed {
    border-color: var(--color-high-risk);
}

.search_table_item.cured {
    border-color: var(--color-safe);
}

.search_table_item.died {
    border-color: var(--color-died);
}

.item_head {
    height: 36px;
    line-height: 36px;
    color: #fff;
    position: relative;
    cursor: move;
}

.confirmed,.confirmed_new .item_head {
    background-color: var(--color-high-risk);
}

.cured,.cured_new .item_head {
    background-color: var(--color-safe);
}

.died,.died_new .item_head {
    background-color: var(--color-died);
}

.vaccinated .item_head {
    background-color: var(--color-life);
}

.item_head span {
    position: absolute;
    top: 0;
    left: 20px;
}

.item_head .el-switch {
    position: absolute;
    top: 7px;
    right: 20px;
}

.item_table {
    height: 230px;
}

.item_table >>> .el-table .cell {
    display: -webkit-box;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* 行数 */
    overflow: hidden;
}
</style>



// WEBPACK FOOTER //
// src/components/search_table_item.vue