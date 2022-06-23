/*
 * @Author: your name
 * @Date: 2021-09-28 21:56:38
 * @LastEditTime: 2021-11-30 23:52:24
 * @LastEditors: Lone
 * @Description: In User Settings Edit
 * @FilePath: \crm\src\stores\tags\index.js
 */
import axios from "axios";
const api_url = "https://ins-info.ib.gov.tw/opendata/json-06161610.aspx";
import Api from '@/services/api';//引入介面
import { message } from 'ant-design-vue'

const state = {
    businessData:[],
    // businessData:[{
    //     key: 0,
    //     name: "apple交易",
    //     amount: "TWD30,000",
    //     organization: "apple",
    //     contact: "petter",
    //     last_date: "2021年10月31日",
    //     next_activity: "",
    //     owner: "puppy"
    //     },
    //     {
    //     key: 1,
    //     name: "apple交易",
    //     amount: "TWD30,000",
    //     organization: "apple",
    //     contact: "petter",
    //     last_date: "2021年10月31日",
    //     next_activity: "",
    //     owner: "puppy"
    //     },
    //     {
    //     key: 2,
    //     name: "apple交易",
    //     amount: "TWD30,000",
    //     organization: "apple",
    //     contact: "petter",
    //     last_date: "2021年10月31日",
    //     next_activity: "",
    //     owner: "puppy"
    //     }
    // ],
    processType:[
      {
        type_name:'',
      }
    ],
    currentEditFlow: {},      //目前編輯流程
    currentBusiness: {},
    salesStage:[
      {
        key:1,
        name:"Qualified",
      },
      {
        key:2,
        name:"Contact Made",
      },
      {
        key:3,
        name:"Demo Scheduled",
      },
      {
        key:4,
        name:"Proposal Made",
      },
      {
        key:5,
        name:"Negotiations Started",
      },
    ],
    businessCurrency:[
      {
        id:0,
        key:0,
        name:"新台幣",
        name:"New Taiwan Dollar",
      }
    ],
    //以下是商業流程state
    businessFlowList: [],

    businessDealTimeLineList:{},  //分頁查詢客戶時間線資訊
    businessDealTimelineCountList:[],     //分頁查詢客戶時間線資訊-count
    businessDealPlanActivityList:[],//分頁查詢客戶計畫中的活動資訊

    noteType:[
      {
        key: 0,        
        type_title: "一般",
        noteType:"normal",
      },
      {
        key: 1,        
        type_title: "信件",
        noteType:"letter",
      },
      {
        key: 2,        
        type_title: "電話",
        noteType:"mobile",
      },
      {
        key: 3,        
        type_title: "親坊",
        noteType:"visit",
      },
    ],

  };  
  
  const getters = {
    // getActivityData: state => {
    //   let tempData = state.businessData
    //   tempData = tempData.filter(item => { return item.completed == false });
    //   return tempData;
    // },
    // getApiData: state => {
    //   let apiData = state.apiData.push({
    //       id:"1",
    //       name:"資料"
    //   })
    //   console.log("store --- apiData----",apiData)
    //   return state.apiData;
    // }
  };
  
  const mutations = {
    //新增行程 
    ADD_BUSINESS (state, data) {
      console.log('到ADD_BUSINESS', data);
      let tmpData = state.businessData
      console.log("state.businessData length",tmpData.length + 1)
      data.key = tmpData.length
      state.businessData.push(data)
    },
    //修改行程 
    EDIT_BUSINESS (state, data) {
      let tmpUpdateData = state.businessData
      tmpUpdateData.forEach(item => {
        if (item.key == data.key) {
          item.name = data.name;
        }
      })

      console.log("EDIT_BUSINESS state",state.businessData)
      console.log("EDIT_BUSINESS data",data)
    },
    //刪除行程 
    DEL_BUSINESS (state, key) {
      state.businessData = state.businessData.filter(item => { return item.key != key });
      //console.log("key--",key)
    },
    GET_CURRENT_BUSINESS(state, currentRowData){
      state.currentBusiness = currentRowData;
      console.log("state.currentBusiness BUSINESS.js",state.currentBusiness)
    },
    GET_CURRENT_FLOW(state, currentRowData){
      state.currentEditFlow = currentRowData;
      console.log("state.currentEditFlow BUSINESS.js",state.currentEditFlow)
    },
    SET_API_DATA(state, apiData) {
        state.apiData.push(apiData);
        console.log("SET_API_DATA state--",state)
    },
    //以下是銷售流程相關
    SET_BUSINESS_FLOW_LIST (state, data) {
        state.businessFlowList = data;
    },
    //以下商機交易相關
    GET_BUSINESS_DEAL (state, data) {
        state.businessData = data;
    },
    //分頁查詢客戶計畫中的活動資訊
    GET_BUSINESS_DEAL_PLAN_ACTIVITY_PAGE_LIST(state, data){  
      state.businessDealPlanActivityList = data
      console.log("businessDealPlanActivityList",data)
    },
    //分頁查詢客戶時間線資訊
    GET_BUSINESS_DEAL_TIME_LINE_LIST(state, data){  
      console.log("GET_BUSINESS_DEAL_TIME_LINE_LIST",data)
      data.finishTimelineList.list.forEach(item=>{
        if(item.objectType == 'note'){
          state.noteType.forEach(item2=>{
            if(item2.noteType == item.data.noteType){
              item.data.noteTypeName = item2.type_title
            }
          })
        }
      })
      state.businessDealTimeLineList = data.finishTimelineList
      state.businessDealTimelineCountList = data.timelineCountList
      console.log("businessDealTimeLineList",data)
        // return new Promise((resolve,reject) => { 
        //   console.log("reject",reject)
        //     Api.customer.queryCustomerTimelinePageList(currentRowData).then(res => {
        //         console.log('getCustomerList請求回來的數據為：', res);
        //         if (res.success == false) {  
        //           //alert('查詢客戶時間線資訊失敗')
        //             resolve(false);
        //             //this.$message.error('請求郵寄清單失敗');
        //         } else {
        //             //this.$message.success('請求成功');  
        //             //alert('查詢客戶時間線資訊成功')
        //             console.log('res.data', res.data);

        //             state.customerTimeLineList = res.data.finishTimelineList
        //             state.customerTimelineCountList = res.data.timelineCountList

        //             console.log("customerTimeLineList",state.customerTimeLineList)
        //             console.log("customerTimelineCountList",state.customerTimelineCountList)
        //             resolve(true);  
        //         };
        //     })
        // });
    },

  };
  
const actions = {
    /**
     * @name: 為客戶貼標籤的actions
     * @param {*} commit
     * @param {*} custArray 選中的需要修改標籤的用戶數組
     * @param {*} tagsArray 選中的標籤數組
     * @return {*}
     */ 
    //新增行程 
    async addBusiness ({commit},data) {
      console.log('Business/addBusiness',data);
      return new Promise((resolve, reject) => {
          commit('ADD_BUSINESS', data);
          resolve(true);
      })
    },
    //修改行程
    async editBusiness ({commit},data) {//key 為就的tagTitle，data為新的tagTitle
      console.log('到修改行程的Business', data);
      return new Promise((resolve, reject) => {
          commit('EDIT_BUSINESS',data);
          resolve(true);
      })
    },
    //刪除行程
    async delBusiness ({commit},obj) {
      //console.log("obj--key--",obj.key)
      return new Promise((resolve, reject) => {
        commit('DEL_BUSINESS', obj.key);
        resolve(true);
      })
    },
    //取得目前活動Row資料
    async getCurrentBusiness ({commit},data) {
      return new Promise((resolve, reject) => {
          commit('GET_CURRENT_BUSINESS',data);
          resolve(true);
      })
    },    
    async getCurrentFlow ({commit},data) {
      return new Promise((resolve, reject) => {
        Api.business.queryDetail(data).then(res => {
            console.log('獲取交易流程詳細的結果:', res);
            if (res.success != true) return message.error(res.message);
            res.data.queryBusinessStageList.forEach((item,index)=>{
              item.no = index
              item.stageName = item.name
            })
            commit('GET_CURRENT_FLOW', res.data);
            resolve(true);
        })
    })
      // return new Promise((resolve, reject) => {
      //     commit('GET_CURRENT_FLOW',data);
      //     resolve(true);
      // })
    },    
    async getApiData({commit}){
        const resource = await apiClient.get(api_url);
        console.log("resource data",resource)
        return new Promise((resolve, reject) => {
          //commit('SET_API_DATA', resource.data);
          resolve(true);
        })
    },
    //分頁查詢商機交易清單
    async getBusinessDeal ({ commit }, data) {
        return new Promise((resolve, reject) => {
            Api.business.queryBusinessDealPageList(data).then(res => {
                console.log('獲取交易流程清單的結果:', res);
                if (res.code != '0') return message.error(res.message);
                res.data.list.forEach(item=>{
                  item.key = item.dealId
                  item.name = item.title
                })
                commit('GET_BUSINESS_DEAL', res.data);
                resolve(true);
            })
        })
    },
    //進入交易介面，獲取交易流程清單
    async getBusinessFlowList ({ commit }, data) {
        return new Promise((resolve, reject) => {
            Api.business.queryList().then(res => {
                console.log('獲取交易流程清單的結果:', res);
                if (res.code != '0') return message.error(res.message);
                commit('SET_BUSINESS_FLOW_LIST', res.data);
            })
        })
    },
    //取得目前客戶分頁查詢客戶時間線資訊
    getBusinessDealTimeLineList ({commit},data) {
      return new Promise((resolve, reject) => {
        ///cus/queryCustomerTimelinePageList  分頁查詢客戶時間線資訊
          commit('GET_BUSINESS_DEAL_TIME_LINE_LIST',data);
          resolve(true);
      })
    },  
    //取得分頁查詢客戶計畫中的活動資訊
    getBusinessDealPlanActivityPageList ({commit},data) {
      return new Promise((resolve, reject) => {
        ///cus/queryCustomerPlanActivityPageList  分頁查詢客戶時間線資訊
          commit('GET_BUSINESS_DEAL_PLAN_ACTIVITY_PAGE_LIST',data);
          resolve(true);
      })
    },  
};
  
   
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
  
