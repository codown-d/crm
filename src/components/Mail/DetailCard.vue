<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lone
 * @Date: 2021-09-22 19:55:39
 * @LastEditors: Lone
 * @LastEditTime: 2022-05-04 17:15:49
-->
<template>
	<div class="flex-1 flex-column">
		<a-spin :spinning="isDetailLoading">
			<div class="detailEmail-subject flex-between bg--white padding-15">
				<div class="title font-18 flex-1">
					{{ mailData.subject }}
				</div>
				<!-- <div class="font-14">郵件權限設組件佔位</div> -->
				<!-- //todo: 郵件權限設置封裝組件; -->
			</div>

			<div class="detailEmail-body flex-column marginTop-15">
				<div class="flex-between">
					<div class="flex">
						<!-- fix: 郵箱正文的avator -->
						<a-avatar class="marginRgt-8">USER</a-avatar>
						<div class="flex-column">
							<div class="font-14">
								{{ mailData.from }}
							</div>
							<div class="font-6 gray-text flex text-overflow">
								<div class="marginRgt-15">至：{{ mailData.to }}</div>
								<div class="marginRgt-15" v-if="mailData.cc">Cc: {{ mailData.cc }}</div>
								<div v-if="mailData.bcc">Bcc: {{ mailData.bcc }}</div>
							</div>
						</div>
					</div>

					<div class="flex">
						<div class="marginRgt-15">
							<div v-if="mailData.receiveDate">
								{{ mailData.receiveDate | filterTime(mailData.receiveDate) }}
							</div>
							<div v-else-if="mailData.sentDate">
								{{ mailData.sentDate | filterTime(mailData.sentDate) }}
							</div>
							<div v-else-if="mailData.createTime">
								{{ mailData.createTime | filterTime(mailData.createTime) }}
							</div>
						</div>
						<!-- <a-dropdown placement="bottomRight">
							<a-menu slot="overlay">
								<a-menu-item key="1" class="flex-column" @click="sendReply('reply')">回復</a-menu-item>
								<a-menu-item key="1" class="flex-column" @click="sendReply('reply')">转寄</a-menu-item>
								<a-menu-item key="2" @click="onDeleteMail">刪除</a-menu-item>
							</a-menu>
							<myButton v-if="mailData.attachList && mailData.attachList.length" class="marginRgt-15" icon="paper-clip" :text="mailData.attachList.length" />
						</a-dropdown> -->
						<a-dropdown placement="bottomRight">
							<a-menu slot="overlay">
								<a-menu-item key="1" class="flex-column" @click="sendReply('reply')">回復</a-menu-item>
								<a-menu-item key="1" class="flex-column" @click="sendReply('reply')">轉寄</a-menu-item>
								<a-menu-item key="2" @click="onDeleteMail">刪除</a-menu-item>
							</a-menu>
							<myButton icon="caret-down" :isIconBtn="true" />
						</a-dropdown>
					</div>
				</div>

				<!-- //fix：根據不同的編碼方式顯示居中或居左對齊。 -->
				<div class="body font-14 marginTop-15 flex-column">
					<div v-if="mailData.content" class="detailEmail-content" v-html="mailData.content"></div>
					<!-- //todo: 当如果邮件附件超过一定数量，展示的样式的优化。 -->
					<div v-if="mailData.attachList && mailData.attachList.length" class="detailEmail-content-file flex">
						<template v-for="(file, fileIndex) in mailData.attachList">
							<a class="content-file-item flex" :href="fileUrl + file.id" :title="file.fileName">
								<a-icon type="paper-clip" class="file-item-icon marginRgt-8" />
								<div class="file-item-info flex-column">
									<div>{{ file.fileName }}</div>
									<div>{{ filterSize(file.fileSize) }}</div>
								</div>
							</a>
						</template>
					</div>
				</div>
			</div>

			<div v-if="!isReplyShow" class="detailEmail-subject marginTop-15 flex">
				<!-- //fix: 根據郵件包含的人員數量確定： 回復、回復所有人 -->
				<a-avatar size="small" class="marginRgt-5">USER</a-avatar>
				<myButton text="回復" :isLink="true" @click="sendReply('reply')" />
				或
				<myButton text="轉寄" :isLink="true" @click="sendReply('forward')" />
			</div>

			<composeMail
				v-if="isReplyShow"
				class="marginTop-15"
				:isReply="isReplyShow"
				:mailData="mailData"
				ref="composeMail"
				@close="isReplyShow = !isReplyShow"
			/>
		</a-spin>
	</div>
</template>

<script>
/* eslint-disable */
import moment from 'moment'

import composeMail from './ComposeCard'
import contactCard from './ContactCard'
import myButton from '@/components/Common/myButton'

import { API_HOST } from '../../config'

export default {
	name: 'Detail',
	components: {
		composeMail,
		contactCard,
		myButton,
	},
	props: {
		mailId: {
			type: Number | String,
			default: 0,
		},
		mail: {
			type: Object,
			default: () => {},
		},
		isReply: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			// mailData: '',
			mailData: {
				from: '',
				subject: '',
				to: '',
				content: '',
				attachList: [],
			},
			isReplyShow: false,
			mailItem: {
				from: '',
			},
			mailDataItem: {},
			mailTitle: '',
			isDetailLoading: false,
			// mailContactData: [],

			fileUrl: API_HOST.PROD + 'api/filestorage/file/download/',
		}
	},
	activated() {
		// console.log('detail显示就会执行');
	},
	// mounted() {
	// },
	watch: {
		mail: {
			// immediate: true,
			deep: true,
			handler(newValue, oldValue) {
				// console.log(newValue == {}, '是否需要请求');
				if (newValue == {}) {
					// console.log("在邮件详情卡片组件，请求邮件正文数据");
					this.getMessageDetail(this.mailId)
				} else {
					this.mailData = newValue
				}
				this.isReplyShow = this.isReply

				// 在邮件详情卡片组件，请求邮件正文数据。
				// console.log("在邮件详情卡片组件，请求邮件正文数据");
				// if (newValue != oldValue) this.getMessageDetail(newValue);
			},
		},
	},
	methods: {
		getMessageDetail(id) {
			this.isDetailLoading = true
			this.$api.mail.getMessageDetail({ messageId: id }).then(resp => {
				this.isDetailLoading = false
				if (resp.code != 0) return this.$message.error('請求郵件數據失敗!')
				// 赋值邮件详情数据给mailData
				if (resp.data == null) return this.$router.push('/mail/inbox')
				this.mailData = resp.data
				// 查询邮件关联的联系人信息
				if (this.mailData.flags == 'false') this.updateMessageStatus(this.mailData.id, true)
			})
		},
		sendReply(type) {
			if (type == 'forward') return this.$message.warning('功能完善中')
			this.isReplyShow = true
		},
		onDeleteMail() {
			// console.log(this.selectedMail);
			let that = this
			this.$confirm({
				title: '刪除提示',
				content: '確認刪除這封郵件嗎?',
				okText: '確認刪除',
				cancelText: '取消',
				onOk() {
					that.deleteMails(that.mailData.id)
				},
				onCancel() {
					//console.log('Cancel');
				},
			})
		},
		async deleteMails(id) {
			let result = await this.deleteMail(id)
			if (!result) return this.$message.error('刪除郵件成功', 2)
			// console.log('promise all', result);
			this.$message.success('刪除郵件成功')
			this.goBack()
			this.$forceUpdate()
		},
		deleteMail(id) {
			let params = {
				param: {
					messageId: id,
				},
			}
			return new Promise((resolve, reject) => {
				this.$api.mail
					.deleteMessage(params)
					.then(res => {
						resolve(res.success)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		filterSize(size) {
			return this.$util.getSizeText(size)
		},
	},
	filters: {
		filterTime(time) {
			let today = moment()
			let isToday = moment(time).isSame(today, 'day')
			// let timeText = moment().diff(moment(time),'days');
			return isToday ? moment(time).format('HH:mm') : moment(time).format('YYYY/MM/DD')
		},
	},
}
</script>
<style lang="less">
.detailEmail {
	width: 100%;
}

.detailEmail-content {
	/* display: flex; */
	white-space: pre-line;

	& img {
		width: auto;
		height: auto;
		max-width: 100%;
		max-height: 100%;
	}
}

.detailEmail-content-file {
	margin-top: 30px;
	margin-bottom: 20px;
	width: 100%;
	flex: 1;
	display: flex;
	flex-wrap: wrap;
	// width
	// background: red;
	.content-file-item {
		width: calc(33% - 8px);
		text-decoration: none;
		// height: 56px;
		padding: 10px 0;
		margin: 8px 8px 0 0;
		border: 1px solid #e5e5e5;
		border-radius: 4px;
		background-color: #f7f7f7;
		cursor: pointer;

		&:hover {
			border-color: #b9babb;
		}

		.file-item-icon {
			font-size: 24px;
			margin-left: 8px;
		}

		.file-item-info {
			color: #26292c;
		}
	}
}

.detailEmail .detailEmail-subject {
	background: #ffffff !important;
	min-height: 50px;
	padding: 15px;
	/* line-height: 50px; */
	border-radius: 6px;
	/* max-width:  */
	/* border: 1px solid #e5e5e5; */
}

.detailEmail .detailEmail-subject .title {
	max-width: 70%;
	/* background: red; */
	text-overflow: ellipsis;
	word-wrap: break-word;
}

.detailEmail .detailEmail-body {
	padding: 15px;
	background: #fff !important;
	border-radius: 6px;
}

.detailEmail .detailEmail-body .body {
	min-height: 100px !important;
	padding-left: 40px !important;
}
</style>
