<template>
	<div>
		<router-link :to="{ name: 'shop_goods_list' }" style="position: absolute; top: 3px; left: 200px;"><el-button size="mini">回到商品列表</el-button></router-link>
		<div class="bg-white h-100 px-3 py-2 goods_create" style="margin:-8px -20px 20px -20px; ">
			<el-tabs v-model="tabIndex" @tab-click="handleClick">
				<!--=========== 基础设置tab ===========-->
				<el-tab-pane label="基础设置" class="bg-white"><base-create></base-create></el-tab-pane>

				<!--=========== 商品规格tab ===========-->
				<el-tab-pane label="商品规格" class="bg-white">
					<!-- 规格选项 -->
					<el-form>
						<el-form-item label="商品规格">
							<el-radio-group size="medium" :value="sku_type" @input="vModel('sku_type', $event)">
								<el-radio-button :label="0">单一规格</el-radio-button>
								<el-radio-button :label="1">多规格</el-radio-button>
							</el-radio-group>
						</el-form-item>
					</el-form>
					<!-- 单一规格 -->
					<single-attrs v-show="sku_type === 0"></single-attrs>
					<!-- 多规格 -->
					<el-form ref="form" label-width="80px" v-show="sku_type === 1">
						<!-- 规格卡片 -->
						<el-form ref="form" label-width="80px">
							<el-form-item label="添加规格">
								<sku-card v-for="(item, index) in sku_card" :key="index" :item="item" :index="index" :total="skuCardTotal"></sku-card>
								<el-button type="success" size="mini" @click="addSkuCard">添加规格</el-button>
							</el-form-item>
						</el-form>

						<el-form-item label="批量设置">
							<el-button type="text">销售价</el-button>
							<el-button type="text">市场价</el-button>
							<el-button type="text">成本价</el-button>
							<el-button type="text">库存</el-button>
							<el-button type="text">体积</el-button>
							<el-button type="text">重量</el-button>
						</el-form-item>

						<!-- 规格排列组合表格 -->
						<el-form-item label="规格设置">
							<sku-table></sku-table>
						</el-form-item>
						
					</el-form>
				</el-tab-pane>
				<!--=========== 商品属性tab ===========-->
				<el-tab-pane label="商品属性" class="bg-white"></el-tab-pane>
				<!--=========== 媒体设置tab ===========-->
				<el-tab-pane label="媒体设置" class="bg-white"></el-tab-pane>
				
				<!--=========== 商品详情tab ===========-->
				<el-tab-pane label="商品详情" class="bg-white"></el-tab-pane>
				<!-- 引入富文本编辑器 -->
				<tinymce ref="editor" v-model='msg' @onClick="onClick" />
				
				
				<!--=========== 折扣设置tab ===========-->
				<el-tab-pane label="折扣设置" class="bg-white"></el-tab-pane>
				<div style="height: 60px;"></div>
			</el-tabs>
		</div>
	</div>
</template>

<script>
import baseCreate from '@/components/shop/create/base-create.vue';
import singleAttrs from '@/components/shop/create/single-attrs.vue';
import skuCard from '@/components/shop/create/sku/sku-card.vue';
import skuTable from '@/components/shop/create/sku-table.vue';
// 富文本编辑器
import tinymce from '@/components/common/tinymce.vue'

import { mapState, mapMutations } from 'vuex';
export default {
	components: { baseCreate, singleAttrs, skuCard, skuTable, tinymce },
	data() {
		return {
			tabIndex: 0,
			multipleSelection: [], // 选中的数据
			tableData: [],
			msg: 'tinymce',
		};
	},
	computed: {
		...mapState({
			// 规格选择开关
			sku_type: state => state.goods_create.sku_type, // 0 单一规格  1 多规格
			sku_card: state => state.goods_create.sku_card
		}),
		// 规格卡片的总数
		skuCardTotal() {
			return this.sku_card.length;
		}
	},
	methods: {
		...mapMutations(['addSkuCard', 'vModelState']),
		// 修改表单的值
		vModel(key, value) {
			this.vModelState({ key, value });
		},
		// 点击tab加载相应数据
		handleClick(tab, event) {
			// console.log(tab, event);
			console.log('tabIndex:', this.tabIndex);
		},
		// 富文本编辑器的方法
		onClick(e, editor){
			console.log('Element clicked');
			console.log("e:",e)
			console.log("editor:",editor)
		}
	}
};
</script>

<style>
.goods_create .el-form-item {
	margin-bottom: 15px;
}
</style>
