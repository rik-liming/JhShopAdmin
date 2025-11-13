import requestBase from './base';

// request role list
export async function getRoleList(adminLoginToken) {

    // 构建请求的基础 URL
    let requestUrl = `/api/admin/role/list`;
    const response = await requestBase.get(requestUrl, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}

// request role list by page
export async function getRoleByPage(adminLoginToken, queryParams) {

    const { page, page_size, role } = queryParams;

    // 构建请求的基础 URL
    let requestUrl = `/api/admin/role/page?page=${page}&page_size=${page_size}`;
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

export async function getRoleRules(adminLoginToken, role) {

    // 构建请求的基础 URL
    let requestUrl = `/api/admin/role/rules?role=${role}`;
    const response = await requestBase.get(requestUrl, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}

export async function updateRoleRules(adminLoginToken, data) {

    // 构建请求的基础 URL
    let requestUrl = `/api/admin/role/rules`;
    const response = await requestBase.post(requestUrl, data, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}

export async function getRoleRouterKeys(adminLoginToken) {

    // 构建请求的基础 URL
    let requestUrl = `/api/admin/role/router_keys`;
    const response = await requestBase.get(requestUrl, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}

// update role info
export async function updateOtherRole(adminLoginToken, data) {
    const response = await requestBase.put('/api/admin/role/other', data, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}

// create role
export async function createRole(adminLoginToken, data) {
    const response = await requestBase.post('/api/admin/role', data, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}