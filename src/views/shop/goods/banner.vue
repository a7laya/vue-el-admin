<template>
	<div>
		<router-link :to="{ name: 'shop_goods_list' }" style="position: absolute; top: 3px; left: 200px;"><el-button size="mini">回到商品列表</el-button></router-link>
		<div class="bg-white h-100 px-3 py-2 goods_create" style="margin:-8px -20px 20px -20px; ">
			<el-form label-width="80px">
				<el-form-item label="商品大图">
					<div class="d-flex flex-wrap">
						<div
							style="height: 150px; width: 150px; border-style: dashed; cursor: pointer;position: relative;"
							class="border rounded d-flex align-items-center justify-content-center text-muted mr-3 mb-3"
							@click="chooseImage(index)"
							v-for="(item, index) in banners"
							:key="index"
						>
							<img v-if="item.url" :src="item.url" style="width: 100%; height: 100%;" />
							<i v-else class="el-icon-plus" style="font-size: 30px;"></i>
							<i
								class="el-icon-delete p-2 text-white position-absolute"
								style="top: 0; right: 0;background-color: rgba(0,0,0,.4);"
								@click.stop="deleteImage(index)"
							></i>
						</div>
						<!-- 未达到限制数可以继续添加 -->
						<div v-if="banners.length < 9" class="d-flex flex-wrap">
							<div
								style="height: 150px; width: 150px; border-style: dashed; cursor: pointer;"
								class="border rounded d-flex align-items-center justify-content-center text-muted mr-3 mb-3"
								@click="chooseImage(-1)"
							>
								<i class="el-icon-plus" style="font-size: 30px;"></i>
							</div>
						</div>
					</div>
				</el-form-item>
			</el-form>
		</div>
		<el-button type="primary" style="position: fixed; bottom: 50px; right: 50px;" @click="submit">提交</el-button>
	</div>
</template>

<script>
export default {
	inject: ['app', 'layout'],
	data() {
		return {
			id: 0,
			banners: []
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
			.get(url, { token: true })
			.then(res => {
				console.log("res:",res)
				this.banners = res.data.data.goodsBanner
				this.layout.hideLoading();
			})
			.catch(err => {
				this.layout.hideLoading();
			});
	},
	methods: {
		// 选择图片
		chooseImage(index) {
			let num = 9 - this.banners.length;
			this.app.chooseImage(
				res => {
					if (res.length === 0) return;
					let list = [];
					if (index === -1) {
						list = [...this.banners, ...res];
					} else {
						list = [...this.banners];
						list[index] = res[0];
					}
					this.banners = list
					console.log('this.banners:', this.banners);
				},
				index === -1 ? num : 1
			);
		},
		// 删除图片
		deleteImage(index) {
			this.$confirm('是否删除该图片?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.banners.splice(index, 1);
				this.$message({
					type: 'success',
					message: '删除成功!'
				});
			});
		},
		submit() {
			let url = '/admin/goods/banners/' + this.id;
			let obj = {
				banners: this.banners.map(v=>v.url)
			};
			this.layout.showLoading();
			this.axios
				.post(url, obj, { token: true })
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
		}
	}
};
</script>

<style>
.goods_create .el-form-item {
	margin-bottom: 15px;
}
</style>
