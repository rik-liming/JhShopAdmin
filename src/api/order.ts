import requestBase from './base';
import { pick } from 'lodash';
import { exactIdFromDisplay } from '@/utils/tool'

// request order
export async function getOrderByPage(adminLoginToken, queryParams) {
    const { 
        payment_method, 
        buy_user_id, 
        sell_user_id,
        display_order_id,
        page, 
        page_size, 
        type 
    } = queryParams;

    // 构建请求的基础 URL
    let requestUrl = `/api/admin/order/page?page=${page}&page_size=${page_size}&type=${type}`;

    if (payment_method) {
        requestUrl += `&payment_method=${payment_method}`;
    }
    if (buy_user_id) {
        requestUrl += `&buy_user_id=${exactIdFromDisplay(buy_user_id)}`;
    }
    if (sell_user_id) {
        requestUrl += `&sell_user_id=${exactIdFromDisplay(sell_user_id)}`;
    }
    if (display_order_id) {
        requestUrl += `&display_order_id=${display_order_id}`;
    }

    const response = await requestBase.get(requestUrl, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}

// request order judge
export async function orderJudge(adminLoginToken, param) {
    const needParams = pick(param, [
        'orderId',
        'status'
    ])

    // 构建请求的基础 URL
    let requestUrl = `/api/admin/order/judge`;

    const response = await requestBase.post(requestUrl, needParams, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}