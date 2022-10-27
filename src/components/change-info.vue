<template>
  <el-dialog
    class="change-info"
    :visible.sync="vis"
    @close="close"
    title="修改个人信息"
    width="650px"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="头像" prop="avatar">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :http-request="upload_por"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="form.avatar" :src="form.avatar" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="用户名" prop="name">
        <el-input style="width: 350px" v-model="form.name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="vis = false">取 消</el-button>
      <el-button type="primary" @click="change">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      form: {
        name: "",
        avatar: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入昵称", trigger: "blur" },
          {
            min: 1,
            max: 16,
            message: "长度在 1 到 16 个字符",
            trigger: "blur",
          },
        ],
        avatar: [{ required: true, message: "", trigger: "blur" }],
        // birth: [{ validator: this.check_birth, trigger: "blur" }],
      },
      vis: false,
      unlock_flag: false,
    };
  },

  methods: {
    upload_por(f) {
      var is_pic = f.file.type == "image/jpeg" || f.file.type == "image/png";
      if (!is_pic) {
        this.alert_msg.error("请上传 jpg 或 png 格式的图片");
        return;
      }
      let form = new FormData();
      form.append("file", f.file);
      this.ajax.post(
        "/upload_pic",
        form,
        this,
        {
          success: function (res) {
            if (res.status == 0) {
              this.form.avatar = res.avatar;
              //f.onSuccess();
            } else {
              switch (res) {
                case 101:
                  this.alert_msg.error("错误，上传的不是jpg、png之一");
                  break;
                case 102:
                  this.alert_msg.error("错误，上传的图像大小超10M");
                  break;
                default:
                  this.alert_msg.error("上传头像失败，请重试");
              }
              //that.form.img = '';
              //f.onError();
            }
          },
        },
        { async: false, form: true }
      );
    },
    beforeAvatarUpload(file) {
      var is_pic = file.type == "image/jpeg" || file.type == "image/png";
      var isLt2M = file.size / 1024 / 1024 < 10;

      if (!is_pic) {
        this.alert_msg.error("请上传图片");
      }
      if (!isLt2M) {
        this.alert_msg.error("上传图片的大小不能超过 10MB");
      }
      return is_pic && isLt2M;
    },
    change() {
      var that = this;
      this.$refs["form"].validate((valid) => {
        if (!valid) {
          that.alert_msg.warning("请正确输入表单内容");
          return false;
        }
        that.ajax.post(
          "/account/change_info",
          that.form,
          that,
          {
            success: function (res) {
              if (res.status == 0) {
                this.alert_msg.success("修改信息成功");
                this.$emit("refresh_info");
                this.vis = false;
              } else {
                switch (res.status) {
                  case 4:
                    this.alert_msg.warning("修改失败, 用户名非法");
                    break;
                  case 102:
                    this.alert_msg.warning("修改失败, 头像链接非法");
                    break;
                  case 103:
                    this.alert_msg.warning("修改失败, 生日非法");
                    break;
                  default:
                    this.alert_msg.warning("修改失败");
                }
                //this.alert_msg.warning("请求信息失败");
              }
            },
          }
        );
      });

      // this.ajax.post('/account/change_info',this.form,this,{
      //   success:function(res){
      //     if(res.status==0){
      //       this.alert_msg.success('修改信息成功');
      //       this.$emit('refresh_info');
      //       this.vis = false;
      //     }
      //     else{
      //       switch(res.status){
      //         case 4:
      // 				  this.alert_msg.warning("修改失败, 用户名非法");
      // 				  break;
      //         case 102:
      //           this.alert_msg.warning("修改失败, 头像链接非法");
      //           break;
      //         case 103:
      //           this.alert_msg.warning("修改失败, 生日非法");
      //           break;
      //         default:
      //           this.alert_msg.warning("修改失败");
      //       }
      //       this.alert_msg.warning('请求信息失败');
      //     }
      //   }
      // })
    },
    open() {
      this.ajax.get(
        "/user_info",
        {},
        this,
        {
          success: function (res) {
            if (res.status == 0) {
              this.form.name = res.name;
              this.form.avatar = res.avatar;
              //this.unlock_flag = true;
              this.vis = true;
              var that = this;
              setTimeout(function () {
                that.$refs.form.clearValidate();
              }, 0);
            } else {
              this.alert_msg.warning("请求信息失败");
            }
          },
        }
      );
      // this.ajax.get('/user_info/',{},this,{
      //   success:function(res){
      //     if(res.status==0){
      //       this.name = res.name;
      //       this.birth = res.birth;
      //       this.avatar = res.avatar;
      //       this.unlock_flag = true;
      //       this.vis = true;
      //     }
      //     else{
      //       this.alert_msg.warning('请求信息失败');
      //     }
      //   }
      // })
      //   this.unlock_flag = true;
      //   this.vis = true;
    },
    close() {
      var that = this;
      setTimeout(function () {
        that.$refs.form.clearValidate();
      }, 0);
      //if (this.unlock_flag) {
      //  this.$root.$children[0].unlock_index();
      //}
    },
  },
};
</script>

<style scoped>
.change-info >>> .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.change-info >>> .avatar-uploader .el-upload:hover {
  border-color: #6585b3;
}

.change-info >>> .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.change-info >>> .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>



// WEBPACK FOOTER //
// src/components/change-info.vue