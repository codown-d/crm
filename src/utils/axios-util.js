/*
 * @Descripttion:
 * @version:
 * @Author: Lone
 * @Date: 2021-10-28 22:39:00
 * @LastEditors: Lone
 * @LastEditTime: 2022-04-29 10:25:28
 */

import axios from 'axios'
import { message } from 'ant-design-vue' //引入antd-vue的提示組件
import Store from '../stores/index.js'
import router from '../router'
import { API_HOST } from '../config'

// const BASE_URL = process.env.NODE_ENV === 'production' ? API_HOST.PROD : API_HOST.DEV
const BASE_URL = process.env.NODE_ENV === 'development' ? API_HOST.DEV : API_HOST.PROD

// 當需要直接調用mysales上的介面進行調試時
// let BASE_URL = process.env.NODE_ENV === 'production' ? API_HOST.PROD : API_HOST.DEV
// BASE_URL = API_HOST.PROD// 當需要直接調用mysales上的介面進行調試時

// console.log('local')
// console.log(localStorage)

const httpAxios = axios.create() //創建實例
let Config = {
	TIMEOUT: 30000,
	baseURL: {
		dev: window.BASEURL_01,
		prod: '',
	},
}
// axios 配置
httpAxios.defaults.timeout = Config.TIMEOUT
httpAxios.defaults.withCredentials = true
//  console.log('axios的配置: ', httpAxios.defaults);
//  axios.defaults.timeout = 30000;// 請求超時時間，默認5s
//  axios.defaults.withCredentials = true;

//請求攔截器
httpAxios.interceptors.request.use(
	config => {
		// console.log('===============================', config);
		//根絕參數判斷，然後設置不同的Content-Type
		if (~config.url.indexOf('linemessage/sendMessage') || ~config.url.indexOf('api/filestorage/file/upload')) {
			//如果是line 发送消息接口
            // console.log('特别处理的form-data接口');
			config.headers['Content-Type'] = 'multipart/form-data'
		} else if (~config.url.indexOf('filestorage/file/download')) {// 下載文件，特別處理
			config.responseType = 'blob'
            // config.headers['Content-Type'] = 'application/force-download'
        } else {
			config.headers['Content-Type'] = 'application/json'
		}

		//添加token
		if (~config.url.indexOf('auth/oauth/token') || ~config.url.indexOf('partner/adminUser/registerUser')) {
			//當註冊登錄時不添加token，不進行其他操作
			return config
		} else if (Store.state.user.token) {
			// config.headers['Authorization'] = Store.state.user.token;
			config.headers['Authorization'] = sessionStorage.getItem('x-auth-token') || Store.state.user.token
		} else {
			// util.console('1111111111111用戶主動退出,已沒有token');
			// // util.console(config, '第三種情況，沒有獲取到token');
			// message.error('登錄狀態失效，將自動返回登錄頁');
			// setTimeout(() => {
			//     router.push({
			//         path:'/login',
			//     })
			// }, 1500)
		}
		return config
	},
	error => {
		return Promise.reject(error.response)
	},
)

//回應攔截器
httpAxios.interceptors.response.use(
	function (response) {
		// console.log('相應攔截器', response);
		if (['401', '302', 401, 302].includes(response.data.code) && response.status == 200) {
			message.error('登錄狀態失效，將自動返回登錄頁')
			sessionStorage.clear()
			setTimeout(() => {
				router.push({
					path: '/login',
					query: { redirect: location.hostname },
				})
			}, 1500)
		}
		return response
	},
	function (error) {
		// Do something with response error
		message.error('網路請求失敗')
		return Promise.reject(error)
	},
)

//基底位址
//let base = 'http://localhost:8080/api/';
//  let base = 'http://3.139.251.163:9230/';
// let base = 'http://52.221.25.56:9230/api/';
let base = 'http://localhost:8080/api/'
base = process.env.NODE_ENV === 'production' ? 'http://52.221.25.56:9230/' : 'http://localhost:8080/api/'
//base = process.env.NODE_ENV === 'production' ? 'http://localhost:8085/' : 'http://localhost:8080/api/'
// console.log('axios-util 的列印的判斷當前環境： ',  process.env.NODE_ENV, base);
// base = 'http://52.221.25.56:9230/';
//通用方法
export const POST = (url, params) => {
	// base = 'https://www.mysales.com.tw/'
	// if (process.env.NODE_ENV === 'production') base = 'https://www.mysales.com.tw/'
	return httpAxios.post(`${BASE_URL}${url}`, params).then(res => res.data)
}

export const LINE_POST = (url, params) => {
	// base = 'http://localhost:8080/lineApi/'
	// base = 'api/'
	// if (process.env.NODE_ENV === 'production') base = 'https://www.mysales.com.tw/'
    // if (process.env.NODE_ENV === 'production') base = 'https://www.mysales.com.tw/'
	return httpAxios.post(`${BASE_URL}${url}`, params).then(res => res.data)
}

export const FILE_POST = (url, params) => {
	// base = 'http://localhost:8080/fileApi/'
	// if (process.env.NODE_ENV === 'production') base = 'https://www.mysales.com.tw/'
	return httpAxios.post(`${BASE_URL}${url}`, params).then(res => res.data)
}

export const TEST_POST = (url, params) => {
	base = 'http://localhost:8080/testApi/'
	if (process.env.NODE_ENV === 'production') base = 'https://www.mysales.com.tw/'
	return httpAxios.post(`${BASE_URL}${url}`, params).then(res => res.data)
}

export const GET = (url, params) => {
	return httpAxios.get(`${BASE_URL}${url}`, { params: params }).then(res => res.data)
}

export const PUT = (url, params) => {
	return httpAxios.put(`${BASE_URL}${url}`, params).then(res => res.data)
}

export const DELETE = (url, params) => {
	return httpAxios.delete(`${BASE_URL}${url}`, { params: params }).then(res => res.data)
}

export const PATCH = (url, params) => {
	return httpAxios.patch(`${BASE_URL}${url}`, params).then(res => res.data)
}

export default {
	POST,
	TEST_POST,
	LINE_POST,
    FILE_POST,
    GET
}
