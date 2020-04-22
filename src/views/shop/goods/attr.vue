<template>
	<div>
		<router-link :to="{ name: 'shop_goods_list' }" style="position: absolute; top: 3px; left: 200px;">
			<el-button size="mini">回到商品列表</el-button>
		</router-link>
		<div class="bg-white h-100 px-3 py-2 goods_create" style="margin:-8px -20px 20px -20px; ">
			<el-form label-width="80px">
				<el-form-item label="商品类型">
					<el-select v-model="goods_type_id" placeholder="请选择商品类型" @change="change">
						<el-option v-for="(item,index) in typeOptions" :key="index" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span>商品属性</span>
					<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
				</div>
				<el-form label-width="80px">
					<el-form-item v-for="(item,index) in goods_type_values" :key="index" :label="item.name">
						<el-input v-if="item.type === 'input'" v-model="item.value"></el-input>
						<el-radio-group v-if="item.type === 'radio'" v-model="item.value">
							<el-radio-button v-for="(item2, index2) in item.default" :key="index2" :label="item2"></el-radio-button>
						</el-radio-group>
						<el-checkbox-group v-if="item.type === 'checkbox'" v-model="item.value">
							<el-checkbox-button v-for="(item3, index3) in item.default" :key="index3" :label="item3"></el-checkbox-button>
						</el-checkbox-group>
					</el-form-item>
				</el-form>
			</el-card>
		</div>
		<el-button type="primary" style="position: fixed; bottom: 50px; right: 50px;" @click="submit">提交</el-button>
	</div>
</template>

<script>
	const cityOptions = ['上海', '北京', '广州', '深圳'];
	export default {
		inject: ['app', 'layout'],
		data() {
			return {
				id: 0,
				goods_type_id: '', // 商品类型id
				goods_type_values: [], // 商品类型下面的属性
				typeOptions: [],
				checkboxGroup4: ['上海'],
				cities: cityOptions
			};
		},
		created() {
			this.id = this.$route.params.id;
			if (!this.id) {
				this.$message({
					type: 'error',
					message: '非法参数'
				});
				return this.$router.push({
					name: 'shop_goods_list'
				});
			}
			// 获取原来的商品详情
			let url = '/admin/goods/read/' + this.id;
			this.layout.showLoading();
			this.axios
				.get(url, {
					token: true
				})
				.then(res => {
					let data = res.data.data
					console.log("data:", data)
					this.typeOptions = data.types
					this.goods_type_values = data.goodsAttrs.map(item => {
						if (item.type !== 'input') item.default = item.default.split(',')
						return item
					})
					console.log('this.goods_type_values:',this.goods_type_values)
					this.layout.hideLoading();
				})
				.catch(err => {
					this.layout.hideLoading();
				});
		},
		methods: {
			submit() {
				this.layout.showLoading();
				let url = '/admin/goods/attrs/' + this.id;
				let obj = {
					goods_attrs: [...this.goods_type_values].map(item => {
						if (item.type !== 'input') item.default = item.default.join(',')
						return item
					})
				};
				this.axios
					.post(url, obj, {
						token: true
					})
					.then(res => {
						this.$message({
							type: 'success',
							message: '修改成功'
						});
						this.layout.hideLoading();
						this.$router.push({
							name: 'shop_goods_list'
						});
					})
					.catch(err => {
						this.layout.hideLoading();
					});
			},
			change(id) {
				let index = this.typeOptions.findIndex(v => v.id === id)
				if (index === -1) return this.goods_type_values = []
				let options = this.typeOptions[index].goods_type_values
				this.goods_type_values = options.map(item => {
					let def = []
					if (item.type !== 'input') {
						def = item.default ? item.default.split(',') : []
					}
					return {
						goods_id: this.id,
						value: '',
						name: item.name,
						default: def,
						type: item.type
					}
				})
			}
		}
	};
</script>

<style>
	.goods_create .el-form-item {
		margin-bottom: 15px;
	}
</style>
