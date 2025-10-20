import requestBase from './base';
import { pick } from 'lodash';
import { exactIdFromDisplay } from '@/utils/tool'

// request user list
export async function fetchUserList(adminLoginToken, queryParams) {
    const { page, page_size, id, role, email } = queryParams;

    // 构建请求的基础 URL
    let requestUrl = `/api/admin/user/page?page=${page}&page_size=${page_size}`;
    if (id) {
        requestUrl += `&id=${exactIdFromDisplay(id)}`;
	}
	if (email) {
        requestUrl += `&email=${email}`;
    }
    if (role) {
        requestUrl += `&role=${role}`;
    }
    const response = await requestBase.get(requestUrl, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}

// request update user
export async function updateUser(adminLoginToken, updateParams) {
    const needParams = pick(updateParams, [
        'id',
        'user_name',
        'real_name',
        'role',
        'status'
    ])

    const response = await requestBase.put('/api/admin/user', needParams, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}