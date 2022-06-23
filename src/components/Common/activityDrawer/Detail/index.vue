<template>
  <div class="detailUI flex-column">
      <Tabs v-model="active" :lineHeight="2">
          <Tab v-for="(item,index) in tabsArray" :key="item.name" :title="item.name">
             <p v-if="item.name == '電子郵件' ">
                <Mail />
             </p>
             <p v-if="item.name == '活動' ">
                <AddCalendar :formEdit="formEdit" @handleOk="handleOk" @handleCancel="handleCancel" />
             </p>
             <p v-else>{{ item.content }}</p>
          </Tab>
      </Tabs>
      <!--
      <a-tabs class="footer-tabs" v-if="tabsArray_1.length">
          <a-tab-pane v-for="(item,index) in tabsArray_1" :key="item.name" :tab="item.name">
             <div v-if="item.name == '全部'"
                  class="footer-tabs__body" >
                  <a-timeline class="footer-tabs__timeline">
                      <a-timeline-item>
                          <div slot="dot" class="dot-bg flex">
                            <a-icon type="clock-circle" />
                          </div>
                          <div class="primary-box flex-column">
                              <div class="primary-text flex">
                                <a-icon :style="{ color: '#06A742' }"
                                        theme="filled" 
                                        type="check-circle" /> 蘋果公司午餐會
                              </div>
                              <div class="default-text">2021.03.22 18:00 • Tony Cheng</div>
                          </div>
                      </a-timeline-item>
                      <a-timeline-item>
                          <div slot="dot" class="dot-bg flex">
                            <a-icon type="clock-circle" />
                          </div>
                          <div class="primary-box flex-column">
                              <div class="primary-text flex">
                                <a-icon :style="{ color: '#06A742' }"
                                        theme="filled" 
                                        type="check-circle" /> 阿爾法公司晚宴
                              </div>
                              <div class="default-text">2021.03.01 20:00 • Tony Cheng</div>
                          </div>
                      </a-timeline-item>
                      <a-timeline-item>
                          <div slot="dot" class="dot-bg flex">
                            <a-icon type="clock-circle" />
                          </div>
                          <div class="primary-box flex-column">
                              <div class="primary-text flex">
                                <a-icon :style="{ color: '#06A742' }"
                                        theme="filled" 
                                        type="check-circle" /> 亞馬遜公司年會
                              </div>
                              <div class="default-text">2021.01.01 09:00 • Tony Cheng</div>
                          </div>
                      </a-timeline-item>
                  </a-timeline>
             </div>
             <p v-else class="footer-tabs__body">{{ item.content }}</p>
          </a-tab-pane>
      </a-tabs>-->

  </div>
</template>
<script>
import Tab from '@/components/Common/myTabs/Tab';
import Tabs from '@/components/Common/myTabs/Tabs';
import Mail from '@/components/Mail/ComposeCard';
import AddCalendar from '@/components/Calendar/AddCalendar.vue';
export default {
  components: {
    Tabs,
    Tab,
    Mail,
    AddCalendar
  },
  data() {
    return {
      userInfo_2: {
        avator: require('@/assets/crmImages/userImg.jpeg'),
        name: 'Tony Cheng',
      },
      userInfo_3: {
        avator: require('@/assets/crmImages/userImg.jpeg'),
        name: 'Vincent',
      },
      tabsArray: [],
      active: 0,
      // tabsArray_1: [],
    }
  },
  methods: {
    handleOk(e) {
      console.log("Clicked ok button",e);
    },
    handleCancel(e) {
      console.log("Clicked cancel button",e);
    },
   
  },
  computed:{
    formEdit() {
      console.log('檢測是否更新: ', this.$store.state.activity.currentActivity);
      return this.$store.state.activity.currentActivity
    }
  },
  watch:{
    formEdit(){
      console.log("formEdit--",this.formEdit)
    }
  },
  mounted () {
    ['活動','交易'].forEach(item => {
        this.tabsArray.push({
          name: item,
          content: `Content of ${item}`
        })
    });
    // ['活動','電子郵件','檔案','順序','短信','Line'].forEach(item => {
    //     this.tabsArray.push({
    //       name: item,
    //       content: `Content of ${item}`
    //     })
    // });

    // ['全部','活動','筆記','電子郵件','檔','交易','更新日誌'].forEach(item => {
    //     this.tabsArray_1.push({
    //       name: item,
    //       content: `Content of ${item}`
    //     })
    // });

  },
};
</script>

<style>

  .detailUI {
    max-height: 100%;
    padding: 20px 30px;
    overflow: hidden;
  }

  /* 關鍵CSS,保證drawer-body內容超出的時候，不會整體都滾動，超出部分滾動由ant-drawer-body控制 */
  .ant-drawer-wrapper-body {
    overflow: hidden;
  }

  .ant-drawer-body {
    overflow: auto;
  }

  .detailUI .flex-column {
    align-items: flex-start;
  }

  .detailUI-head {
    width: 100%;
    justify-content: space-between;
    padding-bottom: 20px;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 20px;
  }

  .detailUI-head .username {
    margin-left: 15px;
    font-size: 20px;
    font-weight: 600;
    margin-right: 15px;
  }

  .detailUI-head .default-text {
    padding: 0 10px;
  }

  .detailUI-no-activity {
    margin-top: 35px;
    align-items: center;
  }

  .detailUI-no-activity .add-btn-line {
    position: relative;
    width: 100%;
  }

  .detailUI-no-activity .add-btn-line::before {
    content: "";
    position: absolute;
    width: 300px;
    height: 1px;
    background: #e8e8e8;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
  }

  .detailUI-no-activity div {
    flex: 1;
    width: 100%;
    text-align: center;
  }

  .detailUI-no-activity .default-text {
    font-size: 18px;
    padding: 10px 0 0 0;
  }

  .footer-tabs {
    margin-top: 35px;
  }

  .footer-tabs .ant-tabs-nav-scroll {
    float: left;
  }

  .footer-tabs .ant-tabs-tab {
    margin-right: 0px;
    color: #bebebe;
  }

  .footer-tabs .ant-tabs-nav .ant-tabs-tab-active {
    font-weight: 500;
    color: #2c3e50;
    font-size: 15px;
    text-shadow: 0 0 0.25px currentColor;
  }

  .footer-tabs .ant-tabs-nav .ant-tabs-tab:hover {
    color: #2c3e50;
  }

  .footer-tabs .ant-tabs-ink-bar {
    background-color: #F86F54;
  }

  .footer-tabs__body {
    width: 100%;
    padding: 20px 0;
  }

  .footer-tabs__timeline {
    padding-left: 10px;
  }

  .footer-tabs__timeline .dot-bg {
    width: 26px;
    height: 26px;
    border-radius: 13px;
    justify-content: center;
    border: 1px solid #d3d3d3;
    background: #F6F6FC;
    color: #8c8c8c;
    position: relative;
  }

  .footer-tabs__timeline .dot-bg::after {
    position: absolute;
    top: 13px;
    right: 0;
    width: 10px;
    border-bottom: 2px solid #e8e8e8;
  }

  .footer-tabs__timeline .primary-box {
    min-height: 50px;
    padding: 15px;
    align-items: flex-start;
    margin-left: 20px;
    position: relative;
  }

  .footer-tabs__timeline .primary-box::before {
    content: "";
    position: absolute;
    top: 13px;
    left: -20px;
    width: 18px;
    border-bottom: 2px solid #e8e8e8;
  }

  .footer-tabs__timeline .primary-box .primary-text .anticon {
    margin-right: 5px;
    margin-top: -2px;
  }

  .footer-tabs__timeline .primary-box .default-text {
    margin-top: 3px;
    font-size: 12px;
  }


  /* .ant-tabs-nav-container {
    height: 60px;
  }

  .ant-tabs-nav-scroll {
    overflow: auto;
    height: 50px;
    display: flex;
    padding-left: 3px;
    align-items: flex-end;
  }

  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
    margin-right: 0px;
    background: #FFFEFB;
    padding: 0 20px;
    border: none;
    color: #bebebe;
  }

  .ant-tabs-tab-active {
    height: 50px;
    font-weight: 500;
    color: #2c3e50;
    margin-right: 3px;
    margin-left: 3px;
    background: #ffffff;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    box-shadow:-5px -5px 5px -4px rgb(0 0 0 / 10%),5px -5px 5px -4px rgb(0 0 0 / 10%);

  }

  .ant-tabs-tab-active::after {
    content: '';
    height: 2px;
    width: 30px;
    position: absolute;
    bottom: 0px;
    left: 0px;
    transform: translateX(50%);
    background: #F86F54;
  }

  .ant-tabs-nav .ant-tabs-tab {
    margin: 0;
  }

  .ant-tabs-nav-wrap {
    background: #FFFEFB;
  }

  .ant-tabs-tab {
    color: #bebebe;
  }

  .ant-tabs-tab:hover , .ant-tabs-tab:focus {
    color: pink;
  }

  .ant-tabs-nav .ant-tabs-tab-active {
    font-weight: 500;
    color: #2c3e50;
    margin-right: 3px;
    margin-left: 3px;
    background: #ffffff;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    box-shadow:-5px -5px 5px -4px rgb(0 0 0 / 10%),5px -5px 5px -4px rgb(0 0 0 / 10%);
    text-shadow: 0 0 0.25px currentColor;
  }

  .ant-tabs-nav .ant-tabs-tab:hover {
    color: #2c3e50;
  }

  .ant-tabs-ink-bar {
    position: absolute;
    bottom: 1px;
    left: 0;
    z-index: 1;
    box-sizing: border-box;
    width: 20;
    height: 2px;
    background-color: #F86F54;
    transform-origin: 0 0;
  } */



  
</style>
