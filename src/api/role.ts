import requestBase from './base';

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