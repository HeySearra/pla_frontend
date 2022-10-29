import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import vuetify from './plugins/vuetify'
import './plugins'
import store from './store'
import { sync } from 'vuex-router-sync'
import * as echarts from 'echarts'
import vuex from 'vuex'

// element-ui config
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI);
Vue.config.productionTip=false

Vue.use(vuex)
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.get['Content-Type'] = 'application/json'
// axios.defaults.headers.common['Authorization'] = localStorage.getItem('Authorization')

axios.interceptors.request.use(config => {
  // config.baseURL = 'http://10.251.254.107:8081'
  config.baseURL = ' http://127.0.0.1:8000'
  config.withCredentials = false // 允许携带token ,这个是解决跨域产生的相关问题
  config.timeout = 10000
  const token = sessionStorage.getItem('token')
  if (token) {
    config.headers.common.authorization = token
  } else {
    config.headers.common.authorization = ''
  }
  return config
})

axios.interceptors.response.use(res => {
  return res
})

Vue.prototype.$echarts = echarts
Vue.prototype.$axios = axios
axios.defaults.withCredentials = true
Vue.config.productionTip = false

sync(store, router)

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App),
}).$mount('#app')
