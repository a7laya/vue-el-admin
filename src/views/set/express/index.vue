<template>
	<div class="">
		<el-tabs v-model="activeName">
			<!-- 运费模板 -->
			<el-tab-pane label="运费模板" name="second">
				<div><el-button type="primary" @click="openModel(false)" size="small">添加模板</el-button></div>
				<!-- 表格 -->
				<el-table border class="mt-3" :data="tableData" style="width: 100%">
					<el-table-column prop="name" label="模板名称" align="center"></el-table-column>
					<el-table-column label="计费方式" align="center" width="288">
						<template slot-scope="scope">
							{{ scope.row.type | formatType }}
						</template>
					</el-table-column>
					<el-table-column prop="order" label="排序" align="center" width="122"></el-table-column>

					<el-table-column label="操作" align="center" width="255">
						<template slot-scope="scope">
							<el-button plain type="text" size="mini" @click="openModel(scope)">修改</el-button>
							<el-button plain type="text" size="mini" @click="openDrawer(scope.row)">配置模板({{ scope.row.express_values.length }})</el-button>
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
							用于查询物流信息,
							<el-button type="text">快递100申请</el-button>
						</small>
					</el-form-item>

					<el-form-item label="快递100 key"><el-input v-model="form.key" size="mini" class="w-25" placeholder="快递100 key"></el-input></el-form-item>
					<el-form-item><el-button type="primary" @click="onSubmit" size="medium">保存</el-button></el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>
		<el-footer class="border-top d-flex align-items-center px-0 bg-white position-fixed fixed-bottom" style="margin-left: 200px;">
			<!-- 分页 -->
			<div style="height: 60px;"></div>
			<div class="flex-grow-1 ml-2">
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="page.current"
					:page-sizes="page.sizes"
					:page-size="page.size"
					layout="total, sizes, prev, pager, next, jumper"
					:total="page.total"
				></el-pagination>
			</div>
		</el-footer>
		<!--===== 新增 | 修改模板模态框 =====-->
		<el-dialog :title="editIndex === -1 ? '添加模板' : '修改模板'" :visible.sync="createModel" top="5vh">
			<!-- 表单内容 -->
			<el-form ref="model" :model="model" label-width="80px">
				<el-form-item label="模板名称" prop="name"><el-input v-model="model.name" placeholder="模板名称" size="medium" class="w-50"></el-input></el-form-item>
				<el-form-item label="排序" prop="order"><el-input-number v-model="model.order" placeholder="排序" size="medium" class="w-25"></el-input-number></el-form-item>
				<el-form-item label="计费方式">
					<el-radio-group v-model="model.type">
						<el-radio-button :label="0">按件数</el-radio-button>
						<el-radio-button :label="1">按重量</el-radio-button>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="createModel = false">取 消</el-button>
				<el-button type="primary" @click="submitModel">确 定</el-button>
			</div>
		</el-dialog>

		<!-- 配置模板 抽屉 -->
		<el-drawer size="70%" :visible.sync="drawer" direction="rtl">
			<div class="p-3">
				<el-table border class="mt-3" :data="express_values" style="width: 100%">
					<el-table-column prop="id" label="ID" align="center" width="50"></el-table-column>
					<el-table-column  label="可配送区域" align="center">
						<template slot-scope="scope">
							<el-cascader :options="options" :props="props" collapse-tags clearable
							v-model="scope.row.region"
							@change="change(scope.row)"></el-cascader>
						</template>
					</el-table-column>
					<el-table-column label="首件(个)/首重(Kg)" align="center" width="100">
						<template slot-scope="scope">
							<el-input @change="change(scope.row)" type="number" v-model="scope.row.first" placeholder="请输入首件(个)/首重(Kg)"></el-input>
						</template>
					</el-table-column>
					<el-table-column label="运费(元)" align="center" width="100">
						<template slot-scope="scope">
							<el-input @change="change(scope.row)" type="number" v-model="scope.row.first_price" placeholder="请输入运费"></el-input>
						</template>
					</el-table-column>
					<el-table-column label="续件/续重" align="center" width="100">
						<template slot-scope="scope">
							<el-input @change="change(scope.row)" type="number" v-model="scope.row.add" placeholder="请输入续件/续重"></el-input>
						</template>
					</el-table-column>
					<el-table-column prop="add_price" label="续费(元)" align="center" width="100">
						<template slot-scope="scope">
							<el-input @change="change(scope.row)" type="number" v-model="scope.row.add_price" placeholder="请输入续费(元)"></el-input>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center" width="100">
						<template slot-scope="scope">
							<el-button plain type="text" size="mini" @click="deleteValue(scope.row, scope.$index)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-button type="primary" class="mt-3" @click="addValue">添加策略</el-button>
			</div>
		</el-drawer>
	</div>
</template>

<script>
import common from '@/common/mixins/common.js';
export default {
	inject: ['layout'],
	mixins: [common],
	data() {
		return {
			preUrl: 'express',
			editIndex: -1,
			createModel: false,
			drawer: false,
			drawerId: false, // 模板id
			express_values: [], // 配置运费模板的表格值
			form: {
				key: '',
				customer: ''
			},
			model: {
				name: '', // 模板名称
				order: 50, //排序
				type: 1 // 计费方式(0按件数 1按重量)
			},
			activeName: 'second',
			tableData: [],
			rules: {
				name: [{ required: true, message: '模板名称不能为空', trigger: 'blur' }]
			},
			props: { // 级联选择器 设置 及 映射
				multiple: true,
				label: 'name',
				value: 'name',
			},
			options: [ // 级联选择器
				{
					value: 1,
					label: '东南',
					children: [
						{
							value: 2,
							label: '上海',
							children: [{ value: 3, label: '普陀' }, { value: 4, label: '黄埔' }, { value: 5, label: '徐汇' }]
						},
					]
				}
			]
		};
	},
	filters: {
		// 计费方式显示
		formatType(type) {
			return ['按件数', '按重量'][type];
		}
	},
	methods: {
		// mixins-common获取数据
		getListResult(e) {
			console.log('e:', e);
			this.tableData = e.list;
			this.options = e.area.map(item=>{
				item.children = item.citys.map(v => {
					v.children = v.districts
					return v
				})
				return item
			})
		},
		onSubmit() {
			console.log('保存');
		},
		// 提交 新增 | 修改模板模态框
		submitModel() {
			this.$refs.model.validate(res => {
				if (!res) return;
				let obj = { ...this.model };
				this.addOrEdit(obj, obj.id);
			});
		},
		// 打开 新增 | 修改模板模态框
		openModel(e = false) {
			// 增加
			if (!e) {
				// 初始化表单
				this.model = {
					name: '', // 模板名称
					order: 50, //排序
					type: 0 // 计费方式(0按件数 1按重量)
				};
				this.editIndex = -1;
			} else {
				// 修改
				this.model = { ...e.row };
				this.editIndex = e.$index;
			}
			// 打开dialog
			this.createModel = true;
		},
		// 打开抽屉 - 配置运费策略
		openDrawer(item) {
			this.express_values = item.express_values;
			this.drawer = true;
			// 记录模板id
			this.drawerId = item.id
		},
		// 添加策略
		addValue(){
			let url = "/admin/express_value"
			let obj = {
				first: 0, // 首件(个)/首重(Kg)
				first_price: 0, // 运费(元)
				add: 0, // 续件/续重
				add_price: 0, // 续费(元)
				express_id: this.drawerId, // 运费模板id
				region: [
					['全国','所有','所有']
				], // 可配送区域，具体看课程演示
			}
			this.layout.showLoading()
			this.axios.post(url,obj,{token: true}).then(res=>{
				console.log('res:',res)
				let data = res.data.data
				this.express_values.push(data)
				this.layout.hideLoading()
			}).catch(err => {
				this.layout.hideLoading()
			})
		},
		// 删除策略
		deleteValue(item,index){
			this.$confirm('是否删除该策略?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
					let url = `/admin/express_value/${item.id}/delete`
					let obj = {}
					this.axios.post(url,obj,{token: true}).then(res=>{
						console.log('res:',res)
						this.express_values.splice(index,1)
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
					}).catch(err => {
					})
				})
		},
		// 修改策略
		change(item){
			let url = `/admin/express_value/${item.id}`
			let obj = {...item}
			this.axios.post(url,obj,{token: true}).then(res=>{
				console.log('res:',res)
			}).catch(err => {
			})
		}
		
	}
};
</script>

<style></style>
