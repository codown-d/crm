/*
 * @Author: cynthia
 * @Date: 2021-09-28 21:56:38
 * @LastEditTime: 2021-10-27 22:06:11
 * @LastEditors: Lone
 * @Description: In User Settings Edit
 * @FilePath: \crm\src\stores\tags\index.js
 */
import axios from "axios";
const api_url = "https://ins-info.ib.gov.tw/opendata/json-06161610.aspx"
import Api from '@/services/api';

const state = {
    currentRow: {},
    noteTypeList: [
      { value: "normal", label: "一般" },
      { value: "letter", label: "信件" },
      { value: "mobile", label: "電話" },
      { value: "visit", label: "拜訪" },
      { value: "manage", label: "管理" },
    ],
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
    noteData:[]
  };  
  
  const getters = {
  };
  
  const mutations = {
    //新增行程 
    ADD_NOTE_DATA (state, data) {
      // console.log('到ADD_TAG', data);
      //let tmpData = state.noteData
      //console.log("state.noteData length",tmpData.length + 1)
      //data.key = tmpData.length
      console.log("data length",data)

      return new Promise((resolve,reject) => {
          Api.customer.addCustomerNote(data).then(res => {
              console.log('getMessageList請求回來的數據為：', res);
              if (res.success != true) {
                  resolve(false);
                  //message.error('請求郵寄清單失敗');
              } else {
                  resolve(true);
                  //message.success('請求成功');
                  //state.noteData.push(data)
                  //console.log('state.noteData：', state.noteData);
              };
          })
      });
    },
    //修改行程 
    EDIT_NOTE_DATA (state, data) {
      state.noteData.forEach(item => {
        if (item.key == data.key) {
          console.log("item.key",item.key)
          console.log("data.key",data.key)
          item.customer_key = data.customer_key;
          item.key = data.key;
          item.noteType.key = data.noteType.key;
          item.noteType.type_title = data.noteType.type_title;
          item.text_desc = data.text_desc;
          item.type = data.type
          console.log("item",item)
        }
      })

      console.log("EDIT_NOTE_DATA state",state.noteData)
      console.log("EDIT_NOTE_DATA data",data)
    },
    //刪除行程 
    DEL_NOTE_DATA (state, key) {
      state.noteData = state.noteData.filter(item => { return item.key != key });
      //console.log("key--",key)
    },
    GET_CURRENT_NOTE_DATA(state, currentRowData){
      state.currentRow = currentRowData;
      console.log("state.currentRow activity.js",state.currentRow)
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
    async addNoteData ({commit},data) {
      // console.log('到main/addTags',data);
      return new Promise((resolve, reject) => {
          commit('ADD_NOTE_DATA', data);
          resolve(true);
      })
    },
    //修改行程
    async editNoteData ({commit},data) {//key 為就的tagTitle，data為新的tagTitle
      console.log('到修改行程的actions', data);
      
      return new Promise((resolve, reject) => {
          commit('EDIT_NOTE_DATA',data);
          resolve(true);
      })
    },
    //刪除行程
    async delNoteData ({commit},obj) {
      //console.log("obj--key--",obj.key)
      return new Promise((resolve, reject) => {
        commit('DEL_NOTE_DATA', obj.key);
        resolve(true);
      })
    },
    //取得目前活動Row資料
    async getCurrentRow ({commit},data) {
      return new Promise((resolve, reject) => {
          commit('GET_CURRENT_NOTE_DATA',data);
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
  