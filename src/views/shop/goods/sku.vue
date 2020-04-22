<template>
	<div>
		<router-link :to="{ name: 'shop_goods_list' }" style="position: absolute; top: 3px; left: 200px;"><el-button size="mini">回到商品列表</el-button></router-link>
		<div class="bg-white h-100 px-3 py-2 goods_create" style="margin:-8px -20px 20px -20px; ">
			<!-- 规格选项 -->
			<el-form>
				<el-form-item label="商品规格">
					<el-radio-group size="medium" :value="sku_type" @input="vModel('sku_type', $event)">
						<el-radio-button :label="0">单一规格</el-radio-button>
						<el-radio-button :label="1">多规格</el-radio-button>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<!--========== 单一规格 ==========-->
			<el-form ref="form" label-width="80px" v-show="sku_type === 0">
				<el-form-item label="市场价">
					<el-input type="number" v-model="sku_value.oprice" placeholder="请输入市场价" class="w-25">
						<template slot='append'>元</template>
					</el-input>
				</el-form-item>
				<el-form-item label="销售价">
					<el-input type="number" v-model="sku_value.pprice" placeholder="请输入销售价" class="w-25">
						<template slot='append'>元</template>
					</el-input>
				</el-form-item>
				<el-form-item label="成本价">
					<el-input type="number" v-model="sku_value.cprice" placeholder="请输入成本价" class="w-25">
						<template slot='append'>元</template>
					</el-input>
				</el-form-item>
				<el-form-item label="重量">
					<el-input type="number" v-model="sku_value.weight" placeholder="请输入重量" class="w-25">
						<template slot='append'>克</template>
					</el-input>
				</el-form-item>
				<el-form-item label="体积">
					<el-input type="number" v-model="sku_value.volume" placeholder="请输入体积" class="w-25">
						<template slot='append'>ml</template>
					</el-input>
				</el-form-item>
				<el-form-item label="总库存">
					<el-input type="number" v-model="sku_value.stock" placeholder="请输入总库存" class="w-25">
						<template slot='append'>件</template>
					</el-input>
				</el-form-item>
			</el-form>
			
			<!--========== 多规格 ==========-->
			<el-form ref="form" label-width="80px" v-show="sku_type === 1">
				<!-- 规格卡片 -->
				<el-form ref="form" label-width="80px">
					<el-form-item label="添加规格">
						<sku-card v-for="(item, index) in sku_card" :key="index" :item="item" :index="index" :total="skuCardTotal"></sku-card>
						<el-button type="success" size="mini" @click="addSkuCardEvent">添加规格</el-button>
					</el-form-item>
				</el-form>

				<el-form-item label="批量设置">
					<template v-if="!updateAllStatus">
						<el-button type="text" v-for="(btn, btnIndex) in updateList" :key="btnIndex" @click="openUpdateAllStatus(btn)">{{ btn.name }}</el-button>
					</template>
					<div class="d-flex align-items-center" v-else>
						<el-input size="small" type="number" :placeholder="updateAllPlaceholder" style="width: 150px;" v-model="updateAllValue"></el-input>
						<el-button size="mini" type="primary" class="ml-2" @click="updateAllSubmit">设置</el-button>
						<el-button size="mini" @click="closeUpdateAllStatus">取消</el-button>
					</div>
				</el-form-item>

				<!-- 规格排列组合表格 -->
				<el-form-item label="规格设置"><sku-table ref="table"></sku-table></el-form-item>
			</el-form>
		</div>
		<el-button type="primary" style="position: fixed;bottom: 50px;right: 50px;" @click="submit">提交</el-button>
	</div>
</template>

<script>
import singleAttrs from '@/components/shop/create/single-attrs.vue';
import skuCard from '@/components/shop/create/sku/sku-card.vue';
import skuTable from '@/components/shop/create/sku-table.vue';

import { mapState, mapMutations } from 'vuex';
export default {
	inject: ['app','layout'],
	components: { singleAttrs, skuCard, skuTable },
	data() {
		return {
			id: 0, // 商品id
			sku_value:{ 
				oprice:0,
				pprice:0,
				cprice:0,
				weight:0,
				volume:0,
			},
			
			// 批量修改的状态
			updateAllStatus: false,
			// 批量修改列表
			updateList: [
				{ name: '销售价', key: 'pprice' },
				{ name: '市场价', key: 'oprice' },
				{ name: '成本价', key: 'cprice' },
				{ name: '库存', key: 'stock' },
				{ name: '体积', key: 'volume' },
				{ name: '重量', key: 'weight' }
			],
			updateAllPlaceholder: false, // 批量设置输入框提示文字
			updateAllValue: '' // 批量设置输入框绑定的值
		};
	},
	created() {
		this.id = this.$route.params.id
		if(!this.id) {
			this.$message({
				type:'error',
				message: '非法参数'
			})
			return this.$router.push({
				name: 'shop_goods_list'
			})
		}
		// 获取之前的商品详情
		this.layout.showLoading()
		let defaultVal = ['属性值','#FFFFFF','/favicon.ico'];
		this.axios.get('/admin/goods/read/'+this.id,{
			token:true
		}).then(res=>{
			let data = res.data.data
			console.log("data:",data)
			this.vModel('sku_card',data.goodsSkusCard.map(item=>{
				item.list = item.goodsSkusCardValue
				item.list.map(v=>{
					v.text = item.type === 0 ? v.value : defaultVal[0]
					v.color = item.type === 1 ? v.value : defaultVal[1]
					v.image = item.type === 2 ? v.value : defaultVal[2]
					return v
				})
				return item
			}))
			this.vModel('sku_type',data.sku_type)
			// 单一规格
			this.sku_value = data.sku_value ? data.sku_value : {
				oprice:0,
				pprice:0,
				cprice:0,
				weight:0,
				volume:0
			},
			this.$nextTick(()=>{
				if(this.$refs.table){
					this.$refs.table.list = data.goodsSkus
				}
			})
			this.layout.hideLoading()
		}).catch(err=>{
			this.layout.hideLoading()
		})
	},
	computed: {
		...mapState({
			// 规格选择开关
			sku_type: state => state.goods_create.sku_type, // 0 单一规格  1 多规格
			sku_card: state => state.goods_create.sku_card,
			// 单一规格
			oprice: state=>state.goods_create.oprice, // 市场价 - 原价
			pprice: state=>state.goods_create.pprice, // 销售价 - 现价
			cprice: state=>state.goods_create.cprice, // 成本价
			weight: state=>state.goods_create.weight, // 重量
			volume: state=>state.goods_create.volume, // 体积
			stock:	state=>state.goods_create.stock,
		}),
		// 规格卡片的总数
		skuCardTotal() {
			return this.sku_card.length;
		}
	},
	methods: {
		...mapMutations(['addSkuCard', 'vModelState', 'vModelGoodsAttrs']),
		// 重写添加规格卡片addSkuCard
		addSkuCardEvent(){
			let url = "/admin/goods_skus_card"
			let obj = {
				goods_id: this.id, // 商品id
				name: '规格名称',  // 规格卡片名称
				order: 50, // 排序
				type: 0,  // 规格类型 0文字,1颜色,2图片
			}
			this.layout.showLoading()
			this.axios.post(url,obj,{token: true}).then(res=>{
				let data = res.data.data
				data.list = []
				this.addSkuCard(data)
				this.layout.hideLoading()
			}).catch(err => {
				this.layout.hideLoading()
			})
		},
		// 修改表单的值
		vModel(key, value) {
			this.vModelState({ key, value });
		},
		// 点击批量修改按钮
		openUpdateAllStatus(item) {
			this.updateAllStatus = item.key;
			this.updateAllPlaceholder = item.name;
		},
		// 取消批量修改
		closeUpdateAllStatus() {
			this.updateAllStatus = false;
			this.updateAllValue = '';
		},
		// 提交批量修改
		updateAllSubmit() {
			this.$refs.table.list.forEach(v => (v[this.updateAllStatus] = this.updateAllValue));
			this.closeUpdateAllStatus();
		},
		// 选择图片
		chooseImage(index) {
			let num = 9 - this.banners.length;
			this.app.chooseImage(
				res => {
					if (res.length === 0) return;
					let list = [];
					if (index === -1) {
						list = [...this.banners, ...res];
					} else {
						list = [...this.banners];
						list[index] = res[0];
					}
					this.vModel('banners', list);
				},
				index === -1 ? num : 1
			);
			console.log('this.banners:', this.banners);
		},
		// 删除图片
		deleteImage(index) {
			this.$confirm('是否删除该图片?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let list = [...this.banners];
				list.splice(index, 1);
				this.vModel('banners', list);
				this.$message({
					type: 'success',
					message: '删除成功!'
				});
			});
		},
		submit(){
			let list = []
			if(this.$refs.table){
				list = this.$refs.table.list.map(item=>{
					item.goods_id = this.id
					return item
				})
			}
			this.layout.showLoading()
			this.axios.post('/admin/goods/updateskus/'+this.id,{
				sku_type:this.sku_type,
				sku_value:this.sku_value,
				goodsSkus:list
			},{ token:true }).then(res=>{
				this.$message({
					type:"success",
					message:"修改成功"
				})
				this.$router.push({
					name:"shop_goods_list"
				})
				this.layout.hideLoading()
			}).catch(err=>{
				this.layout.hideLoading()
			})
		}
	}
};
</script>

<style>
.goods_create .el-form-item {
	margin-bottom: 15px;
}
</style>
