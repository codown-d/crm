<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lone
 * @Date: 2022-02-26 14:44:14
 * @LastEditors: Lone
 * @LastEditTime: 2022-04-08 16:08:20
-->
<template>
	<div>
		<a-select
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
			<a-select-option v-for="d in data" :key="d.value">
				{{ d.text }}
			</a-select-option>
		</a-select>
	</div>
</template>
<script>
import Service from '@/services/common.js'
export default {
	name: 'PersonSelect',
	data() {
		return {
			data: [
				{ value: 1, text: '趙' },
				{ value: 2, text: '錢' },
				{ value: 3, text: '孫' },
				{ value: 4, text: '李' },
			],
			value: undefined,
		}
	},
	methods: {
		handleSearch(value) {
			fetch(value, data => (this.data = data))
		},
		handleChange(value) {
			console.log(value)
			this.value = value
			fetch(value, data => (this.data = data))
		},
	},
}
</script>
