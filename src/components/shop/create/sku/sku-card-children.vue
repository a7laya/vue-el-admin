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
		<input v-if="type === 0" @input="inputChange" :value='item.text' class="form-control text-center border-0" style="width: 80px;height: 30px; font-size: 12px;" />
		<span class="btn btn-light p-0 position-absolute" 
		style="line-height: 1; cursor: pointer; right: -10px;top: -10px;"
		@click="delSkuValueEvent">
			<i class="el-icon-circle-close"></i>
		</span>
	</div>
</template>

<script>
	import {mapMutations} from 'vuex'
	let defaultValue = ['属性值', '#FFFFFF', '/assets/avatar.png']
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
		watch:{
			type(newVal, oldVal) {
				let keys = ['text', 'color', 'image']
				this.item.value = this.item[keys[newVal]] ||  defaultValue[newVal]
				this.updateSkuValueEvent()
			}
		},
		methods:{
			...mapMutations(['delSkuValue','updateSkuValue']),
			// 重写修改规格卡片里面属性值的事件
			updateSkuValueEvent(){
				let keys = ['text', 'color', 'image']
				this.item.value = this.item[keys[this.type]]
				let url = "/admin/goods_skus_card_value/" + this.item.id
				let obj = {...this.item}
				this.axios.post(url,obj,{token: true})
			},
			// 重写删除规格卡片里面属性值的事件
			delSkuValueEvent(){
				this.$confirm(`是否删除属性"${this.item.text}"?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
						let url = `/admin/goods_skus_card_value/${this.item.id}/delete`
						let obj = {}
						this.axios.post(url,obj,{token: true}).then(res=>{
							let data = res.data.data
							this.delValue()
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
						})
					})
			},
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
				this.updateSkuValueEvent()
			},
			inputChange(e){
				this.vModel('text', e.target.value)
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
