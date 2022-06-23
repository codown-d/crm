<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lone
 * @Date: 2022-01-17 20:53:59
 * @LastEditors: Lone
 * @LastEditTime: 2022-04-29 10:45:03
-->
<template>
     <div class="">
        <div class="dealsUI-header__title font-24 marginRgt-10">
            交易
        </div>
        <!-- <a-radio-group :value="dealsValue" @change="onChangeDealsValue">
            <a-radio-button v-for="(item, index) in iconMenus" :key="index" :title="`${item.title}`" 
                                    :value="index" :class="{ 'dealsUI-radio marginRgt-5': true, 'dealsUI-radio--checked': dealsValue == index }">
                <span class="material-icons flex-center" :style="{ transform: index == 0 ? 'rotate(180deg)' : '' }">{{ item.icon }}</span>
            </a-radio-button>                
        </a-radio-group> -->
        <!-- <myButton class="marginRgt-10" icon="plus" text="交易" theme="orange" :isRound="true"/> -->
            
    </div>
</template>

<script>
import myButton from '@/components/Common/myButton';
export default {
    components: {
        myButton,
    },
    data() {
        return {
            iconMenus: [
                { title: '交易流程', path: '/process',icon:'leaderboard' },
                { title: '交易清單', path: '/deals',icon:'list' }, 
                // { title: '交易行事曆顯示', path: '/timeline',icon:'date_range' },
            ],
            dealsValue: 1,
        }
    },
    computed: {
        currentPath() {
            let path = this.$route.path;
            return path;
        },
    },
    watch: {
        currentPath: {
            immediate: true,
            deep: true,
            handler(newValue, oldValue) {
                let path = this.$route.path;
                // this.$util.console(path, '交易模組 === path變動');
                if (newValue != oldValue) {
                    this.dealsValue = this.iconMenus.findIndex(i => newValue == i.path);
                }
            },
        },
    },
    methods: {
        onChangeDealsValue(e) {
            // console.log(index);
            let index = e.target.value;
            let path = this.iconMenus[index].path
            this.$router.push(path);
        }
    },
}
</script>

<style lang="less">

    .dealsUI {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        min-width: 860px;
        &-header {
            width: 100%;
            display: flex;
            padding: 16px 16px 10px;
            &__title {
                line-height: 32px;
                vertical-align: bottom;
                padding-top: 2px;
            }
        }

        &-radio {
            line-height: 1;
            &--checked {
                border: 1px solid #f97358 !important;
                color: #f97358 !important;
                box-shadow: 0 0 0 3px rgb(249 115 88 / 8%) !important;
                &::before {
                    background-color: #f97358 !important;
                }
            }
            .material-icons {
                margin-top: 4px;
            }
            &:hover {
                color: #f97358;
            }
        }
    }

</style>
