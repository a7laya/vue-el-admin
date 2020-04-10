<template>
	<div class="bg-white h-100 px-3 py-2" style="margin:-8px -20px 20px -20px; ">
		<button-search ref="buttonSearch" class="pt-2">
			<template #left>
				<el-button size="mini" type="primary" @click="openModel(false)">添加等级</el-button>
			</template>
			<template #right>
				<div class="d-flex align-items-center">
					<small class="mr-2 font-weight-light">选择升级标准:</small>
					<el-radio-group v-model="level" size="mini">
						<el-radio-button :label="0" class="mb-0">累计消费</el-radio-button>
						<el-radio-button :label="1" class="mb-0">累计次数</el-radio-button>
					</el-radio-group>
				</div>
			</template>
		</button-search>
		<!-- 表格 -->
		<el-table border class="mt-3" :data="tableData" style="width: 100%">
			<el-table-column prop="name" label="会员等级" align="center" width="122"></el-table-column>
			<el-table-column label="升级条件" align="center" width="288">
				<template slot-scope="scope">
					<div>{{ getLevel.name + ':' + scope.row[getLevel.value] }}</div>
				</template>
			</el-table-column>
			<el-table-column prop="discount" label="折扣率(%)" align="center" width="122"></el-table-column>
			<el-table-column prop="level" label="等级序号" align="center" width="122"></el-table-column>
			<el-table-column label="状态" align="center" width="120">
				<template slot-scope="scope">
					<el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="188">
				<template slot-scope="scope">
					<el-button plain type="text" size="mini" @click="openModel(scope)">修改</el-button>
					<el-button plain type="text" size="mini" @click="deleteItem(scope)">删除</el-button>
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

		<!--===== 新增 | 修改等级模态框 =====-->
		<el-dialog title="添加等级" :visible.sync="createModel" top="5vh">
			<!-- 表单内容 -->
			<el-form ref="form" :rules="rules" :model="form" label-width="80px">
				<el-form-item label="等级名称" prop="name">
					<el-input v-model="form.name" placeholder="等级名称" size="mini" class="w-50"></el-input>
					<small class="text-secondary d-block">设置会员等级名称</small>
				</el-form-item>
				<el-form-item label="等级权重" prop="level">
					<el-input-number v-model="form.level" placeholder="等级权重" size="mini" class="w-25"></el-input-number>
					<small class="text-secondary d-block">设置会员等级排序(数字越大等级越高)</small>
				</el-form-item>
				<el-form-item label="是否启用"><el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch></el-form-item>
				<el-form-item label="升级条件">
					<div class="d-flex align-items-center">
						<small>累计消费满</small>
						<el-input type="number" placeholder="大于等于0" v-model="form.consume" size="mini" class="w-50 mx-2">
							<template slot="append">元</template>
						</el-input>
					</div>
					<div class="d-flex align-items-center">
						<small>累计次数满</small>
						<el-input type="number" placeholder="大于等于0" v-model="form.times" size="mini" class="w-50 mx-2">
							<template slot="append">次</template>
						</el-input>
					</div>
				</el-form-item>
				<el-form-item label="折扣率">
					<el-input type="number" v-model="form.discount" placeholder="折扣率" size="mini" class="w-50">
						<template slot="append">%</template>
					</el-input>
					<small class="text-secondary d-block">输入90表示打九折</small>
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
	inject: ['app'],
	components: {
		buttonSearch
	},
	data() {
		return {
			editIndex: -1,
			createModel: false,
			form: {
				name: '',
				consume: 0, // 累计消费
				times: 0, // 累计次数
				discount: 0, // 折扣
				level: 0,
				status: 1,
			},
			level: 0,
			tableData: [
				{
					name: '普通会员',
					consume: 100, // 累计消费
					times: 10, // 累计次数
					discount: 10, // 折扣
					level: 111,
					status: 1,
					create_time: '2020-12-12 12:12:12'
				}
			],
			currentPage: 1,
			// 表单验证
			rules: {
				username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
				password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
				nickname: [{ required: true, message: '昵称不能为空', trigger: 'blur' }]
			}
		};
	},
	computed: {
		getLevel() {
			let arr = [{ name: '累计消费', value: 'consume' }, { name: '累计次数', value: 'times' }];
			return arr[this.level];
		}
	},
	methods: {
		// 打开模态框
		openModel(e = false) {
			// 增加
			if (!e) {
				// 初始化表单
				this.form = {
					name: '',
					consume: 0, // 累计消费
					times: 0, // 累计次数
					discount: 0, // 折扣
					level: 0,
					status: 1,
				};
				this.editIndex = -1;
			} else {
				// 修改
				this.form = { ...e.row };
				this.editIndex = e.$index;
			}
			// 打开dialog
			this.createModel = true;
		},
		// 改变等级状态
		changeStatus(item) {
			item.status = item.status === 1 ? 0 : 1;
			this.$message({
				type: 'success',
				message: item.status === 1 ? `已启用: ${item.name}` : `已禁用: ${item.name}`
			});
		},

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
		// 提交模态框
		submit() {
			// 验证成功后才提交
			this.$refs.form.validate(res => {
				let msg = '添加';
				if (!res) return;
				if (this.editIndex === -1) {
					this.tableData.unshift(this.form);
				} else {
					this.tableData.splice(this.editIndex, 1, this.form);
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
</style>
