<template>
	<el-form ref="form" label-width="80px">
		<el-form-item label="市场价">
			<el-input type="number" :value="oprice" @input="vModel('oprice',$event)" placeholder="请输入市场价" class="w-25">
				<template slot='append'>元</template>
			</el-input>
		</el-form-item>
		<el-form-item label="销售价">
			<el-input type="number" :value="pprice" @input="vModel('pprice',$event)" placeholder="请输入销售价" class="w-25">
				<template slot='append'>元</template>
			</el-input>
		</el-form-item>
		<el-form-item label="成本价">
			<el-input type="number" :value="cprice" @input="vModel('cprice',$event)" placeholder="请输入成本价" class="w-25">
				<template slot='append'>元</template>
			</el-input>
		</el-form-item>
		<el-form-item label="重量">
			<el-input type="number" :value="weight" @input="vModel('weight',$event)" placeholder="请输入重量" class="w-25">
				<template slot='append'>克</template>
			</el-input>
		</el-form-item>
		<el-form-item label="体积">
			<el-input type="number" :value="volume" @input="vModel('volume',$event)" placeholder="请输入体积" class="w-25">
				<template slot='append'>ml</template>
			</el-input>
		</el-form-item>
		<el-form-item label="总库存">
			<el-input type="number" :value="stock" @input="vModel('stock',$event)" placeholder="请输入总库存" class="w-25">
				<template slot='append'>件</template>
			</el-input>
		</el-form-item>
	</el-form>
</template>

<script>
	import {mapState, mapMutations} from 'vuex'
	export default {
		data() {
			return {
			};
		},
		computed:{
			...mapState({
				// 单一规格
				oprice: state=>state.goods_create.oprice, // 市场价 - 原价
				pprice: state=>state.goods_create.pprice, // 销售价 - 现价
				cprice: state=>state.goods_create.cprice, // 成本价
				weight: state=>state.goods_create.weight, // 重量
				volume: state=>state.goods_create.volume, // 体积
				stock:	state=>state.goods_create.stock,
			}),
		},
		methods: {
			...mapMutations(['vModelState']),
			// 修改表单的值
			vModel(key, value){
				this.vModelState({key, value})
			}
		}
	};
</script>

<style>
</style>
