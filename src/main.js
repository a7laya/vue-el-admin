import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import './plugins/element.js'
import router from "./router.js"
import store from './store'
import { Message } from 'element-ui'
// import "./common/css/bootstrap.css"


// 页面的加载效果，防止数据过多卡滞用户体验不好
let loading = null
let requestCount = 0 // 请求数，判断用户是不是在一个按钮连续点了两次
// 显示loading
function showLoading(){
	if(requestCount > 0) return
	loading = Message({
		message: '加载中...',
		center: true,
		duration: 0  // 配置不自动消失
	})
	requestCount++
}
// 隐藏loading
function hideLoading(){
	if(requestCount > 0) requestCount--
	if(loading && requestCount===0) return loading.close()
}

// 添加请求拦截器
axios.interceptors.request.use( config =>{
	// 全局添加headers里的token
	let token = window.sessionStorage.getItem('token')
	if(config.token === true) {
		config.headers['token'] = token
	}
	console.log("请求拦截成功:")
	// 发送请求之前做什么
	if(config.loading === true) showLoading()
	return config
}, err => {
	// 对请求错误做什么
	hideLoading()
	return Promise.reject(err)
})

// 添加响应拦截器
axios.interceptors.response.use( response =>{
	console.log("响应拦截成功")
	// 对响应数据做什么
	hideLoading()
	return response
}, err => {
	console.log("响应拦截失败")
	// 全局错误提示
	if(err.response && err.response.data && err.response.data.errorCode){
		Message.error(err.response.data.msg)
	}
	// 处理响应错误
	hideLoading()
	return Promise.reject(err)
})


// 引入拖拽排序
import VueDND from 'awe-dnd'
Vue.use(VueDND)

// 引入全局配置文件
import $conf from "./common/config/config.js"
Vue.prototype.$conf = $conf


// 配置全局指令
Vue.directive('auth', {
	inserted(el, binding, vnode, oldVnode){
		let user = window.sessionStorage.getItem('user')
		user = user ? JSON.parse(user) : {}
		
		// user.super === 1 表示该账户为超级管理员,那么跳过验证
		if(user.super) return 
		
		// 执行权限验证
		let rules = user.ruleNames || []
		let v = rules.find(item => item === binding.value)
		if(!v){
			// 验证失败 移除dom
			el.remove()
		}
		
		// console.log("==== inserted ====")
		// console.log("el:",el)
		// console.log("binding:",binding)
		// console.log("vnode:",vnode)
		// console.log("oldVnode:",oldVnode)
	},
})


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
