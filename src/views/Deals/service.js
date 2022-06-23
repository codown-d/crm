/*
 * @Descripttion: 
 * @version: 
 * @Author: Lone
 * @Date: 2022-02-26 15:32:25
 * @LastEditors: Lone
 * @LastEditTime: 2022-03-19 21:02:04
 */
import Axios from '@/utils/axios-util'

const BASE_PARAMS = {
    caller: 'crm-web',
    requestId: 'uuid',
    traceId: 'uuid',
}

const BASE_URL = 'api/customer'

export default {
    //列表查詢
    tableList: (params) => {
        // TEST_POST
        // return Axios.TEST_POST(`${BASE_URL}/businessDeal/queryBusinessDealPageList`, {
        //     ...BASE_PARAMS,
        //     ...params,
        // })
        return Axios.POST(`${BASE_URL}/businessDeal/queryBusinessDealPageList`, {
            ...BASE_PARAMS,
            ...params,
        })
    },

    //新增交易
    addBusiness: (params) => {
        // TEST_POST
        // return Axios.TEST_POST(`${BASE_URL}/businessDeal/addBusinessDeal`, {
        //     ...BASE_PARAMS,
        //     ...params,
        // })
        return Axios.POST(`${BASE_URL}/businessDeal/addBusinessDeal`, {
            ...BASE_PARAMS,
            ...params,
        })
    },

    //編輯交易
    editBusiness: (params) => {
        // TEST_POST
        // return Axios.TEST_POST(`${BASE_URL}/businessDeal/editBusinessDeal`, {
        //     ...BASE_PARAMS,
        //     ...params,
        // })
        return Axios.POST(`${BASE_URL}/businessDeal/editBusinessDeal`, {
            ...BASE_PARAMS,
            ...params,
        })
    },

    //刪除交易
    deleteBusiness: (params) => {
        // TEST_POST
        // return Axios.TEST_POST(`${BASE_URL}/businessDeal/deleteBusinessDeal`, {
        //     ...BASE_PARAMS,
        //     ...params,
        // })
        return Axios.POST(`${BASE_URL}/businessDeal/deleteBusinessDeal`, {
            ...BASE_PARAMS,
            ...params,
        })
    },

    //更新交易狀態，標記交易成功或失敗
    updateBusinessDealStatus: (params) => {
        return Axios.POST(`${BASE_URL}/businessDeal/updateBusinessDealStatus`, {
            ...BASE_PARAMS,
            ...params,
        })
    } 
}
