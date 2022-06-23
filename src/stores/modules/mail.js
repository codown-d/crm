/*
 * @Descripttion:
 * @version:
 * @Author: Lone
 * @Date: 2021-10-22 20:46:03
 * @LastEditors: Lone
 * @LastEditTime: 2022-03-14 20:44:50
 */
import Vue from 'vue'
import Api from '@/services/api'
import { message } from 'ant-design-vue'

// console.log('stores mail 模組中引入的Api: ', Api);

const state = {
	fromData: {
		from: '', //儲存從哪裡跳轉到郵件詳情頁， inbox 、sent
		page: 1, //儲存 從哪裡跳轉來的 頁碼，inbox 第幾頁
	},
	inboxList: [], //收件夾列表
	inboxCount: 0, //收件夾郵件總數量
	sentList: [], // 寄件備份列表
	sentCount: 0, //寄件備份數量
	currentSyncMailId: -1, //當前同步所同步郵箱的ID
	currentSyncMail: null, //當前所同步郵箱的全部資訊
	isMailSyncing: true, //是否有郵件正在同步
	newMailCount: 0,
	folderList: [], //folderType: 1收件夾、2sent 寄件夾、3drafts 草稿箱
	// modelData: ['測試一','測試二','測試三','測試四','測試四','測試四','測試四','測試四','測試四'],
	modelData: [
		{
			id: 0,
			title: '測試一',
			type: 1,
			subject: '測試一的主題',
			content: '測試一的正文',
		},
		{
			id: 1,
			title: '測試二',
			type: 2,
			subject: '測試二的主題',
			content: '測試二的正文',
		},
	],
	mailPath: '',
	composeMail: [], // 存儲、發送郵件卡片，填寫的所有的收件人的地址
}

const getters = {}

const mutations = {
	SET_COMPOSE_MAIL(state, data) {
		state.composeMail = data
	},
	SET_MAIL_PATH(state, data) {
		state.mailPath = data
	},
	SET_DETAIL_FROM(state, data) {
		state.fromData.from = data.from
		state.fromData.page = data.page
	},
	SET_MAIL_STATUS(state, data) {
		//更改郵件狀態， 已讀、未讀
		state.inboxList.forEach(item => {
			if (item.id == data.id) {
				item.flags = data.flags
			}
		})
	},
	SET_NEW_MAIL_COUNT(state, data) {
		state.newMailCount = data
	},
	SET_FOLDER_LIST(state, data) {
		state.folderList = data
	},
	//同步相關
	SET_CURRENT_SYNC_MAIL(state, data) {
		//存儲用戶所綁定的所有郵件數據
		state.currentSyncMail = data
	},
	SET_CURRENT_SYNC_MAILID(state, data) {
		state.currentSyncMailId = data
	},
	SET_IS_MAIL_ACTIVE(state, data) {
		//設置是否有郵件正在同步
		state.isMailSyncing = data
	},
	//收件夾
	SET_INBOX_LIST(state, data) {
		//存儲收件夾數據，//todo: 後面改為SET_INBOX_LIST
		state.inboxList = data
	},
	SET_INBOX_COUNT(state, data) {
		state.inboxCount = data
	},
	//寄件夾
	SET_SENT_LIST(state, data) {
		//存儲寄件夾數據
		state.sentList = data
	},
	SET_SENT_COUNT(state, data) {
		//存儲收件夾數量
		state.sentCount = data
	},
	DEL_MODEL(state, id) {
		state.modelData = state.modelData.filter(item => {
			return item.id != id
		})
	},
	ADD_MODEL(state, data) {
		// console.log('到ADD_TAG', data);
		data.id = state.modelData.length
		state.modelData.push(data)
	},
	EDIT_MODEL(state, [id, data]) {
		// console.log('修改範本',id, data);
		state.modelData.forEach((item, index) => {
			if (item.id == id) {
				//以下解決 這裡更改後，對應元件computed不更新的問題
				Vue.set(state.modelData, index, data)
				console.log('修改後的範本1:', item)
			}
		})
		// Vue.$set()
	},
}

const actions = {
	getFolderList({ commit }, params) {
		return new Promise((resolve, reject) => {
			Api.mail.getFolderList(params).then(res => {
				// console.log('getFolderList請求回來的數據為：', res);
				if (res.code != 0) {
					resolve(false)
					message.error('請求郵件檔夾列表失敗')
				} else {
					resolve(res.data.data)
					// message.success('請求成功');
					commit('SET_FOLDER_LIST', res.data.data)
					// commit('SET_INBOX_COUNT', res.data.total);
				}
			})
		})
	},
	getMessageList({ commit }, [params, type]) {
		//根據參數來 進行不同檔夾的請求。
		return new Promise((resolve, reject) => {
			Api.mail.getMessageList(params).then(res => {
				// console.log('getMessageList請求回來的數據為：', res);
				if (res.code != 0) {
					resolve(false)
					message.error('請求列表失敗')
				} else {
					resolve(res.data)
					// message.success('請求成功');
					if (type == 1) {
						commit('SET_INBOX_LIST', res.data.list)
						commit('SET_INBOX_COUNT', res.data.totalCount)
					} else if (type == 4) {
						commit('SET_SENT_LIST', res.data.list)
						commit('SET_SENT_COUNT', res.data.totalCount)
					}
				}
			})
		})
	},
	getMailAccountList({ commit }) {
		return new Promise((resolve, reject) => {
			Api.mail
				.getAccountList({
					page: {
						current: 0,
						size: 30,
					},
				})
				.then(res => {
					// console.log('獲取郵箱賬號的結果為： ',res);
					if (res.code != 0) resolve(false)
					res = res.data
					if (res.total > 0) {
						let mailActiveResult = res.data.some(item => item.mailStatus == 1)
						commit('SET_IS_MAIL_ACTIVE', mailActiveResult)
						if (mailActiveResult) {
							let currentSyncMail = res.data.find(item => item.mailStatus == 1)
							commit('SET_CURRENT_SYNC_MAILID', currentSyncMail.id)
							commit('SET_CURRENT_SYNC_MAIL', currentSyncMail)
						} else {
							commit('SET_CURRENT_SYNC_MAIL', res.data[0])
						}
					} else {
						commit('SET_IS_MAIL_ACTIVE', false)
                    }
					resolve(res)
				})
		})
	},
	//新增、修改Model
	editModel({ commit }, [id, data]) {
		//
		return new Promise((resolve, reject) => {
			if (id < 0) {
				//新增
				// console.log('新增');
				commit('ADD_MODEL', data)
			} else {
				//修改
				// console.log('修改');
				commit('EDIT_MODEL', [id, data])
			}
			resolve(true)
		})
	},
	//刪除範本
	delModel({ commit }, id) {
		return new Promise((resolve, reject) => {
			console.log(typeof id == 'number')
			if (typeof id == 'number') {
				commit('DEL_MODEL', id)
			} else {
				// let idArray = id.split(',');
				console.log(id)
				id.forEach(item => {
					commit('DEL_MODEL', item)
				})
			}
			resolve(true)
		})
	},
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
}
