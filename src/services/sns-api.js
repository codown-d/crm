/*
 * @Descripttion: 
 * @version: 
 * @Author: Lone
 * @Date: 2021-10-28 22:48:56
 * @LastEditors: Lone
 * @LastEditTime: 2022-03-09 11:25:02
 */
import Axios from '../utils/axios-util'

let lineBase = 'api/line/';
export default {
	/* 頻道相關 */
	getAllLineChannel: params => {
		return Axios.LINE_POST(lineBase + 'linechannel/getAllLineChannel', params);
	},
	bindLineChannel: params => {
		return Axios.LINE_POST(lineBase + 'linechannel/bindLineChannel',  params);
	},

  updateLineChannel: params => {
		return Axios.LINE_POST(lineBase + 'linechannel/updateLineChannel',  params);
  },
	// disconnectLineChannel: params => {
	// 	return Axios.LINE_POST(lineBase + 'linechannel/disconnectLineChannel',  params);
	// },


	/* 消息相關 */
	sendMessage: params => {
		return Axios.LINE_POST(lineBase + 'linemessage/sendMessage',  params);
	},
	getAllContactFollowers: params => {
		return Axios.LINE_POST(lineBase + 'linemessage/getAllContactFollowers',  params);
	},
	getLineMessageListByUserId: params => {
		return Axios.LINE_POST(lineBase + 'linemessage/getLineMessageListByUserId',  params);
	},

}
