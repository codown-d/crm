<template>
	<a-drawer
		v-if="visible"
		placement="right"
		:visible="visible"
		@close="onClose"
		:width="drawerWidth + 'px'"
		getContainer=".layout-body"
		:wrap-style="{ position: 'absolute' }"
		:mask="false"
		:maskStyle="{ backgroundColor: '#00000050' }"
		:maskClosable="true"
		:destroyOnClose="true"
		:zIndex="9000"
		wrapClassName="drawer-wrap"
		:bodyStyle="{ padding: 0, height: '100%', minHeight: '100%', maxHeight: '100%', paddingRight: '10px' }"
		:title="null"
		:closable="false"
	>
		<!-- 抽屜彈出層的關閉、向上、向下按鈕部分 -->
		<div class="myDrawer-icons flex-column">
			<div class="flex"  @click="onClose"><a-icon type="close"  /></div>
			<!-- //todo 圖示顏色根據drawer滾動距離而變化 -->
			<div class="flex" @click="onClickArrow('up')"><a-icon type="up" /></div>
			<div class="flex" @click="onClickArrow('down')"><a-icon type="down" /></div>
		</div>

		<div v-if="getUserDetailLoading" class="drawer-box-wrap">
			<a-spin :spinning="getUserDetailLoading" tip="加載用戶數據中..."></a-spin>
		</div>

		<div class="drawer-box">
			<div class="drawer-left flex-column">
				<div class="drawer-header">
					<div class="flex align-center">
						<a-avatar class="avater-img flex-center" style="color: #f56a00; backgroundColor: #fde3cf">
							{{ (detail.name && detail.name[0]) || 'User' }}
						</a-avatar>
						<span class="user-name">{{ detail.name }}</span>
						<a-button icon="plus" type="danger" shape="round" @click="showAddBusiness">交易</a-button>
						<div style="margin-left:10px;">
							<template>
								<a-tag v-for="tagItem in detail.bizTags" :key="tagItem.id"  color="orange" closable @close="removeCustomerTag(tagItem)">
										{{tagItem.name}}
								</a-tag>
							</template>
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
										<div v-if="tagsTreeData.length" class="personsUI-tags-card">
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
														<div class="tree-view-left" >
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
											<!-- <a-button @click="goToCustomer" v-if="!tagsTreeData.length">去新增標籤</a-button> -->
											<a-button @click="handleuseTags" :loading="isUsingTags" v-if="tagsTreeData.length">儲存</a-button>
										</div>
									</a-spin>
								</template>
								<a-button type="link" @click="alterCustomerTags" icon="edit" title="貼標籤">
										</a-button>
							</a-popover>
						</div>
					</div>

					
				</div>
				<div>
					<drawForm :detailData="detail"></drawForm>
				</div>
			</div>
			<div class="drawer-right">
				<drawBroadside
					@addBusiness="showAddBusiness"
					:detailData="detail"
					@editCustomerOK="editCustomerOK($event)"
					:businessData="businessData"
					@close="onClose"
					@updataStageEmit="updataStageEmit($event)"
				/>
			</div>
		</div>

		<a-modal
			title="新增交易"
			:visible="addBusinessShow"
			:closable="false"
			:footer="false"
			width="750px"
			:dialog-style="{ top: '0px' }"
		>
			<addBusiness
				@handleOk="handleBusinessOK($event)"
				@handleCancel="handleBusinessCancel"
				:detailData="dealDetail"
				:isAddDeal="isAddDeal"
				v-if="addBusinessShow"
			/>
		</a-modal>
	</a-drawer>
</template>
<script>
import moment from 'moment'
import drawForm from '@/components/public/drawForm'
import drawBroadside from '@/components/public/drawBroadside'
import addBusiness from '@/components/public/addBusiness'
import Service from '@/services/common.js'

export default {
	components: {
		drawForm,
		drawBroadside,
		addBusiness,
	},
	data() {
		return {
			modalTitle: {
				customer: '客戶詳情',
				company: '公司詳情',
			},
			visible: false,
			addBusinessShow: false,
			detail: {
                id: null
            },
			businessData: [], //交易流程list
			getUserDetailLoading: false,
			isUseTagShow:false,
			tagsTreeData:[],
			expandedKeys:[],
			autoExpandParent:true,
			tagTreeVisible:false,
			isUsingTags:false,
			selectedTags:[],
			currentIndex: 0,
			isAddDeal:false,
			dealDetail:{},
		}
	},
	props: {
		scene: String,
		moduleType: {
			type: String,
			default: () => '',
		},
		detailData: {
			type: Object,
			default: () => {},
		},
	},
    computed: {
        drawerWidth() {
            return this.$store.state.main.drawerWidth 
        },
				idList(){
					return this.$store.state.main.customerData.map(item => item.id)
				}
    },
	watch: {
		// detailData: {
		// 	immediate: true,
		// 	handler(val, oldVal) {
		// 		this.search()
		// 		this.getBusinessInfo()
		// 	},
		// },
	},
	created() {
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
		init(val){
			if(this.idList && this.idList[val]){
				this.currentIndex = val;
				this.detailData.id = this.idList[this.currentIndex];
			}
			else{
				this.detailData.id = val;
			}
			this.visible = true;
			this.search()
			this.getBusinessInfo()
		},
		//查詢客戶資訊
		search() {
			this.getUserDetailLoading = true
			const params = {
				param: {
					id: this.detailData.id,
				},
			}
			Service.searchCustomerInfo(params).then(res => {
				this.getUserDetailLoading = false
				if (!res.success) return this.$message.error(res.message || '查詢客戶詳細資料失敗！')
				this.detail = { ...res.data, customerId: this.detailData.id }
			})
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

		//編輯完客戶資訊查詢
		editCustomerOK() {
			this.search();
            this.$emit('updateUserList');
		},

		onClose() {
			this.onUseTagHide();
			this.visible = false
            this.detail.id = undefined;
			
		},
		showAddBusiness(item) {
			console.log('编辑交易',item)
			this.addBusinessShow = true;
			if(item && item.dealId){
				this.dealDetail = {...item};
				this.isAddDeal = false;
			}
			else{
				this.dealDetail.customerId = this.detail.id;
				this.dealDetail.customerName = this.detail.name;
				this.dealDetail.companyId = this.detail.companyId;
				this.dealDetail.companyName = this.detail.companyName;
				this.isAddDeal = true;
			}
		},

		//新增交易
		async handleBusinessOK(formData) {
			const { id = '', dealDate = null, ...other } = formData
			const param = {
				dealDate: dealDate ? moment(dealDate).format('YYYY-MM-DD HH:mm:ss') : '',
				customerId: id,
				...other,
			}
			const res = await Service.addBusiness({ param })

			if (res.code == 0) {
				this.addBusinessShow = false
				this.$message.success('新增成功')
				this.getBusinessInfo()
			} else {
				this.$message.error(res.message)
			}
		},
		handleBusinessCancel() {
			this.addBusinessShow = false
		},

		//交易詳情
		getBusinessInfo() {
			const params = {
				pageNum: 1,
				pageSize: 100,
				param: {
					customerId: this.detailData.id,
				},
			}
			Service.businessList(params).then(res => {
				if (res.code == 0) {
					const array = res.data.list || []
					this.businessData = array
				}
			})
		},

		//更新交易階段
		async updataStageEmit(data) {
			this.visible = false
			this.$router.push({
				path: '/deals',
				query: {
					dealId: data.param.dealId,
				},
			})
			// const res = await Service.updataTransactionStage(data)

			// if (res.code == 0) {
			// 	this.$message.success('交易階段更新成功')
			// 	this.getBusinessInfo()
			// } else {
			// 	this.$message.error(res.message)
			// }
		},

		onClickArrow(type) {
			if(this.currentIndex<=0 && type == 'up'){
				this.$message.error("没数据")
				return
			}
			if(this.currentIndex >= this.idList.length -1 && type == 'down'){
				this.$message.error("没数据")
				return
			}
			this.currentIndex = type == 'up'? this.currentIndex-1 : this.currentIndex +1;
			this.detailData.id = this.idList[this.currentIndex]
			this.search()
		},
		alterCustomerTags(){
			this.isUseTagShow = true;
			this.selectedTags = this.detail.bizTags.map(p => p.id);
		},
		onCheckTag(checkedKeys) {
			this.selectedTags = checkedKeys.checked
		},
		async handleuseTags() {
            this.isUsingTags = true;
            let params = {
                bizTagIds: this.selectedTags,
                bizTypeCode: 'customer',
                bizIds: [this.detailData.id],
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
						this.search()
                        this.$forceUpdate()
					})
					.catch(err => {
						this.$message.success('貼標籤成功')
					})
		},
		onUseTagHide() {
			this.selectedTags = []
			this.isUseTagShow = false
		},
		selectTagChange(value, label, extra){
			console.log('value:',value);
			console.log('label',label);
			console.log('extra',extra);
			this.selectedTags = extra.allCheckedNodes.map(p => p.node.key);
		},
		onExpand(expandedKeys) {
			this.expandedKeys = expandedKeys
			this.autoExpandParent = false
		},
		async removeCustomerTag(item){
			let params = {
                bizTagIds: [item.id],
                bizTypeCode: 'customer',
                bizIds: [this.detailData.id],
                type: 'customer'
            };
			let result  = await this.$api.tags.deleteBizTagsByTagNamesOrIds(params);
			if(result.success){
				this.$message.success(`删除标签【${item.name}】`);
				this.$emit("updateUserList",true);
			}
			else{
				this.$message.success(`删除失败：${result.message}`);
			}
			this.onUseTagHide();
			this.search();
			this.$forceUpdate()
			
			

		},
	},
}
</script>

<style lang="less">
//todo: 抽屉左上圆角，联络人详情抽屉、组织详情抽屉，但是数据导入的侧边菜单抽屉不需要。
// .drawer-wrap {
//     /* 修改antd drawer的圓角和陰影 */
//     .ant-drawer .ant-drawer-content-wrapper,
//     .ant-drawer-wrapper-body,
//     .ant-drawer-content,
//     .ant-drawer-body {
//         border-top-left-radius: 20px;
//     }
//     .ant-drawer-right.ant-drawer-open .ant-drawer-content-wrapper {
//         box-shadow: none;
//     }
// }
.drawer-box-wrap {
	height: 100%;
	width: 100%;
	overflow: hidden;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff99;
    z-index: 999;
    border-top-left-radius: 20px;
}

.drawer-box {
	display: flex;
	height: 100%;
	overflow: hidden;
    z-index: 998;
    border-top-left-radius: 20px;
}

.drawer-left {
	flex: 1;
	padding: 0 30px 30px;
	height: 100%;
	border-right: 1px solid #e8e8e8;
	overflow: scroll;
	z-index: 998;
    border-top-left-radius: 20px;
	/*滚动条 start*/
	::-webkit-scrollbar {
		width: 12px;
		height: 12px;
	}

	/*定义滚动条轨道 内阴影+圆角*/
	::-webkit-scrollbar-track {
		background: #f1f1f1;
	}

	/*定义滑块 内阴影+圆角*/
	::-webkit-scrollbar-thumb {
		border-radius: 0px;
		border: 0;
		background-color: #c1c1c1;
		cursor: pointer;
	}

	::-webkit-scrollbar-thumb:hover {
		border-radius: 0px;
		border: 0;
		background-color: #a8a8a8;
		cursor: pointer;
	}
}
.drawer-header {
	display: flex;
	justify-content: space-between;
	padding-bottom: 20px;
	padding-top: 30px;
	// border-bottom: 1px solid #e8e8e8;
	margin-bottom: 20px;
	position: sticky;
	top: 0;
	background: #fff;
	z-index: 999;
	padding-left: 30px;
	// margin: 0 -30px 0px 0px;
	margin-left: -30px;
	margin-right: 30px;
	width: calc(100% + 60px);
    border-top-left-radius: 20px;
}

.drawer-header:after {
	content: '';
	width: calc(100% - 60px);
	height: 1px;
	background: #e8e8e8;
	position: absolute;
	bottom: 0;
	left: 30;
}

.user-name {
	margin-left: 15px;
	font-size: 20px;
	font-weight: 600;
	margin-right: 15px;
}
.avater-img {
	width: 50px;
	height: 50px;
	border-radius: 50%;
}

.drawer-right {
	width: 100%;
    width: 20%;
    min-width: 150px;
	height: 100%;
	overflow: scroll;
		/*滚动条 start*/
	::-webkit-scrollbar {
		width: 12px;
		height: 12px;
	}

	/*定义滚动条轨道 内阴影+圆角*/
	::-webkit-scrollbar-track {
		background: #f1f1f1;
	}

	/*定义滑块 内阴影+圆角*/
	::-webkit-scrollbar-thumb {
		border-radius: 0px;
		border: 0;
		background-color: #c1c1c1;
		cursor: pointer;
	}

	::-webkit-scrollbar-thumb:hover {
		border-radius: 0px;
		border: 0;
		background-color: #a8a8a8;
		cursor: pointer;
	}
}

.drawer-body {
	position: relative;
}

.myDrawer-icons {
	position: absolute;
	left: -65px;
	top: 20px;
	width: 48px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #ffffff;
	border: 1px solid #e8e8e8;
	border-radius: 5px;
	// -webkit-box-shadow: -2px 0 8px rgb(0 0 0 / 10%);
	// box-shadow: -2px 0 8px rgb(0 0 0 / 10%);
	-webkit-transition: -webkit-transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1),
		-webkit-box-shadow 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
	transition: -webkit-transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1),
		-webkit-box-shadow 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
	transition: transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1), box-shadow 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
	transition: transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1), box-shadow 0.3s cubic-bezier(0.7, 0.3, 0.1, 1),
		-webkit-transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1), -webkit-box-shadow 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
}

.myDrawer-icons .close {
	.anticon {
		font-size: 18px;
		font-weight: 600;
		color: #2c3e50;
	}
}

.myDrawer-icons div {
	width: 45px;
	height: 45px;
	font-size: 24px;
	justify-content: center;
	cursor: pointer;
}

// .myDrawer-icons div:first-child {
//     border-bottom: 1px solid #d2d2d2;
//     height: 34px;
// }

.myDrawer-icons div:nth-child(2) .anticon {
	margin: 3px 0 0 0;
}

/* 修改antd-vue 關鍵樣式，修改在drawer外可顯示div */
.ant-drawer-content {
	position: static;
}

</style>
