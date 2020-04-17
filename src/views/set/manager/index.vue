<template>
	<div class="">
		<el-tabs v-model="preUrl">
			<!-- 管理员列表 -->
			<el-tab-pane label="管理员列表" name="manager">
				<div class="d-flex align-items-center">
					<el-button type="primary" @click="openDialog('manager')" size="small" v-auth="'管理员管理'">添加管理员</el-button>
					<el-input v-model="keyword" size="mini" placeholder="管理员名称关键字" class="ml-auto mr-1" style="width: 220px;"></el-input>
					<el-button type="info" size="mini" @click="getList">搜索</el-button>
				</div>
				<!-- 表格 -->
				<el-table border class="mt-3" :data="managerList" style="width: 100%">
					<el-table-column label="管理员头像" align="center">
						<template slot-scope="scope">
							<el-avatar :src="scope.row.avatar"></el-avatar>
						</template>
					</el-table-column>
					<el-table-column prop="username" label="管理员名称" align="center" width="122"></el-table-column>
					<el-table-column prop="create_time" label="创建时间" align="center" width="122"></el-table-column>
					<el-table-column label="所属管理员" align="center" width="122">
						<template slot-scope="scope">
							{{ scope.row.role.name }}
						</template>
					</el-table-column>
					<el-table-column label="状态" align="center" width="120">
						<template slot-scope="scope">
							<el-button plain :type="scope.row.status ? 'success' : 'danger'" size="mini" @click="changeStatus(scope.row)">
								{{ scope.row.status ? '启用' : '禁用' }}
							</el-button>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center" width="188">
						<template slot-scope="scope">
							<el-button plain type="text" size="mini" @click="openDialog(scope)">修改</el-button>
							<el-button plain type="text" size="mini" @click="deleteItem(scope, managerList)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>

			<!-- 角色列表 -->
			<el-tab-pane label="角色列表" name="role">
				<div class="d-flex align-items-center"><el-button type="primary" @click="openDialog(false)" size="small" v-auth="'角色管理'">添加角色</el-button></div>
				<!-- 表格 -->
				<el-table border class="mt-3" :data="groupList" style="width: 100%">
					<el-table-column prop="name" label="角色名称" align="center"></el-table-column>
					<el-table-column label="状态" align="center" width="120">
						<template slot-scope="scope">
							<el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center" width="222">
						<template slot-scope="scope">
							<el-button plain type="text" size="mini" @click="openDialog(scope)">修改</el-button>
							<el-button plain type="text" size="mini" @click="openDialog(scope)">配置权限</el-button>
							<el-button plain type="text" size="mini" @click="deleteItem(scope)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>

			<!-- 权限列表 -->
			<el-tab-pane label="权限列表" name="rule">
				<el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" default-expand-all :expand-on-click-node="false" draggable @node-drop="nodeDrop">
					<span class="custom-tree-node" slot-scope="{ node, data }">
						<div class="">
							<el-input v-if="data.editStatus" v-model="data.label" size="mini"></el-input>
							<span v-else>{{ node.label }}</span>
						</div>
						<span>
							<el-button :type="data.status ? 'primary' : 'danger'" plain size="mini" @click.stop="showOrHide(data)">{{ data.status ? '显示' : '隐藏' }}</el-button>
							<el-button type="success" plain size="mini" @click.stop="append(data)">增加</el-button>
							<el-button :type="data.editStatus ? '' : 'warning'" size="mini" @click="edit(data)">{{ data.editStatus ? '完成' : '修改' }}</el-button>
							<el-button type="danger" size="mini" @click.stop="removeConfirm(node, data)">删除</el-button>
						</span>
					</span>
				</el-tree>
			</el-tab-pane>
		</el-tabs>
		<div style="height: 120px;"></div>
		<el-footer v-if="preUrl != 'rule'" class="border-top d-flex align-items-center px-0 bg-white position-fixed fixed-bottom" style="margin-left: 200px;">
			<!-- 分页 -->
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
		<!--===== 新增 | 修改模态框 =====-->
		<el-dialog title="添加会员" :visible.sync="dialogVisible" top="5vh" :before-close="handleClose">
			<!-- 表单内容 -->
			<el-form ref="form" :rules="rules" :model="form.manager" label-width="80px">
				<el-form-item label="用户名" prop="username">
					<el-input v-model="form.manager.username" placeholder="用户名" size="mini" class="w-50"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input type="password" v-model="form.manager.password" placeholder="密码" size="mini" class="w-50"></el-input>
				</el-form-item>
				<el-form-item label="头像">
					<div>
						<span v-if='!form.manager.avatar' class="btn btn-light p-3" style="line-height: 1;"
						@click="chooseImage">
							<i class="el-icon-plus"></i>
						</span>
						<img v-else :src="form.manager.avatar" class="rounded" 
						style="width: 45px; height: 45px; cursor: pointer;"
						@click="chooseImage"/>
					</div>
				</el-form-item>
				<el-form-item label="关联角色">
					<el-select v-model="form.manager.role" placeholder="请选择角色" size="mini">
						<el-option v-for="(item,index) in roleOptions" :key="index" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="form.manager.status" size="mini">
						<el-radio :label="1" border>启用</el-radio>
						<el-radio :label="0" border>禁用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import common from '@/common/mixins/common.js';
export default {
	inject: ['app', 'layout'],
	mixins: [common],
	data() {
		return {
			preUrl: 'manager',
			keyword: '',
			editIndex: -1,
			form: {
				manager: {
					username: '',
					password: '',
					avatar: '',
					role_id: '',
					status: 1
				}
			},
			managerList: [], // 管理员列表表格数据
			groupList: [
				{
					id: 1,
					name: '超级管理员',
					status: 1
				}
			],
			data: [
				{
					id: 1,
					label: '一级 1',
					status: 1,
					editStatus: false,
					children: [
						{
							id: 2,
							label: '二级 1-1',
							status: 1,
							editStatus: false,
							children: [
								{
									id: 3,
									label: '三级 1-1-1',
									status: 1,
									editStatus: false,
									children: []
								}
							]
						}
					]
				}
			],
			defaultProps: {
				children: 'children',
				label: 'label',
				status: 1,
				editStatus: false
			},
			rules: {
				name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
				level: [{ required: true, message: '请输入密码', trigger: 'blur' }]
			},
			
			dialogVisible: false,
			dialogType: "manager",
			
			roleOptions: [],
		};
	},
	methods: {
		// mixins-common获取数据
		getListResult(e) {
			console.log('e:', e);
			this.roleOptions = e.role
			this.managerList = e.list
		},
		// mixins-common获取请求列表分页的url
		getListUrl() {
			if (this.preUrl === 'manager') return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}&keyword=${this.keyword}`;
			return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}`;
		},
		submit() {
			console.log('保存');
		},
		// 打开模态框
		openDialog(type) {
			this.dialogType = type
			this.dialogVisible = true
		},
		// 点击了相应节点
		handleNodeClick(data) {
			console.log(data);
		},
		// 显示或隐藏节点
		showOrHide(data) {
			data.status = data.status ? 0 : 1;
		},
		// 编辑节点标签
		edit(data) {
			data.editStatus = !data.editStatus;
		},
		// 删除节点
		remove(node, data) {
			// 拿到父节点
			let parent = node.parent;
			// 拿到父节点下所有子节点数组
			let children = parent.data.children || parent.data;
			// 拿到本节点所处的index
			let index = children.findIndex(v => v.id === data.id);
			// 删除本节点
			children.splice(index, 1);
		},
		// 删除节点确认
		removeConfirm(node, data) {
			this.$confirm('是否删除节点: ' + node.label, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.remove(node, data);
			});
		},
		// 增加子节点
		append(data) {
			let newObj = {
				id: 2,
				label: '二级 1-1',
				status: 1,
				editStatus: true,
				children: []
			};
			data.children.push(newObj);
		},
		// 节点拖拽结束后
		nodeDrop() {
			console.log('arguments0:', arguments[0]);
			console.log('arguments1:', arguments[1]);
		},

		// 模态框关闭前
		handleClose(done) {
			this.$confirm('确认关闭？')
				.then(_ => {
					done();
				})
				.catch(_ => {});
		},
		
		// 选择头像
		chooseImage(){
			this.app.chooseImage(res=>{
				this.form.manager.avatar = res[0].url
			}, 1)
		},
	}
};
</script>

<style></style>
