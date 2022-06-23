/*
 * @Descripttion: 
 * @version: 
 * @Author: Lone
 * @Date: 2022-01-20 10:35:06
 * @LastEditors: Lone
 * @LastEditTime: 2022-03-03 12:24:28
 */
import Axios from '../utils/axios-util'

let BASE_PARAMS = {
    caller: 'crm-web',
    requestId: 'uuid',
    traceId: 'uuid',
}

export default {
    queryMailMarketingPageList: (params) => {
        return Axios.POST('api/customer/marketing/queryPageList', {
            ...BASE_PARAMS,
            ...params,
        })
    },
    addMailMarketing: (param) => {
        return Axios.POST('api/customer/marketing/addMarketing', {
            ...BASE_PARAMS,
            param,
        })
    },
    updateMailMarketing: (param) => {
        return Axios.POST('api/customer/marketing/updateMarketingInfo', {
            ...BASE_PARAMS,
            param,
        })
    },

    queryMailMarketingById: (param) => {
        return Axios.POST('api/customer/marketing/queryMarketingDetailById', {
            ...BASE_PARAMS,
            param,
        })
    },
    deleteMailMarketing: (param) => {
        return Axios.POST('api/customer/marketing/deleteMarketingById', {
            ...BASE_PARAMS,
            param,
        })
    },
    querySendObj: (param) => {
        return Axios.POST('api/customer/marketing/querySendObj', {
            ...BASE_PARAMS,
            param,
        })
    },
}
