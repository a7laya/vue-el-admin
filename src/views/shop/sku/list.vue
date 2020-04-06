<template>
	<div class="bg-white h-100 px-3 py-2" style="margin:-8px -20px 20px -20px; ">

		<div>
			<el-button size="medium" type="success" @click="createModel = true">添加规格</el-button>
			<el-button size="medium" type="danger">批量删除</el-button>
		</div>
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
						<el-button plain type="success" size="mini">编辑</el-button>
						<el-button plain type="warning" size="mini">删除</el-button>
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
		<!-- 新增 | 修改规格模态框 -->
		<el-dialog title="添加规格" :visible.sync="createModel">
			<!-- 表单内容 -->
			<el-form ref="form" :model="form" label-width="80px">
				<el-form-item label="规格名称">
					<el-input v-model="form.name" placeholder="规格名称" size="mini"></el-input>
				</el-form-item>
				<el-form-item label="排序">
					<el-input-number v-model="form.order" :min="0" size="mini"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="createModel = false">取 消</el-button>
				<el-button type="primary" @click="createModel = false">确 定</el-button>
			</div>
		</el-dialog>
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
					order: 50,
					status: 1,
					type: 0,
					value: "",
				},
				tableData: [
					{
						name: '颜色', 
						value: '棕色,蓝色',
						order: 50,
						status: 1, // 1 启用  0 禁用
					},
				],
				multipleSelection: [], // 选中的数据
				currentPage: 1,
				createModel: false,
			};
		},
		computed: {},
		created() {
		},
		methods: {
			// 改变规格状态
			changeStatus(item){
				item.status = item.status === 1 ?  0 : 1
				this.$message({
					type: 'success',
					message: item.status === 1 ? `已启用: ${item.name}` : `已禁用: ${item.name}`,
				});
			},
			// 表格多选
			handleSelectionChange(val) {
				this.multipleSelection = val;
				console.log('this.multipleSelection:', this.multipleSelection);
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
