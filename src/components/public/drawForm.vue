<template>
    <div class="draw-form">
        <div class="create">
            <Tabs v-model="active" :lineHeight="2" @change="formTabChange">
                <Tab
                    v-for="(item, index) in tabsArray"
                    :key="item.type"
                    :title="item.name"
                >
                    <!-- //筆記操作 -->
                    <div class="relative" v-if="item.type === 'note'">
                        <div class="mb-10">
                            <a-select
                                placeholder="請選擇類型"
                                style="width: 300px"
                                v-model="noteType"
                            >
                                <a-select-option
                                    v-for="(item, index) in noteTypeList"
                                    :key="index"
                                    :value="item.value"
                                >
                                    {{ item.label }}
                                </a-select-option>
                            </a-select>
                        </div>
                        <a-textarea
                            v-model="nodeContent"
                            placeholder="請輸入"
                            :auto-size="{ minRows: 2, maxRows: 6 }"
                        />

                        <div class="note-footer marginTop-15">
                            <a-button @click="noteCancel">取消</a-button>
                            <a-button
                                v-if="excutePermission(customManage.updateDetail)"
                                class="ml-10"
                                type="danger"
                                :loading="isAddLoading"
                                @click="noteCreate"
                                >儲存</a-button
                            >
                        </div>
                    </div>

                    <!-- 活動操作 -->
                    <div v-else-if="item.type === 'activity'">
                        <!-- <activeTab
                            ref="activeTab"
                            @change="handleClickActiveType($event, item)"
                            class="active-tab"
                        /> -->
                        <activeForm ref="activeForm" :formData="activeForm" :isAddWithCust="true"/>
                        <div class="active-footer">
                            <a-button @click="activeCancel">取消</a-button>
                            <a-button
                                v-if="excutePermission(customManage.add)"
                                class="ml-10"
                                type="danger"
                                :loading="isAddLoading"
                                @click="activeCreate"
                                >儲存</a-button
                            >
                        </div>
                    </div>

                    <!-- 郵件操作 -->
                    <div v-else-if="item.type == 'email'">
                        <composeCard
                            :mailData="mailData"
                            ref="composeMail"
                            @onSuccess="onSendMail"
                        />
                    </div>

                    <!-- line操作 -->
                    <div v-else-if="item.type == 'line'">
                        <lineChatCard v-if="detail.channelUserId" :channelUserId="detail.channelUserId" :detailName="detail.name"/>
                        <div v-else class="flex-1 flex-center gray-text font-14" style="height: 100px;">
                            該客戶未綁定Line聯絡人.
                        </div>
                    </div>

                </Tab>
            </Tabs>
        </div>

        <div class="planing">
            <div class="add-btn-line">
                <span class="line-text">計畫中</span>
            </div>
            <div v-if="!activeTimeLine.length" class="flex-center padding-10 font-14">
                <div class="default-text center">你還沒有即將到來的活動,</div>
                <div class="link-text center icon-event marginLft-8" @click="addActiveForm">
                    安排一項活動
                </div>
            </div>
            <div v-else>
                <timeAxis
                    :list="activeTimeLine"
                    timeLineType="plan"
                    @showActiveModal="showActiveModal($event)"
                    @deleteActive="deleteActiveOk($event)"
                    @updataActive="updataActive($event)"
                />
            </div>
        </div>

        <div class="accomplish">
            <div class="add-btn-line">
                <span class="line-text font-14">已完成</span>
            </div>
            <a-tabs class="" v-model="resultActive" @change="tabsChanges">
                <a-tab-pane
                    v-for="(item, index) in tabsResultArray"
                    :key="item.type"
                    :tab="item.name"
                >
                    <div>
                        <timeAxis
                            :list="planList"
                            timeLineType="done"
                            @editNote="editNote($event)"
                            @deleteNote="deleteNote($event)"
                            @showActiveModal="showActiveModal($event)"
                            @deleteActive="deleteActiveOk($event)"
                            @updataActive="updataActive($event)"
                            @saveNote="saveNote($event)"
                            @handleMail="onSendMail"
                        />
                    </div>
                </a-tab-pane>
            </a-tabs>
        </div>

        <a-modal
            v-model="activeVisible"
            :title="activeModalStatus == 'add' ? '新增活動' : '編輯活動'"
            okType="danger"
            ok-text="確認"
            cancel-text="取消"
            @ok="activeHandleOk"
        >
            <activeForm ref="activeForm" :formData="activeForm" :isAddWithCust="true"/>
        </a-modal>
    </div>
</template>
<script>
import Services from "@/services/common.js";
import CustomerServices from "@/services/customer-api.js";
import moment from "moment";
import activeForm from "@/components/public/activeForm.vue";
import activeTab from "@/components/public/activeTab.vue";
import noteForm from "@/components/public/noteForm.vue";
import timeAxis from "@/components/public/timeAxis.vue";
import Tab from "@/components/Common/myTabs/Tab";
import Tabs from "@/components/Common/myTabs/Tabs";
import composeCard from "@/components/Mail/ComposeCard";
import lineChatCard from "@/components/public/chatBox";
import { mapGetters } from 'vuex';

export default {
    components: {
        activeForm,
        activeTab,
        timeAxis,
        Tabs,
        Tab,
        composeCard,
        lineChatCard
    },
    data() {
        return {
            content: "",
            active: "note",
            resultActive: "all",
            activeVisible: false,

            noteTypeList: [
                { value: "normal", label: "一般" },
                { value: "letter", label: "信件" },
                { value: "mobile", label: "電話" },
                { value: "visit", label: "拜訪" },
                { value: "manage", label: "管理" },
            ],
            noteType: "normal",
            detail: {},
            planList: [],
            activeForm: {
                subject: "",
                time: null,
                activityParticipants: [],
                location: "",
                publicDescription: "",
                companyId: "",
                activityTypeId: '1',
                customerId: "",
                activityVisitors: [],
            },

            //點擊活動icon保存點擊資訊
            activeTypeInfo: {},
            //活動時間軸
            activeTimeLine: [],

            //活動彈窗狀態
            activeModalStatus: "add",
            nodeContent: "",
            mailData: {
                from: "",
                subject: "",
                to: "",
                content: "",
            },

            isAddLoading: false,// 添加活動的loading

        };
    },
    props: {
        scene: String,
        detailData: {
            type: Object,
            default: () => {},
        },
    },
    watch: {
        detailData: {
            immediate: true,
            deep: true,
            handler(val, oldVal) {
                console.log('進入表格頁面',val);

                if (val.id == undefined) return;//console.log('还没有获取到用户资料，直接返回');

                // this.activeForm = val;
                this.activeForm.customerId = val.id;
                this.activeForm.customerName = val.name;
                this.activeForm.companyId = val.companyId;
                this.activeForm.companyName = val.companyName;
                // this.activeForm.customerId = val.id;
                // this.activeForm.customerId = val.id;
                // this.activeForm.customerId = val.id;
                this.detail = val;
                if(this.detailData.emailList && this.detailData.emailList.length > 0){
                    this.mailData.email = this.detailData.emailList[0];
                }
                else{
                    this.mailData.email = undefined;
                }
                // console.log('列印的客戶詳情資料', val, val.channelUserId);
                //獲取使用者資訊中的郵寄地址
                this.getCustomerMail(val);

                //tab切換時間軸
                this.getTimePlanLine();

                //活動時間軸
                this.getActiveTimeLine();
            },
        },
    },
    activated() {
        
    },
    created() {},
    computed: {
        ...mapGetters([
            'permissions',
            'customManage'
        ]),
        tabsArray() {
            let tempType = [...this.$store.state.main.manageDetailType];
            tempType = tempType.filter((item) => {
                item.name = item.type_name;
                item.type = item.type_eng_name;
                return (
                    item.type_eng_name != "all" &&
                    item.type_eng_name != "log" &&
                    item.type_eng_name != "business"
                );
            });
            return tempType;
        },
        tabsResultArray() {
            let tempType = [...this.$store.state.main.manageDetailType];
            tempType = tempType.filter((item) => {
                item.name = item.type_name;
                item.type = item.type_eng_name;
                return item.type_eng_name != "line";
            });
            return tempType;
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
        getCustomerMail(detail) {
            let { email, emailList } = { ...detail };
            if (!emailList || !emailList.length) return this.mailData.to = "",console.log("沒有有效的郵寄位址", email, emailList);
            this.mailData.to = emailList[0].email;
        },
        saveNote(data) {
            const params = {
                param: {
                    content: data.nodeText,
                    customerId: this.detail.id,
                    noteType: data.data.noteType,
                    noteId: data.objectId,
                },
            };
            CustomerServices.editNote(params).then((res) => {
                this.noteCancel();
                this.getTimePlanLine();
                this.$message.success("編輯筆記成功");
            });
        },
        formTabChange(activeKey){
            console.log('formTabChange',this.detailData,this.activeForm)
            if(activeKey == 1){
                if(!this.activeForm.companyId || !this.activeForm.companyName){
                    this.activeForm.companyId = this.detailData.id;
                    this.activeForm.companyName =  this.detailData.name;
                }
            }
            else if(activeKey == 2){
                if(this.detailData.emailList && this.detailData.emailList.length > 0){
                    this.mailData.email = this.detailData.emailList[0];
                }
                

            }

        },
        // 發送郵件成功的回檔
        onSendMail() {
            this.getTimePlanLine();
        },

        //取消活動
        activeCancel() {
            this.$refs.activeForm[0].resetForm();
        },

        //獲取活動類型
        handleClickActiveType(item) {
            this.activeTypeInfo = item;
            console.log('點擊活動', item);
            this.$refs.activeForm[0].resetForm();
            this.activeModalStatus == "add";
            this.activeForm = {
                subject: "",
                time: null,
                activityParticipants: [],
                location: "",
                publicDescription: "",
                companyId: "",
                activityVisitors: [],
            };
        },

        //創建活動請求，更新活動
        async createActiveFetch() {
            this.isAddLoading = true;
            const getForm = this.$refs.activeForm;
            let formData = getForm.form ? getForm.form : getForm[0].form;
            //TODO:創建公司和聯絡人,後端支持創建聯絡人和公司返回數據後才開始啟用
            if(!formData.companyId && formData.companyName){
                let createResult = await this.$api.company.createCompany({
                    param:{
                        name:formData.companyName,
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
                        name:formData.companyName,
                    },
                });
                if(!queryResult.success){
                    throw this.$message.error('查询新增組織失敗');
                }
                if(queryResult.data && queryResult.data.list && queryResult.data.list.length)
                {
                    formData.companyId = queryResult.data.list[0].id;
                }
                else{
                    throw this.$message.error('查询新增組織失敗');
                }
            }
            if(!formData.customerId && formData.customerName)
            {
                let createResult = await this.$api.customer.addCustomer({
                        name:formData.customerName,
                        companyId:formData.companyId,
                        companyName:formData.companyName,
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
                    name:formData.customerName
                });
                if(!queryResult.success){
                    throw this.$message.error('查询新增聯絡人失敗');
                }
                if(queryResult.data && queryResult.data.list && queryResult.data.list.length)
                {
                    formData.customerId = queryResult.data.list[0].id;
                }
                else{
                    throw this.$message.error('查询新增聯絡人失敗');
                }
            }
            const params = {
                param: {
                    activityParticipants: [
                        {
                            customerId:formData.customerId,
                            customerName:formData.customerName,
                            isCreate: !formData.customerId && Boolean(formData.customerName),
                        },
                    ],
                    planEndTime: formData.time[0]
                        ? moment(formData.time[0]).format("YYYY-MM-DD HH:mm:ss")
                        : "",
                    planStartTime: formData.time[0]
                        ? moment(formData.time[1]).format("YYYY-MM-DD HH:mm:ss")
                        : "",
                    publicDescription: formData.publicDescription,
                    ownerUser:formData.ownerUser,
                    ownerName:formData.ownerName,
                    activityTypeId:formData.activityTypeId,
                    companyId:formData.activityTypeId,
                    companyName:formData.companyName,
                    subject:formData.subject,
                    busyFlag: 0,
                    done: false,
                },
            };
            if (this.activeModalStatus == "add") {
                Services.addActive(params).then((res) => {
                    this.isAddLoading = false;
                    if (res.code != "0") return this.$message.error(res.message || '安排活動失敗!');
                    this.$message.success("安排活動成功");
                    this.activeVisible = false;
                    this.getTimePlanLine();
                    this.getActiveTimeLine();
                    this.tidyActivityForm();
                });
            } else {
                formData.activityParticipants = [{customerId:formData.customerId,customerName:formData.customerName,isCreate: !formData.customerId && Boolean(formData.customerName)}]
                const editParams = {
                    param: {
						subject: formData.subject,
						planStartTime: formData.time[0].format('YYYY-MM-DD HH:mm:ss'),
						planEndTime: formData.time[1].format('YYYY-MM-DD HH:mm:ss'),
						activityParticipants: formData.activityParticipants,
						publicDescription: formData.publicDescription,
						activityTypeId: formData.activityTypeId,
						dealId: formData.dealId,
						ownerUser:formData.ownerUser,
						ownerName:formData.ownerName,
						companyId: formData.companyId,
						activityId: formData.key,
						busyFlag: 0,
						done: false,
					}
                };
                Services.editActive(editParams).then((res) => {
                    this.isAddLoading = false;
                    if (res.code != "0") return this.$message.error(res.message || '編輯活動失敗!');
                    this.$message.success("編輯活動成功!");
                    this.activeVisible = false;
                    this.$refs.activeForm.resetForm();
                    this.getTimePlanLine();
                    this.getActiveTimeLine();
                    
                });
            }
        },
        
        //初始化新增活動表單
        tidyActivityForm() {
            
            // console.log('清空表單的detail', this.detail);
            const { id = '', name = '', companyId = '', companyName = '' } = this.detail;

            this.activeForm = {
                subject: "",
                time: null,
                activityParticipants: [],
                location: "",
                publicDescription: "",
                companyId: companyId,
                companyName: companyName,
                activityTypeId: '1',
                customerId: id,
                id: id,
                name: name,
                activityVisitors: [],
            };

        },

        //新增活動按鈕
        activeCreate() {
            this.activeModalStatus = "add";
            this.createActiveFetch();
        },

        addActiveForm() {
            this.activeModalStatus = "add";
            this.activeVisible = true;
        },

        showActiveModal(data) {
            const {
                companyId,
                companyName,
                planEndTime,
                planStartTime,
                publicDescription,
                subject,
                done,
                activityId,
                ...argus
            } = data.data;

            this.activeForm = {
                time: [planStartTime, planEndTime],
                companyId,
                companyName,
                publicDescription,
                subject,
                done,
                activityId,
                ...argus,
            };
            this.activeModalStatus = "edit";
            this.activeVisible = true;
        },

        //新增編輯活動彈窗確定
        activeHandleOk() {
            this.activeModalStatus = "add";
            this.createActiveFetch();
        },

        //新增客戶筆記
        noteCreate() {
            if (!this.nodeContent) return this.$message.warning('請輸入筆記內容!');
            this.isAddLoading = true;
            let params = {
                content: this.nodeContent,
                customerId: this.detail.id,
                noteType: this.noteType,
            };
            CustomerServices.addCustomerNote(params).then((res) => {
                this.isAddLoading = false;
                if (res.code != '0') return this.$message.error(res.message || '新增筆記失敗!');
                this.noteCancel();
                this.getTimePlanLine();
                this.$message.success("新增筆記成功");
                this.nodeContent = "";
            });
        },

        noteCancel() {
            this.nodeContent = "";
        },

        //切換時間軸
        tabsChanges() {
            this.getTimePlanLine();
        },

        //查詢完成時間軸
        getTimePlanLine() {
            const params = {
                pageNum: 1,
                pageSize: 100,
                sorts: [{ desc: false, key: "" }],
                param: {
                    customerId: this.detail.customerId,
                    search: this.resultActive,
                },
            };
            CustomerServices.customerTimeline(params).then((res) => {
                if (res.code != '0') return this.$message.error(res.message || '查詢已完成時間軸數據失敗!');
                const list = res.data.finishTimelineList.list;
                this.planList = list || [];
            });
        },

        //查詢計畫活動
        getActiveTimeLine() {
            CustomerServices.activeTimeLineFecth({
                pageNum: 1,
                pageSize: 100,
                param: {
                    customerId: this.detail.customerId,
                    sorts: [{ desc: false, key: "" }],
                },
            }).then((res) => {
                if (res.code != '0') return this.$message.error(res.message || '查詢計劃中的活動數據失敗!');
                const data = res.data.list || [];
                const arr = [];
                data.map((item) => {
                    arr.push({
                        objectType: "activity",
                        ...item,
                    });
                });

                this.activeTimeLine = arr;
            });
        },

        //刪除活動
        deleteActiveOk(item) {
            Services.deleteActiveFetch({
                param: {
                    activityId: item.data.activityId,
                },
            }).then((res) => {
                if (res.code == "0") {
                    this.$message.success("刪除成功");

                    this.getTimePlanLine();
                    this.getActiveTimeLine();
                }
            });
        },

        //更新活動狀態
        updataActive(item) {
            Services.updataActiveStatus({
                param: {
                    activityId: item.data.activityId,
                    done: !item.data.done,
                },
            }).then((res) => {
                if (res.code == "0") {
                    this.$message.success("更新成功");

                    this.getTimePlanLine();
                    this.getActiveTimeLine();
                }
            });
        },

        //子元件刪除編輯筆記 更新時間軸清單
        editNote() {
            this.getTimePlanLine();
            this.getActiveTimeLine();
        },

        deleteNote() {
            this.getTimePlanLine();
            this.getActiveTimeLine();
        },
    },
};
</script>
<style scoped lang="less">
.draw-form {
    // width: 600px;
    .add-btn-line {
        position: relative;
        width: 100%;
        text-align: center;
        padding: 15px 0;
        font-size: 16px;
        .line-text {
            display: inline-block;
            position: relative;
            background: #fff;
            width: 60px;
            // padding: 0 5px;
        }
        .default-text {
            padding-top: 5px;
            padding-bottom: 5px;
        }
    }

    .add-btn-line::before {
        content: "";
        position: absolute;
        width: 300px;
        height: 1px;
        background: #e8e8e8;
        top: 50%;
        left: 50%;
        transform: translateX(-50%);
    }
    .create {
        .active-tab {
            padding-left: 60px;
        }
        .active-footer {
            text-align: right;
            padding-top: 10px;
            margin-top: 20px;
            border-top: 1px solid #e8e8e8;
        }
        .note-footer {
            text-align: right;
        }
    }

    .planing {
        margin: 20px 0;
    }

    .accomplish {
        // margin-top: 20px;
    }
}
</style>
