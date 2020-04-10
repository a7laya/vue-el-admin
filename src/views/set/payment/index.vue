<template>
	<div class="">
		<el-tabs v-model="activeName">
			<!-- 支付设置 -->
			<el-tab-pane label="支付设置" name="second">
				<div><el-button type="primary" @click="openModel(false)" size="small">添加模板</el-button></div>
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
							<el-button plain type="text" size="mini" @click="openModel(scope)">配置</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>

			<!-- 购物设置 -->
			<el-tab-pane label="购物设置" name="third">
				<el-form ref="form" label-width="140px">
					<el-form-item label="未支付订单">
						<el-input type="number" size="mini" style="width: 222px;" placeholder="天数">
							<template slot="append">天后自动关闭</template>
						</el-input>
						<small class="text-secondary d-block">
							订单下单未付款，n天后自动关闭，设置0不关闭
						</small>
					</el-form-item>
					<el-form-item label="已发货订单">
						<el-input type="number" size="mini" style="width: 222px;" placeholder="天数">
							<template slot="append">天后自动确认收货</template>
						</el-input>
						<small class="text-secondary d-block">
							期间未确认收货，n天后自动确认，设置0不自动收货
						</small>
					</el-form-item>
					<el-form-item label="已完成订单">
						<el-input type="number" size="mini" style="width: 222px;" placeholder="天数">
							<template slot="append">天内允许申请售后</template>
						</el-input>
						<small class="text-secondary d-block">
							订单完成后，用户在n天内可以发起售后申请，设置0不允许发起售后申请
						</small>
					</el-form-item>
					<el-form-item label="运费组合策略">
						<el-select placeholder="运费组合策略" size="mini">
							<el-option label="区域一" value="shanghai"></el-option>
							<el-option label="区域二" value="beijing"></el-option>
						</el-select>
					</el-form-item>
					
					<el-form-item>
						<el-button type="primary" @click="onSubmit" size="medium">保存</el-button>
					</el-form-item>
				</el-form>
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
			editIndex: -1,
			createModel: false,
			form: {
				key: '',
				customer: ''
			},
			activeName: 'second',
			tableData: [
				{
					name: '银行卡支付',
					desc: '该系统支持即时到账接口',
					src: 'http://127.0.0.1:8080/img/demo1.4419d7d7.jpeg'
				}
			],
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
	}
};
</script>

<style></style>
