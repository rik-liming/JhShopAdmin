import requestBase from './base';
import { pick } from 'lodash';
import { exactIdFromDisplay } from '@/utils/tool'

// request order
export async function getOrderByPage(adminLoginToken, queryParams) {
    const { payment_method, user_id, page, page_size, type } = queryParams;

    // 构建请求的基础 URL
    let requestUrl = `/api/admin/order/page?page=${page}&page_size=${page_size}&type=${type}`;

    if (payment_method) {
        requestUrl += `&payment_method=${payment_method}`;
    }
    if (user_id) {
        requestUrl += `&user_id=${exactIdFromDisplay(user_id)}`;
    }

    const response = await requestBase.get(requestUrl, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}