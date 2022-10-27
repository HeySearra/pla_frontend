<template>
	<el-dialog
		class="login"
		:visible.sync="vis"
		@close="close"
		width="430px"
		append-to-body
		:close-on-click-modal="false"
		style="margin-top: -3vh;">
		<div>
			<figure class="logo"></figure>
			<div style="margin: 10px 0; font-size: var(--font-size-big); font-weight: bold; color: var(--color-t); text-align: center;">- 注 册 -</div>
		</div>
		<div style="height: 5px"></div>
		<el-form :model="form" :rules="rules" ref="form">
			<el-form-item prop="name">
				<el-input v-model="form.name" placeholder="用户名" @keyup.enter.native="$refs.acc.focus()">
				<template slot="prepend">
					<i class="el-icon-user"></i>
				</template>
				</el-input>
			</el-form-item>
			<el-form-item prop="account">
				<el-input v-model="form.account" placeholder="邮箱" ref="acc" @keyup.enter.native="$refs.pwd.focus()">
				<template slot="prepend">
					<i class="el-icon-message"></i>
				</template>
				</el-input>
			</el-form-item>
			<el-form-item prop="pwd">
				<el-input v-model="form.pwd" placeholder="密码" type="password" ref="pwd" @keyup.enter.native="$refs.ver.focus()">
				<template slot="prepend">
					<i class="el-icon-lock"></i>
				</template>
				</el-input>
			</el-form-item>
			<el-form-item class="ver" prop="ver">
				<el-input style="width: 63%" v-model="form.ver" maxlength="6" placeholder="验证码" ref="ver" @keyup.enter.native="register"></el-input>
					<el-button
						type="info"
						:disabled="ver_code_disabled"
						@click="get_ver_code">
						{{ ver_code_disabled ? "重发 (" + rest_time + " s)" : "获取验证码" }}
					</el-button>
				</el-form-item>
			<el-form-item>
				<el-button type="primary"  style="width: 100%; letter-spacing: 3em; text-indent: 3em; font-size: var(--font-size);" @click="register">注册</el-button>
			</el-form-item>
    	</el-form>
		<div style="height: 5px"></div>
		<div class="option">
			<div @click="login">已有账号？立即登录</div>
		</div>
  	</el-dialog>
</template>

<script>
export default {
	name: 'Register',

	mounted() {},

	data() {
		return {
			vis: false,
			unlock_flag: true,
			form: {
				name: "",
				account: "",
				pwd: "",
				ver: "",
			},
			ver_code_disabled: false,
			rest_time: 0,
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
				pwd: [
					{ required: true, message: "请输入密码", trigger: "blur" },
					{
						min: 6,
						max: 16,
						message: "长度在 6 到 16 个字符",
						trigger: "blur",
					},
				],
				account: [{ validator: this.check_email, trigger: "blur" }],
				ver: [
					{ required: true, message: "请输入验证码", trigger: "blur" },
					{ min: 6, max: 6, message: "请输入 6 位验证码", trigger: "blur" },
				],
			},
		};
	},

  	methods: {
		check_email(rule, value, callback) {
			const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+\.([a-zA-Z0-9_-])+/;
			if (!value) {
				return callback(new Error("请输入邮箱"));
			}
			if (mailReg.test(value)) {
				callback();
			} 
			else {
				callback(new Error("请输入正确的邮箱"));
			}
		},

		open() {
			this.form.account = "";
			this.form.pwd = "";
			this.unlock_flag = true;
			this.vis = true;
			var that = this;
			setTimeout(function(){
				that.$refs.form.clearValidate();
			}, 0);
		},

		close() {
			// if (this.unlock_flag) {
			// 	this.$root.$children[0].unlock_index();
			// }
			var that = this;
			setTimeout(function(){
				that.$refs.form.clearValidate();
			}, 0);
		},

		register() {
			var that = this;
			this.$refs['form'].validate((valid) =>{
				if(!valid){
					that.alert_msg.warning("请正确输入表单内容");
					return false;
				}
				that.ajax.post("/account/register", that.form, that, {
					success: function (res) {
						if (res.status == 0) {
							this.alert_msg.success('注册成功');
							this.$emit("login_success");
							this.vis = false;
						} 
						else {
							switch (res.status) {
								case 3:
									that.alert_msg.error("注册失败, 邮箱非法");
									break;
								case 4:
									that.alert_msg.error("注册失败, 用户名非法");
									break;
								case 5:
									that.alert_msg.error("注册失败, 密码非法");
									break;
								case 101:
									that.alert_msg.error("注册失败, 邮箱已被占用");
									break;
								case 102:
									that.alert_msg.error("注册失败, 验证码错误");
									break;
								default:
									that.alert_msg.error("出错啦");
							}
						}
					},
				});
			})
		},

		init_ver() {
			if (localStorage.getItem("res_time")) {
				this.rest_time =(new Date(new Date(localStorage.getItem("res_time"))).getTime() + 60000 -new Date()) /1000;
				if (this.rest_time > 1) {
					this.rest_time = parseInt(this.rest_time);
					this.ver_code_disabled = true;
					var that = this;
					this.rest_timer ? clearInterval(this.rest_timer) : "";
					this.rest_timer = setInterval(function () {
						that.rest_time--;
						if (that.rest_time == 0) {
							that.ver_code_disabled = false;
							that.rest_timer ? clearInterval(that.rest_timer) : "";
							localStorage.removeItem("res_time");
						}
					}, 1000);
				}
			}
		},

		get_ver_code() {
			if(this.form.account.trim() == ''){
				this.alert_msg.warning('请输入邮箱');
				return;
			}
			if (!this.ver_code_disabled) {
				this.ajax.post("/account/send_ver", {account:this.form.account}, this, {
					success: function (res) {
						if (res.status == 0) {
							this.alert_msg.success("验证码发送成功");
							this.ver_code_disabled = true;
							this.rest_time = 60;
							var that = this;
							this.rest_timer = setInterval(function () {
								that.rest_time--;
								if (that.rest_time == 0) {
									that.ver_code_disabled = false;
									that.rest_timer ? clearInterval(that.rest_timer) : "";
									localStorage.removeItem("res_time");
								}
							}, 1000);
							localStorage.setItem("res_time", new Date());
						} 
						else {
							switch (res.status) {
								case 3:
									that.alert_box.msg("验证失败, 邮箱非法");
									break;
								case 101:
									that.alert_box.msg("验证失败, 邮箱已被注册");
									break;
								default:
									that.alert_msg.error("出错啦");
							}
						}
					},
				});
			}
		},

		login() {
			this.unlock_flag = false;
			this.$emit("open_login");
			this.vis = false;
    	},
	},
};
</script>

<style scoped>
	>>> .el-dialog {
		background-color: #fafafa;
	}

	.login >>> .el-dialog__close {
		font-size: 21px;
	}

	.login >>> .el-dialog__header {
		padding: 10px 0;
	}

	.logo {
		/* border: solid 1px; */
		width: 210px;
		height: 69px;
		margin: 0 auto;
		background-image: url("../assets/logo_deep.png");
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
	}

	.el-form {
		margin-top: 18px;
		padding: 0 30px;
	}

	.el-form .el-button {
		width: 35%;
		padding-top: 0;
		padding-bottom: 0;
		line-height: 40px;
		height: 40px;
		float: right;
		transition: 0.1s linear all;
	}

	>>> .el-form .el-input-group__append,
	>>> .el-form .el-input-group__prepend {
		padding: 0 11px;
		background-color: #fff;
	}

	>>> .el-form .el-input-group--prepend .el-input__inner,
	>>> .el-form .el-input-group__append {
		padding-left: 10px;
		border: 1px solid #dcdfe6 !important;
		border-left: 0 !important;
		line-height: 45px;
		height: 45px;
		font-size: var(--font-size);
	}

	>>> .el-form .el-input-group__prepend {
		font-size: var(--font-size-big) !important;
	}

	>>> .el-form .el-form-item {
		margin-bottom: 30px;
	}

	>>> .el-form .el-form-item__error {
		font-size: 15px;
	}


	.option {
		position: absolute;
		bottom: 10px;
		right: 10px;
	}

	.option div {
		cursor: pointer;
		color: #787878;
		font-size: var(--font-size);
		float: right;
		margin-left: 23px;
	}

	.option div:hover {
		text-decoration: underline;
	}
</style>


// WEBPACK FOOTER //
// src/components/register.vue