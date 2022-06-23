/*
 * @Descripttion: 
 * @version: 
 * @Author: Lone
 * @Date: 2021-10-29 20:38:19
 * @LastEditors: Lone
 * @LastEditTime: 2021-11-02 19:23:03
 */

// 引入mockjs, 在线文档： https://github.com/nuysoft/Mock/wiki
const Mock = require('mockjs');
// 获取 mock.Random 对象
const Random = Mock.Random;
// 配置响应时间
Mock.setup({
    timeout: '200-600'
});

let base = 'http://localhost:8080/';

// 语法：Mock.mock( url, post/get , 返回的数据);
// Mail部分
Mock.mock(base + 'context/mail/getAccountList','post', getRadomAccountList());

Mock.mock(base + 'context/mail/getFolderList','post', getRadomFolderList());

Mock.mock(base + 'context/mail/getMessageList','post', getRadomMailList());

Mock.mock(base + 'context/mail/getMessageDetail','post', getRadomMessage());

Mock.mock(base + 'context/mail/send','post', send());

function getRadomAccountList () {
    return {
        "errCode": 0,
        "errMsg": "请求成功",
        "data": {
            "mailAccountList": [
                {
                    "id": Random.integer(0,20),
                    "createTime": Random.date() + ' ' + Random.time(),
                    "updateTime": Random.date() + ' ' + Random.time(),
                    "type": "imap_smtp",
                    "user": Random.email('outlook.com'),
                    "supplier": "outlook.com",
                    "serverAddr": "imap://imap.outlook.com"
                    // `id` bigint(11) NOT NULL AUTO_INCREMENT,
                    // `createTime` datetime DEFAULT NULL,
                    // `updateTime` datetime DEFAULT NULL,
                    // `type` varchar(255) DEFAULT NULL COMMENT '类型。imap_smtp',
                    // `user` varchar(255) DEFAULT NULL COMMENT '用户名，eg：1030143744',
                    // `password` varchar(255) DEFAULT NULL COMMENT '密码 or 授权码，eg：begfxvqnzaojxxyy',
                    // `supplier` varchar(255) DEFAULT NULL COMMENT '供应商',
                    // `server_addr` varchar(255) DEFAULT NULL COMMENT '邮箱服务器地址，eg：imap://imap.qq.com',
                }
            ],
            "total": 100
        }
    }
}

function getRadomFolderList () {

    let folderList = [];
    for (let i = 0; i < 5; i++) {
        let item = {
            "id": Random.integer(0,20),
            "createTime": Random.date() + ' ' + Random.time(),
            "updateTime": Random.date() + ' ' + Random.time(),
            "parent": Random.cword(3),
            "email_account": Random.email('outlook.com'),
            "name": Random.cword(3),
            // `id` bigint(11) NOT NULL AUTO_INCREMENT,
            // `createTime` datetime DEFAULT NULL,
            // `updateTime` datetime DEFAULT NULL,
            // `parent` bigint(255) DEFAULT NULL COMMENT '父亲文件夹',
            // `email_account` varchar(255) NOT NULL COMMENT '邮箱账号',
            // `name` varchar(255) DEFAULT NULL COMMENT '文件夹名',
        }
        folderList.push(item);

    }
    return {
        "errCode": 0,
        "errMsg": "请求成功",
        "data": {
            "folderList": folderList,
            "total": 100
        }
    }

}


function getRadomMailList () {

    let mailList = [];

    for (let i = 0; i < 15; i++) {

        let mailItem = {
            
            id: Random.cword(30),
            from: Random.email(),
            cc: Random.email(),
            bcc: Random.email(),
            subject: Random.csentence(5, 30), 
            sentDate: Random.date() + ' ' + Random.time(),
            flags: Random.boolean(),
            userFlags: Random.boolean(),
            folder: Random.cword(3),
            "receiveDate": Random.date() + ' ' + Random.time(),
            "contextType": "html",
            "attachment": Random.dataImage('300x250', 'mock的图片'),
            "createTime": Random.date() + ' ' + Random.time(),
            "updateTime": Random.date() + ' ' + Random.time()
            // `id` bigint(11) NOT NULL AUTO_INCREMENT,
            // `from` varchar(255) DEFAULT NULL COMMENT '发送方',
            // `to` varchar(255) DEFAULT NULL COMMENT '接收方',
            // `cc` varchar(255) DEFAULT NULL,
            // `bcc` varchar(255) DEFAULT NULL,
            // `subject` varchar(255) DEFAULT NULL COMMENT '主题',
            // `sent_date` datetime DEFAULT NULL COMMENT '发送日期',
            // `flags` varchar(255) DEFAULT NULL,
            // `user_flags` varchar(255) DEFAULT NULL,
            // `context` text COMMENT '消息内容',
            // `folder` varchar(255) DEFAULT NULL COMMENT '在哪个文件夹里面',
            // `receive_date` datetime DEFAULT NULL,
            // `context_type` varchar(255) DEFAULT NULL COMMENT 'MIME type',
            // `attachment` varchar(255) DEFAULT NULL COMMENT '附件',
            // `create_time` datetime DEFAULT NULL,
            // `update_time` datetime DEFAULT NULL,
        }

        mailList.push(mailItem)

    }

    return {

        "errCode": 0,
        "errMsg": "请求成功",
        "data": {
            "mailList":  mailList,
            "total": 15
        }

    }

}

function getRadomMessage () {
    return {
        "errCode": 0,
        "errMsg": "请求成功",
        "data": {
            "result": "success"
        }
    }
}

function send () {
    return {
        "errCode": 0,
        "errMsg": "请求成功",
        "data": {
            "result": "success"
        }
    }
}


Mock.mock('/addActivites','post', ()=>{
    return {
        "errCode": 0,
        "errMsg": "请求成功",
        "data": {
          'key': Mock.mock('@id'),
        }
    }
});

Mock.mock('/getActivites', ()=>{
    return {
        "errCode": 0,
        "errMsg": "请求成功",
        "data": [{
            "name": "sd",
            "time": [
                "2022-01-05 09:24:48",
                "2022-01-06 09:24:48"
            ],
            "desc": "ss",
            "dealId": "sd",
            "subject": "three",
            "companyId": "dsd",
            "date": "2022/01/05-2022/01/06",
            "dateStart": "2022/01/05",
            "dateEnd": "2022/01/06",
            "key": "630000197411192617",
            "type": 1,
        }]
    }
});