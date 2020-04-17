<template>
	<div class="">
		<el-tabs v-model="preUrl" @tab-click="getList">
			<!-- 管理员列表 -->
			<el-tab-pane label="管理员列表" name="manager">
				<div class="d-flex align-items-center">
					<el-button type="primary" @click="openDialog('manager')" size="small" v-auth="'管理员管理'">添加管理员</el-button>
					<el-input v-model="keyword" size="mini" placeholder="管理员名称关键字" class="ml-auto mr-1" style="width: 220px;"></el-input>
					<el-button type="info" size="mini" @click="getList">搜索</el-button>
				</div>
				<!-- 表格 -->
				<el-table border class="mt-3" :data="managerList" style="width: 100%">
					<el-table-column label="管理员头像" align="center" width="122">
						<template slot-scope="scope">
							<el-avatar :src="scope.row.avatar"></el-avatar>
						</template>
					</el-table-column>
					<el-table-column prop="username" label="管理员名称" align="center" min-width="144"></el-table-column>
					<el-table-column prop="create_time" label="创建时间" align="center" width="188"></el-table-column>
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
							<el-button plain type="text" size="mini" @click="openDialog('manager', scope.row)">修改</el-button>
							<el-button plain type="text" size="mini" @click="deleteItem(scope, managerList)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>

			<!-- 角色列表 -->
			<el-tab-pane label="角色列表" name="role">
				<div class="d-flex align-items-center"><el-button type="primary" @click="openDialog('role')" size="small" v-auth="'角色管理'">添加角色</el-button></div>
				<!-- 表格 -->
				<el-table border class="mt-3" :data="roleList" style="width: 100%">
					<el-table-column prop="name" label="角色名称" align="center" min-width="144"></el-table-column>
					<el-table-column prop="create_time" label="创建时间" align="center" min-width="144"></el-table-column>
					<el-table-column label="状态" align="center" width="120">
						<template slot-scope="scope">
							<el-button plain :type="scope.row.status ? 'success' : 'danger'" size="mini" @click="changeStatus(scope.row)">
								{{ scope.row.status ? '启用' : '禁用' }}
							</el-button>
						</template>
					</el-table-column>
					<el-table-column prop="desc" label="描述" align="center" min-width="200"></el-table-column>
					<el-table-column label="操作" align="center" width="222">
						<template slot-scope="scope">
							<el-button plain type="text" size="mini" @click="openDialog('role', scope.row)">修改</el-button>
							<el-button plain type="text" size="mini" @click="openDrawer(scope)">配置权限</el-button>
							<el-button plain type="text" size="mini" @click="deleteItem(scope, roleList)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>

			<!-- 权限列表 -->
			<el-tab-pane label="权限列表" name="rule">
				<div class="d-flex align-items-center"><el-button type="primary" @click="openDialog('rule')" size="small" v-auth="'添加规则'">添加规则</el-button></div>
				<el-tree :data="ruleList" :props="defaultProps" @node-click="handleNodeClick" default-expand-all :expand-on-click-node="false">
					<span class="custom-tree-node" slot-scope="{ node, data }">
						<div>
							<span v-if="data.menu === 1" :class="data.icon ? data.icon : 'el-icon-star-off'" class="mr-2 text-muted"></span>
							<small v-else class="mr-2 text-muted">{{ data.method }}</small>
							<span>{{ data.name }}</span>
							<span v-if="data.menu" class="badge ml-2">{{ data.frontpath }}</span>
							<span v-else class="badge badge-secondary ml-2">{{ data.condition }}</span>
						</div>
						<span>
							<el-button plain :type="data.status ? 'success' : 'danger'" size="mini" @click="changeStatus(data)">{{ data.status ? '启用' : '禁用' }}</el-button>
							<el-button type="text" plain size="mini" @click.stop="openDialog('rule', data.id)">增加</el-button>
							<el-button type="text" size="mini" @click.stop="openDialog('rule', data)">修改</el-button>
							<el-button type="text" size="mini" @click.stop="deleteItem({ row: data })">删除</el-button>
						</span>
					</span>
				</el-tree>
			</el-tab-pane>
		</el-tabs>

		<!-- 占位 -->
		<div style="height: 120px;"></div>

		<!-- 底部分页 -->
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
		<el-dialog :title="dialogTitle" :visible.sync="dialogVisible" top="5vh" :before-close="handleClose">
			<!-- 添加 | 修改管理员 -->
			<el-form v-if="preUrl === 'manager'" ref="manager" :rules="rules" :model="form.manager" label-width="80px">
				<el-form-item label="用户名" prop="username"><el-input v-model="form.manager.username" placeholder="用户名" size="mini" class="w-50"></el-input></el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input type="password" v-model="form.manager.password" placeholder="密码" size="mini" class="w-50"></el-input>
				</el-form-item>
				<el-form-item label="头像">
					<div>
						<span v-if="!form.manager.avatar" class="btn btn-light p-3" style="line-height: 1;" @click="chooseImage"><i class="el-icon-plus"></i></span>
						<img v-else :src="form.manager.avatar" class="rounded" style="width: 45px; height: 45px; cursor: pointer;" @click="chooseImage" />
					</div>
				</el-form-item>
				<el-form-item label="关联角色" prop="role">
					<el-select v-model="form.manager.role_id" placeholder="请选择角色" size="mini">
						<el-option v-for="(item, index) in roleOptions" :key="index" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="form.manager.status" size="mini">
						<el-radio :label="1" border>启用</el-radio>
						<el-radio :label="0" border>禁用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>

			<!-- 添加 | 修改角色 -->
			<el-form v-if="preUrl === 'role'" ref="role" :rules="rules" :model="form.role" label-width="80px">
				<el-form-item label="角色名称" prop="roleName"><el-input v-model="form.role.name" placeholder="角色名称" size="mini" class="w-50"></el-input></el-form-item>
				<el-form-item label="角色描述" prop="desc">
					<el-input type="textarea" :rows="2" v-model="form.role.desc" placeholder="角色描述" size="mini"></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="form.role.status" size="mini">
						<el-radio :label="1" border>启用</el-radio>
						<el-radio :label="0" border>禁用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>

			<!-- 添加 | 修改规则-->
			<el-form v-if="preUrl === 'rule'" ref="rule" :rules="rules" :model="form.rule" label-width="100px">
				<el-form-item label="上级规则" prop="parentRule">
					<el-select v-model="form.rule.rule_id" placeholder="请选择上级规则" size="mini">
						<el-option label="顶级规则" :value="0"></el-option>
						<el-option v-for="(item, index) in ruleOptions" :key="index" :label="item | tree" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="菜单/规则">
					<el-radio-group v-model="form.rule.menu" size="mini">
						<el-radio :label="1" border>菜单</el-radio>
						<el-radio :label="0" border>规则</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="规则名称" prop="ruleName"><el-input v-model="form.rule.name" placeholder="规则名称" size="mini" class="w-50"></el-input></el-form-item>
				<el-form-item label="图标" prop="icon" v-if="form.rule.menu"><el-input v-model="form.rule.icon" placeholder="图标" size="mini"></el-input></el-form-item>
				<el-form-item label="前台路由路径" prop="frontpath" v-if="form.rule.menu && form.rule.rule_id > 0">
					<el-input v-model="form.rule.frontpath" placeholder="前台路由路径" size="mini"></el-input>
				</el-form-item>
				<el-form-item label="前台路由别名" prop="desc" v-if="form.rule.menu">
					<el-input v-model="form.rule.desc" placeholder="前台路由别名" size="mini"></el-input>
				</el-form-item>
				<el-form-item label="后端规则" prop="condition" v-if="!form.rule.menu">
					<el-input v-model="form.rule.condition" placeholder="后端规则" size="mini"></el-input>
				</el-form-item>
				<el-form-item label="请求方式" prop="method" v-if="!form.rule.menu">
					<el-select v-model="form.rule.method" placeholder="请选择请求方式" size="mini">
						<el-option label="GET" value="GET"></el-option>
						<el-option label="POST" value="POST"></el-option>
						<el-option label="PUT" value="PUT"></el-option>
						<el-option label="DELETE" value="DELETE"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="form.rule.status" size="mini">
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
		
		<el-drawer
		  title="我是标题"
		  :visible.sync="drawer"
		  direction="rtl"
		  :before-close="handleClose">
		  <span>我来啦!</span>
		</el-drawer>
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
				},
				role: {
					name: '',
					desc: '',
					status: 1
				},
				rule: {
					menu: 0,
					rule_id: '',
					name: '',
					status: 1,
					frontpath: '',
					desc: '',
					condition: '',
					icon: '',
					method: 'GET',
					order: 0
				}
			},
			managerList: [], // 管理员 表格数据
			roleList: [], // 角  色 表格数据
			ruleList: [], // 权  限 树状结构数据
			defaultProps: {
				// 权  限 映射字段
				children: 'child',
				label: 'name'
			},
			rules: {
				username: [
					{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}
				],
				roleName: [
					{
						required: true,
						message: '请输入角色名称',
						trigger: 'blur'
					}
				],
				password: [
					{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}
				],
				role: [
					{
						required: true,
						message: '请选择角色',
						trigger: 'blur'
					}
				],
				parentRule: [
					{
						required: true,
						message: '请选择上级规则',
						trigger: 'blur'
					}
				],
				ruleName: [
					{
						required: true,
						message: '请填写规则名称',
						trigger: 'blur'
					}
				],
			},

			dialogVisible: false,
			dialogType: 'manager',
			dialogTitle: '',
			roleOptions: [],
			ruleOptions: [],
			drawer: false,// 抽屉组件是否显示
		};
	},
	computed: {
		tabName() {
			return { manager: '管理员', role: '角色', rule: '权限' }[this.preUrl];
		}
	},
	filters: {
		tree(item) {
			let level = item.level;
			let str = '|';
			if (!level) return item.name;
			for (let i = 0; i < level; i++) {
				str += '--';
			}
			return str + item.name;
		}
	},
	methods: {
		// mixins-common获取数据
		getListResult(e) {
			console.log('e:', e);
			switch (this.preUrl) {
				case 'manager':
					this.roleOptions = e.role;
					this.managerList = e.list;
					break;
				case 'role':
					this.roleList = e.list;
					break;
				case 'rule':
					this.ruleOptions = e.rules;
					this.ruleList = e.list;
					break;
				default:
					break;
			}
		},
		// mixins-common获取请求列表分页的url
		getListUrl() {
			if (this.preUrl === 'manager') return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}&keyword=${this.keyword}`;
			return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}`;
		},

		// ========== 模态框相关操作 ==========
		// 打开模态框
		openDialog(type, item = false) {
			// 传入类型 ‘manager’ - ‘role’ - ‘rule’
			this.dialogType = type;
			this.dialogTitle = `${item ? '修改' : '添加'}${this.tabName}`;
			// 组织表单
			switch (type) {
				case 'manager':
					if (!item) {
						this.form.manager = {
							username: '',
							password: '',
							avatar: '',
							role_id: '',
							status: 1
						};
					} else {
						this.form.manager = { ...item };
					}
					break;
				case 'role':
					if (!item) {
						this.form.role = {
							name: '',
							desc: '',
							status: 1
						};
					} else {
						this.form.role = { ...item };
					}
					break;
				case 'rule':
					if (!item || typeof item === 'number') {
						this.form.rule = {
							menu: 0,
							rule_id: '',
							name: '',
							status: 1,
							frontpath: '',
							desc: '',
							condition: '',
							icon: '',
							method: 'GET',
							order: 0
						};
						this.form.rule.rule_id = item
					} else {
						this.form.rule = { ...item };
					}
					break;
				default:
					break;
			}
			// 显示模态框
			this.dialogVisible = true;
		},
		submit() {
			this.$refs[this.preUrl].validate(res => {
				if(!res) return
				let item = this.form[this.preUrl];
				this.addOrEdit(item, item.id);
				this.dialogVisible = false;
			});
		},

		// 模态框关闭前
		handleClose(done) {
			done()
			// this.$confirm('确认关闭？')
			// 	.then(_ => {
			// 		done();
			// 	})
			// 	.catch(_ => {});
		},

		// 选择头像
		chooseImage() {
			this.app.chooseImage(res => {
				this.form.manager.avatar = res[0].url;
			}, 1);
		},

		// =========== 树结构操作 ==========
		// 点击了相应节点
		handleNodeClick(data) {
			console.log(data);
		},
		
		// 打开抽屉，进行权限配置
		openDrawer(scope) {
			this.drawer = true
		}
	}
};
</script>

<style></style>
