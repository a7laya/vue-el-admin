import Vue from "vue"
import Router from "vue-router"
import routes from "./common/config/router.js"

Vue.use(Router)

let router = new Router({ routes })

// 全局前置守卫
router.beforeEach((to, from, next) => {
	// console.log('to:',to)
	// console.log('from:',from)
	// console.log('next:',next)
	let token = window.sessionStorage.getItem('token')
	if(token){
		// 已登录 
		// 防止重复登录
		if(to.name === 'login') {
			Vue.prototype.$message.error('请勿重复登录！');
			return next({name: from.name ? from.name : 'index'});
		}
		// 放行或继续其他验证
		next();
	} else {
		// 如果即将进入的页面为登录页，那么跳过守卫
		if(to.name === 'login') return next();
		
		// 未登录 跳到登录页
		Vue.prototype.$message.error('请先登录！')
		next({path:'/login'})
	}
})

export default router