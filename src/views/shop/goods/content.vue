<template>
	<div>
		<router-link :to="{ name: 'shop_goods_list' }" style="position: absolute; top: 3px; left: 200px;"><el-button size="mini">回到商品列表</el-button></router-link>
		<div class="bg-white h-100 px-3 py-2 goods_create" style="margin:-8px -20px 20px -20px; ">
			<!-- 引入富文本编辑器 -->
			<tinymce ref="editor" v-model='content' @onClick="onClick"
			toolbar="undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists table | removeformat | imageUpload"/>
		</div>
		
		<el-button type="primary" style="position: fixed; bottom: 50px; right: 50px;">提交</el-button>
	</div>
</template>

<script>
// 富文本编辑器
import tinymce from '@/components/common/tinymce.vue'
export default {
	inject: ['app'],
	components: { tinymce },
	data() {
		return {
			id: 0,
			content: 'tinymce',
		};
	},
	created() {
		this.id = this.$route.params.id
	},
	methods: {
		
		// 富文本编辑器的方法
		onClick(e, editor){
			console.log('Element clicked');
			console.log("e:",e)
			console.log("editor:",editor)
		},
	}
};
</script>

<style>
</style>
