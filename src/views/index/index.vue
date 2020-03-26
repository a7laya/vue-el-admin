<template>
	<div>
		<!--===== 数据统计 =====-->
		<el-row :gutter="20">
			<el-col :span="24 / counts.length" v-for="(item, index) in counts" :key="index">
				<el-card class="box-card" shadow="hover">
					<div class="d-flex align-items-center">
						<i :class="[item.icon, item.color]" class="h4 mb-0 text-center text-white mr-3 rounded" style="width: 40px;height: 40px;line-height: 40px;"></i>
						<div>
							<h4 class="mb-0">{{ item.num }}</h4>
							<small class="text-muted">{{ item.desc }}</small>
						</div>
					</div>
				</el-card>
			</el-col>
		</el-row>

		<!--===== 店铺订单提示 | 统计图 ======-->
		<el-row :gutter="20" class="mt-3">
			<!-- 店铺 订单提示 -->
			<el-col :span="12" style="height: 370px;" class="d-flex flex-column justify-content-between">
				<el-card class="box-card" shadow="hover" v-for="(item, index) in tips" :key="index">
					<div slot="header" class="clearfix">
						<span>{{ item.title }}</span>
						<el-button style="float: right; padding: 3px 0;" type="text">{{ item.desc }}</el-button>
					</div>
					<div class="row">
						<div :class="item.list.length | getCol" v-for="(item2, index2) in item.list" :key="index2">
							<button class="btn btn-light w-100">
								<h4 class="mb-1">{{ item2.value }}</h4>
								<small class="text-muted">{{ item2.name }}</small>
							</button>
						</div>
					</div>
				</el-card>
			</el-col>
			<!-- 统计图 -->
			<el-col :span="12">
				<el-card class="box-card" shadow="hover" style="height: 370px;">
					<div slot="header" class="clearfix">
						<span>统计图</span>
						<el-button style="float: right; padding: 3px 0;" type="text">操作按钮</el-button>
					</div>
					<!-- echarts画图 -->
					<div ref="myChart" style="width: 100%;height:290px;"></div>
				</el-card>
			</el-col>
		</el-row>

		<!--===== 销售情况统计 | 单品销售排名 ======-->
		<el-row :gutter="20" class="mt-3 mb-5">
			<!-- 销售情况统计 -->
			<el-col :span="12">
				<el-card class="box-card" shadow="hover">
					<div slot="header" class="clearfix">
						<span>销售情况统计</span>
						<el-button style="float: right; padding: 3px 0;" type="text">按周期统计订单量和金额</el-button>
					</div>
					<!-- 日销量 -->
					<div class="d-flex border text-muted mb-3">
						<div class="bg-light border-right px-4 py-5 ">昨日销量</div>
						<div class="d-flex flex-column" style="flex: 1;">
							<div class="d-flex align-items-center w-100 h-50 px-2 border-bottom">出库量: 22件</div>
							<div class="d-flex align-items-center w-100 h-50 px-2">出库金额: ￥12.00</div>
						</div>
					</div>
					<!-- 月销量 -->
					<div class="d-flex border text-muted">
						<div class="bg-light border-right px-4 py-5 ">本月销量</div>
						<div class="d-flex flex-column" style="flex: 1;">
							<div class="d-flex align-items-center w-100 h-50 px-2 border-bottom">出库量: 22件</div>
							<div class="d-flex align-items-center w-100 h-50 px-2">出库金额: ￥12.00</div>
						</div>
					</div>
				</el-card>
			</el-col>
			<el-col :span="12">
				<el-card class="box-card" shadow="hover">
					<div slot="header" class="clearfix">
						<span>销售排行</span>
						<el-button style="float: right; padding: 3px 0;" type="text">按周期统计订单量排行</el-button>
					</div>
					<el-table :data="tableData" height="250" border style="width: 100%">
						<el-table-column type="index" label="#" width="40" align="center"></el-table-column>
						<el-table-column prop="name" label="商品信息"></el-table-column>
						<el-table-column prop="num" label="销量" align="center" width="60"></el-table-column>
					</el-table>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import echarts from 'echarts';
export default {
	data() {
		return {
			counts: [
				{ icon: 'el-icon-s-finance', num: 746, desc: '支出总计(元)', color: 'bg-primary' },
				{ icon: 'el-icon-s-goods', num: 22, desc: '本日卖出(元)', color: 'bg-success' },
				{ icon: 'el-icon-s-order', num: 256, desc: '本月卖出(元)', color: 'bg-danger' },
				{ icon: 'el-icon-s-data', num: 1222, desc: '今年卖出(元)', color: 'bg-warning' }
			],
			tips: [
				{
					title: '店铺及商品提示',
					desc: '需要关注的信息及代办事项',
					list: [{ name: '出售中', value: 64 }, { name: '出售中', value: 64 }, { name: '出售中', value: 64 }, { name: '出售中', value: 64 }]
				},
				{
					title: '订单提示',
					desc: '',
					list: [{ name: '出售中', value: 64 }, { name: '出售中', value: 64 }, { name: '出售中', value: 64 }]
				}
			],
			tableData: [
				{
					name: '王小虎王小虎王小虎王小虎王小虎王小虎',
					num: 9
				},
				{
					name: '王小虎王小虎王小虎王小虎王小虎王小虎',
					num: 9
				},
				{
					name: '王小虎王小虎王小虎王小虎王小虎王小虎',
					num: 9
				},
				{
					name: '王小虎王小虎王小虎王小虎王小虎王小虎',
					num: 9
				},
				{
					name: '王小虎王小虎王小虎王小虎王小虎王小虎',
					num: 9
				},
				{
					name: '王小虎王小虎王小虎王小虎王小虎王小虎',
					num: 9
				}
			]
		};
	},
	filters: {
		getCol(length) {
			return `col-${12 / length}`;
		}
	},

	// dom渲染完毕
	mounted() {
		// 画统计图
		this.drawLine();
	},
	methods: {
		drawLine() {
			// 基于准备好的dom，初始化echarts实例
			var myChart = echarts.init(this.$refs.myChart);
			// 指定图表的配置项和数据
			var option = {
				title: {},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						label: {
							backgroundColor: '#6a7985'
						}
					}
				},
				legend: {
					data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
				},
				toolbox: {
					feature: {
						saveAsImage: {}
					}
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: [
					{
						type: 'category',
						boundaryGap: false,
						data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
					}
				],
				yAxis: [
					{
						type: 'value'
					}
				],
				series: [
					{
						name: '邮件营销',
						type: 'line',
						stack: '总量',
						areaStyle: {},
						data: [120, 132, 101, 134, 90, 230, 210]
					},
					{
						name: '联盟广告',
						type: 'line',
						stack: '总量',
						areaStyle: {},
						data: [220, 182, 191, 234, 290, 330, 310]
					},
					{
						name: '视频广告',
						type: 'line',
						stack: '总量',
						areaStyle: {},
						data: [150, 232, 201, 154, 190, 330, 410]
					},
					{
						name: '直接访问',
						type: 'line',
						stack: '总量',
						areaStyle: {},
						data: [320, 332, 301, 334, 390, 330, 320]
					},
					{
						name: '搜索引擎',
						type: 'line',
						stack: '总量',
						label: {
							normal: {
								show: true,
								position: 'top'
							}
						},
						areaStyle: {},
						data: [820, 932, 901, 934, 1290, 1330, 1320]
					}
				]
			};

			// 使用刚指定的配置项和数据显示图表。
			myChart.setOption(option);
		}
	}
};
</script>

<style></style>
