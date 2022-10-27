<template>
    <div class="forum_question_item">
        <div class="avatar">
            <el-avatar :src="info.user.avatar"></el-avatar>
            <div><span style="font-weight: bold">{{info.user.name}}</span><span class="info">发布于 {{info.published_time}}</span></div>
        </div>
        <div class="main">
            <h3>
                <el-tag
                    class="rt"
                    v-if="info.solved"
                    type="success"
                    effect="dark">
                    已解决
                </el-tag>
                <el-tag
                    class="rt"
                    v-if="!info.solved"
                    type="danger"
                    effect="dark">
                    未解决
                </el-tag>
                <router-link :to="{name: 'forum_q', query: {q: info.qid}}">{{info.title}}</router-link>
            </h3>
            <p class="text_overflow_3">{{info.preview}}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ForumQuestionItem',

    mounted() {

    },

    destroyed() {

    },

    props: {
        info: {
            type: Object,
            default: {}
        }
    },

    data() {
        return {

        }
    },

    watch: {

    },

    methods: {

    }
}
</script>

<style scoped>
    @import url('./../assets/risk_tag.css');

    :local {
        --left-width: 75px;
    }

    .forum_question_item {
        padding: 10px 50px 25px 35px;
        position: relative;
        height: fit-content;
        /* border: solid 1px #000; */
        /* background-color: #fff; */
    }

    .forum_question_item .main h3 a {
        color: #555;
        text-decoration: none;
    }

    .forum_question_item:hover .main h3 a {
        color: var(--color-t);
    }

    .forum_question_item .avatar {
        width: 900px;
        height: fit-content;
        position: absolute;
        bottom: 18px;
        left: 25px;
    }

    .forum_question_item .avatar > * {
        float: left;
    }

    .forum_question_item .avatar .el-avatar {
        width: 30px;
        height: 30px;
    }

    .forum_question_item .avatar > div {
        margin-left: 10px;
        line-height: 30px;
        font-size: var(--font-size);
        color: #777;
    }

    .forum_question_item .info {
        margin-left: 30px;
    }

    .forum_question_item .main {
        width: calc(100%);
        height: fill;
        position: relative;
    }

    .forum_question_item .main h3 {
        margin: 10px 0;
        color: #333;
    }

    .forum_question_item .main p {
        margin: 20px 0 50px;
        padding-left: 10px;
        line-height: 30px;
        font-size: var(--font-size);
        color: #565656;
    }

    .forum_question_item .el-tag {
        margin-right: 5px;
        width: fit-content;
        vertical-align: 1px;
    }
</style>



// WEBPACK FOOTER //
// src/components/forum_question_item.vue