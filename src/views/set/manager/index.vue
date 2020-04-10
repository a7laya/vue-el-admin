<template>
	<div class="">
		<el-tabs v-model="activeName">
			<!-- 管理员列表 -->
			<el-tab-pane label="管理员列表" name="second">
				<div class="d-flex align-items-center">
					<el-button type="primary" @click="openModel(false)" size="small">添加管理员</el-button>
					<el-input v-model="keyword" size="mini" placeholder="请输入关键字" class="ml-auto mr-1" style="width: 220px;"></el-input>
					<el-button type="info" size="mini">搜索</el-button>
				</div>
				<!-- 表格 -->
				<el-table border class="mt-3" :data="managerList" style="width: 100%">
					<el-table-column label="管理员头像" align="center">
						<template slot-scope="scope">
							<el-avatar :src="scope.row.avatar" size="50"></el-avatar>
						</template>
					</el-table-column>
					<el-table-column prop="username" label="登录账号" align="center" width="122"></el-table-column>
					<el-table-column prop="phone" label="手机号" align="center" width="122"></el-table-column>
					<el-table-column prop="email" label="邮箱" align="center" width="222"></el-table-column>
					<el-table-column label="所属管理员" align="center" width="122">
						<template slot-scope="scope">
							{{scope.row.group.name}}
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
							<el-button plain type="text" size="mini" @click="deleteItem(scope)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>

			<!-- 角色列表 -->
			<el-tab-pane label="角色列表" name="third">
				<div class="d-flex align-items-center">
					<el-button type="primary" @click="openModel(false)" size="small">添加角色</el-button>
				</div>
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
							<el-button plain type="text" size="mini" @click="openModel(scope)">修改</el-button>
							<el-button plain type="text" size="mini" @click="openModel(scope)">配置权限</el-button>
							<el-button plain type="text" size="mini" @click="deleteItem(scope)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			
			<!-- 权限列表 -->
			<el-tab-pane label="权限列表" name="auth">
				<el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" default-expand-all :expand-on-click-node="false"
				 draggable @node-drop="nodeDrop">
					<span class="custom-tree-node" slot-scope="{ node, data }">
						<div class="">
							<el-input v-if="data.editStatus" v-model="data.label" size="mini"></el-input>
							<span v-else>{{ node.label }}</span>
						</div>
						<span>
							<el-button :type="data.status ? 'primary' : 'danger'" plain size="mini" @click.stop="showOrHide(data)">
								{{data.status ? "显示" : "隐藏"}}
							</el-button>
							<el-button type="success" plain size="mini" @click.stop="append(data)">增加</el-button>
							<el-button :type="data.editStatus ? '' : 'warning'" size="mini" @click="edit(data)">
								{{data.editStatus ? "完成" : "修改"}}
							</el-button>
							<el-button type="danger" size="mini" @click.stop="removeConfirm(node, data)">删除</el-button>
						</span>
					</span>
				</el-tree>
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
			keyword: '',
			editIndex: -1,
			createModel: false,
			form: {
				key: '',
				customer: ''
			},
			activeName: 'second',
			managerList: [
				{	
					id: 1,
					username: 'laya',
					avatar: 'http://127.0.0.1:8080/img/demo1.4419d7d7.jpeg',
					phone: '123',
					email: '123@123.cpm',
					group_id: 1,
					group: {
						id: 1,
						name: '管理员'
					},
					status: 1, // 1-启用
				}
			],
			groupList: [
				{
					id:1,
					name: '超级管理员',
					status: 1
				}
			],
			data: [{
				id: 1,
				label: '一级 1',
				status: 1,
				editStatus: false,
				children: [{
					id: 2,
					label: '二级 1-1',
					status: 1,
					editStatus: false,
					children: [{
						id: 3,
						label: '三级 1-1-1',
						status: 1,
						editStatus: false,
						children: []
					}]
				}]
			}],
			defaultProps: {
				children: 'children',
				label: 'label',
				status: 1,
				editStatus: false,
			}
		};
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
		// 点击了相应节点
		handleNodeClick(data) {
			console.log(data);
		},
		// 显示或隐藏节点
		showOrHide(data) {
			data.status = data.status ? 0 : 1
		},
		// 编辑节点标签
		edit(data) {
			data.editStatus = !data.editStatus
		},
		// 删除节点
		remove(node, data) {
			// 拿到父节点
			let parent = node.parent
			// 拿到父节点下所有子节点数组
			let children = parent.data.children || parent.data
			// 拿到本节点所处的index
			let index = children.findIndex(v => v.id === data.id)
			// 删除本节点
			children.splice(index, 1)
		},
		// 删除节点确认
		removeConfirm(node, data) {
			this.$confirm('是否删除节点: ' + node.label, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.remove(node, data)
			})
		},
		// 增加子节点
		append(data) {
			let newObj = {
				id: 2,
				label: '二级 1-1',
				status: 1,
				editStatus: true,
				children: []
			}
			data.children.push(newObj)
		},
		// 节点拖拽结束后
		nodeDrop() {
			console.log('arguments0:', arguments[0])
			console.log('arguments1:', arguments[1])
		
		},
		
	}
};
</script>

<style></style>
