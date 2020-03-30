<!-- 规格属性列表 -->
<template>
	
		<div class="border px-2 py-1 rounded mr-2 mb-2 position-relative d-flex align-items-center">
			<div v-if="type != 0">
				<!-- 颜色选择器 -->
				<el-color-picker v-if="type === 1" size="mini"></el-color-picker>
				<!-- 图片选择器 -->
				<span v-else class="btn btn-light p-1" style="line-height: 1;">
					<i class="el-icon-plus"></i>
				</span>
			</div>
			<input @input="inputChange" :value='item.name' class="form-control text-center border-0" style="width: 80px;height: 30px; font-size: 12px;" />
			<span class="btn btn-light p-0 position-absolute" 
			style="line-height: 1; cursor: pointer; right: -10px;top: -10px;"
			@click="delValue">
				<i class="el-icon-circle-close"></i>
			</span>
		</div>

</template>

<script>
	import {mapMutations} from 'vuex'
	export default {
		props: {
			type: Number,
			index1: Number,
			index2: Number,
			item: Object
		},
		methods:{
			...mapMutations(['delSkuValue','updateSkuValue']),
			delValue(){
				let index1 = this.index1
				let index2 = this.index2
				this.delSkuValue({index1,index2})
			},
			vModel(key, value){
				this.updateSkuValue({
					cardIndex: this.index1,
					valueIndex: this.index2,
					key: key,
					value: value,
				})
			},
			inputChange(e){
				this.vModel('name', e.target.value)
			}
		}
	}
</script>

<style>
</style>
