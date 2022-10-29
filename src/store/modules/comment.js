const state = {
    commentList: []
}

const mutations = {
    //存储所有评论消息
    saveCommentList(state,{commentList}){
        state.commentList=commentList
    },
}

const actions = {
    //同步获取最近浏览
    async getCommentList({commit}, questionid){
        const commentList=await this.$axios.post('http://10.251.254.107:8081/getcomments', questionid).then( res => {
            console.log("action:"+questionid)
            if(res.data.data === null){
                return null;
            }
            else {
                return res.data.data;
            }
        })
        commit('saveCommentList', {commentList})
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
}

