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
	<div class="activity-page ">
		<div class="activity-btn flex-between">
            <div class="flex">
                <a-button type="primary" icon="plus-circle" @click="toAdd" style="margin-right: 12px">新增活動</a-button>
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
                <div class="btn-border pointer" @click="$router.push('/activities')">
                    <span class="material-icons">table_rows</span>
                </div>
			</div>
            
		</div>

		<div class="table-warp ">
            <v-calendar
			    class="v-application"
                ref="calendar"
                :now="selectedDate"
                :value="selectedDate"
                :events="activityData"
                @click:event="showActivityDetail"
                color="primary"
                type="week"
                ></v-calendar>
		</div>
		
		<a-modal
			v-model="modalShow"
			:title="modalTitle"
			@ok="handleOk"
			ok-text="確認"
			cancel-text="取消"
			@cancel="cancelFn"
		>
			<activeForm ref="activeForm" :formData="formData" />
		</a-modal>
	</div>
</template>

<script>
// import activeForm from './components/activeForm.vue'
import activeForm from '@/components/public/activeForm.vue'
import columns from '../columnTable'
import moment from "moment";
import ActivityApi from '@/services/activities-api.js'
import Services from "@/services/common.js";
import { queryActivityPageList } from '../service.js'
import { mapGetters } from 'vuex';
import myButton from '@/components/Common/myButton'

export default {
	name: 'Schedule',
	components: {
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
			activityData: [],
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
            selectedDate: "2022-05-13",

		}
	},
    created(){
        this.selectedDate = this.$util.parseTime(new Date(), "{y}-{m}-{d}");
    },
	mounted() {
        this.$refs.calendar.scrollToTime('08:00')
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
					status: isInit ? 'agency' : this.status,
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
							start: item.planStartTime,
							end: item.planEndTime,
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
			this.activityData = resultArr
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
        showActivityDetail ({ nativeEvent, event }) {
            console.log(nativeEvent,event);
            this.toEdit(event);
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

					this.toAdd()
				} else {
					this.$message.error(res.message)
					// this.radioChecked = false
					this.radioCheckedId = ''
				}
			})
		},

		doSubmitEdit() {
			this.$refs.activeForm.validate().then(valid => {
				if (valid) {
					let formData = this.$refs.activeForm.getFormVal()

					formData.activityParticipants = [{customerId:formData.customerId,customerName:formData.customerName,isCreate: !formData.customerId && Boolean(formData.customerName)}]

					//todo 組裝介面
					ActivityApi.editActivityType({
						subject: formData.name,
						planStartTime: formData.time[0].format('YYYY-MM-DD HH:mm:ss'),
						planEndTime: formData.time[1].format('YYYY-MM-DD HH:mm:ss'),
						activityParticipants: formData.activityParticipants,
						publicDescription: formData.publicDescription,
						activityTypeId: this.curTabType || this.tabTypeList[0].typeId,
						dealId: formData.dealId,
						ownerUser:formData.ownerUser,
						ownerName:formData.ownerName,
						companyId: formData.companyId,
						companyName: formData.companyName,
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
			this.$refs.activeForm.validate().then(valid => {
				if (valid) {
					const getForm = this.$refs.activeForm;
            const {
                person,
                companyId,
				companyName,
                time,
                publicDescription,
				ownerUser,
				ownerName,
                subject,
                activityId,
                customerId,
				customerName,
                activityTypeId,
                ...argues
            } = getForm.form ? getForm.form : getForm[0].form;

            const params = {
                param: {
                    activityParticipants: [
                        {
                            customerId,
							customerName,
                            isCreate: !customerId && Boolean(customerName),
                        },
                    ],
                    planEndTime: time[0]
                        ? moment(time[0]).format("YYYY-MM-DD HH:mm:ss")
                        : "",
                    planStartTime: time[0]
                        ? moment(time[1]).format("YYYY-MM-DD HH:mm:ss")
                        : "",
                    publicDescription: publicDescription,
					ownerUser,
					ownerName,
                    activityTypeId,
                    companyId,
					companyName,
                    subject,
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
