<template>
  <v-container
      id="user-profile-view"
      fluid
      tag="section"
  >
    <v-row justify="center">
      <v-col
          cols="12"
          md="8"
      >
        <material-card
            color="primary"
            icon="mdi-account-edit-outline"
        >
<!--          <v-img-->
<!--              v-if="newAvatar"-->
<!--              height="50"-->
<!--              width="50"-->
<!--              :src="newAvatar"-->
<!--          ></v-img>-->
          <template #title>
            修改信息 — <small class="text-body-1">完善您的信息</small>
          </template>

          <v-form>
            <v-container class="py-0">
              <v-row>
                <v-col cols="12" md="11" style="margin-left: 15px">
                  <v-text-field
                      color="#1E88E5"
                      label="用户名"
                      v-model="editMes.newName"
                  />

                </v-col>

                <v-col cols="12" md="11" style="margin-left: 15px">
                  <v-text-field
                      color="#1E88E5"
                      label="邮箱"
                      v-model="editMes.newEmail"
                      readonly
                  />
                </v-col>
                <v-col
                    cols="12"
                    class="text-right"
                >
                  <v-btn
                      color="primary"
                      min-width="150"
                      @click="edit()"
                      style="margin-right: 56px"
                  >
                    提交
                  </v-btn>
                </v-col>

                <v-col cols="12" style="margin-left: 15px">
                  <v-img
                      v-if="userInfo.avatar"
                      height="250"
                      width="250"
                      :src="userInfo.avatar"
                      style="border-radius: 10px"
                  ></v-img>
                </v-col>
                <v-col style="margin-left: 15px">
                  <v-btn class="file11" @change="update" color="primary">
                    更改头像
                    <input class="file" name="file" type="file" accept="image/png,image/gif,image/jpeg"/>
                  </v-btn>
                </v-col>
<!--                <v-col cols="12">-->
<!--&lt;!&ndash;                  {{files}}&ndash;&gt;-->
<!--                  <v-file-input-->
<!--                      label="头像"-->
<!--                      prepend-icon="mdi-camera"-->
<!--                      color="purple"-->
<!--                      v-model="files"-->
<!--                  ></v-file-input>-->
<!--                  <v-img-->
<!--                      v-if="newAvatar"-->
<!--                      height="250"-->
<!--                      width="250"-->
<!--                      :src="newAvatar"-->
<!--                  ></v-img>-->
<!--                </v-col>-->
<!--                <v-col-->
<!--                    cols="12"-->
<!--                    class="text-right"-->
<!--                >-->
<!--                  <v-btn-->
<!--                      color="primary"-->
<!--                      min-width="150"-->
<!--                      @click="submitFiles()"-->
<!--                  >-->
<!--                    更改头像-->
<!--                  </v-btn>-->
<!--                </v-col>-->
              </v-row>

            </v-container>
          </v-form>

        </material-card>
      </v-col>

      <v-col
          cols="12"
          md="4"
      >
        <app-card class="mt-4 text-center">
          <v-card-title style="margin-left: 12px">
            <h1>修改密码</h1>
          </v-card-title >
          <v-form :model="Pwds">
            <v-container class="py-0">
              <v-row>
                <v-col cols="10" style="margin-left: 20px">
                  <v-text-field
                      color="#1E88E5"
                      label="原密码"
                      type="password"
                      v-model="Pwds.oldpwd"
                  />
                </v-col>
                <v-col cols="10" style="margin-left: 20px">
                  <v-text-field
                      color="#1E88E5"
                      label="新密码"
                      type="password"
                      v-model="Pwds.newpwd"
                  />
                </v-col>
                <v-col cols="10" style="margin-left: 20px">
                <v-text-field
                    color="#1E88E5"
                    label="再次输入"
                    type="password"
                    v-model="Pwds.repeat"
                />
              </v-col>

                <v-col
                    cols="12"
                    class="text-right"
                >
                  <v-btn
                      color="primary"
                      min-width="150"
                      @click="editPassword()"
                      style="margin-right: 50px;margin-bottom: 15px"
                  >
                    提交
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </app-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Profile",
  data() {
    return {
      userInfo:{
        id:'',
        username: '',
        email: '',
        password: '',
        avatar:'',
        isauthority:'',
      },
      email: '',
      token: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      newAvatar:'',
      avatarUrl:'http://10.251.254.107:8081/upload',
      //file:'',
      files:{},
      Pwds: {
        oldpwd: '',
        newpwd: '',
        repeat: ''
      },
      editMes:{
        newName:'',
        newEmail:'',
      },
      photo:'',
      imgs: {},
      imgLen:0,
      test:'',
  }
  },
  methods: {
    edit() {
      const _this=this;
      if(this.editMes.newName === ""){
         _this.$message({
          type: 'warning',
          message: "用户名不能为空！"
        })
      }
      else{
      this.$axios.put("/information", {username:_this.editMes.newName,email:_this.editMes.newEmail}).then(res => {
       // this.$message.success(res.data.message)
       //  alert(res.data.message)
        _this.$message({
          type: 'success',
          message: res.data.message
        })
      })
      }
      
      //alert("finish")
      //this.$router.push("/home/" + this.email)
    },


    editPassword(){
      //alert("原密码："+this.Pwds.oldpwd+"    "+"新密码："+this.Pwds.newpwd)
      const _this=this;
      if(_this.Pwds.newpwd === ""){
            _this.$message({
            type: 'warning',
            message: "密码不能为空！"
          })
          }
      else if(this.Pwds.newpwd==this.Pwds.repeat){
        this.$axios.put("/password", {newPassword:_this.Pwds.newpwd,oldPassword:_this.Pwds.oldpwd}).then(res => {
          console.log(res)
          //this.$message.success(res.data.message)
          
          // alert(res.data.message)
          if(res.data.message === "原密码错误"){
            _this.$message({
            type: 'warning',
            message: res.data.message
          })
          }
          else{
             _this.$message({
            type: 'success',
            message: res.data.message
          })
          this.Pwds.newpwd=""
          this.Pwds.oldpwd=""
          this.Pwds.repeat=""
          }
          
          
        })
      }else{
        _this.$message({
            type: 'warning',
            message: "密码两次输入不一致！"
          })
      }
      //alert("finish")
    },

    update (e) {
      const _this=this
      let file = e.target.files[0]
      // console.log(file)
      let param = new FormData() // 创建form对象
      param.append('file', file, file.name) // 通过append向form对象添加数据
      param.append('id', this.userInfo.id) // 添加form表单中其他数据
      // withCredentials: true 使得后台可以接收表单数据 跨域请求
      const instance = this.$axios.create({
        withCredentials: true
      })
      // url为后台接口
      instance.put('http://10.251.254.107:8081/upload', param).then(res => {
        //this.$message.success(res.data.message)
        // alert(res.data.message);
        _this.$message({
          type: 'success',
          message: res.data.message
        })
        _this.newAvatar=res.data.data;
        _this.userInfo.avatar= _this.newAvatar;
        //alert(_this.newAvatar)
       // sessionStorage.setItem("userInfo",_this.userInfo);
        //alert("newAvatar: "+_this.newAvatar);
      })
    },
    getUserInfo(){
      const _this=this;
    //  alert(111)
      this.$axios.post("/userInfo", {userid:_this.userInfo.id}).then(res => {
        //this.$message.success(res.data.message)
       // alert(res.data.message)
        _this.userInfo=res.data.data
        this.editMes.newName=_this.userInfo.username;
        this.editMes.newEmail=_this.userInfo.email;
       // alert(_this.userInfo.avatar)
      })

    }
  },
  created() {
    this.$vuetify.theme.dark = false;
    //this.token = window.sessionStorage.getItem("token")
    //this.userInfo = window.sessionStorage.getItem("userInfo")
    var userInfo=JSON.parse(sessionStorage.getItem("userInfo"))
    this.userInfo.id=userInfo.id
    this.getUserInfo()
    //alert(this.userInfo.username)
    this.editMes.newName=userInfo.username;
    this.editMes.newEmail=userInfo.email;
  },



}
</script>

<style scoped>
.file11 {
  position: relative;
  display: inline-block;
  background: #E91E63;
  /*border: 1px solid #E91E63;*/
  border-radius: 4px;
  padding: 10px 46px;
  overflow: hidden;
  color: #ffffff;
  text-decoration: none;
  text-indent: 0;
  line-height: 20px;
  font-size: 10px;
  box-shadow:0px 1px 0px 0px #a2a2a2;
}
.file11 input {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;

}
.file11:hover {
  background: #EC407A;
  /*border-color: #78C3F3;*/
  color: #ffffff;
  text-decoration: none;
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
