/*
 * @Author: your name
 * @Date: 2021-09-14 21:32:53
 * @LastEditTime: 2022-05-04 14:59:44
 * @LastEditors: Lone
 * @Description: In User Settings Edit
 * @FilePath: \crm-gmail\src\main.js
 */
import Vue from 'vue'
import Antd from 'ant-design-vue'
import App from './App.vue'
import router from './router'
import Store from './stores'
import axios from 'axios'
import line from '@line/bot-sdk'
import Api from './services/api'
import Util from './utils/util' ///引入工具类
import { message } from 'ant-design-vue'
import i18n from './lang';
import VueCloneya from 'vue-cloneya'
import vuetify from '@/plugins/vuetify' // path to vuetify export

//引入antdv样式
import 'ant-design-vue/dist/antd.less'
import './assets/common.css'
import './assets/custom-antdv.css'

import VueHtml5Editor from 'vue-html5-editor'
import editorOptions from './editorOptions'

Vue.use(VueCloneya)

Vue.config.productionTip = false
Vue.use(Antd)
Vue.use(Api) //调用方式 this.$api.mail.XXX
Vue.use(Util)

Vue.use(Store) //注入vuex全局

Vue.use(VueHtml5Editor, editorOptions);

Vue.prototype.$message = message;//注入全局属性$message
message.config({
	duration: 3, // 持续时间
	// top:`100px`, // 到页面顶部距离
	maxCount: 1, // 最大显示数, 超过限制时，最早的消息会被自动关闭
})

import moment from 'moment' //引入 antdv 自带的momentjs
Vue.prototype.$moment = moment //挂在到vue原型上

import lodash from 'lodash' //引入lodash ,JS數據操作庫
Vue.prototype.$lodash = lodash

import { Base64 } from 'js-base64'
Vue.prototype.$Base64 = Base64 //引入的Base64

import * as MimeCodec from 'emailjs-mime-codec'
Vue.prototype.$MimeCodec = MimeCodec //引入的emailjs-mime-codec,guthub: https://github.com/emailjs/emailjs-mime-codec

Vue.prototype.$axios = axios
Vue.prototype.$line = line

// 从接口获取到GCP配置，并初始化Google OAuth客户端
import VueGapi from 'vue-gapi' //引入vue-gapi, 配置Gmail oauth 2.0客户端, 文档： https://github.com/vue-gapi/vue-gapi/tree/releases/v1
const getGCPResult = async()=> {
    const res = await Api.common.queryDicByKey({ dictKey: 'gcp' });
    if (!res.success) return message.error('初始化Google Auth客戶端失敗!');
    let result = {};
    res.data.list.map(item => { result[item.code] = item.value });
    let { client_id, api_key } = result;
    Vue.use(VueGapi, {
        apiKey: api_key,
        clientId: client_id,
        discoveryDocs: [
            'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
            // 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
        ], //这个gmail、calendar的文档连接是试出来的，不排除有最新的
        // scope: 'https://www.googleapis.com/auth/gmail.addons.current.action.compose https://www.googleapis.com/auth/gmail.addons.current.message.action', //访问接口的权限，必须字符串，用空格连接
        // scope: 'https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/calendar', //访问接口的权限，必须字符串，用空格连接
        scope: 'https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.labels https://www.googleapis.com/auth/gmail.send',//访问接口的权限，必须字符串，用空格连接
        access_type: 'offline',
        prompt: 'consent',
        refreshToken: true
    })
};
getGCPResult();

// 按需引入echarts，echarts 5.0以上版本的按需引入
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'
// import ECharts modules manually to reduce bundle size
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, FunnelChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, TitleComponent, ToolboxComponent, LegendComponent } from 'echarts/components'
use([
	CanvasRenderer,
	BarChart,
	GridComponent,
	FunnelChart, // 以下為漏斗圖所需
	TooltipComponent,
	TitleComponent,
	ToolboxComponent,
	LegendComponent,
])
// register globally (or you can do it locally)
Vue.component('v-chart', ECharts)

new Vue({
    router,
    i18n,
    vuetify,
    render: (h) => h(App),
}).$mount('#app')


