/*
 * @Descripttion: 
 * @version: 
 * @Author: Lone
 * @Date: 2021-12-08 19:45:09
 * @LastEditors: Lone
 * @LastEditTime: 2022-03-03 12:21:21
 */

// import Axios from '../utils/axios-util-user'
import Axios from '../utils/axios-util'

let BASE_PARAMS = {
	"caller": "crm-web",
	"requestId": "uuid",
	"traceId": "uuid"
};

export default {
    // 登录注册接口
	login: params => {
		return Axios.POST('auth/oauth/token', params);
	},
	registerUser: params => {
		BASE_PARAMS.param = params;
		return Axios.POST('api/partner/adminUser/registerUser', BASE_PARAMS);
	},
    // 查询登录用户个人信息接口
    queryLoginUserInfo: params => {
		BASE_PARAMS.param = params;
        // TEST_POST
		// return Axios.TEST_POST('api/partner/adminUser/queryLoginUserInfo', BASE_PARAMS);
		return Axios.POST('api/partner/adminUser/queryLoginUserInfo', BASE_PARAMS);
	},
    // 更改用户信息接口 //note: 该接口现在用的跨域设置 
    updateLoginUserInfo: params => {
        BASE_PARAMS.param = params;
		// return Axios.TEST_POST('api/partner/adminUser/updateLoginUserInfo', BASE_PARAMS);
		return Axios.POST('api/partner/adminUser/updateLoginUserInfo', BASE_PARAMS);
    },
    // 修改用户密码接口 //note: 该接口现在用的跨域设置 
    changePassword: params => {
        BASE_PARAMS.param = params;
        // return Axios.TEST_POST('api/partner/adminUser/changePassword', BASE_PARAMS);
		return Axios.POST('api/partner/adminUser/changePassword', BASE_PARAMS);
    },
    // 更新公司信息 //note: 该接口现在用的跨域设置 
    editUserCompany: params => {
        BASE_PARAMS.param = params;
        // return Axios.TEST_POST('api/partner/adminUser/editUserCompany', BASE_PARAMS);
		return Axios.POST('api/partner/adminUser/editUserCompany', BASE_PARAMS);
    },

    // 角色权限相关
	queryList: params => { //查询角色详情接口
        BASE_PARAMS.param = {};
		// return Axios.TEST_POST('api/partner/role/queryList', BASE_PARAMS);
		return Axios.POST('api/partner/role/queryList', BASE_PARAMS);
	},
	queryDetail: params => { //查询角色列表接口
		BASE_PARAMS.param = params;
		return Axios.POST('api/partner/role/queryDetail', BASE_PARAMS);
	},
	updatePermissions: params => { //编辑角色权限接口
        BASE_PARAMS.param = params;
		return Axios.POST('api/partner/role/updatePermissions', BASE_PARAMS);
	},

    // note: 以下接口需要接入并调试 
    // 公司使用者相关
    queryCompanyUserPageList: params => {// 分页查询本公司的使用者列表
        // 文档地址：http://52.74.188.171:8000/project/11/interface/api/1031
        // BASE_PARAMS.param = params;
        let tmpParams = {};
        for (let key in BASE_PARAMS) {
            tmpParams[key] = BASE_PARAMS[key];
        };        
        for (let key in params) {
            tmpParams[key] = params[key];
        };
        // return Axios.TEST_POST('api/partner/adminUser/queryCompanyUserPageList', tmpParams);
        return Axios.POST('api/partner/adminUser/queryCompanyUserPageList', tmpParams);
    },
    updateUserRole: params => {// 编辑使用者权限
        // 文档地址：http://52.74.188.171:8000/project/11/interface/api/1037
        BASE_PARAMS.param = params;
        // return Axios.TEST_POST('api/partner/adminUser/updateUserRole', BASE_PARAMS);
        return Axios.POST('api/partner/adminUser/updateUserRole', BASE_PARAMS);
    },
    closeUser: params => { // 启用/停用账户
        // 文档地址：http://52.74.188.171:8000/project/11/interface/api/1019
        BASE_PARAMS.param = params;
        // return Axios.TEST_POST('api/partner/adminUser/closeUser', BASE_PARAMS);
        return Axios.POST('api/partner/adminUser/closeUser', BASE_PARAMS);
    },
    createCompanyUser: params => { // 创建公司使用者账户
        // 文档地址：http://52.74.188.171:8000/project/11/interface/api/1025
        BASE_PARAMS.param = params;
        // return Axios.TEST_POST('api/partner/adminUser/createCompanyUser', BASE_PARAMS);
        return Axios.POST('api/partner/adminUser/createCompanyUser', BASE_PARAMS);
    },
    changeUserPassword: params => {// 重置使用者密码
        // 文档地址：http://52.74.188.171:8000/project/11/interface/api/1043
        BASE_PARAMS.param = params;
        return Axios.TEST_POST('api/partner/adminUser/changeUserPassword', BASE_PARAMS);
        // return Axios.POST('api/partner/adminUser/changeUserPassword', BASE_PARAMS);
    },
    getPermissions: params => {
        BASE_PARAMS.param = params;
        return Axios.POST('/api/partner/adminUser/queryLoginUserInfo', BASE_PARAMS);
    },

    // 群组
    queryOrgList: () => {
        return Axios.GET('api/partner/org/queryOrgList');
    },

    createOrg: params => {
        BASE_PARAMS.param = params;
        return Axios.POST('api/partner/org/createOrg', BASE_PARAMS);
    },

    updateOrg: params => {
        BASE_PARAMS.param = params;
        return Axios.POST('api/partner/org/updateOrg', BASE_PARAMS);
    },

    deleteOrg: params => {
        return Axios.GET('api/partner/org/deleteOrg/' + params.id);
    },

    queryOrgDetail: params => {
        return Axios.GET('api/partner/org/queryOrgDetail/' + params.id);
    },
    
    queryOrgFlatList: () => {
        return Axios.GET('api/partner/org/queryOrgFlatList');
    },

    // 群组相关人员
    addUsers: (params) => {
        return Axios.GET('api/partner/org/add/'+ params.orgId +'/users/'+ params.userId);
    },
    removeUsers: (params) => {
        return Axios.GET('api/partner/org/remove/'+ params.orgId +'/users/'+ params.userId);
    },
    queryUsersList: (params) => {
        return Axios.GET('api/partner/org/organization/'+ params.id +'/users/');
    },

    // 所有权限
    queryAccess: () => {
        return Axios.GET('api/partner/org/queryAccess');
    },
    getAccess: params => {
        return Axios.GET('api/partner/org/organization/'+ params.id + '/access');
    },
    updateOrgAccess: params => {
        BASE_PARAMS.param = params;
        return Axios.POST('api/partner/org/updateOrgAccess', BASE_PARAMS);
    },
}
