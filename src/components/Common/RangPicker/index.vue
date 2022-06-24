<template>
	<div class="crm-rang-picker">
		<input type="text" :id="id" />
		<div :id="id + 'container'"></div>
	</div>
</template>
<script>
var Pikaday = require('pikaday')

export default {
	name: 'RangPicker',
	props: {},
	data() {
		return {
			id: this.$util.generateUUID(),
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
