/*
 * @Descripttion: 
 * @version: 
 * @Author: Lone
 * @Date: 2022-01-09 19:59:02
 * @LastEditors: Lone
 * @LastEditTime: 2022-04-27 21:47:32
 */
const columns = [
    {
        title: '活動名稱',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        scopedSlots: { customRender: 'name' },
        ellipsis: true,
    },
    {
        title: '活動到期日期',
        dataIndex: 'date',
        key: 'date',
        align: 'center',
        scopedSlots: { customRender: 'date' },
    },
    {
        title: '活動描述',
        dataIndex: 'desc',
        key: 'desc',
        align: 'center',
        scopedSlots: { customRender: 'desc' },
        ellipsis: true,
    },
    {
        title: '活動指派人',
        dataIndex: 'ownerName',
        key: 'ownerName',
        align: 'center',
        scopedSlots: { customRender: 'desc' },
        ellipsis: true,
    },
    {
        title: '活動關聯',
        dataIndex: 'activityParticipants',
        key: 'activityParticipants',
        align: 'center',
        scopedSlots: { customRender: 'activityParticipants' },
        ellipsis: true,
        // customRender: (text, row, index) => {
        //     return (text && text.length > 0 ? (text.map(item => {
        //         return <a-tag>{ item.customerName }</a-tag>
        //     })) : "")
            
        // },
    },
    {
        title: '關聯公司',
        dataIndex: 'companyName',
        key: 'companyName',
        align: 'center',
        scopedSlots: { customRender: 'companyName' },
        ellipsis: true,
    },
    {
        title: '操作',
        dataIndex: 'activityId',
        key: 'activityId',
        width: 70,
        align: 'center',
        scopedSlots: { customRender: 'action' },
    },
]

export default columns
