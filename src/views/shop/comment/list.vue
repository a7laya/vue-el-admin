<template>
	<div class="bg-white h-100 px-3 py-2" style="margin:-8px -20px 20px -20px; ">
		<button-search ref="buttonSearch" 
		:showSuperSearch = 'false'
		@search="searchEvent" 
		placeholder="要搜索的商品标题"></button-search>
		<!-- 表格 -->
		<el-table border class="mt-3" :data="tableData" style="width: 100%">
			<el-table-column type="selection" width="55" align="center"></el-table-column>
			<!-- 展开评论详情 -->
			<el-table-column type="expand">
				<template slot-scope="scope">
					<div class="media">
						<!-- 用户评论 -->
						<img :src="scope.row.user.avatar" class="mr-3 rounded-circle" style="width: 50px;height: 50px;"/>
						<div class="media-body">
							<h6 class="mt-0 mb-0 d-flex">
								{{scope.row.user.nickname}}<small class="ml-2">{{scope.row.review_time}}</small>
								<el-button type="info" class="ml-auto" size="mini"
								v-if="!textareaEdit"
								@click='textareaEdit = true'>回复</el-button>
							</h6>
							<!-- 评论内容 -->
							{{scope.row.review.data}}
							<!-- 评论图片 -->
							<div class="py-2">
								<img v-for="(item,index) in scope.row.review.image" :key="index" :src="item"  
								style="max-height: 100px; max-width: 200px;"/>
							</div>
							<!-- 客服回复 -->
							<div v-if="textareaEdit">
								<el-input type="textarea" :rows="2" placeholder="请输入回复内容"  
								v-model="textarea" size="mini" class="mb-2"></el-input>
								<el-button type="success" @click="review(scope.row)" size="mini">确定</el-button>
								<el-button type="info"    @click="closeTextarea" size="mini">取消</el-button>
							</div>
							
							<div v-if="scope.row.extra && !textareaEdit">
								<div class="media bg-light p-1 mt-2 rounded" 
								v-for="(item,index) in scope.row.extra" :key="index">
									<div class="media-body p-1">
										<h6 class="mt-0 d-flex">
											客服<small class="ml-2"></small>
											<el-button type="info" class="ml-auto" size="mini"
											@click='openTextarea(item.data)'>修改</el-button>
										</h6>
										{{item.data}}
									</div>
								</div>
							</div>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="id" label="ID" align="center" width="70"></el-table-column>
			<el-table-column prop="name" label="商品"  width="380">
				<template slot-scope="scope">
					<div class="media">
						<img class="mr-3 rounded" :src="scope.row.goods_item.cover" style="width: 40px; height: 40px;" />
						<div class="media-body">
							<h6 class="mt-0">{{ scope.row.goods_item.title }}</h6>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="info" label="评价信息" width="185">
				<template slot-scope="scope">
					<div class="d-flex flex-column">
						<div>用户名: {{scope.row.user.username}}</div>
						<el-rate disabled v-model="scope.row.rating"></el-rate>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="review_time" label="评价时间" align="center" width="155"></el-table-column>

			<el-table-column label="是否显示" align="center" width="140">
				<template slot-scope="scope">
					<el-button plain :type="scope.row.status ? 'success' : 'danger'" size="mini" @click="changeStatus(scope.row)">
						{{ scope.row.status ? '显示' : '隐藏' }}
					</el-button>
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
				:current-page="page.current"
				:page-sizes="page.sizes" 
				:page-size="page.size" 
				layout="total, sizes, prev, pager, next, jumper" 
				:total="page.total">
				</el-pagination>
			</div>
		</el-footer>
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
			preUrl: 'goods_comment',
			textarea: '', // 客服回复输入框
			textareaEdit: false, // 客服回复输入框 是否显示
			form: {
				title: '',
				code: '',
				type: '',
				time: ''
			},
			tableData: []
		};
	},
	methods: {
		// 重写mixin中common.js的getListResult方法来处理后端数据
		getListResult(e){
			console.log("e:",e)
			this.tableData = e.list
		},
		getListUrl(){
			return `/admin/${this.preUrl}/${this.page.current}?limit=${this.page.size}&title=${this.form.title}`
		},
		// 搜索事件
		searchEvent(e = false) {
			// 简单搜索
			if (typeof e === 'string') {
				console.log('简单搜索:', e);
				this.form.title = e
				console.log('this.getListUrl():',this.getListUrl())
				return this.getList()
			}
			// 高级搜索
			console.log('高级搜索');
		},
		// 客服回复
		review(item){
			if(this.textarea.trim() === '') return this.$message({
				type: 'error',
				message: '回复内容不能为空'
			})
			let url = `/admin/goods_comment/review/${item.id}`
			let obj = {
				id: item.order_id,
				data: this.textarea
			}
			this.layout.showLoading()
			this.axios.post(url,obj,{token:true})
				.then(res => {
					if(!res.data.data) return
					if(item.extra && item.extra[0]) {
						item.extra[0].data = this.textarea 
					} else { // 判断不是修改回复
						this.getList()
					}
					this.closeTextarea()
					this.layout.hideLoading()
				}).catch(err => {
					this.layout.hideLoading()
				})
		},
		// 取消回复
		closeTextarea(){
			this.textareaEdit = false
			this.textarea = ''
		},
		// 点击修改回复按钮
		openTextarea(data){
			this.textarea = data
			this.textareaEdit = true
		}
	}
};
</script>

<style>
.el-radio {
	margin-right: 0;
}
</style>
