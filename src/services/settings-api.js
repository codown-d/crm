
/*
 * @Descripttion: 设定功能的其他未能分类的接口
 * @version: 
 * @Author: Lone
 * @Date: 2021-12-08 21:49:12
 * @LastEditors: Lone
 * @LastEditTime: 2022-01-07 20:26:54
 */
// import Axios from '../utils/axios-util-setting'
import Axios from '../utils/axios-util'

let BASE_PARAMS = {
	"caller": "crm-web",
	"requestId": "uuid",
	"traceId": "uuid"
};

let authBase = 'api/partner/';

export default {
	//角色权限相关接口
	queryList: params => { //查询角色详情接口
		//BASE_PARAMS.param = params;
		let updateParams = {
			"caller": "crm-web",
			"param": {

			},
			"requestId": "uuid",
			"traceId": "uuid"
		}
		console.log("editCustomerActivity updateParams", updateParams)
		return Axios.POST(authBase + 'role/queryList', updateParams);
	},
	queryDetail: params => { //查询角色列表接口
		BASE_PARAMS.param = params;
		return Axios.POST(authBase + 'role/queryDetail', BASE_PARAMS);
	},
	updatePermissions: params => { //编辑角色权限接口
		//BASE_PARAMS.param = params;
		let updateParams = {
			"caller": "crm-web",
			"param": params,
			"requestId": "uuid",
			"traceId": "uuid"
		}
		console.log("editCustomerActivity updateParams", updateParams)
		return Axios.POST(authBase + 'role/updatePermissions', updateParams);
	}

}
