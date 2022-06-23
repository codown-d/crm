<template>
    <a-select
        v-model="selectValue"
        :mode="mode"
        :show-search="showSearch"
        :placeholder="`請輸入${selectLabel}稱進行搜尋`"
        :default-active-first-option="false"
        style="width: 100%;font-size: 1em"
        :show-arrow="false"
        :allowClear="allowClear"
        :loading="selectLoading"
        :filter-option="false"
        :not-found-content="null"
        :disabled="disabled"
        @search="selectSearch"
        @change="selectChange"
        @focus="selectFocus"
    >
        <a-spin v-if="selectLoading" :spinning="selectLoading" slot="notFoundContent" size="small" tip="查詢中...">
                        <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
                         <div class="flex-center" style="height: 100px"></div>
                    </a-spin>
                    <div v-if="!selectLoading && selectOptions.length == 0" slot="notFoundContent" 
                        class="flex-center" style="height: 100px">
                            請輸入關鍵字查詢!
                    </div>
        <a-select-option v-for="(option,key) in selectOptions" :value="option.id" :key="key" :disabled="option.disabled" :label="option.name" :title="option.name"  :objValue="option" >
            {{ option.name }}
        </a-select-option>
    </a-select>
</template>
<script>
import Services from '@/services/common.js'
import UserServices from '@/services/user-api.js'
import { mapGetters } from 'vuex';

export default {
	props: {
        defaultValue: {
			type: [Number, Array, String],
            default: undefined,
		},
        defaultName:{
            type: String,
            default: '',
        },
        selectDict:{
            type: String,
            default: '',
            validator:function(value)
            {
                return ['customer','company','user','customerTag','companyTag'].includes(value);
            }
        },
        allowClear:{
            type: Boolean,
            default: true,
        },
        showSearch:{
            type: Boolean,
            default: true,
        },
        showSelectInsert:{
            type: Boolean,
            default: false,
        },
        mode:{
            type: String,
            default: 'default',
            validator:function(value)
            {
                return ['default','multiple'].includes(value);
            }
        },
        defaultSelectOptions:{
            type: Array,
        },
        disabled:{
            type: Boolean,
            default: false,
        },
	},
	data() {
		return {
            selectOptions: [],
            selectValue: undefined,
            selectName: undefined,
            selectLoading: false,
            selectedOptions:[],
		}
	},
    watch: {
        defaultValue:{
            handler(newval, oldVal)
            {
                // console.log('这里触发了',newval)
                // console.log('this.defaultValue:',this.defaultValue)
                if(this.mode == 'default'){
                    this.selectValue = this.defaultValue;
                    if(this.defaultValue || this.defaultName){
                        this.selectOptions = [{
                        id: this.defaultValue,
                        name: this.defaultName
                        }];
                    }
                }
                // else{
                //     this.selectValue = this.defaultValue;
                // }
                // else{
                //     console.log('原始触发变更',this.defaultSelectOptions);
                //     this.selectOptions = this.defaultSelectOptions ? this.defaultSelectOptions : [];
                // }
                
            },
            immediate: true,
        },
        defaultName()
        {
            this.selectName = this.defaultName;
        },
        // selectOptions:{
        //     handler(newval, oldVal)
        //     {
        //         console.log('原始触发变更',newval);
        //         this.selectOptions = newval ? newval : [];
                
        //     },
        //     immediate: true,
        //     deep:true,
        // },
        // defaultSelectOptions:{
        //     handler(newval, oldVal)
        //     {
        //         console.log('原始触发变更',newval);
        //         this.selectOptions = newval ? newval : [];
                
        //     },
        //     immediate: true,
        //     deep:true,
        // },
    },
	computed: {
        ...mapGetters([
            'permissions',
        ]),
        selectLabel()
        {
            const labelDict = {
                'customer': '聯絡人',
                'company': '組織',
                'user': '用户',
                'customerTag': '聯絡人標籤',
                'companyTag': '組織標籤',
            }
            return labelDict[this.selectDict];
        }
    },
    created:function()
    {
        // if(this.defaultValue || this.defaultName){
        //     console.log('进入select created',this.defaultValue)
        //     this.selectOptions = [{
        //         id: this.defaultValue,
        //         name: this.defaultName
        //         }];
        // }
        if(this.mode == 'default'){
            // this.selectValue = this.defaultValue;
            if(this.defaultValue || this.defaultName){
                this.selectOptions = [{
                id: this.defaultValue,
                name: this.defaultName
                }];
            }
        }
        else{
            this.selectValue = this.defaultValue;
            this.selectOptions = this.defaultSelectOptions ? this.defaultSelectOptions : [];
            this.selectedOptions = this.defaultSelectOptions ? this.defaultSelectOptions : [];
        }
    },
	methods: {
        selectFocus(){
            // this.selectOptions = [];
            if( this.selectOptions.every(p => p.id != -1)){
                this.selectOptions.push({
                id: -1,
                name: `更多${this.selectLabel}請輸入關鍵字進行搜尋！`,
                disabled: true,
                })
            }
        },
        async selectSearch(value = '')
        {
            this.selectOptions = [];
            this.selectLoading = true;
			const params = {
				pageNum: 1,
				pageSize: 50,
				param: { name: value },
			}
            let searchData;
            switch (this.selectDict) {
                case 'customer':
                    searchData = await Services.searchPersonList(params);
                    if(searchData.code == '0' && searchData.data && searchData.data.list){
                        this.selectOptions = searchData.data.list;
                    }
                    break;
                case 'company':
                    searchData = await Services.searchCompanyList(params);
                    if(searchData.code == '0' && searchData.data && searchData.data.list){
                        this.selectOptions = searchData.data.list;
                    }
                    break;
                case 'user':
                    params.param.userName = value;
                    params.param.status = 1;
                    searchData = await UserServices.queryCompanyUserPageList(params);
                    if(searchData.code == '0' && searchData.data && searchData.data.list){
                        searchData.data.list.map(item => {
                            if(!item.name)
                            {
                                item.name = item.userName;
                            }
                            return item;
                        });
                        this.selectOptions = searchData.data.list;
                    }
                    break;
                default:
                    break;
            }
            this.selectLoading = false;
            if (!this.selectOptions || this.selectOptions.length === 0 && value && value.trim()){
                if(this.showSelectInsert){
                    this.selectOptions = [{ id: '', name: `新增${this.selectLabel} ${ value }`, insertValue: value.trim() }];
                }
                else{
                    this.selectOptions = [{id: -1,name: `無結果`,disabled: true,}]
                }
            }
        },
        selectChange(value,options)
        {
            // console.log('selectChange',value);
            //  console.log('selectoptions',options);
            // console.log('提交字典選擇的內容' + value);
            if(this.mode == "multiple"){
                // let selectValueObjs = this.selectOptions.filter(p => value.includes(p.id));

                this.selectValue = value;
                // console.log('this.selectOptions',this.selectOptions)
                // if (this.selectOptions.length === 1 && value == '' && selectValueObj && selectValueObj.insertValue)
                // {
                //     selectValueObj = {id: "", name: selectValueObj.insertValue};
                // }
                // selectValueObj ??= {id: undefined, name: ''};
                // this.$emit("selectChange",selectValueObjs)
                this.$emit("selectChange",options.map(p => {
                    return {
                        id:p.componentOptions.propsData.value,
                        name:p.componentOptions.propsData.label,
                        disabled:p.componentOptions.propsData.disabled,
                    }
                }))

            }
            else{
                let selectValueObj = this.selectOptions.find(p => p.id == value);
                // console.log('selectValueObj:',selectValueObj);
                if (this.selectOptions.length === 1 && value == '' && selectValueObj && selectValueObj.insertValue)
                {
                    // console.log('進入新增:',selectValueObj);
                    selectValueObj = {id: "", name: selectValueObj.insertValue};

                }
                selectValueObj = {id: undefined, name: ''};
                this.$emit("selectChange",selectValueObj)

            }
            
            
        }
	},
}
</script>
<style scoped>
.ant-form-item-label{
    line-height: 20px !important;
}
.ant-form-item-control{
    line-height: 20px !important;
}

</style>
