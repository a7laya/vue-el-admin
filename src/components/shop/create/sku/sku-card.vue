<template>
	<el-form ref="form" label-width="80px">
		<el-form-item label="添加规格">
			<div class="card" style="line-height: 1;">
				<div class="card-header d-flex align-items-center">
					规格项：
					<el-input size="mini" placeholder="请输入" class="mr-2" style="width: 200px;">
						<el-button slot='append' icon="el-icon-more"></el-button>
					</el-input>
					<el-radio-group style="margin-bottom: -10px;">
						<el-radio label="无">无</el-radio>
						<el-radio label="颜色"></el-radio>
						<el-radio label="图片"></el-radio>
					</el-radio-group>
					<el-button icon="el-icon-top" size="mini" class="ml-auto px-2"></el-button>
					<el-button icon="el-icon-bottom" size="mini" class="px-2"></el-button>
					<el-button type="text" size="mini" >删除</el-button>
				</div>
				<div class="card-body">
					<div>
						<el-button type="text" size="mini" icon="el-icon-plus">增加规格值
						</el-button>
					</div>
				</div>
			</div>
			<el-button type="success" size="mini" class="mt-3">添加规格</el-button>
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
	}
</script>

<style>
</style>
