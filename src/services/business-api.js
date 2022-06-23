/*
 * @Descripttion: //note: 销售模块的相关接口
 * @version: 
 * @Author: Cynthiar
 * @Date: 2021-11-17 11:56:56
 * @LastEditors: Lone
 * @LastEditTime: 2021-12-12 00:21:09
 */
// import Axios from '../utils/axios-util-customer'
import Axios from '../utils/axios-util'

// console.log('mail-api打印', Axios);
//info: mail文档地址： http://52.221.25.56:9240/swagger-ui/index.html#/

let BASE_PARAMS = {
    "caller": "crm-web",
    "requestId": "uuid",
    "traceId": "uuid"
};
let custBase = 'api/customer/';
export default {
    //商机交易模块接口Business Deal Controller
    queryBusinessDealPageList: params => { //businessDeal/queryBusinessDealPageList 分页查询商机交易列表
        let updateParams = {
            "caller": "crm-web",
            "pageNum": params.page.currentPage,
            "pageSize": params.page.pageSize,
            "param": {},
            "requestId": "uuid",
            "sorts": [{
                "desc": true,
                "key": ""
            }],
            "traceId": "uuid"
        }
        console.log("addCustomerNote updateParams", updateParams)
        return Axios.POST(custBase + 'businessDeal/queryBusinessDealPageList', updateParams);
    },
    addBusinessDeal: params => { //businessDeal/addBusinessDeal 新增商机交易信息
        let updateParams = {
            "caller": "crm-web",
            "param": {
                "companyId": parseInt(params.companyId),
                "currencyId": parseInt(params.currencyId), // 0,
                "customerId": parseInt(params.customerId), // 83,
                "dealDate": params.dealDate, // "2021-11-30 12:00:00",
                "emailList": params.emailList,
                // [
                //   {
                //     "email": "uuu@gmail.com",
                //     "type": "work",
                //     "typeName": "工作"
                //   }
                // ],
                "money": parseFloat(params.money), // 100,
                "ownerUser": parseInt(params.ownerUser), // 0,
                "phoneList": params.phoneList,
                // [
                //   {
                //     "phone": "09876543",
                //     "type": "work",
                //     "typeName": "工作"
                //   }
                // ],
                "salesFlowId": parseInt(params.salesFlowId), // 1,
                "salesStageId": parseInt(params.salesStageId), // 1,
                "title": params.title, // "XXXXX"
            },
            "requestId": "uuid",
            "traceId": "uuid"
        }
        console.log("addCustomerNote updateParams", updateParams)
        return Axios.POST(custBase + 'businessDeal/addBusinessDeal', updateParams);
    },
    deleteBusinessDeal: params => { //businessDeal/deleteBusinessDeal 删除商机交易信息
        let updateParams = {
            "caller": "crm-web",
            "param": {
                "ids": params //[0]
            },
            "requestId": "uuid",
            "traceId": "uuid"
        }
        console.log("addCustomerNote updateParams", updateParams)
        return Axios.POST(custBase + 'businessDeal/deleteBusinessDeal', updateParams);
    },
    editBusinessDeal: params => { //businessDeal/editBusinessDeal 修改商机交易信息
        let updateParams = {
            "caller": "crm-web",
            "param": {
                "dealId": parseInt(params.dealId), //0,
                "companyId": parseInt(params.companyId),
                "currencyId": parseInt(params.currencyId), // 0,
                "customerId": parseInt(params.customerId), // 83,
                "dealDate": params.dealDate, // "2021-11-30 12:00:00",
                "emailList": params.emailList,
                // [
                //   {
                //     "email": "uuu@gmail.com",
                //     "type": "work",
                //     "typeName": "工作"
                //   }
                // ],
                "money": parseFloat(params.money), // 100,
                "ownerUser": parseInt(params.ownerUser), // 0,
                "phoneList": params.phoneList,
                // [
                //   {
                //     "phone": "09876543",
                //     "type": "work",
                //     "typeName": "工作"
                //   }
                // ],
                "salesFlowId": parseInt(params.salesFlowId), // 1,
                "salesStageId": parseInt(params.salesStageId), // 1,
                "title": params.title, // "XXXXX"
            },
            "requestId": "uuid",
            "traceId": "uuid"
        }
        console.log("addCustomerNote updateParams", updateParams)
        return Axios.POST(custBase + 'businessDeal/editBusinessDeal', updateParams);
    },
    queryBusinessDealDetail: params => { //businessDeal/queryBusinessDealDetail 查询商机详情页明细信息
        let updateParams = {
            "caller": "crm-web",
            "param": {
                "dealId": params.dealId
            },
            "requestId": "uuid",
            "traceId": "uuid"
        }
        console.log("addCustomerNote updateParams", updateParams)
        return Axios.POST(custBase + 'businessDeal/queryBusinessDealDetail', updateParams);
    },
    queryBusinessDealPlanActivityPageList: params => { // 分页查询商机计划中的活动信息
        let updateParams = {
            "caller": "crm-web",
            "pageNum": 1,
            "pageSize": 100,
            "param": {
                "dealId": parseInt(params.dealId)
            },
            "requestId": "uuid",
            "sorts": [{
                "desc": true,
                "key": ""
            }],
            "traceId": "uuid"
        }
        console.log("addCustomerNote updateParams", updateParams)
        return Axios.POST(custBase + 'businessDeal/queryBusinessDealPlanActivityPageList', updateParams);
    },
    queryBusinessDealTimelinePageList: params => { // 分页查询商机时间线信息
        let updateParams = {
            "caller": "crm-web",
            "pageNum": 1,
            "pageSize": 100,
            "param": {
                "dealId": parseInt(params.dealId),
                "search": "all"
            },
            "requestId": "uuid",
            "sorts": [{
                "desc": true,
                "key": ""
            }],
            "traceId": "uuid"
        }
        console.log("addCustomerNote updateParams", updateParams)
        return Axios.POST(custBase + 'businessDeal/queryBusinessDealTimelinePageList', updateParams);
    },

    //销售流程Business Flow Controller
    addBusinessFlow: params => { //新增销售流程
        let updateParams = {
            "caller": "crm-web",
            "param": params,
            /****
             * {
                "addBusinessStageReqList": [
                  {
                    "defaultProbability": 0,
                    "idleDays": 0,
                    "idleEnabled": true,
                    "name": "string",
                    "partnerId": 0,
                    "remark": "string",
                    "salesFlowId": 0,
                    "salesStageId": 0,
                    "sort": 0
                  }
                    ],
                    "name": "string",
                    "partnerId": 0,
                    "probabilityEnabled": true,
                    "remark": "string",
                    "salesFlowId": 0
                  },
             */
            "requestId": "uuid",
            "traceId": "uuid"
        }
        console.log("addBusinessFlow updateParams", updateParams)
        return Axios.POST(custBase + 'businessFlow/addBusinessFlow', updateParams);
    },
    editBusinessFlow: params => { //編輯销售流程
        let updateParams = {
            "caller": "crm-web",
            "param": params,
            /****
             * {
                "addBusinessStageReqList": [
                  {
                    "defaultProbability": 0,
                    "idleDays": 0,
                    "idleEnabled": true,
                    "name": "string",
                    "partnerId": 0,
                    "remark": "string",
                    "salesFlowId": 0,
                    "salesStageId": 0,
                    "sort": 0
                  }
                    ],
                    "name": "string",
                    "partnerId": 0,
                    "probabilityEnabled": true,
                    "remark": "string",
                    "salesFlowId": 0
                  },
             */
            "requestId": "uuid",
            "traceId": "uuid"
        }
        console.log("addBusinessFlow updateParams", updateParams)
        return Axios.POST(custBase + 'businessFlow/editBusinessFlow', updateParams);
    },
    deleteBusinessFlow: params => { //刪除销售流程
        let updateParams = {
            "caller": "crm-web",
            "param": {
                "salesFlowId": params.id
            },
            "requestId": "uuid",
            "traceId": "uuid"
        }
        console.log("deleteBusinessFlow updateParams", updateParams)
        return Axios.POST(custBase + 'businessFlow/deleteBusinessFlow', updateParams);
    },
    queryDetail: params => { //查詢销售流程詳細
        let updateParams = {
            "caller": "crm-web",
            "param": {
                "salesFlowId": parseInt(params.id)
            },
            "requestId": "uuid",
            "traceId": "uuid"
        }
        console.log("queryDetail updateParams", updateParams)
        return Axios.POST(custBase + 'businessFlow/queryDetail', updateParams);
    },
    queryList: params => {
        // "param": {
        //     "name": "string",
        //     "partnerId": 0
        // }
        for (let key in params) {
            BASE_PARAMS[key] = params[key];
        };
        return Axios.POST(custBase + 'businessFlow/queryList', BASE_PARAMS);
    },
    addBusinessDealNote: params => { //新增交易笔记
        let updateParams = {
            "caller": "crm-web",
            "param": {
                "content": params.content,
                "dealId": parseInt(params.dealId),
                "noteType": params.noteType
            },
            "requestId": "uuid",
            "traceId": "uuid"
        }
        console.log("addCustomerNote updateParams", updateParams)
        return Axios.POST(custBase + 'note/addBusinessDealNote', updateParams);
    },
    editBusinessDealNote: params => { //修改交易笔记
        console.log("修改交易笔记 Params", params)
        let editParams = {
            "caller": "crm-web",
            "param": {
                "content": params.content,
                "dealId": parseInt(params.dealId),
                "noteId": params.noteId,
                "noteType": params.noteType
            },
            "requestId": "uuid",
            "traceId": "uuid"
        }
        console.log("修改交易笔记 editParams", editParams);
        return Axios.POST(custBase + 'note/editBusinessDealNote', editParams);
    },
    deleteBusinessDealNote: params => { //刪除交易笔记
        let updateParams = {
            "caller": "crm-web",
            "param": {
                "noteId": parseInt(params.noteId)
            },
            "requestId": "uuid",
            "traceId": "uuid"
        }
        console.log("params", params)
        console.log("updateParams", updateParams)
        return Axios.POST(custBase + 'note/deleteBusinessDealNote', updateParams);
    },
    updateBusinessDealIsWin: params => { //更新商机交易赢单输单
        console.log("更新商机交易赢单输单 Params", params)
            // let editParams = {
            // "caller": "crm-web",
            // "param": {
            //     "dealId": parseInt(params.dealId),
            //     "isWin": params.isWin
            //   },
            // "requestId": "uuid",
            // "traceId": "uuid"
            // }
        let editParams = {
            "dealId": parseInt(params.dealId),
            "isWin": params.isWin
        }
        console.log("修改更新商机交易赢单输单 editParams", editParams);
        return Axios.POST(custBase + 'businessDeal/updateBusinessDealIsWin', editParams);
    },
}