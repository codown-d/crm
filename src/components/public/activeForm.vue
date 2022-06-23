
<!--
 * @Descripttion: 添加活動表單，全部地方共用。
 * @version: 
 * @Author: Lone
 * @Date: 2022-03-08 21:36:28
 * @LastEditors: Lone
 * @LastEditTime: 2022-05-11 17:36:17
-->
<template>
	<div class="active-form">
		<a-form-model
			:model="form"
			ref="form"
			class="form-item-bottom"
			:rules="rules"
			layout="horizontal"
			v-bind="formItemLayout"
		>
			<a-form-model-item label="活動名稱" prop="subject">
				<!-- <a-input placeholder="請輸入活動名稱" v-model="form.subject" /> -->
				<a-input :placeholder="activityTypePlaceholder" v-model="form.subject" />
				<div class="activity-types">
					<template v-for="(item, index) in activityTypeIconList">
						<span :class="['type-icon', { active: item.active }]" v-if="index === 0" :key="index" @click="handleActivityType(item, index)" :title="item.type_title"><phoneIcon /></span>
						<span :class="['type-icon', { active: item.active }]" v-if="index === 1" :key="index" @click="handleActivityType(item, index)" :title="item.type_title"><meettingIcon /></span>
						<span :class="['type-icon', { active: item.active }]" v-if="index === 2" :key="index" @click="handleActivityType(item, index)" :title="item.type_title"><workIcon /></span>
						<span :class="['type-icon', { active: item.active }]" v-if="index === 3" :key="index" @click="handleActivityType(item, index)" :title="item.type_title"><flagIcon /></span>
						<span :class="['type-icon', { active: item.active }]" v-if="index === 4" :key="index" @click="handleActivityType(item, index)" :title="item.type_title"><emailIcon /></span>
						<span :class="['type-icon', { active: item.active }]" v-if="index === 5" :key="index" @click="handleActivityType(item, index)" :title="item.type_title"><lunchIcon /></span>
					</template>
				</div>
			</a-form-model-item>
			<a-form-model-item label="活動日期" prop="time">
				<a-range-picker v-model="form.time" :placeholder="['開始日期', '結束日期']" style="width: 100%" show-time />
			</a-form-model-item>
			<a-form-model-item label="活動描述" prop="publicDescription">
				<a-textarea v-model="form.publicDescription" placeholder="請輸入" :auto-size="{ minRows: 2, maxRows: 6 }" />
			</a-form-model-item>
			<a-form-model-item label="活動指派人" prop="ownerUser">
				<dictSelect
				:defaultValue="form.ownerUser"
				:defaultName="form.ownerName"
				:selectDict="'user'"
				:allowClear="true"
				@selectChange="ownerChange($event)"/>
			</a-form-model-item>
			<a-form-model-item label="聯絡人" prop="customerId">
				<dictSelect
				:defaultValue="form.customerId"
				:defaultName="form.customerName"
				:selectDict="'customer'"
				:showSelectInsert="true"
				@selectChange="customerChange($event)"/>
			</a-form-model-item>

			<a-form-model-item label="關聯公司" prop="companyName" :colon="false">
				<dictSelect
				:defaultValue="form.companyId"
				:defaultName="form.companyName"
				:selectDict="'company'"
				:showSelectInsert="true"
				@selectChange="companyChange($event)"/>
			</a-form-model-item>
		</a-form-model>
	</div>
</template>
<script>
import Services from '@/services/common.js'
import moment from 'moment'
import { mapGetters } from 'vuex';
import {
  phoneIcon,
  meettingIcon,
  workIcon,
  flagIcon,
  emailIcon,
  lunchIcon
} from './iconSvgs'
import dictSelect from '@/components/Common/dictSelect'

export default {
	name: 'activeForm',
	components: {
		phoneIcon,
		meettingIcon,
		workIcon,
		flagIcon,
		emailIcon,
		lunchIcon,
		dictSelect
	},
	data() {
		return {
			activityTypePlaceholder: '',
			form: {},
			formItemLayout: { labelCol: { span: 5 }, wrapperCol: { span: 18	 } },
			activitypes: [],
			rules: {
				subject: [
					{
						required: true,
						message: '請輸入活動名稱',
						trigger: 'blur',
					},
				],
				time: [
					{
						required: true,
						message: '請輸入活動日期',
						trigger: 'change',
					},
				],
				activityParticipants: [
					{
						required: true,
						message: '請選擇人物設置',
						trigger: 'blur',
					},
				],
				location: [
					{
						required: true,
						message: '請輸入地點設置',
						trigger: 'blur',
					},
				],
				publicDescription: [
					{
						required: true,
						message: '請輸入活動描述',
						trigger: 'blur',
					},
				],
				// ownerUser: [
				// 	{
				// 		required: true,
				// 		message: '請輸入活動指派人',
				// 		trigger: 'blur',
				// 	},
				// ],
			},
		}
	},
	props: {
		formData: {
			type: Object,
			default: () => {},
		},
	},
	computed: {
		...mapGetters([
			'activityTypeList',
			'userInfo',
		])
	},
	created() {
		this.activityTypeIconList = this.activityTypeList.map((e, i) => {
			let item;
			if (i === 0) item = {active: true, ...e};
			else item = {active: false, ...e};
			return item;
		});
		this.activityTypePlaceholder = this.activityTypeIconList[0].type_title;
	},
	watch: {
		formData: {
			immediate: true,
            deep: true,
			handler(val,oldVal) {
                if (val != oldVal) {
                    console.log('新增活动表单的打印值：', val);
                    this.form = val;
                    if (this.form.activityTypeId == undefined) {
						this.form.activityTypeId = '1';
					}
					if(this.form.activityParticipants && this.form.activityParticipants.length > 0){
						this.form.customerId = this.form.activityParticipants[0].customerId;
						this.form.customerName = this.form.activityParticipants[0].customerName;
					}

                    
                }
			},
		},
	},
	methods: {
		validate() {
			return new Promise(resolve => {
				this.form.publicDescription = this.form.publicDescription ? this.form.publicDescription.trim() : this.form.publicDescription
				this.$refs.form.validate(valid => {
					if (valid) {
						
						resolve(true)
					}
					resolve(false)
				})
			})
		},
		getFormVal() {
			this.validate()
			return this.form
		},
		setFormVal(obj) {
			this.form = Object.assign({}, obj)
		},
		resetForm() {
			this.$refs.form.resetFields()
		},
		handleActivityType(item, index) {
            // console.log('點擊切換了活動類型' , item);
			this.activityTypePlaceholder = item.type_title;
			this.activityTypeIconList.forEach(ele => {
				ele.active = false;
			})
			this.activityTypeIconList[index].active = !this.activityTypeIconList[index].active;
			this.form.activityTypeId = item.id;
		},
		customerChange(value) {
			this.form.customerId = value.id;
            this.form.customerName = value.name;
            if(this.form.customerId && value.companyId && !this.form.companyName){
                this.form.companyId = value.companyId;
                this.form.companyName = value.companyName;
            }
		},
		companyChange(value) {
			this.form.companyId = value.id;
            this.form.companyName = value.name;
		},
		ownerChange(value)
		{
			this.form.ownerUser = value.id;
			this.form.ownerName = value.name;
		}
	},
}
</script>
<style scoped lang="less">
.activity-types{
	display: flex;

	.type-icon{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 30px;	
		height: 30px;
		border: 1px solid #e1e1e1;
		border-right: none;
		cursor: pointer;

		&:last-child{
			border: 1px solid #e1e1e1;
		}

		&:hover{
			background: #f7f7f7;
		}

		&.active{
			box-shadow: inset 0 0 0 1px #317ae2,0 0 0 rgba(49,122,226,0),inset 0 1px 2px rgba(49,122,226,.16);
			background: #eff5fd;
			/deep/ .anticon{
				color: #317ae2;
				fill: #317ae2;
			}
		}
	}
	/deep/ .anticon{
		font-size: 16px;
	}
}
</style>
