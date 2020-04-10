export default {
	state: {
		user: {},
		token: {}
	},
	getters: { 
		
	},
	mutations: {
		// 初始化用户信息 把这个方法放到app.vue的created生命周期内
		initUser(state){
			let user = window.sessionStorage.getItem('user')
			if(user){
				state.user = JSON.parse(user)
				state.token = state.user.token
			}
		},
		// 登录
		login(state, user){
			// 保存登录状态
			state.user = user
			state.token = user.token
			// 存入本地
			window.sessionStorage.setItem('user',JSON.stringify(state.user))
			window.sessionStorage.setItem('token',state.token)
		},
		// 退出登录 清除状态
		logout(state){
			// 清除状态
			state.user = {}
			state.token = false
			// 清除本地存储
			window.sessionStorage.clear()
		}
	},
	actions: {
		
	}
}