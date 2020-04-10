export default {
	state: {
		navBar: {
			active: '0',
			list: []
		}
	},
	getters: { 
		
	},
	mutations: {
		// 创建菜单
		createNavBar(state, menus){
			let list = menus.map(item => {
				let subMenu = item.child.map(v=>{
					return {
						icon: v.icon,
						name: v.name,
						pathname: v.desc
					}
				})
				return {
					name: item.name,
					subActive: '0',
					subMenu,
				}
			})
			state.navBar.list = list
			// 本地存一份
			window.sessionStorage.setItem('navBar',JSON.stringify(state.navBar))
		}
	},
	actions: {
		
	}
}