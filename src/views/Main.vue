<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lone
 * @Date: 2021-10-29 20:25:53
 * @LastEditors: Lone
 * @LastEditTime: 2022-04-26 16:23:10
-->
<template>
	<div class="main" ref="main">
		<!-- <a-alert
            v-if="alertShow"
            message="連接失敗！"
            description="連接郵件服務器失敗！"
            type="warning"
            :banner="true"
            closable
            show-icon
            :after-close="() => alertShow = false"
        /> -->
		<a-layout class="layout">
			<!-- 頂部 -->
			<a-layout-header class="layout-header" @click="onSocketSend">
				<!-- @click="visible = true"-->
				<Header />
			</a-layout-header>

			<a-layout class="layout-body">
				<!-- sider-menu 菜單部分  -->
				<a-layout-sider class="layout-sider" width="80">
					<Sider />
				</a-layout-sider>

				<!-- content 主體部分 -->
				<a-layout-content class="layout-content" ref="content" id="content">
					<transition name="fade-transform" mode="out-in">
						<keep-alive>
							<router-view />
						</keep-alive>
					</transition>
				</a-layout-content>
			</a-layout>
		</a-layout>
	</div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Layout/Header'
import Sider from '@/components/Layout/Sider'
// import Api from '@/services/api';
import elementResizeDetectorMaker from 'element-resize-detector'

export default {
	name: 'Main',
	components: {
		Header,
		Sider,
	},
	data() {
		return {
			isShow: false,
			isUserSettingShow: false, //clickSetting 使用
			pgTit: '',
			subMenu: false,
			websock: '',
			socketOptions: {
				url: 'wss://service.mysales.com.tw/websocket/api/midway/mailServer/1',
				limit: 5,
				count: 0,
			},
			alertShow: false,
		}
	},
	created() {
		// NOTE: 45min refresh policy is what google recommends
		//window.setInterval(this.$gapi.refreshToken(), 2.7e6); //每45分鐘自動更新一次token
		//console.log('App.vue created 列印this.$api: ', this.$api);

		//note: 進入應用後，需要執行的初始化操作
		// 連接 郵件websocket
		this.initWebSocket()

		//獲取郵箱帳號資訊
		this.initMailInfo()

		//獲取LINE頻道數據
		this.initLineInfo()
		// setTimeout(() => {
		// }, 1000);
        
        // 全域socket的連接、消息的配置
		// this.initSocket();
	},
    mounted () {
        // 监听窗口变化
        const erd = elementResizeDetectorMaker()
        erd.listenTo(document.getElementById("content"),(element)=>{
            // console.log('监听content的变化: ', element);
            let width = element.offsetWidth;
            let drawerWidth = 1400;
            if (width > 1400) {
                drawerWidth = 1300;
            } else if (width < 850) {
                drawerWidth = 800;
            } else {
                drawerWidth = 1300 / 1900 * width;
            };
            this.$store.commit('main/SET_DRAWER_WIDTH', drawerWidth);
        });;
    },
	destroyed() {
		this.websock.close()
	},
	methods: {
		// initSocket() {
		// 	let that = this
		// 	setTimeout(() => {
		// 		window.websocket = that.$socket
		// 		console.log(websocket)
		// 		websocket.onopen = function (event) {
		// 			console.log('連接成功！')
		// 		}
		// 		websocket.onmessage = function (event) {
		// 			var res = JSON.parse(event.data)
		// 			// 視自己聊天伺服器的自訂事件而定
		// 			if (res != null) {
		// 				switch (res.code) {
		// 					case 10001:
		// 						Toast(res.states)
		// 						break
		// 					case 10003:
		// 						// 用戶線上
		// 						break
		// 					case 10004:
		// 						// 用戶剛剛下線
		// 						break
		// 					case 10005:
		// 						// 消息發送成功
		// 						console.log('新消息')
		// 						break
		// 					case 10006:
		// 						// 消息發送成功
		// 						break
		// 					default:
		// 				}
		// 			}
		// 		}
		// 		websocket.onclose = function (event) {
		// 			console.log('聊天伺服器連接失敗')

		// 			setTimeout(() => {
		// 				that.socketOn()
		// 				Toast('重新連接聊天伺服器')
		// 				window.websocket = that.socket
		// 			}, 1000)
		// 		}
		// 		websocket.onerror = function (event, e) {
		// 			console.log('error ' + event.data)
		// 		}
		// 	}, 1000)
		// },
		initMailInfo() {
			this.$store.dispatch('mail/getMailAccountList').then(res => {
				if (!res) return this.$message.error('初始化郵箱數據失敗!', 5)
				// this.$message.success('初始化郵箱資料成功!', 3);
			})
		},
		initLineInfo() {
			this.$api.sns.getAllLineChannel().then(res => {
				if (res.code != 0) return this.$message.error(`${res.message ? res.message : '獲取line頻道出錯'}`)
				// if (!res.data.length) this.onBindingShow(false)
				// console.log(
				// 	'判斷line是否同步',
				// 	res.data.some(item => item.isUse == true),
				// )
				let isBindLine = res.data.length ? res.data.some(item => item.isUse == true) : false
				// if (!isBindLine) return this.onBindingShow(false)
				this.$store.commit('sns/SET_LINE_IS_SYNC', isBindLine)

				let syncChannel = res.data.length ? res.data.find(item => item.isUse == true) || null : null
				this.$store.commit('sns/SET_SYNC_CHANNEL_INFO', syncChannel)
			})
		},
		openSubMenu() {
			this.subMenu = !this.subMenu
		},
		pgLink(pgUrl) {
			this.subMenu = false
			this.$router.push(pgUrl)
		},
		clickMore() {
			this.isShow = true
		},
		closeSubNav() {
			this.isShow = false
		},
		clickRouter(linkName) {
			if (linkName) {
				// router.push();
				this.isShow = false
				// router.push('importData');
			}
		},
		// clickSetting(){
		//      this.isUserSettingShow = !this.isUserSettingShow;
		// },
		// settingLink(linkName){
		//     this.$router.push(linkName);
		//     this.isUserSettingShow = false;
		// }
		initWebSocket() {
			//初始化weosocket
			// const wsuri = "ws://52.221.25.56:9230/mailServer/1";
			// const wsuri = "ws://52.74.188.171:9200/api/midway/mailServer/1";
			const wsuri = 'wss://service.mysales.com.tw/api/midway/mailServer/1';
            if (this.websock) this.websock = '';
			this.websock = new WebSocket(wsuri)
			this.websock.onmessage = this.onSocketMessage
			this.websock.onopen = this.onSocketOpen
			this.websock.onerror = this.onSocketError
			this.websock.onclose = this.onSocketClose
		},
		onSocketOpen() {
			//連接建立之後執行send方法發送資料
			let actions = { message: 'Hello MailServe!!!' }
			this.onSocketSend(actions)
		},
		onSocketError() {
			//連接建立失敗重連
			if (this.socketOptions.count <= this.socketOptions.limit) {
                this.websock.close()
				this.initWebSocket()
				this.socketOptions.count++
			} else {
				this.websock.close()
				// this.alertShow = true;
				console.log('連接Mail Socket失敗！！！')
				this.$message.error('連接Mail Socket失敗！！！')
			}
		},
		onSocketMessage(e) {
			//資料接收
			if (e.data.substr(0, 1) == '{') {
				const message = JSON.parse(e.data)
				if (message.mailCount > 0) {
					console.log('有新消息過來了: ', message)
					this.$store.commit('mail/SET_NEW_MAIL_COUNT', message.mailCount)
				}
			} else {
                
			}
		},
		onSocketSend(Data) {
			//資料發送
			this.websock.send(JSON.stringify(Data))
		},
		onSocketClose(e) {
			//關閉
			console.log('Mail Socket斷開連接', e)
			if (this.socketOptions.count <= this.socketOptions.limit) {
                this.websock.close()
				this.initWebSocket()
				this.socketOptions.count++
			} else {
				this.websock.close()
				// this.alertShow = true;
				console.log('連接Mail Socket失敗！！！')
				this.$message.error('連接Mail Socket失敗！！！')
			}
		},
	},
}
</script>

<style scoped>
.main {
	height: 100%;
}

.userSettingGrp {
	z-index: 9999;
}

.userSetting {
	display: block;
	position: absolute;
	top: 44px;
	right: 0;
	background: #fff;
	padding: 0.5em;
	z-index: 1000;
	width: 200px;
}
</style>
