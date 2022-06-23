<template>
  <div class="modeCard">
    <div class="flex justify-between">
      <h1>modeCard</h1>
      <a-button @click="closeModelCard">關閉</a-button>
    </div>
    <a-input-search class="head mt-10" placeholder="搜索" @search="onSearch" /> 
    <div class="body flex-1 mt-10">
        <template v-for="(item,index) in modelList" :index="item">
            <div class="cell-item flex-between">
                <!-- //TODO: 範本點擊的應用 -->
                <div class="flex"><a-icon type="lock" />{{ item.title }}</div>
                <div class="edit-icon" @click="onEditModel(item.id)">
                    <a-icon type="edit" />
                </div>
            </div>
        </template>
    </div>
    <div class="foot flex-column">
        <div class="cell-item flex" @click="onEditModel(-2)">
        <a-icon type="plus" />將草稿儲存為範本...
        </div>
        <div class="cell-item flex" @click="modelManageShow = true">
        <a-icon type="edit" />管理範本
        </div>
    </div>
    

    <!-- 新增、修改範本彈窗 -->
      <a-modal v-model="modelShow" :title="modelTitle" :dialog-style="{ top: '0px' }"
               @ok="handleEditModelOk" @cancel="modelShow = false" ok-text="儲存" cancel-text="取消">
               <div class="flex-between">
                  <div class="flex-column">
                      <div>範本名稱</div>
                      <a-input type="text" placeholder=""  v-model="editModel.title"/>
                  </div>
                  <div class="flex-column">
                      <div>查看許可權</div>
                      <a-select default-value="1" style="width: 120px" @change="handleChange">
                          <a-select-option value="1">
                            私人
                          </a-select-option>
                          <a-select-option value="2">
                            已分享
                          </a-select-option>
                      </a-select>
                  </div>
               </div>
               <div class="flex-column mt-10">
                  <a-input type="text" placeholder="主題"  v-model="editModel.subject"/>
                  <div class="flex mt-10">
                     <div class="text-btn">插入欄位<a-icon type="caret-down" /></div>
                     <div class="text-btn">提議時間<a-icon type="caret-down" /></div>
                  </div>
                  <a-textarea placeholder="" :rows="6" v-model="editModel.content"/>
                  <div class="mt-10">富文本元件欄（占位元）</div>
               </div>
      </a-modal>

      <!-- 範本列表彈窗 -->
      <a-modal v-model="modelManageShow" title="管理電子郵件範本" 
               :dialog-style="{ top: '0px' }" :cancel-button-props="{ style: { display: 'none' } }"
               @ok="modelManageShow = false" @cancel="modelManageShow = false" ok-text="儲存" cancel-text="取消">
               <a-input-search class="head" placeholder="搜索" @search="onSearch" /> 
               <div class="modelModal-body flex-column">
                    <div class="body-head flex-between">
                        <div class="flex">
                            <a-button @click="onEditModel(-1)">新增範本</a-button>
                            <a-button v-if="selectModel.length">查看許可權</a-button>
                        </div>
                        <div v-if="selectModel.length"><a-button @click="onDelModel(-1)">刪除</a-button></div>
                    </div>
                    <div class="body-content flex-column">
                        <div>
                            <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">
                              全選
                            </a-checkbox>
                            名稱
                        </div>

                        <!-- <draggable v-model="list" animation="500"  force-fallback="true"  handle=".move"  
                                  @start="onStart" @end="onEnd" :move="checkMove"> 
                              <tr   v-for="item in modelList" :key="item"  >
                                  <td style="width:50px" class="move">{{item}}</td>
                                  <td style="width:250px">{{item}}</td>
                              </tr>
                        </draggable>  -->
                      
                        <a-checkbox-group class="modelModal-ckeckbox flex-column" v-model="selectModel" @change="onSelectModel">
                            <a-checkbox v-for="(item,index) in modelList" 
                                        :key="index" :value="item.id"
                                        class="flex"
                                        style="margin: 3px 0;">
                                        <div class="flex-between">
                                            <div class="flex-1" @click="onEditModel(item.id)">{{ item.title }}</div>
                                            <div class="flex-right">            
                                                  <a-icon type="delete" @click="onDelModel(item.id)"/>
                                                  <a-icon type="drag" />
                                            </div>
                                        </div>
                            </a-checkbox>
                      </a-checkbox-group>
                    </div>
               </div>
      </a-modal>
  </div>
</template>
<script>
export default {
  components: { },
  name: "ModelCard",
  props: {
    // msg: String,
  },
  data() {
    return {
      modelShow: false,
      modelManageShow: false,
      indeterminate: true,
      checkAll: false,
      selectModel: [],
      currentModelId: '',
      modelTitle: '新增範本',
      editModel:{
        title: '',
        type: 1,
        subject: '',
        content: ''
      },
      isModelCardShow:false,
    }
  },
  computed: {
    modelList () {
      console.log(this.$store.state.mail.modelData);
      return this.$store.state.mail.modelData
    },
  },
  mounted () {
  },
  methods: {
      handleEditModelOk () {
        let tmpItem = { ...this.editModel }
        if (!tmpItem.title.length || !tmpItem.subject.length || !tmpItem.content.length) return this.$message.warning('請檢查輸入');
        this.onSaveEditModel();
      },
      // handleModelListOk () {

      // },
      onSelectModel (selectModel) {
        this.indeterminate = !!selectModel.length && this.selectModel.length < this.modelList.length;
        this.checkAll = this.selectModel.length === this.modelList.length;
      },
      onCheckAllChange(e) {
        Object.assign(this, {
          selectModel: e.target.checked ? this.modelList : [],
          indeterminate: false,
          checkAll: e.target.checked,
        });
      },
      handleChange () {//todo: 範本許可權

      },
      onEditModel (id) {

        this.currentModelId = id;
        this.modelTitle = id < 0 ? '新增範本' : '編輯範本';
        console.log(id, id == undefined, this.modelTitle);
        this.modelShow = true;
        this.modelManageShow = false;
        if (id == -1) {//新增範本
          this.editModel = {
            title: '',
            type: 1,
            subject: '',
            content: ''
          }
          
        } else if (id == -2) {//將草稿保存為範本
          this.editModel = {
            title: '',
            type: 1,
            subject: this.composeData.headers.Subject,
            content: this.composeData.Message
          }
        } else {
          let modelItem = this.modelList.find(item => item.id == id);
          this.editModel = { ...modelItem }
        }
      },
      onSaveEditModel () {
        // console.log(this.currentModelId);
        this.$store.dispatch('mail/editModel', [this.currentModelId, this.editModel]).then(res => {
              if (!res) this.$message.error(`${ this.currentModelId < 0 ? '添加' : '修改'}失敗`);
              this.$message.success(`${ this.currentModelId < 0 ? '添加' : '修改'}成功`);
              this.modelShow = false; 
        });
      },
      onDelModel (id) {
        // this.$message.warning('點擊了刪除，開發中');

        //fix: CheckBox group 點擊title 不選中的處理
        //fix: 全選按鈕的bug
        this.$store.dispatch('mail/delModel', id < 0 ? this.selectModel : id).then(res => {
              if (!res) this.$message.error('刪除失敗');
              this.$message.success('刪除成功') 
        })
        
      },
      closeModelCard(){
          this.isModelCardShow = false
          this.$emit('onModelCardShow', this.isModelCardShow);
      },
      onSearch () {
          
      }
  
  
  
  },
};
</script>

<style>

/* //範本管理部分樣式 */
.modelModal-body {
    margin: 0;
}

.modelModal-body .body-head {
  margin: 15px 0;
}

.modelModal-body .body-content {
  max-height: 200px;
  overflow: scroll;
  width: 100%;
}

.modelModal-ckeckbox {
  width: 100%;
}


/* 範本按鈕部分 */

.modelCard .model-btn--modal {
  position: absolute;
  bottom: -260px;
  left: 0;
  width: 240px;
  height: 350px;
  background: #ffffff;
  z-index: 999;
  border-radius: 6px;
  box-shadow: 0 0 3px 1px #cbcccd, 0 3px 2px rgb(38 41 44 / 8%);
  padding: 10px 0;
}

.modelCard .model-btn--modal .head {
  padding: 0 10px;
  flex: 1
}

.modelCard .model-btn--modal .head .anticon {
  margin-right: 10px;
}

.modelCard .model-btn--modal input {
  border: 1px solid #d9d9d9 !important;
  margin: auto
}

.modelCard .model-btn--modal .body {
  /* background: red; */
  height: 160px;
  border-bottom: 1px solid #dedede;
  width: 100%;
  overflow: scroll;
  overflow-y:visible;
  scrollbar-face-color :  #20a774 ; /*移動滑塊顏色*/
  scrollbar-shadow-color :  #20a774 ; /*移動滑塊邊框顏色*/
  scrollbar-track-color :  #ccc ; /*背景顏色*/
  scrollbar-arrow-color :  #ddd ; /*箭頭顏色*/
}

/* //todo: body區域滑塊  */

.modelCard .model-btn--modal .foot {
  /* background: pink; */
  height: 60px;
  width: 100%
}

.modelCard .model-btn--modal .cell-item {
  width: 100%;
  /* background: red; */
  height: 30px;
  padding: 0 10px;
}

.modelCard .model-btn--modal .cell-item .edit-icon {
  display: none;
  height: 20px;
  width: 20px;
  background: #ffffff;
  /* text-align: center; */
  /* margi-left: */
  color: #000000 !important;
  position: relative
}

.modelCard .model-btn--modal .cell-item .edit-icon .anticon {
  /* margin:0 auto; */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}

.modelCard .model-btn--modal .cell-item .anticon {
  margin-right: 10px;
}

.modelCard .model-btn--modal .cell-item:hover {
  /* background: #fc603250; */
  background: #F6F6FC;
  color: #F86F54;
}

.modelCard .model-btn--modal .cell-item:hover .edit-icon {
  display: block;
}
</style>

<style scoped>
.modeCard {
  width: 100%;
  padding: 10px;
}
</style>