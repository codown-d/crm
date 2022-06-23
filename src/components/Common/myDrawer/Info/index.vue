<template>
	<div class="infoUI flex-column">
		<!--聯絡人(客戶)資料-->
		<div class="infoUI-box flex-column">
			<div class="infoUI-title flex">
				<div class="title">詳細</div>
				<div class="flex">
					<!-- <a-button icon="plus"  /> -->
					<!-- <a-button icon="edit">定制欄位 </a-button> -->
					<a-button @click="editCompany">修改資料</a-button>
				</div>
			</div>
			<div class="infoUI-body flex-column">
				<div class="default-text">
					姓名
					<span v-if="currentData">{{ currentData.name }}</span>
				</div>
				<div class="default-text">
					電話
					<br />
					<span v-if="currentData">
						<label v-for="(item, index) in currentData.phoneList" :key="index">
							{{ item.type }}-{{ item.phone }}
							<br />
						</label>
					</span>
				</div>
				<div class="default-text">
					郵箱
					<br />
					<span v-if="currentData">
						<label v-for="(item, index) in currentData.emailList" :key="index">
							{{ item.type }}-{{ item.email }}
							<br />
						</label>
					</span>
				</div>
			</div>
			<!--
          <div class="infoUI-foot primary-box flex">
              <div class="default-text">智慧型網路資料</div>
              <div class="default-text">更多</div>
          </div>-->
		</div>

		<div class="infoUI-box flex-column">
			<div class="infoUI-title flex">
				<div class="title">組織</div>
				<div class="flex"><a-button @click="editCompany">修改組織</a-button></div>
			</div>
			<div class="infoUI-body flex-column">
				<div class="default-text" v-if="currentData.companyName">{{ currentData.companyName }}</div>
				<div class="default-text" v-else>沒有任何組織和這個人有關</div>
			</div>
		</div>

		<div class="infoUI-box flex-column">
			<div class="infoUI-title flex">
				<div class="title">交易</div>
				<div class="flex">
					<!-- <a-button icon="plus"  /> -->
					<a-button @click="showAddBusinessDrawer">新增交易</a-button>
				</div>
			</div>
			<div class="infoUI-body flex-column"><div class="default-text">暫無交易</div></div>
		</div>
		<!--
      <div class="infoUI-box flex-column">
          <div class="infoUI-title flex">
              <div class="title">概覽</div>
          </div>
          <div class="infoUI-body flex-column">
              <div class="default-text">不活躍的</div> 
              <div class="default-text flex flex-between">
                  <div>創造的</div>
                  <div>2020.05.12</div>
              </div>          
          </div>
      </div>
      -->
		<!--
       <div class="infoUI-box flex-column">
          <div class="infoUI-title flex">
              <div class="title">跟隨者(1)</div>
              <div class="flex">
                      <a-button icon="plus"  />
                      <a-button >所有</a-button>
              </div>
          </div>          
      </div>
      -->

		<a-modal title="增加交易" :visible="isDrawerShow" :confirm-loading="confirmBusinessLoading" @ok="handleBusinessOK" @cancel="handleCancel" :footer="false" width="750px">
			<AddBusiness msg="增加交易" :show="isDrawerShow" :formEdit="formEditBusiness" @handleOk="handleBusinessOK" @handleCancel="handleCancel" />
		</a-modal>
	</div>
</template>

<script>
import AddBusiness from '@/components/Business/AddBusiness';
// import AddCust from '@/components/Customer/AddCust.vue';
export default {
	props: ['currentData'],
	components: {
		AddBusiness,
		// AddCust
	},
	data() {
		return {
			isDrawerShow: false,
			confirmBusinessLoading: true,
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
			}
			//currentCustomerData:{...this.$store.state.main.currentCustomer}
		};
	},
	created() {
		//console.log("created  currentCustomerData",this.currentCustomerData)
	},
	methods: {
		showAddBusinessDrawer() {
			this.isDrawerShow = true;
			//this.$emit('showDrawer', true);
		},
		handleCancel() {
			//
			this.isDrawerShow = false;
		},
		handleBusinessOK() {
			this.isDrawerShow = false;
		},
		editCompany() {
			this.$message.warning('功能開發中');
		}
	}
};
</script>

<style>
.infoUI {
	height: 100%;
	width: 100%;
}

.infoUI .flex-column {
	align-items: flex-start;
}

.infoUI-box {
	padding: 20px;
	border-bottom: 1px solid #e8e8e8;
}

.infoUI .flex {
	justify-content: space-between;
}

.infoUI-title {
	width: 100%;
}

.infoUI-title .title {
	font-size: 18px;
	font-weight: 600;
	color: #f7a84a;
}

.infoUI-title button {
	margin-left: 10px;
}

.infoUI-body {
	font-size: 15px;
	line-height: 1.8;
	width: 100%;
}

.infoUI-foot {
	padding: 10px 10px 10px 20px;
	margin-top: 15px;
	width: 100%;
}

.flex-between {
	justify-content: space-between;
	width: 100%;
}
</style>
