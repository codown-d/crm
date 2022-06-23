/*
 * @Descripttion:
 * @version:
 * @Author: Lone
 * @Date: 2021-09-29 11:37:07
 * @LastEditors: Lone
 * @LastEditTime: 2022-03-08 16:48:07
 */
import Vue from 'vue'
import Vuex from 'vuex'
import { createStore } from 'vuex-extensions'

import main from './modules/main'
import mail from './modules/mail'
import activity from './modules/activity'
import note from './modules/note'
import calendar from './modules/calendar'
import business from './modules/business'
import user from './modules/user' //用户相关的vuex模块，登录、登录等
import sns from './modules/sns'
import getters from './getters';

Vue.use(Vuex)

const store = createStore(Vuex.Store, { 
    // plugins: [],
    modules: {
        main,
        mail,
        activity,
        note,
        calendar,
        business,
        user,
        sns,
    },
		getters,
		strict: 'debug',
})

// const store = new Vuex.Store({
// 	modules: {
    //     main,
    //     mail,
    //     activity,
    //     note,
    //     calendar,
    //     business,
    //     user,
    //     sns,
    // },
// 	strict: 'debug',
// })

const install = function (Vue) {
	if (install.installed) return // 如果已经注册过了，就跳过
	install.installed = true
	//注入模块action getter
	const action = {}
	for (let key in store._actions) {
		let keys = key.split('/')
		if (keys.length > 1) {
			if (!action[keys[0]]) {
				action[keys[0]] = {}
			}
			action[keys[0]][keys[1]] = param => store.dispatch(key, param)
		} else {
			action[keys[0]] = param => store.dispatch(key, param)
		}
	}
	const commit = {}
	for (let key in store._mutations) {
		let keys = key.split('/')
		if (keys.length > 1) {
			if (!commit[keys[0]]) {
				commit[keys[0]] = {}
			}
			commit[keys[0]][keys[1]] = param => store.commit(key, param)
		} else {
			commit[keys[0]] = param => store.commit(key, param)
		}
	}
	const getter = {}
	for (let key in store._wrappedGetters) {
		let keys = key.split('/')
		if (keys.length > 1) {
			if (!getter[keys[0]]) {
				getter[keys[0]] = {}
			}
			getter[keys[0]][keys[1]] = param => {
				if (param == null) {
					return store.getters[key]
				} else {
					return store.getters[key](param)
				}
			}
		} else {
			getter[keys[0]] = param => store.getters[key](param)
		}
	}
	Vue.prototype.$action = action
	Vue.prototype.$commit = commit
	Vue.prototype.$getter = getter
	Vue.prototype.$store = store
}

store.install = install

export default store
