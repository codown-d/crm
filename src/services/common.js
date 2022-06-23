import Axios from '../utils/axios-util'

let BASE_PARAMS = {
    caller: 'crm-web',
    requestId: 'uuid',
    traceId: 'uuid',
}

export default {
    //新增交易
    addBusiness: (params) => {
        // TEST_POST
        // return Axios.TEST_POST('api/customer/businessDeal/addBusinessDeal', {
        //     ...BASE_PARAMS,
        //     ...params,
        // })
        return Axios.POST('api/customer/businessDeal/addBusinessDeal', {
            ...BASE_PARAMS,
            ...params,
        })
    },

    //人员信息列表
    searchPersonList: (params) => {
        // TEST_POST
        // return Axios.TEST_POST('api/customer/cus/queryPageList', {
        //     ...BASE_PARAMS,
        //     ...params,
        // })
        return Axios.POST('api/customer/cus/queryPageList', {
            ...BASE_PARAMS,
            ...params,
        })
    },

    //组织信息列表
    searchCompanyList: (params) => {
        // TEST_POST
        // return Axios.TEST_POST('api/customer/company/queryComPageList', {
        //     ...BASE_PARAMS,
        //     ...params,
        // })
        return Axios.POST('api/customer/company/queryComPageList', {
            ...BASE_PARAMS,
            ...params,
        })
    },

    //活动类型
    searchActiveType: (params) => {
        // TEST_POST
        // return Axios.TEST_POST('api/customer/activity/queryActivityTypes', {
        //     ...BASE_PARAMS,
        //     ...params,
        // })
        return Axios.POST('api/customer/activity/queryActivityTypes', {
            ...BASE_PARAMS,
            ...params,
        })
    },

    //新增活动--编辑活动
    addActive: (params) => {
        // TEST_POST
        // return Axios.TEST_POST('api/customer/activity/addCustomerActivity', {
        //     ...BASE_PARAMS,
        //     ...params,
        // })
        return Axios.POST('api/customer/activity/addCustomerActivity', {
            ...BASE_PARAMS,
            ...params,
        })
    },

    //删除活动
    deleteActiveFetch: (params) => {
        // TEST_POST
        // return Axios.TEST_POST('api/customer/activity/deleteCustomerActivity', {
        //     ...BASE_PARAMS,
        //     ...params,
        // })
        return Axios.POST('api/customer/activity/deleteCustomerActivity', {
            ...BASE_PARAMS,
            ...params,
        })
    },

    //更新活动状态
    updataActiveStatus: (params) => {
        // TEST_POST
        // return Axios.TEST_POST('api/customer/activity/updateActivityStatus', {
        //     ...BASE_PARAMS,
        //     ...params,
        // })
        return Axios.POST('api/customer/activity/updateActivityStatus', {
            ...BASE_PARAMS,
            ...params,
        })
    },

    //查询交易列表
    businessList: (params) => {
        // TEST_POST
        // return Axios.TEST_POST('api/customer/businessDeal/queryBusinessDealPageList', {
        //     ...BASE_PARAMS,
        //     ...params,
        // })
        return Axios.POST('api/customer/businessDeal/queryBusinessDealPageList', {
            ...BASE_PARAMS,
            ...params,
        })
    },

    //编辑活动
    editActive: (params) => {
        // TEST_POST
        // return Axios.TEST_POST('api/customer/activity/editCustomerActivity', {
        //     ...BASE_PARAMS,
        //     ...params,
        // })
        return Axios.POST('api/customer/activity/editCustomerActivity', {
            ...BASE_PARAMS,
            ...params,
        })
    },

    //修改客户资料
    editCustomerInfo: (params) => {
        // TEST_POST
        // return Axios.TEST_POST('api/customer/cus/updateCustomerInfo', {
        //     ...BASE_PARAMS,
        //     ...params,
        // })
        return Axios.POST('api/customer/cus/updateCustomerInfo', {
            ...BASE_PARAMS,
            ...params,
        })
    },

    //查询客户资料
    searchCustomerInfo: (params) => {
        // TEST_POST
        // return Axios.TEST_POST('api/customer/cus/queryCustomerById', {
        //     ...BASE_PARAMS,
        //     ...params,
        // })
        return Axios.POST('api/customer/cus/queryCustomerById', {
            ...BASE_PARAMS,
            ...params,
        })
    },

    //查询公司详情
    searchCompanyInfo: (params) => {
        // TEST_POST
        // return Axios.TEST_POST('api/customer/company/queryCompanyById', {
        //     ...BASE_PARAMS,
        //     ...params,
        // })
        return Axios.POST('api/customer/company/queryCompanyById', {
            ...BASE_PARAMS,
            ...params,
        })
    },

    //交易销售流程下拉
    transactionProcessList: (params) => {
        // TEST_POST
        // return Axios.TEST_POST('api/customer/businessFlow/queryList', {
        //     ...BASE_PARAMS,
        //     ...params,
        // })
        return Axios.POST('api/customer/businessFlow/queryList', {
            ...BASE_PARAMS,
            ...params,
        })
    },

    //更新交易阶段
    updataTransactionStage: (params) => {
        // TEST_POST
        // return Axios.TEST_POST('api/customer/businessDeal/updateBusinessDealSalesStage', {
        //     ...BASE_PARAMS,
        //     ...params,
        // })
        return Axios.POST('api/customer/businessDeal/updateBusinessDealSalesStage', {
            ...BASE_PARAMS,
            ...params,
        })
    },
}
