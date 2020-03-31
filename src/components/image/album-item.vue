<template>
	<li
		class="list-group-item list-group-item-action d-flex align-items-center"
		style="cursor: pointer;"
		@click.stop="$emit('change',index)"
		:class="{ 'active sum-active': active }">
		{{ item.name }}
		<span class="btn btn-light btn-sm ml-auto" v-if="!showOption">
			{{ item.num }}
		</span>
		<el-dropdown class="ml-auto" v-else>
			<span class="btn btn-light btn-sm">
				{{ item.num }}
				<i class="el-icon-arrow-down el-icon--right"></i>
			</span>
			<!-- 相册的包含数量和操作 -->
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item
				@click.stop.native="$emit('edit',{index,item})">修改</el-dropdown-item>
				<el-dropdown-item 
				@click.stop.native="$emit('del',{index,item})">删除</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
	</li>
</template>

<script>
	export default {
		name: 'album-item',
		props: {
			active: Boolean,
			item: Object,
			index: Number,
			showOption: {
				type: Boolean,
				default: true
			}
		}
	}
</script>

<style>
.sum-active {
	color: #67c23a !important;
	background-color: #f0f9eb !important;
	border-color: #c2e7b0 !important;
}
</style>
