<template>
	<div class="bg-white h-100 px-3 py-2" style="margin:-8px -20px 20px -20px; ">

		<button-search ref="buttonSearch" @search="searchEvent" @openSuperSearch="form.name = $event" placeholder="要搜索的商品名称">
			<!-- 左边插槽 -->
			<template #left>
				<router-link :to="{name:'shop_goods_create'}" class="mr-2">
					<el-button type="primary" size="mini">发布商品</el-button>
				</router-link>
				<el-button type="warning" size="mini">恢复商品</el-button>
				<el-button type="danger" size="mini">批量删除</el-button>
				<el-button size="mini">上架</el-button>
				<el-button size="mini">下架</el-button>
				<el-button size="mini">推荐</el-button>
			</template>

			<!-- 高级搜索表单插槽 -->
			<template #form>
				<el-form ref="form" :model="form" label-width="80px" inline>
					<el-form-item label="商品名称" class="mb-0">
						<el-input v-model="form.name" size="mini" placeholder="商品名称"></el-input>
					</el-form-item>
					<el-form-item label="商品编码" class="mb-0">
						<el-input v-model="form.code" size="mini" placeholder="商品编码"></el-input>
					</el-form-item>
					<el-form-item label="商品类型" class="mb-0">
						<el-select v-model="form.type" placeholder="请选择商品类型" size="mini">
							<el-option label="商品类型一" value="shanghai"></el-option>
							<el-option label="商品类型二" value="beijing"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="商品分类" class="mb-0">
						<el-input v-model="form.name" size="mini" placeholder="商品分类"></el-input>
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
			<el-table-column label="商品名称">
				<template slot-scope="scope">
					<div class="media">
						<img class="mr-3" :src="scope.row.cover" style="width: 60px; height: 60px;" />
						<div class="media-body">
							<h6 class="mt-0">{{ scope.row.title }}</h6>
							<div class="">分类：{{ scope.row.category }}</div>
							<div class="">时间：{{ scope.row.create_time }}</div>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="type" label="类型" align="center" width="80"></el-table-column>
			<el-table-column prop="sale_count" label="销量" align="center" width="55"></el-table-column>
			<el-table-column prop="order" label="排序" align="center" width="55"></el-table-column>
			<el-table-column label="状态" align="center" width="120">
				<template slot-scope="scope">
					<el-button plain type="success" size="mini" @click="scope.row.ischeck = 1">审核通过</el-button>
					<el-button plain type="danger" size="mini" @click="scope.row.ischeck = 2" class="ml-0 mt-2">审核拒绝</el-button>

					<!-- <el-button plain 
							:type="scope.row.status === 1 ? 'success' : 'danger'" size="mini" 
							@click="changeStatus(scope.row)">{{ scope.row.status === 1 ? '上架' : '下架' }}</el-button> -->
				</template>
			</el-table-column>
			<el-table-column prop="stock" label="总库存" align="center" width="66"></el-table-column>
			<el-table-column prop="pprice" label="价格(元)" align="center" width="88"></el-table-column>
			<el-table-column label="操作" align="center" width="140">
				<template slot-scope="scope">
					<el-button-group>
						<el-button plain type="success" size="mini">编辑</el-button>
						<el-button plain type="warning" size="mini" @click="deleteItem(scope.$index)">删除</el-button>
					</el-button-group>
				</template>
			</el-table-column>
		</el-table>
		<div style="height: 120px;"></div>
		<el-footer class="border-top d-flex align-items-center px-0 bg-white position-fixed fixed-bottom" style="margin-left: 200px;">
			<!-- 分页 -->
			<div class="flex-grow-1 ml-2">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
				 :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400">
				</el-pagination>
			</div>
		</el-footer>
	</div>
</template>

<script>
	import buttonSearch from '@/components/common/button-search.vue';
	export default {
		components: {
			buttonSearch
		},
		data() {
			return {
				form: {
					name: '',
					code: '',
					type: '',
					category: ''
				},
				multipleSelection: [], // 选中的数据
				tableData: [],
				currentPage: 1,
			};
		},
		computed: {},
		created() {
			this.__getData()
		},
		methods: {
			// 生成数据
			__getData() {
				
			},
			// 清空筛选条件
			clearSearch() {
				this.form = {
					name: '',
					code: '',
					type: '',
					category: ''
				};
				this.$refs.buttonSearch.keyword = '';
				// 通过$refs可以访问子组件的data | methods里面的内容
				this.$refs.buttonSearch.closeSuperSearch();
			},
			// 搜索事件
			searchEvent(e = false) {
				// 简单搜索
				if (typeof e === 'string') {
					return console.log('简单搜索:', e);
				}
				// 高级搜索
				console.log('高级搜索');
			},
			// 表格多选
			handleSelectionChange(val) {
				this.multipleSelection = val;
				console.log('this.multipleSelection:', this.multipleSelection);
			},
			// 删除当前商品
			deleteItem(index) {
				
			},
			// 分页动作
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
			},
		}
	};
</script>

<style></style>
