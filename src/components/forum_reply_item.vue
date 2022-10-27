<template>
    <div class="forum_reply_item">
        <div class="avatar">
            <el-avatar :src="info.user.avatar"></el-avatar>
            <el-tooltip v-if="info.user.is_expert" class="item" effect="dark" content="权威专家" placement="top">
                <i class="el-icon-success expert"></i>
            </el-tooltip>
            <span class="name">{{ reply.name }}</span>
            <el-tag
                type="info"
                effect="dark">
                {{info.floor==1?'楼主':('# '+info.floor)}}
            </el-tag>
            <el-tag
                v-if="is_top"
                type="success"
                effect="dark">
                置顶
            </el-tag>
        </div>
        <div class="main">
            <p class="detail"><span v-if="info.reply.name" class="reply_label">回复 {{info.reply.name}} #{{info.replied_floor}}</span>{{reply.detail}}</p>
            <p style="font-size: 14px;line-height: 1.5;color: #8590a6">发布于 2021-7-11</p>
        </div>
        <span class="options">
            <a class="que_button" @click="mark_as_top" v-if="can_top() && !is_top">
                <i class="el-icon-caret-top"></i>
                置顶
            </a>
            <a class="que_button" @click="unmark_as_top" v-if="can_top() && is_top">
                <i class="el-icon-caret-bottom"></i>
                取消置顶
            </a>
            <a class="que_button" @click="edit_que" v-if="can_top()">
                <i class="iconfont icon-bianji"></i>
                编辑
            </a>
            <a class="que_button" @click="delete_que" v-if="can_top()">
                <i class="iconfont icon-shanchu1"></i>
                删除
            </a>
            <a class="que_button" @click="reply_que" v-if="is_login()">
                <i class="iconfont icon-liaotian"></i>
                回复
            </a>
        </span>

        <el-dialog title="编辑回复" :visible.sync="edit_show">
            <el-form :model="edit_form" @submit.native.prevent>
                <el-form-item>
                    <el-input :autosize="{ minRows: 6, maxRows: 6}" type="textarea" v-model="edit_form.detail"
                              autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="edit_cancel" :disabled="loading">取 消</el-button>
                <el-button type="primary" @click="edit_confirm" :disabled="loading">
                    <span v-show="!loading">确 定</span>
                    <i v-show="loading" class="el-icon-loading"></i>
                </el-button>
            </div>
        </el-dialog>

        <el-dialog :title="`回复 ${reply.name}`" :visible.sync="reply_show">
            <el-form :model="reply_form" @submit.native.prevent>
                <el-form-item>
                    <el-input :autosize="{ minRows: 6, maxRows: 6}" type="textarea" v-model="reply_form.detail"
                              autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="height: 42px;">
                <el-button @click="reply_cancel" :disabled="loading">取 消</el-button>
                <el-button type="primary" @click="reply_confirm" :disabled="loading">
                    <span v-show="!loading">确 定</span>
                    <i v-show="loading" class="el-icon-loading"></i>
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'ForumReplyItem',

    mounted() {
        this.reply.name = this.info.user.name;
        this.replier_id = this.info.user.uid;
        this.reply.detail = this.info.content;
        this.rid = this.info.rid;
        this.is_top = this.info.is_top;
    },

    destroyed() {

    },

    props: {
        order: {
            type: Number,
            default: 0
        },
        info: {
            type: Object,
            default: {}
        },
        qid: {
            type: String,
            default: ''
        },
        publisher_id: {
            type: String,
            default: ''
        }
    },

    data() {
        return {
            reply: {
                name: '咸鱼的唯物主义者',
                detail: "草，是一种植物"
            },
            edit_show: false,
            edit_form: {
                detail: "我听一个专家跟我说熬夜能够治疗新冠病毒，自从我确诊之后就一直在熬夜，可是今天已经第三天了病情也没有好转的迹象。专家跟我说是我熬的夜还不够狠不够长，我今晚打算通宵，不知道能不能好一些。我今天感觉有一些呼吸困难，并且有些头晕，有没有病友分享一下经验？"
            },
            reply_form: {
                reply_id: '',
                detail: ''
            },
            reply_show: false,
            rid: '',
            loading: false,
            is_top: false,
            replier_id: '',
        }
    },

    watch: {},

    methods: {
        is_login() {
            if (this.login_manager.get().uid) {
                return true;
            } else {
                return false;
            }
        },
        is_publisher() {
            if (this.login_manager.get().uid) {
                return this.login_manager.get().uid == this.replier_id;
            } else {
                return false;
            }
        },
        can_top() {
            if (this.login_manager.get().uid) {
                if (this.login_manager.get().identity == 2) {
                    return true;
                }
            } else {
                return false;
            }
            return this.replier_id == this.publisher_id;
        },
        mark_as_top() {
            this.alert_box.confirm('置顶这条回复', '确定置顶这条回复吗？', this, () => {
                this.ajax.post('/forum/top', {
                    rid: this.rid,
                }, this, {
                    success(res) {
                        this.is_top = res.is_top;
                        var that = this;
                        setTimeout(function() {
                            that.$emit('refresh');
                        }, 100);
                    },
                    error() {

                    }
                });
            }, () => {

            });

        },
        unmark_as_top() {
            this.alert_box.confirm('取消置顶这条回复', '确定取消置顶这条回复吗？', this, () => {
                this.ajax.post('/forum/top', {
                    rid: this.rid,
                }, this, {
                    success(res) {
                        this.is_top = res.is_top;
                        var that = this;
                        setTimeout(function() {
                            that.$emit('refresh');
                        }, 100);
                    },
                    error() {

                    }
                });
            }, () => {

            });

        },
        edit_que() {
            this.edit_form = {...this.reply};
            this.edit_show = true;
        },
        edit_confirm() {
            if(this.edit_form.detail.trim().length == 0) {
                this.alert_msg.warning('内容不能够为空');
                return;
            }
            this.loading = true;
            this.ajax.post('/forum/edit', {
                qid: this.qid,
                rid: this.rid,
                content: this.edit_form.detail,
            }, this, {
                success(res) {
                    this.reply = {...this.edit_form};
                    this.alert_msg.success('成功修改内容');
                    this.edit_show = false;
                    this.loading = false;
                },
                error() {
                    this.loading = false;
                }
            });
        },
        edit_cancel() {
            this.edit_show = false;
        },
        delete_que() {
            this.alert_box.confirm('删除我的回复', '确定删除这条回复吗？删除后将不能够恢复。', this, () => {
                this.ajax.post('/forum/delete', {
                    qid: this.qid,
                    rid: this.rid,
                }, this, {
                    success(res) {
                        this.alert_msg.success('删除成功');
                        var that = this;
                        setTimeout(function() {
                            that.$emit('refresh');
                        }, 100);
                    },
                    error() {
                        this.alert_msg.success('删除失败');
                    }
                });
            }, () => {

            });
        },
        reply_confirm() {
            if(this.reply_form.detail.trim().length == 0) {
                this.alert_msg.warning('回复内容不能够为空');
                return;
            }
            this.loading = true;
            this.ajax.post('/forum/reply', {
                qid: this.qid,
                rid: this.rid,
                content: this.reply_form.detail,
            }, this, {
                success(res) {
                    this.alert_msg.success('回复成功');
                    var that = this;
                    setTimeout(function() {
                        that.$emit('refresh');
                    }, 100);
                    this.reply_show = false;
                    this.loading = false;
                },
                error() {
                    this.alert_msg.success('回复失败');
                    this.loading = false;
                }
            });
        },
        reply_cancel() {
            this.reply_show = false;
        },
        reply_que() {
            this.reply_form = {
                reply_id: '',
                detail: ''
            };
            this.reply_show = true;
        }
    }
}
</script>

<style scoped>
    .forum_reply_item {
        padding: 15px 50px 5px 35px;
        position: relative;
        /* border: solid 1px #000; */
        /* background-color: #fff; */
    }

    .avatar {
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .avatar > .el-avatar {
        margin-right: 10px;
    }

    .avatar .name {
        font-size: var(--font-size);
        font-weight: bold;
    }

    .avatar .el-tag {
        margin: 0 3px 0 10px;
        padding: 0 7px;
        line-height: 30px;
        height: 30px;
        font-size: 15px;
    }

    .forum_reply_item .main .detail {
        line-height: 30px;
        white-space: pre-line;
        word-break: break-all;
        color: #565656;
    }

    .que_button {
        cursor: pointer;
        margin-top: 10px;
        margin-right: 10px;
    }

    .forum_reply_item .options {
        position: absolute;
        right: 10px;
        bottom: 10px;
        color: #565656;
        opacity: 0;
        transition: 0.1s all linear;
    }

    .forum_reply_item:hover .options {
        opacity: 1;
    }

    .forum_reply_item .reply_label {
        margin-right: 10px;
        padding: 0 10px;
        border-radius: 5px;
        background-color: #eee;
        display: inline-block;
    }

    .expert {
        position: absolute;
        top: 10px;
        left: 60px;
        font-size: 21px;
        z-index: 1;
        background-color: white;
        border-radius: 50%;
        color: var(--color-life);
    }

    .el-dialog .el-button {
        width: 83px;
        height: 42px;
        font-size: var(--font-size);
    }

    .el-dialog .el-textarea {
        font-size: var(--font-size);
    }
</style>



// WEBPACK FOOTER //
// src/components/forum_reply_item.vue