<!-- 规格属性列表 -->
<template>
	<div class="border px-2 py-1 rounded mr-2 mb-2 position-relative d-flex align-items-center">
		<div v-if="type != 0">
			<!-- 颜色选择器 -->
			<el-color-picker v-if="type === 1" size="mini"
			v-model="item.color" @change='chooseColor'></el-color-picker>
			<!-- 图片选择器 -->
			<template v-else>
				<span  v-if='!item.image' class="btn btn-light p-1" style="line-height: 1;"
				@click="chooseImage">
					<i class="el-icon-plus"></i>
				</span>
				<img v-else :src="item.image" class="rounded" 
				style="width: 45px; height: 45px; cursor: pointer;"
				@click="chooseImage"/>
			</template>
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
		inject:['app'],
		props: {
			// 卡片内规格的的表示方法 0 文字  1 颜色  2 图片
			type: {
				type: Number,
				default: 0
			}, 
			index1: Number, // 卡片的index
			index2: Number, // 卡片内规格列表的index
			item: Object
		},
		methods:{
			...mapMutations(['delSkuValue','updateSkuValue']),
			delValue(){
				this.delSkuValue({cardIndex:this.index1,valueIndex:this.index2})
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
			},
			// 选择图片
			chooseImage(){
				this.app.chooseImage(res=>{
					this.vModel('image', res[0].url)
				}, 1)
			},
			// 选择颜色
			chooseColor(e){
				console.log("e:",e)
				// this.vModel('color', item.color)
			}
		}
	}
</script>

<style>
</style>
