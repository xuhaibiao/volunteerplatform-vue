import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/font/iconfont.css'
import axios from 'axios'
import echarts from 'echarts'


Vue.prototype.$echarts = echarts

// 挂载axios 到Vue的原型prototype的$http
Vue.prototype.$http = axios
// 设置请求的根路径
axios.defaults.baseURL = "http://localhost:9000/"

Vue.config.productionTip = false




new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
