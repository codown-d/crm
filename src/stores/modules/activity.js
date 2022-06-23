/*
 * @Author: your name
 * @Date: 2021-09-28 21:56:38
 * @LastEditTime: 2021-11-07 21:24:11
 * @LastEditors: Lone
 * @Description: In User Settings Edit
 * @FilePath: \crm\src\stores\tags\index.js
 */
import axios from "axios";
const api_url = "https://ins-info.ib.gov.tw/opendata/json-06161610.aspx"

const state = {
    activityType:[
      {
        key: 0,   
        id: '1',
        type_title: "通話",      
        type_eng_title: "call",
        type_icon:"settings_phone",
        stop:false,
      },
      {
        key: 1,     
        id: '2',     
        type_title: "會議",     
        type_eng_title: "meeting",
        type_icon:"people",
        stop:false,
      },
      {
        key: 2,   
        id: '3',       
        type_title: "工作",     
        type_eng_title: "task",
        type_icon:"schedule",
        stop:false,
      },
      {
        key: 3,  
        id: '4',
        type_title: "期限",     
        type_eng_title: "deadline",
        type_icon:"bookmark",
        stop:false,
      },
      {
        key: 4,
        id: '5',
        type_title: "電子郵件",     
        type_eng_title: "email",
        type_icon:"mail",
        stop:false,
      },
      {
        key: 5,
        id: '6',       
        type_title: "午餐",     
        type_eng_title: "lunch",
        type_icon:"restaurant_menu",
        stop:false,
      }
    ],
    activityData:[
      // {
      //   key: 0,        
      //   subject: "開會",
      //   deal: "deal",
      //   contact: "Trace",
      //   customer_ID:0,
      //   email: "Hellen@gmail.com",
      //   tel: "02-23123234",
      //   organization: "組織",
      //   last_date: "2021-03-03 12:00:00",
      //   completed:false,
      //   title: "開會",
      //   start:"2021-11-01",
      //   end:"2021-11-05",
      //   color: "##01dbdd",
      //   isDone: false,
      //   manageDetailType:{
      //     type_id : 2,
      //     type_name : "活動",
      //     type_eng_name:"activity",
      //     type_icon : "local_cafe",
      //   },
      // },
      // {
      //   key: 1,
      //   subject: "通話",
      //   deal: "deal",
      //   contact: "Bob",
      //   customer_ID:1,
      //   email: "Hellen@gmail.com",
      //   tel: "02-23123234",
      //   organization: "組織",
      //   last_date: "2021-03-03 12:00:00",
      //   completed:false,
      //   title: "通話",
      //   start:"2021-11-05",
      //   end:"2021-11-10",
      //   color: "#34cf7a",
      //   isDone: false,
      //   manageDetailType:{
      //     type_id : 2,
      //     type_name : "活動",
      //     type_eng_name:"activity",
      //     type_icon : "local_cafe",
      //   },
      // },
      // {
      //   key: 2,
      //   subject: "會議",
      //   deal: "deal",
      //   contact: "Linda",
      //   customer_ID:2,
      //   email: "Hellen@gmail.com",
      //   tel: "02-23123234",
      //   organization: "組織",
      //   last_date: "2021-03-03 12:00:00",
      //   completed:false,
      //   title: "會議",
      //   start:"2021-11-02",
      //   end:"2021-11-11",
      //   color: "#ff1b1b",
      //   isDone: false,
      //   manageDetailType:{
      //     type_id : 2,
      //     type_name : "活動",
      //     type_eng_name:"activity",
      //     type_icon : "local_cafe",
      //   },
      // }
    ],
    apiData:[],
    currentActivity: {},
   
    
  
  };  
  
  const getters = {
    getActivityData: state => {
      let tempData = state.activityData
      tempData = tempData.filter(item => { return item.completed == false });
      return tempData;
    },
    getApiData: state => {
      let apiData = state.apiData.push({
          id:"1",
          name:"資料"
      })
      console.log("store --- apiData----",apiData)
      return state.apiData;
    }
  };
  
  const mutations = {
    //新增行程 
    ADD_ACTIVITY (state, data) {
      console.log('到ADD_ACTIVITY', data);
      let tmpData = state.activityData
      console.log("state.activityData length",tmpData.length + 1)
      data.key = tmpData.length
      state.activityData.push(data)
    },
    //修改行程 
    EDIT_ACTIVITY (state, data) {
      let tmpUpdateData = state.activityData
      tmpUpdateData.forEach(item => {
        if (item.key == data.key) {
          item.title = data.title;
          item.subject = data.subject;
          item.organization = data.organization;
          item.deal = data.deal;
          item.contact = data.contact;
          item.tel = data.tel;
          item.last_date = data.last_date;
          item.start = data.start;
          item.end = data.end;
          item.color = data.color;
          item.completed = data.completed;
        }
      })

      console.log("EDIT_ACTIVITY state",state.activityData)
      console.log("EDIT_ACTIVITY data",data)
    },
    //刪除行程 
    DEL_ACTIVITY (state, key) {
      state.activityData = state.activityData.filter(item => { return item.key != key });
      //console.log("key--",key)
    },
    //新增行程類別
    ADD_ACTIVITYTYPE (state, data) {
      // console.log('到ADD_TAG', data);
      state.activityType.push(data)
    },
    //修改行程類別 
    EDIT_ACTIVITYTYPE (state, data) {
      state.activityType.forEach(item => {
        if (item.key == data.key) {
          item = data;
        }
      })
    },
    //刪除行程類別 
    DEL_ACTIVITYTYPE (state, key) {
      state.activityType = state.activityType.filter(item => { return item.key != key });
      //console.log("key--",key)
    },
    GET_ACTIVITY_DATA(state, activityData){
      activityData.list.forEach((item,index)=>{
        item.activityId = index
        item.key = item.activityId
      })
      state.activityData = activityData;
      console.log("state.activityData activity.js",state.activityData)
    },
    GET_CURRENT_ACTIVITY(state, currentRowData){
      state.currentActivity = currentRowData;
      console.log("state.currentActivity activity.js",state.currentActivity)
    },
    SET_API_DATA(state, apiData) {
        state.apiData.push(apiData);
        console.log("SET_API_DATA state--",state)
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
    addActivity ({commit},data) {
      console.log('activity/addActivity',data);
      return new Promise((resolve, reject) => {
          commit('ADD_ACTIVITY', data);
          resolve(true);
      })
    },
    //修改行程
    async editActivity ({commit},data) {//key 為就的tagTitle，data為新的tagTitle
      console.log('到修改行程的actions', data);
      
      return new Promise((resolve, reject) => {
          commit('EDIT_ACTIVITY',data);
          resolve(true);
      })
    },
    //刪除行程
    async delActivity ({commit},obj) {
      //console.log("obj--key--",obj.key)
      return new Promise((resolve, reject) => {
        commit('DEL_ACTIVITY', obj.key);
        resolve(true);
      })
    },
    //新增行程類別
    async addActivityType ({commit},data) {
      // console.log('到main/addTags',data);
      return new Promise((resolve, reject) => {
          commit('ADD_ACTIVITYTYPE', data);
          resolve(true);
      })
    },
    //修改行程類別
    async editActivityType ({commit},data) {//key 為就的tagTitle，data為新的tagTitle
      return new Promise((resolve, reject) => {
          commit('EDIT_ACTIVITYTYPE',data);
          resolve(true);
      })
    },
    //刪除行程類別
    async delActivityType ({commit},obj) {
      //console.log("obj--key--",obj.key)
      return new Promise((resolve, reject) => {
        commit('DEL_ACTIVITYTYPE', obj.key);
        resolve(true);
      })
    },
    //取得目前活動Row資料
    async getCurrentActivity ({commit},data) {
      return new Promise((resolve, reject) => {
          commit('GET_CURRENT_ACTIVITY',data);
          resolve(true);
      })
    },  
    //取得活動列表資料
    async getActivityList ({commit},data) {
      return new Promise((resolve, reject) => {
          commit('GET_ACTIVITY_DATA',data);
          resolve(true);
      })
    },    
    
    async getApiData({commit}){
        const resource = await apiClient.get(api_url);
        console.log("resource data",resource)
        return new Promise((resolve, reject) => {
          //commit('SET_API_DATA', resource.data);
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
  
