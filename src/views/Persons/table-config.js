/*
 * @Descripttion: 聯絡人table、columns配置資料
 * @version:
 * @Author: Lone
 * @Date: 2021-12-28 20:35:53
 * @LastEditors: Lone
 * @LastEditTime: 2022-05-11 17:11:56
 */
const columns = [
	{
		title: '姓名',
		dataIndex: 'name',
		key: 'name',
		width: 160,
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
	{
		title: '組織',
		dataIndex: 'companyName',
		width: 200,
		key: 'companyName',
		align: 'center',
		scopedSlots: { customRender: 'companyName' },
	},
    {
		title: '部門',
		dataIndex: 'department',
		width: 200,
		key: 'department',
		align: 'center',
		scopedSlots: { customRender: 'department' },
	},
    {
		title: '職稱',
		dataIndex: 'position',
		width: 200,
		key: 'position',
		align: 'center',
		scopedSlots: { customRender: 'position' },
	},
    {
        title: '性別',
        dataIndex: 'sex',
        key: 'sex',
        align: 'center',
		scopedSlots: { customRender: 'sex' },
        width: 100,
    },
    {
        title: '生日',
        dataIndex: 'birthday',
        key: 'birthday',
        align: 'center',
		scopedSlots: { customRender: 'birthday' },
        width: 150,
    },
	{
		title: '郵件',
		dataIndex: 'email',
		width: 400,
		key: 'email',
		align: 'center',
		scopedSlots: { customRender: 'email' },
	},
	{
		title: '電話',
		dataIndex: 'phone',
		width: 300,
		key: 'phone',
		align: 'center',
		scopedSlots: { customRender: 'phone' },
	},
    {
        title: '社群賬號',
        dataIndex: 'socialAccount',
        key: 'socialAccount',
        align: 'center',
		scopedSlots: { customRender: 'socialAccount' },
        width: 150,
    },
    {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
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
	// {
	// 	title: '取消活動',
	// 	dataIndex: 'activity_cancel',
	// 	width: '6%',
	// 	key: 'activity_cancel'
	// },
	// {
	// 	title: '開始活動',
	// 	dataIndex: 'activity_start',
	// 	width: '6%',
	// 	key: 'activity_start'
	// },
	// {
	// 	title: '下一個活動',
	// 	dataIndex: 'activity_next',
	// 	width: '10%',
	// 	key: 'activity_next'
	// },
	// {
	// 	title: '發起人',
	// 	dataIndex: 'ownerUser',
	// 	width: '7%',
	// 	key: 'ownerUser'
	// },
	// {
	// 	title: '事件',
	// 	dataIndex: 'activity_event',
	// 	width: '7%',
	// 	key: 'activity_event'
	// },
	// {
	// 	title: '操作',
	// 	dataIndex: 'action',
	// 	width: 100,
	// 	align: 'center',
	// 	scopedSlots: { customRender: 'action' },
	// },
]

export default columns
