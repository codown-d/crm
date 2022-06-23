<template>
    <div class="time-axios">

        <div v-if="!list.length" class="time-axios--empty flex-center">
            <a-empty :description="false" />
        </div>


        <a-timeline v-else>
            <a-timeline-item v-for="(item, index) in list" :key="index">
                <!-- <a-icon
                    slot="dot"
                    :type="timeLineIcon[item.objectType]"
                    style="font-size: 16px"
                /> -->
                <phoneIcon slot="dot" v-if="(parseInt(item.data.activityTypeId) - 1) === 0"  class="font-18" />
                <meettingIcon slot="dot" v-if="(parseInt(item.data.activityTypeId) - 1) === 1"  class="font-18" />
                <workIcon slot="dot" v-if="(parseInt(item.data.activityTypeId) - 1) === 2"  class="font-18" />
                <flagIcon slot="dot" v-if="(parseInt(item.data.activityTypeId) - 1) === 3"  class="font-18" />
                <emailIcon slot="dot" v-if="(parseInt(item.data.activityTypeId) - 1) === 4"  class="font-18" />
                <lunchIcon slot="dot" v-if="(parseInt(item.data.activityTypeId) - 1) === 5"  class="font-18" />
                
                <!-- 渲染筆記 -->
                <div
                    v-if="item.objectType === 'note'"
                    class="time-line-item bg-color-1">
                    <div class="time_line_left">
                        <template
                            v-if="
                                (!inputVisible &&
                                    editNoteID == item.objectId) ||
                                editNoteID !== item.objectId
                            "
                        >
                            <!-- <div>{{ item.timestamp.substring(0, 10) }}</div> -->
                            <div>{{ item.timestamp | filterTime(item.timestamp) }}</div>
                            <div class="note">
                                <div v-html="item.data.content"></div>
                            </div>
                        </template>

                        <template
                            v-if="inputVisible && editNoteID == item.objectId"
                        >
                            <a-textarea
                                v-model="nodeText"
                                placeholder="請輸入"
                                :auto-size="{ minRows: 2, maxRows: 6 }"
                            />
                            <a-button @click="cancelNote">取消</a-button>
                            <a-button type="primary" @click="saveNote(item)">
                                保存
                            </a-button>
                        </template>
                    </div>

                    <div>
                        <a-dropdown>
                            <span
                                style="cursor: pointer"
                                @click="(e) => e.preventDefault()"
                            >
                                <a-icon type="small-dash"
                            /></span>
                            <a-menu slot="overlay">
                                <a-menu-item>
                                    <a
                                        href="javascript:;"
                                        @click="showEditInput(item)"
                                        >編輯</a
                                    >
                                </a-menu-item>
                                <a-menu-item>
                                    <a
                                        href="javascript:;"
                                        @click="deleteNote(item)"
                                        >刪除</a
                                    >
                                </a-menu-item>
                            </a-menu>
                        </a-dropdown>
                    </div>
                </div>

                <!-- // 渲染活動 -->
                <div v-if="item.objectType === 'activity'">
                    <div class="time-line-item">
                        <div class="time_line_left">
                            <div class="flex align-center justify-start">
                                <!-- 計畫中活動checkbox展示 -->
                                <a-checkbox
                                    v-if="timeLineType == 'plan'"
                                    @change="(e) => onChangePlan(e, item)"
                                    :checked="
                                        checkId == item.objectId
                                            ? checked
                                            : false
                                    "
                                    class="mr-5"
                                >
                                </a-checkbox>

                                <!-- 已完成活動checkbox展示 -->
                                <a-checkbox
                                    v-if="timeLineType == 'done'"
                                    @change="(e) => onChangeDone(e, item)"
                                    :defaultChecked="true"
                                    :checked="
                                        doneCheckId == item.objectId
                                            ? doneChecked
                                            : true
                                    "
                                    class="mr-5"
                                >
                                </a-checkbox>

                                <span class="title"
                                    >{{ item.data.subject }}
                                </span>
                            </div>
                            <div class="time_user">
                                <div class="time">
                                    {{ item.timestamp.substring(0, 10) }}
                                </div>
                                <a-icon type="user" />
                                <div class="user">
                                    {{ item.data.activityParticipants[0].customerName }}
                                </div>
                            </div>
                            <div class="content">
                                {{ item.data.publicDescription }}
                            </div>
                        </div>

                        <div>
                            <a-dropdown>
                                <span
                                    style="cursor: pointer"
                                    @click="(e) => e.preventDefault()"
                                >
                                    <a-icon type="small-dash"
                                /></span>
                                <a-menu slot="overlay">
                                    <a-menu-item>
                                        <a
                                            href="javascript:;"
                                            @click="editActive(item)"
                                            >編輯</a
                                        >
                                    </a-menu-item>
                                    <a-menu-item>
                                        <a
                                            href="javascript:;"
                                            @click="deleteActive(item)"
                                            >刪除</a
                                        >
                                    </a-menu-item>
                                </a-menu>
                            </a-dropdown>
                        </div>
                    </div>
                </div>

                 <!-- 渲染交易 -->
                <div
                    v-if="item.objectType === 'business'"
                    class="time-line-item bg-color-1">
                    <div class="time_line_left">
                        <template
                            v-if="
                                (!inputVisible &&
                                    editNoteID == item.objectId) ||
                                editNoteID !== item.objectId
                            "
                        >
                            <!-- <div>{{ item.timestamp.substring(0, 10) }}</div> -->
                            <div>{{ item.timestamp | filterTime(item.timestamp) }}</div>
                            <div class="business">
                                <div v-html="item.data.title"></div>
                            </div>
                        </template>

                        <template
                            v-if="inputVisible && editNoteID == item.objectId"
                        >
                            <a-textarea
                                v-model="nodeText"
                                placeholder="請輸入"
                                :auto-size="{ minRows: 2, maxRows: 6 }"
                            />
                            <a-button @click="cancelNote">取消</a-button>
                            <a-button type="primary" @click="saveNote(item)">
                                保存
                            </a-button>
                        </template>
                    </div>

                    <div>
                        <a-dropdown>
                            <span
                                style="cursor: pointer"
                                @click="(e) => e.preventDefault()"
                            >
                                <a-icon type="small-dash"
                            /></span>
                            <a-menu slot="overlay">
                                <a-menu-item>
                                    <a
                                        href="javascript:;"
                                        @click="showEditInput(item)"
                                        >編輯</a
                                    >
                                </a-menu-item>
                                <a-menu-item>
                                    <a
                                        href="javascript:;"
                                        @click="deleteNote(item)"
                                        >刪除</a
                                    >
                                </a-menu-item>
                            </a-menu>
                        </a-dropdown>
                    </div>
                </div>

                <!-- 郵件類型 -->
                <div
                    v-if="item.objectType === 'email'"
                    class="time-line-item bg-color-1"
                    style="padding: 15px;">
                    <div class="time_line_left">
                        <div class="flex-column">
                            <div class="bold-text font-16">
                                {{ item.data.subject }}
                            </div>
                            <div class="gray-text flex margin-tb-5 text-overflow" style="width: 100%;" >
                                <div class="time_line_left--receiveDate">{{ item.data.receiveDate || item.data.sendDate }}</div>
                                <div class="time_line_left--to word-break">
                                    至：<a-button type="link" style="padding-left: 5px;">{{ item.data.toEmail }}</a-button>
                                </div>
                            </div>
                            <div v-if="item.data.content" class="padding-10">
                                <div v-html="item.data.content"></div>
                            </div>
                            <div v-else>

                            </div>
                        </div>
                    </div>

                    <div>
                        <a-dropdown>
                            <span
                                style="cursor: pointer"
                                @click="(e) => e.preventDefault()"
                            >
                                <a-icon type="small-dash"
                            /></span>
                            <a-menu slot="overlay">
                                <a-menu-item>
                                    <div
                                        href="javascript:;"
                                        @click="onClickMailMenu(1, item.data.id)"
                                        >回復此電子郵件</div
                                    >
                                </a-menu-item>
                                <a-menu-item>
                                    <div
                                        href="javascript:;"
                                        @click="onClickMailMenu(2, item.data.id)"
                                        >轉發此電子郵件</div
                                    >
                                </a-menu-item>
                                <a-menu-item>
                                    <div
                                        href="javascript:;"
                                        @click="onClickMailMenu(3, item.data.id)"
                                        >刪除此電子郵件</div
                                    >
                                </a-menu-item>
                                <a-menu-item>
                                    <div
                                        href="javascript:;"
                                        @click="onClickMailMenu(4, item.data.id)"
                                        >查看完整對話</div
                                    >
                                </a-menu-item>
                            </a-menu>
                        </a-dropdown>
                    </div>
                </div>

                <!-- 更多類型的渲染 -->
                <!-- <div
                    v-if="item.objectType === 3"
                    class="time-line-item bg-color-3"
                >
                    <div>
                        <span>{{ item.title }} - </span>
                        <span>{{ item.author }}</span>
                    </div>
                    <div>
                        <span>{{ item.date }}</span>
                    </div>
                </div> -->
            </a-timeline-item>
        </a-timeline>

        <a-modal
			:dialog-style="{ top: '0px' }"
			title="郵件會話"
			:visible="isMailDetailShow"
			:footer="null"
			@cancel="isMailDetailShow = false"
			width="820px"
			wrapClassName="main"
            :bodyStyle="{ background: '#f0f2f5' }"
		>
            <div class="detailEmail padding-btm-24">
                <a-spin :spinning="isDetailLoading">
                    <detailCard :mailId="messageId" :mail="mailData" :isReply="isReply"/>
                </a-spin>
            </div>  
		</a-modal>
    </div>
</template>
<script>

import moment from 'moment'

import CustomerServices from "@/services/customer-api.js";
import detailCard from "@/components/Mail/DetailCard";
import { mapGetters } from 'vuex';
import {
  phoneIcon,
  meettingIcon,
  workIcon,
  flagIcon,
  emailIcon,
  lunchIcon
} from './iconSvgs'

export default {
    components: {
        detailCard,
        phoneIcon,
		meettingIcon,
		workIcon,
		flagIcon,
		emailIcon,
		lunchIcon
    },
    props: ["list", "timeLineType"],
    data() {
        return {
            content: "",
            nodeText: "",
            timeLineIcon: {
                note: "book",
                activity: "shopping",
                email: "mail",
            },
            inputVisible: false,
            editNoteID: null,

            //計畫中
            checked: false,
            checkId: "",

            //已完成
            doneChecked: true,
            doneCheckId: "",

            isMailDetailShow: false,
            isDetailLoading: false,
            messageId: 0,
            mailData: {
                from: "",
                subject: "",
                to: "",
                content: "",
            },
            //是否點擊轉發郵件
            isReply: false
        };
    },
    computed: {
        ...mapGetters([
        ])
    },
    methods: {
        //編輯活動彈窗(調用父元件方法)
        editActive(item) {
            this.$emit("showActiveModal", item);
        },

        //刪除活動
        deleteActive(item) {
            this.$emit("deleteActive", item);
        },

        //計畫中時間軸更改活動狀態
        onChangePlan(e, item) {
            this.checkId = item.objectId;
            this.checked = true;
            this.$emit("updataActive", { ...item, status: e.target.checked });

            setTimeout(() => {
                this.checked = false;
            }, 2000);
        },

        //已完成時間軸更改活動狀態
        onChangeDone(e, item) {
            this.doneCheckId = item.objectId;
            this.doneChecked = false;
            this.$emit("updataActive", { ...item, status: e.target.checked });
            setTimeout(() => {
                this.doneChecked = true;
            }, 2000);
        },

        showEditInput(item) {
            console.log(item, "item");
            this.inputVisible = true;
            this.nodeText = item.data.content;
            this.editNoteID = item.objectId;
        },

        saveNote(item) {
            this.$emit("saveNote", { nodeText: this.nodeText, ...item });
            setTimeout(() => {
                this.inputVisible = false;
            }, 1000);
        },

        cancelNote() {
            this.inputVisible = false;
        },

        //刪除筆記
        deleteNote(item) {
            const { noteId } = item.data;
            CustomerServices.deleteNote({ param: { noteId } }).then((res) => {
                if (res.code == 0) {
                    this.$message.success("刪除成功");
                    this.$emit("deleteNote");
                }
            });
        },

        getFormVal() {},
        resetForm() {},
        itemComment(item, index) {
            item.isShowEdit = !item.isShowEdit;
        },
        onClickMailMenu(type, id) {
            if (type == 3) return this.onDeleteMail(id);//刪除
            this.isReply = false;
            this.isMailDetailShow = true;
            this.messageId = id;
            if (type == 1) this.isReply = true, this.getMessageDetail(id);//回復
            if (type == 2) this.isReply = true, this.getMessageDetail(id);//轉發
            if (type == 4) this.getMessageDetail(id)//查看正文
        },
        getMessageDetail(id) {
            this.isDetailLoading = true;
            this.$api.mail.getMessageDetail({ messageId: id }).then((resp) => {
                this.isDetailLoading = false;
                if (resp.code != 0) return this.$message.error("請求郵件數據失敗!");
                // 賦值郵件詳情資料給mailData
                if (resp.data == null) return this.$message.error("請求郵件數據失敗!");
                let res = resp.data;
                this.mailData = res;
                // 查詢郵件關聯的連絡人資訊
                if (res.flags == "false")
                    this.updateMessageStatus(
                        res.id,
                        res.flags == "false" ? "true" : "false"
                    );
            });
        },
         //如果郵件未讀，標記為標記
        updateMessageStatus(id, flags, isShow) {
            this.$api.mail
                .updateMessageStatus({
                    messageId: id,
                    messageStatus: flags,
                })
                .then((res) => {
                    if (res.code != 0)
                        return this.$message.error("標記郵件失敗!");
                    this.$store.commit("mail/SET_MAIL_STATUS", { id, flags });
                    if (isShow)
                        this.$message.success("標記成功！"),
                            this.$router.push("/mail/inbox");
                });
        },
        // 刪除郵件
        onDeleteMail(id) {
            // console.log(this.selectedMail);
            let that = this;
            this.$confirm({
				title: '刪除提示',
				content: "確認刪除這封郵件嗎?",
				okText: '確認刪除',
				cancelText: '取消',
				onOk() {
                    that.deleteMails(id);
                },
				onCancel() {
					//console.log('Cancel');
				}
            })
            
        },
        async deleteMails(id) {

			let result = await this.deleteMail(id);
			if (!result) return this.$message.error('刪除郵件成功', 2)
			// console.log('promise all', result);
			this.$message.success('刪除郵件成功')
            this.$emit('handleMail');
			this.$forceUpdate()
		},
		deleteMail(id) {
            let params = {
                param: {
                    messageId: id
                }
            };
			return new Promise((resolve, reject) => {
				this.$api.mail
					.deleteMessage(params)
					.then(res => {
						resolve(res.success)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
    },
    filters: {
		filterTime(time) {

            let YYYYMMDD = moment(time).format('YYYY年MM月DD日');
            let week = moment(time).format('E');
            let HHmm = moment(time).format('HH:mm');

            let weekText = ['一','二','三','四','五','六','日'];
            week = weekText[week - 1];

            return `${ YYYYMMDD } 星期${ week } ${ HHmm }`;

	    },
    }
};
</script>
<style lang="less">
.time-axios {

    .time-axios--empty {
        min-height: 200px;
    }

    .ant-timeline-item::after {
        content: "";
        position: absolute;
        top: 4px;
        left: 15px;
        height: 2px;
        width: 20px;
        background: #e8e8e8;
    }

    .ant-timeline-item-content {
        left: 20px;
        top: -5px;
    }
    
    padding: 10px 20px 10px 5px;
    // max-height: 400px;
    // overflow-y: auto;

    .circle-icon {
        width: 12px;
        height: 12px;
        border-radius: 6px;
        border: 1px solid #e8e8e8;
    }
    .time-line-item {
        display: flex;
        justify-content: space-between;
        padding: 5px 10px;
        border: 1px solid #e8e8e8;
    }
    .bg-color-3 {
        background: #f6fcff;
    }
    .bg-color-1 {
        background: #fff9ed;
    }
    .comment-btn {
        color: #bebebe;
        font-size: 13px;
        padding-left: 20px;
        padding-top: 10px;
        cursor: pointer;
    }
    .comment-box {
        margin: 10px 20px;
        border: 1px solid #e8e8e8;
    }
    .comment-btn-box {
        text-align: right;
        padding: 0 10px 10px 0;
    }
    .title {
        font-weight: bold;
        color: #000;
        font-size: 16px;
    }
    .time_user {
        display: flex;
        align-items: center;
        margin-left: 20px;
    }
    .time {
        margin-right: 20px;
        color: red;
    }
    .user {
        margin-left: 10px;
    }
    .time_line_left {
        width: 90%;
    }
    .time_line_left--receiveDate {
        width: 150px;
        margin-right: 10px;
        // margin: 
    }

    .time_line_left--to {
        // width: 100px;
        // max-width: 100px;
        // overflow: hidden;
        // text-overflow:ellipsis;
        // white-space: nowrap;
    }
    .content {
        padding: 10px 20px;
        font: 400 15px/20px Source Sans Pro, sans-serif;
        color: #26292c;
        background-color: #fffcdc;
        border: 1px solid #e5e5e5;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: auto;
        transition: background 0.2s ease;
        text-align: start;
        white-space: normal;
    }
    .note {
        padding: 10px 0;
        font-size: 16px;
        font-weight: bold;
    }
}
</style>
