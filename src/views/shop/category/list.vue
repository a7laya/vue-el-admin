<template>
	<div class="">
		<div class="p-2 border-bottom " style="margin: -10px -20px 10px -20px;">
			<el-button type="primary" size="mini" @click="createTop">创建顶级分类</el-button>
		</div>
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
	</div>
</template>

<script>
	export default {
		data() {
			return {
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
			// 创建顶级节点
			createTop() {
				let inputValidator = function(val){
						if(!val || val.trim() === ''){
							return '分类名称不能为空'
						}
						return true
					}
				this.$prompt('请输入顶级分类', '提示', {
					confirmButtonText: '创建	',
					cancelButtonText: '取消',
					inputValidator: inputValidator
				}).then(({value}) => {
					console.log('value:',value)
				})
			}
		}
	};
</script>

<style>
	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
	}

	.el-tree-node__content {
		height: 35px;
	}
</style>
