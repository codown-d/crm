/*
 * @Descripttion:
 * @version:
 * @Author: Cynthiar
 * @Date: 2021-11-17 11:56:56
 * @LastEditors: Lone
 * @LastEditTime: 2022-04-25 15:57:56
 */
// import Axios from '../utils/axios-util-customer'
import Axios from '../utils/axios-util'

// console.log('mail-api打印', Axios);
//info: mail文档地址：
let BASE_PARAMS = {
	caller: 'crm-web',
	requestId: 'uuid',
	traceId: 'uuid',
}

let custBase = 'api/customer/'
export default {
	saveImportCustomerInfo: params => {
		//保存导入的客户资料数据接口
		BASE_PARAMS.param = params
		// for (let key in params) {
		//     BASE_PARAMS[key] = params[key];
		// };
		return Axios.POST(custBase + 'cus/saveImportCustomerInfo', BASE_PARAMS)
	},
	getCustomerList: params => {
		//获取客戶聯絡人列表-傳入pageNum(頁)pageSize(筆數)
		// console.log("接口处的------------------params",params)
		let tempParams = {
			caller: 'crm-web',
			pageNum: params.page.currentPage,
			pageSize: params.page.pageSize,
			param: {
				name: '',
				bizTypeCode: params.bizTypeCode || 'customer',
			},
			requestId: 'uuid',
			sorts: [
				{
					desc: true,
					key: '',
				},
			],
			traceId: 'uuid',
		}
		if (params.tagId) tempParams.param.tagId = params.tagId
		if (params.name) tempParams.param.name = params.name
		return Axios.POST(custBase + 'cus/queryPageList', tempParams)
	},
	queryCustomerById: params => {
		//查詢客戶聯絡人ById
		return Axios.POST(custBase + 'cus/queryCustomerById', params)
	},
	addCustomer: params => {
		//新增客戶聯絡人
		let updateParams = {
			caller: 'crm-web',
			param: params,
			requestId: 'uuid',
			traceId: 'uuid',
		}
		//console.log("updateParams", updateParams)
		return Axios.POST(custBase + 'cus/addCustomer', updateParams)
	},
	updateCustomerInfo: params => {
		//修改客戶聯絡人
		let updateParams = {
			caller: 'crm-web',
			param: params,
			requestId: 'uuid',
			traceId: 'uuid',
		}
		return Axios.POST(custBase + 'cus/updateCustomerInfo', updateParams)
	},
	deleteCustomerByIds: params => {
		//刪除客戶聯絡人
		let updateParams = {
			caller: 'crm-web',
			param: {
				ids: params,
			},
			requestId: 'uuid',
			traceId: 'uuid',
		}
		//console.log("updateParams", updateParams)
		return Axios.POST(custBase + 'cus/deleteCustomerByIds', updateParams)
	},
	//查询客户详情页明细信息
	queryCustomerDetail: params => {
		//查询客户详情页明细信息
		let updateParams = {
			caller: 'crm-web',
			param: {
				//     customerId: params.customerId != undefined ? parseInt(params.customerId) : '',
				//     name: params.name != undefined ? params.name : '',
			},
			requestId: 'uuid',
			traceId: 'uuid',
		}
		if (params.customerId != undefined) updateParams.param.customerId = parseInt(params.customerId)
		if (params.name) updateParams.param.name = params.name

		console.log("updateParams==================", updateParams, params)
		return Axios.POST(custBase + 'cus/queryCustomerDetail', updateParams)
	},
	//分页查询客户时间线信息 /cus/
	queryCustomerTimelinePageList: params => {
		let updateParams = {
			caller: 'crm-web',
			pageNum: 1,
			pageSize: 10035434553533543,
			param: {
				customerId: parseInt(params.customerId),
				search: 'all',
			},
			requestId: 'uuid',
			sorts: [
				{
					desc: true,
					key: '',
				},
			],
			traceId: 'uuid',
		}
		//console.log("updateParams", updateParams)
		return Axios.POST(custBase + 'cus/queryCustomerTimelinePageList', updateParams)
	},
	//分页查询客户计划中的活动信息
	queryCustomerPlanActivityPageList: params => {
		let updateParams = {
			caller: 'crm-web',
			pageNum: 1,
			pageSize: 100,
			param: {
				customerId: parseInt(params.customerId),
				name: '',
			},
			requestId: 'uuid',
			sorts: [
				{
					desc: true,
					key: '',
				},
			],
			traceId: 'uuid',
		}
		//console.log("updateParams", updateParams)
		return Axios.POST(custBase + 'cus/queryCustomerPlanActivityPageList', updateParams)
	},
	addCustomerNote: params => {
		//新增客户笔记
		let updateParams = {
			caller: 'crm-web',
			param: {
				content: params.content,
				customerId: parseInt(params.customerId),
				noteType: params.noteType,
			},
			requestId: 'uuid',
			traceId: 'uuid',
		}
		//console.log("addCustomerNote updateParams", updateParams)
		return Axios.POST(custBase + 'note/addCustomerNote', updateParams)
	},
	editCustomerNote: params => {
		//修改客户笔记
		console.log('修改客户笔记 Params', params)
		let editParams = {
			caller: 'crm-web',
			param: {
				content: params.content,
				customerId: parseInt(params.customerId),
				noteId: params.noteId,
				noteType: params.noteType,
			},
			requestId: 'uuid',
			traceId: 'uuid',
		}
		//console.log("修改客户笔记 editParams", editParams);
		return Axios.POST(custBase + 'note/editCustomerNote', editParams)
	},
	deleteCustomerNote: params => {
		//刪除客户笔记
		let updateParams = {
			caller: 'crm-web',
			param: {
				noteId: parseInt(params.noteId),
			},
			requestId: 'uuid',
			traceId: 'uuid',
		}
		//console.log("params", params)
		//console.log("updateParams", updateParams)
		return Axios.POST(custBase + 'note/deleteCustomerNote', updateParams)
	},
	addCustomerActivity: params => {
		///activity/addCustomerActivity 新增客户活动
		console.log('addCustomerActivity params', params)
		let updateParams = {
			caller: 'crm-web',
			param: {
				subject: params.subject,
				activityTypeId: parseInt(params.activityTypeId),
				busyFlag: parseInt(params.busyFlag),
				companyId: parseInt(params.companyId),
				dealId: parseInt(params.dealId),
				done: params.done,
				location: params.location,
				locationGeocoded: params.locationGeocoded,
				ownerUser: parseInt(params.ownerUser),
				planStartTime: params.start,
				planEndTime: params.end,
				publicDescription: params.publicDescription,
				activityNote: params.subject,
				activityParticipants: [
					// {
					// "customerId":parseInt(params.customerId),
					// "customerName": "我的客户",
					// "isCreate": false
					// }
				],
				// "activityVisitors": [
				//   {
				//     "customerId": 66,
				//     "email": "655323@qq.com"
				//   }
				// ]
			},
			requestId: 'uuid',
			traceId: 'uuid',
		}
		//console.log("addCustomerNote updateParams", updateParams)
		return Axios.POST(custBase + 'activity/addCustomerActivity', updateParams)
	},
	deleteCustomerActivity: params => {
		//activity/deleteCustomerActivity 删除客户活动
		//console.log("deleteCustomerActivity　params", params)
		let updateParams = {
			caller: 'crm-web',
			param: {
				activityId: parseInt(params.activityId),
			},
			requestId: 'uuid',
			traceId: 'uuid',
		}
		//console.log("updateParams", updateParams)
		return Axios.POST(custBase + 'activity/deleteCustomerActivity', updateParams)
	},
	editCustomerActivity: params => {
		///activity/editCustomerActivity 编辑客户活动
		//alert("editCustomerActivity")
		//console.log("editCustomerActivity Params", params)
		let updateParams = {
			caller: 'crm-web',
			param: {
				activityId: parseInt(params.activityId),
				subject: params.subject,
				activityTypeId: parseInt(params.activityTypeId),
				busyFlag: parseInt(params.busyFlag),
				//"companyId":parseIn(params.companyId),
				//"dealId":parseIn(params.dealId),
				done: params.done,
				location: params.location,
				locationGeocoded: params.locationGeocoded,
				ownerUser: parseInt(params.ownerUser),
				planStartTime: params.start,
				planEndTime: params.end,
				publicDescription: params.publicDescription,
				activityNote: params.subject,
				activityParticipants: [
					{
						customerId: parseInt(params.customerId),
						customerName: '我的客户',
						isCreate: false,
					},
				],
				// "activityVisitors": [
				//   {
				//     "customerId":parseIn() 66,
				//     "email": "655323@qq.com"
				//   }
				// ]
			},
			requestId: 'uuid',
			traceId: 'uuid',
		}
		//console.log("editCustomerActivity updateParams", updateParams)
		return Axios.POST(custBase + 'activity/editCustomerActivity', updateParams)
	},
	queryListByBizTypeCode: params => {
		////bizTag/queryListByBizTypeCode 查询基础配置业务类型
		//console.log("queryListByBizTypeCode Params", params)
		let updateParams = {
			caller: 'crm-web',
			param: {
				bizTypeCode: 'customer',
				relationBizId: [],
			},
			requestId: 'uuid',
			traceId: 'uuid',
		}
		//console.log("editCustomerActivity updateParams", updateParams)
		return Axios.POST(custBase + 'bizTag/queryListByBizTypeCode', updateParams)
	},
	queryComPageList: params => {
		//分页查询组织列表//http://52.221.25.56:9240/company/queryComPageList分页查询组织列表
		//console.log("queryComPageList params",params)
		let updateParams = {
			caller: 'crm-web',
			pageNum: params.page.currentPage,
			pageSize: params.page.pageSize,
			param: {
				name: params.name || '',
			},
			requestId: 'uuid',
			sorts: [
				{
					desc: true,
					key: '',
				},
			],
			traceId: 'uuid',
		}
		//console.log("updateParams", updateParams)
		return Axios.POST(custBase + 'company/queryComPageList', updateParams)
	},
	addCompany: params => {
		//新增组织/company/addCompany 新增组织
		//console.log("addCompany params",params);
		let updateParams = {
			caller: 'crm-web',
			param: {
				address: params.address,
				email: params.email,
				latitude: params.latitude,
				longitude: params.longitude,
				name: params.name,
				owner_user: parseInt(params.owner_user),
				phone: params.phone,
				remark: params.remark,
				//"partner_id": 1,
				update_user: 0,
				create_user: 0,
				gmt_create: '2021-11-25 14:00:00',
				gmt_modified: '2021-11-25 14:00:00',
			},
			requestId: 'uuid',
			traceId: 'uuid',
		}
		//console.log("updateParams", updateParams);
		return Axios.POST(custBase + 'company/addCompany', updateParams)
	},
	updateCompanyInfo: params => {
		//修改组织/company/updateCompanyInfo更新组织信息
		//console.log("updateCompanyInfo params", params)
		let updateParams = {
			caller: 'crm-web',
			param: {
				id: parseInt(params.id),
				address: params.address,
				email: params.email,
				latitude: params.latitude,
				longitude: params.longitude,
				name: params.name,
				owner_user: parseInt(params.owner_user),
				phone: params.phone,
				remark: params.remark,
				//"partner_id": 1,
				update_user: 0,
				create_user: 0,
				gmt_create: '2021-11-25 14:00:00',
				gmt_modified: '2021-11-25 14:00:00',
			},
			requestId: 'uuid',
			traceId: 'uuid',
		}
		//console.log("updateParams", updateParams)
		return Axios.POST(custBase + 'company/updateCompanyInfo', updateParams)
	},
	deleteCompanyByIds: params => {
		///company/deleteCompanyByIds删除组织信息
		//console.log("deleteCompanyByIds params", params)
		let updateParams = {
			caller: 'crm-web',
			param: {
				//"ids": [0]
				ids: params,
			},
			requestId: 'uuid',
			traceId: 'uuid',
		}
		//console.log("updateParams", updateParams)
		return Axios.POST(custBase + 'company/deleteCompanyByIds', updateParams)
	},
	queryActivityPageList: params => {
		//activity/queryActivityPageList 分页查询活动列表
		//console.log("queryComPageList params",params)
		let updateParams = {
			caller: 'crm-web',
			pageNum: params.page.currentPage,
			pageSize: params.page.pageSize,
			param: {
				name: '',
			},
			requestId: 'uuid',
			sorts: [
				{
					desc: true,
					key: '',
				},
			],
			traceId: 'uuid',
		}
		//console.log("updateParams", updateParams)
		return Axios.POST(custBase + 'activity/queryActivityPageList', updateParams)
	},
	//activity/queryActivityTypes 查询活动类型列表

	///activity/queryCustomerActivityDetail 查询客户活动详情

	addBrowseRecord: params => {
		//新增浏览纪录
		let updateParams = {
			caller: 'crm-web',
			param: params,
			requestId: 'uuid',
			traceId: 'uuid',
		}
		//console.log("updateParams", updateParams)
		return Axios.POST(custBase + 'browseRecord/addBrowseRecord', updateParams)
	},

	selectBrowseRecordList: params => {
		//查询浏览纪录
		// let updateParams = {
		// 	"caller": "crm-web",
		// 	"param": params,
		// 	"requestId": "uuid",
		// 	"traceId": "uuid"
		// }
		for (let key in params) {
			BASE_PARAMS[key] = params[key]
		}
		//console.log("updateParams", updateParams)
		return Axios.POST(custBase + 'browseRecord/selectBrowseRecordList', BASE_PARAMS)
	},

	//查询活动时间轴信息
	activeTimeLineFecth: params => {
		return Axios.POST(`${custBase}cus/queryCustomerPlanActivityPageList`, {
			...BASE_PARAMS,
			...params,
		})
	},

	//时间轴查询
	customerTimeline: params => {
		return Axios.POST(`${custBase}cus/queryCustomerTimelinePageList`, {
			...BASE_PARAMS,
			...params,
		})
	},

	//查询客户信息
	customerInfo: params => {
		return Axios.POST(`${custBase}cus/queryCustomerDetail`, {
			...BASE_PARAMS,
			...params,
		})
	},

	//编辑笔记
	editNote: params => {
		return Axios.POST(`${custBase}note/editCustomerNote`, {
			...BASE_PARAMS,
			...params,
		})
	},

	//新增客户笔记
	addCustomerNote: params => {
		return Axios.POST(`${custBase}note/addCustomerNote`, {
			...BASE_PARAMS,
			param: params,
		})
	},

	//删除笔记
	deleteNote: params => {
		return Axios.POST(`${custBase}/note/deleteCustomerNote`, {
			...BASE_PARAMS,
			...params,
		})
	},

	// 查询邮件关联的联系人信息
	queryCustomerByEmail: params => {
		BASE_PARAMS.param = params
		return Axios.POST(custBase + 'cus/queryCustomerByEmail', BASE_PARAMS)
	},
	// 邮件绑定至现有联络人
	bindCustomerByEmail: params => {
		BASE_PARAMS.param = params
		return Axios.POST(custBase + 'cus/bindCustomerByEmail', BASE_PARAMS)
	},

	// 通过line 频道 userId 查询联络人数据
	queryCustomerByLineChannel: params => {
		BASE_PARAMS.param = params
		return Axios.POST(custBase + 'cus/queryCustomerByLineChannel', BASE_PARAMS)
	},

    // 通过line 频道 userId 查询联络人数据
    queryCustomerByLineChannel: (params) => {
        BASE_PARAMS.param = params;
        return Axios.POST(custBase + 'cus/queryCustomerByLineChannel', BASE_PARAMS)
    },

    // line channel userId绑定至现有联络人
    bindCustomerByChannel: (params) => {
        BASE_PARAMS.param = params
        return Axios.POST(custBase + 'cus/bindCustomerByChannel', BASE_PARAMS)
    },

    // 获取浏览记录接口, 文档地址: http://18.138.132.121:3000/project/11/interface/api/201
    selectBrowseRecordList: (params) => {
        // BASE_PARAMS.param = params;
        // BASE_PARAMS.param = {}
        for (let key in BASE_PARAMS) {
            params[key] = BASE_PARAMS[key]
        }
        return Axios.POST(custBase + 'browseRecord/selectBrowseRecordList', params)
    },
    // 通过模糊查询，Header全局搜索，http://18.138.132.121:3000/project/11/interface/api/2151
    searchList: (params) => {
        BASE_PARAMS.param = params
        return Axios.POST(custBase + 'search/list', BASE_PARAMS)
    }
}
