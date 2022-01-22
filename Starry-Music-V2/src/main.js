import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './plugins/element'
import { request } from './request/request'

import './assets/css/base.css'
import 'element-ui/lib/theme-chalk/index.css'

Vue.prototype.$request = request

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app')
