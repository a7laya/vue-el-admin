import $Util from '@/common/util.js'
export default {
	state: {
		sku_type: 0, // SKU类型 0 单一规格  1 多规格
		title: '', // 商品名称 
		category: [], // 分类
		desc: '',
		unit: '',
		stock: 0, // 总库存
		min_stock: 0, // 库存预警
		display_stock: 0, // 显示库存
		status: 0, // 是否上架
		express: '',
		
		// 单一规格
		oprice: 0, // 市场价 - 原价
		pprice: 0, // 销售价 - 现价
		cprice: 0, // 成本价
		weight: 0, // 重量
		volume: 0, // 体积
		
		// 多规格卡片
		sku_card: [
			{
				name: "", // 规格名称
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
		// 修改state
		vModelState(state,{key,value}){
			state[key] = value
		},
		// 增加规格卡片
		addSkuCard(state){
			state.sku_card.push({
				name: "名称", // 规格名称
				type: 0,      // 规格类型 0无 1颜色 2图片
				list:[        // 规格属性列表
					{
						name: '', // 文字
						color: '', // 颜色
						image: '', // 图片
					}
				]
			})
		},
		// 删除规格卡片
		delSkuCard(state,index){
			state.sku_card.splice(index,1)	
		},
		// 修改规格卡片
		vModelSkuCard(state, { key,index,value }){
			state.sku_card[index][key] = value
		},
		// 规格卡片排序
		sortSkuCard(state, {action,index}){
			$Util[action](state.sku_card, index)
		}
	},
	actions: {
		
	}
}