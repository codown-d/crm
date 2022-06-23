/*
 * @Descripttion: 这里存全局公共的接口，不属于任何一个模块，如： 上传、下载、字典查询等
 * @version: 
 * @Author: Lone
 * @Date: 2022-04-17 20:50:13
 * @LastEditors: Lone
 * @LastEditTime: 2022-04-17 20:54:21
 */
import Axios from '../utils/axios-util'

let BASE_PARAMS = {
	"caller": "crm-web",
	"requestId": "uuid",
	"traceId": "uuid"
};

export default {
	upload: (params) => {
	    return Axios.FILE_POST('api/filestorage/file/upload', params);
	},
	download: (params) => {
        return Axios.GET('api/filestorage/file/download/' + params.id);
    },
    queryDicByKey: (params) => {
        BASE_PARAMS.param = params;
        return Axios.POST('api/property/directory/queryDicByKey', BASE_PARAMS);
    }
}
