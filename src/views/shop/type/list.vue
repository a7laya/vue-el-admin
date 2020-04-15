<template>
	<div class="bg-white h-100 px-3 py-2" style="margin:-8px -20px 20px -20px; ">
		<div>
			<el-button size="medium" type="success" @click="openModel(false)">添加类型</el-button>
			<el-button size="medium" type="danger"  @click="deleteAll">批量删除</el-button>
		</div>
		<!-- 表格 -->
		<el-table border class="mt-3" @selection-change="handleSelectionChange" :data="tableData" style="width: 100%">
			<el-table-column type="selection" width="55" align="center"></el-table-column>
			<el-table-column prop="name" label="类型名称" align="center"></el-table-column>
			<el-table-column label="类型标签" align="center" width="380">
				<template slot-scope="scope">
					{{ scope.row.value_list | formatValue }}
				</template>
			</el-table-column>
			<el-table-column prop="order" label="排序" align="center" width="55"></el-table-column>
			<el-table-column label="状态" align="center" width="120">
				<template slot-scope="scope">
					<el-button plain :type="scope.row.status ? 'success' : 'danger'" size="mini" @click="changeStatus(scope.row)">
						{{ scope.row.status ? '启用' : '禁用' }}
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
		<!-- 新增 | 修改类型模态框 -->
		<el-dialog title="添加类型" :visible.sync="createModel" top="5vh" width="80%">
			<!-- 表单内容 -->
			<el-form ref="form" :rules="rules" :model="form" label-width="80px">
				<el-form-item label="类型名称" prop="name"><el-input v-model="form.name" placeholder="类型名称" size="mini" class="w-50"></el-input></el-form-item>
				<el-form-item label="类型排序"><el-input-number v-model="form.order" :min="0" size="mini"></el-input-number></el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="form.status" size="mini">
						<el-radio :label="1" border>启用</el-radio>
						<el-radio :label="0" border>禁用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="关联规格">
					<div class="d-flex">
						<span class="sku-list-item px-3 py-2 border rounded mr-3 text-center"
						v-for="(item,index) in form.sku_list" :key="index">
							<font>{{item.name}}</font>
							<i class="el-icon-delete" @click="deleteFormSkuList(index,item)"></i>
						</span>
						<el-button size="mini" @click='chooseSkus'><i class="el-icon-plus"></i></el-button>
					</div>
				</el-form-item>
				<el-form-item label="属性列表">
					<el-table :data="value_list" style="width: 100%">
						<el-table-column label="排序" width="80">
							<template slot-scope="scope">
								<el-input type="number" size="mini" v-model="scope.row.order"></el-input>
							</template>
						</el-table-column>
						<el-table-column label="属性名称" width="100">
							<template slot-scope="scope">
								<el-input size="mini" v-model="scope.row.name" placeholder="属性名称"></el-input>
							</template>
						</el-table-column>
						<el-table-column label="所属类型" width="130">
							<template slot-scope="scope">
								<el-select v-model="scope.row.type" placeholder="请选择所属类型" size="mini">
									<el-option label="输入框" value="input"></el-option>
									<el-option label="单选框" value="radio"></el-option>
									<el-option label="复选框" value="checkbox"></el-option>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column label="是否显示" width="80">
							<template slot-scope="scope">
								<el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
							</template>
						</el-table-column>
						<el-table-column label="属性值">
							<template slot-scope="scope" v-if="scope.row.type !== 'input'">
								<el-input
									v-if="scope.row.isEdit"
									type="textarea"
									:rows="2"
									v-model="scope.row.default"
									placeholder="一行一个属性值,多个属性值换行输入"
									size="mini"
								></el-input>
								<font v-else>{{ scope.row.default }}</font>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="180">
							<template slot-scope="scope">
								<el-button v-if="scope.row.type !== 'input'" type="text" size="mini" @click="editRow(scope)">
									{{ scope.row.isEdit ? '完成' : '编辑属性值' }}
								</el-button>
								<el-button type="text" size="mini" @click="delRow(scope)">删除</el-button>
							</template>
						</el-table-column>
					</el-table> 
				</el-form-item>
				<el-form-item label=""><el-button type="text" size="mini" icon="el-icon-plus" @click="addValue">添加属性</el-button></el-form-item>
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
	inject: ['layout','app'],
	mixins: [common],
	components: {
		buttonSearch
	},
	data() {
		return {
			preUrl: 'goods_type', 
			editIndex: -1,
			form: {
				name: '',
				order: 50,
				status: 1,
				sku_list: [],
			},
			value_list: [],
			// value_list: [{ order: 50, name: '屏幕', type: 'input', status: 1, default: '属性值', isEdit: false }],
			// 表单验证
			rules: {
				name: [{ required: true, message: '类型名称不能为空', trigger: 'blur' }]
			},
			tableData: [],
			// tableData: [
			// 	{
			// 		id: 1,
			// 		name: '手机',
			// 		order: 50,
			// 		status: 1, // 1 启用  0 禁用
			// 		sku_list: [
			// 			// 关联的类型
			// 			{ id: 1, name: '颜色' },
			// 			{ id: 2, name: '尺寸' }
			// 		],
			// 		value_list: [
			// 			{ order: 50, name: '屏幕', type: 'input', status: 1, default: '属性值', isEdit: false },
			// 			{ order: 50, name: '屏幕', type: 'input', status: 1, default: '属性值', isEdit: false }
			// 		]
			// 	}
			// ],
			createModel: false
		};
	},
	computed: {
		// 关联到品类下的规格id组成的一维数组
		skus_id(){
			return this.form.sku_list.map(item=>item.id)
		}
	},
	filters: {
		formatValue(value_list) {
			let arr = value_list.map(v => v.name);
			return arr.join(',');
		}
	},
	methods: {
		// 重写mixin中common.js的getListResult方法来处理后端数据
		getListResult(e){
			// console.log("e:",e)
			this.tableData = e.list.map(item => {
				item.value_list = item.goods_type_values
				item.value_list.forEach(v=>{
					v.isEdit = false
					return v
				})
				item.sku_list = item.skus
				return item
			})
		},
		// 打开模态框
		openModel(e = false) {
			// 增加
			if (!e) {
				// 初始化表单
				this.form = {
					name: '',
					order: 50,
					status: 1,
					sku_list: [],
				};
				this.value_list = []
				this.editIndex = -1;
			} else {
				// 修改
				this.form = {...e.row};
				this.value_list = [...e.row.value_list]
				console.log("this.value_list:",this.value_list)
				this.editIndex = e.$index;
			}
			// 打开dialog
			this.createModel = true;
		},
		// 提交类型
		submit() {
			// 验证成功后才提交
			this.$refs.form.validate(res => {
				if (!res) return;
				// 验证属性列表
				let result = true
				let message = [] // 存储错误消息
				this.value_list.forEach((item, index) => {
					if(item.order === '') {
						result = result && false
						message.push(`属性列表第${index+1}行,排序不能为空`)
					} 
					if(item.name === '') {
						result = result && false
						message.push(`属性列表第${index+1}行,属性名称不能为空`)
					} 
					if(item.type !== 'input' && item.default === '') {
						result = result && false
						message.push(`属性列表第${index+1}行,属性值不能为空`)
					}
				});
				if(!result) return this.$notify({
					title: '属性列表提示',
					type: 'warning',
					dangerouslyUseHTMLString: true,
					message: message.join('<br>')
				});
				
				// 👇👇👇 进行添加或修改 👇👇👇
				
				// 将value_list属性列表里面的属性值换行改成逗号
				let value_list = this.value_list.map(item => {
					if(item.default) item.default = item.default.replace(/\n/g,',')
					return item
				})
				// 组织传入的对象
				let obj = {
					...this.form,
					skus_id: this.skus_id,
					value_list: [...this.value_list]
				}
				// 直接调用mixins里面的方法就ok了
				this.addOrEdit(obj,obj.id)
			});
		},
		// 分页动作
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
		},
		handleCurrentChange(val) {
			console.log(`当前页: ${val}`);
		},
		// 添加属性
		addValue() {
			this.value_list.push({ order: 50, name: '', type: 'input', status: 1, value: '', isEdit: false });
		},
		// 编辑属性值
		editRow(scope) {
			scope.row.isEdit = !scope.row.isEdit;
			scope.row.default = scope.row.isEdit ?  scope.row.default.replace(/,/g,'\n') :  scope.row.default.replace(/\n/g,',')
		},
		// 删除属性
		delRow(scope) {
			this.$confirm('是否删除属性: ' + scope.row.name, '提示', {
				confirmButtonText: '删除',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.value_list.splice(scope.$index, 1);
				this.$message({
					type: 'success',
					message: '删除成功!'
				});
			});
		},
		// 选择关联规格
		chooseSkus(){
			this.app.chooseSkus(e=>{
				console.log('e:',e)
				let index = this.form.sku_list.findIndex(item=>item.id === e.id)
				if(index > -1) return this.$message({
					type: 'warning',
					message: '已存在相同规格'
				})
				this.form.sku_list.push(e)
			})
		},
		// 移除关联规格
		deleteFormSkuList(index,item) {
			this.$confirm('是否移除 “'+item.name+'” 关联?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.form.sku_list.splice(index,1)
			})
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
</style>
