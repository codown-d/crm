<!--
 * @Author: your name
 * @Date: 2021-09-14 21:32:53
 * @LastEditTime: 2022-05-09 16:46:38
 * @LastEditors: Lone
 * @Description: In User Settings Edit
 * @FilePath: \crm-gmail\src\App.vue
-->
<template>
	<div id="app">
		<a-config-provider :locale="locale">
			<router-view></router-view>
		</a-config-provider>
	</div>
</template>

<script>
	//TODO: 项目的设计图片、字体、图标素材的整理及应用。

	import antdZhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
	import antdZhTW from 'ant-design-vue/lib/locale-provider/zh_TW';

	import moment from 'moment'
	import 'moment/locale/zh-cn'
	import 'moment/locale/zh-tw'
	moment.locale('zh-tw')
	// antdv vue-i18n 配置国际化 http://www.javashuo.com/article/p-bglcyfvm-nc.html

    // import Vue from 'vue';
    // //配置Gmail oauth 2.0客户端, 文档： https://github.com/vue-gapi/vue-gapi/tree/releases/v1
    // import VueGapi from 'vue-gapi' //引入vue-gapi
    // Vue.use(VueGapi, {
    //     //曾总账号配置的GCP应用
    //     apiKey: 'AIzaSyAbll3Oy4ZMRgKWd-fDGZ6jKdhjX3QGV7Q',
    //     clientId: '300147099345-8hsecemplvh0g4l904kop78hims0gq8s.apps.googleusercontent.com',
    //     discoveryDocs: [
    //         'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
    //         // 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
    //     ], //这个gmail、calendar的文档连接是试出来的，不排除有最新的
    //     // scope: 'https://www.googleapis.com/auth/gmail.addons.current.action.compose https://www.googleapis.com/auth/gmail.addons.current.message.action', //访问接口的权限，必须字符串，用空格连接
    //     // scope: 'https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/calendar', //访问接口的权限，必须字符串，用空格连接
    //     // scope: 'https://www.googleapis.com/auth/gmail.modify',//访问接口的权限，必须字符串，用空格连接
    //     scope: 'https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.labels https://www.googleapis.com/auth/gmail.send',//访问接口的权限，必须字符串，用空格连接
    //     access_type: 'offline',
    //     prompt: 'consent',
    //     refreshToken: true

    //     //小马账号配置的GCP应用
    //     // apiKey: 'AIzaSyAXjdATPp38XfaFFZYS5jIpQlN5CZyLzpU',
    //     // clientId: '256059354914-52h761538ufcta64fm79j6e0v60f8m77.apps.googleusercontent.com',
    //     // discoveryDocs: [
    //     // 	'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
    //     // 	'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
    //     // ], //这个gmail、calendar的文档连接是试出来的，不排除有最新的
    //     // // scope: 'https://www.googleapis.com/auth/gmail.addons.current.action.compose https://www.googleapis.com/auth/gmail.addons.current.message.action', //访问接口的权限，必须字符串，用空格连接
    //     // // scope: 'https://www.googleapis.com/auth/gmail.addons.current.action.compose https://www.googleapis.com/auth/gmail.addons.current.message.action https://www.googleapis.com/auth/calendar', //访问接口的权限，必须字符串，用空格连接
    //     // // scope: 'https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/calendar', //访问接口的权限，必须字符串，用空格连接
    //     // scope: 'https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.labels https://www.googleapis.com/auth/gmail.send',//访问接口的权限，必须字符串，用空格连接
    //     // access_type: 'offline',
    //     // prompt: 'consent',
    //     // refreshToken: true
    // })

	export default {
		name: 'App',
		components: {},
		data() {
			return {
				locale: antdZhTW,
				localeVal: 'zh-tw'
			}
		},
		created() {
			this.getUserMenu()
		},
		methods: {
			getUserMenu() {
				this.$store.dispatch('user/menuDatafetch').then(res => {
					//TODO
				})
			},
			// moment,
			// changeLocale (localeVal) {

			//     this.localeVal = localeVal
			//     moment.locale(localeVal)
			//     this.$i18n.locale = localeVal
			//     this.locale = localeVal == 'zh-cn' ? antdZhCN : antdZhTW
			// }
		},
	}
</script>

<style lang="less">

	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.5s;
	}

	.fade-enter,
	.fade-leave-to

	/* .fade-leave-active below version 2.1.8 */
		{
		opacity: 0;
	}

	/* 主题橙红色 #F86F54 */
	/* 辅助橙色 #F7A84A */
	/* 辅助绿色 #06A742 */
	/* 链接蓝色 #2AA7DE */

	html,
	body {
		padding: 0;
		margin: 0;
		background: #f8f8f8;
		background-color: #f0f2f5;
		height: 100vh;
		overflow: hidden;
		min-height: 650px;
		width: 100vw;
		color: #303133;
		transition: all 0.3s;
		/* overflow: hidden; */
	}

	html {
		/*隐藏滚动条，当IE下溢出，仍然可以滚动*/
		/* -ms-overflow-style: none; */
		/*火狐下隐藏滚动条*/
		/* overflow: -moz-scrollbars-none; */
	}

	::-webkit-scrollbar {
		/* display:none; */
	}

	/*滚动条 start*/
	::-webkit-scrollbar {
		width: 7px;
		height: 4px;
		background-color: #f5f5f5;
	}

	/*定义滚动条轨道 内阴影+圆角*/
	::-webkit-scrollbar-track {
		/* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);   */
		background: #fff;
	}

	/*定义滑块 内阴影+圆角*/
	::-webkit-scrollbar-thumb {
		border-radius: 10px;
		border: 0;
		background-color: #eeeff3;
		cursor: pointer;
	}

	::-webkit-scrollbar-thumb:hover {
		border-radius: 10px;
		border: 0;
		background-color: #ddd;
		cursor: pointer;
	}

	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		/* text-align: center; */
		color: #2c3e50;
		width: 100vw;
		height: 100vh;
		/* min-height: 750px; */
		background: #f8f8f8;
		background-color: #f0f2f5;
	}

	/* info: ========以下部分是項目需要用到的 按鈕、字體、邊框、佈局等基礎配置======== */
	/* 主要文字 */
	.primary-text {
		color: #2c3e50;
	}

	.default-text {
		color: #bebebe;
	}

	.title-text {
		color: #f7a84a;
	}

	.link-text {
		color: #1890ff;
		text-decoration: underline;
	}

	/* 主按钮，橙红色背景 */
	.primary-btn {
		background: #f86f54;
		color: #ffffff;
		border-color: #f86f54;
		text-shadow: 0 -1px 0 rgb(0 0 0 / 12%);
		-webkit-box-shadow: 0 2px 0 rgb(0 0 0 / 5%);
		box-shadow: 0 2px 0 rgb(0 0 0 / 5%);
	}

	.primary-btn:hover,
	.primary-btn:focus {
		background: #f3816a;
		border-color: #f3816a;
		color: #ffffff !important;
	}

	.ant-btn:hover,
	.ant-btn:focus {
		/* background: #f3816a; */
		border-color: #f3816a;
		color: #f3816a;
	}

	/* 次按钮，橙色背景 */
	.default-btn {
		background: #f7a84a;
		color: #ffffff;
		border-color: #f7a84a;
		text-shadow: 0 -1px 0 rgb(0 0 0 / 12%);
		-webkit-box-shadow: 0 2px 0 rgb(0 0 0 / 5%);
		box-shadow: 0 2px 0 rgb(0 0 0 / 5%);
	}

	.default-btn:hover,
	.default-btn:focus {
		background: #f5b568;
		border-color: #f5b568;
		color: #ffffff !important;
	}

	/* 灰色按鈕 */
	.gray-btn {
		background: #f4f3f4;
		border: 1px solid #e2e2e2;
		width: 30px;
		height: 30px;
		border-radius: 3px;
	}

	.gray-btn:hover,
	.gray-btn:focus {
		background: #f7f7f7 !important;
		border: 1px solid #e5e5e5 !important;
		color: #26292c !important;
	}

	/* //optimize: 優化灰色背景按鈕的hover、focus  */
	/* .gray-btn:hover ,.gray-btn:focus { 
        background: #f5b568;
        border-color: #f5b568;
        color: #ffffff !important;
    } */

	/* //optimize: 優化border-btn */
	.border-btn {
		border: 1px solid #e2e2e2;
		border-radius: 3px;
	}

	/* 细长型的按钮 */
	.long-btn {
		padding: 0 28px;
	}

	/* 多次用到的带边框的的背景颜色为低明度黄色的框 */
	.primary-box {
		background: #fffefb;
		border: 1px solid #e8e8e8;
	}

	.avator-lg img {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		/* margin: 0 5px 0 12px; */
	}

	.avator-md img {
		width: 35px;
		height: 35px;
		border-radius: 50%;
		/* margin: 0 5px 0 12px; */
	}

	.avator-sm img {
		width: 25px;
		height: 25px;
		border-radius: 50%;
		/* margin: 0 5px 0 12px; */
	}

	.layout {
		height: 100%;
	}

	.layout-header {
		padding: 0;
	}

	.layout-body {
		position: relative;
		z-index: 900 !important;
	}

	.layout-sider {
		background: #ffffff !important;
		border-right: 1px solid #e8e8e8 !important;
		z-index: 901;
		position: relative;
	}

	.layout-content {
		background: #f8f8f8;
		background-color: #f0f2f5;
		position: relative;
		min-width: 960px;
		overflow-x: scroll;
		/* padding: 20px; */
	}

    .default-scrollbar {
        /*滚动条 start*/
        ::-webkit-scrollbar {
            width: 12px;
            height: 12px;
        }

        /*定义滚动条轨道 内阴影+圆角*/
        ::-webkit-scrollbar-track {
            background: #F1F1F1;
        }

        /*定义滑块 内阴影+圆角*/
        ::-webkit-scrollbar-thumb {
            border-radius: 0px;
            border: 0;
            background-color: #c1c1c1;
            cursor: pointer;
        }

        ::-webkit-scrollbar-thumb:hover {
            border-radius: 0px;
            border: 0;
            background-color: #a8a8a8;
            cursor: pointer;
        }
    }
</style>