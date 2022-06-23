<template>
	<a-drawer
		v-if="drawerVisible"
		placement="right"
		:visible="drawerVisible"
		@close="onClose"
		:width="drawerWidth + 'px'"
		getContainer=".layout-body"
		:wrap-style="{ position: 'absolute' }"
		:mask="true"
		:maskStyle="{ backgroundColor: '#00000050' }"
		:maskClosable="true"
		:destroyOnClose="true"
		:zIndex="9000"
		wrapClassName="drawer-wrap"
		:bodyStyle="{ padding: 0, height: '100%', minHeight: '100%', maxHeight: '100%', paddingRight: '10px' }"
		:title="drawerTitle"
		:closable="false"
	>
		<!-- 抽屜彈出層的關閉、向上、向下按鈕部分 -->
		<div class="myDrawer-icons flex-column">
			<div class="flex close" @click="onClose"><a-icon type="close" /></div>
		</div>

		<div v-if="drawerDataLoading" class="drawer-box-wrap">
			<a-spin :spinning="drawerDataLoading" tip="加載用戶數據中..."></a-spin>
		</div>

		<div class="drawer-box">
			<div class="drawer-left flex-column">
				<div>
					<mailDetail
                            :mailData="mailData"
                            ref="composeMail"
                            @onsuccess="onSendMail"
							@onclose="onClose"
                        />
				</div>
			</div>
		</div>
	</a-drawer>
</template>
<script>
import moment from 'moment'
import Service from '@/services/common.js'
import mailDetail from "@/components/public/mailDetail";

export default {
	components: {
		mailDetail,
	},
	data() {
		return {
			drawerVisible: false,
			drawerDataLoading: false,
            drawerTitle:"郵件營銷",
            mailData:{},
		}
	},
	props: {
		scene: String,
		moduleType: {
			type: String,
			default: () => '',
		},
		detailData: {
			type: Object,
			default: () => {},
		},
	},
    computed: {
        drawerWidth() {
            return this.$store.state.main.drawerWidth 
        }
    },
	watch: {
		drawerVisible: {
			immediate: true,
			handler(val, oldVal) {
				if (val) {
					this.search()
					this.getBusinessInfo()
				}
			},
		},
        detailData:{
            immediate: true,
            deep:true,
			handler(val, oldVal) {
				this.mailData = val
			},

        }
	},
	created() {},
	methods: {
		//查詢客戶資訊
		search() {
			
		},
        //交易詳情
		getBusinessInfo() {
			
		},
        onClose() {
			console.log("sss")
			this.drawerVisible = false
		},
        onSendMail(type)
        {
			this.$emit('onSuccess',type)
			if(type != 'save'){
				this.drawerVisible=false
			}
			

        },
    }
}
</script>

<style lang="less">
//todo: 抽屉左上圆角，联络人详情抽屉、组织详情抽屉，但是数据导入的侧边菜单抽屉不需要。
// .drawer-wrap {
//     /* 修改antd drawer的圓角和陰影 */
//     .ant-drawer .ant-drawer-content-wrapper,
//     .ant-drawer-wrapper-body,
//     .ant-drawer-content,
//     .ant-drawer-body {
//         border-top-left-radius: 20px;
//     }
//     .ant-drawer-right.ant-drawer-open .ant-drawer-content-wrapper {
//         box-shadow: none;
//     }
// }
.drawer-box-wrap {
	height: 100%;
	width: 100%;
	overflow: hidden;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff99;
    z-index: 999;
    border-top-left-radius: 20px;
}

.drawer-box {
	display: flex;
	height: 100%;
	overflow: hidden;
    z-index: 998;
    border-top-left-radius: 20px;
}

.drawer-left {
	flex: 1;
	padding: 0 30px 30px;
	height: 100%;
	border-right: 1px solid #e8e8e8;
	overflow: scroll;
	z-index: 998;
    border-top-left-radius: 20px;
	/*滚动条 start*/
	::-webkit-scrollbar {
		width: 12px;
		height: 12px;
	}

	/*定义滚动条轨道 内阴影+圆角*/
	::-webkit-scrollbar-track {
		background: #f1f1f1;
	}

	/*定义滑块 内阴影+圆角*/
	::-webkit-scrollbar-thumb {
		border-radius: 0px;
		border: 0;
		background-color: #c1c1c1;
		cursor: pointer;
	}

	::-webkit-scrollbar-thumb:hover {
		border-radius: 0px;
		border: 0;
		background-color: #a8a8a8;
		cursor: pointer;
	}
}
.drawer-header {
	display: flex;
	justify-content: space-between;
	padding-bottom: 20px;
	padding-top: 30px;
	// border-bottom: 1px solid #e8e8e8;
	margin-bottom: 20px;
	position: sticky;
	top: 0;
	background: #fff;
	z-index: 999;
	padding-left: 30px;
	// margin: 0 -30px 0px 0px;
	margin-left: -30px;
	margin-right: 30px;
	width: calc(100% + 60px);
    border-top-left-radius: 20px;
}

.drawer-header:after {
	content: '';
	width: calc(100% - 60px);
	height: 1px;
	background: #e8e8e8;
	position: absolute;
	bottom: 0;
	left: 30;
}

.user-name {
	margin-left: 15px;
	font-size: 20px;
	font-weight: 600;
	margin-right: 15px;
}
.avater-img {
	width: 50px;
	height: 50px;
	border-radius: 50%;
}

.drawer-right {
	width: 100%;
    width: 20%;
    min-width: 150px;
	height: 100%;
}

.drawer-body {
	position: relative;
}

.myDrawer-icons {
	position: absolute;
	left: -65px;
	top: 20px;
	width: 48px;
	// min-height: 100px;
	height: 48px;
	align-items: center;
	justify-content: flex-start;
	background: #ffffff;
	border: 1px solid #e8e8e8;
	border-radius: 5px;
	// -webkit-box-shadow: -2px 0 8px rgb(0 0 0 / 10%);
	// box-shadow: -2px 0 8px rgb(0 0 0 / 10%);
	-webkit-transition: -webkit-transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1),
		-webkit-box-shadow 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
	transition: -webkit-transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1),
		-webkit-box-shadow 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
	transition: transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1), box-shadow 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
	transition: transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1), box-shadow 0.3s cubic-bezier(0.7, 0.3, 0.1, 1),
		-webkit-transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1), -webkit-box-shadow 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
}

.myDrawer-icons .close {
	.anticon {
		font-size: 18px;
		font-weight: 600;
		color: #2c3e50;
	}
}

.myDrawer-icons div {
	width: 45px;
	height: 65px;
	color: #d2d2d2;
	font-size: 18px;
	justify-content: center;
}

// .myDrawer-icons div:first-child {
//     border-bottom: 1px solid #d2d2d2;
//     height: 34px;
// }

.myDrawer-icons div:nth-child(2) .anticon {
	margin: 3px 0 0 0;
}

/* 修改antd-vue 關鍵樣式，修改在drawer外可顯示div */
.ant-drawer-content {
	position: static;
}

</style>
