import requestBase from './base';
import { pick } from 'lodash';
import { exactIdFromDisplay } from '@/utils/tool'

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

// request admin info
export async function getAdminInfo(adminLoginToken) {
    const response = await requestBase.get('/api/admin/info', {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}

// update admin info
export async function updateAdminInfo(adminLoginToken, data) {
    const response = await requestBase.put('/api/admin', data, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}

// create admin
export async function createAdmin(adminLoginToken, data) {
    const response = await requestBase.post('/api/admin', data, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}

// update other admin info
export async function updateOtherAdminInfo(adminLoginToken, data) {
    const response = await requestBase.put('/api/admin/other', data, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}

// regen secret
export async function regenSecret(adminLoginToken) {
    const response = await requestBase.post('/api/admin/secret/regen', {}, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}

// request admin list
export async function fetchAdminList(adminLoginToken, queryParams) {
    const { page, page_size, user_name, role } = queryParams;

    // 构建请求的基础 URL
    let requestUrl = `/api/admin/page?page=${page}&page_size=${page_size}`;
    if (user_name) {
        requestUrl += `&user_name=${user_name}`;
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

// request admin password
export async function getPasswordInfo(adminLoginToken, admin_id) {

    // 构建请求的基础 URL
    let requestUrl = `/api/admin/password?admin_id=${admin_id}`;

    const response = await requestBase.get(requestUrl, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}

// request update password
export async function updatePasswordInfo(adminLoginToken, updateParams) {
    const needParams = pick(updateParams, [
        'admin_id',
        'login_password',
        'two_factor_secret',
    ])

    const response = await requestBase.put('/api/admin/password', needParams, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}