import { createApp, ref } from 'vue'
import App from '@/App.vue'

// style sheet
import './design/ele.less'
import '../style.less'
import 'animate.css'

// progress bar
import 'nprogress'
import 'nprogress/nprogress.css'

// router
import router from '@/route'

// pinia
import { createPinia } from 'pinia'
const pinia = createPinia()

const MainApp = createApp(App)
MainApp.use(router)
MainApp.use(pinia)
MainApp.provide('piniaInstance', pinia)
MainApp.provide('socketInstance', ref({}))
MainApp.mount('#app')
