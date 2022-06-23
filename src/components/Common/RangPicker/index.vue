<template>
	<div class="crm-rang-picker">
		<input type="text" :id="id" />
		<div :id="id + 'container'"></div>
	</div>
</template>
<script>
var Pikaday = require('pikaday')
function generateUUID() {
	var d = new Date().getTime()
	if (window.performance && typeof window.performance.now === 'function') {
		d += performance.now() //use high-precision timer if available
	}
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = (d + Math.random() * 16) % 16 | 0
		d = Math.floor(d / 16)
		return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
	})
	return uuid
}
export default {
	name: 'RangPicker',
	props: {},
	data() {
		return {
			id: generateUUID(),
		}
	},
	mounted() {
		let field = document.getElementById(this.id)
		var picker = new Pikaday({
			field,
			container: document.getElementById(this.id + 'container'),
			onOpen: e => {
				let el = $('<span class="picker-today">今天</span>').click(() => {
					picker.setMoment(this.$moment())
				})
				$(picker.el).find('.pika-lendar').append(el)
			},
		})
	},
	watch: {},
	methods: {},
}
</script>
<style lang="less">
.crm-rang-picker {
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
	.picker-today {
		cursor: pointer;
		float: right;
		padding: 2px 7px;
		color: #317ae2;
		height: 28px;
		line-height: 26px;
		border-radius: 4px;
		&:hover {
			background: rgba(0, 0, 0, 0.1);
		}
	}
}
</style>
