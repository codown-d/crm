/*
 * @Descripttion: 
 * @version: 
 * @Author: Lone
 * @Date: 2021-10-28 22:48:56
 * @LastEditors: Lone
 * @LastEditTime: 2022-04-17 20:56:33
 */
import Axios from '../utils/axios-util'
// console.log('mail-api打印', Axios);
//info: mail文档地址： 
let mailBase = 'api/midway/';
let BASE_PARAMS = {
    caller: 'crm-web',
    requestId: 'uuid',
    traceId: 'uuid',
}
export default {
	getAccountList: params => { //获取当前用户的邮箱账号列表
		return Axios.POST(mailBase + 'mail/getAccountList', params);
	},
	getFolderList: params => { //根据邮箱账号获取文件夹列表
		return Axios.POST(mailBase + 'mail/getFolderList', params);
	},
	getMessageList: params => { //查看邮件列表


		// return Axios.POST(mailBase + 'mail/getMessageList', params);// 舊版本接口

        //note: 新版本獲取郵件收件夾列表接口文檔 http://18.138.132.121:3000/project/11/interface/api/1616 
        // BASE_PARAMS.param.folderId = params.folderId;
        // BASE_PARAMS.pageSize = params.page.size;
        // BASE_PARAMS.pageNum = params.page.current;
        // BASE_PARAMS.param = {
        //     folderId: params.folderId
        // };

        for (let key in params) {
            BASE_PARAMS[key] = params[key]
        }

        // console.log('mail-api打印的參數',params, BASE_PARAMS);
		// return Axios.POST(mailBase + 'mail/getMessageList', params);// 舊版本接口
        
		return Axios.POST(mailBase + 'mail/queryMessagePageList', BASE_PARAMS)

	},
    
	getMessageDetail: params => { //查看邮件详情
		return Axios.POST(mailBase + 'mail/getMessageDetail', params);
	},
	//胜东最新的接口
	send: params => { //发送邮件
		// console.log("params",params)
		return Axios.POST(mailBase + 'mail/send', params);
	},
	sync: params => {
		return Axios.POST(mailBase + 'mail/sync', params);
	},
	validMailInfo: params => {
		return Axios.POST(mailBase + 'mail/validMailInfo', params);
	},
	saveMailInfo: params => {
		return Axios.POST(mailBase + 'mail/saveMailInfo', params);
	},
	updateMailStatus: params => {
		return Axios.POST(mailBase + 'mail/updateMailStatus', params);
	},
	updateMessageStatus: params => {
		return Axios.POST(mailBase + 'mail/updateMessageStatus', params);
	},
	deleteMessage: (params) => {
	    return Axios.POST(mailBase + 'mail/deleteMessage', params);
	},
    unbind: (params) => {
        return Axios.GET(mailBase + 'mail/unbind/email/' + params.emailId);
    }
}
