<template>
  <v-menu
    bottom
    left
    offset-y
    origin="top right"
    transition="scale-transition"
  >
    <template v-slot:activator="{ attrs, on }">
      <v-btn
        class="ml-2"
        min-width="0"
        text
        v-bind="attrs"
        v-on="on"
        @click="getNewMessage"
      >
        <v-icon>mdi-bell</v-icon>
        <v-badge
          bordered
          color="red"
          overlap
          v-show="cntFlag"
        >
          <template
              v-slot:badge>
            <span>{{cnt}}</span>
          </template>
        </v-badge>

      </v-btn>
    </template>

    <v-list
      flat
      nav
      class="mx-auto"
      v-show="showlist"

    >
      <v-list-item-content
          @click="toBook"
          style="cursor: pointer;min-height: 0px !important;padding: 0px !important;">
        <span class="changeColor">{{blank}}</span>
      </v-list-item-content>
      <app-bar-item
        v-for="(n, index) in notification"
        :key="index"
        link
      >
      <br>
        <v-list-item-content
            @click="toBook"
            style="cursor: pointer;">
          <v-list-item-title>{{n.location}}地区今日新增病例{{n.confirm}}人。 </v-list-item-title>
        </v-list-item-content>
      </app-bar-item>
    </v-list>
  </v-menu>
</template>

<script>
  export default {
    name: 'DefaultNotifications',

    data(){
      return{
        notification:[],
        blank:'',
        cnt:'',
        cntFlag:'',
      }
    },

    methods:{
      toBook(){
        this.$router.push({
          path: '/book',
        });
        this.notification = ''
        this.showFlag()
        // location.reload()
      },
      // 显示订阅内容
      async getNewMessage(){
        await this.$axios.get('http://10.251.254.107:8081/subscription/brief').then(res=>{
          // console.log(res)
          if(res.data.message==="您未登录"){
            alert('请先登录后再查看')
            this.showlist = false
          }
          else{
            this.showlist = true
            // console.log(this.showlist)
            if(res.data.data != null){
              this.flag = false
              this.notification = res.data.data
              // this.cnt = this.notification.length
              // this.cntFlag = true
            }
            if(this.notification.length == 0){
              this.blank='暂无消息!点击查看详情!'
              // this.cntFlag = false
            }
            else{
              this.blank = ''
            }
          }
          // console.log(this.blank)
        })
      },
      // 显示订阅消息数量
      showFlag(){
        this.$axios.get('http://10.251.254.107:8081/subscription/size').then(res=>{
          if(res.data.message==="您未登录"){
                // alert('请先登录后再查看')
                this.showlist = false
              }
          if(res.data.data > 0){
            this.showlist = true
            this.cntFlag = true
            this.cnt = res.data.data
            // console.log(this.cnt)
          }
          else{
            this.cntFlag = false
          }
        })
        // this.$axios.get('http://10.251.254.107:8081/subscription/brief').then(res=>{
        //   if(res.data.message==="您未登录"){
        //     // alert('请先登录后再查看')
        //     this.showlist = false
        //   }
        //   else{
        //     this.showlist = true
        //     console.log(this.showlist)
        //     if(res.data.data != null){
        //       this.flag = false
        //       this.notification = res.data.data
        //       // this.cnt = this.notification.length
        //       // this.cntFlag = true
        //     }
        //     else{
        //       this.blank='当前没有新通知。'
        //       // this.cntFlag = false
        //     }
        //     if(this.notification.length <= 0){
        //       console.log(this.notification.length)
        //       this.cntFlag = false
        //       console.log(this.cntFlag)
        //     }
        //     else{
        //       this.cntFlag = true
        //       this.cnt = this.notification.length
        //       this.blank = ''
        //     }
        //   }
        //   console.log(this.blank)
        // })
      }
    },
    created(){
      this.showFlag()
    },
    mounted() {
      // this.showFlag()
      this.timer = setInterval(this.showFlag, 1000);
    },

  }
</script>
<style scoped>
.changeColor:hover{
  color: #0078d4;
}
</style>
