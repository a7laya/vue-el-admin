<template>
	<div>
		<router-link :to="{ name: 'shop_goods_list' }" style="position: absolute; top: 3px; left: 200px;"><el-button size="mini">回到商品列表</el-button></router-link>
		<div class="bg-white h-100 px-3 py-2 goods_create" style="margin:-8px -20px 20px -20px; ">
			<el-form :model="form" ref="form" :rules="rules" label-width="100px">
				<el-form-item label="商品名称" prop="title">
					<el-input v-model="form.title" placeholder="请输入商品名称,不能超过60个字符" style="width: 400px;"></el-input>
				</el-form-item>
				<el-form-item label="封面" prop="cover">
					<div>
						<span v-if='!form.cover' class="btn btn-light p-3" style="line-height: 1;"
						@click="chooseImage">
							<i class="el-icon-plus"></i>
						</span>
						<img v-else :src="form.cover" class="rounded" 
						style="width: 45px; height: 45px; cursor: pointer;"
						@click="chooseImage"/>
					</div>
				</el-form-item>
				<el-form-item label="商品分类" prop="category_id">
					<el-select v-model="form.category_id" placeholder="请选择商品分类">
						<el-option v-for="(item,index) in cates" :key="index" :label="item | tree" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="商品描述">
					<el-input type="textarea" v-model="form.desc" placeholder="选填" style="width: 400px;"></el-input>
				</el-form-item>
				<el-form-item label="商品单位" prop="unit">
					<el-input v-model="form.unit" placeholder="请输入商品单位" style="width: 400px;"></el-input>
				</el-form-item>
				<el-form-item label="总库存" prop="stock">
					<el-input type="number" v-model="form.stock" placeholder="请输入总库存" class="w-25">
						<template slot="append">
							件
						</template>
					</el-input>
				</el-form-item>
				<el-form-item label="库存预警" prop="min_stock">
					<el-input type="number" v-model="form.min_stock" placeholder="请输入库存预警" class="w-25">
						<template slot="append">
							件
						</template>
					</el-input>
				</el-form-item>
				<el-form-item label="最低市场价" prop="min_price">
					<el-input type="number" v-model="form.min_price" placeholder="请输入最低市场价" class="w-25">
						<template slot="append">
							元
						</template>
					</el-input>
				</el-form-item>
				<el-form-item label="最低原价" prop="min_oprice">
					<el-input type="number" v-model="form.min_oprice" placeholder="请输入最低原价" class="w-25">
						<template slot="append">
							元
						</template>
					</el-input>
				</el-form-item>
				<el-form-item label="库存显示">
					<el-radio-group v-model="form.stock_display">
						<el-radio :label="0" border>是</el-radio>
						<el-radio :label="1" border>否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="是否上架">
					<el-radio-group v-model="form.status">
						<el-radio :label="1" border>是</el-radio>
						<el-radio :label="0" border>否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="运费模板" prop="express_id">
					<el-select v-model="form.express_id" placeholder="请选择模板">
						<el-option v-for="(item,index) in express" :key="index" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div style="height: 100px;"></div>
		</div>
		<el-button type="primary" style="position: fixed; bottom: 50px; right: 50px;" @click='submit(id)'>提交</el-button>
	</div>
</template>

<script>
export default {
	inject: ['app','layout'],
	data() {
		return {
			cates: [], // 分类选项
			express: [], // 运费模板
			form: {
				title: '', // 商品名称
				category_id: '', // 商品分类
				cover: '', // 商品封面
				desc: '', // 商品描述
				unit: '', // 商品单位
				stock: '', // 总库存
				min_stock: '', // 库存预警
				ischeck: 0, // 是否审核 0待处理 1通过 2拒绝
				status: 0, // 是否上架 0仓库1上架
				stock_display: 0, // 库存显示 0隐藏1禁用
				express_id: '', // 运费模板
				min_price: '', // 最低销售价
				min_oprice: '', // 最低原价
			},
			rules: {
				id: 0, // 商品id
				title: [{
					required: true,
					message: '请输入商品名称',
					trigger: 'blur'
				}],
				category_id: [{
					required: true,
					message: '选择商品分类',
					trigger: 'blur'
				}],
				unit: [{
					required: true,
					message: '请输入商品单位',
					trigger: 'blur'
				}],
				min_stock: [{
					required: true,
					message: '请输入商品库存',
					trigger: 'blur'
				}],
				stock: [{
					required: true,
					message: '请输入商品库存',
					trigger: 'blur'
				}],
				express_id: [{
					required: true,
					message: '请选择运费模板',
					trigger: 'blur'
				}],
				min_price: [{
					required: true,
					message: '请填写最低销售价',
					trigger: 'blur'
				}],
				min_oprice: [{
					required: true,
					message: '请填写最低市场价',
					trigger: 'blur'
				}],
			},
		};
	},
	filters: {
		tree(item) {
			let level = item.level;
			let str = '|';
			if (!level) return item.name;
			for (let i = 0; i < level; i++) {
				str += '--';
			}
			return str + item.name;
		}
	},
	created() {
		// 获取商品id（修改商品）
		this.id = this.$route.params.id
		if(this.id) {
			// 获取原来的商品详情
			let url = "/admin/goods/read/" + this.id
			this.layout.showLoading()
			this.axios.get(url,{token: true}).then(res=>{
				let data = res.data.data
				this.form = data
				this.layout.hideLoading()
			}).catch(err => {
				this.layout.hideLoading()
			})
		}
		
		
		// 获取商品分类和运费模板，用于下拉选择
		let url = "/admin/goods/create"
		this.layout.showLoading()
		this.axios.get(url,{token: true}).then(res=>{
			let data = res.data.data
			this.cates = data.cates
			this.express = data.express.list
			this.layout.hideLoading()
		}).catch(err => {
			this.layout.hideLoading()
		})
	},
	methods: {
		// 选择封面
		chooseImage(){
			this.app.chooseImage(res=>{
				this.form.cover = res[0].url
			}, 1)
		},
		// 提交
		submit(id){
			this.$refs.form.validate(res=>{
				console.log("res:",res)
				if(!res) return
				let url = id ? `/admin/goods/${id}` : "/admin/goods"
				let obj = {...this.form}
				this.layout.showLoading()
				this.axios.post(url,obj,{token: true}).then(res=>{
					console.log('res:',res)
					this.$message({
						type: 'success',
						message: `${id ? '修改成功' : '发布成功'}`
					})
					this.$router.push({name:'shop_goods_list'})
					this.layout.hideLoading()
				}).catch(err => {
					this.layout.hideLoading()
				})
			})
		}
	}
};
</script>

<style>
	.goods_create .el-form-item {
	    margin-bottom: 30px!important;
	}
</style>
