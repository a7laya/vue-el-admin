<!-- 规格属性列表 -->
<template>
	<div class="d-flex align-items-center flex-wrap">
		<div class="border px-2 py-1 rounded mr-2 position-relative d-flex align-items-center">
			<div v-if="type != 0">
				<!-- 颜色选择器 -->
				<el-color-picker v-if="type === 1" size="mini"></el-color-picker>
				<!-- 图片选择器 -->
				<span v-else class="btn btn-light p-1" style="line-height: 1;">
					<i class="el-icon-plus"></i>
				</span>
			</div>
			<input value='内容' class="form-control text-center border-0" style="width: 80px;height: 30px; font-size: 12px;" />
			<span class="btn btn-light p-0 position-absolute" 
			style="line-height: 1; cursor: pointer; right: -10px;top: -10px;">
				<i class="el-icon-circle-close"></i>
			</span>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			type: {
				type: Number,
				default: 0
			},
		},
	}
</script>

<style>
</style>
