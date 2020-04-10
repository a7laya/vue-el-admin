module.exports = {
	lintOnSave: false,
	devServer: {
		host: "localhost",
		port: 8080,
		https: false, //
		open: true, // 配置是否自动启动浏览器
		proxy: {
			'/admin': {
				target: 'http://ceshi3.dishait.cn/admin', // 服务器api地址
				ws: true,
				changeOrigin: true, // 是否跨域
				pathRewrite: {
					'^/admin': ''
				}
			}
		}

	}
}
