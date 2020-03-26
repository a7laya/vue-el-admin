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
					{ icon: "el-icon-s-unfold", name: "商品列表",  pathname: "shop_goods_list"}
				]
			},
			{ 
				name: '商品',
				subActive: '0',
				subMenu: [
					{ icon: "el-icon-document-add", name: "创建商品",  pathname: "shop_goods_create"},
					{ icon: "el-icon-s-unfold", name: "商品列表2",  pathname: "shop_goods_list2"},
				]
			},
			{ 
				name: '订单',
				subActive: '0',
				subMenu: [
					{ icon: "el-icon-s-unfold", name: "商品列表3",  pathname: "shop_goods_list"},
				]
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