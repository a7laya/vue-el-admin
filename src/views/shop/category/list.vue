<template>
	<div class="">
		<div class="p-2 border-bottom " style="margin: -10px -20px 10px -20px;">
			<el-button type="primary" size="mini" @click="createTop">创建顶级分类</el-button>
		</div>
		<el-tree :data="data" :props="defaultProps" default-expand-all draggable :expand-on-click-node="false"
		@node-click="handleNodeClick" @node-drop="nodeDrop" @node-drag-end="nodeDragEnd">
			<span class="custom-tree-node" slot-scope="{ node, data }">
				<div class="">
					<el-input v-if="data.editStatus" v-model="data.name" size="mini"></el-input>
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
		inject: ['layout'],
		data() {
			return {
				data: [],
				defaultProps: {
					children: 'child',
					label: 'name',
				}
			};
		},
		computed:{
			// 拖拽排序后的数据
			sortData(){
				let data = []
				// 多维数组转1维数组
				let sort = function (arr) {
					arr.forEach(item => {
						data.push(item)
						if(item.child.length) sort(item.child)
					})
				}
				sort(this.data)
				return data.map((item,index)=>{
					return {
						id: item.id,
						order: index,
						category_id: item.category_id
					}
				})
			},
		},
		created() {
			this.__init()
		},
		methods: {
			// 初始化
			__init(){
				this.layout.showLoading()
				this.axios.get('/admin/category',{token: true}).then(res=>{
					let data = res.data.data
					let addEditStatus = function(arr) {
						arr.forEach(item=>{
							item.editStatus=false
							if(item.child.length){
								addEditStatus(item.child)
							}
						})
					}
					addEditStatus(data)
					this.data = data
					this.layout.hideLoading()
				}).catch(err => {
					this.layout.hideLoading()
				})
			},
			// 点击了相应分类节点
			handleNodeClick(item) {
				console.log(item);
			},
			// 显示或隐藏分类节点
			showOrHide(item) {
				let status = item.status ? 0 : 1
				this.layout.showLoading()
				this.axios.post("/admin/category/"+item.id+"/update_status",{status},{token: true}).then(res=>{
					if(!res.data.data) return
					this.$message({
						type: 'success',
						message: `${status ? '显示' : '隐藏'} = ${item.name} = 成功`
					})
					item.status = status
					this.layout.hideLoading()
				}).catch(err => {
					this.layout.hideLoading()
				})
			},
			// 编辑节点标签
			edit(item) {
				if (!item.editStatus) return item.editStatus = true
				if (item.name.trim() === '') {
					return this.$message({
						type: 'error',
						message: '分类名称不能为空'
					})
				}
				this.layout.showLoading()
				this.axios.post("/admin/category/"+item.id,item,{token: true}).then(res=>{
					if(!res.data.data) return
					this.$message({
						type: 'success',
						message: '修改成功'
					})
					item.editStatus = false
					this.layout.hideLoading()
				}).catch(err => {
					this.layout.hideLoading()
				})
			},
			// 删除节点
			remove(node, data) {
				// // 拿到父节点
				// let parent = node.parent
				// // 拿到父节点下所有子节点数组
				// let children = parent.data.children || parent.data
				// // 拿到本节点所处的index
				// let index = children.findIndex(v => v.id === data.id)
				// // 删除本节点
				// children.splice(index, 1)
				this.layout.showLoading()
				this.axios.delete('/admin/category/' + data.id,{token: true}).then(res=>{
					console.log('res:',res)
					this.__init()
				}).catch(err => {
					this.layout.hideLoading()
				})
				
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
				this.layout.showLoading()
				this.axios.post("/admin/category",{
					status: 0,
					name: '新分类',
					category_id: data.id
				},{token: true}).then(res=>{
					console.log('res:',res)
					let obj = res.data.data
					obj.editStatus = true
					obj.child = []
					data.child.unshift(obj)
					this.layout.hideLoading()
				}).catch(err => {
					this.layout.hideLoading()
				})
			},
			// 节点拖拽结束时（可能未成功）触发的事件
			nodeDragEnd(...options){
				console.log("options:",options)
				// 被拖拽节点对应的数据
				let item = options[0].data
				// 结束拖拽进入节点对应的数据
				let obj  = options[1].data
				
				if(obj){
					if(options[2] === 'before' || options[2] === 'after') {
						item.category_id = obj.category_id
					} else {
						item.category_id = obj.id
					}
				}
			},
			// 节点拖拽成功完成时触发的事件
			nodeDrop() {
				this.layout.showLoading()
				this.axios.post("/admin/category/sort",{
					sortdata: JSON.stringify(this.sortData)
				},{token: true}).then(res=>{
					this.__init()
					this.layout.hideLoading()
				}).catch(err => {
					this.layout.hideLoading()
				})
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
					let obj = {
						name: value,
						status: 1,
						editStatus: false,
						category_id: 0, // 顶级分类为0
						child: []
					}
					this.layout.showLoading()
					this.axios.post("/admin/category",obj,{token: true}).then(res=>{
						console.log('res:',res)
						this.__init()
						this.$message({
							type:'success',
							message: `创建顶级分类 =${value}= 成功`
						})
						this.layout.hideLoading()
					}).catch(err => {
						this.layout.hideLoading()
					})
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
