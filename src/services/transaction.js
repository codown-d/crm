/*
 * @Descripttion: 
 * @version: 
 * @Author: Lone
 * @Date: 2022-02-26 14:44:14
 * @LastEditors: Lone
 * @LastEditTime: 2022-03-03 12:27:09
 */
import Axios from '../utils/axios-util'

const BASE_PARAMS = {
    caller: 'crm-web',
    requestId: 'uuid',
    traceId: 'uuid',
}

const BASE_URL = 'api/customer'

export default {
    //列表查询
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

    //编辑交易
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

    //删除交易
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
}
