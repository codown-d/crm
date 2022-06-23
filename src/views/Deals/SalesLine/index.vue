<!--
 * @Descripttion: 交易模組
 * @version: 
 * @Author: Lone
 * @Date: 2022-01-13 21:14:42
 * @LastEditors: Lone
 * @LastEditTime: 2022-01-21 11:31:22
-->
<template>
    <div class="saleslineUI flex-column">

        <div class="saleslineUI-header flex-between">
            <myMenu/>
            <div>
                右側的功能區
            </div>
        </div>

        <div class="saleslineUI-content flex-1">
            <div v-for="(item,index) in saleslineData" :key="index" class="saleslineUI-box flex-column" :style="{ zIndex: 900 - index * 2 }">
                <!-- <div class="saleslineUI-box__header flex-column padding-20"
                    :style="{ zIndex: 900 - index * 2 }"
                    >
                    <div class="font-16 bold-text">{{ item.title }}</div>
                    <div class="flex font-14">
                        <div class="marginRgt-10">{{ item.total }}元</div>
                        <div>{{ item.data.length }}筆交易</div>
                    </div>
                    <div class="saleslineUI-box__header--triangle" ></div>
                </div> -->
                <div class="saleslineUI-box__header flex-between"
                    >
                    <div class="flex-column padding-20">
                        <div class="font-16 bold-text">{{ item.title }}</div>
                        <div class="flex font-14">
                            <div class="marginRgt-10">{{ item.total }}元</div>
                            <div>{{ item.data.length }}筆交易</div>
                        </div>
                    </div>
                    <div class="saleslineUI-box__header--triangle" v-if="index < saleslineData.length - 1"></div>
                </div>

                <draggable v-model="item.data" class="saleslineUI-content__box flex-column" 
                    :class="{ 'gray-bg': bgType == 5 }" 
                    @dragover="onChangeBg(5)" @dragleave="bgType = 0"
                    handle=".content-card" filter=".content-card-btn"
                    sort="false"
                    group="salesline" :delay="10" animation="300" dragClass="dragClass" ghostClass="ghostClass" chosenClass="chooseClass"
                    @start="onStart" @end="onEnd" @choose="onChoose" @unchoose="onUnchoose" >
                        <transition-group>
                            <div class="content" v-for="(i,iIndex) in item.data" :key="'card-' + iIndex">
                                <dealCard 
                                    class="content-card"
                                    :dealData="i"
                                    @click="onClickDeal"
                                    @icon-click="onClickIcon"
                                />
                                <!-- fixit: 拖動最後一個交易卡片的時候，加號按鈕也跟著一起拖動了  -->
                                <!-- fixit: 沒有交易卡片的流程，不顯示新增交易按鈕 -->
                                <div v-if="iIndex == item.data.length - 1 && !isDrag"
                                    @click="onShowAddDeal" 
                                    class="content-card-btn flex-center">
                                        <a-icon type="plus" />
                                </div>
                            </div> 
                        </transition-group>
                </draggable>
            </div>

            <div v-if="isDrag" class="saleslineUI-content__footer flex" @dragover="onDragover">
                <div class="saleslineUI-content__footer--content flex">
                    <div class="footer-item flex-center"
                        :class="{ 'gray-bg color--red': bgType == 1 }"
                        @drop="onDrop(1)" @dragover="onChangeBg(1)" @dragleave="bgType = 0">刪除</div>
                    <div class="footer-item flex-center" 
                        :class="{ 'red-bg': bgType == 2 }"
                        @drop="onDrop(2)" @dragover="onChangeBg(2)" @dragleave="bgType = 0">標記失敗</div>
                    <div class="footer-item flex-center"
                        :class="{ 'green-bg': bgType == 3 }" 
                        @drop="onDrop(3)" @dragover="onChangeBg(3)" @dragleave="bgType = 0">標記成功</div>
                    <div class="footer-item flex-center"
                        :class="{ 'gray-bg': bgType == 4 }"
                        @drop="onDrop(4)" @dragover="onChangeBg(4)" @dragleave="bgType = 0">其他操作</div>
                </div>
            </div>

        </div>

    </div>
</template>

<script>
import myButton from '@/components/Common/myButton';
import myMenu from '../components/menu';
import draggable from "vuedraggable";
import dealCard from "../components/dealCard";
export default {
    components: {
        myButton,
        myMenu,
        draggable,
        dealCard
    },
    data() {
        return {
            saleslineData: [
                {  id: 0, title: '流程1', total: 5000, data: [{ id: 1, name: 'www.itxst.com' , type: 0 },{ id: 2, name: 'www.jd.com' , type: 2 }] },
                {  id: 1, title: '流程2', total: 5000, data: [{ id: 1, name: 'www.google.com' , type: 1 },{ id: 2, name: 'www.msn.com', type: 0 }] },
                {  id: 2, title: '流程3', total: 5000, data: [{}] }, 
                {  id: 3, title: '流程4', total: 5000, data: [{}] }, 
                {  id: 4, title: '流程5', total: 5000, data: [{}] }, 
                // {  title: '流程5', total: 5000 },
                // {  title: '流程5', total: 5000 },
                // {  title: '流程5', total: 5000 },
            ],
            isDrag: false,// 是否拖拽中
            bgType: 0,// 需要更改的背景類型
        }
    },
    mounted () {
        for (let i = 0; i < 15; i ++) {
            this.saleslineData[0].data.push({
                id: this.saleslineData[0].data.length + 1, 
                type: Math.floor(Math.random() * (2 - 0) + 0),
                name: 'www.itxst.com' 
            })
        }
    },
    methods: {
        onStart() {
            console.log('拖拽開始');
            this.isDrag = true;
        },
        onEnd() {
            console.log('拖拽完成');
            this.isDrag = false;
        },
        onChoose() {
            // console.log('選擇了元素');
        },
        onUnchoose() {
            // console.log('取消選擇了元素');
        },
        onDragover(e) {
            e.preventDefault()
        },
        onDrop(e) {
            // 業務代碼
            // console.log('移動到這上面了', e);
            let msg = ['刪除','標記失敗','標記成功','其他操作'];
            alert(`${ msg[e -1] }`);
            this.bgType = 0;// 重置操作區的bg
        },
        onChangeBg(e) {
            this.bgType = e;// 切換操作區的bg
        },
        onClickDeal() {
            alert(`點擊了交易卡片`);
        },
        onClickIcon() {
            alert(`點擊了交易卡片的圖示`);
        },
        onShowAddDeal() {
            alert(`點擊了新增交易`);
        },
    },
}
</script>

<style lang="less">

    .saleslineUI {
        width: 100%;
        height: 100%;
        min-width: 860px;
        position: relative;
        z-index: 10 !important;
        &-header {// 標題行部分
            width: 100%;
            display: flex;
            padding: 16px 16px 10px;
            // height: 86px;
            &__title {
                line-height: 32px;
                vertical-align: bottom;
                padding-top: 2px;
            }
        }
        &-content {// 主體部分，整個下方可操作區域
            flex: 1;
            min-height: 500px;
            min-width: 680px;
            margin: 0 20px 20px;
            border: 1px solid #dddddd;
            display: flex;
            position: relative;
            // overflow: hidden;
            &__box {
                border-right: 1px solid #dddddd;
                flex: 1;
                overflow-y: scroll;
                background: #f0f2f5;
                span {
                    flex: 1;
                    width: 100%;
                    display: flex;
                    margin: 5px 0;
                    flex-direction: column;
                    align-items: center;
                    overflow-y: scroll;
                    &:hover .content-card-btn {
                        opacity: 1;
                    }  
                }
                .content {
                    width: 100%;
                    .content-card-btn {
                        opacity: 0;
                        height: 35px;
                        width: calc(100% - 20px);
                        margin: 10px;
                        border-radius: 3px;
                        .anticon {
                            font-size: 18px;
                        }
                        &:hover {
                            background: #ECECEC;
                            cursor: pointer;
                        }
                    }
                }
            }
            &__footer { // 底部功能表區域，標記交易成功失敗等
                width: 100%;
                height: 150px;
                position: absolute;
                bottom: -10px;
                left: 0;
                z-index: 930;
                &--content {
                    width: 76%;
                    height: 80px;
                    margin-top: 70px;
                    background: #fff;
                    border-radius: 40px;
                    border: 1px solid #dddddd;
                    box-shadow: 0 2px 22px 0 #dddddd;
                    margin-left: 12%;
                }
                .footer-item {
                    flex: 1;
                    height: 100%;
                    overflow: hidden;
                    color: #2C3E50;
                    background: #ffffff;
                    font-size: 16px;
                    &:nth-child(1) {
                        border-top-left-radius: 40px;
                        border-bottom-left-radius: 40px;
                    }
                    &:nth-child(2) {
                        border-left: 1px solid #dddddd;
                        border-right: 1px solid #dddddd;
                        color: red;
                    }
                    &:nth-child(3) {
                        border-right: 1px solid #dddddd;
                        color: #63C888;
                    }
                    &:nth-child(4) {
                        border-top-right-radius: 40px;
                        border-bottom-right-radius: 40px;
                    }
                }
            }

            .saleslineUI-box {// 交易流程展示區域
                flex: 1;
                position: relative;

                &__header {// 每個交易流程階段的標題部分
                    background: #FFFEFB;
                    position: relative;
                    display: flex;
                    
                    &--triangle {
                        position: relative;
                        height: 100%;
                        width: 20px;

                        &::before {
                            content: "";
                            position: absolute;
                            right: -5px;
                            top: -1px;
                            width: 0;
                            height: 0;
                            border-style: solid;
                            border-width: 44px 0 43px 16px;
                            z-index: 1000 !important;
                            border-color: transparent transparent transparent #fffefb;
                            // border-color: transparent transparent transparent red;
                        }
                        &::after {
                            content: "";
                            position: absolute;
                            right: -6px;
                            top: -1px;
                            width: 0;
                            height: 0;
                            border-style: solid;
                            border-width: 44px 0 43px 16px;
                            z-index: 999 !important;
                            border-color: transparent transparent transparent #dddddd;
                            // border-color: transparent transparent transparent red;
                        }
                    }
                }

            }
        }

        /*捲軸 start*/  
        ::-webkit-scrollbar {  
            width: 7px;  
            height: 4px;  
            background-color: #F5F5F5;  
            display: none;
        }  

        /*定義捲軸軌道 內陰影+圓角*/  
        ::-webkit-scrollbar-track {  
            /* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);   */
            background: #ffffff00;
            // opacity: 0;  
        }  

        .chosenClass {// 選中樣式
            // background-color: #000 !important;
            // color: #fff;
            transform: rotate(-10deg) !important;
        }

        .dragClass {// 拖動樣式
            transform: rotate(-10deg) !important;
            
        }

        .ghostClass { // 占位元樣式
            // background-color: #f9483930 !important;
            transform: rotate(-10deg) !important;
        }

        .gray-bg {
            background: #dddddd !important;
        }

        .gray-bg-light {
            background: #ECECEC !important;
        }

        .red-bg {
            background: red;
            color: #fff !important;
        }

        .green-bg {
            background: #63C888;
            color: #fff !important;
        }
       
    }

</style>