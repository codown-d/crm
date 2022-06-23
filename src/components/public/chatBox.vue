<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lone
 * @Date: 2022-03-08 21:36:28
 * @LastEditors: Lone
 * @LastEditTime: 2022-03-13 22:42:34
-->
<template>
	<a-spin :spinning="isLineBoxLoading">
		<div class="line-box flex-center">
			<template v-if="currentContactmessages.length" class="flex-column">
				<div class="gray-text flex-center line-box-tips">
					點擊更新最新的聊天訊息。
					<a @click="getContactmessages(channelUserId)">
						{{ isLineBoxLoading ? '數據更新中' : '更新聊天訊息' }}
					</a>
				</div>

				<div class="chat-box-content flex-1 border-bottom" ref="line-chat-box">
					<div v-for="(message, index) in currentContactmessages" :key="index" class="message-line mgnTop1">
						<div :class="{ 'message-line--content': true, 'message-flex-right': message.isSend }">
							<!-- //接收的消息 -->
							<div v-if="!message.isSend" class="userImgGrp">
								<!-- <a-avatar
									v-if="currentContact.pictureUrl"
									:src="currentContact.pictureUrl"
									class="chatBox-avator flex-center"
								/>
								<a-avatar v-else class="chatBox-avator flex-center">
									{{ currentContact.displayName[0] }}
								</a-avatar> -->
								<a-avatar class="chatBox-avator flex-center">{{ detailName[0] }}</a-avatar>
							</div>
							<div v-if="!message.isSend" class="marginLft-5">
								<div
									:class="{
										'msgCard padding-10 word-break': true,
										sendCard: false,
										receiveCard: true,
									}"
								>
									<div v-if="message.messageType == 'text'">
										{{ message.messageTextContent.text }}
										<!-- {{ messageTextContent.messages[0].text }} -->
									</div>
									<div v-else>【其他類型消息開發中】</div>

									<div class="message-line--status gray-text" style="left: 0">
										{{ message.messageSendTime }}
									</div>
								</div>
							</div>

							<!-- //我發送的消息 -->
							<div v-if="message.isSend" class="marginRgt-5">
								<div
									:class="{
										'msgCard msgCard--sender padding-10 word-break flex-right': true,
										sendCard: true,
										receiveCard: false,
									}"
								>
									<div v-if="message.messageType == 'text'">
										<!-- {{ message.messageTextContent.text }} -->
										<!-- {{ messageTextContent.messages[0].text }} -->
										{{
											message.messageTextContent.messages &&
											message.messageTextContent.messages.length
												? message.messageTextContent.messages[0].text
												: message.messageTextContent.text
										}}
									</div>
									<div v-else>【其他類型消息開發中】</div>

									<div class="flex-right message-line--status gray-text" style="right: 0">
										{{ message.messageSendTime }}
									</div>
								</div>
							</div>
							<div v-if="message.isSend" class="userImgGrp">
								<a-avatar class="chatBox-avator flex-center">{{ syncChannelName[0] }}</a-avatar>
							</div>
						</div>
					</div>
				</div>
			</template>

			<template v-else class="chat-box-content grey-text flex-center">未查詢到該客戶的Line聊天記錄</template>
		</div>
	</a-spin>
</template>

<script>
import debounce from 'lodash/debounce'
export default {
	props: {
		channelUserId: {
			type: String,
			default: '',
		},
		detailName: {
			type: String,
			default: '佔位名',
		},
	},
	data() {
		this.lastFetchId = 0
		this.getContactmessages = debounce(this.getContactmessages, 800)
		return {
			currentContactmessages: [],
			isLineBoxLoading: false,
		}
	},
	computed: {
		// isLineSyncing() {
		// 	return this.$store.state.sns.isLineSyncing
		// },
		// userInfo() {
		// 	let userInfo = this.$store.state.user.userInfo
		// 	// this.$util.console(userInfo, 'Header列印的使用者資訊')
		// 	return userInfo
		// },
		syncChannelName() {
			let syncChannel = this.$store.state.sns.syncChannel
			return syncChannel ? syncChannel.channelName : this.$store.state.user.userInfo.userName
		},
	},
	watch: {
		channelUserId: {
			immediate: true,
			deep: true,
			handler(newValue, oldValue) {
				if (newValue != oldValue && newValue.length) {
					// console.log(object);
					this.getContactmessages(newValue)
				}
			},
		},
	},
	mounted() {},
	activated() {
		if (this.currentContactmessages.length) this.scrollToBottom()
	},
	methods: {
		getContactmessages(id) {
			this.lastFetchId += 1
			const fetchId = this.lastFetchId
			// this.data = []

			this.isLineBoxLoading = true
			this.$api.sns.getLineMessageListByUserId(id).then(res => {
				if (fetchId !== this.lastFetchId) {
					// for fetch callback order
					return
				}
				// console.log('獲取到的聊天記錄列表', res);
				this.isLineBoxLoading = false

				if (res.code != 0 && !res.success)
					return this.$message.error(res.message || res.msg || '獲取line聊天數據失敗！')
				if (res.code == 1) return this.$message.error(res.message || res.msg || '獲取line聊天數據失敗！')
				this.currentContactmessages = res.data.reverse()
				//處理消息: 文本類型的消息，處理成展示可展示的
				if (this.currentContactmessages.length) {
					this.currentContactmessages.forEach(item => {
						if (item.messageType == 'text') {
							if (typeof item.messageTextContent == 'string')
								item.messageTextContent = JSON.parse(item.messageTextContent)
							if (item.messageTextContent == null)
								item.messageTextContent.text = '【複雜的文本消息，待完善】'
						}
						item.messageSendTime = this.$moment(item.messageSendTime).format('MM/DD HH:mm')
						item.isSend = id == item.receiverId ? true : false
					})
				}
				this.scrollToBottom()
			})
		},
		scrollToBottom() {
			setTimeout(() => {
				this.$nextTick(() => {
					if (this.$refs['line-chat-box']) {
						let scrollTop = this.$refs['line-chat-box'].scrollTop
						let scrollHeight = this.$refs['line-chat-box'].scrollHeight
						// console.log('scrollTop', scrollTop);
						// console.log('scrollHeight', scrollHeight);
						if (scrollHeight > 0 && scrollTop < scrollHeight)
							this.$refs['line-chat-box'].scrollTop = this.$refs['line-chat-box'].scrollHeight
					}
				})
			}, 200)
		},
	},
}
</script>

<style lang="less" scoped>
.line-box {
	height: 300px;
}

.line-box-tips {
	padding: 5px;
	a {
		color: #ff4d4f;
	}
}

.chat-box-content {
	overflow-y: scroll;
	overflow-x: hidden;
	height: 270px;
	min-height: 270px;
	padding: 0 0 35px 0;
}

.chat-box-content .chat-box__footer {
	height: 160px;
	width: 100%;
	&--menubar {
		padding: 5px 10px;
	}
}

.contact-card {
	min-height: 60px;
	align-items: center;
}

/* //聊天卡片顏色 */
.chat-box-content .msgCard {
	background: #dae7f7;
	// color: #000;

	// background: #4892DD;
	// color: #fff;

	// background: #DAE7F7;
	// color: #000;

	border: 1px solid #e5e5e5;
	border-radius: 5px;
	position: relative;
	margin: 3px 0;
	max-width: 360px;
	margin-top: 15px;
	letter-spacing: 1px;
}

.chat-box-content .msgCard::before {
	background-color: #dae7f7;
	// background-color: #4892DD;
	// background-color: #4892DD;
}

.chat-box-content .msgCard--sender {
	// background: #BEDFFD;
	// background: #F2F2F2;
	background: #f5f5f5;
	// color: #000;
}

.chat-box-content .msgCard--sender::before {
	// background-color: #BEDFFD;
	// background-color: #F2F2F2;
	background-color: #f5f5f5;
}

.receiveCard::before {
	content: '';
	position: absolute;
	left: -7px;
	top: 13px;
	width: 12px;
	height: 12px;
	background-color: #fff;
	border-left: 1px solid #e5e5e5;
	border-bottom: 1px solid #e5e5e5;
	transform: rotate(45deg);
}

.sendCard::before {
	content: '';
	position: absolute;
	right: -7px;
	top: 13px;
	width: 12px;
	height: 12px;
	background-color: #fff;
	border-right: 1px solid #e5e5e5;
	border-bottom: 1px solid #e5e5e5;
	transform: rotate(-45deg);
}

.chat-box-content .message-snippet {
	max-width: 100px;
}

.chat-box-content .message-line--content {
	display: flex;
}

.chat-box-content .message-line {
	margin-top: 15px;
}

.chat-box-content .message-line--status {
	height: 25px;
	line-height: 20px;
	position: absolute;
	// left: 5px;
	bottom: -30px;
	min-width: 80px;
	// opacity: .5;
	// color: #000;
}

.chat-box-content .message-flex-right {
	display: flex;
	justify-content: flex-end;
}

/* .chat-box-content .sendUser{
    background: #21c17a;
    color: #fff;
}

.chat-box-content .sendUser::before{
  background-color: #f6f5f5;
}

.chat-box-content .receiveUser{
    background: #f6f5f5;
    color: #000;
}

.chat-box-content .receiveUser::before{
  background-color: #21c17a;
} */

.chat-box,
.chat-box-list {
	display: flex;
	flex-direction: column;
	list-style-type: none;
}

.chat-box-list {
	padding: 10px;
	span {
		padding: 8px;
		color: white;
		border-radius: 4px;
	}
	.server {
		span {
			background: green;
		}
		p {
			float: left;
		}
	}
	.client {
		span {
			background: blue;
		}
		p {
			float: right;
		}
	}
}
.chat-box {
	margin: 10px;
	border: 1px solid #000;
	width: 50vw;
	border-radius: 4px;
	margin-left: auto;
	margin-right: auto;
}
.chat-inputs {
	display: flex;
	input {
		line-height: 3;
	}
}

.mgnTop1 {
	margin-top: 1em;
}

.msgTalkGrp {
	padding: 1em;
	// border: 1px solid #eee;
}

.msgTalkGrp .plainGrp {
	margin-left: 20px;
}

.plainGrp {
	border: 1px solid #e5e5e5;
	border-radius: 5px;
	position: relative;
	margin: 3px 0;
}
.plainGrpDetail {
	border: 1px solid #e5e5e5;
	background: #fffcdc;
	padding: 0.5em;
}
.plainGrp::before {
	content: '';
	position: absolute;
	left: -7px;
	top: 13px;
	width: 12px;
	height: 12px;
	background-color: #fff;
	border-left: 1px solid #e5e5e5;
	border-bottom: 1px solid #e5e5e5;
	transform: rotate(45deg);
}
.plainGrp.talkAdmin::before {
	background-color: #eef1f2;
}

.plainGrp.talkUser::before {
	background-color: #21c17a;
}

.userImgGrp {
	display: block;
	border-radius: 30px;
	border: 1px solid #eee;
	width: 50px;
	height: 50px;
	overflow: hidden;
	margin: 10px;
}

.userImgGrp img {
	width: 80px;
	margin-left: -10px;
	margin-top: -5px;
}

.userImgGrp img.talkImg {
	width: 60px;
	margin-left: -5px;
	margin-top: -5px;
}

.userImgGrp .chatBox-avator {
	/* width: 50px; */
	/* height: 50px; */
	width: 100%;
	height: 100%;
}

.bgOrg {
	background: #f97358;
	color: #fff;
}
.icon1 {
	padding: 0 0.2em;
}
.talkAdmin {
	background: #eef1f2;
}

.talkUser {
	background: #21c17a;
	color: #fff;
}
</style>
