/*
 * @Descripttion: 
 * @version: 
 * @Author: Lone
 * @Date: 2022-01-14 22:43:25
 * @LastEditors: Lone
 * @LastEditTime: 2022-05-05 19:26:45
 */
const columns = [
    {
        title: '公司',
        dataIndex: 'name',
        key: 'name',
        width: 200,
        // fixed: 'left',
        align: 'center',
        scopedSlots: { customRender: 'name' },
    },
    {
		title: '標籤',
		dataIndex: 'tags',
		key: 'tags',
		align: 'center',
		width: 200,
		scopedSlots: { customRender: 'tags' },
	},
    // {
    //     title: '上级',
    //     dataIndex: 'ownerUser',
    //     key: 'ownerUser',
    //     align: 'center',
    //     width: 200,
    // },
    {
        title: '统一编号',
        dataIndex: 'companyCode',
        key: 'companyCode',
        align: 'center',
        width: 200,
    },
    {
        title: '成立日期',
        dataIndex: 'foundDate',
        key: 'foundDate',
        align: 'center',
        scopedSlots: { customRender: 'foundDate' },
        width: 150,
    },
    {
        title: '產業類型',
        dataIndex: 'industrial',
        key: 'industrial',
        align: 'center',
        width: 200,
    },
    {
        title: '營業額',
        dataIndex: 'sales',
        key: 'sales',
        align: 'center',
        width: 150,
    },
    {
        title: '員工人數',
        dataIndex: 'staffCount',
        key: 'staffCount',
        align: 'center',
        width: 100,
    },
    {
        title: '電話',
        dataIndex: 'phone',
        key: 'phone',
        align: 'center',
        width: 200,
    },
    {
        title: '傳真',
        dataIndex: 'fax',
        key: 'fax',
        align: 'center',
        width: 200,
    },    
    {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
        align: 'center',
        width: 400,
    },
    {
        title: '電子郵件',
        dataIndex: 'email',
        key: 'email',
        align: 'center',
        width: 200,
    },    
    {
        title: '網址',
        dataIndex: 'website',
        key: 'website',
        align: 'center',
        width: 300,
    },    
    {
        title: 'FB粉絲專頁',
        dataIndex: 'socialAccount',
        key: 'socialAccount',
        align: 'center',
        width: 300,
    },    
    {
        title: '備註',
        dataIndex: 'remark',
        key: 'remark',
        align: 'center',
        width: 300,
    }
]

export default columns

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