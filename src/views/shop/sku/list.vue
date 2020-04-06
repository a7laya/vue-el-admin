<template>
	<div class="bg-white h-100 px-3 py-2" style="margin:-8px -20px 20px -20px; ">

		<div>
			<el-button size="medium" type="success" @click="openModel">添加规格</el-button>
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
		<!-- 新增 | 修改规格模态框 -->
		<el-dialog title="添加规格" :visible.sync="createModel" top="5vh">
			<!-- 表单内容 -->
			<el-form ref="form" :rules="rules" :model="form" label-width="80px">
				<el-form-item label="规格名称" prop="name">
					<el-input v-model="form.name" placeholder="规格名称" size="mini" class="w-50"></el-input>
				</el-form-item>
				<el-form-item label="排序">
					<el-input-number v-model="form.order" :min="0" size="mini"></el-input-number>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="form.status" size="mini">
						<el-radio :label="1" border>启用</el-radio>
						<el-radio :label="0" border>禁用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="类型">
					<el-radio-group v-model="form.type" size="mini">
						<el-radio :label="0" border>文字</el-radio>
						<el-radio :label="1" border>颜色</el-radio>
						<el-radio :label="2" border>图片</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="规格值" prop="value">
					<el-input type="textarea" :rows="2" v-model="form.value" 
					placeholder="一行一个规格项,多个规格项用换行来输入" size="mini"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="createModel = false">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
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
				// 表单验证
				rules:{
					name: [
						{required: true, message: "规格名称不能为空", trigger: "blur"},
					],
					value: [
						{required: true, message: "规格项目不能为空", trigger: "blur"},
					]
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
			// 打开模态框
			openModel(){
				// 初始化表单
				this.form = {
					name: '',
					order: 50,
					status: 1,
					type: 0,
					value: "",
				}
				// 打开dialog
				this.createModel = true
			},
			// 改变规格状态
			changeStatus(item){
				item.status = item.status === 1 ?  0 : 1
				this.$message({
					type: 'success',
					message: item.status === 1 ? `已启用: ${item.name}` : `已禁用: ${item.name}`,
				});
			},
			// 提交规格
			submit(){
				// 验证成功后才提交
				this.$refs.form.validate(res => {
					if(!res) return
					this.form.value = this.form.value.replace('\n',',')
					this.tableData.unshift({...this.form})
					this.createModel = false
					this.$message({
						message: '添加成功',
						type: 'success'
					});
				})
			},
			// 删除单个规格
			deleteItem(scope){
				this.$confirm('确定删除: ' + scope.row.name, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.tableData.splice(scope.$index,1)
					this.$message({
						message: '删除成功',
						type: 'success'
					});
				})
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

<style>
	.el-radio {
		margin-right: 0;
	}
</style>
