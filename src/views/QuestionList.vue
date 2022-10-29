<template>

  <div>
    <!-- <v-banner
        elevation="3"
        icon="mdi-arrow-up-bold-box-outline"
        style="width: 95%;margin: 0 auto;border-radius: 6px"
    >疫情防控知识栏
      <template >
        <v-btn
            depressed rounded
            color="primary"
            style="margin-left:700px; font-size:13px;"
            @click.stop="dialog = true"
        >
          点我提问
          <v-icon
              right
              dark>
            mdi-message-text
          </v-icon>
        </v-btn>

        <v-btn
            depressed rounded
            color="cyan"
            style="left:20px;font-size:13px;"
        >
          问题列表
          <v-icon
              right dark>
            mdi-linkedin
          </v-icon>

        </v-btn>

      </template>
    </v-banner> -->

    <v-tabs
          fixed-tabs
          background-color="indigo"
          dark
          style="width: 90%; margin-left: 5%"
          v-model="value"
      >
        <v-tab
          @click="toKnowledge()">
          预防知识
        </v-tab>
        <v-tab>
          问题列表
        </v-tab>
      </v-tabs>

      <!-- <v-btn
      class="mx-2"
      fab
      dark
      small
      color="cyan"
      style="left:90%; margin-top:15px"
    >
      <v-icon dark>
        mdi-pencil
      </v-icon>
    </v-btn> -->

    <div
    style = "margin-top: 10px;">
      <!-- <span 
      class="font-weight-black"
      style="margin-left:8%;margin-top:50px;font-size:20px">已有问题</span> -->
      <v-btn
              class="ma-2"
              outlined
              color="indigo"
              style="left:85%;"
              @click.stop="dialog = true"
              
            >
              点击提问
            </v-btn>
  </div>

    <v-dialog
        transition="dialog-bottom-transition"
        max-width="600"
        v-model="dialog"
    >
      <v-card>
        <v-toolbar
            color="primary"
            dark
        >在这里填写问题</v-toolbar>
        <v-card-text>
          <div>
            <br>
            <v-text-field
                label="问题标题"
                :rules="rules"
                hide-details="auto"
                v-model="Question_title"
            >
              {{Question_title}}
            </v-text-field>
            <br>
            <v-text-field label="描述一下您的问题"
                          v-model="Question_content">
              {{Question_content}}
            </v-text-field>
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
              text
              color="blue"
              @click="postQuestion(Question_title, Question_content)"
          >提交</v-btn>
<!--          <v-btn-->
<!--              text-->
<!--              @click="dialog= false"-->
<!--          >关闭</v-btn>-->
          <v-btn
              text
              @click="dialog = false"
              style="color:#000;"
          >关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

      <v-card
          style="margin-top:20px;width: 80%;border-radius: 6px"
          class="mx-auto"
          max-width="1000"
          v-for="(item) in questions"
          :key="item.id"
          outlined
          tile
      >
        <v-card-title style="font-size: 1.1em">
          {{item.title}}
        </v-card-title>

        <v-card-subtitle>
          {{item.content}}
        </v-card-subtitle>

        <v-card-actions style="padding-left: 82%">
          <v-btn
              color="#82B1FF"
              text

              @click="showAns(item.id)"
          >
            查看评论 ({{item.commentSize}})
            <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-btn>

        <v-dialog
        transition="dialog-top-transition"
        max-width="600"
        v-show='dialog1'
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="#1565C0"
            v-bind="attrs"
            v-on="on"
            style="margin-left:10px"

              fab
              x-small
              dark
          ><v-icon>mdi-pencil</v-icon></v-btn>
        </template>
        <template v-slot:default="dialog1">
          <v-card>
            <v-toolbar
              color="primary"
              dark
            >在这里发表回复</v-toolbar>
            <v-card-text>
              <v-text-field
                label="发表您的评论吧～"
                :rules="rules"
                hide-details="auto"
                v-model="message1"
                >{{message1}}</v-text-field>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                text
                color="primary"
                @click.stop="submitAns1(item.id)"
                @click="dialog1.value = false;"
              >提交</v-btn>
              <v-btn
                text
                color="primary"
                @click="dialog1.value = false"
              >关闭</v-btn>

            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>




          <v-spacer></v-spacer>

        </v-card-actions>

        <v-expand-transition>
          <div v-show="ifshowAns[item.id]">
            <v-divider></v-divider>

            <v-list three-line>
              <template v-for="(item1) in items[item.id]">
                <!-- <v-subheader
                    v-if="item1.username"
                    :key="item1.id"
                    v-text="item1.username"
                >

                </v-subheader> -->


                <v-list-item
                    v-if="item1.username"
                    :key="item1.id"
                >
                <v-list-item-avatar>
                    <v-img :src="item1.avatar"></v-img>
                  </v-list-item-avatar>


                  <v-list-item-content>
                    <v-badge
                      v-show="item1.isauthority == 1"
                      color="red"
                      content="置顶"
                      overlap=""
                      offset-x="965px"
                      offset-y="17px"
                      style="left:0px"
                    >
                      <v-list-item-title v-text="item1.username"
                        :style="item1.isauthority == 1 ? `fontWeight:bold;color:#B71C1C`:`fontWeight:normal`"
                      >
                      </v-list-item-title>
                    </v-badge>

                    <v-list-item-title v-text="item1.username" v-show="item1.isauthority == 0"
                        :style="item1.isauthority == 1 ? `fontWeight:bold;color:#B71C1C`:`fontWeight:normal`"
                      >
                      </v-list-item-title>
                    

                    <v-list-item-subtitle v-html="item1.content"></v-list-item-subtitle>
                    <v-divider style="margin-top:20px"></v-divider>
                  </v-list-item-content>

                  <v-list-item-btn >
                    <v-btn color="error" small style="bottom:10px" v-if="item1.userid == Userid" @click="DeleteAns(item1.userid, item1.id,item1.questionid)">
                      删除评论
                    </v-btn>
                  </v-list-item-btn>

                </v-list-item>
              </template>
            </v-list>
          </div>
        </v-expand-transition>
      </v-card>

  </div>


</template>


<script src="vuejs-2.5.16.js"></script>

<script>
import {mapState,mapActions, mapMutations} from 'vuex'
import { log } from 'util';
import { userInfo } from 'os';
window.addEventListener('userInfo', ()=> {
        this.newVal = sessionStorage.getItem('userInfo');
        var data=JSON.parse(this.newVal)
         console.log(data)
})
export default {
  data() {
    return {
      value:1,
      Question_title: "",
      Question_content: "",
      temp: "",
      vv: true,
      flag: 0,
      dialog: false,
      dialog1: '',
      ifuser: [
        {
          data: ''
        }
      ],
      dialog2: [
        {
          data: ''
        }
      ],
      show: false,
      items: [],
      questions: [
        {}
      ],
      questionsNum: '',
      ifshowAns: [
        {
          data: ""
        }
      ],
      message1: '',
      item1: {
        id: '',
        questionid: '',
        content: '',
        time: '',
        avatar: '',
        username: '',
        isauthority: '',
        userid: ''
      },
      Userid: '',
    }
  },

  created() {
    this.$vuetify.theme.dark = false
    console.log(this.dialog)
    this.setAns();
    this.getQuestions();
    this.getUser();
    console.log(sessionStorage.getItem('id'))
  },


  computed: {
    ...mapState(['commentList'])
  },
  mounted() {
    // this.timer = setInterval(this.showFlag, 1000);
    if (this.item1.questionid) {
      this.getCommentList(this.item1.questionid)
    }
    if (sessionStorage.getItem("userInfo") ) {
        this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("userInfo"))))
      }
    this.getUser();
  },
  watch:{
    
  },
  

  methods: {
    ...mapActions(['getCommentList']),

    toKnowledge(){
      this.$router.push({
          path:"/knowledge",
        })
    },
    getUser() {
      var jsondata = sessionStorage.getItem('userInfo')
      this.Userid = JSON.parse(jsondata).id
      console.log(jsondata)
      console.log(this.Userid)
    },

    async postQuestion(title, content) {
      this.dialog = false;

      var jsondata = {title: title, content: content}
      if (content === "" || title === "") {
        this.$message({
          type: 'warning',
          message: "输入不能为空",
        })
        this.Question_title = "";
        this.Question_content = "";
      } else {
        this.$axios.post('http://10.251.254.107:8081/ask', jsondata).then(res => {
          console.log(res);
          this.title = "";
          this.content = "";
          if (res.data.code === 403) {
            this.$message({
              type: 'warning',
              message: "请先登录！",
            })
          } else {
            this.$message({
              type: 'success',
              message: "提交成功！"
            });
            // setTimeout("location.reload()", 500)
            this.$axios.get('http://10.251.254.107:8081/getquestions').then(res=>{
              this.questions = res.data.data;
              console.log(this.questions);
              this.questionsNum = this.questions.length;
              this.$forceUpdate()
            })
          }
          })
          this.Question_title = "";
        this.Question_content = "";
        }
      },
      // await this.setAns();
      //
    
    async setAns() {

      await this.$axios.get('http://10.251.254.107:8081/getquestions').then(res => {
        var num;
        for (num = 1; num <= res.data.data.length; num++) {
          // console.log(num+' ' +res.data.data[num-1].id)
          var setfalse = new Boolean();
          setfalse = false;
          this.ifshowAns.splice(res.data.data[num - 1].id, 0, setfalse);
          this.dialog2.splice(res.data.data[num - 1].id, 0, setfalse);

          // console.log(this.dialog2)
          // console.log(this.ifshowAns)
        }
      })
    },
    setDialog2(id) {
      this.flag = 1;
      console.log(this.flag)
      this.temp = id;
      this.dialog2[id] = true;
      console.log(id)
      console.log(this.dialog2[id])
    },
    async getQuestions() {
      await this.$axios.get('http://10.251.254.107:8081/getquestions').then(res => {
        // console.log(res);
        this.questions = res.data.data;
        console.log(this.questions);
        this.questionsNum = this.questions.length;
      })
    },
    async showAns(id) {
      var user = sessionStorage.getItem("userInfo");
      console.log(user)
      await this.$axios.post('http://10.251.254.107:8081/getcomments', id).then(res => {
        console.log(res)
        console.log(this.ifshowAns[id])
        if (res.data.data === null && this.ifshowAns[id]==false || res.data.data === null&& this.ifshowAns[id]==null) {
          this.$set(this.ifshowAns, id, !this.ifshowAns[id]);
          this.$message({
            type: 'warning',
            message: "暂时没有评论！"
          })
        } else {//  console.log(res.data.data[1].avator)
          // console.log("showAns")

          this.items[id] = [];
          // console.log(this.items[id])
          var num1;
          for (num1 = 0; num1 < res.data.data.length; num1++) {
            console.log(this.Userid + " " + res.data.data[num1].userid)
            this.item1 = '';
            this.item1 = res.data.data[num1];
            this.items[id].push(this.item1);
          }
        }
        console.log(this.ifuser)
      })
      console.log(this.ifshowAns[id])
      this.$set(this.ifshowAns, id, !this.ifshowAns[id]);
      console.log(this.ifshowAns[id])
      //更新消息列表
      // console.log(this.item1.questionid)
      // await this.getCommentList(this.item1.questionid)
    },
    async getAvatar(userid) {
      await this.$axios.post('http://10.251.254.107:8081/userInfo', userid).then(res => {
        // console.log(res);
        this.item1.avatar = res.data.data.avatar;
        console.log(this.item1.avatar);
      })
    },
    async submitAns1(id) {
      this.dialog1 = true;
      this.message1 = this.message1.toString();
      console.log(this.questions)
      console.log(id + " " + this.message1)

      // console.log(id)
      // console.log('hhhh'+message)
      var jsondata = {"content": this.message1, "questionid": id}
      if (this.message1 == "") {
          this.$message({
            type: 'warning',
            message: "评论内容不能为空！",
          })
        }
      else{
          this.$axios.post('http://10.251.254.107:8081/comment', jsondata).then(res => {
            console.log(res)
            if (res.data.code === 403) {
              this.$message({
                type: 'warning',
                message: "请先登录！",
              })
            } else {
              this.$message({
                type: 'success',
                message: "评论成功！",
              })
              // setTimeout( "location.reload()",500)
              //location.reload();
            }
            this.message1 = '';
            this.temp = '';
            // this.$Message.success('评论成功');
            //更新消息列表
            // await this.getCommentList(id)
            this.$axios.post('http://10.251.254.107:8081/getcomments', id).then(res => {
              this.items[id] = [];
              var num1;
              if (res.data.data) {
                for (num1 = 0; num1 < res.data.data.length; num1++) {
                  // this.isAuth.splice(res.data[num1].id, false);
                  // console.log(this.isAuth);
                  this.item1 = '';
                  //  this.item1.avatar = '';
                  this.item1 = res.data.data[num1];
                  this.items[id].push(this.item1);
                  this.$forceUpdate()
                }
              }
            })
            this.$axios.get('http://10.251.254.107:8081/getquestions').then(res=>{
              this.questions = res.data.data;
              console.log(this.questions);
              this.questionsNum = this.questions.length;
              this.$forceUpdate()
            })
          })
        this.message1 = '';
        this.temp = '';
        // this.$Message.success('评论成功');
      }
      
    },

    async DeleteAns(userid, id, qid) {
      var jsondata = sessionStorage.getItem('userInfo');
      var jsondata1 = JSON.parse(jsondata)
      // console.log(userid+" "+jsondata1.id)
      if (jsondata == null) {
        this.$message({
          type: 'error',
          message: "请登录！"
        })
      } else if (userid === jsondata1.id) {
        await this.$axios.post('http://10.251.254.107:8081/deletecomment', id).then(res => {
          
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: "评论删除成功！"
            })
            console.log(this.items[id])
          }
          this.$axios.post('http://10.251.254.107:8081/getcomments', qid).then(res => {
        console.log(qid)
        console.log(res)
              this.items[qid] = [];
              var num1;
              if (res.data.data) {
                for (num1 = 0; num1 < res.data.data.length; num1++) {
                  // this.isAuth.splice(res.data[num1].id, false);
                  // console.log(this.isAuth);
                  this.item1 = '';
                  //  this.item1.avatar = '';
                  this.item1 = res.data.data[num1];
                  this.items[qid].push(this.item1);
                  this.$forceUpdate()
                  console.log("shuaxinle")
                }
              }
            })
            this.$axios.get('http://10.251.254.107:8081/getquestions').then(res=>{
              this.questions = res.data.data;
              console.log(this.questions);
              this.questionsNum = this.questions.length;
              this.$forceUpdate()
            })
        })
      } else {
        this.$message({
          type: 'error',
          message: "不是本人无法删除！"
        })
      }
    },
    toKnowledge(){
      this.$router.push({
          path:"/knowledge",
        })
    }
  }
  }


</script>

<style scoped>
  .v-application .rounded-0 {
    border-radius: 6px !important;
  }
.v-btn{
  color: aliceblue
}
.el-message--info{
  background-color: #0288D1;
  border: #0288D1;
}
.el-message--warning{
  background-color: #FFB300;
  border: #FFB300;
}
.el-message--error{
  background-color: #F44336;
  border: #F44336;
}
.el-message--success{
  background-color: #4CAF50;
  border: #4CAF50;
}
.el-message ,.el-message--info .el-message__content{
  color: white;
}
.el-message ,.el-message--error .el-message__content{
  color: white;
}
.el-message ,.el-message--warning .el-message__content{
  color: white;
}
.el-message ,.el-message--success .el-message__content{
  color: white;
}
.el-message .el-icon-info {
  color: white;
}
.el-message .el-icon-success {
  color: white;
}
.el-message .el-icon-warning {
  color: white;
}
.el-message .el-icon-error {
  color: white;
}



.el-message__closeBtn.el-icon-close{
  color: white;
}
</style>
