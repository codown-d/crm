<!--
 * @Descripttion: 交易流程中交易卡片
 * @version: 
 * @Author: Lone
 * @Date: 2022-01-19 20:02:10
 * @LastEditors: Lone
 * @LastEditTime: 2022-01-20 16:24:35
-->
<template>
    <div class="dealCard flex-between" @click="onClickCard">
        <div class="dealCard-content flex-1">
            <div class="font-16">交易名稱 {{ cardData.id }} </div>
            <div class="font-14 gray-text">交易描述</div>
            <div class="marginTop-10 gray-text">金額: 1000USD</div>
        </div>
        <div class="dealCard-icon flex-center" @click.stop="onClickIcon">
            <a-icon v-if="cardData.type == 0" type="warning" theme="filled" :style="{ color: '#FFDF1C' }"/>
            <a-icon v-else-if="cardData.type == 1" type="right-circle" theme="filled" :style="{ color: '#61C786' }"/>
            <a-icon v-else type="left-circle" theme="filled" :style="{ color: '#F94839' }"/>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        dealData: {
            type: Object,
            default: () => {}
        },
    },
    data() {
        return {
           cardData: {
               id: 0,
           }
        }
    },
    watch: {
        dealData: {
            immediate: true,
            deep: true,
            handler(newValue, oldValue) {
                if (newValue != oldValue) this.cardData = this.$lodash.cloneDeep(newValue);
            }
        }
    },
    methods: {
       onClickCard() {
           this.$emit('click');
       },
       onClickIcon() {
           this.$emit('icon-click');
       },
    },
}
</script>

<style lang="less">

    .dealCard {
        background: #fff;
        min-height: 60px;
        width: calc(100% - 20px);
        box-shadow: 0 2px 12px 0 #dddddd80;
        margin: 5px 10px;
        padding: 15px;
        border-radius: 3px;
        &-content {
            display: flex;
            flex-direction: column;
        }
        &-icon {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            .anticon {
                font-size: 15px;
            }
            &:hover {
                background: #dddddd;
            }
        }
        &:hover {
            cursor: pointer;
        }
    }
    
</style>