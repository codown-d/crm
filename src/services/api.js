/*
 * @Descripttion:
 * @version:
 * @Author: Lone
 * @Date: 2021-10-28 22:50:56
 * @LastEditors: Lone
 * @LastEditTime: 2022-04-17 20:51:37
 */
import mail from './mail-api'; //引入邮件模块接口
import customer from './customer-api'; //引入客户模块全部接口
import tags from './tags-api'; //引入标签模块接口
import business from './business-api'; //引入销售、销售流程模块接口
import sns from './sns-api'; //引入line sns部分的接口
import user from './user-api'; //引入用户登录、注册、个人设定部分的接口
import activity from './activities-api'
import company from './company' //引入公司模块接口
import common from './common-api' //引入公用接口
import marketing from './marketing-api' //引入公用接口


const api = {
	mail,
	activity,
    company,
	customer,
	tags,
	business,
	sns,
	user,
    common,
    marketing
}

const install = function (Vue) {
    if (install.installed) return // 如果已经注册过了，就跳过
    install.installed = true
    Object.defineProperties(Vue.prototype, {
        $api: {
            get() {
                return api
            },
        },
    })
}

export default {
    install,
    ...api,
}
