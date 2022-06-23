<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lone
 * @Date: 2022-01-14 22:43:25
 * @LastEditors: Lone
 * @LastEditTime: 2022-03-12 12:52:04
-->
<template>
	<div>
		<a-select
			autoFocus
			show-search
			:value="value"
			placeholder="請輸入聯絡人名稱進行搜索"
			:default-active-first-option="false"
			style="width: 100%"
			:show-arrow="false"
			allowClear
			:filter-option="false"
			:not-found-content="null"
			@search="fetchUser"
			@change="handleChange"
		>
			<a-select-option v-for="d in fetchUserData" :key="d.id">
				{{ d.name }}
			</a-select-option>
		</a-select>
	</div>
</template>
<script>
import Service from '@/services/common.js'
import debounce from 'lodash/debounce'
export default {
	name: 'PersonSelect',
	props: {
		show: {
			type: Boolean,
			default: false,
		},
		mail: {
			type: String,
			default: null,
		},
		lineUserId: {
			type: String,
			default: null,
		},
	},
	data() {
		this.lastFetchId = 0
		this.fetchUser = debounce(this.fetchUser, 800)
		return {
			data: [
				// { value: 1, text: '趙' },
				// { value: 2, text: '錢' },
				// { value: 3, text: '孫' },
				// { value: 4, text: '李' },
			],
			value: undefined,
			fetchUserData: [],
		}
	},
	watch: {
		show: {
			immediate: true,
			deep: true,
			handler(newValue, oldValue) {
				if (newValue != oldValue && newValue) this.value == undefined
			},
		},
		// value: {
		//     immediate: true,
		//     deep: true,
		//     handler(newValue, oldValue) {
		//         // if (newValue != oldValue && newValue) this.value == undefined;
		//         console.log("value===", newValue, oldValue);
		//     },
		// },
	},
	methods: {
		handleChange(value) {
			// console.log(value);
			if (!this.mail && !this.lineUserId) return this.$message.warning('無效數據，綁定失敗！', 2)
			if (this.mail && this.mail.length) return this.bindCustomerByEmail(value);
            if (this.lineUserId && this.lineUserId.length) return this.bindCustomerByChannel(value);
		},
		bindCustomerByEmail(value) {
			this.$api.customer
				.bindCustomerByEmail({
					customerId: value,
					email: this.mail,
				})
				.then(res => {
					if (!res.success) return this.$message.error(res.message || '綁定用戶失敗')
					this.$emit('onSuccess')
				})
		},
        bindCustomerByChannel(value) {
            this.$api.customer
				.bindCustomerByChannel({
					customerId: value,
					channelUserId: this.lineUserId,
				})
				.then(res => {
					if (!res.success) return this.$message.error(res.message || '綁定用戶失敗')
					this.$emit('onSuccess')
				})
        },
		fetchUser(value) {
			this.lastFetchId += 1
			const fetchId = this.lastFetchId
			// this.data = []
			this.fetching = true
			if (!value || !value.length) return
			let params = {
				name: value,
				page: {
					currentPage: 1,
					pageSize: 100,
				},
			}
			this.$api.customer.getCustomerList(params).then(res => {
				if (fetchId !== this.lastFetchId) {
					// for fetch callback order
					return
				}
				if (!res.success) return this.$message.error(res.message || '查詢失敗')
				this.fetching = false
				this.fetchUserData = res.data.totalCount ? res.data.list : []
				// this.$util.console(res, "遠端查詢客戶的結果");
			})
		},
	},
}
</script>
