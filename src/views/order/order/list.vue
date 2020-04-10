<template>
	<div class="bg-white h-100 px-3 py-2" style="margin:-8px -20px 20px -20px; ">
		<el-tabs v-model="tabIndex" @tab-click="handleClick">
			<el-tab-pane v-for="(item, index) in tabbars" :key="index" :label="item.name" class="bg-white">
				<button-search ref="buttonSearch" @search="searchEvent" @openSuperSearch="form.name = $event" placeholder="要搜索的订单编号">
					<!-- 左边插槽 -->
					<template #left>
						<el-button type="success" size="mini">导出数据</el-button>
						<el-button type="danger" size="mini">批量删除</el-button>
					</template>

					<!-- 高级搜索表单插槽 -->
					<template #form>
						<el-form ref="form" :model="form" label-width="80px" inline>
							<el-form-item label="订单编号" class="mb-0"><el-input v-model="form.code" size="mini" placeholder="订单编号"></el-input></el-form-item>
							<el-form-item label="订单状态" class="mb-0">
								<el-select v-model="form.type" placeholder="请选择订单状态" size="mini">
									<el-option label="订单状态一" value="shanghai"></el-option>
									<el-option label="订单状态二" value="beijing"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="下单时间" class="mb-0">
								<el-date-picker v-model="form.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="mini"></el-date-picker>
							</el-form-item>
							<el-form-item label="收货人" class="mb-0"><el-input v-model="form.username" size="mini" placeholder="收货人"></el-input></el-form-item>
							<el-form-item label="手机号" class="mb-0"><el-input v-model="form.phone" size="mini" placeholder="手机号"></el-input></el-form-item>
							<el-form-item class="mb-0">
								<el-button type="info" size="mini" class="ml-2" @click="searchEvent">搜索</el-button>
								<el-button type="" size="mini" @click="clearSearch">清空筛选条件</el-button>
							</el-form-item>
						</el-form>
					</template>
				</button-search>
				<!-- 表格 -->
				<el-table border class="mt-3" @selection-change="handleSelectionChange" :data="tableData[index].list" style="width: 100%">
					<el-table-column type="selection" width="55" align="center"></el-table-column>
					<el-table-column label="商品">
						<template slot-scope="scope">
							<div class="d-flex">
								<div style="flex: 1;">
									<div>订单编号：</div>
									<div style="font-weight: bold;">12345678901234567890</div>
								</div>
								<div style="flex: 1;">
									<div>下单时间：</div>
									<div  style="font-weight: bold;">2020-12-12 12:12:12</div>
								</div>
							</div>
							<div class="media mt-1">
								<img class="mr-3" :src="scope.row.cover" style="width: 60px; height: 60px;" />
								<div class="media-body">
									<a class="mt-0 text-primary">{{ scope.row.title }}</a>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="实付款" align="center" width="122">
						<template slot-scope="scope">
							<div>实付款：￥14</div>
							<div><small>(含运费：￥24)</small></div>
						</template>
					</el-table-column>
					<el-table-column label="买家" align="center" width="88">
						<template slot-scope="scope">
							<div>用户名</div>
							<div><small>(ID：123456)</small></div>
						</template>
					</el-table-column>
					<el-table-column label="支付方式" align="center" width="100">
						<template slot-scope="scope">
							<span class="badge badge-success">微信支付</span>
						</template>
					</el-table-column>
					<el-table-column prop="stock" label="配送方式" align="center" width="88">中通快递</el-table-column>
					<el-table-column label="交易状态" align="center" width="188">
						<template slot-scope="scope">
							<div class="">付款状态：<span class="badge badge-success">已付款</span></div>
							<div class="">发货状态：<span class="badge badge-success">待发货</span></div>
							<div class="">收获状态：<span class="badge badge-success">待收货</span></div>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center" width="140">
						<template slot-scope="scope">
							<el-button plain type="primary" size="mini">订单详情</el-button>
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
							:current-page="tableData[index].currentPage"
							:page-sizes="[100, 200, 300, 400]"
							:page-size="100"
							layout="total, sizes, prev, pager, next, jumper"
							:total="400"
						></el-pagination>
					</div>
				</el-footer>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import buttonSearch from '@/components/common/button-search.vue';
export default {
	components: {
		buttonSearch
	},
	data() {
		return {
			tabIndex: 0,
			tabbars: [{ name: '全部' }, { name: '待付款' }, { name: '待发货' }, { name: '已付款' }, { name: '已发货' }, { name: '已完成' }, { name: '已关闭' }, { name: '退款中' }],
			form: {
				time: '',
				username: '',
				code: '',
				type: '',
				phone: ''
			},
			multipleSelection: [], // 选中的数据
			tableData: []
		};
	},
	computed: {},
	created() {
		this.__getData();
	},
	methods: {
		// 生成数据
		__getData() {
			for (var i = 0; i < this.tabbars.length; i++) {
				this.tableData.push({
					currentPage: 1,
					list: []
				});
				for (var j = 0; j < 20; j++) {
					this.tableData[i].list.push({
						id: j,
						title: '这是标题标题标题标题标题标题标题标' + i + '-' + j,
						cover: 'http://static.yoshop.xany6.com/2018071718294208f086786.jpg',
						create_time: '2020-02-02 02:02:02',
						category: '手机',
						type: '普通商品',
						sale_count: 20,
						order: 100,
						status: 1,
						stock: 200,
						pprice: 1000, // 销售价
						ischeck: 1 // 0未审核 1通过 2不通过
					});
				}
			}
		},
		// 点击tab加载相应数据
		handleClick(tab, event) {
			// console.log(tab, event);
			console.log('tabIndex:', this.tabIndex);
		},
		// 清空筛选条件
		clearSearch() {
			this.form = {
				time: '',
				username: '',
				code: '',
				type: '',
				phone: ''
			};
			this.$refs.buttonSearch[this.tabIndex].keyword = '';
			// 通过$refs可以访问子组件的data | methods里面的内容
			this.$refs.buttonSearch[this.tabIndex].closeSuperSearch();
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
		// 删除当前商品
		deleteItem(index) {
			this.$confirm('是否删除该商品?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.tableData[this.tabIndex].list.splice(index, 1);
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

<style></style>
