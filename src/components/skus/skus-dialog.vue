<template>
	<el-dialog title="商品规格选择" :visible.sync="createModel" width="80%" top="5vh">
		<el-container style="height: 70vh;position:relative;margin: -30px -20px;">
			<el-container>
				<el-aside width="200px" class="border-right bg-white" 
				style="position: absolute;top: 0;bottom: 50px;left: 0;">
					<!-- 侧边 -->
					<ul class="list-group list-group-flush">
						<!-- 列表 | 规格卡片标题 -->
						<li
							class="list-group-item list-group-item-action"
							:class="{ 'sum-active': skuIndex === index }"
							v-for="(item, index) in skusList"
							:key="index"
							@click="changeSku(index)"
						>
							{{ item.name }}
						</li>
					</ul>
				</el-aside>
				<el-footer class="border bg-white d-flex align-items-center justify-content-center"
				style="position: absolute;bottom: 0px;left: 0;height: 50px; width: 200px;">
					<!-- 分页 -->
					<el-pagination 
					@size-change="handleSizeChange" 
					@current-change="handleCurrentChange" 
					:current-page="page.current"
					:page-sizes="page.sizes" 
					:page-size="page.size" 
					layout="prev,next" 
					:total="page.total">
					</el-pagination>
				</el-footer>
				<el-header style="position: absolute;top: 0;left: 200px; right: 0; height: 60px; line-height: 60px;" class="border-top border-bottom">
					<el-button type="primary" size="mini" @click="doChooseAll">{{ isChooseAll ? '取消全选' : '全选' }}</el-button>
				</el-header>
				<!-- 主题内容 - 图片列表 -->
				<el-main style="position: absolute;top: 60px;bottom: 0;left: 200px;right: 0;">
					<div class="d-flex flex-wrap">
						<span
							class="rounded border py-1 px-2 m-2"
							style="cursor: pointer;"
							:class="{ 'sum-active': item.ischeck }"
							v-for="(item, index) in skuItems"
							:key="index"
							@click="choose(item)"
						>
							{{ item.name }}
						</span>
					</div>
				</el-main>
			</el-container>
		</el-container>
		<div slot="footer" class="dialog-footer">
			<el-button @click="hide">取 消</el-button>
			<el-button type="primary" @click="confirm">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
// import albumItem from '@/components/image/album-item.vue';
import common from '@/common/mixins/common.js';
export default {
	mixins:[common],
	data() {
		return {
			preUrl: 'skus',
			loading: false,  // 重写loading
			createModel: false,
			callback: false,
			chooseList: [], // 选中的数组
			skuIndex: 0,
			skusList: [],
		};
	},
	computed:{
		// 当前规格下的规格属性列表
		skuItems(){
			return this.skusList[this.skuIndex] && this.skusList[this.skuIndex].list
		},
		// 是否全选
		isChooseAll(){
			return this.skuItems ? this.skuItems.length === this.chooseList.length : false
		}
	},
	methods: {
		// 获取mixins数据
		getListResult(e){
			this.skusList = e.list.map(item => {
				item.list = item.default.split(',').map(name=>{
					return {
						name: name,
						image: "",
						color: "",
						ischeck: false
					}
				})
				return item
			})
		},
		// 打开弹出层
		chooseSkus(callback) {
			this.callback = callback;
			this.createModel = true;
		},
		// 点击确定
		confirm() {
			// 选中SKU传回去
			if (typeof this.callback === 'function') {
				let item = this.skusList[this.skuIndex]
				this.callback({
					id: item.id,
					name: item.name,
					type: item.type,
					list: this.chooseList
				});
			}
			// 隐藏弹出层
			this.hide();
		},
		// 关闭弹出层
		hide() {
			this.unChooseAll()
			// 关闭弹出
			this.createModel = false;
			// 初始化回调
			this.callback = false;
		},
		// 选中侧边栏, 切换规格卡片
		changeSku(index){
			this.unChooseAll()
			this.skuIndex = index
		},
		// 选中规格属性
		choose(item){
			// 之前没有选中
			if(!item.ischeck){
				// 加入选中列表
				this.chooseList.push(item)
				// 修改选中状态
				return item.ischeck = true
			}
			// 之前选中
			let index = this.chooseList.findIndex(v=>v.id === item.id)
			// 找不到
			if(index < 0) return
			// 找到之后就从选中列表中移除
			this.chooseList.splice(index,1)
			// 修改选中状态
			item.ischeck = false
		},
		// 选中 | 取消选中
		doChooseAll(){
			// 是否已经全选
			if(this.isChooseAll){ // 取消全选
				return this.unChooseAll()
			}
			// 全选
			this.chooseList = this.skuItems.map(v=>{
				// 设置全选状态
				v.ischeck = true
				return v
			})
			// console.log("this.skusList:",this.skusList)
		},
		// 取消选中所有
		unChooseAll(){
			// 取消选中的状态
			this.skuItems.forEach(v=>v.ischeck = false)
			// console.log("this.skusList:",this.skusList)
			// 清空选中列表
			return this.chooseList = []
		}
	}
};
</script>

<style>
.sum-active {
	background-color: #eee !important;
	color: #ffffff;
}
</style>
