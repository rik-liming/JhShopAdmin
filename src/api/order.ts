import requestBase from './base';
import { pick } from 'lodash';

// request order listing
export async function getOrderListingByPage(adminLoginToken, queryParams) {
    const { payment_method, page, page_size } = queryParams;

    // 构建请求的基础 URL
    let requestUrl = `/api/admin/order_listing/page?page=${page}&page_size=${page_size}&payment_method=${payment_method}`;
    const response = await requestBase.get(requestUrl, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}

// request update order listing
export async function updateOrderListing(adminLoginToken, updateParams) {
    const needParams = pick(updateParams, [
        'id',
        'status'
    ])

    const response = await requestBase.put('/api/admin/order_listing', needParams, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}