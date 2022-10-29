<template>
    <div>
<!--      导航-->
      <v-tabs
          fixed-tabs
          background-color="indigo"
          dark
          style="width: 90%; margin-left: 5%"
          v-model="value"
      >
        <v-tab>
          预防知识
        </v-tab>
        <v-tab
            @click="toQuestionList()">
          问题列表
        </v-tab>
      </v-tabs>

<!--    提问模块-->
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
                v-model="title"
                >
                  {{title}}
                </v-text-field>
                <br>
                <v-text-field label="描述一下您的问题"
                v-model="content">
                  {{content}}
                </v-text-field>
            </div>
            </v-card-text>
            <v-card-actions class="justify-end">
            <v-btn
                text
                color="pink"
                @click="postQuestion(title, content)"
              >提交</v-btn>
              <v-btn
                text
                @click="dialog= false"
              >关闭</v-btn>
            </v-card-actions>
          </v-card>
      </v-dialog>

<!--      疫情知识模块-->
      <v-container
          class="d-flex justify-center">
        <v-row
            style="margin-top: 10px">
          <v-col
            style="background-color: white"
          md="10"
          offset-md="1">
<!--            <p class="text-h4 font-weight-bold">-->
<!--              <v-icon-->
<!--                  large-->
<!--                  color="blue darken-2"-->
<!--              >-->
<!--                mdi-message-text-->
<!--              </v-icon>-->
<!--              预防常识</p>-->
            <v-simple-table
            style="border-radius: 0px;"
            >
              <template
                  v-slot:default
              >
                <tbody>
                <tr
                    v-for="(item,index) in knowledge"
                    :key="index"

                >
                  <td
                      style="height: 120px;cursor: pointer;"
                      @click="toLocale(item.url)"
                  >
                    <p class="text-h4 font-weight-bold">
                      <v-icon
                          large
                          color="blue darken-2"
                      >
                        mdi-message-text
                      </v-icon>
                      {{ item.title}}
                    </p>
                    <p class="font-weight-regular" style="margin-left: 15px">{{item.date}}</p>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
      </v-container>
<!--        <v-row style="margin-top:35px;margin-right:40px;margin-left: 40px">-->
<!--                <v-card-->
<!--                    class="mx-auto"-->
<!--                    style="margin:20px 0px 30px 0px;"-->
<!--                    color="#B0BEC5"-->
<!--                    dark-->
<!--                    v-for="(tip, index) in tips.slice(0,16)"-->
<!--                    :key="index"-->
<!--                    width="240px"-->
<!--                    height="240px"-->
<!--                >-->
<!--                  <v-card-title>-->
<!--&lt;!&ndash;                    <v-icon&ndash;&gt;-->
<!--&lt;!&ndash;                        middle&ndash;&gt;-->
<!--&lt;!&ndash;                        left&ndash;&gt;-->
<!--&lt;!&ndash;                        style="float: left"&ndash;&gt;-->
<!--&lt;!&ndash;                    >&ndash;&gt;-->
<!--&lt;!&ndash;                      mdi-twitter&ndash;&gt;-->
<!--&lt;!&ndash;                    </v-icon>&ndash;&gt;-->
<!--                    <h3-->
<!--                        class="text-h7  align-center"-->
<!--                        style="font-weight: 700; height: 20px;margin-top:-5px;margin-bottom: 8px;margin-left: 4px"-->
<!--                        >-->
<!--                      {{tip.title}}</h3>-->
<!--                  </v-card-title>-->
<!--                  <v-divider></v-divider>-->
<!--                <v-card-text>-->
<!--                  <div class="text&#45;&#45;primary" style="height: 100px">-->
<!--                      {{tip.content.slice(0,45)+"..."}}-->
<!--                  </div>-->
<!--                </v-card-text>-->
<!--                  <v-btn-->
<!--                      :disabled="loading"-->
<!--                      class="ma-1"-->
<!--                      color="white"-->
<!--                      plain-->
<!--                      style=""-->
<!--                      @click="toSheet(tip.id)"-->
<!--                  >-->
<!--                    查看更多...-->
<!--                  </v-btn>-->
<!--                </v-card>-->
<!--        </v-row>-->
    </div>


</template>

<script>
export default {
    data(){
        return{
            value:0,
            dialog: false,
            tips:[],
            title:"",
            content:"",
            knowledge:[
              {
                title:"儿童青少年新冠肺炎疫情期间近视预防指引(更新版)",
                date:"为指导疫情期间儿童青少年近视预防，国家卫生健康委疾控局组织安徽医科大学卫生管理学院、北京市疾控中心、上海市眼病防治中心、北京大学人民医院眼视光中心制定并印发了《儿童青少年新冠肺炎疫情期间近视预防指引》。",
                url:"http://www.gov.cn/fuwu/2020-04/26/content_5506329.htm"
              },
              {
                title:"《新型冠状病毒肺炎健康教育手册（第二版）》发布",
                date:"普及防控知识，提高公众防控意识和能力，是打赢新型冠状病毒肺炎疫情阻击战的重要保障之一。为进一步加强疫情防控健康教育，中国健康教育中心于2月5日发布了《新型冠状病毒感染的肺炎健康教育手册》。",
                url:"http://www.gov.cn/fuwu/2020-03/10/content_5489535.htm"
              },
              {
                title:"疫情期间家中防护，这三件事要了解！",
                date:"来源： 中国政府网",
                url:"http://www.gov.cn/xinwen/2020-02/16/content_5479790.htm"
              },
              {
                title:"小区疫情防控，这两件事不能做！",
                date:"来源： 中国政府",
                url:"http://www.gov.cn/xinwen/2020-02/16/content_5479779.htm"
              },
              {
                title:"新冠肺炎疫情防控知识库",
                date:"我是不是无症状感染者？口罩能酒精消毒吗？科普200问，官方知识库来了！",
                url:"http://www.gov.cn/fuwu/2020-02/11/content_5477400.htm"
              },
              {
                title:"新型冠状病毒感染的肺炎健康教育手册",
                date:"来源：中国健康教育中心",
                url:"http://www.gov.cn/fuwu/2020-02/10/content_5476794.htm"
              },
              {
                title:"新型冠状病毒的几大真相（传播篇）",
                date:"来源： 中国日报网",
                url:"http://www.gov.cn/xinwen/2020-02/07/content_5476018.htm"
              },
              {
                title:"新型冠状病毒的几大真相（防护篇）",
                date:"来源： 中国日报网",
                url:"http://www.gov.cn/xinwen/2020-02/07/content_5476771.htm"
              },
              {
                title:"疫情当前，老人、儿童、孕产妇等特殊群体如何防护？",
                date:"来源： 中国政府网",
                url:"http://www.gov.cn/xinwen/2020-02/06/content_5475295.htm"
              },
            ],
        }
    },
    created(){
        this.getTips()
        this.$vuetify.theme.dark = false
        console.log(this.dialog)
    },
    methods:{
        toQuestionList(){
        this.$router.push({
          path:"/question",
        })
      },

      toSheet(id){
          this.$store.state.id = id
          this.$router.push({
            path:"/sheet",
          })
      },

      getTips(){
        this.$axios.get('/data/tips').then(res => {
          console.log(res);
          if (res.status !== 200) {
            return this.$message.error('获取失败');
          }
          this.tips = res.data.data
        })
      },

      postQuestion(title, content){
        this.dialog = false;
        console.log(title)
        console.log(content)
        var jsondata={title:title, content:content}
        this.$axios.post('http://10.251.254.107:8081/ask',jsondata).then(res=>{
          console.log(res);
        })
        this.title = "";
        this.content = "";
        this.$message({
          type: 'success',
          message: "提交成功！"
        });
      },
      toLocale(link){
        window.location.href = link
      },
    },
}
</script>

<style scoped>
.el-message ,.el-message--success .el-message__content{
  color: white;
}
.el-message .el-icon-success {
  color: white;
}

.el-message__closeBtn.el-icon-close{
  color: white;
}
</style>
