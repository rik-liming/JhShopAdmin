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

export async function updateConfigInfo(adminLoginToken, formData) {
    const response = await requestBase.post('/api/admin/config', formData, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
            'Content-Type': 'multipart/form-data',
        }
    })
    return response
}
