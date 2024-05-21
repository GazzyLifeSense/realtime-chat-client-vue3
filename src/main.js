import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'

// style sheet
import './design/ele.less'
import '../style.less'
import 'animate.css'

// progress bar
import 'nprogress'
import 'nprogress/nprogress.css'

// element ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// router
import router from './route'

// state manager
import store from './store'

Vue.prototype.$axios = axios
Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate(){
    Vue.prototype.$bus = this
  }
}).$mount('#app')