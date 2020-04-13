<template>
	<div>
		<el-container style="position: absolute;top: 36px;bottom: 0;left: 0;right: 0;">
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
				<el-button type="infor" size="medium" @click="unchoose()" v-if="chooseList.length">取消选中</el-button>
				<el-button type="danger" size="medium" @click="ifImageDel({ all: true })" v-if="chooseList.length">批量删除</el-button>
				<el-button type="success" size="medium" @click="openAlbumModel(false)">创建相册</el-button>
				<el-button type="warning" size="medium" @click="uploadModel = true">上传图片</el-button>
			</el-header>
			<el-container>
				<el-aside width="200px" class="border-right bg-white" style="position: absolute;top: 60px;bottom: 60px;left: 0;">
					<!-- 侧边 -->
					<ul class="list-group list-group-flush">
						<!-- 用的是相册列表组件 -->
						<album-item
							v-for="(item, index) in albums"
							:key="index"
							:item="item"
							:index="index"
							:active="albumIndex === index"
							@change="albumChange"
							@edit="openAlbumModel"
							@del="albumDel"
						></album-item>
					</ul>
				</el-aside>
				<!-- 主题内容 - 图片列表 -->
				<el-main style="position: absolute;top: 60px;bottom: 60px;left: 200px;right: 0;">
					<el-row :gutter="10">
						<!-- 响应式设置 24份 大屏每个占4分 中屏6分 小屏8分 -->
						<el-col :span="24" :lg="4" :md="6" :sm="8" v-for="(item, index) in imageList" :key="index">
							<el-card
								:class="{ 'border border-danger': item.isCheck }"
								class="box-card mb-3 position-relative"
								shadow="hover"
								:body-style="{ padding: 0 }"
								style="cursor: pointer;"
								@click.stop.native="choose(item)"
							>
								<!-- 图片被选中时右上角的角标 -->
								<span v-if="item.isCheck" class="badge badge-danger position-absolute" size="mini" style="right: -2px; top: -2px;">{{ item.checkOrder }}</span>
								<img :src="item.url" class="w-100" style="height: 100px;" />
								<div class="w-100 text-white position-absolute px-2" style="background-color: rgba(0,0,0,.5);margin-top:-24px">
									<small>{{ item.name }}</small>
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

		<!-- 修改 | 创建相册模态框 -->
		<el-dialog :title="albumModelTitle" :visible.sync="albumModel">
			<el-form ref="form" :model="albumForm" label-width="80px">
				<el-form-item label="相册名称"><el-input v-model="albumForm.name" placeholder="请输入相册名称"></el-input></el-form-item>
				<el-form-item label="相册排序"><el-input-number v-model="albumForm.order" :min="0"></el-input-number></el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="albumModel = false">取 消</el-button>
				<el-button type="primary" @click="confirmAlbumModel">确 定</el-button>
			</div>
		</el-dialog>

		<!-- 上传图片模态框 -->
		<el-dialog title="上传图片" :visible.sync="uploadModel" @close="__init">
			<el-upload class="upload-demo w-100 text-center" drag multiple 
			action="/admin/image/upload"
			:headers="{token:$store.state.user.token}"
			:data="{image_class_id:image_class_id}"
			name='img'
			:on-success="uploadSuccess">
				<i class="el-icon-upload"></i>
				<div class="el-upload__text">
					将文件拖到此处，或
					<em>点击上传</em>
				</div>
				<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
			</el-upload>
		</el-dialog>
		<!-- 预览图片模态框 -->
		<el-dialog :visible.sync="previewModel">
			<div style="margin: -60px -20px -30px -20px;"><img :src="previewUrl" class="w-100" /></div>
		</el-dialog>
	</div>
</template>

<script>
import albumItem from '@/components/image/album-item.vue';
export default {
	components: { albumItem },
	inject:['layout'],
	data() {
		return {
			searchForm: {
				order: 'desc', // 默认降序
				keyword: ''
			},
			albumIndex: 0, // 选中的相册索引
			albumModel: false, // 创建|修改相册模态框是否显示
			albumForm: { name: '', order: 0 }, // 模态框表单内容
			albumEditIndex: -1, // 正在编辑的相册索引, -1表示创建 >-1表示修改
			
			albums: [], // 相册列表,
			albumPage: 1, // 当前相册分页页码
			albumTotal: 0, // 相册分类列表总条数
			
			uploadModel: false, // 上传模态框是否显示
			previewModel: false, // 图片预览模态框是否显示
			previewUrl: '', // 预览的图片地址
			
			imageList: [], // 图片列表
			chooseList: [], // 选中的图片的数组
			currentPage: 1,
			pageSize: 10, // 每页显示多少条图片
			pageSizes: [10,20,50,100], // 显示条目选项
			total: 0, // 总条数
		};
	},
	created() {
		this.__init();
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
	methods: {
		// 初始化数据
		__init() {
			// 获取相册列表
			this.layout.showLoading()
			this.chooseList = []
			this.axios.get('/admin/imageclass/' + this.albumPage, { token: true }).then(res => {
				let result = res.data.data;
				this.albums = result.list;
				this.albumTotal = result.totalCount
				
				// 获取选中相册下图片列表
				this.getImageList();
			}).catch(err=>{
				this.layout.hideLoading()
			})
		},
		// 获取选中相册下图片列表
		getImageList() {
			this.layout.showLoading()
			// 先清空列表
			this.imageList = [];
			this.axios.get(this.getImageListUrl, { token: true}).then(res => {
				if (!res) return;
				let result = res.data.data;
				this.imageList = result.list.map(item => {
					return {
						id: item.id,
						url: item.url,
						name: item.name,
						ischeck: false,
						checkOrder: 0
					};
				});
				this.total = result.totalCount
				this.layout.hideLoading()
			}).catch(err=>{
				this.layout.hideLoading()
			})
		},
		// 切换相册
		albumChange(index) {
			this.albumIndex = index;
			// 获取选中相册下图片列表
			this.__init();
		},
		// 删除相册
		albumDel({ index, item }) {
			var that = this;
			this.$confirm('此操作将永久删除"' + item.name + '", 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.axios.delete("/admin/imageclass/"+item.id,{token: true}).then(res=>{
					if(!res.data.data) return
					this.$message({
						type: 'success',
						message: '"' + item.name + '"删除成功!'
					});
					this.__init()
					this.layout.hideLoading()
				}).catch(err => {
					this.layout.hideLoading()
				})
				
			});
		},
		// 打开相册修改 | 创建框
		openAlbumModel(obj) {
			// 修改相册
			if (obj && obj !== undefined) {
				let { index, item } = obj;
				// 初始化表单
				this.albumEditIndex = index;
				this.albumForm.name = item.name;
				this.albumForm.order = item.order;
				return (this.albumModel = true);
			}
			// 创建相册
			this.albumForm = { name: '', order: 0 }; // 先清空表单
			this.albumEditIndex = -1;
			this.albumModel = true;
		},
		// 点击确定，进行修改|创建相册
		confirmAlbumModel() {
			if (this.albumEditIndex > -1) {
				this.albumEdit(); // 修改
				return (this.albumModel = false); // 关闭模态框
			}
			// 追加相册
			this.albumAdd();
			this.albumModel = false;
		},
		// 修改相册
		albumEdit() {
			let item = this.albums[this.albumEditIndex]
			this.axios.post("/admin/imageclass/"+item.id,this.albumForm,{token: true}).then(res=>{
				let result = res.data.data
				if(result){
					this.$message({
						message: '修改成功',
						type: 'success'
					})
					this.__init()
				}
				this.layout.hideLoading()
			}).catch(err => {
				this.layout.hideLoading()
			})
		},
		// 创建相册
		albumAdd() {
			this.axios.post("/admin/imageclass",this.albumForm,{token: true}).then(res=>{
				let result = res.data.data
				if(result){
					this.$message({
						message: '创建成功',
						type: 'success'
					})
					this.__init()
				}
				this.layout.hideLoading()
			}).catch(err => {
				this.layout.hideLoading()
			})
		},
		// 预览图片
		previewImage(url) {
			this.previewUrl = url;
			this.previewModel = true;
		},
		// 修改图片名称
		imageEdit({ item, index }) {
			this.layout.showLoading()
			this.$prompt('请输入新名称', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputValue: item.name,
				inputValidator(val) {
					if (val === '') return '图片名称不能为空';
				}
			}).then(({ value }) => {
				this.axios.post("/admin/image/"+item.id,{name:value},{token: true}).then(res=>{
					if(!res.data.data) return
					item.name = value
					// this.__init()
					this.$message({
						type: 'success',
						message: '图片名称已改为: ' + value
					});
					this.layout.hideLoading()
				}).catch(err => {
					this.layout.hideLoading()
				})
				
			});
		},
		// 取消选中
		unchoose() {
			// 改变状态
			this.imageList.forEach(img => {
				// 自己写的
				if (img.isCheck) img.isCheck = false;
				if (!img.checkOrder) img.checkOrder = 0;
				// // 教程写的代码如下
				// let i = this.chooseList.findIndex(item => item.id === img.id)
				// if(i > -1) {
				// 	// 移除选中
				// 	this.chooseList.splice(i, 1)
				// 	// 更改状态
				// 	img.isCheck = false
				// 	img.checkOrder = 0
				// }
			});
			// 清空chooseList
			this.chooseList = [];
		},
		// 选中图片
		choose(item) {
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
		// 删除单张图片
		imageDel(obj) {
			this.axios.delete('/admin/image/'+obj.item.id,{token: true}).then(res=>{
				if(!res.data.data) return
				// this.imageList.splice(obj.index,1)
				this.__init()
				this.layout.hideLoading()
				this.$message({
					type: 'success',
					message: '成功删除了 ' + obj.item.name
				})
			}).catch(err => {
				this.layout.hideLoading()
			})
		},
		// 批量删除图片
		imageDelAll() {
			this.axios.post("/admin/image/delete_all",{
				ids: this.chooseList.map(v=>v.id)
			},{token: true}).then(res=>{
				this.$message({
					type:'success',
					message: '删除成功'
				})
				this.__init()
				this.chooseList = [];
				this.layout.hideLoading()
			}).catch(err => {
				this.layout.hideLoading()
			})
			// 找到imageList里面不包含在chooseList里面的元素，重新赋值给list
			// let list = this.imageList.filter(img => !this.chooseList.some(c => c.id === img.id));
			// this.imageList = list;
			// this.chooseList = [];
		},
		// 删除图片询问
		ifImageDel(obj) {
			let { item, index, all } = obj;
			this.$confirm(obj.all ? `是否删除这${this.chooseList.length}张图片?` : `是否删除${item.name}`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				// 根据obj.all来判断是否进行批量删除
				if(obj.all){
					// 批量删除
					return this.imageDelAll() 
				}
				// 删除单张
				return this.imageDel(obj)
			});
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
		// 图片上传成功后
		uploadSuccess(res, file, file_list){
			console.log("res:",res)
			console.log("file:",file)
			console.log("file_list:",file_list)
		}
	}
};
</script>

<style></style>
