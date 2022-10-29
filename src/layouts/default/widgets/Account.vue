<template>
  <v-menu
      bottom
      left
      min-width="200"
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
      >
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </template>

    <v-list
        :tile="false"
        flat
        nav
    >
      <!---登陆状态，可访问空间或者登出-->
      <div v-show="judge">
      <template  v-for="(p, i) in profile">
        <v-divider
            v-if="p.divider"
            :key="`divider-${i}`"
            class="mb-2 mt-2"
        />
        <app-bar-item
            v-else
            :key="`item-${i}`"
            class="changecolor"
        >
          <v-list-item-title>
            <v-btn @click="choosePath(p.title,i)"
                   style="background-color: rgba(0,0,0,0);width: 100%"
            >{{p.title}}
            </v-btn>
          </v-list-item-title>

        </app-bar-item>
      </template>
      </div>

      <!---未登录状态-->
      <div v-show="!judge">
        <template  v-for="(p, k) in log">
          <app-bar-item
              :key="`item-${k}`"
              class="changecolor"
          >
            <v-list-item-title >
              <v-btn
                  @click.stop="setdialog()"
                  style="background-color: rgba(0,0,0,0);width: 100%"

              >{{p.title}}</v-btn>
            </v-list-item-title>
          </app-bar-item>
        </template>

        <v-dialog
            transition="dialog-bottom-transition"
            max-width="600"
            v-model="dialog"
        >
          <v-card
              class="mx-auto"
              max-width="600"
              shaped
              v-if="!reveal"

          >
            <v-card-title style="color: #1A237E;font-size:4.2vmin">注册</v-card-title>
            <v-card-text>
              <v-form
                  ref="form"
                  v-model="valid"
                  lazy-validation
              >
                <v-text-field
                    v-model="name"
                    :rules="nameRules"
                    label="用户名"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="password"
                    :rules="passwordRules"
                    label="密码"
                    type="password"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="邮箱"
                    required
                ></v-text-field>
                <strong style="color: #1A237E;background-color:#E8EAF6;cursor:pointer" @click="codesend()">点击发送验证码</strong>
                <a style="color: #000000" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⚠️验证码区分大小写！⚠️</a>
                <v-text-field
                    v-model="inputcode"
                    label="验证码"
                    required
                ></v-text-field>
                <v-card-actions>
                  <v-btn
                      text
                      color="#1A237E"
                      @click="reveal = true"
                      style="margin-left: -15px;margin-top: -10px"
                  >
                    已经有账号了？立即登录！
                  </v-btn>
                </v-card-actions>
                <v-row
                    justify="center"
                    align="center"
                >
                  <v-btn
                      color="#1A237E"
                      
                      @click="ref"
                      style="margin-top: 15px;margin-bottom: 20px;color:#FFFFFF"
                  >
                    注册
                  </v-btn>
                </v-row>

              </v-form>
            </v-card-text>

            <v-expand-transition>

            </v-expand-transition>
          </v-card>
          <v-card
              v-if="reveal"
              max-width="600"
              class="transition-fast-in-fast-out v-card--reveal"

              shaped

          >
            <v-card-title style="color: #1A237E;font-size:4.2vmin">登录</v-card-title>
            <v-card-text class="pb-0">
              <v-form
                  ref="form"
                  v-model="valid"
                  lazy-validation
              >
                <!--                    <v-text-field-->
                <!--                        v-model="name"-->
                <!--                        :rules="nameRules"-->
                <!--                        label="Name"-->
                <!--                        required-->
                <!--                    ></v-text-field>-->
                <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="邮箱"
                    required
                    style="margin-top: 10px"
                ></v-text-field>

                <v-text-field
                    v-model="password"
                    :rules="passwordRules"
                    :type="'password'"
                    label="密码"
                    required
                    style="margin-top: 20px"
                ></v-text-field>
                <v-card-actions class="pt-0">
                  <v-btn
                      text
                      color="#1A237E"
                      @click="reveal = false"
                      style="margin-left: -15px;"
                  >
                    没有账号？去注册！
                  </v-btn>
                </v-card-actions>
                <v-row
                    justify="center"
                    align="center"
                >
                  <v-btn
                      color="#1A237E"
                      @click.native="login"
                      style="margin-top:30px;color:#FFFFFF"
                  >
                    登录
                  </v-btn>
                </v-row>

              </v-form>

            </v-card-text>

          </v-card>
        </v-dialog>

      </div>
    </v-list>
  </v-menu>
</template>

<script>
// import {mapState} from 'vuex'
export default {
  name: 'DefaultAccount',

  data: () => ({
    profile: [
      { title: 'profile'},
      { divider: true },
      { title: 'logout' },
    ],
    log: [
      { title: 'login' },
    ],
    path:'',
    judge:false,
    dialog:false,
    reveal: true,
    valid: true,
    name: '',
    // userid: this.$store.state.userid,
    nameRules: [
      v => !!v || '请输入用户名',
    ],
    password:'',
    passwordRules: [
      v => !!v || '请输入密码',
    ],

    email: '',
    emailRules: [
      v => !!v || '请输入邮箱',
      v => /.+@.+\..+/.test(v) || '请输入正确的邮箱',
    ],
    inputcode:'',
    emailcode:'',
    flag:1,
  }),
  created() {
    this.getuser();
  },
  methods:{
    isLogin() {
      return (sessionStorage.getItem('token') !== '')&&(sessionStorage.getItem('token') !== null)
    },
    getuser(){
      // let token = ""
      // sessionStorage.setItem("token",token);
      const _this = this;
      if(_this.isLogin()) _this.judge = true;
      else _this.judge = false ;
    },
    async choosePath(x,i){
      const _this = this;
      if(i === 2){
        //&消除用户登陆状态
        await this.$axios.delete('http://10.251.254.107:8081/logout').then(resp=> {
          if(resp.data.status===0){
            let token = ""
            sessionStorage.setItem("token",token);
            _this.$message({
              type: 'warning',
              message: "已退出登录！"
            });
            _this.judge=false;
            this.password = "";
            this.email = "";
            sessionStorage.clear();
            //退出登录跳转，qyw
              _this.$router.push({
              path:"/China"
            })
            location.reload()
          }else{
            _this.$message({
              type: 'error',
              message: "登出失败："+ resp.data.message
            });
          }
        })
        return;
      }
      else{
        _this.path='/'+x.toLowerCase();
        console.log(_this.path)
        setTimeout(this.$router.push({
          path:_this.path,
        }), 1000);
      }
      return;
    },
    setdialog(){
      this.dialog = true
    },
    ref(){
      const _this = this;
      //注册
      if(!_this.password||!_this.email||!_this.inputcode||!_this.name){
        _this.$message({
          type: 'warning',
          message: "请填写注册信息！"
        })
        return ;
      }
      else{
        if(_this.inputcode === _this.emailcode){
          this.$axios.post('http://10.251.254.107:8081/register/',{
            username: _this.name,
            email:_this.email,
            password:_this.password,
            vercode:_this.inputcode,
            avatar : "https://buaa-software-covid-19.oss-cn-beijing.aliyuncs.com/2021/07/06/cd715455875940889aaa72fa910a825cmonkey.jpg",
          }).then(function(resp) {
            if(resp.data.code===200){
              if(resp.data.status===1){
                _this.$message({
                  type: 'error',
                  message: "用户名已存在"
                })
              }else if(resp.data.status===2) {
                _this.$message({
                  type: 'error',
                  message: "邮箱已被注册"
                })
              }else{
                _this.$message({
                  type: 'success',
                  message: "注册成功，请登录。"
                })
                // alert("registration success, please log in.")
                _this.reveal = true;
              }
            }else{
              _this.$message({
                type: 'error',
                message: "注册失败: "+resp.data.message
              })
              // alert("registration error: "+resp.data.message)
            }
          })
        }
        else{
          _this.$message({
            type: 'error',
            message: "验证码错误，请重新输入"
          })
          // alert("验证码错误，请重新输入。")
        }

      }
      this.name = "";
      this.password = "";
      this.email = "";
      this.inputcode = "";
    },
    login:function (){
      const _this = this
      if(!(this.password&&this.email)){
        _this.$message({
          type: 'warning',
          message: "请完整输入登录信息"
        })
      }
      else {
        this.$axios.post("http://10.251.254.107:8081/login/",{
          password:_this.password,
          email:_this.email,
            }
        ).then(function (resp) {
          if (resp.data.code === 200) {
            if(resp.data.status===1){
              _this.$message({
                type: 'warning',
                message: "邮箱未注册，请先注册。"
              })
            }else if(resp.data.status===2){
              _this.$message({
                type: 'warning',
                message: "密码错误。"
              })
            } else if(resp.data.status===0){
              let userInfo = JSON.stringify(resp.data.data.user)
              sessionStorage.setItem("userInfo",userInfo);
              sessionStorage.setItem('id', JSON.parse(userInfo).id)
              // this.$store.state.userid = JSON.parse(userInfo).id
              // console.log(this.$store.state.userid)
              let token = resp.data.data.token;
              sessionStorage.setItem("token",token);
              _this.$message({
                type: 'success',
                message: "登录成功。"
              })
              
              
              _this.dialog = false
              _this.judge = true;
              _this.dialog = false;

              location.reload()
              
              
              // _this.$router.push({
              //   //登陆后跳转到某界面
              //   path:'/',
              // });
            }
          } else{
            _this.$message({
              type: 'error',
              message: "登录失败: "+resp.data.message
            })
          }
        })
      }
    },
    codesend(){
      const _this = this;
      if(_this.email&&_this.email.match("^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\\.[a-zA-Z0-9]{2,6}$")){
        this.$axios.post("http://10.251.254.107:8081/sendEmail",{
          email:_this.email,
        }).then(function(resp) {
          if(resp.data.code===200){
            if(resp.data.status === 0){
              _this.$message({
                type: 'info',
                message: "验证码已经发送，请查收。"
              })
              _this.emailcode = resp.data.data;
            }

          }else{
            _this.$message({
              type: 'error',
              message: "验证码发送失败"
            })
          }
        })
      }
      else{
        _this.$message({
          type: 'warning',
          message: "请正确输入邮箱！"
        })
      }
    }
  },
  // computed:{
  //   ...mapState['userid']
  // }
}
</script>

<style>
.v-card--reveal {
  /*bottom: 0;*/
  opacity: 1 !important;
  /*position: absolute;*/
  width: 100%;
  padding: 20px 0 50px 0;
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
  background-color: #0288D1;
  border: #0288D1;
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
/*.changecolor:hover{*/
/*  background-color: #1976D2 !important;*/
/*  padding: 0px;*/
/*}*/
/*.profilefont {*/
/*  font-size: 32px !important;*/
/*}*/

/*.v-btn.v-size--default{*/
/*  font-size: 18px !important;*/
/*}*/
</style>
