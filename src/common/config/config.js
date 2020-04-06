export default {
	logo: "UNI-ADMIN1",
	navBar: {
		active: '0',
		list: [
			{ 
				name: '首页',
				subActive: '0',
				subMenu: [
					{ icon: "el-icon-s-home", name: "后台首页", pathname: "index"},
					{ icon: "el-icon-picture", name: "相册管理", pathname: "image"},
				]
			},
			{ 
				name: '商品',
				subActive: '0',
				subMenu: [
					{ icon: "el-icon-s-unfold", name: "商品列表",  pathname: "shop_goods_list"},
					{ icon: "el-icon-s-help", name: "分类管理",  pathname: "shop_category_list"},
					{ icon: "el-icon-s-help", name: "商品规格管理",  pathname: "shop_sku_list"},
				]
			},
			{ 
				name: '订单',
				subActive: '0',
				subMenu: []
			},
			{ 
				name: '会员',
				subActive: '0',
				subMenu: []
			},
			{ 
				name: '设置',
				subActive: '0',
				subMenu: []
			}
		]
	}
}