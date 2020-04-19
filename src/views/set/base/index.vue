<template>
	<div class="">
		<el-tabs v-model="activeName">
			<!-- 注册于访问 -->
			<el-tab-pane label="注册与访问" name="first">
				<el-form ref="form" :model="form" label-width="140px">
					<el-form-item label="是否允许注册会员">
						<el-radio-group v-model="form.open_reg" size="mini">
							<el-radio-button :label="1">是</el-radio-button>
							<el-radio-button :label="0">否</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="注册类型">
						<el-radio-group v-model="form.reg_method" size="mini">
							<el-radio-button label="username">普通注册</el-radio-button>
							<el-radio-button label="phone">手机注册</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="密码最小长度"><el-input-number v-model="form.password_min" :min="1" size="mini"></el-input-number></el-form-item>
					<el-form-item label="强制密码复杂度">
						<el-checkbox-group v-model="form.password_encrypt" size="mini">
							<el-checkbox-button :label="0">数字</el-checkbox-button>
							<el-checkbox-button :label="1">小写字母</el-checkbox-button>
							<el-checkbox-button :label="2">大写字母</el-checkbox-button>
							<el-checkbox-button :label="3">符号</el-checkbox-button>
						</el-checkbox-group>
					</el-form-item>
				</el-form>
			</el-tab-pane>

			<!-- 上传设置 -->
			<el-tab-pane label="上传设置" name="second">
				<el-form ref="form" :model="form" label-width="140px">
					<el-form-item label="默认上传方式">
						<el-radio-group v-model="form.upload_method" size="mini">
							<el-radio-button label="local">本地上传</el-radio-button>
							<el-radio-button label="oss">阿里云oss</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<div v-if="form.upload_method == 'oss'">
						<el-form-item label="Bucket"><el-input v-model="form.upload_config.Bucket" size="mini" class="w-25" placeholder="Bucket"></el-input></el-form-item>
						<el-form-item label="ACCESS_KEY"><el-input v-model="form.upload_config.ACCESS_KEY" size="mini" class="w-25" placeholder="ACCESS_KEY"></el-input></el-form-item>
						<el-form-item label="SECRET_KEY"><el-input v-model="form.upload_config.SECRET_KEY" size="mini" class="w-25" placeholder="SECRET_KEY"></el-input></el-form-item>
						<el-form-item label="空间域名"><el-input v-model="form.upload_config.http" size="mini" class="w-25" placeholder="空间域名"></el-input></el-form-item>
					</div>
				</el-form>
			</el-tab-pane>

			<!-- api安全 -->
			<el-tab-pane label="API安全" name="third">
				<el-form ref="form" :model="form" label-width="140px">
					<el-form-item label="是否开启API">
						<el-radio-group v-model="form.api_safe" size="mini">
							<el-radio-button :label="1">是</el-radio-button>
							<el-radio-button :label="0">否</el-radio-button>
						</el-radio-group>
						<small class="text-secondary d-block">
							API安全功能开启之后调用前端API需要传输签名串
						</small>
					</el-form-item>
					<el-form-item label="密钥">
						<el-input v-model="form.api_secret" size="mini" class="w-25" placeholder="密钥"></el-input>
						<small class="text-secondary d-block">
							密钥设置关系api调用传输签名串的编码规则，以及会员的token解析，设置之后会员需重新登录获取新token
						</small>
					</el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>
		
		<el-form ref="form" :model="form" label-width="140px">
			<el-form-item label="">
				<el-button type="primary" @click="onSubmit" size="mini">保存</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
export default {
	inject: ['layout'],
	data() {
		return {
			form: {
				open_reg: 1, // 开启注册，0关闭1开启
				reg_method: 'phone', // 注册方式，username普通phone手机
				password_min: 6, // 密码最小长度
				password_encrypt: [0,1], // 密码复杂度，0数字、1小写字母、2大写字母、3符号；例如0,1,2
				upload_method: 'local', // 上传方式，local本地，oss对象存储
				upload_config: { // 上传配置
					Bucket: '',
					ACCESS_KEY: '',
					SECRET_KEY: '',
					http: ''
				},
				api_safe: 1, // api安全，0关闭1开启
				api_secret: '', // 秘钥
				
			},
			activeName: 'first'
		};
	},
	created() {
		this.getData()
	},
	methods: {
		getData(){
			this.layout.showLoading()
			this.axios.get('/admin/sysconfig',{token:true}).then(res=>{
				this.form = res.data.data
				this.form.password_encrypt = this.form.password_encrypt.split(',').map(v=>parseInt(v))
				this.layout.hideLoading()
			}).catch(err=>{
				this.layout.hideLoading()
			})
		},
		onSubmit(){
			this.layout.showLoading()
			let url = '/admin/sysconfig'
			let obj = {...this.form}
			obj.password_encrypt = obj.password_encrypt.join(',')
			this.axios.post(url,obj,{token:true}).then(res=>{
				let data =res.data.data
				this.$message({
					type: 'success',
					message: '设置成功'
				})
				this.layout.hideLoading()
			}).catch(err=>{
				this.layout.hideLoading()
			})
		},
	}
};
</script>

<style></style>
