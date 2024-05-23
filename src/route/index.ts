import { createRouter, createMemoryHistory, RouteRecordRaw } from 'vue-router'
import Login from '@/components/Login.vue'
import MainWrap from '@/components/MainWrap.vue'
import NotFound from '@/components/NotFound.vue'

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
        path:'/mainwrap',
        component: MainWrap
    },
    {
        path: '/404', // 页面不存在的情况下会跳到404页面
        component: NotFound
    },
    {
        path: '/.*', // 页面不存在的情况下会跳到404页面
        redirect: '/404',
        name: 'notFound'
    }
    
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    // 开启进度条
	NProgress.start();
    // 获取Token
    if(to.path != '/'){
        let isLogin = sessionStorage.getItem('securityToken');
        if (isLogin) {
            //如果用户信息存在则往下执行。
            next()
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