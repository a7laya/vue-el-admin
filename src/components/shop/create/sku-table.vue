<template>
	<table class="table table-sm table-bordered table-hover">
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
				v-for="(item,index) in skuLabels" :key='index'
				rowspan="1" colspan="1" :width="item.width">
					{{item.name}}
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(item,index) in list" :key='index'>
				<!-- 商品规格 -->
				<th v-for="(sku,skuI) in item.skus" :key="skuI" 
				class='text-center' scope="row">{{sku.name}}</th>
				<td  class='text-center' width="100">
					<span class="btn btn-light boder">
						<i class="el-icon-plus"></i>
					</span>
				</td>
				<td  class='text-center' width="100">
					<input type="number" v-model="item.pprice" class="form-control text-center"/>
				</td>
				<td  class='text-center' width="100">
					<input type="number" v-model="item.oprice" class="form-control text-center"/>
				</td>
				<td  class='text-center' width="100">
					<input type="number" v-model="item.cprice" class="form-control text-center"/>
				</td>
				<td  class='text-center' width="100">
					<input type="number" v-model="item.stock" class="form-control text-center"/>
				</td>
				<td  class='text-center' width="100">
					<input type="number" v-model="item.volume" class="form-control text-center"/>
				</td>
				<td  class='text-center' width="100">
					<input type="number" v-model="item.weight" class="form-control text-center"/>
				</td>
				<td  class='text-center' width="100">
					<input type="text" v-model="item.code" class="form-control text-center"/>
				</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
	import { mapGetters,mapState } from 'vuex'
	export default {
		data() {
			return {
				list: []
			}
		},
		computed:{
			...mapState({
				sku_card: state => state.goods_create.sku_card
			}),
			...mapGetters(['tableThs','tableData','skuLabels'])
		},
		watch:{
			tableData(newValue,oldValue){
				this.list = newValue
			}
		},
		mounted() {
			this.list = this.tableData
		}
	}
</script>

<style>
</style>
