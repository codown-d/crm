<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lone
 * @Date: 2021-11-07 21:29:42
 * @LastEditors: Lone
 * @LastEditTime: 2021-12-17 21:32:39
-->
<template>
    <div>
        <a-timeline class="my-timeline" v-if="show">
            <a-timeline-item
              v-for="(item, index) in showData"
              :title="item.data.activityTypeName"
              :key="index"
            >
              <div slot="dot" class="dot-bg flex">
                <span
                  class="material-icons"
                  style="font-size:18px"
                  v-if="item.objectType == 'note'"
                  >event_note</span
                >
                <span
                  class="material-icons"
                  style="font-size:18px"
                  v-if="item.objectType == 'activity'"
                  >local_cafe</span
                >
              </div>

              <div class="primary-box flex-column">
                <div
                  class="primary-text flex"
                  v-show="item.objectType == 'note'"
                >
                  <a-icon
                    :style="{ color: '#06A742' }"
                    theme="filled"
                    type="check-circle"
                  />
                  <span v-show="item.data.noteType"
                    >({{ item.data.noteTypeName }})</span
                  >
                  <span v-show="!item.isShowEdit">{{ item.data.content }}</span
                  ><!---->
                  <a-input
                    placeholder=""
                    v-show="item.isShowEdit"
                    v-model="item.data.editContent"
                  />
                  <span class="mgnLeftAuto" v-show="!item.isShowEdit"
                    ><!---->
                    <a-button @click="onHandleData(item, 'edit', 'note')">修改</a-button>
                    <a-button @click="onHandleData(item, 'del', 'note')">刪除</a-button>
                  </span>
                </div>
                <div v-show="item.isShowEdit">
                  <a-button @click="onHandleData(item, 'save', 'note')">存檔</a-button>
                  <a-button @click="onHandleData(item, 'cancel', 'note')">取消</a-button>
                </div>
                <div
                  class="primary-text flex"
                  v-show="item.objectType == 'activity'"
                >
                  <a-icon
                    :style="{ color: '#06A742' }"
                    theme="filled"
                    type="check-circle"
                  />
                  <span v-show="item.data.activityTypeName"
                    >({{ item.data.activityTypeName }})</span
                  >
                  <span>{{ item.data.activityNote }}</span>
                  <span class="mgnLeftAuto">
                    <a-button @click="editActivity(item)">修改</a-button>
                    <a-button @click="delActivity(item)">刪除</a-button>
                  </span>
                </div>

                <div class="default-text">
                  {{ item.timestamp }} • Tony Cheng
                </div>
              </div>
            </a-timeline-item>
        </a-timeline>
    </div>
    
</template>



<script>

export default {
    
    //  props: ['showData'],
    props: {
        showData : {
            type: Array,
            default: []
        },
        show: {
            type: Boolean,
            default: false
        }
    },
    data() {
      return{
      };
    },
    mounted() {
    //   console.log('my timeline mounted',this.showData);
    },
    watch: {
        show (newValue, oldValue) {
            if (newValue != oldValue && newValue) {
                console.log('my timeline mounted',this.showData);
            }
        }
    },
    computed: {
  
    },
    methods: {
        onHandleData (item, handleType, type) {
            this.$emit('handle', item, handleType, type)
        },
    },
}

</script>

<style scoped>

  .my-timeline {
    padding-left: 10px;
  }

  .my-timeline .dot-bg {
    width: 26px;
    height: 26px;
    border-radius: 13px;
    justify-content: center;
    border: 1px solid #d3d3d3;
    background: #F6F6FC;
    color: #8c8c8c;
    position: relative;
  }

  .my-timeline .dot-bg::after {
    position: absolute;
    top: 13px;
    right: 0;
    width: 10px;
    border-bottom: 2px solid #e8e8e8;
  }

  .my-timeline .primary-box {
    min-height: 50px;
    padding: 15px;
    align-items: flex-start;
    margin-left: 20px;
    position: relative;
  }

  .my-timeline .primary-box::before {
    content: "";
    position: absolute;
    top: 13px;
    left: -20px;
    width: 18px;
    border-bottom: 2px solid #e8e8e8;
  }

  .my-timeline .primary-box .primary-text .anticon {
    margin-right: 5px;
    margin-top: -2px;
  }

  .my-timeline .primary-box .default-text {
    margin-top: 3px;
    font-size: 12px;
  }

  .mgnLeftAuto{margin-left: auto;}

  .mgnLeft {
    margin-left: 1em;
  }

</style>