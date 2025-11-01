import requestBase from './base';

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

// regen secret
export async function regenSecret(adminLoginToken) {
    const response = await requestBase.post('/api/admin/secret/regen', {}, {
        headers: {
            Authorization: `Bearer ${adminLoginToken}`,
        }
    })
    return response
}
