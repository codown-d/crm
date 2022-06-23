/*
 * @Author: your name
 * @Date: 2021-09-28 21:56:38
 * @LastEditTime: 2022-04-26 14:31:11
 * @LastEditors: Lone
 * @Description: In User Settings Edit
 * @FilePath: \crm\src\stores\tags\index.js
 */
import Api from '@/services/api'
import { message } from 'ant-design-vue'

//todo: 將改檔修改為 連絡人，以及引用改檔的各部分統一修改。
const state = {
    tagsArray: [], // 存儲從伺服器獲取到的所有的標籤資料
    tagsArrayForUse: [], // 處理完後用於貼標籤、新增用戶時的展示用的標籤資料
    tagsTreeData: [], // 存儲標籤樹資料
    tagsType: 'customer',
    visitRecord: [], // 最近流覽歷史
    showVisitRecord: [], // 用於展示的最近流覽歷史
    companyData: [],
    customerData: [],
    latentCustData: [
        {
            key: 1,
            title: 'apple交易',
            next_activity: '2021年10月31日',
            tag: 'apple',
            resourse: 'petter',
            customer_latent: '2021年10月31日',
            owner: 'puppy',
        },
        {
            key: 2,
            title: 'apple交易',
            next_activity: '2021年10月31日',
            tag: 'apple',
            resourse: 'petter',
            customer_latent: '2021年10月31日',
            owner: 'puppy',
        },
        {
            key: 3,
            title: 'apple交易',
            next_activity: '2021年10月31日',
            tag: 'apple',
            resourse: 'petter',
            customer_latent: '2021年10月31日',
            owner: 'puppy',
        },
    ],
    currentCustomer: {}, //目前客戶詳細頁
    //定義『詳細資料』頁簽名稱
    manageDetailType: [
        {
            type_id: 0,
            type_name: '全部',
            type_eng_name: 'all',
            type_icon: 'watch_later',
        },
        {
            type_id: 1,
            type_name: '筆記',
            type_eng_name: 'note',
            type_icon: 'event_note',
        },
        {
            type_id: 2,
            type_name: '活動',
            type_eng_name: 'activity',
            type_icon: 'local_cafe',
        },
        {
            type_id: 3,
            type_name: '交易',
            type_eng_name: 'business',
            type_icon: 'currency_yen',
        },
        {
            type_id: 4,
            type_name: '電子郵件',
            type_eng_name: 'email',
            type_icon: 'mail',
        },
        // {
        // 	type_id: 5,
        // 	type_name: "檔案(二期功能)",
        // 	type_eng_name: "file",
        // 	type_icon: "file_present",
        // },
        {
        	type_id: 6,
        	type_name: "Line",
        	type_eng_name: "line",
        	type_icon: "message",
        },
        {
            type_id: 7,
            type_name: '更新日誌',
            type_eng_name: 'log',
            type_icon: 'list',
        },
    ],
    noteType: [
        {
            key: 0,
            type_title: '一般',
            noteType: 'normal',
        },
        {
            key: 1,
            type_title: '信件',
            noteType: 'letter',
        },
        {
            key: 2,
            type_title: '電話',
            noteType: 'mobile',
        },
        {
            key: 3,
            type_title: '親坊',
            noteType: 'visit',
        },
    ],
    companySet: {},
    customerTagsData: [], //客戶標籤
    companyTagsData: [], //公司標籤
    tagsData: [], //公司 客戶 標籤
    getTotalPage: {
        totalCount: 0,
        pageSize: 0,
    },
    customerTimeLineList: {}, //分頁查詢客戶時間線資訊
    customerTimelineCountList: [], //分頁查詢客戶時間線資訊-count
    customerPlanActivityList: [], //分頁查詢客戶計畫中的活動資訊
    bizTypeCode: 'customer',//  存儲標籤類型
    menuList: [
        {
            title: '新增交易',
            type: 'dollar',
        },
        // {
        //     title: "新增郵件",
        //     type: "mail",
        // },
        {
            title: "新建活動",
            type: "schedule",
        },
        {
            title: "新建客戶",
            type: "user",
        },
        {
            title: "新建組織",
            type: "shop",
        },
        // {
        //     title: "新建訊息",
        //     type: "wechat",
        // },
        // {
        //     title: "新建洞察分析",
        //     type: "area-chart"
        // }
    ],
    drawerWidth: 1300,// 抽屉宽度，根据视窗变化，动态调整
}

const getters = {}

const mutations = {
    SET_DRAWER_WIDTH(state, data) {
        state.drawerWidth = data;
    },
    SET_BIZ_TYPE_CODE(state, data) {
        state.bizTypeCode = data;
    },
    SET_TAGS_DATA(state, data) {
        // 存儲標籤資料，用於標籤樹
        state.tagsArray = data
        // todo：處理並存儲處理後的標籤資料，使用者存放在貼標籤、新增用戶等地方用到
    },
    SET_TAGS_TYPE(state, data) {
        state.tagsType = data
    },
    SET_TAGS_TREE_DATA(state, data) {
        state.tagsTreeData = data
    },
    SET_VISIT_RECORD(state, data) {
        state.visitRecord = data
    },
    SET_SHOW_VISIT_RECORD(state, [data, isUnshift]) {
        // console.log('到這裡來了', data, isUnshift);
        if (isUnshift) state.showVisitRecord.unshift(data)
        if (!isUnshift) state.showVisitRecord = state.showVisitRecord.concat(data)
    },
    SET_TOTAL_PAGE_DATA(state, data) {
        state.getTotalPage = {
            pageSize: data.pageSize,
            totalCount: data.totalCount,
            totalPages: data.totalPages,
            currentPage: data.currentPage,
        }
    },
    //查詢客戶聯絡人
    GET_CUSTOMER_DATA(state, data) {
        if (data.list && data.list.length && state.companyData && state.companyData.list && state.companyData.list.length) {
            data.list.forEach((item) => {
                state.companyData.list.forEach((item2) => {
                    if (item.companyId == item2.companyId) {
                        item.companyName = item2.name
                    }
                })
            })
        }
        state.customerData = data.list
    },
    //新增客戶
    ADD_CUSTOMER(state, data) {
        // console.log('到ADD_TAG', data);
        let tmpData = state.customerData
        data.key = tmpData.length
        state.customerData.push(data)
    },
    //修改客戶
    EDIT_CUSTOMER(state, data) {
        state.customerData.forEach((item) => {
            if (item.key == data.key) {
                item.name = data.name
                item.companyId = data.companyId
                item.phone = data.phone
                item.email = data.email
                item.ownerUser = data.ownerUser
                item.tags = data.tags
                item.activity_cancel = data.activity_cancel
                item.activity_event = data.activity_event
                item.activity_next = data.activity_next
                item.activity_start = data.activity_start
            }
        })
    },
    //刪除客戶
    DEL_CUSTOMER(state, key) {
        state.customerData = state.customerData.filter((item) => {
            return item.key != key
        })
        //console.log("key--",key)
    },

    //新增公司
    ADD_COMPANY(state, data) {
        //console.log('到ADD_TAG', data);
        let tmpData = [...state.companyData]
        data.key = tmpData.length
        state.companyData.push(data)
    },
    //修改公司
    EDIT_COMPANY(state, data) {
        state.companyData.forEach((item) => {
            if (item.key == data.key) {
                item.name = data.name
                item.address = data.address
            }
        })
    },
    //刪除公司
    DEL_COMPANY(state, key) {
        state.companyData = state.companyData.filter((item) => {
            return item.key != key
        })
    },
    //取得公司資料
    GET_COMPANY_LIST(state, data) {
        //console.log("GET_COMPANY_LIST state",data)
        data.list.forEach((item) => {
            item.key = item.id
            item.companyId = item.id
            item.businessData = {}
            item.customerData = {}
            item.tags = []
        })
        state.companyData = data
    },
    //取得目前客戶詳細頁
    GET_CURRENT_CUSTOMER(state, data) {
        data.id = data.customerId
        data.key = data.customerId
        state.currentCustomer = data
    },
    //分頁查詢客戶計畫中的活動資訊
    GET_CUSTOMER_PLAN_ACTIVITY_PAGE_LIST(state, data) {
        state.customerPlanActivityList = data
    },
    //分頁查詢客戶時間線資訊
    GET_CUSTOMER_TIME_LINE_LIST(state, data) {
        if (data.finishTimelineList.list) {
            data.finishTimelineList.list.forEach((item) => {
                if (item.objectType == 'note') {
                    state.noteType.forEach((item2) => {
                        if (item2.noteType == item.data.noteType) {
                            item.data.noteTypeName = item2.type_title
                        }
                    })
                }
            })
            state.customerTimeLineList = data.finishTimelineList
            state.customerTimelineCountList = data.timelineCountList
        }
    },
    SET_COMPANY(state, companySet) {
        state.companySet = companySet
        //console.log("state.companySet",state.companySet)
    },
}

const actions = {
    // 獲取流覽記錄，聯絡人、標籤樹、最近流覽記錄
    // todo: 流覽記錄的分頁查詢？？ 滾動載入更多，目前默認是沒有傳參數
    // 文檔地址：http://18.138.132.121:3000/project/11/interface/api/201
    getVisitRecord({ commit }, data) {
        return new Promise((resolve, reject) => {
            Api.customer.selectBrowseRecordList(data).then((res) => {
                // console.log('selectBrowseRecordList', res);
                commit('SET_VISIT_RECORD', res.data)
                commit('SET_SHOW_VISIT_RECORD', [res.data.list, false])
                resolve(res.success)
            })
        })
    },
    //新增行程
    addCustomer({ commit }, data) {
        // console.log('到main/addTags',data);
        return new Promise((resolve, reject) => {
            commit('ADD_CUSTOMER', data)
            resolve(true)
        })
    },
    //修改行程
    editCustomer({ commit }, data) {
        //key 為就的tagTitle，data為新的tagTitle
        return new Promise((resolve, reject) => {
            commit('EDIT_CUSTOMER', data)
            resolve(true)
        })
    },
    //刪除客戶
    delCustomer({ commit }, obj) {
        //console.log("obj--key--",obj.key)
        return new Promise((resolve, reject) => {
            commit('DEL_CUSTOMER', obj.key)
            resolve(true)
        })
    },
    //新增公司
    addCompany({ commit }, data) {
        //console.log('到main/addTags',data);
        return new Promise((resolve, reject) => {
            commit('ADD_COMPANY', data)
            resolve(true)
        })
    },
    //修改公司
    editCompany({ commit }, data) {
        //key 為就的tagTitle，data為新的tagTitle
        return new Promise((resolve, reject) => {
            commit('EDIT_COMPANY', data)
            resolve(true)
        })
    },
    //刪除公司
    delCompany({ commit }, obj) {
        //console.log("obj--key--",obj.key)
        return new Promise((resolve, reject) => {
            commit('DEL_COMPANY', obj.key)
            resolve(true)
        })
    },
    //取得公司資料
    getCompanyList({ commit }, data) {
        //console.log("getCompanyList data--",data)
        return new Promise((resolve, reject) => {
            commit('GET_COMPANY_LIST', data)
            resolve(true)
        })
    },
    //取得公司資料
    getApiCompanyList({ commit }, data) {
        return new Promise((resolve, reject) => {
            Api.customer.queryComPageList(data).then((res) => {
                //console.log('queryComPageList請求回來的數據為：', res);
                if (res.success != true) {
                    resolve(false)
                    //this.$message.error('請求郵寄清單失敗');
                } else {
                    //this.$message.success('請求成功');
                    //console.log('res.data', res.data);
                    res.data.currentPage = data.page.currentPage
                    commit('GET_COMPANY_LIST', res.data)
                    resolve(true)
                }
            })
        })
    },
    //取得目前客戶Row資料
    getCurrentCustomer({ commit }, data) {
        return new Promise((resolve, reject) => {
            //查詢客戶詳情頁明細資訊
            //console.log("getCurrentCustomer  data",data)
            commit('GET_CURRENT_CUSTOMER', data)
            resolve(true)
        })
    },
    //取得目前客戶分頁查詢客戶時間線資訊
    getCustomerTimeLineList({ commit }, data) {
        return new Promise((resolve, reject) => {
            ///cus/queryCustomerTimelinePageList  分頁查詢客戶時間線資訊
            commit('GET_CUSTOMER_TIME_LINE_LIST', data)
            resolve(true)
        })
    },
    //取得分頁查詢客戶計畫中的活動資訊
    getCustomerPlanActivityPageList({ commit }, data) {
        return new Promise((resolve, reject) => {
            ///cus/queryCustomerPlanActivityPageList  分頁查詢客戶時間線資訊
            commit('GET_CUSTOMER_PLAN_ACTIVITY_PAGE_LIST', data)
            resolve(true)
        })
    },
    //取得目前客戶Row資料
    async setCompany({ commit }, data) {
        //console.log("data---",data)
        return new Promise((resolve, reject) => {
            commit('SET_COMPANY', data)
            resolve(true)
        })
    },
    //取得客戶聯絡人資料
    getCustomerList({ commit }, params) {
        // console.log('params：----------------------------------------------------', params);
        return new Promise((resolve, reject) => {
            Api.customer.getCustomerList(params).then((res) => {
                //console.log('getCustomerList請求回來的數據為：', res);
                if (res.code != 0) {
                    resolve(false)
                    message.error(res.message, 2)
                } else {
                    // message.success('請求成功');
                    //console.log('res.data.list', res.data.list);
                    let tempList = res.data
                    if (tempList.list && tempList.list.length) {
                        tempList.list.forEach((item) => {
                            item.key = item.id
                        })
                    } else {
                        tempList.list = []
                    }
                    res.data.currentPage = params.page.currentPage
                    commit('GET_CUSTOMER_DATA', tempList)
                    commit('SET_TOTAL_PAGE_DATA', res.data)
                    resolve(true)
                }
            })
        })
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
