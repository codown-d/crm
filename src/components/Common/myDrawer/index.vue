<template>
    <a-drawer
        :title="currentData.drawerTit"
        placement="right"
        :closable="true"
        :visible="show"
        @close="onClose"
        width="1100px"
        getContainer=".layout-body"
        :wrap-style="{ position: 'absolute' }"
        :mask="false"
        ><!--@close="show = false" :closable="false"  height="70vh"  :wrap-style="{ position: 'absolute' }"  :get-container="false"-->
        <div slot="title" class="myDrawer-title"><a-icon type="double-left" /></div>
        <!-- 抽屜彈出層的關閉、向上、向下按鈕部分 -->
        <div v-show="show" class="myDrawer-icons flex-column">
            <div class="flex close" @click="onClose"><a-icon type="close" /></div>
            <!-- //todo 圖示顏色根據drawer滾動距離而變化 -->
            <div class="flex-column">
                <a-icon type="up" />
                <a-icon type="down" style="color: #383839" />
            </div>
        </div>

        <div class="myDrawer-body flex">
            <!--out index ___ currentData{{currentData}}-->
            <div class="myDrawer-body__content"><Detail :currentData="currentData" /><!-- --></div>
            <div class="myDrawer-body__info">
                <Info :currentData="currentData" />
            </div>
        </div>

        <!-- <a-modal
                    title="增加交易"
                    :visible="isDrawerShow"
                    :confirm-loading="confirmBusinessLoading"
                    @ok="handleBusinessOK"
                    @cancel="handleCancel"
                    width="70%"
                    :footer="false"
                    >
                    <AddBusiness
                        msg="增加交易"
                        :show="isDrawerShow"
                        :formEdit="formEditBusiness"
                        @handleOk="handleBusinessOK"
                        @handleCancel="handleCancel"
                    />
                </a-modal>

                <a-modal
                    title="修改活動"
                    :visible="isActivityDrawerShow"
                    :confirm-loading="confirmBusinessLoading"
                    @ok="handleActivityOK"
                    @cancel="handleActivityCancel"
                    width="70%"
                    :footer="false"
                    >
                    <AddCalendar
                        msg="修改活動"
                        :formEdit="formEditActivity"
                        @handleOk="handleActivityOK"
                        @handleCancel="handleActivityCancel"
                    />
                </a-modal>

                <a-modal
                    title="修改客戶"
                    :visible="isCustomerDrawerShow"
                    :confirm-loading="confirmBusinessLoading"
                    @ok="handleCustomerOK"
                    @cancel="handleCustomerCancel"
                    width="70%"
                    :footer="false"
                    >
                    <AddCust
                        msg="修改客戶"
                        :formEdit="currentData"
                        @handleOk="handleCustomerOK"
                        @handleCancel="handleCustomerCancel"
                    />
                </a-modal> -->
    </a-drawer>
</template>

<script>
import Info from './Info'
import Detail from './Detail'
import AddBusiness from '@/components/Business/AddBusiness'
// import AddCust from "@/components/Customer/AddCust.vue";

export default {
    name: 'myDrawer',
    components: {
        Info,
        Detail,
        AddBusiness,
        // AddCust
    },
    props: ['msg', 'show', 'currentData'],
    //   props: {
    //     show: {
    //       type: Boolean,
    //       default: false
    //     },
    //     // currentData: {
    //     //     type: Array,
    //     //     default: []
    //     // }
    // },
    data() {
        return {
            //currentCust:[ ...this.$store.state.main.currentCustomer],
        }
    },
    mounted() {
        //console.log('mounted',[ ...this.$store.state.main.currentCustomer]);
    },
    computed: {
        // currentCustomer(){
        //   let currentCustomer = [ ...this.$store.state.main.currentCustomer];
        //   return currentCustomer
        // }
    },
    methods: {
        onClose() {
            this.$emit('close')
        },
    },
}
</script>

<style>
/* 修改antd drawer的圓角和陰影 */
.ant-drawer .ant-drawer-content-wrapper,
.ant-drawer-content {
    border-top-left-radius: 15px;
    /* 抽屜左下角的圓角 */
    /* border-bottom-left-radius: 15px;  */
    /* -webkit-box-shadow: -2px 0 8px rgb(0 0 0 / 10%); */
    /* box-shadow: -2px 0 8px rgb(0 0 0 / 10%); */
}

/* 修改antd drawer的遮罩層樣式 */
/* .ant-drawer-mask {
    background-color: rgba(0, 0, 0, 0.1);
  } */

/* 修改antd drawer的title樣式 */
.myDrawer-title {
    text-align: left;
    font-size: 22px;
    color: #d2d2d2;
}

/* 修改antd drawer的body樣式 */
.drawer-body {
    position: relative;
}

.myDrawer-icons {
    position: absolute;
    left: -65px;
    top: 20px;
    width: 48px;
    min-height: 100px;
    align-items: center;
    justify-content: flex-start;
    background: #ffffff;
    border: 1px solid #e8e8e8;
    border-radius: 5px;
    /* -webkit-box-shadow: -2px 0 8px rgb(0 0 0 / 10%);
    box-shadow: -2px 0 8px rgb(0 0 0 / 10%); */
    -webkit-transition: -webkit-transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1), -webkit-box-shadow 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
    transition: -webkit-transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1), -webkit-box-shadow 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
    transition: transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1), box-shadow 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
    transition: transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1), box-shadow 0.3s cubic-bezier(0.7, 0.3, 0.1, 1),
        -webkit-transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1), -webkit-box-shadow 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
}

.myDrawer-icons div {
    width: 45px;
    height: 65px;
    color: #d2d2d2;
    font-size: 18px;
    justify-content: center;
}

.myDrawer-icons div:first-child {
    border-bottom: 1px solid #d2d2d2;
    height: 34px;
}

.myDrawer-icons div:nth-child(2) .anticon {
    margin: 3px 0 0 0;
}

/* 修改antd-vue 關鍵樣式，修改在drawer外可顯示div */
.ant-drawer-content {
    position: static;
}

.ant-drawer-body {
    padding: 0;
    /* height: calc; */
}

.myDrawer-body {
    /* background: red; */
    height: calc(100vh - 120px);
    align-items: flex-start;
    min-width: 960px;
}

.myDrawer-body__content {
    flex: 1;
}

.myDrawer-body__info {
    width: 360px;
    border-left: 1px solid #e8e8e8;
    height: 100%;
}
</style>
