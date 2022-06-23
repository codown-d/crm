<template>
	<div class="salesStage ant-radio-group ant-radio-group-default">
		<label
			:class="['ant-radio-wrapper', salesStageIndex >= index ? 'active' : '']"
			v-for="(item, index) in flowStepList"
			:title="item.name"
			:key="index"
			@click="salesStageIdChange(item, index)"
		></label>
	</div>
</template>
<script>
export default {
	name: 'Step',
	props: {
		salesStageId: {
			type: Number,
			default: () => 0,
		},
		data: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			salesStageIndex: 0,
			flowStepList: [],
		}
	},
	watch: {
		data: {
			immediate: true,
			handler(val, oldVal) {
				this.flowStepList = val
			},
		},
		salesStageId: {
			immediate: true,
			handler(val, oldVal) {
				const array = [...this.flowStepList]

				const index = array.findIndex(item => item.salesStageId == val)

				this.salesStageIndex = index
			},
		},
	},
	methods: {
		salesStageIdChange(item, index) {
			this.$emit('updataStage', item.id)
			// this.$router.push('/transaction')
		},
	},
}
</script>
<style>
.salesStage.ant-radio-group {
	display: flex;
	flex-direction: row;
}
.salesStage .ant-radio-wrapper {
	background: #dddddd;
	height: 10px;
	overflow: hidden;
	width: auto;
	flex: 1;
	margin-right: 5px;
}
.salesStage .ant-radio-wrapper.active {
	background: orange;
}
</style>
