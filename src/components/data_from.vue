<template>
    <div class="data_from">
        <div target="_blank" @click="vis = true">数据来源信息</div>
        <el-dialog
            title="数据来源信息"
            :visible.sync="vis"
            width="650px"
            append-to-body>
            <el-form ref="form" :model="form" label-width="150px">
                <el-form-item v-for="(item, index) in list" :key="index" :label="item.title">
                    <el-input v-model="item.content"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="vis = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'DataFrom',

    mounted() {
        this.list = [...this.info];
    },

    destroyed() {
        
    },

    props: {
        info: {
            type: Array,
            default: []
        }
    },

    data() {
        return {
            vis: false,
            form: {},
            list: []
        }
    },

    watch: {

    },

    methods: {

    }
}
</script>

<style scoped>
    .data_from {
        position: fixed;
        right: 15px;
        bottom: 10px;
        z-index: 10;
        cursor: pointer;
    }

    .data_from div, .data_from div:hover {
        color: #aaa;
        text-decoration: none;
    }
</style>



// WEBPACK FOOTER //
// src/components/data_from.vue