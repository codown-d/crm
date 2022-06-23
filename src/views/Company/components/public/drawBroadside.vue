<template>
    <div class="draw-broadside">
        <!-- <div class="broadside-item">
            <div class="item-header">
                <span class="title">組織</span>
                <a-button @click="editCompanyInfo">修改組織</a-button>
            </div>
            <div class="default-text">{{ detail.companyName || '沒有任何組織和這個人有關' }}</div>
        </div> -->

        <div class="broadside-item">
            <div class="item-header">
                <span class="title">組織</span>
                <a-button @click="editCompany">修改組織</a-button>
            </div>
            <!-- <div class="default-text" v-if="detail.name != null && detail.name != ''" >{{ detail.name }}</div>
            <div class="default-text" v-if="detail.companyCode != null && detail.companyCode != ''" >統一編號: {{ detail.companyCode }}</div>
            <div class="default-text" v-if="detail.foundDate != null && detail.foundDate != ''" >成立日期: {{ detail.foundDate }}</div>
            <div class="default-text" v-if="detail.industrial != null && detail.industrial != ''" >工業類別: {{ detail.industrial }}</div>
            <div class="default-text" v-if="detail.sales != null && detail.sales != ''" >營業額: {{ detail.sales }}</div>
            <div class="default-text" v-if="detail.staffCount != null && detail.staffCount != ''" >員工人數: {{ detail.staffCount }}</div>
            <div class="default-text" v-if="detail.phone != null && detail.phone != ''" >電話: {{ detail.phone }}</div>
            <div class="default-text" v-if="detail.fax != null && detail.fax != ''" >傳真: {{ detail.fax }}</div>
            <div class="default-text" v-if="detail.address != null && detail.address != ''" >地址: {{ detail.address }}</div>
            <div class="default-text" v-if="detail.email != null && detail.email != ''" >電子郵件: {{ detail.email }}</div>
            <div class="default-text" v-if="detail.website != null && detail.website != ''" >網址: {{ detail.website }}</div>
            <div class="default-text" v-if="detail.socialAccount != null && detail.socialAccount != ''" >FB粉絲專頁: {{ detail.socialAccount }}</div>
            <div class="default-text" v-if="detail.remark != null && detail.remark != ''" >備註: {{ detail.remark }}</div> -->
            <div class="default-text" >名稱：{{ detail.name }}</div>
            <div class="default-text" >統一編號: {{ detail.companyCode }}</div>
            <div class="default-text" >成立日期: {{ detail.foundDate }}</div>
            <div class="default-text" >工業類別: {{ detail.industrial }}</div>
            <div class="default-text" >營業額: {{ detail.sales }}</div>
            <div class="default-text" >員工人數: {{ detail.staffCount }}</div>
            <div class="default-text" >電話: {{ detail.phone }}</div>
            <div class="default-text" >傳真: {{ detail.fax }}</div>
            <div class="default-text" >地址: {{ detail.address }}</div>
            <div class="default-text" >電子郵件: {{ detail.email }}</div>
            <div class="default-text" >網址: {{ detail.website }}</div>
            <div class="default-text" >FB粉絲專頁: {{ detail.socialAccount }}</div>
            <div class="default-text" >備註: {{ detail.remark }}</div>

        </div>

        <div class="broadside-item">
            <div class="item-header">
                <span class="title">人員</span>
                <a-button @click="addPerson">新增人員</a-button>
            </div>
            <!-- <a-button class="default-text" type="link" v-for="(item, index) in personList" :key="index" @click="toCustomerDetail(item)">{{item.name }} </a-button> -->
            <div class="default-text" v-for="(item, index) in personList" :key="index" @click="toCustomerDetail(item)"><span style="color:blue;">{{ item.name }}</span></div>
        </div>

        <div class="broadside-item">
            <div class="item-header">
                <span class="title">交易</span>
                <a-button @click="addBusiness">新增交易</a-button>
            </div>
            <div class="default-text">
                <div class="hhdbc" v-for="(item, index) in businessList" :key="index" @click="toDeals(item)">
                    <div class="hhdbc_title">{{ item.salesFlowName }}</div>
                    <div class="hhdbc_name">
                        <a-icon type="user" style="margin-right: 10px" />
                        <span>{{ item.createUserName }}</span>
                    </div>
                    <step :data="item.businessSalesStageList" :salesStageId="item.salesStageId" @updataStage="updataStage($event, item.dealId)" />
                </div>
            </div>
        </div>

        <a-modal :title="editModalTit" :visible="isEditCompanyShow" :confirm-loading="confirmLoading" :footer="null" @cancel="handleCancelCompany" :dialog-style="{ top: '0px' }" width="750px">
            <AddCompany :formEdit="editDetail" :msg="editModalTit" @handleOk="handleCompanyOk" @handleCancel="handleCancelCompany" />
        </a-modal>
        <a-modal
			:dialog-style="{ top: '0px' }"
			:title="addModelTit"
			:visible="isAddCustomerShow"
			:footer="null"
			@cancel="handleCancelContact"
			width="750px"
			wrapClassName="customerAddLayer"
		>
			<AddCust :formEdit="formContact" @handleOk="handleOkContact" @handleCancel="handleCancelContact" />
		</a-modal>

    </div>
</template>
<script>
import Services from '@/services/common.js'
import companyServices from '@/services/company.js'
import Step from '@/components/public/step.vue'
import AddCust from '@/components/public/addCustomer.vue'
import AddCompany from '@/views/Company/components/AddCompany.vue'
export default {
    components: {
        Step,
        AddCompany,
        AddCust
    },
    data() {
        return {
            form: this.$form.createForm(this, { name: 'coordinated' }),
            detail: {},
            editDetail: {},
            confirmLoading: false,
            isAddCustomerShow: false,
            addModelTit: '新增',

            editModalTit: '編輯公司',
            isEditCompanyShow: false,
            //人員
            data: [],
            value: undefined,

            formContact: {},

            personList: [],

            businessList: [], //交易清單
        }
    },
    props: {
        detailData: {
            type: Object,
            default: () => {},
        },
        list: {
            type: Array,
            default: () => [],
        },
    },
    watch: {
        detailData: {
            immediate: true,
            deep:true,
            handler(val, oldVal) {
                this.detail = val
                this.salesStageIndex = val.salesFlowId
                this.serarchContact()
            },
        },
        list: {
            immediate: true,
            handler(val, oldVal) {
                this.businessList = val
            },
        },
    },
    methods: {
        //編輯交易
        toDeals(val){
            console.log("addBusiness",val)
            //  this.$router.push({name:'Deals',params:{data:val}} )
            //  this.$emit('close')
            this.$emit("addBusiness",val);
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
        handleCompanyOk() {
            // window.reload();
            this.isEditCompanyShow = false;
            this.$emit('searchCompanyInfo');
            this.$emit('editCompanyOK');
        },
        handleCancelCompany() {
            this.isEditCompanyShow = false;
        },
       
        handleCancelPerson(e) {
            this.isEditCompanyShow = false
        },

        //人員--start
        async selectFetch(value) {
            const params = {
                pageNum: 1,
                pageSize: 10,
                param: { name: value },
            }
            const {
                data: { list = [] },
            } = await Services.searchPersonList(params)
            this.data = list
        },
        handleSearch(value) {
            this.selectFetch(value)
        },
        handleChange(value) {
            this.value = value
            // this.tageCompany = this.data.find((item) => item.id === value)
            // this.form.company = this.tageCompany.companyName
        },

        addPerson() {
            this.addModelTit = '新增客戶資料'
            this.formContact = {
                editType: 'add',
                companyId: this.detailData.id,
                companyName: this.detailData.name,
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
            this.isAddCustomerShow = true;
            // this.$nextTick(() => {
                
            // });
        },
        toCustomerDetail(item){
            // this.addModelTit = '修改客戶資料'
            // this.formContact = {
            //     editType:'edit',
            //     ...item
            // };
            // this.isAddCustomerShow = true;
            this.$emit("close");
            console.log('item',item)
            this.$router.push({
                name: 'Persons',
                params: {
                    id: item.id
                }
            });
        },
        handleCancelContact() {
            this.isAddCustomerShow = false
        },
        handleOkContact(){
			this.isAddCustomerShow = false
			this.serarchContact();
        },
        serarchContact() {
            const params = {
                pageNum: 1,
                pageSize: 10,
                param: {
                    companyId: this.detailData.id,
                },
            }
            Services.searchPersonList(params).then((res) => {
                if (res.code == 0) {
                    this.personList = res.data.list || []
                }
            })
        },
        //人員--end

        addBusiness() {
            this.$emit('addBusiness')
        },
        // editCompany() {},
        // editCompanyInfo() {
        //     this.isEditCompanyShow = true
        // },
        editCompany() {
            this.isEditCompanyShow = true
            this.editDetail = this.$lodash.cloneDeep(this.detail);
        }
    },
}
</script>
<style scoped lang="less">
.draw-broadside {
    .broadside-item {
        border-bottom: 1px solid #e8e8e8;
        padding: 20px 15px 20px 20px;
        .default-text {
            margin-top: 5px;
        }
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
    .hhdbc {
        cursor: pointer;
        margin: 4px 0;
        padding: 10px;
        border: 1px solid #e5e5e5;
        .hhdbc_title {
            color: #000;
            font-size: 16px;
            font-weight: bold;
        }
        .hhdbc_name {
            font-size: 14px;
            display: flex;
            align-items: center;
        }
    }
}
</style>
