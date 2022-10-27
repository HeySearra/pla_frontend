<template>
    <div class="forum_q">
        <div class="question">
            <h1>{{ question.title }}</h1>
            <el-tag
                v-if="tag.indexOf('tips')!=-1"
                class="rt"
                type="warning"
                effect="dark">
                小知识相关
            </el-tag>
            <el-tag
                v-if="tag.indexOf('fake')!=-1"
                class="rt"
                type="danger"
                effect="dark">
                辟谣相关
            </el-tag>
            <el-tag
                v-if="tag.indexOf('expert')!=-1"
                class="rt"
                type="success"
                effect="dark">
                专家答复
            </el-tag>
            <el-tag
                v-if="!solved"
                class="rt"
                type="danger"
                effect="plain">
                未解决
            </el-tag>
            <el-tag
                v-if="solved"
                class="rt"
                type="success"
                effect="plain">
                已解决
            </el-tag>
            <div style="margin-left: 85%; display: flex">
                <el-button type="primary" round @click="reply_que">回复</el-button>
                <el-button type="success" round @click="mark_as_solved" v-if="is_publisher() && !solved">标记为已解决</el-button>
                <el-button type="success" round @click="mark_as_solved" v-if="is_publisher() && solved">已解决</el-button>
            </div>
        </div>
        <el-divider></el-divider>
        <div class="reply_items">
            <span v-for="(item, index) in list" :key="item.rid">
                <ForumReplyItem :order="(page-1)*each+index+1"
                                :info="item"
                                :publisher_id="publisher_id"
                                @refresh="refresh"/>
                <el-divider></el-divider>
            </span>
        </div>


        <!--        分页-->
        <div style="height: 30px;"></div>
        <div style="text-align: center;">
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

        <!--        编辑与回复的对话框-->
        <!-- <el-dialog title="编辑问题" :visible.sync="edit_show">
            <el-form :model="form">
                <el-form-item label="标题" label-width="40px">
                    <el-input v-model="form.title" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="内容" label-width="40px">
                    <el-input :autosize="{ minRows: 2, maxRows: 6}" type="textarea" v-model="form.content"
                              autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="edit_cancle">取 消</el-button>
                <el-button type="primary" @click="edit_confirm">确 定</el-button>
            </div>
        </el-dialog> -->

        <el-dialog title="回复" :visible.sync="vis">
            <el-form :model="reply_form">
                <el-form-item>
                    <el-input :autosize="{ minRows: 6, maxRows: 6}" type="textarea" v-model="reply_form.content"
                              autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="height: 42px;">
                <el-button @click="vis = false" :disabled="d_loading">取 消</el-button>
                <el-button type="primary" @click="reply_confirm" :disabled="d_loading">
                    <span v-show="!d_loading">确 定</span>
                    <i v-show="d_loading" class="el-icon-loading"></i>
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import ForumReplyItem from "@/components/forum_reply_item";

export default {
    name: 'ForumQ',

    components: {
        ForumReplyItem,
    },
    mounted() {
        this.init();
    },

    destroyed() {

    },

    props: {},

    data() {
        return {
            qid: '',
            question: {
                title: "熬夜能把病毒给熬死是真的吗？",
                content: "我听一个专家跟我说熬夜能够治疗新冠病毒，自从我确诊之后就一直在熬夜，可是今天已经第三天了病情也没有好转的迹象。专家跟我说是我熬的夜还不够狠不够长，我今晚打算通宵，不知道能不能好一些。我今天感觉有一些呼吸困难，并且有些头晕，有没有病友分享一下经验？",
                tag: []
            },
            list: [],
            edit_show: false,
            form: {},
            reply_form: {
                rid: '',
                content: ''
            },
            reply_show: false,
            page: 1,
            each: 10,
            total: 0,
            d_loading: false,
            vis: false,
            publisher_id: '',
            solved: false,
        }
    },

    watch: {},

    methods: {
        init() {
            this.qid = this.$route.query.q;
            this.apply_for_info();
        },
        apply_for_info() {
            this.ajax.get('/forum/question', {
                qid: this.qid,
                page: this.page,
                each: this.each
            }, this, {
                success(res) {
                    this.total = res.total;
                    this.question.title = res.title;
                    this.tag = res.tag;
                    this.list = res.list;
                    this.publisher_id = res.uid;
                    this.solved = res.solved
                }
            });

            // this.ajax.post('/forum/publish', {
            //     title: "熬夜能把病毒给熬死是真的吗？",
            //     content: "我听一个专家跟我说熬夜能够治疗新冠病毒，自从我确诊之后就一直在熬夜，可是今天已经第三天了病情也没有好转的迹象。专家跟我说是我熬的夜还不够狠不够长，我今晚打算通宵，不知道能不能好一些。我今天感觉有一些呼吸困难，并且有些头晕，有没有病友分享一下经验？"

            // }, this, {
            //     success(res) {
            //         console.log(res)
            //     }
            // })
        },
        refresh() {
            this.apply_for_info();
        },
        mark_as_solved() {
            this.ajax.post('/forum/solve', {
                qid: this.qid,
            }, this, {
                success(res) {
                    if (res.status == 0) {
                        this.solved = res.solved;
                        // this.apply_for_info();
                    }
                },
                error() {
                }
            });
        },
        is_publisher() {
            if (this.login_manager.get().uid) {
                return this.login_manager.get().uid == this.publisher_id;
            } else {
                return false;
            }

        },
        edit_que() {
            this.form = {...this.question};
            this.edit_show = true;
        },
        edit_confirm() {
            this.question = {...this.form};
            this.edit_show = false;
        },
        edit_cancle() {
            this.edit_show = false;
        },
        delete_que() {
            this.alert_box.confirm('确认', '确定删除这则问题吗？', this, () => {

            }, () => {

            });
        },
        reply_confirm() {
            if(this.reply_form.content.trim().length == 0) {
                this.alert_msg.warning('回复内容不能够为空');
                return;
            }
            this.loading = true;
            this.ajax.post('/forum/reply', {
                qid: this.qid,
                rid: '',
                content: this.reply_form.content,
            }, this, {
                success(res) {
                    this.alert_msg.success('回复内容成功');
                    this.reply_show = false;
                    this.loading = false;
                    this.apply_for_info();
                    this.vis = false;
                },
                error() {
                    this.loading = false;
                }
            });
        },
        reply_cancle() {
            this.reply_show = false;
        },
        reply_que() {
            this.reply_form = {
                content: ''
            };
            this.d_loading = false;
            this.vis = true;
        },
        page_change() {
            this.apply_for_info();
        }
    }
}
</script>

<style scoped>
@import url('./../assets/risk_tag.css');

.forum_q {
    margin: 0 auto;
    padding: 30px 0;
    box-sizing: border-box;
    width: 1200px;
    /* border: 1px solid #000; */
}

.question {
    margin-bottom: 30px;
    padding: 0 30px;
}

.question h1 {
    color: #333;
}

.que_button {
    cursor: pointer;
    margin-right: 10px;
}

.que_button > i {
    font-size: 16px;
}

.el-divider {
    margin: 5px 0;
}

.el-tag {
    width: fit-content;
}
</style>



// WEBPACK FOOTER //
// src/pages/forum_q.vue