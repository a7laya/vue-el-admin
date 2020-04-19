<template>
	<div class="">
		<el-tabs v-model="activeName">
			<!-- 支付设置 -->
			<el-tab-pane label="支付设置" name="second">
				<div><el-button type="primary" size="small">添加模板</el-button></div>
				<!-- 表格 -->
				<el-table border class="mt-3" :data="tableData" style="width: 100%">
					<el-table-column label="支付方式">
						<template slot-scope="scope">
							<div class="d-flex align-items-center">
								<img :src="scope.row.src" style="width: 50px;height: 50px;" class="rounded mr-2"/>
								<div class="d-flex align-items-start flex-column">
									<h6 class="align-left">{{scope.row.name}}</h6>
									<small class="text-secondary">{{scope.row.desc}}</small>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center" width="188">
						<template slot-scope="scope">
							<el-button plain type="text" size="mini" @click="openDrawer(scope.row.key)">配置</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>

			<!-- 购物设置 -->
			<el-tab-pane label="购物设置" name="third">
				<el-form ref="form" :model="form" label-width="140px">
					<el-form-item label="未支付订单">
						<el-input v-model="form.close_order_minute" type="number" size="mini" style="width: 222px;" placeholder="分钟">
							<template slot="append">分钟后自动关闭</template>
						</el-input>
						<small class="text-secondary d-block">
							订单下单未付款，n分钟后自动关闭，设置0不关闭
						</small>
					</el-form-item>
					<el-form-item label="已发货订单">
						<el-input v-model="form.auto_received_day" type="number" size="mini" style="width: 222px;" placeholder="天数">
							<template slot="append">天后自动确认收货</template>
						</el-input>
						<small class="text-secondary d-block">
							期间未确认收货，n天后自动确认，设置0不自动收货
						</small>
					</el-form-item>
					<el-form-item label="已完成订单">
						<el-input v-model="form.after_sale_day" type="number" size="mini" style="width: 222px;" placeholder="天数">
							<template slot="append">天内允许申请售后</template>
						</el-input>
						<small class="text-secondary d-block">
							订单完成后，用户在n天内可以发起售后申请，设置0不允许发起售后申请
						</small>
					</el-form-item>
					
					<el-form-item>
						<el-button type="primary" size="medium" @click="submitDrawer">保存</el-button>
					</el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>
		
		<!-- 抽屉组件 -->
		<el-drawer title="配置支付方式" :visible.sync="drawer" direction="rtl"  size='40%'>
			<div class="position-absolute w-100 overflow-auto p-3" style="top: 52px; bottom: 60px;" v-loading="drawerLoading">
				<el-form ref="formPay" :model="form" label-width="100px">
					<!-- 支付宝支付 -->
					<div v-if="drawerType === 'alipay'">
						<el-form-item label="app_id">
							<el-input v-model="form.alipay.app_id" size="mini"></el-input>
						</el-form-item>
						<el-form-item label="公钥">
							<el-input type="textarea" :rows="4" v-model="form.alipay.ali_public_key" size="mini"></el-input>
						</el-form-item>
						<el-form-item label="私钥">
							<el-input type="textarea" :rows="4" v-model="form.alipay.private_key" size="mini"></el-input>
						</el-form-item>
					</div>
				
					<!-- 微信支付 -->
					<div v-if="drawerType === 'wxpay'">
						<el-form-item label="公众号APPID">
							<el-input v-model="form.wxpay.app_id" size="mini"></el-input>
						</el-form-item>
						<el-form-item label="小程序APPID">
							<el-input v-model="form.wxpay.miniapp_id" size="mini"></el-input>
						</el-form-item>
						<el-form-item label="小程序secret">
							<el-input v-model="form.wxpay.secret" size="mini"></el-input>
						</el-form-item>
						<el-form-item label="appid">
							<el-input v-model="form.wxpay.appid" size="mini"></el-input>
						</el-form-item>
						<el-form-item label="商户号">
							<el-input v-model="form.wxpay.mch_id" size="mini"></el-input>
						</el-form-item>
						<el-form-item label="API密钥">
							<el-input type="textarea" :rows="4" v-model="form.wxpay.key" size="mini"></el-input>
						</el-form-item>
						<el-form-item label="cert_client">
							<el-upload
							action="/admin/sysconfig/upload"
							:headers="{ token:$store.state.user.token }"
							:limit="1"
							accept=".pem"
							:on-success="uploadClientSuccess"
							>
								<el-button type="primary" size="small">点击上传</el-button>
								<div class="el-upload__tip" slot="tip">
									<div class="text-danger overflow-auto">{{form.wxpay.cert_client ? form.wxpay.cert_client : '还未配置'}}</div>
									<div class="small text-muted">例如：apiclient_cert.pem</div>
								</div>
							</el-upload>
						</el-form-item>
						<el-form-item label="cert_key">
							<el-upload
							action="/admin/sysconfig/upload"
							:headers="{ token:$store.state.user.token }"
							:limit="1"
							accept=".pem"
							:on-success="uploadKeySuccess"
							>
								<el-button type="primary" size="small">点击上传</el-button>
								<div class="el-upload__tip" slot="tip">
									<div class="text-danger overflow-auto">{{form.wxpay.cert_key ? form.wxpay.cert_key : '还未配置'}}</div>
									<div class="small text-muted">例如：apiclient_cert.pem</div>
								</div>
							</el-upload>
						</el-form-item>
					</div>
				</el-form>
			</div>
			<div class="position-fixed border-top w-100 d-flex align-items-center px-3" style="height: 60px; bottom: 0;">
				<el-button @click="closeDrawer">取消</el-button>
				<el-button type="primary" @click="submitDrawer" :loading="submitDrawerLoading">
					{{submitDrawerLoading ? '配置中' : '确定'}}
				</el-button>
			</div>
		</el-drawer>
	</div>
</template>

<script>
export default {
	inject: ['layout'],
	data() {
		return {
			activeName: 'second',
			drawer: false, // 抽屉组件是否显示
			drawerType: 'alipay',
			drawerLoading: false,
			submitDrawerLoading: false, // 提交配置按钮的loading状态
			form: {
				key: '',
				customer: '',
				close_order_minute: 0, // 未支付订单自动关闭时间：分钟，0不自动关闭
				auto_received_day: 0,  // 已发货订单自动确认时间：天，0不自动收货
				after_sale_day: 0,     // 已完成订单允许申请售后：天
				alipay: { // 支付宝支付配置
					app_id: "", 
					ali_public_key: "", // 公钥 
					private_key: "",    // 私钥
				}, 
				wxpay: { // 微信支付配置
					app_id:'', // 公众号APPID 
					miniapp_id:'', // 小程序APPID 
					secret:"", // 小程序secret 
					appid:'', // appid 
					mch_id:'', // 商户号 
					key:'', // API 密钥 
					cert_client:'', 
					cert_key:'' 
				}
			},
			tableData: [
				{	
					key: 'alipay',
					name: '支付宝支付',
					desc: '该系统支持即时到账接口',
					src: 'http://wxcs.niuteam.cn/addons/NsAlipay/ico.png'
				},
				{	
					key: 'wxpay',
					name: '微信支付',
					desc: '该系统支持即时微信网页支付和扫码支付',
					src: 'http://wxcs.niuteam.cn/addons/NsWeixinpay/ico.png'
				}
			],
		};
	},
	created() {
		this.getData()
	},
	methods: {
		getData(){
			let url = '/admin/sysconfig'
			this.layout.showLoading()
			this.axios.get(url,{token:true}).then(res=>{
				this.form = res.data.data
				console.log('this.form:',this.form)
				this.layout.hideLoading()
			}).catch(err=>{
				this.layout.hideLoading()
			})
		},
		// 打开抽屉
		openDrawer(type){
			this.drawerType = type
			this.drawer = true
		},
		// 关闭抽屉 
		closeDrawer(){
			this.drawer = false
		},
		// 上传成功
		uploadClientSuccess(response, file, fileList){
			console.log('response:',response)
			console.log('file:',file)
			console.log('fileList:',fileList)
			this.form.wxpay.cert_client = response.data
		},
		// 上传成功
		uploadKeySuccess(response, file, fileList){
			this.form.wxpay.cert_key = response.data
		},
		// 提交抽屉
		submitDrawer(){
			if(this.submitDrawerLoading) return
			this.submitDrawerLoading = true
			let url = `/admin/sysconfig`
			let obj = {...this.form}
			this.layout.showLoading()
			this.axios.post(url,obj,{token:true}).then(res=>{
				console.log('res:',res)
				this.layout.hideLoading()
				this.drawer = false
				this.submitDrawerLoading = false
				this.$message({
					type: 'success',
					message: '设置成功'
				})
			}).catch(err=>{
				this.layout.hideLoading()
				this.submitDrawerLoading = false
			})
		},
	}
};
</script>

<style></style>
