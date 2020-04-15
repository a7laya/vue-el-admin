<template>
	<el-dialog title="选择图片" :visible.sync="imageModel" width="80%" top="5vh">
		<el-container style="height: 70vh;position:relative;margin: -30px -20px;">
			<el-header class="d-flex align-items-center border-bottom">
				<!-- 相册管理头部 -->
				<div class="d-flex mr-auto">
					<el-select placeholder="图片排序方式" v-model="searchForm.order" size="medium" class="mr-2" style="width: 150px;">
						<el-option label="降序" value="desc"></el-option>
						<el-option label="升序" value="asc"></el-option>
					</el-select>
					<el-input placeholder="请输入图片关键字" v-model="searchForm.keyword" size="medium" class="mr-2" style="width: 150px;"></el-input>
					<el-button type="success" size="medium" @click="getImageList">搜索</el-button>
				</div>
				
				
			</el-header>
			<el-container>
				<el-aside v-loading='asideLoading' width="200px" class="border-right bg-white" style="position: absolute;top: 60px;bottom: 60px;left: 0;">
					<!-- 侧边 -->
					<ul class="list-group list-group-flush">
						<!-- 用的是相册列表组件 -->
						<album-item
							v-for="(item, index) in albums"
							:key="index"
							:item="item"
							:index="index"
							:active="albumIndex === index"
							:showOption='false'
							@change="albumChange"
						></album-item>
					</ul>
				</el-aside>
				<!-- 主题内容 - 图片列表 -->
				<el-main style="position: absolute;top: 60px;bottom: 60px;left: 200px;right: 0;" v-loading='mainLoading'>
					<el-row :gutter="10">
						<!-- 响应式设置 24份 大屏每个占4分 中屏6分 小屏8分 -->
						<el-col :span="24" :lg="4" :md="6" :sm="8" v-for="(item, index) in imageList" :key="index">
							<el-card :class="{'border border-danger': item.isCheck}" class="box-card mb-3 position-relative" shadow="hover" :body-style="{ padding: 0 }" style="cursor: pointer;"
							@click.stop.native="choose(item)">
								<!-- 图片被选中时右上角的角标 -->
								<span v-if="item.isCheck" class="badge badge-danger position-absolute" size="mini" style="right: -2px; top: -2px;">
									{{item.checkOrder}}
								</span>
								<img :src="item.url" class="w-100" style="height: 100px;"/>
								<div class="w-100 text-white position-absolute px-2" style="background-color: rgba(0,0,0,.5);margin-top:-20px">
									<small style="white-space: nowrap;">{{ item.name }}</small>
								</div>
								<div class="text-center p-2">
									<el-button-group>
										<el-button icon="el-icon-view" size="mini" class="p-2" @click.stop="previewImage(item.url)"></el-button>
										<el-button icon="el-icon-edit" size="mini" class="p-2" @click.stop="imageEdit({ item, index })"></el-button>
										<el-button icon="el-icon-delete" size="mini" class="p-2" @click.stop="ifImageDel({ item, index })"></el-button>
									</el-button-group>
								</div>
							</el-card>
						</el-col>
					</el-row>
				</el-main>
			</el-container>
			<!-- 底部 -->
			<el-footer class="border-top d-flex align-items-center px-0">
				<div class="h-100 d-flex align-items-center justify-content-center border-right flex-shrink-0" style="width: 200px;">
					<el-button-group>
						<el-button size="mini" :disabled="albumPage === 1"
						@click='changeAlbumPage("pre")'>上一页</el-button>
						<el-button size="mini" :disabled="Math.ceil(albumTotal/10) === albumPage"
						@click='changeAlbumPage("next")'>下一页</el-button>
					</el-button-group>
				</div>
				<!-- 分页 -->
				<div class="flex-grow-1 ml-2">
					<el-pagination
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						:current-page="currentPage"
						:page-sizes="pageSizes"
						:page-size="pageSize"
						layout="total, sizes, prev, pager, next, jumper"
						:total="total"
					></el-pagination>
				</div>
			</el-footer>
		</el-container>
		<div slot="footer" class="dialog-footer">
			<el-button @click="hide">取 消</el-button>
			<el-button type="primary" @click="confirm">确 定</el-button>
		</div>
		
		<!-- 预览图片模态框 -->
		<el-dialog :visible.sync="previewModel">
			<div style="margin: -60px -20px -30px -20px;"><img :src="previewUrl" class="w-100" /></div>
		</el-dialog>
	</el-dialog>
</template>

<script>
	import albumItem from '@/components/image/album-item.vue';
	export default{
		components:{ albumItem },
		props:{
			// 图片选中数量限制
			max:{
				type: Number,
				default: 9
			}
		},
		data() {
			return {
				imageModel: false,
				callback: false,
				searchForm: {
					order: '',
					keyword: ''
				},
				albumIndex: 0, // 选中的相册索引
				albumModel: false, // 创建|修改相册模态框是否显示
				albumForm: { name: '', order: 0 }, // 模态框表单内容
				albumEditIndex: -1, // 正在编辑的相册索引, -1表示创建 >-1表示修改
				
				albums: [], // 相册列表,
				albumPage: 1, // 当前相册分页页码
				albumTotal: 0, // 相册分类列表总条数
				
				previewModel: false, // 图片预览模态框是否显示
				previewUrl: '', // 预览的图片地址
				
				imageList: [], // 图片列表
				chooseList: [], // 选中的图片的数组
				currentPage: 1,
				pageSize: 10, // 每页显示多少条图片
				pageSizes: [10,20,50,100], // 显示条目选项
				total: 0, // 总条数
				
				asideLoading: false,
				mainLoading: false,
				
			}
		},
		computed: {
			// 相册模态框标题
			albumModelTitle() {
				return this.albumEditIndex === -1 ? '创建相册' : '修改相册';
			},
			// 当前选中相册的id
			image_class_id() {
				let item = this.albums[this.albumIndex];
				if (item) return item.id;
				return 0;
			},
			// 当前选中相册的图片列表URL
			getImageListUrl() {
				let other = ''
				if(this.searchForm.keyword != '') other = `&keyword=${this.searchForm.keyword}`
				return `/admin/imageclass/${this.image_class_id}/image/${this.currentPage}?limit=${this.pageSize}$order=${this.searchForm.order}${other}`;
			}
		},
		
		methods:{
			// 打开弹出层
			chooseImage(callback){
				// 取消之前选中
				this.unchoose()
				this.callback = callback
				this.imageModel = true
				// 获取相册列表
				this.__init()
			},
			// 初始化数据
			__init() {
				// 获取相册列表
				
				this.unchoose()
				this.asideLoading = true
				this.axios.get('/admin/imageclass/' + this.albumPage, { token: true }).then(res => {
					let result = res.data.data;
					this.albums = result.list;
					this.albumTotal = result.totalCount
					this.asideLoading = false
					// 获取选中相册下图片列表
					this.getImageList();
				}).catch(err=>{
					this.asideLoading = false
				})
			},
			// 获取选中相册下图片列表
			getImageList() {
				// 先清空列表
				this.imageList = [];
				this.mainLoading = true
				this.axios.get(this.getImageListUrl, { token: true}).then(res => {
					if (!res) return;
					let result = res.data.data;
					this.imageList = result.list.map(item => {
						return {
							id: item.id,
							url: item.url,
							name: item.name,
							isCheck: false,
							checkOrder: 0
						};
					});
					this.total = result.totalCount
					this.mainLoading = false
				}).catch(err=>{
					this.mainLoading = false
				})
			},
			// 切换相册
			albumChange(index) {
				this.albumIndex = index;
				// 获取选中相册下图片列表
				this.__init();
			},
			// 点击确定
			confirm(){
				// 选中图片的url传回去
				if(typeof this.callback === 'function'){
					this.callback(this.chooseList)
				}
				// 隐藏弹出层
				this.hide()
				
			},
			// 关闭弹出层
			hide(){
				// 关闭弹出
				this.imageModel = false
				// 初始化回调
				this.callback = false
			},
			
			
			// 追加相册
			albumAdd() {
				this.albums.unshift({
					name: this.albumForm.name,
					order: this.albumForm.order
				});
			},
			// 预览图片
			previewImage(url) {
				this.previewUrl = url;
				this.previewModel = true;
			},
			// 编辑图片名称
			imageEdit({item, index}) {
				this.$prompt('请输入新名称', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputValue: item.name,
					inputValidator(val){
						if(val === '') return '图片名称不能为空'
					}
				}).then(({ value }) => {
					item.name = value
					this.$message({
						type: 'success',
						message: '图片名称已改为: ' + value
					});
				});
			},
			// 取消选中
			unchoose(){
				// 改变状态
				this.imageList.forEach(img=>{
					// 自己写的
					if(img.isCheck) img.isCheck = false
					if(!img.checkOrder) img.checkOrder = 0
					// // 教程写的代码如下
					// let i = this.chooseList.findIndex(item => item.id === img.id)
					// if(i > -1) {
					// 	// 移除选中
					// 	this.chooseList.splice(i, 1)
					// 	// 更改状态
					// 	img.isCheck = false
					// 	img.checkOrder = 0
					// }
				})
				// 清空chooseList
				this.chooseList = []
			},
			// 选中图片
			choose(item) {
				console.log('item:',item)
				// 选中
				if (!item.isCheck) {
					// 加入选中
					this.chooseList.push({ id: item.id, url: item.url });
					// 计算序号
					item.checkOrder = this.chooseList.length;
					// 修改选中状态
					return (item.isCheck = true);
				}
				// 取消选中
			
				// 找到在chooseList中的当前索引 i
				let i = this.chooseList.findIndex(v => v.id === item.id);
				if (i === -1) return;
				// 重新计算序号,如果取消的不是最后一个的元素，对该元素后面的元素重新排序
				let length = this.chooseList.length;
				if (i + 1 < length) {
					// 重新计算imageList索引为i之后图片的序号 -1
					for (let j = i + 1; j < length; j++) {
						let no = this.imageList.findIndex(v => v.id === this.chooseList[j].id);
						if (no === -1) return;
						this.imageList[no].checkOrder--;
					}
				}
				// 删除从chooseList中删除
				this.chooseList.splice(i, 1);
				// 修改选中状态
				item.isCheck = false;
				// 重置本身序号
				item.checkOrder = 0;
			},
			
			// 分页动作
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
				this.pageSize = val
				this.getImageList()
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
				this.currentPage = val
				this.getImageList()
			},
			
			// 相册分类列表分页功能
			changeAlbumPage(type){
				if(type === 'pre'){
					this.albumPage--
				} else {
					this.albumPage++
				}
				this.__init()
			},
		}
	}
</script>

<style>
</style>
