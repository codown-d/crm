<!--
 * @Descripttion: 交易模組
 * @version: 
 * @Author: Lone
 * @Date: 2022-01-13 21:14:42
 * @LastEditors: Lone
 * @LastEditTime: 2022-05-02 22:28:38
-->
<template>
	<div class="dealsUI flex-column">
		<template>
			<div class="dealsUI-header flex-between">
				<div class="flex-1 flex-between">
				<myMenu />

					<div class="flex">
						<myButton
							v-if="excutePermission(deal.add)"
							class="marginRgt-10"
							icon="plus"
							text="交易"
							theme="orange"
							:isRound="true"
							@click="showModal"
						/>
						<myButton class="marginRgt-10" icon="reload" :isIconBtn="true" @click="reloadDealsData" />
						<myButton v-if="selectedRowKeys.length && excutePermission(deal.delete)" class="marginRgt-10" @click="toDelete" text="刪除" />
					</div>

					<div class="flex flex-right">
						<div class="tabBtn marginRgt-15">
							<div
								:class="['tabBtn_item', tabIndex == index ? 'tabBtn_item_active' : '']"
								v-for="(item, index) in btnArr"
								:key="index"
								@click="selectTab(index, item)"
							>
								{{ item.text }}
							</div>
						</div>

                        <div class="btn-border pointer" @click="$router.push('/process')">
                            <span class="material-icons flex-center" :style="{ transform: 'rotate(180deg)' }">leaderboard</span>
                        </div>
                        
					</div>
				</div>
			</div>

			<div class="dealsUI-content flex-1 padding-20">
				<a-table
					:row-selection="rowSelection"
					:loading="loading"
					:columns="columns"
					:data-source="dataSource"
					:pagination="pagination"
					@change="handleTableChange"
					:scroll="{ y: 700 }"
					:rowKey="record => record.dealId"
					class="dealsUI-table"
					:customRow="customRow"
					size="small"
				>
					<span slot="action" slot-scope="text, record">
						<a href="javascript:;" type="link" @click="toEdit({ ...record, text })">{{ record.title }}</a>
					</span>
                    <span slot="dealDate" slot-scope="text, record">
                        {{ text | filterTime(text) }}
                    </span>
				</a-table>
			</div>

			<a-modal :visible="visible" :closable="false" :footer="false" width="750px" :destroyOnClose="true" :dialog-style="{ top: '0px' }">
				<!-- 交易新增、編輯彈窗頂部 -->
				<div class="flex-between" slot="title">
					<div>{{ modalTitle }}</div>
					<div class="flex" v-if="!isAddDeal">
						<div v-if="recordData.status && recordData.status == 10" class="flex">
							<div>標記為：</div>
							<a-button
								class="dealsBtn--success marginLft-10"
								:style="{ color: '#fff', background: '#0c923e', border: 'none' }"
								shape="round"
								@click="beforeSetDealStatus(recordData.dealId, 20)"
							>
								成功
							</a-button>
							<a-button
								class="marginLft-10"
								:style="{ color: '#fff', background: '#DC143C', border: 'none' }"
								shape="round"
								@click="beforeSetDealStatus(recordData.dealId, 30)"
							>
								失敗
							</a-button>
						</div>
						<div v-else class="flex">
							<a-button
								v-if="recordData.status && recordData.status == 20"
								class="marginLft-10"
								:style="{ color: '#fff', background: '#0c923e', border: 'none' }"
								shape="round"
							>
								已成功
							</a-button>
							<a-button
								v-else-if="recordData.status && recordData.status == 30"
								class="marginLft-10"
								:style="{ color: '#fff', background: '#DC143C', border: 'none' }"
								shape="round"
							>
								已失敗
							</a-button>
							
                            <myButton class="marginLft-10" @click="beforeSetDealStatus(recordData.dealId, 10)" text="重新開啟"/>
                            
							<!-- <a-button class="marginLft-10" @click="beforeSetDealStatus(recordData.dealId, 10)">
								重新開啟
							</a-button> -->
						</div>
					</div>
				</div>
				<addBusiness
					@handleOk="handleOk($event)"
					@handleCancel="handleCancel"
					:detailData="recordData"
					:isAddDeal="isAddDeal"
					v-if="visible"
				/>
			</a-modal>
		</template>
		<template>
		</template>
	</div>
</template>

<script>
import myButton from '@/components/Common/myButton'
import myMenu from './components/menu'
import moment from 'moment'
import { columns } from './config.js'
import transactionServices from './service'
import addBusiness from '@/components/public/addBusiness'
import { mapGetters } from 'vuex';
export default {
	name: 'Transaction',
	components: {
		addBusiness,
		myButton,
		myMenu,
	},
	data() {
		return {
			columns,
			dataSource: [],
			pagination: {},
			loading: false,
			selectedRowKeys: [],
			selectedRows: [],

			modalTitle: null,
			visible: false,

			recordData: {},

			btnArr: [
				{ key: 0, text: '全部' },
				{ key: 20, text: '成功' },
				{ key: 30, text: '失敗' },
			],
			tabIndex: 0,
			dealStatus: 0,

            isAddDeal: true
		}
	},
	watch: {
        '$route.path': {
            immediate: true,
            deep: true,
            handler(to, from) {
                if (from != to) {
                    // console.log('===from',from,'===to', to);
                    // console.log('跳轉到交易頁面時攜帶過來的參數：', this.$route.query, this.$route.params);
                    if (this.$route.query.dealId) {
                        this.getTableData({ dealId: this.$route.query.dealId })
                    } else if (this.$route.params.dealId) (
                        this.getTableData({ dealId: this.$route.params.dealId })
                    )

                };
            }
        },
		deep: true,
	},
	mounted() {
		// this.getTableData()
	},
	computed: {
		...mapGetters([
			'permissions',
			'deal',
			'userInfo'
		]),
		rowSelection() {
			return {
				onChange: (selectedRowKeys, selectedRows) => {
					this.selectedRowKeys = selectedRowKeys
					this.selectedRows = selectedRows
				},
			}
		},
	},
	activated() {
			let isHaveQuery = JSON.stringify(this.$route.query) == "{}";
			let isHaveParams = JSON.stringify(this.$route.params) == "{}";

			if (isHaveQuery && isHaveParams) {
					// console.log('執行了');
					this.initDealsData();
			} 
	},
	updated() {
		// 表格斑馬行顯示
		this.renderStripe()
	},
	methods: {
        initDealsData() {
            this.getTableData();
            this.tabIndex = 0;
            this.dealStatus = 0;
        },
		reloadDealsData(){
			this.getTableData({
				status: this.dealStatus,
			})
		},
		selectTab(index, item) {
			this.tabIndex = index
			this.dealStatus = item.key
			this.getTableData({
				status: this.dealStatus,
			})
		},
		//表格查詢
		async getTableData(inputParams = {}) {
			const { pageNum = 1, pageSize = 10, dealId = '', status = '' } = inputParams
			const params = {
				pageNum: pageNum,
				pageSize: pageSize,
				param: {
					dealId,
				},
			}
			if (status) params.param.status = status
			this.loading = true
			const { data, success, message } = await transactionServices.tableList(params)

			this.loading = false

			if (!success) return this.$message.error(message || '獲取交易清單失敗！')

			let { list, totalCount } = data

			if (dealId) {
				this.visible = true
				this.modalTitle = '編輯交易'
				this.recordData = list[0];
                this.isAddDeal = false;
			} else {
                this.dataSource = list
            }
            
			const pagination = { ...this.pagination }
			pagination.total = totalCount
			this.loading = false
			this.pagination = pagination

            if (!this.dataSource.length && dealId) {// 如果從聯絡人列表跳轉過來，這裡需要拉取交易清單的數據
                this.getTableData();
            }
		},

		//標記交易狀態
		beforeSetDealStatus(dealId, status) {
			let that = this
			if (status < 30) return that.setDealStatus(dealId, status)
			if (status == 30) {
				this.$confirm({
					title: '操作提示',
					content: `確認標記標記該交易為失敗嗎?`,
					okText: '確認',
					cancelText: '取消',
					onOk() {
						that.setDealStatus(dealId, status)
					},
					onCancel() {
						//console.log('Cancel');
					},
				})
			}
		},
		async setDealStatus(dealId, status) {
			const params = {
				param: {
					dealId,
					status,
				},
			}
			const { data, success, message } = await transactionServices.updateBusinessDealStatus(params)
			if (!success) return this.$message.error(message || '標記交易失敗！')
			this.$message.success('標記交易成功')
			this.visible = false
			this.getTableData({
				status: this.dealStatus,
			})
			// console.log(data, message, success);
		},

		//翻頁
		handleTableChange(pagination, filters, sorter) {
			const pager = { ...this.pagination }
			pager.current = pagination.current
			this.pagination = pager
			this.getTableData({
				pageNum: pagination.current,
				pageSize: pagination.pageSize,
			})
		},

		showModal() {
			this.visible = true
      		this.isAddDeal = true
			this.modalTitle = '新增交易'
			this.recordData = {}
			this.recordData.ownerUser = this.userInfo.id;
			this.recordData.ownerUserName = this.userInfo.userName;
		},
		//保存交易
		async handleOk(formData) {
            console.log('到這裡來了！！！', formData);
			const { dealDate = null, ...other } = formData
			const param = {
				dealId: this.recordData.dealId,
				dealDate: dealDate ? moment(dealDate).format('YYYY-MM-DD HH:mm:ss') : '',
				...other,
			}
			//TODO:創建公司和聯絡人,後端支持創建聯絡人和公司返回數據最好的方式
			if(!param.companyId && param.companyName){
				let createResult = await this.$api.company.createCompany({
					param:{
						name:param.companyName,
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
						name:param.companyName,
					},
				});
				if(!queryResult.success){
					throw this.$message.error('查询新增組織失敗');
				}
				if(queryResult.data && queryResult.data.list && queryResult.data.list.length)
				{
					param.companyId = queryResult.data.list[0].id;
				}
				else{
					throw this.$message.error('查询新增組織失敗');
				}
			}
			if(!param.customerId && param.customerName)
			{
				let createResult = await this.$api.customer.addCustomer({
					name:param.customerName,
					companyId:param.companyId,
					companyName:param.companyName,
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
					name:param.customerName
				});
				if(!queryResult.success){
					throw this.$message.error('查询新增聯絡人失敗');
				}
				if(queryResult.data && queryResult.data.list && queryResult.data.list.length)
				{
					param.customerId = queryResult.data.list[0].id;
				}
				else{
					throw this.$message.error('查询新增聯絡人失敗');
				}
			}
			//編輯
			if (this.recordData.dealId) {
				const res = await transactionServices.editBusiness({ param })
				if (res.code == 0) {
					this.visible = false
					this.$message.success('修改成功')
					this.getTableData()
				} else {
					this.$message.error(res.message)
				}
			} else {
				//新增
				const res = await transactionServices.addBusiness({ param })
				if (res.code == 0) {
					this.visible = false
					this.$message.success('新增成功')
					this.getTableData()
				} else {
					this.$message.error(res.message)
				}
			}
		},
		handleCancel() {
			this.visible = false
		},

		//編輯
		toEdit(record) {
			this.visible = true
			this.modalTitle = '編輯交易'
      		this.isAddDeal = false
			this.recordData = record
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

		getParentNode(obj, forwardKey, component) {
      function fun(node) {
        if (node) {
          if (node.permissionDetailVoList[forwardKey]) {
            arr.unshift({
              id: node.data.id,
              node: node,
              component: component,
              level: node.data.level,
              label: node.data[forwardKey],
            });
          }
          fun(node.parent);
        }
      }
      fun(obj);
    },

		//刪除交易
		toDelete(record) {
			// console.log(record, record.dealId, this.selectedRowKeys);
			let tmpDealId = null
			if (record) {
				let { dealId } = record
				tmpDealId = dealId
			}
			// const { dealId } = record

			const params = {
				param: {
					dealIds: tmpDealId ? [tmpDealId] : this.selectedRowKeys,
				},
			}
			let that = this

			this.$confirm({
				title: '確認刪除交易嗎?',
				content: '',
				okText: '確認刪除',
				okType: '取消',
				cancelText: '取消',
				onOk() {
					transactionServices.deleteBusiness(params).then(res => {
						if (res.code == 0) {
							that.$message.success('刪除成功')
							that.getTableData()
							that.selectedRows = []
							that.selectedRowKeys = []
						}
					})
				},
				onCancel() {
					console.log('Cancel')
				},
			})
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
		customRow(record, index) {
            let successColor = "#0c923e";
            let failColor = "#f94839";
			return {
				style: {
					color: record.status ==  20 ? successColor : record.status == 30 ? failColor : '' ,
				}
			}
		},
	},
    filters: {
        filterTime(time) {
            return moment(time).format('YYYY年MM月DD日 hh:mm');
        },
    },
}
</script>

<style lang="less">
.dealsUI {
	width: 100%;
	height: 100%;
	overflow-y: auto;
	min-width: 860px;
	z-index: 10;
	&-header {
		width: 100%;
		display: flex;
		padding: 16px 16px 10px;
	}
	&-content {
		flex: 1;
		min-height: 500px;
		min-width: 680px;
		background: #fff;
		margin: 0 20px 20px;
		border-radius: 7px;
	}
    .btn-border {
        border: 1px solid #f86f54;
        color: #f86f54;
        padding: 2px 15px;
        font-size: 14px;
    }

}

.dealsUI .tabBtn {
	display: flex;
	min-width: 200px;
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
