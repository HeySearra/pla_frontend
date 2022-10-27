<template>
  <el-dialog
    class="change-pwd"
    :visible.sync="vis"
    @close="close"
    title="修改密码"
    width="450px"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="旧密码" prop="old_pwd">
        <el-input
          v-model="form.old_pwd"
          placeholder="请输入旧密码"
          show-password
          @keyup.enter.native="$refs.new_pwd.focus()"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd">
        <el-input
          v-model="form.new_pwd"
          placeholder="请输入新密码"
          show-password
          ref="new_pwd"
          @keyup.enter.native="$refs.new_pwd2.focus()"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="new_pwd_2">
        <el-input
          v-model="form.new_pwd_2"
          placeholder="请再次输入新密码以确认"
          show-password
          ref="new_pwd2"
          @keyup.enter.native="change"
        ></el-input>
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
        old_pwd: "",
        new_pwd: "",
        new_pwd_2: "",
        key: "",
      },
      rules: {
        old_pwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
        new_pwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
        new_pwd_2: [{ validator: this.check_new_pwd_2, trigger: "blur", required:true }],
      },
      vis: false,
      unlock_flag: false,
    };
  },

  methods: {
    change() {
      var that = this;
      this.$refs["form"].validate((valid) => {
        if (!valid) {
          that.alert_msg.warning("请正确输入表单内容");
          return false;
        }
        that.ajax.post(
        "/account/change_pwd", that.form, that, {
        success: function (res) {
          if (res.status == 0) {
            this.alert_msg.success("修改密码成功");
            this.vis = false;
          } else {
            switch (res.status) {
              case 5:
                this.alert_msg.warning("修改失败, 新密码非法");
                break;
              case 101:
                this.alert_msg.warning("修改失败, 原密码错误");
                break;
              case 103:
                this.alert_msg.warning("修改失败, 两次输入新密码不一致");
                break;
              default:
                this.alert_msg.warning("修改出错啦");
            }
          }
        },
      });
      });
    },
    check_new_pwd_2(rule, value, callback) {
      if (!value) {
        return callback(new Error("请再次输入新密码"));
      }
      if (value == this.form.new_pwd) {
        callback();
      } else {
        callback(new Error("两次密码输入不一致"));
      }
    },
    open() {
      for (let k in this.form) {
        this.form[k] = "";
      }
      this.unlock_flag = true;
      this.vis = true;
      var that = this;
      setTimeout(function () {
        that.$refs.form.clearValidate();
      }, 0);
    },
    close() {
      //if (this.unlock_flag) {
      //  this.$root.$children[0].unlock_index();
      //}
      this.$refs.form.clearValidate();
    },
  },
};
</script>

<style scoped>
</style>



// WEBPACK FOOTER //
// src/components/change-pwd.vue