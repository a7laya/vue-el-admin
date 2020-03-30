<template>
	<div class="card mb-3" style="line-height: 1;">
		<div class="card-header d-flex align-items-center">
			规格项：
			<el-input size="mini" :value="item.name"  @input="vModel('name', index, $event)" placeholder="输入规格名称" class="mr-2" style="width: 200px;">
				<el-button slot='append' icon="el-icon-more"></el-button>
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
			<el-button type="text" size="mini" @click='delSkuCard(index)'>删除</el-button>
		</div>
		<div class="card-body">
			<!-- 规格属性列表 -->
			<div class="d-flex align-items-center flex-wrap">
				<sku-card-children v-for="(item2,index2) in list" :key='index2' :type="item.type" :item='item2' :index1='index' :index2='index2'
				v-dragging='{item: item2, list: list, group: "index" + index}'></sku-card-children>
			</div>
			<!-- 增加规格属性 -->
			<div class="mt-2">
				<el-button type="text" size="mini" icon="el-icon-plus" @click='addSkuValue(index)'>增加规格值
				</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapState,mapMutations } from 'vuex'
	// 引入规格属性列表组件
	import skuCardChildren from './sku-card-children.vue'
	export default {
		components: {skuCardChildren},
		mounted() {
			// 监听拖拽的结束
			// this.$dragging.$on('dragend', (e) => {
			// 	this.sotrSkuValue({
			// 		cardIndex: this.index,
			// 		value: this.list
			// 	})
			// })
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
		methods: {
			...mapMutations(['sotrSkuValue','delSkuCard','vModelSkuCard','sortSkuCard','addSkuValue']),
			vModel(key, index, value){
				this.vModelSkuCard({key, index, value})
			},
			// 规格卡片排序
			sortCard(action, index){
				this.sortSkuCard({action, index})
			}
		}
	}
</script>

<style>
</style>
