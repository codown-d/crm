<template>
	<div class="draw-broadside">

        <!-- 詳細資料展示區域 -->
		<div class="broadside-item">
			<div class="item-header">
				<span class="title">詳細</span>
				<a-button v-if="excutePermission(customManage.updateDetail)" @click="editInfo">修改資料</a-button>
			</div>
			<div class="default-text">姓名: {{ detail.name }}</div>
			<div class="default-text">組織: {{ detail.companyName }}</div>
			<div class="default-text">部門: {{ detail.department }}</div>
			<div class="default-text">職稱: {{ detail.position }}</div>
			<div class="default-text">性別: {{ detail.sex ? '男' : '女' }}</div>
			<div class="default-text">生日: {{ detail.birthday | filterTime }}</div>
			
			<div class="default-text">
				<span>電話: </span>
				<label v-for="(item, index) in detail.phoneList" :key="index">
                    <template v-if="item.phone.length">
                        {{ item.phone }}
                        <a-tag v-if="item.type == 'work'" color="blue" style="margin: 0 15px 0 2px">工作</a-tag>
                        <a-tag v-if="item.type == 'family'" color="cyan" style="margin: 0 15px 0 2px">家庭</a-tag>
                        <a-tag v-if="item.type == 'other'" style="margin: 0 15px 0 2px">其他</a-tag>
                        <br />
                    </template>
				</label>
			</div>
			<div class="default-text">
				<span>郵箱: </span>
				<label v-for="(item, index) in detail.emailList" :key="index">
                    <template v-if="item.email.length">
                        {{ item.email }}
                        <a-tag v-if="item.type == 'work'" color="blue" style="margin: 0 15px 0 2px">工作</a-tag>
                        <a-tag v-if="item.type == 'family'" color="cyan" style="margin: 0 15px 0 2px">家庭</a-tag>
                        <a-tag v-if="item.type == 'other'" style="margin: 0 15px 0 2px">其他</a-tag>
                        <br />
                    </template>
				</label>
			</div>
			<div class="default-text flex">
                社群賬號: {{ detail.socialAccount }}
                <div v-if="detail.socialAccountType" class="marginLft-5" style="margin-top: -5px;">
                    <LineIcon v-if="detail.socialAccountType == 'line'" :style="{ fontSize: '18px' }"  />
                    <a-icon v-else-if="detail.socialAccountType == 'facebook'" type="facebook" theme="filled" :style="{ fontSize: '18px', background: '#fff', color: '#1278F3' }" />
                    <a-icon v-else-if="detail.socialAccountType == 'wechat'" type="wechat" theme="filled" :style="{ fontSize: '18px', background: '#fff', color: '#00C300' }" />
                    <a-icon v-else-if="detail.socialAccountType == 'twitter'" type="twitter" :style="{ fontSize: '18px', background: '#fff', color: '#1278F3' }" />
                    <a-icon v-else-if="detail.socialAccountType == 'qq'" type="qq" :style="{ fontSize: '18px', background: '#fff', color: '#1278F3' }" />
                </div>
            </div>
			<div class="default-text">地址: {{ detail.address }}</div>
			<div class="default-text">備註: {{ detail.remark }}</div>
		</div>

        <!-- 交易展示區域 -->
		<div class="broadside-item">
			<div class="item-header">
				<span class="title">交易</span>
				<a-button v-if="excutePermission(deal.add)" @click="addBusiness">新增交易</a-button>
			</div>

			<template v-if="businessList.length">
				<div class="default-text marginTop-10" v-if="doingBusinessList.length">
					<div class="font-14">進行中的交易({{ doingBusinessList.length }})</div>
                    <div :style="{ overflowY: doingBusinessList.length > 3 ? 'scroll' : '', maxHeight: '240px' }">
                        <div class="broadside-dealItem" v-for="(item, index) in doingBusinessList" :key="index" @click="toDeals(item)">
                            <div class="broadside-dealItem_title">{{ item.title }}</div>
                            <div class="broadside-dealItem_name">
                                <a-icon type="user" style="margin-right: 10px" />
                                <span>{{ item.money }}</span>
                            </div>
                            <step
                                :data="item.businessSalesStageList"
                                :salesStageId="item.salesStageId"
                                @updataStage="updataStage($event, item.dealId)"
                            />
                        </div>
                    </div>
				</div>

				<div class="default-text marginTop-10" v-if="doneBusinessList.totalCount">
					<div class="font-14">完成交易({{ doneBusinessList.totalCount }})</div>

					<div class="broadside-dealLine flex">
						<div
							:class="{
								'broadside-dealLine-item success-bg': true,
								'broadside-dealLine-item--success': doneBusinessList.fail.percent,
							}"
							:style="{ width: doneBusinessList.success.percent + '%' }"
						></div>

						<div
							class="broadside-dealLine-divider"
							v-if="doneBusinessList.success.percent && doneBusinessList.fail.percent"
						></div>

						<div
							:class="{
								'broadside-dealLine-item fail-bg': true,
								'broadside-dealLine-item--fail': doneBusinessList.success.percent,
							}"
							:style="{ width: doneBusinessList.fail.percent + '%' }"
						></div>
					</div>

					<div class="flex-between" v-if="doneBusinessList.success.count">
						<div class="success-color" style="width: 30px">成功</div>
						<div class="flex-right" style="width: 50px">{{ doneBusinessList.success.count }}</div>
						<div class="flex-right" style="width: 50px">{{ doneBusinessList.success.percent }}%</div>
						<div class="flex-right" style="width: 100px">{{ doneBusinessList.success.money }}</div>
					</div>
					<div class="flex-between" v-if="doneBusinessList.fail.count">
						<div class="fail-color" style="width: 30px">失敗</div>
						<div class="flex-right" style="width: 50px">{{ doneBusinessList.fail.count }}</div>
						<div class="flex-right" style="width: 50px">{{ doneBusinessList.fail.percent }}%</div>
						<div class="flex-right" style="width: 100px">{{ doneBusinessList.fail.money }}</div>
					</div>
				</div>

                <!-- //todo: 待完善功能，將全部交易modal彈窗，以table展示。 -->
				<!-- <a-button class="marginTop-10">查看所有交易</a-button> -->
			</template>

			<template v-else>
				<div class="flex-column padding-20 font-14 marginTop-10">
					<div class="gray-text center">你沒有關聯的交易</div>
                    <div class="link-text center icon-event marginLft-8" @click="addBusiness">新增一筆交易</div>
				</div>
			</template>
		</div>

		<a-modal
            :dialog-style="{ top: '0px' }"
			title="修改資料"
			:visible="visible"
			:confirm-loading="false"
            :footer="null"
            :destroyOnClose="true"
			@cancel="handleCancelPerson"
            width="750px"
		>
			<AddCust :formEdit="custEdit" @handleCancel="handleCancelPerson" @handleOk="handleOk"  ref="EditCustomer"  />
		</a-modal>
	</div>
</template>
<script>
import Service from '@/services/common.js'
import PersonSelect from './personSelect.vue'
import Step from '@/components/public/step.vue'
import AddCust from '@/components/public/addCustomer.vue'
import { mapGetters } from 'vuex'
import moment from 'moment'
import {
    LineIcon
} from '@/components/public/iconSvgs'

export default {
	components: {
		PersonSelect,
		AddCust,
		Step,
        LineIcon
	},
	data() {
		return {
			form: this.$form.createForm(this, { name: 'coordinated' }),
			detail: {},
			visible: false,
			custEdit: {},
			businessList: [], //交易清單
			doingBusinessList: [], // 進行中的交易清單
			doneBusinessList: {
				//已完成的交易的資料
				totalCount: 0,
                list: [],
				success: {
					count: 0,
					money: 0,
					percent: 0,
				},
				fail: {
					count: 0,
					money: 0,
					percent: 0,
				},
			},
		}
	},
	props: {
		detailData: {
			type: Object,
			default: () => {},
		},
		businessData: {
			type: Array,
			default: () => [],
		},
	},
	computed: {
		...mapGetters([
			'permissions',
			'customManage',
			'deal'
		])
	},
	filters: {
		filterTime(time) {
			return time ? moment(time).format('YYYY年MM月DD日') : '';
		},
	},
	watch: {
		detailData: {
			immediate: true,
			handler(val, oldVal) {
				this.detail = val
				this.salesStageIndex = val.salesFlowId
			},
		},
		businessData: {
			immediate: true,
			handler(val, oldVal) {
				// console.log('處理完成的交易資料', this.doneBusinessList, val);

				this.businessList = val;

                // console.log(val, val.map(item => { return item.status }));
				//處理進行中、完成交易的資料
				this.doingBusinessList = val.filter(item => item.status < 20);
                // if (val.length > 3) {
				//     this.doingBusinessList = this.doingBusinessList.slice(0, 3)
				// }
				// console.log('處理中的交易資料', this.doingBusinessList);

                this.doneBusinessList.list = val.filter(item => item.status > 10);
				// console.log('處理完的交易資料', this.doneBusinessList.list);
				this.doneBusinessList.totalCount = this.doneBusinessList.list.length;

				if (this.doneBusinessList.totalCount) {
					let successDealsList = val.filter(item => item.status == 20)
					this.doneBusinessList.success.count = successDealsList.length
					this.doneBusinessList.success.percent = Number((
						(successDealsList.length / this.doneBusinessList.totalCount) *
						100
					).toFixed(0))
					successDealsList.forEach(item => {
						this.doneBusinessList.success.money += item.money
					})

					let failDealsList = val.filter(item => item.status == 30)
					this.doneBusinessList.fail.count = failDealsList.length
					this.doneBusinessList.fail.percent = Number((
						(failDealsList.length / this.doneBusinessList.totalCount) *
						100
					).toFixed(0))
					failDealsList.forEach(item => {
						this.doneBusinessList.fail.money += item.money
					})
				}
			},
		},
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
		//編輯交易
		toDeals(val) {
			// console.log(val)
			// this.$router.push({ name: 'Deals', params: { dealId: val.dealId } })
			// this.$emit('close')
			this.$emit('addBusiness', val);
			
		},
		//到父元件中更新交易階段
		updataStage(salesStageId, dealId) {
			const params = {
				param: {
					dealId, //交易id
					salesStageId, //交易階段id
				},
			}
			this.$emit('updataStageEmit', params)
		},

		//編輯聯絡人
		handleOk(e) {
			// let { companyId, companyName, customerId, name, emailList, ownerUser, phoneList } = this.$refs.EditCustomer.formData
            // if (companyId == "newCompany") companyId = "";
			// const params = {
			// 	param: {
			// 		companyId,
            //         companyName,
			// 		name,
			// 		ownerUser,
			// 		phoneList,
			// 		emailList,
			// 		id: customerId,
			// 	},
			// }
			// Service.editCustomerInfo(params).then(res => {
            //     if (!res.success) return this.$message.error(res.message || '修改資料失敗!');
			// 	this.visible = false
			// 	this.$message.success('修改成功')

				
			// })
			this.$emit('editCustomerOK')
            
			this.visible = false
		},

		handleCancelPerson(e) {
			this.visible = false
		},

		addBusiness() {
			this.$emit('addBusiness')
		},

		editInfo() {
			this.visible = true
			console.log('编辑客户详情',this.detail)

			this.custEdit = this.$lodash.cloneDeep(this.detail)
            this.custEdit.editType = 'edit'
		},
	},
}
</script>
<style scoped lang="less">
.draw-broadside {
	.default-text {
		line-height: 28px;
	}
	.broadside-item {
		border-bottom: 1px solid #e8e8e8;
		padding: 20px 15px 20px 20px;
		.item-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.title {
				font-size: 18px;
				font-weight: 600;
				color: #f7a84a;
			}
		}
	}
	.broadside-dealItem {
		cursor: pointer;
		margin: 4px 0;
		padding: 8px;
		border: 1px solid #e5e5e570;
        line-height: 2;
		&:hover {
			border: 1px solid #e5e5e5;
		}
		.broadside-dealItem_title {
			color: #000;
			font-size: 14px;
			font-weight: bold;
		}
		.broadside-dealItem_name {
			font-size: 14px;
			color: #000;
			opacity: 0.8;
			display: flex;
			align-items: center;
		}
	}

	.broadside-dealLine {
		display: flex;
		height: 16px;
		width: calc(100% + 4px);
		margin: 5px 0;
		.broadside-dealLine-divider {
			width: 4px;
			height: 100%;
		}
		.broadside-dealLine-item {
			border-radius: 8px;
			height: 100%;
            cursor: pointer;
			&:hover {
				height: calc(100% + 4px);
				border-radius: 10px;
			}
		}
		.broadside-dealLine-item--success,
		.broadside-dealLine-item--success:hover {
			border-top-right-radius: 0px;
			border-bottom-right-radius: 0px;
		}
		.broadside-dealLine-item--fail,
		.broadside-dealLine-item--fail:hover {
			border-top-left-radius: 0px;
			border-bottom-left-radius: 0px;
		}
	}

    .broadside-dealLine-link {
        color: #f94839;
    }
}
</style>
