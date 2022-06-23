<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lone
 * @Date: 2021-11-07 21:29:42
 * @LastEditors: Lone
 * @LastEditTime: 2022-05-08 17:02:35
-->
<template>
	<div class="myButton">
		<div v-if="isLink">
			<a-button type="link" class="myButton-link" @click="onClickMyBtn" :disabled="disabled">{{ text }}</a-button>
		</div>
		<div v-else>
			<a-button
				v-if="isExpandBtn"
				style="padding: 0 7px"
				:class="{
					'myButton-default cursor-pointer flex-center lineheight-1 bold-text': true,
					'orange': theme == 'orange',
					'round-btn': isRound,
                    'orange-icon-btn': iconTheme == 'orange'
				}"
                :disabled="disabled"
                @click="onClickMyBtn"
			>
				<ExpandIcon v-if="!isExpand" style="font-size: 16px;font-weight: 600"/>
				<UnExpandIcon v-else style="font-size: 16px;font-weight: 600"/>
			</a-button>
			<a-button
				:class="{
					'myButton-default cursor-pointer flex-center lineheight-1': true,
					'orange': theme == 'orange',
					'round-btn': isRound,
                    'orange-icon-btn': iconTheme == 'orange'
				}"
				:icon="icon"
				v-else
                :disabled="disabled"
				:loading="loading"
				@click="onClickMyBtn"
			>
				{{ isIconBtn ? '' : text }}
			</a-button>
		</div>
	</div>
</template>
<script>
const ExpandSvg = {
	template: `
    <svg t="1648275276174" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5454" width="200" height="200"><path d="M454.464 143.68l-253.44 253.44c-12.032 12.032-12.032 31.36 0 43.392 11.968 11.968 31.36 11.968 43.328 0l237.376-237.376 237.376 237.376c11.968 11.968 31.36 11.968 43.328 0 12.032-12.032 12.032-31.36 0-43.392l-253.44-253.44C491.264 126.016 478.016 124.032 454.464 143.68zM507.968 947.648l252.48-253.376c11.968-11.968 11.968-31.36 0-43.392-11.968-11.968-31.296-11.968-43.264 0l-236.48 237.376L244.16 650.88c-11.968-11.968-31.296-11.968-43.264 0-11.968 12.032-11.968 31.424 0 43.392l252.48 253.376C465.984 960 491.136 964.48 507.968 947.648z" p-id="5455"></path></svg>
  `,
}

const ExpandIcon = {
	template: `
    <a-icon :component="ExpandSvg" />
  `,
	data() {
		return {
			ExpandSvg,
		}
	},
}

const UnExpandSvg = {
	template: `
   <svg t="1648276305035" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5589" width="200" height="200" ><path d="M536.832 401.344C535.552 403.648 534.4 406.016 532.48 408 526.208 414.272 517.952 416.832 509.696 416.512 501.504 416.832 493.248 414.272 486.976 408 485.056 406.016 483.904 403.648 482.56 401.344L230.016 147.84C218.048 135.872 218.048 116.48 230.016 104.512 241.92 92.544 261.312 92.544 273.216 104.512L509.696 341.824 746.24 104.512C758.144 92.544 777.536 92.544 789.44 104.512 801.408 116.48 801.408 135.872 789.44 147.84L536.832 401.344ZM483.52 621.248C484.864 618.944 485.952 616.576 487.936 614.592 494.208 608.32 502.464 605.76 510.72 606.08 518.976 605.76 527.232 608.32 533.504 614.592 535.488 616.576 536.576 618.944 537.92 621.248L791.424 874.752C803.392 886.72 803.392 906.112 791.424 918.08 779.456 930.048 760.064 930.048 748.096 918.08L510.72 680.768 273.344 918.08C261.376 930.048 241.984 930.048 230.016 918.08 218.048 906.112 218.048 886.72 230.016 874.752L483.52 621.248Z" p-id="5590"></path></svg>
  `,
}

const UnExpandIcon = {
	template: `
    <a-icon :component="UnExpandSvg" />
  `,
	data() {
		return {
			UnExpandSvg,
		}
	},
}

export default {
	components: {
		ExpandIcon,
		UnExpandIcon,
	},
	props: {
		isExpandBtn: {
			type: Boolean,
			default: false,
		},
		isExpand: {
			type: Boolean,
			default: false,
		},
		type: {
			type: String,
			default: 'default',
		},
		isIconBtn: {
			type: Boolean,
			default: false,
		},
		icon: {
			type: String,
			default: undefined,
		},
		text: {
			type: String,
			default: '按钮',
		},
		size: {
			type: String,
			default: 'large',
		},
		width: {
			type: Number,
			default: 60,
		},
		isLink: {
			type: Boolean,
			default: false,
		},
		theme: {
			type: String,
			default: null,
		},
        iconTheme: {
            type: String,
			default: null,
        },
		isRound: {
			type: [String, Boolean],
			default: false,
		},
		loading: {
			type: Boolean,
			default: false,
		},
        disabled: {
            type: Boolean,
			default: false,
        }
	},
	data() {
		return {}
	},
	mounted() {
		//
	},
	methods: {
		onClickMyBtn() {
			this.$emit('click')
		},
	},
}
</script>

<style lang="less">
.myButton {
	&-default {
		// .myButton-default
		background: #fff;
		border: 0;
		border-radius: 2px;
		margin: 0;
		position: relative;
		box-sizing: border-box;
		text-decoration: none;
		color: #26292c;
		transition: background 0.12s ease-in-out;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		border: 1px solid #e5e5e5;
		padding: 0 12px;
		font-weight: 500;
		&:hover,
		&:focus,
		&:active {
			// .myButton-default:hover, .myButton-default:focus, .myButton-default:active
			background: #f7f7f7 !important;
			border: 1px solid #e5e5e5 !important;
			color: #26292c !important;
		}
	}

	&-link {
		// .myButton-link
		padding: 0px !important;
		border-radius: 0px !important;
		/* fix: 下劃線的距離 */
		color: #26292c !important;
		margin: 0px 3px;
		&:hover,
		&:focus,
		&:active {
			// .myButton-link:hover, .myButton-link:focus, .myButton-link:active
			color: #40a9ff !important;
			background-color: transparent !important;
			border-bottom: 1px solid #40a9ff !important;
		}
	}

	.orange {
		// .orange
		background: #f97358;
		color: #fff;
		border: 1px solid #e5e5e5;
		padding: 0 20px;
		width: 100%;
		&:hover,
		&:focus,
		&:active {
			background: #f9735899 !important;
			color: #fff !important;
		}
	}

    .orange-icon-btn {
        background: #f97358;
		color: #fff;
		border: 1px solid #e5e5e5;
		&:hover,
		&:focus,
		&:active {
			background: #f9735899 !important;
			color: #fff !important;
		}
    }

	.round-btn {
		border-radius: 16px;
	}
}

.cursor-pointer {
	cursor: pointer;
}
</style>
