<!--
 * @Descripttion: 聯絡人模組
 * @version: 
 * @Author: Lone
 * @Date: 2021-12-27 20:30:52
 * @LastEditors: Lone
 * @LastEditTime: 2022-05-11 22:31:51
-->
<template>
	<div class="personsUI padding-20 flex">
		<div v-if="showTages" class="tags-tree-black">
				<a-icon type="double-right" @click="showTages = !showTages" />
			</div>
		<!-- 標籤樹結構 --> 
		<transition name="fade">
			<TagsTree
				v-if="!showTages"
				class="tags-tree"
				type="customer"
				ref="tags-tree"
				:tagTypeList="tagTypeList"
				:selected="selectedTagsId"
				@onTagTypeChange="onTagTypeChange"
				@onSelected="onTagsSelected"
				@onShowTages="() => { showTages = !showTages }"
			/>
		</transition>

		<!-- 聯絡人主體部分 -->
		<div class="persons-content flex-1">
			<!--  聯絡人title區域 -->
			<div class="persons-content__header flex-between">
				<div class="flex-center">
					<div class="flex marginRgt-10">
						<div class="font-24 personsUI-title--big">全部檢索</div>
					</div>
					<myButton
						v-if="excutePermission(customManage.add)"
						class="marginRgt-10"
						@click="editCustomer('add', '')"
						icon="plus"
						text="客戶"
						theme="orange"
						:isRound="true"
					/>
                    <!-- todo: 选中用户后，点击刷新按钮后，选中用户的值已经为空，但是用户每行还是选中的。 -->
					<myButton class="marginRgt-10" icon="reload" :isIconBtn="true" @click="getCustomerData(true)" />

					<!-- //todo: 解決點擊空白處，隱藏添加標籤的彈窗！ -->
					<a-popover placement="rightTop" trigger="click" :visible="isUseTagShow" :overlayStyle="{ width: '300px' }">
						<template slot="title">
							<div class="flex-between">
								<span>貼標籤</span>
								<a-icon type="close" @click="onUseTagHide" />
							</div>
						</template>
						<template slot="content">
                            <a-spin :spinning="isUsingTags" tip="貼標籤中...">
                                <div v-if="tagTypeList.length && tagsTreeData.length" class="personsUI-tags-card">
                                    <a-tree
                                        checkable
                                        checkStrictly
                                        :expanded-keys="expandedKeys"
                                        :auto-expand-parent="autoExpandParent"
                                        :tree-data="tagsTreeData"
                                        @expand="onExpand"
                                        :blockNode="true"
                                        @check="onCheckTag"
                                        :checkedKeys="selectedTags"
                                        :defaultExpandAll="true"
                                    >
                                        <template slot="custom" slot-scope="item">
                                            <div class="tree-view-item">
                                                <div class="tree-view-left" @click="onSelectTag(item.id)">
                                                    <span>{{ item.title }}</span>
                                                </div>
                                            </div>
                                        </template>
                                    </a-tree>
                                </div>
                                <div v-else class="personsUI-tags-card--null flex-center gray-text" style="height: 60px;">
                                    無標籤資料，請切換標籤類型或新增標籤
                                </div>
                                <div class="flex-right">
                                    <a-button @click="onAddTags" v-if="!tagsTreeData.length">去新增標籤</a-button>
                                    <a-button @click="handleuseTags" :loading="isUsingTags" v-if="tagsTreeData.length">儲存</a-button>
                                </div>
                            </a-spin>
						</template>
						<myButton class="marginRgt-10" @click="onUseTagShow" text="貼標籤" v-if="selectedCust.length" />
					</a-popover>

					<myButton v-if="selectedCust.length && excutePermission(customManage.delete)" class="marginRgt-10" @click="delCustomer" text="刪除" />
				</div>

				<myButton icon="ellipsis" :isIconBtn="true" />
			</div>

			<!-- 聯絡人table區域 -->
			<div class="persons-content__box flex-column-between">
				<div class="persons-content__box--table default-scrollbar flex-1">
					<a-table
					class="dealsUI-table"
						:columns="columns"
						:data-source="customerData"
						:pagination="false"
						:row-selection="rowSelection"
						:expanded-row-keys.sync="expandedRowKeys"
						:loading="isTableLoading"
						size="small"
                        :scroll="{ x: 'max-content' }"
                        :rowKey="record => record.id"
						@onTagTypeChange="onTagTypeChange"
						@onShowTages="() => { showTages = !showTages }"
					>
						<div slot="name" slot-scope="name, record, idx">
							<div class="flex pointer">
							  <!-- <span class="marginRgt-10">{{ name }}</span> -->
								<a-button type="link" @click="showDrawer(idx)">{{ record.name }}</a-button>
                                <LineIcon v-if="record.channelUserId" :style="{ fontSize: '18px' }"/>
							</div>
						</div>

						<span slot="tags" slot-scope="tags, record" class="flex-wrap" style="overflow: hidden">
							<div v-for="(tag, index) in record.bizTags" :key="index">
								<a-tag style="margin-right: 8px" color="orange" v-if="tag && tag.name">{{ tag.name }}</a-tag>
							</div>
						</span>
						<div slot="sex" slot-scope="text, record">
                            <span>{{ text ? '男' : '女' }}</span>
                        </div>

                        <div slot="birthday" slot-scope="text, record">
                            <span v-if="text">{{ text | filterTime(text) }}</span>
                        </div>

                        <div slot="email" slot-scope="text, record" class="flex-wrap">
							<template v-if="record.email">
								<div>{{ record.email.email }}</div>
							</template>
							<template v-if="record.emailList && record.emailList.length">
								<div v-for="(item,emailIndex) in record.emailList" :key="emailIndex" style="margin: 3px 0">
									{{ item.email }} 
                                    <a-tag v-if="item.type == 'work'" color="blue" style="margin: 0 15px 0 2px">工作</a-tag>
                                    <a-tag v-if="item.type == 'family'" color="cyan" style="margin: 0 15px 0 2px">家庭</a-tag>
                                    <a-tag v-if="item.type == 'other'" style="margin: 0 15px 0 2px">其他</a-tag>
								</div> 
							</template>
						</div>

						<div slot="phone" slot-scope="text, record" class="flex-wrap">
							<template v-if="record.phone">
								<div>{{ record.phone.phone }}</div>
							</template>
							<template v-if="record.phoneList && record.phoneList.length">
								<div v-for="(item,phoneIndex) in record.phoneList" :key="phoneIndex" style="margin: 3px 0">
									{{ item.phone }} 
                                    <a-tag v-if="item.type == 'work'" color="blue" style="margin: 0 15px 0 2px">工作</a-tag>
                                    <a-tag v-if="item.type == 'family'" color="cyan" style="margin: 0 15px 0 2px">家庭</a-tag>
                                    <a-tag v-if="item.type == 'other'" style="margin: 0 15px 0 2px">其他</a-tag>
								</div> 
							</template>
						</div>

						<div slot="socialAccount" slot-scope="text, record" class="flex-center">
                            <div class="flex-center">
                                {{ text }} 
                                <div v-if="record.socialAccountType" class="marginLft-5" style="margin-top: -5px;">
                                    <LineIcon v-if="record.socialAccountType == 'line'" :style="{ fontSize: '18px' }"  />
                                    <a-icon v-else-if="record.socialAccountType == 'facebook'" type="facebook" theme="filled" :style="{ fontSize: '18px', background: '#fff', color: '#1278F3' }" />
                                    <a-icon v-else-if="record.socialAccountType == 'wechat'" type="wechat" theme="filled" :style="{ fontSize: '18px', background: '#fff', color: '#00C300' }" />
                                    <a-icon v-else-if="record.socialAccountType == 'twitter'" type="twitter" :style="{ fontSize: '18px', background: '#fff', color: '#1278F3' }" />
                                    <a-icon v-else-if="record.socialAccountType == 'qq'" type="qq" :style="{ fontSize: '18px', background: '#fff', color: '#1278F3' }" />
                                </div>
                            </div>
                        </div>

						<!-- <span slot="action" slot-scope="text, record" class="flex-center">
							<a-button v-if="excutePermission(customManage.updateDetail)" type="link" @click="editCustomer('edit', record)">編輯</a-button>
						</span> -->

					</a-table>
				</div>
				<div class="persons-content__box--footer marginTop-15">
					<a-pagination
                        v-if="totalCount > pageSize"
						:total="totalCount"
						:page-size="pageSize"
						v-model="params.page.currentPage"
						@change="onPageChange"
					/>
				</div>
			</div>
		</div>

		<myDrawer ref="myDrawer" :detailData="currentData" moduleType="customer" @updateUserList="getCustomerData"></myDrawer>

		<a-modal
			:dialog-style="{ top: '0px' }"
			:title="addModelTit"
			:visible="isAddCustomerShow"
			:footer="null"
			@cancel="handleCancel"
			width="750px"
			wrapClassName="customerAddLayer"
		>
			<AddCust :formEdit="custEdit" @handleOk="handleOk" @handleCancel="handleCancel" />
		</a-modal>
	</div>
</template>

<script>
import myButton from '@/components/Common/myButton'
import columns from './table-config' //引入table columns資料
import TagsTree from '@/components/Common/tagsTree/index'
import myDrawer from '@/components/public/myDrawer'
import AddCust from '@/components/public/addCustomer.vue'
import { mapGetters } from 'vuex';

import moment from 'moment'

// import { RelizeTable } from '@/components/public/relize-table';
import {
    LineIcon
} from '@/components/public/iconSvgs'

export default {
	name: 'Persons',
	components: {
		TagsTree,
		myButton,
		myDrawer,
		AddCust,
        LineIcon,
		// RelizeTable
	},
	data() {
		return {
			showTages: false,
			columns,
			isTableLoading: false,
			expandedRowKeys: [],
			selectedTags: [],
			selectedCust: [], //table中已選擇的用戶
			selectedCustData: [], //table中已選擇的用戶
			currentTablePage: 1,
			currentData: {},
			addModelTit: '新增',
			isAddCustomerShow: false,
			custEdit: {},
			params: {
				page: {
					currentPage: 1,
					pageSize: 10,
				},
			},
			tagTypeList: [],
			isUseTagShow: false,
			selectedTagsId: -1, // 是否是選擇了標籤去查詢使用者清單的標記
			expandedKeys: [],
			autoExpandParent: true,
            bizTypeCode: 'customer',
            isUsingTags: false,

		}
	},
	computed: {
		...mapGetters([
			'permissions',
			'customManage'
		]),
		customerData() {
			let tempCustomerData = this.$lodash.cloneDeep(this.$store.state.main.customerData)
			//todo: 完善單個email、phone 的類型的渲染
			if (tempCustomerData.length) {
				tempCustomerData.forEach(item => {
					if (item.email) item.email = JSON.parse(item.email)
					if (item.phone) item.phone = JSON.parse(item.phone)
				})
				// this.$util.console(tempCustomerData, '處理完成的 聯絡人列表===========');
			}
			return tempCustomerData
		},
		rowSelection() {
			return {
				//表格預設選中
				selectedRowKeys: this.selectedCust,
				onChange: (selectedRowKeys, selectedRows) => {
					// selectedRows.forEach(item => {
					//   //TODO: 解決取消選中
					//   this.selectedCust.push(item.key);
					// })
					this.selectedCust = selectedRowKeys
					this.selectedCustData = selectedRows
				},
				getCheckboxProps: record => ({
					//重點部分
					props: {
						//defaultCheckedId裡面是默認選中的id，判斷是否含有這些id，有的那就選中，沒有的就不選中
						defaultChecked: this.selectedCust.indexOf(record.key) > -1 ? true : false,
						key: record.key + '', //使得id的資料類型為string
					},
				}),
			}
		},
		totalCount() {
			return this.$store.state.main.getTotalPage.totalCount
		},
		pageSize() {
			return this.$store.state.main.getTotalPage.pageSize
			// return 13;
		},
		currentPage() {
		    let currentPage = this.$store.state.main.getTotalPage.currentPage;
		    this.currentTablePage = this.$lodash.cloneDeep(currentPage)
		    return currentPage
		},
		tagsTreeData() {
			return this.$store.state.main.tagsTreeData
		},
	},
    watch: {
        bizTypeCode: {
            immediate: true,
            deep: true,
            handler(newValue, oldValue) {
                // console.log('监听bizTypeCode', newValue, oldValue);
                if (newValue != oldValue) {
                    this.getCustomerData(true, newValue);
                }
            }
        }
    },
	mounted() {
		// fixit: 如何優化，mounted和activated的兩次請求資料，需求為： 頁面顯示，也需要刷新資料。
		this.$store.dispatch('main/getCustomerList', this.params)
		// this.getCompanyData();//取得公司資料
		// this.getTagType()
		// this.initPersonsData()
	},
	activated() {
        this.getTagType()
        if (this.isUseTagShow) this.isUseTagShow = false; 
		console.log('this.$route.params',this.$route.params)

        // 当携带参数过来时，参数为客户ID时，需要打开客户详情抽屉。
        let customerId = this.$route.params.id;
        if (customerId != null && customerId != undefined) {
            this.showDrawer(customerId)
        }
	},
    deactivated() {
			this.$refs.myDrawer.visible = false
        if (this.isUseTagShow) this.isUseTagShow = false; 
    },
	updated() {
		// 表格斑馬行顯示
		this.renderStripe()
	},
	methods: {
        onAddTags() {
            if (this.isUseTagShow) this.onUseTagHide();
            this.$refs['tags-tree'].addParentTag(); 
        },
        onTagTypeChange(code) {
            // console.log('切换了标签类型: ', code);
            this.bizTypeCode = code
        },
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
		// 表格斑馬行顯示
		renderStripe() {
			const table = document.getElementsByClassName('ant-table-row')
			if (table.length > 0) {
				const rowList = [...table]
				rowList.map((row, index) => {
					if (index % 2 !== 0) {
						row.style.backgroundColor = '#f9f9f9'
					} else {
						row.style.backgroundColor = '#ffffff'
					}
				})
			}
		},
		initPersonsData() {
			// 初始化客戶頁面資料
			// this.$store.dispatch('main/getCustomerList', this.params)
			this.getCustomerData()
			// this.getCompanyData() //取得公司資料
			this.getTagType()
		},
		// setVisitRecord(record) {
		// 	// console.log("record==========================", record, record.id);
		// 	let param = {
		// 		customerId: record.id || record.customerId,
		// 		customerName: record.name || record.customerName,
		// 	}
		// 	// return console.log(param);
		// 	this.$api.customer.addBrowseRecord(param).then(res => {
		// 		// console.log('addBrowseRecord', res);
		// 		// this.$store.dispatch('main/getVisitRecord');
		// 		this.$store.commit('main/SET_SHOW_VISIT_RECORD', [param, true])
		// 	})
		// },
		getTagType() {
			this.$api.tags.queryList({ type: 'customer' }).then(res => {
				// console.log("queryList", res);
				// this.$util.console(res, 'tags queryList返回的結果');
				if (!res.data.length) return this.$message.error('獲取標籤類型資料失敗！')
				this.tagTypeList = res.data
			})
		},
		getCompanyData() {
			//取得公司資料
			let params = {
				page: {
					currentPage: 1, //定義目前頁次,後存入store,後面的都找store的 currentPage
					pageSize: 10, //定義目前頁次比數,後存入store,後面的都找store的 pageSize
				},
				// fix: 公司列表的翻頁。 目前只查詢了10條。
			}
			this.$store.dispatch('main/getApiCompanyList', params).then(res => {
				if (!res) return this.$message.error('請求資料失敗！！')
				this.getCustomerData() //取得客戶資料
				// this.getCustomerTagsData();//取得客戶標籤資料
				// this.getCompanyTagsData();//取得公司標籤資料
			})
		},
		getCustomerData(isInit = false, code = null) {
			//取得客戶資料
			this.isTableLoading = true;
			let params = {
				page: {
					currentPage: isInit ? 1 : this.currentPage, //定義目前頁次,後存入store,後面的都找store的 currentPage
					pageSize: isInit ? 10 : this.pageSize, //定義目前頁次比數,後存入store,後面的都找store的 pageSize
				},
                bizTypeCode: code || this.bizTypeCode
			}
			if (isInit) this.selectedTagsId = -1
			if (this.selectedTagsId != -1) {
                params.tagId = this.selectedTagsId;
                params.page.currentPage = 1;
                params.page.pageSize = 10;
            };
			this.$store.dispatch('main/getCustomerList', params).then(res => {
				this.isTableLoading = false
                this.$set(this.params.page, 'currentPage', params.page.currentPage)
                if (isInit) {
                    this.selectedCustData = []
                    this.selectedCust = []
                    this.selectedTags = []
					this.$refs['tags-tree'].selectedTag = [];
                }
				this.$forceUpdate()
			})

		},
		onTagsSelected(id) {
			//todo: 取消查詢tagId的用戶列表
			// console.log('標籤樹組件，選中的id', id);
			// alert(`子組件選中了： ${key}`);
            if (id == null || this.selectedTagsId == id) return this.getCustomerData(true);
			this.selectedTagsId = id
			this.getCustomerData()
		},
		onPageChange(currentPage) {
			this.isTableLoading = true
			let params = {
				page: {
					currentPage: currentPage,
					pageSize: this.$store.state.main.getTotalPage.pageSize,
				},
                bizTypeCode: this.bizTypeCode
			}
			this.$store.dispatch('main/getCustomerList', params).then(res => {
				this.isTableLoading = false
			})
		},
		// note: 以下為複製過來的
		editCustomer(editType, record) {
			if (editType == 'add') {
				this.addModelTit = '新增客戶資料'
				this.custEdit = {
					companyId: '',
					companyName: '',
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
				}
			} else {
				let tmpRecord = { ...record }
				if (!tmpRecord.email) {
					tmpRecord.email = [{ email: '', type: 'work' }]
				}
				if (!tmpRecord.phone) {
					tmpRecord.phone = [{ phone: '', type: 'work' }]
				}
				tmpRecord.editType = 'edit'
				this.custEdit = tmpRecord
				this.addModelTit = '更新客戶資料'
			}
			this.custEdit.editType = editType
			this.isAddCustomerShow = true
		},
		delCustomer() {
			let delCustArry = [] //刪除客戶名單
			this.selectedCustData.forEach(item => {
				delCustArry.push(item.id)
			})

			let str = ''
			let selectedCustData = this.selectedCustData //已選客戶名單
			selectedCustData.forEach(item => {
				str += '客戶-' + item.name + '、  '
			})

			let that = this
			this.$confirm({
				title: '確認刪除以下客戶嗎?',
				content: str,
				okText: '確認刪除',
				cancelText: '取消',
				onOk() {
					that.$api.customer.deleteCustomerByIds(delCustArry).then(res => {
						if (res.success != true) {
							that.$message.error(`删除失败：${res.message}`)
						} else {
							that.$message.success('請求刪除客戶成功！')
							that.selectedCustData = []
							that.getCustomerData(true)
                            that.selectedCustData = []
                            that.selectedCust = []
                            that.selectedTags = []
						}
					})
				},
				onCancel() {
					//console.log('Cancel');
				},
			})
		},
		handleOk(e) {
			//this.ModalText = "The modal will be closed after two seconds";
			this.isAddCustomerShow = false
            this.isTableLoading = true
			setTimeout(() => {
                this.$store.dispatch('main/getCustomerList', this.params).then(res => {
                    this.isTableLoading = false
                })
				// if(e.editType == 'addFromCalendarView'){
				//   this.$refs.calenderView.addEvent(e); //更新行事歷檢視
				//   console.log('點擊了 添加活動 ----------',this.$refs.calenderView);
				// }
			}, 200)
		},
		handleCancel(e) {
			//console.log('Clicked cancel button', e);
			this.isAddCustomerShow = false
		},
		//Drawer start
		afterVisibleChange(val) {
			//console.log('visible', val);
		},
		showDrawer(idx) {
			this.$refs.myDrawer.init(idx)
		},
		getCustomerTimelinePageList() {
			let currentCust = [...this.$store.state.main.currentCustomer]
		},
		onClose() {
			this.isDrawerShow = false
		},

		callback(key) {
			// console.log(key)
		},
		//tabs end
		edit(text, record, index) {
			//info: 點擊table
		},

        // 标签操作相关
		onUseTagShow() {
			if (!this.selectedCust.length) return this.$message.warning('還未選擇任何用戶！')
			// console.log('選擇的使用者ID陣列為：', this.selectedCust);
			// 以下是選中用戶已經有的標籤
			if (this.selectedCust.length == 1) {
				let customer = this.customerData.find(item => item.id == this.selectedCust[0])
				// console.log('選擇的用戶為：', customer);
                if (customer.bizTags && customer.bizTags.length) {
                    let tags = customer.bizTags.map(i => {
                        return i.id
                    })
                    // console.log('處理完的用戶的標籤ID為：', tags);
                    this.selectedTags = tags
                }
                // if (this.$store.state.main.tagsType == "company") this.selectedTags = [];
				this.$forceUpdate()
			} else if (this.selectedCust.length > 1) {
				// todo: 如果是多個用戶的時候，如何處理用戶的默認已有的標籤？
			}
			this.isUseTagShow = true;
            // console.log('勾選結束的標籤數據為', );
			this.$forceUpdate()
		},
		onSelectTag(e) {
			if (this.selectedTags.includes(e)) {
				let eIndex = this.selectedTags.findIndex(i => i == e)
				this.selectedTags.splice(eIndex, 1)
			} else {
				this.selectedTags.push(e)
			}
		},
		onCheckTag(checkedKeys) {
			// console.log(checkedKeys);
			// this.selectedTags = [].concat(checkedKeys.checked[checkedKeys.checked.length - 1]);// 設置單選
			this.selectedTags = checkedKeys.checked
			// console.log(this.selectedTags);
		},
		onUseTagHide() {
			this.selectedTags = []
			this.isUseTagShow = false
		},
		async handleuseTags() {
            this.isUsingTags = true;
            let params = {
                bizTagIds: this.selectedTags,
                bizTypeCode: this.bizTypeCode,
                bizIds: this.selectedCust,
                type: 'customer'
            };
            
			this.$api.tags
					.addBizTagsByTagNamesOrIds(params)
					.then(res => {
						this.isUsingTags = false;
                        if (!res.success) return this.$message.error('貼標籤失敗', 2)
                        // console.log('promise all', result);
                        this.$message.success('貼標籤成功')
                        this.onUseTagHide()
                        this.getCustomerData(false)
                        this.selectedCustData = []
                        this.selectedCust = []
                        this.selectedTags = []
                        this.$forceUpdate()
					})
					.catch(err => {
						this.$message.success('貼標籤成功')
					})
		},
		readEmailList(record) {
			//console.log('record', record);
		},
		readPhoneList(record) {
			//console.log('record', record);
		},
		onExpand(expandedKeys) {
			this.expandedKeys = expandedKeys
			this.autoExpandParent = false
		},
	},
    filters: {
		filterTime(time) {
			return moment(time).format('YYYY年MM月DD日')
		},
	},
}
</script>

<style scoped lang="less">
.personsUI {
	height: 100%;
	width: 100%;
    font-size: 1em;

	&-tags-card {
		max-height: 500px;
		overflow-y: scroll;
		&--null {
			text-align: center;
			min-height: 60px;
		}
	}

	

	// table主體
	.persons-content {
		height: 100%;
		width: 100%;
		// min-width: 820px;
		border-radius: 10px;
        overflow: hidden;
		&__header {
			height: 32px;
			line-height: 32px;
            padding-right: 5px;
		}
		&__box {
			height: calc(100% - 47px);
			overflow-y: auto;
			width: 100%;
			// min-width: 820px;
			margin: 15px 0 0 0;
			border-radius: 10px;
			background: #fff;
			padding: 20px;
            overflow-x: scroll;
            
			&--table {

                max-height: calc(100% - 50px);
                overflow-y: scroll;

			}
			&--footer {
				height: 32px;
				// margin: 15px 0
			}
		}
	}

	&-title--big {
		line-height: 32px;
		vertical-align: bottom;
		padding-top: 4px;
	}
}
.mgnLeft {
	margin-left: 1em;
}
</style>
