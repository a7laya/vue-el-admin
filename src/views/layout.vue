<template>
	<div>
		<el-container style="position: absolute; top: 0; bottom: 0;left: 0;right: 0; overflow: hidden;">
			<el-header class="d-flex align-items-center" style="background-color: #545c64;">
				<!-- logo -->
				<a class="h5 mb-0 text-light mr-auto">{{$conf.logo}}</a>
				<!-- 顶部菜单 -->
				<el-menu
					:default-active="navBar.active"
					class="el-menu-demo"
					mode="horizontal"
					@select="handleSelect"
					background-color="#545c64"
					text-color="#fff"
					active-text-color="#ffd04b"
				>
					<el-menu-item v-for="(item,index) in navBar.list" :key="index" :index="index | numToString">{{item.name}}</el-menu-item>
					<el-submenu index="100">
						<template slot="title">
							<el-avatar size="small"  
							:src="user.avatar ? user.avatar : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"></el-avatar>
							{{user.username}}
						</template>
						<el-menu-item index="100-1">修改</el-menu-item>
						<el-menu-item index="100-2">退出</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-header>
			<!-- 侧边和内容区域 -->
			<el-container style="height: 100%;">
				<!-- 侧边布局 -->
				<el-aside width="200px">
					<el-menu :default-active="slideMenusActive" style="height: 100%;" @select="slideSelect">
						<el-menu-item v-for="(item,index) in slideMenus" :key="index" :index="index|numToString">
							<i :class="item.icon"></i>
							<span slot="title">{{item.name}}</span>
						</el-menu-item>
					</el-menu>
				</el-aside>
				<!-- 主布局 -->
				<el-main class="bg-white" style="padding-bottom: 60px;position: relative;">
					<!-- 面包屑导航 -->
					<div class="border-bottom mb-2 bg-white" style="margin: -20px;padding: 10px;"
					v-if="this.bran.length>0">
						<el-breadcrumb separator-class="el-icon-arrow-right">
							<el-breadcrumb-item 
							v-for="(item,index) in bran" :key="index"
							:to="{ path: item.path }">
								{{item.title}}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</div>
					<!-- 主内容 -->
					<router-view></router-view>
					<!-- 回到顶部 -->
					<el-backtop target=".el-main" style='z-index: 10000;' :bottom='60'></el-backtop>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import common from "@/common/mixins/common.js"
import { mapState } from 'vuex'
export default {
	mixins:[common],
	data() {
		return {
			navBar: [], // 导航栏相关
			bran: [], // 面包屑导航
		};
	},
	created() {
		// 初始化菜单
		this.navBar = this.$conf.navBar
		// 获取面包屑导航
		this.getRouterBran()
		// 初始化选中菜单 刷新或者载入的话
		this.__initNavBar()
	},
	watch:{
		'$route'(to, form) {
			console.log("this.$route:",this.$route);
			// 更新面包屑导航
			this.getRouterBran()
			// 当前激活菜单重设置
			
			// 存储当前，激活的菜单
			localStorage.setItem('navActive', JSON.stringify({
				top: this.navBar.active,
				left: this.slideMenusActive
			}))
		}
	},
	computed: {
		// 管理员信息
		...mapState({
			user: state=>state.user.user,
			// navBar: state=>state.menu.navBar,
		}),
		// 根据顶部菜单选中的索引，获取侧边菜单list里面的menu
		slideMenus(){
			return this.navBar.list[this.navBar.active].subMenu || []
		},
		// 获取侧边菜单subActive
		slideMenusActive: {
			get(){
				return this.navBar.list[this.navBar.active].subActive || "0"
			},
			set(val){
				this.navBar.list[this.navBar.active].subActive = val
			}
		}
	},
	methods: {
		// 初始化菜单
		__initNavBar(){
			let data = localStorage.getItem('navActive')
			if(data){
				data = JSON.parse(data)
				this.navBar.active = data.top
				this.slideMenusActive = data.left
				this.$router.push({name:this.navBar.list[data.top].subMenu[data.left].pathname})
			}
			
		},
		// 获取面包屑
		getRouterBran(){
			console.log("this.$route.matched:",this.$route.matched)
			let b = this.$route.matched.filter(v => v.name)
			let arr = []
			// 过滤layout和index
			b.forEach((v,k) => {
				if(v.name === 'layout' || v.name === 'index') return
				arr.push({
					name: v.name,
					path: v.path,
					title: v.meta.title
				})
			})
			if(arr.length > 0) {
				arr.unshift({ name:'index', path:'/index', title:'后台首页'})
			}
			this.bran = arr
		},
		// 点击顶部菜单后获取设置对应的索引值，并跳转
		handleSelect(key, keyPath) {
			if(key === '100-1') return console.log("key:修改");
			if(key === '100-2') {
				// 退出登录
				return this.logout();
			}
			// 改变激活值
			this.navBar.active = key
			// 默认选中第一个
			this.slideMenusActive = 0
			// 默认跳转到当前激活的那个
			if(this.slideMenus.length>0){
				console.log('this.slideMenus',this.slideMenus);
				this.$router.push({
					name: this.slideMenus[0].pathname
				})
			}
			
		},
		// 点击侧边菜单后，设置对应的索引值并跳转
		slideSelect(key, keyPath) {
			// if(this.slideMenusActive === key) return
			this.slideMenusActive = key
			// 跳转
			this.$router.push({
				name: this.slideMenus[key].pathname
			})
		},
		// 退出登录
		logout(){
			this.axios.post('/admin/logout',{},{token: true,loading:true}).then(res=>{
				console.log("res:",res)
				this.$message('退出成功')
				// 清除状态和本地存储
				this.$store.commit('logout')
				// 返回登录页
				this.$router.push({name: 'login'})
			}).catch(err => {
				// 清除状态和本地存储
				this.$store.commit('logout')
				// 返回登录页
				this.$router.push({name: 'login'})
			})
		}
	}
};
</script>

<style></style>
