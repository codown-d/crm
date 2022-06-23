<template>
	<div class="AddCust">
		<!--<label>{{ msg }}</label> -->

        <!-- fix 數字輸入框的最小值限制，不能為負數！！！-->
		<a-form-model :model="formEdit" :labelCol="{ span: 24, offset: 0 }" destroyOnClose :rules="rules" ref="companyForm">
            <a-row>
                <a-col :xs="12" style="border-right: 1px solid #ddd; padding-right: 20px">

                    <a-form-model-item ref="name" label="名稱" prop="name">
                        <a-input v-model="formEdit.name" placeholder="請輸入組織名稱" :maxLength="64" allowClear />
                    </a-form-model-item>

                    <a-form-model-item ref="companyCode" label="統一編號" prop="companyCode">
                        <a-input v-model="formEdit.companyCode" placeholder="請輸入組織統一編號" :maxLength="64" allowClear type="number" :min="0" />
                    </a-form-model-item>                    
                    
                    <a-form-model-item ref="foundDate" label="成立日期" prop="foundDate">
                        <!-- <a-input v-model="formEdit.foundDate" placeholder="請選擇成立日期" type="date" allowClear /> -->
                        <a-date-picker v-model="formEdit.foundDate" type="date" placeholder="請選擇成立日期" value-format="YYYY-MM-DD" style="width: 100%;" allowClear format="YYYY年MM月DD日" :showToday="false"/>
                    </a-form-model-item>                    
                    
                    <a-form-model-item ref="industrial" label="產業別" prop="industrial">
                        <a-input v-model="formEdit.industrial" placeholder="請輸入產業別" :maxLength="64" allowClear />
                    </a-form-model-item>                    
                    
                    <a-form-model-item ref="sales" label="營業額" prop="sales">
                        <a-input v-model="formEdit.sales" placeholder="請輸入營業額" :maxLength="64" allowClear type="number" :min="0" :max="9999999"/>
                    </a-form-model-item>                     
                    
                    <a-form-model-item ref="staffCount" label="員工人數" prop="staffCount">
                        <a-input v-model="formEdit.staffCount" placeholder="請輸入員工人數" :maxLength="64" allowClear type="number" :min="0" :max="99999"/>
                    </a-form-model-item>

                    <a-form-model-item ref="address" label="位址" prop="address">
                        <a-input v-model="formEdit.address" placeholder="請輸入位址" :maxLength="64" allowClear/>
                    </a-form-model-item>

                </a-col>

                <a-col :xs="12" style="padding-left: 20px">

                    <a-form-model-item ref="phone" label="電話" prop="phone">
                        <a-input v-model="formEdit.phone" placeholder="請輸入聯繫電話" :maxLength="64" allowClear />
                    </a-form-model-item>

                    <a-form-model-item ref="fax" label="傳真" prop="fax">
                        <a-input v-model="formEdit.fax" placeholder="請輸入傳真" :maxLength="64" allowClear />
                    </a-form-model-item>

                    <a-form-model-item ref="email" label="電子郵件" prop="email">
                        <a-input v-model="formEdit.email" placeholder="請輸入電子郵件" :maxLength="64" allowClear />
                    </a-form-model-item>

                    <a-form-model-item ref="website" label="網址" prop="website">
                        <a-input v-model="formEdit.website" placeholder="請輸入網址" :maxLength="64" allowClear />
                    </a-form-model-item>

                    <a-form-model-item ref="socialAccount" label="FB粉絲專頁" prop="socialAccount">
                        <a-input v-model="formEdit.socialAccount" placeholder="請輸入FB粉絲專頁" :maxLength="64" allowClear />
                    </a-form-model-item>

                    <a-form-model-item ref="remark" label="備註" prop="remark">
                        <a-textarea v-model="formEdit.remark" placeholder="請輸入備註" :auto-size="{ minRows: 2, maxRows: 6 }" :maxLength="128" allowClear/>
                    </a-form-model-item>

                </a-col>
            </a-row>
			
			<a-row>
				<div style="display: flex; justify-content: center" class="marginTop-10">
					<a-button @click="handleCancel" style="margin-right: 10px">取消</a-button>
					<a-button type="primary" @click="beforeSubmitForm">儲存</a-button>
				</div>
			</a-row>
		</a-form-model>
	</div>
</template>
<script>
import Api from '@/services/api'
import debounce from "lodash/debounce";

export default {
	name: 'AddCust',
	props: ['msg', 'formEdit'],
	data() {
        this.lastFetchId = 0;
        this.fetchCompany = debounce(this.fetchCompany, 800);

        let validateMail = (rule, value, callback) => {
            if (value != '' && !this.$util.checkMail(value).flag) {
                callback(new Error('請輸入有效的電子郵件地址!'));
            } else {
                callback();
            }
        };
        let validatePhone = (rule, value, callback) => {
            if (value != '' && !this.$util.checkPhone(value).flag) {
                callback(new Error('請輸入有效的手機號碼或座機號碼！'));
            } else {
                callback();
            }
        };
        let validateFax = (rule, value, callback) => {
            if (value != '' && !this.$util.checkPhone(value).flag) {
                callback(new Error('請輸入有效的傳真！'));
            } else {
                callback();
            }
        };
        let validateNumber = (rule, value, callback) => {
            // 看最後的結果是否符合要求
            if (value != '' && value < 0) {
                callback(new Error('請輸入有效的值！'));
            } else {
                callback();
            }
        };

		return {
			tags: ['Movies', 'Books', 'Music', 'Sports'],
			selectedTags: [],
			companyTagsData: [],
			tagsCompany: [...this.$store.state.main.tagsArray],
			newTag: '',
			currentSelectTagCust: [], //目前選取的客戶標籤
			currentSelectTagCustDetail: [], //目前選取的客戶標籤-子標籤

            // 遠端搜索 組織
            fetchCompanyData: null,
            fetching: false,
            companyValue: [],

            rules: {
                name: [
                    {
                        required: true,
                        message: "請鍵入組織名稱",
                        trigger: "blur",
                    },
                ],
                companyCode: [{ validator: validateNumber, trigger: 'blur' }],
                sales: [{ validator: validateNumber, trigger: 'blur' }],
                staffCount: [{ validator: validateNumber, trigger: 'blur' }],
                phone: [{ validator: validatePhone, trigger: 'blur' }],
                email: [{ validator: validateMail, trigger: 'blur' }],
                fax: [{ validator: validateFax, trigger: 'blur' }],
            },

            // "name": "公司名称",
            // "ownerUser": "上级",
            // "companyCode": "统一编号",
            // "foundDate": "成立日期",
            // "industrial": "产业类型",
            // "sales": "营业额",
            // "staffCount": "员工人数",
            // "phone": "电话",
            // "fax": "传真",
            // "address": "地址",
            // "email": "Email",
            // "website": "网址",
            // "socialAccount": "FB粉丝专页",
            // "socialAccountType": "社交账号类型",
            // "latitude": "经纬度",
            // "longitude": "经纬度",
            // "remark": "备注"
		}
	},
	created() {
		setTimeout(() => {
			this.getCompanyTagsData()
		}, 1000)
	},
	computed: {
		customerData() {
			return this.$store.state.main.customerData
		},
	},
	methods: {
		getCompanyTagsData() {
			//取得客戶標籤資料
			let tags = [...this.$store.state.main.companyTagsData]
			this.companyTagsData = tags
		},
		addSelectTag() {
			let parentKey = this.currentSelectTagCust[0].key
			let key1 = parseInt(this.currentSelectTagCustDetail.length) + 1
			let tempTagObj = {
				color: 'whilegreen',
				tagName: [],
				title: this.newTag,
				key: parentKey + '-' + key1,
				parentKey: parentKey,
			}
			this.currentSelectTagCustDetail.push(tempTagObj)

			this.$store.dispatch('main/addSubTags', tempTagObj).then(res => {
				if (res) {
					this.visibleTagsModel = false
					this.$message.success('添加標籤成功！')
					this.newTag = ''
				}
			})
		},
		tagSelectChange(tagCustID) {
			let tempTagsCompany = [...this.tagsCompany]
			tempTagsCompany = tempTagsCompany.filter(item => {
				return item.key == tagCustID
			})
			this.currentSelectTagCust = tempTagsCompany

			let currentSelectTagCustDetail = []
			tempTagsCompany.forEach(item => {
				if (item.children) {
					item.children.forEach(item2 => {
						currentSelectTagCustDetail.push(item2)
					})
				}
			})
			this.currentSelectTagCustDetail = currentSelectTagCustDetail
		},
		onTagClick() {},
		handleTagChange(tag, checked) {
			const { selectedTags } = this
			const nextSelectedTags = checked ? [...selectedTags, tag.key] : selectedTags.filter(t => t !== tag.key)
			this.selectedTags = nextSelectedTags
		},
		handleCancel() {
			this.$emit('handleCancel', this.formEdit)
		},
		tagHandleChange(tag, checked) {
			const { selectedTags } = this
			const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag)
			this.selectedTags = nextSelectedTags
		},
        beforeSubmitForm() {
            this.$refs.companyForm.validate(valid => {
                if (valid) {
                    this.submitForm();
                }
            })
        },
		submitForm() {
			let tempTag = []
			this.selectedTags.forEach(item => {
				tempTag.push(item.id)
			})
			this.formEdit.tags = this.selectedTags
			this.formEdit.bizTagIds = tempTag

            // if (!this.formEdit.name.length) return this.$message.warning("組織名稱為必填項！");

			if (this.msg == '編輯公司') {
                if (this.formEdit.socialAccountType == "") this.formEdit.socialAccountType = "Facebook";
				return new Promise((resolve, reject) => {
					this.$api.company.editCompany({ param: { ...this.formEdit } }).then(res => {
						if (res.success != true) {
							resolve(false)
							this.$message.error('編輯組織失敗')
						} else {
							this.$message.success('編輯組織成功!')
                            this.$emit('handleOk', res.data)
							// this.getCompanyDataList()
							resolve(true)
						}
					})
				})
			} else {
                this.formEdit.socialAccountType = "Facebook";
				return new Promise((resolve, reject) => {
					this.$api.company.createCompany({ param: this.formEdit }).then(res => {
						if (res.success != true) {
							resolve(false)
							this.$message.error('新增組織失敗')
						} else {
							this.$message.success('新增組織成功！')
							this.$emit('handleOk', res.data)
							//this.getCompanyDataList();
							resolve(true)
                        
						}
					})
				})
			}
		},
		getCompanyDataList() {
			return new Promise((resolve, reject) => {
				let params = {
					page: {
						currentPage: 1,
						pageSize: this.$store.state.main.companyData.pageSize,
					},
				}
				Api.customer.queryComPageList(params).then(res => {
					if (res.success != true) {
						resolve(false)
						this.$message.error('請求取得公司資料失敗')
					} else {
						this.$store.dispatch('main/getCompanyList', res.data).then(res => {
							if (res) {
								this.$emit('handleOk', res.data)
							}
						})
						resolve(true)
					}
				})
			})
		},
        // 远程搜索
        fetchCompany(value) {
            if (!value || !value.length) return;

            this.lastFetchId += 1;
            const fetchId = this.lastFetchId;
            this.data = [];
            this.fetching = true;

            let params = {
                page: {
                    currentPage: 1,
                    pageSize: 100,
                },
                name: value,
            };
            this.$api.customer.queryComPageList(params).then((res) => {
                if (fetchId !== this.lastFetchId) {
                    // for fetch callback order
                    return;
                }
                if (!res.success) return this.$message.error("查詢失敗");
                // this.fetchCompanyData = null;
                // if (res?.data?.list)
                // this.fetchCompanyData = res?.data?.list || [{ id: '', name: `新增組織 ${ value }` }];
                this.fetchCompanyData = res.data.list;

                this.fetching = false;
                // this.$util.console(res, '遠端查詢公司的結果');
            });
        },
        handleChange(value, option) {
            // return 
            // console.log('選擇了選項', value, option, this.fetchCompanyData);
            value.label = value.label.trim();
            // console.log(this.fetchCompanyData.find(item => item.name == value.label.trim()), this.fetchCompanyData.find(item => item.name == value.label.trim()).id);
            if (this.fetchCompanyData.length == 1 && value.label.includes('新增組織')) {
                // console.log('是新增組織');
                // value.label = value.label.substr(5, value.label.length - 1);
                // this.formData.companyId = "newCompany";
                // this.formData.companyName = value.label;
            } else {
                let selectedCompany = this.fetchCompanyData.find(item => item.name == value.label);
                this.formEdit.ownerUser = selectedCompany.id;
                // this.formData.companyId = selectedCompany.id;
                // this.formData.companyName = selectedCompany.name;
            }
            Object.assign(this, {
                companyValue: value,
                fetchCompanyData: null,
                fetching: false,
            });
            // console.log('this.companyValue===', this.companyValue);
        },
	},
}
</script>
<style scoped>

input, select, span, textarea {
    font-size: 1em;
}

.flexLeft {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	flex-wrap: wrap;
}
.flexLeft.flexTop {
	align-items: flex-start;
}
.flexLeft .flex1 {
	flex: 1;
}

.flexRight {
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
.flexLeft.flexRight {
	display: flex;
	align-items: center;
	justify-content: flex-end;
}

.formTit {
	min-width: 80px;
	text-align: right;
	/* padding-right: 5px; */
    margin-right: 10px;
}

.formTxt {
	width: 100%;
	display: block;
	flex: 1;
}

.formTxt input.input1 {
	display: block;
	width: 100%;
	border: 0;
	color: #898989;
	line-height: 30px;
}

.formRowGrp {
	margin-bottom: 12px;
}

.pdg1 {
	padding: 1em;
}
</style>
