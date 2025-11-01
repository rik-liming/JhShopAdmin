import requestBase from './base';

// request config info
export async function getConfigInfo(adminLoginToken) {
    const response = await requestBase.get('/api/admin/config/info', {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}

// update config info
export async function updateConfigInfo(adminLoginToken, data) {
    const response = await requestBase.put('/api/admin/config', data, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}
