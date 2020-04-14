<template>
	<div class="bg-white h-100 px-3 py-2" style="margin:-8px -20px 20px -20px; ">

		<div>
			<el-button size="medium" type="success" @click="openModel(false)">添加规格</el-button>
			<el-button size="medium" type="danger" @click="deleteAll">批量删除</el-button>
		</div>
		<!-- 表格 -->
		<el-table border class="mt-3" @selection-change="handleSelectionChange" :data="tableData" style="width: 100%">
			<el-table-column type="selection" width="55" align="center"></el-table-column>
			<el-table-column prop="name" label="规格名称" align="center"></el-table-column>
			<el-table-column prop="default" label="规格值" align="center" width="380"></el-table-column>
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
				<el-pagination 
				@size-change="handleSizeChange" 
				@current-change="handleCurrentChange" 
				:current-page="page.current"
				:page-sizes="page.sizes" 
				:page-size="page.size" 
				layout="total, sizes, prev, pager, next, jumper" 
				:total="page.total">
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
				<el-form-item label="是否启用">
					<el-radio-group size="mini">
						<el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="类型">
					<el-radio-group v-model="form.type" size="mini">
						<el-radio :label="0" border>文字</el-radio>
						<el-radio :label="1" border>颜色</el-radio>
						<el-radio :label="2" border>图片</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="规格值" prop="default">
					<el-input type="textarea" :rows="2" v-model="form.default" 
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
	import common from '@/common/mixins/common.js'
	export default {
		inject: ['layout'],
		mixins: [common],
		components: {
			buttonSearch
		},
		data() {
			return {
				preUrl: 'skus',
				editIndex: -1,
				form: {
					name: '',
					order: 50,
					status: 1,
					type: 0,
					default: "",
				},
				// 表单验证
				rules:{
					name: [
						{required: true, message: "规格名称不能为空", trigger: "blur"},
					],
					default: [
						{required: true, message: "规格项目不能为空", trigger: "blur"},
					]
				},
				tableData: [],
				createModel: false,
			};
		},
		created() {
			this.getList()
		},
		methods: {
			// 重写mixin中common.js的getListResult方法来处理后端数据
			getListResult(e){
				this.tableData = e.list
			},
			// 获取请求列表分页的url
			getListUrl(){
				return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}`
			},
			// 打开模态框
			openModel(e = false){
				// 增加
				if(!e){
					// 初始化表单
					this.form = {
						name: '',
						order: 50,
						status: 1,
						type: 0,
						default: "",
					}
					this.editIndex = -1
				} else {
					// 修改
					this.form = e.row
					this.form.default = e.row.default.replace(/,/g,'\n')
					this.editIndex = e.$index
					// this.form = {
					// 	id: e.row.id,
					// 	name: e.row.name,
					// 	order: e.row.order,
					// 	status: e.row.status,
					// 	type: e.row.type,
					// 	default: e.row.default.replace(/,/g,'\n'),
					// }
				}
				// 打开dialog
				this.createModel = true
			},
			
			// 提交规格
			submit(){
				// 验证成功后才提交
				this.$refs.form.validate(res => {
					if(!res) return
					this.form.default = this.form.default.replace(/\n/g,',')
					this.addOrEdit(this.form,this.form.id)
				})
			},
			
		}
	};
</script>

<style>
	.el-radio {
		margin-right: 0;
	}
</style>
