import requestBase from './base';
import { pick } from 'lodash';
import { exactIdFromDisplay } from '@/utils/tool'

// request withdraw list
export async function fetchWithdrawList(adminLoginToken, queryParams) {
    const { page, page_size, user_id, display_withdraw_id } = queryParams;

    // 构建请求的基础 URL
    let requestUrl = `/api/admin/withdraw/page?page=${page}&page_size=${page_size}`;
    if (user_id) {
        requestUrl += `&user_id=${exactIdFromDisplay(user_id)}`;
    }
    if (display_withdraw_id) {
        requestUrl += `&display_withdraw_id=${display_withdraw_id}`;
    }
    const response = await requestBase.get(requestUrl, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}

// request update withdraw
export async function updateWithdraw(adminLoginToken, updateParams) {
    const needParams = pick(updateParams, [
        'id',
        'status'
    ])

    const response = await requestBase.put('/api/admin/withdraw', needParams, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}