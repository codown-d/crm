<template>
	<div class="crm-time-picker">
		<a-dropdown :trigger="['click']">
			<a @click.prevent style="text-decoration: none;height:32px;display: inline-block;">
				<a-input v-model:value="value" placeholder="h:mm PM" allowClear />
			</a>
			<a-menu
				slot="overlay"
				@click="menuClick"
				:selectedKeys="[value]"
				style="height: 200px; overflow-y: overlay"
			>
				<template v-for="item in menuList">
					<a-menu-item :key="item.key">
						{{ item.key }}
					</a-menu-item>
				</template>
			</a-menu>
		</a-dropdown>
	</div>
</template>
<script>
var Moment = require('moment')
import { timeData } from '@/utils/util'
export default {
	name: 'TimePicker',
	props: {
		timeList: {
			type: Array,
			default: function () {
				return timeData
			},
		},
		defaultValue: {
			type: String,
			default: function () {
				return timeData[0].key
			},
		},
	},
	data() {
		return {
			menuList: this.timeList,
			id: this.$util.generateUUID(),
			value: '',
		}
	},
	mounted() {},
	watch: {
		defaultValue(val, oldVal) {
			console.log(val)
			this.value = val
		},
		timeList(val, oldVal) {
			this.menuList = val
		},
	},
	methods: {
		menuClick(item) {
			this.value = item.key
			this.$emit('onChange', item.key)
		},
	},
}
</script>
<style lang="less">
.crm-time-picker {
	input {
		background: #fff;
		padding-left: 8px;
		border: 1px solid rgb(203, 204, 205);
		box-shadow: inset 0 1px 2px #26292c14;
		border-radius: 4px;
		box-sizing: border-box;
		color: #26292c;
		display: block;
		font: inherit;
		height: 32px;
		width: 100%;
		&:focus {
			border-color: #f5222d;
			outline: none;
		}
	}
}
</style>
