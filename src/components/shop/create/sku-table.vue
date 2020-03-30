<template>
	<table class="table table-sm table-bordered">
		<thead>
			<tr>
				<th scope="col" class='text-center' style="vertical-align: middle;" rowspan="1" colspan="2">商品规格</th>
				<th scope="col" class='text-center' style="vertical-align: middle;" rowspan="2">SKU图片</th>
				<th scope="col" class='text-center' style="vertical-align: middle;" rowspan="2">销售价</th>
				<th scope="col" class='text-center' style="vertical-align: middle;" rowspan="2">市场价</th>
				<th scope="col" class='text-center' style="vertical-align: middle;" rowspan="2">成本价</th>
				<th scope="col" class='text-center' style="vertical-align: middle;" rowspan="2">库存</th>
				<th scope="col" class='text-center' style="vertical-align: middle;" rowspan="2">体积</th>
				<th scope="col" class='text-center' style="vertical-align: middle;" rowspan="2">重量</th>
				<th scope="col" class='text-center' style="vertical-align: middle;" rowspan="2">编码</th>
			</tr>
			<tr>
				<th scope="col" class='text-center'>颜色</th>
				<th scope="col" class='text-center'>尺寸</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<th  class='text-center' scope="row">1</th>
				<td  class='text-center'>Mark</td>
				<td  class='text-center'>Otto</td>
				<td  class='text-center'>@mdo</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		computed:{
			...mapGetters([
				'tableThs',
			])
		}
	}
</script>

<style>
</style>
