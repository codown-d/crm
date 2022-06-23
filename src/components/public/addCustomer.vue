<template>
    <div class="AddCust">
        <a-form-model
            ref="customerForm"
            :model="formData"
            :rules="rules"
            @submit="submitForm"
            :labelCol="{ span: 24, offset: 0 }"
            destroyOnClose
        >

            <a-row>
                <a-col :xs="12" style="border-right: 1px solid #ddd; padding-right: 20px">
                     <!-- //姓名 -->
                    <a-form-model-item
                        ref="name"
                        label="聯絡人"
                        prop="name"
                        class="marginBtm-10"
                    >
                        <a-input
                            v-model="formData.name"
                            placeholder="請輸入聯絡人姓名"
                            :maxLength="64" allowClear
                        />
                    </a-form-model-item>

                    <!-- 公司 -->
                    <a-form-model-item
                        name="companyName"
                        prop="companyName"
                        label="公司"
                    >
                        <dictSelect
                            :defaultValue="formData.companyId"
                            :defaultName="formData.companyName"
                            :selectDict="'company'"
                            :showSelectInsert="true"
                            @selectChange="companyChange($event)"/>
                    </a-form-model-item>

                    <!-- 部门 -->
                    <a-form-model-item
                        ref="department"
                        label="部門"
                        prop="department"
                        :maxLength="64" allowClear
                    >
                        <a-input
                            v-model="formData.department"
                            placeholder="請輸入部門"
                        />
                    </a-form-model-item>

                    <!-- position職稱 -->
                    <a-form-model-item
                        ref="position"
                        label="職稱"
                        prop="position"
                        :maxLength="64" allowClear
                    >
                        <a-input
                            v-model="formData.position"
                            placeholder="請輸入職稱"
                        />
                    </a-form-model-item>

                    <!-- 標籤 -->
                    <!-- <a-form-model-item label="標籤">
                        <a-select
                                mode="tags"
                                placeholder="請選擇標籤"
                                style="width: 100%"
                                v-model="formData.bizTagIds"
                            >
                            <a-select-option v-for="(tag,index) in tags" :key="tag + index" :value="String(tag.id)">
                                {{ tag.title }}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item> -->

                     <!-- 電話 -->
                    <a-form-model-item prop="phoneList" ref="addphonemail">
                        <slot name="label">
                            <div class="flex-between">
                                <div class="flex">
                                    <span class="ant-form-item-label">電話</span>
                                    <a-tooltip title="座機示例: 02-12345678">
                                        <a-icon type="question-circle" class="marginLft-5"/>
                                    </a-tooltip>
                                </div>
                                <a-button
                                    @click="addInputPhone"
                                    type="link"
                                    >新增電話</a-button
                                >
                            </div>
                        </slot>
                        <div
                            class="AddCust-inputArea"
                            v-for="(item, index) in formData.phoneList"
                            :key="index"
                        >
                            <a-input
                                placeholder="請輸入電話"
                                v-model="item.phone"
                                @change="onFormChange"
                                class="AddCust-inputArea-left"
                                @blur="() => {$refs.addphonemail.onFieldBlur()}"
                                :maxLength="15" allowClear
                            ></a-input>
                            <a-select
                                placeholder="請選擇電話標籤"
                                style="width: 30%"
                                v-model="item.type"
                                @change="onFormChange"
                            >
                                <a-select-option value="work">工作</a-select-option>
                                <a-select-option value="family">家庭</a-select-option>
                                <a-select-option value="other">其他</a-select-option>
                            </a-select>
                            <a-button
                                v-if="index > 0"
                                @click="deletePhone(index)"
                                type="link"
                                style="margin-left: 5px"
                                ><a-icon type="delete" :style="{ fontSize: '20px' }"
                            /></a-button>
                        </div>
                    </a-form-model-item>

                    <!-- 郵件 -->
                    <a-form-model-item prop="emailList" ref="addusermail">
                        <slot name="label" class="flex-between">
                            <span class="ant-form-item-label">電子郵件</span>
                            <a-button
                                @click="addInputEmail"
                                type="link"
                                style="float: right"
                                >新增郵件</a-button
                            >
                        </slot>
                        <div
                            class="AddCust-inputArea"
                            v-for="(item, index) in formData.emailList"
                            :key="index"
                        >
                            <a-input
                                placeholder="請輸入郵件"
                                v-model="item.email"
                                class="AddCust-inputArea-left"
                                @change="onFormChange"
                                @blur="() => {$refs.addusermail.onFieldBlur()}"
                                :maxLength="50" allowClear
                            ></a-input>
                            <a-select
                                placeholder="請選擇郵件類型"
                                style="width: 30%"
                                v-model="item.type"
                                @change="onFormChange"
                            >
                                <a-select-option value="work">工作</a-select-option>
                                <a-select-option value="family">家庭</a-select-option>
                                <a-select-option value="other">其他</a-select-option>
                            </a-select>
                            <a-button
                                v-if="index > 0"
                                @click="deleteEmail(index)"
                                type="link"
                                style="margin-left: 5px"
                                ><a-icon type="delete" :style="{ fontSize: '20px' }"
                            /></a-button>
                        </div>
                    </a-form-model-item>
                </a-col>

                <a-col :xs="12" style="padding-left: 20px">

                    <a-form-model-item ref="sex" label="性別" prop="sex">
                        <a-radio-group :options="sexOptions" :default-value="true" v-model="formData.sex"/>
                    </a-form-model-item>

                    <a-form-model-item ref="birthday" label="生日" prop="birthday">
                        <a-date-picker v-model="formData.birthday" type="date" placeholder="請選擇生日" style="width: 100%;" value-format="YYYY-MM-DD" allowClear format="YYYY年MM月DD日" :showToday="false" :disabled-date="disabledDate"/>
                    </a-form-model-item>    

                    <a-form-model-item ref="socialAccount" label="社群賬號" prop="socialAccount">
                        <div class="AddCust-inputArea" >
                            <a-input placeholder="請輸入社群賬號" v-model="formData.socialAccount" class="AddCust-inputArea-left" style="width: calc(100% - 130px)" :maxLength="64" allowClear></a-input>
                            <a-select placeholder="請選擇社群賬號類型" style="width: 120px;"  v-model="formData.socialAccountType">
                                <a-select-option value="facebook">Facebook</a-select-option>
                                <a-select-option value="twitter">Twitter</a-select-option>
                                <a-select-option value="line">Line</a-select-option>
                                <a-select-option value="wechat">Wechat</a-select-option>
                                <a-select-option value="qq">QQ</a-select-option>
                            </a-select>
                        </div>
                    </a-form-model-item>     

                    <a-form-model-item ref="address" label="位址" prop="address">
                        <a-input v-model="formData.address" placeholder="請輸入位址" style="width: 100%;" allowClear :maxLength="64"/>
                    </a-form-model-item>    

                    <a-form-model-item ref="remark" label="備註" prop="remark">
                        <a-textarea v-model="formData.remark" placeholder="請輸入備註" :auto-size="{ minRows: 2, maxRows: 6 }" allowClear/>
                    </a-form-model-item>

                </a-col>
            </a-row>
           

            <a-form-model-item>
                <div class="footer">
                    <a-button @click="handleCancel">取消</a-button>
                    <a-button class="ml-15" type="primary" @click="submitForm" :loading="btnLoading"
                        >儲存</a-button
                    >
                </div>
            </a-form-model-item>
        </a-form-model>
    </div>
</template>
<script>
import debounce from "lodash/debounce";
import dictSelect from '@/components/Common/dictSelect'
import {queryCustomerDetail} from '@/services/customer-api.js'
import {searchCompanyInfo} from '@/services/common.js'
export default {
    name: "AddCust",
    components: {
		dictSelect
	},
    props: {
        formEdit: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    data() {
        this.lastFetchId = 0;
        this.fetchCompany = debounce(this.fetchCompany, 800);
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
            formData: {},
            rules: {
                name: [
                    {
                        required: true,
                        message: "請鍵入聯絡人姓名",
                        trigger: "blur",
                    },
                ],
                companyName: [{ required: true, message: '請選擇公司', trigger: 'blur'}],
                emailList: [{ validator: validateMail, trigger: 'blur' }],
                phoneList: [{ validator: validatePhone, trigger: 'blur' }],
            },
            currentSelectTagCust: [], //目前選取的客戶標籤
            currentSelectTagCustDetail: [], //目前選取的客戶標籤-子標籤
            customerTagsArray: [],
            // 遠端搜索 公司
            fetchCompanyData: null,
            fetching: false,
            btnLoading: false,
            sexOptions: [
                { label: '男', value: true },
                { label: '女', value: false },
            ]
        };
    },
    computed: {
        userInfo() {
            let userInfo = this.$store.state.user.userInfo;
            // this.$util.console(userInfo, 'add customer 列印的使用者資訊');
            return userInfo;
        },
    },
    watch: {
        formEdit: {
            immediate: true,
            deep: true,
            handler(newValue, oldValue) {
                this.fetchCompanyData = null;
                this.initFormData(newValue);
            },
        },
    },
    methods: {
        disabledDate(current) {
            // Can not select days before today and today
            return  current && current > this.$moment().endOf('day');
        },
        fetchCompany(value) {
            if (!value || !value.length) return;

            this.lastFetchId += 1;
            const fetchId = this.lastFetchId;
            this.data = [];
            this.fetching = true;

            let params = {
                page: {
                    currentPage: 1,
                    pageSize: 100,
                },
                name: value,
            };
            this.$api.customer.queryComPageList(params).then((res) => {
                if (fetchId !== this.lastFetchId) {
                    // for fetch callback order
                    return;
                }
                if (!res.success) return this.$message.error("查詢失敗");
                // this.fetchCompanyData = null;
                // if (res?.data?.list)
                this.fetchCompanyData = res.data.totalCount > 0 ? res.data.list : [{ id: '', name: `新增公司 ${ value }` }];
                this.fetching = false;
                // this.$util.console(res, '遠端查詢公司的結果');
            });
        },
        companyChange(value){
            console.log('companyId value',value)
            this.formData.companyId = value.id;
            this.formData.companyName = value.name;
        },
        onFormChange() {
            this.$forceUpdate();
        },
        tagsChange(e) {
            this.formData.tags = e;
        },
        //動態刪除電話號碼
        deletePhone(index) {
            this.formData.phoneList.splice(index, 1);
            this.$forceUpdate();
        },
        //動態刪除email
        deleteEmail(index) {
            this.formData.emailList.splice(index, 1);
            this.$forceUpdate();
        },
        //動態添加電話號碼
        addInputPhone() {
            if (this.formData.phoneList.length == 5)
                return this.$message.warning("最多添加5個電話");
            this.formData.phoneList.push({
                phone: "",
                type: "work",
            });
            this.$forceUpdate();
            // console.log('新增電話', this.formData);
        },
        //動態添加email
        addInputEmail() {
            if (this.formData.emailList.length == 5)
                return this.$message.warning("最多添加5個郵件");
            this.formData.emailList.push({
                email: "",
                type: "work",
            });
            this.$forceUpdate();
            // console.log('新增email', this.formData);
        },
        addSelectTag() {
            console.log("this.newTag", this.newTag);
            let parentKey = this.currentSelectTagCust[0].key;
            let key1 = parseInt(this.currentSelectTagCustDetail.length) + 1;
            let tempTagObj = {
                color: "whilegreen",
                tagName: [],
                title: this.newTag,
                key: parentKey + "-" + key1,
                parentKey: parentKey,
            };
            this.currentSelectTagCustDetail.push(tempTagObj);

            this.$store.dispatch("main/addSubTags", tempTagObj).then((res) => {
                if (res) {
                    this.visibleTagsModel = false;
                    this.$message.success("添加標籤成功！");
                    this.newTag = "";
                }
            });

            console.log("tempTagObj", tempTagObj);
            console.log("currentSelectTagCust", this.currentSelectTagCust);
            console.log(
                "currentSelectTagCustDetail",
                this.currentSelectTagCustDetail
            );
        },
        handleCancel() {
            console.log("關閉彈窗", this.formData);
            this.$emit("handleCancel", this.formData);
        },
        submitForm(e) {
            // console.log('保存')
            this.$refs.customerForm.validate(async (valid) => {
                if (valid) {
                    
                    this.btnLoading = true;

                    if (this.formData.companyId == -1) {
                        this.formData.companyId = "";
                    }

                    let params = this.$lodash.cloneDeep(this.formData);

                    // 處理郵件和電話沒有值的時候的情況
                    if (params.phoneList != null && params.phoneList != undefined) {
                        params.phoneList = params.phoneList.filter(item => item.phone.length);
                    }

                    if (params.emailList != null && params.emailList != undefined) {
                        params.emailList = params.emailList.filter(item => item.email.length);
                    }

                    //TODO:創建公司和聯絡人,後端支持創建聯絡人和公司返回數據後才開始啟用
                    if(!params.companyId && params.companyName){
						let createResult = await this.$api.company.createCompany({
							param:{
								name:params.companyName,
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
								name:params.companyName,
							},
						});
						if(!queryResult.success){
							throw this.$message.error('查询新增組織失敗');
						}
						if(queryResult.data && queryResult.data.list && queryResult.data.list.length)
						{
							params.companyId = queryResult.data.list[0].id;
						}
						else{
							throw this.$message.error('查询新增組織失敗');
						}
					}

                    if (this.formData.id) {
                        this.$api.customer
                            .updateCustomerInfo(params)
                            .then((res) => {
                                this.btnLoading = false;

                                if (!res.success)
                                    return this.$message.error(
                                        "更新客戶資訊失敗"
                                    );

                                this.$refs.customerForm.resetFields();
                                this.$message.success("更新客戶資訊成功！");
                                this.$emit("handleOk", this.formData);
                            });
                    } else {
                        // return console.log('打印新增客戶的參數', params);
                        if (params.companyId == "newCompany") params.companyId = '';
                        if (params.sex == undefined) params.sex = true;

                        this.$api.customer.addCustomer(params).then((res) => {
                            this.btnLoading = false;

                            if (!res.success)
                                return this.$message.error("新增客戶失敗");
                            this.$refs.customerForm.resetFields();
                            this.$message.success("新增客戶成功！");
                            this.$emit("onSuccess");
                            this.$emit("handleOk", this.formData);
                        });
                    }
                }
            });
        },
        resetForm(formName) {
            //加if判斷條件的目的是為瞭解決控制台提示物件不存在的問題
            if (this.$refs[formName] !== undefined) {
                this.$refs[formName].resetFields();
            }
        },
        initFormData(formEdit) {
            console.log('formEdit',formEdit);
            this.resetForm("customerForm");
            this.formData = this.$lodash.cloneDeep(formEdit);
            if (this.formData.editType == "add") {

                this.formData.phoneList = [
                    {
                        phone: formEdit && formEdit.phone && Array.isArray(formEdit.phone) && formEdit.phone.length >= 1 ? formEdit.phone[0].phone : '',
                        type: "work",
                    },
                ];
                this.formData.emailList = [
                    {
                        email: formEdit && formEdit.email && Array.isArray(formEdit.email) && formEdit.email.length >= 1 ? formEdit.email[0].email : '',
                        type: "work",
                    },
                ];
                // this.formData.companyId = undefined;
                // console.log("初始化完畢的表單數據", this.formData.sex);
                if (this.formData.sex == undefined) this.$set(this.formData, 'sex', true);

            } else if (this.formData.editType == "edit") {
                // console.log("初始化修改客戶之前資料", this.formData);
                // console.log('this.formData.socialAccountType', this.formData.socialAccountType);
                if (this.formData.socialAccountType == null) this.$set(this.formData, 'socialAccountType', undefined);

                if (this.formData.companyId == null)
                    this.formData.companyId = undefined;
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
                // console.log("初始化修改客戶的表單數據", this.formData);
            }
            this.$forceUpdate();
        },
    },
};
</script>

<style lang="less">

.AddCust {

    .ant-radio-group {
        display: inline-flex;
    }

    .ant-form-item label {
        width: 100%;
    }
    
    .ant-btn .ant-btn-link {
        padding: 0px;
    }

    &-inputArea {
        &-left {
            width: calc(70% - 52px);
            margin-right: 10px;
        }
        .ant-btn {
            padding: 0 5px;
            margin-top: -5px;
            vertical-align: middle;
        }
    }

    input, select, span, textarea {
        font-size: 1em;
    }

}

.AddCust .ant-form-item-label {
    line-height: 20px;
}

.AddCust .ant-form-item {
    margin-bottom: 10px;
}

.footer {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}

</style>
