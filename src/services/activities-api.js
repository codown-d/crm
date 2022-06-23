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
    getActivityPageList: (params) => {
        //获取当前用户的邮箱账号列表
        return Axios.POST('api/customer/activity/queryActivityPageList', {
            ...BASE_PARAMS,
            ...params,
        })
    },
    addActivityType: (param) => {
        //获取当前用户的邮箱账号列表
        return Axios.POST('api/customer/activity/addCustomerActivity', {
            ...BASE_PARAMS,
            param,
        })
    },
    editActivityType: (param) => {
        //获取当前用户的邮箱账号列表
        return Axios.POST('api/customer/activity/editCustomerActivity', {
            ...BASE_PARAMS,
            param,
        })
    },

    queryActivityTypes: (params) => {
        return Axios.POST('api/customer/activity/queryActivityTypes', {
            ...BASE_PARAMS,
            params,
        })
    },
    updateActivityStatus: (param) => {
        return Axios.POST('api/customer/activity/updateActivityStatus', {
            ...BASE_PARAMS,
            param,
        })
    },

    //删除当前活动
    deleteActivity: (param) => {
        return Axios.POST('api/customer/activity/deleteCustomerActivityByIds', {
            ...BASE_PARAMS,
            param,
        })
    },
}
