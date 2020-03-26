export default {
	state: {
		sku_type: 0, // SKU类型 0 单一规格  1 多规格
		title: '', // 商品名称 
		category: [], // 分类
		desc: '',
		unit: '',
		stock: 1, // 总库存
		min_stock: 0, // 库存预警
		display_stock: 0, // 显示库存
		status: 0, // 是否上架
		express: '',
		
		// 单一规格
		oprice: 1, // 市场价 - 原价
		pprice: 1, // 销售价 - 现价
		cprice: 1, // 成本价
		weight: 1, // 重量
		volume: 1, // 体积
		
		// 多规格卡片
		sku_card: [
			{
				name: "色调", // 规格名称
				type: 0,      // 规格类型 0无 1颜色 2图片
				list:[        // 规格属性列表
					{
						name: '蓝色', // 文字
						color: '', // 颜色
						image: '', // 图片
					}
				]
			}
		]
		
		
		
		
	},
	getters: {
		
	},
	mutations: {
		vModelState(state,{key,value}){
			state[key] = value
		}
	},
	actions: {
		
	}
}