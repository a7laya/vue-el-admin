<template>
	<div class="card mb-3" style="line-height: 1;">
		<div class="card-header d-flex align-items-center">
			规格项：
			<el-input size="mini" :value="item.name"  @input="vModel('name', index, $event)" placeholder="输入规格名称" class="mr-2" style="width: 200px;">
				<el-button slot='append' icon="el-icon-more" @click="chooseSkus"></el-button>
			</el-input>
			
			<el-radio-group style="margin-bottom: -10px;" :value='item.type'  @input="vModel('type', index, $event)">
				<el-radio :label="0">无</el-radio>
				<el-radio :label="1">颜色</el-radio>
				<el-radio :label="2">图片</el-radio>
			</el-radio-group>
			<!-- 上移 -->
			<el-button :disabled="index === 0" icon="el-icon-top" size="mini" class="ml-auto px-2" @click='sortCard("moveUp",index)'></el-button>
			<!-- 下移 -->
			<el-button :disabled="index === total - 1" icon="el-icon-bottom" size="mini" class="px-2" @click='sortCard("moveDown",index)'></el-button>
			<!-- 删除 -->
			<el-button type="text" size="mini" @click='delSkuCardEvent'>删除</el-button>
		</div>
		<div class="card-body">
			<!-- 规格属性列表 -->
			<div class="d-flex align-items-center flex-wrap">
				<sku-card-children v-for="(item2,index2) in item.list" :key='index2' :type="item.type" :item='item2' :index1='index' :index2='index2'
				v-dragging='{item: item2, list: list, group: "index" + index}'></sku-card-children>
			</div>
			<!-- 增加规格属性 -->
			<div class="mt-2">
				<el-button type="text" size="mini" icon="el-icon-plus" @click='addSkuValueEvent'>增加规格值
				</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapState,mapMutations } from 'vuex'
	// 引入规格属性列表组件
	import skuCardChildren from './sku-card-children.vue'
	
	let defaultValue = ['属性值', '#FFFFFF', '/assets/avatar.png']
	export default {
		inject: ['app','layout'],
		components: {skuCardChildren},
		mounted() {
			// 监听拖拽的结束
			this.$dragging.$on('dragend', (e) => {
				console.log("e:",e)
				this.sotrSkuValue({
					cardIndex: this.index,
					value: this.list
				})
				let url = "/admin/goods_skus_card_value/sort"
				let obj = {
					sortdata: this.list.map((item,index) => {
						return {
							id: item.id,
							order: index + 1
						}
					})
				}
				this.axios.post(url,obj,{token: true})
			})
		},
		props: {
			item: Object,
			index: Number,
			total: Number
		},
		data(){
			return {
				list: this.item.list
			}
		},
		computed:{
			...mapState({
				sku_card: state => state.goods_create.sku_card
			})
		},
		methods: {
			...mapMutations(['sotrSkuValue','delSkuCard','vModelSkuCard','sortSkuCard','addSkuValue']),
			// 重写添加规格卡片里面的规格值
			addSkuValueEvent(value = false){
				let url = `/admin/goods_skus_card_value`
				let obj = {
					goods_skus_card_id: this.item.id, // 商品规格卡片id
					name: this.item.name, // 商品规格卡片的名称
					order: 50, // 排序
					value: typeof value === 'string' ? value : defaultValue[this.item.type], // 属性值
				}
				this.layout.showLoading()
				this.axios.post(url,obj,{token: true}).then(res=>{
					let data = res.data.data
					data.text = this.item.type === 0 ? data.value : defaultValue[0]
					data.color = this.item.type === 1 ? data.value : defaultValue[1]
					data.image = this.item.type === 2 ? data.value : defaultValue[2]
					this.addSkuValue({
						index: this.index,
						data
					})
					console.log("data:",data)
					console.log("this.sku_card:",this.sku_card)
					this.layout.hideLoading()
				}).catch(err => {
					this.layout.hideLoading()
				})
			},
			// 重写删除规格卡片
			delSkuCardEvent(){
				this.$confirm(`是否删除卡片"${this.item.name}"?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
						let url = `/admin/goods_skus_card/${this.item.id}/delete`
						let obj = {}
						this.layout.showLoading()
						this.axios.post(url,obj,{token: true}).then(res=>{
							let data = res.data.data
							this.delSkuCard(this.index)
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
							this.layout.hideLoading()
						}).catch(err => {
							this.layout.hideLoading()
						})
					})
				
			},
			updataSkuCard(){
				let url = `/admin/goods_skus_card/${this.item.id}`
				let obj = {...this.item}
				this.axios.post(url,obj,{token: true}).then(res=>{
					console.log("updataSkuCard:",res)
				})
			},
			vModel(key, index, value){
				this.vModelSkuCard({key, index, value})
				// 卡片值改变时，即更新skucard
				this.updataSkuCard()
			},
			// 规格卡片排序
			sortCard(action, index){
				this.sortSkuCard({action, index})
				let url = "/admin/goods_skus_card/sort"
				let obj = {
					sortdata: this.sku_card.map((item,index) => {
						return {
							id: item.id,
							order: index + 1
						}
					})
				}
				this.axios.post(url,obj,{token: true})
			},
			// 选择规格
			chooseSkus(){
				this.app.chooseSkus(res=>{
					this.vModel('name', this.index, res.name)
					this.vModel('type', this.index, res.type)
					res.list.forEach(v => {
									this.addSkuValueEvent(v.name)
								})
				})
			}
		}
	}
</script>

<style>
</style>
