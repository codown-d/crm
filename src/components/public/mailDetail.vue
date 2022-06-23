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

        <div class="card-line flex">
            <span class="composeCard-head-title">發送類型</span>
            <div class="input-area">
                <a-select placeholder="發送類型" v-model="marketingDetail.sendType" style="width:20%" @change="sendTypeChange">
                    <a-select-option :value="item.id" v-for="(item, index) in sendTypeOptions" :key="index">{{ item.name }}</a-select-option>
                </a-select>
                <a-date-picker v-if="marketingDetail.sendType == 2" v-model="marketingDetail.sendTime"
				 show-time placeholder="預約發送時間" style="width: 20%;" allowClear/>
            </div>
        </div>
        <div class="card-line flex">
            <span class="composeCard-head-title">發送方式</span>
            <div class="input-area">
                <a-select placeholder="發送方式" v-model="marketingDetail.sendWay" style="width:20%" @change="sendWayChange">
                    <a-select-option :value="item.id" v-for="(item, index) in sendWayOptions" :key="index">{{ item.name }}</a-select-option>
                </a-select>
            </div>
        </div>
        <div class="card-line flex" v-if="marketingDetail.sendWay == 1">
            <span class="composeCard-head-title">客戶標籤</span>
            <div class="input-area">
				<a-tree-select
						v-model="marketingDetail.customerTags"
						:defaultValue="marketingDetail.customerTags"
						style="width: 100%"
						:treeDefaultExpandAll="true"
						:tree-data="tagsTreeData"
						:replaceFields="{title:'title', key:'key', value: 'key' }"
						:show-checked-strategy="'SHOW_ALL'"
						tree-checkable
						search-placeholder="搜索標籤"
						@change="selectTagChange"
					/>
            </div>
        </div>
        <div class="card-line flex" v-if="marketingDetail.sendWay == 2">
            <span class="composeCard-head-title">全部客戶</span>
            <div class="input-area">
                <a-input type="text" :disabled="true" placeholder="全部客户" :value="'全部客户'" />
            </div>
        </div>
        <div class="card-line flex">
            <span class="composeCard-head-title">附加客戶</span>
            <div class="input-area">
                <dictSelect
                    :defaultValue="marketingDetail.attachCustomers"
                    :selectDict="'customer'"
                    :mode="'multiple'"
					:defaultSelectOptions="marketingDetail.attachCustomersWithObj"
                    @selectChange="customerChange($event)"/>
            </div>
        </div>
        <div class="card-line flex">
			<div style="width:100px">
            <myButton  text="发送对象" class="composeCard-head-title" @click="getSelectedCustomersByCondition">
			</myButton>
			</div>
			<div style="color:red">更改客戶標籤或附加客戶后需要重新点击发送对象</div>
        </div>
		<a-table
			:row-selection="{ selectedRowKeys: marketingDetail.selectedCustomerRowKeys, onChange: onSelectCustomerChange }"
			:columns="customerColumns"
			:row-key="record => record.id"
			:data-source="filteredCustomerData"
			:pagination="false"
			:loading="filteredCustomerLoading"
			>
				<template slot="channelUserName" slot-scope="channelUserName"> {{ channelUserName }} </template>
				<template slot="line" slot-scope="line"> {{ line }} </template>
				<template slot="bizTags" slot-scope="bizTags"> 
					<a-tag v-for="item in bizTags" :key="item.id"  color="orange" >
					{{item.name}}
					</a-tag>
				</template>
				<template slot="customerName" slot-scope="customerName"> {{ customerName }} </template>
		</a-table>
		<br/>
		<!-- 主題 -->
		<div class="card-line flex">
			<span class="composeCard-head-title">主&nbsp&nbsp&nbsp&nbsp題：</span>
			<div class="input-area">
				<a-input type="text" placeholder="請輸入郵件主題" v-model="marketingDetail.title" />
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
			<!-- <vue-html5-editor :content="marketingDetail.Message" :height="500"></vue-html5-editor> -->
			<vue-editor v-model="marketingDetail.content"></vue-editor>

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
			</div>

			<div class="flex">
				<!-- <div>已儲存</div> -->
				<!-- <a-button class="mgnRight btnDef">已儲存</a-button> -->
				<myButton @click="onCloseCompose" text="關閉" />
				<myButton theme="orange"
					:disabled="!isMailSyncing || selectedFile.length > 5 || (marketingDetail.title || '').trim().length == 0  || (marketingDetail.content || '').trim().length == 0 || marketingDetail.status != 0 || !marketingDetail.sendCustomerIds" 
					:loading="isSending"
					@click="saveSendEmail"
					:text="'存為草稿'" />
				<myButton theme="orange"
				:disabled="!isMailSyncing || selectedFile.length > 5 || (marketingDetail.title || '').trim().length == 0  || (marketingDetail.content || '').trim().length == 0 || marketingDetail.status != 0 || !marketingDetail.sendCustomerIds" 
				:loading="isSending"
				@click="batchSendEmail"
				:text="'發送'" />

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
	import VueTagsInput from '@johmun/vue-tags-input';
    import dictSelect from "@/components/Common/dictSelect";
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
const customerColumns = [
  {
    title: '姓名',
    dataIndex: 'customerName',
    sorter: true,
    width: '20%',
    scopedSlots: { customRender: 'customerName' },
  },
  {
    title: '郵箱',
    dataIndex: 'email',
    sorter: true,
    width: '30%',
    scopedSlots: { customRender: 'email' },
  },
    {
    title: '標籤',
    dataIndex: 'bizTags',
    sorter: true,
    width: '50%',
    scopedSlots: { customRender: 'bizTags' },
  },
];


	export default {
		components: { 
			VueTagsInput, 
			ExpandIcon, 
			UnExpandIcon, 
			myButton,
			VueEditor,
            dictSelect,
			// "vue-html-editor": require("vue-html-editor")
		},
		name: 'Edit',
		props: {
			mailData: Object,
			isReply: Boolean,
			isForward: Boolean,
		},
		data() {
			return {
				marketingDetail: {
					id:undefined,
					title:undefined,
					bizType:'email',
					customerTagIds:undefined,//选择标签IDS,分隔
					status:0,
					sendType:1,
					sendTime:undefined,
					sendWay:1,
					content:undefined,
					attachCustomerIds:undefined,//附加联络人IDs,分隔
					customerTags:[],//选择的联络人标签id数组
					attachCustomers:[],//选择的附加联络人id数组
					attachCustomersWithObj:[],//选择的附加联络人对象数组
					sendCustomerIds:undefined,
					selectedCustomerRowKeys:[],
					sendObjList:[],//获取详情返回的人员筛选数组
				},
				isSending: false, //發送按鈕的loading狀態
				isWatchMailOpen: false,
				//   tags: ['4025897@163.com','3042309580@qq.com','1243631258@qq.com','wintsenf@yahoo.com'],
				tags: [],
				tinymceFlag: 1, //是防止元件緩存導致編輯器不能正常使用，每次切換來都更改key,使其重新渲染
				selectedFile: [],
				selectedFileDisplay: [],
				uploadedFile: [],
				isFileModalShow: false,
				fileUrl: API_HOST.PROD + 'api/filestorage/file/download/',
                tagsTreeData:[],
                sendTypeOptions:[
                    {
                        id:1,
                        name:"立即發送"
                    },
                    {
                        id:2,
                        name:"預約發送"
                    }
                ],
                sendWayOptions:[
                    {
                        id:1,
                        name:"按標籤選擇"
                    },
                    {
                        id:2,
                        name:"全部客戶"
                    },
                ],
                expandedKeys:[],
                autoExpandParent:true,
                tagTreeVisible:false,
                customerColumns,
                filteredCustomerData: [],
                filteredCustomerPagination: {},
                filteredCustomerLoading: false,
			}
		},
		computed: {
			...mapGetters([
				'permissions',
				'mail'
			]),
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
			// "marketingDetail.customerTags":{
			// 	immediate: true,
			// 	deep: true,
			// 	handler(newValue, oldValue) {
			// 		this.filteredCustomerData=[]
			// 	}
			// },
			// "marketingDetail.attachCustomers":{
			// 	immediate: true,
			// 	deep: true,
			// 	handler(newValue, oldValue) {
			// 		this.filteredCustomerData=[]
			// 	}
			// },
			mailData: {
				immediate: true,
				deep: true,
				handler(newValue, oldValue) {
					// console.log('編寫郵件組件的newValue=============', newValue)
					// if (this.isReply || this.isForward) {
					// 	let from = newValue.from
					// 	let isSpMailFrom = from.indexOf('<') > -1 && from.indexOf('>') > -1 // 判斷from有沒有 <>
					// 	this.marketingDetail.Message = `<br>${newValue.sentDate} ${newValue.from}写道：<br><br>${newValue.content}`
					// 	this.tags = [
					// 		{
					// 			text: isSpMailFrom ? from.substring(from.indexOf('<') + 1, from.length - 1) : from,
					// 			tiClasses: ['ti-valid'],
					// 		},
					// 	]
					// 	//fixit: 如果是一封郵件被多次轉發或回復，有多個郵寄地址是，如何處理？？？
					// 	this.marketingDetail.headers.Subject = 'Re:' + newValue.subject
					// } else {
					// 	if (newValue && newValue.to) {
					// 		this.tags = [
					// 			{
					// 				text: newValue.to,
					// 				tiClasses: ['ti-valid'],
					// 			},
					// 		]
					// 	} else {
					// 		this.tags = []
					// 	}
					// }
					// this.initTinyMce()
                    console.log('newValue',newValue)
                    // if(newValue && newValue.id){
                    //     this.marketingDetail = newValue;
					// 	if(newValue.customerTagIds){
					// 		this.marketingDetail.customerTags = newValue.customerTagIds.split(',');
					// 	}
					// 	if(newValue.attachCustomerIds){
					// 		this.marketingDetail.attachCustomers =  newValue.attachCustomerIds.split(',');
					// 	}
                    // }
                    // else{
                    //     this.marketingDetail = this.$options.data().marketingDetail;
                    // }


					if(newValue && newValue.id){
                        // this.marketingDetail = this.deepCopy(newValue);
						 this.marketingDetail = this.$util.deepCopy(newValue)
						 this.marketingDetail.customerTags = this.marketingDetail.customerTagIds.split(',') ?? [];
						 this.marketingDetail.attachCustomers = this.marketingDetail.attachCustomerIds.split(',') ?? [];
						 if(this.marketingDetail.attachCustomersMap){
							 this.marketingDetail.attachCustomersWithObj = Object.keys(this.marketingDetail.attachCustomersMap).map(p => 
							 {
								 return {
									 id:p,
									 name:this.marketingDetail.attachCustomersMap[p]
								 }
							 });

						 }
						 else{
							 this.marketingDetail.attachCustomersWithObj = [];
							 
						 }
						 

						 this.filteredCustomerData = this.marketingDetail.sendObjList.map(p => {
							 return {
								 id:p.customerId,
								 name:p.customerName,
								 ...p
							 };
						 });
						 this.marketingDetail.selectedCustomerRowKeys = this.filteredCustomerData.map(p => p.id);




						// if(newValue.customerTagIds){
						// 	let customerTagIds =  newValue.customerTagIds
						// 	this.marketingDetail.customerTags = customerTagIds.split(',');
						// }
						// if(newValue.attachCustomerIds){
						// 	let attachCustomerIds =  newValue.attachCustomerIds
							
						// 	this.marketingDetail.attachCustomers =  attachCustomerIds.split(',');
						// }
                    }
                    else{
                        this.marketingDetail = this.$options.data().marketingDetail;
                    }
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
		},
		activated() {
			this.initTinyMce()
			this.tags = []
			this.tinymceFlag++
			console.log(this.mailData )
		},
	created: function(){
		let params = {
                bizTypeCode: "customer",
                type: "customer"
            }
            this.$api.tags.queryListByBizTypeCode(params).then(res => {
                console.log('res',res)
				if (!res.data.length) return this.$message.error('獲取標籤類型資料失敗！')
				this.tagsTreeData = this.formatTreeData(res.data, 0);
			})
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
				return flag;
			},
            formatTreeData(list, level) {
                level++;
                return  list.map(item => {
                        item.key = item.id
                        item.title = item.name
                        item.children = item.bizTagVoList
                        item.scopedSlots = { title: 'custom' }
                        item.level = level
                        if (item.bizTagVoList&&item.bizTagVoList.length) {
                            this.formatTreeData(item.bizTagVoList, level)
                        }
                        return item
                })
            },
            sendTypeChange(e){
                if (e == 1){
                    this.marketingDetail.sendTime = undefined;
                }

            },
            sendWayChange(){
                this.marketingDetail.customerTags = [];
                // this.marketingDetail.customerTags = [];

            },
            customerTagChange(value){

            },
            customerChange(value){
				this.marketingDetail.attachCustomers = value.map(p => p.id);
				this.marketingDetail.attachCustomerIds = this.marketingDetail.attachCustomers.join();
				this.marketingDetail.attachCustomersWithObj = value;
            },
            onExpand(expandedKeys) {
                this.expandedKeys = expandedKeys
                this.autoExpandParent = false
		    },
            selectTagChange(value, label, extra){
                console.log('value:',value);
				console.log('label',label);
				console.log('extra',extra);
                this.marketingDetail.customerTags = value;
				this.marketingDetail.customerTagIds = this.marketingDetail.customerTags.join();
				this.$forceUpdate();
            },
            // filteredCustomerTableChange(pagination, filters, sorter) {
            //     console.log(pagination);
            //     const pager = { ...this.filteredCustomerPagination };
            //     pager.current = pagination.current;
            //     this.filteredCustomerPagination = pager;
            // },
			
			gotoMailSetting() {
				this.$router.push('/settings/email-sync')
			},
			onCloseCompose() {
				this.$emit('onclose')
			},
			async getSelectedCustomersByCondition(){
				this.marketingDetail.sendCustomerIds = undefined,
				this.marketingDetail.selectedCustomerRowKeys = [];
				let result = await this.$api.marketing.querySendObj({
					attachCustomerIds: this.marketingDetail.attachCustomerIds,
					sendWay:this.marketingDetail.sendWay,
					customerTagIds: this.marketingDetail.customerTagIds,
				});
				console.log('result', result);
				if(result.code == '0' && result.data){
					this.filteredCustomerData = result.data.map(p => {
						return {
							id:p.customerId,
							channelUserName:p.customerName,
							...p
						};
					});
				}
				else{
					this.$message.error('發送對象查詢失敗！')
				}

			},
			onSelectCustomerChange(selectedRowKeys){
				this.marketingDetail.selectedCustomerRowKeys = selectedRowKeys;
				this.marketingDetail.sendCustomerIds = this.marketingDetail.selectedCustomerRowKeys.join();
				this.$forceUpdate();

			},
			async saveSendEmail(){
				if(!this.marketingDetail.title){
					throw this.$message.error('邮件主题不能为空！');
				}
				if(!this.marketingDetail.content){
					throw this.$message.error('邮件不能为空！');
				}
				if(this.marketingDetail.sendType ==2 && !this.marketingDetail.sendTime){
					throw this.$message.error('定时发送时，请选择发送时间！');
				}
				if(this.marketingDetail.selectedCustomerRowKeys.length > 100){
					throw this.$message.error('群發選擇的客戶數量不能超過100！');
				}
				this.isSending = true;
				let result;
				this.marketingDetail.sendTime = this.marketingDetail.sendTime ? this.$moment(this.marketingDetail.sendTime).format('YYYY-MM-DD hh:mm:ss') : undefined;
				if(this.marketingDetail.id){
					result = await this.$api.marketing.updateMailMarketing(this.marketingDetail);
				}
				else{
					result = await this.$api.marketing.addMailMarketing(this.marketingDetail);
				}
				this.isSending = false;
				if(result.code == '0'){
					this.marketingDetail.id = this.marketingDetail.id ?? result.data;
					this.$emit('onsuccess','save')
					this.$message.success('存為草稿成功！');
				}
				else{
					this.$message.error(`'存為草稿失敗 ${result.message}！`);
				}
			},
			async batchSendEmail(){
				if(!this.marketingDetail.title){
					throw this.$message.error('邮件主题不能为空！');
				}
				if(!this.marketingDetail.content){
					throw this.$message.error('邮件不能为空！');
				}
				if(this.marketingDetail.sendType ==2 && !this.marketingDetail.sendTime){
					throw this.$message.error('定时发送时，请选择发送时间！');
				}
				if(this.marketingDetail.selectedCustomerRowKeys.length > 100){
					throw this.$message.error('群發選擇的客戶數量不能超過100！');
				}
				this.isSending = true;
				let result;
				this.marketingDetail.status = 1;
				this.marketingDetail.sendTime = this.marketingDetail.sendTime ? this.$moment(this.marketingDetail.sendTime).format('YYYY-MM-DD hh:mm:ss') : undefined;
				if(this.marketingDetail.id){
					result = await this.$api.marketing.updateMailMarketing(this.marketingDetail);
				}
				else{
					result = await this.$api.marketing.addMailMarketing(this.marketingDetail);
				}
				this.isSending = false;
				if(result.code == '0'){
					this.marketingDetail.id = this.marketingDetail.id ?? result.data;
					if(this.marketingDetail.sendType == 1){
						this.$message.success('群發將在1分後執行！');
					}else{
						this.$message.success(`群發將在${this.marketingDetail.sendTime}執行！`);
					}
					this.$emit('onsuccess','send')
					this.batchVisible = false;
				}
				else{
					this.marketingDetail.status = 0;
					this.$message.error(`'發送失敗！ ${result.message}！`);
				}

			},
			// saveSendEmail() {

			// 	// // 如果有未上傳的附件
			// 	// if (this.selectedFile.length > this.uploadedFile.length) return this.$message.warning('附件列表有未處理的文件!');
			// 	// if (!this.tags.length) return this.$message.warning('请输入收件人地址');
			// 	// // note: 验证邮箱to是否输入正确
			// 	// let checkMailsInput = []
			// 	// this.tags.forEach(item => {
			// 	// 	let checkValidMail = this.$util.checkMail(item.text)
			// 	// 	checkMailsInput.push(checkValidMail.flag)
			// 	// })
			// 	// let checkMailsResult = checkMailsInput.some(item => !item)
			// 	// if (checkMailsResult) return this.$message.warning('請檢查輸入的郵寄地址!', 3)

			// 	// let { Subject } = { ...this.marketingDetail.headers }
			// 	// let { Message } = { ...this.marketingDetail }
			// 	// if (!Subject.length || !Message.length) return this.$message.warning('未完成輸入')

			// 	// this.tags.forEach((item, index) => {
			// 	// 	this.marketingDetail.headers.To = item.text
			// 	// 	this.marketingDetail.isSending = true
			// 	// 	this.sendMessage(this.marketingDetail.headers, this.marketingDetail.Message, index == this.tags.length - 1)
			// 	// })

			// },
			// sendMessage(headers_obj, message, isLast) {

			// 	// var email = ''

			// 	// for (var header in headers_obj) {
			// 	// 	let item =
			// 	// 		header == 'To' ? headers_obj[header] : this.$MimeCodec.mimeWordEncode(headers_obj[header], 'Q')
			// 	// 	//邮件的subjext只支持us-ascii编码方式，使用其他文字，需要使用'=?utf-8?Q?quoted-printable编码后的subject?='的通用协议
			// 	// 	email += header += ': ' + item + '\r\n'
			// 	// }

			// 	// email += '\r\n' + message
			// 	// console.log('這是要發送的郵件的所有資訊:', headers_obj, message, this.uploadedFile, this.uploadedFile.map(i => { return i.fileId }))
			// 	// fix：Invalid prop: custom validator check failed for prop "tags".   input-tag的行高自动撑开和 多个标签的bug
			// 	// this.$api.mail.send()
			// 	// let currentSyncMail = this.$store.state.mail.currentSyncMail;
			// 	// return this.$util.console(this.$store.state.mail.currentSyncMail, '发送邮件前，本地的获取的绑定的邮箱账号');

			// 	// let params = {
			// 	// 	emailAccountId: this.currentSyncMail.id,
			// 	// 	attachIds: this.uploadedFile.map(i => { return i.fileId }),
			// 	// 	message: {
			// 	// 		from: this.currentSyncMail.user,
			// 	// 		to: headers_obj.To,
			// 	// 		subject: headers_obj.Subject,
			// 	// 		content: message,
			// 	// 	},
			// 	// }
			// 	// let { cc, bcc } = { ...headers_obj }
			// 	// if (cc.length) params.message.cc = cc
			// 	// if (bcc.length) params.message.bcc = bcc
			// 	// // return this.sendGmail(email);
			// 	// this.$api.mail.send(params).then(res => {
			// 	// 	console.log('調用發送郵件介面返回：', res)
			// 	// 	this.marketingDetail.isSending = false
			// 	// 	if (res.code != 0) return this.$message.error('發送失敗！')
			// 	// 	this.$message.success('發送成功！')
			// 	// 	if (isLast) this.$emit('onSuccess')
			// 	// })
			// },
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