/*
 * @Descripttion: 新請求庫
 * @version: 
 * @Author: Lone
 * @Date: 2022.01.16 20:10
 * @LastEditors: Lone
 */

import axios from 'axios'
import { message as MSG } from 'ant-design-vue'
import router from '../router'
import { API_HOST } from '../config'

const httpRequest = axios.create();//創建實例
const Config = {
  TIMEOUT: 30000,
//   BASE_URL: process.env.NODE_ENV === 'production' ? API_HOST.PROD : API_HOST.DEV
  BASE_URL: process.env.NODE_ENV === 'development' ? API_HOST.DEV : API_HOST.PROD
}

const TOKEN_FILTER_LIST = [
  'auth/oauth/token',
  'partner/adminUser/registerUser'
]

// axios 配置
httpRequest.defaults.timeout = Config.TIMEOUT;
httpRequest.defaults.withCredentials = true;
httpRequest.defaults.baseURL = Config.BASE_URL

//請求攔截器
httpRequest.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/json'

  if (!TOKEN_FILTER_LIST.includes(config.url)) {
    config.headers['Authorization'] = sessionStorage.getItem('x-auth-token')
  }
  return config
})

httpRequest.interceptors.response
  .use(response => {
    console.log('new request')
    console.log(response)
    if (response.status === 200) {
      const { data, code, message } = response.data
      // 登陸失效
      if (['401','302',401,302].includes(code)) {
        MSG.error('登錄狀態失效，將自動返回登錄頁')
        sessionStorage.clear()
        setTimeout(() => {
          router.push({
            path:'/login',
            query:{ redirect:location.hostname }
          })
        }, 1500)
      } else if (code !== '0') {
        MSG.error(message)
        return Promise.reject(response) 
      } else {
        return data
      }
    } else {
      return Promise.reject(response)
    }
  })

const defaultParams = {
  'caller': 'crm-web',
	'requestId': 'uuid',
	'traceId': 'uuid',
}

// post 請求
export const POST = (url, params, config = {
  needDefault: true
}) => {
  return httpRequest.post(url, {
    ...(config.needDefault ? defaultParams : {}),
    ...(params ? params : {})
  })
}

// get 請求
export const GET = (url, params, config = {
  needDefault: true
}) => {
  return httpRequest.get(url, {
    ...(config.needDefault ? defaultParams : {}),
    ...(params ? params : {})
  })
}

