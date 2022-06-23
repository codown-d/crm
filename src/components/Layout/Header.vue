<template>
	<div class="header flex default-scrollbar">

		<!-- 左側LOGO -->
		<div class="header-left flex">
			<div class="logo">LOGO</div>
		</div>

		<!-- 全局搜索區域 -->
		<div class="header-mask" v-if="viewSearchBox" @click="viewSearchBox = false"></div>
		<div class="header-center flex">
			<div class="header-center-wrap" ref="aff">
				<a-input-search class="header-search" placeholder="請輸入想要搜尋的數據..." v-model="searchInput"
					style="width: 400px; border-radius: 20px" :maxLength="30" @focus="openSearchBox" :destroyOnClose="true"
					@search="onSearch" :loading="isSearchLoading" :allowClear="true" />
				<!-- <a-button class="typeBtn flex-center" style="margin-right: 0px" @click='addParentTag()'><a-icon type="plus" /></a-button> -->
				<!-- 全局搜索結果 -->
				<div class="headerSearchBox" v-if="viewSearchBox"
					:style="{ width: searchInput.length ? '120%' : '100%' ,  marginLeft: searchInput.length ? '-10%' : '0' }">
					<div class="headerSearchBoxDiv" :style="{ width: searchInput.length ? '120%' : '100%' }">
						<!-- 歷史記錄展示 -->
						<template v-if="!searchInput.length">
							<div class="flex-column">
								<div class="font-16">歷史瀏覽記錄</div>
								<a-spin :spinning="isHistoryLoading" tip="獲取歷史瀏覽記錄中...">
									<div v-if="!isHistoryLoading && !historyList.length"
										class="header-search__history gray-text padding-20 flex-center font-16">
										未查詢到瀏覽記錄!
									</div>
									<div v-else-if="historyList.length" class="header-search__history">
										<div v-for="(item, index) in historyList" :index="index">
											<div v-if="!item.bizType.length && !item.bizContent.length" class="header-search__history-item flex pointer">
												<a-avatar icon="exclamation" class="flex-center" />
												<div class="marginLft-15">該記錄無效！</div>
											</div>
											<div class="header-search__history-item flex pointer"
												@click="onClickResultItem(item, true)">
												<a-avatar v-if="item.bizType == 'customer'" icon="user" class="flex-center" />
												<a-avatar v-else-if="item.bizType == 'business_deal'" icon="dollar" class="flex-center" />
												<a-avatar v-else-if="item.bizType == 'company'" icon="shop" class="flex-center" />
												<a-avatar v-else-if="item.bizType == 'activity'" icon="schedule" class="flex-center" />
												<a-avatar v-else-if="item.bizType == 'note'" icon="profile" class="flex-center" />
												<div class="marginLft-15">{{ item.bizContent }}</div>
											</div>
										</div>
									</div>
								</a-spin>
							</div>
						</template>
						<!-- 全局搜索結果展示 -->
						<template v-else>
							<a-tabs :default-active-key="0" tab-position="left" v-model="currentTabKey" @change="onTabChange">
								<template v-for="(tab, tabIndex) in searchResultTabs">
									<a-tab-pane :key="tab.key" :tab="tab.label" class="tabSearchBox">
										<div class="header-search__result flex-column">
											<div class="font-16">{{ tab.label }}搜尋結果</div>
											<div class="flex-1 header-search__result-content">
												<a-spin :spinning="isSearchLoading" tip="獲取歷史瀏覽記錄中...">
													<div v-if="!isSearchLoading && !searchResult.length"
														class="gray-text font-16 flex flex-center result-content-null">
														新增{{ tab.label }}『<a class="marginLft-10 marginRgt-10" @click="onClickAdd"> {{ searchInput
															}}</a> 』
													</div>
													<div v-else-if="searchResult.length" class="result-content">
														<div v-for="(item, index) in searchResult" :index="index">
															<div class="result-content-item flex pointer" @click="onClickResultItem(item, false)">
																<a-avatar v-if="item.type == 'customer'" icon="user" class="flex-center" />
																<a-avatar v-else-if="item.type == 'business_deal'" icon="dollar" class="flex-center" />
																<a-avatar v-else-if="item.type == 'company'" icon="shop" class="flex-center" />
																<a-avatar v-else-if="item.type == 'activity'" icon="schedule" class="flex-center" />
																<a-avatar v-else-if="item.type == 'note'" icon="profile" class="flex-center" />
																<div class="marginLft-15">{{ item.content }}</div>
															</div>
														</div>
													</div>
												</a-spin>
											</div>
										</div>
									</a-tab-pane>
								</template>
							</a-tabs>
						</template>
					</div>
				</div>
			</div>
			<!-- 全局新增按鈕 -->
			<a class="add-icon flex" @click="handleShowFastInput">
				<a-icon type="plus" style="justify-content: center;" class="icon--red"/>
			</a>
			<div v-if="fastInputShow" class="fast-create-input">
				<ul>
					<template v-for="(item, index) in menuList">
						<li :key="index" @click="handleFastCreate(item)">
							<span class="menu-icon"><a-icon :type="item.type" :title="item.title" /> </span>
							<span class="menu-text">{{ item.title }}</span>
						</li>
					</template>
				</ul>
			</div>
		</div>

		<!-- 右側用戶資料展示區域 -->
		<div class="header-right flex">
			<div class="adminGrp">
				<div class="userImgGrp">
					<!-- <img src="@/assets/crmImages/userImg.jpeg" @click="clickSetting('PersionalSetting')" /> -->
					<a-avatar class="marginRgt-8">{{ userInfo.userName[0] || 'USER' }}</a-avatar>
				</div>
				<div class="login text-overflow marginRgt-10">
					<a @click="clickSetting()">{{ userInfo.userName || 'Username' }}</a>
				</div>

				<div class="userSettingGrp box-shadow">
					<a-list size="small" class="header-menu userSetting">
						<!-- <a-list-item class="header-menu--item bold-text cursor-pointer" @click="settingLink('/settings/profile')">
							<div class="flex-center">
								<a-icon type="setting" class="marginRgt-10" />
								個人偏好設定
							</div>
						</a-list-item> -->

						<!-- <a-list-item class="header-menu--item cursor-pointer" @click="settingLink('/settings')">邀請朋友以贏得獎勵</a-list-item>
                          <a-list-item class="header-menu--item cursor-pointer" @click="settingLink('/settings')">公司設定</a-list-item>
                          <a-list-item class="header-menu--item cursor-pointer" @click="settingLink('/settings')">管理使用者</a-list-item>
                          <a-list-item class="header-menu--item cursor-pointer" @click="settingLink('/settings')">付款</a-list-item>
                          <a-list-item class="header-menu--item cursor-pointer" @click="settingLink('/settings')">管理訂閱</a-list-item> -->

						<div slot="header" class="header-menu--username cursor-pointer">
							<!-- {{ userInfo.userName || 'Username' }} -->
							<a-list-item>{{ userInfo.userName || 'Username' }}</a-list-item>
						</div>

						<div slot="footer" class="header-menu--item cursor-pointer">
							<a-list-item @click="logout">登出</a-list-item>
						</div>
					</a-list>
				</div>
			</div>
		</div>


		<!-- 新增快捷弹框 -->
		<!-- 新增交易 -->
		<a-modal :visible="dealsVisible" :closable="false" :footer="false" width="750px" :destroyOnClose="true" :dialog-style="{ top: '0px' }">
			<!-- 交易新增、編輯彈窗頂部 -->
			<div class="flex-between" slot="title">
				<div>{{ modalTitle }}</div>
			</div>
			<addBusiness
				@handleOk="handleDealsOk($event)"
				@handleCancel="handleDealsCancel"
				:detailData="recordData"
				:isAddDeal="isAddDeal"
				v-if="dealsVisible"
			/>
		</a-modal>

		<!-- 新增活动 -->
		<a-modal
			v-model="activityVisible"
			:title="modalTitle"
			@ok="handleActivityOk"
			ok-text="确认"
			cancel-text="取消"
			@cancel="handleActivityCancel"
            :dialog-style="{ top: '0px' }"
            width="500px"
		>
			<activeTab ref="activeTab" :active="activityCurTabType" :list="tabTypeList" @change="tabChange" />
			<activeForm ref="activeForm" :formData="activityFormData" />
		</a-modal>

		<!-- 新增客户 -->
		<a-modal
			:dialog-style="{ top: '0px' }"
			:title="modalTitle"
			:visible="customVisible"
			:footer="null"
			@cancel="handleCustomFinish"
			width="750px"
			wrapClassName="customerAddLayer"
		>
			<AddCust :formEdit="customForm" @handleOk="handleCustomFinish" @handleCancel="handleCustomFinish" />
		</a-modal>

		<!-- 新增公司 -->
		<a-modal :title="modalTitle" :visible="companyVisible" :footer="null" @cancel="handleCompanyFinish" :dialog-style="{ top: '0px' }" width="750px">
			<AddCompany :formEdit="companyForm" :msg="modalTitle" @handleOk="handleCompanyFinish" @handleCancel="handleCompanyFinish" />
		</a-modal>
	</div>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';
	import debounce from 'lodash/debounce'
	import moment from "moment";
	import addBusiness from '@/components/public/addBusiness'
	import activeForm from '@/components/public/activeForm.vue'
	import activeTab from '@/views/Activites/components/activeTab.vue'
	import AddCust from '@/components/public/addCustomer.vue'
	import AddCompany from '@/views/Company/components/AddCompany'
	import transactionServices from '@/views/Deals/service'
	import ActivitiesApi from '@/services/activities-api.js'
	import Services from "@/services/common.js";
	export default {
		name: 'Header',
		components: {
			addBusiness,
			activeForm,
			activeTab,
			AddCust,
			AddCompany
		},
		data() {
			this.lastFetchId = 0
			this.fetchSearchResult = debounce(this.fetchSearchResult, 800)
			return {
				// 新增快捷
				fastInputShow: false,
				dealsVisible: false,
				isAddDeal: true,
				modalTitle: '',
				recordData: {},
				activityFormData: {},
				activityModalStatus: 1,
				activityCurTabType: 1,
				activityVisible: false,
				tabTypeList: [],
				tabType: {},
				customVisible: false,
				customForm: {
					companyId: '',
					companyName: '',
					editType: 'add',
					email: [
						{
							email: '',
							type: 'work',
						},
					],
					name: '',
					phone: [
						{
							phone: '',
							type: 'work',
						},
					],
					remark: '',
					bizTagIds: [],
				},
				companyVisible: false,
				companyForm: {
					address: '',
					email: '',
					gmt_create: '',
					gmt_modified: '',
					latitude: '',
					longitude: '',
					name: '',
					phone: '',
					remark: '',
					editType: 'add'
				},

				searchResultTabs: [
					{ key: 0, type: 'customer', label: '客戶' },
					{ key: 1, type: 'business_deal', label: '交易' },
					{ key: 2, type: 'company', label: '組織' },
					{ key: 3, type: 'activity', label: '活動' },
					{ key: 4, type: 'note', label: '筆記' },
				],
				isUserSettingShow: false,
				viewSearchBox: false,
				searchInput: '',
				isSearchOnFocus: false,
				isSearchLoading: false,
				historyList: [],
				isHistoryLoading: false,
				searchResult: [],
				currentTabKey: 0,
			}
		},
		computed: {
			...mapGetters([
				'menuList'
			]),
			userInfo() {
				let userInfo = this.$store.state.user.userInfo
				// this.$util.console(userInfo, 'Header打印的用户信息')
				return userInfo
			},
		},
		watch: {
			viewSearchBox: {
				immediate: true,
				deep: true,
				handler(newValue, oldValue) {
					if (newValue != oldValue && newValue) {
						this.selectBrowseRecordList()
					}
					// else if (!newValue) {
					//     this.searchInput = '';
					// }
				},
			},
			searchInput: {
				// immediate: true,
				deep: true,
				handler(newValue, oldValue) {
					if (newValue != oldValue && newValue.length) {
						// console.log(newValue);
						this.fetchSearchResult(newValue)
					} else if (!newValue.length && this.viewSearchBox) {
						this.selectBrowseRecordList()
					}
				},
			},
		},
		methods: {
			handleShowFastInput() {
				this.fastInputShow = !this.fastInputShow;
			},

			// 新增快捷
			handleFastCreate(item) {
				switch (item.type) {
					case 'dollar':
						this.showDealsModal();
					break;
					case 'mail':
						this.$router.push('/mail/compose');
					break;
					case 'schedule':
						this.showActivityModal();
					break;
					case 'user':
						this.showCustomModal();
					break;
					case 'shop':
						this.showCompanyModal();
					break;
				}
				this.fastInputShow = false;
			},
			showDealsModal() {
				this.dealsVisible = true
				this.isAddDeal = true
				this.modalTitle = '新增交易'
				this.recordData = {}
			},
			async handleDealsOk(formData) {
				const { dealDate = null, ...other } = formData
				const param = {
					dealId: this.recordData.dealId,
					dealDate: dealDate ? moment(dealDate).format('YYYY-MM-DD HH:mm:ss') : '',
					...other,
				}
				const res = await transactionServices.addBusiness({ param })
				if (res.code == 0) {
					this.dealsVisible = false
					this.$message.success('新增成功')
				} else {
					this.$message.error(res.message)
				}
			},
			handleDealsCancel() {
				this.dealsVisible = false
			},

			showActivityModal() {
				this.formData = {}
				this.activityModalStatus = 1
				this.activityCurTabType = 1
				this.modalTitle = '新增活动'
				this.activityVisible = true;

				this.fetchTabTypeList();
			},

			fetchTabTypeList() {
				ActivitApi.queryActivityTypes().then(res => {
					if (res.code === '0') {
						this.tabTypeList = res.data
					}
				})
			},

			tabChange(item) {
				this.tabType = item
				this.curTactivityCurTabTypeabType = item.typeId
			},

			handleActivityOk() {
				this.$refs.activeForm.validate().then(valid => {
					if (valid) {
						const getForm = this.$refs.activeForm;
							const {
								person,
								companyId,
								time,
								publicDescription,
								subject,
								activityId,
								customerId,
								activityTypeId,
								...argues
							} = getForm.form ? getForm.form : getForm[0].form;

							const params = {
									param: {
											activityParticipants: [
													{
															customerId: customerId
																	? customerId
																	: '',
															isCreate: false,
													},
											],
											planEndTime: time[0]
													? moment(time[0]).format("YYYY-MM-DD HH:mm:ss")
													: "",
											planStartTime: time[0]
													? moment(time[1]).format("YYYY-MM-DD HH:mm:ss")
													: "",
											publicDescription: publicDescription,
											activityTypeId,
											companyId: companyId
													? companyId
													: '',
											subject,
											busyFlag: 0,
											done: false,
									},
							};
							Services.addActive(params).then((res) => {
									if (res.code == "0") {
											this.$message.success("新建成功");
											this.activityVisible = false
									}
							});
					}
				})
			},

			handleActivityCancel() {
				this.formData = {}
				this.activityVisible = false
			},

			showCustomModal() {
				this.modalTitle = '新增客戶資料';
				this.customVisible = true;
			},

			handleCustomFinish() {
				this.customVisible = false;
			},

			showCompanyModal(editType, record) {
				this.modalTitle = '新增公司'
				this.companyVisible = true;
			},
			handleCompanyFinish() {
				this.companyVisible = false;
			},





			onTabChange(e) {
				this.currentTabKey = e
				this.fetchSearchResult(this.searchInput)
				// console.log(this.currentTabKey);
			},
			fetchSearchResult(content) {
				// console.log('打印content', content);
				if (!content.length) return this.$message.warning('請輸入想要搜尋的數據！', 1)
				this.lastFetchId += 1
				const fetchId = this.lastFetchId

				this.isSearchLoading = true
				this.$api.customer
					.searchList({
						type: this.searchResultTabs.find(item => item.key == this.currentTabKey).type,
						content: content,
					})
					.then(res => {
						this.isSearchLoading = false
						console.log('全局分類查詢的结果是： ', res)
						if (fetchId !== this.lastFetchId) return
						if (!res.success) return this.$message.error(res.message || '搜索失敗！！', 1)
						this.searchResult = res.data
					})
			},
			onSearch() {
				if (!this.searchInput.length) return
				this.fetchSearchResult(this.searchInput)
			},
			selectBrowseRecordList() {
				this.isHistoryLoading = true
				this.$api.customer
					.selectBrowseRecordList({
						pageNum: 1,
						pageSize: 20,
						param: {
							bizId: this.userInfo.id,
						},
						sorts: [
							{
								desc: true,
								key: '',
							},
						],
					})
					.then(res => {
						this.isHistoryLoading = false
						// console.log('获取的浏览历史记录的结果是： ', res)
						if (!res.success) return this.$message.error(res.message || '獲取歷史瀏覽記錄失敗！！', 1)
						this.historyList = res.data.list
					})
			},
			onClickResultItem(item, isHistoryType) {
				if (isHistoryType) {
					let { bizType, bizContent, bizId } = { ...item };
					alert(`点击历史记录：类型： ${bizType} ,  名称： ${bizContent} , id: ${bizId}`);
				} else {
					let { type, content, id } = { ...item };
					alert(`点击搜索的结果：类型： ${type} ,  名称： ${content} , id: ${id}`);
				}
			},
			onClickAdd() {
				alert('点击了新增按钮');
			},
			clickSetting() {
				this.isUserSettingShow = !this.isUserSettingShow
			},
			settingLink(linkName) {
				this.isUserSettingShow = false
				this.$router.push(linkName)
			},
			logout() {
				this.$store.dispatch('user/logout')
				this.$router.push('/login')
				this.$store.reset()
			},
			openSearchBox() {
				this.viewSearchBox = true
			},
			closeSearchBox() {
				this.viewSearchBox = false
			},
			callback(val) {
				console.log(val)
			},
		},
	}
</script>

<style lang="less">

    .header {
        .ant-list-item {
            padding: 8px 10px;
        }
        .ant-tabs-nav .ant-tabs-tab-active {
            color: #F86F54;
            text-shadow: 0 0 0.25px currentColor;
        }
    }

    .header-menu {
        // li {
        //     margin: 10px;
        //     padding: 0 10px;
        // }
    }

	.header-center-wrap {
		// position: relative;
		display: flex;
	}

	// ------ common css start ------
	.headerSearchBox {
		position: absolute;
		top: 54px;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		width: 100%;
		align-items: flex-start;
		z-index: 1001;
		color: #000;
		vertical-align: top;
		transition: all 0.4s ease 0.3s;
	}

	.headerSearchBox .headerSearchBoxDiv {
		border: 1px solid #eee;
		background: #fff;
		display: block;
		// width: 400px;
		width: 100%;
		margin: auto;
		box-shadow: 0px 0px 5px #ccc;
		border-radius: 2px;
		padding: 20px;
		transition: all 0.4s ease 0.3s;
	}

	.headerSearchBoxDiv .ant-tabs .ant-tabs-left-bar .ant-tabs-nav-container {
		// background: #f3f3f3;
	}

	.headerSearchBoxDiv .ant-tabs .ant-tabs-left-content {
		padding: 0;
	}

	.headerSearchBoxDiv .headerSearchBoxDivContent {
		padding: 10px;
	}

	.userSettingGrp {
		display: none;
		/* z-index: 9999; */
        // border: 1px solid #e1e5ef;
        // transition: height 0.3s;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
        // box-sizing: border-box;
        border-color: rgba(0, 0, 0, 0.09);
        box-shadow: 0 2px 8px rgb(0 0 0 / 9%);
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

	.adminGrp {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.adminGrp:hover .userSettingGrp {
		display: block;
	}

	.adminGrp .userImgGrp {
		width: 35px;
		height: 35px;
	}

	.adminGrp .userImgGrp img {
		margin-left: -20px;
		margin-top: -10px;
	}

	.cursor-pointer {
		cursor: pointer;
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

	// ------ common css end ------
	.header {
		height: 100%;
		/* min-height: 50px; */
		width: 100%;
		min-width: 960px;
		background: #ffffff;
		/* background: red; */
		border-bottom: 1px solid #e8e8e8;
		justify-content: space-between;
		z-index: 901;

		position: relative;

		&-mask {
			background: rgba(0, 0, 0, 0.3);
			height: 100vh;
			width: 100vw;
			z-index: 1000;
			position: absolute;
			left: 0;
			top: 0;
		}

		/* padding: 10px 0; */
		// &-menu {
		//     box-shadow: 0 4px 8px rgb(38 41 44 / 16%) !important;
		//     z-index: 2020;
		// }
		.ant-list-header,
		.ant-list-footer {
			padding-top: 7px;
			padding-bottom: 7px;
		}

		// .ant-spin-container:hover {
		// 	background: #f5f5f5;
		// }

		.login {
			max-width: 120px;
		}
	}

	.header-menu--item {
		&:hover {
			background: #f5f5f5;
			color: #f50;
		}
	}

	.header-left {
		width: 100px;
		justify-content: left;
		align-items: center;
		/* background: red; */
	}

	.header-left .logo {
		width: 80px;
		background: #f86f54;
		color: white;
		height: 40px;
		line-height: 40px;
		border-radius: 8px;
	}

	.header-center {
		// flex: 1;
		align-items: center;
		justify-content: center;
		// background: pink;
		height: 100%;
		position: relative;
		// z-index: ;
	}

	.header-center .add-icon {
		flex: 0 0 auto !important;
		margin-left: 10px;
		margin-right: 10px;;
		border: 1px solid #e2e2e2;
		border-radius: 50%;
		width: 32px;
		height: 32px;
		justify-content: center;
	}

	.header-center .anticon {
		font-size: 18px;
	}

	.header-right {
		width: 260px;
		padding-right: 20px;
		justify-content: flex-end;
	}

	.header-right .avator-md img {
		/* width: 35px;
    height: 35px;
    border-radius: 50%; */
		margin: 0 5px 0 12px;
	}

	.header-search {
		border-radius: 20px !important;
		z-index: 1001;

		// position: relative;
		&__history {
			min-height: 227px;
			max-height: 600px;
			overflow-y: scroll;

			&-item {
				// background: red;
				padding: 10px;
				// width: calc(100% + 20px);
				margin-top: 4px;
				// margin-left: -10px;
				border-radius: 2px;

				&:hover {
					background: #f6f6fc;
					// color: #383839 !important;
					color: #f50;
					font-weight: 500;
				}
			}
		}

		&__result {
			min-width: 340px;
			height: 100%;
			min-height: 249px;
            padding-left: 15px;

			.result-content-null {
				height: 200px;
			}

			&-content {
				min-height: 200px;
				max-height: 600px;
				overflow-y: scroll;

				.result-content-item {
					width: 100%;
					padding: 10px;
					margin-top: 4px;
					border-radius: 2px;

					&:hover {
						background: #f6f6fc;
						// color: #383839 !important;
						color: #f50;
						font-weight: 500;
					}
				}
			}
		}
	}

	.header .ant-input {
		border-radius: 16px;
	}

	.logo {
		background: #f97358;
		border-radius: 5px;
		width: 35px;
		color: #fff;
		text-align: center;
	}


	/* 快捷入口 */
	.fast-create-input{
		border-radius: 4px;
		background: #fff;
		border: 1px solid #e1e5ef;
		transition: height .3s;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
		box-sizing: border-box;
		
		position: absolute;
		top: 50px;
		right: 0px;

		ul{
			margin: 0;
			padding: 0;
		}

		li{
			display: flex;
			cursor: pointer;
			line-height: 35px;
			margin: 0;
			padding: 0;
			padding: 0 10px;

			&:hover {
				background: #f6f6fc;
				color: #f86f54 !important;
				/deep/ .anticon{
					color: #f86f54;
				}
			}
			.menu-icon{
				width: 35px;
				flex: 0 0 35px;
			}

			.menu-text{
				font-size: 14px;
			}
			
		}
	}

</style>