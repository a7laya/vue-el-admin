<template>
	<div class="bg-white h-100 px-3 py-2" style="margin:-8px -20px 20px -20px; ">
		<el-tabs v-model="tabIndex" @tab-click="getList">
			<el-tab-pane v-for="(item, index) in tabbars" :key="index" :label="item.name" class="bg-white"></el-tab-pane>
		</el-tabs>

		<button-search ref="buttonSearch" @search="searchEvent" @openSuperSearch="form.title = $event" placeholder="要搜索的商品名称">
			<!-- 左边插槽 -->
			<template #left>
				<router-link :to="{name:'shop_goods_create'}" class="mr-2">
					<el-button type="primary" size="mini">发布商品</el-button>
				</router-link>
				<el-button type="success" size="mini" v-if="tab === 'delete'" @click="doEvent('restore')">恢复商品</el-button>
				<el-button type="danger" size="mini"  v-if="tab === 'delete'" @click="doEvent('destroy')">彻底删除</el-button>
				<el-button type="danger" size="mini"  v-if="tab !== 'delete'" @click="deleteAll">批量删除</el-button>
				<el-button size="mini" v-if="tab === 'all' || tab === 'off'"    @click="doEvent('changestatus', 1)">上架</el-button>
				<el-button size="mini" v-if="tab === 'all' || tab === 'saling'" @click="doEvent('changestatus', 0)">下架</el-button>
			</template>

			<!-- 高级搜索表单插槽 -->
			<template #form>
				<el-form ref="form" :model="form" label-width="80px" inline>
					<el-form-item label="商品名称" class="mb-0">
						<el-input v-model="form.title" size="mini" placeholder="商品名称"></el-input>
					</el-form-item>
					<el-form-item label="商品分类" class="mb-0">
						<el-select v-model="form.category_id" placeholder="请选择商品分类" size="mini">
							<el-option v-for="(item,index) in cateOptions" :key="index" :label="item | tree" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item class="mb-0">
						<el-button type="info" size="mini" class="ml-2" @click="searchEvent">搜索</el-button>
						<el-button type="" size="mini" @click="clearSearch">清空筛选条件</el-button>
					</el-form-item>
				</el-form>
			</template>
		</button-search>
		<!-- 表格 -->
		<el-table border class="mt-3" @selection-change="handleSelectionChange" :data="tableData" style="width: 100%">
			<el-table-column type="selection" width="55" align="center"></el-table-column>
			<el-table-column label="商品名称" width="300">
				<template slot-scope="scope">
					<div class="media">
						<img class="mr-3" :src="scope.row.cover" style="width: 60px; height: 60px;" />
						<div class="media-body">
							<h6 class="mt-0">{{ scope.row.title }}</h6>
							<div class="">分类：{{ scope.row.category.name }}</div>
							<div class="">时间：{{ scope.row.create_time }}</div>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="sale_count" label="销量" align="center" width="60"></el-table-column>
			<el-table-column label="状态" align="center" width="60">
				<template slot-scope="scope">
					<span class="badge" :class="scope.row.status ? 'badge-success' : 'badge-danger'">
						{{scope.row.status ? '上架' : '仓库'}}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="审核" align="center" width="120">
				<template slot-scope="scope">
					<!-- 未审核则显示这俩按钮 -->
					<div v-if="!scope.row.ischeck">
						<el-button plain type="success" size="mini" @click="scope.row.ischeck = 1">审核通过</el-button>
						<el-button plain type="danger" size="mini" @click="scope.row.ischeck = 2" class="ml-0 mt-2">审核拒绝</el-button>
					</div>
					<!-- 审核过之后 -->
					<span v-else>{{scope.row.ischeck === 1 ? '已通过' : '已拒绝'}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="stock" label="总库存" align="center" width="66"></el-table-column>
			<el-table-column label="价格(元)" align="center" width="188">
				<template  slot-scope="scope">
					<span class="text-danger">￥{{scope.row.min_price}}</span>
					<span>/</span>
					<span class="text-muted">￥{{scope.row.min_oprice}}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="mini">基础设置</el-button>
					<el-button type="text" size="mini">商品规格</el-button>
					<el-button type="text" size="mini">商品属性</el-button>
					<el-button type="text" size="mini">媒体设置</el-button>
					<el-button type="text" size="mini" @click="navigate('shop_goods_content', scope.row.id)">商品详情</el-button>
					<el-button type="text" size="mini">折扣设置</el-button>
					<el-button type="text" size="mini">删除商品</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div style="height: 120px;"></div>
		<el-footer class="border-top d-flex align-items-center px-0 bg-white position-fixed fixed-bottom" style="margin-left: 200px;">
			<!-- 分页 -->
			<div class="flex-grow-1 ml-2">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.current"
				 :page-sizes="page.sizes" :page-size="page.size" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
				</el-pagination>
			</div>
		</el-footer>
	</div>
</template>

<script>
	import buttonSearch from '@/components/common/button-search.vue';
	import common from '@/common/mixins/common.js';
	export default {
		inject: ['layout'],
		mixins: [common],
		components: {
			buttonSearch
		},
		data() {
			return {
				preUrl: 'goods',
				tabIndex: 0,
				tabbars: [
					{name: '全部',   key: 'all'}, 
					{name: '审核中',   key: 'checking'}, 
					{name: '出售中',   key: 'saling'}, 
					{name: '已下架',   key: 'off'}, 
					{name: '库存预警', key: 'min_stock'}, 
					{name: '回收站',   key: 'delete'},
				],
				cateOptions: [],
				form: {
					title: '', // 关键字
					time: '', // 时间区间
					category_id: '' // 类别id
				},
				tableData: []
			};
		},
		computed: {
			tab() {
				return this.tabbars[this.tabIndex].key
			},
			// 拼接参数
			params() {
				let str = ''
				for (let key in this.form) {
					let v = this.form[key]
					if (v) {
						if (Array.isArray(v)) {
							str += `&starttime=${v[0]}&endtime=${v[1]}`
						} else {
							str += `&${key}=${v}`
						}
					}
				}
				return str
			}
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
		methods: {
			// 
			navigate(name, id){
				this.$router.push({
					name,
					params: { id }
				})
			},
			
			// 请求后端数据的方法
			getListResult(e) {
				console.log("e:", e)
				this.tableData = e.list
				this.cateOptions = e.cates
			},
			getListUrl() {
				return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}&tab=${this.tab}${this.params}`
			},
			
			// 清空筛选条件
			clearSearch() {
				this.form = {
					title: '', // 关键字
					time: '', // 时间区间
					category_id: '' // 类别id
				};
				// this.$refs.buttonSearch[this.tabIndex].keyword = '';
				// // 通过$refs可以访问子组件的data | methods里面的内容
				// this.$refs.buttonSearch[this.tabIndex].closeSuperSearch();
			},
			// 搜索事件
			searchEvent(e = false) {
				// 简单搜索
				if (typeof e === 'string') {
					this.form.title = e
					return this.getList()
				}
				// 高级搜索
				return this.getList()
			},
			// 恢复商品 彻底删除 上/下架
			doEvent(key, status = false){
				if(!this.ids.length) return this.$message({
					type: 'error',
					message: '请选择要操作的商品'
				})
				let url = `/admin/goods/${key}`
				let obj = { ids: this.ids, status }
				this.layout.showLoading()
				this.axios.post(url, obj, {token: true}).then(res=>{
					this.$message({
						type: 'success',
						message: '操作成功'
					})
					this.getList()
					this.layout.hideLoading()
				}).catch(err=>{
					this.layout.hideLoading()
				})
			}
		}
	};
</script>

<style></style>
