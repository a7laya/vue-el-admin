<template>
	<el-form ref="form" label-width="80px">
		<el-form-item label="添加规格">
			<div class="card mb-3" style="line-height: 1;"
			v-for="(item,index) in sku_card" :key='index'>
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
					<el-button :disabled="index === sku_card.length - 1" icon="el-icon-bottom" size="mini" class="px-2" @click='sortCard("moveDown",index)'></el-button>
					<!-- 删除 -->
					<el-button type="text" size="mini" @click='delSkuCard(index)'>删除</el-button>
				</div>
				<div class="card-body">
					<!-- 规格属性列表 -->
					<div class="d-flex align-items-center flex-wrap">
						<div class="border px-4 py-2 rounded">黄色</div>
						
					</div>
					<!-- todo -->
					
					<!-- 增加规格属性 -->
					<div>
						<el-button type="text" size="mini" icon="el-icon-plus">增加规格值
						</el-button>
					</div>
				</div>
			</div>
			<el-button type="success" size="mini" @click='addSkuCard'>添加规格</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
	import { mapState,mapMutations } from 'vuex'
	export default {
		data(){
			return {
				
			}
		},
		computed: {
			...mapState({
				sku_card: state => state.goods_create.sku_card
			})
		},
		methods: {
			...mapMutations(['addSkuCard','delSkuCard','vModelSkuCard','sortSkuCard']),
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
