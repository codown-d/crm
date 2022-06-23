<!--
 * @Descripttion: 聯絡人模組標籤樹
 * @version: 
 * @Author: Lone
 * @Date: 2021-12-27 20:30:52
 * @LastEditors: Lone
 * @LastEditTime: 2022-05-10 19:23:20
-->
<template>
    <div class="tagsTreeUI flex-column" style="padding: 20px 10px;">

        <!-- 標籤樹主體功能區域 -->
        <div class="tagsTreeUI-tree flex-column">
            
            <div class="tree-title flex-between padding-tb-10">
                <div class="flex">
                    <a-icon type="tags" />
                    <div class="marginLft-5 font-16">按標籤查找</div>
                </div>
                <a-icon type="setting" />
                <a-icon type="double-left" @click="tagesHandle" />
            </div>

            <!-- //標籤搜索框 -->
            <a-input-search style="margin-bottom: 8px" placeholder="搜索標籤" allow-clear @change="onTagsTreeSearchChange" />

            <div class="tree-tabs flex-between">
                <div class="flex">
                    <a-button class="typeBtn flex-center" v-for="(item, index) in tagTypeList" :key='index' v-show="item.typeCode == type"
                            :class="{'btn-focus': index === activeIndex}" 
                            @click='tagTypeChange(item, index)'>
                                <a-icon :type="typeListIcon[index]" />
                    </a-button>
                </div>
                <a-button class="typeBtn flex-center" style="margin-right: 0px" @click='addParentTag()'><a-icon type="plus" /></a-button>
            </div>

            <!-- 標籤樹，文檔地址: https://www.antdv.com/components/tree-cn/  -->
            <a-spin :spinning="tagsTreeLoading">
                <div class="tree-content flex-1">
                    <div v-if="treeDataList.length">
                        <a-tree
                            :tree-data="treeDataList"
                            @expand="onExpand"
                            :blockNode="true"
                            :showIcon="true"
                            :selectedKeys="selectedTag"
                            :expandedKeys="expandedKeys"
                            :autoExpandParent="autoExpandParent"
                            >
                                <template slot="title" slot-scope="item">
                                    <div class="tree-view-item">
                                        <div class="tree-view-left flex-1" @click="onSelectedTreeItem(item.id)">
                                            <span v-if="item.title.indexOf(searchValue) > -1">
                                                {{ item.title.substr(0, item.title.indexOf(searchValue)) }}
                                                <span style="color: #f50">{{ searchValue }}</span>
                                                {{ item.title.substr(item.title.indexOf(searchValue) + searchValue.length) }}
                                            </span>
                                            <span v-else>{{ item.title }}</span>
                                        </div>
                                        <div class="tree-view-right flex-center">
                                            <a-dropdown :trigger="['hover']">
                                                <a-menu slot="overlay">
                                                    <a-menu-item key="1" class="flex-column" @click='addTag(item)' v-if="item.level < 3"> 
                                                        新增子標籤 
                                                    </a-menu-item>
                                                    <a-menu-item key="2" class="flex-column" @click='editTag(item)'> 
                                                        編輯標籤
                                                    </a-menu-item>
                                                    <a-menu-item key="3" class="flex-column" @click='delTag(item)'> 
                                                        刪除標籤
                                                    </a-menu-item>
                                                </a-menu>
                                                <a-icon type="ellipsis" style="color: #939393"/>
                                            </a-dropdown>
                                        </div>
                                    </div>
                                </template>
                        </a-tree>
                    </div>
                    <div v-else class="mt-15 center tagsTreeUI-null">
                        <div class="font-16 gray-text">沒有標籤資料</div>
                        <a-button type="link" @click='addParentTag()'>新增標籤</a-button>
                    </div>
                </div>
            </a-spin>
        </div>

        <a-modal v-model="tagVisible" :title="tagModelText" okType="danger" :dialog-style="{ top: '0px' }"
                ok-text="確認" cancel-text="取消" @ok="tagHandleOk">
            <a-form-model :model="formTags" ref="formTags" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-model-item label="名稱" prop='name'>
                    <a-input :maxLength='10' v-model="formTags.name" />
                </a-form-model-item>
                <!-- <a-form-model-item label="顏色" prop='color'>
                    <a-input :maxLength='10' v-model="formTags.color" />
                </a-form-model-item>
                <a-form-model-item label="icon" prop='icon'>
                    <a-input :maxLength='10' v-model="formTags.icon" />
                </a-form-model-item> -->
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>

import myButton from '@/components/Common/myButton';
import treeData from "./treeData";
let { gData, getParentKey } = { ...treeData }; 

// todo: 研究antdvue tree節點的資料的結構、搜索節點的方法 
export default {
    components: {
        myButton,
    },
    data() {
        return {
            expandedKeys: [],
            searchValue: '',
            autoExpandParent: true,
            gData,
            typeListIcon: ['user', 'gold', 'calendar', 'like'],
            treeDataList: [],
            activeIndex: 0,
            tagModelText: '新增標籤',
            tagVisible: false,
            labelCol: { span: 4 },//formTags
            wrapperCol: { span: 14 },//formTags
            formTags: {
                name: '',
                color: '',
                icon: ''
            },
            rules: {
                 name: [{ required: true, message: '請輸入標籤名', trigger: 'blur' }],
            },
            nodeData: null,
            dialogType: 'add',
            currentPage: 1,
            tagsTreeLoading: false,
            selectedTag: []
        }
    },
    props: {
        tagTypeList: {
            type: Array,
            default: () => []
        },
        type: {
            type: String,
            default: 'customer'
        }
    },
    computed: {
        userInfo() {
            let userInfo = this.$store.state.user.userInfo;
            return userInfo;
        }, 
	},
    watch: {
        tagTypeList: {
            immediate: true,
            handler(val, oldVal) {
                // console.log('tagTypeList',val)
                if (val && val.length) {
                    this.activeIndex = val.findIndex(p => p.typeCode == this.type);
                    this.getTreeData({bizTypeCode: val[this.activeIndex].typeCode});
                }
            }
        }
    },
    mounted() {
       
    },
    methods: {
        tagHandleOk() {
            let param = {
                ...this.formTags,
            }
            this.$refs.formTags.validate(valid => {
                if (valid) {
                    if (this.dialogType === 'add') {

                        if (!this.nodeData) {
                            param.bizTypeCode = this.tagTypeList[this.activeIndex].typeCode
                        } else {
                            param.parentId = this.nodeData.id
                            param.bizTypeCode = this.tagTypeList[this.activeIndex].typeCode;
                        };
                        param.type = this.type;                      
                        this.$api.tags.addBizTag(param).then(res => {
                            // console.log('addBizTag', res);
                            if (res.success) {
                                this.$message.success('新增成功')
                            }
                        this.tagVisible = false
                        this.getTreeData({bizTypeCode: this.tagTypeList[this.activeIndex].typeCode});
                    })
                    } else if (this.dialogType === 'edit') {
                        param.id = this.editFormTags.id
                        this.$api.tags.updateBizTag(param).then(res => {
                            if (res.success) {
                                this.$message.success('修改成功')
                            }
                            this.tagVisible = false
                            this.getTreeData({bizTypeCode: this.tagTypeList[this.activeIndex].typeCode})
                        })
                    }          
                }
            })
        
        },
        tagTypeChange(item, index) {
            this.activeIndex = index
            this.getTreeData({bizTypeCode: item.typeCode})
            this.$emit('onTagTypeChange', item.typeCode);
            // console.log('标签类型切换后', this.$store.state.main.bizTypeCode);
        },
        formatTreeData(list, level) {
            level++;
            return  list.map(item => {
                    item.key = item.id
                    item.title = item.name
                    item.children = item.bizTagVoList
                    item.scopedSlots = { title: 'custom' }
                    item.level = level
                    if (item.bizTagVoList&&item.bizTagVoList.length) {
                        this.formatTreeData(item.bizTagVoList, level)
                    }
                    return item
            })
        },
        async getTreeData(params) {
            this.tagsTreeLoading = true;
            params.type = this.type;
            this.$api.tags.queryListByBizTypeCode(params).then(res => {
                this.tagsTreeLoading = false;
                if (!res.success) return this.$message.error(`${ res.message || '獲取標籤資料失敗！' }`, 2);
                // console.log('queryListByBizTypeCode', res);
                this.treeDataList = this.formatTreeData(res.data, 0);
                // console.log('最後的樹結構資料', this.treeDataList);
                this.$store.commit('main/SET_TAGS_DATA', res.data);
                this.$store.commit('main/SET_TAGS_TREE_DATA', this.treeDataList);
                this.$store.commit('main/SET_TAGS_TYPE', params.bizTypeCode);
            })
        },
        addParentTag() {
            this.tagVisible = true
            this.dialogType = "add"
            this.nodeData = null
            this.$nextTick(() => {
                this.$refs.formTags.resetFields()
            })
        },
        addTag(item) {
            this.dialogType = "add"
            this.tagVisible = true
            this.nodeData = item
            this.$nextTick(() => {
                this.$refs.formTags.resetFields()
            })
        },
        editTag(item) {
            let param = {
                name: item.name,
                color: item.color,
                icon: item.icon,
            }
            this.$refs.formTags.resetFields()
            this.formTags = Object.assign({}, param)
            this.editFormTags = item
            this.dialogType = "edit"
            this.tagVisible = true
        },
        delTag(item) {
            // console.log(item);
            let { id } = { ...item };
            this.$api.tags.deleteBizTagByIds([id]).then(res => {
                // console.log('刪除標籤返回的結果', res);
                if (!res.success) return this.$message.error(`${ res.message || '刪除失敗'}`, 2);
                this.$message.success('刪除成功');
                this.getTreeData({bizTypeCode: this.tagTypeList[this.activeIndex].typeCode})
            })
        },
        onExpand(expandedKeys) {
            this.expandedKeys = expandedKeys;
            this.autoExpandParent = false;
        },
        onTagsTreeSearchChange(e) {// fix: 标签搜索，自动展开父节点。
            const value = e.target.value;
            const expandedKeys = this.treeDataList
                .map(item => {
                if (item.title.indexOf(value) > -1) {
                    return getParentKey(item.key, this.treeDataList);
                }
                return null;
                })
                .filter((item, i, self) => item && self.indexOf(item) === i);
            Object.assign(this, {
                expandedKeys,
                searchValue: value,
                autoExpandParent: true,
            });
        },
        onSelectedTreeItem(id) {
            // console.log('onSelected', id);
            this.selectedTag = [];
            this.selectedTag.push(id);
            this.$emit('onSelected', id)
        },
        tagesHandle() {
            this.$emit('onShowTages')
        }
    },
};

</script>

<style lang="less">

.tagsTreeUI {
    .ant-tree li .ant-tree-node-content-wrapper {
        width: calc(100% - 24px);
        .ant-btn {
            padding: 0 3px;
            color: #f97358;
        }
    }
    .btn-focus {
        color: #40a9ff;
        border-color: #40a9ff;
    }
}
</style>

<style lang="less">


    .tagsTreeUI {

        .ant-tree li .ant-tree-node-content-wrapper {
            font-size: 20px;
            height: 30px;
            // padding-right: 5px;
        }

        /* 标签树选中的样式 */
        .ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected {
            background-color: #f7f7f7;
            color: #f86f54;
            font-weight: 600;
        }

        /* 标签树hover的样式 */
        .ant-tree li .ant-tree-node-content-wrapper:hover {
            background-color: #f7f7f7;
        }

        /* 標籤樹部分 */
        .tagsTreeUI-tree {
            height: 100%;
            .tree-tabs {
                padding: 5px 0px;
            }
            .tree-title {
                /* height: 30px; */
            }
            .tree-content {
                height: 100%;
                overflow: scroll;
                font-size: 16px;
            }
        }

        /* 歷史瀏覽記錄部分 */
        // .tagsTreeUI-history {
        //     max-height: 25%;
        //     .history-content {
        //         overflow: scroll;
        //         max-height: calc(100% - 44px)
        //     }
        //     .history-item {
        //         height: 28px;
        //         line-height: 28px;
        //         .anticon {
        //             vertical-align: 0.6px;
        //             margin-right: 8px;
        //         }
        //     }
        //     .history-item:hover {
        //         color: #f50
        //     }
        // }
        &-null {
            min-height: 200px;
            padding-top: 60px;
        }
    }
    .tree-view-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1px 8px 5px 0px;
        .tree-view-right {
            // background: red;
            font-weight: 600;
            .anticon {
                font-size: 16px;
            }
        }
        div span {
            line-height: 30px;
        }
    }

    
.typeBtn {
  /* height: calc((100vh - 200px)/3); */
  border: 0;
  background: #e4e4e4;
  padding: 2px;
  border-radius: 20px;
  margin-right: 0.5em;
  width: 28px;
  height: 28px;
}

.typeBtn.ant-btn {
  width: 28px;
  font-size: 10px;
  padding: 0px;
}

.cursor-pointer {
    cursor:pointer;
}


</style>
