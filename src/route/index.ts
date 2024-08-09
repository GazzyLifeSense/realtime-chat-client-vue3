import { createRouter, RouteRecordRaw, createWebHistory } from 'vue-router'
import Login from '@/pages/Login.vue'
import ChatApp from '@/pages/ChatApp.vue'
import NotFound from '@/pages/NotFound.vue'

//引入nprogress 进度条插件
import NProgress from 'nprogress'

const routes: RouteRecordRaw[] = [
    {        
        path:'/',
        name: 'Login',
        component: Login,
    },
    {
        name: 'main',
        path:'/chatApp',
        component: ChatApp
    },
    {
        path: '/404', // 页面不存在的情况下会跳到404页面
        component: NotFound
    },
    {
        path: '/:pathMatch(.*)*', // 页面不存在的情况下会跳到404页面
        redirect: '/404',
        name: 'notFound'
    }
    
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, _from, next) => {
    // 开启进度条
	NProgress.start();
    // 获取Token
    if(to.path != '/'){
        let isLogin = sessionStorage.getItem('securityToken');
        if (isLogin) {
            //如果用户信息存在则往下执行。
            next()
            return
        } else {
            //如果用户token不存在拦截跳转
            return
        }   
    }
    next()
})

// 页面路由切换完毕的时候
router.afterEach(() => {
	// 关闭进度条
    NProgress.done()
})

export default router