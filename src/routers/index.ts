import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import { globalStore } from '@/store'
import routerConfig from '@/routers/router-config';
import { errorRouter } from './router-config/error';
import NProgress from "@/config/nprogress";

/**
 * @description 📚 路由参数配置简介
 * @param path ==> 菜单路径
 * @param name ==> 菜单唯一命名
 * @param redirect ==> 重定向地址
 * @param component ==> 视图文件路径
 * @param meta ==> 菜单信息
 * @param meta.icon ==> 菜单图标
 * @param meta.title ==> 菜单标题
 * @param meta.hidden ==> 是否隐藏
 * @param meta.isKeepAlive ==> 是否缓存
 * */

let allRoutes: any = [];
routerConfig.forEach((item: any) => {
    allRoutes = allRoutes.concat(item.routes);
});
const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/login/index.vue'),
    },
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/',
        name: 'Main',
        component: () => import('../views/index.vue'),
        redirect: '/home',
        children: allRoutes,
    }
]
const routers = createRouter({
    history: createWebHistory(), // createWebHashHistory (hash)
    routes: [...routes, ...errorRouter],
    strict: false,
    scrollBehavior: () => ({ left: 0, top: 0 })
})
/* 路由权限方案：挂载所有路由 + 全局路由守卫判断权限 */
routers.beforeEach((to, from, next) => {
    /** 1.获取store */
    const myStore = globalStore()
    
    /** 2.开启进度条 */
    NProgress.start();

    /** 3.判断是否是访问登陆页，有 Token 就在当前页面，没有 Token 重置路由到登陆页 */
    if (to.path.toLocaleLowerCase() === '/login') {
        if (myStore.userInfo.token) return routers.back();
        return next();
    }
    
    /** 4.判断是否有 Token，没有重定向到 login 页面 */
    if (!myStore.userInfo.token) {
        return next({ path: '/login', replace: true });
    }

    /** 5.正常访问页面 */
    next()
})
/** 路由跳转结束 */
routers.afterEach(() => {
	NProgress.done();
});

/** 路由跳转错误 */
routers.onError(error => {
	NProgress.done();
	console.warn("路由错误", error.message);
});

export default routers;