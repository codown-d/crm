/*
 * @Author: your name
 * @Date: 2021-09-28 21:56:38
 * @LastEditTime: 2022-05-03 22:24:00
 * @LastEditors: Lone
 * @Description: In User Settings Edit
 * @FilePath: \crm\src\stores\tags\index.js
 */
import Api from '@/services/api'
import { message } from 'ant-design-vue'

const state = {
	userData: [
		{
			key: 0,
			username: 'Administrator',
			password: '1234',
		},
		{
			key: 1,
			username: 'user1',
			password: '1234',
		},
		{
			key: 2,
			username: 'test1',
			password: '123456',
		},
		{
			key: 2,
			username: 'admin',
			password: 'admin',
		},
	],
	currentUser: {},
	token: sessionStorage.getItem('x-auth-token') || '',
	userInfo: JSON.parse(sessionStorage.getItem('userInfo')) || '',
	permissions: JSON.parse(sessionStorage.getItem('permissions')) || [],
	permissionsList: {
		deal: {
			updateDetail: 'businessDeal_updateDetail', // 修改商機交易資訊
			delete: 'businessDeal_delete', // 刪除商機交易
			add: 'businessDeal_add' // 新增商機交易
		},
		personal: {
			updateCompany: 'userManage_updateCompany', // 編輯公司設置
			queryUserList: 'userManage_queryUserList', // 查詢公司使用者列表
			addUser: 'userManage_addUser', // 添加公司使用者
			queryRoleList: 'userManage_queryRoleList', // 許可權集查詢
			updateRoleDetail: 'userManage_updateRoleDetail', // 編輯權限群組
			updateUserRole: 'userManage_updateUserRole' // 編輯使用者角色
		},
		mail: {
			syn: 'emailManage_syn', // 電子郵件同步
			send: 'emailManage_send' // 發送電子郵件
		},
		activity: {
			updateDetail: 'activityManage_updateDetail', // 編輯活動資訊
			delete: 'activityManage_delete', // 刪除活動資訊
		},
		customManage: {
			updateDetail: 'customerManage_updateDetail', // 修改客戶資訊
			delete: 'customerManage_delete', // 刪除客戶資訊
			add: 'customerManage_add', // 新增客戶資訊
		},
		companyManage: {
			updateDetail: 'companyManage_updateDetail', // 修改公司組織資訊
			delete: 'companyManage_delete', // 刪除公司組織資訊
			add: 'companyManage_add' // 新增公司組織資訊
		},
		lineManage: {
			send: 'lineManage_send', // 發送即時通訊資訊
		}
	},
	menu: [],
    gcp: null,
}

const getters = {
	getUserData: state => {
		let userData = state.userData
		userData = userData.filter(item => {
			return item.completed == false
		})
		return userData
	},
	getApiData: state => {
		let apiData = state.apiData.push({
			id: '1',
			name: '資料',
		})
		console.log('store --- apiData----', apiData)
		return state.apiData
	},
}

const mutations = {
    SET_GCP_DATA: (state, data) => {
        state.gcp = data;
    },
	SET_USER_INFO: (state, data) => {
		state.userInfo = data
	},
	SET_TOKEN: (state, token) => {
		state.token = token
	},
	SET_MENU: (state, menu) => {
		state.menu = menu
	},
	SET_PERMISSIONS: (state, permissions) => {
		state.permissions = permissions;
	},
	//取得userData
	GET_CURRENT_USER(state, data) {
		console.log('到GET_CURRENT_USER', data)
		let userData = state.userData
		console.log('state.userData length', userData.length + 1)
		userData = userData.filter(item => {
			return item.username == data.username && item.password == data.password
		})
		console.log('userData', userData)
		state.currentUser = userData
		sessionStorage.setItem('currentUser', JSON.stringify(userData))
		console.log('currentUser', state.currentUser)
	},
	//新增使用者
	ADD_USER_DATA(state, data) {
		console.log('到ADD_USER_DATA', data)
		let userData = state.userData
		console.log('state.userData length', userData.length + 1)
		data.key = userData.length
		state.userData.push(data)
	},
	//修改使用者
	EDIT_USER_DATA(state, data) {
		let userData = state.userData
		userData.forEach(item => {
			if (item.key == data.key) {
				item.password = data.confirm_password
			}
		})
		console.log('EDIT_USER_DATA state', state.userData)
		console.log('EDIT_USER_DATA data', data)
		console.log('userData userData', userData)
	},
	//刪除使用者
	DEL_USER_DATA(state, key) {
		state.userData = state.userData.filter(item => {
			return item.key != key
		})
	},
}

const actions = {
	// 用戶登入
	login({ commit }, userInfo) {
		const { username, password } = userInfo
		return new Promise((resolve, reject) => {
			Api.user
				.login({
					username: username.trim(),
					password: password,
					grant_type: 'password',
					client_id: 'client-pc',
					client_secret: '123456',
				})
				.then(res => {
					const { data } = res
					let token = `${data.tokenHead}${data.token}`
					commit('SET_TOKEN', token)
					resolve()
				})
				.catch(error => {
					reject(error)
				})
		})
	},
	logout({ commit }) {
		// 退出登入時，清除token
		sessionStorage.removeItem('x-auth-token')
		commit('SET_TOKEN', '')

		// 退出登入時，清除userInfo
		sessionStorage.removeItem('userInfo')
		commit('SET_USER_INFO', '')
	},
	// 獲取使用者登入資訊
	queryUserInfo({ commit }) {
		return new Promise((resolve, reject) => {
			Api.user.queryLoginUserInfo().then(res => {
				if (res.code != 0) return message.error(res.message || '獲取用戶資訊失敗'), resolve(false)
				const { data } = res
				commit('SET_USER_INFO', data)
				commit('SET_PERMISSIONS', data.roleDetailVos)
				sessionStorage.setItem('userInfo', JSON.stringify(data))
				sessionStorage.setItem('permissions', JSON.stringify(data.roleDetailVos))
				resolve(true)
			})
			.catch(error => {
				console.log(error);
				message.error('獲取用戶資訊失敗！')
				reject()
			})
		})
	},
	//取得userData
	getCurrentUser({ commit }, data) {
		console.log('user/getCurrentUser', data)
		return new Promise((resolve, reject) => {
			commit('GET_CURRENT_USER', data)
			resolve(true)
		})
	},
	//新增行程
	addUserData({ commit }, data) {
		console.log('activity/addUserData', data)
		return new Promise((resolve, reject) => {
			commit('ADD_USER_DATA', data)
			resolve(true)
		})
	},
	//修改行程
	async editUserData({ commit }, data) {
		//key 為就的tagTitle，data為新的tagTitle
		console.log('到修改行程的UserData', data)
		return new Promise((resolve, reject) => {
			commit('EDIT_USER_DATA', data)
			resolve(true)
		})
	},
	//刪除行程
	async delUserData({ commit }, obj) {
		//console.log("obj--key--",obj.key)
		return new Promise((resolve, reject) => {
			commit('DEL_USER_DATA', obj.key)
			resolve(true)
		})
	},
	//獲取菜單
	async menuDatafetch({ commit }, params) {
		return new Promise((resolve, reject) => {
			commit('SET_MENU', '菜單list')
			resolve(true)
		})
	}
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
}
