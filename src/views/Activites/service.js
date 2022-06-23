import { POST } from '../../utils/request'

export const queryActivityPageList = params => POST('api/customer/activity/queryActivityPageList', params)

