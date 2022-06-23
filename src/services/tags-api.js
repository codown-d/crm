/*
 * @Descripttion: 
 * @version: 
 * @Author: Cynthiar
 * @Date: 2021-11-17 11:56:56
 * @LastEditors: Lone
 * @LastEditTime: 2022-02-12 21:53:19
 */
import Axios from '../utils/axios-util'

let BASE_PARAMS = {
    "caller": "crm-web",
    "requestId": "uuid",
    "traceId": "uuid"
};

export default {
    queryList: params => {// 标签树上图标对应的接口
        // 文档地址: http://18.138.132.121:3000/project/11/interface/api/566
        BASE_PARAMS.param = params || {};
        return Axios.POST('api/property/bizType/queryList', BASE_PARAMS);
    },
    queryListByBizTypeCode: params => { // 查询对应标签树
        // 文档地址: http://18.138.132.121:3000/project/11/interface/api/551
        BASE_PARAMS.param = params;
        return Axios.POST('api/property/bizTag/queryListByBizTypeCode', BASE_PARAMS);
    },
    addBizTag: params => { //新增標籤
        // 文档地址: http://18.138.132.121:3000/project/11/interface/api/531
        BASE_PARAMS.param = params;
        return Axios.POST('api/property/bizTag/addBizTag', BASE_PARAMS);
    },
    updateBizTag: params => { //修改標籤
        // 文档地址: http://18.138.132.121:3000/project/11/interface/api/561
        BASE_PARAMS.param = params;
        return Axios.POST('api/property/bizTag/updateBizTag', BASE_PARAMS);
    },
    deleteBizTagByIds: params => { //刪除標籤
        // 文档地址: http://18.138.132.121:3000/project/11/interface/api/541
        BASE_PARAMS.param = params;
        return Axios.POST('api/property/bizTag/deleteBizTagByIds', BASE_PARAMS);
    },
    addBizTagsByTagNamesOrIds: params => {// 批量打标签
        // 文档地址: http://18.138.132.121:3000/project/11/interface/api/536
        BASE_PARAMS.param = params;
        return Axios.POST('api/property/bizTag/addBizTagsByTagNamesOrIds', BASE_PARAMS);
    },
    deleteBizTagsByTagNamesOrIds: params => {// 批量打标签
        // 文档地址: http://18.138.132.121:3000/project/11/interface/api/536
        BASE_PARAMS.param = params;
        return Axios.POST('api/property/bizTag/deleteBizTagsByTagNamesOrIds', BASE_PARAMS);
    },
    queryListByBizTypeCodeAndRelationBizId: params => {// 根据关联业务类型编号和关联业务主键查询标签集合
        // 文档地址: http://18.138.132.121:3000/project/11/interface/api/556
        BASE_PARAMS.param = params;
        return Axios.POST('api/property/bizTag/queryListByBizTypeCodeAndRelationBizId', BASE_PARAMS);
    }
}
