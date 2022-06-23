<template>
	<div class="processUI flex-column default-scrollbar">
		<div class="nav_item">
            <myButton class="item_btn" icon="left" text="返回交易" @click="$router.push('/deals')" />
			<a-input size="large" class="item_input" v-model="value" v-if="!hide" />
			<a-select size="default" :default-value="this.value" class="a_option" @change="handleChange">
				<a-select-option v-for="(i, index) in typeProcess" :key="index">
					{{ i.name }}
				</a-select-option>
			</a-select>
			<div class="preservation" @click="addProcess" v-if="hide">新增</div>
			<div class="cancel edit_btn" @click="editProcess" v-if="hide">編輯</div>
			<div class="delete" @click="beforeDeleteBusinessFlow" v-if="addHide">刪除流程</div>
			<div class="preservation" @click="Preservation" v-if="!hide">保存</div>
			<div class="cancel" @click="showModal" v-if="!hide">取消</div>
		</div>
		<div class="home_content">
			<div class="content_left">
				<div class="processList" :style="{ width: data.length * 300 + 'px' }">
					<div
						class="processList_item"
						v-for="(item, index) in data"
						:key="index"
						:style="{ height: winHeight + 'px' }"
					>
						<div class="item_div">
							<p class="item_title">{{ item.name }}</p>
							<div class="minTitle">
								<a-icon type="dollar" class="icon" />
								<span class="span">{{ item.defaultProbability }}元</span>
								<a-icon type="clock-circle" class="icon" />
								<span class="span">{{ item.idleDays }}天</span>
							</div>
							<a-icon
								type="plus-circle"
								class="icon_right"
								@click="addChange(index, 0)"
								v-if="!addHide"
							/>
							<a-icon type="plus-circle" class="icon_left" @click="addChange(index, 1)" v-if="!addHide" />

							<div class="line" v-if="index < data.length - 1"></div>
						</div>
						<div class="item_mcontent" :style="{ height: winHeight - 125 + 'px' }">
							<p>名稱</p>
							<a-input
								class="a_input"
								:value="item.name"
								@input="inputValue($event, index)"
								:disabled="hide"
							/>
							<p>概率</p>
							<a-input-number
								class="num_input"
								:min="0"
								:max="100000"
								:default-value="item.defaultProbability"
								@change="onChange($event, index)"
								:disabled="hide"
							/>
							<div class="day">
								<span class="span">（天）後變為閒置</span>
								<a-switch @change="onSwitch(index)" :checked="checked" :disabled="hide" />
							</div>
							<a-input-number
								class="num_input"
								:min="0"
								:max="100000"
								:default-value="item.idleDays"
								@change="onChangeNum($event, index)"
								v-if="item.idleEnabled"
							/>
							<!-- <div class="clear"  @click="clear(index)" v-if="false">
                        <a-icon type="delete" theme="filled" class="delete_icon" />
                        <span>刪除階段</span>
                      </div> -->
							<div class="clear" @click="clear(index)" v-if="!addHide">
								<a-icon type="delete" theme="filled" class="delete_icon" />
								<span>刪除階段</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<a-modal v-model="visible" title="尚有為保存的變更" @ok="handleOk">
				<p>確定要取消編輯嗎？</p>
			</a-modal>
			<div class="content_right" v-if="!addHide">
				<div class="add_box" :style="{ height: winHeight - 60 + 'px' }">
					<div class="add_content">
						<p>新增階段</p>
						<div class="new_list_btn" @click="addChange(-1, 3)">
							<a-icon type="plus" style="color: #2b2b2b; fontsize: 18px" />
							<span>新階段</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { POST } from '@/utils/request.js'
import myButton from '@/components/Common/myButton'
export default {
	name: 'HomeView',
	components: {
        myButton
    },
	data() {
		return {
			data: [],
			typeProcess: [],
			winHeight: 0,
			visible: false,
			hide: true,
			addHide: true,
			checked: false,
			value: '',
			aeid: 0,
			deitIndex: 0,
			salesId: 0,
		}
	},
	methods: {
		//獲取流程清單
		getQueryList() {
			POST('/api/customer/businessFlow/queryList', {
				param: {
					name: '',
					partnerId: 1,
				},
			})
				.then(res => {
					this.typeProcess = res
				})
				.catch(err => {
					console.log(err, '獲取流程清單')
				})
		},
		// 下拉清單
		handleChange(value) {
			//獲取流程詳情
			POST('/api/customer/businessFlow/queryDetail', {
				param: {
					salesFlowId: parseInt(this.typeProcess[value].id),
				},
			})
				.then(res => {
					this.data = res.businessSalesStageList
					this.deitIndex = value
					this.salesId = this.typeProcess[value].id
				})
				.catch(err => {
					console.log(err, '獲取流程詳情')
				})
			this.value = this.typeProcess[value].name
		},
		//input  名稱
		inputValue(e, id) {
			this.data[id].name = e.target.value
		},
		//inputNumber
		//概率
		onChange(e, id) {
			this.data[id].defaultProbability = e
		},
		//天
		onChangeNum(e, id) {
			this.data[id].idleDays = e
		},
		//開關
		onSwitch(index) {
			this.data[index].idleEnabled = !this.data[index].idleEnabled
		},
		//編輯
		editProcess() {
			this.hide = false
			this.aeid = 1
		},
		//新增
		addProcess() {
			this.data = []
			this.hide = false
			this.addHide = false
			this.aeid = 2
		},
		//取消
		showModal() {
			this.visible = true
		},
		//保存
		Preservation() {
			this.hide = true
			this.addHide = true
			// this.checked=false
			console.log(this.checked)
			if (this.aeid == 2) {
				//新增階段
				for (let i = 0; i < this.data.length; i++) {
					this.data[i].idleEnabled = false
				}
				this.aeid = 0
				POST('/api/customer/businessFlow/addBusinessFlow', {
					param: {
						name: this.value,
						addBusinessStageReqList: this.data,
					},
				})
					.then(res => {
						alert('新增成功')
						this.getQueryList()
					})
					.catch(err => {})
			} else if (this.aeid == 1) {
				//編輯階段
				for (let i = 0; i < this.data.length; i++) {
					this.data[i].idleEnabled = false
				}
				this.aeid = 0

				POST('/api/customer/businessFlow/editBusinessFlow', {
					param: {
						salesFlowId: this.typeProcess[this.deitIndex].id,
						addBusinessStageReqList: this.data,
						name: this.value,
					},
				})
					.then(res => {
						this.getQueryList()
						alert('編輯成功')
					})
					.catch(err => {
						console.log(err, '編輯階段')
					})
			}
			// }else if(this.aeid==3){
			//   this.aeid=0
			//   this.getQueryList();
			// }
		},
		//對話方塊
		handleOk(e) {
			this.visible = false
			this.hide = true
			this.addHide = true
		},
		//新增  num等於 0 往後新增 1往前新增 3 在最後面新增
		addChange(id, num) {
			let obj = {
				defaultProbability: 0,
				idleDays: 0,
				salesStageId: '',
				salesFlowId: this.salesId,
				idleEnabled: false,
				name: 'new',
				sort: this.data.length,
			}
			console.log(obj.sort)
			if (num == 0) {
				this.data.splice(id + 1, 0, obj)
			}
			if (num == 1) {
				this.data.splice(id, 0, obj)
			}
			if (num == 3) {
				this.data.push(obj)
			}
		},

        beforeDeleteBusinessFlow() {
            let that = this;
            this.$confirm({
                title: '確認刪除嗎?',
                content: '確認刪除該交易流程嗎?',
                okText: '確認刪除',
                okType: '取消',
                cancelText: '取消',
                onOk() {
                    that.deleteBusinessFlow();
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        },

		//刪除流程
		deleteBusinessFlow() {
			this.hide = true
			this.addHide = true
			POST('api/customer/businessFlow/deleteBusinessFlow', {
				param: {
					salesFlowId: this.typeProcess[this.deitIndex].id,
				},
			})
				.then(res => {
					this.getQueryList()
					alert('刪除成功')
				})
				.catch(err => {
					console.log(err, '刪除階段')
				})
		},
		//刪除階段
		clear(id) {
			this.data.splice(id, 1)
			// this.aeid=0
			// POST('http://124.221.87.36:9200/api/customer/businessFlow/checkBusinessStage',
			// {
			//   "param": {
			//     "salesFlowId":this.typeProcess[this.deitIndex].id,
			//     "salesStageId":this.data[id].salesStageId
			//   },
			// }).then((res)=>{
			//   this.data.splice(id,1)
			//   alert('刪除成功')
			// }).catch((err)=>{
			//   console.log(err,'刪除階段')
			// })
		},
	},
	watch: {
		typeProcess() {
			this.$nextTick(function () {
				this.handleChange(0)
			})
		},
	},
	created() {
		this.getQueryList()
	},
	mounted() {
		this.winHeight =
			document.documentElement.clientHeight - 60 < 400 ? 600 : document.documentElement.clientHeight - 120
		window.onresize = () => {
			return (() => {
				this.winHeight =
					document.documentElement.clientHeight - 60 < 400 ? 600 : document.documentElement.clientHeight - 120
			})()
		}
	},
}
</script>
<style scoped>

.processUI {
    height: 100%;
}

/* 頭部 */
.nav {
	width: 100%;
	height: 60px;
	padding: 10px 0;
}
.nav_item {
	position: relative;
	width: 100%;
	height: 60px;
	padding: 10px 0;
}
.item_btn {
    float: left;
	height: 32px;
	font-size: 14px;
	margin: 0 10px;
    margin-top: 5px;
}
.item_input {
	float: left;
	width: 200px;
	height: 32px;
	font-size: 16px;
	margin: 4px 0 0 20px;
}
.a_option {
	position: absolute;
	width: 200px;
	height: 32px;
	font-size: 16px;
	right: 400px;
	margin-top: 4px;
}
/* 取消/保存/編輯/新增 */
.preservation {
	float: right;
	width: 55px;
	height: 32px;
	line-height: 32px;
	margin: 4px 40px 0 0;
	text-align: center;
	font-weight: bold;
	background: #ff9980;
	border-radius: 10px;
	cursor: pointer;
}
.cancel {
	float: right;
	width: 55px;
	height: 32px;
	line-height: 32px;
	margin: 4px 40px 0 0;
	text-align: center;
	font-weight: bold;
	background: white;
	border-radius: 10px;
	cursor: pointer;
}
.edit_btn {
	font-weight: bold;
	background: #ff9980;
}
.delete {
	float: right;
	width: 70px;
	height: 32px;
	line-height: 32px;
	margin: 4px 50px 0 0;
	text-align: center;
	font-weight: bold;
	background: #ff9980;
	border-radius: 10px;
	cursor: pointer;
}
/* 下面部分 */
.home_content {
	display: flex;
	overflow-x: scroll;
    overflow-y: hidden;
    min-width: 100%;
    max-width: 100%;
    height: calc(100% - 20px)
}
.content_left {
    flex: 1;
}
.processList {
	display: flex;
	margin-left: 10px;
	border: 1px solid #d8d8d8;
    max-width: 100%;
    /* overflow-x: scroll; */
    height: calc(100% - 20px)
}
/* 左側清單部分 */
.processList_item {
	width: 300px;
}
.processList_item:hover {
	background: white;
}
/* 流程部分 */
.item_div {
	position: relative;
	width: 100%;
	height: 85px;
	padding: 20px 0 0 20px;
	font-size: 16px;
	border-bottom: 1px solid #d8d8d8;
	color: #2b2b2b;
	background: #fffefb;
}
.item_title {
	font-weight: bold;
	margin-bottom: 0px;
}
.minTitle {
	display: flex;
	justify-content: flex-start;
}
.line::before {
	content: '';
	position: absolute;
	right: -5px;
	top: -1px;
	width: 0;
	height: 0;
	border-style: solid;
	border-width: 44px 0 43px 16px;
	z-index: 1000 !important;
	border-color: transparent transparent transparent #fffefb;
}
.line::after {
	content: '';
	position: absolute;
	right: -6px;
	top: -1px;
	width: 0;
	height: 0;
	border-style: solid;
	border-width: 44px 0 43px 16px;
	z-index: 999 !important;
	border-color: transparent transparent transparent #dddddd;
}
.span {
	font-size: 14px;
	margin: 0 20px 0px 5px;
}
.processList_item:hover .item_title {
	background: white;
}
.icon {
	font-size: 14px;
	margin-top: 4px;
}
.icon_right {
	position: absolute;
	font-size: 14px;
	right: 30px;
	margin: -30px;
	display: none;
	z-index: 2222 !important;
}
.icon_left {
	position: absolute;
	font-size: 14px;
	left: 0;
	margin-top: -30px;
	display: none;
	z-index: 2222 !important;
}
.processList_item:hover .icon_right {
	display: inline;
}
.processList_item:hover .icon_left {
	display: inline;
}
/* 流程編輯部分 */
.item_mcontent {
	position: relative;
	padding-left: 20px;
	border-right: 1px solid #d8d8d8;
}
.item_mcontent p {
	font-size: 14px;
	margin: 20px 0 0 0;
}
.processList_item:hover .item_mcontent p {
	font-weight: bold;
}
.a_input {
	width: 260px;
	font-size: 14px;
}
.num_input {
	width: 260px;
	font-size: 14px;
	margin-top: 5px;
}
.day {
	margin-top: 20px;
}
/* 刪除 */
.clear {
	position: absolute;
	width: 300px;
	height: 80px;
	line-height: 80px;
	font-size: 16px;
	font-weight: bold;
	text-align: center;
	bottom: -20px;
	margin-left: -20px;
	border-top: 1px solid #474747;
	background: #ff9980;
	cursor: pointer;
	display: none;
}
.delete_icon {
	font-size: 16px;
}
.processList_item:hover .clear {
	display: block;
}
/* 右側添加 */
.content_right {
	flex: auto;
	border-left: 1px solid #d8d8d8;
}
.add_box {
	position: relative;
	min-width: 325px;
}
.add_content {
	position: absolute;
	width: 300px;
	height: 200px;
	text-align: center;
	top: 50%;
	left: 50%;
	transform: translate(-150px, -100px);
}
.add_content p {
	font-size: 24px;
	font-weight: bold;
	margin-bottom: 20px;
}
.new_list_btn {
	display: flex;
	justify-content: center;
	width: 100px;
	height: 40px;
	font-size: 18px;
	font-weight: bold;
	padding-top: 10px;
	margin: 0 auto;
	background: #ff9980;
	border-radius: 10px;
	cursor: pointer;
}
</style>
