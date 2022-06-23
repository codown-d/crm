<!--
 * @Descripttion: 聯絡人模組
 * @version: 
 * @Author: Lone
 * @Date: 2021-12-27 20:30:52
 * @LastEditors: Lone
 * @LastEditTime: 2022-05-10 17:24:36
-->
<template>
	<div class="companyUI padding-20 flex">
        <div v-if="showTages" class="tags-tree-black">
				<a-icon type="double-right" @click="showTages = !showTages" />
			</div>
		<!-- 標籤樹結構 -->
		<TagsTree
			class="tags-tree"
            v-if="!showTages"
            type="company"
            ref="tags-tree"
			:tagTypeList="tagTypeList"
            :selected="selectedTagsId"
            @onTagTypeChange="onTagTypeChange"
			@onSelected="onTagsSelected"
            @onShowTages="() => { showTages = !showTages }"
		/>

		<!-- 聯絡人主體部分 -->
		<div class="company-content flex-1">
			<!--  聯絡人title區域 -->
			<div class="company-content__header flex-between">
				<div class="flex-center">
					<div class="flex marginRgt-10">
						<div class="font-24 companyUI-title--big">全部檢索</div>
					</div>
					<myButton v-if="excutePermission(companyManage.add)" class="marginRgt-10" @click="editCompany('add', '')" icon="plus" text="公司" theme="orange" isRound="true"/>

                    <!-- todo: 选中组织后，点击刷新按钮，选中的值已经为空，但是table还是会选中。 -->
                    <myButton class="marginRgt-10" icon="reload" :isIconBtn="true" @click="getTableData({}, true)" />

                    <!-- //todo: 解決點擊空白處，隱藏添加標籤的彈窗！ -->
					<a-popover placement="rightTop" trigger="click" :visible="isUseTagShow" :overlayStyle="{ width: '300px' }">
						<template slot="title">
							<div class="flex-between">
								<span>貼標籤</span>
								<a-icon type="close" @click="onUseTagHide" />
							</div>
						</template>
						<template slot="content">
                            <a-spin :spinning="isUsingTags" tip="貼標籤中...">
                                <div v-if="tagTypeList.length && tagsTreeData.length" class="personsUI-tags-card">
                                    <a-tree
                                        checkable
                                        checkStrictly
                                        :expanded-keys="expandedKeys"
                                        :auto-expand-parent="autoExpandParent"
                                        :tree-data="tagsTreeData"
                                        @expand="onExpand"
                                        :blockNode="true"
                                        @check="onCheckTag"
                                        :checkedKeys="selectedTags"
                                        :defaultExpandAll="true"
                                    >
                                        <template slot="custom" slot-scope="item">
                                            <div class="tree-view-item">
                                                <div class="tree-view-left" @click="onSelectTag(item.id)">
                                                    <span>{{ item.title }}</span>
                                                </div>
                                            </div>
                                        </template>
                                    </a-tree>
                                </div>
                                <div v-else class="personsUI-tags-card--null flex-center gray-text" style="height: 60px;">
                                    無標籤資料，請切換標籤類型或新增標籤
                                </div>
                                <div class="flex-right">
                                    <a-button @click="onAddTags" v-if="!tagsTreeData.length">去新增標籤</a-button>
                                    <a-button @click="handleuseTags" :loading="isUsingTags" v-if="tagsTreeData.length">儲存</a-button>
                                </div>
                            </a-spin>
						</template>
						<myButton class="marginRgt-10" @click="onUseTagShow" text="貼標籤" v-if="selectedCompany.length" />
					</a-popover>

					<myButton v-if="selectedCompany.length && excutePermission(companyManage.delete)" class="marginRgt-10" @click="delCompany" text="刪除" />
				</div>

				<!-- <myButton icon="ellipsis" :isIconBtn="true" /> -->
			</div>

			<!-- 聯絡人table區域 -->
			<div class="company-content__box flex-column-between">
				<div class="company-content__box--table default-scrollbar flex-1">
					<a-table
                    class="dealsUI-table"
						:columns="columns"
						:data-source="companyData"
						:pagination="false"
						:row-selection="rowSelection"
						:expanded-row-keys.sync="expandedRowKeys"
						:loading="isTableLoading"
						size="small"
                        :scroll="{ x: 'max-content' }"
                        :rowKey="record => record.id"
						@onTagTypeChange="onTagTypeChange"
						@onShowTages="() => { showTages = !showTages }"
					>
						<div slot="name" slot-scope="name, record">
							<div class="flex pointer">
								<a-button type="link" @click="showDrawer(record)">{{ record.name }}</a-button>
							</div>
						</div>

                        <span slot="tags" slot-scope="tags, record" class="flex-center" style="overflow: hidden">
							<div v-for="(tag, index) in record.tags" :key="index">
								<a-tag style="margin-right: 3px" color="orange" v-if="tag && tag.name">{{ tag.name }}</a-tag>
							</div>
						</span>

                        <div slot="foundDate" slot-scope="text, record">
                            <span v-if="text">{{ text | filterTime(text) }}</span>
                        </div>

					</a-table>
				</div>

				<div class="company-content__box--footer marginTop-15">
					<a-pagination
                        v-if="pagination.total > pagination.size"
						:total="pagination.total"
						:page-size="pagination.size"
						v-model="pagination.current"
						@change="onPageChange"
					/>
				</div>
                
			</div>
		</div>

		<a-modal :title="addModelTit" :visible="isAddCompanyShow" :confirm-isTableLoading="confirmLoading" :footer="null" @cancel="handleCancel" :dialog-style="{ top: '0px' }" width="750px">
            <AddCompany :formEdit="companyEdit" :msg="addModelTit" @handleOk="handleOk" @handleCancel="handleCancel" />
        </a-modal>

        <myDrawer ref="myDrawer" :detailData="currentData" moduleType="company" @updateCompanyList="getTableData({}, true)"></myDrawer>
	</div>
</template>

<script>
import columns from './config.js'
import TagsTree from '@/components/Common/tagsTree/index'

import myDrawer from './components/public/myDrawer'
import myButton from '@/components/Common/myButton'
import ServiceApi from '@/services/company'
import AddCompany from './components/AddCompany.vue'
// import manageTags from '@/components/Customer/ManageTags'
import Api from '@/services/api'
import { mapGetters } from 'vuex';

import moment from 'moment'

export default {
    name: 'Company',
    props: ['tagsData'],
    components: {
        AddCompany,
        myButton,
        myDrawer,
        TagsTree
    },
	data() {
		return {
			showTages: false,
			columns,
            expandedRowKeys: [],

            selectedCompany: [], //table中已選擇的用戶
            selectedCompanyData: [], //table中已選擇的用戶
            selectedTags: [], //存儲添加的標籤

            isDrawerShow: false,
            isAddCompanyShow: false,
            addModelTit: '新增公司',
            companyEdit: {},
            confirmLoading: false,

            isTableLoading: false,
            companyData: [],
            isAddCustomerShow: false,

            currentData: {},

            pagination: {
                total: 0,
                size: 10,
                current: 1
            },

            tagTypeList: [],
            isUseTagShow: false, //是否顯示貼標籤的popover

            selectedTagsId: -1, // 是否是選擇了標籤去查詢使用者清單的標記
            expandedKeys: [],
			autoExpandParent: true,
            bizTypeCode: 'customer',
            isUsingTags: false
		}
	},
    created() {
        // this.getTableData()
        // this.getTagType()
    },
    computed: {
        ...mapGetters([
            'permissions',
            'companyManage'
        ]),
        rowSelection() {
            return {
                selectedRowKeys: this.selectedCompany,
                onChange: (selectedRowKeys, selectedRows) => {
                    this.selectedCompany = selectedRowKeys
                    this.selectedCompanyData = selectedRows
                },
                getCheckboxProps: (record) => ({
                    //重點部分
                    props: {
                        //defaultCheckedId裡面是默認選中的id，判斷是否含有這些id，有的那就選中，沒有的就不選中
                        defaultChecked: this.selectedCompany.indexOf(record.key) > -1 ? true : false,
                        key: record.key + '', //使得id的資料類型為string
                    },
                }),
            }
        },
        tagsTreeData() {
			return this.$store.state.main.tagsTreeData
		},
    },
    updated() {
        // 表格斑馬行顯示
        this.renderStripe()
    },
    watch: {
        bizTypeCode: {
            immediate: true,
            deep: true,
            handler(newValue, oldValue) {
                // console.log('监听bizTypeCode', newValue, oldValue);
                if (newValue != oldValue) {
                    this.getTableData({}, true, newValue);
                }
            }
        }
    },
    mounted () {
        this.getTableData()
        // this.getTagType();
    },
    activated() {
        this.getTagType()
        if (this.isUseTagShow) this.isUseTagShow = false; 
	},
    deactivated() {
        if (this.isUseTagShow) this.isUseTagShow = false; 
    },
    methods: {
        onAddTags() {
            if (this.isUseTagShow) this.onUseTagHide();
            this.$refs['tags-tree'].addParentTag(); 
        },
        getTagType() {
			this.$api.tags.queryList({ type: 'company' }).then(res => {
				// console.log("queryList", res);
				// this.$util.console(res, 'tags queryList返回的結果');
				if (!res.data.length) return this.$message.error('獲取標籤類型資料失敗！')
				this.tagTypeList = res.data
			})
		},
        excutePermission(key) {
			let flag = false;
			this.permissions.forEach(e => {
				e.permissionDetailVoList.forEach(ee => {
					if (ee.permissionCode === key) {
						flag = ee.rolePermissions;
					}
				});
			});
			return flag;
		},
        // 表格斑馬行顯示
        renderStripe() {
            const table = document.getElementsByClassName('ant-table-row')
            if (table.length > 0) {
                const rowList = [...table]
                rowList.map((row, index) => {
                    if (index % 2 !== 0) {
                        row.style.backgroundColor = '#f9f9f9'
                    } else {
                        row.style.backgroundColor = '#ffffff'
                    }
                })
            }
        },
        setVisitRecord(record) {
            let param = {
                customerId: record.id,
                customerName: record.name,
            }
            this.$api.customer.addBrowseRecord(param).then((res) => {
                console.log('addBrowseRecord', res)
            })
        },

        async getTableData(data = {}, isInit = false, code = null) {
            const { pageNum = 1, pageSize = 10 } = data
            const params = {
                pageNum: pageNum,
                pageSize: pageSize,
                param: {
                    bizTypeCode: code || this.bizTypeCode
                },
                
			}
			if (isInit) this.selectedTagsId = -1
			if (this.selectedTagsId != -1) {
                params.param.tagId = this.selectedTagsId;
            };
            this.isTableLoading = true
            const res = await ServiceApi.companyList(params)
            this.isTableLoading = false

            if (!res.success) return this.$message.error(res.message || '獲取公司列表失敗！');
            
            this.companyData = res.data.list || [];

            const pagination = { ...this.pagination }
            pagination.total = res.data.totalCount || 0;
            this.isTableLoading = false;
            this.pagination = pagination;
            this.pagination.current = pageNum;

            if (isInit) {
                this.selectedCompanyData = [];
                this.selectedCompany = [];
                this.selectedTags = [];
                this.$refs['tags-tree'].selectedTag = [];
                this.$forceUpdate();
            }
        },

        onTagsSelected(id) {
			//todo: 取消查詢tagId的用戶列表
			// console.log('標籤樹組件，選中的id', id);
			// alert(`子組件選中了： ${key}`);
            if (id == null || this.selectedTagsId == id) return this.getTableData({}, true);
			this.selectedTagsId = id
			this.getTableData()
		},

        onTagTypeChange(code) {
            // console.log('切换了标签类型: ', code);
            this.bizTypeCode = code
        },

        onPageChange(currentPage) {
            this.getTableData({
                pageNum: currentPage,
                pageSize: this.pagination.size,
            }, true)
		},

        showDrawer(record) {
            this.currentData = record
            this.$nextTick(() => {
                this.$refs.myDrawer.visible = true
            })
        },

        editCompany(editType, record) {
            if (editType == 'add') {
                this.addModelTit = '新增公司'
                this.companyEdit = {
                    name: '',// 公司名称
                    ownerUser: '',// 上级
                    companyCode: '',// 统一编号
                    foundDate: '',// 成立日期
                    industrial: '',// 产业类型
                    sales: '',// 营业额
                    staffCount: '',// 员工人数

                    phone: '',// 电话
                    fax: '',// 传真
                    address: '',// 地址
                    email: '',// Email
                    website: '',// 网址
                    socialAccount: '',//FB粉丝专页
                    socialAccountType: '',
                    // gmt_create: '',
                    // gmt_modified: '',
                    latitude: '',
                    longitude: '',

                    remark: '',// 备注
                }
            } else {
                this.addModelTit = '編輯公司'
                let tmpRecord = { ...record }
                tmpRecord.editType = 'edit'
                this.companyEdit = tmpRecord
            }
            this.companyEdit.editType = editType
            this.isAddCompanyShow = true
        },

        //刪除公司
        delCompany() {
            let delCompanyArry = [] //刪除公司名單
            this.selectedCompanyData.forEach((item) => {
                delCompanyArry.push(item.id)
            })

            let str = ''
            let selectedCompanyData = this.selectedCompanyData //已選客戶名單
            selectedCompanyData.forEach((item) => {
                str += '公司-' + item.name + '/ '
            })

            let that = this
            this.$confirm({
                title: '確認刪除公司嗎?',
                content: str,
                okText: '確認刪除',
                okType: '取消',
                cancelText: '取消',
                onOk() {
                    return new Promise((resolve, reject) => {
                        ServiceApi.deleteCompany({
                            param: { ids: delCompanyArry },
                        }).then((res) => {
                            if (res.success != true) {
                                resolve(false)
                                that.$message.error('網路請求失敗')
                            } else {
                                that.$message.success('刪除成功！')
                                that.selectedCompanyData = []
                                that.selectedCompany = []
                                that.handleOk()
                                resolve(true)
                            }
                        })
                    })
                },
                onCancel() {
                    console.log('Cancel')
                },
            })
        },
        handleOk(e) {
            this.confirmLoading = true

            setTimeout(() => {
                this.isAddCompanyShow = false
                this.confirmLoading = false
                this.getTableData()
            }, 200)
        },
        handleCancel(e) {
            this.isAddCompanyShow = false
        },

        onClose() {
            this.isDrawerShow = false
        },
        //Drawer end
        //tabs start
        callback(key) {
            console.log(key)
        },
        //tabs end
        edit(text, record, index) {
            //info: 點擊table
            console.log(text)
            console.log(record)
            console.log(index)
        },

		onUseTagShow() {
			if (!this.selectedCompany.length) return this.$message.warning('還未選擇任何公司！')
			// console.log('選擇的使用者ID陣列為：', this.selectedCompany);
			// 以下是選中用戶已經有的標籤
			if (this.selectedCompany.length == 1) {
				let company = this.companyData.find(item => item.id == this.selectedCompany[0])
				// console.log('選擇的用戶為：', customer);
                if (company.bizTags && company.bizTags.length) {
                    let tags = company.bizTags.map(i => {
                        return i.id
                    })
                    // console.log('處理完的用戶的標籤ID為：', tags);
                    this.selectedTags = tags
                }
                // if (this.$store.state.main.tagsType == "company") this.selectedTags = [];
				this.$forceUpdate()
			} else if (this.selectedCompany.length > 1) {
				// todo: 如果是多個用戶的時候，如何處理用戶的默認已有的標籤？
			}
			this.isUseTagShow = true;
            // console.log('勾選結束的標籤數據為', );
			this.$forceUpdate()
		},
		onSelectTag(e) {
			if (this.selectedTags.includes(e)) {
				let eIndex = this.selectedTags.findIndex(i => i == e)
				this.selectedTags.splice(eIndex, 1)
			} else {
				this.selectedTags.push(e)
			}
		},
		onCheckTag(checkedKeys) {
			// console.log(checkedKeys);
			// this.selectedTags = [].concat(checkedKeys.checked[checkedKeys.checked.length - 1]);// 設置單選
			this.selectedTags = checkedKeys.checked
			// console.log(this.selectedTags);
		},
		onUseTagHide() {
			this.selectedTags = []
			this.isUseTagShow = false
		},
        async handleuseTags() {
            this.isUsingTags = true;
            let params = {
                bizTagIds: this.selectedTags,
                bizTypeCode: this.bizTypeCode,
                bizIds: this.selectedCompany,
                type: 'company'
            };
            
			this.$api.tags
					.addBizTagsByTagNamesOrIds(params)
					.then(res => {
						this.isUsingTags = false;
                        if (!res.success) return this.$message.error('貼標籤失敗', 2)
                        // console.log('promise all', result);
                        this.$message.success('貼標籤成功')
                        this.onUseTagHide()
                        this.getTableData({}, false)
                        this.selectedCompanyData = []
                        this.selectedCompany = []
                        this.selectedTags = []
                        this.$forceUpdate()
					})
					.catch(err => {
						this.$message.success('貼標籤成功')
					})
		},
		onExpand(expandedKeys) {
			this.expandedKeys = expandedKeys
			this.autoExpandParent = false
		},
    },
    filters: {
		filterTime(time) {
			return moment(time).format('YYYY年MM月DD日')
		},
	},
}
</script>

<style scoped lang="less">
.companyUI {
	height: 100%;
	width: 100%;
    font-size: 1em;

	&-tags-card {
		max-height: 500px;
		overflow-y: scroll;
		&--null {
			text-align: center;
			min-height: 60px;
		}
	}

	

	// table主體
	.company-content {
		height: 100%;
		width: 100%;
		// min-width: 820px;
		border-radius: 10px;
        overflow: hidden;
		&__header {
			height: 32px;
			line-height: 32px;
            padding-right: 5px;
		}
		&__box {
			height: calc(100% - 47px);
			overflow-y: auto;
			width: 100%;
			// min-width: 820px;
			margin: 15px 0 0 0;
			border-radius: 10px;
			background: #fff;
			padding: 20px;
            overflow-x: scroll;
            
			&--table {

                max-height: calc(100% - 50px);
                overflow-y: scroll;

			}
			&--footer {
				height: 32px;
				// margin: 15px 0
			}
		}
	}

	&-title--big {
		line-height: 32px;
		vertical-align: bottom;
		padding-top: 4px;
	}
}

</style>
