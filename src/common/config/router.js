/**
 * 规则：
 * 一、例如：index/index, shop/index以index结尾的，path和name属性默认去除/index
 * 二、例如：shop/list，默认生成name为shop_list
 * 三、填写后不会自动生成
 * **/ 

let routes = [
		{
			// path: '/',
			// name: 'layout',
			// component: ()=>import('../../views/layout.vue'),
			component: "layout",
			redirect: { name: 'index' }, // 重定向
			children: [
				{
					// path: '/index',
					// name: 'index',
					meta: { title:"后台首页" },
					component: "index/index"
				},
				{	
					meta: { title:"商品列表" },
					component: "shop/goods/list"
				},
				{	
					meta: { title:"创建商品" },
					component: "shop/goods/create"
				},
				{	
					meta: { title:"相册管理" },
					component: "image/index"
				},
				{	
					meta: { title:"分类管理" },
					component: "shop/category/list"
				},
				{	
					meta: { title:"商品规格" },
					component: "shop/sku/list"
				},
				{	
					meta: { title:"商品类型" },
					component: "shop/type/list"
				}
			]
		},
		{
			meta: { title:"登录页" },
			component: "login/index"
		},
		{
			path: '*',
			redirect: {name: 'index'}
		}
	]

// 获取路由信息的方法
let getRoutes = function () {
	// 生成路由详细信息
	createRoute(routes)
	return routes
}


// 自动生成路由模板
function createRoute(arr) {
	for (let i = 0; i < arr.length; i++) {
		if(!arr[i].component) return
		// 去除index
		let str = getValue(arr[i].component)
		// 生成name
		arr[i].name = arr[i].name || str.replace(/\//g,'_')
		// 生成path
		arr[i].path = arr[i].path || `/${str}`
		// 自动生成component
		let componentFun = import(`../../views/${arr[i].component}.vue`)
		arr[i].component = ()=>componentFun
		if(arr[i].children && arr[i].children.length > 0) createRoute(arr[i].children)
	}
}


// 去除index结尾的方法
function getValue(str){
	let arr = str.split('/')
	if(arr.pop() === 'index') return arr.join('/')
	return str
}

export default getRoutes()
