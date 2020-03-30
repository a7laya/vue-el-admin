<template>
	<table class="table table-sm table-bordered">
		<thead>
			<tr>
				<th scope="col" class='text-center' style="vertical-align: middle;"
				v-for="(item,index) in tableThs" :key='index'
				:rowspan="item.rowspan" :colspan="item.colspan" :width="item.width">
					{{item.name}}
				</th>
			</tr>
			<tr>
				<th scope="col" class='text-center' style="vertical-align: middle;"
				v-for="(item,index) in sku_card" :key='index'
				rowspan="1" colspan="1" :width="item.width">
					{{item.name}}
				</th>
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
	import { mapGetters,mapState } from 'vuex'
	export default {
		computed:{
			...mapState({
				sku_card: state => state.goods_create.sku_card
			}),
			...mapGetters(['tableThs',])
		},
		mounted() {
			console.log('this.tableThs:',JSON.stringify(this.tableThs))
		}
	}
</script>

<style>
</style>
