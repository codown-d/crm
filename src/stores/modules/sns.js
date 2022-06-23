/*
 * @Descripttion:
 * @version:
 * @Author: Lone
 * @Date: 2021-10-22 20:46:03
 * @LastEditors: Lone
 * @LastEditTime: 2022-05-07 16:44:36
 */
import Vue from 'vue'
import Api from '@/services/api'
import { message } from 'ant-design-vue'

const state = {
	isLineSyncing: true,
    syncChannel: null
}

const getters = {}

const mutations = {
	SET_LINE_IS_SYNC(state, data) {
		//更改LINE狀態
		state.isLineSyncing = data
	},
    SET_SYNC_CHANNEL_INFO(state, data) {
        state.syncChannel = data
    }
}

const actions = {

}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
}
