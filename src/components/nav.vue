<template>
    <div class="nav shadow" :class="beauty?'special':''" @click="click_head">
        <div class="bc"></div>
        <div>
            <router-link :to="{name: 'index'}" class="logo"></router-link>
            <span :key="random_key">
                <el-menu
                    :default-active="index"
                    :active="index"
                    mode="horizontal"
                    text-color="#f5f5f5"
                    background-color="#6683b7"
                    router>
                    <el-submenu index="map">
                        <template slot="title">疫情地图</template>
                        <el-menu-item index="index_china" :route="{name: 'index'}">国内疫情</el-menu-item>
                        <el-menu-item index="index_world" :route="{name: 'index_world'}">世界疫情</el-menu-item>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title">数据分析</template>
                        <el-menu-item index="cross_data_p" :route="{name: 'cross_analysis', query: {type: 'province'}}">各省数据</el-menu-item>
                        <el-menu-item index="cross_data_c" :route="{name: 'cross_analysis', query: {type: 'country'}}">各国数据</el-menu-item>
                        <!-- <el-menu-item index="cross_data_predict" :route="{name: 'cross_analysis', query: {type: 'country'}}">数据预测</el-menu-item> -->
                        <el-menu-item index="diy" :route="{name: 'cross_diy'}">交叉分析</el-menu-item>
                    </el-submenu>
                    <el-submenu index="travel">
                        <template slot="title">出行风险</template>
                        <!-- <el-menu-item index="risk_train">风险车次</el-menu-item> -->
                        <el-menu-item index="start_and_end"
                                      :route="{name: 'travel_search_start_and_end'}">搜索始末地</el-menu-item>
                        <el-menu-item index="key" :route="{name: 'travel_search'}">搜索出行班次</el-menu-item>
                    </el-submenu>
                    <el-menu-item index="news" :route="{name: 'news'}">疫情新闻</el-menu-item>
                    <el-submenu index="protect">
                        <template slot="title">防疫行动</template>
                        <el-menu-item index="protect_policy" :route="{name: 'protect_policy'}">防疫政策</el-menu-item>
                        <el-menu-item index="protect_tips" :route="{name: 'protect_tips'}">防疫小知识</el-menu-item>
                        <el-menu-item index="protect_fake" :route="{name: 'protect_fake'}">辟谣专区</el-menu-item>
                    </el-submenu>
                    <el-menu-item index="forum" :route="{name: 'forum_index'}">问答平台</el-menu-item>
                    <el-menu-item v-if="false" index="forum" :route="{name: 'forum_index'}">智能问答</el-menu-item>
                    <!-- <el-menu-item index="6">交流论坛</el-menu-item> -->
                </el-menu>
            </span>
            <div class="user_info">
                <div @click="$refs.login.open()" v-if="!is_login">登录</div>
                <el-dropdown @command="click_dropdown" v-if="is_login">
                    <el-avatar :src="avatar"></el-avatar>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="user_info">个人信息</el-dropdown-item>
                        <el-dropdown-item command="change_password">修改密码</el-dropdown-item>
                        <el-dropdown-item command="logout">登出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <Login ref="login"
               @login_success="keep_login"
               @open_register="$refs.register.open()"/>
        <Register ref="register" @open_login="$refs.login.open()"/>
        <change_password ref="change_password"></change_password>
        <change_info ref="change_info" @refresh_info="refresh"></change_info>
    </div>
</template>

<script>
import Login from '@/components/login';
import Register from '@/components/register';
import change_password from "@/components/change-pwd";
import change_info from "@/components/change-info";

export default {
    name: 'Nav',

    components: {
        Login,
        Register,
        change_password,
        change_info,
    },

    mounted() {

    },

    destroyed() {

    },

    props: {},

    data() {
        return {
            random_key: 0,
            index: undefined,
            special: 0,
            w: '',
            beauty: false,
            is_login: false,
            avatar: '',
        }
    },

    watch: {
        $route() {
            this.refresh();
            this.set_active();
            this.special = 0;
        }
    },

    methods: {
        set_active() {
            this.random_key = Math.random();
            switch (this.$route.name) {
                case 'index_world':
                    this.index = 'index_world';
                    break;
                case 'index':
                    this.index = 'index_china';
                    break;
                case 'cross_analysis':
                    if (this.$route.query.type == 'province') {
                        this.index = 'cross_data_p';
                    } else if (this.$route.query.type == 'country') {
                        this.index = 'cross_data_c';
                    } else {
                        this.index = 'cross_analysis';
                    }
                    break;
                case 'cross_diy':
                    this.index = 'diy';
                    break;
                case 'news':
                    this.index = 'news';
                    break;
                case 'travel_search':
                    this.index = 'key';
                    break;
                case 'travel_search_start_and_end':
                    this.index = 'start_and_end';
                    break;
                case 'travel_train':
                case 'travel_plane':
                    this.index = 'travel';
                    break;
                case 'province_map':
                case 'city_map':
                    this.index = 'map';
                    break;
                case 'protect_policy':
                    this.index = 'protect_policy';
                    break;
                case 'protect_tips':
                    this.index = 'protect_tips';
                    break;
                case 'protect_fake':
                    this.index = 'protect_fake';
                    break;
                case 'forum_index':
                case 'forum_q':
                    this.index = 'forum';
                    break;
                default:
                    this.index = '0';
            }
        },

        click_head() {
            if (this.special > 10 || this.beauty) {
                this.beauty = true;
            } else {
                this.special++;
                console.log(this.special + '?');
            }
        },

        refresh() {
            this.keep_login();
        },
        keep_login() {
            this.ajax.get("/user_info", {}, this, {
                success: function (res) {
                    if (res.status == 0) {
                        if (res.uid) {
                            this.login_manager.set(
                                res.uid,
                                res.name,
                                res.avatar,
                                res.identity,
                            );
                            this.is_login = true;
                            this.avatar = res.avatar;
                        } else {
                            this.login_manager.clear();
                            this.is_login = false;
                            this.avatar = '';
                        }
                    }
                },
            });
        },
        click_dropdown(command) {
            switch (command) {
                case "logout":
                    this.ajax.post("/account/logout", {}, this, {
                        success: function (res) {
                            if (res.status == 0) {
                                this.login_manager.clear();
                                this.is_login = false;
                                this.avatar = "";
                            }
                        },
                    });
                    break;
                case "user_info":
                    this.change_info();
                    break;
                case "change_password":
                    this.change_pass();
                    break;
            }
        },
        change_info() {
            this.$refs.change_info.open();
        },
        change_pass() {
            this.$refs.change_password.open();
        }
    }
}
</script>

<style scoped>
:local {
    --color: #f5f5f5;
    --background-color: var(--color-t);
    --font-size-title: 17px;
}

.nav {
    height: var(--nav-height);
    /* border: solid 1px #000; */
    background-color: var(--background-color);
    position: relative;
    z-index: 10;
}

.nav.special {
    /* w */
    background-image: url('./../assets/head_bc.png');
    background-size: auto 90px;
    background-position: 96% 56%;
    background-repeat: no-repeat;
}

.bc {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw !important;
    height: 100%;
    background-image: url('./../assets/hbc.png');
    background-position: center;
    -webkit-pointer-events: none;
    -moz-pointer-events: none;
    -ms-pointer-events: none;
    -o-pointer-events: none;
    pointer-events: none;
    opacity: 0.56;
}

.nav > div {
    width: 1200px;
    margin: 0 auto;
    z-index: 1;
}

.nav > div > * {
    float: left;
}

.nav ul {
    background: unset;
    border: unset !important;
    margin: 0 10px 0 60px;
}

.nav ul li {
    width: 130px;
    text-align: center;
    margin: 0 5px;
    border: unset !important;
}

.nav ul li >>> .el-submenu__title {
    border: unset;
}

.nav ul li:hover, ul li >>> div:hover {
    background-color: var(--color-t-deep) !important;
}

.nav ul li, ul li >>> div {
    font-size: var(--font-size-title) !important;
}

.nav ul li >>> div i, .nav .el-menu-item.is-active, .nav >>> .el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
    color: var(--color) !important;
    border: unset;
}

.nav .el-menu-item.is-active, .nav >>> .el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
    background-color: var(--color-t-deep) !important;
}

.logo {
    margin: 0;
    padding: 0 10px;
    width: 123px;
    height: var(--nav-height);
    display: block;
}

.nav >>> .el-menu--horizontal .el-menu--popup {
    background-color: var(--background-color);
}

.user_info {
    position: absolute;
    right: 30px;
    top: 10px;
    cursor: pointer;
}

.user_info > div {
    padding: 0 15px;
    color: #fff;
    line-height: 40px;
}
</style>

<style>
.el-menu--popup {
    margin-left: -10px;
    width: 150px;
    min-width: 150px;
}

.el-menu--popup .el-menu-item {
    font-size: var(--font-size) !important;
    height: 45px !important;
    line-height: 45px !important;
    text-align: center;
}

.el-menu--popup .el-menu-item.is-active {
    color: var(--color) !important;
    background-color: var(--color-t-deep) !important;
}
</style>



// WEBPACK FOOTER //
// src/components/nav.vue