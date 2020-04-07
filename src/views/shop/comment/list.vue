<template>
	<div class="bg-white h-100 px-3 py-2" style="margin:-8px -20px 20px -20px; ">

		<!-- <div>
			<el-button size="medium" type="danger" @click="deleteAllConfirm">批量删除</el-button>
		</div> -->
		<button-search ref="buttonSearch" @search="searchEvent" @openSuperSearch="form.username = $event" placeholder="要搜索的">
			<!-- 左边插槽 -->
			<template #left>
				<el-button type="danger" size="mini">删除评论</el-button>
			</template>
		
			<!-- 高级搜索表单插槽 -->
			<template #form>
				<el-form ref="form" :model="form" label-width="80px" inline>
					<el-form-item label="评价用户" class="mb-0"><el-input v-model="form.username" size="mini" placeholder="评价用户"></el-input></el-form-item>
					<el-form-item label="评价类型" class="mb-0">
						<el-select v-model="form.type" placeholder="请选择评价类型" size="mini">
							<el-option label="评价类型一" value="shanghai"></el-option>
							<el-option label="评价类型二" value="beijing"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="发布时间" class="mb-0">
						<el-date-picker
						      v-model="form.time"
						      type="daterange"
						      range-separator="至"
						      start-placeholder="开始日期"
						      end-placeholder="结束日期" size="mini">
						    </el-date-picker>
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
			<el-table-column prop="name" label="规格名称" align="center"></el-table-column>
			<el-table-column prop="value" label="规格值" align="center" width="380"></el-table-column>
			<el-table-column prop="order" label="排序" align="center" width="55"></el-table-column>
			<el-table-column label="状态" align="center" width="120">
				<template slot-scope="scope">
					<el-button plain :type='scope.row.status ? "success" : "danger"' size="mini" @click="changeStatus(scope.row)">
						{{scope.row.status ? "启用" : "禁用"}}
					</el-button>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="140">
				<template slot-scope="scope">
					<el-button-group>
						<el-button plain type="success" size="mini" @click="openModel(scope)">修改</el-button>
						<el-button plain type="warning" size="mini" @click="deleteItem(scope)">删除</el-button>
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
					username: '',
					code: '',
					type: '',
					time: ''
				},
				tableData: [
					{
						name: '颜色1', 
						value: '棕色,蓝色',
						order: 50,
						status: 1, // 1 启用  0 禁用
						id: 1
					},
					{
						name: '颜色2', 
						value: '棕色,蓝色',
						order: 50,
						status: 1, // 1 启用  0 禁用
						id: 2
					},
					{
						name: '颜色3', 
						value: '棕色,蓝色',
						order: 50,
						status: 1, // 1 启用  0 禁用
						id: 3
					},
					{
						name: '颜色4', 
						value: '棕色,蓝色',
						order: 50,
						status: 1, // 1 启用  0 禁用
						id: 4
					},
					{
						name: '颜色5', 
						value: '棕色,蓝色',
						order: 50,
						status: 1, // 1 启用  0 禁用
						id: 5
					},
				],
				multipleSelection: [], // 选中的数据
				currentPage: 1,
			};
		},
		methods: {
			// 清空筛选条件
			clearSearch() {
				this.form = {
					username: '',
					code: '',
					type: '',
					time: ''
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
			// 批量删除
			deleteAll(){
				this.multipleSelection.forEach(item=>{
					let index = this.tableData.findIndex(v=>v.id === item.id)
					if(index !== -1){
						this.tableData.splice(index,1)
					}
				})
				this.multipleSelection = []
			},
			// 批量删除确认
			deleteAllConfirm(){
				this.$confirm('是否删除选中规格?', '提示', {
					confirmButtonText: '删除',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
						this.deleteAll()
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
					})
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

<style>
	.el-radio {
		margin-right: 0;
	}
</style>
