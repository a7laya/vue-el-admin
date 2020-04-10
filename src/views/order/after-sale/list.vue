<template>
	<div class="bg-white h-100 px-3 py-2" style="margin:-8px -20px 20px -20px; ">
		<button-search class="pt-3">
			<template #right>
				<div class="d-flex align-items-center">
					<el-date-picker
						v-model="search.time"
						type="daterange"
						align="right"
						unlink-panels
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						:picker-options="pickerOptions"
						size="medium"
						class="mr-2"
					></el-date-picker>
					<el-input v-model="search.keyword" size="medium" placeholder="请输入订单号" class="mr-2 w-50"></el-input>
					<el-button type="info" @click="onSubmit" size="medium">搜索</el-button>
				</div>
			</template>
		</button-search>
		<!-- 表格 -->
		<el-table border class="mt-3" @selection-change="handleSelectionChange" :data="tableData" style="width: 100%">
			<el-table-column type="selection" width="55" align="center"></el-table-column>
			<el-table-column prop="order_number" label="商品信息" align="center"></el-table-column>
			<el-table-column prop="username" label="商品清单" align="center"></el-table-column>
			<el-table-column prop="price" label="订单金额" align="center"></el-table-column>
			<el-table-column prop="price" label="收货信息" align="center"></el-table-column>
			<el-table-column prop="content" label="买家" align="center"></el-table-column>
			<el-table-column prop="code" label="交易状态" align="center"></el-table-column>
			<el-table-column prop="create_time" label="创建时间" align="center"></el-table-column>
			<el-table-column label="操作" align="center" width="140">
				<template slot-scope="scope">
					<el-button plain type="warning" size="mini" @click="deleteItem(scope)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div style="height: 120px;"></div>
		<el-footer class="border-top d-flex align-items-center px-0 bg-white position-fixed fixed-bottom" style="margin-left: 200px;">
			<!-- 分页 -->
			<div class="flex-grow-1 ml-2">
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="currentPage"
					:page-sizes="[100, 200, 300, 400]"
					:page-size="100"
					layout="total, sizes, prev, pager, next, jumper"
					:total="400"
				></el-pagination>
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
			search: {
				time: '',
				keyword: ''
			},
			tableData: [],
			multipleSelection: [], // 选中的数据
			currentPage: 1,
			pickerOptions: {
				shortcuts: [
					{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					},
					{
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					},
					{
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}
				]
			}
		};
	},
	methods: {
		// 改变类型状态
		changeStatus(item) {
			item.status = item.status === 1 ? 0 : 1;
			this.$message({
				type: 'success',
				message: item.status === 1 ? `已启用: ${item.name}` : `已禁用: ${item.name}`
			});
		},
		// 提交类型
		submit() {
			// 验证成功后才提交
			this.$refs.form.validate(res => {
				if (!res) return;
				// 验证属性列表
				let result = true;
				let message = []; // 存储错误消息
				this.value_list.forEach((item, index) => {
					if (item.order === '') {
						result = result && false;
						message.push(`属性列表第${index + 1}行,排序不能为空`);
					}
					if (item.name === '') {
						result = result && false;
						message.push(`属性列表第${index + 1}行,属性名称不能为空`);
					}
					if (item.type !== 'input' && item.value === '') {
						result = result && false;
						message.push(`属性列表第${index + 1}行,属性值不能为空`);
					}
				});
				if (!result)
					return this.$notify({
						title: '属性列表提示',
						type: 'warning',
						dangerouslyUseHTMLString: true,
						message: message.join('<br>')
					});
				let msg = '添加';
				if (this.editIndex === -1) {
					this.tableData.unshift({
						...this.form,
						value_list: [...this.value_list]
					});
				} else {
					this.tableData.splice(this.editIndex, 1, {
						...this.form,
						value_list: [...this.value_list]
					});
					msg = '修改';
				}
				// 关闭模态框 并提示成功
				this.createModel = false;
				this.$message({
					message: msg + '成功',
					type: 'success'
				});
			});
		},
		// 删除单个类型
		deleteItem(scope) {
			this.$confirm('确定删除: ' + scope.row.name, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.tableData.splice(scope.$index, 1);
				this.$message({
					message: '删除成功',
					type: 'success'
				});
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
		}
	}
};
</script>

<style>
.el-radio {
	margin-right: 0;
}
.sku-list-item {
	/* font-size: 12px; */
	line-height: initial;
	cursor: pointer;
	min-width: 60px;
	min-height: 34px;
}
.sku-list-item > i {
	display: none;
}
.sku-list-item:hover {
	background-color: #f5f5f5;
}
.sku-list-item:hover > i {
	display: block;
}
.sku-list-item:hover > font {
	display: none;
}
.el-range-separator {
	width: 20px !important;
}
</style>
