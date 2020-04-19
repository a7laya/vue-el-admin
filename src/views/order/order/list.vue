<!-- 
	接口：http://ceshi5.dishait.cn/admin/order/:page?limit=[:limit]&tab=[:tab]&no=[:no]&starttime=[:starttime]&endtime=[:endtime]&name=[:name]&phone=[:phone]
	订单类型：all全部，nopay待支付，noship待发货，shiped待收货，
			received已收货，finish已完成，closed已关闭，refunding退款中
 -->
<template>
	<div class="bg-white h-100 px-3 py-2" style="margin:-8px -20px 20px -20px; ">
		<el-tabs v-model="tabIndex" @tab-click="handleClick">
			<el-tab-pane v-for="(item, index) in tabbars" :key="index" :label="item.name" class="bg-white"></el-tab-pane>
		</el-tabs>

		<button-search ref="buttonSearch" @search="searchEvent" @openSuperSearch="form.no = $event" placeholder="要搜索的订单编号">
			<!-- 左边插槽 -->
			<template #left>
				<el-button type="success" size="mini" @click='exportModel = true'>导出数据</el-button>
				<el-button type="danger" size="mini" @click='deleteAll'>批量删除</el-button>
			</template>

			<!-- 高级搜索表单插槽 -->
			<template #form>
				<el-form ref="form" :model="form" label-width="80px" inline>
					<el-form-item label="订单编号" class="mb-0">
						<el-input v-model="form.no" size="mini" placeholder="订单编号"></el-input>
					</el-form-item>
					<el-form-item label="下单时间" class="mb-0">
						<el-date-picker v-model="form.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
						 size="mini" value-format="yyyy-MM-dd"></el-date-picker>
					</el-form-item>
					<el-form-item label="收货人" class="mb-0">
						<el-input v-model="form.name" size="mini" placeholder="收货人"></el-input>
					</el-form-item>
					<el-form-item label="手机号" class="mb-0">
						<el-input v-model="form.phone" size="mini" placeholder="手机号"></el-input>
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
			<el-table-column label="商品" width="380">
				<template slot-scope="scope">
					<div class="d-flex">
						<div style="flex: 1;">
							<div>订单编号：</div>
							<div style="font-weight: bold;">{{scope.row.no}}</div>
						</div>
						<div style="flex: 1;">
							<div>下单时间：</div>
							<div style="font-weight: bold;">{{scope.row.create_time}}</div>
						</div>
					</div>
					<div class="media border-top py-2" v-for="(item,index) in scope.row.order_items" :key='index'>
						<img class="mr-3" :src="item.goods_item.cover" style="width: 60px; height: 60px;" />
						<div class="media-body">
							<a class="mt-0 text-primary">{{ item.goods_item.title }}</a>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="实付款" align="center" width="122">
				<template slot-scope="scope">
					<div>实付款：￥{{scope.row.total_price}}</div>
					<div><small>(含运费：￥24)</small></div>
				</template>
			</el-table-column>
			<el-table-column label="买家" align="center" width="88">
				<template slot-scope="scope">
					<div>{{scope.row.user.username}}</div>
					<div><small>(ID：{{scope.row.user.id}})</small></div>
				</template>
			</el-table-column>
			<el-table-column label="支付方式" align="center" width="100">
				<template slot-scope="scope">
					<span class="badge badge-success" v-if="scope.row.payment_method === 'wechat'">微信支付</span>
					<span class="badge badge-primary" v-else-if="scope.row.payment_method === 'alipay'">支付宝支付</span>
					<span class="badge badge-secondary" v-else>待支付</span>
				</template>
			</el-table-column>
			<el-table-column label="配送方式" align="center" width="88">
				<template slot-scope='scope'>
					<div v-if="scope.row.ship_data">
						<div>{{scope.row.ship_data.express_company}}</div>
						<div>{{scope.row.ship_data.express_no}}</div>
					</div>
					<span v-else class="badge badge-secondary">未配送</span>
				</template>
			</el-table-column>
			<el-table-column label="交易状态" align="center" width="188">
				<template slot-scope="scope">
					<div>
						付款状态：
						<span class="badge" :class="scope.row.payment_method ? 'badge-success' : 'badge-secondary' ">
							{{scope.row.payment_method ? '已付款' : '待付款'}}
						</span>
					</div>
					<div>
						发货状态：
						<span class="badge" :class="scope.row.ship_data ? 'badge-success' : 'badge-secondary' ">
							{{scope.row.ship_data ? '已发货' : '待发货'}}
						</span>
					</div>
					<div>
						收货状态：
						<span class="badge" :class="scope.row.ship_status === 'received' ? 'badge-success' : 'badge-secondary' ">
							{{scope.row.ship_status === 'received' ? '已收货' : '待收货'}}
						</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="140">
				<template slot-scope="scope">
					<div>
						<el-button type="text" size="mini">订单详情</el-button>
					</div>
					<div>
						<el-button type="text" size="mini" @click="ship(scope.row)"
						v-if="scope.row.ship_status === 'pending' && scope.row.closed === 0 && scope.row.payment_method && scope.row.refund_status === 'pending'">
						<!-- 发货状态：未发货 && 未关闭 && 已付款 && 用户没有申请退款 才显示 -->
							订单发货
						</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<div style="height: 120px;"></div>
		<el-footer class="border-top d-flex align-items-center px-0 bg-white position-fixed fixed-bottom" style="margin-left: 200px;">
			<!-- 分页 -->
			<div class="flex-grow-1 ml-2">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.current"
				 :page-sizes="page.sizes" :page-size="page.size" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
				</el-pagination>
			</div>
		</el-footer>
		<el-dialog title="订单发货" :visible.sync="shipModel">
			<el-form ref="shipForm" :rules="shipFormRules" :model="shipForm" label-width="80px">
				<el-form-item label="快递公司" prop="express_company">
					<el-select v-model="shipForm.express_company" placeholder="请选择快递公司">
						<el-option v-for="(item,index) in express_company_options" :key="index" :label="item.name" :value="item.code"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="快递单号" prop="express_no">
					<el-input v-model="shipForm.express_no"></el-input>

				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="shipModel = false">取 消</el-button>
				<el-button type="primary" @click="shipSubmit">确 定</el-button>
			</div>
		</el-dialog>
		
		<!-- 导出订单设置 模态框 -->
		<el-dialog title="导出订单" :visible.sync="exportModel" width="40%">
			<el-form ref="exportForm" :rules="exportFormRules" :model="exportForm" label-width="80px">
				<el-form-item label="订单类型" prop="tab">
					<el-select v-model="exportForm.tab" placeholder="请选择订单类型" size="mini">
						<el-option v-for="(item,index) in tabbars" :key="index" :label="item.name" :value="item.key"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="时间范围" prop="time">
					<el-date-picker v-model="exportForm.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
						 size="mini" value-format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="exportModel = false">取 消</el-button>
				<el-button type="primary" @click="exportExcel" :loading="exportLoading">
					{{exportLoading ? '正在导出数据...' : '确 定'}}
				</el-button>
			</div>
		</el-dialog>
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
				preUrl: 'order',
				tabIndex: 0,
				tabbars: [{
						name: '全部',
						key: 'all'
					},
					{
						name: '待付款',
						key: 'nopay'
					},
					{
						name: '待发货',
						key: 'noship'
					},
					{
						name: '待收货',
						key: 'shiped'
					},
					{
						name: '已收货',
						key: 'received'
					},
					{
						name: '已完成',
						key: 'finish'
					},
					{
						name: '已关闭',
						key: 'closed'
					},
					{
						name: '退款中',
						key: 'refunding'
					},
				],
				form: {
					time: '',
					name: '',
					no: '',
					phone: ''
				},
				tableData: [],
				shipModel: false,
				shipForm: {
					id: 0,
					express_company: '',
					express_no: ''
				},
				express_company_options: [], // 快递公司列表
				shipFormRules: {
					express_company: [{
						required: true,
						message: "快递公司不能为空",
						trigger: "blur"
					}],
					express_no: [{
						required: true,
						message: "订单号不能为空",
						trigger: "blur"
					}]
				},
				exportModel: false,
				exportForm: {
					tab: '',
					time: ''
				},
				exportLoading: false,
				exportFormRules: {
					tab: [{
						required: true,
						message: "订单类型不能为空",
						trigger: "blur"
					}]
				},
			};
		},
		computed: {
			tab() {
				return this.tabbars[this.tabIndex].key
			},
			// 拼接参数
			params() {
				let str = ''
				for (let key in this.form) {
					let v = this.form[key]
					if (v) {
						if (Array.isArray(v)) {
							str += `&starttime=${v[0]}&endtime=${v[1]}`
						} else {
							str += `&${key}=${v}`
						}
					}
				}
				return str
			}
		},
		created() {
			let url = '/admin/express_company/1?limit=50'
			this.axios.get(url, {
				token: true
			}).then(res => {
				let data = res.data.data
				this.express_company_options = data.list
			})
		},
		methods: {
			// 请求后端数据的方法
			getListResult(e) {
				console.log("e:", e.list)
				this.tableData = e.list
			},
			getListUrl() {
				return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}&tab=${this.tab}${this.params}`
			},
			// 点击tab加载相应数据
			handleClick(tab, event) {
				// console.log(tab, event);
				console.log('tabIndex:', this.tabIndex);
				this.getList()
			},
			// 清空筛选条件
			clearSearch() {
				this.form = {
					time: '',
					name: '',
					no: '',
					type: '',
					phone: ''
				};
				this.$refs.buttonSearch[this.tabIndex].keyword = '';
				// 通过$refs可以访问子组件的data | methods里面的内容
				// this.$refs.buttonSearch[this.tabIndex].closeSuperSearch();
			},
			// 搜索事件
			searchEvent(e = false) {
				// 简单搜索
				if (typeof e === 'string') {
					console.log('简单搜索:', e);
					this.form.no = e
					return this.getList()
				}
				// 高级搜索
				console.log('高级搜索');
				console.log("this.params:", this.params)
				return this.getList()
			},
			// 点击“订单发货”按钮
			ship(item) {
				this.shipModel = true
				this.shipForm.id = item.order_items[0].order_id
				console.log('this.shipForm.id:', this.shipForm.id)
			},
			shipSubmit() {
				this.$refs.shipForm.validate(res=>{
					if(!res) return
					let url = `/admin/order/${this.shipForm.id}/ship`
					let obj = { ...this.shipForm
					}
					this.layout.showLoading()
					this.axios.post(url, obj, {
							token: true
						})
						.then(res => {
							this.shipModel = false
							this.$message({
								type: 'success',
								message: '发货成功'
							})
							this.getList()
							this.layout.hideLoading()
						}).catch(err => {
							this.layout.hideLoading()
						})
				})
			},
			// 导出excel
			exportExcel(){
				this.$refs.exportForm.validate(res=>{
					if(!res) return
					let params = ''
					let val = this.exportForm.time
					if(val && Array.isArray(val)) {
						params += `&starttime=${val[0]}`
						params += `&endtime=${val[1]}`
					}
					let url = `/admin/order/excelexport?tab=${this.exportForm.tab}${params}`
					this.exportLoading = true
					this.axios.post(url,{},{
					    token:true,
					    responseType: 'blob' // 重要
					}).then(res=>{
						console.log('res:',res)
					    if (res.status == 200) {
					        let url = window.URL.createObjectURL(new Blob([res.data]))
					        let link= document.createElement('a')
					        link.style.display='none'
					        link.href=url
					        let filename = new Date().getTime() + '.xlsx';
					        link.setAttribute('download', filename)
					        document.body.appendChild(link)
					        link.click()
					    }
						this.exportLoading = false
						this.exportModel = false
					}).catch(err=>{
					    this.$message({
					        type:"error",
					        message:"下载失败"
					    })
						this.exportLoading = false
					})
				})
			}
		}
	};
</script>

<style></style>
