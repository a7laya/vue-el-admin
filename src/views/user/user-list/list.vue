<template>
	<div class="bg-white h-100 px-3 py-2" style="margin:-8px -20px 20px -20px; ">

		<button-search ref="buttonSearch" @search="searchEvent" @openSuperSearch="search.keyword = $event" class="pt-2" width="160" placeholder="手机号/邮箱/会员昵称">
			<template #left>
				<el-button size="mini" type="success" @click="openModel(false)">添加会员</el-button>
			</template>
			<!-- 高级搜索表单插槽 -->
			<template #form>
				<el-form ref="form" :model="search" label-width="80px" inline>
					<el-form-item label="搜索内容" class="mb-0"><el-input v-model="search.keyword" size="mini" placeholder="手机号/邮箱/会员昵称"></el-input></el-form-item>
					<el-form-item label="会员等级" class="mb-0">
						<el-select v-model="search.group_id" placeholder="请选择会员等级" size="mini">
							<el-option label="0" value="shanghai"></el-option>
							<el-option label="1" value="beijing"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="发布时间" class="mb-0">
						<el-date-picker v-model="search.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="mini"></el-date-picker>
					</el-form-item>
					<el-form-item class="mb-0">
						<el-button type="info" size="mini" class="ml-2" @click="searchEvent">搜索</el-button>
						<el-button type="" size="mini" @click="clearSearch">清空筛选条件</el-button>
					</el-form-item>
				</el-form>
			</template>
		</button-search>
		<!-- 表格 -->
		<el-table border class="mt-3"  :data="tableData" style="width: 100%">
			<el-table-column label="会员">
				<template slot-scope="scope">
					<div class="media">
						<img class="mr-3 rounded-circle" :src="scope.row.avatar" style="width: 50px; height: 50px;" />
						<div class="media-body">
							<h6 class="d-flex align-items-center">
								{{scope.row.username}}<el-button type="text" size="mini" class="ml-auto">详情</el-button>
							</h6>
							用户ID：{{scope.row.id}}
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="level.name" label="会员等级" align="center" width="188"></el-table-column>
			<el-table-column label="登录/注册" align="center" width="288">
				<template slot-scope="scope">
					<div>注册时间：{{scope.row.create_time}}</div>
					<div>最后登录：{{scope.row.update_time}}</div>
				</template>
			</el-table-column>
			<el-table-column label="状态" align="center" width="120">
				<template slot-scope="scope">
					<el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="188">
				<template slot-scope="scope">
					<el-button plain type="text" size="mini" @click="openModel(scope)">修改</el-button>
					<el-button plain type="text" size="mini" @click="openModel(scope)">重置密码</el-button>
					<el-button plain type="text" size="mini" @click="deleteItem(scope)">删除</el-button>
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
		
		
		<!--===== 新增 | 修改会员模态框 =====-->
		<el-dialog title="添加会员" :visible.sync="createModel" top="5vh">
			<!-- 表单内容 -->
			<el-form ref="form" :rules="rules" :model="form" label-width="80px">
				<el-form-item label="用户名" prop="username">
					<el-input v-model="form.username" placeholder="用户名" size="mini" class="w-50"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input type="password" v-model="form.password" placeholder="密码" size="mini" class="w-50"></el-input>
				</el-form-item>
				<el-form-item label="昵称" prop="nickname">
					<el-input v-model="form.nickname" placeholder="昵称" size="mini" class="w-50"></el-input>
				</el-form-item>
				<el-form-item label="头像">
					<div>
						<span v-if='!form.avatar' class="btn btn-light p-3" style="line-height: 1;"
						@click="chooseImage">
							<i class="el-icon-plus"></i>
						</span>
						<img v-else :src="form.avatar" class="rounded" 
						style="width: 45px; height: 45px; cursor: pointer;"
						@click="chooseImage"/>
					</div>
				</el-form-item>
				<el-form-item label="会员等级">
					<el-select v-model="form.level_id" placeholder="请选择会员等级">
						<el-option label="普通会员" :value="1"></el-option>
						<el-option label="黄金会员" :value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="form.status" size="mini">
						<el-radio :label="1" border>启用</el-radio>
						<el-radio :label="0" border>禁用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="手机">
					<el-input size="mini" v-model="form.phone" placeholder="请输入手机号"></el-input>
				</el-form-item>
				<el-form-item label="邮箱">
					<el-input size="mini" v-model="form.email" placeholder="请输入邮箱号"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="form.sex" size="mini">
						<el-radio :label="0" border>保密</el-radio>
						<el-radio :label="1" border>男</el-radio>
						<el-radio :label="2" border>女</el-radio>
					</el-radio-group>
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
				search: {
					keyword: "",
					group_id: 0,
					time: ""
				},
				editIndex: -1,
				form: {
					username: '',
					password: '',
					nickname: '',
					avatar: '',
					level_id: '',
					phone: '',
					email: '',
					sex: 0,
					status: 1,
				},
				tableData: [
					{
						id: 1, 
						username: 'laya', 
						avatar: 'http://127.0.0.1:8080/img/demo1.4419d7d7.jpeg',
						level_id: 1,
						level: {
							id: 1,
							name: '普通会员'
						},
						create_time: '2020-01-01 12:12:12',
						update_time: '2020-01-01 12:12:12',
						status: 1, // 1 启用  0 禁用
					}
				],
				currentPage: 1,
				createModel: false,
				// 表单验证
				rules:{
					username: [
						{required: true, message: "用户名不能为空", trigger: "blur"},
					],
					password: [
						{required: true, message: "密码不能为空", trigger: "blur"},
					],
					nickname: [
						{required: true, message: "昵称不能为空", trigger: "blur"},
					]
				},
			};
		},
		methods: {
			// 打开模态框
			openModel(e = false){
				// 增加
				if(!e){
					// 初始化表单
					this.form = {
						username: '',
						password: '',
						nickname: '',
						avatar: '',
						level_id: '',
						phone: '',
						email: '',
						sex: 0,
						status: 1,
					}
					this.editIndex = -1
				} else {
					// 修改
					this.form = {...e.row}
					this.editIndex = e.$index
				}
				// 打开dialog
				this.createModel = true
			},
			// 改变会员状态
			changeStatus(item){
				item.status = item.status === 1 ?  0 : 1
				this.$message({
					type: 'success',
					message: item.status === 1 ? `已启用: ${item.name}` : `已禁用: ${item.name}`,
				});
			},
			// 提交模态框
			submit(){
				// 验证成功后才提交
				this.$refs.form.validate(res => {
					let msg = "添加"
					if(!res) return
					if(this.editIndex === -1){
						this.form.level = {
							id:1,
							name:'普通会员'
						}
						this.tableData.unshift(this.form)
					} else {
						this.tableData.splice(this.editIndex, 1, this.form)
						msg = "修改"
					}
					// 关闭模态框 并提示成功
					this.createModel = false
					this.$message({
						message: msg + '成功',
						type: 'success'
					});
				})
			},
			deleteItem(scope){
				this.$confirm('确定删除: ' + scope.row.username, '提示', {
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
			
			// 分页动作
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
			},
			
			// 清空筛选条件
			clearSearch() {
				this.search = {
					keyword: "",
					group_id: 0,
					time: ""
				}
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
			// 选择头像
			chooseImage(){
				this.app.chooseImage(res=>{
					this.form.avatar = res[0].url
				}, 1)
			},
		}
	};
</script>

<style>
	.el-radio {
		margin-right: 0;
	}
</style>
