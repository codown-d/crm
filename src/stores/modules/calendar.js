/*
 * @Author: cynthia
 * @Date: 2021-09-28 21:56:38
 * @LastEditTime: 2021-10-27 22:06:11
 * @LastEditors: Lone
 * @Description: In User Settings Edit
 * @FilePath: \crm\src\stores\tags\index.js
 */

const state = {
  calendarEvents:[],  
  calendarData:[
    {
      title: "放假",
      start:"2021-10-01",
      end:"2021-10-08",  // 結束日期（不包含當天）
      id: "bianhao1111",
      color: "#f00",
    },
    {
      title: "放假1",
      start:"2021-11-10",
      end:"2021-11-20",  // 結束日期（不包含當天）
      id: "bianhao222",
      color: "#223344",
    },
  ]
};  
  

  const getters = {
    getCalendarEvents: state => {
      // let apiData = state.apiData.push({
      //     id:"1",
      //     name:"資料"
      // })
      // console.log("store --- apiData----",apiData)
      return state.calendarEvents;
    }
  };
  
  const mutations = {
    ADD_CALENDAR_EVENT (state, event) {
      console.log("event",event)
      state.calendarEvents.push(event)
    },
    //新增行程 
    // ADD_NOTE_DATA (state, data) {
    //   // console.log('到ADD_TAG', data);
    //   let tmpData = state.noteData
    //   console.log("state.noteData length",tmpData.length + 1)
    //   data.key = tmpData.length
    //   data.type = "note"
    //   console.log("data length",data)
    //   state.noteData.push(data)
    // },
    // //修改行程 
    // EDIT_NOTE_DATA (state, data) {
    //   state.noteData.forEach(item => {
    //     if (item.key == data.key) {
    //       console.log("item.key",item.key)
    //       console.log("data.key",data.key)
    //       item.customer_key = data.customer_key;
    //       item.key = data.key;
    //       item.noteType.key = data.noteType.key;
    //       item.noteType.type_title = data.noteType.type_title;
    //       item.text_desc = data.text_desc;
    //       item.type = data.type
    //       console.log("item",item)
    //     }
    //   })

    //   console.log("EDIT_NOTE_DATA state",state.noteData)
    //   console.log("EDIT_NOTE_DATA data",data)
    // },
    // //刪除行程 
    // DEL_NOTE_DATA (state, key) {
    //   state.noteData = state.noteData.filter(item => { return item.key != key });
    //   //console.log("key--",key)
    // },
    // GET_CURRENT_NOTE_DATA(state, currentRowData){
    //   state.currentRow = currentRowData;
    //   console.log("state.currentRow activity.js",state.currentRow)
    // },
  };
  
  const actions = {
    /**
     * @name: 為客戶貼標籤的actions
     * @param {*} commit
     * @param {*} custArray 選中的需要修改標籤的用戶數組
     * @param {*} tagsArray 選中的標籤數組
     * @return {*}
     */ 
    async addCalendarEvent ({commit},data) {
      // console.log('到main/addTags',data);
      return new Promise((resolve, reject) => {
          commit('ADD_CALENDAR_EVENT', data);
          resolve(true);
      })
    },
    //新增行程 
    // async addNoteData ({commit},data) {
    //   // console.log('到main/addTags',data);
    //   return new Promise((resolve, reject) => {
    //       commit('ADD_NOTE_DATA', data);
    //       resolve(true);
    //   })
    // },
    // //修改行程
    // async editNoteData ({commit},data) {//key 為就的tagTitle，data為新的tagTitle
    //   console.log('到修改行程的actions', data);
      
    //   return new Promise((resolve, reject) => {
    //       commit('EDIT_NOTE_DATA',data);
    //       resolve(true);
    //   })
    // },
    // //刪除行程
    // async delNoteData ({commit},obj) {
    //   //console.log("obj--key--",obj.key)
    //   return new Promise((resolve, reject) => {
    //     commit('DEL_NOTE_DATA', obj.key);
    //     resolve(true);
    //   })
    // },
    // //取得目前活動Row資料
    // async getCurrentRow ({commit},data) {
    //   return new Promise((resolve, reject) => {
    //       commit('GET_CURRENT_NOTE_DATA',data);
    //       resolve(true);
    //   })
    // },  

  };
  
   
  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
  }
  