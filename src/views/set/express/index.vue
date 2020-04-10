<template>
	<div class="">
		<el-tabs v-model="activeName">
			<!-- 运费模板 -->
			<el-tab-pane label="运费模板" name="second">
				<div><el-button type="primary" @click="openModel(false)" size="small">添加模板</el-button></div>
				<!-- 表格 -->
				<el-table border class="mt-3" :data="tableData" style="width: 100%">
					<el-table-column prop="name" label="模板名称" align="center"></el-table-column>
					<el-table-column label="升级条件" align="center" width="288">
						<template slot-scope="scope">
							{{scope.row.type | formatType}}
						</template>
					</el-table-column>
					<el-table-column prop="order" label="排序" align="center" width="122"></el-table-column>
					<el-table-column prop="create_time" label="添加时间" align="center" width="188"></el-table-column>
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
			</el-tab-pane>

			<!-- 物流跟踪 -->
			<el-tab-pane label="物流跟踪" name="third">
				<el-form ref="form" :model="form" label-width="140px">
					
					<el-form-item label="快递100 Customer">
						<el-input v-model="form.customer" size="mini" class="w-25" placeholder="快递100Customer"></el-input>
						<small class="text-secondary d-block">
							用于查询物流信息, <el-button type="text">快递100申请</el-button>
						</small>
					</el-form-item>
					
					<el-form-item label="快递100 key">
						<el-input v-model="form.key" size="mini" class="w-25" placeholder="快递100 key"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onSubmit" size="medium">保存</el-button>
					</el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>
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
export default {
	data() {
		return {
			editIndex: -1,
			createModel: false,
			form: {
				key: '',
				customer: ''
			},
			activeName: 'second',
			tableData: [
				{
					name: '全国统一邮费',
					type: 1, // 计费方式
					order: 50,
					status: 1,
					create_time: '2020-12-12 12:12:12'
				}
			],
		};
	},
	filters: {
		// 计费方式显示
		formatType(type){
			return ['按重量','按件数'][type]
		}
	},
	methods: {
		onSubmit(){
			console.log("保存")
		},
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
	}
};
</script>

<style></style>
