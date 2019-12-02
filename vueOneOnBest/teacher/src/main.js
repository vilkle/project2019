import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 按需引入 element-ui
import 'element-ui/lib/theme-chalk/index.css'
// import 'element-ui/lib/theme-chalk/reset.css'
import element from './plugins/element-ui'
Vue.use(element)

// 引入封装好的 axios
import axios from './plugins/axios'
Vue.use(axios)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
