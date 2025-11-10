import requestBase from './base';
import { pick } from 'lodash';
import { exactIdFromDisplay } from '@/utils/tool'

// request transfer list
export async function fetchTransferList(adminLoginToken, queryParams) {
    const { page, page_size, sender_user_id, receiver_user_id, display_transfer_id } = queryParams;

    // 构建请求的基础 URL
    let requestUrl = `/api/admin/transfer/page?page=${page}&page_size=${page_size}`;
    if (sender_user_id) {
        requestUrl += `&sender_user_id=${exactIdFromDisplay(sender_user_id)}`;
	}
	if (receiver_user_id) {
        requestUrl += `&receiver_user_id=${exactIdFromDisplay(receiver_user_id)}`;
    }
    if (display_transfer_id) {
        requestUrl += `&display_transfer_id=${display_transfer_id}`;
    }
    const response = await requestBase.get(requestUrl, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}

// request update transfer
export async function updateTransfer(adminLoginToken, updateParams) {
    const needParams = pick(updateParams, [
        'id',
        'status'
    ])

    const response = await requestBase.put('/api/admin/transfer', needParams, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}