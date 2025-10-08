import request from '@/utils/request';

import axios from 'axios';

// request login
export async function login(data) {

    const axiosInstance = axios.create({
        baseURL: 'http://be.jhshop.kuntai-tech.com',
        timeout: 5000 // request timeout
    });

    const response = await axiosInstance.post('/api/admin/login', data)
    return response
}

// request otp verify
export async function verifyOtp(data) {

    const axiosInstance = axios.create({
        baseURL: 'http://be.jhshop.kuntai-tech.com',
        timeout: 5000 // request timeout
    });

    const response = await axiosInstance.post('/api/admin/verify_otp', data)
    return response
}

// request logout
export async function logout(loginToken) {

    const axiosInstance = axios.create({
        baseURL: 'http://be.jhshop.kuntai-tech.com',
        timeout: 5000 // request timeout
    });

    const response = await axiosInstance.post('/api/admin/logout', {}, {
        headers: {
            Authorization: `Bearer ${loginToken}`,
        }
    })
}