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
			<a-form-model-item label="活動名稱" prop="name">
				<a-input placeholder="請輸入活動名稱" v-model="form.name" />
			</a-form-model-item>
			<a-form-model-item label="活動日期" prop="time">
				<a-range-picker v-model="form.time" :placeholder="['開始日期', '結束日期']" style="width: 100%" show-time />
			</a-form-model-item>

			<a-form-model-item label="活動描述" prop="publicDescription">
				<a-textarea
					v-model="form.publicDescription"
					placeholder="請輸入活動描述"
					:auto-size="{ minRows: 2, maxRows: 6 }"
				/>
			</a-form-model-item>
			<a-form-model-item label="活動關聯" prop="customerId">
				<a-select
					mode="multiple"
					v-model="form.customerId"
					autoFocus
					show-search
					:value="value"
					placeholder="請選擇聯絡人名稱"
					:default-active-first-option="false"
					style="width: 100%"
					:show-arrow="false"
					:filter-option="false"
					:not-found-content="null"
					@search="handleSearch"
					@change="handleChange"
				>
					<a-select-option v-for="d in data" :key="d.id">
						{{ d.name }}
					</a-select-option>
				</a-select>

				<a-input placeholder="請輸入組織預留位置" v-model="form.companyId" />
			</a-form-model-item>
		</a-form-model>
	</div>
</template>
<script>
import Services from '@/services/common.js'
export default {
	name: 'activeForm',
	data() {
		return {
			form: {},
			formItemLayout: { labelCol: { span: 4 }, wrapperCol: { span: 18 } },
			rules: {
				name: [{ required: true, message: '請輸入活動名稱', trigger: 'blur' }],
				time: [{ required: true, message: '請輸入活動日期', trigger: 'change' }],
				activityParticipants: [{ required: true, message: '請選擇人物設置', trigger: 'blur' }],
				location: [{ required: true, message: '請輸入地點設置', trigger: 'blur' }],
				publicDescription: [{ required: true, message: '請輸入活動描述', trigger: 'blur' }],
			},
			//人員
			data: [],
			value: undefined,

			//組織
			company: [],
			companyValue: undefined,
			
		}
	},
	props: {
		formData: {
			type: Object,
			default: () => {},
		},
	},
	watch: {
		formData: {
			immediate: true,
			handler(val) {
				this.form = val
			},
		},
	},
	methods: {
		validate() {
			return new Promise(resolve => {
				this.$refs.form.validate(valid => {
					if (valid) resolve(true)
					resolve(false)
				})
			})
		},
		getFormVal() {
			// this.validate()
			return this.form
		},
		setFormVal(obj) {
			this.form = Object.assign({}, obj)
		},
		resetForm() {
			this.$refs.form.resetFields()
		},

		//人員
		async selectFetch(value) {
			const params = {
				pageNum: 1,
				pageSize: 10,
				param: { name: value },
			}
			const {
				data: { list = [] },
			} = await Services.searchPersonList(params)
			this.data = list
		},

		handleSearch(value) {
			this.selectFetch(value)
		},
		handleChange(value) {

		},
	},
}
</script>
<style scoped lang="less"></style>
