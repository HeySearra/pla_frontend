<template>
	<el-dialog
		class="login"
		:visible.sync="vis"
		@close="close"
		width="430px"
		append-to-body
		:close-on-click-modal="false">
		<div>
			<figure class="logo"></figure>
			<div style="margin: 10px 0; font-size: var(--font-size-big); font-weight: bold; color: var(--color-t); text-align: center;">- 登 录 -</div>
		</div>
		<div style="height: 5px"></div>
		<el-form :model="form" :rules="rules" ref="form">
			<el-form-item prop="account">
				<el-input
					v-model="form.account"
					type="email"
					placeholder="邮箱"
					@keyup.enter.native="$refs.pas.focus()">
					<template slot="prepend">
						<i class="el-icon-message"></i>
					</template>
				</el-input>
			</el-form-item>
			<el-form-item prop="pwd">
				<el-input
					v-model="form.pwd"
					placeholder="密码"
					type="password"
					ref="pas"
					@keyup.enter.native="login">
					<template slot="prepend">
						<i class="el-icon-lock"></i>
					</template>
				</el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" style="font-size: var(--font-size);" @click="login">登录</el-button>
			</el-form-item>
		</el-form>
		<div style="height: 5px"></div>
		<div class="option">
			<div @click="register">立即注册</div>
			<div @click="find">忘记密码</div>
		</div>
  	</el-dialog>
</template>

<script>
export default {
	name: 'Login',

	mounted() {},

	data() {
		return {
			vis: false,
			unlock_flag: true,
			form: {
				account: "",
				pwd: "",
			},
			rules: {
				pwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
				account: [{ validator: this.check_email, trigger: "blur" }],
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
			} else {
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
			this.unlock_flag = false;
			this.$emit("open_register");
			this.vis = false;
		},

		find() {
			this.unlock_flag = false;
			this.$emit("open_find");
			this.vis = false;
		},

		login() {
			var that = this;
			this.$refs['form'].validate((valid) =>{
				if(!valid){
					that.alert_msg.warning("请正确输入表单内容");
					return false;
				}
				that.ajax.post("/account/login", that.form, that, {
					success: function (res) {
						if (res.status == 0) {
							// let from = this.$route.query.from;
							this.alert_msg.success('登录成功');
							this.$emit("login_success");
							this.vis = false;
						} 
						else {
							switch (res.status) {
							case 5:
								this.alert_msg.warning("登录失败, 密码错误");
								break;
							case 7:
								this.alert_msg.warning("登录失败, 该用户不存在");
								break;
							case 101:
								this.alert_msg.warning("登录失败, 该用户已被禁用");
								break;
							default:
								this.alert_msg.warning("登录出错啦");
							}
						}
					},
				});
			})
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
		width: 100%;
		letter-spacing: 3em;
		text-indent: 3em;
		padding-top: 0;
		padding-bottom: 0;
		line-height: 40px;
		height: 40px;
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
// src/components/login.vue