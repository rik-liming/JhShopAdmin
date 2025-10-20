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
