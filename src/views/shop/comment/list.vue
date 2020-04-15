<template>
	<div class="bg-white h-100 px-3 py-2" style="margin:-8px -20px 20px -20px; ">
		<!-- <div>
			<el-button size="medium" type="danger" @click="deleteAllConfirm">批量删除</el-button>
		</div> -->
		<button-search ref="buttonSearch" @search="searchEvent" @openSuperSearch="form.username = $event" placeholder="要搜索的">
			<!-- 左边插槽 -->
			<template #left>
				<el-button type="danger" size="mini">删除评论</el-button>
			</template>

			<!-- 高级搜索表单插槽 -->
			<template #form>
				<el-form ref="form" :model="form" label-width="80px" inline>
					<el-form-item label="评价用户" class="mb-0"><el-input v-model="form.username" size="mini" placeholder="评价用户"></el-input></el-form-item>
					<el-form-item label="评价类型" class="mb-0">
						<el-select v-model="form.type" placeholder="请选择评价类型" size="mini">
							<el-option label="评价类型一" value="shanghai"></el-option>
							<el-option label="评价类型二" value="beijing"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="发布时间" class="mb-0">
						<el-date-picker
							v-model="form.time"
							type="daterange"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							size="mini"
						></el-date-picker>
					</el-form-item>
					<el-form-item class="mb-0">
						<el-button type="info" size="mini" class="ml-2" @click="searchEvent">搜索</el-button>
						<el-button type="" size="mini" @click="clearSearch">清空筛选条件</el-button>
					</el-form-item>
				</el-form>
			</template>
		</button-search>
		<!-- 表格 -->
		<el-table border class="mt-3" @selection-change="handleSelectionChange" :data="tableData" style="width: 100%">
			<el-table-column type="selection" width="55" align="center"></el-table-column>
			<el-table-column type="expand">
				<template slot-scope="scope">
					<div class="media">
						<img src="../../../assets/demo1.jpeg" class="mr-3 rounded-circle" style="width: 50px;height: 50px;"/>
						<div class="media-body">
							<h6 class="mt-0 mb-0 d-flex">
								用户名1<small class="ml-2">2020-12-12 12:12:12</small>
								<el-button type="danger" class="ml-auto" size="mini">删除</el-button>
							</h6>
							撒旦飞洒地方撒旦饭卡上来看JFK撒酒疯的
							<div class="media bg-light p-1 mt-2 rounded">
								<img src="../../../assets/avatar.png" class="mr-3 rounded-circle" style="width: 50px; height: 50px;" />
								<div class="media-body">
									<h6 class="mt-0 d-flex">
										客服1<small class="ml-2">2020-12-12 12:12:12</small>
										<el-button-group>
											<el-button type="success" size="mini">修改</el-button>
											<el-button type="warning" size="mini">删除</el-button>
										</el-button-group>
									</h6>
									撒旦飞洒地方撒旦饭卡上来看JFK撒酒疯的
								</div>
							</div>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="id" label="ID" align="center" width="70"></el-table-column>
			<el-table-column prop="name" label="商品"  width="380">
				<template slot-scope="scope">
					<div class="media">
						<img class="mr-3 rounded" :src="scope.row.goods_item.cover" style="width: 40px; height: 40px;" />
						<div class="media-body">
							<h6 class="mt-0">{{ scope.row.goods_item.title }}</h6>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="info" label="评价信息" width="185">
				<template slot-scope="scope">
					<div class="d-flex flex-column">
						<div>用户名: {{scope.row.user.username}}</div>
						<el-rate disabled v-model="scope.row.rating"></el-rate>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="create_time" label="评价时间" align="center" width="155"></el-table-column>
			<el-table-column prop="create_time" label="是否显示" align="center" width="140">
				<template slot-scope="scope">
					<el-button plain :type="scope.row.status ? 'success' : 'danger'" size="mini" @click="changeStatus(scope.row)">
						{{ scope.row.status ? '显示' : '隐藏' }}
					</el-button>
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
	</div>
</template>

<script>
import buttonSearch from '@/components/common/button-search.vue';
import common from '@/common/mixins/common.js';
export default {
	inject: ['layout'],
	mixins: [common],
	components: {
		buttonSearch
	},
	data() {
		return {
			preUrl: 'goods_comment',
			form: {
				username: '',
				code: '',
				type: '',
				time: ''
			},
			tableData: [],
			// tableData: [
			// 	{	
			// 		id: 1,
			// 		name: '颜色1',
			// 		goods: {
			// 			title: "扫描仪",
			// 			cover: "http://127.0.0.1:8080/img/demo1.4419d7d7.jpeg"
			// 		},
			// 		username: "a7laya",
			// 		star: 5,
			// 		create_time: '2020-12-12 12:12:12',
			// 		status: 1,
			// 	}
			// ],
		};
	},
	methods: {
		// 重写mixin中common.js的getListResult方法来处理后端数据
		getListResult(e){
			console.log("e:",e)
			this.tableData = e.list
		},
		// 清空筛选条件
		clearSearch() {
			this.form = {
				username: '',
				code: '',
				type: '',
				time: ''
			};
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
		// 表格多选
		handleSelectionChange(val) {
			this.multipleSelection = val;
			console.log('this.multipleSelection:', this.multipleSelection);
		},
		// 批量删除
		deleteAll() {
			this.multipleSelection.forEach(item => {
				let index = this.tableData.findIndex(v => v.id === item.id);
				if (index !== -1) {
					this.tableData.splice(index, 1);
				}
			});
			this.multipleSelection = [];
		},
		// 批量删除确认
		deleteAllConfirm() {
			this.$confirm('是否删除选中规格?', '提示', {
				confirmButtonText: '删除',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.deleteAll();
				this.$message({
					type: 'success',
					message: '删除成功!'
				});
			});
		},
		// 分页动作
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
		},
		handleCurrentChange(val) {
			console.log(`当前页: ${val}`);
		}
	}
};
</script>

<style>
.el-radio {
	margin-right: 0;
}
</style>
