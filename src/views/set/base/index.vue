<template>
	<div class="">
		<el-tabs v-model="activeName">
			<!-- 注册于访问 -->
			<el-tab-pane label="注册与访问" name="first">
				<el-form ref="form" :model="form" label-width="140px">
					<el-form-item label="是否允许注册会员">
						<el-radio-group v-model="form.isreg" size="mini">
							<el-radio-button :label="true">是</el-radio-button>
							<el-radio-button :label="false">否</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="注册类型">
						<el-radio-group v-model="form.reg_type" size="mini">
							<el-radio-button label="username">普通注册</el-radio-button>
							<el-radio-button label="phone">手机注册</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="密码最小长度"><el-input-number v-model="form.password_length" :min="1" size="mini"></el-input-number></el-form-item>
					<el-form-item label="强制密码复杂度">
						<el-checkbox-group v-model="form.password_encrypt" size="mini">
							<el-checkbox-button :abel="0">数字</el-checkbox-button>
							<el-checkbox-button :label="1">小写字母</el-checkbox-button>
							<el-checkbox-button :label="2">大写字母</el-checkbox-button>
							<el-checkbox-button :label="3">符号</el-checkbox-button>
						</el-checkbox-group>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onSubmit" size="medium">保存</el-button>
					</el-form-item>
				</el-form>
			</el-tab-pane>

			<!-- 上传设置 -->
			<el-tab-pane label="上传设置" name="second">
				<el-form ref="form" :model="form" label-width="140px">
					<el-form-item label="默认上传方式">
						<el-radio-group v-model="form.upload_methods" size="mini">
							<el-radio-button label="local">本地上传</el-radio-button>
							<el-radio-button label="qiniu">七牛云存储</el-radio-button>
							<el-radio-button label="oss">阿里云oss</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="Bucket"><el-input v-model="form.Bucket" size="mini" class="w-25" placeholder="Bucket"></el-input></el-form-item>
					<el-form-item label="ACCESS_KEY"><el-input v-model="form.ACCESS_KEY" size="mini" class="w-25" placeholder="ACCESS_KEY"></el-input></el-form-item>
					<el-form-item label="SECRET_KEY"><el-input v-model="form.SECRET_KEY" size="mini" class="w-25" placeholder="SECRET_KEY"></el-input></el-form-item>
					<el-form-item label="空间域名"><el-input v-model="form.http" size="mini" class="w-25" placeholder="空间域名"></el-input></el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onSubmit" size="medium">保存</el-button>
					</el-form-item>
				</el-form>
			</el-tab-pane>

			<!-- api安全 -->
			<el-tab-pane label="API安全" name="third">
				<el-form ref="form" :model="form" label-width="140px">
					<el-form-item label="是否开启API">
						<el-radio-group v-model="form.api" size="mini">
							<el-radio-button :label="true">是</el-radio-button>
							<el-radio-button :label="false">否</el-radio-button>
						</el-radio-group>
						<small class="text-secondary d-block">
							API安全功能开启之后调用前端API需要传输签名串
						</small>
					</el-form-item>
					<el-form-item label="密钥">
						<el-input v-model="form.api_key" size="mini" class="w-25" placeholder="密钥"></el-input>
						<small class="text-secondary d-block">
							密钥设置关系api调用传输签名串的编码规则，以及会员的token解析，设置之后会员需重新登录获取新token
						</small>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onSubmit" size="medium">保存</el-button>
					</el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
export default {
	data() {
		return {
			form: {
				isreg: true,
				reg_type: 'phone',
				password_length: 6,
				password_encrypt: [0,1],
				upload_methods: 'local',
				Bucket: '',
				ACCESS_KEY: '',
				SECRET_KEY: '',
				http: '',
				api: true,
				api_key: ''
			},
			activeName: 'first'
		};
	},
	methods: {
		onSubmit(){
			console.log("保存")
		}
	}
};
</script>

<style></style>
