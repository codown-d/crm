<!--
 * @Descripttion: 郵件部分，郵件連絡人管理卡片
 * @version: 
 * @Author: Lone
 * @Date: 2021-10-22 21:12:44
 * @LastEditors: Lone
 * @LastEditTime: 2022-05-02 15:56:33
-->
<template>
        <a-tabs
            default-active-key="1"
            tab-position="top"
            style="height:100%;width: 310px;"
            type="card"
            size="small"
            @change="getCustomerInfo"
            >
            <a-tab-pane v-for="(mailItem,index) in composeMail" :key="index" :tab="`${mailItem.text.charAt(0)}`"> 

                <div class="contactCard flex-column padding-20">
                    <template v-if="!usersInfo.length">
                        <div
                            class="right-line right-line-btn border-btn"
                            @click="showInput"
                            v-if="!inputVisible"
                        >
                            新增至現有的聯絡人
                        </div>
                        <div v-if="inputVisible" style="margin-bottom: 10px" class="flex">
                            <div class="flex-1 marginRgt-10">
                                <PersonSelect
                                    :show="inputVisible"
                                    :mail="mailResult"
                                    @onSuccess="onSuccess"
                                />
                            </div>

                            <a-icon type="close" @click="inputVisible = false"></a-icon>
                        </div>

                        <div
                            class="right-line right-line-btn default-btn"
                            @click="addPerson"
                        >
                            建立新聯絡人
                        </div>
                    </template>

                    <template v-else>
                        <div v-for="(item, index) in usersInfo" :key="index">
                            <div class="right-line flex avator-sm">
                                <!-- <img class="avator-sm" :src="userInfo_1.avator" /> -->
                                <a-avatar class="marginRgt-8">
                                    {{ item.customerName.length > 2 ? item.customerName[0] : item.customerName }}
                                </a-avatar>

                                {{ item.customerName }}
                            </div>
                            <div class="right-line flex marginTop-15" style="align-items: flex-start">
                                <div>郵箱：</div>
                                <div class="flex-1" v-if="item.emailList.length">
                                    <div
                                        v-for="(email, emailIndex) in item.emailList"
                                        :key="emailIndex"
                                        class="text-overflow"
                                        style="max-width: 180px"
                                    >
                                        {{ email.email }}
                                    </div>
                                </div>
                                <div v-else class="gray-text">無數據</div>
                            </div>
                            <div class="right-line flex" style="align-items: flex-start">
                                <div>電話：</div>
                                <div class="flex-1" v-if="item.phoneList.length">
                                    <div
                                        v-for="(phone, phoneIndex) in item.phoneList"
                                        :key="phoneIndex"
                                        class="text-overflow"
                                        style="max-width: 180px"
                                    >
                                        {{ phone.phone }}
                                    </div>
                                </div>
                                <div v-else class="gray-text">無數據</div>
                            </div>
                            <div class="right-line flex">
                                <div>公司：</div>
                                <div class="flex-1" v-if="item.companyName.length">
                                    {{ item.companyName }}
                                </div>
                                <div v-else class="gray-text">無數據</div>
                            </div>

                            <div class="right-line border-bottom"></div>
                        </div>
                    </template>

                    <a-modal
                        :dialog-style="{ top: '0px' }"
                        title="新建聯絡人"
                        :visible="visible"
                        :footer="null"
                        @cancel="handleCancel"
                        width="750px"
                        wrapClassName="customerAddLayer"
                    >
                        <AddCust
                            :formEdit="custEdit"
                            @handleOk="handleOk"
                            @handleCancel="handleCancel"
                            @onSuccess="onSuccess"
                        />
                    </a-modal>
                </div>
            
            
            </a-tab-pane>
        </a-tabs>


</template>

<script>
/* eslint-disable */
import PersonSelect from "../public/personSelect.vue";
import AddCust from "@/components/public/addCustomer.vue";

export default {
    components: {
        PersonSelect,
        AddCust,
    },
    // name: "連絡人管理",
    props: {
        mail: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            inputVisible: false,
            form: this.$form.createForm(this, { name: "coordinated" }),
            detail: {},
            visible: false,
            confirmLoading: false,
            userInfo_1: {
                avator: require("@/assets/crmImages/userImg.jpeg"),
                name: "某某某",
                email: "23231@qq.com",
            },
            usersInfo: [],
            custEdit: {},
            mailContactData: [],
            mailResult: "",
        };
    },
    computed: {
        currentPath() {
            // let currentIndex = 0;
            let path = this.$route.path;
            // if (~path.indexOf('compose'))
            this.isCompose = ~path.indexOf("compose") ? true : false;
            // console.log('path', path);
            // this.currentIndex = this.menusArray.findIndex(item => ~path.indexOf(item.path));
            return path;
        },
        isCompose() {
            return ~path.indexOf("compose") ? true : false;
        },
        composeMail() {
            return this.$store.state.mail.composeMail;
        },
    },
    watch: {
        mailContactData: {
            immediate: true,
            deep: true,
            handler(newValue, oldValue) {
                if (newValue != oldValue) {
                    this.usersInfo = newValue;
                }
            },
        },
        mail: {
            immediate: true,
            deep: true,
            handler(newValue, oldValue) {
                if (newValue) {
                    this.mailResult = newValue;
                    this.queryCustomerByEmail(newValue);
                }
            },
        },
        composeMail: {
            immediate: true,
            deep: true,
            handler(newValue, oldValue) {
                // console.log("contact card watch的composeMail", newValue);
                let isMailSyncing = this.$store.state.mail.isMailSyncing;
                if (newValue && newValue.length && isMailSyncing) {
                    let mail = newValue[0].text;
                    this.mailResult = mail;
                    this.queryCustomerByEmail(mail);
                } else if (newValue == '') {
                    this.usersInfo = [];
                }
            },
        },
    },
    activated() {
        // if (!this.tags.length) this.mailContactData = [];
        if (this.$store.state.mail.composeMail.length) {
            this.$store.commit("mail/SET_COMPOSE_MAIL", []);
        }
    },
    mounted() {
        this.mailContactData = [];
    },
    methods: {
        queryCustomerByEmail(email) {
            this.$api.customer
                .queryCustomerByEmail({
                    email: email,
                })
                .then((res) => {
                    console.log("查詢到的聯絡人的結果是: ", res);
                    if (res.code !== "0")
                        return this.$message.error(res.message || "查詢失敗");
                    this.mailContactData = res.data;
                });
        },
        getCustomerInfo(activeKey){
            console.log('activeKey',activeKey)
            this.mailResult = this.composeMail[activeKey].text; 
            this.queryCustomerByEmail(this.mailResult);
        },
        onSuccess() {
            // this.$emit("onSuccess");
            this.queryCustomerByEmail(this.mailResult);
        },
        showInput() {
            this.inputVisible = true;
        },
        addPerson() {
            // console.log(this.mail, "this.mail.....");
            this.custEdit = {
                companyId: "",
                companyName: "",
                email: [
                    {
                        email: this.mailResult,
                        type: "work",
                    },
                ],
                name: "",
                phone: [
                    {
                        phone: "",
                        type: "work",
                    },
                ],
                remark: "",
                bizTagIds: [],
            };
            this.custEdit.editType = "add";
            console.log(this.custEdit);
            this.visible = true;
        },
        handleOk() {
            this.confirmLoading = true;
            setTimeout(() => {
                this.visible = false;
                this.confirmLoading = false;
            }, 2000);
        },
        handleCancel() {
            this.visible = false;
        },
    },
};
</script>

<style>
.contactCard {
    min-width: 300px;
    width: 300px;
    height: 100%;
    background: #fff;
    margin-left: 15px;
    border-radius: 10px;
    /* padding: 15px; */
}

.contactCard .right-line {
    margin-bottom: 10px;
}

.contactCard .right-line-btn {
    height: 35p;
    line-height: 35px;
    text-align: center;
    width: 100%;
    cursor: pointer;
}
</style>
