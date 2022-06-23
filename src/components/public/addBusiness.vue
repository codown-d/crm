<template>
	<div class="add-business-plus">
        <a-spin :spinning="loading">
            <a-form-model :model="formData" ref="BusinessForm" :rules="rules" destroyOnClose>
                <a-row>
                    <a-col :xs="12" style="border-right: 1px solid #ddd; padding-right: 20px">
                        
                        <a-form-model-item label="連絡人" prop="customerName">
                            <dictSelect
                            :defaultValue="formData.customerId"
                            :defaultName="formData.customerName"
                            :selectDict="'customer'"
                            :showSelectInsert="true"
                            @selectChange="customerChange($event)"/>
                        </a-form-model-item>
                        <a-form-model-item label="公司/組織" prop="companyName">
                            <dictSelect
                            :defaultValue="formData.companyId"
                            :defaultName="formData.companyName"
                            :selectDict="'company'"
                            :showSelectInsert="true"
                            @selectChange="companyChange($event)"/>
                        </a-form-model-item>
                        <a-form-model-item label="標題" prop="title">
                            <a-input placeholder="請輸入標題" v-model="formData.title" allowClear/>
                        </a-form-model-item>
                        <a-form-model-item ref="money" label="金額" prop="money">
                            <a-input
                                placeholder="請輸入金額"
                                v-model="formData.money"
                                style="width: 62%;"
                                allowClear
                            />
                            <a-select placeholder="請選擇貨幣" class="marginLft-8" style="width: 100px;font-size: 1em" v-model="formData.currencyId">
                                <a-select-option :value="0">新台幣</a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item ref="dealDate" label="預計結束日期" prop="dealDate">
                            <a-date-picker class="mgnLeft" v-model="formData.dealDate" allowClear/>
                        </a-form-model-item>

                        <a-form-model-item label="銷售流程" prop="salesFlowId">
                            <a-select
                                placeholder="請選擇銷售流程"
                                v-model="formData.salesFlowId"
                                style="width: 100%;font-size: 1em"
                                @change="processChange"
                                :showSearch="true"
                            >
                                <a-select-option v-for="(item, index) in processOption" :value="item.id" :key="item.id">
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>

                        <div class="stage" v-if="stage" >
                            <div class="stage_item" v-for="(item,index) in stageOption " :key="index" >
                                <div :class="{ 'item_box': true, 'active_stage': isActiveStage(item.salesStageId) }" @click="onStage($event,index,item.salesStageId)"></div>
                                <div :class="{ 'frame': true, 'line': isActiveStage(item.salesStageId) }" v-show="index < stageOption.length-1" ></div>
                                <div class="box_hover">{{item.name}}</div>
                            </div>
                        </div>
                    </a-col>


                    <a-col :xs="12" style="padding-left: 20px">
                        <div class="add-business-title">個人資訊</div>

                        <a-form-model-item prop="phoneList" ref="addphonemail">
                            <slot name="label" class="flex-between">
                                <span>電話</span>
                                <a-button @click="addInputPhone" type="link" style="float: right">新增電話</a-button>
                            </slot>
                            <div class="AddCust-inputArea" v-for="(item, index) in formData.phoneList" :key="index">
                                <a-input
                                    placeholder="請輸入電話"
                                    :id="item.id"
                                    v-model="item.phone"
                                    class="AddCust-inputArea-left"
                                    @change="onFormChange"
                                    @blur="() => {$refs.addphonemail.onFieldBlur()}"
                                    style="width: 50%"
                                    allowClear
                                ></a-input>
                                <a-select placeholder="電話類型" style="margin-left: 8px;width: 30%;font-size: 1em" v-model="item.type">
                                    <a-select-option value="work">工作</a-select-option>
                                    <a-select-option value="family">家庭</a-select-option>
                                    <a-select-option value="other">其他</a-select-option>
                                </a-select>
                                <a-button v-if="index > 0" @click="deletePhone(index)" type="link">
                                    <a-icon type="delete" :style="{ fontSize: '20px' }" />
                                </a-button>
                            </div>
                        </a-form-model-item>

                        <!-- 郵箱 -->
                        <a-form-model-item prop="emailList" ref="addusermail">
                            <slot name="label" class="flex-between">
                                <span>電子郵件</span>
                                <a-button @click="addInputEmail" type="link" style="float: right">新增郵件</a-button>
                            </slot>
                            <div class="AddCust-inputArea" v-for="(item, index) in formData.emailList" :key="index">
                                <a-input
                                    placeholder="請輸入郵件"
                                    :id="item.id"
                                    v-model="item.email"
                                    class="AddCust-inputArea-left"
                                    @change="onFormChange"
                                    @blur="() => {$refs.addusermail.onFieldBlur()}"
                                    style="width: 50%"
                                    allowClear
                                ></a-input>
                                <a-select placeholder="郵件類型" style="margin-left: 8px;width: 30%;font-size: 1em" v-model="item.type">
                                    <a-select-option value="work">工作</a-select-option>
                                    <a-select-option value="family">家庭</a-select-option>
                                    <a-select-option value="other">其他</a-select-option>
                                </a-select>
                                <a-button v-if="index > 0" @click="deleteEmail(index)" type="link">
                                    <a-icon type="delete" :style="{ fontSize: '20px' }" />
                                </a-button>
                            </div>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <div class="footer">
                    <a-button class="mr-5" @click="close">關閉</a-button>
                    <a-button
                        v-if="excutePermission(isAddDeal ? deal.add : deal.updateDetail)"
                        type="danger" 
                        class="marginLft-15" 
                        @click="save"
                    >保存</a-button>
                </div>
            </a-form-model>
        </a-spin>
	</div>
</template>
<script>
import Services from '@/services/common.js'
import { mapGetters } from 'vuex';
import dictSelect from '@/components/Common/dictSelect'

export default {
    components:{
        dictSelect
    },
	props: {
		detailData: {
			type: Object,
			default: () => {},
		},
        isAddDeal: {
            type: Boolean,
            default: true
        },
	},
	data() {
         let validateMail = (rule, value, callback) => {
            // 檢測每一項是否符合要求
            let checkResult = [];
            value.forEach(item => {
                if (item.email.length) {
                    let result = this.$util.checkMail(item.email);
                    checkResult.push(result.flag)
                } else {
                    checkResult.push(true)
                }
            });
            // 看最後的結果是否符合要求
            if (checkResult.some(i => i == false)) {
                callback(new Error('請輸入有效的電子郵件地址!'));
            } else {
                callback();
            }
        };
       let validatePhone = (rule, value, callback) => {
            // 檢測每一項是否符合要求
            let checkResult = [];
            value.forEach(item => {
                if (item.phone.length) {
                    let result = this.$util.checkPhone(item.phone);
                    checkResult.push(result.flag)
                } else {
                    checkResult.push(true)
                }
            });
            // 看最後的結果是否符合要求
            if (checkResult.some(i => i == false)) {
                callback(new Error('請輸入有效的手機號碼或座機號碼！'));
            } else {
                callback();
            }
        };
		return {
			customerInfo: {},
			formData: {// http://18.138.132.121:3000/project/11/interface/api/206
                companyId: undefined,
                companyName:undefined,
                currencyId: 0,//貨幣的ID問題
                customerId: undefined,
                customerName:undefined,
				dealDate: '',

                dealId: '',
				title: '',
                money: '',

                ownerUser: '',// 商機歸屬人ID
                salesFlowId: undefined,
                salesStageId: '',

				emailList: [{ email: '', type: 'work', typeName: '' }],
				phoneList: [{ phone: '', type: 'work', typeName: '' }],
			},

			rules: {
				title: [{ required: true, message: '請輸入聯絡人', trigger: 'blur' }],
                customerName: [{ required: true, message: '請關聯該交易的聯絡人', trigger: ['blur', 'change'] }],
                companyName: [{ required: true, message: '請關聯該交易的組織', trigger: ['blur', 'change'] }],
                money: [{ required: true, message: '請輸入金額', trigger: ['blur', 'change'] }],
                dealDate: [{ required: true, message: '請選擇預計結束日期', trigger: ['blur', 'change'] }],
                salesFlowId: [{ required: true, message: '請選擇銷售流程', trigger: ['blur', 'change'] }],
                phoneList: [{ validator: validatePhone, trigger:  'blur' }],
                emailList: [{ validator: validateMail, trigger:  'blur' }],
			},

			// //人員
			// userSearchResult: [],
			value: undefined,
            // defaultCustomerName: '',
            // isSearchUser: false,

			//組織
			// companySearchResult: [],
			// companyValue: undefined,
            // defaultCompanyName: '',
            // isSearchCompany: false,

			processOption: [], //銷售流程
			stageOption: [], //交易階段
			stage:false,

            loading: false,// 表單全域loading
		}
	},
	computed: {
        ...mapGetters([
            'permissions',
            'deal'
        ]),
        isActiveStage() {
            return function(salesStageId) {
                return (this.formData.salesStageId > salesStageId || this.formData.salesStageId == salesStageId) ? true : false
            }
        }
    },
	watch: {
		detailData: {
			immediate: true,
            deep: true,
			async handler(val) {
                // console.log('檢測到了detailData的變動', val);
                this.loading = true;
                //1、獲取交易流程、階段
				this.processOption = await this.getProcessOption()

                if (!this.isAddDeal) {// 編輯交易，初始化表單

                    console.log('編輯交易的表單: ', val);
                    const { customerId = undefined, customerName = '', companyId = undefined, companyName = '', salesStageId = '', salesStageName = '' } = val
                    this.formData = { ...this.formData, ...val, customerId: customerId }

                    // if (this.isAddWithCompany) {// 組織模塊添加活動
                    //     // console.log('111');
                    //     //設置組織預設值
                    //     this.companyOption = [{ companyId: id, companyName: name }]
                    //     this.form.companyId = id;

                    // } else if (this.isAddWithCust) {// 客戶模塊添加活動
                    //     //設置人員預設值
                    //     this.data = [{ id, name }]
                    //     //設置組織預設值
                    //     this.companyOption = [{ companyId, companyName }]
                    // }

                    // 設置交易階段
                    const target = this.processOption.find(item => item.id === this.formData.salesFlowId)
                    this.stageOption = target.businessSalesStageList || []
                    this.stage = true;
                    if (!this.formData.phoneList || !this.formData.phoneList.length) {
                        this.formData.phoneList = [
                            {
                                phone: "",
                                type: "work",
                            },
                        ];
                    }
                    if (!this.formData.emailList || !this.formData.emailList.length) {
                        this.formData.emailList = [
                            {
                                email: "",
                                type: "work",
                            },
                        ];
                    }

                    // console.log(this.formData.salesStageId);

                    this.formData.currencyId = 0;

                } else {// 新增交易，初始化表單
                    console.log('調用了新增交易組件', val);
                    // 獲取組織列表
                    // this.selectFetch();
                    // this.selectFetchCompany();

                    // 判斷是否是在聯絡人模塊的抽屜詳情新增交易
                    const { customerId = undefined, name = '', customerName = '', companyId = undefined, companyName = '' } = val
                    this.formData = { 
                        ...this.formData, 
                        ...val,
                        customerId, 
                        customerName: name == '' ? customerName : name, 
                        companyId, 
                        companyName: companyName 
                    };
                    if (!this.formData.phoneList || !this.formData.phoneList.length) {
                        this.formData.phoneList = [
                            {
                                phone: "",
                                type: "work",
                            },
                        ];
                    }
                    if (!this.formData.emailList || !this.formData.emailList.length) {
                        this.formData.emailList = [
                            {
                                email: "",
                                type: "work",
                            },
                        ];
                    }

                    if (!this.processOption.length) return this.loading = false;
                    let laseSalesFlow = this.processOption[this.processOption.length - 1];
                    this.processChange(laseSalesFlow.id);
                    
                }   

                this.loading = false;

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
		//獲取銷售流程
		async getProcessOption() {
			const params = {
				param: {},
			}
			const res = await Services.transactionProcessList(params)
            if (res.code != 0) this.$message.error(res.message || '交易流程查詢失敗!');
			const resData = res.data;
			return resData || [];
		},

		//根據銷售流程選擇銷售階段下拉
		processChange(value) {
			const target = this.processOption.find(item => item.id === value)
			this.stageOption = target.businessSalesStageList || []
			this.stage=true
			//更新銷售流程，清空銷售階段
			this.formData = { ...this.formData, salesFlowId: value, salesStageId: this.stageOption[0].salesStageId }
		},
		// 階段
		onStage(e,index, salesStageId){// fix: 交易階段還是有問題！！！！ 
			const parentNode=e.target.parentNode.parentNode;
            const children=parentNode.children;
			// console.log(e.target.parentNode.parentNode.children[0].children[0])
            // console.log(e, index);
			// console.log(index)
			for (let i = 0; i < children.length; i++) {
				if( i <=index){
					children[i].children[0].className='active_stage';
					// console.log(children[i].children)
					children[i].children[1].className='line'
				}else{
					children[i].children[0].className = 'item_box';
					children[i].children[1].className='frame'
					
				}
            }
            this.formData.salesStageId = salesStageId;
		},
		//動態添加email
		addInputEmail() {
			if (this.formData.emailList.length == 5) return this.$message.warning('最多添加5個郵箱')
			this.formData.emailList.push({
				email: '',
				type: 'work',
			})
			this.$forceUpdate()
		},
		//動態刪除email
		deleteEmail(index) {
			this.formData.emailList.splice(index, 1)
			this.$forceUpdate()
		},
		//動態添加電話號碼
		addInputPhone() {
			if (this.formData.phoneList.length == 5) return this.$message.warning('最多添加5個電話')
			this.formData.phoneList.push({
				phone: '',
				type: 'work',
			})
			this.$forceUpdate()
		},
		//動態刪除電話號碼
		deletePhone(index) {
			this.formData.phoneList.splice(index, 1)
			this.$forceUpdate()
		},
		close() {
			this.$emit('handleCancel')
			this.reset()
		},
		create() {
			this.$emit('handleCreate')
		},
        onFormChange(){
            this.$forceUpdate();
        },

		//新增交易
		save() {
            // console.log('提交前列印數據', this.formData);
			this.$refs.BusinessForm.validate(async valid => {
                // console.log(valid, this.isAddDeal);
				if (valid) {
                    console.log('this.formData',this.formData);
                    if(this.formData.money < 0){
                        throw this.$message.error('交易金額不能是負數！');
                    }
                    //TODO:創建公司和聯絡人,後端支持創建聯絡人和公司返回數據最好的方式
                    if(!this.formData.companyId && this.formData.companyName){
                        let createResult = await this.$api.company.createCompany({
                            param:{
                                name:this.formData.companyName,
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
                                name:this.formData.companyName,
                            },
                        });
                        if(!queryResult.success){
                            throw this.$message.error('查询新增組織失敗');
                        }
                        if(queryResult.data && queryResult.data.list && queryResult.data.list.length)
                        {
                            this.formData.companyId = queryResult.data.list[0].id;
                        }
                        else{
                            throw this.$message.error('查询新增組織失敗');
                        }
                    }
                    if(!this.formData.customerId && this.formData.customerName)
                    {
                        let createResult = await this.$api.customer.addCustomer({
                            name:this.formData.customerName,
                            companyId:this.formData.companyId,
                            companyName:this.formData.companyName,
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
                            name:this.formData.customerName
                        });
                        if(!queryResult.success){
                            throw this.$message.error('查询新增聯絡人失敗');
                        }
                        if(queryResult.data && queryResult.data.list && queryResult.data.list.length)
                        {
                            this.formData.customerId = queryResult.data.list[0].id;
                        }
                        else{
                            throw this.$message.error('查询新增聯絡人失敗');
                        }
                    }

                    if (this.isAddDeal) {
                        let params = this.$lodash.cloneDeep(this.formData);
                        delete params.dealId;
                        delete params.currencyId;
                        this.$emit('handleOk', params)
                    } else {
                        delete this.formData.currencyId;
                        // console.log('到這裡來了！！！123123123123123', this.formData);
					    this.$emit('handleOk', this.formData)
                    }
					// this.reset()
				}
			})
		},
		reset() {
			this.$refs.BusinessForm.resetFields()
		},
        customerChange(value){
            console.log('value',value)
            this.formData.customerId = value.id;
            this.formData.customerName = value.name;
            if(this.formData.customerId && value.companyId && !this.formData.companyName){
                this.formData.companyId = value.companyId;
                this.formData.companyName = value.companyName;
                this.$refs.BusinessForm.validateField("companyName");
            }
            this.$refs.BusinessForm.validateField("customerName");
        },
        companyChange(value){
            this.formData.companyId = value.id;
            this.formData.companyName = value.name;
            if (this.formData.companyName) {
                this.formData.title = this.formData.companyName + '交易'
            }
            this.$refs.BusinessForm.validateField("companyName");
                
        },
	},
}
</script>
<style>
.add-business-plus .ant-form-item-label {
	line-height: 20px;
}
.add-business-plus .ant-form-item {
	margin-bottom: 10px;
}
</style>
<style scoped>
.status-active {
	background: orange;
}
.status-normal {
	background: #dddddd;
}
.status-tag {
	display: inline-block;
	width: 35px;
	height: 10px;
	margin-right: 5px;
}
.add-business-title {
	font-size: 15px;
	color: #000;
}
.slot-label {
	display: flex;
	justify-content: space-between;
	line-height: 25px;
}
.table-header {
	display: flex;
}

.table-header div {
	/* text-align: center; */
	margin-right: 5px;
}
.table-item {
	margin-bottom: 2px;
	box-sizing: border-box;
	position: relative;
}
.table-item input {
	margin-right: 5px;
}
.scorll-box {
	max-height: 200px;
	overflow-y: auto;
}
.scorll-box-item {
	position: relative;
}
.delete-icon {
	position: absolute;
	right: 0px;
	top: 10px;
	font-size: 18px;
	cursor: pointer;
}
.footer {
	display: flex;
	justify-content: center;
    align-items: flex-end;
    height: 55px;
}


/* 階段進度條 */
.stage{
    
	display:flex;
	height:30px;
}
.stage_item{
	position: relative;
	flex:1;
	cursor:pointer;
	/* text-align:right; */
	/* border-radius:3px; */
}
.box_hover{
	position:absolute;
	width:80%;
	padding:5px;
	margin-top:5px;
	text-align:center;
	left:50%;
	transform: translateX(-50%);
	background:#f3f3f3;
	opacity:0;
	z-index:9999;
}
.stage_item:hover .box_hover{
	opacity:1;
}
.item_box{
	width:100%;
	height:30px;
    background:#f3f3f3;
	/* text-align:right; */
}
.stage div:first-child .item_box{
	background:#ff9980;
	/* text-align:right; */
	/* cursor:pointer; */
}
.frame{
	float:right;
}
.stage div:first-child .frame::before{
	content: "";
	position: absolute;
	top: -1px;
	width: 0;
	height: 0;
	border-style: solid;
	border-width: 15px 0 16px 15px;
	z-index: 1000 !important;
	border-color: transparent transparent transparent #ff9980;
}
.stage div:first-child .frame::after {
  content: "";
  position: absolute;
  top: -2px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 16px 0 17px 16px;
  z-index: 999 !important;
  border-color: transparent transparent transparent #ffffff;
}


.frame::before {
  content: "";
  position: absolute;
  top: -1px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 15px 0 16px 15px;
  z-index: 1000 !important;
  border-color: transparent transparent transparent #f3f3f3;
}
.frame::after {
  content: "";
  position: absolute;
  top: -2px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 16px 0 17px 16px;
  z-index: 999 !important;
  border-color: transparent transparent transparent #ffffff;
}
.active_stage{
	/* flex:1; */
	width:100%;
	height:30px;
    background:#ff9980;
	/* text-align:right; */
}
.line{
	float:right;
}
.line::before {
  content: "";
  position: absolute;
  top: -1px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 15px 0 16px 15px;
  z-index: 1000 !important;
  border-color: transparent transparent transparent #ff9980;
}
.line::after {
  content: "";
  position: absolute;
  top: -2px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 16px 0 17px 16px;
  z-index: 999 !important;
  border-color: transparent transparent transparent #ffffff;
}
</style>
