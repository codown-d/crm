
<template>
  <div class="infoUI flex-column">
      <div class="infoUI-box flex-column">
          <div class="infoUI-title flex">
              <div class="title">筆記</div>
          </div>
          <div class="infoUI-body flex-column">
              <div class="default-text">Content of 筆記</div>           
          </div>
      </div>

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
      </a-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tabsArray_1: [],

    };
  },
  methods: {
   
  },
  mounted () {
    ['全部','活動','筆記','電子郵件','檔','交易','更新日誌'].forEach(item => {
        this.tabsArray_1.push({
          name: item,
          content: `Content of ${item}`
        })
    });

  },
};
</script>

<style>
  .infoUI {
    height: 100%;
    width: 100%;
  }

  .infoUI .flex-column {
    align-items: flex-start;
  }

  .infoUI-box {
    padding: 20px;
    border-bottom: 1px solid #e8e8e8;
  }

  .infoUI .flex {
    justify-content: space-between;
  }

  .infoUI-title {
    width: 100%;
  }

  .infoUI-title .title {
    font-size: 18px;
    font-weight: 600;
    color: #F7A84A;
  }

   .infoUI-title button{
     margin-left: 10px;
   }

   .infoUI-body {
     font-size: 15px;
     line-height: 1.8;
     width: 100%;
   }

   .infoUI-foot {
     padding: 10px 10px 10px 20px;
     margin-top: 15px;
     width: 100%;
   }

   .flex-between {
     justify-content: space-between;
     width: 100%;
   }
</style>
