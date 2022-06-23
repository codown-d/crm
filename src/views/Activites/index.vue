<!--
/*
 * @Descripttion: 活動範本
 * @version: 
 * @Author: hongfa
 * @Date: 2022-1-6 18:20:50
 * @LastEditors: Lone
 * @LastEditTime: 2022-05-07 22:34:10
 */
 -->
<template>
	<div class="activity-page">
		<div class="activity-btn flex-between">
            <div class="flex">
                <a-button type="primary" icon="plus-circle" @click="toAdd" style="margin-right: 12px">新增活動36</a-button>
                <myButton class="marginRgt-10" icon="reload" :isIconBtn="true" @click="fetchData(true)" />
            </div>


			<div class="tabBtn">
				<div
					:class="['tabBtn_item', tabIndex == index ? 'tabBtn_item_active' : '']"
					v-for="(item, index) in btnArr"
					:key="index"
					@click="selectTab(index, item)"
				>
					{{ item.text }}
				</div>
			</div>
			<div class="btn-border pointer" @click="$router.push('/schedule')">
				<span class="material-icons">schedule</span>
			</div>
		</div>

		<div class="table-warp">
			<a-table :loading="loading" :columns="columns" :data-source="sourceData" :pagination="false">
				<a-checkbox
					slot="done"
					slot-scope="text, record"
					:checked="radioCheckedId == record.activityId ? !radioChecked : radioChecked"
					@change="updataChange({ ...record, text })"
				></a-checkbox>

				<span slot="name" slot-scope="text, record">
					<a-button type="link" @click="toEdit({ ...record, text })">{{ record.name }}</a-button>
				</span>

				<span slot="activityParticipants" slot-scope="text, record">
					<a-tag v-for="(tag, index) in record.activityParticipants" :key="index">{{ tag.customerName }}</a-tag>
				</span>

				<span slot="action" slot-scope="text, record">
					<!-- <a-button v-if="excutePermission(activity.updateDetail)" type="link" @click="toEdit({ ...record, text })">編輯</a-button> -->
					<a-button v-if="excutePermission(activity.delete)" type="link" @click="deleteACtive({ ...record, text })">刪除</a-button>
				</span>
			</a-table>
		</div>
		<div class="company-content__box--footer marginTop-15">
			<a-pagination v-model="curPage" :pageSize="pageSize" :total="totalCount" @change="changePage" />
		</div>
		<a-modal
			v-model="modalShow"
			:title="modalTitle"
			@ok="handleOk"
			ok-text="確認"
			cancel-text="取消"
			@cancel="cancelFn"
		>
			<activeTab ref="activeTab" :active="curTabType" :list="tabTypeList" @change="tabChange" />
			<activeForm ref="activeForm" :formData="formData" />
		</a-modal>
	</div>
</template>

<script>
// import activeForm from './components/activeForm.vue'
import activeForm from '@/components/public/activeForm.vue'
import activeTab from './components/activeTab.vue'
import columns from './columnTable'
import moment from "moment";
import ActivityApi from '@/services/activities-api.js'
import Services from "@/services/common.js";
import { queryActivityPageList } from './service.js'
import { mapGetters } from 'vuex';
import myButton from '@/components/Common/myButton'

export default {
	name: 'Activities',
	components: {
		activeTab,
		activeForm,
        myButton
	},
	data() {
		return {
			columns: [
				{
					title: '已完成',
					dataIndex: 'done',
					key: 'done',
					align: 'center',
					width: 100,
					scopedSlots: { customRender: 'done' },
				},
				...columns,
			],
			curPage: 1,
			totalCount: 1,
			pageSize: 10,
			loading: true,
			selectedRows: [],
			sourceData: [],
			modalTitle: '',
			modalShow: false,
			modalStatus: 1, //1 新增  2修改
			curTabType: 1, //activeTab 當前類型
			tabType: {}, //activeTab 當前
			tabTypeList: [], //activeTab list
			formData: {
				name: '',
				time: [],
				activityParticipants: [],
				location: '',
				publicDescription: '',
				ownerUser:undefined,
				ownerName:undefined,
				dealId: '',
				companyId: '',
				activityVisitors: [],
				customerId:'',
				customerName:'',
			},
			radioChecked: false,
			radioCheckedId: null,
			btnArr: [
				{ key: 'agency', text: '待辦' },
				{ key: 'done', text: '已完成' },
				{ key: 'overdue', text: '逾期' },
			],
			tabIndex: 0,
			status: 'agency',
		}
	},
	mounted() {
		this.fetchData()
		this.fetchTabTypeList()
	},
	computed: {
		...mapGetters([
			'permissions',
			'activity',
			'userInfo'
		])
	},
	updated() {
		// 表格斑馬行顯示
		this.renderStripe()
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
		selectTab(index, item) {
			this.tabIndex = index
			this.status = item.key
			this.radioChecked = item.key == 'agency' ? false : true
			this.columns =
				item.key == 'agency' || item.key == 'done'
					? [
							{
								title: '已完成',
								dataIndex: 'done',
								key: 'done',
								align: 'center',
								width: 100,
								scopedSlots: { customRender: 'done' },
							},
							...columns,
					  ]
					: columns
			this.fetchData()
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

		//刪除活動
		deleteACtive(record) {
			const { key } = record

			const param = {
				activityIds: [key],
			}

			let delCompanyArry = []
			let str = ''
			this.selectedRows.forEach(item => {
				delCompanyArry.push(item.id)
			})

			let arr = this.selectedRows
			arr.forEach(item => {
				str += '活動-' + item.name + '/ '
			})

			let that = this

			this.$confirm({
				title: '確認刪除活動嗎?',
				content: str,
				okText: '確認刪除',
				okType: '取消',
				cancelText: '否',
				onOk() {
					ActivityApi.deleteActivity(param).then(res => {
						if (res.code == 0) {
							that.$message.success('刪除成功')
							that.fetchData()
							that.selectedRows = []
						}
					})
				},
				onCancel() {
					console.log('Cancel')
				},
			})
		},
		fetchTabTypeList() {
			ActivityApi.queryActivityTypes().then(res => {
				if (res.code === '0') {
					this.tabTypeList = res.data
				}
			})
		},
		tabChange(item) {
			this.tabType = item
			this.curTabType = item.typeId
		},
		async fetchData(isInit = false) {
			const result = await queryActivityPageList({
				pageNum: isInit ? 1 : this.curPage,
				pageSize: isInit ? 10 : this.pageSize,
				param: {
					status: this.status,
				},
			})
				.then()
				.finally(() => (this.loading = false))

			const resultArr = Array.isArray(result.list)
				? result.list.map(item => {
						return {
							...item,
							key: item.activityId,
							name: item.subject,
							dateStart: item.planStartTime,
							dateEnd: item.planEndTime,
							// date: item.planStartTime + '-' + item.planEndTime,
							date: this.$moment(item.planEndTime).format('YYYY年MM月DD日'),
							desc: item.publicDescription,
							dealId: item.dealId,
							companyId: item.companyId,
							activityVisitors: item.ownerUser,
							type: item.activityTypeId,
						}
				  })
				: []

			this.totalCount = result.totalCount
            this.curPage = isInit ? 1 : this.curPage
			this.sourceData = resultArr
		},
		toAdd() {
			//新增活動
			this.formData = this.$options.data().formData;
			this.formData.ownerUser = this.userInfo.id;
			this.formData.ownerName = this.userInfo.userName;
			this.modalStatus = 1
			this.curTabType = 1
			this.modalTitle = '新增'
			this.modalShow = true
		},
		toEdit(item) {
			//編輯活動
			this.modalTitle = '編輯'
			this.modalStatus = 2
			this.modalShow = true
			this.tabType = item
			this.curTabType = +item.type
			this.formData = {
				...item,
				type: item.type,
				publicDescription: item.desc,
				time: [this.$moment(item.dateStart), this.$moment(item.dateEnd)],
			}
		},
		handleOk() {
			//確認新增或修改
			switch (this.modalStatus) {
				case 1: //新增
					this.doSubmitAdd()
					break
				case 2: //修改
					this.doSubmitEdit()
					break
			}
		},
		cancelFn() {
			this.formData = {}
			this.modalShow = false
		},

		//更新活動狀態
		updataChange(text) {
			const { activityId, done } = text

			this.radioCheckedId = activityId
			// this.radioChecked = true

			ActivityApi.updateActivityStatus({
				activityId,
				done: !done,
			}).then(res => {
				if (res.code === '0') {
					this.fetchData()
					// this.radioChecked = false
					this.radioCheckedId = ''
					this.$message.success('狀態修改成功')

					// this.toAdd()
				} else {
					this.$message.error(res.message)
					// this.radioChecked = false
					this.radioCheckedId = ''
				}
			})
		},

		async doSubmitEdit() {
			this.$refs.activeForm.validate().then(async valid => {
				if (valid) {
					let formData = this.$refs.activeForm.getFormVal()
					//TODO:創建公司和聯絡人,後端支持創建聯絡人和公司返回數據後才開始啟用
					if(!formData.companyId && formData.companyName){
						let createResult = await this.$api.company.createCompany({
							param:{
								name:formData.companyName,
								bizTagIds:[],
								editType: "add",
								tags: [],
							}
						});
						if(!createResult.success){
							throw this.$message.error('新增組織失敗');
						}
						let queryResult = await this.$api.company.companyList({
							pageNum:1,
							pageSize:50,
							param:{
								name:formData.companyName,
							},
						});
						if(!queryResult.success){
							throw this.$message.error('查询新增組織失敗');
						}
						if(queryResult.data && queryResult.data.list && queryResult.data.list.length)
						{
							formData.companyId = queryResult.data.list[0].id;
						}
						else{
							throw this.$message.error('查询新增組織失敗');
						}
					}
					if(!formData.customerId && formData.customerName)
					{
						let createResult = await this.$api.customer.addCustomer({
								name:formData.customerName,
								companyId:formData.companyId,
								companyName:formData.companyName,
								editType: "add",
								sex: true,
						});
						if(!createResult.success){
							throw this.$message.error('新增聯絡人失敗');
						}
												let queryResult = await this.$api.customer.getCustomerList({
							page:{
								currentPage: 1,
								pageSize: 50,
							},
							name:formData.customerName
						});
						if(!queryResult.success){
							throw this.$message.error('查询新增聯絡人失敗');
						}
						if(queryResult.data && queryResult.data.list && queryResult.data.list.length)
						{
							formData.customerId = queryResult.data.list[0].id;
						}
						else{
							throw this.$message.error('查询新增聯絡人失敗');
						}
					}
					formData.activityParticipants = [{customerId:formData.customerId,customerName:formData.customerName,isCreate: !formData.customerId && Boolean(formData.customerName)}]
					//todo 組裝介面
					ActivityApi.editActivityType({
						subject: formData.subject,
						planStartTime: formData.time[0].format('YYYY-MM-DD HH:mm:ss'),
						planEndTime: formData.time[1].format('YYYY-MM-DD HH:mm:ss'),
						activityParticipants: formData.activityParticipants,
						publicDescription: formData.publicDescription,
						activityTypeId: this.curTabType || this.tabTypeList[0].typeId,
						dealId: formData.dealId,
						ownerUser:formData.ownerUser,
						ownerName:formData.ownerName,
						companyId: formData.companyId,
						activityId: formData.key,
						busyFlag: 0,
						done: false,
					}).then(res => {
						if (res.code == 0) {
							this.fetchData()
							this.modalShow = false
							this.$message.success('編輯成功')
						} else {
							this.$message.error(res.message)
						}
					})
				}
			})
		},
		doSubmitAdd() {
			this.$refs.activeForm.validate().then(async valid => {
				if (valid) {
					const getForm = this.$refs.activeForm;
					let formData = getForm.form ? getForm.form : getForm[0].form;

					//TODO:創建公司和聯絡人,後端支持創建聯絡人和公司返回數據後才開始啟用
					if(!formData.companyId && formData.companyName){
						let createResult = await this.$api.company.createCompany({
							param:{
								name:formData.companyName,
								bizTagIds:[],
								editType: "add",
								tags: [],
							}
						});
						if(!createResult.success){
							throw this.$message.error('新增組織失敗');
						}
						let queryResult = await this.$api.company.companyList({
							pageNum:1,
							pageSize:50,
							param:{
								name:formData.companyName,
							},
						});
						if(!queryResult.success){
							throw this.$message.error('查询新增組織失敗');
						}
						if(queryResult.data && queryResult.data.list && queryResult.data.list.length)
						{
							formData.companyId = queryResult.data.list[0].id;
						}
						else{
							throw this.$message.error('查询新增組織失敗');
						}
					}
					if(!formData.customerId && formData.customerName)
					{
						let createResult = await this.$api.customer.addCustomer({
								name:formData.customerName,
								companyId:formData.companyId,
								companyName:formData.companyName,
								editType: "add",
								sex: true,
						});
						if(!createResult.success){
							throw this.$message.error('新增聯絡人失敗');
						}
						let queryResult = await this.$api.customer.getCustomerList({
							page:{
								currentPage: 1,
								pageSize: 50,
							},
							name:formData.customerName
						});
						if(!queryResult.success){
							throw this.$message.error('查询新增聯絡人失敗');
						}
						if(queryResult.data && queryResult.data.list && queryResult.data.list.length)
						{
							formData.customerId = queryResult.data.list[0].id;
						}
						else{
							throw this.$message.error('查询新增聯絡人失敗');
						}
					}

					const params = {
						param: {
							activityParticipants: [
								{
									customerId:formData.customerId,
									customerName:formData.customerName,
									isCreate: !formData.customerId && Boolean(formData.customerName),
								},
							],
							planEndTime: formData.time[0]
								? moment(formData.time[0]).format("YYYY-MM-DD HH:mm:ss")
								: "",
							planStartTime: formData.time[0]
								? moment(formData.time[1]).format("YYYY-MM-DD HH:mm:ss")
								: "",
							publicDescription: formData.publicDescription,
							ownerUser:formData.ownerUser,
							ownerName:formData.ownerName,
							activityTypeId:formData.activityTypeId,
							companyId:formData.activityTypeId,
							companyName:formData.companyName,
							subject:formData.subject,
							busyFlag: 0,
							done: false,
						},
					};
					Services.addActive(params).then((res) => {
							if (res.code == "0") {
									this.$message.success("新建成功");
									this.fetchData()
									this.curPage = 1
									this.modalShow = false
							}
					});
				}
			})
		},
		changePage(page) {
			this.curPage = page
			this.fetchData()
		},
	},
}
</script>

<style scoped>
.activity-page {
	padding: 20px;
}
.activity-btn {
	margin-bottom: 20px;
    align-items: center;
}
.table-warp {
	background: #fff;
}
.table-page {
	padding-top: 20px;
	display: flex;
	justify-content: flex-end;
}
.tabBtn {
	display: flex;
	width: 200px;
	justify-content: space-between;
	font-size: 16px;
	float: right;
}

.tabBtn_item_active {
	padding: 0 10px;
	color: #f86f54;
	background: #ffe7ba;
	cursor: pointer;
	border-radius: 4px;
}
.tabBtn_item {
	padding: 0 10px;
	cursor: pointer;
	border-radius: 4px;
}
</style>
