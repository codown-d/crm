<!--
 * @Descripttion: //info: 寫郵件組件，功能只是寫郵件。 
 * @version: 
 * @Author: Lone
 * @Date: 2021-10-17 18:51:15
 * @LastEditors: Lone
 * @LastEditTime: 2022-04-26 13:59:01
-->
<template>
	<div class="editEmail-card flex-column padding-20">
		<!-- 收件人 -->
		<div class="card-line flex">
			<span class="composeCard-head-title">收件人：</span>
			<div class="input-area">
				<!-- <a-input type="text" placeholder="zzd@gmail.com" v-model="composeData.headers.To" /> -->
				<!-- fix://值的绑定 -->
				<!-- //輸入很多收件人時候 樣式的處理 -->
				<!-- todo: placeholder的字体颜色应与ant-input保持一致 -->
				<vue-tags-input v-model="tag" :tags="tags" :placeholder="tags.length ? '' : 'example@mysales.com'"
					@tags-changed="onTagsChange" ref="tagInput" />
			</div>

			<div @click="isCCshow = !isCCshow">
				<a-tooltip placement="top" :title="`${ isCCshow ? '隱藏' : '顯示' }細節`">
					<ExpandIcon v-if="!isCCshow" style="font-size: 16px;" />
					<UnExpandIcon v-else style="font-size: 16px;" />
				</a-tooltip>
			</div>
		</div>

		<!-- CC部分，預設隱藏 -->
		<template v-if="isCCshow">
			<div class="card-line flex">
				<span class="composeCard-head-title">cc：</span>
				<div class="input-area">
					<a-input type="text" placeholder="example@mysales.com" v-model="composeData.headers.cc" />
				</div>
			</div>
			<div class="card-line flex">
				<span class="composeCard-head-title">Bcc：</span>
				<div class="input-area">
					<a-input type="text" placeholder="example@mysales.com" v-model="composeData.headers.bcc" />
				</div>
			</div>
		</template>

		<!-- 主題 -->
		<div class="card-line flex">
			<span class="composeCard-head-title">主&nbsp&nbsp&nbsp&nbsp題：</span>
			<div class="input-area">
				<a-input type="text" placeholder="請輸入郵件主題" v-model="composeData.headers.Subject" />
			</div>
		</div>

		<!-- <div class="card-line"></div> -->
		<div v-if="!isMailSyncing && currentSyncMail && currentSyncMail.user" class="warning-line flex-center">
			電子郵件賬號{{ currentSyncMail.user }}已中斷連接。
			<!-- <a>重新連接</a>或 -->
			<a @click="gotoMailSetting">前往郵件設定</a>
			。
			<!-- //todo: 重新連接 、開啟設定的實現。 -->
		</div>

		<div class="mail-textarea border-bottom">
			<!-- <div class="card-line-right" style="z-index: 2">
                <div>富文本元件欄（占位元）</div>
                <div class="text-btn-box flex gray-text">
                    不同狀態的完善、灰色和黑色狀態
                    <div class="text-btn">
                        提議時間<a-icon type="caret-down" />
                    </div>
                    <div class="text-btn modelCard">
                        <a @click="isModelCardShow = !isModelCardShow"
                            >選擇範本<a-icon type="caret-down" />
                        </a>
                        <div
                            v-if="isModelCardShow"
                            class="model-btn--modal flex-column"
                        >
                            <ModelCard @onModelCardShow="onModelCardShow" />
                        </div>
                    </div>

                    <div class="text-btn">欄位<a-icon type="caret-down" /></div>
                    <div class="text-btn">署名</div>
                </div>
            </div> -->

			<!-- //富文本元件欄 // fixit: 富文本placeholder -->
			<!-- fixit: 游標問題，游標應該設置到文本的開始。 -->

			<!-- 富文本 -->
			<!-- <vue-html5-editor :content="composeData.Message" :height="500"></vue-html5-editor> -->
			<vue-editor v-model="composeData.Message"></vue-editor>
			<!-- <vue-html-editor name="vue-html-editor" :model.sync="composeData.Message"></vue-html-editor> -->
			<!-- <vue-html-editor :model="composeData.Message"></vue-html-editor> -->
			

			<!-- <tinymce v-if="isTinyMceShow" v-model="composeData.Message" :height="240" ref="mailContent" @focus="onFocus"
				:key="tinymceFlag" placeholder="点击输入电子邮件内容" />
			<a-textarea v-else placeholder="请输入电子邮件内容" :rows="4" v-model="composeData.Message" /> -->

			<!-- <textarea v-else v-model="composeData.Message" placeholder="点击输入电子邮件内容"></textarea> -->

			<!-- 附件展示區域 -->
			<div v-if="selectedFile.length" class="file-area flex-column">
				<div v-for="(file, fileIndex) in selectedFile" :key="fileIndex" class="file-item padding-10">
					<div class="flex-between">
						<div class="flex">
							<a-icon type="paper-clip" class="marginRgt-8" />
							<span :class="{ 'file-name__done' : file.status == 'done', 'file-name text-overflow': true }"
								@click="onClickFile(file)">
								{{ file.name }}
							</span>
						</div>
						<div class="flex">

							<template v-if="file.status == 'done'">
								<span class="marginRgt-8">{{ sizeText(file.size) }}</span>
								<span class="marginRgt-8 success-color">附件已上傳</span>
								<a-icon type="check" class="success-color" />
								<a-tooltip placement="top" title="移除此附件">
									<a-popconfirm placement="left" ok-text="確認" cancel-text="取消" @confirm="handleFileRemove(file)"
										title="附件已上傳成功，確認移除嗎？">
										<a-icon type="delete" :class="{ 'marginLft-10': true, 'disable': file.status == 'uploading' }" />
									</a-popconfirm>
								</a-tooltip>
							</template>

							<template v-else-if="file.size == 0 || file.status == 'error' || file.status == 'upload_error'">
								<span v-if="file.size == 0" class="marginRgt-8 fail-color">無法上傳空文件</span>
								<span v-if="file.status == 'upload_error'" class="marginRgt-8 fail-color">上傳失敗</span>
								<a-icon type="close" class="fail-color" />
							</template>

							<a-icon v-if="file.status == 'info'" type="info-circle" />
							<a-icon v-else-if="file.status == 'uploading'" type="loading" />

							<a-tooltip v-if="file.status != 'done'" placement="top" title="移除此附件">
								<a-icon type="delete" :class="{ 'marginLft-10': true, 'disable': file.status == 'uploading' }"
									@click="handleFileRemove(file)" />
							</a-tooltip>

						</div>
					</div>

				</div>

			</div>

			<div v-if="selectedFile.length > 5" class="fail-color flex-right maxCount-tips">
				<a-icon type="info-circle" class="marginRgt-8" />附件數量超出限制，最多可上傳5項附件。
			</div>

		</div>

		<!-- 底部按鈕欄位 -->
		<div class="card-btnline flex-between">
			<div class="flex flex-1">
				<a-upload
                    :multiple="true"
                    :file-list="selectedFile"
                    :showUploadList="false"
                    :customRequest="onUploadFile"
                    :disabled="selectedFile.length > 4 || !isMailSyncing"
                    :beforeUpload="beforeUpload"
                    :remove="handleFileRemove "
                    @change="handleFileChange"
                >
                    <a-tooltip placement="top">
                        <template slot="title">
                            <!-- <div v-if="!selectedFile.length">添加附件到電子郵件</div> -->
                            <div v-if="!isMailSyncing">電子郵件已中斷連接</div>
                            <div v-else-if="isMailSyncing && selectedFile.length < 5">可選擇{{ 5 - selectedFile.length }}項附件</div>
                            <div v-else-if="isMailSyncing && selectedFile.length == 5">最多選擇5項附件</div>
                        </template>
                        <div class="icon-group flex-center padding-lr-15" 
                            :style="{ minWidth: '60px', cursor: selectedFile.length > 4 || !isMailSyncing ? 'not-allowed' : 'pointer' }" >
                            <a-icon type="paper-clip" />附件 {{ selectedFile.length ? `${ selectedFile.length }/5` : '' }}
                        </div>
                    </a-tooltip>
                </a-upload>

				<a-tooltip placement="top">
					<template slot="title">{{ isWatchMailOpen ? '不要' : '' }}追蹤電子郵件開啟</template>
					<div class="icon-item flex-center" @click="isWatchMailOpen = !isWatchMailOpen">
						<a-icon :style="{ color: isWatchMailOpen ? '#F86F54' : '' }" type="eye" />
					</div>
				</a-tooltip>
				<!-- <a-tooltip placement="top">
                    <template slot="title"
                        >{{
                            isWatchLinkOpen ? "不要" : ""
                        }}追蹤連接是否開啟</template
                    >
                    <div class="icon-item flex-center">
                        <a-icon type="select" />
                    </div>
                </a-tooltip> -->
			</div>

			<div class="flex">
				<!-- <div>已儲存</div> -->
				<!-- <a-button class="mgnRight btnDef">已儲存</a-button> -->

				<myButton v-if="isReply" @click="onCloseCompose" text="取消" />

				<myButton v-if="excutePermission(mail.send)" class="flex marginRgt-10" theme="orange"
					:disabled="!isMailSyncing || composeData.isSendButtonDisabled || selectedFile.length > 5"
					:loading="composeData.isSendButtonDisabled" @click="sendEmail"
					:text="composeData.isSendButtonDisabled ? '發送中' : '發送'" />

			</div>
		</div>

		<!-- 附件超出顯示的操作彈出窗口 -->
		<a-modal :dialog-style="{ top: '0px' }" title="附件數量超出限制" :closable="false" :destroyOnClose="true"
			:visible="isFileModalShow" okText="確認" cancelText="暫不處理" width="500px">

			<div v-if="selectedFileDisplay.length > 5" class="fail-color flex maxCount-tips">
				<a-icon type="info-circle" class="marginRgt-8" />最多允許上傳5項附件，請刪除{{ selectedFileDisplay.length - 5 }}項。
			</div>

			<div v-else class="success-color flex maxCount-tips">
				<a-icon type="check" class="marginRgt-8" />附件數量已滿足。
			</div>

			<div v-if="selectedFileDisplay.length" class="file-area flex-column">
				<div v-for="(file, fileIndex) in selectedFileDisplay" :key="fileIndex" class="file-item padding-10">
					<div class="flex-between">
						<div class="flex">
							<a-icon type="paper-clip" class="marginRgt-8" />
							<span :class="{ 'file-name__done' : file.status == 'done', 'file-name text-overflow': true }"
								style="max-width: 200px;" @click="onClickFile(file)">
								{{ file.name }}
							</span>
						</div>
						<div class="flex">

							<template v-if="file.status == 'done'">
								<span class="marginRgt-8">{{ sizeText(file.size) }}</span>
								<span class="marginRgt-8 success-color">附件已上傳</span>
								<a-icon type="check" class="success-color" />
								<a-tooltip placement="top" title="移除此附件">
									<a-popconfirm placement="left" ok-text="確認" cancel-text="取消" @confirm="handleDisplayFileRemove(file)"
										title="附件已上傳成功，確認移除嗎？">
										<a-icon type="delete" :class="{ 'marginLft-10': true, 'disable': file.status == 'uploading' }" />
									</a-popconfirm>
								</a-tooltip>
							</template>

							<template v-else-if="file.size == 0 || file.status == 'error' || file.status == 'upload_error'">
								<span v-if="file.size == 0" class="marginRgt-8 fail-color">無法上傳空文件</span>
								<span v-if="file.status == 'upload_error'" class="marginRgt-8 fail-color">上傳失敗</span>
								<a-icon type="close" class="fail-color" />
							</template>

							<a-icon v-if="file.status == 'info'" type="info-circle" />
							<a-icon v-else-if="file.status == 'uploading'" type="loading" />

							<a-tooltip v-if="file.status != 'done'" placement="top" title="移除此附件">
								<a-icon type="delete" :class="{ 'marginLft-10': true, 'disable': file.status == 'uploading' }"
									@click="handleDisplayFileRemove(file)" />
							</a-tooltip>

						</div>
					</div>
				</div>

			</div>

			<div v-else class="file-area flex-center" style="min-height: 39px;">
				無附件
			</div>

			<div slot="footer" class="my-ant-modal-footer flex-right">
				<myButton @click="isFileModalShow = false" text="暫不處理" class="marginRgt-10" />
				<myButton theme="orange" @click="onConfirmDeleteDisplayFile" text="確認" />
			</div>
		</a-modal>
	</div>
</template>

<script>
	import { API_HOST } from '../../config'
	/* eslint-disable */
	import VueTagsInput from '@johmun/vue-tags-input'
	import ModelCard from '@/components/Mail/ModelCard.vue'
	import myButton from "@/components/Common/myButton";
	// import RichEditor from './RichEditor';

	import { VueEditor } from "vue2-editor";
	// const VueHtmlEditor = require("vue-html-editor").default;
	

	import { mapGetters } from 'vuex';
	const ExpandSvg = {
		template: `
    <svg t="1648275276174" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5454" width="200" height="200"><path d="M454.464 143.68l-253.44 253.44c-12.032 12.032-12.032 31.36 0 43.392 11.968 11.968 31.36 11.968 43.328 0l237.376-237.376 237.376 237.376c11.968 11.968 31.36 11.968 43.328 0 12.032-12.032 12.032-31.36 0-43.392l-253.44-253.44C491.264 126.016 478.016 124.032 454.464 143.68zM507.968 947.648l252.48-253.376c11.968-11.968 11.968-31.36 0-43.392-11.968-11.968-31.296-11.968-43.264 0l-236.48 237.376L244.16 650.88c-11.968-11.968-31.296-11.968-43.264 0-11.968 12.032-11.968 31.424 0 43.392l252.48 253.376C465.984 960 491.136 964.48 507.968 947.648z" p-id="5455"></path></svg>
  `,
	}

	const ExpandIcon = {
		template: `
    <a-icon :component="ExpandSvg" />
  `,
		data() {
			return {
				ExpandSvg,
			}
		},
	}

	const UnExpandSvg = {
		template: `
   <svg t="1648276305035" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5589" width="200" height="200" ><path d="M536.832 401.344C535.552 403.648 534.4 406.016 532.48 408 526.208 414.272 517.952 416.832 509.696 416.512 501.504 416.832 493.248 414.272 486.976 408 485.056 406.016 483.904 403.648 482.56 401.344L230.016 147.84C218.048 135.872 218.048 116.48 230.016 104.512 241.92 92.544 261.312 92.544 273.216 104.512L509.696 341.824 746.24 104.512C758.144 92.544 777.536 92.544 789.44 104.512 801.408 116.48 801.408 135.872 789.44 147.84L536.832 401.344ZM483.52 621.248C484.864 618.944 485.952 616.576 487.936 614.592 494.208 608.32 502.464 605.76 510.72 606.08 518.976 605.76 527.232 608.32 533.504 614.592 535.488 616.576 536.576 618.944 537.92 621.248L791.424 874.752C803.392 886.72 803.392 906.112 791.424 918.08 779.456 930.048 760.064 930.048 748.096 918.08L510.72 680.768 273.344 918.08C261.376 930.048 241.984 930.048 230.016 918.08 218.048 906.112 218.048 886.72 230.016 874.752L483.52 621.248Z" p-id="5590"></path></svg>
  `,
	}

	const UnExpandIcon = {
		template: `
    <a-icon :component="UnExpandSvg" />
  `,
		data() {
			return {
				UnExpandSvg,
			}
		},
	}

	export default {
		components: { 
			VueTagsInput, 
			ModelCard, 
			ExpandIcon, 
			UnExpandIcon, 
			myButton,
			VueEditor,
			// "vue-html-editor": require("vue-html-editor")
		},
		name: 'Edit',
		props: {
			// msg: String,
			mailData: Object,
			isReply: Boolean,
			isForward: Boolean,
		},
		data() {
			return {
				composeData: {
					headers: {
						To: '',
						Subject: '',
						cc: '',
						bcc: '',
					},
					// Message: '測試繁體字台灣台灣台灣大灣區香港、、、、、測試簡體字中文簡體中文、、、、12333333、 my name',
					Message: '',
					isSendButtonDisabled: false, //發送按鈕的loading狀態
					content: '',
					// isSendButtonLoading: false
				},
				isWatchMailOpen: false,
				isWatchLinkOpen: false,
				tag: '',
				//   tags: ['4025897@163.com','3042309580@qq.com','1243631258@qq.com','wintsenf@yahoo.com'],
				//   tags: ['4025897@163.com'],
				tags: [],

				isCCshow: false,
				content: '',
				isModelCardShow: false,
				// modelList: ['測試一','測試二','測試三','測試四','測試四','測試四','測試四','測試四','測試四'],
				modelShow: false,
				modelManageShow: false,
				indeterminate: true,
				checkAll: false,
				selectModel: [],
				currentModelId: '',
				modelTitle: '新增範本',
				editModel: {
					title: '',
					type: 1,
					subject: '',
					content: '',
				},
				tinymceFlag: 1, //是防止元件緩存導致編輯器不能正常使用，每次切換來都更改key,使其重新渲染
				// currentSyncMail: {}
				isTinyMceShow: false,

				selectedFile: [],
				selectedFileDisplay: [],
				uploadedFile: [],

				isFileModalShow: false,
				fileUrl: API_HOST.PROD + 'api/filestorage/file/download/'
			}
		},
		computed: {
			...mapGetters([
				'permissions',
				'mail'
			]),
			modelList() {
				// console.log(this.$store.state.mail.modelData);
				return this.$store.state.mail.modelData
			},
			isMailSyncing() {
				//計算當前賬戶是否有郵件為同步狀態
				let result = this.$store.state.mail.isMailSyncing
				// if (result) this.currentSyncMail = this.$store.state.mail.currentSyncMail;
				return result
			},
			currentSyncMail() {
				return this.$store.state.mail.currentSyncMail
			},
		},
		watch: {
			mailData: {
				immediate: true,
				deep: true,
				handler(newValue, oldValue) {
					// console.log('編寫郵件組件的newValue=============', newValue)
					if (this.isReply || this.isForward) {
						let from = newValue.from
						let isSpMailFrom = from.indexOf('<') > -1 && from.indexOf('>') > -1 // 判斷from有沒有 <>
						this.composeData.Message = `<br>${newValue.sentDate} ${newValue.from}写道：<br><br>${newValue.content}`
						this.tags = [
							{
								text: isSpMailFrom ? from.substring(from.indexOf('<') + 1, from.length - 1) : from,
								tiClasses: ['ti-valid'],
							},
						]
						//fixit: 如果是一封郵件被多次轉發或回復，有多個郵寄地址是，如何處理？？？
						this.composeData.headers.Subject = 'Re:' + newValue.subject
					} else {
						if (newValue && newValue.to) {
							this.tags = [
								{
									text: newValue.to,
									tiClasses: ['ti-valid'],
								},
							]
						} else {
							this.tags = []
						}
					}
					this.initTinyMce()
				},
			},
			'selectedFile.length': {
				handler: function (val) {
					if (val > 5) {
						this.selectedFileDisplay = this.$lodash.cloneDeep(this.selectedFile);
						this.isFileModalShow = true;
					}
				},
				immediate: true
			},
			'composeData.Message'(val) {
				console.log(val, 1111)
			}
		},
		activated() {
			this.initTinyMce()
			this.tags = []
			this.tinymceFlag++
		},
		methods: {
			excutePermission(key) {
				let flag = false;
				this.permissions.forEach(e => {
					e.permissionDetailVoList.forEach(ee => {
						if (ee.permissionCode === key) {
							flag = ee.rolePermissions;
						}
					});
				});
				// return flag;
				//zhang暂时放开
				return true
			},
			onTagsChange(newTags) {
				console.log('onTagsChange', newTags)
				this.tags = newTags
				this.$store.commit('mail/SET_COMPOSE_MAIL', newTags)
				// (newTags) => (tags = newTags)
			},
			onFocus(e) {
				console.log('输入框聚焦了', e)
			},
			gotoMailSetting() {
				this.$router.push('/settings/email-sync')
			},
			onCloseCompose() {
				if (this.isReply) this.$emit('close')
			},
			sendEmail() {

				// 如果有未上傳的附件
				if (this.selectedFile.length > this.uploadedFile.length) return this.$message.warning('附件列表有未處理的文件!');
				if (!this.tags.length) return this.$message.warning('请输入收件人地址');
				// note: 验证邮箱to是否输入正确
				let checkMailsInput = []
				this.tags.forEach(item => {
					let checkValidMail = this.$util.checkMail(item.text)
					checkMailsInput.push(checkValidMail.flag)
				})
				let checkMailsResult = checkMailsInput.some(item => !item)
				if (checkMailsResult) return this.$message.warning('請檢查輸入的郵寄地址!', 3)

				let { Subject } = { ...this.composeData.headers }
				let { Message } = { ...this.composeData }
				if (!Subject.length || !Message.length) return this.$message.warning('未完成輸入')

				this.tags.forEach((item, index) => {
					this.composeData.headers.To = item.text
					this.composeData.isSendButtonDisabled = true
					this.sendMessage(this.composeData.headers, this.composeData.Message, index == this.tags.length - 1)
				})

			},
			sendMessage(headers_obj, message, isLast) {

				var email = ''

				for (var header in headers_obj) {
					let item =
						header == 'To' ? headers_obj[header] : this.$MimeCodec.mimeWordEncode(headers_obj[header], 'Q')
					//邮件的subjext只支持us-ascii编码方式，使用其他文字，需要使用'=?utf-8?Q?quoted-printable编码后的subject?='的通用协议
					email += header += ': ' + item + '\r\n'
				}

				email += '\r\n' + message
				console.log('這是要發送的郵件的所有資訊:', headers_obj, message, this.uploadedFile, this.uploadedFile.map(i => { return i.fileId }))
				// fix：Invalid prop: custom validator check failed for prop "tags".   input-tag的行高自动撑开和 多个标签的bug
				// this.$api.mail.send()
				// let currentSyncMail = this.$store.state.mail.currentSyncMail;
				// return this.$util.console(this.$store.state.mail.currentSyncMail, '发送邮件前，本地的获取的绑定的邮箱账号');

				let params = {
					emailAccountId: this.currentSyncMail.id,
					attachIds: this.uploadedFile.map(i => { return i.fileId }),
					message: {
						from: this.currentSyncMail.user,
						to: headers_obj.To,
						subject: headers_obj.Subject,
						content: message,
					},
				}
				let { cc, bcc } = { ...headers_obj }
				if (cc.length) params.message.cc = cc
				if (bcc.length) params.message.bcc = bcc
				// return this.sendGmail(email);
				this.$api.mail.send(params).then(res => {
					console.log('調用發送郵件介面返回：', res)
					this.composeData.isSendButtonDisabled = false
					if (res.code != 0) return this.$message.error('發送失敗！')
					this.$message.success('發送成功！')
					if (isLast) this.$emit('onSuccess')
					this.composeTidy()
				})
			},
			composeTidy() {
				this.composeData.headers.To = ''
				this.composeData.headers.cc = ''
				this.composeData.headers.bcc = ''
				this.composeData.headers.Subject = ''
				this.composeData.Message = ''
				this.uploadedFile = []
				this.selectedFile = []
				// this.$forceUpdate();
				if (this.isTinyMceShow) this.$refs.mailContent.setContent(this.composeData.Message) // 情况tinymce的值
				// console.log(this.composeData);
				// this.composeData.isSendButtonDisabled = false;
				this.tags = []
			},
			/**
			 * @name:初始化富文本 功能
			 * @param {*}
			 * @return {*}
			 */
			initTinyMce() { },
			/**
			 * @name: 范本搜索回调函数
			 * @param {*}
			 * @return {*}
			 */
			onSearch() { },

			handleFileChange(info) {

				let fileList = [...info.fileList];

				fileList = fileList.map(file => {
					if (file.response) {
						file.url = file.response.url;
					}
					return file;
				});

				this.selectedFile = fileList;

			},
			async onUploadFile({ file }) {

				const formData = new FormData()
				formData.append('file', file)

				try {

					const res = await this.$api.common.upload(formData)
					let fileIndex = this.selectedFile.findIndex(i => i.uid == file.uid);
					let status = res.success ? 'done' : 'error';
					this.$set(this.selectedFile[fileIndex], 'status', status);

					if (res.success) {
						this.uploadedFile.push({
							uid: file.uid,
							...res.data
						})
					};

				} catch (error) {

					// console.log('上傳失敗!', error, this.selectedFile);
					let fileIndex = this.selectedFile.findIndex(i => i.uid == file.uid);
					let status = 'upload_error';
					this.$set(this.selectedFile[fileIndex], 'status', status);

				}

			},
			onConfirmDeleteDisplayFile() {
				if (this.selectedFileDisplay.length > 5) return this.$message.warning('附件數量超出限制！');
				this.selectedFile = this.$lodash.cloneDeep(this.selectedFileDisplay);
				this.uploadedFile = this.selectedFile.filter(i => i.status == 'done');
				this.isFileModalShow = false;

				if (this.selectedFile.length == 5 || this.selectedFile.length < 5) {
					this.handleUpload(this.selectedFile);
				}
			},
			handleDisplayFileRemove(file) {
				this.selectedFileDisplay = this.selectedFileDisplay.filter(i => i.uid != file.uid);
			},
			handleFileRemove(file) {
				if (file.status == 'uploading') return;

				this.selectedFile = this.selectedFile.filter(i => i.uid != file.uid);
				this.uploadedFile = this.uploadedFile.filter(i => i.uid != file.uid);

				if (this.selectedFile.length == 5) {
					this.handleUpload(this.selectedFile);
				}

			},
			handleUpload(selectedFile) {// 手動執行上傳文件
				selectedFile.forEach(fileItem => {
					if (fileItem.status == 'info') {
						fileItem.status = 'uploading';
						this.onUploadFile({ file: fileItem.originFileObj });
					}
				})
			},
			beforeUpload(file, UpFileList) {

				// 2、控制上传的文件大小
				if (file.size > 10 * 1024 * 1024) {
					this.$message.warning('附件大小超過最大限度10MB')
					file.status = 'error'
					return false
				}
				// 3、控制上传文件不能为空
				if (file.size === 0) {
					this.$message.warning('所選附件存在空檔，請重新選擇')
					file.status = 'error'
					return false
				}
				// 4、控制已上传文件不重复
				this.uploadedFile.map(item => {
					if (item.uid === file.uid) {
						this.$message.warning('不允許重複上傳')
						file.status = 'error'
						return false
					}
				})

				// 控制文件数量            
				if (this.uploadedFile.length + UpFileList.length > 5) {
					// this.$message.warning('超過附件上傳數量限制')
					file.status = file.status == 'done' ? 'done' : 'info'
					return false
				}

			},

			async onClickFile(file) {
				if (file.status != 'done') return;
				let downloadFile = this.uploadedFile.find(i => i.uid == file.uid);
				let id = downloadFile.fileId || null;
				if (id == null) return this.$message.warning('獲取文件失敗!');
				try {
					window.open(this.fileUrl + id);
				} catch (error) {
					console.log(error);
					this.$message.warning('下載文件失敗!');
				}
			},

			sizeText(size) {
				return this.$util.getSizeText(size);
			},

			onModelCardShow(isModelCardShow) {
				this.isModelCardShow = isModelCardShow
			},
			
		},
	}
</script>

<style lang="less">
	.Tinymce_box {
		display: flex;
	}

	.mce-panel {
		/* border: 0 solid #f3f3f3; */
		border: none !important;
		border: 0 solid #f3f3f3 !important;
	}

	.mce-tinymce {
		display: block;
		-webkit-box-shadow: none !important;
		-moz-box-shadow: none !important;
		box-shadow: none !important;
	}

	.editor-content {
		margin-left: 30px;
		flex-grow: 1;
		border: 2px dashed #f1f1f1;
		padding: 0 20px;
	}

	.editEmail-card {
		background: #ffffff;
		// min-width: 600px;
		border-radius: 10px;

		.vue-tags-input {
			background-color: #ffffff00;
		}

		.my-ant-modal-footer {
			padding: 10px 16px;
			text-align: right;
			background: transparent;
			border-radius: 0 0 4px 4px;
			background: #fff;
			width: calc(100% + 32px);
			margin-left: -16px;
			margin-bottom: -10px;
		}
	}

	// 附件區域CSS
	.maxCount-tips {
		width: 100%;
		align-items: center;
	}

	.file-area {
		margin: 10px 0 10px 0;
		max-height: 220px;
		overflow-y: scroll;
		border: 1px solid #e8e8e8;

		.file-item:not(:last-child) {
			border-bottom: 1px solid #e8e8e8;
		}
	}

	.file-name {
		max-width: 300px;
		width: 300px;

		&__done {
			color: #317ae2;
			cursor: pointer;
			text-decoration: underline;
			text-underline-offset: 0.3em;

			&:hover {
				text-decoration: none;
			}
		}
	}







	.editEmail-card .card-line {
		/* background: pink; */
		height: 35px;
		line-height: 35px;
		width: 100%;
		margin-bottom: 2px;
		border-bottom: 1px solid #e8e8e8;
	}

	.composeCard-head-title {
		width: 60px;
	}

	.card-line .input-area {
		flex: 1;
	}

	.card-line .icon-group {
		height: 30px;
		background: #f4f3f4;
		border: 1px solid #e2e2e2;
		width: 25px;
		border-radius: 3px;
	}

	/* .card-line .text-btn {
    display: flex;
    align-items: center !important;
    color: #000000;
    padding: 2px 8px;
    height: 26px;
    border-radius: 3px;
    cursor:pointer;
    position: relative;
}

.card-line .text-btn:hover {
    background: rgba(38,41,44,.05);
}

.card-line .text-btn .anticon {
    margin-left: 3px;
} 

*/

	.mail-textarea {
		/* margin-top: -35px; */
		z-index: 1;
		position: relative;
		width: 100%;
		padding-bottom: 15px;
	}

	.mail-textarea .card-line-right {
		position: absolute;
		right: 0;
		top: 0;
		max-width: 500px;
	}

	.mail-textarea .card-line-right .icon-group {
		height: 35px;
		background: #f4f3f4;
		border: 1px solid #e2e2e2;
		width: 25px;
		border-radius: 3px;
	}

	.mail-textarea .card-line-right .text-btn {
		/* margin-left: 20px; */
		display: flex;
		align-items: center !important;
		/* color: #000000; */
		padding: 2px 8px;
		height: 35px;
		border-radius: 3px;
		cursor: pointer;
		position: relative;
	}

	.mail-textarea .card-line-right .text-btn:hover {
		background: rgba(38, 41, 44, 0.05);
	}

	.mail-textarea .card-line-right .text-btn .anticon {
		margin-left: 3px;
	}

	/* --------最後一行的樣式------- */
	.card-btnline {
		/* height: 65px; */
		/* line-height: 65px; */
		margin-top: 15px;
		// padding-top: 15px;
		// border-top:1px solid #e8e8e8;
	}

	.card-btnline .icon-group {
		min-width: 60px;
		height: 32px;
		background: #f4f3f4;
		border: 1px solid #e2e2e2;
		border-radius: 3px;
		cursor: pointer;
		font-size: 12px !important;

		&:hover,
		&:focus,
		&:active {
			// .myButton-default:hover, .myButton-default:focus, .myButton-default:active
			background: #f7f7f7 !important;
			// border: 1px solid #e5e5e5 !important;
			// color: #26292c !important;
		}
	}

	.card-btnline .icon-item {
		margin-left: 8px;
		height: 32px;
		width: 32px;
		padding: 0px 6px;
		cursor: pointer;
		/* background: red; */
	}

	.card-btnline .icon-item:hover {
		background: #f4f3f4;
		border: 1px solid #e2e2e2;
	}

	.card-btnline .icon-item .anticon {
		font-size: 16px;
	}

	.card-btnline .icon-group .anticon {
		margin-right: 4px;
	}

	.card-btnline button {
		margin-left: 10px;
	}

	/* --------end------- */

	/* //修改 写邮件组件的 antdv input 的默认样式 */
	.editEmail-card .ant-input {
		border: none !important;
	}

	/* 去掉a-input的默认的蓝色shadow */
	.editEmail-card .ant-input:focus {
		box-shadow: none !important;
	}

	/* 修改写邮件组件的 textarea */
	.editEmail-card textarea.ant-input {
		padding: 10px 0 !important;
		font-size: 16px !important;
		/* //去掉右下角条纹 */
		resize: none;
	}

	/* ----------tag input start ---------------- */
	.ti-input::-webkit-scrollbar {
		display: none;
	}

	.ti-input {
		border: 0px solid #ccc !important;
		/* border: none !important; */
		overflow-x: scroll;
		flex-wrap: nowrap;
		width: 100%;
		border-radius: 4px;
		padding: 1px;
	}

	.input-area .ti-input {
		border: none !important;
	}

	.vue-tags-input {
		position: relative;
		overflow: hidden;
		text-overflow: ellipsis;
		/* width: 200px; */
		white-space: nowrap;
	}

	/* .ti-tags[data-v-61d92e31] */
	.ti-tag {
		flex-wrap: nowrap;
		background-color: #ffffff !important;
		color: #000000 !important;
	}

	/* ----------tag input end ---------------- */

	.warning-line {
		border: rgba(38, 41, 44, 0.12);
		background-color: #fff7d6;
		padding: 12px 16px;
		font-weight: 500;
		z-index: 99;
		width: 100%;
	}

	.warning-line a {
		text-decoration: none;
		font-weight: 500;
		color: #317ae2 !important;
	}

	.mgnRight {
		margin-right: 0.5em;
	}

	.bgOrg {
		background: #f97358;
		color: #fff;
	}
</style>