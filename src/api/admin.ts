import requestBase from './base';
import { pick } from 'lodash';

// request login
export async function login(data) {
    const response = await requestBase.post('/api/admin/login', data)
    return response
}

// request otp verify
export async function verifyOtp(data) {
    const response = await requestBase.post('/api/admin/verify_otp', data)
    return response
}

// request logout
export async function logout(adminLoginToken) {
    const response = await requestBase.post('/api/admin/logout', {}, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}

// request user list
export async function fetchUserList(adminLoginToken, queryParams) {
    const { page, page_size, keyword, role } = queryParams;

    // 构建请求的基础 URL
    let requestUrl = `/api/admin/user/page?page=${page}&page_size=${page_size}`;
    if (keyword) {
        requestUrl += `&keyword=${encodeURIComponent(keyword)}`;
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