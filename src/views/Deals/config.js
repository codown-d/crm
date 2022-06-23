/*
 * @Descripttion: 
 * @version: 
 * @Author: Lone
 * @Date: 2022-01-24 17:30:05
 * @LastEditors: Lone
 * @LastEditTime: 2022-04-27 21:54:31
 */
export const columns = [
    {
        title: '標題',
        dataIndex: 'title',
        key: 'title',
        scopedSlots: { customRender: 'action' },
        width: 150,
        fixed: 'left',
    },
    {
        title: '金額',
        align: 'center',
        dataIndex: 'money',
        key: 'money',
        width: 80,
    },
    {
        title: '組織',
        align: 'center',
        dataIndex: 'companyName',
        key: 'companyName',
    },
    {
        title: '聯絡人',
        align: 'center',
        key: 'customerName',
        dataIndex: 'customerName',
    },
    {
        title: '預計結束時間',
        align: 'center',
        dataIndex: 'dealDate',
        scopedSlots: { customRender: 'dealDate' },
        key: 'dealDate',
    },
    // {
    //     title: '下一項活動的日期',
    //     align: 'center',
    //     key: '22',
    //     dataIndex: '22',
    // },
    {
        title: '擁有人',
        align: 'center',
        key: 'ownerUserName',
        dataIndex: 'ownerUserName',
    },
    {
        title: '銷售流程',
        align: 'center',
        key: 'salesFlowName',
        dataIndex: 'salesFlowName',
    },
    {
        title: '交易階段',
        align: 'center',
        key: 'salesStageName',
        dataIndex: 'salesStageName',
    }
    // {
    //     title: '操作',
    //     align: 'center',
    //     key: 'action',
    //     scopedSlots: { customRender: 'action' },
    //     width: 200,
    //     fixed: 'right',
    // },
]
