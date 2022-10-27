<template>
    <div class="forum_index">
        <div class="left"></div>
        <div class="mid">
            <div style="padding-top: 30px;">
                <el-image :src="require('@/assets/forum.png')" fit="contain"></el-image>
                <div class="mid_head_tool">
                    <h1>疫情问答平台 <el-button style="margin-left: 30px;" type="success" @click="add_question">我要提问</el-button></h1>
                    <div style="height: 10px;"></div>
                    <div>
                        <el-button type="primary" :plain="filter!='all'" round @click="filter='all'">全部问题</el-button>
                        <el-button type="warning" :plain="filter!='tips'" round @click="filter='tips'">小知识相关</el-button>
                        <el-button type="danger" :plain="filter!='fake'" round @click="filter='fake'">辟谣相关</el-button>
                        <el-button type="success" :plain="filter!='expert'" round @click="filter='expert'">专家解答</el-button>
                    </div>
                </div>
                <div class="clear_both"></div>
            </div>
            <el-divider></el-divider>
            <div class="items">
                <span v-for="item in list" :key="item.qid">
                    <ForumQuestionItem :info="item" />
                    <el-divider></el-divider>
                </span>
            </div>
            <span v-if="!loading&&list.length == 0">
                <el-empty style="margin:50px auto 0; width: 230px" description=" "></el-empty>
                <div class="not_found">找不到内容</div>
            </span>
            <div v-if="list.length" style="text-align: center;">
                <el-pagination
                    background
                    @current-change="page_change"
                    :current-page.sync="page"
                    :page-size="each"
                    layout="prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
            <div style="height: 30px;"></div>
            <el-dialog title="发布新问题" :visible.sync="vis">
                <el-form label-width="78px">
                    <el-form-item label="标题">
                        <el-input v-model="form.title" placeholder="请输入问题标题"></el-input>
                    </el-form-item>
                    <el-form-item label="分类">
                        <el-tag
                            type="warning"
                            :effect="form.type.tips?'dark':'light'"
                            @click="form.type.tips = !form.type.tips">
                            小知识相关
                        </el-tag>
                        <el-tag
                            type="danger"
                            :effect="form.type.fake?'dark':'light'"
                            @click="form.type.fake = !form.type.fake">
                            辟谣相关
                        </el-tag>
                    </el-form-item>
                    <el-form-item label="内容">
                        <el-input
                            :autosize="{ minRows: 6, maxRows: 6}"
                            type="textarea"
                            v-model="form.content"
                            autocomplete="off"
                            placeholder="请输入问题的详细内容">
                        </el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer" style="height: 42px;">
                    <el-button :disabled="d_loading" @click="vis = false">取 消</el-button>
                    <el-button type="primary" :disabled="d_loading" @click="confirm_question">
                        <span v-show="!d_loading">确 定</span>
                        <i v-show="d_loading" class="el-icon-loading"></i>
                    </el-button>
                </div>
            </el-dialog>
        </div>
        <div class="right"></div>
    </div>
</template>

<script>
import ForumQuestionItem from '@/components/forum_question_item';

export default {
    name: 'ForumIndex',

    components: {
        ForumQuestionItem
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
            filter: 'all',
            list: [],
            page: 1,
            each: 10,
            total: 0,
            form: {
                title: '',
                type: {
                    tips: false,
                    fake: false
                },
                content: ''
            },
            vis: false,
            d_loading: false,
            loading: true
        }
    },

    watch: {
        filter(newValue) {
            this.apply_for_info();
        }
    },

    methods: {
        init() {
            this.apply_for_info();
        },

        apply_for_info() {
            this.loading = true;
            this.ajax.get('/forum/list', {
                page: this.page,
                each: this.each,
                filter: this.filter
            }, this, {
                success(res) {
                    this.total = res.total;
                    this.list = res.list;
                    this.loading = false;
                }
            });
        },

        add_question() {
            this.form.title = '';
            this.form.content = '';
            this.form.type.tips = false;
            this.form.type.fake = false;
            this.vis = true;
        },

        confirm_question() {
            if(this.form.title.trim().length == 0) {
                this.alert_msg.warning('标题不得为空');
                return;
            }
            if(this.form.content.trim().length == 0) {
                this.alert_msg.warning('内容不得为空');
                return;
            }
            this.d_loading = true;
            let tags = [];
            if(this.form.type.tips) {
                tags.push('tips');
            }
            if(this.form.type.fake) {
                tags.push('fake');
            }
            this.ajax.post('/forum/publish', {
                title: this.form.title,
                content: this.form.content,
                tags: tags
            }, this, {
                success(res) {
                    this.alert_msg.success('发布问题成功');
                    this.page = 1;
                    this.apply_for_info();
                    this.d_loading = false;
                    this.vis = false;
                }
            });
        },

        page_change() {
            this.apply_for_info();
        }
    }
}
</script>

<style scoped>
    :local {
        --mid-width: 1200px;
    }

    .forum_index {
        position: absolute;
        top: var(--nav-height);
        width: 100%;
        min-height: calc(100% - var(--nav-height));
        background-color: #fafafa;
    }

    .forum_index .left, .forum_index .right {
        width: calc((100% - var(--mid-width)) / 2);
        /* border: solid 1px #000; */
        position: fixed;
        top: 0;
        height: 100%;
    }

    .forum_index .left {
        left: 0;
    }

    .forum_index .right {
        right: 0;
    }

    .forum_index .mid {
        width: var(--mid-width);
        height: fit-content;
        min-height: 100%;
        position: relative;
        top: 0;
        left: calc(50% - (var(--mid-width) / 2));
        background-color: #fff;
        /* border: solid 1px #000; */
    }

    .forum_index .mid .el-image {
        margin-left: 100px;
        width: 300px;
        height: 180px;
        float: left;
    }

    .forum_index .mid .el-button {
        vertical-align: 7px;
        font-size: 15px;
    }

    .mid_head_tool {
        margin-left: 50px;
        float: left;
    }

    .mid_head_tool h1 {
        color: #565656;
        font-size: 36px;
    }

    .el-divider {
        margin-bottom: 0;
    }

    .items .el-divider {
        margin: 0;
    }

    .forum_index .el-pagination {
        margin: 25px 0;
    }

    .forum_index .right > div {
        margin: 100px 30px;
    }

    .forum_index>>>.el-dialog {
        width: 750px;
    }

    .forum_index .el-dialog *, .forum_index .el-dialog>>>.el-form-item__label {
        font-size: var(--font-size);
    }

    .forum_index .el-dialog .el-tag {
        margin-right: 10px;
        cursor: pointer;
    }

    .el-dialog .el-button {
        width: 83px;
        height: 42px;
        font-size: var(--font-size);
    }
</style>



// WEBPACK FOOTER //
// src/pages/forum_index.vue