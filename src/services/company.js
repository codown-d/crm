import Axios from '../utils/axios-util'

let BASE_PARAMS = {
    caller: 'crm-web',
    requestId: 'uuid',
    traceId: 'uuid',
}

export default {
    //列表查询
    companyList: (params) => {
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

    //新增公司
    createCompany: (params) => {
        // TEST_POST
        // return Axios.TEST_POST('api/customer/company/addCompany', {
        //     ...BASE_PARAMS,
        //     ...params,
        // })
        return Axios.POST('api/customer/company/addCompany', {
            ...BASE_PARAMS,
            ...params,
        })
    },

    //删除公司
    deleteCompany: (params) => {
        // TEST_POST
        // return Axios.TEST_POST('api/customer/company/deleteCompanyByIds', {
        //     ...BASE_PARAMS,
        //     ...params,
        // })
        return Axios.POST('api/customer/company/deleteCompanyByIds', {
            ...BASE_PARAMS,
            ...params,
        })
    },

    //更新公司
    editCompany: (params) => {
        // TEST_POST
        // return Axios.TEST_POST('api/customer/company/updateCompanyInfo', {
        //     ...BASE_PARAMS,
        //     ...params,
        // })
        return Axios.POST('api/customer/company/updateCompanyInfo', {
            ...BASE_PARAMS,
            ...params,
        })
    },

    addCompanyContact: (params) => {
        // TEST_POST
        // return Axios.TEST_POST('api/customer/company/addCustomer', {
        //     ...BASE_PARAMS,
        //     ...params,
        // })
        return Axios.POST('api/customer/company/addCustomer', {
            ...BASE_PARAMS,
            ...params,
        })
    },

    //新增笔记
    addCompanyNote: (params) => {
        // TEST_POST
        // return Axios.TEST_POST('api/customer/note/addCompanyNote', {
        //     ...BASE_PARAMS,
        //     param: params,
        // })
        return Axios.POST('api/customer/note/addCompanyNote', {
            ...BASE_PARAMS,
            param: params,
        })
    },

    //编辑笔记
    editCompanyNote: (params) => {
        // TEST_POST
        // return Axios.TEST_POST('api/customer/note/editCompanyNote', {
        //     ...BASE_PARAMS,
        //     ...params,
        // })
        return Axios.POST('api/customer/note/editCompanyNote', {
            ...BASE_PARAMS,
            ...params,
        })
    },

    //删除笔记
    deleteNote: (params) => {
        // TEST_POST
        // return Axios.TEST_POST('api/customer/note/deleteCompanyNote', {
        //     ...BASE_PARAMS,
        //     ...params,
        // })
        return Axios.POST('api/customer/note/deleteCompanyNote', {
            ...BASE_PARAMS,
            ...params,
        })
    },

    //计划中时间轴
    companyPlanTimeLineFecth: (params) => {
        // TEST_POST
        // return Axios.TEST_POST('api/customer/company/queryCompanyPlanActivityPageList', {
        //     ...BASE_PARAMS,
        //     ...params,
        // })
        return Axios.POST('api/customer/company/queryCompanyPlanActivityPageList', {
            ...BASE_PARAMS,
            ...params,
        })
    },

    //完成时间轴
    doneTimeline: (params) => {
        // TEST_POST
        // return Axios.TEST_POST('api/customer/company/queryCompanyTimelinePageList', {
        //     ...BASE_PARAMS,
        //     ...params,
        // })
        return Axios.POST('api/customer/company/queryCompanyTimelinePageList', {
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
}
