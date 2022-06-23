<template>
	<div class="detailUI flex-column">
		<div class="detailUI-head flex">
			<div class="flex">
				<div class="avator-lg flex"><img :src="currentData.image" /></div>
				<div class="username">
					<a @click="clickEditCustomer">{{ currentData.name }}</a>
				</div>
				<a-button class="primary-btn long-btn" shape="round" icon="plus" @click="showAddBusinessDrawer">交易</a-button>
				<span v-show="currentData.dealId">
					<a-switch v-model="currentIsWin" @change="changeBusinessDealIsWin" />
					<span v-if="currentIsWin == true">成功</span>
					<span v-else>失敗</span>
				</span>
			</div>
			<div class="flex">
				<!--
				<div class="avator-md flex">
				  <img :src="currentData.autherData.image" />
				</div>-->
				<div class="default-text">{{ currentData.autherData.auther }}</div>
				
				<a-button style="margin-left: 15px" icon="plus" />
			</div>
		</div>
		<a-row class="mgnTop1" v-show="currentData.dealId">
			<a-col :span="24" class="tabsGrp1">
				<div class="miniPipelineWrapper">
					<div class="pipelineSummary">
						<div class="pipelineStages open">
							<ul>
								<li data-stage-id="1" class="active">
									<div class="stageContent">
										<span class="stagename">4天</span>
										<span class="stageArrow"></span>
									</div>
								</li>
								<li data-stage-id="2" class="active last">
									<div class="stageContent">
										<span class="stagename">4天</span>
										<span class="stageArrow"></span>
									</div>
								</li>
								<li data-stage-id="3" class="">
									<div class="stageContent">
										<span class="stagename"></span>
										<span class="stageArrow"></span>
									</div>
								</li>
								<li data-stage-id="4" class="">
									<div class="stageContent">
										<span class="stagename"></span>
										<span class="stageArrow"></span>
									</div>
								</li>
								<li data-stage-id="5" class="">
									<div class="stageContent">
										<span class="stagename"></span>
										<span class="stageArrow"></span>
									</div>
								</li>
							</ul>
						</div>
						<div class="additionalInfo">
							<div class="pipelineInfo">Contact Made</div>
							<div class="expectedCloseDateWrapper">
								<span class="expectedCloseDate">
									<svg class="cui4-icon cui4-icon--s"><use xlink:href="#icon-sm-finish-flag" href="#icon-sm-finish-flag"></use></svg>
								</span>
								<span data-test="deal-expected-close-date">2021年10月31日</span>
							</div>
						</div>
					</div>
				</div>
			</a-col>
		</a-row>
		<a-row class="mgnTop1">
			<a-col :span="24" class="tabsGrp1">
				<Tabs v-model="active" :lineHeight="2">
					<Tab v-for="(item, index) in tabsArray" :key="item.name" :title="item.name">
						<div v-if="item.name == '電子郵件'"><Mail /></div>

						<div v-else-if="item.name == '筆記'">
							<a-select size="default" :default-value="`${defaultNoteTypeTitle}`" style="width: 120px" @change="handleChangeNote">
								<!-- -->
								<a-select-option v-for="(item, index) in noteType" :key="index">{{ item.type_title }}</a-select-option>
								<a-select-option :key="999999">第二期製作管理</a-select-option>
							</a-select>
							<!--
                <select>
                  <option v-for="(item, index) in noteType" :key="index">{{item.type_title}}</option>
                  <option :key="999999">管理</option>
                </select>
                -->
							<span class="modelCard">
								<a-button @click="isModelCardShow = !isModelCardShow">常用語-第二期製作</a-button>
								<div v-if="isModelCardShow" class="model-btn--modal flex-column"><ModelCard @onModelCardShow="onModelCardShow" /></div>
							</span>
							<a-textarea v-model="currentNote.text_desc" placeholder="Controlled 筆記" :auto-size="{ minRows: 3, maxRows: 5 }" />

							<div class="mgnTop">
								<a-button type="primary" @click="saveNote">儲存</a-button>
								<a-button style="margin-left: 10px;" @click="cancelNote">取消</a-button>
							</div>
						</div>

						<div v-else-if="item.name == '活動'">
							<AddCalendar :formEdit="formEditActivity" />
							<!-- @handleOk="handleOk" @handleCancel="handleCancel"-->
						</div>

						<div v-else-if="item.name == '檔案'">
							檔案
							<a-upload name="file" :multiple="true" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" :headers="headers" @change="handleUpload">
								<a-button>
									<a-icon type="upload" />
									Click to Upload
								</a-button>
							</a-upload>
						</div>
						<div v-else>{{ item.content }}</div>
					</Tab>
				</Tabs>
			</a-col>
		</a-row>

		<div class="detailUI-no-activity flex-column">
			<div class="add-btn-line"><a-button class="default-btn long-btn" shape="round">計畫中</a-button></div>
			<a-timeline class="my-timeline" v-if="customerPlanActivityList">
				<a-timeline-item v-for="(item, index) in customerPlanActivityList" :title="item.data.activityNote" :key="index">
					<div slot="dot" class="dot-bg"></div>
					<div class="primary-box flex-column">
						<div
							class="dot-bg"
							style="position: absolute;
                    left: -45px;
                    top: 4px;}"
						>
							<span class="material-icons" style="font-size:18px;padding-top:3px">local_cafe</span>
						</div>
						<div class="primary-text flex">
							<a-radio-group v-model="activityDone" @change="onChangeActivityDone" style="text-align:left" title="變更已完成">
								<a-radio :value="item.data.activityId">
									<!--{{item.data.activityId}}-->
									<span v-show="item.data.activityTypeName">({{ item.data.activityTypeName }})</span>
									- {{ item.data.activityNote }}
								</a-radio>
							</a-radio-group>
							<!--<span>{{item.data.activityNote}}</span>-->
							<span class="mgnLeftAuto">
								<a-button @click="editActivity(item)">修改</a-button>
								<a-button @click="delActivity(item)">刪除</a-button>
							</span>
						</div>

						<div class="default-text" style="text-align:left;">{{ item.timestamp }} • Tony Cheng</div>
					</div>
				</a-timeline-item>
			</a-timeline>
			<div class="default-text" v-else>你還沒有即將到來的活動</div>
			<div class="link-text">安排一項活動</div>
		</div>
		<div class="detailUI-no-activity flex-column">
			<div class="add-btn-line"><a-button class="default-btn long-btn" shape="round">已完成</a-button></div>
		</div>

		<a-tabs class="footer-tabs" v-if="tabsArray_1.length" v-model="currentTimelineTab">
			<a-tab-pane v-for="(item, index) in tabsArray_1" :key="item.name" :tab="item.name">
				<div v-if="item.name == '全部'" class="footer-tabs__body">
					<!-- <a-timeline class="footer-tabs__timeline">
                        <a-timeline-item v-for="(item, index) in noteData" :key="index">
                            <div slot="dot" class="dot-bg flex">
                                <a-icon type="clock-circle" />
                            </div>
                            <div class="primary-box flex-column">
                                <div class="primary-text flex">
                                    <a-icon :style="{ color: '#06A742' }"
                                            theme="filled" 
                                            type="check-circle" />
                                    (<span v-show="item.noteType.type_title">{{item.noteType.type_title}}</span>) 
                                    <span v-show="!item.isShowEdit">{{item.text_desc}}</span>
                                    <a-input placeholder="" v-show="item.isShowEdit" v-model="item.text_desc" />
                                    <span class="mgnLeftAuto" v-show="!item.isShowEdit">
                                    <a-button @click="editNote(item)">修改</a-button>
                                    <a-button @click="delNote(item)">刪除</a-button>
                                    </span>
                                </div>
                                <div v-show="item.isShowEdit">
                                    <a-button @click="editNoteSave(item)">存檔</a-button>
                                    <a-button>取消</a-button>
                                </div>
                                <div class="default-text">2021.03.22 18:00 • Tony Cheng</div>
                            </div>
                        </a-timeline-item>
                    </a-timeline>
                    <MyTimeline :showData="noteData" @edit="editNote" @del="delNote" @save="editNoteSave"/> -->
					<!--/////////-->
					<a-timeline class="my-timeline" v-if="customerTimeLineList">
						<a-timeline-item v-for="(item, index) in customerTimeLineList" :title="item.data.activityTypeName" :key="index">
							<div slot="dot" class="dot-bg flex">
								<span class="material-icons" style="font-size:18px" v-if="item.objectType == 'note'">event_note</span>
								<span class="material-icons" style="font-size:18px" v-if="item.objectType == 'activity'">local_cafe</span>
							</div>

							<div class="primary-box flex-column">
								<div class="primary-text flex" v-show="item.objectType == 'note'">
									<a-icon :style="{ color: '#06A742' }" theme="filled" type="check-circle" />
									<span v-show="item.data.noteType">({{ item.data.noteTypeName }})</span>
									<span v-show="!item.isShowEdit">{{ item.data.content }}</span>
									<!---->
									<a-input placeholder="" v-show="item.isShowEdit" v-model="item.data.editContent" />
									<span class="mgnLeftAuto" v-show="!item.isShowEdit">
										<!---->
										<a-button @click="editNote(item)">修改</a-button>
										<a-button @click="delNote(item)">刪除</a-button>
									</span>
								</div>
								<div v-show="item.isShowEdit">
									<a-button @click="editNoteSave(item)">存檔</a-button>
									<a-button @click="CancelNote(item)">取消</a-button>
								</div>
								<div class="primary-text flex" v-show="item.objectType == 'activity'">
									<a-icon :style="{ color: '#06A742' }" theme="filled" type="check-circle" />
									<span v-show="item.data.activityTypeName">({{ item.data.activityTypeName }})</span>
									<span>{{ item.data.activityNote }}</span>
									<span class="mgnLeftAuto">
										<a-button @click="editActivity(item)">修改</a-button>
										<a-button @click="delActivity(item)">刪除</a-button>
									</span>
								</div>

								<div class="default-text">{{ item.timestamp }} • Tony Cheng</div>
							</div>
						</a-timeline-item>
						<!--
                      <a-timeline-item v-for="(item, index) in showData" :title="item.manageDetailType.type_name" :key="index">
                          <div slot="dot" class="dot-bg flex">
                            <span class="material-icons" style="font-size:18px" v-if="showData[0].manageDetailType">
                          {{showData[0].manageDetailType.type_icon}}
                            </span>
                          </div>

                          <div class="primary-box flex-column">
                              <div class="primary-text flex">
                                  <a-icon :style="{ color: '#06A742' }"
                                                      theme="filled" 
                                                      type="check-circle" />
                                              (<span v-show="item.noteType.type_title">{{item.noteType.type_title}}</span>) 
                                  <span v-show="!item.isShowEdit">{{item.text_desc}}</span>
                                  <a-input placeholder="" v-show="item.isShowEdit" v-model="item.text_desc" />
                                  <span class="mgnLeftAuto" v-show="!item.isShowEdit">
                                      <a-button @click="edit(item)">修改</a-button>
                                      <a-button @click="del(item)">刪除</a-button>
                                  </span>
                              </div>

                              <div v-show="item.isShowEdit">
                                  <a-button @click="save(item)">存檔</a-button>
                                  <a-button>取消</a-button>
                              </div>

                              <div class="default-text">2021.03.22 18:00 • Tony Cheng</div>
                          </div>
                      </a-timeline-item>
                      -->
					</a-timeline>
					<!--////////-->
				</div>

				<div v-else-if="item.name == '筆記'" class="footer-tabs__body">
					<MyTimeline :showData="timelineShowData" :show="item.name == '筆記'" @handle="onTimelineHandle" />
				</div>
				<!--
                <div v-else-if="item.name == '活動'">
                    <MyTimeline :showData="activityData" @edit="editNote" @del="delNote" @save="editNoteSave"/>
                </div>-->
				<p v-else class="footer-tabs__body">{{ item.content }}</p>
			</a-tab-pane>
		</a-tabs>

		<!-- //用戶詳情抽屜 -->
		<a-modal title="增加交易" :visible="isDrawerShow" :confirm-loading="confirmBusinessLoading" @ok="handleBusinessOK" @cancel="handleCancel" :footer="false" width="750px">
			<AddBusiness msg="增加交易" :show="isDrawerShow" :formEdit="formEditBusiness" @handleOk="handleBusinessOK" @handleCancel="handleCancel" />
		</a-modal>

		<a-modal
			title="修改活動"
			:visible="isActivityDrawerShow"
			:confirm-loading="confirmBusinessLoading"
			@ok="handleActivityOK"
			@cancel="handleActivityCancel"
			width="70%"
			:footer="false"
		>
			<AddCalendar msg="修改活動" :formEdit="formEditActivity" @handleOk="handleActivityOK" @handleCancel="handleActivityCancel" />
		</a-modal>

		<a-modal
			title="修改客戶"
			:visible="isCustomerDrawerShow"
			:confirm-loading="confirmBusinessLoading"
			@ok="handleCustomerOK"
			@cancel="handleCustomerCancel"
			width="70%"
			:footer="false"
		>
			<!-- <AddCust msg="修改客戶" :formEdit="currentData" @handleOk="handleCustomerOK" @handleCancel="handleCustomerCancel" /> -->
		</a-modal>
	</div>
</template>
<script>
import Tab from '@/components/Common/myTabs/Tab';
import Tabs from '@/components/Common/myTabs/Tabs';
import Mail from '@/components/Mail/ComposeCard';
import AddCalendar from '@/components/Calendar/AddCalendar.vue';
import AddBusiness from '@/components/Business/AddBusiness';
// import AddCust from '@/components/Customer/AddCust.vue';
import ModelCard from '@/components/Mail/ModelCard.vue';
import MyTimeline from '@/components/Common/myTimeline';
import Api from '@/services/api';
export default {
	components: {
		Tabs,
		Tab,
		Mail,
		AddCalendar,
		AddBusiness,
		// AddCust,
		ModelCard,
		MyTimeline
	},
	props: ['currentData'],
	// props: {
	//     listData: {
	//         type: Array,
	//         default: []
	//     },
	// },
	data() {
		return {
			currentIsWin: this.currentData.isWin,
			activityDone: 0,
			isCustomerDrawerShow: false, //修改客戶

			isDrawerShow: false,
			tabsArray: [],
			active: 0,
			tabsArray_1: [],
			currentNote: {
				text_desc: ''
			},
			today: new Date(),
			tomorrowDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
			//formEditData:{},
			isModelCardShow: false,
			editNoteObj: {},
			currentEditId: 99999999,
			currentEditShow: false,
			defaultNoteTypeTitle: this.$store.state.note.noteType[0].type_title,
			defaultNoteTypeKey: this.$store.state.note.noteType[0].key,
			defaultNoteTypeNoteType: this.$store.state.note.noteType[0].noteType,
			formEditBusiness: {
				editType: 'add',
				companyId: '',
				currencyId: '',
				customerId: '',
				customerName: '',
				dealDate: this.$moment(new Date()).format('YYYY-MM-DD hh:mm:ss'), //"2021-11-30 12:00:00",
				emailList: [
					{
						id: '0',
						email: 'uuu@gmail.com',
						type: 'work'
					}
				],
				money: 0,
				ownerUser: '1',
				phoneList: [
					{
						id: '0',
						phone: '09876543',
						type: 'work'
					}
				],
				salesFlowId: 48,
				salesStageId: '0',
				title: '',
				businessFlowList: this.businessFlowList
			},
			confirmBusinessLoading: false,
			headers: {
				authorization: 'authorization-text'
			},
			isActivityDrawerShow: false,
			formEditActivity: {
				dealId: this.currentData.dealId,
				customerId: this.currentData.customerId,
				editType: 'add',
				subject: '',
				contact: '',
				companyId: this.currentData.companyId,
				companyName: this.currentData.companyName,
				last_date: this.$moment(new Date(new Date().getTime() + 24 * 60 * 60 * 1000)).format('YYYY-MM-DD hh:mm:ss'),
				start: this.$moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
				end: this.$moment(new Date(new Date().getTime() + 24 * 60 * 60 * 1000)).format('YYYY-MM-DD hh:mm:ss'),
				publicDescription: '',
				activityTypeId: 1,
				activityTypeName: '',
				activityNote: 'meet',
				activityParticipants: [
					// {
					//   customerId: this.currentData.customerId,
					//   customerName: "Momo",
					//   isCreate: false,
					// },
				],
				activityTypeCode: 'mobile',
				activityVisitors: [
					// {
					//   customerId: this.currentData.customerId,
					//   customerName: null,
					//   email: "655323@qq.com",
					// },
				],
				busyFlag: '0',
				done: false,
				editContent: '',
				location: '',
				locationGeocoded: '',
				ownerName: this.currentData.ownerUserName,
				ownerUser: this.currentData.ownerUser.toString()
			},
			addCurrentNotePromise: '', //要新增的API
			timelineShowData: [], //用於存儲頁面展示的時間軸的資料
			currentTimelineTab: '全部'
		};
	},
	created() {
		console.log('created');
		//this.clearForm();
	},
	computed: {
		customerTimeLineArry() {
			let tempCustomerTimeLineArry = [...this.$store.state.main.customerTimeLineList];
			this.$util.console(this.$store.state.main.customerTimeLineList, 'tempCustomerTimeLineArry');
			console.log('tempCustomerTimeLineArry', tempCustomerTimeLineArry);
			return tempCustomerTimeLineArry;
		},
		//客戶時間軸
		customerTimeLineList() {
			let tempCustomerTimeLineList = [];
			//客戶時間軸
			if (this.$store.state.main.customerTimeLineList.list) {
				//this.$message.warning('客戶時間軸資料')
				tempCustomerTimeLineList = [...this.$store.state.main.customerTimeLineList.list];
				console.log('tempCustomerTimeLineList', tempCustomerTimeLineList);

				tempCustomerTimeLineList.forEach(item => {
					item.data.editContent = item.data.content;
					if (item.data.noteId == this.currentEditId) {
						item.isShowEdit = this.currentEditShow;
					} else {
						item.isShowEdit = false;
					}
				});
				return tempCustomerTimeLineList;
			} else {
				//this.$message.warning('客戶時間軸無資料')
				//console.log("this.$store.state.main.customerTimeLineList.list",this.$store.state.main.customerTimeLineList.list)
				//交易時間軸
				let tempCustomerTimeLineList = [];
				if (this.$store.state.business.businessDealTimeLineList.list) {
					//this.$message.warning('客戶時間軸資料')
					tempCustomerTimeLineList = [...this.$store.state.business.businessDealTimeLineList.list];
					console.log('tempCustomerTimeLineList', tempCustomerTimeLineList);

					tempCustomerTimeLineList.forEach(item => {
						item.data.editContent = item.data.content;
						if (item.data.noteId == this.currentEditId) {
							item.isShowEdit = this.currentEditShow;
						} else {
							item.isShowEdit = false;
						}
					});
					return tempCustomerTimeLineList;
				}
			}
		},
		businessDealPlanActivityList() {
			let tempPlanActivityList = [];
			tempPlanActivityList = [...this.$store.state.business.businessDealPlanActivityList.list];
			return tempPlanActivityList;
		},
		//客戶計畫中的活動資訊
		customerPlanActivityList() {
			//this.$message.warning('客戶時間軸資料')
			let planActivityList = [];
			if (this.currentData.dealId && this.$store.state.business.businessDealPlanActivityList.list) {
				planActivityList = [...this.$store.state.business.businessDealPlanActivityList.list];
			} else {
				if (this.$store.state.main.customerPlanActivityList.list) {
					planActivityList = [...this.$store.state.main.customerPlanActivityList.list];
					console.log('planActivityList', planActivityList);
				}
			}
			return planActivityList;
		},
		noteType() {
			console.log('computed');
			//let noteFirstName = this.$store.state.note.noteType[0].type_title
			let tempObj = [...this.$store.state.note.noteType];
			console.log('noteType tempObj', tempObj);
			return tempObj;
			// return this.$store.getter.getCustomerData
		},
		// currentCustomer () {
		//   // console.log('獲取vuex的客戶清單',this.$store.state.customerData);
		//   let tempObj = [ ...this.$store.state.main.currentCustomer ]
		//    console.log('currentCustomer',tempObj);
		//   return tempObj
		//   // return this.$store.getter.getCustomerData

		// },
		noteData() {
			// console.log('獲取vuex的客戶清單',this.$store.state.customerData);
			let tempObj = [...this.$store.state.note.noteData];
			tempObj.forEach(item => {
				item.isShowEdit = false;
			});
			console.log('tempObj', tempObj);

			tempObj.forEach(item => {
				if (item.key == this.currentEditId) {
					item.isShowEdit = this.currentEditShow;
				}
			});
			return tempObj;
			// return this.$store.getter.getCustomerData
		},
		// activityData () {
		//     return this.$store.state.activity.activityData;
		// },
		manageDetailType() {
			let tempType = [...this.$store.state.main.manageDetailType];
			console.log('tempType', tempType);
			tempType = tempType.filter(item => {
				return item.type_eng_name != 'all' && item.type_eng_name != 'log' && item.type_eng_name != 'business';
			});
			return tempType;
		},
		manageDetailType2() {
			let tempType2 = [...this.$store.state.main.manageDetailType];
			console.log('tempType2', tempType2);
			tempType2 = tempType2.filter(item => {
				return item.type_eng_name != 'line';
			});
			return tempType2;
		}
	},
	watch: {
		currentTimelineTab: {
			immediate: true,
			deep: true,
			handler(newValue, oldValue) {
				if (newValue == '筆記') {
					this.timelineShowData = this.customerTimeLineList.filter(item => item.objectType == 'note');
					this.$util.console(this.timelineShowData, '處理好後的筆記資料');
				}
			}
		},
		customerTimeLineList: {
			immediate: true,
			deep: true,
			handler(newValue, oldValue) {
				if (newValue != oldValue) {
					this.timelineShowData = this.customerTimeLineList.filter(item => item.objectType == 'note');
					this.$util.console(this.timelineShowData, '處理好後的筆記資料');
				}
			}
		}
	},
	methods: {
		clearForm() {
			// this.formEditData = {
			//   subject: "開會",
			//   deal: "deal",
			//   contact: "Hellen",
			//   email: "Hellen@gmail.com",
			//   tel: "02-23123234",
			//   organization: "組織",
			//   last_date: "2021-03-03",
			//   start:this.$moment(new Date()).format('YYYY-MM-DD'),
			//   end:this.$moment(new Date(new Date().getTime() + 24 * 60 * 60 * 1000)).format('YYYY-MM-DD'),
			// }
		},
		saveNote() {
			if (!this.currentNote.text_desc) return this.$message.warning('筆記未填寫內容！');
			//let tmpRecord = { ...this.noteData };
			// tmpRecord.editType = "edit";
			// tmpRecord.subject = tmpRecord.subject

			//let tmpRecord = { ...this.noteData };

			//console.log("tmpRecord",tmpRecord)
			//   console.log("currentData", this.currentData);
			//   console.log("noteData length", Object.keys(this.noteData));
			//   console.log("currentNote", this.currentNote);
			// console.log("currentCustomer",this.$store.state.main.currentCustomer )
			//   console.log("noteData", this.noteData);
			//   console.log("defaultNoteTypeTitle", this.defaultNoteTypeTitle);
			if (this.defaultNoteTypeKey == 0) {
				let tempNoteType = [...this.noteType];
				let tempObj = {};
				tempNoteType.forEach(item => {
					if (item.key == this.defaultNoteTypeKey) {
						tempObj.key = item.key;
						tempObj.type_title = item.type_title;
						tempObj.noteType = item.noteType;
					}
				});
				this.currentNote.noteType = tempObj;
			}

			if (this.currentData.dealId) {
				//新增交易筆記
				this.currentNote.dealId = this.currentData.dealId;
				this.addCurrentNotePromise = 'addBusinessDealNote';
			} else {
				//新增客戶筆記
				let tempCust = { ...this.$store.state.main.currentCustomer };
				this.currentNote.customerId = tempCust.id;
				this.addCurrentNotePromise = 'addCustomerNote';
			}
			this.currentNote.content = this.currentNote.text_desc;
			this.currentNote.noteType = this.currentNote.noteType.noteType;

			this.currentNote.manageDetailType = {
				type_id: 1,
				type_name: '筆記',
				type_eng_name: 'note',
				type_icon: 'event_note'
			};
			console.log('noteData 筆記', this.currentNote);

			// this.$store.dispatch('note/addNoteData',this.currentNote).then(res => {
			//   if (res) {
			//     this.$message.success('添加Note成功！');
			//     this.currentNote = {}
			//   console.log("noteData",this.noteData)
			//   }
			// })
			if (this.addCurrentNotePromise == 'addBusinessDealNote') {
				//新增交易筆記

				this.$api.business.addBusinessDealNote(this.currentNote).then(res => {
					console.log('getMessageList請求回來的數據為：', res);
					if (res.success != true) return this.$message.error('請求新增筆記失敗');

					//resolve(true);
					//   this.$util.console(this.currentNote.text_desc, '清空之前');
					this.currentNote.text_desc = '';
					//   this.$util.console(this.currentNote.text_desc, '清空之後');
					this.$message.success('請求新增筆記成功');
					//分頁查詢客戶時間線資訊
					this.getQueryCustomerTimelinePageList(this.currentNote);

					// Api.customer.queryCustomerTimelinePageList(this.currentNote).then(res => {
					//   console.log('getCustomerList請求回來的數據為：', res);
					//   if (res.success == false) {
					//     //alert('查詢客戶時間線資訊失敗')
					//       resolve(false);
					//       this.$message.error('請求客戶時間線資訊失敗');
					//   } else {
					//       //this.$message.success('請求客戶時間線資訊成功');
					//       //alert('查詢客戶時間線資訊成功')
					//       console.log('res.data', res.data);

					//       this.$store.dispatch('main/getCustomerTimeLineList',res.data).then(res => {
					//         if (res) {
					//             //延遲0.8秒開詳細頁
					//             this.$message.success('添加客戶時間線資訊成功！');
					//             resolve(true);
					//             // setTimeout(() => {
					//             //   this.isDrawerShow = true;
					//             //   let drawerCurrentData = record
					//             //   drawerCurrentData.isDrawerShow = this.isDrawerShow
					//             //   this.$emit('showDrawer', drawerCurrentData);
					//             //   this.$message.success('添加getCurrentCustomer成功！');

					//             //   //resolve(true);
					//             // }, 800);

					//         }
					//       })
					//   };
					// })

					// this.$store.dispatch('main/getCustomerTimeLineList',this.currentNote).then(res => {
					//   if (res) {
					//       // setTimeout(()=>{
					//       //   //this.isLoggingIn = false
					//       //   setTimeout(() => this.getCustomerTimelinePageList(),1000)
					//       // },1000)
					//       //alert("請求成功")
					//       resolve(true);
					//       this.currentNote.text_desc = ""

					//   }
					// })
				});
			} else {
				this.$api.customer.addCustomerNote(this.currentNote).then(res => {
					console.log('getMessageList請求回來的數據為：', res);
					if (res.success != true) return this.$message.error('請求新增筆記失敗');
					this.$util.console(this.currentNote.text_desc, '清空之前');
					this.currentNote.text_desc = '';
					this.$util.console(this.currentNote.text_desc, '清空之後');
					//resolve(true);
					this.$message.success('請求新增筆記成功');
					//分頁查詢客戶時間線資訊
					this.getQueryCustomerTimelinePageList(this.currentNote);

					// Api.customer.queryCustomerTimelinePageList(this.currentNote).then(res => {
					//   console.log('getCustomerList請求回來的數據為：', res);
					//   if (res.success == false) {
					//     //alert('查詢客戶時間線資訊失敗')
					//       resolve(false);
					//       this.$message.error('請求客戶時間線資訊失敗');
					//   } else {
					//       //this.$message.success('請求客戶時間線資訊成功');
					//       //alert('查詢客戶時間線資訊成功')
					//       console.log('res.data', res.data);

					//       this.$store.dispatch('main/getCustomerTimeLineList',res.data).then(res => {
					//         if (res) {
					//             //延遲0.8秒開詳細頁
					//             this.$message.success('添加客戶時間線資訊成功！');
					//             resolve(true);
					//             // setTimeout(() => {
					//             //   this.isDrawerShow = true;
					//             //   let drawerCurrentData = record
					//             //   drawerCurrentData.isDrawerShow = this.isDrawerShow
					//             //   this.$emit('showDrawer', drawerCurrentData);
					//             //   this.$message.success('添加getCurrentCustomer成功！');

					//             //   //resolve(true);
					//             // }, 800);

					//         }
					//       })
					//   };
					// })

					// this.$store.dispatch('main/getCustomerTimeLineList',this.currentNote).then(res => {
					//   if (res) {
					//       // setTimeout(()=>{
					//       //   //this.isLoggingIn = false
					//       //   setTimeout(() => this.getCustomerTimelinePageList(),1000)
					//       // },1000)
					//       //alert("請求成功")
					//       resolve(true);
					//       this.currentNote.text_desc = ""

					//   }
					// })
				});
			}
		},
		//分頁查詢交易時間線資訊
		getQueryCustomerTimelinePageList(formEdit) {
			console.log('formEdit', formEdit);
			if (this.addCurrentNotePromise == 'addBusinessDealNote') {
				//新增交易筆記
				//分頁查詢交易時間線資訊
				return new Promise((resolve, reject) => {
					Api.business.queryBusinessDealTimelinePageList(formEdit).then(res => {
						console.log('getBusinessDealList請求回來的數據為：', res);
						if (res.success == false) {
							//alert('查詢交易時間線資訊失敗')
							resolve(false);
							this.$message.error('請求交易時間線資訊失敗');
						} else {
							//this.$message.success('請求交易時間線資訊成功');
							//alert('查詢交易時間線資訊成功')
							console.log('res.data', res.data);

							this.$store.dispatch('business/getBusinessDealTimeLineList', res.data).then(res => {
								if (res) {
									//this.$message.success('添加客戶時間線資訊成功！');
									this.addCurrentNotePromise == '';
								}
							});

							//查詢客戶計畫中的活動資訊

							Api.business.queryBusinessDealPlanActivityPageList(formEdit).then(res => {
								console.log('queryBusinessDealPlanActivityPageList 請求回來的數據為：', res);
								if (res.success == false) {
									//alert('查詢客戶計畫中的活動資訊失敗')
									resolve(false);
									this.$message.error('請求查詢交易計畫中的活動資訊失敗');
								} else {
									//this.$message.success('請求查詢客戶計畫中的活動資訊成功');
									//alert('查詢客戶計畫中的活動資訊成功')
									console.log('res.data', res.data);

									this.$store.dispatch('business/getBusinessDealPlanActivityPageList', res.data).then(res => {
										if (res) {
											//延遲0.8秒開詳細頁
											//this.$message.success('修改客戶計畫中的活動資訊成功！');

											this.currentEditShow = false;
											this.currentEditId = 99999999;
											this.$emit('handleOk');
											//this.initData();
											resolve(true);
											// setTimeout(() => {
											//   this.isDrawerShow = true;
											//   let drawerCurrentData = record
											//   drawerCurrentData.isDrawerShow = this.isDrawerShow
											//   this.$emit('showDrawer', drawerCurrentData);
											//   this.$message.success('添加getCurrentCustomer成功！');

											//   //resolve(true);
											// }, 800);
										}
									});
								}
							});
						}
					});
				});
			} else {
				//分頁查詢客戶時間線資訊
				return new Promise((resolve, reject) => {
					Api.customer.queryCustomerTimelinePageList(formEdit).then(res => {
						console.log('getCustomerList請求回來的數據為：', res);
						if (res.success == false) {
							//alert('查詢客戶時間線資訊失敗')
							resolve(false);
							this.$message.error('請求客戶時間線資訊失敗');
						} else {
							//this.$message.success('請求客戶時間線資訊成功');
							//alert('查詢客戶時間線資訊成功')
							console.log('res.data', res.data);

							this.$store.dispatch('main/getCustomerTimeLineList', res.data).then(res => {
								if (res) {
									//this.$message.success('添加客戶時間線資訊成功！');
								}
							});

							//查詢客戶計畫中的活動資訊
							Api.customer.queryCustomerPlanActivityPageList(formEdit).then(res => {
								console.log('queryCustomerPlanActivityPageList請求回來的數據為：', res);
								if (res.success == false) {
									//alert('查詢客戶計畫中的活動資訊失敗')
									resolve(false);
									this.$message.error('請求查詢客戶計畫中的活動資訊失敗');
								} else {
									//this.$message.success('請求查詢客戶計畫中的活動資訊成功');
									//alert('查詢客戶計畫中的活動資訊成功')
									console.log('res.data', res.data);

									this.$store.dispatch('main/getCustomerPlanActivityPageList', res.data).then(res => {
										if (res) {
											//延遲0.8秒開詳細頁
											//this.$message.success('修改客戶計畫中的活動資訊成功！');

											this.currentEditShow = false;
											this.currentEditId = 99999999;
											this.$emit('handleOk');
											//this.initData();
											resolve(true);
											// setTimeout(() => {
											//   this.isDrawerShow = true;
											//   let drawerCurrentData = record
											//   drawerCurrentData.isDrawerShow = this.isDrawerShow
											//   this.$emit('showDrawer', drawerCurrentData);
											//   this.$message.success('添加getCurrentCustomer成功！');

											//   //resolve(true);
											// }, 800);
										}
									});
								}
							});
						}
					});
				});
			}
		},
		//分頁查詢交易時間線資訊
		getQueryBusinessDealTimelinePageList(formEditData) {
			//分頁查詢交易時間線資訊
			return new Promise((resolve, reject) => {
				Api.business.queryBusinessDealTimelinePageList(formEditData).then(res => {
					console.log('queryBusinessDealTimelinePageList 請求回來的數據為：', res);
					if (res.success == false) {
						//alert('查詢交易時間線資訊失敗')
						resolve(false);
						//this.$message.error("請求交易時間線資訊失敗");
					} else {
						//this.$message.success('請求交易時間線資訊成功');
						//alert('查詢交易時間線資訊成功')
						console.log('res.data', res.data);

						this.$store.dispatch('business/getBusinessDealTimeLineList', res.data).then(res => {
							if (res) {
								//this.$message.success('添加客戶時間線資訊成功！');
							}
						});

						//查詢交易計畫中的活動資訊
						Api.business.queryBusinessDealPlanActivityPageList(formEditData).then(res => {
							console.log('queryBusinessDealPlanActivityPageList 請求回來的數據為：', res);
							if (res.success == false) {
								//alert('查詢交易計畫中的活動資訊失敗')
								resolve(false);
								this.$message.error('請求查詢交易計畫中的活動資訊失敗');
							} else {
								//this.$message.success('請求查詢交易計畫中的活動資訊成功');
								//alert('查詢交易計畫中的活動資訊成功')
								console.log('res.data', res.data);

								this.$store.dispatch('business/getBusinessDealPlanActivityPageList', res.data).then(res => {
									if (res) {
										//延遲0.8秒開詳細頁
										this.$message.success('修改交易計畫中的活動資訊成功！');
										this.$emit('handleOk');
										resolve(true);
										// setTimeout(() => {
										//   this.isDrawerShow = true;
										//   let drawerCurrentData = record
										//   drawerCurrentData.isDrawerShow = this.isDrawerShow
										//   this.$emit('showDrawer', drawerCurrentData);
										//   this.$message.success('添加getCurrentCustomer成功！');

										//   //resolve(true);
										// }, 800);
									}
								});
							}
						});
					}
				});
			});
		},
		editNote(editObj) {
			console.log('editObj', editObj);
			this.currentEditShow = true;
			this.currentEditId = editObj.data.noteId;
			// this.currentEditShow = true
			// this.currentEditId = editObj.key
		},
		CancelNote() {
			this.currentEditShow = false;
			this.currentEditId = 999999;
		},
		editNoteSave(editObj) {
			console.log('editObj', editObj);

			let tempEditObj = {};
			if (editObj.data.bizTypeCode == 'business_deal') {
				//交易
				tempEditObj = {
					content: editObj.data.editContent,
					dealId: parseInt(editObj.data.relationBizId),
					noteId: editObj.data.noteId,
					noteType: editObj.data.noteType
				};
				this.addCurrentNotePromise = 'addBusinessDealNote';
				return new Promise((resolve, reject) => {
					console.log('reject', reject);
					Api.business.editBusinessDealNote(tempEditObj).then(res => {
						console.log('修改客戶Note 請求回來的資料為：', res);
						if (res.success == false) {
							//alert('查詢客戶時間線資訊失敗')
							resolve(false);
							this.$message.error('請求修改客戶Note失敗');
						} else {
							this.$message.success('請求修改客戶Note成功');
							//alert('查詢修改客戶Note成功')
							console.log('res.data', res.data);
							//分頁查詢客戶時間線資訊
							this.getQueryCustomerTimelinePageList(tempEditObj);
							resolve(true);
						}
					});
				});
			} else {
				//客戶
				tempEditObj = {
					content: editObj.data.editContent,
					customerId: parseInt(editObj.data.relationBizId),
					noteId: editObj.data.noteId,
					noteType: editObj.data.noteType
				};

				return new Promise((resolve, reject) => {
					console.log('reject', reject);
					Api.customer.editCustomerNote(tempEditObj).then(res => {
						console.log('修改客戶Note 請求回來的資料為：', res);
						if (res.success == false) {
							//alert('查詢客戶時間線資訊失敗')
							resolve(false);
							this.$message.error('請求修改客戶Note失敗');
						} else {
							this.$message.success('請求修改客戶Note成功');
							//alert('查詢修改客戶Note成功')
							console.log('res.data', res.data);
							//分頁查詢客戶時間線資訊
							this.getQueryCustomerTimelinePageList(tempEditObj);
							// Api.customer.queryCustomerTimelinePageList(tempEditObj).then(res => {
							//     console.log('getCustomerList請求回來的數據為：', res);
							//     if (res.success == false) {
							//       //alert('查詢客戶時間線資訊失敗')
							//         resolve(false);
							//         this.$message.error('請求客戶時間線資訊失敗');
							//     } else {
							//         //this.$message.success('請求客戶時間線資訊成功');
							//         //alert('查詢客戶時間線資訊成功')
							//         console.log('res.data', res.data);

							//         this.$store.dispatch('main/getCustomerTimeLineList',res.data).then(res => {
							//           if (res) {
							//               //延遲0.8秒開詳細頁
							//               this.$message.success('添加客戶時間線資訊成功！');

							//               this.currentEditShow = false
							//               this.currentEditId = 99999999;

							//               resolve(true);
							//               // setTimeout(() => {
							//               //   this.isDrawerShow = true;
							//               //   let drawerCurrentData = record
							//               //   drawerCurrentData.isDrawerShow = this.isDrawerShow
							//               //   this.$emit('showDrawer', drawerCurrentData);
							//               //   this.$message.success('添加getCurrentCustomer成功！');

							//               //   //resolve(true);
							//               // }, 800);

							//           }
							//         })
							//     };
							// })
							resolve(true);
						}
					});
				});
			}

			// this.$store.dispatch('note/editNoteData',editObj).then(res => {
			//   if (res) {
			//     this.$message.success('修改Note成功！');
			//     this.currentNote = {}
			//     this.currentEditShow = false
			//     this.currentEditId = 99999
			//   console.log("noteData",this.noteData)
			//   }
			// })
		},
		delNote(editObj) {
			if (editObj.data.bizTypeCode == 'business_deal') {
				this.addCurrentNotePromise = 'addBusinessDealNote';
				editObj.noteId = editObj.data.noteId;
				editObj.customerId = this.currentData.customerId;
				editObj.dealId = editObj.data.relationBizId;
			} else {
				editObj.noteId = editObj.data.noteId;
				editObj.customerId = this.currentData.customerId;
			}
			console.log('editObj', editObj);
			let str = '';
			if (editObj.objectType == 'activity') {
				str += editObj.data.activityNote;
			} else {
				str += editObj.data.noteType + '-' + editObj.data.content;
			}

			let that = this;
			this.$confirm({
				title: '確認刪除?',
				content: str,
				okText: '確認刪除',
				okType: '取消',
				cancelText: 'No',
				onOk() {
					console.log('OK');

					// that.$store.dispatch('note/delNoteData',editObj).then(res => {
					//   if (res) that.$message.success('刪除活動成功！');
					// })
					if (that.addCurrentNotePromise == 'addBusinessDealNote') {
						return new Promise((resolve, reject) => {
							Api.business.deleteBusinessDealNote(editObj).then(res => {
								console.log('deleteBusinessDealNote請求回來的數據為：', res);
								if (res.success != true) {
									resolve(false);
									that.$message.error('請求刪除筆記失敗');
								} else {
									that.$message.success('請求刪除筆記成功');
									//分頁查詢客戶時間線資訊
									that.getQueryCustomerTimelinePageList(editObj);
									resolve(true);
								}
							});
						});
					} else {
						return new Promise((resolve, reject) => {
							Api.customer.deleteCustomerNote(editObj).then(res => {
								console.log('getMessageList請求回來的數據為：', res);
								if (res.success != true) {
									resolve(false);
									that.$message.error('請求刪除筆記失敗');
								} else {
									that.$message.success('請求刪除筆記成功');
									//分頁查詢客戶時間線資訊
									that.getQueryCustomerTimelinePageList(editObj);
									resolve(true);
								}
							});
						});
					}
				},
				onCancel() {
					console.log('Cancel');
				}
			});
		},
		cancelNote() {},
		showAddBusinessDrawer() {
			this.isDrawerShow = true;
			//this.$emit('showDrawer', true);
		},
		onModelCardShow(isModelCardShow) {
			this.isModelCardShow = isModelCardShow;
		},
		handleChangeNote(value) {
			console.log(`Selected: ${value}`);

			this.defaultNoteTypeKey = value;
			let tempNoteType = [...this.noteType];
			let tempObj = {};
			tempNoteType.forEach(item => {
				if (item.key == value) {
					tempObj.key = item.key;
					tempObj.type_title = item.type_title;
					tempObj.noteType = item.noteType;
				}
			});
			this.currentNote.noteType = tempObj;
			console.log(`this.currentNote:`, this.currentNote);
			console.log(`this.defaultNoteTypeKey:`, this.defaultNoteTypeKey);
		},
		handleCancel() {
			//
			this.isDrawerShow = false;
		},
		handleBusinessOK() {
			this.isDrawerShow = false;
		},
		handleUpload(info) {
			console.log('info', info);
			if (info.file.status !== 'uploading') {
				console.log(info.file, info.fileList);
			}
			if (info.file.status === 'done') {
				this.$message.success(`${info.file.name} file uploaded successfully`);
			} else if (info.file.status === 'error') {
				this.$message.error(`${info.file.name} file upload failed.`);
			}
		},
		delActivity(editData) {
			editData.activityId = editData.data.activityId;
			editData.customerId = this.currentData.customerId;
			editData.dealId = editData.data.dealId;
			console.log('editData', editData);
			let str = '';
			str += editData.data.activityNote;

			let that = this;
			this.$confirm({
				title: '確認刪除?',
				content: str,
				okText: '確認刪除',
				okType: '取消',
				cancelText: 'No',
				onOk() {
					console.log('OK');

					return new Promise((resolve, reject) => {
						Api.customer.deleteCustomerActivity(editData).then(res => {
							console.log('getMessageList請求回來的數據為：', res);
							if (res.success != true) {
								resolve(false);
								that.$message.error('請求刪除活動失敗');
							} else {
								that.$message.success('請求刪除活動成功');
								//分頁查詢客戶時間線資訊
								that.getQueryCustomerTimelinePageList(editData);
								that.getQueryBusinessDealTimelinePageList(editData);
								// Api.customer.queryCustomerTimelinePageList(editData).then(res => {
								//     console.log('getCustomerList請求回來的數據為：', res);
								//     if (res.success == false) {
								//       //alert('查詢客戶時間線資訊失敗')
								//         resolve(false);
								//         that.$message.error('請求客戶時間線資訊失敗');
								//     } else {
								//         that.$message.success('請求客戶時間線資訊成功');
								//         //alert('查詢客戶時間線資訊成功')
								//         console.log('res.data', res.data);

								//         that.$store.dispatch('main/getCustomerTimeLineList',res.data).then(res => {
								//           if (res) {
								//               //延遲0.8秒開詳細頁
								//               that.$message.success('添加客戶時間線資訊成功！');

								//               that.currentEditShow = false
								//               that.currentEditId = 99999999;

								//               resolve(true);
								//               // setTimeout(() => {
								//               //   this.isDrawerShow = true;
								//               //   let drawerCurrentData = record
								//               //   drawerCurrentData.isDrawerShow = this.isDrawerShow
								//               //   this.$emit('showDrawer', drawerCurrentData);
								//               //   this.$message.success('添加getCurrentCustomer成功！');

								//               //   //resolve(true);
								//               // }, 800);

								//           }
								//         })
								//     };
								// })
								resolve(true);
							}
						});
					});
				},
				onCancel() {
					console.log('Cancel');
				}
			});
		},
		editActivity(editData) {
			//alert("editActivity")
			console.log('editData', editData);
			this.formEditActivity = {
				dealId: this.currentData.dealId,
				customerId: this.currentData.customerId,
				activityId: editData.data.activityId,
				editType: 'edit',
				subject: editData.data.subject,
				dealTitle: '測試商機交易',
				contact: 'Hellen',
				email: 'Hellen@gmail.com',
				tel: '02-23123234',
				companyId: 1,
				companyName: '測試公司',
				organization: '組織',
				last_date: '2021-11-24 02:50:36',
				start: editData.data.planStartTime,
				end: editData.data.planEndTime,
				publicDescription: editData.data.publicDescription,
				activityTypeId: 0,
				activityTypeName: '',
				activityNote: 'meet',
				// activityParticipants: [
				//   {
				//     customerId: this.currentData.customerId,
				//     customerName: "Momo",
				//   },
				// ],
				activityTypeCode: 'mobile',
				// activityVisitors: [
				//   {
				//     customerId: this.currentData.customerId,
				//     customerName: null,
				//     email: "655323@qq.com",
				//   },
				// ],
				busyFlag: '0',
				done: editData.data.done,
				editContent: undefined,
				location: '中國上海',
				locationGeocoded: '121.472644,31.231706',
				ownerName: null,
				ownerUser: '1'
			};
			console.log('formEditActivity', this.formEditActivity);

			this.isActivityDrawerShow = true;
		},
		handleActivityCancel() {
			//
			this.isActivityDrawerShow = false;
		},
		handleActivityOK() {
			this.isActivityDrawerShow = false;
		},
		//計畫完成
		onChangeActivityDone(e) {
			console.log('activityDone', this.activityDone);
			console.log('radio checked', e.target.value);
			let tempEditActivityDone = [...this.customerPlanActivityList];

			if (this.customerPlanActivityList.length > 0) {
				tempEditActivityDone = tempEditActivityDone.filter(item => {
					return item.objectId == e.target.value;
				});
			}

			let objEditActivityDone = tempEditActivityDone[0].data;

			objEditActivityDone.customerId = this.currentData.customerId;
			objEditActivityDone.start = objEditActivityDone.planStartTime;
			objEditActivityDone.end = objEditActivityDone.planEndTime;
			objEditActivityDone.done = true;
			objEditActivityDone.activityTypeId = parseInt(objEditActivityDone.activityTypeId);

			console.log('objEditActivityDone', objEditActivityDone);

			return new Promise((resolve, reject) => {
				Api.customer.editCustomerActivity(objEditActivityDone).then(res => {
					console.log('getMessageList請求回來的數據為：', res);
					if (res.success != true) {
						resolve(false);
						this.$message.error('請求計畫完成失敗');
					} else {
						//resolve(true);
						this.$message.success('計畫完成成功');
						//分頁查詢客戶時間線資訊
						this.getQueryCustomerTimelinePageList(objEditActivityDone);
						this.getQueryBusinessDealTimelinePageList(objEditActivityDone);

						resolve(true);
					}
				});
			});
		},
		handleCustomerOK() {
			//修改客戶
			this.isCustomerDrawerShow = false;
		},
		handleCustomerCancel() {
			//修改客戶
			this.isCustomerDrawerShow = false;
		},
		clickEditCustomer() {
			//修改客戶
			console.log('this.currentData', this.currentData);
			this.isCustomerDrawerShow = true;
		},
		changeBusinessDealIsWin(checked) {
			console.log(`a-switch to ${checked}`);
			console.log('currentData', this.currentData);
			this.currentIsWin = checked;
			let updateIsWIn = {
				dealId: this.currentData.dealId,
				isWin: checked
			};
			return new Promise((resolve, reject) => {
				Api.business.updateBusinessDealIsWin(updateIsWIn).then(res => {
					console.log('updateBusinessDealIsWin 請求回來的數據為：', res);
					if (res.success != true) {
						resolve(false);
						this.$message.error('請求更新商機交易贏單輸單失敗');
					} else {
						//resolve(true);
						this.$message.success('請求更新商機交易贏單輸單成功');
						//分頁查詢客戶時間線資訊
						this.addCurrentNotePromise = 'addBusinessDealNote'; //表示要查交易的時間軸
						this.getQueryCustomerTimelinePageList(this.currentData);

						resolve(true);
					}
				});
			});
		},
		onTimelineHandle(item, handleType, type) {
			this.$util.console(item, 'item');
			this.$util.console(handleType, 'handleType');
			this.$util.console(type, 'type');
			if (type == 'note') {
				if (handleType == 'edit') this.editNote(item);
				if (handleType == 'del') this.delNote(item);
				if (handleType == 'save') this.editNoteSave(item);
				if (handleType == 'cancel') this.CancelNote(item);
			}
		}
	},
	mounted() {
		console.log('mounted');
		this.manageDetailType.forEach(item => {
			this.tabsArray.push({
				name: item.type_name,
				content: `Content of ${item.type_name}`
			});
		});
		console.log('this.tabsArray', this.tabsArray);
		this.manageDetailType2.forEach(item => {
			this.tabsArray_1.push({
				name: item.type_name,
				content: `Content of ${item.type_name}`
			});
		});
		console.log('this.manageDetailType2', this.manageDetailType2);
	}
};
</script>

<style scoped>
.my-timeline {
	margin-top: 2em;
}
.detailUI {
	max-height: 100%;
	padding: 20px 30px;
	overflow: hidden;
	/* min-width: 600px; */
	min-width: 600px;
}

/* 關鍵CSS,保證drawer-body內容超出的時候，不會整體都滾動，超出部分滾動由ant-drawer-body控制 */
.ant-drawer-wrapper-body {
	overflow: hidden;
}

.ant-drawer-body {
	overflow: auto;
}

.detailUI .flex-column {
	align-items: flex-start;
}

.detailUI-head {
	width: 100%;
	justify-content: space-between;
	padding-bottom: 20px;
	border-bottom: 1px solid #e8e8e8;
	margin-bottom: 20px;
}

.detailUI-head .username {
	margin-left: 15px;
	font-size: 20px;
	font-weight: 600;
	margin-right: 15px;
}

.detailUI-head .default-text {
	padding: 0 10px;
}

.detailUI-no-activity {
	margin-top: 35px;
	align-items: center;
}

.detailUI-no-activity .add-btn-line {
	position: relative;
	width: 100%;
}

.detailUI-no-activity .add-btn-line::before {
	content: '';
	position: absolute;
	width: 300px;
	height: 1px;
	background: #e8e8e8;
	top: 50%;
	left: 50%;
	transform: translateX(-50%);
}

.detailUI-no-activity div {
	flex: 1;
	width: 100%;
	text-align: center;
}

.detailUI-no-activity .default-text {
	font-size: 18px;
	padding: 10px 0 0 0;
}

.footer-tabs {
	margin-top: 35px;
}

.footer-tabs .ant-tabs-nav-scroll {
	float: left;
}

.footer-tabs .ant-tabs-tab {
	margin-right: 0px;
	color: #bebebe;
}

.footer-tabs .ant-tabs-nav .ant-tabs-tab-active {
	font-weight: 500;
	color: #2c3e50;
	font-size: 15px;
	text-shadow: 0 0 0.25px currentColor;
}

.footer-tabs .ant-tabs-nav .ant-tabs-tab:hover {
	color: #2c3e50;
}

.footer-tabs .ant-tabs-ink-bar {
	background-color: #f86f54;
}

.footer-tabs__body {
	width: 100%;
	padding: 20px 0;
}

/***************************/
.pipelineSummary {
  position: relative;
  height: auto;
}
.pipelineSummary .pipelineStages {
  position: relative;
  display: table;
  height: 24px;
  overflow: visible;
}
.pipelineSummary .additionalInfo {
  height: 20px;
  padding-top: 8px;
}
.pipelineSummary .pipelineStages.open ul li.active, .pipelineSummary .pipelineStages.open ul li.active .stageContent .stageArrow:after, .pipelineSummary .pipelineStages.won ul li.active, .pipelineSummary .pipelineStages.won ul li.active .stageContent .stageArrow:after {
  background: #08a742;
}
.pipelineSummary .pipelineStages ul li .stageContent {
  position: relative;
}
.pipelineSummary .pipelineStages.open ul li.active, .pipelineSummary .pipelineStages.open ul li.active .stageContent .stageArrow:after, .pipelineSummary .pipelineStages.won ul li.active, .pipelineSummary .pipelineStages.won ul li.active .stageContent .stageArrow:after {
  background: #08a742;
}
.pipelineSummary .pipelineStages ul li {
  position: relative;
  background: #e5e5e5;
  display: table-cell;
  text-align: left;
  line-height: 24px;
  vertical-align: middle;
  color: #fff;
  text-align: center;
  cursor: pointer;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.pipelineSummary .pipelineStages ul li {
  position: relative;
  background: #e5e5e5;
  display: table-cell;
  text-align: left;
  line-height: 24px;
  vertical-align: middle;
  color: #fff;
  text-align: center;
  cursor: pointer;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.pipelineSummary .additionalInfo {
  height: 20px;
  padding-top: 8px;
}
.pipelineSummary .pipelineStages ul li .stageContent {
  position: relative;
}
.pipelineSummary .pipelineStages ul li .stageContent .stagename {
  font: 400 13px/16px Source Sans Pro,sans-serif;
  display: inline-block;
  position: relative;
  left: 4px;
}
.pipelineSummary .pipelineStages ul li:first-child .stageContent .stageArrow {
  display: none;
}
.pipelineSummary .pipelineStages ul li .stageContent .stageArrow {
  width: 6px;
  height: 30px;
  position: absolute;
  top: -6px;
  left: 0;
  overflow: hidden;
}
.pipelineSummary .pipelineStages ul {
  width: 100%;
  display: table;
  border-collapse: collapse;
  table-layout: fixed;
  height: 24px;
  -ms-box-sizing: border-box;
  -o-box-sizing: border-box;
  box-sizing: border-box;
  overflow: hidden;
}
.pipelineSummary .pipelineStages ul li .stageContent .stageArrow {
  width: 6px;
  height: 30px;
  position: absolute;
  top: -6px;
  left: 0;
  overflow: hidden;
}
.pipelineSummary .pipelineStages.open ul li.active+li .stageContent .stageArrow:after, .pipelineSummary .pipelineStages.won ul li.active+li .stageContent .stageArrow:after {
  border-top: 3px solid #fff;
  border-right: 3px solid #fff;
  background: #08a742;
}
.pipelineSummary .pipelineStages ul li .stageContent .stageArrow:after {
  width: 22px;
  height: 22px;
  position: absolute;
  right: -7px;
  top: 5px;
  border-top: 3px solid #fff;
  border-right: 3px solid #fff;
  transform: scaleX(.3) rotate(
45deg
);
  content: " ";
  cursor: pointer;
  background: #e5e5e5;
}
/***************************/

.tabsGrp1 {
  margin: 0;
}

.tabsGrp1 .ant-tabs-bar {
  margin: 0;
  border: 0;
  margin-bottom: 2px;
}

.tabsGrp1 .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
  box-shadow: 0px 3px 10px #ddd;
  border-bottom: 2px solid #f97358 !important;
  color: #4e4e4e;
}

.tabsGrp1 .tabsActionTabBlock {
  display: block;
  width: 95%;
  margin: auto;
}

.tabsGrp1 .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
  height: 30px;
  line-height: 30px;
  margin-right: 0.5em;
}

.tabsGrp1 .ant-tabs-nav-container {
  margin: 0;
}

.tabsGrp1 .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-nav-container {
  height: 30px;
}

.tabsGrp1 .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
  border: 0;
  background: #fff;
}

.tabsGrp1 .tabsActionTabBlock {
  padding: 0 0.5em 0.5em 0.5em;
}

.tabsGrp1 .tabsGrpActionDiv {
  box-shadow: 0px 0px 7px #ddd;
  padding: 0.5em;
}

.tabsGrp1 .el-tabs__content {
  /* padding: 1em;
  box-shadow: -3px 0px 7px #ddd; */
}

.mgnLeftAuto{margin-left: auto;}


.mgnTop1 {
  margin-top: 1em;
}

.mgnLeft {
  margin-left: 1em;
}

/* 
  .footer-tabs__timeline {
    padding-left: 10px;
  }

  .footer-tabs__timeline .dot-bg {
    width: 26px;
    height: 26px;
    border-radius: 13px;
    justify-content: center;
    border: 1px solid #d3d3d3;
    background: #F6F6FC;
    color: #8c8c8c;
    position: relative;
  }

  .footer-tabs__timeline .dot-bg::after {
    position: absolute;
    top: 13px;
    right: 0;
    width: 10px;
    border-bottom: 2px solid #e8e8e8;
  }

  .footer-tabs__timeline .primary-box {
    min-height: 50px;
    padding: 15px;
    align-items: flex-start;
    margin-left: 20px;
    position: relative;
  }

  .footer-tabs__timeline .primary-box::before {
    content: "";
    position: absolute;
    top: 13px;
    left: -20px;
    width: 18px;
    border-bottom: 2px solid #e8e8e8;
  }

  .footer-tabs__timeline .primary-box .primary-text .anticon {
    margin-right: 5px;
    margin-top: -2px;
  }

  .footer-tabs__timeline .primary-box .default-text {
    margin-top: 3px;
    font-size: 12px;
  } */

/* .ant-tabs-nav-container {
    height: 60px;
  }

  .ant-tabs-nav-scroll {
    overflow: auto;
    height: 50px;
    display: flex;
    padding-left: 3px;
    align-items: flex-end;
  }

  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
    margin-right: 0px;
    background: #FFFEFB;
    padding: 0 20px;
    border: none;
    color: #bebebe;
  }

  .ant-tabs-tab-active {
    height: 50px;
    font-weight: 500;
    color: #2c3e50;
    margin-right: 3px;
    margin-left: 3px;
    background: #ffffff;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    box-shadow:-5px -5px 5px -4px rgb(0 0 0 / 10%),5px -5px 5px -4px rgb(0 0 0 / 10%);

  }

  .ant-tabs-tab-active::after {
    content: '';
    height: 2px;
    width: 30px;
    position: absolute;
    bottom: 0px;
    left: 0px;
    transform: translateX(50%);
    background: #F86F54;
  }

  .ant-tabs-nav .ant-tabs-tab {
    margin: 0;
  }

  .ant-tabs-nav-wrap {
    background: #FFFEFB;
  }

  .ant-tabs-tab {
    color: #bebebe;
  }

  .ant-tabs-tab:hover , .ant-tabs-tab:focus {
    color: pink;
  }

  .ant-tabs-nav .ant-tabs-tab-active {
    font-weight: 500;
    color: #2c3e50;
    margin-right: 3px;
    margin-left: 3px;
    background: #ffffff;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    box-shadow:-5px -5px 5px -4px rgb(0 0 0 / 10%),5px -5px 5px -4px rgb(0 0 0 / 10%);
    text-shadow: 0 0 0.25px currentColor;
  }

  .ant-tabs-nav .ant-tabs-tab:hover {
    color: #2c3e50;
  }

  .ant-tabs-ink-bar {
    position: absolute;
    bottom: 1px;
    left: 0;
    z-index: 1;
    box-sizing: border-box;
    width: 20;
    height: 2px;
    background-color: #F86F54;
    transform-origin: 0 0;
  } */
</style>
