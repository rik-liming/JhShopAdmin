import requestBase from './base';
import { pick } from 'lodash';

// request recharge list
export async function fetchRechargeList(adminLoginToken, queryParams) {
    const { page, page_size, keyword } = queryParams;

    // 构建请求的基础 URL
    let requestUrl = `/api/admin/recharge/page?page=${page}&page_size=${page_size}`;
    if (keyword) {
        requestUrl += `&keyword=${encodeURIComponent(keyword)}`;
    }
    const response = await requestBase.get(requestUrl, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}

// request update recharge
export async function updateRecharge(adminLoginToken, updateParams) {
    const needParams = pick(updateParams, [
        'id',
        'status'
    ])

    const response = await requestBase.put('/api/admin/recharge', needParams, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}