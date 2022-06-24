/*
 * @Descripttion: 前端工具類，處理時間、陣列處理等
 * @version: 
 * @Author: Lone
 * @Date: 2021-09-29 16:11:53
 * @LastEditors: Lone
 * @LastEditTime: 2022-05-11 16:35:17
 */
const Util = {
    /**
     * @name: 多色彩的列印函數
     * @param {*} value 需要列印的值
     * @param {*} key 值的備註
     * @param {*} type 列印樣式的類型
     * @return {*} null
     */    
    console (value, key, type) {
        let styleTheme = '';
        if (!type) styleTheme = 'font-size:14px;line-height:28px;padding:0 8px;background:#222;color: #fadfa3';
        if (type == 1) styleTheme = 'font-size:14px;line-height:28px;padding:0 8px;background:#fadfa3;color: #000';
        if (type == 2) styleTheme = 'font-size:14px;line-height:28px;padding:0 8px;background:#ff8400;color: #fff';
        console.log(
            `%c ${ key != undefined ? key : '列印的是' } `, 
            styleTheme, 
            value
        );
    },
    generateUUID:()=>{
        var d = new Date().getTime()
        if (window.performance && typeof window.performance.now === 'function') {
            d += performance.now() //use high-precision timer if available
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0
            d = Math.floor(d / 16)
            return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
        })
        return uuid
    },
    getSizeText(size) {
        var data = "";
        if (size < 0.1 * 1024) { //如果小于0.1KB转化成B  
            data = size.toFixed(2) + " B";
        } else if (size < 0.1 * 1024 * 1024) {//如果小于0.1MB转化成KB  
            data = (size / 1024).toFixed(2) + " KB";
        } else if (size < 0.1 * 1024 * 1024 * 1024) { //如果小于0.1GB转化成MB  
            data = (size / (1024 * 1024)).toFixed(2) + " MB";
        } else { //其他转化成GB  
            data = (size / (1024 * 1024 * 1024)).toFixed(2) + " GB";
        }
        var sizeText = data + "";
        var len = sizeText.indexOf("\.");
        var dec = sizeText.substr(len + 1, 2);
        if (dec == "00") {//当小数点后为00时 去掉小数部分  
            return sizeText.substring(0, len) + sizeText.substr(len + 3, 2);
        }
        return sizeText;
    },
    /**
     * @name: 密碼檢查函數
     * @param {*} pwd1
     * @param {*} pwd2
     * @return {*}
     */    
    checkPassword(pwd1, pwd2) {
        if (pwd1 != pwd2) return { flag: false, message: '兩次輸入的密碼不一致' };
        if (pwd1.length < 6 || pwd2.length < 6) return { flag: false, message: '密碼長度至少為6位' };
        return { flag: true, message: '驗證通過' };
    },
    /**
     * @name: 資料整潔函數，用於清空表單輸入等場景，默認返回所有值均為空值 
     * @param {*} data
     * @return {*}
     */    
    tidy(data) {
        for (let key in data) {
            data[key] = '';
        };
        return data;
    },
    /**
     * @name: 驗證郵箱位址是否輸入正確 
     * @param {*} mail
     * @return {*}
     */    
    checkMail(mail) {            
        let Regex = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/;
        // console.log(Regex.test(mail), '驗證電子郵件的結果是');
        if (!Regex.test(mail)) return { flag: false, message: '請輸入有效的電子郵件！' };  
        if (Regex.test(mail)) return { flag: true, message: '驗證通過' };
    },
    checkPhone(tel) {
        
        // 參考地址： https://www.jb51.net/article/238570.htm
        // let zwCNTelRegex = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;// 大陸手機號驗證規則
        // let zwCNPhoneRegex = /^(0\d{2,3})-?(\d{7,8})$/;// 大陸座機號碼驗證規則
        // let zwTWTelRegex = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;// 台灣手機號驗證規則
        // let zwTWPhoneRegex = /^(0\d{1,3})-?(\d{8})$/;// 台灣座機號碼驗證規則
        // let checkResult = zwCNTelRegex.test(tel) || zwCNPhoneRegex.test(tel) || zwTWTelRegex.test(tel) || zwTWPhoneRegex.test(tel);

        // 必须由 6-64位数字、特殊符号组成
        let checkResult = /^[A-Za-z]/.test(tel) || /[\u4e00-\u9fa5]/.test(tel);// 判断不能输入中文和英文
        if (checkResult) return { flag: false, message: '請輸入有效的手機號碼或座機號碼！' };  
        if (!checkResult) return { flag: true, message: '驗證通過' };

    },
    checkFax(fax) {
        let zwCNPhoneRegex = /^(0\d{2,3})-?(\d{7,8})$/;// 大陸座機號碼驗證規則
        let zwTWPhoneRegex = /^(0\d{1,3})-?(\d{8})$/;// 台灣座機號碼驗證規則

        let checkResult = zwCNPhoneRegex.test(fax) || zwTWPhoneRegex.test(fax);

        if (!checkResult) return { flag: false, message: '請輸入有效的傳真！' };  
        if (checkResult) return { flag: true, message: '驗證通過' };
    },
    /**
     * @name: 處理標籤，用於貼標籤處的展示
     * @param {*} tags  傳入的tags原始資料
     * @param {*} length 期望的結果的長度
     * @param {*} title 標題
     * @return {*}
     */    
    // handleTags(tags, title = null) {// 處理標籤，用於貼標籤處的展示
    //     let result = [];
    //     tags.forEach(item => {
    //         if (item.bizTagVoList && item.bizTagVoList.length) {
    //             handleTags(item.bizTagVoList, item.title);
    //         } else {
    //             if (title) title = `${title}/${item.title}`
    //             result.push({
    //                 id: item.id,
    //                 title: title ? `${title}/${item.title}` : item.title
    //             });
    //         }
    //     });
    // },
    parseTime(time, pattern) {
        if (arguments.length === 0 || !time) {
            return null
        }
        const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
        let date
        if (typeof time === 'object') {
            date = time
        } else {
            if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
                time = parseInt(time)
            } else if (typeof time === 'string') {
                time = time.replace(new RegExp(/-/gm), '/');
            }
            if ((typeof time === 'number') && (time.toString().length === 10)) {
                time = time * 1000
            }
            date = new Date(time)
        }
        const formatObj = {
            y: date.getFullYear(),
            m: date.getMonth() + 1,
            d: date.getDate(),
            h: date.getHours(),
            i: date.getMinutes(),
            s: date.getSeconds(),
            a: date.getDay()
        }
        const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
            let value = formatObj[key]
                // Note: getDay() returns 0 on Sunday
            if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
            if (result.length > 0 && value < 10) {
                value = '0' + value
            }
            return value || 0
        })
        return time_str
    },
    //深考贝
    deepCopy(obj) {
        var result = Array.isArray(obj) ? [] : {}
        for (var key in obj) {
            if (obj.hasOwnProperty.call(key)) {
            if (typeof obj[key] === "object" && obj[key] !== null) {
                result[key] = this.deepCopy(obj[key]) //递归复制
            } else {
                result[key] = obj[key]
            }
            } else {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                result[key] = this.deepCopy(obj[key]) //递归复制
            } else {
                result[key] = obj[key]
            }
            }
        }
        return result
    },
}

const install=function(Vue){
    if (install.installed) return // 如果已經註冊過了，就跳過
    install.installed = true
  
    Object.defineProperties(Vue.prototype, {
      $util: {
        get(){
          return Util;
        }
      }
    })
}
  
export const timeData =[
    { key: '12:00 AM'},
    { key: '12:15 AM'},
    { key: '12:30 AM'},
    { key: '12:45 AM'},
    { key: '1:00 AM'},
    { key: '1:15 AM'},
    { key: '1:30 AM'},
    { key: '1:45 AM'},
    { key: '2:00 AM'},
    { key: '2:15 AM'},
    { key: '2:30 AM'},
    { key: '2:45 AM'},
    { key: '3:00 AM'},
    { key: '3:15 AM'},
    { key: '3:30 AM'},
    { key: '3:45 AM'},
    { key: '4:00 AM'},
    { key: '4:15 AM'},
    { key: '4:30 AM'},
    { key: '4:45 AM'},
    { key: '5:00 AM'},
    { key: '5:15 AM'},
    { key: '5:30 AM'},
    { key: '5:45 AM'},
    { key: '6:00 AM'},
    { key: '6:15 AM'},
    { key: '6:30 AM'},
    { key: '6:45 AM'},
    { key: '7:00 AM'},
    { key: '7:15 AM'},
    { key: '7:30 AM'},
    { key: '7:45 AM'},
    { key: '8:00 AM'},
    { key: '8:15 AM'},
    { key: '8:30 AM'},
    { key: '8:45 AM'},
    { key: '9:00 AM'},
    { key: '9:15 AM'},
    { key: '9:30 AM'},
    { key: '9:45 AM'},
    { key: '10:00 AM'},
    { key: '10:15 AM'},
    { key: '10:30 AM'},
    { key: '10:45 AM'},
    { key: '11:00 AM'},
    { key: '11:15 AM'},
    { key: '11:30 AM'},
    { key: '11:45 AM'},
    { key: '12:00 PM'},
    { key: '12:15 PM'},
    { key: '12:30 PM'},
    { key: '12:45 PM'},
    { key: '1:00 PM'},
    { key: '1:15 PM'},
    { key: '1:30 PM'},
    { key: '1:45 PM'},
    { key: '2:00 PM'},
    { key: '2:15 PM'},
    { key: '2:30 PM'},
    { key: '2:45 PM'},
    { key: '3:00 PM'},
    { key: '3:15 PM'},
    { key: '3:30 PM'},
    { key: '3:45 PM'},
    { key: '4:00 PM'},
    { key: '4:15 PM'},
    { key: '4:30 PM'},
    { key: '4:45 PM'},
    { key: '5:00 PM'},
    { key: '5:15 PM'},
    { key: '5:30 PM'},
    { key: '5:45 PM'},
    { key: '6:00 PM'},
    { key: '6:15 PM'},
    { key: '6:30 PM'},
    { key: '6:45 PM'},
    { key: '7:00 PM'},
    { key: '7:15 PM'},
    { key: '7:30 PM'},
    { key: '7:45 PM'},
    { key: '8:00 PM'},
    { key: '8:15 PM'},
    { key: '8:30 PM'},
    { key: '8:45 PM'},
    { key: '9:00 PM'},
    { key: '9:15 PM'},
    { key: '9:30 PM'},
    { key: '9:45 PM'},
    { key: '10:00 PM'},
    { key: '10:15 PM'},
    { key: '10:30 PM'},
    { key: '10:45 PM'},
    { key: '11:00 PM'},
    { key: '11:15 PM'},
    { key: '11:30 PM'},
    { key: '11:45 PM'},
    ]
export default {
    install,
    ...Util
}