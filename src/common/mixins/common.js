/* 
 * 数据表格处理:
 * 1.先mixins引入common.js
 * 2.修改页面中<el-pagination>标签中的属性值，使其与page{}里面的字段一致
 * 3.重写data里面的preUrl
 * 4.重写methods里面的getListResult方法
 * 5.必要时重写methods里面的getListUrl,(例如需要传入除了current/size之外的其他参数)
 */
export default {
	data() {
		return {
			preUrl: '',
			loading: true,  // 如果不需要在layout布局中显示加载动画，需将loading重写为false
			page: {
				total: 0, // 数据总条数
				current: 1, // 当前页
				size: 10,
				sizes: [10,20,50,100],
			},
			multipleSelection: [], // 选中的数据
		}
	},
	computed: {
		ids(){
			return this.multipleSelection.map(v=>v.id)
		}
	},
	filters: {
		numToString(val) {
			return val.toString()
		}
	},
	created(){
		this.getList()
	},
	methods: {
		showLoading(){
			if(this.loading) this.layout.showLoading()
		},
		hideLoading(){
			if(this.loading) this.layout.hideLoading()
		},
		// 处理后端数据的方法
		getListResult(data){
			// 留空让调用mixins的页面去重写、处理data
		},
		// 获取请求列表分页的url
		getListUrl(){
			return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}`
		},
		
		// 获取后端数据
		getList(){
			if(this.preUrl.trim() === '') return
			this.showLoading()
			let url = this.getListUrl()
			this.axios.get(url,{token:true})
				.then(res=>{
					let data = res.data.data
					this.page.total = data.totalCount
					
					// 暴露data给getListResult方法，其他页面重写getListResult就可以调用到data
					this.getListResult(data)
					this.hideLoading()
				}).catch(err => {
					this.hideLoading()
				})
		},
		
		// 添加 | 编辑数据方法 (添加和修改的区别=>修改要多传个id)
		addOrEdit(data, id = 0){
			// this.editIndex判断添加/修改 引用相应的api接口
			let url = !id ? `/admin/${this.preUrl}` : `/admin/${this.preUrl}/${id}`
			this.showLoading()
			this.axios.post(url,data,{token: true}).then(res=>{
				this.getList()
				// 关闭模态框 并提示成功
				this.createModel = false
				this.$message({
					message: `${!id ? '添加' : '修改'}成功`,
					type: 'success'
				});
				// this.hideLoading()
			}).catch(err => {
				this.hideLoading()
			})
		},
		
		/* 
		 * ===== 删除单个 =====
		 * 为了提高用户体验，传入一个list，直接不用刷新页面在页面上删除该行
		 */
		deleteItem(scope, list = false){
			console.log("scope:",scope)
			let name = scope.row.name || scope.row.username || '该行'
			this.$confirm('确定删除 ' + name, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let url = `/admin/${this.preUrl}/${scope.row.id}/delete`
				let obj = {}
				this.showLoading()
				this.axios.post(url,obj,{token: true}).then(res=>{
					if(list) {
						list.splice(scope.$index,1)
					} else if (this.tableData) {
						this.tableData.splice(scope.$index,1)
					} else {
						this.getList()
					}
					this.$message({
						message: '删除成功',
						type: 'success'
					});
					this.hideLoading()
				}).catch(err => {
					this.hideLoading()
				})
			})
		},
		
		// 批量删除
		deleteAll(){
			if(!this.ids.length) return this.$message({
				type: 'warning',
				message: '请先选中要删除的行'
			})
			this.$confirm('是否删除选中行?', '提示', {
				confirmButtonText: '删除',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
					let url = `/admin/${this.preUrl}/delete_all`
					console.log("this.ids:",this.ids)
					let obj = {ids:this.ids}
					this.showLoading()
					this.axios.post(url,obj,{token: true}).then(res=>{
						console.log('res:',res)
						this.getList()
						this.multipleSelection = []
						this.$message({
							type: 'success',
							message: '删除成功!'
						})
						this.hideLoading()
					}).catch(err => {
						this.hideLoading()
					})
				})
		},
		
		// 修改状态 - 启用 | 禁用
		changeStatus(item){
			let status = item.status === 1 ?  0 : 1
			item.name = item.name || ''
			let url = `/admin/${this.preUrl}/${item.id}/update_status`
			let obj = {status}
			this.showLoading()
			this.axios.post(url,obj,{token: true}).then(res=>{
				item.status = status
				this.$message({
					type: 'success',
					message: item.status === 1 ? `已启用 ${item.name}` : `已禁用 ${item.name}`,
				});
				this.hideLoading()
			}).catch(err => {
				this.hideLoading()
			})
		},
		
		// 表格多选
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		// 分页动作
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
			this.page.size = val
			this.getList()
		},
		handleCurrentChange(val) {
			console.log(`当前页: ${val}`);
			this.page.current = val
			this.getList()
		},
	}
}
