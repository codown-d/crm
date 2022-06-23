<template>
    <div class="AddCust">
        <a-form-model :labelCol="{ span: 24, offset: 0 }" :rules="rules" :model="formData">
            <!-- //姓名 -->
            <a-form-model-item ref="name" label="聯絡人" prop="name" class="marginBtm-10">
                <a-input v-model="formData.name" placeholder="請輸入聯絡人姓名" />
            </a-form-model-item>

            <!-- 組織 -->
            <!-- <a-form-model-item ref="companyId" name="companyId" label="組織" >
                <a-select placeholder="請選擇組織" style="width: 100%" v-model="formData.companyId">
                    <a-select-option :value="item.id" v-for="(item, index) in companyData" :key="index">
                        {{ item.name }}
                    </a-select-option>
                    <a-select-option value="otherCompany">其他</a-select-option>
                </a-select>
                <a-input v-if="formData.companyId == 'otherCompany'" placeholder="組織" v-model="formData.otherCompany"></a-input>
            </a-form-model-item> -->

            <!-- 組織 -->
            <a-form-model-item
                ref="companyId"
                name="companyId"
                prop="companyId"
                label="組織"
            >
                <a-select
                    mode="default"
                    label-in-value
                    show-search
                    :value="companyValue"
                    placeholder="請選擇組織"
                    style="width: 100%"
                    :filter-option="false"
                    :loading="fetching"
                    @search="fetchCompany"
                    @select="handleChange"
                    allowClear
                >
                    <a-spin v-if="fetching" :spinning="fetching" slot="notFoundContent" size="small" tip="查詢中...">
                        <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
                         <div class="flex-center" style="height: 100px"></div>
                    </a-spin>
                    <div v-if="!fetching && !fetchCompanyData" slot="notFoundContent" 
                        class="flex-center" style="height: 100px">
                            請輸入組織關鍵字查詢!
                    </div>

                    <a-select-option
                        v-for="(d, index) in fetchCompanyData"
                        :key="index"
                        :value="d.name"
                    >
                        {{ d.name }}
                    </a-select-option>
                </a-select>
            </a-form-model-item>

            <!-- 電話 -->
            <a-form-model-item>
                <slot name="label" class="flex-between">
                    <span>電話</span>
                    <a-button @click="addInputPhone" type="link" style="float: right">新增電話</a-button>
                </slot>
                <div class="AddCust-inputArea" v-for="(item, index) in formData.phoneList" :key="index">
                    <a-input placeholder="請輸入電話" :id="item.id" v-model="item.phone" class="AddCust-inputArea-left"></a-input>
                    <a-select placeholder="請選擇電話標籤" style="width: 30%" v-model="item.type">
                        <a-select-option value="work">工作</a-select-option>
                        <a-select-option value="family">家庭</a-select-option>
                        <a-select-option value="other">其他</a-select-option>
                    </a-select>
                    <a-button v-if="index > 0" @click="deletePhone(index)" type="link" style="margin-left: 5px"
                        ><a-icon type="delete" :style="{ fontSize: '20px' }"
                    /></a-button>
                </div>
            </a-form-model-item>

            <!-- 郵件 -->
            <a-form-model-item>
                <slot name="label" class="flex-between">
                    <span>電子郵件</span>
                    <a-button @click="addInputEmail" type="link" style="float: right">新增郵件</a-button>
                </slot>
                <div class="AddCust-inputArea" v-for="(item, index) in formData.emailList" :key="index">
                    <a-input placeholder="請輸入郵件" :id="item.id" v-model="item.email" class="AddCust-inputArea-left"></a-input>
                    <a-select placeholder="請選擇郵件類型" style="width: 30%" v-model="item.type">
                        <a-select-option value="work">工作</a-select-option>
                        <a-select-option value="family">家庭</a-select-option>
                        <a-select-option value="other">其他</a-select-option>
                    </a-select>
                    <a-button v-if="index > 0" @click="deleteEmail(index)" type="link" style="margin-left: 5px"
                        ><a-icon type="delete" :style="{ fontSize: '20px' }"
                    /></a-button>
                </div>
            </a-form-model-item>
        </a-form-model>
    </div>
</template>
<script>

import debounce from "lodash/debounce";

export default {
    name: 'EditCustomer',
    props: {
        formEdit: {
            type: Object,
            default() {
                return {}
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
                    let result = this.$util.checkPhone(item.email);
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
            formData: '',
            rules: {
                name: [{ required: true, message: '請鍵入聯絡人姓名', trigger: 'blur' }],
                companyId: [{ required: true, message: '請選擇組織', trigger: 'change' }],
                emailList: [{ validator: validateMail, trigger: 'blur' }],
                phoneList: [{ validator: validatePhone, trigger: 'blur' }],
            },

            currentSelectTagCust: [], //目前選取的客戶標籤
            currentSelectTagCustDetail: [], //目前選取的客戶標籤-子標籤

            // 遠端搜索 組織
            fetchCompanyData: null,
            fetching: false,
            companyValue: [],

            // btnLoading: false

        }
    },
    watch: {
        formEdit: {
            immediate: true,
            deep: true,
            handler(newValue, oldValue) {
                console.log('將要編輯的用戶資料:', newValue);
                this.fetchCompanyData = null;
                let detailUserData = this.$lodash.cloneDeep(newValue);
                if (detailUserData.phoneList.length == 0) {
                    detailUserData.phoneList.push({
                        phone: "",
                        type: "work",
                    });
                };
                if (detailUserData.emailList.length == 0) {
                    detailUserData.emailList.push({
                        email: "",
                        type: "work",
                    });
                };
                if (newValue.companyName != null && newValue.companyId != null) {
                    this.fetchCompanyData = [{ 
                        id: newValue.companyId,
                        name: newValue.companyName
                    }];
                    this.companyValue = [{ key: "0", label: newValue.companyName }]
                };
                this.initFormData(detailUserData)
            },
        },
    },
    computed: {
        // companyData() {
        //     let companyDataList = this.$lodash.cloneDeep(this.$store.state.main.companyData.list);
        //     if (this.formEdit.companyId != null && this.formEdit.companyName != null || companyDataList == undefined) {
        //         return [{
        //             id: this.formEdit.companyId,
        //             name: this.formEdit.companyName
        //         }]
        //     } else {
        //         // fixit： 這個地方還是有問題！！！ 這個公司列表！！！！
        //         return companyDataList
        //     }
        // },
    },
    methods: {
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
                this.fetchCompanyData = res.data.totalCount > 0 ? res.data.list : [{ id: '', name: `新增組織 ${ value }` }];
                this.fetching = false;
                // this.$util.console(res, '遠端查詢公司的結果');
            });
        },

        handleChange(value) {
            // return 
            // console.log(value);
            value.label = value.label.trim();
            // console.log(this.fetchCompanyData.find(item => item.name == value.label.trim()), this.fetchCompanyData.find(item => item.name == value.label.trim()).id);
            if (this.fetchCompanyData.length == 1 && value.label.includes('新增組織')) {
                // console.log('是新增組織');
                value.label = value.label.substr(5, value.label.length - 1);
                this.formData.companyId = 'newCompany';
                this.formData.companyName = value.label;
            } else {
                let selectedCompany = this.fetchCompanyData.find(item => item.name == value.label);
                this.formData.companyId = selectedCompany.id;
                this.formData.companyName = selectedCompany.name;
            }
            Object.assign(this, {
                companyValue: value,
                fetchCompanyData: null,
                fetching: false,
            });
            // console.log('this.companyValue===', this.companyValue);
        },

        tagsChange(e) {
            this.formData.tags = e
        },
        //動態刪除電話號碼
        deletePhone(index) {
            this.formData.phoneList.splice(index, 1)
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
        //動態添加email
        addInputEmail() {
            if (this.formData.emailList.length == 5) return this.$message.warning('最多添加5個郵件')
            this.formData.emailList.push({
                email: '',
                type: 'work',
            })
            this.$forceUpdate()
        },
        handleCancel() {
            this.$emit('handleCancel', this.formData)
        },

        resetForm(formName) {
            //加if判斷條件的目的是為瞭解決控制台提示物件不存在的問題
            if (this.$refs[formName] !== undefined) {
                this.$refs[formName].resetFields()
            }
        },
        initFormData(formEdit) {
            this.formData = formEdit
            if (this.formData.editType == 'edit') {
                this.formData.emailList = this.formData.emailList.map((item) => {
                    item.value = item.email
                    return item
                })
                this.formData.phoneList = this.formData.phoneList.map((item) => {
                    item.value = item.phone
                    return item
                })
                console.log(this.formData)
            }
        },
    },
}
</script>

<style lang="less">
.AddCust {
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
}

.AddCust .ant-form-item-label {
    line-height: 20px;
}
.AddCust .ant-form-item {
    margin-bottom: 10px;
}
// .label-text {
//     font-size: 15px;
//     color: #000;
// }
.footer {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}
</style>
